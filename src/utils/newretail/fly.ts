import utils from './utils'

// 获取应用实例
const app = getApp()

// 获取手机系统信息
const systemInfo = app ? app.globalData?.systemInfo : {}
// 导航数量
let tabbarNum = 0
// 购物车的坐标点
let busPos: { x: number; y: number } = { x: 0, y: 0 }

const animation = uni.createAnimation({
  duration: 1000,
})

interface Point {
  x: number
  y: number
}

interface AnimationData {
  animation: any
  duration: number
  finger?: Point
}

interface BezierPoint extends Point {
  step?: number
}

/**
 * 获取购物车的坐标点
 * @param direction 点击点方位 left  right
 */
function getShopCartCoordinate(direction: string = 'left'): Point {
  tabbarNum = app.globalData.tabBar.list.length
  if (tabbarNum > 0) {
    // tabbar 不为空
    let index = 0
    app.globalData.tabBar.list.forEach((item: any, i: number) => {
      if (item.pagePath === '/pages-sub/newretail/pages/mallModule/tabbar/shopcart/shopcart') {
        // 当前项为购物车
        index = i
      }
    })
    
    let busPos: Point = { x: 0, y: 0 }
    busPos.x = systemInfo.windowWidth - (systemInfo.windowWidth / tabbarNum) * (tabbarNum - index)
    busPos.y = systemInfo.windowHeight - (98 / 750) * systemInfo.windowWidth
    
    if (direction === 'right') {
      busPos.x = systemInfo.windowWidth - (systemInfo.windowWidth / tabbarNum) * (tabbarNum - index - 1)
    }
    return busPos
  }
  return { x: 0, y: 0 }
}

const FLY = {
  /**
   * 触摸商品触发动画
   * @param addtype 常规商品还是三分图 normal three
   * @param touches 触摸点的坐标
   * @param productId 商品ID
   * @param goodType 商品类型
   */
  touchOnGoods: function (addtype: string, touches: any, productId: string, goodType?: string): Promise<AnimationData> {
    const self = this
    let finger: Point = { x: 0, y: 0 }
    let direction = 'left'
    busPos = getShopCartCoordinate(direction)
    // 获取购物车右侧坐标
    let busPosRight = getShopCartCoordinate('right')
    
    if (goodType === 'secondkill') {
      busPos.x = (60 / 750) * systemInfo.windowWidth
      busPos.y = systemInfo.windowHeight - (120 / 750) * systemInfo.windowWidth
      busPosRight.x = (120 / 750) * systemInfo.windowWidth
      busPosRight.y = systemInfo.windowHeight - (120 / 750) * systemInfo.windowWidth
    } else if (goodType != null) {
      busPos.x = (180 / 750) * systemInfo.windowWidth
      busPos.y = systemInfo.windowHeight - (120 / 750) * systemInfo.windowWidth
      busPosRight.x = (240 / 750) * systemInfo.windowWidth
      busPosRight.y = systemInfo.windowHeight - (120 / 750) * systemInfo.windowWidth
    }

    return new Promise(function (resolve, reject) {
      // 检查API兼容性
      try {
        const query = uni.createSelectorQuery()
        query.select('#products-' + productId).boundingClientRect()
        query.selectViewport().scrollOffset()
        query.exec(function (res: any) {
          if (res && res[0]) {
            console.log(res)
            finger.x = res[0].left
            finger.y = res[0].top
            let animationData = touchGoods(finger)
            resolve(animationData)
          } else {
            let animationData = touchGoods(finger)
            resolve(animationData)
          }
        })
      } catch (error) {
        let animationData = touchGoods(finger)
        resolve(animationData)
      }
    })

    function touchGoods(finger: Point): AnimationData {
      let rightTop = busPosRight.x
      if (finger.x !== 0 || finger.y !== 0) {
        if (finger.x > rightTop) {
          direction = 'right'
        }
      } else {
        if (addtype === "normal") {
          // 首页精选(常规商品列表)
          finger.x = 20
          finger.y = touches.clientY - (190 / 750) * systemInfo.windowWidth
        } else if (addtype === 'three') {
          // 三分图商品，判断点击点和底部购物车的位置
          finger.x = touches.clientX - (190 / 750) * systemInfo.windowWidth
          finger.y = touches.clientY - (380 / 750) * systemInfo.windowWidth
          if (finger.x < rightTop) {
            // 图片左起点在购物车左侧
          } else {
            // 图片左起点在购物车右侧
            finger.x = touches.clientX - (210 / 750) * systemInfo.windowWidth
            finger.y = touches.clientY - (380 / 750) * systemInfo.windowWidth
            direction = 'right'
          }
        } else if (addtype === 'detail') {
          // 商品详情默认左上角
          finger.x = 0
          finger.y = 0
        } else {
          // 首页精选(常规商品列表)
          finger.x = 20
          finger.y = touches.clientY - (190 / 750) * systemInfo.windowWidth
        }
      }

      let topPoint: Point = { x: 0, y: 0 }
      let newFinger: Point = { ...finger }

      // 控制点的y的值定在低的点的下方150处
      if (newFinger.y < busPos.y) {
        topPoint.y = newFinger.y + (150 / 750) * systemInfo.windowWidth
      } else {
        topPoint.y = busPos.y + (150 / 750) * systemInfo.windowWidth
      }

      // 控制点确保x在点击点和购物车之间
      topPoint.x = Math.abs(newFinger.x - busPos.x) / 2
      if (newFinger.x > busPos.x) {
        topPoint.x = (newFinger.x - busPos.x) / 2 + busPos.x
      } else {
        topPoint.x = (busPos.x - newFinger.x) / 2 + newFinger.x
      }

      let linePos: any
      if (direction === 'left') {
        linePos = utils.bezier([newFinger, topPoint, busPos], 30)
      } else {
        linePos = utils.bezier([busPos, topPoint, newFinger], 30)
      }

      let animation = self.startAnimation(direction, linePos, goodType)
      animation = {
        ...animation,
        finger: finger
      }
      return animation
    }
  },

  /**
   * 开始动画
   * 返回动画及动画持续时间
   * @param direction 点击位置
   * @param linePos 贝塞尔曲线点
   * @param goodType 商品类型
   */
  startAnimation: function (direction: string, linePos: any, goodType?: string): AnimationData {
    const bezier_points: BezierPoint[] = linePos['bezier_points']
    const len = bezier_points.length
    const duration = 18
    const time = duration * len
    const anim = uni.createAnimation({ duration: 1000 })

    if (goodType != null) {
      for (let i = 0; i < bezier_points.length; i++) {
        anim.left(bezier_points[i].x)
          .top(bezier_points[i].y)
          .width(systemInfo.windowWidth * (1 - 0.03 * i))
          .height(systemInfo.windowWidth * (1 - 0.03 * i))
          .step({ duration: duration })
        
        if (i === bezier_points.length - 1) {
          anim.left(bezier_points[i].x)
            .top(bezier_points[i].y)
            .width(0)
            .height(0)
            .step({ duration: 0 })
        }
      }
    } else {
      if (direction === 'left') {
        for (let i = 0; i < bezier_points.length; i++) {
          anim.left(bezier_points[i].x)
            .top(bezier_points[i].y)
            .scale(1 - 0.03 * i)
            .step({ duration: duration })
        }
      } else {
        for (let i = len - 1; i > 0; i--) {
          anim.left(bezier_points[i].x)
            .top(bezier_points[i].y)
            .scale(0.03 * i)
            .step({ duration: duration })
        }
      }
    }

    let animationData: AnimationData = {
      animation: anim.export(),
      duration: time
    }
    return animationData
  }
}

export default FLY