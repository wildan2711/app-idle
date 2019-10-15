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
    idle.start()

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
    idle.start()

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
    idle.start()

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
    idle.start()

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
    idle.start()

    setTimeout(() => {
      expect(idleCount).toEqual(2)
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
    idle.start()

    setTimeout(() => {
      expect(idleCount).toEqual(1)
      idle.stop()
      done()
    }, 2500)
  }, 10000)
})

test('dumb test, just to get 100% funcs coverage', (done) => {
  const idle = new AppIdle({
    timeout: 100
  })
  idle.start()

  setTimeout(() => {
    window.dispatchEvent(new Event('mousemove'))
    idle.stop()
    done()
  }, 500)
}, 10000)
