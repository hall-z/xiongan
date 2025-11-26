<template>
  <!--pages/mallModule/recommend/details/details.wxml-->
  <view>
    <navigationBar title="种草详情"></navigationBar>
    <view class="recommend-details-page">
      <view class="publisher-info">
        <view class="publisher-info-lt">
          <view class="publisher-info-lt-avatar">
            <image
              :src="
                state.details.memberAvatar ? state.details.memberAvatar : state.memberInfo.avatar
              "
              mode=""
            ></image>
          </view>
          <view class="publisher-info-lt-name">
            {{ state.details.memberNickname || '微信用户' }}
          </view>
        </view>
        <view class="publisher-info-rt">
          <view class="publisher-info-rt-share" style="position: relative" v-if="false">
            <button
              @click.stop="shareView"
              open-type="share"
              style="
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: transparent;
              "
            ></button>
            <image :src="state.imagesPath.recommend_details_share" mode="widthFix"></image>
          </view>
          <view
            style="margin-right: 6rpx"
            v-if="
              state.details.creatorId === state.memberInfo.id && state.details.status === 'APPROVED'
            "
            class="publisher-info-rt-regard"
            @click="deleteArticle"
          >
            删除
          </view>
          <view
            class="publisher-info-rt-regard"
            @click="actionMember"
            :style="
              'background-color: ' +
              (!state.isCheck ? '#FC6700;' : '#fff;') +
              ';color: ' +
              (!state.isCheck ? '#fff;' : '#333;') +
              ';border-color:' +
              (!state.isCheck ? '#EB702D;' : '#ddd;')
            "
          >
            {{ !state.isCheck ? '关注' : '已关注' }}
          </view>
        </view>
      </view>
      <view class="banner-box">
        <!-- <swiper indicator-dots="{{indicatorDots}}" autoplay="{{autoplay}}" interval="{{interval}}" duration="{{duration}}" indicator-active-color="{{bg}}" style='height:{{state.Height}}'>
      <block wx:for="{{imgUrls}}">
       <swiper-item>
         <image src="{{item}}" class="slide-image" mode="widthFix" bindload='imgHeight'></image>  //bindload是绑定图片加载的事件,记得给image加上mode=“widthFix”这个属性哦，还有就是设置这个image 100%宽度哟
       </swiper-item>
      </block>
   </swiper> -->
        <swiper
          class="swiper"
          autoplay="true"
          :interval="rotationSpeed || 3000"
          circular="true"
          :current="swiperCurrent"
          @change="dotChange"
          @animationfinish="swiperChange"
          :style="'height: ' + state.Height + 'px;'"
        >
          <!-- <block wx:for="{{bannersA}}" wx:key="index"> -->
          <swiper-item
            v-for="(item, index) in state.details.imgUrlList"
            class="swiper-item"
            :data-item="item"
            @click="bannerJumping"
          >
            <video
              v-if="filters.isMp4(item)"
              :src="item"
              :autoplay="state.isWifi && state.details.imgUrlList.length == 1"
              show-mute-btn="true"
              style="position: absolute; top: 50%; transform: translateY(-50%); width: 100%"
              class="slide-video"
            ></video>
            <image v-else @load="imgHeight" mode="widthFix" :src="item" class="slide-image"></image>
          </swiper-item>
          <!-- </block> -->
        </swiper>
      </view>
      <view class="recommend-detail-info">
        <view class="recommend-detail-info-title">{{ state.details.title }}</view>
        <view class="recommend-detail-info-content">{{ state.details.content }}</view>
        <view
          class="add-content-topic"
          v-if="state.details.topics && state.details.topics.length > 0"
        >
          <text
            v-for="(item, index) in state.details.topics"
            :key="index"
            :data-id="item.id"
            @click="goTopicList"
          >
            #{{ item.name }}
          </text>
        </view>
        <view class="add-goods-list">
          <view
            class="add-goods-item"
            v-for="(item, index) in state.details.productList"
            :key="index"
            :data-productId="item.id"
            :id="'products-' + item.id"
            :data-type="goodsType"
            :data-easyScene="item.easyScene != null ? item.easyScene : 'none'"
            @click="onClickGoods"
          >
            <view class="add-goods-item-lt">
              <image :src="item.imageUrl" mode="widthFix"></image>
            </view>
            <view class="add-goods-item-rt">
              <view class="add-goods-item-rt-title">{{ item.name }}</view>
              <!-- <view class="add-goods-item-rt-pic">￥299.00</view> -->
            </view>
            <view class="delete-goods-item">
              <!-- <image src="{{imagesPath.delete_goods_icon}}" mode=""></image> -->
            </view>
          </view>
        </view>
        <view class="recommend-detail-time">发布于 {{ state.details.createTime }}</view>
        <view class="recommend-detail-time-line"></view>
        <view class="comment-num-title">共{{ state.totalCommentNum }}条评论</view>
        <view class="comment-box">
          <view class="comment-item" v-for="(item, index) in state.commentList" :key="item.id">
            <view class="comment-item-hd">
              <image
                :src="
                  item.memberAvatar ? item.memberAvatar : state.imagesPath.square_default_avatar
                "
                mode=""
              ></image>
              <view class="name">{{ item.memberNickname || ' ' }}</view>
              <view class="is-author" v-if="item.memberId === state.details.memberId">作者</view>
            </view>
            <view
              class="comment-item-content"
              :data-commentmemberid="item.memberId"
              data-id="level"
              :data-row="item"
              :data-index="index"
              @longpress.stop="longHandleComment"
            >
              {{ item.content }}
            </view>
            <view class="comment-item-info">
              <view class="comment-item-info-time">
                发布于{{ filters.filterTime(item.createTime) }}
              </view>
              <view
                class="comment-item-info-reply"
                @click="setComment"
                data-id="level"
                :data-row="item"
                :data-index="index"
              >
                回复
              </view>
              <view style="display: flex; align-items: center; height: 60rpx">
                <view class="essay-info-rt-like-box" @click="handleLikeComment" :data-index="index">
                  <image
                    class="essay-info-rt-like"
                    v-if="item.isLiked"
                    :src="state.imagesPath.is_like_icon"
                    mode="widthFix"
                  ></image>
                  <image
                    class="essay-info-rt-like"
                    v-else
                    :src="state.imagesPath.is_no_like_icon"
                    mode="widthFix"
                  ></image>
                </view>
                <view class="essay-info-rt-like-num">{{ item.numberLikes || 0 }}</view>
              </view>
            </view>
            <view class="comment-item-content-reply" v-for="(row, i) in item.children">
              <view class="comment-item-content-reply-bg">
                <view class="comment-item-hd">
                  <image
                    :src="
                      row.memberAvatar ? row.memberAvatar : state.imagesPath.square_default_avatar
                    "
                    mode=""
                  ></image>
                  <view class="name">{{ row.memberNickname || ' ' }}</view>
                  <view class="is-author" v-if="row.memberId === state.details.memberId">作者</view>
                </view>
                <view
                  class="comment-item-content"
                  :data-commentmemberid="row.memberId"
                  data-id="reply"
                  :data-row="row"
                  :data-reply="row.replyId"
                  :data-index="index"
                  :data-i="i"
                  @longpress.stop="longHandleComment"
                >
                  <text v-if="row.replyComment">
                    回复
                    <text style="color: #999999; display: inline-block; margin: 0 10rpx">
                      {{ row.replyComment.memberNickname }}:
                    </text>
                  </text>
                  {{ row.content }}
                </view>
                <view class="comment-item-info">
                  <view class="comment-item-info-time">
                    发布于{{ filters.filterTime(row.createTime) }}
                  </view>
                  <view
                    class="comment-item-info-reply"
                    @click="setComment"
                    data-id="reply"
                    :data-row="row"
                    :data-reply="row.replyId"
                    :data-index="index"
                  >
                    回复
                  </view>
                  <view style="display: flex; align-items: center; height: 60rpx">
                    <view
                      class="essay-info-rt-like-box"
                      :data-index="index"
                      :data-i="i"
                      @click="handleLikeComment"
                    >
                      <image
                        class="essay-info-rt-like"
                        v-if="row.isLiked"
                        :src="state.imagesPath.is_like_icon"
                        mode="widthFix"
                      ></image>
                      <image
                        class="essay-info-rt-like"
                        :data-i="i"
                        v-else
                        :src="state.imagesPath.is_no_like_icon"
                        mode="widthFix"
                      ></image>
                    </view>
                    <view class="essay-info-rt-like-num">{{ row.numberLikes || 0 }}</view>
                  </view>
                </view>
                <view
                  class="comment-item-content-reply-response"
                  :data-index="index"
                  data-type="more"
                  @click="moreComment"
                  v-if="
                    (item.childrenCount > 1) & (i === item.children.length - 1) && item.showMore
                  "
                >
                  <view v-if="!item.showIsNum">展开 {{ item.childrenCount - 1 }} 条回复</view>
                  <view v-else>展开更多回复</view>
                </view>
              </view>
            </view>
          </view>
          <!-- <view wx:if="{{state.commentLoading}}" class="comment-item">加载中...</view>
      <view wx:if="{{!state.commentHasMore && state.commentList.length > 0}}" class="comment-item">没有更多了</view> -->
        </view>
      </view>
      <view class="bottom-operate">
        <view class="bottom-operate-comment" @click="setComment" data-id="create">
          <image :src="state.imagesPath.recommend_details_comment" mode="widthFix"></image>
          <input type="text" placeholder="说点什么..." disabled="true" />
        </view>
        <view class="bottom-operate-rt">
          <view class="bottom-operate-like">
            <image
              class="essay-info-rt-like"
              v-if="state.details.isLiked"
              :src="state.imagesPath.recommend_details_is_like"
              mode="widthFix"
              @click="handleLikeRecommend"
            ></image>
            <image
              @click="handleLikeRecommend"
              v-else
              :src="state.imagesPath.recommend_details_like"
              mode="widthFix"
            ></image>
            {{ state.totalLikeNum }}
          </view>
          <view class="bottom-operate-comment-num" @click="setComment" data-id="create">
            <image :src="state.imagesPath.recommend_details_commentnum" mode="widthFix"></image>
            {{ state.totalCommentNum }}
          </view>
        </view>
      </view>
    </view>

    <view class="comment-pop" v-if="state.commentPop">
      <view style="height: 100%; width: 100%" @click="closePop"></view>
      <view class="comment-pop-bottom">
        <view class="comment-pop-text">
          <view class="my-input">
            <textarea
              :value="state.commentContent"
              :focus="true"
              adjust-keyboard-to="bottom"
              placeholder="说点什么..."
              style="
                height: 100rpx;
                border-radius: 10rpx;
                box-sizing: border-box;
                padding: 6rpx 10rpx;
              "
              @input="bindContentInput"
              :maxlength="-1"
              :show-confirm-bar="false"
            ></textarea>
          </view>
        </view>
        <view
          @click="sendComment"
          class="comment-pop-btn"
          :style="'background-color: ' + state.themeColor + ';'"
        >
          发送
        </view>
      </view>
    </view>
    <!-- 删除评论操作 -->
    <view class="comment-pop" v-if="state.operateLayer">
      <view style="height: 100%; width: 100%" @click="closePop"></view>
      <view class="comment-pop-group">
        <view
          class="btns"
          @click="layerSetComment"
          :style="'background-color: ' + state.themeColor + ';'"
        >
          回复
        </view>
        <view
          class="btns"
          @click="removeComment"
          :style="'background-color: ' + state.themeColor + ';'"
        >
          删除
        </view>
      </view>
    </view>
  </view>
</template>
<script setup>
import _utilsThemeManagerJs from '@/utils/newretail/themeManager'
import _apiRecommendServiceJs from '@/service/api/newretail/recommendService'
import _utilsImagesPathJs from '@/utils/newretail/imagesPath'
import _utilsNavPageJs from '@/utils/newretail/navPage'
// import { onReachBottom, onLoad, onReady, onShow, onHide, onUnload, onPullDownRefresh, onShareAppMessage } from "@dcloudio/uni-app";
import { reactive } from 'vue'
const app = getApp()

// pages/mallModule/recommend/details/details.js
const NAVPAGE = _utilsNavPageJs
const IMGAGESPATH = _utilsImagesPathJs
const recommendService = _apiRecommendServiceJs
const themeManager = _utilsThemeManagerJs
const state = reactive({
  isWifi: false,
  imagesPath: IMGAGESPATH,
  detailsId: '',
  // 详情id
  details: {},
  // 详情数据
  memberInfo: {},
  // 当前用户信息
  themeColor: themeManager ? themeManager.color : uni.getStorageSync('themeColor'),
  isCheck: false,
  // 是否关注
  totalCommentNum: 0,
  // 评论数
  totalLikeNum: 0,
  // 点赞数
  currentTargetComment: '',
  // 当前评论的方式
  commentContent: '',
  // 当前评论的内容
  commentPop: '',
  // 是否显示评论弹出层
  currentTargetData: '',
  // 当前点击评论的数据
  replyId: '',
  // 二级评论id回复时需要传这个
  replyIndex: 0,
  // 当前回复一级的下标
  commentList: [],
  // 评论列表
  commentPage: 1,
  commentPageSize: 4,
  commentLoading: false,
  commentHasMore: true,
  Height: 0,
  operateLayer: false,
  // 是否展示回复，删除弹层
  operateObj: {},
  // 回复所带数据对象
  replyDeleteIndex: '',
  parentIndex: '',
})
function onClickGoods(val) {
  const e = {
    productId: val.currentTarget.dataset.productid,
    type: val.currentTarget.dataset.type,
    lastPage: 'sort',
  }
  toProductDetail(e)
}
function toProductDetail(e) {
  let opts = ''
  let n = 0
  for (const t in e) {
    ;((opts = n === 0 ? opts + '?' + t + '=' + e[t] : opts + '&' + t + '=' + e[t]), n++)
  }
  NAVPAGE.toGoodsDetails(opts)
}
function imgHeight(e) {
  const winWid = uni.getSystemInfoSync().windowWidth // 获取当前屏幕的宽度
  const imgh = e.detail.height // 图片高度
  const imgw = e.detail.width // 图片宽度
  const swiperH = (winWid * imgh) / imgw // 等比设置swiper的高度。 即 屏幕宽度 / swiper高度 = 图片宽度 / 图片高度  ==》swiper高度 = 屏幕宽度 * 图片高度 / 图片宽度
  if (swiperH > state.Height) {
    state.Height = swiperH
  }
}
function moreComment(e) {
  const that = this
  const index = e.currentTarget.dataset.index
  const newCommentList = state.commentList
  const newCommebtItem = state.commentList[index].children
  const ids = newCommebtItem.map((item) => item.id)
  const postData = {
    upperId: state.commentList[index].id,
    currentMemberId: state.memberInfo.id,
    idNotIn: ids,
    page: 1,
    pageSize: 5,
    searchCount: true,
  }
  recommendService
    .secondLevel(postData)
    .then((res) => {
      if (res.records && res.records.length > 0) {
        res.records.forEach((val) => {
          newCommentList[index].children.push(val)
        })
      }
      newCommentList[index].showIsNum = true
      if (res.totalCount > 0 && res.totalCount - 5 > 0) {
        newCommentList[index].showMore = true
      } else {
        newCommentList[index].showMore = false
      }
      state.commentList = newCommentList
    })
    .catch((err) => {
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000,
      })
    })
}
function setComment(e) {
  // level 为创建二级评论 reply 为回复评论
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    console.log(e.currentTarget.dataset.id, 'e.currentTarget.dataset.id')
    const id = e.currentTarget.dataset.id
    let row = {}
    if (e.currentTarget.dataset.row) {
      row = e.currentTarget.dataset.row
    }
    state.currentTargetComment = id
    if (id === 'level' || id === 'reply') {
      state.currentTargetData = row
      state.replyIndex = e.currentTarget.dataset.index
    }
    console.log(row, 'rowrowrow')
    if (id === 'reply') {
      state.replyId = e.currentTarget.dataset.replyId || row.id
      state.replyIndex = e.currentTarget.dataset.index
    }
    state.commentPop = true
  } else {
    NAVPAGE.toAuthorize()
  }
}
function layerSetComment() {
  //   模拟点击对象数据
  const obj = state.operateObj
  // console.log(obj,'obj')
  state.operateLayer = false
  setComment(obj)
}
function removeComment() {
  const obj = state.operateObj
  const that = this
  uni.showModal({
    title: '提示',
    content: '确认要删除该评论？',
    success: function (res) {
      if (res.confirm) {
        recommendService
          .removeComment(obj.currentTarget.dataset.row.id)
          .then((res) => {
            const newCommentList = state.commentList
            if (state.replyDeleteIndex !== '') {
              newCommentList[state.parentIndex].children.splice(state.replyDeleteIndex, 1)
            } else {
              newCommentList.splice(state.parentIndex, 1)
            }
            state.commentList = newCommentList
            state.replyDeleteIndex = ''
            state.parentIndex = ''
            state.operateLayer = false
            uni.showToast({
              title: '删除成功',
              icon: 'none',
              duration: 2000,
            })
            // wx.navigateBack()
          })
          .catch((err) => {
            uni.showToast({
              title: err.message,
              icon: 'none',
              duration: 2000,
            })
          })
      } else if (res.cancel) {
      }
    },
  })
}
function bindContentInput(e) {
  state.commentContent = e.detail.value
}
function sendComment() {
  if (!state.commentContent.trim()) {
    return uni.showToast({
      title: '请输入评论内容~',
      icon: 'none',
      duration: 2000,
    })
  }
  let postData = {}
  const that = this
  if (state.currentTargetComment === 'create') {
    postData = {
      content: state.commentContent,
      recommendId: state.detailsId,
    }
  } else if (state.currentTargetComment === 'level') {
    postData = {
      content: state.commentContent,
      recommendId: state.detailsId,
      upperId: state.currentTargetData.id,
    }
  } else if (state.currentTargetComment === 'reply') {
    console.log('近了这里')
    postData = {
      content: state.commentContent,
      recommendId: state.detailsId,
      upperId: state.currentTargetData.upperId,
      replyId: state.replyId,
    }
  }
  console.log(postData, 'postData')
  console.log(state.currentTargetComment, 'e.currentTarget.dataset.id222')
  const newCommentList = state.commentList
  recommendService
    .createComment(postData)
    .then((res) => {
      if (state.currentTargetComment === 'create') {
        newCommentList.unshift({
          ...res,
          showMore: true,
          showIsNum: false,
        })
      } else if (state.currentTargetComment === 'level' || state.currentTargetComment === 'reply') {
        console.log(newCommentList[state.replyIndex], 'newCommentList[that.data.replyIndex]')
        if (
          newCommentList[state.replyIndex].children &&
          newCommentList[state.replyIndex].children.length > 0
        ) {
          newCommentList[state.replyIndex].children.push(res)
        } else {
          newCommentList[state.replyIndex].children = [res]
        }
      }
      state.commentList = newCommentList
    })
    .catch((err) => {
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000,
      })
    })
  state.commentPop = false
  state.commentContent = ''
}
function handleLikeRecommend() {
  uni.showLoading({})
  const postData = {
    id: state.detailsId,
    isLike: !state.details.isLiked,
    memberId: state.memberInfo.id,
  }
  const that = this
  recommendService
    .like(postData)
    .then((res) => {
      state.details.isLiked = !state.details.isLiked
      state.totalLikeNum = !state.details.isLiked
        ? parseInt(state.totalLikeNum) + 1
        : state.totalLikeNum > 0
          ? parseInt(state.totalLikeNum) - 1
          : 0
      uni.hideLoading()
    })
    .catch((err) => {
      uni.hideLoading()
      uni.showToast({
        title: err.message,
        icon: 'none',
        duration: 2000,
      })
    })
}
function closePop() {
  state.commentPop = false
  state.operateLayer = false
}
function handleLike(e) {
  uni.showLoading({})
  const index = e.currentTarget.dataset.index
  const item = state.myRecommend[index]
  const id = item.id
  const postData = {
    id,
    isLike: !item.isLiked,
    memberId: state.memberInfo.id,
  }
  recommendService
    .like(postData)
    .then(() => {
      const isLiked = !item.isLiked
      const key = `myRecommend[${index}].isLiked`
      const numKey = `myRecommend[${index}].numberLikes`
      state.key = isLiked
      state.numKey = isLiked ? item.numberLikes + 1 : item.numberLikes - 1
      uni.hideLoading()
    })
    .catch((err) => {
      uni.hideLoading()
    })
}
function handleLikeComment(e) {
  uni.showLoading({})
  let item = {}
  let postId = ''
  const newCommentList = state.commentList
  if (e.currentTarget.dataset.i || e.currentTarget.dataset.i === 0) {
    // 是否是二级评论
    item = state.commentList[e.currentTarget.dataset.index].children[e.currentTarget.dataset.i]
    postId = item.id
  } else {
    item = state.commentList[e.currentTarget.dataset.index]
    postId = item.id
  }
  recommendService
    .likeComment(postId, state.detailsId, !item.isLiked, state.memberInfo.id)
    .then(() => {
      item.isLiked = !item.isLiked
      item.numberLikes = item.numberLikes
        ? item.isLiked
          ? parseInt(item.numberLikes) + 1
          : parseInt(item.numberLikes) - 1
        : 1
      if (e.currentTarget.dataset.i || e.currentTarget.dataset.i === 0) {
        newCommentList[e.currentTarget.dataset.index].children[e.currentTarget.dataset.i] = item
      } else {
        newCommentList[e.currentTarget.dataset.index] = item
      }
      state.commentList = newCommentList
      uni.hideLoading()
    })
    .catch((err) => {
      uni.hideLoading()
    })
}
function longHandleComment(e) {
  console.log(e)
  const commentmemberid = e.currentTarget.dataset.commentmemberid
  const i = e.currentTarget.dataset.i
  const index = e.currentTarget.dataset.index
  const id = e.currentTarget.dataset.id
  // 自己评论的则 展示弹层
  if (commentmemberid === state.memberInfo.id) {
    state.operateLayer = true
    state.operateObj = e
    if (id === 'reply') {
      state.replyDeleteIndex = i
      state.parentIndex = index
    } else {
      state.parentIndex = index
    }
  }
}
function recommendDetails() {
  const that = this
  const postData = {
    id: state.detailsId,
    parts: 'topic,product,member',
    currentMemberId: state.memberInfo && state.memberInfo.id ? state.memberInfo.id : '',
  }
  recommendService.recommendDetails(postData).then((res) => {
    if (res) {
      state.details = res
      state.totalLikeNum = res.numberLikes
      getCheck()
      totalComment()
      totalLike()
      getComment()
    }
  })
}
function getComment(reload = false) {
  const that = this
  if (state.commentLoading || !state.commentHasMore) return
  state.commentLoading = true
  const page = reload ? 1 : state.commentPage
  if (reload) {
    state.commentPage = 1
    state.commentList = []
    state.commentHasMore = true
  }
  recommendService
    .firstLevel(state.memberInfo.id, state.detailsId, page, state.commentPageSize)
    .then((res) => {
      const commentArr = reload ? [] : state.commentList
      let hasMore = true
      if (res.records && res.records.length > 0) {
        res.records.forEach((val) => {
          commentArr.push({
            ...val,
            showMore: true,
            showIsNum: false,
          })
        })
        hasMore = res.records.length === state.commentPageSize
      } else {
        hasMore = false
      }
      state.commentList = commentArr
      state.commentPage = hasMore ? page + 1 : page
      state.commentHasMore = hasMore
      state.commentLoading = false
    })
    .catch(() => {
      state.commentLoading = false
    })
}
onReachBottom(function () {
  // 分页加载评论
  getComment(false)
})
function totalComment() {
  recommendService.totalComment(state.memberInfo.id, state.detailsId).then((res) => {
    state.totalCommentNum = res
  })
}
function totalLike() {
  // recommendService.totalLike(this.data.details.memberId).then(res => {
  //   this.setData({
  //     totalLikeNum: res
  //   })
  // })
}
function getCheck() {
  recommendService.check(state.memberInfo.id, state.details.memberId).then((res) => {
    state.isCheck = res
  })
}
function actionMember() {
  // let postData = {
  //   isSubscribe: !this.data.isCheck,
  //   memberId: this.data.memberInfo.id,
  //   subscriptionId: this.data.details.memberId
  // }
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    recommendService
      .action(!state.isCheck, state.memberInfo.id, state.details.memberId)
      .then((res) => {
        state.isCheck = !state.isCheck
      })
  } else {
    NAVPAGE.toAuthorize()
  }
}
function deleteArticle() {
  const that = this
  uni.showModal({
    title: '提示',
    content: '确认要删除该文章？',
    success: function (res) {
      if (res.confirm) {
        recommendService
          .remove(state.detailsId)
          .then((res) => {
            uni.showToast({
              title: '删除成功',
              icon: 'none',
              duration: 2000,
            })
            uni.navigateBack()
          })
          .catch((err) => {
            uni.showToast({
              title: err.message,
              icon: 'none',
              duration: 2000,
            })
          })
      } else if (res.cancel) {
      }
    },
  })
}
function goTopicList(e) {
  const topicId = e.currentTarget.dataset.id
  console.log(topicId)
  const data = '?topicId=' + topicId
  NAVPAGE.toRecommendSquare(data)
}
onLoad(function (options) {
  if (app.globalData.userInfo && app.globalData.userInfo.member) {
    state.memberInfo = app.globalData.userInfo.member
  }
  console.log(options, 'options')
  if (options && options.id) {
    state.detailsId = options.id
    recommendDetails()
  }
  // 初始化评论分页
  state.themeColor = app.globalData.uiconfig.themeColor
  getComment(true)
})
onReady(function () {})
onShow(function () {
  const that = this
  uni.getNetworkType({
    success(res) {
      if (res) {
        state.isWifi = res.networkType == 'wifi'
      }
    },
  })
})
onHide(function () {})
onUnload(function () {})
onPullDownRefresh(function () {})
onShareAppMessage(function () {
  const that = this
  // 分享信息统计
  ANALYSIS.ShareAnalysis()
  return {
    title: app.globalData.systemConfigure.miniprogramSharingName,
    path: '/pages-sub/newretail/pages/mallModule/recommend/details/details?id=' + state.detailsId,
    success(e) {
      uni.showShareMenu({
        withShareTicket: true,
      })
    },
  }
})
</script>
<style scoped>
/* pages/mallModule/recommend/details/details.wxss */
.publisher-info {
  width: 100%;
  padding: 16rpx 30rpx;
  background-color: #fff;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
}

.publisher-info-lt {
  display: flex;
  align-items: center;
}

.publisher-info-lt-avatar {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background-color: pink;
  margin-right: 26rpx;
}

.publisher-info-lt-avatar image {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
}

.publisher-info-lt-name {
  font-weight: 400;
  font-size: 28rpx;
  color: #333333;
}

.publisher-info-rt {
  display: flex;
  align-items: center;
}

.publisher-info-rt-share {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  border: 1px solid #fc6700;
  margin-right: 26rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.publisher-info-rt-share image {
  width: 32rpx;
  height: 29rpx;
}

.publisher-info-rt-regard {
  width: 132rpx;
  height: 60rpx;
  background: #fc6700;
  border-radius: 30rpx;
  border: 1px solid #eb702d;
  text-align: center;
  line-height: 60rpx;
  font-weight: 400;
  font-size: 28rpx;
  color: #ffffff;
}

.banner-box {
  width: 100%;
}

.slide-image {
  width: 100%;
}

/* .swiper {
  height: auto;
} */

.swiper-item {
  display: flex;
  align-items: center;
  justify-content: center;
  /* height: auto; */
}
.slide-video {
  width: 750rpx;
  height: 750rpx;
}
.recommend-detail-info {
  padding: 0 30rpx 196rpx 30rpx;
}

.recommend-detail-info-title {
  font-weight: 600;
  font-size: 32rpx;
  color: #333333;
  margin-top: 32rpx;
  line-height: 42rpx;
}

.recommend-detail-info-content {
  font-weight: 400;
  font-size: 28rpx;
  color: #333333;
  line-height: 37rpx;
  margin-top: 34rpx;
}

.add-goods-list {
  margin-top: 30rpx;
}

.add-content-topic {
  font-weight: 400;
  font-size: 28rpx;
  color: #eb702d;
  margin-top: 24rpx;
}

.add-content-topic text {
  display: inline-block;
  margin-right: 14rpx;
}

.add-goods-item {
  display: flex;
  align-items: center;
  background: #f3f3f3;
  border-radius: 20rpx;
  height: 140rpx;
  position: relative;
  margin-bottom: 18rpx;
}

.add-goods-item-lt {
  width: 120rpx;
  height: 120rpx;
  background-color: pink;
  border-radius: 20rpx;
  margin-left: 10rpx;
}

.add-goods-item-lt image {
  width: 100%;
  height: 10%;
}

.add-goods-item-rt {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  margin-left: 24rpx;
}

.add-goods-item-rt-title {
  font-weight: 400;
  font-size: 28rpx;
  color: #333333;
  margin-top: 20rpx;
}

.add-goods-item-rt-pic {
  font-weight: 600;
  font-size: 24rpx;
  color: #eb702d;
  margin-bottom: 22rpx;
}

.recommend-detail-time {
  font-weight: 400;
  font-size: 20rpx;
  color: #999999;
  line-height: 37rpx;
  padding: 10rpx 0 29rpx 0;
}

.recommend-detail-time-line {
  width: 100%;
  height: 1rpx;
  background-color: #f3f3f3;
  /* border: 1px solid #F3F3F3; */
}

.comment-num-title {
  margin-top: 38rpx;
  font-weight: 400;
  font-size: 28rpx;
  color: #333333;
  line-height: 37rpx;
  margin-bottom: 28rpx;
}

.bottom-operate {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 146rpx;
  display: flex;
  justify-content: space-between;
  padding: 20rpx 30rpx 46rpx 30rpx;
  box-sizing: border-box;
  background-color: #fff;
}

.bottom-operate-comment {
  width: 319rpx;
  height: 80rpx;
  background: #f3f3f3;
  border-radius: 40rpx;
  overflow: hidden;
  display: flex;
  align-items: center;
}

.bottom-operate-comment input {
  font-weight: 400;
  font-size: 28rpx;
}

.bottom-operate-comment input::placeholder {
  font-weight: 400;
  font-size: 28rpx;
  color: #999999;
}

.bottom-operate-comment image {
  width: 24rpx;
  margin: 0 19rpx 0 25rpx;
}

.bottom-operate-rt {
  display: flex;
}

.bottom-operate-like,
.bottom-operate-comment-num {
  display: flex;
  align-items: center;
  font-weight: 400;
  font-size: 32rpx;
  color: #333333;
}

.bottom-operate-like image {
  width: 60rpx;
  height: 50rpx;
  margin-right: 17rpx;
}

.bottom-operate-comment-num image {
  width: 50rpx;
  height: 50rpx;
  margin: 0 17rpx 0 32rpx;
}

.comment-box {
  width: 100%;
  padding: 0 30rpx;
  box-sizing: border-box;
}

.comment-item-hd {
  display: flex;
  align-items: center;
}

.comment-item-hd .is-author {
  width: 67rpx;
  height: 28rpx;
  line-height: 28rpx;
  background: #ffffff;
  border-radius: 14rpx;
  border: 1px solid #fc6700;
  margin-left: 18rpx;
  font-weight: 400;
  font-size: 20rpx;
  color: #fc6700;
  text-align: center;
}

.comment-item-hd image {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  margin-right: 22rpx;
}

.comment-item-hd .name {
  font-weight: 400;
  font-size: 28rpx;
  color: #999999;
}

.comment-item-content {
  /* display: flex; */
  padding-left: 81rpx;
  font-weight: 400;
  font-size: 24rpx;
  color: #333333;
  line-height: 37rpx;
}

.comment-item-info {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin: 6rpx 0 10rpx 0;
}

.comment-item-info-time {
  font-size: 24rpx;
  color: #999999;
  line-height: 37rpx;
}

.comment-item-info-reply {
  font-size: 24rpx;
  color: #333333;
  line-height: 37rpx;
  margin: 0 20rpx;
}

.essay-info-rt-like {
  width: 26rpx;
  height: 22rpx;
}

.comment-item-content-reply {
  padding-left: 81rpx;
  width: 100%;
  box-sizing: border-box;
}

.comment-item-content-reply-bg {
  padding: 21rpx 18rpx;
  background: #f9f9f9;
  border-radius: 10rpx;
}

.essay-info-rt-like-num {
  font-size: 24rpx;
  color: #333333;
  line-height: 37rpx;
  margin-left: 10rpx;
}

.comment-item-content-reply-response {
  padding-left: 81rpx;
  font-weight: 400;
  font-size: 24rpx;
  color: #fc6700;
  margin-top: 10rpx;
}

.comment-pop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 999;
}

.comment-pop-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 200rpx;
  background-color: #fff;
  z-index: 999;
  display: flex;
  align-items: center;
  padding: 0 20rpx;
  box-sizing: border-box;
  border-radius: 20rpx 20rpx 0 0;
}
.comment-pop-group {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 300rpx;
  background-color: #fff;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50rpx 50rpx;
  box-sizing: border-box;
  border-radius: 20rpx 20rpx 0 0;
}
.btns {
  width: 100%;
  height: 60rpx;
  line-height: 60rpx;
  text-align: center;
  border-radius: 40rpx;
  margin-left: 10rpx;
  margin-bottom: 30rpx;
  color: #fff;
}
.comment-pop-text {
  flex: 1;
}

.comment-pop-text textarea {
  /* height: 80rpx; */
  width: 100%;
  /* text-indent: 20rpx; */
}

.my-input {
  padding: 10rpx 34rpx 0;
  background-color: #eee;
  box-sizing: border-box;
  border-radius: 20rpx;
  overflow: hidden;
}

.comment-pop-btn {
  width: 120rpx;
  height: 60rpx;
  line-height: 60rpx;
  text-align: center;
  border-radius: 40rpx;
  margin-left: 10rpx;
  color: #fff;
}

button {
  border: none;
}
button::after {
  border: none;
}

.essay-info-rt-like-box {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>
