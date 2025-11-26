<template>
  <!-- Banner组件 -->
  <view class="banner-box" :class="{ 'no-data': loaded && banners.length === 0 }" v-if="loaded && banners.length === 0">
    <view class="banner-content"></view>
    <view class="dots"></view>
  </view>

  <view class="banner-box" v-if="loaded && banners.length > 0">
    <swiper 
      class="swiper" 
      autoplay 
      :interval="3000" 
      circular 
      :current="swiperCurrent" 
      @change="dotChange"
      @animationfinish="swiperChange"
    >
      <swiper-item 
        v-for="(item, index) in banners" 
        :key="index" 
        class="swiper-item" 
        :data-id="item.id"
        @click="bannerJumping(item)"
      >
        <image lazy-load :src="item.pictureUrl" class="slide-image" />
      </swiper-item>
    </swiper>
    
    <view class="dots" v-if="banners.length > 1">
      <view 
        v-for="(dot, index) in banners" 
        :key="index" 
        class="dot" 
        :style="index === currentDot ? `background-color: ${themeColor}` : ''"
      ></view>
    </view>
  </view>

  <signin :show="signShow" @close="handleMemberSignInClose" />
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted, watch } from 'vue'
import { bannerService } from '../../api/bannerService'
import { THEME } from '../../utils/themeManager'
import { NAVPAGE } from '../../utils/navPage'
import { self } from '../../utils/self'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'Banner',
  props: {
    show: {
      type: Boolean,
      default: false,
      handler(newVal: boolean, oldVal: boolean) {
        if (this.storeInfo) {
          this.handleStore()
          this.reload(true)
        }
      }
    },
    refreshType: {
      type: String,
      default: '',
      handler(newVal: string, oldVal: string) {
        if (newVal !== '' && newVal !== 'USER') {
          this.handleStore()
          this.hasQuery = false
          this.reload(true)
        }
      }
    }
  },

  setup(props) {
    const store = useStore()
    const loaded = ref(false)
    const banners = ref<any[]>([])
    const swiperCurrent = ref(0)
    const currentDot = ref(0)
    const storeId = ref('')
    const signShow = ref(false)
    const hasQuery = ref(false)
    const themeColor = ref(THEME.color)

    // 计算属性获取store信息
    const storeInfo = computed(() => store.state.storeInfo)

    // 监听props变化
    watch(() => props.show, (newVal, oldVal) => {
      if (storeInfo.value) {
        handleStore()
        reload(true)
      }
    })

    watch(() => props.refreshType, (newVal, oldVal) => {
      if (newVal !== '' && newVal !== 'USER') {
        handleStore()
        hasQuery.value = false
        reload(true)
      }
    })

    onMounted(() => {
      themeColor.value = store.state.uiconfig?.themeColor || uni.getStorageSync('themeColor') || THEME.color
    })

    // 组件方法
    const reload = (refresh = false) => {
      if (!loaded.value) {
        // 懒加载逻辑需要适配Vue
        setTimeout(() => {
          loaded.value = true
          getBannerList(storeId.value)
        }, 100)
      } else if (refresh) {
        getBannerList(storeId.value)
      }
    }

    const handleStore = () => {
      if (storeInfo.value) {
        storeId.value = storeInfo.value.id
      }
    }

    const getBannerList = async (storeId: string) => {
      if (props.refreshType !== '' && props.refreshType !== 'USER') {
        if (hasQuery.value) {
          return
        }
      }
      hasQuery.value = true

      try {
        const res = await bannerService.getStoreBannerList('HOME', storeId)
        banners.value = res
        swiperCurrent.value = 0
        currentDot.value = 0
        emit('banner', res)
      } catch (err: any) {
        if (err.message) {
          uni.showToast({
            title: err.message,
            icon: 'none',
            duration: 2000
          })
        }
      }
    }

    const swiperChange = (e: any) => {
      swiperCurrent.value = e.detail.current
    }

    const dotChange = (e: any) => {
      currentDot.value = e.detail.current
    }

    const bannerJumping = (item: any) => {
      // 跳转逻辑需要根据具体业务实现
      NAVPAGE.navigateTo(item)
    }

    const handleMemberSignInClose = () => {
      signShow.value = false
    }

    return {
      loaded,
      banners,
      swiperCurrent,
      currentDot,
      storeId,
      signShow,
      hasQuery,
      themeColor,
      reload,
      handleStore,
      getBannerList,
      swiperChange,
      dotChange,
      bannerJumping,
      handleMemberSignInClose
    }
  }
})
</script>

<style scoped>
.banner-box {
  width: 100%;
  /* padding: 0 40rpx; */
  box-sizing: border-box;
  height: 368rpx;
  margin-bottom: 15px;
}

.banner-content {
  width: 100%;
  height: 330rpx;
  background: #EFEFEF;
  border-radius: 18rpx;
}

.banner-box .dots {
  position: relative;
  margin-top: -35rpx;
  display: flex;
  justify-content: center;
}

.no-data {
  margin-bottom: 20rpx;
}

.banner-box.no-data .dots {
  width: 30rpx;
  height: 14rpx;
  background: #eee;
  border-radius: 8rpx;
  margin: 15rpx auto;
}

.banner-box .dots .dot {
  margin: 0 8rpx;
  width: 20rpx;
  height: 5rpx;
  background: #eee;
  /* border-radius: 8rpx;    */
  transition: all 0.6s;
}

.banner-box .dots .dot.active {
  width: 24rpx;
  background: #ff7e00;
}

.swiper {
  width: 100%;
  height: 368rpx;
  /* border-radius: 18rpx; */
  overflow: hidden;
}

.swiper-item {
  width: 100%;
  height: 100%;
  margin-right: 40rpx;
  /* border-radius: 18rpx; */
}

.banner-box image {
  width: 100%;
  height: 100%;
  display: block;
}
</style>