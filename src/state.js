export const DEFAULT_STATE = {
  step: "profile",
  profile: null,
  loading: false,
  error: null,
  permissions: {
    motion: "unknown",
    camera: "unknown",
    microphone: "unknown",
    geolocation: "unknown"
  },
  measurement: {
    slopePercent: null,
    slopeDegree: null,
    status: null
  }
};

export function createStore(initialState = DEFAULT_STATE) {
  let state = structuredClone(initialState);
  const listeners = new Set();

  const getState = () => state;

  const setState = (partial) => {
    state = { ...state, ...partial };
    listeners.forEach((listener) => listener(state));
  };

  const updateNested = (key, partial) => {
    state = {
      ...state,
      [key]: {
        ...state[key],
        ...partial
      }
    };
    listeners.forEach((listener) => listener(state));
  };

  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  return { getState, setState, updateNested, subscribe };
}
