<template>
  <!--components/home-page/theme-activities/theme-activities.wxml-->
  <view>
    <view class="theme-activities-loading" v-if="!loaded || !isShow">
      <view class="three">
        <view class="left"></view>
        <view class="right">
          <view></view>
          <view></view>
        </view>
      </view>
      <view class="one"></view>
    </view>
    <view v-for="(item, i) in activityList" :key="idx" v-if="activityList.length > 0">
      <!-- 新品活动 -->
      <view v-if="item.type === 'NEW_PRODUCT' && newGoodsList.length > 0">
        <view class="new-goods-bg">
          <view class="new-goods">
            <view class="new-goods-top">
              <view class="new-goods-title">新品专区</view>
              <view class="new-goods-introduce">新品推荐 每周上新</view>
              <view class="new-goods-more" @click="moreNewGoods">
                更多
                <image lazy-load="" class="right-icon" :src="imagesPath.icon_more"></image>
              </view>
            </view>
            <scroll-view class="new-goods-bottom" scroll-x="" style="width: 100%">
              <view>
                <view
                  class="newGoods-item"
                  v-for="(item, index) in newGoodsList"
                  :key="id"
                  :data-productId="item.id"
                  @click="toGoodsDetail"
                >
                  <image
                    lazy-load=""
                    class="newGoods-img"
                    :src="item.imageUrl"
                    mode="aspectFit|aspectFill|widthFix"
                  ></image>
                  <view class="newGoods-name">{{ item.name }}</view>
                </view>
              </view>
            </scroll-view>
          </view>
        </view>
      </view>
      <!-- 普通主题 -->
      <view v-if="item.type === 'NORMAL'">
        <view class="module-box" v-if="item.imageItems.length > 0 || item.products.length > 0">
          <view class="title" v-if="item.showTitle && (item.title || item.subhead)">
            <text :style="'color:' + themeColor">{{ item.title }}</text>
            <text>{{ item.subhead }}</text>
          </view>
          <!-- 单图 -->
          <view
            class="activity-img"
            v-if="item.showType === 'SINGLE' && item.imageItems.length > 0"
          >
            <view v-for="(item, idx) in item.imageItems" :key="idx">
              <image
                lazy-load=""
                :src="item.imageUrl"
                mode="widthFix"
                v-if="idx < 1"
                :data-id="item.id"
                @click="activityJumping"
                :data-item="item"
              ></image>
              <!-- && item.slideshowProduct == 'Y' -->
              <view
                class="swiper_activity_box"
                v-if="item.linkType == 'URL' && item.slideshowProduct == 'Y'"
              >
                <swiper :circular="true" :vertical="true" :autoplay="true" :interval="3000">
                  <view v-for="(itemNum, idx) in item.numberList" :key="idx">
                    <swiper-item @click="activityJumping" :data-item="item" :data-id="item.id">
                      <view v-if="item.arrImages && item.arrImages[itemNum]">
                        <image lazy-load="" :src="item.arrImages[itemNum]"></image>
                      </view>
                      <view v-if="item.arrImages && item.arrImages[itemNum + 1]">
                        <image lazy-load="" :src="item.arrImages[itemNum + 1]"></image>
                      </view>
                    </swiper-item>
                  </view>
                </swiper>
              </view>
              <view
                class="swiper_activity_box"
                v-if="item.appReturnType == 'MIAOSHA' && item.slideshowProduct == 'Y'"
              >
                <swiper :circular="true" :vertical="true" :autoplay="true" :interval="3000">
                  <view v-for="(itemNum, idx) in numberList" :key="idx">
                    <swiper-item @click="activityJumping" :data-item="item" :data-id="item.id">
                      <view v-if="grabData1.products && grabData1.products[itemNum]">
                        <image lazy-load="" :src="grabData1.products[itemNum].imageUrl"></image>
                      </view>
                      <view v-if="grabData1.products && grabData1.products[itemNum + 1]">
                        <image lazy-load="" :src="grabData1.products[itemNum + 1].imageUrl"></image>
                      </view>
                    </swiper-item>
                  </view>
                </swiper>
              </view>
            </view>
          </view>
          <!-- 一行二张 -->
          <view v-if="item.showType === 'TWO_PER_LINE' && item.imageItems.length > 0">
            <view class="activity-img two-per-line-img">
              <view v-for="(item, idx) in item.imageItems" :key="idx">
                <image
                  lazy-load=""
                  :src="item.imageUrl"
                  mode="widthFix"
                  :data-id="item.id"
                  @click="activityJumping"
                  :data-item="item"
                ></image>
                <view
                  class="swiper_activity_box"
                  v-if="item.linkType == 'URL' && item.slideshowProduct == 'Y'"
                >
                  <swiper :circular="true" :vertical="true" :autoplay="true" :interval="3000">
                    <view v-for="(itemNum, idx) in item.numberList" :key="idx">
                      <swiper-item @click="activityJumping" :data-item="item" :data-id="item.id">
                        <view v-if="item.arrImages && item.arrImages[itemNum]">
                          <image lazy-load="" :src="item.arrImages[itemNum]"></image>
                        </view>
                        <view v-if="item.arrImages && item.arrImages[itemNum + 1]">
                          <image lazy-load="" :src="item.arrImages[itemNum + 1]"></image>
                        </view>
                      </swiper-item>
                    </view>
                  </swiper>
                </view>
                <view
                  class="swiper_activity_box"
                  v-if="item.appReturnType == 'MIAOSHA' && item.slideshowProduct == 'Y'"
                >
                  <swiper :circular="true" :vertical="true" :autoplay="true" :interval="3000">
                    <view v-for="(itemNum, idx) in numberList" :key="idx">
                      <swiper-item @click="activityJumping" :data-item="item" :data-id="item.id">
                        <view v-if="grabData1.products && grabData1.products[itemNum]">
                          <image lazy-load="" :src="grabData1.products[itemNum].imageUrl"></image>
                        </view>
                        <view v-if="grabData1.products && grabData1.products[itemNum + 1]">
                          <image
                            lazy-load=""
                            :src="grabData1.products[itemNum + 1].imageUrl"
                          ></image>
                        </view>
                      </swiper-item>
                    </view>
                  </swiper>
                </view>
              </view>
            </view>
          </view>
          <!-- 一行三张 -->
          <view v-if="item.showType === 'THREE_PER_LINE' && item.imageItems.length > 0">
            <view class="activity-img three-per-line-img">
              <view v-for="(item, idx) in item.imageItems" :key="idx">
                <image
                  lazy-load=""
                  :src="item.imageUrl"
                  mode="widthFix"
                  :data-id="item.id"
                  @click="activityJumping"
                  :data-item="item"
                ></image>
                <view
                  class="swiper_activity_box"
                  v-if="item.linkType == 'URL' && item.slideshowProduct == 'Y'"
                >
                  <swiper :circular="true" :vertical="true" :autoplay="true" :interval="3000">
                    <view v-for="(itemNum, idx) in item.numberList" :key="idx">
                      <swiper-item @click="activityJumping" :data-item="item" :data-id="item.id">
                        <view v-if="item.arrImages && item.arrImages[itemNum]">
                          <image lazy-load="" :src="item.arrImages[itemNum]"></image>
                        </view>
                        <view v-if="item.arrImages && item.arrImages[itemNum + 1]">
                          <image lazy-load="" :src="item.arrImages[itemNum + 1]"></image>
                        </view>
                      </swiper-item>
                    </view>
                  </swiper>
                </view>
                <view
                  class="swiper_activity_box"
                  v-if="item.appReturnType == 'MIAOSHA' && item.slideshowProduct == 'Y'"
                >
                  <swiper :circular="true" :vertical="true" :autoplay="true" :interval="3000">
                    <view v-for="(itemNum, idx) in numberList" :key="idx">
                      <swiper-item @click="activityJumping" :data-item="item" :data-id="item.id">
                        <view v-if="grabData1.products && grabData1.products[itemNum]">
                          <image lazy-load="" :src="grabData1.products[itemNum].imageUrl"></image>
                        </view>
                        <view v-if="grabData1.products && grabData1.products[itemNum + 1]">
                          <image
                            lazy-load=""
                            :src="grabData1.products[itemNum + 1].imageUrl"
                          ></image>
                        </view>
                      </swiper-item>
                    </view>
                  </swiper>
                </view>
              </view>
            </view>
          </view>
          <view v-if="item.showType === 'TIVE_PER_LINE' && item.imageItems.length > 0">
            <view class="activity-img three-per-line-img">
              <view v-for="(item, idx) in item.imageItems" :key="idx">
                <image
                  lazy-load=""
                  :src="item.imageUrl"
                  mode="widthFix"
                  :data-id="item.id"
                  @click="activityJumping"
                  :data-item="item"
                ></image>
                <view
                  class="swiper_activity_box"
                  v-if="item.linkType == 'URL' && item.slideshowProduct == 'Y'"
                >
                  <swiper :circular="true" :vertical="true" :autoplay="true" :interval="3000">
                    <view v-for="(itemNum, idx) in item.numberList" :key="idx">
                      <swiper-item @click="activityJumping" :data-item="item" :data-id="item.id">
                        <view v-if="item.arrImages && item.arrImages[itemNum]">
                          <image lazy-load="" :src="item.arrImages[itemNum]"></image>
                        </view>
                        <view v-if="item.arrImages && item.arrImages[itemNum + 1]">
                          <image lazy-load="" :src="item.arrImages[itemNum + 1]"></image>
                        </view>
                      </swiper-item>
                    </view>
                  </swiper>
                </view>
                <view
                  class="swiper_activity_box"
                  v-if="item.appReturnType == 'MIAOSHA' && item.slideshowProduct == 'Y'"
                >
                  <swiper :circular="true" :vertical="true" :autoplay="true" :interval="3000">
                    <view v-for="(itemNum, idx) in numberList" :key="idx">
                      <swiper-item @click="activityJumping" :data-item="item" :data-id="item.id">
                        <view v-if="grabData1.products && grabData1.products[itemNum]">
                          <image
                            lazy-load=""
                            :src="grabData1.products[itemNum].imageUrl"
                            mode="widthFix"
                          ></image>
                        </view>
                        <view v-if="grabData1.products && grabData1.products[itemNum + 1]">
                          <image
                            lazy-load=""
                            :src="grabData1.products[itemNum + 1].imageUrl"
                            mode="widthFix"
                          ></image>
                        </view>
                      </swiper-item>
                    </view>
                  </swiper>
                </view>
              </view>
            </view>
          </view>
          <!-- 三分图 -->
          <view v-if="item.showType === 'THREE' && item.imageItems.length > 0">
            <view class="activity-img three-img">
              <view class="left">
                <view v-for="(item, idx) in item.imageItems" :key="idx">
                  <image
                    lazy-load=""
                    :src="item.imageUrl"
                    v-if="idx < 1"
                    :data-id="item.id"
                    @click="activityJumping"
                    :data-item="item"
                  ></image>
                  <view
                    class="swiper_activity_box"
                    v-if="item.linkType == 'URL' && item.slideshowProduct == 'Y'"
                  >
                    <swiper :circular="true" :vertical="true" :autoplay="true" :interval="3000">
                      <view v-for="(itemNum, idx) in item.numberList" :key="idx">
                        <swiper-item @click="activityJumping" :data-item="item" :data-id="item.id">
                          <view v-if="item.arrImages && item.arrImages[itemNum]">
                            <image lazy-load="" :src="item.arrImages[itemNum]"></image>
                          </view>
                          <view v-if="item.arrImages && item.arrImages[itemNum + 1]">
                            <image lazy-load="" :src="item.arrImages[itemNum + 1]"></image>
                          </view>
                        </swiper-item>
                      </view>
                    </swiper>
                  </view>
                  <view
                    class="swiper_activity_box"
                    v-if="item.appReturnType == 'MIAOSHA' && item.slideshowProduct == 'Y'"
                  >
                    <swiper :circular="true" :vertical="true" :autoplay="true" :interval="3000">
                      <view v-for="(itemNum, idx) in numberList" :key="idx">
                        <swiper-item @click="activityJumping" :data-item="item" :data-id="item.id">
                          <view v-if="grabData1.products && grabData1.products[itemNum]">
                            <image lazy-load="" :src="grabData1.products[itemNum].imageUrl"></image>
                          </view>
                          <view v-if="grabData1.products && grabData1.products[itemNum + 1]">
                            <image
                              lazy-load=""
                              :src="grabData1.products[itemNum + 1].imageUrl"
                            ></image>
                          </view>
                        </swiper-item>
                      </view>
                    </swiper>
                  </view>
                </view>
              </view>
              <view class="right">
                <view v-for="(item, idx) in item.imageItems" :key="idx">
                  <image
                    lazy-load=""
                    :src="item.imageUrl"
                    v-if="idx > 0 && idx < 3"
                    :data-id="item.id"
                    @click="activityJumping"
                    :data-item="item"
                  ></image>
                  <view
                    class="swiper_activity_box"
                    v-if="item.linkType == 'URL' && item.slideshowProduct == 'Y'"
                  >
                    <swiper :circular="true" :vertical="true" :autoplay="true" :interval="3000">
                      <view v-for="(itemNum, idx) in item.numberList" :key="idx">
                        <swiper-item @click="activityJumping" :data-item="item" :data-id="item.id">
                          <view v-if="item.arrImages && item.arrImages[itemNum]">
                            <image lazy-load="" :src="item.arrImages[itemNum]"></image>
                          </view>
                          <view v-if="item.arrImages && item.arrImages[itemNum + 1]">
                            <image lazy-load="" :src="item.arrImages[itemNum + 1]"></image>
                          </view>
                        </swiper-item>
                      </view>
                    </swiper>
                  </view>
                  <view
                    class="swiper_activity_box"
                    v-if="item.appReturnType == 'MIAOSHA' && item.slideshowProduct == 'Y'"
                  >
                    <swiper :circular="true" :vertical="true" :autoplay="true" :interval="3000">
                      <view v-for="(itemNum, idx) in numberList" :key="idx">
                        <swiper-item @click="activityJumping" :data-item="item" :data-id="item.id">
                          <view v-if="grabData1.products && grabData1.products[itemNum]">
                            <image lazy-load="" :src="grabData1.products[itemNum].imageUrl"></image>
                          </view>
                          <view v-if="grabData1.products && grabData1.products[itemNum + 1]">
                            <image
                              lazy-load=""
                              :src="grabData1.products[itemNum + 1].imageUrl"
                            ></image>
                          </view>
                        </swiper-item>
                      </view>
                    </swiper>
                  </view>
                </view>
              </view>
            </view>
          </view>
          <view v-if="item.products.length > 0">
            <!-- 横向滑动 -->
            <scroll-view
              class="module-goods"
              scroll-x=""
              style="width: 100%"
              v-if="item.prdouctDisplayStyle === 'LATERALS_SLIP'"
            >
              <view
                v-for="(item, index) in item.products"
                :key="idx"
                v-if="item.shelvesStatus != 'OFF'"
              >
                <goods-item-small
                  :goods="item"
                  style="display: inline-block"
                  :shopCart="shopCart"
                  :hasUserInfo="hasUserInfo"
                  @onClickGoods="onClickGoods"
                  @addToCart="addToCart"
                  @noop="noop"
                  @getUserInfo="onGetUserInfo"
                ></goods-item-small>
              </view>
            </scroll-view>
            <!-- 列表 -->
            <view class="module-goods" v-if="item.prdouctDisplayStyle === 'LIST'">
              <view
                v-for="(item, index) in item.products"
                :key="idx"
                v-if="item.shelvesStatus != 'OFF'"
              >
                <goods-item
                  :goods="item"
                  :shopCart="shopCart"
                  :hasUserInfo="hasUserInfo"
                  @onClickGoods="onClickGoods"
                  @addToCart="addToCart"
                  @noop="noop"
                  @getUserInfo="onGetUserInfo"
                ></goods-item>
              </view>
            </view>
            <!-- 一行两个 -->
            <view class="module-goods" v-if="item.prdouctDisplayStyle === 'TWO_PER_LINE'">
              <view
                :style="
                  'height: ' +
                  (item.close
                    ? filters.calcGoodsStyle(item.products.length, 2) * 430 - 20
                    : filters.calcGoodsStyle(item.products.length, 2) * 470 - 20) +
                  'rpx;'
                "
              >
                <view
                  v-for="(item, index) in item.products"
                  :key="idx"
                  v-if="item.shelvesStatus != 'OFF'"
                >
                  <goods-item-small
                    :goodsWidth="'48%'"
                    :imageHeight="'300rpx'"
                    :goodsHeight="item.close ? '390rpx' : '434rpx'"
                    style="margin-right: 0"
                    :goods="item"
                    :shopCart="shopCart"
                    :hasUserInfo="hasUserInfo"
                    @onClickGoods="onClickGoods"
                    @addToCart="addToCart"
                    @noop="noop"
                    @getUserInfo="onGetUserInfo"
                  ></goods-item-small>
                </view>
              </view>
            </view>
            <!-- 一行三个 -->
            <view class="module-goods" v-if="item.prdouctDisplayStyle === 'THREE_PER_LINE'">
              <view
                :style="
                  'height: ' +
                  (item.close
                    ? filters.calcGoodsStyle(item.products.length, 3) * 340 - 20
                    : filters.calcGoodsStyle(item.products.length, 3) * 380 - 20) +
                  'rpx;'
                "
              >
                <view
                  v-for="(item, index) in item.products"
                  :key="idx"
                  v-if="item.shelvesStatus != 'OFF'"
                >
                  <goods-item-small
                    :goodsWidth="'31%'"
                    :goodsHeight="item.close ? '300rpx' : '344rpx'"
                    style="margin-right: 0"
                    :goods="item"
                    :shopCart="shopCart"
                    :hasUserInfo="hasUserInfo"
                    @onClickGoods="onClickGoods"
                    @addToCart="addToCart"
                    @noop="noop"
                    @getUserInfo="onGetUserInfo"
                  ></goods-item-small>
                </view>
              </view>
            </view>
            <view class="module-goods" v-if="item.prdouctDisplayStyle === 'TIVE_PER_LINE'">
              <view
                :style="
                  'height: ' +
                  (item.close
                    ? filters.calcGoodsStyle(item.products.length, 3) * 340 - 20
                    : filters.calcGoodsStyle(item.products.length, 3) * 380 - 20) +
                  'rpx;'
                "
              >
                <view v-for="(item, index) in item.products" :key="idx">
                  <goods-item-small
                    :goodsWidth="'31%'"
                    :goodsHeight="item.close ? '300rpx' : '344rpx'"
                    style="margin-right: 0"
                    :goods="item"
                    :shopCart="shopCart"
                    :hasUserInfo="hasUserInfo"
                    @onClickGoods="onClickGoods"
                    @addToCart="addToCart"
                    @noop="noop"
                    @getUserInfo="onGetUserInfo"
                  ></goods-item-small>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <!-- 秒杀主题 -->
      <view v-if="item.type === 'GRAB'">
        <view class="index-grab" v-if="grabData.products.length > 0">
          <view class="title" :style="'color: ' + themeColor">
            <view class="title-left">
              <view class="title-word">
                <view :style="'color:' + themeColor">
                  <image lazy-load="" class="title-icon" :src="imagesPath.iconIndexGrab"></image>
                  限时抢购
                </view>
                <view class="title-desc">欢乐秒杀 嗨购时刻</view>
              </view>
              <view class="time-down">
                <!-- 限时抢购 -->
                <view class="time-tips" v-if="grabData.grabStatus === 'ahead'">距开始:</view>
                <view class="time-tips" v-if="grabData.grabStatus === 'started'">距结束:</view>
                <view class="time-box">
                  <text class="last-hour txt">{{ grabData.countDownTime.hou }}</text>
                  <text class="colon">:</text>
                  <text class="last-minute txt">{{ grabData.countDownTime.min }}</text>
                  <text class="colon">:</text>
                  <text class="last-second txt">{{ grabData.countDownTime.sec }}</text>
                </view>
              </view>
            </view>
            <view class="more" @click="toSeckill">
              全部商品
              <image lazy-load="" class="right-icon" :src="imagesPath.icon_more"></image>
            </view>
          </view>
          <scroll-view
            class="grab-goods-list"
            scroll-x=""
            style="width: 100%"
            v-if="grabData.products.length > 0"
          >
            <!-- <block wx:for="{{grabData.products}}" wx:key="index">
            <goods-item-small goods="{{item}}" hasUserInfo="{{hasUserInfo}}" bind:onClickGoods="onClickGoods" bind:addToCart="addToCart" bind:noop="noop" bind:getUserInfo="onGetUserInfo"></goods-item-small>
          </block> -->
            <view
              class="module-goods-item"
              v-for="(item, index) in grabData.products"
              :key="index"
              :data-activityId="item.activityId"
              :data-productId="item.productId"
              :id="'products-' + item.productId"
              data-type="secondkill"
              @click="toGoodsDetail"
            >
              <view class="module-goods-img">
                <image lazy-load="" :src="item.imageUrl" mode="widthFix"></image>
                <image
                  lazy-load=""
                  class="no-balance"
                  mode="widthFix"
                  :src="imagesPath.soldOutIcon"
                  v-if="
                    (item.storeBalance <= 0 || item.balance <= 0) &&
                    item.business !== 'DISTRIBUTION' &&
                    item.status !== 'OFF'
                  "
                ></image>

                <image
                  lazy-load=""
                  class="no-balance"
                  mode="widthFix"
                  :src="imagesPath.iconLowerShelf"
                  v-if="item.status === 'OFF'"
                ></image>
              </view>
              <view class="module-goods-info">
                <text class="module-goods-name">{{ item.productName }}</text>
                <!-- <text class="module-goods-desc">{{item.productDescription ? item.productDescription : ''}}</text>
              <view class="module-goods-labels">
                <view wx:for="{{item.labels}}" wx:key="index" data-id="{{index}}" wx:if="{{index < 3}}" style="border-color:rgb({{item.color}});color:{{item.color}}">{{item.labelDetails}}</view>
              </view> -->
                <view class="module-goods-price">
                  <text class="nowPrice">
                    <text style="font-size: 24rpx">￥</text>
                    {{ item.price ? item.price : '' }}
                  </text>
                  <text class="oldPrice" v-if="item.originalPrice">
                    <text style="font-size: 24rpx">￥</text>
                    {{ item.originalPrice }}
                  </text>
                </view>
                <!-- <form  bindsubmit="addShopcart" catchtap="addShopcartCatch">
                <view class="add-box">
                  <button wx:if="{{!hasUserInfo}}" bindtap="getUserInfo"></button>
                  <button wx:else form-type="submit" data-addType='grab' data-grabType="{{item.type}}" data-grabActivityId='{{item.activityId}}' data-index="{{i}}" data-id="{{item.productId}}" data-style="{{item.style}}" data-balance="{{item.balance}}" data-business="{{item.business}}" data-availableStockAmount="{{item.availableStockAmount}}"  data-traceId="{{item.traceId}}"
                    hidden="{{item.balance <= 0 && item.business !== 'DISTRIBUTION'}}"></button>
                  <image lazy-load class="add-img" src='{{imagesPath.iconJoin}}'></image>
                </view>
              </form> -->
              </view>
            </view>
          </scroll-view>
        </view>
      </view>
      <!-- 拼团主题 -->
      <view v-if="item.type === 'TEAMBUYING'">
        <view class="index-group" v-if="groupGoodsList.length > 0">
          <view class="title" :style="'color: ' + themeColor">
            <view class="title-word">
              <view :style="'color:' + themeColor">
                <image lazy-load="" class="title-icon" :src="imagesPath.iconIndexGroup"></image>
                多人拼团
              </view>
              <view class="title-desc">多人拼团更优惠</view>
            </view>
            <view class="more" @click="toFightGroup">
              全部商品
              <image lazy-load="" class="right-icon" :src="imagesPath.icon_more"></image>
            </view>
          </view>
          <scroll-view class="group-goods-list" scroll-x="" style="width: 100%">
            <view v-for="(item, index) in groupGoodsList" :key="index">
              <goods-reco :goods="item" goodsType="group" @onClickGoods="onClickGoods"></goods-reco>
            </view>
          </scroll-view>
        </view>
      </view>
      <!-- 砍价主题 -->
      <view v-if="item.type === 'BARGIN'">
        <view class="index-bargain" v-if="bargainList.length > 0">
          <view class="title" :style="'color: ' + themeColor">
            <view class="title-word">
              <view :style="'color:' + themeColor">
                <image lazy-load="" class="title-icon" :src="imagesPath.iconIndexBargain"></image>
                砍价商品
              </view>
              <view class="title-desc">好友砍价 精品低价拿</view>
            </view>
            <view class="more" @click="toBargainList">
              全部商品
              <image lazy-load="" class="right-icon" :src="imagesPath.icon_more"></image>
            </view>
          </view>
          <view class="bargain-goods-list">
            <view v-for="(item, index) in bargainList" :key="item.id">
              <bargain-item
                :bargain-data="item"
                bargain-type="BUY"
                @click="toBargainDetails"
              ></bargain-item>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view
      class="theme-more"
      v-if="totalCount.length >= 10"
      :style="'color:' + theme.color"
      @click="loadMore"
    >
      查看更多>>
    </view>
    <signin :show="themeSignShow" @close="handleMemberSignInCloseByActivity"></signin>
  </view>
</template>
<script setup>
import _utilsSelfJs from '@/utils/newretail/self'
import _utilsAddressJs from '@/utils/newretail/address'
import _homePageCommonBehaviorJs from '../homePageCommonBehavior'
import _lazyLoadPageLazyLoadBaseJs from '../../lazy-load-page/lazy-load-base'
import _utilsAuthorizeJs from '@/utils/newretail/authorize'
import _utilsNavPageJs from '@/utils/newretail/navPage'
import _utilsUtilsJs from '@/utils/newretail/utils'
import _utilsThemeManagerJs from '@/utils/newretail/themeManager'
import _apiBargainServiceJs from '@/service/api/newretail/bargainService'
import _apiNewGoodsServiceJs from '@/service/api/newretail/newGoodsService'
import _apiSeckillServiceJs from '@/service/api/newretail/seckillService'
import _apiTeamBuyServiceJs from '@/service/api/newretail/teamBuyService'
import _apiActivityServiceJs from '@/service/api/newretail/activityService'
import _utilsImagesPathJs from '@/utils/newretail/imagesPath'
import { reactive, watch } from 'vue'
import goodsItemSmall from '../../goods-item-small-new/goods-item-small.vue'
import goodsItem from '../../goods-item/goods-item.vue'
import goodsReco from '../../goods-reco/goods-reco.vue'
import bargainItem from '../../bargain-item/bargain-item.vue'
import signin from '../../signin/signin.vue'
const app = getApp()
// components/home-page/theme-activities/theme-activities.js
const IMGAGESPATH = _utilsImagesPathJs
const activityService = _apiActivityServiceJs
const teamBuyService = _apiTeamBuyServiceJs
const seckillService = _apiSeckillServiceJs
const newGoodsService = _apiNewGoodsServiceJs
const bargainService = _apiBargainServiceJs
const THEME = _utilsThemeManagerJs
const UTILS = _utilsUtilsJs
const NAVPAGE = _utilsNavPageJs
const AUTHORIZE = _utilsAuthorizeJs
const lazyLoadBase = _lazyLoadPageLazyLoadBaseJs
const homePageCommonBehavior = _homePageCommonBehaviorJs
const ADDRESS = _utilsAddressJs
const utilsSelf = _utilsSelfJs
// 获取应用实例
const colorRgba = (sHex, alpha = 1) => {
  // 十六进制颜色值的正则表达式
  const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
  /* 16进制颜色转为RGB格式 */
  let sColor = sHex.toLowerCase()
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      let sColorNew = '#'
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
      }
      sColor = sColorNew
    }
    //  处理六位的颜色值
    const sColorChange = []
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)))
    }
    // return sColorChange.join(',')
    // 或
    return 'rgba(' + sColorChange.join(',') + ',' + alpha + ')'
  } else {
    return sColor
  }
}
const state = reactive({
  imagesPath: IMGAGESPATH,
  loaded: false,
  isShow: false,
  activityList: [],
  groupGoodsList: [],
  // 首页拼团主题活动拼团活动
  newGoodsList: [],
  // 首页新品专区数据
  grabData: [],
  // 首页抢购主题活动抢购数据
  grabData1: [],
  // 首页秒杀模块轮播图数据
  numberList: [],
  secKillTimeId: 0,
  storeId: '',
  theme: THEME,
  page: 1,
  pageSize: 10,
  pageCount: 1,
  totalCount: 0,
  themeSignShow: false,
})
const props = defineProps({
  show: {
    // 属性名
    type: String,
    value: Boolean,
  },
  storeInfo: Object,
  pageScrollData: {
    // 属性名
    type: Object,
    value: {},
  },
  hasUserInfo: Boolean,
  isMember: Boolean,
  refreshType: {
    // 属性名
    type: String,
    value: '',
  },
  shopCart: Object,
})

watch(
  () => props.show,
  (newVal, oldVal) => {
    // 属性值变化时执行
    if (newVal && app.globalData.storeInfo) {
      handleStore()
      reload(true)
    }
  },
)
watch(
  () => props.pageScrollData,
  (newVal, oldVal) => {
    reload(false)
  },
)
watch(
  () => props.refreshType,
  (newVal, oldVal) => {
    // 属性值变化时执行
    if (newVal !== '' && newVal !== 'USER') {
      handleStore()
      reload(true)
    } else if (newVal === 'USER') {
      // 刷新会员数据
      checkUserInfo()
    }
  },
)
function handleStore() {
  if (app.globalData.storeInfo) {
    state.storeId = app.globalData.storeInfo.id
  }
}
function reload(refresh = false) {
  const that = this
  if (!state.loaded) {
    lazyLoadBase
      .determineComponentInVisibleArea('.theme-activities-loading', that)
      .then((res) => {
        if (res) {
          console.log(state.storeId)
          if (state.storeId !== '') {
            state.loaded = true
            state.theme = {
              color:
                app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
                  ? app.globalData.uiconfig.themeColor
                  : uni.getStorageSync('themeColor') || '#FF9F43',
              mainColor:
                app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
                  ? 'color: ' + app.globalData.uiconfig.themeColor + ';'
                  : 'color: ' + (uni.getStorageSync('themeColor') || '#FF9F43'),
              mainBgColor:
                app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
                  ? 'background: ' + app.globalData.uiconfig.themeColor + ';'
                  : 'background: ' + (uni.getStorageSync('themeColor') || '#FF9F43'),
              borderColor:
                app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
                  ? 'border-color: ' + app.globalData.uiconfig.themeColor + ';'
                  : 'border-color: ' + (uni.getStorageSync('themeColor') || '#FF9F43'),
              mainBgGradient:
                app.globalData.uiconfig &&
                app.globalData.uiconfig.themeColor != null &&
                app.globalData.uiconfig.themeColor !== '#FF9F43'
                  ? 'background: linear-gradient(-270deg, ' +
                    app.globalData.uiconfig.themeColor +
                    ', ' +
                    app.globalData.uiconfig.themeColor +
                    ');'
                  : 'background: linear-gradient(-270deg, #FF9F43, #F13327);',
              mainColorRgb:
                app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
                  ? 'color: ' + colorRgba(app.globalData.uiconfig.themeColor, 0.4) + ';'
                  : 'color:rgba(255,159,67, 0.4);',
              borderColorRgb:
                app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
                  ? 'border-color: ' + colorRgba(app.globalData.uiconfig.themeColor, 0.4) + ';'
                  : 'border-color:rgba(255,159,67, 0.4);',
              mainColorRgb02:
                app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
                  ? colorRgba(app.globalData.uiconfig.themeColor, 0.4)
                  : 'rgba(255,159,67, 0.2)',
              BgColorRgb01:
                app.globalData.uiconfig && app.globalData.uiconfig.themeColor != null
                  ? 'background-color: ' + colorRgba(app.globalData.uiconfig.themeColor, 0.1) + ';'
                  : 'background-color:rgba(255,159,67, 0.1);',
            }
            getIndexActivity(state.storeId)
          }
        }
        console.log(res)
      })
      .catch((err) => {
        console.log(err)
      })
  } else if (refresh) {
    getIndexActivity(state.storeId)
  }
}
function getIndexActivity(storeId) {
  const that = this
  if (storeId === '') {
    return
  }
  if (inQueryHomeActivity) {
    console.log('已经在查询', inQueryHomeActivity)
    return
  }
  inQueryHomeActivity = true
  if (props.refreshType !== 'ALL' && props.refreshType !== 'STORE') {
    console.log('主题活动刷新类型', props.refreshType)
    if (state.hasQuery) {
      console.log('是否已经在查询', state.hasQuery)
      return
    }
  }
  state.hasQuery = true
  activityService
    .getActivityByStoreId(storeId)
    .then((res) => {
      inQueryHomeActivity = false
      console.log('获取首页活动======')
      console.log(res)
      let totalCount = 0
      const tempList = []
      let GROUP = false // 拼团
      let GRAB = false // 秒杀
      let BARGIN = false // 砍价
      let NEW = false // 新品
      if (res && res.records.length > 0) {
        totalCount = res.totalCount
        res.records.forEach((item) => {
          item.imageItems.forEach(async (arr) => {
            const arrImages = []
            if (arr.linkType == 'URL' && arr.linkUrl && arr.slideshowProduct == 'Y') {
              let detailsForAdsenseId = null
              if (arr.linkUrl.indexOf('&') > -1) {
                detailsForAdsenseId =
                  arr.linkUrl.indexOf('id=') > -1
                    ? arr.linkUrl.slice(arr.linkUrl.indexOf('?id=') + 4, arr.linkUrl.indexOf('&'))
                    : ''
              } else {
                detailsForAdsenseId =
                  arr.linkUrl.indexOf('id=') > -1
                    ? arr.linkUrl.slice(arr.linkUrl.indexOf('?id=') + 4)
                    : ''
              }
              if (detailsForAdsenseId) {
                await activityService
                  .getDetailsForAdsenseId(detailsForAdsenseId)
                  .then((detailsForAdsense) => {
                    const detailsForAdsenseContent = detailsForAdsense
                      ? JSON.parse(detailsForAdsense.content)
                      : {}
                    detailsForAdsenseContent.forEach((detailsForAdsenseItem) => {
                      if (
                        detailsForAdsenseItem.componentType == 'PRODUCT' &&
                        detailsForAdsenseItem.imgs &&
                        detailsForAdsenseItem.imgs.length > 0
                      ) {
                        detailsForAdsenseItem.imgs.forEach((imgItem) => {
                          arrImages.push(imgItem.imageUrl)
                        })
                      }
                    })
                  })
              }
            }
            if (arrImages && arrImages.length > 0) {
              arr.arrImages = arrImages.length % 2 == 1 ? [...arrImages, ...arrImages] : arrImages
              arr.numberList = []
              arr.arrImages.forEach((product, index) => {
                if (index % 2 == 0) {
                  arr.numberList.push(index)
                }
              })
            } else if (
              arr.linkType == 'URL' &&
              arr.linkUrl &&
              arr.slideshowProduct == 'Y' &&
              !(arrImages && arrImages.length > 0)
            ) {
              arr.slideshowProduct = 'N'
            }
            let tempData = {
              ...item,
            }
            const tempProducts = []
            if (item.type === 'TEAMBUYING' && GROUP === false) {
              // 拼团主题
              GROUP = true
              tempList.push(tempData)
            } else if (item.type === 'NEW_PRODUCT' && NEW === false) {
              NEW = true
              tempList.push(tempData)
            } else if (item.type === 'GRAB' && GRAB === false) {
              // 秒杀主题
              GRAB = true
              tempList.push(tempData)
            } else if (item.type === 'BARGIN' && BARGIN === false) {
              // 砍价主题
              BARGIN = true
              tempList.push(tempData)
            } else if (item.type === 'NORMAL') {
              // 普通主题
              // 判断是单图还是三分图
              let showType = 'SINGLE' // 默认单图
              // showType = item.imageItems[0].showType;
              for (let i = 0; i < item.imageItems.length; i++) {
                const ele = item.imageItems[i]
                if (ele.showType === 'THREE') {
                  showType = 'THREE'
                  break
                } else if (ele.showType === 'THREE_PER_LINE') {
                  showType = 'THREE_PER_LINE'
                  break
                } else if (ele.showType === 'TWO_PER_LINE') {
                  showType = 'TWO_PER_LINE'
                  break
                } else if (ele.showType === 'TIVE_PER_LINE') {
                  showType = 'TIVE_PER_LINE'
                  break
                }
              }
              if (tempData.imageItems && tempData.imageItems.length > 0) {
                tempData.imageItems.forEach((imageItem) => {
                  if (imageItem.appReturnType == 'MIAOSHA' && imageItem.slideshowProduct == 'Y') {
                    console.log(
                      '进入秒杀活动',
                      imageItem.grabActivityIdList,
                      'imageItem.grabActivityIdList',
                    )
                    if (imageItem.grabActivityIdList) {
                      queryGrabActivity1(storeId, imageItem.grabActivityIdList)
                    }
                  }
                })
              }
              tempData.products.forEach((item) => {
                const produtlabel = []
                const promotions = []
                let specifications = ''
                if (item.labels && item.labels.length > 0) {
                  item.labels.forEach((ele) => {
                    if (ele.type === 'GOODSLABEL' && ele.color != null) {
                      produtlabel.push(ele)
                    } else if (ele.type === 'PROMOTIONLABEL') {
                      promotions.push(ele)
                    }
                  })
                }
                if (item.productProperties && item.productProperties.length > 0) {
                  for (let i = 0; i < item.productProperties.length; i++) {
                    const ele = item.productProperties[i]
                    if (ele.propertyName === '规格') {
                      specifications = ele.propertyValue
                      break
                    }
                  }
                }
                const tempItem = {
                  ...item,
                  produtlabel,
                  promotions,
                  specifications,
                }
                tempProducts.push(tempItem)
              })
              tempData = {
                ...tempData,
                products: tempProducts,
                showType,
              }
              const eligiblilities = []
              tempData.products.forEach((item) => {
                if (item.promotions.length > 0) {
                  eligiblilities.push(item)
                }
              })

              // console.log(eligiblilities, "符合条件的内容")
              if (eligiblilities.length > 0) {
                tempData.close = false
                tempData.products.forEach((item) => {
                  item.close = false
                })
              } else {
                tempData.close = true
                tempData.products.forEach((item) => {
                  item.close = true
                })
              }
              // console.log(tempData, "普通活动")
              if (
                !tempList.some((item1) => {
                  return tempData.id == item1.id
                })
              ) {
                tempList.push(tempData)
              }

              // 获取拼团活动数据
              if (GROUP) {
                queryTeamBuyingList(storeId)
              }
              // 获取当前时间段的秒杀活动
              if (GRAB) {
                queryGrabActivity(storeId)
              }
              if (BARGIN) {
                getBargainActivity(storeId)
              }
              // 获取当前店铺新品数据
              if (NEW) {
                queryNewGoodsList(storeId)
              }
              const activityList = tempList.sort(function (a, b) {
                return a.orderNumber - b.orderNumber
              })
              if (tempList.length >= res.records.length) {
                state.activityList = activityList
                state.isShow = true
                state.totalCount = totalCount
                state.hasQuery = false
              }
              // activityList.forEach(item => {
              //     if(item.products && item.products.length > 0) {
              //         item.products.forEach(imgs => {
              //             if(!imgs.imageUrl1) {
              //                 utilsSelf.getTemporaryUrl(imgs.imageUrl).then(res => {
              //                     imgs.imageUrl1 = res;
              //                     that.setData({
              //                         activityList: activityList
              //                     })
              //                 })
              //             }
              //         })
              //     }
              // })
              console.log('活动列表========')
              console.log(state.activityList)
            } else {
            }
          })
        })
      }
    })
    .catch((error) => {
      inQueryHomeActivity = false
      state.isShow = true
      state.hasQuery = false
      uni.showToast({
        title: error.message,
        icon: 'none',
        duration: 2000,
      })
    })
}
function queryTeamBuyingList(storeId) {
  const that = this
  const storeIdIn = [storeId]
  ADDRESS.getDistributionStore()
    .then((res) => {
      if (res) {
        storeIdIn.push(res.id)
      }
      getNextStoreId(storeIdIn, (storeIdList) => {
        handleQueryTeamBuyingList(storeIdList)
      })
    })
    .catch((err) => {
      getNextStoreId(storeIdIn, (storeIdList) => {
        handleQueryTeamBuyingList(storeIdList)
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
function handleQueryTeamBuyingList(storeIdIn) {
  const self = this
  const postData = {
    page: 1,
    pageSize: 4,
    searchCount: true,
    // orgIdIn: storeIdIn.join(","),
    storeIds: storeIdIn.join(','),
    status: 'STARTED',
  }
  teamBuyService
    .query(postData)
    .then((res) => {
      console.log('拼团商品', res)
      const tempList = []
      if (res && res.records && res.records.length > 0) {
        for (let i = 0; i < res.records.length; i++) {
          if (i < 4) {
            const item = res.records[i]
            const tempItem = {
              ...item,
              teamLeaderPrice: item.teamLeaderPrice ? item.teamLeaderPrice : item.teamMemberPrice,
              isTeam: true,
              memberCount: UTILS.numberConversion.numberToChinese(item.teamMemberCount),
              productUrl: item.sharePicture ? item.sharePicture : item.productPicture,
            }
            tempList.push(tempItem)
          }
        }
        state.groupGoodsList = tempList
      }
    })
    .catch((err) => {
      if (err.message != null) {
        uni.showToast({
          title: err.message,
          icon: 'none',
          duration: 2000,
        })
      }
    })
}
function queryGrabActivity(storeId) {
  const self = this
  const storeIdIn = [storeId]
  ADDRESS.getDistributionStore()
    .then((res) => {
      if (res) {
        storeIdIn.push(res.id)
      }
      getNextStoreId(storeIdIn, (storeIdList) => {
        handleQueryGrabActivity(storeIdList)
      })
    })
    .catch((err) => {
      getNextStoreId(storeIdIn, (storeIdList) => {
        handleQueryGrabActivity(storeIdList)
      })
    })
}
function queryGrabActivity1(storeId, activeId) {
  const self = this
  const storeIdIn = [storeId]
  ADDRESS.getDistributionStore()
    .then((res) => {
      if (res) {
        storeIdIn.push(res.id)
      }
      getNextStoreId(storeIdIn, (storeIdList) => {
        handleQueryGrabActivity1(storeIdList, activeId)
      })
    })
    .catch((err) => {
      getNextStoreId(storeIdIn, (storeIdList) => {
        handleQueryGrabActivity1(storeIdList, activeId)
      })
    })
}
function handleQueryGrabActivity1(storeIdIn, activeId11) {
  const storeId = storeIdIn[0]
  const that = this
  const self = this
  const date = new UTILS.ResponseDate()
  const tempDate = UTILS.formatTime(date)
  const tomorrow = addDay(new UTILS.ResponseDate().getTime(), 5)
  const tomorrowDate = UTILS.formatTime(tomorrow)
  const dateString = tempDate.split(' ')[0].replace(/\//g, '-')
  const endDateString = tomorrowDate.split(' ')[0].replace(/\//g, '-')
  const postData = {
    orgIdIn: storeIdIn.join(','),
    statusList: 'CREATED,STARTED',
    startDate: dateString + ' 00:00:00',
    endDate: endDateString + ' 23:59:59',
  }
  if (activeId11) {
    postData.activityIdList = activeId11.join(',')
  }
  seckillService
    .query(postData)
    .then((res) => {
      if (!res || res.length == 0) {
        return
      }
      /**
       * 处理秒杀时间分类
       * endTime/startTime 活动时间区间（忽略返回的日期，只截取时间）
       * endDate/startDate 获取日期区间
       */
      console.log('----->')
      const tempList = [] // 当前时间段的秒杀活动
      const allGrabList = [] // 所有的秒杀活动
      const tempTimeList = []
      if (res && res.length > 0) {
        const date = UTILS.getResponseHeaderDate()
        const data = new UTILS.ResponseDate().getTime()
        let tempGrabData = null
        // 找到当前时间对应的秒杀时间段
        res.forEach((item) => {
          const date = UTILS.getResponseHeaderDate()
          const nowTimeStamp = date.getTime()
          // 格式化当前时间字符串 ("2019/06/27 11:06:19")
          const nowDateTimeStr = UTILS.formatTime(date)

          // 活动开始的日期s
          const startDateYMD = item.startDate.split(' ')[0]
          // 拼接开始日期和开始时间=> 活动开始时间
          const startDateTimeJoined = startDateYMD + ' ' + item.startTime.split(' ')[1]
          const startDateStamp = new Date(startDateTimeJoined.replace(/-/g, '/')).getTime() // 开始日期时间戳

          // 活动结束的日期
          const endDateYMD = item.endDate.split(' ')[0]
          // 拼接结束日期和结束时间=> 活动开始时间
          const endDateTimeJoined = endDateYMD + ' ' + item.endTime.split(' ')[1]
          const endDateStamp = new Date(endDateTimeJoined.replace(/-/g, '/')).getTime() // 结束日期时间戳

          const datetTime = nowDateTimeStr.split(' ')
          const time = item.startTime.split(' ')
          const startTimeArr = item.startTime.split(' ')
          const endTimeArr = item.endTime.split(' ')
          let startTime = null
          let endTime = null
          if (startDateStamp > nowTimeStamp) {
            startTime = startDateYMD + ' ' + startTimeArr[1]
            endTime = endDateYMD + ' ' + endTimeArr[1]
          } else {
            startTime = datetTime[0] + ' ' + startTimeArr[1]
            endTime = datetTime[0] + ' ' + endTimeArr[1]
          }
          // 当天内的时间处理
          const formatedStartTimeStr = startTime.replace(/-/g, '/')
          const dayStartTimeStamp = new Date(formatedStartTimeStr).getTime() // 当日活动开始时间的时间戳

          const dayEndTimeStamp = new Date(endTime.replace(/-/g, '/')).getTime() // 当日活动结束时间的时间戳
          const startDate = startDateTimeJoined
          const newStartDate = startDate.replace(/\//g, '-')
          const countDown = nowTimeStamp - dayStartTimeStamp
          const duration = (dayEndTimeStamp - dayStartTimeStamp) / 1000
          const durationStart = (dayStartTimeStamp - startDateStamp) / 1000
          const dateInfo = null
          let tempTimeData = {
            id: item.id,
            name: item.name,
            startTime: startTime.replace(/\//g, '-'),
            endTime: endTime.replace(/\//g, '-'),
            duration,
            countDown,
            newStartTime: dayStartTimeStamp,
            newEndTime: dayEndTimeStamp,
            products: [],
            storeId,
            grabStatus: 'started',
            secKillTips: '',
            durationStart,
            startDate: newStartDate,
            newstartDateStamp: startDateStamp,
            startDate2: startDateStamp,
          }
          if (startDateStamp > nowTimeStamp) {
            // 判断日期
            tempTimeData = {
              ...tempTimeData,
              status: '未开始',
              active: false,
              grabStatus: 'ahead',
              secKillTips: '本场尚未开抢',
            }
            tempTimeData.time = item.startDate.slice(8, 10) + '日 ' + tempTimeData.time
          } else if (nowTimeStamp >= endDateStamp) {
            tempTimeData = {
              ...tempTimeData,
              status: '已结束',
              active: false,
              grabStatus: 'end',
              secKillTips: '本场已结束 快去赶下一场吧！',
            }
          } else if (dayStartTimeStamp > nowTimeStamp) {
            // 判断时间
            tempTimeData = {
              ...tempTimeData,
              status: '未开始',
              active: false,
              grabStatus: 'ahead',
              secKillTips: '本场尚未开抢',
            }
          } else if (nowTimeStamp >= dayEndTimeStamp) {
            tempTimeData = {
              ...tempTimeData,
              status: '已结束',
              active: false,
              grabStatus: 'end',
              secKillTips: '本场已结束 快去赶下一场吧！',
            }
          } else
            tempTimeData = {
              ...tempTimeData,
              status: '抢购中',
              active: false,
              secKillTips: '火热抢购ing',
            }
          allGrabList.push(tempTimeData)
        })
        function compare(property) {
          return function (a, b) {
            const value1 = a[property]
            const value2 = b[property]
            return value1 - value2
          }
        }
        allGrabList.sort(compare('newStartTime')) // 排序，从小到大
        let key = 0
        let tempDuration = Number.POSITIVE_INFINITY
        for (let i = 0; i < allGrabList.length; i++) {
          if (i === 0 && allGrabList[i].countDown >= 0) {
            tempDuration = allGrabList[i].countDown
          } else {
            if (
              allGrabList[i].countDown >= 0 &&
              tempDuration > allGrabList[i].countDown &&
              allGrabList[i].grabStatus === 'started'
            ) {
              tempDuration = allGrabList[i].countDown
              key = i
            }
          }
        }
        /**
         * 秒杀活动的几种非常规状况
         * 1、当前时间内没有进行中的
         * 2、全部结束
         * 3、没有开始的
         * 1、3为一种情况，全部结束暂不处理？
         */
        allGrabList.forEach((item, index) => {
          if (index === key) {
            if (item.grabStatus === 'started') {
              item = {
                ...item,
                status: '抢购中',
                active: true,
                grabTips: '活动火热进行中！',
              }
              allGrabList[index] = item
            } else {
              const count = key + 1
              if (allGrabList[key].grabStatus === 'ahead') {
                key = key
              } else if (allGrabList[key].grabStatus === 'end') {
                if (allGrabList[count] !== undefined && allGrabList[count].grabStatus === 'ahead') {
                  key = count
                }
              }
            }
          }
        })
        tempGrabData = {
          ...allGrabList[key],
          countDownTime: {},
        }
        tempList.push(tempGrabData)
        let tempProductList = []

        // 查询当前秒杀活动的商品列表
        const postData = {
          activityIdEquals: tempGrabData.id,
        }
        storeIdIn.forEach((ele, index) => {
          postData[`orgIdIn[${index}]`] = ele
        })
        seckillService
          .queryProduct(postData)
          .then((res) => {
            if (res && res.length > 0) {
              res.forEach((ele, i) => {
                let tempProducts = {
                  activityId: ele.activityId,
                  availableStockAmount: ele.availableStockAmount ? ele.availableStockAmount : 0,
                  balance: ele.availableStockAmount ? ele.availableStockAmount : 0,
                  storeBalance: ele.storeBalance ? ele.storeBalance : 0,
                  imageUrl: ele.imageUrl,
                  limitCount: ele.limitCount,
                  originalPrice: ele.originalPrice ? ele.originalPrice.toFixed(2) : '',
                  price: ele.price ? ele.price.toFixed(2) : '',
                  productDescription: ele.productDescription ? ele.productDescription : '',
                  productId: ele.productId,
                  productName: ele.productName,
                  storeId: ele.storeId,
                  totalStockAmount: ele.totalStockAmount ? ele.totalStockAmount : 1,
                  type: ele.type,
                  requiredGrade: ele.requiredGrade,
                  status: ele.storeStatus,
                }
                if (ele.availableStockAmount < 0) {
                  tempProducts = {
                    ...tempProducts,
                    availableStockAmount: 0,
                  }
                }
                if (ele.type === 'SPEC') {
                  // 多规格秒杀商品不会显示已售罄和已下架
                  tempProducts.balance = 999
                  tempProducts.availableStockAmount = 999
                  tempProducts.totalStockAmount = 999
                  tempProducts.status = 'ON'
                }
                let specifications = []
                const produtlabel = []
                const promotions = []
                if (ele.labels && ele.labels.length > 0) {
                  ele.labels.forEach((item) => {
                    if (item.type === 'GOODSLABEL' && item.color != null) {
                      produtlabel.push(item)
                    } else if (item.type === 'PROMOTIONLABEL') {
                      promotions.push(item)
                    }
                  })
                }
                if (ele.propertys && ele.propertys.length > 0) {
                  for (let i = 0; i < ele.propertys.length; i++) {
                    const temp = ele.propertys[i]
                    if (temp.propertyName === '规格') {
                      specifications = temp.propertyValue
                      break
                    }
                  }
                }
                tempProducts = {
                  ...tempProducts,
                  produtlabel,
                  specifications,
                  promotions,
                }
                tempProductList.push(tempProducts)
                // }
              })
            }
            if (tempProductList && tempProductList.length > 0 && tempProductList.length % 2 != 0) {
              tempProductList = tempProductList.concat(tempProductList)
            }
            tempGrabData = {
              ...tempGrabData,
              products: tempProductList,
            }
            state.grabData1 = tempGrabData
            const newList = []
            const numberList = []
            state.grabData1.products.forEach((product, index) => {
              if (index % 2 == 0) {
                numberList.push(index)
              }
              // await utilsSelf.getTemporaryUrl(product.imageUrl).then(imageUrl1 => {
              //     product.imageUrl1 = imageUrl1
              //     newList.push(
              //         {
              //             ...product,
              //             number1: index
              //         }
              //     )
              //     if(newList.length >= that.data.grabData1.products.length) {
              //         newList.sort((a,b) => {
              //             return a.number1 - b.number1
              //         })
              //         that.data.grabData1.products = newList
              //         that.setData({
              //             grabData1: that.data.grabData1,
              //             numberList: numberList
              //         })
              //         console.log(that.data.grabData1, "进入秒杀活动2");
              //     }
              // })
              state.numberList = numberList
            })
            console.log('秒杀活动商品=========')
            console.log(state.grabData1, '进入秒杀活动1')
          })
          .catch((err) => {
            if (err.message != null) {
              uni.showToast({
                title: err.message,
                icon: 'none',
                duration: 2000,
              })
            }
            tempGrabData = {
              ...tempGrabData,
              products: tempProductList,
            }
            state.grabData1 = tempGrabData
          })
      }
    })
    .catch((err) => {
      if (err.message != null) {
        uni.showToast({
          title: err.message,
          icon: 'none',
          duration: 2000,
        })
      }
    })
}
function handleQueryGrabActivity(storeIdIn) {
  const storeId = storeIdIn[0]
  const that = this
  const self = this
  const date = new UTILS.ResponseDate()
  const tempDate = UTILS.formatTime(date)
  const tomorrow = addDay(new UTILS.ResponseDate().getTime(), 1)
  const tomorrowDate = UTILS.formatTime(tomorrow)
  const dateString = tempDate.split(' ')[0].replace(/\//g, '-')
  const endDateString = tomorrowDate.split(' ')[0].replace(/\//g, '-')
  const postData = {
    orgIdIn: storeIdIn.join(','),
    startDate: dateString + ' 00:00:00',
    endDate: endDateString + ' 23:59:59',
  }
  seckillService
    .query(postData)
    .then((res) => {
      if (!res || res.length == 0) {
        return
      }
      /**
       * 处理秒杀时间分类
       * endTime/startTime 活动时间区间（忽略返回的日期，只截取时间）
       * endDate/startDate 获取日期区间
       */
      console.log('----->')
      const tempList = [] // 当前时间段的秒杀活动
      const allGrabList = [] // 所有的秒杀活动
      const tempTimeList = []
      if (res && res.length > 0) {
        const date = UTILS.getResponseHeaderDate()
        const data = new UTILS.ResponseDate().getTime()
        let tempGrabData = null
        // 找到当前时间对应的秒杀时间段
        res.forEach((item) => {
          const date = UTILS.getResponseHeaderDate()
          const nowTimeStamp = date.getTime()
          // 格式化当前时间字符串 ("2019/06/27 11:06:19")
          const nowDateTimeStr = UTILS.formatTime(date)

          // 活动开始的日期s
          const startDateYMD = item.startDate.split(' ')[0]
          // 拼接开始日期和开始时间=> 活动开始时间
          const startDateTimeJoined = startDateYMD + ' ' + item.startTime.split(' ')[1]
          const startDateStamp = new Date(startDateTimeJoined.replace(/-/g, '/')).getTime() // 开始日期时间戳

          // 活动结束的日期
          const endDateYMD = item.endDate.split(' ')[0]
          // 拼接结束日期和结束时间=> 活动开始时间
          const endDateTimeJoined = endDateYMD + ' ' + item.endTime.split(' ')[1]
          const endDateStamp = new Date(endDateTimeJoined.replace(/-/g, '/')).getTime() // 结束日期时间戳

          const datetTime = nowDateTimeStr.split(' ')
          const time = item.startTime.split(' ')
          const startTimeArr = item.startTime.split(' ')
          const endTimeArr = item.endTime.split(' ')
          let startTime = null
          let endTime = null
          if (startDateStamp > nowTimeStamp) {
            startTime = startDateYMD + ' ' + startTimeArr[1]
            endTime = endDateYMD + ' ' + endTimeArr[1]
          } else {
            startTime = datetTime[0] + ' ' + startTimeArr[1]
            endTime = datetTime[0] + ' ' + endTimeArr[1]
          }
          // 当天内的时间处理
          const formatedStartTimeStr = startTime.replace(/-/g, '/')
          const dayStartTimeStamp = new Date(formatedStartTimeStr).getTime() // 当日活动开始时间的时间戳

          const dayEndTimeStamp = new Date(endTime.replace(/-/g, '/')).getTime() // 当日活动结束时间的时间戳
          const startDate = startDateTimeJoined
          const newStartDate = startDate.replace(/\//g, '-')
          const countDown = nowTimeStamp - dayStartTimeStamp
          const duration = (dayEndTimeStamp - dayStartTimeStamp) / 1000
          const durationStart = (dayStartTimeStamp - startDateStamp) / 1000
          const dateInfo = null
          let tempTimeData = {
            id: item.id,
            name: item.name,
            startTime: startTime.replace(/\//g, '-'),
            endTime: endTime.replace(/\//g, '-'),
            duration,
            countDown,
            newStartTime: dayStartTimeStamp,
            newEndTime: dayEndTimeStamp,
            products: [],
            storeId,
            grabStatus: 'started',
            secKillTips: '',
            durationStart,
            startDate: newStartDate,
            newstartDateStamp: startDateStamp,
            startDate2: startDateStamp,
          }
          if (startDateStamp > nowTimeStamp) {
            // 判断日期
            tempTimeData = {
              ...tempTimeData,
              status: '未开始',
              active: false,
              grabStatus: 'ahead',
              secKillTips: '本场尚未开抢',
            }
            tempTimeData.time = item.startDate.slice(8, 10) + '日 ' + tempTimeData.time
          } else if (nowTimeStamp >= endDateStamp) {
            tempTimeData = {
              ...tempTimeData,
              status: '已结束',
              active: false,
              grabStatus: 'end',
              secKillTips: '本场已结束 快去赶下一场吧！',
            }
          } else if (dayStartTimeStamp > nowTimeStamp) {
            // 判断时间
            tempTimeData = {
              ...tempTimeData,
              status: '未开始',
              active: false,
              grabStatus: 'ahead',
              secKillTips: '本场尚未开抢',
            }
          } else if (nowTimeStamp >= dayEndTimeStamp) {
            tempTimeData = {
              ...tempTimeData,
              status: '已结束',
              active: false,
              grabStatus: 'end',
              secKillTips: '本场已结束 快去赶下一场吧！',
            }
          } else
            tempTimeData = {
              ...tempTimeData,
              status: '抢购中',
              active: false,
              secKillTips: '火热抢购ing',
            }
          allGrabList.push(tempTimeData)
        })
        function compare(property) {
          return function (a, b) {
            const value1 = a[property]
            const value2 = b[property]
            return value1 - value2
          }
        }
        allGrabList.sort(compare('newStartTime')) // 排序，从小到大
        let key = 0
        let tempDuration = Number.POSITIVE_INFINITY
        for (let i = 0; i < allGrabList.length; i++) {
          if (i === 0 && allGrabList[i].countDown >= 0) {
            tempDuration = allGrabList[i].countDown
          } else {
            if (
              allGrabList[i].countDown >= 0 &&
              tempDuration > allGrabList[i].countDown &&
              allGrabList[i].grabStatus === 'started'
            ) {
              tempDuration = allGrabList[i].countDown
              key = i
            }
          }
        }
        /**
         * 秒杀活动的几种非常规状况
         * 1、当前时间内没有进行中的
         * 2、全部结束
         * 3、没有开始的
         * 1、3为一种情况，全部结束暂不处理？
         */
        allGrabList.forEach((item, index) => {
          if (index === key) {
            if (item.grabStatus === 'started') {
              item = {
                ...item,
                status: '抢购中',
                active: true,
                grabTips: '活动火热进行中！',
              }
              allGrabList[index] = item
            } else {
              const count = key + 1
              if (allGrabList[key].grabStatus === 'ahead') {
                key = key
              } else if (allGrabList[key].grabStatus === 'end') {
                if (allGrabList[count] !== undefined && allGrabList[count].grabStatus === 'ahead') {
                  key = count
                }
              }
            }
          }
        })
        tempGrabData = {
          ...allGrabList[key],
          countDownTime: {},
        }
        tempList.push(tempGrabData)
        const tempProductList = []

        // 查询当前秒杀活动的商品列表
        const postData = {
          activityIdEquals: tempGrabData.id,
        }
        storeIdIn.forEach((ele, index) => {
          postData[`orgIdIn[${index}]`] = ele
        })
        seckillService
          .queryProduct(postData)
          .then((res) => {
            if (res && res.length > 0) {
              res.forEach((ele, i) => {
                let tempProducts = {
                  activityId: ele.activityId,
                  availableStockAmount: ele.availableStockAmount ? ele.availableStockAmount : 0,
                  balance: ele.availableStockAmount ? ele.availableStockAmount : 0,
                  storeBalance: ele.storeBalance ? ele.storeBalance : 0,
                  imageUrl: ele.imageUrl,
                  limitCount: ele.limitCount,
                  originalPrice: ele.originalPrice ? ele.originalPrice.toFixed(2) : '',
                  price: ele.price ? ele.price.toFixed(2) : '',
                  productDescription: ele.productDescription ? ele.productDescription : '',
                  productId: ele.productId,
                  productName: ele.productName,
                  storeId: ele.storeId,
                  totalStockAmount: ele.totalStockAmount ? ele.totalStockAmount : 1,
                  type: ele.type,
                  requiredGrade: ele.requiredGrade,
                  status: ele.storeStatus,
                }
                if (ele.availableStockAmount < 0) {
                  tempProducts = {
                    ...tempProducts,
                    availableStockAmount: 0,
                  }
                }
                if (ele.type === 'SPEC') {
                  // 多规格秒杀商品不会显示已售罄和已下架
                  tempProducts.balance = 999
                  tempProducts.availableStockAmount = 999
                  tempProducts.totalStockAmount = 999
                  tempProducts.status = 'ON'
                }
                let specifications = []
                const produtlabel = []
                const promotions = []
                if (ele.labels && ele.labels.length > 0) {
                  ele.labels.forEach((item) => {
                    if (item.type === 'GOODSLABEL' && item.color != null) {
                      produtlabel.push(item)
                    } else if (item.type === 'PROMOTIONLABEL') {
                      promotions.push(item)
                    }
                  })
                }
                if (ele.propertys && ele.propertys.length > 0) {
                  for (let i = 0; i < ele.propertys.length; i++) {
                    const temp = ele.propertys[i]
                    if (temp.propertyName === '规格') {
                      specifications = temp.propertyValue
                      break
                    }
                  }
                }
                tempProducts = {
                  ...tempProducts,
                  produtlabel,
                  specifications,
                  promotions,
                }
                tempProductList.push(tempProducts)
                // }
              })
            }
            tempGrabData = {
              ...tempGrabData,
              products: tempProductList,
            }
            state.grabData = tempGrabData
            console.log('秒杀活动商品=========')
            console.log(state.grabData, '进入秒杀活动1')
          })
          .catch((err) => {
            if (err.message != null) {
              uni.showToast({
                title: err.message,
                icon: 'none',
                duration: 2000,
              })
            }
            tempGrabData = {
              ...tempGrabData,
              products: tempProductList,
            }
            state.grabData = tempGrabData
          })

        /**
         * 计算倒计时的逻辑
         * 通过当前时间进行判断，
         * 如果活动开始则传入结束时间计算距离结束的时间
         * 如果活动未开始则传入开始时间计算距离开始的时间
         * 通过重复执行的倒计时函数一直对这些数据进行计算
         * 计算的耗时，待观察？
         */
        countDown()
        // 执行倒计时函数
        function countDown() {
          clearTimeout(state.secKillTimeId)
          const now = new UTILS.ResponseDate()
          const nowTimeStamp = new Date(UTILS.formatTime(now)).getTime()
          // 获取倒计时
          const timeInfo = []
          // 将活动的结束时间参数提成一个单独的数组，方便操作
          tempList.forEach((o) => {
            if (nowTimeStamp < o.newStartTime) {
              // 即将开始
              const tempTime = {
                openTeamTime: o.startDate,
                duration: o.durationStart,
              }
              timeInfo.push(tempTime)
            } else if (nowTimeStamp > o.newEndTime) {
              // 已结束
              const tempTime = {
                openTeamTime: o.startTime,
                duration: o.duration,
              }
              timeInfo.push(tempTime)
            } else if (nowTimeStamp >= o.newStartTime && nowTimeStamp < o.newEndTime) {
              // 进行中
              const tempTime = {
                openTeamTime: o.startTime,
                duration: o.duration,
              }
              timeInfo.push(tempTime)
            }
          })
          const countDownArr = UTILS.countDown(timeInfo)
          countDownArr.forEach((time) => {
            state.grabData.countDownTime = time
          })
          state.grabData.countDownTime = state.grabData.countDownTime
          const time = setTimeout(function () {
            countDown()
          }, 1000)
          state.secKillTimeId = time
        }
      }
    })
    .catch((err) => {
      if (err.message != null) {
        uni.showToast({
          title: err.message,
          icon: 'none',
          duration: 2000,
        })
      }
    })
}
function queryNewGoodsList(storeId) {
  const that = this
  const storeIdIn = [storeId]
  ADDRESS.getDistributionStore()
    .then((res) => {
      if (res) {
        storeIdIn.push(res.id)
      }
      getNextStoreId(storeIdIn, (storeIdList) => {
        handleQueryNewGoodsList(storeIdList)
      })
    })
    .catch((err) => {
      getNextStoreId(storeIdIn, (storeIdList) => {
        handleQueryNewGoodsList(storeIdList)
      })
    })
}
function handleQueryNewGoodsList(storeIdIn) {
  const self = this
  const opts = {
    page: 1,
    pageSize: 10,
    storeIdIn: storeIdIn.join(','),
  }
  newGoodsService
    .query(opts)
    .then((res) => {
      const data = res.records
      state.newGoodsList = data
    })
    .catch((error) => {
      uni.showToast({
        title: error.message,
        icon: 'none',
        duration: 2000,
      })
    })
}
function addDay(curDate, days) {
  return new Date((curDate / 1000 + 86400 * days) * 1000)
}
function getBargainActivity(storeId) {
  const self = this
  const storeIdIn = [storeId]
  // ADDRESS.getDistributionStore().then(res => {
  //   if (res) {
  //     storeIdIn.push(res.id)
  //   }
  //   self.handleGetBargainActivity(storeIdIn)
  // }).catch(err => {
  //   self.handleGetBargainActivity(storeIdIn)
  // })
  handleGetBargainActivity(storeIdIn)
}
function handleGetBargainActivity(storeIdIn) {
  const self = this
  const postData = {
    page: 1,
    pageSize: 3,
    searchCount: true,
    storeIdIn: storeIdIn.join(','),
    statusEquals: 'SUBMIT', // 查询已提交的
  }
  bargainService
    .query(postData)
    .then((res) => {
      const tempList = []
      if (res.records && res.records.length > 0) {
        res.records.forEach((item) => {
          const tempItem = {
            ...item,
          }
          if (item.isActive) {
            tempList.push(tempItem)
          }
        })
        state.bargainList = tempList
      }
    })
    .catch((err) => {
      UTILS.showToast(err.message)
    })
}
function onGetUserInfo(e) {
  getUserInfo(e.detail)
}
function toBargainDetails(e) {
  if (e.detail && e.detail.id) {
    // 判断当前砍价活动是否可以购买
    const opts = '?barginId=' + e.detail.id
    if (app.globalData.userInfo && app.globalData.userInfo.member) {
      const postData = {
        page: 1,
        pageSize: 1,
        searchCount: true,
        memberIdEquals: app.globalData.userInfo.member.id,
        activityIdEquals: e.detail.id,
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
  }
}
function toBargainList() {
  NAVPAGE.toBargainList()
}
function toFightGroup() {
  NAVPAGE.toFightGroup()
}
function toSeckill() {
  NAVPAGE.toSeckill()
}
function moreNewGoods() {
  NAVPAGE.toNewGoods()
}
function loadMore() {
  const that = this
  if (state.page < state.pageCount) {
    // 如果查询结果数量不为0，说明还有下一页，执行查询操作
    state.loading = true
    state.hasQuery = false
    let page = state.page
    ++page
    queryIndexActivity(state.storeId, page)
  } else {
    // 没有下一页，提示已经查询完毕
    console.log('已查询完所有主题活动')
  }
}
function queryIndexActivity(storeId, page, pageSize) {
  const that = this
  if (inQueryHomeActivity) {
    return
  }
  inQueryHomeActivity = true
  page = page && page != null ? page : 1
  pageSize = (pageSize && pageSize != null) || pageSize === 0 ? pageSize : 4
  const opts = {
    storeId,
    onlyActivited: true,
  }
  activityService
    .queryPage(page, pageSize, opts)
    .then((res) => {
      inQueryHomeActivity = false
      console.log('获取首页活动======')
      console.log(res)
      const tempList = []
      let GROUP = false // 拼团
      let GRAB = false // 秒杀
      let BARGIN = false // 砍价
      let NEW = false // 新品
      let pageCount = 1
      if (res && res.records && res.records.length > 0) {
        const newList = []
        res.records.forEach((el) => {
          if (!UTILS.isExpired(el.beginTime, el.endTime)) {
            newList.push(el)
          }
        })
        res.records = newList
        res.records.forEach((item) => {
          let tempData = {
            ...item,
          }
          const tempProducts = []
          if (item.type === 'TEAMBUYING' && GROUP === false) {
            // 拼团主题
            GROUP = true
            tempList.push(tempData)
          } else if (item.type === 'NEW_PRODUCT' && NEW === false) {
            NEW = true
            tempList.push(tempData)
          } else if (item.type === 'GRAB' && GRAB === false) {
            // 秒杀主题
            GRAB = true
            tempList.push(tempData)
          } else if (item.type === 'BARGIN' && BARGIN === false) {
            // 砍价主题
            BARGIN = true
            tempList.push(tempData)
          } else if (item.type === 'NORMAL') {
            // 普通主题
            // 判断是单图还是三分图
            let showType = 'SINGLE' // 默认单图
            // showType = item.imageItems[0].showType;
            for (let i = 0; i < item.imageItems.length; i++) {
              const ele = item.imageItems[i]
              if (ele.showType === 'THREE') {
                showType = 'THREE'
                break
              } else if (ele.showType === 'THREE_PER_LINE') {
                showType = 'THREE_PER_LINE'
                break
              } else if (ele.showType === 'TWO_PER_LINE') {
                showType = 'TWO_PER_LINE'
                break
              } else if (ele.showType === 'TIVE_PER_LINE') {
                showType = 'TIVE_PER_LINE'
                break
              }
            }
            tempData.products.forEach((item) => {
              const produtlabel = []
              const promotions = []
              let specifications = ''
              if (item.labels && item.labels.length > 0) {
                item.labels.forEach((ele) => {
                  if (ele.type === 'GOODSLABEL' && ele.color != null) {
                    produtlabel.push(ele)
                  } else if (ele.type === 'PROMOTIONLABEL') {
                    promotions.push(ele)
                  }
                })
              }
              if (item.productProperties && item.productProperties.length > 0) {
                for (let i = 0; i < item.productProperties.length; i++) {
                  const ele = item.productProperties[i]
                  if (ele.propertyName === '规格') {
                    specifications = ele.propertyValue
                    break
                  }
                }
              }
              const tempItem = {
                ...item,
                produtlabel,
                promotions,
                specifications,
              }
              tempProducts.push(tempItem)
            })
            tempData = {
              ...tempData,
              products: tempProducts,
              showType,
            }
            const eligiblilities = []
            tempData.products.forEach((item) => {
              if (item.promotions.length > 0) {
                eligiblilities.push(item)
              }
            })

            // console.log(eligiblilities, "符合条件的内容")
            if (eligiblilities.length > 0) {
              tempData.products.forEach((item) => {
                item.close = false
              })
            } else {
              tempData.products.forEach((item) => {
                item.close = true
              })
            }
            // console.log(tempData, "普通活动")
            tempList.push(tempData)
          } else {
          }
        })
        pageCount = parseInt(res.recordCount / res.pageSize) + 1
      }

      // 获取拼团活动数据
      if (GROUP) {
        queryTeamBuyingList(storeId)
      }
      // 获取当前时间段的秒杀活动
      if (GRAB) {
        queryGrabActivity(storeId)
      }
      if (BARGIN) {
        getBargainActivity(storeId)
      }
      // 获取当前店铺新品数据
      if (NEW) {
        queryNewGoodsList(storeId)
      }
      let allList = state.activityList
      allList = allList.concat(tempList)
      // allList.forEach(item => {
      //     if(item.products && item.products.length > 0) {
      //         item.products.forEach(imgs => {
      //             if(!imgs.imageUrl1) {
      //                 utilsSelf.getTemporaryUrl(imgs.imageUrl).then(res => {
      //                     imgs.imageUrl1 = res;
      //                     that.setData({
      //                         activityList: allList
      //                     })
      //                 })
      //             }
      //         })
      //     }
      // })
      state.activityList = allList
      state.page = res.page
      state.pageCount = pageCount
      state.totalCount = res.totalCount
      if (!state.isShow) {
        state.isShow = true
      }
      console.log('活动列表========')
      console.log(state.activityList)
    })
    .catch((err) => {
      console.log(err)
      inQueryHomeActivity = false
      UTILS.showToast(err.message)
    })
}
function handleActivityData(res) {
  const that = this
}
</script>
<style scoped>
/* components/home-page/theme-activities/theme-activities.wxss */
/* loading */
.theme-activities-loading {
  padding: 0 40rpx;
}

.theme-activities-loading .three {
  display: flex;
  justify-content: space-between;
  margin-bottom: 40rpx;
}

.theme-activities-loading .three .left {
  /* background: #EFEFEF; */
  width: 336rpx;
  height: 280rpx;
  border-radius: 8rpx;
  margin-right: 20rpx;
}

.theme-activities-loading .three .right {
  width: 336rpx;
  height: 280rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.theme-activities-loading .three .right view {
  width: 336rpx;
  height: 130rpx;
  border-radius: 8rpx;
  /* background: #EFEFEF; */
}

.theme-activities-loading .one {
  /* background: #EFEFEF; */
  width: 670rpx;
  height: 250rpx;
  border-radius: 8rpx;
}

.group-title {
  padding: 17rpx 40rpx 9rpx 40rpx;
}

.group-title text {
  color: #454545;
  display: block;
  line-height: 48rpx;
}

.group-title text:first-of-type {
  font-size: 42rpx;
  margin-bottom: 5rpx;
  font-weight: bold;
}

.group-title text:last-of-type {
  font-size: 28rpx;
}

.activity-box {
  padding: 0 30rpx 20rpx 30rpx;
}

.activity-item {
  width: 100%;
  margin-bottom: 20rpx;
  display: flex;
  height: 180rpx;
  justify-content: center;
}

.activity-item image {
  width: 100%;
  height: 100%;
}

.activity-item:last-of-type {
  margin-bottom: 0;
}

.store-title {
  text-align: center;
  width: 400rpx;
  padding: 0 18rpx;
  height: 50rpx;
  background: #e5fffa;
  border-radius: 25px;
  font-size: 28rx;
  line-height: 50rpx;
  color: #454545;
  font-weight: bold;
  margin: 30rpx auto 40rpx auto;
}

.store-title > text {
  display: inline-block;
  position: relative;
  padding: 0 13rpx;
}

.store-title > text::before,
.store-title > text::after {
  content: '';
  width: 103rpx;
  height: 2rpx;
  background: #8b8b8c;
  position: absolute;
  top: 25rpx;
  display: block;
}

.store-title > text::before {
  left: -103rpx;
}

.store-title > text::after {
  right: -103rpx;
}

.list-box {
  width: 100%;
  height: 88rpx;
  margin: 0rpx;
  padding: 0rpx;
  border-bottom: 1rpx solid #e9e9e9;
}

.category-list {
  white-space: nowrap;
}

.category-list .category-item {
  display: inline-block;
  height: 86rpx;
  line-height: 86rpx;
  font-size: 32rpx;
  margin: 0rpx 25rpx;
}

.category-list .category-item.active {
  color: #009f55;
  border-bottom: 4rpx solid #009f55;
}

.goods-box {
  padding: 20rpx 40rpx 0 40rpx;
  /* display: flex; */
  justify-content: space-between;
  flex-wrap: wrap;
}

.no-authorization {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.no-authorization image {
  width: 257rpx;
  height: 261rpx;
  margin-top: 40%;
}

.no-authorization text {
  font-size: 28rpx;
  color: #666;
  line-height: 36rpx;
  margin-bottom: 60rpx;
}

.no-authorization .open-power {
  width: 480rpx;
  height: 90rpx;
  border-radius: 45rpx;
  background: #009f55;
  font-size: 32rpx;
  line-height: 90rpx;
  color: #fff;
}

/* 新品专区 */

.new-goods-bg {
  width: 100%;
  height: 365rpx;
  padding: 26rpx 20rpx 23rpx 20rpx;
  box-sizing: border-box;
  background-color: #f5f5f5;
}

.new-goods-bg .new-goods {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-radius: 14rpx;
}

.new-goods-bg .new-goods .new-goods-top {
  width: 100%;
  height: 96rpx;
  padding: 26rpx 32rpx 14rpx 21rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}

.new-goods-bg .new-goods .new-goods-top .new-goods-title {
  width: 174rpx;
  height: 56rpx;
  background-color: #fe8800;
  border: 4rpx solid #ffa801;
  box-sizing: border-box;
  font-size: 32rpx;
  font-family: Source Han Sans CN;
  font-weight: bold;
  color: rgba(255, 255, 255, 1);
  text-align: center;
  line-height: 48rpx;
  border-radius: 24rpx;
}

.new-goods-bg .new-goods .new-goods-top .new-goods-introduce {
  margin-left: 17rpx;
  font-size: 26rpx;
  font-family: Source Han Sans CN;
  font-weight: 400;
  color: rgba(78, 78, 78, 1);
}

.new-goods-bg .new-goods .new-goods-top .new-goods-more {
  position: absolute;
  right: 32rpx;
  min-width: 70rpx;
  height: 22rpx;
  display: flex;
  align-items: center;
  font-size: 24rpx;
  font-family: Source Han Sans CN;
  font-weight: 400;
  color: rgba(6, 6, 6, 1);
}

.new-goods-bg .new-goods .new-goods-top .new-goods-more .right-icon {
  margin-left: 8rpx;
  width: 15rpx;
  height: 15rpx;
}

.new-goods-bg .new-goods .new-goods-bottom {
  width: 100%;
  height: 215rpx;
  white-space: nowrap;
  overflow: hidden;
}

.new-goods-bg .new-goods .new-goods-bottom .newGoods-item {
  position: relative;
  width: 150rpx;
  height: 150rpx;
  margin-left: 10rpx;
  display: inline-block;
}

.new-goods-bg .new-goods .new-goods-bottom .newGoods-item .newGoods-img {
  width: 150rpx;
  height: 150rpx;
  z-index: 1;
}

.new-goods-bg .new-goods .new-goods-bottom .newGoods-item .newGoods-name {
  /* position: absolute;
  bottom: 0; */
  width: 150rpx;
  height: 38rpx;
  /* background: rgba(255, 255, 255, 1);
  opacity: 0.7; */
  text-align: center;
  font-size: 24rpx;
  font-family: Source Han Sans CN;
  font-weight: 400;
  color: rgba(254, 136, 0, 1);
  line-height: 38rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 单一模块 */

.module-box {
  position: relative;
  width: 100%;
  /* padding: 0 20rpx 0 20rpx; */
  padding: 0;
  margin-bottom: 10rpx;
  /* padding: 20rpx 40rpx 10rpx 40rpx; */
  box-sizing: border-box;
  height: auto;
  box-sizing: border-box;
}

.module-box .title {
  padding: 0 0 29rpx 0;
}

.module-box .title text {
  color: #454545;
  display: block;
  line-height: 36rpx;
}

.module-box .title text:first-of-type {
  font-size: 32rpx;
  margin-bottom: 5rpx;
  font-weight: bold;
  color: #ff9f43;
}

.module-box .title text:last-of-type {
  font-size: 20rpx;
  color: #4e4e4e;
}

.module-box .activity-img {
  position: relative;
  width: 100%;
  /* height: 210rpx; */
  height: auto;
  /* border-radius: 8rpx; */
  /* overflow: hidden; */
}
.module-box .activity-img > view {
  position: relative;
}
.module-box .activity-img image {
  left: 0;
  top: 0;
  width: 100%;
  /* height: 100%; */
  border-radius: 18rpx;
  overflow: hidden;
  vertical-align: middle;
}
.module-box .activity-img .swiper_activity_box {
  position: absolute;
  top: 0;
  width: 100% !important;
  height: 100%;
  color: #fff;
  box-sizing: border-box;
  padding: 0 10rpx;
}
.module-box .activity-img .swiper_activity_box swiper {
  margin-top: 10rpx;
  height: calc(100% - 80rpx);
  padding: 60rpx 30rpx 0;
}
.module-box .activity-img .swiper_activity_box swiper-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.module-box .activity-img .swiper_activity_box swiper-item view {
  position: relative;
  width: 48%;
  height: 100%;
  display: flex;
  align-items: center;
}
.module-box .activity-img .swiper_activity_box swiper-item view:first-of-type {
  margin-right: 15rpx;
}
.module-box .activity-img .swiper_activity_box swiper-item image {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
}

.module-box .two-per-line-img,
.module-box .three-per-line-img {
  display: flex;
  justify-content: space-between;
}

.module-box .two-per-line-img view {
  width: 49%;
  /* height: 170rpx; */
}

.module-box .three-per-line-img view {
  width: 220rpx;
  /* height: 238rpx; */
}

.module-box .two-per-line-img view image,
.module-box .three-per-line-img view image {
  height: 100%;
}

.module-box .three-img {
  height: 280rpx;
  border-radius: 0;
  display: flex;
}

.module-box .three-img view {
  height: 100%;
  width: 325rpx;
  display: flex;
  flex-wrap: wrap;
}

.module-box .three-img view.left {
  margin-right: 20rpx;
}

/* .module-box .three-img image {
  border-radius: 8rpx;
} */

.module-box .three-img .left image:first-of-type {
  width: 325rpx;
  height: 280rpx;
}

.module-box .three-img .right image {
  width: 325rpx;
  height: 130rpx;
}

.module-box .three-img .right image:first-of-type {
  margin-bottom: 20rpx;
}

.module-goods {
  /* display: flex; */
  width: 100%;
  /* margin-top: 20rpx; */
  white-space: nowrap;
}

.module-goods-item {
  /* flex: 1; */
  display: inline-block;
  width: 25vw;
  margin-right: 20rpx;
  vertical-align: top;
}

.module-goods goods-item-small {
  margin-right: 20rpx;
}

.module-goods goods-item-small:last-of-type {
  margin-right: 0;
}

.module-goods-img {
  width: 100%;
  height: 187.5rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.module-goods-img image {
  width: 100%;
  background-size: #f1f1f1;
}

.module-goods-img .no-balance {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
}

.module-goods-info {
  position: relative;
  width: 100%;
}

.module-goods-info > text {
  display: block;
  color: #454545;
}

.module-goods-name {
  font-size: 24rpx;
  font-weight: bold;
  line-height: 36rpx;
  margin-top: 12rpx;
  margin-bottom: 8rpx;
}

.module-goods-info .module-goods-name,
.module-goods-info .module-goods-desc {
  display: block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.module-goods-info .module-goods-labels {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 30rpx;
  margin: 0 0 18rpx 0;
}

.module-goods-info .module-goods-labels view {
  /* width: 60rpx; */
  height: 30rpx;
  padding: 0 6rpx;
  border-radius: 5rpx;
  border: 1rpx solid #ff8561;
  font-size: 18rpx;
  line-height: 42rpx;
  color: #ff8561;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin-right: 8rpx;
  font-weight: normal;
  box-sizing: border-box;
  flex-shrink: 0;
}

.module-goods-desc {
  font-size: 20rpx;
  line-height: 32rpx;
  height: 32rpx;
  margin-bottom: 15rpx;
}

.module-goods-price {
  font-size: 20rpx;
  line-height: 36rpx;
  height: 36rpx;
}

.module-goods-price .nowPrice {
  font-size: 28rpx;
  color: #ee5253;
}

.module-goods-price .oldPrice {
  color: #999;
  text-decoration: line-through;
}

.module-goods-info .add-box {
  height: 80rpx;
  width: 80rpx;
  padding: 0rpx;
  position: absolute;
  right: 0;
  bottom: -15rpx;
}

.module-goods-info .add-box button {
  width: 100%;
  height: 100%;
  background: transparent;
  margin: 0;
  z-index: 1;
}

.module-goods-info .add-box button::after {
  border: none;
}

.module-goods-info .add-box .add-img {
  width: 40rpx;
  height: 40rpx;
  padding: 0;
  border-radius: 50%;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-top: -20rpx;
  margin-left: -20rpx;
}

.module-goods-introduce {
  font-size: 22rpx;
  color: #009136;
  height: 30rpx;
  line-height: 30rpx;
  font-weight: bold;
}

.module-goods-introduce text {
  /* width: 60rpx; */
  height: 30rpx;
  padding: 0 6rpx;
  border-radius: 6rpx;
  background: #009136;
  color: #fff;
  font-size: 20rpx;
  line-height: 30rpx;
  font-weight: normal;
  display: inline-block;
  text-align: center;
  margin-right: 8rpx;
}

/* 秒杀主题 */

.index-grab,
.index-group,
.index-bargain {
  width: 100%;
  padding: 54rpx 0rpx 10rpx 40rpx;
  box-sizing: border-box;
}

.index-grab .title,
.index-group .title,
.index-bargain .title {
  font-size: 32rpx;
  line-height: 46rpx;
  color: #ff9f43;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 40rpx;
}

.index-grab .title .title-word,
.index-group .title .title-word,
.index-bargain .title .title-word {
  display: flex;
  flex-direction: column;
}

.index-grab .title .title-word .title-desc,
.index-group .title .title-word .title-desc,
.index-bargain .title .title-word .title-desc {
  color: #4e4e4e;
  font-size: 22rpx;
  font-weight: normal;
}

.index-grab .title .title-icon,
.index-group .title .title-icon,
.index-bargain .title .title-icon {
  width: 28rpx;
  height: 28rpx;
  vertical-align: middle;
  margin-right: 12rpx;
  margin-top: -3rpx;
}

.index-grab .title .more,
.index-group .title .more,
.index-bargain .title .more {
  font-size: 24rpx;
  color: #060606;
  font-weight: normal;
  height: 100%;
  display: flex;
  align-items: center;
}

.index-grab .title .right-icon,
.index-group .title .right-icon,
.index-bargain .title .right-icon {
  width: 16rpx;
  height: 16rpx;
  margin-left: 6rpx;
}

.index-grab .title .title-left {
  display: flex;
}

.time-down {
  padding-top: 4rpx;
  display: flex;
  /* justify-content: flex-start; */
  flex-direction: column;
  font-size: 20rpx;
  color: #4e4e4e;
  font-weight: normal;
  margin-left: 34rpx;
}

.time-down view.time-tips {
  line-height: 30rpx;
}

.time-down view.time-box {
  color: #8b8b8c;
  font-size: 24rpx;
  font-weight: normal;
  margin-left: -10rpx;
}

.time-down view.time-box .txt {
  display: inline-block;
  width: 40rpx;
  height: 40rpx;
  background: #4e4e4e;
  border-radius: 6rpx;
  color: #fff;
  text-align: center;
  line-height: 40rpx;
  margin: 0rpx 10rpx;
}

.time-down view.time-box .colon {
  line-height: 60rpx;
  font-weight: bold;
  color: #999;
}

.grab-goods-list {
  margin-top: 21rpx;
  white-space: nowrap;
  /* display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  width: 200%; */
}

.group-goods-list {
  height: 300rpx;
  margin-top: 21rpx;
  white-space: nowrap;
  /* display: flex;
  flex-wrap: wrap;
  width: 200%; */
}

.bargain-goods-list {
  margin-top: 21rpx;
  padding-right: 40rpx;
}

.group-goods-item {
  width: 325rpx;
  height: 388rpx;
  border: 1rpx solid #e6e6e6;
  border-radius: 10rpx;
  position: relative;
  flex: 0;
  margin-bottom: 24rpx;
  background: #fff;
}

.group-goods-item .group-img-box {
  width: 325rpx;
  height: 268rpx;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.group-goods-item .group-img-box image {
  width: 325rpx;
  height: 268rpx;
}

.group-goods-item .group-img-box .group-icon {
  background: #009f55;
  font-size: 26rpx;
  color: #fff;
  height: 40rpx;
  border-top-left-radius: 10rpx;
  border-bottom-right-radius: 10rpx;
  padding: 0 12rpx 0 14rpx;
  position: absolute;
  left: 0;
  top: 0;
}

.group-goods-info {
  width: 100%;
}

.group-goods-name {
  font-size: 30rpx;
  line-height: 48rpx;
  color: #333;
  padding: 0 16rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}

.group-goods-price {
  font-size: 20rpx;
  color: #494949;
  line-height: 44rpx;
  margin-left: 16rpx;
  margin-top: 11rpx;
}

.group-sell-price {
  font-size: 32rpx;
  color: #f98f68;
  margin-right: 7rpx;
}

.group-old-price {
  text-decoration: line-through;
}

.group-button-box {
  width: 120rpx;
  height: 44rpx;
  background: #009f55;
  box-shadow: 0rpx 4rpx 10rpx 0rpx rgba(0, 159, 85, 0.2);
  border-radius: 4rpx;
  font-size: 24rpx;
  color: #fff;
  font-weight: bold;
  text-align: center;
  line-height: 44rpx;
  position: absolute;
  bottom: 12rpx;
  right: 21rpx;
}

.theme-more {
  height: 78rpx;
  width: 100%;
  font-size: 30rpx;
  line-height: 78rpx;
  color: #008ce9;
  text-align: center;
}
</style>
