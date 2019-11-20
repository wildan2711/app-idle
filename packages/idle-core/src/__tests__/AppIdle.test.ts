import AppIdle from '../index'

describe('idle state', () => {
  test('should call onIdle after 1 second', (done) => {
    let idleState = false
    const idle = new AppIdle({
      timeout: 1000,
      onIdle: () => {
        idleState = true
      }
    })
    idle.reset().start()

    setTimeout(() => {
      expect(idleState).toBeTruthy()
      idle.stop()
      done()
    }, 1000)
  }, 10000)

  test('should call onActive after the idle state is cancelled by an event', (done) => {
    let idleState = false
    const idle = new AppIdle({
      timeout: 1000,
      onIdle: () => {
        idleState = true
      },
      onActive: () => {
        idleState = false
      }
    })
    idle.reset().start()

    setTimeout(() => {
      expect(idleState).toBeTruthy()
      window.dispatchEvent(new Event('mousemove'))
      expect(idleState).toBeFalsy()
      idle.stop()
      done()
    }, 1000)
  }, 10000)
})

describe('"multi" option', () => {
  test('when true, cancel the idle state on "storage" event', (done) => {
    const storageKey = 'AppIdle'
    let idleState = false
    const idle = new AppIdle({
      timeout: 1000,
      onIdle: () => {
        idleState = true
      },
      onActive: () => {
        idleState = false
      },
      storageKey
    })
    idle.reset().start()

    setTimeout(() => {
      expect(idleState).toBeTruthy()
      window.dispatchEvent(new StorageEvent('storage', { key: storageKey }))
      expect(idleState).toBeFalsy()
      idle.stop()
      done()
    }, 1000)
  }, 10000)

  test('when false, don\'t cancel idle state on "storage" event', (done) => {
    const storageKey = 'AppIdle'
    let idleState = false
    const idle = new AppIdle({
      timeout: 1000,
      onIdle: () => {
        idleState = true
      },
      onActive: () => {
        idleState = false
      },
      multi: false,
      storageKey
    })
    idle.reset().start()

    setTimeout(() => {
      expect(idleState).toBeTruthy()
      window.dispatchEvent(new StorageEvent('storage', { key: storageKey }))
      expect(idleState).toBeTruthy()
      idle.stop()
      done()
    }, 1000)
  }, 10000)
})

describe('"recurIdleCall" option', () => {
  test('when true, with 1s timeout, onIdle should be called twice after atleast 2.5s', (done) => {
    let idleCount = 0
    const idle = new AppIdle({
      timeout: 1000,
      onIdle: () => {
        idleCount++
      },
      recurIdleCall: true
    })
    idle.reset().start()

    setTimeout(() => {
      expect(idleCount).toBe(2)
      idle.stop()
      done()
    }, 2500)
  }, 10000)

  test('when false, with 1s timeout, onIdle should be called only once after atleast 2.5s', (done) => {
    let idleCount = 0
    const idle = new AppIdle({
      timeout: 1000,
      onIdle: () => {
        idleCount++
      }
    })
    idle.reset().start()

    setTimeout(() => {
      expect(idleCount).toBe(1)
      idle.stop()
      done()
    }, 2500)
  }, 10000)
})

describe('isIdle() method', () => {
  test('should return false immediately after start() is called', (done) => {
    const idle = new AppIdle({ timeout: 100 })
    idle.start()

    expect(idle.isIdle()).toBeFalsy()
    done()
  }, 10000)

  test('should return true after 100 ms timeout', (done) => {
    const idle = new AppIdle({ timeout: 100 })
    idle.start()

    setTimeout(() => {
      expect(idle.isIdle()).toBeTruthy()
      done()
    }, 100)
  }, 10000)
})

describe('getElapedTime() method', () => {
  test('should return atleast 200 after 200 ms timeout', (done) => {
    const idle = new AppIdle()
    idle.start()

    setTimeout(() => {
      expect(idle.getElapsedTime()).toBeGreaterThanOrEqual(200)
      done()
    }, 200)
  }, 10000)
})

describe('getRemainingTime() method', () => {
  test('should return atmost 29800 after 200 ms timeout', (done) => {
    const idle = new AppIdle()
    idle.start()

    setTimeout(() => {
      expect(idle.getRemainingTime()).toBeLessThanOrEqual(29800)
      done()
    }, 200)
  }, 10000)
})

describe('getLastActiveTime() method', () => {
  test('should always return the same value before any idle canceller event', (done) => {
    const idle = new AppIdle()
    idle.start()

    const lastIdle = idle.getLastActiveTime()
    setTimeout(() => {
      expect(idle.getLastActiveTime()).toBe(lastIdle)
      done()
    }, 200)
  }, 10000)

  test('should return the newest value after an idle canceller event', (done) => {
    const idle = new AppIdle()
    idle.start()

    const lastIdle = idle.getLastActiveTime()
    setTimeout(() => {
      window.dispatchEvent(new Event('mousemove'))
      expect(idle.getLastActiveTime()).not.toBe(lastIdle)
      done()
    }, 200)
  }, 10000)
})

test('dumb test, just to get 100% funcs coverage', (done) => {
  const idle = new AppIdle({
    timeout: 100
  })
  idle.reset().start()

  setTimeout(() => {
    window.dispatchEvent(new Event('mousemove'))
    idle.stop()
    done()
  }, 500)
}, 10000)
