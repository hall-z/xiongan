<template>
  <weui-navigation-bar 
    :loading="loading" 
    :show="show" 
    :animated="animated"
    :style="{
      position: !isShowTopNavigation ? 'absolute' : 'relative',
      left: !isShowTopNavigation ? '0' : '',
      top: !isShowTopNavigation ? '0' : '',
      ...extStyleObject
    }"
    :color="color"
    :background="isHome && isShowTopNavigationFlag && !isShowTopNavigation ? 'transparent' : background"
    :title="title"
    :back="back"
  >
    <!-- 地址显示模式 -->
    <template v-if="isShowAddress" #left>
      <view class="left-navigation-bar-box" :class="[hideBack ? 'no-back' : '', leftClass, 'left-navigation-bar-box1']" v-if="!isTabbar">
        <view class="navigation_bar_btn_goback" @click="goBack" v-if="!hideBack">
          <image class="" :src="imagesPath.navigation_bar_btn_goback" mode="widthFix"></image>
        </view>
        <view class="navigation_bar_btn_gohome" @click="goHome" v-if="hideBack">
          <image :src="imagesPath.navigation_bar_btn_gohome" mode="widthFix"></image>
        </view>
        <view class="search search1" @click="handleConfirm" v-if="isShowSearch">
          <image style="width:28rpx;height:28rpx" :src="imagesPath.iconSearch"></image>
          请输入搜索关键词
        </view>
        <view v-if="isShowCustomer" @click="isOpenCustomerService ? null : callPhone()" class="contact-icon">
          <button v-if="isOpenCustomerService" open-type="contact" />
          <image :src="imagesPath.iconCustomerService" mode="widthFix"></image>
          <text>客服</text>
        </view>
        <view class="store-type-text" v-if="storeTypeText" :style="{ width: `${storeTypeText.length * 42}rpx` }">
          {{ storeTypeText }}
        </view>
        <view class="address" v-if="isShowAddressText" @click="changeAddress">
          <image style="width:22rpx;height:30rpx" :src="imagesPath.iconNearStoreAddress"></image>
          <text>{{ addressName || '暂无地址信息' }}</text>
        </view>
      </view>
    </template>

    <!-- 非首页模式 -->
    <template v-else-if="!isHome" #left>
      <view class="left-navigation-bar-box" :class="[hideBack ? 'no-back' : '', leftClass]" v-if="!isTabbar">
        <view class="navigation_bar_btn_goback" @click="goBack" v-if="!hideBack">
          <image class="" :src="imagesPath.navigation_bar_btn_goback" mode="widthFix"></image>
        </view>
        <view class="navigation_bar_btn_gohome" @click="goHome">
          <image :src="imagesPath.navigation_bar_btn_gohome" mode="widthFix"></image>
        </view>
      </view>
    </template>

    <!-- 首页模式 -->
    <template v-else #left>
      <view class="left-box" :class="{ 'top-left-box': !isShowTopNavigationFlag }">
        <view class="address" v-if="nearStoreStyle === '1'" @click="changeAddress">
          <image style="width:22rpx;height:30rpx" :src="imagesPath.iconNearStoreAddress"></image>
          <text>{{ addressName || '暂无地址信息' }}</text>
        </view>
        <view class="search" @click="handleConfirm" v-if="topSearchStyle === '1'">
          <image style="width:28rpx;height:28rpx" :src="imagesPath.iconSearch"></image>
        </view>
      </view>
    </template>

    <!-- 右侧购物车 -->
    <template v-if="isShopcart" #right>
      <view class="share-shopping-cart" style="position: relative;">
        <button @click="shareView" open-type="share" style="position: absolute; left: 0;top: 0;width: 100%;height: 100%;background-color: transparent;"></button>
        <image :src="imagesPath.share_shopping_cart" mode="widthFix"/>
      </view>
    </template>
  </weui-navigation-bar>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted, watch, computed } from 'vue'
import { useStore } from 'vuex'
import { IMAGESPATH } from '../../utils/imagesPath'
import { UTILS } from '../../utils/utils'
import { NAVPAGE } from '../../utils/navPage'
import { sysService } from '../../api/systemService'

interface NavigationBarProps {
  title?: string
  background?: string
  color?: string
  back?: boolean
  isShowCustomer?: boolean
  isOpenCustomerService?: boolean
  loading?: boolean
  animated?: boolean
  show?: boolean
  leftClass?: string
  extStyle?: string
  isHome?: boolean
  isShopcart?: boolean
  isShowAddress?: boolean
  isShowSearch?: boolean
  isStoreDetail?: boolean
  isShowAddressText?: boolean
  isShowTopNavigation?: boolean
  isShowTopNavigationFlag?: boolean
  storeId?: string
  storeTypeText?: string
  topSearchStyle?: string
  nearStoreStyle?: string
  latitudeAndLongitude?: string
}

export default defineComponent({
  name: 'NavigationBar',
  props: {
    title: {
      type: String,
      default: ''
    },
    background: {
      type: String,
      default: '#ffffff'
    },
    color: {
      type: String,
      default: '#333333'
    },
    back: {
      type: Boolean,
      default: false
    },
    isShowCustomer: {
      type: Boolean,
      default: false
    },
    isOpenCustomerService: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    animated: {
      type: Boolean,
      default: true
    },
    show: {
      type: Boolean,
      default: true
    },
    leftClass: {
      type: String,
      default: ''
    },
    extStyle: {
      type: String,
      default: ''
    },
    isHome: {
      type: Boolean,
      default: false
    },
    isShopcart: {
      type: Boolean,
      default: false
    },
    isShowAddress: {
      type: Boolean,
      default: false
    },
    isShowSearch: {
      type: Boolean,
      default: false
    },
    isStoreDetail: {
      type: Boolean,
      default: false
    },
    isShowAddressText: {
      type: Boolean,
      default: false
    },
    isShowTopNavigation: {
      type: Boolean,
      default: true
    },
    isShowTopNavigationFlag: {
      type: Boolean,
      default: false
    },
    storeId: {
      type: String,
      default: ''
    },
    storeTypeText: {
      type: String,
      default: ''
    },
    topSearchStyle: {
      type: String,
      default: ''
    },
    nearStoreStyle: {
      type: String,
      default: ''
    },
    latitudeAndLongitude: {
      type: String,
      default: ''
    }
  },

  setup(props: NavigationBarProps, { emit }) {
    const store = useStore()
    const latitudeAndLongitude1 = ref<string | null>(null)
    const addressName = ref<string | null>(null)
    const storeInfoName = ref('')
    const hideBack = ref(false)
    const isTabbar = ref(false)

    const imagesPath = computed(() => IMAGESPATH)
    const extStyleObject = computed(() => {
      try {
        return props.extStyle ? JSON.parse(props.extStyle) : {}
      } catch {
        return {}
      }
    })

    const storeInfo = computed(() => store.state.storeInfo)

    // 监听相关属性变化
    watch(() => [props.nearStoreStyle, storeInfo.value, props.latitudeAndLongitude], 
      ([nearStoreStyle, storeInfoVal, latitudeAndLongitude]) => {
        if (latitudeAndLongitude && latitudeAndLongitude !== latitudeAndLongitude1.value) {
          const latitudeAndLongitudeList = latitudeAndLongitude.split(',')
          UTILS.inverseAnalysisAddress(latitudeAndLongitudeList[0], latitudeAndLongitudeList[1]).then((res: any) => {
            const resData = res.data?.result || res.result
            addressName.value = resData.formatted_address ? resData.formatted_address : resData.formattedAddresses?.recommend
          })
          latitudeAndLongitude1.value = latitudeAndLongitude
        } else if (nearStoreStyle === '1' && storeInfoVal) {
          storeInfoName.value = storeInfoVal.name || ''
        }
      }
    )

    onMounted(() => {
      initNavigationBar()
    })

    const initNavigationBar = () => {
      if (storeInfo.value) {
        storeInfoName.value = storeInfo.value.name || ''
      }

      const chooseAddress = uni.getStorageSync('wj_chooseAddressInfo')
      if (chooseAddress && chooseAddress.detailedAddress) {
        addressName.value = chooseAddress.detailedAddress
      }

      const pageStack = getCurrentPages()
      if (pageStack.length === 1) {
        hideBack.value = true
      }

      // 检查是否为tabbar页面
      const currentPages = UTILS.utilGetCurrentPage()
      let pagePath = currentPages.route
      if (pagePath && pagePath.indexOf('/') !== 0) {
        pagePath = '/' + pagePath
      }

      const tabBarList = store.state.tabBar?.list || []
      if (tabBarList.length > 0) {
        tabBarList.forEach((item: any) => {
          if (pagePath === item.pagePath && item.pagePath !== '/pages-sub/newretail/pages/mallModule/myCard/memberCard/memberCard') {
            isTabbar.value = true
          }
        })
      }

      if (pagePath === '/pages-sub/newretail/pages/mallModule/advertising/advertising') {
        isTabbar.value = true
      }
    }

    const callPhone = () => {
      const storeInfoVal = storeInfo.value || uni.getStorageSync('storeIdactive')
      NAVPAGE.toCustomService('', storeInfoVal.id)
    }

    const changeAddress = () => {
      NAVPAGE.toAddressList('?from=index')
    }

    const updateStoreInfo = () => {
      if (storeInfo.value) {
        storeInfoName.value = storeInfo.value.name || ''
      }

      if (store.state.latitude && store.state.longitude) {
        UTILS.inverseAnalysisAddress(store.state.latitude, store.state.longitude).then((res: any) => {
          const resData = res.data?.result || res.result
          addressName.value = resData.formatted_address ? resData.formatted_address : resData.formattedAddresses?.recommend
        })
        latitudeAndLongitude1.value = `${store.state.latitude},${store.state.longitude}`
      }
    }

    const changeStore = () => {
      NAVPAGE.toSelectStore()
    }

    const handleConfirm = () => {
      uni.navigateTo({
        url: '../../goods/search/search' + (props.isStoreDetail ? '?showType=product&storeId=' + props.storeId : '')
      })
    }

    const goBack = () => {
      uni.navigateBack({
        delta: 1
      })
    }

    const goHome = () => {
      NAVPAGE.toHome()
    }

    const shareView = () => {
      // 分享功能实现
    }

    return {
      latitudeAndLongitude1,
      addressName,
      storeInfoName,
      hideBack,
      isTabbar,
      imagesPath,
      extStyleObject,
      storeInfo,
      callPhone,
      changeAddress,
      updateStoreInfo,
      changeStore,
      handleConfirm,
      goBack,
      goHome,
      shareView
    }
  }
})
</script>

<style scoped>
/* components/navigation-bar/navigation-bar.wxss */
.left-navigation-bar-box {
  width: 176rpx;
  height: 58rpx;
  border: 1rpx solid #e7e7e7;
  border-radius: 32rpx;
  display: flex;
  align-items: center;
  background-color: rgba(255,255,255,.6);
}
.left-navigation-bar-box.opacity {
  background: rgba(255, 255, 255, 0.6);
}

.left-navigation-bar-box.no-back {
  width: 88rpx;
}

.left-navigation-bar-box image {
  width: 33rpx;
  height: 33rpx;
  margin: 0;
}

.navigation_bar_btn_goback,
.navigation_bar_btn_gohome {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.navigation_bar_btn_gohome {
  position: relative;
}

.navigation_bar_btn_gohome::before {
  content: "";
  display: block;
  width: 1px;
  height: 35rpx;
  background: #cdcdcd;
  border-radius: 1px;
  position: absolute;
  left: 0;
  top: 50%;
  margin-top: -17rpx;
}

.left-navigation-bar-box.no-back .navigation_bar_btn_gohome::before {
  display: none;
}

.left-box {
  display: flex;
  align-items: center;
  width: 300%;
  margin-top: -5rpx;
  margin-left: -15rpx;
}
.address {
  display: flex;
  padding: 0 13rpx;
  height: 65rpx;
  box-sizing: border-box;
  align-items: center;
  background-color: rgba(255,255,255,.3);
  border-radius: 65rpx;
  font-size: 28rpx;
  color: #000;
  margin-right: 10rpx;
}
.address image {
  margin-right: 8rpx;
}

.address text {
  width: 200rpx; /* 设置固定宽度 */
  white-space: nowrap; /* 防止文本换行 */
  overflow: hidden; /* 隐藏溢出的文本 */
  text-overflow: ellipsis; /* 显示省略号 */
}
.search {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255,255,255,.3);
  height: 65rpx;
  width: 65rpx;
  border-radius: 50%;
}

.share-shopping-cart {
  width: 30rpx;
}

.share-shopping-cart image {
  width: 30rpx;
}
.left-box > view {
  border: 1px solid transparent;
}
.top-left-box > view {
  border-color: #ccc;
}
/* .navigation_bar_btn_goback image {
  width: 16rpx;
  height: 16rpx;
} */

.left-navigation-bar-box1 {
  width: auto;
  border: none;
  background-color: transparent;
}
.left-navigation-bar-box1 .navigation_bar_btn_goback,
.left-navigation-bar-box1 .navigation_bar_btn_gohome {
  margin-right: 18rpx;
}
.search1 {
  /* margin-left: 30rpx; */
  width: 339rpx;
  height: 70rpx;
  background: #FFFFFF;
  border-radius: 35rpx;
  font-size: 28rpx;
  color: #999999;
  display: flex;
  align-items: center;
  padding: 0 20rpx;
  box-sizing: border-box;
}
.search1 image {
  margin-right: 22rpx;
}
.store-type-text {
  font-size: 40rpx;
  font-weight: 700;
  display: flex;
  /* min-width: 170rpx; */
  max-width: 180rpx;
}
.contact-icon {
  display: flex;
  flex-direction: column;
  font-size: 20rpx;
  color: #333333;
  margin-left: 20rpx;
  width: 50rpx;
  justify-content: center;
  align-items: center;
}
.contact-icon image {
  filter:brightness(0);
}
</style>