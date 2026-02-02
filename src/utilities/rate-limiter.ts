export function rateLimiter(fn: CallableFunction, msDelay: number): CallableFunction {
  let lastCall = 0
  let elapsed = 0

  return (...args: any[]) => {
    const now = Date.now()
    const diff = now - lastCall
    elapsed += diff

    if (elapsed >= msDelay) {
      lastCall = now
      elapsed = elapsed % msDelay
      // This doesn't seem good, should use .apply()? But CallableFunction doesn't like that
      fn(...args)
    }
  }
}