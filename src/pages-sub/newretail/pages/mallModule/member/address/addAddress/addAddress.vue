<template>
  <!-- pages/addAddress/addAddress.wxml -->
  <view>
    <navigationBar :title="state.navigationBarTitle"></navigationBar>
    <form @submit="handleSave">
      <view class="extraction" v-if="state.customerAddressAuto">
        <textarea
          type="text"
          placeholder="粘贴信息到此处，将自动拆分姓名/电话/地址"
          placeholder-class="placeholder"
          :value="state.extractionText"
          @input="handleExtractionDetails"
        ></textarea>
        <view @click="extraction" :style="'background: ' + state.defaultColor">
          {{ !state.extractionText ? '粘贴并识别' : '识别' }}
        </view>
      </view>
      <view class="top-info">
        <view class="section">
          <view class="section-title">联 系 人</view>
          <view class="right">
            <input
              type="text"
              placeholder="姓名"
              name="name"
              :value="state.name"
              maxlength="10"
              @input="handleName"
            />
          </view>
        </view>
        <view class="lable-box">
          <text
            :class="'lable-item ' + (state.userGenders == index ? 'active' : '')"
            :style="
              'color: ' +
              (state.userGenders == index ? state.defaultColor : '') +
              ';border: 1rpx solid ' +
              (state.userGenders == index ? state.defaultColor : '') +
              ';'
            "
            v-for="(item, index) in state.genders"
            :key="index"
            :data-id="item.id"
            :data-index="index"
            data-type="gender"
            @click="handleClick"
          >
            {{ item.name }}
          </text>
          <text class="space"></text>
        </view>
      </view>
      <view class="contact-info">
        <view class="section">
          <view class="section-title">电　　话</view>
          <view class="right">
            <input
              type="text"
              placeholder="手机号码"
              :value="state.phone"
              name="phone"
              @input="handlePhone"
            />
          </view>
        </view>
      </view>
      <view class="choose-address">
        <view class="section detailed" @click="chooseAddress">
          <view class="section-title">选择地址</view>
          <view class="right">
            <view class="section-address-font" v-if="state.region.length > 0">
              <text v-for="(item, index) in state.region" :key="index">{{ item }}</text>
              <text>{{ state.details }}</text>
            </view>
            <view v-else class="right-checked" :style="'background: ' + state.defaultColor">
              选择
            </view>
          </view>
          <!-- <view class="section-title">选择地址</view>
        <view class="right">
            <view style="background: {{state.defaultColor}}"  class="section-choose-btn">
                选择地址
            </view>   
        </view> -->
        </view>
        <!-- <view class="section detailed">
        <view class="section-title">详细地址</view>
        <view class="right">
          <textarea type="text" placeholder="如道路、门牌号、小区、楼栋号、单元室等" maxlength="50" placeholder-class="placeholder" style="padding-top:{{state.systemDetail ? '12rpx' : '26rpx'}};padding-left:0;" id="detailed" name="details" value="{{state.details}}" bindinput="handleDetails" bindblur="handleBlur" bindfocus="handleFocus" />       
          <view class="right-icon" style="color:{{state.defaultColor}}" bindtap="chooseAddress">
            <image src="{{state.imagesPath.iconPosition}}" ></image>
              定位
          </view>
        </view>
    </view>    -->
        <!-- 门牌号 -->
        <view class="section detailed">
          <view class="section-title">门牌号</view>
          <view class="right">
            <textarea
              type="text"
              placeholder="如门牌号、小区、楼栋号、单元室等"
              maxlength="50"
              placeholder-class="placeholder"
              :style="
                'padding-top:' + (state.systemDetail ? '12rpx' : '26rpx') + ';padding-left:0;'
              "
              id="detailed"
              name="houseNumber"
              :value="state.houseNumber"
              @input="handleHouseNumber"
              @blur="handleBlur"
              @focus="handleFocus"
            ></textarea>
          </view>
        </view>
        <view class="lable-box">
          <view class="section-title">标 签</view>
          <text
            :class="'lable-item ' + (state.currentLabel == index ? 'active' : '')"
            :style="
              'color: ' +
              (state.currentLabel == index ? state.defaultColor : '') +
              ';border: 1rpx solid ' +
              (state.currentLabel == index ? state.defaultColor : '') +
              ';'
            "
            v-for="(item, index) in state.labels"
            :key="index"
            :data-id="item.id"
            :data-index="index"
            data-type="label"
            @click="handleClick"
          >
            {{ item.name }}
          </text>
        </view>
        <view class="section default">
          <view class="section-title">默认地址</view>
          <view class="right">
            <switch
              :color="state.defaultColor"
              :checked="state.isDefault"
              name="isDefault"
              :value="state.isDefault"
              @change="handleDefault"
            ></switch>
          </view>
        </view>
      </view>
      <button class="btn" :style="'background: ' + state.defaultColor" form-type="submit">
        保存并使用
      </button>
      <button
        class="btn-delelte"
        :style="'color: ' + state.defaultColor + ';border: 1rpx solid ' + state.defaultColor + ';'"
        :hidden="state.pageType === 'normal'"
        @click="doDeleteAddress"
      >
        删除地址
      </button>
    </form>
  </view>
</template>
<script setup>
import _apiDistributionServiceJs from '@/service/api/newretail/distributionService'
import _utilsAddressJs from '@/utils/newretail/address'
import _utilsUtilsJs from '@/utils/newretail/utils'
import _utilsThemeManagerJs from '@/utils/newretail/themeManager'
import _utilsAnalysisJs from '@/utils/newretail/analysis'
import _libsMta_analysisJs from '@/libs/mta_analysis'
import _utilsImagesPathJs from '@/utils/newretail/imagesPath'
import _libsQqmapWxJssdkMinJs from '@/libs/qqmap-wx-jssdk'
import _apiSystemServiceJs from '@/service/api/newretail/systemService'
import _apiAddressServiceJs from '@/service/api/newretail/addressService'
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from 'vue'
const app = getApp()

// pages/addAddress/addAddress.js
const addressService = _apiAddressServiceJs
const sysService = _apiSystemServiceJs
const NavigationBar = _componentsNavigationBarNavigationBarJs
const QQMapWX = _libsQqmapWxJssdkMinJs
let qqmapsdk
const IMGAGESPATH = _utilsImagesPathJs
const mta = _libsMta_analysisJs
const ANALYSIS = _utilsAnalysisJs
const themeManager = _utilsThemeManagerJs
const util = _utilsUtilsJs
const ADDRESS = _utilsAddressJs
const distributionService = _apiDistributionServiceJs

// 获取应用实例
const state = reactive({
  customerAddressAuto: false,
  deliveryDistanceThirdMap: '',
  // 地图项配置
  extractionText: '',
  navigationBarTitle: '新增收货地址',
  imagesPath: IMGAGESPATH,
  region: ['省', '市', '区'],
  name: '',
  phone: '',
  details: '',
  houseNumber: '',
  addressInfo: {},
  defaultColor: themeManager.color,
  isDefault: false,
  detailedLabelShow: false,
  genders: [
    {
      name: '先生',
      value: 'MALE',
      id: 0,
    },
    {
      name: '女士',
      value: 'FEMALE',
      id: 1,
    },
  ],
  labels: [
    {
      name: '家',
      id: 0,
    },
    {
      name: '公司',
      id: 1,
    },
    {
      name: '学校',
      id: 2,
    },
  ],
  currentLabel: -1,
  userGenders: -1,
  systemDetail: false,
  pageType: 'normal',
})
function getCustomerAddressAuto() {
  state.customerAddressAuto = false
  sysService
    .query('customerAddressAuto')
    .then((res) => {
      if (res && res.length > 0 && res[0].value != null) {
        state.customerAddressAuto = res[0].value == 'TRUE'
      }
    })
    .catch((err) => {
      console.log(err)
    })
}
function getMapSet() {
  sysService
    .query('deliveryDistanceThirdMap')
    .then((res) => {
      console.log('res111', res)
      if (res && res.length > 0 && res[0].value != null) {
        app.globalData.systemConfigure.deliveryDistanceThirdMap = res[0].value
        state.deliveryDistanceThirdMap = app.globalData.systemConfigure.deliveryDistanceThirdMap
        let key = 'lbs_tianditu_appkey'
        if (res[0].value == 'TIANDITU') {
          key = 'lbs_tianditu_appkey'
        } else if (res[0].value == 'GAODE') {
          key = 'lbs_autonavi_key'
        }
        sysService
          .query(key)
          .then((res) => {
            if (res && res.length > 0 && res[0].value != null) {
              if (key == 'lbs_tianditu_appkey') {
                app.globalData.systemConfigure.lbsTiandituAppkey = res[0].value
              } else if (key == 'lbs_autonavi_key') {
                app.globalData.systemConfigure.lbsAutonaviAppkey = res[0].value
              }
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    })
    .catch((err) => {
      console.log(err)
    })
}
function handleExtractionDetails(e) {
  state.extractionText = e.detail.value
}
function extraction() {
  const that = this
  if (!state.extractionText) {
    uni.getClipboardData({
      success(res) {
        state.extractionText = res.data
        addressService.extractionAddress(state.extractionText).then((res) => {
          extractionFn()
        })
      },
    })
  } else {
    extractionFn()
  }
}
function extractionFn() {
  addressService.extractionAddress(state.extractionText).then((res) => {
    if (res) {
      if (!res.city && !res.area) {
        uni.showToast({
          title: '地址识别失败，请重新输入',
          icon: 'none',
          duration: 2000,
        })
        return
      }
      state.name = res.name ? res.name : state.name
      state.phone = res.mobile ? res.mobile : state.phone
      state.region = [res.province || '', res.city || '', res.area || '']
      state.details = res.address ? res.address : state.details
      state.houseNumber = ''
    }
  })
}
function handleClick(e) {
  const that = this
  const index = e.currentTarget.dataset.index
  const type = e.currentTarget.dataset.type
  if (type === 'gender') {
    if (state.userGenders !== index) {
      state.userGenders = index
    } else {
      state.userGenders = -1
    }
  } else if (type === 'label') {
    if (state.currentLabel !== index) {
      state.currentLabel = index
    } else {
      state.currentLabel = -1
    }
  }
}
function doDeleteAddress() {
  const that = this
  const id = state.addressInfo.id
  if (id && id != '') {
    uni.showModal({
      title: '提示',
      content: '请确认要删除地址？',
      success: function (res) {
        if (res.confirm) {
          addressService
            .removeById(id)
            .then((res) => {
              console.log(res)
              uni.showToast({
                title: '删除成功~',
                icon: 'none',
                duration: 2000,
              })
              try {
                const value = uni.getStorageSync('wj_chooseAddressInfo')
                if (value) {
                  if (value.id === id) {
                    uni.removeStorageSync('wj_chooseAddressInfo')
                  }
                }
              } catch (e) {
                // Do something when catch error
              }
              setTimeout(() => {
                uni.navigateBack({
                  delta: 1,
                })
              }, 2000)
            })
            .catch((e) => {
              uni.showToast({
                title: '删除失败~',
                icon: 'none',
                duration: 2000,
              })
            })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      },
    })
  } else {
  }
}
function handleFocus(e) {
  state.detailedLabelShow = true
}
function handleBlur(e) {
  state.detailedLabelShow = false
}
function bindRegionChange(e) {
  const that = this
  state.region = e.detail.value
}
function handleDetails(e) {
  if (e.detail.cursor < 40) {
    state.details = e.detail.value
  } else if (e.detail.cursor === 40) {
    state.details = e.detail.value
    uni.showToast({
      title: '详细地址最大不能超50个字符哦~',
      icon: 'none',
      duration: 2000,
    })
  } else {
  }
}
function handleHouseNumber(e) {
  console.log(e.detail)
  if (e.detail.cursor < 40) {
    state.houseNumber = e.detail.value
  } else if (e.detail.cursor === 40) {
    state.houseNumber = e.detail.value
    uni.showToast({
      title: '详细地址最大不能超50个字符哦~',
      icon: 'none',
      duration: 2000,
    })
  } else {
  }
}
function handleName(e) {
  if (e.detail.cursor < 10) {
    state.name = e.detail.value
  } else if (e.detail.cursor === 10) {
    state.name = e.detail.value
    uni.showToast({
      title: '联系人昵称最大不能超10个字符哦~',
      icon: 'none',
      duration: 2000,
    })
  } else {
  }
}
function handlePhone(e) {
  state.phone = e.detail.value
}
function handleDefault(e) {
  state.isDefault = e.detail.value
}
function handleSave(e) {
  // e.detail.value.houseNumber = " "
  console.log(e.detail.value)
  if (!canSave) {
    console.log('已经在保存了')
    return
  }
  canSave = false
  const self = this
  const reg = /^[1]([3-9])[0-9]{9}$/
  // if (e.detail.value.region[0] == '省') {
  if (state.region[0] == '省') {
    uni.showToast({
      title: '请选择省市区',
      icon: 'none',
      duration: 2000,
    })
    canSave = true
  }
  // else if (this.data.deliveryDistanceThirdMap != 'TIANDITU' && !e.detail.value.details) {
  //   wx.showToast({
  //     title: "请填写详细地址",
  //     icon: 'none',
  //     duration: 2000
  //   })
  //   this.canSave = true;
  // }
  else if (!e.detail.value.houseNumber) {
    uni.showToast({
      title: '请输入门牌号',
      icon: 'none',
      duration: 2000,
    })
    canSave = true
  } else if (!e.detail.value.name) {
    uni.showToast({
      title: '请输入联系人姓名',
      icon: 'none',
      duration: 2000,
    })
    canSave = true
  } else if (!e.detail.value.phone) {
    uni.showToast({
      title: '请输入联系方式',
      icon: 'none',
      duration: 2000,
    })
    canSave = true
  } else if (reg.test(e.detail.value.phone) === false) {
    uni.showToast({
      title: '请输入正确的联系方式',
      icon: 'none',
      duration: 2000,
    })
    canSave = true
  } else {
    console.log(e.detail.value, location)
    try {
      const value = uni.getStorageSync('wj_member')
      console.log('value', value)
      if (value) {
        if (location) {
          console.log(e, value, location.latitude, location.longitude)
          if (
            (!location.latitude || !location.longitude) &&
            (state.deliveryDistanceThirdMap == 'TIANDITU' ||
              state.deliveryDistanceThirdMap == 'GAODE')
          ) {
            const defaultAddress =
              state.region[0] +
              state.region[1] +
              state.region[2] +
              (state.details || '') +
              (e.detail.value.houseNumber || '')
            util
              .addressResolution(defaultAddress)
              .then((res) => {
                if (res && res.data && res.data.location) {
                  handleAddressSave(e, value, res.data.location.lat, res.data.location.lon)
                } else {
                  canSave = true
                }
              })
              .catch(() => {
                canSave = true
              })
          } else {
            handleAddressSave(e, value, location.latitude, location.longitude)
          }
        } else {
          console.log(
            state.deliveryDistanceThirdMap != 'TIANDITU' &&
              state.deliveryDistanceThirdMap != 'GAODE',
          )
          // if(this.data.deliveryDistanceThirdMap != 'TIANDITU' && this.data.deliveryDistanceThirdMap != 'GAODE') {
          //     // 没有经纬度需要解析
          //     qqmapsdk.geocoder({
          //         address: this.data.region[0] + this.data.region[1] + this.data.region[2] + this.data.details + e.detail.value.houseNumber,
          //         success: function (res) {
          //         console.log(res);
          //         self.handleAddressSave(e, value, res.result.location.lat, res.result.location.lng)
          //         },
          //         fail: function (res) {
          //         console.log(res);
          //         wx.showToast({
          //             title: '地址解析失败，请重新输入',
          //             icon: 'none',
          //             duration: 2000
          //           })
          //           return;
          //         // 12.7 地址逆解析被限制次数，添加调用失败保存逻辑
          //         self.handleAddressSave(e, value)
          //         }
          //     });
          // } else {
          if (!state.addressInfo.latitude || !state.addressInfo.longitude) {
            const defaultAddress =
              state.region[0] +
              state.region[1] +
              state.region[2] +
              (state.details || '') +
              (e.detail.value.houseNumber || '')
            util
              .addressResolution(defaultAddress)
              .then((res) => {
                if (res && res.data && res.data.location) {
                  handleAddressSave(e, value, res.data.location.lat, res.data.location.lon)
                } else {
                  canSave = true
                }
              })
              .catch(() => {
                uni.showToast({
                  title: '地址解析失败，请重新输入',
                  icon: 'none',
                  duration: 2000,
                })
                canSave = true
              })
          } else {
            handleAddressSave(e, value, state.addressInfo.latitude, state.addressInfo.longitude)
          }
          // }
        }
      } else {
        uni.showToast({
          title: '您还不是会员，请先绑定手机号码成为会员',
          icon: 'none',
          duration: 2000,
        })
        canSave = true
      }
    } catch (e) {
      // Do something when catch error
      canSave = true
    }
  }
}
function handleAddressSave(e, member, lat, lng) {
  const self = this
  console.log(self)
  if (state.options.doEditAddress === 'edit') {
    // 修改地址
    let postData = {
      id: state.addressInfo.id,
      userId: member.id,
      province: state.region[0],
      city: state.region[1],
      county: state.region[2],
      detailedAddress: state.details,
      houseNum: e.detail.value.houseNumber,
      contactsMobile: e.detail.value.phone,
      contacts: e.detail.value.name,
      defaultAddress: e.detail.value.isDefault,
      latitude: lat,
      longitude: lng,
    }
    console.log('postData111', postData)
    if (state.userGenders === -1) {
      postData = {
        ...postData,
        gender: 'UNKNOWN',
      }
    } else if (state.userGenders === 0) {
      postData = {
        ...postData,
        gender: 'MALE',
      }
    } else if (state.userGenders === 1) {
      postData = {
        ...postData,
        gender: 'FEMALE',
      }
    }
    const tab = state.currentLabel
    const labels = state.labels
    if (tab !== -1) {
      labels.forEach((item) => {
        if (item.id === tab) {
          postData = {
            ...postData,
            label: item.name,
          }
        }
      })
    } else {
      postData = {
        ...postData,
        label: '',
      }
    }
    console.log('postData', postData)
    addressService
      .update(postData)
      .then((res) => {
        uni.navigateBack({
          delta: 1,
        })
      })
      .catch((err) => {
        canSave = true
        uni.showToast({
          title: err.message,
          icon: 'none',
          duration: 2000,
        })
      })
  } else {
    // 新增地址
    let postData = {
      userId: member.id,
      province: state.region[0],
      city: state.region[1],
      county: state.region[2],
      houseNum: e.detail.value.houseNumber,
      contactsMobile: e.detail.value.phone,
      contacts: e.detail.value.name,
      defaultAddress: e.detail.value.isDefault,
      latitude: lat,
      longitude: lng,
      detailedAddress: state.details,
    }
    if (state.userGenders === -1) {
      postData = {
        ...postData,
        gender: 'UNKNOWN',
      }
    } else if (state.userGenders === 0) {
      postData = {
        ...postData,
        gender: 'MALE',
      }
    } else if (state.userGenders === 1) {
      postData = {
        ...postData,
        gender: 'FEMALE',
      }
    }
    const tab = state.currentLabel
    const labels = state.labels
    if (tab !== -1) {
      labels.forEach((item) => {
        if (item.id === tab) {
          postData = {
            ...postData,
            label: item.name,
          }
        }
      })
    } else {
      postData = {
        ...postData,
        label: '',
      }
    }
    addressService
      .create(postData)
      .then((res) => {
        uni.navigateBack({
          delta: 1,
        })
      })
      .catch((err) => {
        canSave = true
        uni.showToast({
          title: err.message,
          icon: 'none',
          duration: 2000,
        })
      })
  }
}
function chooseAddress() {
  const that = this
  const region = state.region
  console.log(region)
  uni.chooseLocation({
    success: function (res) {
      // success
      console.log(res, 'location')
      location = {
        latitude: res.latitude,
        longitude: res.longitude,
      }
      let regex = /^(北京市|天津市|重庆市|上海市|香港特别行政区|澳门特别行政区)/
      let province = []
      const addressBean = {
        province: null,
        country: null,
        city: null,
        address: null,
      }
      let addressName = res.name
      function regexAddressBean(address, addressBean, latitude, longitude) {
        regex = /^(.*?[市]|.*?地区|.*?特别行政区|.*?盟|.*?自治州)(.*?[市区县旗])(.*?)$/g
        const addxress = regex.exec(address)
        console.log(addxress)
        if (addxress) {
          addressBean.city = addxress[1]
          addressBean.country = addxress[2]
          addressBean.address = addxress[3]
        } else {
          // 经纬度逆解析地址
          handleAddressApply(latitude, longitude, addressBean)
        }
      }
      if (!(province = regex.exec(res.address))) {
        regex = /^(.*?(省|自治区))(.*?)$/
        province = regex.exec(res.address)
        console.log('province', province)
        if (province) {
          addressBean.province = province[1]
          regexAddressBean(province[3], addressBean, location.latitude, location.longitude)
        } else {
          const regexe = /^(.*?)\((.+?)\)$/g
          const data = regexe.exec(res.address)
          console.log(data)
          console.log(region)
          const latitude = res.latitude
          const longitude = res.longitude
          if (data && data.length > 0) {
            addressBean.address = data[2]
            addressName = data[1]
          }
          // 经纬度逆解析地址
          handleAddressApply(latitude, longitude, addressBean)
        }
      } else {
        addressBean.province = province[1]
        if (res.poiid && res.poiid === 'City') {
          // 处理IOS第一行数据返回有错
          const regexe = /^(.*?)\((.+?)\)$/g
          const data = regexe.exec(res.name)
          console.log('553', data)
          const latitude = res.latitude
          const longitude = res.longitude
          if (data && data.length) {
            addressBean.address = data[2]
            addressName = data[1]
          }
          // 经纬度逆解析地址
          handleAddressApply(latitude, longitude, handleAddressApply)
        } else {
          regexAddressBean(res.address, addressBean, location.latitude, location.longitude)
        }
      }
      console.log('addressBean', addressBean)
      if (addressBean.address !== '') {
        state.detailedLabelShow = true
      }
      state.details = addressName
      state.houseNumber = addressBean.address
      state.region = [addressBean.province, addressBean.city, addressBean.country]
    },
    fail: function () {
      // fail
    },
    complete: function () {
      // complete
    },
  })
}
async function handleAddressApply(latitude, longitude, addressBean) {
  const that = this
  util.inverseAnalysisAddress(latitude, longitude).then((res) => {
    console.log(res)
    addressBean.province = res.data.result.addressComponent.province
    addressBean.city = res.data.result.addressComponent.city
    addressBean.country = res.data.result.addressComponent.county
    addressBean.address = res.data.result.addressComponent.poi
    if (addressBean.address !== '') {
      state.detailedLabelShow = true
    }
    state.details = res.data.result.addressComponent.address
    state.houseNumber = addressBean.address
    state.region = [addressBean.province, addressBean.city, addressBean.country]
  })
  // if(that.data.deliveryDistanceThirdMap != 'TIANDITU' && that.data.deliveryDistanceThirdMap != 'GAODE') {
  //     qqmapsdk.reverseGeocoder({
  //         location: {
  //           latitude: latitude,
  //           longitude: longitude
  //         },
  //         success: function (res) {
  //           console.log(res)
  //           addressBean.province = res.result.address_component.province
  //           addressBean.city = res.result.address_component.city;
  //           addressBean.country = res.result.address_component.district;
  //           that.setData({
  //             region: [
  //               addressBean.province,
  //               addressBean.city,
  //               addressBean.country
  //             ],
  //             details: res.result.address_component.street? res.result.address_component.street: res.result.address
  //           })
  //         },
  //         fail: function (res) {
  //           console.log(res);
  //         }
  //     })
  // } else {
  //     // let change = await distributionService.gcj02TOwgs84(longitude,latitude)
  //     // util.inverseAnalysisAddress(change.latitude,change.longitude).then((res) => {
  //     util.inverseAnalysisAddress(latitude,longitude).then((res) => {
  //         console.log(res)
  //         addressBean.province = res.data.result.addressComponent.province
  //         addressBean.city = res.data.result.addressComponent.city;
  //         addressBean.country = res.data.result.addressComponent.county;
  //         addressBean.address = res.data.result.addressComponent.poi;
  //         if (addressBean.address !== '') {
  //             that.setData({
  //               detailedLabelShow: true
  //             })
  //           }
  //           that.setData({
  //             details: res.data.result.addressComponent.address,
  //             houseNumber: addressBean.address,
  //             region: [
  //               addressBean.province,
  //               addressBean.city,
  //               addressBean.country
  //             ]
  //           })
  //     })
  // }
}
onLoad(function (options) {
  uni.hideShareMenu()
  canSave = true
  const phone = {
    // ...wx.getSystemInfoSync(),
    ...uni.getSystemSetting(),
    ...uni.getAppAuthorizeSetting(),
    ...uni.getDeviceInfo(),
    ...uni.getWindowInfo(),
    ...uni.getAppBaseInfo(),
  } // 调用方法获取机型
  let detail = null
  if (phone.platform == 'ios') {
    detail = true
  } else if (phone.platform == 'android') {
    detail = false
  }
  state.options = options
  state.systemDetail = detail
  state.defaultColor = app.globalData.uiconfig.themeColor
  ADDRESS.getTenXunKey().then(() => {
    //     console.log(2333366666)
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      //   key: 'ENCBZ-HOS6C-F572J-A5J7T-3GCRH-IEFF4'
      key: app.globalData.systemConfigure.lbsTencentMiniappKey,
    })
  })
  const self = this
  getCustomerAddressAuto()
  if (options.doEditAddress === 'edit') {
    state.navigationBarTitle = '修改收货地址'
    state.pageType = 'edit'
    try {
      const startAddress = uni.getStorageSync('wj_editAddress')
      const addressId = startAddress.id
      addressService
        .query()
        .then((res) => {
          res.forEach((item) => {
            if (item.id === addressId) {
              state.addressInfo = item
              const address = state.addressInfo
              let detailedAddress = address.detailedAddress
              if (address.houseNum && address.houseNum !== ' ' && !detailedAddress) {
                detailedAddress = detailedAddress + address.houseNum
              }
              state.region = [address.province, address.city, address.county]
              state.name = address.contacts
              state.phone = address.contactsMobile
              state.details = detailedAddress
              state.houseNumber = address.houseNum
              state.isDefault = address.defaultAddress
              if (item.gender === 'UNKNOWN') {
                state.userGenders = -1
              } else if (item.gender === 'MALE') {
                state.userGenders = 0
              } else if (item.gender === 'FEMALE') {
                state.userGenders = 1
              }
              const label = item.label
              const labels = state.labels
              labels.forEach((item) => {
                if (item.name == label) {
                  state.currentLabel = item.id
                }
              })
            }
          })
        })
        .catch((err) => {
          uni.showToast({
            title: err.message,
            icon: 'none',
            duration: 2000,
          })
        })
    } catch (e) {}
  } else if (options.chooseaddress == 'edit') {
    const addressInfo = uni.getStorageSync('wj_addchooseAddress')
    if (addressInfo) {
      // this.setData({
      //     addressInfo
      // })
      state.region = [addressInfo.provinceName, addressInfo.cityName, addressInfo.countyName]
      state.name = addressInfo.userName
      state.phone = addressInfo.telNumber
      state.details = addressInfo.detailInfo
      state.houseNumber = addressInfo.houseNum
    }
  } else {
    try {
      const locationInfo = uni.getStorageSync('wj_locationInfo')
      if (locationInfo) {
        // Do something with return value
        console.log(locationInfo)
        // self.setData({
        //   region: [
        //     locationInfo.ad_info.province,
        //     locationInfo.ad_info.city,
        //     locationInfo.ad_info.district,
        //   ],
        //   details: locationInfo.title,
        //   houseNumber: locationInfo.address,
        // })
        uni.removeStorageSync('wj_locationInfo')
        // this.getUserAddress()
      } else {
        // this.getUserAddress()
      }
    } catch (e) {
      // Do something when catch error
    }
  }
  // 统计PV
  if (app.globalData.storeInfo) {
    ANALYSIS.PVStatistics(app.globalData.storeInfo.id)
  }
  location = null
})
function getUserAddress() {
  const that = this
  uni.getLocation({
    type: 'gcj02',
    success: function (res) {
      console.log(res)
      const latitude = res.latitude
      const longitude = res.longitude
      util.inverseAnalysisAddress(latitude, longitude).then((res) => {
        console.log(res)
        state.region = [addressBean.province, addressBean.city, addressBean.country]
      })
      // qqmapsdk.reverseGeocoder({
      //   location: {
      //     latitude: latitude,
      //     longitude: longitude
      //   },
      //   success: function (res) {
      //     console.log(res)
      //     that.setData({
      //       region: [
      //         res.result.address_component.province,
      //         res.result.address_component.city,
      //         res.result.address_component.district,
      //       ]
      //     })
      //   },
      //   fail: function (res) {
      //     console.log(res);
      //   }
      // })
    },
  })
}
onReady(function () {})
onShow(function () {
  // 获取地图项配置
  getMapSet()
})
onHide(function () {})
onUnload(function () {})
onPullDownRefresh(function () {})
onReachBottom(function () {})
onShareAppMessage(function () {})
</script>
<style scoped>
/* pages/addAddress/addAddress.wxss */

page {
}

.top-info,
.choose-address,
.contact-info {
  padding: 0 40rpx;
  background: #fff;
}

.top-info {
  border-bottom: 20rpx solid #f1f1f1;
}

.top-info .lable-box {
  height: 110rpx;
  height: 50rpx;
  padding: 30rpx 0 30rpx 162rpx;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.top-info .lable-box .lable-item {
  font-size: 24rpx;
  line-height: 50rpx;
  height: 50rpx;
  color: #8b8b8c;
  border: 1rpx solid #8b8b8c;
  border-radius: 5rpx;
  display: inline-block;
  padding: 0 24rpx;
  margin-right: 30rpx;
}

.top-info .lable-box .lable-item.active {
  color: #009f55;
  border: 1rpx solid #009f55;
}

.top-info .lable-box .lable-item:last-of-type {
  margin-right: 0;
}

.section {
  background: #fff;
  border-bottom: 1rpx solid #f1f1f1;
  font-size: 28rpx;
  height: 98rpx;
  line-height: 98rpx;
  overflow: auto;
  display: flex;
  align-items: center;
  position: relative;
}

.choose-address {
  margin-bottom: 40rpx;
}

.choose-address .section:last-of-type {
  border-bottom: none;
}

.section-title {
  color: #454545;
  width: 164rpx;
  float: left;
  text-align: left;
}
.section-address-font {
  line-height: 142rpx;
}
.section-choose-btn {
  /* display: flex;
    align-items: center; */
  width: 264rpx;
  height: 60rpx;
  line-height: 60rpx;
  color: #fff;
  text-align: center;
  border-radius: 50rpx;
  position: relative;
  margin: 44rpx 0;
}
.section picker {
  text-align: left;
  position: relative;
}

.address-picker {
  color: #000;
}

.region {
  width: 506rpx;
  position: relative;
}

.right {
  float: left;
  width: 524rpx;
  position: relative;
}

.right input {
  font-size: 28rpx;
  height: 98rpx;
  width: 90%;
  line-height: 36rpx;
  /* padding: 27rpx 0; */
  box-sizing: border-box;
  color: #313131;
}

.right image {
  width: 25rpx;
  height: 30rpx;
  position: absolute;
  right: 0;
  top: 34rpx;
}

.choose-city image {
  width: 16rpx;
  height: 28rpx;
  position: absolute;
  right: 0;
  top: 35rpx;
}

.contact-info .section .section-title {
  color: #313131;
}

.detailed {
  height: 142rpx;
  position: relative;
  overflow: hidden;
}

.detailed .right {
  height: 142rpx;
  display: flex;
  justify-content: space-between;
}

.detailed .section-title {
  /* padding-top: 26rpx; */
  line-height: 36rpx;
  font-size: 28rpx;
}
.right-checked {
  font-size: 28rpx;
  width: 40%;
  flex-shrink: 0;
  height: 60rpx;
  line-height: 60rpx;
  position: relative;
  color: #fff;
  text-align: center;
  border-radius: 50rpx;
  margin: 44rpx 0;
}
/* .right-checked image {
    position: static;
} */
.detailed .right textarea {
  height: 142rpx;
  width: 78%;
  /* box-sizing: border-box; */
  padding: 26rpx 0 0 0;
  font-size: 28rpx;
  line-height: 36rpx;
  color: #333333;
}
.right-icon {
  font-size: 28rpx;
  width: 20%;
  flex-shrink: 0;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.right-icon image {
  margin-right: 6rpx;
  width: 25rpx;
  height: 30rpx;
  position: initial;
}

.placeholder {
  font-size: 28rpx;
  line-height: 36rpx;
  color: #8b8b8c;
  height: 98rpx;
  display: block;
}

.detailed label image {
  width: 40rpx;
  height: 40rpx;
  vertical-align: middle;
  margin-top: -4rpx;
}

.default text {
  margin-right: 20rpx;
}

.choose-address .lable-box {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background: #fff;
  border-bottom: 1rpx solid #f1f1f1;
  font-size: 28rpx;
  height: 50rpx;
  line-height: 50rpx;
  overflow: hidden;
  padding: 40rpx 0;
  margin-bottom: 20rpx;
}

.lable-box .lable-item {
  font-size: 24rpx;
  line-height: 50rpx;
  height: 50rpx;
  color: #8b8b8c;
  border: 1rpx solid #8b8b8c;
  border-radius: 5rpx;
  display: inline-block;
  padding: 0 24rpx;
  margin-right: 30rpx;
}

.lable-box .lable-item.active {
  color: #009f55;
  border: 1rpx solid #009f55;
}

.lable-box .space {
  width: 1rpx;
  height: 100%;
  display: inline-block;
}

.btn {
  color: #fff;
  font-size: 32rpx;
  font-weight: bold;
  height: 100rpx;
  line-height: 100rpx;
  width: 670rpx;
  border-radius: 100rpx;
  border: none;
  background: #009f55;
}

.btn-delelte {
  font-size: 32rpx;
  font-weight: bold;
  height: 100rpx;
  line-height: 100rpx;
  width: 670rpx;
  border-radius: 100rpx;
  border: none;
  color: #009f55;
  background: #fff;
  border: 1rpx solid #009f55;
  margin-top: 30rpx;
}
.extraction {
  position: relative;
  border: 1px solid #cbcbcb;
  margin: 10rpx 40rpx 0;
  border-radius: 15rpx;
  padding: 20rpx;
}
.extraction textarea {
  width: 100%;
  height: 200rpx;
}
.extraction textarea::placeholder {
  /* white-space: nowrap; */
}
.extraction view {
  position: absolute;
  z-index: 1000;
  right: 20rpx;
  bottom: 20rpx;
  border-radius: 25rpx;
  height: 50rpx;
  color: #fff;
  font-size: 26rpx;
  width: 150rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
