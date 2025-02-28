// 이벤트 버스 생성 (src/utils/eventBus.ts)
type Callback = (...args: any[]) => void;

class EventBus {
  private events: Record<string, Callback[]> = {};

  subscribe(event: string, callback: Callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);

    return () => {
      this.events[event] = this.events[event].filter((cb) => cb !== callback);
    };
  }

  publish(event: string, ...args: any[]) {
    if (this.events[event]) {
      this.events[event].forEach((callback) => callback(...args));
    }
  }
}

export default new EventBus();
