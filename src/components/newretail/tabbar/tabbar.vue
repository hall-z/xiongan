<template>
  <view class="tabbar_box" :class="{ 'iphoneX-height': isIphoneX }" v-if="show" :style="{ backgroundColor: tabbar.backgroundColor }">
    <template v-for="(item, index) in nertabbar" :key="item.pagePath">
      <view 
        v-if="item.isSpecial"
        class="tabbar_nav"
        hover-class="none"
        :style="{ color: tabbar.selectedColor }"
        @click="toSearch"
        @longpress="popupVoice"
        @touchstart="recorderStart"
        @touchmove="recorderMove"
        @touchcancel="recorderCancel"
        @touchend="recorderEnd"
      >
        <view class="special-wrapper">
          <image class="tabbar_icon" :src="speechStart ? item.selectedIconPath : item.iconPath"></image>
        </view>
        <image class="special-text-wrapper"></image>
        <text>{{ item.text }}</text>
      </view>
      
      <view 
        v-else
        class="tabbar_nav"
        hover-class="none"
        :data-url="item.pagePath"
        :style="{ color: item.selected ? tabbar.selectedColor : tabbar.color }"
        @click="navigator(item.pagePath)"
      >
        <image class="tabbar_icon" :src="item.selected ? item.selectedIconPath : item.iconPath"></image>
        <text>{{ item.text }}</text>
        <text 
          class="tabbar-badge"
          v-if="item.badge && item.badge != 0 && item.badge != 'undefined' && item.badge !== undefined"
        >
          {{ item.badge.length < 5 ? item.badge : '...' }}
        </text>
      </view>
    </template>
  </view>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { UTILS } from '../../utils/utils'
import { self } from '../../utils/self'

export default defineComponent({
  name: 'Tabbar',
  props: {
    tabbar: {
      type: Object,
      default: () => ({}),
      handler(newV: any, oldV: any) {
        if (newV && newV.list) {
          this.setData({
            tabList: newV.list
          })
          // 原有的图片缓存逻辑可以在这里实现
        }
      }
    },
    popupShade: {
      type: Boolean,
      default: true
    },
    show: {
      type: Boolean,
      default: false
    }
  },

  setup(props, { emit }) {
    const store = useStore()
    const isIphoneX = ref(UTILS.isIphoneX())
    const storeId = ref('')
    const recorderType = ref('normal') // normal (正常) success (成功) fail (失败) cancel (取消)
    const speechStart = ref(false)
    const nertabbar = ref<any[]>([])
    const tabList = ref<any[]>([])

    // 初始化录音管理器
    const recorderManager = uni.getRecorderManager()

    // 监听tabbar变化
    watch(() => props.tabbar, (newV, oldV) => {
      if (newV && newV.list) {
        tabList.value = newV.list
        // 这里可以实现图片缓存逻辑
      }
    })

    const onPopupShade = () => {
      emit('popup-shade')
      if (props.popupShade) {
        emit('popup')
      }
    }

    const toSearch = () => {
      console.log("跳转搜索")
      // 实现搜索跳转逻辑
    }

    const popupVoice = () => {
      console.log("长按")
      // 实现语音弹出逻辑
    }

    // 录音相关方法
    const recorderStart = (e: any) => {
      onPopupShade()
      speechStart.value = true
      storeId.value = store.state.storeInfo?.id || ''

      const options = {
        duration: 10000,
        sampleRate: 16000,
        numberOfChannels: 1,
        encodeBitRate: 48000,
        format: 'aac' as const,
        frameSize: 50
      }

      recorderManager.start(options)
      recorderManager.onStart(() => {
        recorderType.value = 'success'
      })
    }

    const recorderCancel = (e: any) => {
      onPopupShade()
      console.log('录音取消', e)
      recorderManager.stop()
      recorderType.value = 'cancel'
      speechStart.value = false
    }

    const recorderMove = (e: any) => {
      // 触摸移动处理
    }

    const recorderEnd = (e: any) => {
      onPopupShade()
      console.log("结束")
      speechStart.value = false

      if (recorderType.value === 'success') {
        recorderManager.onStop((res: any) => {
          const tempFilePath = res.tempFilePath
          console.log(tempFilePath)
          sendRecord(tempFilePath, storeId.value)
        })
      }
      recorderManager.stop()
    }

    const navigator = (url: string) => {
      uni.reLaunch({
        url: url
      })
    }

    // 发送录音文件
    const sendRecord = (src: string, storeId: string) => {
      uni.showToast({
        icon: 'loading',
        title: '正在搜索...',
        duration: 20000
      })

      uni.uploadFile({
        url: "https://dev.gomoretech.com/demo/newretail-search/api/search/product/queryByVoice",
        filePath: src,
        name: "file",
        header: {
          'Content-Type': 'application/json'
        },
        formData: {
          'storeId': storeId
        },
        success: (result: any) => {
          console.log(result)
          const data = JSON.parse(result.data)
          if (data.data) {
            try {
              uni.setStorageSync('wj_speechSearch', data.data)
              uni.navigateTo({
                url: '/pages-sub/newretail/pages/mallModule/goods/search/search'
              })
            } catch (e) {}
          } else {
            uni.showToast({
              title: '未检测到语音',
              icon: 'none',
              duration: 2000
            })
          }
        },
        fail: (err: any) => {
          console.log(err)
          uni.hideToast()
        }
      })
    }

    // 设置录音管理器事件监听
    recorderManager.onStart(() => {
      console.log('recorder start')
    })

    recorderManager.onPause(() => {
      console.log('recorder pause')
    })

    recorderManager.onStop((res: any) => {
      console.log('recorder stop', res)
    })

    recorderManager.onFrameRecorded((res: any) => {
      console.log('frameBuffer.byteLength', res.frameBuffer.byteLength)
    })

    recorderManager.onError((res: any) => {
      console.log("error", res)
    })

    return {
      isIphoneX,
      storeId,
      recorderType,
      speechStart,
      nertabbar,
      tabList,
      onPopupShade,
      toSearch,
      popupVoice,
      recorderStart,
      recorderCancel,
      recorderMove,
      recorderEnd,
      navigator
    }
  }
})
</script>

<style scoped>
.tabbar_box {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 999;
  width: 100%;
  height: 98rpx;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.1);
}

.tabbar_box.iphoneX-height {
  padding-bottom: 50rpx;
}

.tabbar_nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 20rpx;
  height: 100%;
  position: relative;
}

.tabbar_icon {
  width: 56rpx;
  height: 56rpx;
}

.tabbar-badge {
  position: absolute;
  color: #fff;
  left: 80%;
  top: 12rpx;
  font-size: 24rpx;
  padding: 0 10rpx;
  text-align: center;
  min-width: 36rpx;
  line-height: 36rpx;
  position: absolute;
  border-radius: 18rpx;
  box-sizing: border-box;
  background-color: #f44;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
  font-family: PingFang SC, Helvetica Neue, Arial, sans-serif;
}

.special-wrapper {
  position: absolute;
  top: -80rpx;
  width: 200rpx;
  height: 200rpx;
  border-radius: 50%;
  text-align: center;
  box-sizing: border-box;
  padding: 6rpx;
  display: flex;
  justify-content: center;
}

.special-wrapper .tabbar_icon {
  width: 200rpx;
  height: 200rpx;
}

.special-text-wrapper {
  width: 56rpx;
  height: 56rpx;
}
</style>