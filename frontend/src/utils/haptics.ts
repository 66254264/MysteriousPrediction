/**
 * Provides haptic feedback on supported devices
 */

export const haptics = {
  /**
   * Light impact feedback (e.g., for button taps)
   */
  light: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10)
    }
  },

  /**
   * Medium impact feedback (e.g., for selections)
   */
  medium: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(20)
    }
  },

  /**
   * Heavy impact feedback (e.g., for important actions)
   */
  heavy: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(30)
    }
  },

  /**
   * Success feedback pattern
   */
  success: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([10, 50, 10])
    }
  },

  /**
   * Error feedback pattern
   */
  error: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([20, 100, 20, 100, 20])
    }
  },

  /**
   * Selection changed feedback
   */
  selection: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(5)
    }
  }
}
