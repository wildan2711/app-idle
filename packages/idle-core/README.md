# AppIdle

Javascript/Typescript library for web applications to detect when a user is idle on your app (including multiple tabs/windows).

## Installation

```
npm install @app-idle/core
// or
yarn add @app-idle/core
```

## Usage

```js
import AppIdle from '@app-idle/core'

// Below are the default values for all available options
const idle = new AppIdle({
    timeout: 30000, // timeout in milliseconds to mark if the user is idle.
    onActive: () => {}, // callback called when the user has reached the idle timeout.
    onIdle: () => {}, // callback called when the user becomes active after in an idle state.
    onCancel: () => {}, // callback called when an event cancels the idle state
    recurIdleCall: false, // sets whether onIdle call should be recurred
    events: ['mousemove', 'keydown', 'mousedown', 'touchstart', 'wheel'], // events that cancel the idle state
    multi: true, // sets whether the idle state can be cancelled from multiple tabs/windows in one app.
    storageKey: 'AppIdle', // localStorage key used for notifying other tabs/windows
    eventTarget: window // the DOM target to attach event listeners that cancel the idle state
})

// start the idle timer
idle.start()
// stop the idle timer
idle.stop()
// resets the idle state
idle.reset()
```

## Documentation

The full documentation is available [here](https://app-idle.wildan.id).