type Listener = (val: boolean) => void;

class DebugStore {
  private static instance: DebugStore;
  private value: boolean;
  private listeners = new Set<Listener>();

  private constructor(initial: boolean) {
    const saved = sessionStorage.getItem("debug-mode");
    this.value = saved ? JSON.parse(saved) : initial;
  }

  static init(initial = false) {
    if (!DebugStore.instance) {
      DebugStore.instance = new DebugStore(initial);
    }
    return DebugStore.instance;
  }

  static getInstance(): DebugStore {
    if (!DebugStore.instance) {
      throw new Error("DebugStore not initialized");
    }
    return DebugStore.instance;
  }

  get() {
    return this.value;
  }

  toggle() {
    this.value = !this.value;
    sessionStorage.setItem("debug-mode", JSON.stringify(this.value));
    this.listeners.forEach(cb => cb(this.value));
  }

  subscribe(fn: Listener) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }
}

export default DebugStore;
