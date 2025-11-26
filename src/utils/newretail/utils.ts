/**
 * 工具类
 */

// 引入SDK核心类
// var QQMapWX = require('../libs/qqmap-wx-jssdk.min.js');
import QQMapWX from '@/libs/qqmap-wx-jssdk';
var qqmapsdk;

const KEY_SHARINGINFO = "wj_sharingInfo";
const KEY_SHAREING_GIFT_CARD = "wj_sharing_gift_card"
const KEY_WXA_FORMID = "wj_wxa_formId"


/**
 * 是否隐藏loading
 */
var _hide_loading;

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const timestampToTime = timestamp => {
  var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = formatNumber(date.getDate()) + ' ';
  var h = formatNumber(date.getHours()) + ':';
  var m = formatNumber(date.getMinutes()) + ':';
  var s = formatNumber(date.getSeconds());
  return Y + M + D + h + m + s;
}

// 计算两个经纬度之间的距离
const distance = (la1, lo1, la2, lo2) => {
    var La1 = la1 * Math.PI / 180.0;
    var La2 = la2 * Math.PI / 180.0;
    var La3 = La1 - La2;
    var Lb3 = lo1 * Math.PI / 180.0 - lo2 * Math.PI / 180.0;
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)));
    s = s * 6378.137; //地球半径
    s = Math.round(s * 10000) / 10000;
    // console.log("计算结果",s)
    return s
  }

  /**
   * 解析导航路线 XML 数据
   * @param {string} xmlString - XML 字符串
   * @returns {object} 解析后的导航数据对象
   */
  function parseNavigationXML(xmlString) {
    // 创建一个简单的 XML 解析函数
    function getTagContent(xml, tag) {
      const reg = new RegExp(`<${tag}[^>]*>(.*?)</${tag}>`, 'i');
      const match = xml.match(reg);
      return match ? match[1].trim() : '';
    }

    function getTagAttribute(xml, tag, attr) {
      const reg = new RegExp(`<${tag}[^>]*${attr}=['"]([^'"]*)['"]/?>`, 'i');
      const match = xml.match(reg);
      return match ? match[1] : '';
    }

    function getAllTags(xml, tag) {
      const reg = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'gi');
      const matches = [];
      let match;
      while ((match = reg.exec(xml)) !== null) {
        matches.push(match[0]);
      }
      return matches;
    }

    // 解析基本信息
    const result = {
      parameters: {
        orig: getTagContent(xmlString, "orig"),
        dest: getTagContent(xmlString, "dest"),
        mid: getTagContent(xmlString, "mid"),
        key: getTagContent(xmlString, "key"),
        width: getTagContent(xmlString, "width"),
        height: getTagContent(xmlString, "height"),
        style: getTagContent(xmlString, "style"),
        version: getTagContent(xmlString, "version"),
        sort: getTagContent(xmlString, "sort")
      },
      routes: [],
      simple: [],
      distance: getTagContent(xmlString, "distance"),
      duration: getTagContent(xmlString, "duration"),
      routelatlon: getTagContent(xmlString, "routelatlon"),
      mapinfo: {
        center: getTagContent(xmlString, "center"),
        scale: getTagContent(xmlString, "scale")
      }
    };

    // 解析详细路线信息
    const routeItems = getAllTags(xmlString, "item");
    const routesSection = getTagContent(xmlString, "routes");
    const routeItemsInRoutes = routeItems.filter(item => routesSection.includes(item));
    
    routeItemsInRoutes.forEach(item => {
      result.routes.push({
        id: getTagAttribute(item, "item", "id"),
        strguide: getTagContent(item, "strguide"),
        signage: getTagContent(item, "signage"),
        streetName: getTagContent(item, "streetName"),
        nextStreetName: getTagContent(item, "nextStreetName"),
        tollStatus: parseInt(getTagContent(item, "tollStatus")) || 0,
        turnlatlon: getTagContent(item, "turnlatlon")
      });
    });

    // 解析简化路线信息
    const simpleSection = getTagContent(xmlString, "simple");
    const simpleItems = getAllTags(xmlString, "item").filter(item => simpleSection.includes(item));
    
    simpleItems.forEach(item => {
      result.simple.push({
        id: getTagAttribute(item, "item", "id"),
        strguide: getTagContent(item, "strguide"),
        streetNames: getTagContent(item, "streetNames"),
        lastStreetName: getTagContent(item, "lastStreetName"),
        linkStreetName: getTagContent(item, "linkStreetName"),
        signage: getTagContent(item, "signage"),
        tollStatus: parseInt(getTagContent(item, "tollStatus")) || 0,
        turnlatlon: getTagContent(item, "turnlatlon"),
        streetLatLon: getTagContent(item, "streetLatLon"),
        streetDistance: parseInt(getTagContent(item, "streetDistance")) || 0,
        segmentNumber: getTagContent(item, "segmentNumber")
      });
    });

    return result;
  }

//天地图 计算两个经纬度之间的骑行距离
const TiandituCalculateDistanceBicycling = (la1, lo1, la2, lo2) => {
    console.log(la1, lo1, la2, lo2)
        //获取应用实例
        const app = getApp()
        console.log(app.globalData.systemConfigure.lbsTiandituAppkey)
    let params = 'postStr={"orig":"' + lo2+','+ la2 + '","dest":"' + lo1 + ',' + la1 + '","style":"0"}&type=3&tk=' + app.globalData.systemConfigure.lbsTiandituAppkey
    // let params = 'postStr={"orig":"' + lo1 + ',' + la1 + '","dest":"' + lo2+','+ la2+ '","style":"0"}&type=3&tk=e2ef73ee013a8ed797422cd5d86cfe29'
    return new Promise(function (resolve, reject) {
        // 调用接口
        wx.request({
            //地图WebserviceAPI地点搜索接口请求路径及参数（具体使用方法请参考开发文档）
            url: 'https://api.tianditu.gov.cn/drive?' + params,
            success(res){
                let lastData = parseNavigationXML(res.data)
                resolve(lastData)
            },
            fail(err) {
                wx.showToast({
                    title: '该地址超出配送范围，请重新修改收货地址~',
                    icon: 'none',
                    duration: 3500
                })
                reject(err)
            }
        })
    });
}

//天地图  逆地理编码
const TiandituGetData = (lat, lon) => {
    // console.log(lat, lon)
    //获取应用实例
    const app = getApp()
    let params = 'postStr={lon:' + lon + ',lat:' + lat + ',ver:1}&type=geocode&tk=' + app.globalData.systemConfigure.lbsTiandituAppkey
    // let params = 'postStr={lon:' + lon + ',lat:' + lat + ',ver:1}&type=geocode&tk=e2ef73ee013a8ed797422cd5d86cfe29'
    return new Promise(function (resolve, reject) {
        // 调用接口
        wx.request({
            //地图WebserviceAPI地点搜索接口请求路径及参数（具体使用方法请参考开发文档 http://lbs.tianditu.gov.cn/server/geocoding.html）
            url: 'https://api.tianditu.gov.cn/geocoder?' + params,
            success(res){
                resolve(res)
            },
            fail(err) {
                wx.showToast({
                    title: '该地址超出配送范围，请重新修改收货地址~',
                    icon: 'none',
                    duration: 3500
                })
                reject(err)
            }
        })
    });
}

//天地图  地理编码
const TiandituGetlat = (keyWord) => {
  //获取应用实例
  const app = getApp()
  console.log(app.globalData.systemConfigure.lbsTiandituAppkey)
  let params = 'ds={keyWord:' + keyWord + '}&tk=' + app.globalData.systemConfigure.lbsTiandituAppkey
  // let params = 'postStr={lon:' + lon + ',lat:' + lat + ',ver:1}&type=geocode&tk=e2ef73ee013a8ed797422cd5d86cfe29'
  return new Promise(function (resolve, reject) {
      // 调用接口
      wx.request({
          //地图WebserviceAPI地点搜索接口请求路径及参数（具体使用方法请参考开发文档 http://lbs.tianditu.gov.cn/server/geocoding.html）
          url: 'https://api.tianditu.gov.cn/geocoder?' + params,
          success(res){
              resolve(res)
          },
          fail(err) {
              reject(err)
          }
      })
  });
}

//高德地图 计算两个经纬度之间的骑行距离
const AutonaviCalculateDistanceBicycling = (la1, lo1, la2, lo2) => {
  const app = getApp()
  let params = `&origin=${lo2+','+ la2}&destination=${lo1 + ',' + la1}&key=${app.globalData.systemConfigure.lbsAutonaviAppkey}`
  return new Promise(function (resolve, reject) {
      // 调用接口
      wx.request({
          url: 'https://restapi.amap.com/v5/direction/bicycling?' + params, // 骑行规划
          // url: 'https://restapi.amap.com/v5/direction/electrobike?' + params, // 电动车路径规划
          success(res){
            if(res.data && res.data.route && res.data.route.paths.length > 0) {
              let lastData = {
                ...res.data.route,
                duration: res.data.route.paths[0].duration,
                // 兼容天地图逻辑，米转公里
                distance: res.data.route.paths[0].distance ? res.data.route.paths[0].distance / 1000 : res.data.route.paths[0].distance,
              }
              resolve(lastData)
            } else {
              // wx.showToast({
              //   title: '该地址超出配送范围，请重新修改收货地址~',
              //   icon: 'none',
              //   duration: 3500
              // })
              reject({})
            }
          },
          fail(err) {
              reject(err)
          }
      })
  });
}
//高德地图  逆地理编码
const AutonaviGetData = (lat, lon) => {
  //获取应用实例
  const app = getApp()
  let params = `location=${lon + ',' + lat}&key=${app.globalData.systemConfigure.lbsAutonaviAppkey}&radius=1000&extensions=all`
  return new Promise(function (resolve, reject) {
      // 调用接口
      wx.request({
          url: 'https://restapi.amap.com/v3/geocode/regeo?' + params,
          success(res){
              if(res.data && res.data.regeocode) {
                res.data.regeocode.addressComponent.street = res.data.regeocode.addressComponent.township
                res.data.regeocode.addressComponent.county = res.data.regeocode.addressComponent.district
                res.data.regeocode.addressComponent.address = res.data.regeocode.addressComponent.street
                res.data.regeocode.addressComponent.poi = res.data.regeocode.pois && res.data.regeocode.pois[0] ? res.data.regeocode.pois[0].address : ''
                let returnData = {
                  ...res.data.regeocode,
                }
                resolve({
                  data: {
                    result: returnData
                  }
                })
              } else {
                reject(res)
              }
          },
          fail(err) {
            reject(err)
          }
      })
  });
}
//高德地图  地理编码
const AutonaviGetlat = (keyWord) => {
  //获取应用实例
  const app = getApp()
  let params = `address=${keyWord}&key=${app.globalData.systemConfigure.lbsAutonaviAppkey}`
  return new Promise(function (resolve, reject) {
      // 调用接口
      wx.request({
          url: 'https://restapi.amap.com/v3/geocode/geo?' + params,
          success(res){
            if(res.data && res.data.geocodes && res.data.geocodes.length > 0){
              let location = res.data.geocodes[0].location ? res.data.geocodes[0].location.split(',') : []
              let returnData = {
                ...res.data.geocodes[0],
                lat: location[1],
                lon: location[0],
                location: {
                  lat: location[1],
                  lon: location[0],
                }
              }
              resolve({
                data: returnData
              })
            } else {
              reject(res)
            }
          },
          fail(err) {
              reject(err)
          }
      })
  });
}
// 腾讯地图 地址解析经纬度
const tenxunGetlat = (address) => {
  let app = getApp()
  // 实例化API核心类
  qqmapsdk = new QQMapWX({
      //   key: 'ENCBZ-HOS6C-F572J-A5J7T-3GCRH-IEFF4'
      key: app.globalData.systemConfigure.lbsTencentMiniappKey
  });
  return new Promise(function (resolve, reject) {
    qqmapsdk.geocoder({
      address: address,
      success: function (res) {
        if(res && res.result){
          res.lon
          resolve({
            data: {
              ...res.result,
              location: {
                lat: res.result.location.lat,
                lon: res.result.location.lng,
              }
            }
          })
        } else {
          reject(res)
        }
      },
      fail: function (err) {
        reject(err)
      }
    });
  });
}
// 地址解析经纬度
const addressResolution = (defaultAddress, that, reject1, resolve1) => {
  const app = getApp()
  return new Promise(async function (resolve, reject) {
    if(app.globalData.systemConfigure.deliveryDistanceThirdMap == 'TIANDITU') {
      await TiandituGetlat(defaultAddress).then(res => {
        if(resolve1) {
          resolve1(res)
        } else {
          resolve(res)
        }
      }).catch(async (err) => {
        await guaranteeMap(that, app, reject1 ? reject1 : reject, resolve, defaultAddress, null, null, null, err, 'addressResolution')
      })
    } else if(app.globalData.systemConfigure.deliveryDistanceThirdMap == 'GAODE'){
      await AutonaviGetlat(defaultAddress).then(res => {
        resolve(res)
      }).catch(async (err) => {
        await guaranteeMap(that, app, reject1 ? reject1 : reject, resolve, defaultAddress, null, null, null, err, 'addressResolution')
      })
    } else if(app.globalData.systemConfigure.deliveryDistanceThirdMap == 'TENXUN') {
      await tenxunGetlat(defaultAddress).then(res => {
        resolve(res)
      }).catch(async (err) => {
        await guaranteeMap(that, app, reject1 ? reject1 : reject, resolve, defaultAddress, null, null, null, err, 'addressResolution')
      })
    }
  });
}
// 腾讯地图经纬度逆解析
const tenxunInverseAnalysisAddress = (longitude, latitude) => {
  let app = getApp()
  // 实例化API核心类
  qqmapsdk = new QQMapWX({
      //   key: 'ENCBZ-HOS6C-F572J-A5J7T-3GCRH-IEFF4'
      key: app.globalData.systemConfigure.lbsTencentMiniappKey
  });
  
  return new Promise(function (resolve, reject) {
    // 调用接口
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      get_poi: 1,
      success: function (res) {
        if(res && res.result) { // 重新赋值兼容其他地图逻辑
          res.data = {
            result: {
              ...res.result,
              addressComponent: {
                ...res.result.address_component,
                county: res.result.address_component.county || res.result.address_component.district
              }
            }
          }
          // res.data.result = {
          //   ...res.result,
          //   addressComponent: {
          //     ...res.result.address_component,
          //     county: res.result.address_component.county || res.result.address_component.district
          //   }
          // }
        }
        resolve(res)
      },
      fail: function (res) {
        reject(res);
      },
    })
  });
}
// 经纬度逆解析地址
const inverseAnalysisAddress = async (lat, lon, that, reject1, resolve1) => {
  const app = getApp()
  const distributionService = require("../api/distributionService")
  return new Promise(async function (resolve, reject) {
    if(app.globalData.systemConfigure.deliveryDistanceThirdMap == 'TIANDITU') {
      // 天地图情况下需要转换坐标
      let change = await distributionService.gcj02TOwgs84(lon,lat)
      await TiandituGetData(change.latitude,change.longitude).then(res => {
        if(resolve1) {
          resolve1(res)
        } else {
          resolve(res)
        }
      }).catch(async (err) => {
        await guaranteeMap(that, app, reject1 ? reject1 : reject, resolve, change.longitude, change.latitude, null, null, err, 'inverseAnalysisAddress')
      })
    } else if(app.globalData.systemConfigure.deliveryDistanceThirdMap == 'GAODE'){
      await AutonaviGetData(lat, lon).then(res => {
        resolve(res)
      }).catch(async (err) => {
        await guaranteeMap(that, app, reject, resolve, lon, lat, null, null, err, 'inverseAnalysisAddress')
      })
    } else if(app.globalData.systemConfigure.deliveryDistanceThirdMap == 'TENXUN') {
      await tenxunInverseAnalysisAddress(lon,lat).then(res => {
        if(res && res.data && res.data.status == 0) {
          resolve(res)
        } else {
          guaranteeMap(that, app, reject, resolve, lon, lat, null, null, err, 'inverseAnalysisAddress')
        }
      }).catch(async (err) => {
        await guaranteeMap(that, app, reject, resolve, lon, lat, null, null, err, 'inverseAnalysisAddress')
      })
    }
  });
}
// 获取配送距离
const getTripDist = (longitude, latitude, storeInfoLon, storeInfoLat, that, reject1, resolve1) => {
  const app = getApp()
  const distributionService = require("../api/distributionService")
  return new Promise(async function (resolve, reject) {
    if(app.globalData.systemConfigure.deliveryDistanceThirdMap == 'TIANDITU') {
      let change1 = await distributionService.gcj02TOwgs84(longitude,latitude)
      let change2 = await distributionService.gcj02TOwgs84(storeInfoLon,storeInfoLat)
      await TiandituCalculateDistanceBicycling(change1.latitude, change1.longitude, change2.latitude, change2.longitude).then(res => {
        if(resolve1) {
          resolve1(res)
        } else {
          resolve(res)
        }
      }).catch(async (err) => {
        await guaranteeMap(that, app, reject1 ? reject1 : reject, resolve, longitude, latitude, storeInfoLon, storeInfoLat, err)
      })
    } else if(app.globalData.systemConfigure.deliveryDistanceThirdMap == 'GAODE'){
      await AutonaviCalculateDistanceBicycling(latitude, longitude, storeInfoLat, storeInfoLon).then(res => {
        resolve(res)
      }).catch(async (err) => {
        await guaranteeMap(that, app, reject, resolve, longitude, latitude, storeInfoLon, storeInfoLat, err)
      })
    } else if(app.globalData.systemConfigure.deliveryDistanceThirdMap == 'TENXUN') {
      await calculateDistanceBicycling(latitude, longitude, storeInfoLat, storeInfoLon).then(async res => {
        if(res && res.data && res.data.status == 0) {
          resolve(res)
        } else {
          await guaranteeMap(that, app, reject, resolve, longitude, latitude, storeInfoLon, storeInfoLat, res)
        }
      }).catch(async (err) => {
        await guaranteeMap(that, app, reject, resolve, longitude, latitude, storeInfoLon, storeInfoLat, err)
      })
    }
  });
}
// 触发保底地图机制，切换至天地图
const guaranteeMap = async (that, app, reject, resolve, longitudeOrAddress, latitude, storeInfoLon, storeInfoLat, errMsg,fnType) => {
  const sysService = require("../api/systemService")
  let params = {
    syncType: 'CALCULATE_DELIVERY_DISTANCE',
    failedDetails: typeof errMsg == 'string' ? errMsg : JSON.stringify(errMsg),
    creatorName: app.globalData.userInfo && app.globalData.userInfo.member ? app.globalData.userInfo.member.name : '',
    creatorId: app.globalData.userInfo && app.globalData.userInfo.member ? app.globalData.userInfo.member.id : '',
  }
  if(errMsg && errMsg.data && errMsg.data.message) {
    params.failedDetails = errMsg.data.message
  }
  if(app.globalData.systemConfigure.deliveryDistanceThirdMap) {
    let mapName = '天地图'
    if(app.globalData.systemConfigure.deliveryDistanceThirdMap == 'GAODE') {
      mapName = '高德地图'
    } else if(app.globalData.systemConfigure.deliveryDistanceThirdMap == 'TENXUN') {
      mapName = '腾讯地图'
    }
    if(fnType == 'addressResolution') {
      mapName += '地址解析失败'
    } else if(fnType == 'inverseAnalysisAddress') {
      mapName += '经纬度逆解析失败'
    } else {
      mapName += '获取配送距离失败'
    }
    params.failedDetails += ' 提示：' + mapName
  }
  // 添加错误日志
  try {
    sysService.syncErrorLogCreate(params).then(res => {})
  } catch {

  }
  if(app.globalData.systemConfigure.deliveryDistanceThirdMap == 'TIANDITU') {
    if(!fnType) {
      wx.showToast({
        title: '该地址超出配送范围，请重新修改收货地址~',
        icon: 'none',
        duration: 3500
      })
    } else {
      wx.showToast({
        title: '当前地址无法解析，请重新选择地址~',
        icon: 'none',
        duration: 3500
      })
    }
    reject(errMsg)
  } else {
    app.globalData.systemConfigure.deliveryDistanceThirdMap = 'TIANDITU'
    if(that) {
      that.setData({
        deliveryDistanceThirdMap: 'TIANDITU'
      })
    }
    await sysService.query('lbs_tianditu_appkey').then(res => {
      if (res && res.length > 0 && res[0].value != null) {
        if(fnType == 'addressResolution') {
          app.globalData.systemConfigure.lbsTiandituAppkey = res[0].value || app.globalData.systemConfigure.lbsTiandituAppkey
          addressResolution(longitudeOrAddress, that, reject, resolve)
        } else if(fnType == 'inverseAnalysisAddress') {
          app.globalData.systemConfigure.lbsTiandituAppkey = res[0].value || app.globalData.systemConfigure.lbsTiandituAppkey
          inverseAnalysisAddress(latitude, longitudeOrAddress, that, reject, resolve)
        } else {
          app.globalData.systemConfigure.lbsTiandituAppkey = res[0].value || app.globalData.systemConfigure.lbsTiandituAppkey
          getTripDist(longitudeOrAddress, latitude, storeInfoLon, storeInfoLat, that, reject, resolve)
        }
      } else {
        if(!fnType) {
          wx.showToast({
            title: '该地址超出配送范围，请重新修改收货地址~',
            icon: 'none',
            duration: 3500
          })
        } else {
          wx.showToast({
            title: '当前地址无法解析，请重新选择地址~',
            icon: 'none',
            duration: 3500
          })
        }
        reject(errMsg)
      }
    }).catch(err => {
      if(!fnType) {
        wx.showToast({
          title: '该地址超出配送范围，请重新修改收货地址~',
          icon: 'none',
          duration: 3500
        })
      } else {
        wx.showToast({
          title: '当前地址无法解析，请重新选择地址~',
          icon: 'none',
          duration: 3500
        })
      }
      reject(err)
    })
  }
}
//计算两个经纬度之间的骑行距离
const calculateDistanceBicycling = (la1, lo1, la2, lo2) => {
    let app = getApp()
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
        //   key: 'ENCBZ-HOS6C-F572J-A5J7T-3GCRH-IEFF4'
        key: app.globalData.systemConfigure.lbsTencentMiniappKey
    });
 
    return new Promise(function (resolve, reject) {
      // 调用接口
    wx.request({
        //地图WebserviceAPI地点搜索接口请求路径及参数（具体使用方法请参考开发文档）
        url: 'https://apis.map.qq.com/ws/direction/v1/ebicycling?from='+ la2 +','+ lo2 +'&to='+ la1 +','+ lo1 +'&key=' + app.globalData.systemConfigure.lbsTencentMiniappKey,
        success(res){
            resolve(res)
        },
        fail(err) {
            reject(err)
        }
      })
    //   const request = require('../api/request.js')
    //   return request.get('https://apis.map.qq.com/ws/direction/v1/bicycling', params)
    //   let res = qqmapsdk.calculateDistance({
    //     mode: 'ebicycling',
    //     from: {
    //       latitude: la2,
    //       longitude: lo2
    //     },
    //     to: [{
    //       latitude: la1,
    //       longitude: lo1
    //     }],
    //     success: function (res) {
    //       resolve(res)
    //     },
    //     fail: function (res) {
    //       reject(res);
    //     },
    //     complete: function (res) {
  
    //     }
    //   });
    });
  }

//计算两个经纬度之间的步行或驾车距离
const calculateDistance = (la1, lo1, la2, lo2) => {
    let app = getApp()
  // 实例化API核心类
  qqmapsdk = new QQMapWX({
    // key: 'ENCBZ-HOS6C-F572J-A5J7T-3GCRH-IEFF4'
    key: app.globalData.systemConfigure.lbsTencentMiniappKey
  });
  console.log(la1, lo1, la2, lo2)
  return new Promise(function (resolve, reject) {
    // 调用接口
    let res = qqmapsdk.calculateDistance({
      mode: 'ebicycling',
      from: {
        latitude: la2,
        longitude: lo2
      },
      to: [{
        latitude: la1,
        longitude: lo1
      }],
      success: function (res) {
        resolve(res)
      },
      fail: function (res) {
        reject(res);
      },
      complete: function (res) {

      }
    });
  });
}
//小于10的格式化函数
function timeFormat(param) {
  return param < 10 ? '0' + param : param;
}

//倒计时函数
function countDownDetail(teamBuyTimeList) {
  const that = this
  let teamBuyTimeInfoList = teamBuyTimeList;
  // 获取当前时间，同时得到活动结束时间数组
  let now = new ResponseDate();
  // 当前时间戳
  let nowTime = now.getTime();
  // 当前日期字符串
  let currentDateStr = now.getFullYear() + '-' + (now.getMonth() + 1 * 1) + '-' + now.getDate();
  let countDownArr = [];
  // 对结束时间进行处理渲染到页面
  teamBuyTimeInfoList.forEach(o => {
    // 开始日期字符串 年-月-日
    let startDateStr = o.openTeamTime.substr(0, 10);
    // 结束日期字符串 年-月-日
    let endDateStr = o.endTeamTime.substr(0, 10);
    // 活动开始时间戳
    let startTimetamp = 0;
    // 活动结束时间戳
    let endTimetamp = 0;

    if (new Date(startDateStr.replace(/-/g, '/')).getTime() >= new Date(currentDateStr.replace(/-/g, '/')).getTime()) {
      // 开始日期大于等于今天
      startTimetamp = new Date(o.openTeamTime.replace(/-/g, '/')).getTime();
    } else {
      // 开始日期小于今天，就把开始日期设为今天，再取活动具体开始时间的时间戳
      // 开始时间字符串 时:分:秒
      let startTimeStr = o.openTeamTime.substr(11, 2) + ':' + o.openTeamTime.substr(14, 2) + ':' + o.openTeamTime.substr(17, 2);
      startTimetamp = new Date((currentDateStr + ' ' + startTimeStr).replace(/-/g, '/')).getTime();
    }

    if (new Date(endDateStr.replace(/-/g, '/')).getTime() <= new Date(currentDateStr.replace(/-/g, '/')).getTime()) {
      // 结束日期小于等于今天
      endTimetamp = new Date(o.endTeamTime.replace(/-/g, '/')).getTime();
    } else {
      // 结束日期大于今天，就把结束日期设为今天，再取活动具体结束时间的时间戳
      // 结束时间字符串 时:分:秒
      let endTimeStr = o.endTeamTime.substr(11, 2) + ':' + o.endTeamTime.substr(14, 2) + ':' + o.endTeamTime.substr(17, 2);
      endTimetamp = new Date((currentDateStr + ' ' + endTimeStr).replace(/-/g, '/')).getTime();
    }

    // 时分秒
    let obj = null;
    // 活动开始时间和当前时间的差值
    let s = startTimetamp - nowTime;
    // 活动结束时间和当前时间的差值
    let e = endTimetamp - nowTime;
    if (s > 0 || e > 0) {
      // 未结束
      let time = null
      if (s > 0) {
        // 未开始，计算距开始的时间
        time = s
      } else {
        // 已经开始，计算距离结束的时间
        time = e
      }
      // console.log('time=======',time);
      let day = parseInt(time / (1000 * 60 * 60 * 24));
      let hou = parseInt((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) + day * 24;
      let min = parseInt((time % (1000 * 60 * 60)) / (1000 * 60));
      let sec = parseInt((time % (1000 * 60)) / 1000);
      obj = {
        hou: timeFormat(hou),
        min: timeFormat(min),
        sec: timeFormat(sec)
      }
    } else {
      // 已结束
      obj = {
        hou: '00',
        min: '00',
        sec: '00'
      }
    }
    countDownArr.push(obj)
  })
  // 渲染，然后每隔一秒执行一次倒计时函数
  return countDownArr
}

//倒计时函数
function countDown(teamBuyTimeList) {
  // 获取当前时间，同时得到活动结束时间数组
  const that = this
  let newTime = getResponseHeaderTimestamp() / 1000;
  let teamBuyTimeInfoList = teamBuyTimeList;
  let countDownArr = [];
  // 对结束时间进行处理渲染到页面
  teamBuyTimeInfoList.forEach(o => {
    // iOS不兼容？
    // let endTime = new Date(o).getTime();   
    // ios 转换时间戳？？？
    let date = o.openTeamTime.substr(0, 10) //2017-02-27
    let hour = o.openTeamTime.substr(11, 2) == '00' ? 0 : o.openTeamTime.substr(11, 2).replace(/\b(0+)/gi, "")
    let minute = o.openTeamTime.substr(14, 2) == '00' ? 0 : o.openTeamTime.substr(14, 2).replace(/\b(0+)/gi, "")
    let second = o.openTeamTime.substr(17, 2) == '00' ? 0 : o.openTeamTime.substr(17, 2).replace(/\b(0+)/gi, "")
    let timestamp = parseInt(new Date(date).getTime() / 1000) + parseInt(o.duration) + parseInt(hour) * 3600 + parseInt(minute) * 60 + parseInt(second) - 28800 //别问我为什么-28800，只能告诉你实践出真知                   
    //var endNewTime = timestampFormat(timestamp)//timestampFormat：自定义的将时间戳转换为刚刚，昨天16:42等表达的方法
    let endTime = timestamp
    let obj = null;
    // 如果活动未结束，对时间进行处理
    if (endTime - newTime > 0) {
      let time = (endTime - newTime);
      // 获取天、时、分、秒
      let day = parseInt(time / (60 * 60 * 24));
      let hou = parseInt(time % (60 * 60 * 24) / 3600) + parseInt(day * 24);
      let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
      let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
      obj = {
        day: this.timeFormat(day),
        hou: timeFormat(hou),
        min: timeFormat(min),
        sec: timeFormat(sec)
      }
    } else { //活动已结束，全部设置为'00'
      obj = {
        //day: '00',
        hou: '00',
        min: '00',
        sec: '00'
      }
    }
    countDownArr.push(obj)
  })
  // 渲染，然后每隔一秒执行一次倒计时函数
  return countDownArr
}
//倒计时函数
function countDownDay(teamBuyTimeList, zero) {
  zero = zero == null ? true : zero
  // 获取当前时间，同时得到活动结束时间数组
  const that = this
  let newTime = getResponseHeaderTimestamp() / 1000;
  let teamBuyTimeInfoList = teamBuyTimeList;
  let countDownArr = [];
  // 对结束时间进行处理渲染到页面
  teamBuyTimeInfoList.forEach(o => {
    // iOS不兼容？
    // let endTime = new Date(o).getTime();   
    // ios 转换时间戳？？？
    let date = o.openTeamTime.substr(0, 10) //2017-02-27
    let hour = o.openTeamTime.substr(11, 2) == '00' ? 0 : o.openTeamTime.substr(11, 2).replace(/\b(0+)/gi, "")
    let minute = o.openTeamTime.substr(14, 2) == '00' ? 0 : o.openTeamTime.substr(14, 2).replace(/\b(0+)/gi, "")
    let second = o.openTeamTime.substr(17, 2) == '00' ? 0 : o.openTeamTime.substr(17, 2).replace(/\b(0+)/gi, "")
    let timestamp = parseInt(new Date(date).getTime() / 1000) + parseInt(o.duration) + parseInt(hour) * 3600 + parseInt(minute) * 60 + parseInt(second) - 28800 //别问我为什么-28800，只能告诉你实践出真知                   
    //var endNewTime = timestampFormat(timestamp)//timestampFormat：自定义的将时间戳转换为刚刚，昨天16:42等表达的方法
    let endTime = timestamp
    let obj = null;
    // 如果活动未结束，对时间进行处理
    if (endTime - newTime > 0) {
      let time = (endTime - newTime);
      // 获取天、时、分、秒
      let day = parseInt(time / (60 * 60 * 24));
      let hou = parseInt(time % (60 * 60 * 24) / 3600);
      let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
      let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
      obj = {
        day: day,
        hou: zero ? timeFormat(hou) : hou,
        min: zero ? timeFormat(min) : min,
        sec: zero ? timeFormat(sec) : sec
      }
    } else { //活动已结束，全部设置为'00'
      obj = {
        day: '00',
        hou: '00',
        min: '00',
        sec: '00'
      }
    }
    countDownArr.push(obj)
  })
  // 渲染，然后每隔一秒执行一次倒计时函数
  return countDownArr
}

// 处理 Access Token 已过期
function handleLoginStatus(error) {
  if (error.code !== 20) {
    wx.showToast({
      title: error.message,
      icon: 'none',
      duration: 2000
    })
  }
}

/**
 * 判断当前要跳转的页面是否tabbar
 * @param {String} page 页面路径
 */
function checkIsTabBar(page) {
  //获取应用实例
  const app = getApp()
  let isTabBar = false
  if (app.globalData.tabBar.list && app.globalData.tabBar.list.length > 0) {
    let lists = app.globalData.tabBar.list
    lists.forEach(item => {
      if (item.pagePath === page) {
        isTabBar = true
      }
    })
  }
  return isTabBar
}

var numberConversion = {
  /*
      单位
  */
  units: '个十百千万@#%亿^&~',
  /*
      字符
  */
  chars: '零一二三四五六七八九',
  /*
      数字转中文
      @number {Integer} 形如123的数字
      @return {String} 返回转换成的形如 一百二十三 的字符串            
  */
  numberToChinese: function (number) {
    if (number > 9999) {
      return '万';
    } else if (number > 999) {
      return '千';
    } else {
      var a = (number + '').split(''),
        s = [],
        t = this;
      if (a.length > 12) {
        throw new Error('too big');
      } else {
        for (var i = 0, j = a.length - 1; i <= j; i++) {
          if (j == 1 || j == 5 || j == 9) { //两位数 处理特殊的 1*
            if (i == 0) {
              if (a[i] != '1') s.push(t.chars.charAt(a[i]));
            } else {
              s.push(t.chars.charAt(a[i]));
            }
          } else {
            s.push(t.chars.charAt(a[i]));
          }
          if (i != j) {
            s.push(t.units.charAt(j - i));
          }
        }
      }
      //return s;
      return s.join('').replace(/零([十百千万亿@#%^&~])/g, function (m, d, b) { //优先处理 零百 零千 等
        b = t.units.indexOf(d);
        if (b != -1) {
          if (d == '亿') return d;
          if (d == '万') return d;
          if (a[j - b] == '0') return '零'
        }
        return '';
      }).replace(/零+/g, '零').replace(/零([万亿])/g, function (m, b) { // 零百 零千处理后 可能出现 零零相连的 再处理结尾为零的
        return b;
      }).replace(/亿[万千百]/g, '亿').replace(/[零]$/, '').replace(/[@#%^&~]/g, function (m) {
        return {
          '@': '十',
          '#': '百',
          '%': '千',
          '^': '十',
          '&': '百',
          '~': '千'
        } [m];
      }).replace(/([亿万])([一-九])/g, function (m, d, b, c) {
        c = t.units.indexOf(d);
        if (c != -1) {
          if (a[j - c] == '0') return d + '零' + b
        }
        return m;
      });
    }
  }
};

/* 处理文字多出省略号显示 */
// util.dealWords({
//   ctx: ctx, //画布上下文
//   fontSize: 19, //字体大小
//   word: self.data.name, //需要处理的文字
//   maxWidth: 180, //一行文字最大宽度
//   x: 14, //文字在x轴要显示的位置
//   y: 320, //文字在y轴要显示的位置
//   maxLine: 3 //文字最多显示的行数
// })
function dealWords(options) {
  options.ctx.setFontSize(options.fontSize); //设置字体大小
  let wordList = options.word.split(/\r?\n/);
  let wordText = '';
  if(wordList && wordList.length > 0) {
    wordList.forEach((item, index) => {
      wordText += item
    })
  }
  var allRow = Math.ceil(options.ctx.measureText(wordText).width / options.maxWidth); //实际总共能分多少行
  var count = allRow >= options.maxLine ? options.maxLine : allRow; //实际能分多少行与设置的最大显示行数比，谁小就用谁做循环次数
  var endPos = 0; //当前字符串的截断点
  var lineHeigh = options.lineHeigh != null ? options.lineHeigh : options.fontSize;
  
  for (var j = 0; j < count; j++) {
    var nowStr = wordText.slice(endPos); //当前剩余的字符串
    var rowWid = 0; //每一行当前宽度    
    if (options.ctx.measureText(nowStr).width > options.maxWidth) { //如果当前的字符串宽度大于最大宽度，然后开始截取
      for (var m = 0; m < nowStr.length; m++) {
        rowWid += options.ctx.measureText(nowStr[m]).width; //当前字符串总宽度
        if (rowWid > options.maxWidth) {
          if (j === options.maxLine - 1) { //如果是最后一行
            options.ctx.fillText(nowStr.slice(0, m - 1) + '...', options.x, options.y + j * lineHeigh + (lineHeigh - options.fontSize) / 2 + options.fontSize); //(j+1)*18这是每一行的高度    
          } else {
            options.ctx.fillText(nowStr.slice(0, m), options.x, options.y + j * lineHeigh + (lineHeigh - options.fontSize) / 2 + options.fontSize);
          }
          endPos += m; //下次截断点
          break;
        }
      }
    } else { //如果当前的字符串宽度小于最大宽度就直接输出
      options.ctx.fillText(nowStr.slice(0), options.x, options.y + j * lineHeigh + (lineHeigh - options.fontSize) / 2 + options.fontSize);
    }
  }
}

/**
 * 绘制圆角矩形
 * @param x x坐标
 * @param y y坐标
 * @param w 宽度
 * @param h 高度
 * @param r 角度
 */
function roundRect(ctx, x, y, w, h, r) {
  ctx.save();
  if (w < 2 * r) {
    r = w / 2;
  }
  if (h < 2 * r) {
    r = h / 2;
  }
  ctx.beginPath();
  ctx.setStrokeStyle('#fff');
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.stroke();
  ctx.closePath();
  ctx.draw(true);
}

/**
 * @param ctx: 当前画布对象
 * @param x: 圆角矩形左上角x坐标
 * @param y: 圆角矩形左上角y坐标
 * @param w: 宽度
 * @param h: 高度
 * @param r: border - radius
 * @param color: 填充颜色
 */
function roundRectColor(ctx, x, y, w, h, r, color) {
  ctx.save();
  ctx.beginPath()
  // 左上角
  ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5)
  // 上边框
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.lineTo(x + w, y + r)
  // 右上角
  ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2)
  // 右边框
  ctx.lineTo(x + w, y + h - r)
  ctx.lineTo(x + w - r, y + h)
  // 右下角
  ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5)
  // 下边框
  ctx.lineTo(x + r, y + h)
  ctx.lineTo(x, y + h - r)
  // 左下角
  ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI)
  // 左边框
  ctx.lineTo(x, y + r)
  ctx.lineTo(x + r, y)
  //填充颜色
  ctx.setFillStyle(color);
  ctx.fill()
  ctx.closePath()
}
/**
 * @param ctx: 当前画布对象
 * @param x: 圆角矩形左上角x坐标
 * @param y: 圆角矩形左上角y坐标
 * @param w: 宽度
 * @param h: 高度
 * @param r: border - radius
 * @param color: 填充颜色
 */
function roundRectColor2(ctx, x, y, w, h, r, color) {
  ctx.save();
  ctx.beginPath()
  // 左上角
  ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5)
  // 上边框
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.lineTo(x + w, y + r)
  // 右上角
  ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2)
  // 右边框
  ctx.lineTo(x + w, y + h - r)
  ctx.lineTo(x + w - r, y + h)
  // 右下角
  ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5)
  // 下边框
  ctx.lineTo(x + r, y + h)
  ctx.lineTo(x, y + h - r)
  // 左下角
  ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI)
  // 左边框
  ctx.lineTo(x, y + r)
  ctx.lineTo(x + r, y)
  //填充颜色
  ctx.setFillStyle(color);
  ctx.fill()
  ctx.closePath()
}
/**
 * @param ctx: 当前画布对象
 * @param x: 圆角矩形左上角x坐标
 * @param y: 圆角矩形左上角y坐标
 * @param w: 宽度
 * @param h: 高度
 * @param r: border - radius
 * @param img: 填充图片
 */
function roundRectImage(ctx, x, y, w, h, r, img) {
  ctx.save();
  // 绘制圆角矩形路径
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r); // 右上角
  // ctx.arcTo(x + w, y + h, x, y + h, 0.5); // 右下角
  // ctx.arcTo(x, y + h, x, y, 0.5); // 左下角
  // 右下直角
  ctx.lineTo(x + w, y + h);
  // 左下直角
  ctx.lineTo(x, y + h);
  ctx.arcTo(x, y, x + w, y, r); // 左上角
  ctx.closePath()
  ctx.clip(); // 裁剪
  // ctx.save();
  // ctx.beginPath();
  ctx.drawImage(img, x, y, w, h); // 绘制图片
  ctx.restore();
}

import sharePicturesService from '@/service/api/newretail/sharePicturesService';
function getSharePictures(modelType) {
  const app = getApp()
  return new Promise(function (resolve, reject) {
    sharePicturesService.getByModelType(modelType).then(res => {
      if (res) {
        if (modelType === 'DEFAULT') {
          // 保存默认分享图
          app.globalData.sharePictures = res.pictureUrl
          try {
            wx.setStorageSync('wj_sharePictures', res.pictureUrl)
          } catch (error) {}
        }
        resolve(res.pictureUrl)
      } else if (app.globalData.sharePictures) {
        resolve(app.globalData.sharePictures)
      } else {
        try {
          var pictureUrl = wx.getStorageSync('wj_sharePictures')
          console.log(pictureUrl)
          if (pictureUrl) {
            app.globalData.sharePictures = pictureUrl
            resolve(pictureUrl)
          } else {
            resolve('')
          }
        } catch (e) {
          console.log(e)
          resolve('')
        }
      }
    }).catch(err => {
      reject(err)
    })
  })
}

/**
 * 二次贝塞尔曲线算法。 
 * 点击物品根据鼠标点击的坐标以及，目标点的坐标，计算出控制点的坐标。 
 * 根据三个点返回一组坐标点，每一个点代表下一帧物体的坐标。 
 * 根据坐标点绘制刷新视图更新位置，实现曲线效果。
 * @param pots 
 * @param amount 
 */
function bezier(pots, amount) {
  var pot;
  var lines;
  var ret = [];
  var points;
  for (var i = 0; i <= amount; i++) {
    points = pots.slice(0);
    lines = [];
    while (pot === points.shift()) {
      if (points.length) {
        lines.push(pointLine([pot, points[0]], i / amount));
      } else if (lines.length > 1) {
        points = lines;
        lines = [];
      } else {
        break;
      }
    }
    ret.push(lines[0]);
  }

  function pointLine(points, rate) {
    var pointA, pointB, pointDistance, xDistance, yDistance, tan, radian, tmpPointDistance;
    var ret = [];
    pointA = points[0]; //点击
    pointB = points[1]; //中间
    xDistance = pointB.x - pointA.x;
    yDistance = pointB.y - pointA.y;
    pointDistance = Math.pow(Math.pow(xDistance, 2) + Math.pow(yDistance, 2), 1 / 2);
    tan = yDistance / xDistance;
    radian = Math.atan(tan);
    tmpPointDistance = pointDistance * rate;
    ret = {
      x: pointA.x + tmpPointDistance * Math.cos(radian),
      y: pointA.y + tmpPointDistance * Math.sin(radian)
    };
    return ret;
  }
  return {
    'bezier_points': ret
  };
}

/**
 * 生成拼团分享图
 * @param {String} pictureUrl 商品主图
 * @param {Object} group 拼团信息（人数 number；销量 soldCount；price 价格；originalPrice 原价;time{hou,min,sec} 时间）
 */
function createGroupSharePictures(pictureUrl, group) {
  const app = getApp()
  const request = require('../api/request.js')
  const picture = pictureUrl.replace("http://", "https://")
  // 获取到id为'groupPictureCanvas'的canvas
  var ctx = wx.createCanvasContext("groupPictureCanvas");
  let screenWidth = app.globalData.systemInfo.screenWidth
  let rate = screenWidth / 750
  // 绘制背景
  ctx.setFillStyle('white');
  ctx.fillRect(0, 0, 992, 802);
  return new Promise(function (resolve, reject) {
    // 绘制上部分商品图片
    wx.getImageInfo({
      src: picture,
      success(res) {
        ctx.drawImage(res.path, 0, 0, 992 * rate, 802 * rate);
        ctx.draw(true);
        // 绘制拼团信息
        // commonHandle();
        // Create linear gradient
        const grd = ctx.createLinearGradient(0, 622 * rate, 992 * rate, 622 * rate)
        grd.addColorStop(0, '#FF7200')
        grd.addColorStop(1, '#FFAD6A')

        // Fill with gradient 渐变背景
        ctx.setFillStyle(grd)
        ctx.fillRect(0, 622 * rate, 992 * rate, 184 * rate)
        ctx.draw(true)
        // 左侧拼团人数、价格、销售数量信息
        ctx.setFillStyle('#ffffff');
        ctx.font = 'bold 32px sans-serif';
        ctx.fillText(group.number + '人团', 28 * rate, 704 * rate);
        if (group.soldCount) {
          ctx.font = 'normal bold 20px sans-serif';
          ctx.fillText('累计销售：' + group.soldCount, 270 * rate, 704 * rate);
        }
        ctx.font = 'normal bold 28px sans-serif';
        ctx.fillText('￥' + group.price, 28 * rate, 776 * rate);
        if (group.originalPrice) {
          ctx.font = 'normal 20px sans-serif';
          ctx.fillText('￥' + group.originalPrice, 270 * rate, 776 * rate);
          ctx.setStrokeStyle('white');
          ctx.moveTo(270 * rate, 760 * rate);
          ctx.lineTo(350 * rate, 760 * rate);
          ctx.stroke();
        }
        ctx.draw(true);
        // 绘制右侧倒计时背景
        ctx.setFillStyle('#FFC799');
        ctx.beginPath();
        ctx.setLineWidth(1);
        ctx.moveTo(992 * rate, 622 * rate);
        ctx.lineTo(656 * rate, 622 * rate);
        ctx.lineTo(610 * rate, 710 * rate);
        ctx.lineTo(656 * rate, 802 * rate);
        ctx.lineTo(992 * rate, 802 * rate);
        ctx.closePath();
        ctx.fill();
        ctx.draw(true);
        // 倒计时信息
        ctx.setFillStyle('#323232');
        ctx.font = 'bold 20px sans-serif';
        let hasTime = false
        if (group.status != null && group.status === "UNOPENED") {
          ctx.fillText('距开始仅剩', 730 * rate, 702 * rate);
          hasTime = true
        } else if (group.status != null && group.status === "STARTED") {
          ctx.fillText('距结束仅剩', 730 * rate, 702 * rate);
          hasTime = true
        } else {
          ctx.fillText('活动已结束', 730 * rate, 722 * rate);
        }
        if (hasTime) {
          let time = "";
          if (group.time != null) {
            time = group.time.hou + ':' + group.time.min + ':' + group.time.sec
            if (group.time.day != null) {
              time = group.time.day + ' 天 ' + time
            }
          }
          ctx.font = 'bold 20px sans-serif';
          ctx.fillText(time, 700 * rate, 764 * rate);
        }
        ctx.draw(true, setTimeout(() => {
          wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: 992 * rate,
            height: 802 * rate,
            destWidth: 800,
            destHeight: 640,
            canvasId: 'groupPictureCanvas',
            success(res) {
              // 图片小于或者等于1M时 可以执行获取图片
              // 此处未判断，如果分享图没有可考虑此问题
              wx.uploadFile({
                url: request.BASE_URL + '/newretail/api/dfs/upload', //仅为示例，非真实的接口地址
                filePath: res.tempFilePath,
                name: 'file',
                formData: {
                  'user': 'test'
                },
                header: {
                  "wxa-appid": request.APP_ID
                },
                success: function (res) {
                  let tempData = JSON.parse(res.data)
                  resolve({
                    data: tempData.data.url,
                    message: ''
                  })
                },
                fail: function (e) {
                  reject({
                    data: null,
                    message: e
                  })
                }
              })
            }
          })
        }, 100));
      },
      fail(err) {
        reject({
          data: null,
          message: err
        })
      }
    })
  })
}
/**
 * 获取当前显示的页面
 */
function utilGetCurrentPage() {
  let pages = getCurrentPages()
  let currentPage = pages[pages.length - 1]
  return currentPage
}
/**
 * 保存分享礼品卡的人的id
 */
const setSharingGiftCardPerson = shareData => {
  try {
    wx.setStorageSync(KEY_SHAREING_GIFT_CARD, shareData)
  } catch (e) {
    // Do something when catch error
  }
}

// 获取分享礼品卡的人信息
const getSharingGiftCardPerson = () => {
  let shareData = null
  try {
    const sharingInfo = wx.getStorageSync(KEY_SHAREING_GIFT_CARD)
    if (sharingInfo) {
      // Do something with return value
      if (sharingInfo.shareId != null) {
        shareData = sharingInfo
      }
    }
  } catch (e) {
    // Do something when catch error
  }
  return shareData
}

// 清除礼品卡分享人信息
const removeSharingGiftCardPerson = () => {
  try {
    wx.removeStorageSync(KEY_SHAREING_GIFT_CARD)
  } catch (e) {
    // Do something when catch error
  }
}

// 设置分享人信息
const setSharingPersonInfo = shareData => {
  try {
    wx.setStorageSync(KEY_SHARINGINFO, shareData)
  } catch (e) {
    // Do something when catch error
  }
}

// 获取分享人信息
const getSharingPersonInfo = () => {
  let shareData = null
  try {
    const sharingInfo = wx.getStorageSync(KEY_SHARINGINFO)
    if (sharingInfo) {
      // Do something with return value
      if (sharingInfo.shareId != null) {
        shareData = sharingInfo
      }
    }
  } catch (e) {
    // Do something when catch error
  }
  return shareData
}

// 清除分享人信息
const removeSharingPersonInfo = () => {
  try {
    wx.removeStorageSync(KEY_SHARINGINFO)
  } catch (e) {
    // Do something when catch error
  }
}

// 显示消息提示框
const showToast = (message, duration) => {
  duration = duration != null ? duration : 2000
  wx.showToast({
    title: message,
    icon: 'none',
    duration: duration
  })
}

/**
 * 保存formid
 */
const setWxaFormId = formId => {
  try {
    wx.setStorageSync(KEY_WXA_FORMID, formId)
  } catch (e) {
    // Do something when catch error
  }
}

const isIphoneX = () => {
  //获取应用实例
  const app = getApp()
  const model = app.globalData.systemInfo.model
  console.log(model)
  let isSpecial = false
  // const modelArr = ["iPhone X", "iPhone XR", "iPhone XS", "iPhone XS Max", "iPhone 11", "iPhone 11 Pro", "iPhone 11 Pro Max", "iPhone 12", "iPhone 12 Pro", "iPhone 12 Pro Max" ,"iPhone 13", "iPhone 13 Pro", "iPhone 13 Pro Max", "iPhone 14", "iPhone 14 Pro", "iPhone 14 Pro Max"]
  const noModelArr = ["iPhone 5", "iPhone 6","iPhone 7","iPhone 8"]
  let noFlag = noModelArr.some(ele => model.search(ele) != -1)
  console.log(model.search('iPhone') != -1 , !noFlag, 'noflag')
  if (model.search('iPhone') != -1 && !noFlag) {
    isSpecial = true;
  }
//   const modelArr = ["iPhone X", "iPhone XR", "iPhone XS", "iPhone XS Max", "iPhone 11", "iPhone 11 Pro", "iPhone 11 Pro Max", "iPhone 12", "iPhone 12 Pro", "iPhone 12 Pro Max" ,"iPhone 13", "iPhone 13 Pro", "iPhone 13 Pro Max", "iPhone 14", "iPhone 14 Pro", "iPhone 14 Pro Max"]
//   modelArr.forEach(ele => {
//     if (model && model.search(ele) != -1) {
//       isSpecial = true;
//       return;
//     }
//   });
  return isSpecial
}

const compare = property => {
  return function (a, b) {
    var value1 = a[property];
    var value2 = b[property];
    return value1 - value2;
  }
}
/**
 * 获取当前页面分享路径
 */
function getSharePath(storeId) {
  const app = getApp()
  let memberId = null;
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    memberId = app.globalData.userInfo.member.id
  }
  var pages = getCurrentPages() //获取加载的页面
  var currentPage = pages[pages.length - 1] //获取当前页面的对象
  var url = currentPage.route //当前页面url
  var options = currentPage.options //如果要获取url中所带的参数可以查看options
  let path = url
  if (storeId != null) {
    path = path + '?storeId=' + storeId
  }
  for (const key in options) {
    if (options.hasOwnProperty(key)) {
      const ele = options[key];
      if (key !== "storeId" && key !== "shareId") {
        path = path + '&' + key + '=' + ele
      }
    }
  }
  if (memberId) {
    path = path + '&shareId=' + memberId
  }
  if (path.indexOf("?") < 0) {
    path = path.replace(/&/, "?");
  }
  return path
}
/**
 * 计算当前时间是否处于活动时间内
 * 返回boolean
 * @param {String} beginTime 活动开始时间
 * @param {String} endTime 活动结束时间
 */
function isExpired(beginTime, endTime) {
  if (!beginTime || !endTime) {
    return false
  }
  let isExpired = false;
  const nowTime = getResponseHeaderTimestamp();
  beginTime = new Date(beginTime.replace(/-/g, "/")).getTime();
  endTime = new Date(endTime.replace(/-/g, "/")).getTime();
  if (nowTime < beginTime || nowTime > endTime) {
    isExpired = true
  }
  return isExpired
}
/**
 * 处理UI配置
 * @param {Array} data
 */
const handleUIConfig = data => {
  if (Array.isArray(data)) {
    var config = {}
    data.forEach(ele => {
      if (ele.value != null) {
        if (ele.value === "TRUE" || ele.value === "true") {
          config[ele.key] = true
        } else if (ele.value === "FALSE" || ele.value === "false") {
          config[ele.key] = false
        } else {
          if (ele.key === "topMemberEntrance" || ele.key === "shipmentSortList") {
            config[ele.key] = ele.value.split(",") || []
          } else if (ele.key === "orderStatusEntrance") {
            config[ele.key] = JSON.parse(ele.value.replace(/\\/g, ""))
          } else if (ele.key === "memberCenterDTO" || ele.key === "pullNewDTO") {
            config[ele.key] = ele.value.replace(/\\/g, "")
          } else {
            config[ele.key] = ele.value
          }
        }
      } else {
        config[ele.key] = ""
      }
    })
    return config
  } else {
    return data
  }
}

function compareVersion(v1, v2) {
  v1 = v1.split('.')
  v2 = v2.split('.')
  const len = Math.max(v1.length, v2.length)

  while (v1.length < len) {
    v1.push('0')
  }
  while (v2.length < len) {
    v2.push('0')
  }

  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i])
    const num2 = parseInt(v2[i])

    if (num1 > num2) {
      return 1
    } else if (num1 < num2) {
      return -1
    }
  }

  return 0
}

/**
 * 计算时间是多久前
 */
function timePassed(timeList, zero = true) {
  const that = this
  // 获取当前时间，同时得到活动结束时间数组
  let newTime = getResponseHeaderTimestamp() / 1000;
  let countDownArr = [];
  // 对结束时间进行处理渲染到页面
  timeList.forEach(o => {
    // ios 转换时间戳？？？
    let date = o.time.substr(0, 10) //2017-02-27
    let hour = o.time.substr(11, 2) == '00' ? 0 : o.time.substr(11, 2).replace(/\b(0+)/gi, "")
    let minute = o.time.substr(14, 2) == '00' ? 0 : o.time.substr(14, 2).replace(/\b(0+)/gi, "")
    let second = o.time.substr(17, 2) == '00' ? 0 : o.time.substr(17, 2).replace(/\b(0+)/gi, "")
    let timestamp = parseInt(new Date(date).getTime() / 1000) + parseInt(hour) * 3600 + parseInt(minute) * 60 + parseInt(second) - 28800 //别问我为什么-28800，只能告诉你实践出真知                   
    //var endNewTime = timestampFormat(timestamp)//timestampFormat：自定义的将时间戳转换为刚刚，昨天16:42等表达的方法
    // 过去的时间点的时间戳
    let pastTime = timestamp
    let obj = null;
    // 如果活动未结束，对时间进行处理
    if (newTime - pastTime > 0) {
      let time = (newTime - pastTime);
      // 获取天、时、分、秒
      let day = parseInt(time / (60 * 60 * 24));
      let hou = parseInt(time % (60 * 60 * 24) / 3600);
      let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
      let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
      obj = {
        id: o.id,
        day: day,
        hou: zero ? timeFormat(hou) : hou,
        min: zero ? timeFormat(min) : min,
        sec: zero ? timeFormat(sec) : sec
      }
    } else { //活动已结束，全部设置为'00'
      obj = {
        id: o.id,
        day: '00',
        hou: '00',
        min: '00',
        sec: '00'
      }
    }
    countDownArr.push(obj)
  })
  // 渲染，然后每隔一秒执行一次倒计时函数
  return countDownArr
}
/**
 * 下载图片
 * @param {*} url 图片URL
 */
function getImageInfo(url) {
  return new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: url,
      success: (res) => {
        resolve(res)
      },
      fail: () => {
        reject({
          code: -1,
          message: "图片获取失败"
        })
      }
    });
  });
}

function isObjectValueEqual(a, b) {
  //取对象a和b的属性名
  var aProps = Object.getOwnPropertyNames(a);
  var bProps = Object.getOwnPropertyNames(b);
  //判断属性名的length是否一致
  if (aProps.length != bProps.length) {
    return false;
  }

  //循环取出属性名，再判断属性值是否一致
  for (var i = 0; i < aProps.length; i++) {
    var propName = aProps[i];
    if (a[propName] !== b[propName]) {
      return false;
    }
  }
  return true;
}


function isDeliveryProduct() {
  const app = getApp()
  let isDeliveryProduct = false
  for (let i = 0; i < app.globalData.configureInfo.length; i++) {
    const item = app.globalData.configureInfo[i];
    // 是否包含统配商品:TRUE是、FALSE否
    if (item.key === 'isDeliveryProduct' && item.value !== '') {
      isDeliveryProduct = item.value === "TRUE" ? true : false;
      break;
    }
  }
  return isDeliveryProduct
}
function isNextDayProduct() {
  const app = getApp()
  let isNextDayProduct = false
  for (let i = 0; i < app.globalData.configureInfo.length; i++) {
    const item = app.globalData.configureInfo[i];
    // 是否包含统配商品:TRUE是、FALSE否
    if (item.key === 'isNextDayProduct' && item.value !== '') {
      isNextDayProduct = item.value === "TRUE" ? true : false;
      break;
    }
  }
  return true
}


function validateDateTime(str) {
  var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
  var r = str.match(reg);
  if (r == null) return false;
  var d = new Date(r[1], r[3] - 1, r[4], r[5], r[6], r[7]);
  return (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4] && d.getHours() == r[5] && d.getMinutes() == r[6] && d.getSeconds() == r[7]);
}

function compareMemberGrade(grades) {
  let payMember = null
  let index = 0
  for (let i = 0; i < grades.length; i++) {
    const ele = grades[i];
    if (ele.gradeNo < 0) {
      index = i
      payMember = ele
    }
  }
  payMember && grades.splice(index, 1);
  grades.sort(this.compare("gradeNo"))
  if (payMember) {
    grades.push(payMember)
  }
  return grades
}

function throttle(fn, gapTime) {
  if (gapTime == null || gapTime == undefined) {
    gapTime = 1500
  }
  let _lastTime = null
  return function () {
    let _nowTime = +new Date()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      // 将this和参数传给原函数
      fn.apply(this, arguments)
      _lastTime = _nowTime
    }
  }
}
/**
 * 获取请求Header中的时间
 */
function getResponseHeaderDate() {
  const app = getApp();
  let now = new Date().getTime()
  if (app.globalData.differenceTime) {
    now = now + app.globalData.differenceTime
  }
  let time = timestampToTime(now)
  let date = new Date(time.replace(/-/g, '/'))
  return date
}
/**
 * 获取请求Header中的时间戳
 */
function getResponseHeaderTimestamp() {
  let date = getResponseHeaderDate()
  let timestamp = new Date(date).getTime()
  return timestamp
}

/**
 * px转rpx
 */

function pxToRpx(px) {
  const app = getApp();
  const screenWidth = app.globalData.systemInfo.screenWidth;
  return (750 * parseFloat(px)) / screenWidth
}
/**
 * rpx转px
 */

function rpxToPx(rpx) {
  const app = getApp();
  const screenWidth = app.globalData.systemInfo.screenWidth
  return (screenWidth * parseFloat(rpx)) / 750
}
function filtToFix(value) {
  value = Number(value)
  if (value >= 0) {
    return value.toFixed(2) //此处2为保留两位小数
  } else {
    return 0
  }
}


class ResponseDate extends Date {
  constructor() {
    const app = getApp();
    let now = new Date().getTime()
    if (app.globalData.differenceTime) {
      now = now + app.globalData.differenceTime
    }
    let time = timestampToTime(now)
    let date = new Date(time.replace(/-/g, '/'))
    super(date);
  }
}

//获取d当前时间多少天后的日期和对应星期
function getDates(days, todate = new Date()) { //todate默认参数是当前日期，可以传入对应时间
    var dateArry = [];
    for (var i = 0; i < days; i++) {
      var dateObj = dateLater(todate, i);
      dateArry.push(dateObj)
    }
    return dateArry;
  }
  /**
   * 传入时间后几天
   * param：传入时间：dates:"2018-04-02",later:往后多少天
   */
  function dateLater(dates, later) {
    let dateObj = {};
    let show_day = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六');
    let date = new Date(dates);
    date.setDate(date.getDate() + later);
    let day = date.getDay();
    dateObj.year = date.getFullYear();
    dateObj.month = date.getMonth() + 1
    // dateObj.month = ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : date.getMonth() + 1);
    dateObj.day = date.getDate()
    // dateObj.day = (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate());
    dateObj.week = show_day[day];
    return dateObj;
  }

export default {
	getDates:getDates,
	dateLater:dateLater,
  /**
   * 设置是否隐藏loading标志
   */
  setHideLoading: function (val) {
    _hide_loading = val;
  },

  /**
   * 隐藏下一次远程请求的loading
   */
  isHideLoading: function () {
    return _hide_loading
  },

  /**
   * 格式化日期 
   */
  formatTime: formatTime,

  /**
   * 计算两个经纬度之间的距离
   */
  distance: distance,

  /**
   * 计算两个经纬度之间的骑行距离
   */
  calculateDistance: calculateDistance,

   /**
   * 计算两个经纬度之间的骑行距离
   */
  calculateDistanceBicycling: calculateDistanceBicycling,
  TiandituCalculateDistanceBicycling: TiandituCalculateDistanceBicycling,
  TiandituGetData: TiandituGetData,
  TiandituGetlat: TiandituGetlat,
  AutonaviCalculateDistanceBicycling,
  AutonaviGetData,
  AutonaviGetlat,
  // 逆地址解析
  inverseAnalysisAddress,
  // 地址解析
  addressResolution,
  // 获取骑行距离
  getTripDist,
//   gcj02ToWgs84Exact: gcj02ToWgs84Exact,
  /**
   * 小于10的格式化函数
   */
  timeFormat: timeFormat,

  /**
   * 倒计时函数
   * @param openTeamTime 开始时间
   * @param duration //持续时间
   */
  countDownDetail: countDownDetail,

  /**
   * 倒计时函数
   * @param openTeamTime 开始时间
   * @param duration //持续时间
   */
  countDown: countDown,
  /**
   * 倒计时函数
   * @param openTeamTime 开始时间
   * @param duration //持续时间
   * @param zero // 是否不足两位补足
   */
  countDownDay: countDownDay,
  /**
   * 处理 Access Token 已过期
   */
  handleLoginStatus: handleLoginStatus,
  /**
   *  数字转中文  
   */
  numberConversion: numberConversion,
  /**
   * 时间戳转时间
   */
  timestampToTime: timestampToTime,
  /**
   * canvas文本断行和省略号
   */
  dealWords: dealWords,
  /**
   * canvas圆角矩形
   */
  roundRect: roundRect,
  /**
   * 获取分享图
   */
  getSharePictures: getSharePictures,

  /**
   * 加入购物车抛物线动画（二次贝塞尔曲线算法）
   */
  bezier: bezier,

  /**
   * 判断当前页面是否是tabbar
   */
  checkIsTabBar: checkIsTabBar,
  /**
   * 生成拼团分享图
   */
  createGroupSharePictures: createGroupSharePictures,
  /**
   * 设置分享信息
   * @param shareData 分享信息
   */
  setSharingPersonInfo: setSharingPersonInfo,
  /**
   * 获取分享信息
   */
  getSharingPersonInfo: getSharingPersonInfo,

  /**
   * 清除分享信息
   */
  removeSharingPersonInfo: removeSharingPersonInfo,

  /**
   * 获取当前页面
   */
  utilGetCurrentPage: utilGetCurrentPage,
  /**
   * 设置礼品卡分享人信息
   */
  setSharingGiftCardPerson: setSharingGiftCardPerson,
  /**
   * 获取分享礼品卡的人信息
   */
  getSharingGiftCardPerson: getSharingGiftCardPerson,
  /**
   * 清除礼品卡分享人信息
   */
  removeSharingGiftCardPerson: removeSharingGiftCardPerson,

  /**
   * 显示消息提示框
   */
  showToast: showToast,
  /**
   * 设置formId
   */
  setWxaFormId: setWxaFormId,
  /**
   * 判断当前设备是否是iPhone X、iPhone XS系列设备
   */
  isIphoneX: isIphoneX,

  /**
   * 将数组根据某一属性排序
   */
  compare: compare,
  /**
   * 获取当前页面分享路径
   */
  getSharePath: getSharePath,
  /**
   * 计算当前活动时间是否过期
   */
  isExpired: isExpired,

  /**
   * 处理UI配置数据
   */
  handleUIConfig: handleUIConfig,
  /**
   * 比较版本
   * @param v1
   * @param v2
   */
  compareVersion: compareVersion,
  /**
   * 绘制圆角矩形
   */
  roundRectColor: roundRectColor,
  roundRectImage: roundRectImage,
  timePassed: timePassed,
  getImageInfo: getImageInfo,
  roundRectColor2: roundRectColor2,
  /**
   * 判断两个对象属性和值是否相等
   */
  isObjectValueEqual: isObjectValueEqual,
  /**
   * 是否开启统配
   */
  isDeliveryProduct: isDeliveryProduct,
  // 是否开启次日达
  isNextDayProduct: isNextDayProduct,

  /**
   * 验证时间格式，形如(2008 - 07 - 22 13: 04: 06)
   */
  validateDateTime: validateDateTime,
  compareMemberGrade: compareMemberGrade,
  throttle: throttle,
  getResponseHeaderDate: getResponseHeaderDate,
  getResponseHeaderTimestamp: getResponseHeaderTimestamp,
  ResponseDate: ResponseDate,
  // 像素转换
  pxToRpx,
  rpxToPx,
  filtToFix,
}