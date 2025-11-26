<template>
<!-- pages/addAddress/addAddress.wxml -->
<navigationBar :title="state.navigationBarTitle"></navigationBar>
<form>
  <view class="choose-address">
    <view class="section detailed">
      <view class="section-title">退货地址</view>
      <view class="right">
        <textarea type="text" disabled="true" placeholder="如道路、门牌号、小区、楼栋号、单元室等" maxlength="50" placeholder-class="placeholder" :style="'padding-top:' + (state.systemDetail ? '12rpx' : '26rpx') + ';padding-left:0;'" id="detailed" name="details" :value="state.details" @input="handleDetails" @blur="handleBlur" @focus="handleFocus">       
      </textarea></view>
    </view>
    <view class="lable-box">
      <view class="section-title">快递单号</view>
      <input type="text" :disabled="order.refundTrackingNumber" placeholder="请填写快递单号" :value="state.phone" name="phone" @input="handlePhone">
      <image @click="scanCode" class="imageAc" src="http://wmsaas-prod.oss-cn-beijing.aliyuncs.com/wmsaas-prod/20221110/1590532632750342145/%E5%BD%A2%E7%8A%B6%201@2x.png"></image>
    </view>
    <view class="section choose-city">
        <view class="section-title">快递公司</view>
        <picker :disabled="order.refundTrackingCompany" class="region" @change="bindRegionChange" :range="state.courierOptions" placeholder="请选择" :value="state.courierOptionsIndex" range-key="label">
          <view class="address-picker">{{state.region}}</view>
          <image :src="state.imagesPath.iconPointRight"></image>
        </picker>
      </view>
  </view>
  <button v-if="!order.refundTrackingNumber" class="btn" :style="'background: ' + state.defaultColor" @click="handleSave">提交</button>
  
</form>
</template>
<script setup>
import _utilsUtilsJs from "@/utils/newretail/utils";
import _utilsThemeManagerJs from "@/utils/newretail/themeManager";
import _utilsAddressJs from "@/utils/newretail/address";
import _utilsAnalysisJs from "@/utils/newretail/analysis";
import _libsMta_analysisJs from "@/libs/mta_analysis";
import _utilsImagesPathJs from "@/utils/newretail/imagesPath";
import _libsQqmapWxJssdkMinJs from "@/libs/qqmap-wx-jssdk";
import _apiOrderServiceJs from "@/service/api/newretail/orderService";
import _apiAddressServiceJs from "@/service/api/newretail/addressService";
// import { onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from "vue";
const app = getApp();

// pages/addAddress/addAddress.js
const addressService = _apiAddressServiceJs;
const orderService = _apiOrderServiceJs;
let QQMapWX = _libsQqmapWxJssdkMinJs;
let qqmapsdk;
const IMGAGESPATH = _utilsImagesPathJs;
const mta = _libsMta_analysisJs;
const ANALYSIS = _utilsAnalysisJs;
const ADDRESS = _utilsAddressJs;
const themeManager = _utilsThemeManagerJs;
const util = _utilsUtilsJs;

//获取应用实例
const state = reactive({
  navigationBarTitle: "填写物流",
  imagesPath: IMGAGESPATH,
  courierOptions: [{
    value: "SHUNFENG",
    label: "顺丰"
  }, {
    value: "SHENTONG",
    label: "申通"
  }, {
    value: "YUANTONG",
    label: "圆通"
  }, {
    value: "ZHONGTONG",
    label: "中通"
  }, {
    value: "HUITONGKUAIDI",
    label: "汇通"
  }, {
    value: "YUNDA",
    label: "韵达"
  }, {
    value: "ZHAIJISONG",
    label: "宅急送"
  }, {
    value: "DEBANGWULIU",
    label: "德邦物流"
  }, {
    value: "KUAIFUWU",
    label: "快服务"
  }, {
    value: "HUITONGKUAIDI",
    label: "汇通快递"
  }, {
    value: "BAISHIWULIU",
    label: "百世物流"
  }, {
    value: "JD",
    label: "京东"
  }, {
    value: "EMS",
    label: "EMS"
  }, {
    value: "TIANTIAN",
    label: "天天"
  }, {
    value: "YOUZHENGGUONEI",
    label: "邮政快递"
  }, {
    value: "OTHER",
    label: "其他"
  }],
  courierOptionsIndex: 0,
  region: '请选择',
  name: '',
  phone: '',
  details: '',
  houseNumber: ' ',
  addressInfo: {},
  defaultColor: themeManager.color,
  isDefault: false,
  detailedLabelShow: false,
  genders: [{
    name: '先生',
    value: 'MALE',
    id: 0
  }, {
    name: '女士',
    value: 'FEMALE',
    id: 1
  }],
  labels: [{
    name: '家',
    id: 0
  }, {
    name: '公司',
    id: 1
  }, {
    name: '学校',
    id: 2
  }],
  currentLabel: -1,
  userGenders: -1,
  systemDetail: false,
  pageType: 'normal'
});
function scanCode() {
  if (state.order.refundTrackingNumber) {
    return;
  }
  let that = this;
  uni.scanCode({
    //扫描API
    success(res) {
      //扫描成功
      console.log(res); //输出回调信息
      state.phone = res.result;
      uni.showToast({
        title: '扫码成功',
        icon: 'success',
        duration: 1000
      });
    },
    fail: res => {
      //接口调用失败的回调函数
      uni.showToast({
        title: '扫码失败',
        icon: 'success',
        duration: 1000
      });
    }
  });
}
function handleClick(e) {
  const that = this;
  let index = e.currentTarget.dataset.index;
  let type = e.currentTarget.dataset.type;
  if (type === 'gender') {
    if (state.userGenders !== index) {
      state.userGenders = index;
    } else {
      state.userGenders = -1;
    }
  } else if (type === 'label') {
    if (state.currentLabel !== index) {
      state.currentLabel = index;
    } else {
      state.currentLabel = -1;
    }
  }
}
function doDeleteAddress() {
  const that = this;
  let id = state.addressInfo.id;
  if (id && id != '') {
    uni.showModal({
      title: '提示',
      content: '请确认要删除地址？',
      success: function (res) {
        if (res.confirm) {
          addressService.removeById(id).then(res => {
            console.log(res);
            uni.showToast({
              title: "删除成功~",
              icon: 'none',
              duration: 2000
            });
            try {
              let value = uni.getStorageSync('wj_chooseAddressInfo');
              if (value) {
                if (value.id === id) {
                  uni.removeStorageSync('wj_chooseAddressInfo');
                }
              }
            } catch (e) {
              // Do something when catch error
            }
            setTimeout(() => {
              uni.navigateBack({
                delta: 1
              });
            }, 2000);
          }).catch(e => {
            uni.showToast({
              title: "删除失败~",
              icon: 'none',
              duration: 2000
            });
          });
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    });
  } else {}
}
function handleFocus(e) {
  state.detailedLabelShow = true;
}
function handleBlur(e) {
  state.detailedLabelShow = false;
}
function bindRegionChange(e) {
  let that = this;
  let courierOptions = state.courierOptions;
  state.region = courierOptions[e.detail.value].label;
  state.trackingCompany = courierOptions[e.detail.value].value;
}
function handleDetails(e) {
  if (e.detail.cursor < 40) {
    state.details = e.detail.value;
  } else if (e.detail.cursor === 40) {
    state.details = e.detail.value;
    uni.showToast({
      title: '详细地址最大不能超50个字符哦~',
      icon: 'none',
      duration: 2000
    });
  } else {}
}
function handleHouseNumber(e) {
  console.log(e.detail);
  if (e.detail.cursor < 40) {
    state.houseNumber = e.detail.value;
  } else if (e.detail.cursor === 40) {
    state.houseNumber = e.detail.value;
    uni.showToast({
      title: '详细地址最大不能超50个字符哦~',
      icon: 'none',
      duration: 2000
    });
  } else {}
}
function handleName(e) {
  if (e.detail.cursor < 10) {
    state.name = e.detail.value;
  } else if (e.detail.cursor === 10) {
    state.name = e.detail.value;
    uni.showToast({
      title: '联系人昵称最大不能超10个字符哦~',
      icon: 'none',
      duration: 2000
    });
  } else {}
}
function orderActive(orderId) {
  let that = this;
  let courierOptions = state.courierOptions;
  orderService.getDetailsByIdV2(orderId, true).then(res => {
    if (res) {
      if (res.refundTrackingNumber) {
        state.phone = res.refundTrackingNumber;
        state.navigationBarTitle = "查看物流信息";
      }
      if (res.refundTrackingCompany) {
        courierOptions.forEach(item => {
          if (item.value == res.refundTrackingCompany) {
            state.region = item.label;
          }
        });
        // this.setData({
        //   phone:res.refundTrackingNumber
        // })
      }
      state.order = res;
    }
  }).catch(e => {
    uni.showToast({
      title: e.message,
      icon: 'none',
      duration: 2000
    });
  });
}
function handlePhone(e) {
  state.phone = e.detail.value;
}
function handleDefault(e) {
  state.isDefault = e.detail.value;
}
function handleSave(e) {
  // e.detail.value.houseNumber = " "
  // console.log(e.detail.value)
  if (!canSave) {
    console.log("已经在保存了");
    return;
  }
  canSave = false;
  let self = this;
  if (!state.phone) {
    uni.showToast({
      title: "请输入快递单号",
      icon: 'none',
      duration: 2000
    });
    canSave = true;
  } else if (state.region == '请选择') {
    uni.showToast({
      title: "请选择快递公司",
      icon: 'none',
      duration: 2000
    });
    canSave = true;
  } else {
    let that = this;
    uni.showModal({
      title: '提示',
      content: '请确认单号填写正确' + '   ' + state.region + ' ' + state.phone,
      success: function (res) {
        if (res.confirm) {
          //这里是点击了确定以后
          try {
            let postData = {
              trackingCompany: state.trackingCompany,
              trackingNumber: state.phone,
              refundId: state.refundId
            };
            addressService.completeRefundOrderTracking(postData).then(item => {
              if (item) {
                uni.showToast({
                  title: "填写成功",
                  icon: 'none',
                  duration: 2000
                });
                uni.navigateTo({
                  url: '/pages-sub/newretail/pages/mallModule/order/order/order'
                });
              }
            }).catch(err => {
              canSave = true;
              uni.showToast({
                title: err.message,
                icon: 'none',
                duration: 2000
              });
            });

            // var value = wx.getStorageSync('wj_member')
            // if (value) {
            //   if (self.location) {
            //     self.handleAddressSave(e, value, this.location.latitude, this.location.longitude)

            //   } else {
            //     // 没有经纬度需要解析
            //     qqmapsdk.geocoder({
            //       address: e.detail.value.region[0] + e.detail.value.region[1] + e.detail.value.region[2] + e.detail.value.details + e.detail.value.houseNumber,
            //       success: function (res) {
            //         console.log(res);
            //         self.handleAddressSave(e, value, res.result.location.lat, res.result.location.lng)
            //       },
            //       fail: function (res) {
            //         console.log(res);
            //       }
            //     });
            //   }
            // }
          } catch (e) {
            // Do something when catch error
            canSave = true;
          }
        } else {
          //这里是点击了取消以后
          canSave = true;
        }
      }
    });
  }
}
function handleAddressSave(e, member, lat, lng) {
  const self = this;
  if (options.doEditAddress === "edit") {
    // 修改地址
    let postData = {
      id: state.addressInfo.id,
      userId: member.id,
      province: e.detail.value.region[0],
      city: e.detail.value.region[1],
      county: e.detail.value.region[2],
      detailedAddress: e.detail.value.details,
      houseNum: e.detail.value.houseNumber,
      contactsMobile: e.detail.value.phone,
      contacts: e.detail.value.name,
      defaultAddress: e.detail.value.isDefault,
      latitude: lat,
      longitude: lng
    };
    if (state.userGenders === -1) {
      postData = {
        ...postData,
        gender: 'UNKNOWN'
      };
    } else if (state.userGenders === 0) {
      postData = {
        ...postData,
        gender: 'MALE'
      };
    } else if (state.userGenders === 1) {
      postData = {
        ...postData,
        gender: 'FEMALE'
      };
    }
    const tab = state.currentLabel;
    const labels = state.labels;
    if (tab !== -1) {
      labels.forEach(item => {
        if (item.id === tab) {
          postData = {
            ...postData,
            label: item.name
          };
        }
      });
    } else {
      postData = {
        ...postData,
        label: ''
      };
    }
    addressService.update(postData).then(res => {
      uni.navigateBack({
        delta: 1
      });
    }).catch(err => {
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000
      });
    });
  } else {
    // 新增地址
    let postData = {
      userId: member.id,
      province: e.detail.value.region[0],
      city: e.detail.value.region[1],
      county: e.detail.value.region[2],
      detailedAddress: e.detail.value.details,
      houseNum: e.detail.value.houseNumber,
      contactsMobile: e.detail.value.phone,
      contacts: e.detail.value.name,
      defaultAddress: e.detail.value.isDefault,
      latitude: lat,
      longitude: lng
    };
    if (state.userGenders === -1) {
      postData = {
        ...postData,
        gender: 'UNKNOWN'
      };
    } else if (state.userGenders === 0) {
      postData = {
        ...postData,
        gender: 'MALE'
      };
    } else if (state.userGenders === 1) {
      postData = {
        ...postData,
        gender: 'FEMALE'
      };
    }
    const tab = state.currentLabel;
    const labels = state.labels;
    if (tab !== -1) {
      labels.forEach(item => {
        if (item.id === tab) {
          postData = {
            ...postData,
            label: item.name
          };
        }
      });
    } else {
      postData = {
        ...postData,
        label: ''
      };
    }
    addressService.create(postData).then(res => {
      uni.navigateBack({
        delta: 1
      });
    }).catch(err => {
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000
      });
    });
  }
}
function chooseAddress() {
  const that = this;
  const region = state.region;
  console.log(region);
  uni.chooseLocation({
    success: function (res) {
      // success
      console.log(res, "location");
      location = {
        latitude: res.latitude,
        longitude: res.longitude
      };
      let regex = /^(北京市|天津市|重庆市|上海市|香港特别行政区|澳门特别行政区)/;
      let province = [];
      let addressBean = {
        province: null,
        country: null,
        city: null,
        address: null
      };
      let addressName = res.name;
      function regexAddressBean(address, addressBean) {
        regex = /^(.*?[市]|.*?地区|.*?特别行政区|.*?盟|.*?自治州)(.*?[市区县旗])(.*?)$/g;
        let addxress = regex.exec(address);
        console.log(addxress);
        addressBean.city = addxress[1];
        addressBean.country = addxress[2];
        addressBean.address = addxress[3];
      }
      if (!(province = regex.exec(res.address))) {
        regex = /^(.*?(省|自治区))(.*?)$/;
        province = regex.exec(res.address);
        if (province) {
          addressBean.province = province[1];
          regexAddressBean(province[3], addressBean);
        } else {
          let regexe = /^(.*?)\((.+?)\)$/g;
          let data = regexe.exec(res.address);
          console.log(data);
          console.log(region);
          let latitude = res.latitude;
          let longitude = res.longitude;
          util.inverseAnalysisAddress(latitude, longitude).then(res => {
            console.log(res);
            addressBean.province = res.data.result.addressComponent.province;
            addressBean.city = res.data.result.addressComponent.city;
            addressBean.country = res.data.result.addressComponent.county;
            addressBean.address = res.data.result.addressComponent.poi;
            state.region = [addressBean.province, addressBean.city, addressBean.country];
          });
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
          addressBean.address = data[2];
          addressName = data[1];
        }
      } else {
        addressBean.province = province[1];
        if (res.poiid && res.poiid === 'City') {
          // 处理IOS第一行数据返回有错
          let regexe = /^(.*?)\((.+?)\)$/g;
          let data = regexe.exec(res.name);
          console.log(data);
          let latitude = res.latitude;
          let longitude = res.longitude;
          util.inverseAnalysisAddress(latitude, longitude).then(res => {
            console.log(res);
            addressBean.province = res.data.result.addressComponent.province;
            addressBean.city = res.data.result.addressComponent.city;
            addressBean.country = res.data.result.addressComponent.county;
            addressBean.address = res.data.result.addressComponent.poi;
            state.region = [addressBean.province, addressBean.city, addressBean.country];
          });
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
          addressBean.address = data[2];
          addressName = data[1];
        } else {
          regexAddressBean(res.address, addressBean);
        }
      }
      console.log(addressBean);
      if (addressBean.address !== '') {
        state.detailedLabelShow = true;
      }
      state.details = addressName;
      state.houseNumber = addressBean.address;
      state.region = [addressBean.province, addressBean.city, addressBean.country];
    },
    fail: function () {
      // fail
    },
    complete: function () {
      // complete
    }
  });
}
onLoad(function (options) {
  state.details = options.address;
  state.refundId = options.refundId;
  orderActive(options.orderid);
  uni.hideShareMenu();
  canSave = true;
  let phone = {
    // ...wx.getSystemInfoSync(),
    ...uni.getSystemSetting(),
    ...uni.getAppAuthorizeSetting(),
    ...uni.getDeviceInfo(),
    ...uni.getWindowInfo(),
    ...uni.getAppBaseInfo()
  }; //调用方法获取机型
  let detail = null;
  if (phone.platform == 'ios') {
    detail = true;
  } else if (phone.platform == 'android') {
    detail = false;
  }
  // 实例化API核心类
  state.systemDetail = detail;
  ADDRESS.getTenXunKey().then(() => {
    console.log(2333366666);
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      //   key: 'ENCBZ-HOS6C-F572J-A5J7T-3GCRH-IEFF4'
      key: app.globalData.systemConfigure.lbsTencentMiniappKey
    });
  });
  let self = this;
  if (options.doEditAddress === "edit") {
    state.navigationBarTitle = '修改收货地址';
    state.pageType = 'edit';
    try {
      let startAddress = uni.getStorageSync('wj_editAddress');
      let addressId = startAddress.id;
      addressService.query().then(res => {
        res.forEach(item => {
          if (item.id === addressId) {
            state.addressInfo = item;
            let address = state.addressInfo;
            let detailedAddress = address.detailedAddress;
            if (address.houseNum && address.houseNum !== " ") {
              detailedAddress = detailedAddress + address.houseNum;
            }
            state.region = [address.province, address.city, address.county];
            state.name = address.contacts;
            state.phone = address.contactsMobile;
            state.details = detailedAddress;
            state.houseNumber = " ";
            state.isDefault = address.defaultAddress;
            if (item.gender === "UNKNOWN") {
              state.userGenders = -1;
            } else if (item.gender === "MALE") {
              state.userGenders = 0;
            } else if (item.gender === "FEMALE") {
              state.userGenders = 1;
            }
            let label = item.label;
            const labels = state.labels;
            labels.forEach(item => {
              if (item.name == label) {
                state.currentLabel = item.id;
              }
            });
          }
        });
      }).catch(err => {
        uni.showToast({
          title: err.message,
          icon: 'none',
          duration: 2000
        });
      });
    } catch (e) {}
  } else {
    try {
      let locationInfo = uni.getStorageSync('wj_locationInfo');
      if (locationInfo) {
        // Do something with return value
        console.log(locationInfo);
        // self.setData({
        //   region: [
        //     locationInfo.ad_info.province,
        //     locationInfo.ad_info.city,
        //     locationInfo.ad_info.district,
        //   ],
        //   details: locationInfo.title,
        //   houseNumber: locationInfo.address,
        // })
        uni.removeStorageSync('wj_locationInfo');
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
    ANALYSIS.PVStatistics(app.globalData.storeInfo.id);
  }
  location = null;
});
function getUserAddress() {
  const that = this;
  uni.getLocation({
    type: 'gcj02',
    success: function (res) {
      console.log(res);
      let latitude = res.latitude;
      let longitude = res.longitude;
      util.inverseAnalysisAddress(latitude, longitude).then(res => {
        console.log(res);
        state.region = [addressBean.province, addressBean.city, addressBean.country];
      });
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
    }
  });
}
onReady(function () {});
onShow(function () {});
onHide(function () {});
onUnload(function () {});
onPullDownRefresh(function () {});
onReachBottom(function () {});
onShareAppMessage(function () {});
</script>
<style scoped>
/* pages/addAddress/addAddress.wxss */

page {
    width: 100%;
    background-color: rgb(245, 245, 245);
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
  position: relative;
}
.imageAc{
    position: absolute;
    width: 28rpx;
    height: 28rpx;
    right: 20rpx;
}
.choose-address {
    width: 710rpx;
    background-color: #fff;
  /* margin-bottom: 40rpx; */
  padding: 0 18rpx;
  margin: 0 auto;
  box-sizing: border-box;
  margin-top: 24rpx;
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
  padding: 27rpx 0;
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
  padding-top: 26rpx;
  line-height: 36rpx;
  font-size: 28rpx;
}

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
  position: relative;
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
  border-radius: 6rpx;
  border: none;
  background: #009f55;
  position: fixed;
  bottom: 90rpx;
  left: 50%;
  transform: translateX(-50%);
}

.btn-delelte {
  font-size: 32rpx;
  font-weight: bold;
  height: 100rpx;
  line-height: 100rpx;
  width: 670rpx;
  border-radius: 6rpx;
  border: none;
  color: #009f55;
  background: #fff;
  border: 1rpx solid #009f55;
  margin-top: 30rpx;
}
</style>