<template>
  <!--components/recommend/recommend-list/recommend-list.wxml-->
  <view class="recommend-box" v-if="recommendingList.length > 0">
    <view class="recommend-title">其他优惠推荐</view>
    <view class="recommend-list">
      <view v-for="(item, index) in recommendingList" :key="index">
        <recommend-item :goods="item" @click="clickRecommendGoods"></recommend-item>
      </view>
    </view>
  </view>
</template>
<script setup>
import _utilsAddressJs from '@/utils/newretail/address'
import _utilsNavPageJs from '@/utils/newretail/navPage'
import _utilsUtilsJs from '@/utils/newretail/utils'
import _utilsImagesPathJs from '@/utils/newretail/imagesPath'
import _apiWisdomServiceJs from '@/service/api/newretail/wisdomService'
import _apiProductServiceJs from '@/service/api/newretail/productService'
import _apiTeamBuyServiceJs from '@/service/api/newretail/teamBuyService'
import _apiBargainServiceJs from '@/service/api/newretail/bargainService'
import { reactive, watch } from 'vue'
import recommendItem from '../recommend-item/recommend-item.vue'
const app = getApp()
// components/recommend/recommend-list/recommend-list.js
const bargainService = _apiBargainServiceJs
const teamBuyService = _apiTeamBuyServiceJs
const productService = _apiProductServiceJs
const wisdomService = _apiWisdomServiceJs
const IMGAGESPATH = _utilsImagesPathJs
const UTILS = _utilsUtilsJs
const NAVPAGE = _utilsNavPageJs
const ADDRESS = _utilsAddressJs
// 获取应用实例
let hasQuery = false
const state = reactive({
  imagesPath: IMGAGESPATH,
  recommendingList: [],
  storeId: '',
  pageType: 'normal',
})
const props = defineProps({
  storeId: {
    type: String,
    value: '',
  },
  type: {
    type: String,
    value: 'normal',
    // normal,payment,shopCart
  },
  excludeId: String,
  excludeType: {
    type: String,
    value: 'GOODS',
  },
  productIds: {
    type: Array,
    value: null,
  },
})
function handleGetRecommendingGoods(storeId) {
  const that = this
  getRecommendingGoods(storeId)
}
function getRecommendingGoods(storeId) {
  const that = this
  if (hasQuery) {
    return
  }
  hasQuery = true
  const storeIdIn = [storeId]
  ADDRESS.getDistributionStore()
    .then((res) => {
      if (res) {
        storeIdIn.push(res.id)
      }
      getNextStoreId(storeIdIn, (storeIdList) => {
        mainHandleGetRecommendingGoods(storeIdList)
      })
    })
    .catch((err) => {
      getNextStoreId(storeIdIn, (storeIdList) => {
        mainHandleGetRecommendingGoods(storeIdList)
      })
    })
}
function getNextStoreId(storeIdIn, callBackFn) {
  ADDRESS.getNextDayStore()
    .then((res) => {
      if (res) {
        storeIdIn.push(res.id)
      }
      callBackFn(storeIdIn)
    })
    .catch((err) => {
      callBackFn(storeIdIn)
    })
}
function getRecommendingCommodities(storeIdIn) {
  const self = this
  return new Promise((resolve, reject) => {
    const postData = {
      page: 1,
      pageSize: 16,
      searchCount: true,
      storeIdIn: storeIdIn[0],
      statusEquals: 'SUBMIT', // 查询已提交的
    }
    bargainService
      .query(postData)
      .then((res) => {
        const tempList = []
        if (res && res.records.length > 0) {
          res.records.forEach((it, idx) => {
            if (!it.isActive || (state.excludeType === 'BARGAIN' && state.excludeId === it.id)) {
              res.records.splice(idx, 1)
            }
          })
          for (let i = 0; i < res.records.length; i++) {
            const item = res.records[i]
            let tempItem = {
              ...item,
              isBargain: true,
            }
            let storeId = storeIdIn[0]
            if (tempItem.business === 'DISTRIBUTION' && storeIdIn.length > 1) {
              storeId = storeIdIn[1]
            }
            const bargainItem = productService
              .getDetails(storeId, item.productId)
              .then((res) => {
                if (!res) {
                  return null
                }
                const balance =
                  res.balance > item.availableStockAmount ? item.availableStockAmount : res.balance
                // 将砍价商品的原价重置为商品在门店中的售价
                tempItem = {
                  ...tempItem,
                  balance,
                  originalPrice: res.sellPrice,
                }
                return tempItem
              })
              .catch((err) => {
                if (err.code === 16015) {
                  let result = null
                  if (app.globalData.storeInfo.id === storeId && storeIdIn.length > 1) {
                    result = productService
                      .getDetails(storeIdIn[1], item.productId)
                      .then((res) => {
                        if (!res) {
                          return null
                        }
                        const balance =
                          res.balance > item.availableStockAmount
                            ? item.availableStockAmount
                            : res.balance
                        // 将砍价商品的原价重置为商品在门店中的售价
                        tempItem = {
                          ...tempItem,
                          balance,
                          originalPrice: res.sellPrice,
                        }
                        return null
                      })
                      .catch((err) => {
                        return null
                      })
                    return result
                  } else {
                    return null
                  }
                } else {
                  console.log(err.message)
                  // UTILS.showToast(err.message)
                  return null
                }
              })
            if (bargainItem) {
              tempList.push(bargainItem)
            }
          }
        }
        Promise.all(tempList).then((res) => {
          let recommendingList = []
          if (res.length < 16) {
            recommendingList = [].concat(res)
            const postData = {
              page: 1,
              pageSize: 16,
              searchCount: true,
              // orgIdIn: storeIdIn.join(","),
              storeIds: storeIdIn.join(','),
              status: 'STARTED',
            }
            teamBuyService
              .query(postData)
              .then((res) => {
                const num = 16 - recommendingList.length
                if (res && res.records && res.records.length > 0) {
                  res.records.forEach((it, idx) => {
                    if (state.excludeType === 'GROUP' && state.excludeId === it.id) {
                      res.splice(idx, 1)
                    }
                  })
                  for (let i = 0; i < res.records.length; i++) {
                    if (i < num) {
                      const item = res.records[i]
                      let tempItem = {
                        ...item,
                        teamLeaderPrice: item.teamLeaderPrice
                          ? item.teamLeaderPrice
                          : item.teamMemberPrice,
                        isTeam: true,
                        memberCount: UTILS.numberConversion.numberToChinese(item.teamMemberCount),
                      }
                      if (item.teamMemberJoinCount != null) {
                        tempItem = {
                          ...tempItem,
                          teamLeaderPrice: item.teamLeaderPrice
                            ? (item.teamLeaderPrice * item.teamMemberJoinCount).toFixed(2)
                            : (item.teamMemberPrice * item.teamMemberJoinCount).toFixed(2),
                        }
                      }
                      recommendingList.push(tempItem)
                    }
                  }
                }
                if (recommendingList.length < 16) {
                  const num = 16 - recommendingList.length
                  const params = {
                    storeIdEq: storeIdIn[0],
                    searchCount: true,
                  }
                  productService
                    .getStoreHotProduct(params)
                    .then((res) => {
                      if (res && res.length > 0) {
                        res.forEach((it, idx) => {
                          if (state.excludeType === 'GOODS' && state.excludeId === it.id) {
                            res.splice(idx, 1)
                          }
                        })
                        for (let i = 0; i < res.length; i++) {
                          if (i < num) {
                            const item = res[i]
                            const tempItem = {
                              ...item,
                              productUrl: item.imageUrl,
                            }
                            recommendingList.push(tempItem)
                          }
                        }
                      }
                      hasQuery = false
                      resolve(recommendingList)
                    })
                    .catch((err) => {
                      hasQuery = false
                      resolve(recommendingList)
                      UTILS.showToast(err.message)
                    })
                } else {
                  hasQuery = false
                  resolve(recommendingList)
                }
              })
              .catch((err) => {
                UTILS.showToast(err.message)
                resolve(recommendingList)
              })
          } else {
            resolve(res)
            hasQuery = false
          }
        })
      })
      .catch((err) => {
        hasQuery = false
        UTILS.showToast(err.message)
        reject(err)
      })
  })
}
function mainHandleGetRecommendingGoods(storeIdIn) {
  const self = this
  getRecommendingCommodities(storeIdIn)
    .then((res) => {
      if (res && res.length > 0) {
        const newList = productsSort(res)
        state.recommendingList = newList
        handleRecommendingGoodsNum(newList.length)
        console.log(newList, 'newList')
      } else {
        handleRecommendingGoodsNum(0)
      }
    })
    .catch((err) => {
      handleRecommendingGoodsNum(0)
    })
}
function productsSort(array) {
  const balanceArray = []
  const allArray = []
  array.forEach((ele) => {
    if (ele.balance <= 0) {
      balanceArray.push(ele)
    } else {
      allArray.push(ele)
    }
  })
  if (app.globalData.systemConfigure.storeProductBalanceIsZeroShow) {
    const tempArray = allArray.concat(balanceArray)
    return tempArray
  } else {
    return allArray
  }
}
function clickRecommendGoods(e) {
  if (e.detail) {
    const res = e.detail
    if (state.pageType === 'normal') {
      if (res.isBargain) {
        const opts = '?barginId=' + res.id
        if (app.globalData.userInfo && app.globalData.userInfo.member) {
          const postData = {
            page: 1,
            pageSize: 1,
            searchCount: true,
            memberIdEquals: app.globalData.userInfo.member.id,
            activityIdEquals: res.id,
            statusIn: ['CREATE', 'SUCCESS'],
          }
          bargainService
            .queryInstance(postData)
            .then((res) => {
              if (!res || !res.records || res.records.length === 0) {
                uni.redirectTo({
                  url: '/pages-sub/newretail/pages/mallModule/bargain/bargainDetails/bargainDetails' + opts,
                })
                return
              }
              if (res.records.length > 0) {
                const opts = '?barginInstanceId=' + res.records[0].id
                uni.redirectTo({
                  url: '/pages-sub/newretail/pages/mallModule/bargain/helpBargain/helpBargain' + opts,
                })
                NAVPAGE.toHelpBargain(opts)
              }
            })
            .catch((err) => {
              util.showToast(err.message)
            })
        } else {
          uni.redirectTo({
            url: '/pages-sub/newretail/pages/mallModule/bargain/bargainDetails/bargainDetails' + opts,
          })
        }
      } else if (res.isTeam) {
        const opts = '?productId=' + res.id + '&storeId=' + state.storeId + '&type=group'
        NAVPAGE.toGoodsDetails(opts)
      } else {
        let opts = '?productId=' + res.id + '&storeId=' + state.storeId + '&type=normal'
        if (res.easyScene != null) {
          opts = opts + '&easyScene=' + res.easyScene
        }
        NAVPAGE.toGoodsDetails(opts)
      }
    } else if (state.pageType === 'shopCart') {
      if (res.isBargain) {
        const opts = '?barginId=' + res.id
        if (app.globalData.userInfo && app.globalData.userInfo.member) {
          const postData = {
            page: 1,
            pageSize: 1,
            searchCount: true,
            memberIdEquals: app.globalData.userInfo.member.id,
            activityIdEquals: res.id,
            statusIn: ['CREATE', 'SUCCESS'],
          }
          bargainService
            .queryInstance(postData)
            .then((res) => {
              if (!res || !res.records || res.records.length === 0) {
                NAVPAGE.toBargainDetails(opts)
                return
              }
              if (res.records.length > 0) {
                const opts = '?barginInstanceId=' + res.records[0].id
                NAVPAGE.toHelpBargain(opts)
              }
            })
            .catch((err) => {
              util.showToast(err.message)
            })
        } else {
          NAVPAGE.toBargainDetails(opts)
        }
      } else if (res.isTeam) {
        const opts = '?productId=' + res.id + '&storeId=' + state.storeId + '&type=group'
        NAVPAGE.toGoodsDetails(opts)
      } else {
        let opts = '?productId=' + res.id + '&storeId=' + state.storeId + '&type=normal'
        if (res.easyScene != null) {
          opts = opts + '&easyScene=' + res.easyScene
        }
        NAVPAGE.toGoodsDetails(opts)
      }
    } else {
      if (res.isBargain) {
        const opts = '?barginId=' + res.id
        if (app.globalData.userInfo && app.globalData.userInfo.member) {
          const postData = {
            page: 1,
            pageSize: 1,
            searchCount: true,
            memberIdEquals: app.globalData.userInfo.member.id,
            activityIdEquals: res.id,
            statusIn: ['CREATE', 'SUCCESS'],
          }
          bargainService
            .queryInstance(postData)
            .then((res) => {
              if (!res || !res.records || res.records.length === 0) {
                uni.redirectTo({
                  url: '/pages-sub/newretail/pages/mallModule/bargain/bargainDetails/bargainDetails' + opts,
                })
                return
              }
              if (res.records.length > 0) {
                const opts = '?barginInstanceId=' + res.records[0].id
                uni.redirectTo({
                  url: '/pages-sub/newretail/pages/mallModule/bargain/helpBargain/helpBargain' + opts,
                })
                NAVPAGE.toHelpBargain(opts)
              }
            })
            .catch((err) => {
              util.showToast(err.message)
            })
        } else {
          uni.redirectTo({
            url: '/pages-sub/newretail/pages/mallModule/bargain/bargainDetails/bargainDetails' + opts,
          })
        }
      } else if (res.isTeam) {
        const opts = '?productId=' + res.id + '&storeId=' + state.storeId + '&type=group'
        uni.redirectTo({
          url: '/pages-sub/newretail/pages/mallModule/goods/goodsDetail/goodsDetail' + opts,
        })
      } else {
        let opts = '?productId=' + res.id + '&storeId=' + state.storeId + '&type=normal'
        if (res.traceid != null) {
          opts = opts + '&traceId=' + res.traceid
        }
        if (res.easyScene != null) {
          opts = opts + '&easyScene=' + res.easyScene
        }
        uni.redirectTo({
          url: '/pages-sub/newretail/pages/mallModule/goods/goodsDetail/goodsDetail' + opts,
        })
      }
    }
  }
}
function handleRecommendingGoodsNum(num) {
  triggerEvent('goodsNum', {
    num,
  })
}

// Watch listeners converted from observers
watch(
  () => props.storeId,
  (newVal, oldVal) => {
    if (properties.type !== 'shopCart' && properties.type !== 'payment') {
      handleGetRecommendingGoods(newVal)
    } else {
      if (properties.productIds) {
        handleGetRecommendingGoods(newVal)
      }
    }
    state.storeId = newVal
  },
)

watch(
  () => props.type,
  (newVal, oldVal) => {
    state.pageType = newVal
  },
)

watch(
  () => props.productIds,
  (newVal, oldVal) => {
    if (
      (properties.type === 'shopCart' || properties.type === 'payment') &&
      newVal != null &&
      properties.storeId !== ''
    ) {
      handleGetRecommendingGoods(properties.storeId)
    }
  },
)
</script>
<style scoped>
/* components/recommend/recommend-list/recommend-list.wxss */
/* 推荐 */
.recommend-box {
  background: #f8f6f9;
  width: 100vw;
}
.recommend-box .recommend-title {
  font-size: 34rpx;
  color: #333;
  text-align: center;
  line-height: 54rpx;
  height: 54rpx;
  padding: 30rpx 0 20rpx 0;
}
.recommend-list {
  width: 100vw;
  box-sizing: border-box;
  padding: 0 20rpx;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
</style>
