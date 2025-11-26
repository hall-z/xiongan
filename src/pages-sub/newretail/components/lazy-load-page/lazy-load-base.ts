// lazy-load-base.ts - Vue 3 Composition API lazy loading utilities
import { ref, onMounted, onUnmounted } from 'vue'

export interface LazyLoadOptions {
  targetClass?: string
  relativeToBox?: string
  minHeight?: number
  rootMargin?: string
  threshold?: number | number[]
}

export function useLazyLoad(options: LazyLoadOptions = {}) {
  const {
    targetClass = '',
    relativeToBox = '',
    minHeight = 0,
    rootMargin = '0px',
    threshold = 0.1
  } = options

  const isVisible = ref(false)
  const isLoaded = ref(false)
  const intersectionObserver = ref<IntersectionObserver | null>(null)

  const observe = (element: Element) => {
    if (!element) return

    // 创建IntersectionObserver
    intersectionObserver.value = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisible.value = true
            // 可以在这里触发懒加载逻辑
            loadContent()
          }
        })
      },
      {
        rootMargin,
        threshold
      }
    )

    intersectionObserver.value.observe(element)
  }

  const loadContent = () => {
    if (isLoaded.value) return

    // 懒加载内容逻辑
    isLoaded.value = true

    // 清理观察器
    if (intersectionObserver.value) {
      intersectionObserver.value.disconnect()
      intersectionObserver.value = null
    }
  }

  const unobserve = () => {
    if (intersectionObserver.value) {
      intersectionObserver.value.disconnect()
      intersectionObserver.value = null
    }
  }

  onUnmounted(() => {
    unobserve()
  })

  return {
    isVisible: readonly(isVisible),
    isLoaded: readonly(isLoaded),
    observe,
    unobserve,
    loadContent
  }
}

// 兼容小程序API的懒加载函数
export const determineComponentInVisibleArea = (
  targetClass: string,
  that: any,
  relativeToBox?: string,
  minHeight?: number
): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      // 在Vue 3环境中，我们使用IntersectionObserver
      if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                // 检查最小高度要求
                if (!minHeight || entry.boundingClientRect.height > minHeight) {
                  resolve(entry)
                  observer.disconnect()
                } else {
                  resolve(null)
                }
              } else {
                resolve(null)
              }
            })
          },
          {
            rootMargin: '0px 0px -50px 0px', // 底部50px时触发
            threshold: 0.1
          }
        )

        // 观察目标元素
        const element = document.querySelector(targetClass)
        if (element) {
          observer.observe(element)
        } else {
          resolve(null)
        }
      } else {
        // Fallback for environments without IntersectionObserver
        // 使用scroll事件或其他方法
        resolve(null)
      }
    } catch (error) {
      reject(error)
    }
  })
}

export default {
  useLazyLoad,
  determineComponentInVisibleArea
}
