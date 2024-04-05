
type MachineState = {
  target?: string;
  actions?: string | string[]
  guard?: string | string[];
  guardType?: "and" | "or" | "not"
}

type GuardProps<Context> = { context: Context, history: Ref<string[]>, state: Ref<string> }
export interface Machine<Context> {
  initial: string;
  loading: string;
  states: {
    [state: string]: {
      type?: string;
      meta?: Record<string, any>;
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


export const useMachine = <T extends Record<string, any>>(
  machine: Machine<T>,
  context: T
) => {
  let savedHistory = []
  let savedState
  if (typeof sessionStorage !== 'undefined') {
    savedHistory = JSON.parse(sessionStorage.getItem('machineHistory') || '[]')
    savedState = sessionStorage.getItem('currentState') || savedState
  } else {
    savedHistory = []
    savedState = machine.loading
  }
  const loading = ref(true)
  const history = ref<string[]>(savedHistory);
  const historyLength = ref<number>(history.value.length);
  const currentState = ref<string>(savedState || machine.initial);
  const transition = ref('forward')
  const subscriptions = ref<Record<string, ({ type, action, target }: { type: string; action?: string | string[]; target?: string }) => void>>({})

  watch(currentState, (newValue) => {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('currentState', newValue);
    }
  });
  watch(history, (newValue) => {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('machineHistory', JSON.stringify(newValue));
    }
    transition.value = newValue.length > historyLength.value ? 'forward' : 'back'
    historyLength.value = newValue.length;
  }, { deep: true });

  onMounted(() => {
    loading.value = false
  })
  const invoke = (action: string, target?: string) => {
    machine.actions[action]({ context, history, state: currentState, machine, target });
    Object.values(subscriptions.value).forEach(e => e?.(cleanObject({ type: 'action', action, target })))

  };

  const guardClause = (e: MachineState) => {
    const { guard, guardType } = e || {}
    if (!guard) return true
    const clause = (g: string) => machine.guards[g]?.({ context, history, state: currentState })
    if (Array.isArray(guard)) {
      if (guardType === 'or') return guard.some(clause)
      return guard.every(clause)
    }
  
    if (guardType === 'not') return !clause(guard)
    return clause(guard)
  }

  const getNext = (event: keyof NonNullable<Machine<T>['states'][string]['on']>) => {
    const nextState = machine.states[currentState.value].on?.[event];
    let nextTarget: string | undefined = undefined;
    let nextAction: string | string[] | undefined = undefined;
    if (nextState && 'target' in nextState && nextState.target) {
      if (guardClause(nextState)) nextTarget = nextState.target;
    } else if (Array.isArray(nextState)) {
      nextTarget =
        nextState.find(guardClause)?.target;
    }
    if (nextState && 'actions' in nextState && nextState.actions) {
      nextAction = nextState.actions;
    } else if (Array.isArray(nextState)) {
      const action = nextState.find(guardClause)?.actions
      if (action) nextAction = action
    }

    return { target: nextTarget, action: nextAction }
  }

  const can = (event: keyof NonNullable<Machine<T>['states'][string]['on']>) => {
    const { target } = getNext(event)
    return !!target
  }

  const send = (event: keyof NonNullable<Machine<T>['states'][string]['on']>) => {
    const { target, action } = getNext(event)

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
