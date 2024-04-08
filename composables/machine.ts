
type MachineState = {
  target?: string;
  actions?: string
  guard?: string;
  guardType?: "not"
} | {
  target?: string
  actions?: string[]
  guard?: string[];
  guardType?: "and" | "or" | "xor"
}

type GuardProps<Context> = { context: Context, history: Ref<string[]>, state: Ref<string> }
export interface Machine<Context> {
  initial: string;
  loading: string;
  states: {
    [state: string]: {
      type?: string;
      meta?: Record<string, any>;
      init?: MachineState | MachineState[];
      on?: {
        [event: string]: MachineState | MachineState[];
      };
    };
  };
  guards: {
    [guard: string]: (props: GuardProps<Context>) => boolean;
  };
  actions: {
    [action: string]: (props: GuardProps<Context> & { machine: Machine<Context>, target?: string }) => void;
  };
};

const cleanObject = <T extends Record<string, any>>(obj: T): NonNullable<T> => JSON.parse(JSON.stringify(obj));


let savedHistory = []
let savedState
if (typeof localStorage !== 'undefined') {
  savedHistory = JSON.parse(localStorage.getItem('machineHistory') || '[]')
  savedState = localStorage.getItem('currentState') || savedState
}
const loading = ref(true)
const history = ref<string[]>(savedHistory);
const currentState = ref<string>(savedState || 'loading');
const subscriptions = ref<Record<string, ({ type, action, target }: { type: string; action?: string | string[]; target?: string }) => void>>({})
export const useMachine = <T extends Record<string, any>>(
  machine: Machine<T>,
  context: T
) => {
  const historyLength = ref<number>(history.value.length);
  const transition = ref('forward')

  const invoke = (action: string, target?: string) => {
    if (!machine.actions[action]) {
      console.error(`Action ${action} not found`)
      return
    }
    machine.actions[action]({ context, history, state: currentState, machine, target });
    Object.values(subscriptions.value).forEach(e => e?.(cleanObject({ type: 'action', action, target })))

  };

  const guardClause = (e: MachineState) => {
    const { guard, guardType } = e || {}
    if (!guard) return true
    const clause = (g: string) => machine.guards[g]?.({ context, history, state: currentState })
    if (Array.isArray(guard)) {
      if (guardType === 'or') return guard.some(clause)
      if (guardType === 'xor') return !guard.some(clause)
      return guard.every(clause)
    }

    if (guardType === 'not') return !clause(guard)
    return clause(guard)
  }

  const getNext = ({ event, state }: { event?: string; state?: MachineState | MachineState[] }) => {
    const nextState = event ? machine.states[currentState.value].on?.[event] : state;
    if (!nextState) return { target: undefined, action: undefined }
    let nextTarget: string | undefined = undefined;
    let nextAction: string | string[] | undefined = undefined;
    if (nextState && 'target' in nextState && nextState.target) {
      if (guardClause(nextState)) nextTarget = nextState.target;
    } else if (Array.isArray(nextState)) {
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
    const { target } = getNext({ event })
    return !!target
  }

  const send = (event: string) => {
    const { target, action } = getNext({ event })

    if (action) {
      if (Array.isArray(action)) action.forEach(e => invoke(e))
      else invoke(action)
    }
    if (target) {
      history.value.push(currentState.value);
      currentState.value = target;
    }
    Object.values(subscriptions.value).forEach(e => e?.(cleanObject({ type: 'event', action, event, target })))
  };

  const subscribe = (callback: (state: string) => void) => {
    const id = uuid()
    Object.assign(subscriptions.value, {
      id: callback
    })
    return id
  }

  watch(currentState, (newValue) => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('currentState', newValue);
    }

    const { init } = machine.states[newValue]
    if (init) {
      const { action } = getNext({ state: init })
      if (action) {
        console.log('init', action)
        if (Array.isArray(action)) action.forEach(e => invoke(e))
        else invoke(action)
      }
    }
  }, { immediate: true });
  watch(history, (newValue) => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('machineHistory', JSON.stringify(newValue));
    }
    transition.value = newValue.length > historyLength.value ? 'forward' : 'back'
    historyLength.value = newValue.length;
  }, { deep: true });

  onMounted(() => {
    loading.value = false
  })

  return {
    state: computed(() => ({
      matches: (state: string) => {
        return currentState.value === state ? state : false
      },
      value: currentState.value,
      initial: machine.initial,
      can
    })),
    history,
    invoke,
    send,
    transition,
    subscribe,
    loading,
  };
};
