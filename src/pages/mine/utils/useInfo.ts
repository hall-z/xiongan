import { useRequest } from 'alova/client'
import type {
  ICheckBankPromoterByUserIdData,
  integralProps,
  IPromoterSwitchUserIdData,
  myInfoProps,
  MyOrderProps,
  serveListProps,
  serveProps,
  shopOrederProps,
} from '../utils/types'

import { getIsReceiveCardInfo } from '@/service/api/cardServe'
import {
  findmyInfo,
  findXcxScoreUser,
  getUserCouponList,
  getUserLoginInfo,
  userHasMerchantAuth,
} from '@/service/api/userMessage'
import linquan from '@/static/images/mine/linquan.png'
import shezhi from '@/static/images/mine/shezhi.png'
import spsc from '@/static/images/mine/spsc.png'

import jfscl from '@/static/images/mine/jfscl.png'
import smrz from '@/static/images/mine/smrz.png'
import tgzx from '@/static/images/mine/tgzx.png'
import jgtg from '@/static/images/mine/jgtg.png'
import tsjy from '@/static/images/mine/tsjy.png'
import wdkb from '@/static/images/mine/wdkb.png'
import wdsbk from '@/static/images/mine/wdsbk.png'
import xxtz from '@/static/images/mine/xxtz.png'
import { routeTo, sceneResult } from '@/utils'

import { getBusinessInfo, getOrderStatistics } from '@/service/api/shop'
import daifahuo1 from '../../../static/images/mine/daifahuo1.jpg'
import dafukuan1 from '../../../static/images/mine/daifukuan1.jpg'
import daishouhuo1 from '../../../static/images/mine/daishouhuo1.jpg'
import shouhou1 from '../../../static/images/mine/shouhoudd1.jpg'
import yiwancheng1 from '../../../static/images/mine/yiwancheng1.jpg'

import {
  checkBankPromoterByUserId,
  getPromoterSwitch,
  checkPromoterOrgUser,
} from '@/service/api/system'
import level1 from '@/static/images/mine/level1.png'
import level2 from '@/static/images/mine/level2.png'
import level3 from '@/static/images/mine/level3.png'
import level4 from '@/static/images/mine/level4.png'
import level5 from '@/static/images/mine/level5.png'
import saoyisao from '@/static/images/mine/saoyisao.png'
import { useScancode } from '@/utils/uniapi'
import { useUserStore } from '@/store'
import { getHistoryCount } from '@/service/api/source'
const { userInfo } = useUserStore()
export default () => {
  // 查询user列表
  const { send: sendUserCouponList, loading: listLoading2 } = useRequest(
    (data) => getUserCouponList(data),
    {
      immediate: false,
      loading: false,
    },
  )

  const topList = ref<serveProps[]>([
    {
      title: '积分',
      value: 0,
      path: '/pages-sub/marketManager/integral/interList',
      islink: true,
      props: 'pointsNum',
    },
    // #ifndef MP-ALIPAY
    {
      title: '优惠券',
      value: 0,
      path: '/pages-sub/marketManager/coupon/mycoupon',
      islink: true,
      props: 'couponNum',
    },
    // #endif
    // {
    //   title: '钱包',
    //   value: 0,
    //   path: '',
    //   islink: false,
    //   props: 'pocketNum',
    // },
    {
      title: '银行卡',
      value: 0,
      path: '/pages-sub/userManager/bankCard/index',
      // path: '/pages-sub/userManager/bankCard/noCards',
      islink: false,
      props: 'bankCardNum',
    },
  ])

  const serveOrderList = ref<serveListProps[]>([
    {
      label: '待付款',
      icon: dafukuan1,
      value: 0,
      path: '/pages-sub/order/orderList?tabsVal=1',
      props: 'dfk',
      hidden: false,
    },
    {
      label: '待发货',
      icon: daifahuo1,
      value: 0,
      path: '/pages-sub/order/orderList?tabsVal=10',
      props: 'dfh',
      hidden: false,
    },
    {
      label: '待收货',
      icon: daishouhuo1,
      value: 0,
      path: '/pages-sub/order/orderList?tabsVal=11',
      props: 'dsh',
      hidden: false,
    },
    {
      label: '已完成',
      icon: yiwancheng1,
      value: 0,
      path: '/pages-sub/order/orderList?tabsVal=2',
      props: 'ywc',
      hidden: true,
    },
    {
      label: '退款/售后',
      icon: shouhou1,
      value: 0,
      path: '/pages-sub/order/orderList?tabsVal=20,21,22,23,24,25,26',
      props: 'sh',
      hidden: false,
    },
  ])
  const grzqList = ref<serveProps[]>([
    {
      icon: smrz,
      title: '实名信息',
      path: '/pages/login/loginsmrz',
      islink: true,
    },

    {
      icon: wdsbk,
      title: '我的社保',
      path: '/pages-sub/userManager/SocialSecurityCard/detil',
      islink: true,
    },
    {
      icon: wdkb,
      title: '身份卡包 ',
      path: '/pages-sub/userManager/cardManager/index',
      islink: true,
      isSign: true,
    },
  ])
  const serveList = ref<serveProps[]>([
    // #ifndef MP-ALIPAY
    {
      icon: jfscl,
      title: '积分商城',
      path: '/pages-sub/marketManager/IntegralMarket/IntegralMarket/list',
      islink: true,
      isShow: true,
    },
    {
      icon: linquan,
      title: '领券中心',
      path: '/pages-sub/marketManager/coupon/index',
      islink: true,
      isShow: true,
    },
    {
      icon: spsc,
      title: '我的收藏',
      path: '/pages-sub/userManager/collection/collection',
      islink: true,
      isShow: true,
    },
    // #endif
    // {
    //   icon: dpgz,
    //   title: '店铺关注',
    //   path: '/pages-sub/userManager/collection/follow',
    //   islink: true,
    // },
    // {
    //   icon: shdz,
    //   title: '收货地址',
    //   path: '/pages-sub/userManager/address/list',
    //   islink: true,
    // },
    {
      icon: xxtz,
      title: '我的消息',
      path: '/pages-sub/userManager/myMessage/massage',
      islink: true,
      isShow: true,
    },
    {
      icon: tsjy,
      title: '投诉建议',
      path: '/pages-sub/userManager/suggest/list',
      islink: true,
      isShow: true,
    },
    {
      icon: saoyisao,
      title: '扫一扫',
      path: 'sacn',
      islink: false,
      isShow: true,
      isRealSataus: true,
    },
    // #ifdef MP-WEIXIN
    {
      icon: tgzx,
      title: '推广中心',
      path: '/pages-sub/promotionCenter/index',
      islink: true,
      isShow: false,
    },
    // #endif
    // #ifdef MP-WEIXIN
    {
      icon: jgtg,
      title: '机构推广',
      path: '/pages-sub/promotionCenter/promotionInstituDetail',
      islink: true,
      isShow: false,
    },
    // #endif
    {
      icon: shezhi,
      title: '设置',
      path: '/pages-sub/system/sysconfig/index',
      islink: true,
      isShow: true,
    },
  ])
  const serveClick = async (item: serveProps) => {
    if (item.islink) {
      routeTo({
        url: item.path,
        data: { type: item.data?.articleId, showTop: true, title: item.title },
      })
    } else if (item.path === 'sacn') {
      const resData: any = await useScancode({ onlyFromCamera: true })
      const { status, url, type, data } = sceneResult(resData)
      if (status) {
        if (type === 'LOGINPC') {
          routeTo({
            url,
            data,
          })
        } else if (type === 'xaCardBusniess') {
          routeTo({
            url: '/pages/pay/index',
            data,
          })
        } else if (type === 'socialCard') {
          routeTo({
            url: '/pages/pay/sacnResult',
            data: { url, actionType: type },
          })
        }
      }
    } else {
      uni.showToast({
        title: '功能开发中...',
        icon: 'none',
      })
    }
  }
  const toContent = (item: serveListProps) => {
    routeTo({
      url: item.path,
    })
  }

  const {
    loading: ReceiveCardInfo,
    send: sendIsReceiveCardInfo,
    onSuccess: cardQuerySucess,
  } = useRequest((data) => getIsReceiveCardInfo(data), {
    immediate: false,
    loading: false,
  })
  // 查询积分信息信息
  const { send: sendInterInfo, data: interInfoData } = useRequest(
    (data?) => findXcxScoreUser<integralProps>(data, true),
    {
      immediate: false,
      loading: false,
      initialData: {},
    },
  )

  const { send: sendMyInfo, data: myInfoData } = useRequest(
    (data?) => findmyInfo<myInfoProps>(data),
    {
      immediate: false,
      loading: false,
      initialData: {},
    },
  )
  const { send: sendOrderStatistics, data: myOrderData } = useRequest(
    (data) => getOrderStatistics<MyOrderProps>(data),
    {
      immediate: false,
      loading: false,
      initialData: {},
    },
  )

  const { send: sendBusinessInfo, data: shopOrederData } = useRequest(
    (data?) => getBusinessInfo<shopOrederProps>(data),
    {
      immediate: false,
      loading: false,
      initialData: {},
    },
  )

  const { send: sendUserHasMerchantAuth, data: hasMerchantAutData } = useRequest(
    (data?) => userHasMerchantAuth<boolean>(data),
    {
      immediate: false,
      loading: false,
    },
  )

  const { send: sedUserInfo, data: userInfoData } = useRequest(() => getUserLoginInfo(), {
    immediate: false,
    loading: false,
  })

  // 查询当前用户是否是机构推广人
  const { send: sedCheckPromoterOrgUser } = useRequest(() => checkPromoterOrgUser(), {
    immediate: false,
    loading: false,
  })

  const userLeavel = ref([
    {
      leavel: 1,
      color: '#548d33',
      bgImg: level1,
    },
    {
      leavel: 2,
      color: '#898989',
      bgImg: level2,
    },
    {
      leavel: 3,
      color: '#ff8000',
      bgImg: level3,
    },
    {
      leavel: 4,
      color: '#f9f0ea',
      bgImg: level4,
    },
    {
      leavel: 5,
      color: '#f9f0ea',
      bgImg: level5,
    },
  ])
  const {
    send: senDcheckBankPromoterByUserId,
    data: checkBankPromoterByUserIdData,
    loading: checkBankPromoterByUserIdLoading,
  } = useRequest((data) => checkBankPromoterByUserId<ICheckBankPromoterByUserIdData>(data), {
    immediate: false,
    loading: false,
  }).onSuccess((res) => {
    if (res.data?.bank) {
      serveList.value.find((item) => item.title === '推广中心')!.isShow = true
    }
  })
  const {
    send: senGetPromoterSwitch,
    data: getPromoterSwitchData,
    loading: getPromoterSwitchLoading,
  } = useRequest((data) => getPromoterSwitch<IPromoterSwitchUserIdData>(data), {
    immediate: false,
    loading: false,
  })
    .onSuccess(async (res) => {
      if (res.data?.status === 0) {
        if (res.data?.id === 1) {
          serveList.value.find((item) => item.title === '推广中心')!.isShow = true
        }
        // 第三方机构推广人
        if (res.data?.id === 2) {
          try {
            const res: any = await sedCheckPromoterOrgUser()
            if (Object.values(res).length !== 0) {
              serveList.value.find((item) => item.title === '机构推广')!.isShow = true
            }
            console.log('sedCheckPromoterOrgUser', res)
          } catch (error) {
            console.log('error', error)
          }
        }
      }
    })
    .onError((res) => {})

  const cLeavel = computed(() => {
    return (
      userLeavel.value.find((item) => item.leavel === myInfoData.value?.userGrade) ??
      userLeavel.value[0]
    )
  })
  const showUtils = (item: serveProps, flog: boolean) => {
    if (item.isRealSataus) {
      return item.isRealSataus && flog
    } else {
      return item!.isShow
    }
  }

  const { send: sendHistoryCount, data: historyCountData } = useRequest(
    (data) => getHistoryCount(data),
    {
      immediate: false,
      loading: false,
    },
  )

  return {
    serveList,
    serveClick,
    sendIsReceiveCardInfo,
    topList,
    sendUserCouponList,
    sendInterInfo,
    interInfoData,
    serveOrderList,
    toContent,
    showUtils,
    shopOrederData,
    sendMyInfo,
    myInfoData,
    sendOrderStatistics,
    myOrderData,
    sendBusinessInfo,
    grzqList,
    sendUserHasMerchantAuth,
    hasMerchantAutData,
    cLeavel,
    sedUserInfo,
    userInfoData,
    senGetPromoterSwitch,
    senDcheckBankPromoterByUserId,
    sendHistoryCount,
    historyCountData,
  }
}
