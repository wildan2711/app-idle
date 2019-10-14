export interface Options {
  /** Timeout in milliseconds to mark if the user is idle. */
  timeout?: number
  /** Callback called when the user has reached the idle timeout. */
  onIdle?: () => void
  /** Callback called when the user becomes active after in an idle state. */
  onActive?: () => void
  /** Callback called when an event cancels the idle state */
  onCancel?: (event: Event, idleLength: number) => void
  /** Events that cancel the idle state */
  events?: (keyof WindowEventMap)[]
  /** Multiple tabs/windows option. Sets whether the idle state can be cancelled from multiple tabs/windows in one app.
   * Internally uses localStorage to manage events from different tabs/windows. */
  multi?: boolean
  /** localStorage key used for notifying other tabs/windows */
  storageKey?: string
}

class AppIdle {
  private options: Options = {
    timeout: 30000,
    onActive: () => {},
    onIdle: () => {},
    onCancel: () => {},
    events: ['mousemove', 'keydown', 'mousedown', 'touchstart'],
    multi: true,
    storageKey: 'AppIdle'
  }
  private intervalId: number
  private lastIdle: number
  private idleState: boolean

  constructor(options: Options) {
    this.options = Object.assign({}, this.options, options)
  }

  private eventHandler = (event: Event): void => {
    if (this.options.multi) {
      this.notifyWindows()
    }
    this.notifyActive(event)
  }

  private storageHandler = (event: StorageEvent): void => {
    if (event.key === this.options.storageKey) {
      this.notifyActive(event)
    }
  }

  public start(): void {
    this.options.events.forEach((event) => {
      window.addEventListener(event, this.eventHandler)
    })

    if (this.options.multi) {
      window.addEventListener('storage', this.storageHandler)
    }

    this.startTimer()
  }

  public stop(): void {
    this.options.events.forEach((event) => {
      window.removeEventListener(event, this.eventHandler)
    })

    if (this.options.multi) {
      window.removeEventListener('storage', this.storageHandler)
    }

    localStorage.removeItem(this.options.storageKey)

    this.stopTimer()
  }

  private startTimer(): void {
    this.lastIdle = Date.now()
    this.intervalId = window.setInterval(() => {
      this.idleState = true
      this.options.onIdle()
    }, this.options.timeout)
  }

  private stopTimer(): void {
    if (this.intervalId) {
      window.clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  private restartTimer(): void {
    this.stopTimer()
    this.startTimer()
  }

  private notifyActive(event: Event): void {
    if (this.idleState) {
      this.idleState = false
      this.options.onActive()
    }
    // calculate how long the user has been idle since last idle time
    const idleLength = Date.now() - this.lastIdle
    // pass idle length to callback
    this.options.onCancel(event, idleLength)

    this.restartTimer()
  }

  private notifyWindows(): void {
    localStorage.setItem(this.options.storageKey, Date.now().toString())
  }
}

export default AppIdle
