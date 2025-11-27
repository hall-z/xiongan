<template>
  <!-- pages/my/my.wxml -->
  <navigationBar :title="state.navigationBarTitle"></navigationBar>
  <form @submit="handleSave">
    <view class="top-info">
      <image :src="state.userInfo.avatar || state.userInfo.avatarUrl"></image>
      <button :hidden="state.hasUserInfo" @click="getUserInfo"></button>

      <text>{{ state.userInfo.nickName ? state.userInfo.nickName : '未填写' }}</text>
    </view>

    <view v-if="state.openRegisterDataPopup">
      <view class="section-box">
        <view class="section" v-if="state.configInfoSet.name">
          <view class="section-title">
            姓名
            <text v-if="state.configInfoSet.name.hasMust">*</text>
          </view>
          <view
            :class="!state.configInfoSet.name.canUpdate && state.nickName ? 'right gray' : 'right'"
          >
            <input
              :disabled="!state.configInfoSet.name.canUpdate && state.nickName"
              type="text"
              class="nickName"
              placeholder="请输入姓名"
              name="nickName"
              :value="state.nickName"
              @input="inputNiceName"
            />
          </view>
        </view>
        <view class="section" v-if="state.configInfoSet.mobile">
          <view class="section-title">
            手机号
            <text v-if="state.configInfoSet.mobile.hasMust">*</text>
          </view>
          <view
            :class="
              (!state.configInfoSet.mobile.canUpdate && memberTel) || memberTel
                ? 'right gray'
                : 'right'
            "
          >
            <input
              maxlength="11"
              :disabled="(!state.configInfoSet.mobile.canUpdate && memberTel) || memberTel"
              type="number"
              name="mobile"
              @input="handlePhone"
              :value="state.mobile"
              placeholder="请输入手机号"
            />
          </view>
        </view>
        <view class="section" v-if="state.configInfoSet.birthday">
          <view class="section-title">
            生日
            <text v-if="state.configInfoSet.birthday.hasMust">*</text>
          </view>
          <view :class="!state.configInfoSet.birthday.canUpdate ? 'right gray' : 'right'">
            <picker
              :disabled="!state.configInfoSet.birthday.canUpdate"
              mode="date"
              name="birthday"
              start="1900-01-01"
              :end="state.endDate"
              :value="state.birthday"
              @change="bindSectionDateChange"
            >
              <view class="picker">
                {{ state.birthday === '未填写' ? '只能填写一次，请谨慎填写' : state.birthday }}
              </view>
            </picker>
          </view>
        </view>
        <view class="section" v-if="state.configInfoSet.idCard">
          <view class="section-title">
            身份证号
            <text v-if="state.configInfoSet.idCard.hasMust">*</text>
          </view>
          <view :class="!state.configInfoSet.idCard.canUpdate ? 'right gray' : 'right'">
            <input
              :disabled="!state.configInfoSet.idCard.canUpdate"
              type="text"
              :value="state.idNum"
              name="idNum"
              @input="handelIdNumInput"
              placeholder="请输入身份证号"
            />
          </view>
        </view>
        <view class="section" v-if="state.configInfoSet.gender">
          <view class="section-title">
            性别
            <text v-if="state.configInfoSet.gender.hasMust">*</text>
          </view>
          <view class="lable-box">
            <text
              :class="'lable-item ' + (state.userGenders == index ? 'active' : '')"
              :style="
                'color: ' +
                (state.userGenders == index ? '#fff' : '#8b8b8c') +
                ';border: 1px solid ' +
                (state.userGenders == index ? state.themeColor : '#ddd') +
                ';'
              "
              v-for="(item, index) in state.genders"
              :key="index"
              :data-id="item.id"
              :data-index="index"
              @click="genderClick"
            >
              {{ item.name }}
            </text>
          </view>
        </view>
        <view class="section" v-if="state.configInfoSet.plateNumber">
          <view class="section-title">
            车牌号
            <text v-if="state.configInfoSet.plateNumber.hasMust">*</text>
          </view>
          <view :class="!state.configInfoSet.plateNumber.canUpdate ? 'right gray' : 'right'">
            <picker
              :disabled="!state.configInfoSet.plateNumber.canUpdate"
              class="city-box"
              @change="cityChange"
              :value="state.cityIndex"
              :range="state.cityArray"
            >
              <view class="picker">
                {{ state.cityArray[cityIndex] }}
                <!-- <image src="../../../../image/san.png"></image> -->
              </view>
            </picker>
            <input
              type="text"
              :disabled="!state.configInfoSet.plateNumber.canUpdate"
              :value="plateNumber"
              name="plateNumber"
              maxlength="14"
              @input="handelPlateNumberInput"
              placeholder="请填写"
            />
            <!-- <vehicle-keyboard vehicleNo="{{vehicleNo}}" bind:confirm="confirmVehicle"></vehicle-keyboard> -->
          </view>
        </view>
        <view class="section" v-if="state.configInfoSet.email">
          <view class="section-title">
            邮箱
            <text v-if="state.configInfoSet.email.hasMust">*</text>
          </view>
          <view :class="!state.configInfoSet.email.canUpdate ? 'right gray' : 'right'">
            <input
              :disabled="!state.configInfoSet.email.canUpdate"
              type="email"
              :value="state.email"
              name="email"
              @input="handelEmailInput"
              placeholder="请输入邮箱"
            />
          </view>
        </view>
        <view class="section" v-if="state.configInfoSet.address">
          <view class="section-title">
            地址
            <text v-if="state.configInfoSet.address.hasMust">*</text>
          </view>
          <picker
            :disabled="!state.configInfoSet.address.canUpdate"
            mode="region"
            :class="!state.configInfoSet.address.canUpdate ? 'right gray' : 'right'"
            @change="bindRegionChange"
            :value="state.region"
            name="region"
          >
            <view class="address-picker">
              {{ state.region[0] }} {{ state.region[1] }} {{ state.region[2] }}
            </view>
          </picker>
        </view>
        <view class="section section-address" v-if="state.configInfoSet.baseAddress">
          <view class="section-title">
            详细地址
            <text v-if="state.configInfoSet.baseAddress.hasMust">*</text>
          </view>
          <view :class="!state.configInfoSet.baseAddress.canUpdate ? 'right gray' : 'right'">
            <textarea
              :disabled="!state.configInfoSet.baseAddress.canUpdate"
              class="address-text"
              type="text"
              placeholder="如道路、门牌号、小区、楼栋号、单元室等"
              maxlength="50"
              name="address"
              :value="state.address"
              @input="handleDetails"
              @blur="handleBlur"
              @focus="handleFocus"
            ></textarea>
            <view class="address" @click="chooseAddress">
              <image class="address-img" :src="state.imagesPath.iconPositionActive"></image>
              <text>定位</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view v-else>
      <view class="info">
        <view class="section">
          <view class="section-title">当前账号</view>
          <view class="right">
            <text>{{ memberTel }}</text>
          </view>
        </view>
      </view>

      <view class="info">
        <view class="section">
          <view class="section-title">昵　　称</view>
          <view class="right">
            <input
              type="text"
              class="nickName"
              placeholder="未填写"
              name="nickName"
              :value="state.nickName"
              @input="inputNiceName"
            />
          </view>
        </view>
        <view class="lable-box">
          <text
            :class="'lable-item ' + (state.userGenders == index ? 'active' : '')"
            :style="
              'color: ' +
              (state.userGenders == index ? '#fff' : '') +
              ';border: 1rpx solid ' +
              (state.userGenders == index ? state.themeColor : '') +
              ';'
            "
            v-for="(item, index) in state.genders"
            :key="index"
            :data-id="item.id"
            :data-index="index"
            @click="genderClick"
          >
            {{ item.name }}
          </text>
        </view>
      </view>

      <view class="info">
        <view class="section">
          <view class="section-title">生　　日</view>
          <view class="right">
            <picker
              mode="date"
              name="date"
              start="1900-01-01"
              :end="state.endDate"
              :value="state.date"
              :disabled="state.picker_switch"
              @change="bindDateChange"
            >
              <view class="picker">
                {{ state.date }}
              </view>
            </picker>
          </view>
        </view>
      </view>

      <view class="info">
        <view class="section">
          <view class="section-title">会员等级</view>
          <view class="right">
            <text>{{ gradeName ? gradeName : '' }}</text>
          </view>
        </view>
      </view>

      <view class="info">
        <view class="section">
          <view class="section-title">城　　市</view>
          <picker
            mode="region"
            class="right"
            @change="bindRegionChange"
            :value="state.region"
            name="region"
          >
            <view class="address-picker">
              {{ state.region[0] }} {{ state.region[1] }} {{ state.region[2] }}
            </view>
          </picker>
        </view>
      </view>

      <view class="info">
        <view class="section" style="height: 120rpx">
          <view class="section-title">地　　址</view>
          <view class="right">
            <textarea
              class="address-text"
              type="text"
              placeholder="如道路、门牌号、小区、楼栋号、单元室等"
              maxlength="50"
              name="address"
              :value="state.address"
              @input="handleDetails"
              @blur="handleBlur"
              @focus="handleFocus"
            ></textarea>
            <view class="address" @click="chooseAddress">
              <image class="address-img" :src="state.imagesPath.iconPositionActive"></image>
              <text>定位</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <button class="btn" :style="'background: ' + state.themeColor" form-type="submit">
      保存信息
    </button>
  </form>
</template>
<script setup>
import _libsQqmapWxJssdkMinJs from '@/libs/qqmap-wx-jssdk'
import _utilsThemeManagerJs from '@/utils/newretail/themeManager'
import _utilsAddressJs from '@/utils/newretail/address'
import _utilsAnalysisJs from '@/utils/newretail/analysis'
import _libsMta_analysisJs from '@/libs/mta_analysis'
import _utilsImagesPathJs from '@/utils/newretail/imagesPath'
import _utilsNavPageJs from '@/utils/newretail/navPage'
import _utilsUtilsJs from '@/utils/newretail/utils'
import _utilsAuthJs from '@/utils/newretail/auth'
import _apiMemberServiceJs from '@/service/api/newretail/memberService'
import _apiWxaUserServiceJs from '@/service/api/newretail/wxaUserService'
// import { onLoad, onReady, onShow, onHide, onUnload } from "@dcloudio/uni-app";
import { reactive } from 'vue'
const app = getApp()

// pages/my/my.js
const wxaUserService = _apiWxaUserServiceJs
const memberService = _apiMemberServiceJs
const NavigationBar = _componentsNavigationBarNavigationBarJs
const auth = _utilsAuthJs
const utils = _utilsUtilsJs
const NAVPAGE = _utilsNavPageJs
const IMGAGESPATH = _utilsImagesPathJs
const mta = _libsMta_analysisJs
const ANALYSIS = _utilsAnalysisJs
const ADDRESS = _utilsAddressJs
const themeManager = _utilsThemeManagerJs
const QQMapWX = _libsQqmapWxJssdkMinJs
let qqmapsdk

// 获取应用实例
const state = reactive({
  openRegisterDataPopup: false,
  // 完善资料配置 true则按配置展示
  configInfoSet: {},
  // 完善资料配置项
  nickName: '',
  mobile: '',
  birthday: '未填写',
  endDate: new Date(),
  idNum: '',
  email: '',
  province: '',
  city: '',
  district: '',
  cityArray: [
    '京',
    '沪',
    '粤',
    '津',
    '冀',
    '晋',
    '蒙',
    '辽',
    '吉',
    '黑',
    '苏',
    '浙',
    '皖',
    '闽',
    '赣',
    '鲁',
    '豫',
    '鄂',
    '湘',
    '桂',
    '琼',
    '渝',
    '川',
    '贵',
    '云',
    '藏',
    '陕',
    '甘',
    '青',
    '宁',
    '新',
  ],
  cityIndex: 0,
  navigationBarTitle: '个人资料',
  imagesPath: IMGAGESPATH,
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
  userGenders: -1,
  userInfo: {},
  member: {},
  picker_switch: false,
  hasUserInfo: false,
  canIUse: uni.canIUse('button.open-type.getUserInfo'),
  date: '未填写',
  endDate: '',
  popupPrompt: false,
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
  region: ['省', '市', '区'],
  address: '',
  detailedLabelShow: false,
})
onLoad(function (options) {
  uni.hideShareMenu()
  const that = this
  // 获取个人资料配置项设置
  getPersonConfig()
  if (app.globalData.userInfo) {
    if (app.globalData.userInfo.member) {
      const member = app.globalData.userInfo.member
      const wxaUser = app.globalData.userInfo.wxaUser
      console.log(member)
      state.userInfo = {
        ...wxaUser,
        ...member,
        nickName: member.nickName ? member.nickName : wxaUser.nickName,
      }
      state.themeColor = app.globalData.uiconfig.themeColor
      state.hasUserInfo = true
      state.memberTel = hideTel(member.mobile)
      state.mobile = member.mobile
      state.nickName = member.nickName
      state.gradeName = member.gradeName ? member.gradeName : ''
      state.member = member
      state.region =
        member.province && member.city && member.district
          ? [member.province, member.city, member.district]
          : ['省', '市', '区']
      state.address = member.address
      state.idNum = member.idNum
      state.plateNumber =
        member.plateNumber && state.cityArray.indexOf(member.plateNumber.substring(0, 1)) >= 0
          ? member.plateNumber.substring(1)
          : member.plateNumber
      state.cityIndex =
        member.plateNumber && state.cityArray.indexOf(member.plateNumber.substring(0, 1)) >= 0
          ? state.cityArray.indexOf(member.plateNumber.substring(0, 1))
          : 0
      state.email = member.email
      if (member.birthday) {
        state.date = member.birthday
        state.birthday = member.birthday
        state.picker_switch = true
      } else {
        const date = new utils.ResponseDate()
        const now = utils.formatTime(date)
        const newTime = now.replace(/\//g, '-')
        const data = newTime.split(' ')[0]
        state.endDate = data
      }
      if (member.gender === 'UNKNOWN') {
        state.userGenders = -1
      } else if (member.gender === 'MALE') {
        state.userGenders = 0
      } else if (member.gender === 'FEMALE') {
        state.userGenders = 1
      }
    } else {
      // 不是会员
      state.hasUserInfo = false
    }
  } else {
    // 未登录
  }
  // 统计PV
  if (app.globalData.storeInfo) {
    ANALYSIS.PVStatistics(app.globalData.storeInfo.id)
  }
  ADDRESS.getTenXunKey().then(() => {
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      //   key: 'ENCBZ-HOS6C-F572J-A5J7T-3GCRH-IEFF4'
      key: app.globalData.systemConfigure.lbsTencentMiniappKey,
    })
  })
})
function getPersonConfig() {
  wxaUserService.getPersonConfig().then((presonInfo) => {
    console.log(presonInfo)
    // 处理如果禁止修改又没有值的情况下允许修改
    if (
      presonInfo &&
      presonInfo.name &&
      !presonInfo.name.canUpdate &&
      (!state.nickName || state.nickName == '微信用户')
    ) {
      presonInfo.name.canUpdate = true
    }
    if (presonInfo && presonInfo.mobile && !presonInfo.mobile.canUpdate && !state.memberTel) {
      presonInfo.mobile.canUpdate = true
    }
    if (
      presonInfo &&
      presonInfo.birthday &&
      !presonInfo.birthday.canUpdate &&
      (!state.birthday || state.birthday == '未填写')
    ) {
      presonInfo.birthday.canUpdate = true
    }
    if (presonInfo && presonInfo.idCard && !presonInfo.idCard.canUpdate && !state.idNum) {
      presonInfo.idCard.canUpdate = true
    }
    if (
      presonInfo &&
      presonInfo.gender &&
      !presonInfo.gender.canUpdate &&
      state.userGenders == -1
    ) {
      presonInfo.idCard.canUpdate = true
    }
    if (
      presonInfo &&
      presonInfo.plateNumber &&
      !presonInfo.plateNumber.canUpdate &&
      !state.plateNumber
    ) {
      presonInfo.plateNumber.canUpdate = true
    }
    if (presonInfo && presonInfo.email && !presonInfo.email.canUpdate && !state.email) {
      presonInfo.email.canUpdate = true
    }
    if (
      presonInfo &&
      presonInfo.address &&
      !presonInfo.address.canUpdate &&
      state.region[0] === '省'
    ) {
      presonInfo.address.canUpdate = true
    }
    if (
      presonInfo &&
      presonInfo.baseAddress &&
      !presonInfo.baseAddress.canUpdate &&
      !state.address
    ) {
      presonInfo.baseAddress.canUpdate = true
    }
    if (presonInfo.openRegisterDataPopup) {
      state.openRegisterDataPopup = !!presonInfo.openRegisterDataPopup
      state.configInfoSet = presonInfo
      if (
        presonInfo.address &&
        presonInfo.address.hasMust &&
        presonInfo.address.defaultValue &&
        !state.region
      ) {
        state.region = presonInfo.address.defaultValue.split(',')
      }
      if (
        presonInfo.baseAddress &&
        presonInfo.baseAddress.hasMust &&
        presonInfo.baseAddress.defaultValue &&
        !state.address
      ) {
        state.address = presonInfo.baseAddress.defaultValue
      }
    }
  })
}
function cityChange(e) {
  state.cityIndex = e.detail.value
}
function handlePhone(e) {
  state.mobile = e.detail.value
}
function bindSectionDateChange(e) {
  state.birthday = e.detail.value
}
function handelIdNumInput(e) {
  state.idNum = e.detail.value
}
function handelPlateNumberInput(e) {
  state.plateNumber = e.detail.value
}
function handelEmailInput(e) {
  state.email = e.detail.value
}
function handleDetails(e) {
  if (e.detail.cursor < 40) {
    state.address = e.detail.value
  } else if (e.detail.cursor === 40) {
    state.address = e.detail.value
    uni.showToast({
      title: '详细地址最大不能超40个字符哦~',
      icon: 'none',
      duration: 2000,
    })
  } else {
  }
}
function genderClick(e) {
  const that = this
  const index = e.currentTarget.dataset.index
  if (state.configInfoSet.gender && !state.configInfoSet.gender.canUpdate) return false
  console.log(index)
  if (state.userGenders !== index) {
    state.userGenders = index
  } else {
    state.userGenders = -1
  }
}
function getUserInfo(e) {
  console.log(e)
  wxaUserService
    .login(true)
    .then((res) => {
      console.log(res)
      state.userInfo = res.wxaUser
      state.hasUserInfo = true
      auth.setUser(res)
      app.globalData.userInfo = res && res.member ? res : null
      if (!res.member) {
        state.isMember = false
        NAVPAGE.toBindMobile()
      } else {
        auth.getDistributor()
        state.member = res.member
        state.isMember = true
        uni.setStorage({
          key: 'wj_member',
          data: res.member,
        })
      }
    })
    .catch((err) => {
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000,
      })
    })
}
function hideTel(tel) {
  const reg = /^(\d{3})\d{4}(\d{4})$/
  tel = tel.replace(reg, '$1****$2')
  return tel
}
function toSelectAddress() {
  const self = this
  uni.chooseLocation({
    success: function (res) {
      // success
      console.log(res)
      // let location = {
      //   name: res.name,
      //   address: res.address,
      //   lat: res.latitude,
      //   lng: res.longitude,
      // }
      // self.options = location
      // app.globalData.addressInfo = location
      state.address = res.name
    },
    fail: function () {
      // fail
    },
    complete: function () {
      // complete
    },
  })
}
onReady(function () {})
onShow(function () {})
onHide(function () {})
onUnload(function () {})
function inputNiceName(e) {
  console.log(e.detail)
  state.nickName = e.detail.value
  if (e.detail.cursor > 10) {
    uni.showToast({
      title: '昵称最大不能超过10个字符哦~',
      icon: 'none',
      duration: 2000,
    })
  }
}
function bindRegionChange(e) {
  const that = this
  state.region = e.detail.value
}
function handleBlur(e) {
  state.detailedLabelShow = false
}
function handleFocus(e) {
  state.detailedLabelShow = true
}
function chooseAddress() {
  const that = this
  const region = state.region
  if (state.configInfoSet.baseAddress && !state.configInfoSet.baseAddress.canUpdate) return false
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
      function regexAddressBean(address, addressBean) {
        regex = /^(.*?[市]|.*?地区|.*?特别行政区|.*?盟|.*?自治州)(.*?[市区县旗])(.*?)$/g
        const addxress = regex.exec(address)
        console.log(addxress)
        addressBean.city = addxress[1]
        addressBean.country = addxress[2]
        addressBean.address = addxress[3]
      }
      if (!(province = regex.exec(res.address))) {
        regex = /^(.*?(省|自治区))(.*?)$/
        province = regex.exec(res.address)
        if (province) {
          addressBean.province = province[1]
          regexAddressBean(province[3], addressBean)
        } else {
          const regexe = /^(.*?)\((.+?)\)$/g
          const data = regexe.exec(res.address)
          console.log(data)
          console.log(region)
          const latitude = res.latitude
          const longitude = res.longitude
          utils.inverseAnalysisAddress(latitude, longitude).then((res) => {
            console.log(res)
            addressBean.province = res.data.result.addressComponent.province
            addressBean.city = res.data.result.addressComponent.city
            addressBean.country = res.data.result.addressComponent.county
            addressBean.address = res.data.result.addressComponent.poi
            state.region = [addressBean.province, addressBean.city, addressBean.country]
          })
          // qqmapsdk.reverseGeocoder({
          //   location: {
          //     latitude: latitude,
          //     longitude: longitude
          //   },
          //   success: function (res) {
          //     console.log(res)
          //     addressBean.province = res.result.address_component.province
          //     addressBean.city = res.result.address_component.city;
          //     addressBean.country = res.result.address_component.district;
          //     that.setData({
          //       region: [
          //         addressBean.province,
          //         addressBean.city,
          //         addressBean.country
          //       ]
          //     })
          //   },
          //   fail: function (res) {
          //     console.log(res);
          //   }
          // })
          addressBean.address = data[2]
          addressName = data[1]
        }
      } else {
        addressBean.province = province[1]
        if (res.poiid && res.poiid === 'City') {
          // 处理IOS第一行数据返回有错
          const regexe = /^(.*?)\((.+?)\)$/g
          const data = regexe.exec(res.name)
          console.log(data)
          const latitude = res.latitude
          const longitude = res.longitude
          utils.inverseAnalysisAddress(latitude, longitude).then((res) => {
            console.log(res)
            addressBean.province = res.data.result.addressComponent.province
            addressBean.city = res.data.result.addressComponent.city
            addressBean.country = res.data.result.addressComponent.county
            addressBean.address = res.data.result.addressComponent.poi
            state.region = [addressBean.province, addressBean.city, addressBean.country]
          })
          // qqmapsdk.reverseGeocoder({
          //   location: {
          //     latitude: latitude,
          //     longitude: longitude
          //   },
          //   success: function (res) {
          //     console.log(res)
          //     addressBean.province = res.result.address_component.province
          //     addressBean.city = res.result.address_component.city;
          //     addressBean.country = res.result.address_component.district;
          //     that.setData({
          //       region: [
          //         addressBean.province,
          //         addressBean.city,
          //         addressBean.country
          //       ]
          //     })
          //   },
          //   fail: function (res) {
          //     console.log(res);
          //   }
          // })
          addressBean.address = data[2]
          addressName = data[1]
          console.log(data, 'data')
        } else {
          regexAddressBean(res.address, addressBean)
        }
      }
      console.log(addressBean)
      if (addressBean.address !== '') {
        state.detailedLabelShow = true
      }
      state.address = addressName
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
function bindDateChange(e) {
  const that = this
  state.date = e.detail.value
  if (!state.popupPrompt) {
    uni.showModal({
      title: '提示',
      content: '会员生日只能设置一次！',
      showCancel: false,
      success(res) {
        if (res.confirm) {
          state.popupPrompt = true
        }
      },
    })
  }
}
function verifyFunOld(e) {
  const self = this
  let verifyFlag = true
  if (!e.detail.value.nickName) {
    uni.showToast({
      title: '请填写昵称',
      icon: 'none',
      duration: 2000,
    })
    verifyFlag = false
  } else if (e.detail.value.nickName.length > 10) {
    uni.showToast({
      title: '昵称最大不能超过10个字符哦~',
      icon: 'none',
      duration: 2000,
    })
    verifyFlag = false
  } else if (
    (!e.detail.value.birthday || e.detail.value.birthday === '未填写') &&
    state.configInfoSet.birthday &&
    state.configInfoSet.birthday.hasMust
  ) {
    uni.showToast({
      title: '请选择生日',
      icon: 'none',
      duration: 2000,
    })
    verifyFlag = false
  } else if (
    (!e.detail.value.region ||
      e.detail.value.region === ['省', '市', '区'] ||
      !e.detail.value.address) &&
    state.configInfoSet.address
  ) {
    console.log(e.detail.value.region, e.detail.value.address, '地址')
    uni.showToast({
      title: '请填写地址',
      icon: 'none',
      duration: 2000,
    })
    verifyFlag = false
  } else if (e.detail.value.address && e.detail.value.address.length > 40) {
    uni.showToast({
      title: '详细地址最大不能超40个字符哦~',
      icon: 'none',
      duration: 2000,
    })
    verifyFlag = false
  }
  return verifyFlag
}
function verifyFunNew(e) {
  let verifyFlag = true
  console.log(e.detail.value)
  const self = this
  const reg = /^[1]([3-9])[0-9]{9}$/
  const idReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  const emialReg = /(^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$)/
  const plateNumberReg =
    /^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z0-9]{6}$|^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z0-9]{5}$/
  if (state.configInfoSet.name && state.configInfoSet.name.hasMust && !e.detail.value.nickName) {
    uni.showToast({
      title: '请填写姓名',
      icon: 'none',
      duration: 2000,
    })
    verifyFlag = false
  } else if (
    state.configInfoSet.name &&
    state.configInfoSet.name.hasMust &&
    e.detail.value.nickName.length > 10
  ) {
    uni.showToast({
      title: '姓名最大不能超过10个字符哦~',
      icon: 'none',
      duration: 2000,
    })
    verifyFlag = false
  } else if (
    state.configInfoSet.mobile &&
    state.configInfoSet.mobile.hasMust &&
    !e.detail.value.mobile
  ) {
    uni.showToast({
      title: '请填写手机号',
      icon: 'none',
      duration: 2000,
    })
    verifyFlag = false
  } else if (
    state.configInfoSet.mobile &&
    state.configInfoSet.mobile.hasMust &&
    !reg.test(e.detail.value.mobile)
  ) {
    uni.showToast({
      title: '请填写正确的手机号',
      icon: 'none',
      duration: 2000,
    })
    verifyFlag = false
  } else if (
    state.configInfoSet.birthday &&
    state.configInfoSet.birthday.hasMust &&
    (!e.detail.value.birthday || e.detail.value.birthday === '未填写')
  ) {
    uni.showToast({
      title: '请选择生日',
      icon: 'none',
      duration: 2000,
    })
    verifyFlag = false
  } else if (state.configInfoSet.idCard && state.configInfoSet.idCard.hasMust && !state.idNum) {
    uni.showToast({
      title: '请填写身份证号',
      icon: 'none',
      duration: 2000,
    })
    verifyFlag = false
  } else if (
    state.configInfoSet.idCard &&
    state.configInfoSet.idCard.hasMust &&
    !idReg.test(state.idNum)
  ) {
    uni.showToast({
      title: '请填写正确的身份证号',
      icon: 'none',
      duration: 2000,
    })
    verifyFlag = false
  } else if (
    state.configInfoSet.gender &&
    state.configInfoSet.gender.hasMust &&
    !(state.userGenders == 0 || state.userGenders == 1)
  ) {
    uni.showToast({
      title: '请填写性别',
      icon: 'none',
      duration: 2000,
    })
    verifyFlag = false
  } else if (
    state.configInfoSet.plateNumber &&
    state.configInfoSet.plateNumber.hasMust &&
    !plateNumberReg.test(state.cityArray[state.cityIndex] + state.plateNumber)
  ) {
    uni.showToast({
      title: '请填写正确车牌号',
      icon: 'none',
      duration: 2000,
    })
    verifyFlag = false
  } else if (state.configInfoSet.email && state.configInfoSet.email.hasMust && !state.email) {
    uni.showToast({
      title: '请填写邮箱',
      icon: 'none',
      duration: 2000,
    })
    verifyFlag = false
  } else if (
    state.configInfoSet.email &&
    state.configInfoSet.email.hasMust &&
    !emialReg.test(state.email)
  ) {
    uni.showToast({
      title: '请填写正确的邮箱',
      icon: 'none',
      duration: 2000,
    })
    verifyFlag = false
  } else if (
    state.configInfoSet.address &&
    state.configInfoSet.address.hasMust &&
    (!e.detail.value.region ||
      e.detail.value.region === ['省', '市', '区'] ||
      !e.detail.value.address)
  ) {
    console.log(e.detail.value.region, e.detail.value.address, '地址')
    uni.showToast({
      title: '请填写地址',
      icon: 'none',
      duration: 2000,
    })
    verifyFlag = false
  } else if (
    state.configInfoSet.address &&
    state.configInfoSet.address.hasMust &&
    e.detail.value.address &&
    e.detail.value.address.length > 40
  ) {
    uni.showToast({
      title: '详细地址最大不能超40个字符哦~',
      icon: 'none',
      duration: 2000,
    })
    verifyFlag = false
  }
  return verifyFlag
}
function handleSave(e) {
  console.log(e.detail.value)
  const self = this
  const verifyPass = state.openRegisterDataPopup ? verifyFunNew(e) : verifyFunOld(e)
  if (!verifyPass) return
  // if (!e.detail.value.nickName) {
  //   wx.showToast({
  //     title: "请填写昵称",
  //     icon: 'none',
  //     duration: 2000
  //   })
  // } else if (e.detail.value.nickName.length > 10) {
  //   wx.showToast({
  //     title: "昵称最大不能超过10个字符哦~",
  //     icon: 'none',
  //     duration: 2000
  //   })
  // } else if (!e.detail.value.date || e.detail.value.date === '未填写') {
  //   wx.showToast({
  //     title: "请选择生日",
  //     icon: 'none',
  //     duration: 2000
  //   })
  // } else if (!e.detail.value.region || e.detail.value.region === ['省', '市', '区'] || !e.detail.value.address) {
  //   console.log(e.detail.value.region, e.detail.value.address, "地址")
  //   wx.showToast({
  //     title: "请填写地址",
  //     icon: 'none',
  //     duration: 2000
  //   })
  // } else if (e.detail.value.address.length > 40) {
  //   wx.showToast({
  //     title: "详细地址最大不能超40个字符哦~",
  //     icon: 'none',
  //     duration: 2000
  //   })
  // } else {
  // 调起接口
  const memberInfo = app.globalData.userInfo.member
  let postData = {
    id: memberInfo.id,
    nickName: e.detail.value.nickName,
    birthday: e.detail.value.birthday
      ? e.detail.value.birthday + ' 00:00:00'
      : e.detail.value.birthday,
    // province: e.detail.value.region[0],
    // city: e.detail.value.region[1],
    // district: e.detail.value.region[2],
    address: e.detail.value.address,
  }
  if (e.detail.value.region && e.detail.value.region.length > 0) {
    postData = {
      ...postData,
      province: e.detail.value.region[0],
      city: e.detail.value.region[1],
      district: e.detail.value.region[2],
    }
  }
  //   开启完善资料
  if (state.openRegisterDataPopup) {
    postData.mobile = e.detail.value.mobile
    ;((postData.birthday = e.detail.value.birthday
      ? e.detail.value.birthday + ' 00:00:00'
      : e.detail.value.birthday),
      (postData.idNum = e.detail.value.idNum),
      (postData.plateNumber = e.detail.value.plateNumber
        ? state.cityArray[state.cityIndex] + e.detail.value.plateNumber
        : e.detail.value.plateNumber),
      (postData.email = e.detail.value.email))
  }
  //   let postData = {
  // id: memberInfo.id,
  // nickName: e.detail.value.nickName,
  // mobile: e.detail.value.mobile,
  // birthday: e.detail.value.birthday + " 00:00:00",
  // idNum: e.detail.value.idNum,
  // plateNumber: e.detail.value.plateNumber,
  // email: e.detail.value.email,
  // province: e.detail.value.region[0],
  // city: e.detail.value.region[1],
  // district: e.detail.value.region[2],
  // address: e.detail.value.address,
  //   }
  if (state.userGenders === -1) {
    memberInfo.gender = 'UNKNOWN'
    postData = {
      ...postData,
      gender: 'UNKNOWN',
    }
  } else if (state.userGenders === 0) {
    memberInfo.gender = 'MALE'
    postData = {
      ...postData,
      gender: 'MALE',
    }
  } else if (state.userGenders === 1) {
    memberInfo.gender = 'FEMALE'
    postData = {
      ...postData,
      gender: 'FEMALE',
    }
  }
  console.log(postData)
  if (postData.id !== null && postData.id !== undefined) {
    memberService
      .update(postData)
      .then((res) => {
        console.log(res)
        utils.setHideLoading(true)
      })
      .then((res) => {
        wxaUserService
          .login()
          .then((res) => {
            console.log(res)
            utils.setHideLoading(false)
            auth.setUser(res)
            app.globalData.userInfo = res && res.member ? res : null
            if (res.member) {
              auth.getDistributor()
              uni.setStorage({
                key: 'wj_member',
                data: res.member,
              })
            } else {
            }
            uni.navigateBack({
              delta: 1,
            })
          })
          .catch((err) => {
            uni.showToast({
              title: err.message,
              icon: 'none',
              duration: 2000,
            })
            uni.navigateBack({
              delta: 1,
            })
          })
      })
      .catch((err) => {
        uni.showToast({
          title: err.message,
          icon: 'none',
          duration: 2000,
        })
      })
  } else {
    uni.showToast({
      title: '您还不是会员，请绑定手机号成为会员~',
      icon: 'none',
      duration: 2000,
    })
  }
  // }
}
</script>
<style scoped>
/* pages/my/my.wxss */

page {
  background-color: #ffffff;
  padding-bottom: 82rpx;
}

.top-info {
  width: 100%;
  height: 300rpx;
  background-size: 100% auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 32rpx;
  position: relative;
  background: white;
  border-bottom: 20rpx solid #f1f1f1;
}

.top-info button {
  width: 180rpx;
  height: 180rpx;
  border-radius: 50%;
  position: absolute;
  top: 0rpx;
  left: 0rpx;
  padding: 0rpx;
  background: #ff8561;
  z-index: 2;
}

.top-info image {
  position: relative;
  width: 180rpx;
  height: 180rpx;
  border-radius: 50%;
  margin-bottom: 15rpx;
  overflow: hidden;
  z-index: 10;
  background: #ff8561;
}

.top-info text {
  position: relative;
  z-index: 10;
  color: #8b8b8c;
}

.info {
  padding: 0 40rpx;
  background: #fff;
}

.info .lable-box {
  height: 110rpx;
  padding-left: 162rpx;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.info .lable-box .lable-item {
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

.info .lable-box .lable-item.active {
  color: #009f55;
  border: 1rpx solid #009f55;
}

.info .lable-box .lable-item:last-of-type {
  margin-right: 0;
}

.info .section {
  background: #fff;
  border-bottom: 1rpx solid #f1f1f1;
  font-size: 28rpx;
  height: 98rpx;
  line-height: 98rpx;
  overflow: auto;
  display: flex;
  position: relative;
}

.section-title {
  color: #454545;
  width: 164rpx;
  float: left;
  text-align: left;
}

.right {
  float: left;
  width: 524rpx;
  position: relative;
  color: #8b8b8c;
  display: flex;
  align-items: center;
}

.right input {
  width: 100%;
}

.right .nickName {
  width: 520rpx;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.address {
  width: 20%;
  height: 30rpx;
  display: flex;
  align-items: center;
  flex: 1 0 auto;
}

.address-img {
  width: 25rpx;
  height: 30rpx;
  margin-right: 8rpx;
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
  /* margin-top: 60rpx; */
  position: fixed;
  bottom: 50rpx;
  left: 50%;
  margin-left: -335rpx;
}

.section-box {
  padding: 20rpx 20rpx 80rpx;
  width: 100%;
  box-sizing: border-box;
}
.section-box .section {
  background: #fff;
  /* border-bottom: 1rpx solid #f1f1f1; */
  font-size: 28rpx;
  height: 80rpx;
  line-height: 80rpx;
  overflow: auto;
  display: flex;
  align-items: center;
  position: relative;
  margin-bottom: 25rpx;
}

.section-box .section-title {
  color: #454545;
  width: 114rpx;
  /* float: left; */
  text-align: left;
  margin-right: 33rpx;
  display: flex;
  /* justify-content: space-between; */
  white-space: nowrap;
}
.section-box .section-title text {
  color: #f56c6c;
  font-size: 24rpx;
}

.section-box .right {
  /* float: left; */
  width: 543rpx;
  height: 80rpx;
  position: relative;
  font-family: Source Han Sans CN;
  font-size: 28rpx;
  color: #8b8b8c;
  padding: 0 30rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  border-radius: 40rpx;
  border: 1px solid #dddddd;
}
.gray {
  background: #dddddd;
}
.right .city-box {
  width: 140rpx;
  position: relative;
}
.right .city-box image {
  position: absolute;
  right: 45rpx;
  top: 35rpx;
  width: 25rpx;
  height: 15rpx;
}
.right input {
  width: 100%;
  color: #8b8b8c;
}

.right .nickName {
  width: 520rpx;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.section-box .section-address {
  height: 120rpx;
}
.section-box .section-address .right {
  height: 110rpx;
}
.address-text {
  font-size: 28rpx;
  height: 110rpx;
  padding: 12rpx 0;
  line-height: 36rpx;
  width: 80%;
  box-sizing: border-box;
  color: #8b8b8c;
}
.section-box .address-picker,
.picker {
  width: 480rpx;
  height: 80rpx;
  color: #8b8b8c;
  line-height: 80rpx;
  /* background: #f00; */
}
.section-box .address {
  width: 20%;
  height: 30rpx;
  display: flex;
  align-items: center;
  color: #eb702d;
}

.section-box .address-img {
  width: 25rpx;
  height: 30rpx;
  margin-right: 8rpx;
}

.section-box .lable-box {
  width: 543rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-box .lable-box .lable-item {
  font-size: 24rpx;
  line-height: 72rpx;
  width: 250rpx;
  height: 72rpx;
  border-radius: 40rpx;
  border: 1px solid #dddddd;
  color: #8b8b8c;
  margin-right: 30rpx;
  text-align: center;
  font-family: Source Han Sans CN;
  font-size: 28rpx;
  color: #999999;
  box-sizing: border-box;
}

.section-box .lable-box .lable-item.active {
  color: #fff;
  border: 1px solid #009f55;
}
.active {
  background: #eb702d;
  border-color: transparent;
}
.section-box .lable-box .lable-item:last-of-type {
  margin-right: 0;
}
</style>
