// Copyright (c) 2019 Wildan Maulana Syahidillah

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

export interface AppIdleOptions {
  /** Timeout in milliseconds to mark if the user is idle.
   * @default 30000
   */
  timeout?: number
  /** Callback called when the user has reached the idle timeout.
   * @default () => {}
   */
  onIdle?: () => void
  /** Callback called when the user becomes active after in an idle state.
   * @default () => {}
   */
  onActive?: () => void
  /**
   * Callback called when an event cancels the idle state
   * @param event the event that cancels the idle state
   * @param idleLength how long the user has been idle until the idle canceller event
   * @default () => {}
   */
  onCancel?: (event: Event, idleLength: number) => void
  /** Sets whether onIdle call should be recurred, i.e: setInterval vs setTimeout
   * @default false
   */
  recurIdleCall?: boolean
  /** Events that cancel the idle state
   * @default ['mousemove', 'keydown', 'mousedown', 'touchstart', 'wheel']
   */
  events?: (keyof HTMLElementEventMap)[]
  /** Multiple tabs/windows option. Sets whether the idle state can be cancelled from multiple tabs/windows in one app.
   * Internally uses localStorage to manage events from different tabs/windows.
   * @default true
   */
  multi?: boolean
  /** localStorage key used for notifying other tabs/windows
   * @default 'AppIdle'
   */
  storageKey?: string
  /** The DOM target to attach event listeners that cancel the idle state
   * @default window
   */
  eventTarget?: Node | Document | Window
}

const noop = (): void => {}

class AppIdle {
  private options: AppIdleOptions = {
    timeout: 30000,
    onActive: noop,
    onIdle: noop,
    onCancel: noop,
    recurIdleCall: false,
    events: ['mousemove', 'keydown', 'mousedown', 'touchstart', 'wheel'],
    multi: true,
    storageKey: 'AppIdle',
    eventTarget: window
  }
  private lastActive: number
  private idleState: boolean
  private clearTimer: () => void

  constructor(options: AppIdleOptions = {}) {
    this.options = Object.assign({}, this.options, options)
  }

  private eventHandler = (event: Event): void => {
    /* istanbul ignore else*/
    if (this.options.multi) {
      this.notifyWindows()
    }
    this.notifyActive(event)
  }

  private storageHandler = (event: StorageEvent): void => {
    /* istanbul ignore else*/
    if (event.key === this.options.storageKey) {
      this.notifyActive(event)
    }
  }

  /**
   * Starts the idle timer
   */
  public start(): AppIdle {
    this.options.events.forEach((event) => {
      this.options.eventTarget.addEventListener(event, this.eventHandler)
    })

    /* istanbul ignore else*/
    if (this.options.multi) {
      this.options.eventTarget.addEventListener('storage', this.storageHandler)
    }

    this.startTimer()
    return this
  }

  /**
   * Stops the idle timer
   */
  public stop(): AppIdle {
    this.options.events.forEach((event) => {
      this.options.eventTarget.removeEventListener(event, this.eventHandler)
    })

    /* istanbul ignore else*/
    if (this.options.multi) {
      this.options.eventTarget.removeEventListener(
        'storage',
        this.storageHandler
      )
    }

    localStorage.removeItem(this.options.storageKey)

    this.stopTimer()
    return this
  }

  /**
   * Resets the idle state and last active
   */
  public reset(): AppIdle {
    this.idleState = false
    this.lastActive = 0
    return this
  }

  /**
   * Returns whether or not the user is idle
   */
  public isIdle(): boolean {
    return this.idleState
  }

  /**
   * Returns how long the user has been idle
   */
  public getElapsedTime(): number {
    return Date.now() - this.lastActive
  }

  /**
   * Returns the remaining time until the user is deemed idle
   */
  public getRemainingTime(): number {
    return this.options.timeout - this.getElapsedTime()
  }

  /**
   * Returns the timestamp the user was last active
   */
  public getLastActiveTime(): number {
    return this.lastActive
  }

  private startTimer(): void {
    const timer = this.options.recurIdleCall
      ? {
          set: window.setInterval.bind(window),
          clear: window.clearInterval.bind(window)
        }
      : {
          set: window.setTimeout.bind(window),
          clear: window.clearTimeout.bind(window)
        }

    // save timer start, to calculate idle length
    this.lastActive = Date.now()
    const intervalId = timer.set(() => {
      this.idleState = true
      this.options.onIdle()
    }, this.options.timeout)
    this.clearTimer = (): void => timer.clear(intervalId)
  }

  private stopTimer(): void {
    /* istanbul ignore else*/
    if (this.clearTimer) {
      this.clearTimer()
    }
    this.clearTimer = null
  }

  private restartTimer(): void {
    this.stopTimer()
    this.startTimer()
  }

  private notifyActive(event: Event): void {
    /* istanbul ignore else*/
    if (this.idleState) {
      this.idleState = false
      this.options.onActive()
    }

    this.options.onCancel(event, this.getElapsedTime())

    this.restartTimer()
  }

  private notifyWindows(): void {
    localStorage.setItem(this.options.storageKey, Date.now().toString())
  }
}

export default AppIdle
