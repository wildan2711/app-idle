export interface Options {
    /** Timeout in milliseconds to mark if the user is idle. */
    timeout?: number;
    /** Callback called when the user has reached the idle timeout. */
    onIdle?: () => void;
    /** Callback called when the user becomes active after in an idle state. */
    onActive?: () => void;
    /** Callback called when an event cancels the idle state */
    onCancel?: (event: Event, idleLength: number) => void;
    /** Events that cancel the idle state */
    events?: (keyof WindowEventMap)[];
    /** Multiple tabs/windows option. Sets whether the idle state can be cancelled from multiple tabs/windows in one app.
     * Internally uses localStorage to manage events from different tabs/windows. */
    multi?: boolean;
    /** localStorage key used for notifying other tabs/windows */
    storageKey?: string;
}
declare class AppIdle {
    private options;
    private intervalId;
    private lastIdle;
    private idleState;
    constructor(options: Options);
    private eventHandler;
    private storageHandler;
    start(): void;
    stop(): void;
    private startTimer;
    private stopTimer;
    private restartTimer;
    private notifyActive;
    private notifyWindows;
}
export default AppIdle;
