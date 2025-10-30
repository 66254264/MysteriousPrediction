// Preload critical resources for better performance

export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = reject
    img.src = src
  })
}

export const preloadImages = async (srcs: string[]): Promise<void> => {
  await Promise.all(srcs.map(src => preloadImage(src)))
}

// Preload route component
export const preloadRoute = (routePath: string): void => {
  const routeMap: Record<string, () => Promise<any>> = {
    '/login': () => import('../pages/LoginPage'),
    '/register': () => import('../pages/RegisterPage'),
    '/profile': () => import('../pages/ProfilePage'),
    '/divination/tarot': () => import('../pages/TarotPage'),
    '/divination/astrology': () => import('../pages/AstrologyPage'),
    '/divination/bazi': () => import('../pages/BaziPage'),
    '/divination/yijing': () => import('../pages/YijingPage'),
    '/result': () => import('../pages/ResultPage'),
  }

  const loader = routeMap[routePath]
  if (loader) {
    loader().catch(() => {
      // Silently fail - route will load on demand
    })
  }
}

// Preload critical routes on idle
export const preloadCriticalRoutes = (): void => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      preloadRoute('/login')
      preloadRoute('/register')
    })
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(() => {
      preloadRoute('/login')
      preloadRoute('/register')
    }, 1000)
  }
}
