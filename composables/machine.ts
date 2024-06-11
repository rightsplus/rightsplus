import { useLocalStorage } from '@vueuse/core'
type MachineState<States> = {
  target?: States;
  actions?: string
  guard?: string;
  guardType?: "not";
  event?: string;
} | {
  target?: States
  actions?: string[]
  guard?: string[];
  guardType?: "and" | "or" | "xor";
  event?: string;
}
export type Methods<Context, States extends string> = { [state in States]: (context: Context) => Promise<void> }

type GuardProps<Context, States extends string> = {
  context: Context;
  methods: Methods<Context, States>
  states: Ref<States[]>;
  messages: Ref<Record<string, string>>;
  event?: string;
}
type Transitions = 'forward' | 'back'
export interface Machine<States extends string, Context> {
  id: string;
  persist?: boolean;
  initial: States;
  loading: string;
  states: Record<States, {
    type?: string;
    meta?: Record<string, any>;
    init?: MachineState<States> | MachineState<States>[];
    on?: {
      [event: string]: MachineState<States> | MachineState<States>[];
    };
  }>
  guards: {
    [guard: string]: (props: GuardProps<Context, States>) => boolean;
  };
  actions: {
    [action: string]: (props: GuardProps<Context, States> & { machine: Machine<States, Context>, target?: States, transition: Ref<Transitions> }) => void;
  };
};

const cleanObject = <T extends Record<string, any>>(obj: T): NonNullable<T> => JSON.parse(JSON.stringify(obj));


const loading = ref(true)



export const useMachine = <States extends string, T extends Record<string, any>>(machine: Machine<States, T>, options?: {
  context?: T | undefined;
  initial?: States;
  methods?: Methods<T>
}) => {

  type SubscriptionProps = { type: string; action?: string | string[]; event?: string; target?: States, origin?: States }
  type Subscriptions = {
    [id: string]: (props: SubscriptionProps) => void
  }
  const context = options?.context || {} as T
  const initial = options?.initial || machine.initial
  const methods = options?.methods || {}
  const messages = ref<Record<string, string>>({})

  // const ls = typeof localStorage !== 'undefined'
  const subscriptions = machine.persist ? useLocalStorage<Subscriptions>(`${machine.id}-subs`, {}) : ref<Subscriptions>({}) as Ref<Subscriptions>
  const states = machine.persist ? useLocalStorage<States[]>(`${machine.id}-states`, []) : ref<States[]>([]) as Ref<States[]>
  // const states = ref<States[]>([])
  const history = machine.persist ? useLocalStorage<States[]>(`${machine.id}-history`, []) : ref<States[]>([]) as Ref<States[]>
  const transition = machine.persist ? useLocalStorage<'forward' | 'back'>(`${machine.id}-transition`, 'forward') : ref<Transitions>('forward') as Ref<Transitions>
  const invocation = ref<string | undefined>(undefined)

  const current = computed(() => states.value.at(-1) || initial)

  const invoke = (action: string, target?: States) => {
    if (!machine.actions[action]) {
      console.error(`Action ${action} not found`)
      return
    }
    const origin = current.value
    machine.actions[action]({ context, methods, states, machine, target, messages, transition });
    invocation.value = action
    Object.values(subscriptions.value).forEach(e => {
      if (!e || typeof e !== 'function') return
      e(cleanObject({ type: 'action', action, target, origin }))
    })

  };

  const guardClause = (e: MachineState<States>) => {
    const { guard, guardType, event } = e || {}
    if (!guard) return true
    const clause = (g: string) => {
      const res = machine.guards[g]?.({ context, methods, states, messages, event })
      if (res) delete messages.value[g]
      return res
    }
    if (Array.isArray(guard)) {
      if (guardType === 'or') return guard.some(clause)
      if (guardType === 'xor') return !guard.some(clause)
      return guard.every(clause)
    }

    if (guardType === 'not') return !clause(guard)

    return clause(guard)
  }

  const getNext = ({ event, state }: { event?: string; state?: MachineState<States> | MachineState<States>[] }) => {
    const nextState = event ? machine.states[current.value].on?.[event] : state;
    if (!nextState) return { target: undefined, action: undefined }
    let nextTarget: States | undefined = undefined;
    let nextAction: string | string[] | undefined = undefined;
    if (nextState && 'target' in nextState && nextState.target) {
      if (event) nextState.event = event
      if (guardClause(nextState)) nextTarget = nextState.target;
    } else if (Array.isArray(nextState)) {
      if (event) nextState.forEach(e => e.event = event)
      nextTarget =
        nextState.find(guardClause)?.target;
    }
    if (nextState && 'actions' in nextState && nextState.actions) {
      if (guardClause(nextState)) nextAction = nextState.actions;
    } else if (Array.isArray(nextState)) {
      const action = nextState.find(guardClause)?.actions
      if (action) nextAction = action
    }

    return { target: nextTarget, action: nextAction }
  }

  const can = (event: string) => {
    const { target, action } = getNext({ event })
    return target || action
  }
  watch(transition, (newValue) => {
    console.log('transition', newValue)
  })

  const send = (event: string) => {
    const origin = current.value
    transition.value = 'forward'
    const { target, action } = getNext({ event })

    if (action) {
      if (Array.isArray(action)) action.forEach(e => invoke(e))
      else invoke(action)
    }
    if (target) {
      states.value?.push(target);
    }
    Object.values(subscriptions.value).forEach(e => {
      if (!e || typeof e !== 'function') return
      e(cleanObject({ type: 'event', action, event, target, origin }))
    })
  };

  const subscribe = (callback: (state: SubscriptionProps) => void) => {
    const id = uuid()
    Object.assign(subscriptions.value, {
      id: callback
    })
    return id
  }

  watch(current, (newValue) => {
    const { init } = machine.states[newValue] || {}
    if (init) {
      const { action } = getNext({ state: init })
      if (action) {
        console.log('init', action)
        if (Array.isArray(action)) action.forEach(e => invoke(e))
        else invoke(action)
      }
    }
  }, { immediate: true });

  watch(states, () => {
    if (history.value.length === states.value.length) return
    history.value = states.value
  }, { deep: true });

  onMounted(() => {
    loading.value = false
  })

  return {
    state: computed(() => ({
      matches: (state: States) => current.value === state ? state : false,
      value: current.value,
      initial: machine.initial,
      can,
      events: Object.keys(machine.states[current.value].on || {}),
    })),
    states,
    invoke,
    invocation,
    send,
    history,
    transition,
    subscribe,
    loading,
    messages
  };
};
