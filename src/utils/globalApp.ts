// 全局应用实例管理器，兼容微信小程序的 app 调用
import auth from '@/utils/newretail/auth'
import util from '@/utils/newretail/utils'
import wxaUserService from '@/service/api/newretail/wxaUserService'
import mbrService from '@/service/api/newretail/memberService'
import sysService from '@/service/api/newretail/systemService'
import hmoeService from '@/service/api/newretail/homepageService'
import distributionService from '@/service/api/newretail/distributionService'
import sharePicturesService from '@/service/api/newretail/sharePicturesService'
import storeService from '@/service/api/newretail/storeService'
import ADDRESS from '@/utils/newretail/address'
import shopcartService from '@/service/api/newretail/shopcartService'
// import addToCart from '@/pages/mallModule/template/addCart/addCart.js'
import mta from '@/libs/mta_analysis'
import ANALYSIS from '@/utils/newretail/analysis'
import log from '@/utils/newretail/log'
import backCashService from '@/service/api/newretail/backCashService'
import address from '@/utils/newretail/address'
import request from '@/service/api/newretail/request'

let app = getApp()
// 应用实例类
class AppInstance {
  pageOnLaunch = false;
// 生命周期方法
  onLaunch(options: any) {
    app = getApp()
    app.globalData.authorizeSkip = 0
    uni.setStorageSync('updatePage', 0)
    console.log('场景值', options)

    // 存在渠道扫码进入
    if (options.query?.scene && options.query.scene.indexOf('channel') >= 0) {
      const str = decodeURIComponent(options.query.scene)
      app.globalData.channel = str.split('=')[1]
    }

    // 清除存储
    uni.removeStorage({
      key: 'tabList',
      success: function (res) {
        console.log('删除tab保证再次进入时刷新页面')
      },
    })

    uni.removeStorage({
      key: 'counterSwiperObj',
      success: function (res) { },
    })

    uni.removeStorage({
      key: 'urlSwiperObj',
      success: function (res) { },
    })

    // 获取系统配置的支付方式
    try {
      sysService.query('paymentMethod').then((res: any) => {
        if (res && res.length > 0 && res[0].value) {
          app.globalData.systemConfigure.paymentMethod = res[0].value
          request.PAYMETHOD = res[0].value
        }
      }).catch((err: any) => { })
    } catch (e) { }

    console.log('onLaunch', util.formatTime(new Date()))
    console.log('onLaunchOptions', options)

    if (options.query?.scene) {
      let scene = decodeURIComponent(options.query.scene)
      let introducerld = scene.split('=')[1]
      if (introducerld) {
        uni.setStorageSync('wj_introducerld', introducerld)
      } else {
        if (scene.indexOf('gmparam') === -1) {
          uni.setStorageSync('wj_sceneFormActive', options.query.scene)
        }
      }
    }

    // 获取小程序更新机制
    this.checkUpdateManager()

    // 初始化系统信息
    this.initSystemInfo()

    // 获取用户分享图片
    this.getDefaultSharePictures()

    // 取当前用户
    app.globalData.userInfo = auth.getUser()
    if (app.globalData.userInfo && app.globalData.userInfo.member) {
      this.memberIsGuide(app.globalData.userInfo.member.id)
    }

    // 刷新访问令牌
    this.refreshAccessToken()

    // 获取模板ID
    this.getTemplateIds()

    // 获取商户中心
    this.getMerchantCenter()

    // 获取UI配置
    this.getUiConfig(options)
  }

  // 处理自动刷新商店位置
  handleAutoRefreshStoreLocation(options: any) {
    try {
      sysService.query('autoRefreshStoreLocation').then((res: any) => {
        if (res && res.length > 0 && res[0].value === 'NEAREST') {
          if (!options.query || (!options.query.storeId && (!options.query.scene || options.query.scene.indexOf('gmparam') === -1))) {
            this.getRecentlyStore(options)
          }
        } else {
          uni.setStorageSync('setTip', true)
        }
      }).catch((err: any) => { })
    } catch (e) {
      // Do something when catch error
    }
  }

  onShow(options: any) {
    app = getApp()
    app.globalData.storeInfo = app.globalData.storeInfo && app.globalData.storeInfo.id
      ? app.globalData.storeInfo
      : uni.getStorageSync('storeIdactive')

    if (!app.globalData.storeInfo) {
      storeService.queryList().then((res: any) => {
        if (res && res.length > 0) {
          res.some((item: any) => {
            if (item.status === 'OPEN') {
              app.globalData.storeInfo = item
              uni.setStorageSync('storeIdactive', item)
              return true
            }
            return false
          })
        }
      })
    }

    console.log('onShow', util.formatTime(new Date()))
    console.log('onShowOptions', options)

    // 前端分享定位逻辑增加选项控制
    if (app.globalData.systemConfigure.shareStoreType === 'OWN_STORE') {
      this.getShareStoreId(options)
    }

    uni.setStorage({
      key: '_scene_',
      data: options.scene,
    })

    app.globalData.sceneInfo = options.scene

    if (options.query?.scene) {
      const scene = decodeURIComponent(options.query.scene)
      if (scene && scene === 'isfromQR') {
        app.globalData.scene = scene
        try {
          uni.setStorageSync('wj_sceneForm', app.globalData.scene)
        } catch (e) { }
      } else {
        try {
          const scene = uni.getStorageSync('wj_sceneForm')
          if (scene && scene === 'isfromQR') {
            app.globalData.scene = scene
          }
        } catch (e) { }
      }
    } else {
      let scene = 'isfromQR'
      app.globalData.scene = scene
    }

    console.log('-------------------------------------onShow')
    console.log('shareId:', options.query?.shareId)

    if (options.query?.shareId &&
      options.query.shareId !== '' &&
      app.globalData.systemConfigure.openDistributionAccountShareProduct &&
      !this.pageOnLaunch &&
      app.globalData.systemConfigure.openDistribution) {
      console.log('onShow------------bindDistribution ')
      this.bindDistribution(options.query.shareId)
    }
  }

  onHide() {
    try {
      uni.removeStorage({
        key: '_scene_',
        success: function (res) {
          console.log('删除缓存场景')
        },
      })
      uni.removeStorage({
        key: 'tabList',
        success: function (res) {
          console.log('删除tab保证再次进入时刷新页面')
        },
      })
    } catch (error) {
      console.log(error)
    }

    // 记录VV
    if (app.globalData.storeInfo) {
      ANALYSIS.UniqueVisitorAnalysis(app.globalData.storeInfo.id)
    }
  }

  // 获取最近门店
  getRecentlyStore(options: any) {
    uni.getSetting({
      success: (res) => {
        const authSetting = res.authSetting
        if (authSetting['scope.userLocation']) {
          uni.getLocation({
            type: 'gcj02',
            success: (res) => {
              const latitude = res.latitude
              const longitude = res.longitude
              app.globalData.latitude = res.latitude
              app.globalData.longitude = res.longitude
              app.globalData.location = {
                latitude: res.latitude,
                longitude: res.longitude,
              }
              storeService.queryList().then((res: any) => {
                let newAllStores = []
                res.forEach((item: any) => {
                  if (item.status === 'OPEN') {
                    const dis = util.distance(latitude, longitude, item.latitude, item.longitude)
                    newAllStores.push({
                      ...item,
                      distance: dis,
                    })
                  }
                })
                newAllStores = newAllStores.sort((a: any, b: any) => {
                  return a.distance - b.distance
                })
                let noUpdateFlag = false
                if (options.query && options.query.scene) {
                  noUpdateFlag = res.some((item: any) => {
                    return item.virtualStoreId === options.query.scene
                  })
                }
                if (!noUpdateFlag) {
                  app.globalData.storeInfo = newAllStores && newAllStores[0] ? newAllStores[0] : app.globalData.storeInfo
                  uni.setStorageSync('storeIdactive', app.globalData.storeInfo)
                  uni.setStorageSync('updatePage', 1)
                } else {
                  uni.setStorageSync('setTip', true)
                }
              }).catch((err: any) => {
                uni.setStorageSync('updatePage', 1)
              })
            },
            fail: (res) => {
              uni.setStorageSync('updatePage', 1)
            },
          })
        } else {
          uni.setStorageSync('updatePage', 1)
        }
      },
      fail: (err) => {
        uni.setStorageSync('updatePage', 1)
      },
    })
  }

  // 判断会员是否是导购员
  memberIsGuide(memberId: string) {
    if (memberId) {
      backCashService.memberIsGuide(memberId).then((res: any) => {
        console.log('查询是否是导购员：', res)
        app.globalData.isShoppingGuide = res
      }).catch((err: any) => {
        uni.showToast({
          title: err.message,
          icon: 'none',
          duration: 2000,
        })
      })
    }
  }

  // 刷新访问令牌
  refreshAccessToken() {
    const user = auth.getUser()
    const tokens = auth.getTokens()
    if (!tokens || !tokens.expiresTo) {
      app.globalData.userInfo = null
      console.log('当前用户未登录，请先登录')
      return
    }

    // 如果refresh token也过期，就不再刷新令牌了
    if (tokens.refreshExpiresTo < new Date().getTime()) {
      if (user && user.wxaUser.openId) {
        wxaUserService.login().then((res: any) => {
          app.globalData.userInfo = res
        }).catch((err: any) => {
          console.log('自动登录失败：', err)
          app.globalData.userInfo = null
          console.log('刷新令牌已经过期，请重新登录')
        })
        return
      }
      app.globalData.userInfo = null
      console.log('刷新令牌已经过期，请重新登录')
      return
    }

    if (app.globalData.userInfo.member) {
      mbrService.getLoginMember().then((res: any) => {
        if (app.globalData.userInfo && app.globalData.userInfo.member) {
          app.globalData.userInfo.member = {
            ...app.globalData.userInfo.member,
            ...res,
          }
        }
      }).catch((err: any) => {
        uni.showToast({
          title: err.message,
          icon: 'none',
          duration: 2000
        })
      })
    }

    // 刷新令牌时间，提前30分钟
    const expiresIn = tokens.expiresTo - new Date().getTime() - 60 * 10 * 1000
    const timeout = expiresIn <= 0 ? 1000 : expiresIn
    setTimeout(() => {
      mbrService.refreshToken(tokens.refreshToken)
        .then((data: any) => {
          auth.setTokens(data)
        })
        .catch((err: any) => {
          console.log(err)
        })
    }, timeout)
  }

  // 获取默认分享图
  getDefaultSharePictures() {
    try {
      const sharePictures = uni.getStorageSync('wj_sharePictures')
      if (sharePictures) {
        app.globalData.sharePictures = sharePictures
      }
    } catch (error) { }

    sharePicturesService.getByModelType('DEFAULT').then((res: any) => {
      if (res) {
        app.globalData.sharePictures = res.pictureUrl
        try {
          uni.setStorageSync('wj_sharePictures', res.pictureUrl)
        } catch (error) { }
      }
    }).catch((err: any) => {
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000,
      })
    })
  }

  // 获取系统选项
  getSystemOptions(options: any) {
    try {
      const configureInfo = uni.getStorageSync('wj_systemOptions')
      if (configureInfo) {
        this.handleSystemOption(configureInfo)
      }

      console.log('----------------------配置信息')
      console.log(app.globalData.systemConfigure)

      const keyArr = [
        'producrisStoreCode',
        'lbs_tianditu_appkey',
        'miniprogramSharingName',
        'deliveryDistanceThirdMap',
        'memberAscriptionStoreDistance',
        'homeBackgroundImage',
        'bgMarginTop',
        'liveRoomLogoUrl',
        'homeBackgroundColour',
        'titlebarFotColour',
        'titlebarBackgroundColour',
        'appContactMobile',
        'app.mall.distributionStoreId',
        'app.mall.nextDayStoreId',
        'storeProductBalanceIsZeroShow',
        'isUseExternalCoupon',
        'openDistributionAccountShareProduct',
        'externalCouponPrefix',
        'userCostPrice',
        'fictitiousProductId',
        'memberCodeDisplayPayMethod',
        'showScorePayCode',
        'orderChooseDateAllowDays',
        'orderChooseDateInterval',
        'daysOfSelfTimeDelay',
        'isGiftCard',
        'showExternalCouponActivity',
        'isDeliveryProduct',
        'hasRedPacket',
        'selfTakeCode',
        'supportPartReturn',
        'isBothScoreAndCoupon',
        'openScorePrizeGrade',
        'openDistribution',
        'showVipMemberModule',
        'showCenterMbrModule',
        'enableRecordVisitStore',
        'showCartModule',
        'showHotGoods',
        'showUnreadCoupons',
        'showStorePrize',
        'liveRoomShowCenter',
        'wisdom_source',
        'sandbox_mode',
        'customizedPicture',
        'isRechargePasswordEnabled',
        'isRechargePasswordShow',
        'customerService',
        'customizedPage',
        'app.mall.order.trace.type',
        'app.mall.order.cash-payment',
        'productPlacedAtTheTop',
        'dfs_huaweiDomain',
        'dfs_huaweiEndPoint',
        'dfs_huaweiPrefix',
        'dfs_type',
        'dfs_aliyunDomain',
        'dfs_aliyunPrefix',
        'dfs_qcloudDomain',
        'dfs_qcloudPrefix',
        'isOpenStoreOrder',
      ]

      const keys = keyArr.join(',')
      sysService.query(keys).then((res: any) => {
        console.log('getSystemOptions end', util.formatTime(new Date()).replace(/\//g, '-'))
        this.handleSystemOption(res)
        console.log('----------------查询配置信息')
        console.log(app.globalData.systemConfigure)

        if (app.globalData.systemConfigure.openDistribution) {
          this.getDistributionUser()
        }

        if (options.query?.shareId &&
          options.query.shareId !== '' &&
          app.globalData.systemConfigure.openDistributionAccountShareProduct &&
          app.globalData.systemConfigure.openDistribution) {
          this.bindDistribution(options.query.shareId)
        } else {
          this.pageOnLaunch = false
        }

        if (util.isDeliveryProduct()) {
          this.getDistributionStore()
        }
        this.getNextDayStore()
      }).catch((err: any) => {
        console.log(err)
        this.pageOnLaunch = false
      })
    } catch (e) {
      console.log(e)
      this.pageOnLaunch = false
    }
  }

  // 处理系统选项
  handleSystemOption(res: any) {
    app.globalData.configureInfo = res
    if (res && res.length > 0) {
      res.forEach((item: any) => {
        // 这里需要根据源代码中的处理逻辑来实现
        // 由于内容太多，这里只展示部分关键逻辑
        switch (item.key) {
          case 'app.mall.nextDayStoreId':
            if (item.value != null) {
              app.globalData.systemConfigure.nextDayStoreId = item.value
              uni.setStorageSync('nextDayStoreId', item.value)
            }
            break
          case 'app.mall.distributionStoreId':
            if (item.value != null) {
              app.globalData.systemConfigure.distributionStoreId = item.value
              uni.setStorageSync('distributionStoreId', item.value)
            }
            break
          case 'openDistributionAccountShareProduct':
            app.globalData.systemConfigure.openDistributionAccountShareProduct = item.value === 'TRUE' ? true : false
            break
          case 'openDistribution':
            app.globalData.systemConfigure.openDistribution = item.value === 'TRUE' ? true : false
            break
          // 添加更多处理逻辑...
          default:
            if (item.key.startsWith('dfs_')) {
              app.globalData.dfsObj[item.key] = item.value
            }
            break
        }
      })

      try {
        uni.setStorageSync('wj_systemOptions', res)
      } catch (error) {
        console.log(error)
      }
    }
  }

  // 绑定分销关系
  bindDistribution(memberId: string) {
    if (app.globalData.systemConfigure.openDistributionAccountShareProduct) {
      if (app.globalData.userInfo && app.globalData.userInfo.member) {
        const postData = {
          memberId: memberId,
        }
        distributionService.bind(postData).then((res: any) => {
          console.log('------------绑定分销员上下级关系成功')
          console.log(res)
          this.pageOnLaunch = false
        }).catch((err: any) => {
          console.log('------------绑定分销员上下级关系失败')
          console.log(err.message)
          app.globalData.distributionAccountShareId = memberId
          this.pageOnLaunch = false
        })
      } else {
        app.globalData.distributionAccountShareId = memberId
        console.log('未登录或不是会员')
        this.pageOnLaunch = false
      }
    } else {
      this.pageOnLaunch = false
      console.log('未开启分销员分享商品创建上下级关系')
    }
  }

  // 获取VIP会员配置
  getVipMemberConfig() {
    console.log('是否付费会员配置：', app.globalData.systemConfigure.isEnableVipMember)
    try {
      const config = uni.getStorageSync('wj_vipMemberConfig')
      if (config) {
        app.globalData.systemConfigure.vipGradeConfig = config
      }
      mbrService.getVipMemberGradeConfig().then((res: any) => {
        if (res) {
          app.globalData.systemConfigure.isEnableVipMember = res.enable
          app.globalData.systemConfigure.vipGradeConfig = res
          uni.setStorageSync('wj_vipMemberConfig', res)
        } else {
          app.globalData.systemConfigure.isEnableVipMember = false
        }
      }).catch((err: any) => {
        console.log(err)
      })
    } catch (error) {
      console.log(error)
    }
  }

  // 查询底部菜单
  getTabbar() {
    try {
      if (app.globalData.queryTabbar === 0) {
        const tabBar = uni.getStorageSync('wj_tabBar')
        if (tabBar) {
          app.globalData.tabBar.list = tabBar
        }
        app.globalData.queryTabbar = 1
        hmoeService.query('UNDER_MENU').then((res: any) => {
          if (res && res.length > 0) {
            const tabBar = []
            res.forEach((item: any) => {
              if (item.navigationStatus === 0) {
                const tempItem = {
                  pagePath: this.handlelinkModel(item.linkModel),
                  iconPath: item.imageUrl,
                  selectedIconPath: item.clickImageUrl,
                  text: item.modelName,
                  badge: '0',
                  linkModel: item.linkModel,
                  textColor: item.textColor,
                  textColorNotSelected: item.textColorNotSelected,
                  textColorType: item.textColorType,
                  navigationStyle: item.navigationStyle,
                  colour: item.colour,
                }
                tabBar.push(tempItem)
              }
            })
            try {
              uni.setStorageSync('wj_tabBar', tabBar)
            } catch (error) { }
            app.globalData.tabBar.list = tabBar

            // 获取用户购物车商品数量
            if (app.globalData.userInfo && app.globalData.userInfo.member && app.globalData.systemConfigure.showCartModule) {
              this.getUserProductsCount()
            }

            // 处理tabbar不对的情况
            this.editTabbar()
          }
        }).catch((err: any) => {
          uni.showToast({
            title: err.message,
            icon: 'none',
            duration: 2000,
          })
        })
      }
    } catch (error) { }
  }

  // 处理链接模型
  handlelinkModel(linkModel: string) {
    switch (linkModel) {
      case 'home':
        return '/pages/mallModule/index/index/index'
      case 'sort':
        return '/pages/mallModule/tabbar/category/category-list/category-list'
      case 'shopping_cart':
        return '/pages/mallModule/tabbar/shopcart/shopcart'
      case 'my':
        return '/pages/mallModule/tabbar/my/my'
      case 'memberCode':
        return '/pages/mallModule/myCard/memberCard/memberCard'
      case 'catering':
        return 'catering'
      case 'grab_activity':
        return '/pages/mallModule/activity/seckill/seckill'
      case 'teambuying_activity':
        return '/pages/mallModule/fightGroup/fightGroup/fightGroup'
      case 'live_room':
        return '/pages/mallModule/liveplay/showList/showList'
      case 'self_delivery':
        return '/pages/mallModule/tabbar/selfLifting/selfLifting'
      case 'benefit_plan':
        return '/pages/mallModule/benefitPlan/welfarePlan/welfarePlan'
      default:
        return ''
    }
  }

  // 跳转后修改tabbar
  editTabbar() {
    const tabbar = app.globalData.tabBar
    const currentPages = getCurrentPages()
    if (currentPages.length === 0) return

    const _this = currentPages[currentPages.length - 1]
    if (!_this) return

    let pagePath = _this.route
    if (pagePath.indexOf('/') !== 0) {
      pagePath = '/' + pagePath
    }

    for (const i in tabbar.list) {
      tabbar.list[i].selected = false
      if (tabbar.list[i].pagePath === pagePath) {
        tabbar.list[i].selected = true
      }
    }

    _this.setData({
      tabbar: tabbar,
    })
  }

  // 获取用户购物车商品数量
  getUserProductsCount() {
    const tabBar = app.globalData.tabBar
    try {
      const count = uni.getStorageSync('wj_userProductsCount')
      if (count) {
        if (tabBar.list && tabBar.list.length > 0) {
          tabBar.list.forEach((item: any) => {
            if (item.pagePath === '/pages/mallModule/tabbar/shopcart/shopcart') {
              item.badge = String(count)
            }
          })
        }
        app.globalData.tabBar = tabBar
      }
    } catch (error) { }

    shopcartService.getProductsCount().then((res: any) => {
      const tabBar = app.globalData.tabBar
      if (tabBar.list && tabBar.list.length > 0) {
        tabBar.list.forEach((item: any) => {
          if (item.pagePath === '/pages/mallModule/tabbar/shopcart/shopcart') {
            item.badge = String(res)
          }
        })
      }
      app.globalData.tabBar = tabBar
      this.editTabbar()
      try {
        uni.setStorageSync('wj_userProductsCount', res)
      } catch (error) { }
    }).catch((err: any) => {
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000,
      })
    })
  }

  // 为 tabBar 某一项的右上角添加文本
  setTabBarBadge(linkModel: string, text: string) {
    const tabbar = app.globalData.tabBar
    tabbar.list.forEach((item: any) => {
      if (item.linkModel === linkModel) {
        item.badge = text
      }
    })
    app.globalData.tabBar = tabbar
    this.editTabbar()
  }

  // 获取分享门店信息
  getShareStoreId(options: any) {
    if (options.query?.storeId && options.query.storeId !== '') {
      const storeId = parseInt(options.query.storeId)
      const reg = /^\d+$/
      if (reg.test(storeId)) {
        app.globalData.storeId = JSON.stringify(storeId)
        app.globalData.shareStoreId = JSON.stringify(storeId)
      }
      console.log('分享门店：', JSON.stringify(storeId))
    }
  }

  // 查询订阅消息模板id
  getTemplateIds() {
    uni.getStorage({
      key: 'wj_templateIds',
      success: (res) => {
        app.globalData.templateIds = res
        this.getTemplateIdsFromServer()
      },
      fail: () => {
        this.getTemplateIdsFromServer()
      },
    })
  }

  // 从服务器获取模板ID
  getTemplateIdsFromServer() {
    if (!(app.globalData.userInfo && app.globalData.userInfo.member)) {
      log.info('查询模板id报错：当前用户未登录')
      return
    }

    sysService.getTemplateIds().then((res: any) => {
      if (res) {
        app.globalData.templateIdsQuery = 1
        app.globalData.templateIds = res
      }
      uni.setStorage({
        key: 'wj_templateIds',
        data: res,
      })
    }).catch((err: any) => {
      app.globalData.templateIdsQuery = 1
      log.info('查询模板id报错：', err.message)
    })
  }

  // 查询商户资料
  getMerchantCenter() {
    sysService.queryMerchantCenter().then((res: any) => {
      if (res && res.length > 0) {
        app.globalData.merchantCenter = res[0]
      }
    }).catch((err: any) => {
      app.globalData.merchantCenter = null
      log.info('查询商户资料报错：', err.message)
    })
  }

  // 取得当前用户是否是分销员
  getDistributionUser() {
    try {
      const distributor = uni.getStorageSync('__distributor__')
      if (distributor && distributor !== null && distributor.status === 'AUDITED') {
        app.globalData.distributorInfo = distributor
      } else {
        if (app.globalData.userInfo && app.globalData.userInfo.member) {
          distributionService.getDistributionUser().then((res: any) => {
            if (res) {
              if (res.status === 'AUDITED') {
                app.globalData.distributorInfo = res
              }
              auth.setDistributor(res)
            }
          }).catch((err: any) => {
            console.log(err.message)
          })
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  // 获取次日达门店
  getNextDayStore() {
    const nextDayStore = uni.getStorageSync('wj_nextDayStore')
    if (nextDayStore && nextDayStore !== null) {
      app.globalData.nextDayStore = nextDayStore
    } else {
      storeService.getNextDayStore().then((res: any) => {
        if (res) {
          app.globalData.nextDayStore = res
          uni.setStorageSync('wj_nextDayStore', res)
        }
      }).catch((err: any) => {
        console.log(err)
      })
    }
  }

  // 获取统配门店
  getDistributionStore() {
    const distributionStore = uni.getStorageSync('wj_distributionStore')
    if (distributionStore && distributionStore !== null) {
      app.globalData.distributionStore = distributionStore
    } else {
      storeService.getDistributionStore().then((res: any) => {
        if (res) {
          app.globalData.distributionStore = res
          uni.setStorageSync('wj_distributionStore', res)
        }
      }).catch((err: any) => {
        console.log(err)
      })
    }
  }

  // 获取UI配置
  getUiConfig(options: any) {
    console.log('getUiConfig', util.formatTime(new Date()))
    try {
      const UIConfig = uni.getStorageSync('wj_UIConfig')
      if (UIConfig) {
        this.handleUIConfigData(UIConfig)
      }

      sysService.queryGroup('UI').then((res: any) => {
        console.log('getUiConfig res', util.formatTime(new Date()))
        if (res === null) {
          return
        }
        this.handleUIConfigData(util.handleUIConfig(res))
        this.pageOnLaunch = true

        const arr = JSON.parse(JSON.stringify(res))
        uni.setStorage({
          key: 'wj_UIConfig',
          data: arr,
        })
      })
    } catch (e) {
      console.log('获取UIConfig配置信息出错：', e)
    }

    this.pageOnLaunch = true
    this.getSystemOptions(options)

    if (app.globalData.systemConfigure.showVipMemberModule) {
      this.getVipMemberConfig()
    }

    this.getTabbar()
  }

  // 处理UI配置数据
  handleUIConfigData(res: any) {
    if (res === null) {
      return
    }
    app.globalData.uiconfig = util.handleUIConfig(res)
    console.log('ui配置')
    console.log(app.globalData.uiconfig)

    if (app.globalData && app.globalData.uiconfig && app.globalData.uiconfig.themeColor) {
      uni.setStorageSync('themeColor', app.globalData.uiconfig.themeColor)
    }

    app.globalData.systemConfigure.hasDistributionCenter = res.isShowDistribution

    if (res.shareStoreType && res.shareStoreType === 'OWN_STORE') {
      app.globalData.systemConfigure.shareStoreType = res.shareStoreType
      this.getShareStoreId({ query: {} })
    }

    app.globalData.systemConfigure.orderHiddenLadingCode = res.orderHiddenLadingCode ? true : false
    app.globalData.systemConfigure.isMiNiAppMustAccredit = res.isMiNiAppMustAccredit ? true : false
    app.globalData.systemConfigure.showOfflineOrders = res.showOfflineOrders ? true : false
  }

  // 检查更新管理器
  checkUpdateManager() {
    if (uni.canIUse('getUpdateManager')) {
      const updateManager = uni.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        console.log('是否有新版本？----------------------')
        console.log(res.hasUpdate)
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            uni.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  updateManager.applyUpdate()
                }
              },
            })
          })
          updateManager.onUpdateFailed(function () {
            uni.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
            })
          })
        }
      })
    } else {
      uni.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。',
      })
    }
  }

  // 初始化系统信息
  initSystemInfo() {
    try {
      const res = {
        ...uni.getSystemInfoSync(),
        ...uni.getSystemSetting(),
        ...uni.getAppAuthorizeSetting(),
        ...uni.getDeviceInfo(),
        ...uni.getWindowInfo(),
        ...uni.getAppBaseInfo(),
      }
      console.log(res, 'resresres')
      app.globalData.systemInfo = res
      const model = res.model

      let noFlag = ['iPhone 5', 'iPhone 6', 'iPhone 7', 'iPhone 8'].some((ele: string) =>
        model.search(ele) !== -1
      )
      console.log(model.search('iPhone') !== -1, !noFlag, 'noflag')
      if (model.search('iPhone') !== -1 && !noFlag) {
        app.globalData.isIphoneX = true
        return
      }

      app.globalData.navHeight = res.statusBarHeight + 44
      const version = res.SDKVersion

      // 这里可以添加版本比较逻辑
    } catch (e) {
      console.log(e)
    }
  }

  // 监听器定义
  watch(key: string, method: Function) {
    const obj = app.globalData
    const ori = obj[key]
    if (ori) {
      method(ori)
    }

    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: true,
      set: function (value) {
        this['_' + key] = value
        method(value)
      },
      get: function () {
        if (typeof this['_' + key] === 'undefined') {
          if (ori) {
            this['_' + key] = ori
            return ori
          } else {
            return undefined
          }
        } else {
          return this['_' + key]
        }
      },
    })
  }

  // 更新门店信息
  updateStoreInfo(newValue: any) {
    app.globalData.storeInfo = newValue
  }
}

// 创建全局应用实例
const appInstance = new AppInstance()
// 导出应用实例
export default appInstance
