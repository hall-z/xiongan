<template>
  <!-- components/subscribe-popup/subscribe-popup.wxml -->
  <popup :show="state._show.middle" position="middle" custom-class="middle" @close="close">
    <view class="subscribe-popup">
      <view class="subscribe-title">订阅服务通知</view>
      <view class="subscribe-close">
        <image :src="state.imagesPath.iconCloseImg2" @click="close"></image>
      </view>
      <view class="subscribe-content">
        <view class="subscribe-item" v-for="(item, index) in subscribeList" :key="id">
          <view class="left">{{ item.templateConfigName }}</view>
          <view class="right">
            <text selectable="false" space="false" decode="false">已订阅了{{ item.count }}次</text>
            <view
              class="button"
              :style="'color:' + themeColor + ';border-color:' + themeColor + ';'"
              :data-wxaTemplateId="item.wxaTemplateId"
              :data-templateConfigId="item.templateConfigId"
              @click="clickSubscribe"
            >
              订阅
            </view>
          </view>
        </view>
      </view>
      <view class="subscribe-tips">*订阅1次可以收到1条对应的消息推送</view>
    </view>
  </popup>
</template>
<script setup>
import _utilsUtilsJs from '@/utils/newretail/utils'
import _utilsLogJs from '@/utils/newretail/log'
import _utilsSubscribeMessageJs from '@/utils/newretail/subscribeMessage'
import _utilsImagesPathJs from '@/utils/newretail/imagesPath'
import _utilsThemeManagerJs from '@/utils/newretail/themeManager'
import _apiSubscribeServiceJs from '@/service/api/newretail/subscribeService'
// import { attached } from "@dcloudio/uni-app";
import { reactive, watch, onBeforeMount, onMounted } from 'vue'
import popup from '../popup/popup.vue'
const app = getApp()
// components/subscribe-popup/subscribe-popup.js
const subscribeService = _apiSubscribeServiceJs
const themeManager = _utilsThemeManagerJs
const IMAGESPATH = _utilsImagesPathJs
const subscribeMessage = _utilsSubscribeMessageJs
const log = _utilsLogJs
const utils = _utilsUtilsJs
// 获取应用实例
const state = reactive({
  _show: {
    middle: false,
    top: false,
    bottom: false,
    right: false,
    right2: false,
  },
  isShow: false,
  imagesPath: IMAGESPATH,
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
  subscribeList: [],
})
const props = defineProps({
  show: {
    type: Boolean,
    value: false,
  },
})
onBeforeMount(() => {
  state.themeColor =
    app && app.globalData && app.globalData.uiconfig && app.globalData.uiconfig.themeColor
      ? app.globalData.uiconfig.themeColor
      : uni.getStorageSync('themeColor')
})
function toggleMiddlePopup() {
  toggle('middle')
}
function close() {
  toggle('middle')
  triggerEvent('close')
}
function toggle(type) {
  state[`_show.${type}`] = !state._show[type]
}
function getByMember() {
  const that = this
  const memberId = app.globalData.userInfo.member.id
  subscribeService
    .getByMember(memberId)
    .then((res) => {
      const tempList = []
      if (res && res.length > 0) {
        if (app.globalData.templateIdsQuery) {
          handleSubscribeList()
        } else {
          subscribeMessage
            .getTemplateIds()
            .then((res) => {
              handleSubscribeList()
            })
            .catch((err) => {
              console.log(err.message)
              log.warn('查询模板id报错：', err.message)
            })
        }
      } else {
        state.subscribeList = tempList
      }
      function handleSubscribeList() {
        let sceneList = []
        if (subscribeMessage.scene) {
          const sceneKeyList = Object.keys(subscribeMessage.scene)
          sceneKeyList.forEach((key) => {
            if (subscribeMessage.scene && subscribeMessage.scene[key]) {
              sceneList = sceneList.concat(subscribeMessage.scene[key])
            }
          })
        }
        const sceneNewList = []
        sceneList.forEach((item) => {
          if (sceneNewList.indexOf(item) == -1) {
            sceneNewList.push(item)
          }
        })
        const templateIds = subscribeMessage.getTemplateIdsByTypes(sceneNewList)
        if (templateIds.length > 0) {
          templateIds.forEach((ele) => {
            for (let i = 0; i < res.length; i++) {
              const item = res[i]
              if (ele.id === item.templateConfigId) {
                const tempItem = {
                  count: item.count ? item.count : 0,
                  wxaTemplateId: ele.wxaTemplateId,
                  templateConfigId: item.templateConfigId,
                  templateConfigName: item.templateConfigName,
                }
                tempList.push(tempItem)
                break
              }
            }
          })
        }
        if (state.isShow && tempList.length > 0 && !state._show.middle) {
          state[`_show.middle`] = true
        }
        console.log(templateIds, tempList)
        state.subscribeList = tempList
      }
    })
    .catch((err) => {
      utils.showToast(err.message)
    })
}
function clickSubscribe(e) {
  console.log(e)
  const that = this
  const templateConfigId = e.currentTarget.dataset.templateconfigid
  const wxaTemplateId = e.currentTarget.dataset.wxatemplateid
  if (uni.requestSubscribeMessage) {
    uni.requestSubscribeMessage({
      tmplIds: [wxaTemplateId],
      success(res) {
        console.log(res)
        if (res.errMsg.indexOf('ok') > 0) {
          if (res[wxaTemplateId] === 'accept') {
            addSubscribe([templateConfigId])
          }
        }
      },
      fail(err) {
        console.log(err)
        log.warn(err)
      },
    })
  } else {
    log.warn('api wx.requestSubscribeMessage 当前版本不支持')
  }
}
function addSubscribe(templateConfigIds) {
  const that = this
  const memberId = app.globalData.userInfo.member.id
  const postData = {
    memberId,
    templateConfigIds,
  }
  subscribeService
    .add(postData)
    .then((res) => {
      getByMember()
    })
    .catch((err) => {
      utils.showToast(err.message)
    })
}

// Watch listeners converted from observers
watch(
  () => props.show,
  (e, o) => {
    // 属性值变化时执行
    state.isShow = Boolean(e)
    if (e) {
      getByMember()
    } else {
      state[`_show.middle`] = Boolean(e)
    }
  },
)
</script>
<style scoped>
/* components/subscribe-popup/subscribe-popup.wxss */
.subscribe-popup {
  width: 670rpx;
  border-radius: 20rpx;
  background: #ffffff;
  position: relative;
}
.subscribe-title {
  color: #121212;
  font-size: 40rpx;
  width: 100%;
  height: 102rpx;
  padding-top: 4rpx;
  align-items: center;
  display: flex;
  justify-content: center;
}
.subscribe-close {
  width: 44rpx;
  height: 44rpx;
  position: absolute;
  right: 34rpx;
  top: 22rpx;
}
.subscribe-close image {
  width: 44rpx;
  height: 44rpx;
}
.subscribe-content {
  width: 592rpx;
  margin: 0 auto;
}
.subscribe-item {
  width: 592rpx;
  height: 118rpx;
  font-size: 28rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #ededed;
}
.subscribe-item:last-of-type {
  border-bottom: none;
}
.subscribe-item .right {
  display: flex;
  align-items: center;
}
.subscribe-item text {
  font-size: 24rpx;
  color: #848484;
  margin-right: 19rpx;
}
.subscribe-item .button {
  width: 120rpx;
  height: 50rpx;
  border: 1px solid #ff7200;
  border-radius: 25rpx;
  line-height: 50rpx;
  text-align: center;
}
.subscribe-tips {
  color: #848484;
  font-size: 28rpx;
  line-height: 44rpx;
  padding-bottom: 23rpx;
  width: 100%;
  text-align: center;
}
</style>
