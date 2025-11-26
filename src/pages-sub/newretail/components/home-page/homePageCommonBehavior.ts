// homePageCommonBehavior.ts - Vue 3 Composition API version
import { ref, reactive } from 'vue'
import storeService from '@/service/api/newretail/storeService'
import productService from '@/service/api/newretail/productService'
import bannerService from '@/service/api/newretail/bannerService'
import shopcartService from '@/service/api/newretail/shopcartService'
import memberService from '@/service/api/newretail/memberService'
import searchService from '@/service/api/newretail/searchService'
import wxaUserService from '@/service/api/newretail/wxaUserService'
import couponService from '@/service/api/newretail/couponService'
import raffleService from '@/service/api/newretail/raffleService'
import seckillService from '@/service/api/newretail/seckillService'
import helpActivityService from '@/service/api/newretail/helpActivityService'
import systemService from '@/service/api/newretail/systemService'
import bargainService from '@/service/api/newretail/bargainService'
import orderService from '@/service/api/newretail/orderService'
import auth from '@/utils/newretail/auth'
import UTILS from '@/utils/newretail/utils'
import NAVPAGE from '@/utils/newretail/navPage'
import FLY from '@/utils/newretail/fly'
import IMGAGESPATH from '@/utils/newretail/imagesPath'
import request from '@/service/api/newretail/request'
import mta from '@/libs/mta_analysis'
import ANALYSIS from '@/utils/newretail/analysis'
import themeManager from '@/utils/newretail/themeManager'

// 转换为Vue 3 Composition API composable
export function useHomePageCommonBehavior() {
  // 响应式数据
  const state = reactive({
    initialpurchasenumber: 1,
    imagesPath: IMGAGESPATH,
    userInfo: {},
    member: {},
    couponNum: "0",
    reserveBalance: "0",
    scoreBalance: '0',
    giftcardNum: '0',
    memberEntrance: {
      isShowScore: false,
      isShowCoupon: false,
      isShowGiftCard: false,
      isShowReserve: false
    },
    themeColor: '',
    theme: null,
    canAddToCart: true
  })

  // 基本方法
  const getUserInfo = async () => {
    // 用户信息获取逻辑
    try {
      const res = await memberService.getMemberInfo()
      if (res.code === 0) {
        state.userInfo = res.data
        state.member = res.data.member || {}
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
    }
  }

  const getMemberEntrance = () => {
    // 会员入口逻辑
    // 这里可以根据实际需求实现
  }

  const addToCart = async (goods: any) => {
    // 添加购物车逻辑
    if (!state.canAddToCart) return

    state.canAddToCart = false
    try {
      const params = {
        productId: goods.id || goods.productId,
        num: goods.num || 1,
        style: goods.style || '',
        balance: goods.balance || 0,
        initialPurchaseNumber: goods.initialPurchaseNumber || 1
      }

      const res = await shopcartService.addToCart(params)
      if (res.code === 0) {
        // 成功提示
        console.log('添加购物车成功')
      }
    } catch (error) {
      console.error('添加购物车失败:', error)
    } finally {
      state.canAddToCart = true
    }
  }

  return {
    state,
    getUserInfo,
    getMemberEntrance,
    addToCart
  }
}

export default useHomePageCommonBehavior
