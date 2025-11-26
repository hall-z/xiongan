import { useThemeManager } from './themeManager'

const themeManager = useThemeManager()

themeManager.getImgType()
export const imagesPath = {
  // 分享购物车门店图标
  recommend_nonodata: themeManager.ossUrl() + '/recommend_nonodata.png',
  // 分享购物车门店图标
  share_shopcart_store_icon: themeManager.ossUrl() + '/share_shopcart_store_icon.png',
  // 种草详情评论数量按钮
  recommend_details_commentnum: themeManager.ossUrl() + '/recommend_details_commentnum.png',
  // 种草详情未点赞状态
  recommend_details_is_like: themeManager.ossUrl() + '/recommend_details_is_like.png',
  // 种草详情未点赞状态
  recommend_details_like: themeManager.ossUrl() + '/recommend_details_like.png',
  // 种草详情评论按钮
  recommend_details_comment: themeManager.ossUrl() + '/recommend_details_comment.png',
  // 种草详情分享按钮
  recommend_details_share: themeManager.ossUrl() + '/recommend_details_share.png',
  // 我的关注按钮icon
  my_follow_icon: themeManager.ossUrl() + '/my_follow_icon.png',
  // 我的关注按钮icon未选中
  my_follow_icon_active: themeManager.ossUrl() + '/my_follow_icon_active.png',
  // 我的喜欢按钮icon
  my_like_icon: themeManager.ossUrl() + '/my_like_icon.png',
  // 我的喜欢按钮icon未选中
  my_like_icon_active: themeManager.ossUrl() + '/my_like_icon_active.png',
  // 我的种草按钮icon
  my_recommend_icon: themeManager.ossUrl() + '/my_recommend_icon.png',
  // 我的种草按钮icon未选中
  my_recommend_icon_active: themeManager.ossUrl() + '/my_recommend_icon_active.png',
  // 我的种草用户默认头像
  square_default_avatar: themeManager.ossUrl() + '/square_default_avatar.png',
  // 我的种草点赞icon
  like_num_icon: themeManager.ossUrl() + '/like_num_icon.png',
  // 我的种草头部背景
  square_my_bg: themeManager.ossUrl() + '/square_my_bg.png',
  // 我的种草去广场按钮icon
  square_btn_icon: themeManager.ossUrl() + '/square_btn_icon.png',
  // 发布种草按钮icon
  recommend_release_icon: themeManager.ossUrl() + '/recommend_release_icon.png',
  // 种草广场已点赞图标
  is_like_icon: themeManager.ossUrl() + '/is_like_icon.png',
  // 种草广场未点赞图标
  is_no_like_icon: themeManager.ossUrl() + '/is_no_like_icon.png',
  // 种草广场我的按钮icon
  square_my_icon: themeManager.ossUrl() + '/square_my_icon.png',
  // 种草广场tab选中icon
  square_filter_active: themeManager.ossUrl() + '/square_filter_active.png',
  // 种草发布选择商品搜索icon
  search_release: themeManager.ossUrl() + '/search_release.png',
  // 种草发布删除选中商品图标
  delete_goods_icon: themeManager.ossUrl() + '/delete_goods_icon.png',
//   种草删除未审核通过文章的图标
remove_icon: themeManager.ossUrl() + '/removeicon.png',
  // 种草发布选择话题图标
  add_topic_icon: themeManager.ossUrl() + '/add_topic_icon.png',
  // 种草发布上传图片图标
  upload_images_icon: themeManager.ossUrl() + '/upload_images_icon.png',
  // 商品详情分享icon最新
  share_icon_new: themeManager.ossUrl() + '/share_icon_new.png',
  // 周期购活动详情轮播图背景
  activity_bg_bottom: themeManager.ossUrl() + '/activity_bg_bottom.png',
  // 周期购活动详情轮播图背景
  activity_bg_top: themeManager.ossUrl() + '/activity_bg_top.png',
  // 商品分类筛选选中图标
  share_shopping_cart: themeManager.ossUrl() + '/share_shopping_cart.png',
  custom_money_icon: themeManager.ossUrl() + '/custom_money_icon.png',
  // 商品分类筛选选中图标
  search_address_new: themeManager.ossUrl() + '/search_address_new.png',
  // 商品分类一级分类占位图
  occupy_image: themeManager.ossUrl() + '/occupy-image.png',
  // 商品分类筛选选中图标
  time_new_icon: themeManager.ossUrl() + '/time_new_icon.png',
  // 商品分类筛选选中图标
  phone_new_icon: themeManager.ossUrl() + '/phone_new_icon.png',
  // 商品分类筛选选中图标
  filter_active_icon: themeManager.ossUrl() + '/filter-active-icon.png',
  // 商品分类筛选未选中图标
  filter_icon: themeManager.ossUrl() + '/filter-icon.png',
  // 一级分类顶部打开弹窗
  category_all: themeManager.ossUrl() + '/category-all.png',
  // 一级分类关闭弹窗图标
  category_close: themeManager.ossUrl() + '/category-close.png',
  // 预售icon
  pre_icon: themeManager.ossUrl() + '/pre_icon.png',
  // 预售标题背景
  pre_bg: themeManager.ossUrl() + '/pre_bg.png',
  // 预售标题
  presale_title: themeManager.ossUrl() + '/presale_title.png',
  // 商品详情首页icon
  home_icon: themeManager.ossUrl() + '/home_icon.png',
  // 商品详情购物车icon
  shopping_icon: themeManager.ossUrl() + '/shopping_icon.png',
  // 商品详情分享icon
  share_icon: themeManager.ossUrl() + '/share_icon.png',
  // 商品详情标题背景
  promo_bg: themeManager.ossUrl() + '/promo_bg.png',
  // 促销icon
  promo_icon: themeManager.ossUrl() + '/promo_icon.png',
  // 秒杀列表商品小icon
  seckill_good_icon: themeManager.ossUrl() + '/seckill_good_icon.png',
  // 秒杀icon
  seckill_icon: themeManager.ossUrl() + '/seckill_icon.png',
  // 秒杀列表背景
  seckill_list_bg: themeManager.ossUrl() + '/seckill_list_bg.png',
  // 秒杀按钮背景
  seckill_price_bg: themeManager.ossUrl() + '/seckill_price_bg.png',
  // 秒杀右侧背景
  seckill_right_icon: themeManager.ossUrl() + '/seckill_right_icon.png',
  // 秒杀标题背景
  seckill_time_bg: themeManager.ossUrl() + '/seckill_time_bg.png',
  // 秒杀列表提示背景
  seckill_tip_bg: themeManager.ossUrl() + '/seckill_tip_bg.png',
  // 秒杀标题
  seckill_title: themeManager.ossUrl() + '/seckill_title.png',
  // 列表购物车icon
  shopping_icon_list: themeManager.ossUrl() + '/shopping_icon_list.png',
  // 拼团icon
  team_icon: themeManager.ossUrl() + '/team_icon.png',
  // 拼团右侧背景
  team_right_icon: themeManager.ossUrl() + '/team_right_icon.png',
  // 拼团提示
  team_tip: themeManager.ossUrl() + '/team_tip.png',
  
  // 砍价背景
  barga_bg: themeManager.ossUrl() + '/barga_bg.png',
  // 砍价进度条icon
  barga_icon: themeManager.ossUrl() + '/barga_icon.png',
  // 拼团提示
  barga_tip: themeManager.ossUrl() + '/barga_tip.png',
  // 砍价标题
  barga_title: themeManager.ossUrl() + '/barga_title.png',
  // 砍价标题背景
  barga_title_bg: themeManager.ossUrl() + '/barga_title_bg.png', 
  // 抽奖背景
  draw_bg: themeManager.ossUrl() + '/draw_bg.png', 
  // 大转盘背景
  draw_box_bg: themeManager.ossUrl() + '/draw_box_bg.png', 
  // 大转盘按钮背景
  draw_btn_bg: themeManager.ossUrl() + '/draw_btn_bg.png', 
  // 大转盘指针
  draw_icon: themeManager.ossUrl() + '/draw_icon.png', 
  

  // 项目logo图标
  iconLogo: themeManager.ossUrl() + '/logo.png',
  // 首页顶部左侧门店图标
  iconIndexStore: themeManager.ossUrl() + '/iconIndexStore.png',
  // 搜索图标
  indexIconSearch2: themeManager.ossUrl() + '/indexIconSearch2.png',
  // 首页顶部下拉选择门店图标
  iconIndexStoreRight: themeManager.ossUrl() + '/iconIndexStoreRight.png',
  // 首页右上角二维码图标
  iconIndexMemberCard: themeManager.ossUrl() + '/iconIndexMemberCard.png',
  // 加入购物车图标
  iconJoin: themeManager.ossUrl() + '/iconJoin.png',
  // 移出购物车图标
  iconMinus: themeManager.ossUrl() + '/iconMinus.png',
  // 新品预售图标
  iconAdvanceSell: themeManager.ossUrl() + '/iconAdvanceSell.png',
  // 秒杀进行中图标
  iconSecKilling: themeManager.ossUrl() + '/iconSecKilling.png',
  // 秒杀已结束图标
  iconVoided: themeManager.ossUrl() + '/iconVoided.png',
  // 秒杀未开始图标
  iconWaitBegin: themeManager.ossUrl() + '/iconWaitBegin .png',
  // 秒杀未选中背景图标
  iconSeckillUnselect: themeManager.ossUrl() + '/iconSeckillUnselect.png',
  // 秒杀选中背景图标
  iconSeckillSelect: themeManager.ossUrl() + '/iconSeckillSelect.png',
  // 券选中背景图标
  ticket1: themeManager.ossUrl() + '/ticket1.png',
  // 券未选中背景图标
  ticket2: themeManager.ossUrl() + '/ticket2.png',
  // 右箭头图标1（主题色）
  iconRight1: themeManager.ossUrl() + '/iconRight1.png',
  // 右箭头图标2（灰色）
  iconRight2: themeManager.ossUrl() + '/iconRight2.png',
  // 首页门店图标
  indexIconStore: themeManager.ossUrl() + '/indexIconStore.png',
  // 会员等级图标（银卡）
  iconGrade1: themeManager.ossUrl() + '/iconGrade1.png',
  // 会员等级图标（金卡）
  iconGrade2: themeManager.ossUrl() + '/iconGrade2.png',
  // 会员等级图标（白金卡）
  iconGrade3: themeManager.ossUrl() + '/iconGrade3.png',
  // 会员等级图标（钻石卡）
  iconGrade4: themeManager.ossUrl() + '/iconGrade4.png',
  // 拼团列表去拼团右箭头图标
  iconGroupRight: themeManager.ossUrl() + '/iconGroupRight1.png',
  // 拼团成员列表更多成员图标
  iconCollageMore: themeManager.ossUrl() + '/iconCollageMore.png',
  // 抢购商品详情倒计时左侧logo图标
  iconSecKillLogo: themeManager.ossUrl() + '/iconSecKillLogo.png',
  // 品质保障图标
  iconQuality: themeManager.ossUrl() + '/iconQuality.png',
  // 坏果包退换图标
  iconRefundable: themeManager.ossUrl() + '/iconRefundable.png',
  // 新鲜水果图标
  iconSun: themeManager.ossUrl() + '/iconSun.png',
  // 待参团图标
  iconTeamBuy: themeManager.ossUrl() + '/iconTeamBuy.png',
  // tabbar首页选中图标
  tabbar_home_active: themeManager.ossUrl() + '/tabbar_home_active.png',
  // tabbar购物车未选中图标
  tabbar_shopcart: themeManager.ossUrl() + '/tabbar_shopcart.png',
  // 拼团倒计时公告左侧背景图标
  iconGroupLabelXF: themeManager.ossUrl() + '/iconGroupLabelXF.png',
  // 商品详情加入购物车关闭弹窗图标
  iconCloseImg: themeManager.ossUrl() + '/iconCloseImg.png',
  // 购物车删除图标
  iconShopCartDelete: themeManager.ossUrl() + '/iconShopCartDelete.png',
  // 购物车空空如也图标
  imgNoDataShopcart: themeManager.ossUrl() + '/imgNoDataShopcart.png',
  // 当前位置图标
  iconPositionActive: themeManager.ossUrl() + '/iconPositionActive.png',
  // 当前位置图标（主题色）
  iconPosition: themeManager.ossUrl() + '/iconPosition.png',
  // 圆形选中图标
  iconChecked: themeManager.ossUrl() + '/iconChecked.png',
  // 圆形未选中图标
  iconUnchecked: themeManager.ossUrl() + '/iconUnchecked.png',
  // 圆形选中图标
  iconChecked1: themeManager.ossUrl() + '/iconChecked.png',
  // 圆形未选中图标
  iconUnchecked1: themeManager.ossUrl() + '/iconUnchecked.png',
  // 删除地址图标
  iconAddressDelete: themeManager.ossUrl() + '/iconAddressDelete.png',
  // 修改地址图标
  iconEditAddress: themeManager.ossUrl() + '/iconEditAddress.png',
  // 微信用户快捷登录图标
  iconAuthWeixin: themeManager.ossUrl() + '/iconAuthWeixin.png',
  // 手机号登录/注册图标
  iconAuthMobile: themeManager.ossUrl() + '/iconAuthMobile.png',
  // 评价页面删除图片图标
  iconEvaluateClose: themeManager.ossUrl() + '/iconEvaluateClose.png',
  // 个人中心会员卡图标
  iconMyCard: themeManager.ossUrl() + '/iconMyCard.png',
  // 个人中心所有订单图标
  iconAllOrders: themeManager.ossUrl() + '/iconAllOrders.png',
  // 个人中心待付款图标
  iconMywaitPay: themeManager.ossUrl() + '/iconMywaitPay.png',
  // 个人中心配送中图标
  iconMywaiGet: themeManager.ossUrl() + '/iconMywaiGet.png',
  // 个人中心待自提图标
  iconMywaitSend: themeManager.ossUrl() + '/iconMywaitSend.png',
  // 个人中心待评价图标
  iconMywaitEvaluate: themeManager.ossUrl() + '/iconMywaitEvaluate.png',
  // 个人中心待付尾款图标
  iconMywaitPayTail: themeManager.ossUrl() + '/iconMywaitPayTail(1).png',
  // 点击刷新付款码图标
  iconRefresh2: themeManager.ossUrl() + '/iconRefresh2.png',
  // 充值页面查看明细图标
  iconBalanceDetails: themeManager.ossUrl() + '/iconBalanceDetails.png',
  // 充值页面重置密码图标
  iconResetPassword: themeManager.ossUrl() + '/iconResetPassword.png',
  // 订单评价评价未选中图标
  iconUnevaluate: themeManager.ossUrl() + '/iconUnevaluate.png',
  // 订单评价评价选中图标
  iconEvaluate: themeManager.ossUrl() + '/iconEvaluate.png',
  // 返回首页图标
  toHome: themeManager.ossUrl() + '/toHome.png',
  // 订单倒计时图标
  iconOrderCountDown: themeManager.ossUrl() + '/iconOrderCountDown.png',
  // 订单收货地址位置图标
  iconOrderPosition: themeManager.ossUrl() + '/iconOrderPosition.png',
  // 订单未到自提时间图标
  iconOrderCode: themeManager.ossUrl() + '/iconOrderCode.png',
  // 订单未到自提时间图标-新
  selfCode: themeManager.ossUrl() + '/selfCode.png',
  // 订单提示图标
  iconOrderTips: themeManager.ossUrl() + '/iconOrderTips.png',
  // 订单联系门店电话图标
  iconContactPhone: themeManager.ossUrl() + '/iconContactPhone.png',
  // 下单页面拼团流程图标
  perfectOrderImg: themeManager.ossUrl() + '/perfectOrderImg.png',
  // 下单页面右箭头图标（主题色）
  iconOrderRight: themeManager.ossUrl() + '/iconOrderRight.png',
  // 下单页面添加备注图标
  iconOrderAdd: themeManager.ossUrl() + '/iconOrderAdd.png',
  // 退款成功图标
  iconRefundSuccess: themeManager.ossUrl() + '/iconRefundSuccess.png',
  // 储值支付图标
  iconCardPay: themeManager.ossUrl() + '/iconCardPay.png',
  // 微信支付图标
  iconWexinPay: themeManager.ossUrl() + '/iconWexinPay.png',
  // 储值密码输入框关闭图标
  iconCloseImg2: themeManager.ossUrl() + '/iconCloseImg2.png',
  // 积分商城积分图标
  iconScoreMall2: themeManager.ossUrl() + '/iconScoreMall.png',
  // 积分商城兑换记录图标
  iconExchangeRecord: themeManager.ossUrl() + '/iconExchangeRecord.png',
  // 商品评价星星选中图标
  iconStart1: themeManager.ossUrl() + '/iconStart1.png',
  // 商品评价星星未选中图标
  iconStart2: themeManager.ossUrl() + '/iconStart2.png',
  // 会员小程序会员卡页面储值支付图标
  payYE: themeManager.ossUrl() + '/payYE.png',
  // 会员小程序会员卡页面微信支付图标
  payWX: themeManager.ossUrl() + '/payWX.png',
  // 会员小程序会员卡页面门店图标
  iconStore: themeManager.ossUrl() + '/iconStore.png',
  // 会员小程序暂无数据图标
  noData: themeManager.ossUrl() + '/noData.png',
  /**
   * BASE_URL1 路径图片
   */
  // 没有数据图标
  imgNoData: themeManager.ossUrl() + '/imgNoData.png',
  // 没有券图标
  imgNoCoupon: themeManager.ossUrl() + '/imgNoCoupon.png',
  // 返回首页图标
  toHome1: themeManager.ossUrl() + '/toHome.png',
  // 已售罄图标
  soldOutIcon: themeManager.ossUrl() + '/sold_out_icon.png',
  // 下拉刷新提示图标
  iconRefreshNotify: themeManager.ossUrl() + '/iconRefreshNotify.png',
  // 用户默认头像图标（鲜丰）
  userImg1: themeManager.ossUrl() + '/userImg1.png',
  // 抽奖结果弹窗关闭图标
  iconLuckDrawClose: themeManager.ossUrl() + '/iconLuckDrawClose.png',
  // 抽奖组件弹窗关闭图标
  iconIndexPopupClose: themeManager.ossUrl() + '/iconIndexPopupClose.png',
  // 抽奖转发页面背景
  iconLuckDrawBg: themeManager.ossUrl() + '/iconLuckDrawBg.png',
  // 抽奖转发页面提示项图标
  iconLuckDrawItem: themeManager.ossUrl() + '/iconLuckDrawItem.png',
  // 选择图片图标
  imgAddImg: themeManager.ossUrl() + '/imgAddImg.png?v=frewrt',
  // 关注图标
  iconAdd: themeManager.ossUrl() + '/iconAdd.png',
  // 未点赞图标
  iconZan: themeManager.ossUrl() + '/iconAdd.png',
  // 已点赞图标
  iconZanActive: themeManager.ossUrl() + '/iconZanActive.png',
  // 推荐个人主页修改图标
  iconPen: themeManager.ossUrl() + '/iconPen.png',
  // 推荐粉丝图标
  iconCommunityFans: themeManager.ossUrl() + '/iconCommunityFans.png',
  // 推荐评论修改图标
  iconCommunityComment: themeManager.ossUrl() + '/iconCommunityComment.png',
  // 推荐点赞修改图标
  iconCommunityApplaud: themeManager.ossUrl() + '/iconCommunityApplaud.png',
  // 推荐我的关注图标
  iconCommunityFollow: themeManager.ossUrl() + '/iconCommunityFollow.png',
  // 推荐系统消息图标
  iconCommunityMessage: themeManager.ossUrl() + '/iconCommunityMessage.png',
  // 推荐添加购物车图标
  indexImgAdd: themeManager.ossUrl() + '/indexImgAdd.png',
  // 语音开始图标
  speechAssistantStart: themeManager.ossUrl() + '/speechAssistantStart.gif',
  // 评论默认头像图标
  userPortrait: themeManager.ossUrl() + '/boy-cm.png',
  // 商品详情火爆预售图标
  iconPresell: themeManager.ossUrl() + '/iconPresell.png',
  // 分享给好友图标
  iconWX: themeManager.ossUrl() + '/iconWX.png',
  // 发朋友圈图标
  iconFriendsCircle: themeManager.ossUrl() + '/iconFriendsCircle.png',
  // 搜索语音取消图标
  iconMicrophoneBack: themeManager.ossUrl() + '/iconMicrophoneBack.png',
  // 搜索语音图标
  iconMicrophoneWhite: themeManager.ossUrl() + '/iconMicrophoneWhite.png',
  // 搜索语音图标（黑色）
  iconMicrophoneBlack: themeManager.ossUrl() + '/iconMicrophoneBlack.png',
  // 购物车限时秒杀图标
  iconSeckillSeat: themeManager.ossUrl() + '/iconSeckillSeat.png',
  // 未登录默认二维码
  iconQrcode: themeManager.ossUrl() + '/iconQrcode.png',
  // 没有位置授权图标
  imgNoLocation: themeManager.ossUrl() + '/imgNoLocation.png',
  // 已签到背景图标
  iconSignBg1: themeManager.ossUrl() + '/iconSignBg1.png',
  // 签到成功背景图标
  iconSignBg2: themeManager.ossUrl() + '/iconSignBg2.png',
  // 签到按钮图标
  iconSigninBtn: themeManager.ossUrl() + '/iconSigninBtn.png',
  // 选择地址刷新图标
  iconRefresh: themeManager.ossUrl() + '/iconRefresh.png',
  // 右箭头图标（灰色）
  iconPointRight: themeManager.ossUrl() + '/iconPointRight.png',
  // 没有收货地址图标
  imgNoAddress: themeManager.ossUrl() + '/imgNoAddress.png',
  // 绑定手机号输入手机号图标
  iconMobile: themeManager.ossUrl() + '/iconMobile.png',
  // 绑定手机号验证码图标
  iconPassword: themeManager.ossUrl() + '/iconPassword.png',
  // 登陆背景图标
  bgLogin: themeManager.ossUrl() + '/bgLogin.png',
  // 添加图片图标2
  iconAddImg2: themeManager.ossUrl() + '/iconAddImg2.png',
  // 个人中心背景图标
  bgMy: themeManager.ossUrl() + '/bgMy.png',
  // 红包明细背景图标
  iconRedPacketBg: themeManager.ossUrl() + '/iconRedPacketBg.png',
  // 红包使用规则弹窗关闭按钮图标
  iconRedPacketClose: themeManager.ossUrl() + '/iconRedPacketClose.png',
  // 红包使用规则1图标
  iconRedPacketUse1: themeManager.ossUrl() + '/iconRedPacketUse1.png',
  // 红包使用规则2图标
  iconRedPacketUse2: themeManager.ossUrl() + '/iconRedPacketUse2.png',
  // 会员卡卡样
  memberCard: themeManager.ossUrl() + '/menberCard.png',
  // 会员卡打开余额支付
  iconBalancePay: themeManager.ossUrl() + '/iconBalancePay.png',
  // 会员卡打开微信支付
  iconWeixinPay: themeManager.ossUrl() + '/iconWeixinPay.png',
  // 拆红包图标
  iconDismantling: themeManager.ossUrl() + '/iconDismantling.png',
  // 红包会员专享标志图标
  iconRedPacketMember: themeManager.ossUrl() + '/iconRedPacketMember.png',
  // 红包背景图标
  iconRedPacket2: themeManager.ossUrl() + '/iconRedPacket2.png',
  // 红包打开顶部背景图标
  iconRedPacketTop: themeManager.ossUrl() + '/iconRedPacketTop.png',
  // 红包打开中间背景图标
  iconRedPacketTop2: themeManager.ossUrl() + '/iconRedPacketTop2.png',
  // 红包标题前后图标
  iconRedPacketSpot: themeManager.ossUrl() + '/iconRedPacketSpot.png',
  // 红包打开底部图标
  iconRedPacketBottom: themeManager.ossUrl() + '/iconRedPacketBottom.png',
  // 快递信息历史时间图标
  pass_clock: themeManager.ossUrl() + '/pass_clock.png',
  // 快递信息当前时间图标
  current_clock: themeManager.ossUrl() + '/current_clock.png',
  // 没有订单数据图标
  imgNoOrders: themeManager.ossUrl() + '/imgNoOrders.png',
  // 右箭头白色图标
  iconPointRightWhite: themeManager.ossUrl() + '/iconPointRightWhite.png',
  // 订单自提时间图标
  iconSelfTake: themeManager.ossUrl() + '/iconSelfTake.png',
  // 转发抽奖图标
  iconLuckdrawShare: themeManager.ossUrl() + '/iconLuckdrawShare.png',
  // 骑手位置配送地图关闭图标
  iconTrajectoryClose: themeManager.ossUrl() + '/iconTrajectoryClose.png',
  // 骑手位置配送地图刷新图标
  iconTrajectoryRefresh: themeManager.ossUrl() + '/iconTrajectoryRefresh.png',
  // 支付成功图标
  iconSuccess: themeManager.ossUrl() + '/iconSuccess.png',
  // 订单支付超时图标
  iconNetworkTimeout: themeManager.ossUrl() + '/iconNetworkTimeout.png',
  // 积分明细背景图标
  bgMyIntegral: themeManager.ossUrl() + '/bgMyIntegral.png',
  // 绑定手机号图标
  iconBindMobile: themeManager.ossUrl() + '/iconBindMobile.png',
  // 首页搜索图标
  indexIconSearch: themeManager.ossUrl() + '/indexIconSearch.png',
  // 充值页面重置密码图标
  iconChuzhiPass: themeManager.ossUrl() + '/iconChuzhiPass.png',
  // 充值页面查看明细图标
  iconWatchDetails: themeManager.ossUrl() + '/iconWatchDetails.png',
  // 礼品卡购买成功图标
  iconGiftBuySucc: themeManager.ossUrl() + '/iconGiftBuySucc.png',
  // 礼品卡购买历史图标
  iconBuyHis: themeManager.ossUrl() + '/iconBuyHis.png',
  // 会员小程序选中图标
  iconXuanzhong: themeManager.ossUrl() + '/iconXuanzhong.png',
  // 选择卡面额图标
  icon$: themeManager.ossUrl() + '/icon$.png',
  // 会员码图标
  iconMemberQR: themeManager.ossUrl() + '/iconMemberQR.png',
  // 会员小程序首页线上商城图标
  iconOnlineMall: themeManager.ossUrl() + '/iconOnlineMall.png',
  // 会员小程序首页充值中心图标
  iconRechargeCenter: themeManager.ossUrl() + '/iconRechargeCenter.png',
  // 会员小程序首页领券中心图标
  iconCouponCenter: themeManager.ossUrl() + '/iconCouponCenter.png',
  // 会员小程序首页礼品卡图标
  iconGiftCard: themeManager.ossUrl() + '/iconGiftCard.png',
  // 会员小程序首页积分商城图标
  iconScoreMall: themeManager.ossUrl() + '/iconScoreMall.png',
  // 点击抽奖图标
  haveatry: themeManager.ossUrl() + '/haveatry.png',
  // 抽奖新年背景图标
  newYearBg: themeManager.ossUrl() + '/newYearBg.png',
  /**
   * 邀请好友部分
   */
  // 邀请好友图标
  topic1: themeManager.ossUrl() + '/topic1.png',
  // 送一张券图标
  sendOne: themeManager.ossUrl() + '/sendOne.png',
  // 邀请好友成功标题图标
  gratulationsOne: themeManager.ossUrl() + '/gratulationsOne.png',
  // 十元券图标
  tenCoupon: themeManager.ossUrl() + '/tenCoupon.jpg',
  // 邀请好友规则图标
  ruleTip: themeManager.ossUrl() + '/ruleTip.png',
  // 邀请好友规则关闭图标
  closeButton: themeManager.ossUrl() + '/closeButton.png',
  // 邀请好友规则流程图标
  process: themeManager.ossUrl() + '/process.png',
  // 邀请好友背景图标
  background: themeManager.ossUrl() + '/background.png',
  // 邀请好友红包背景图标
  redPackage: themeManager.ossUrl() + '/redPackage.png',
  // 邀请好友成为VIP图标
  VIP: themeManager.ossUrl() + '/VIP.png',

  //扫码取件按钮
  iconSweepCode: themeManager.ossUrl() + '/iconSweepCode.png',
  // 拼团商品详情右侧图标
  iconGroupRightDetails: themeManager.ossUrl() + '/iconGroupRightDetail.png',
  // 商品详情联系客服
  iconContacts: themeManager.ossUrl() + '/iconContacts.png',
  // 新人券
  iconNewUserCoupon: themeManager.ossUrl() + '/iconNewUserCoupon.png',
  // 助力送券券背景
  iconCouponBg: themeManager.ossUrl() + '/iconCouponBg.png',

  // 邀请好友新默认UI
  // 活动背景图
  activityBg: themeManager.ossUrl() + '/activityBg.png',
  // 活动规则图
  activityRulesBg: themeManager.ossUrl() + '/activityRulesBg.png',
  // 活动规则按钮
  activityRulesBtn: themeManager.ossUrl() + '/activityRulesBtn.png',
  // 活动标题区图片
  inviteeActivityTitle: themeManager.ossUrl() + '/inviteeActivityTitle.png',
  // 信息录入背景
  inviteeInfoInputBg: themeManager.ossUrl() + '/inviteeInfoInputBg.png',
  // 领取按钮
  inviteeReceiveBtn: themeManager.ossUrl() + '/inviteeReceiveBtn.png',
  // 活动奖品区
  inviterActivityPrize: themeManager.ossUrl() + '/inviterActivityPrize.png',
  // 活动标题区图片
  inviterActivityTitle: themeManager.ossUrl() + '/inviterActivityTitle.png',
  // 分享按钮
  inviterCoupon: themeManager.ossUrl() + '/inviterCoupon.png',
  // 分享按钮
  inviterShareBtn: themeManager.ossUrl() + '/inviterShareBtn.png',
  // 活动标题区图片
  receiveActivityTitle: themeManager.ossUrl() + '/receiveActivityTitle.png',
  // 立即使用
  receiveImmediateUseBtn: themeManager.ossUrl() + '/receiveImmediateUseBtn.png',
  // 奖品展示背景
  receiveShowPrizeBg: themeManager.ossUrl() + '/receiveShowPrizeBg.png',
  // 分销员申请背景
  applyDistributionBg: themeManager.ossUrl() + '/applyDistributionBg.jpg',
  // 橘色箭头
  orangeArrowRight: themeManager.ossUrl() + '/orangeArrowRight.png',
  // 积分商城优惠券图标
  scoreOrderCoupon: themeManager.ossUrl() + '/scoreOrderCoupon.png',
  // 卡支付
  iconBankCardPay: themeManager.ossUrl() + '/iconBankCardPay.png',
  // 添加卡
  iconCardAdd: themeManager.ossUrl() + '/iconCardAdd.png',
  // 清除
  iconCardClose: themeManager.ossUrl() + '/iconCardClose.png',
  // 储值卡
  iconCardCZ: themeManager.ossUrl() + '/iconCardCZ.png',
  // 卡logo
  iconCardLogo: themeManager.ossUrl() + '/iconCardLogo.png',
  // 绑卡成功
  iconCardSuccess: themeManager.ossUrl() + '/iconCardSuccess.png',
  // 微信支付
  iconWXPay: themeManager.ossUrl() + '/iconWXPay.png',
  // 微信支付
  checkmark: themeManager.ossUrl() + '/checkmark.png',
  // 默认条码（会员码）
  iconBarcode: themeManager.ossUrl() + '/iconBarcode.jpg',
  // 附近门店位置
  iconNearStoreAddress: themeManager.ossUrl() + '/iconNearStoreAddress.png',
  // 附近门店背景
  iconNearStoreBg: themeManager.ossUrl() + '/iconNearStoreBg.png',
  // 附近门店导航
  iconNearStoreNav: themeManager.ossUrl() + '/iconNearStoreNav.png',
  // 附近门店电话
  iconNearStoreTel: themeManager.ossUrl() + '/iconNearStoreTel.png',
  // 附近门店时间
  iconNearStoreTime: themeManager.ossUrl() + '/iconNearStoreTime.png',
  // 附近门店微信号
  iconNearStoreWeChat: themeManager.ossUrl() + '/iconNearStoreWeChat.png',
  // 新用户注册弹窗
  new_regist: themeManager.ossUrl() + '/new_regist.png',
  // 未读券弹窗背景
  unvistedCouponBg: themeManager.ossUrl() + "/unvistedCouponBg.png",
  // 红色问号符号
  redQuestionMark: themeManager.ossUrl() + "/redQuestionMark.png",
  // 没有可领取的优惠券
  imgNoCouponReceive: themeManager.ossUrl() + "/imgNoCouponReceive.png",
  // 没有可购买的礼品卡
  imgNoGiftCardBuy: themeManager.ossUrl() + "/imgNoGiftCardBuy.png",
  // 没有可使用的礼品卡
  imgNoGiftCardUsed: themeManager.ossUrl() + "/imgNoGiftCardUsed.png",
  // 悬浮的购物车按钮（新会员专享）
  flowCart: themeManager.ossUrl() + "/flowCart.png",
  // 首页顶部会员区一码付入口
  iconMemberQRPay: themeManager.ossUrl() + '/iconMemberQRPay2.png',
  // 已经是会员背景图片
  alreadyMember: themeManager.ossUrl() + "/alreadyMember.jpg",
  // 券分割线
  couponSeparator: themeManager.ossUrl() + "/couponSeparator.png",
  //首页提示收藏按钮
  pushCollect: themeManager.ossUrl() + "/remindCollectNew.png",
  // 砍价相关
  // 砍价背景
  iconBargainBg: themeManager.ossUrl() + "/iconBargainBg.png",
  // 砍价弹窗关闭按钮
  iconBargainClose: themeManager.ossUrl() + "/iconBargainClose.png",
  // 砍价弹窗背景
  iconBargaining: themeManager.ossUrl() + "/iconBargaining.png",
  // 砍价地址图标
  iconBargainPosition: themeManager.ossUrl() + "/iconBargainPosition.png",
  // 砍价右侧图标
  iconBargainRight: themeManager.ossUrl() + "/iconBargainRight.png",
  // 砍价门店图标
  iconBargainStore: themeManager.ossUrl() + "/iconBargainStore.png",
  // 砍价自提时间图标
  iconBargainTime: themeManager.ossUrl() + "/iconBargainTime.png",
  // 好友左侧
  iconHelpRight: themeManager.ossUrl() + "/iconHelpRight.png",
  // 好友右侧
  iconHelpLeft: themeManager.ossUrl() + "/iconHelpLeft.png",
  // 推荐商品拼团人数背景
  iconRecommendGroup: themeManager.ossUrl() + "/iconRecommendGroup.png",
  // 券分割线
  iconIndexScorePay: themeManager.ossUrl() + "/iconIndexScorePay.png",
  //首页提示收藏按钮
  iconIndexCardPay: themeManager.ossUrl() + "/iconIndexCardPay.png",
  // 券码图标
  iconCouponQRCode: themeManager.ossUrl() + "/iconCouponQRCode.png",
  //选择门店位置图标
  iconStorePosition: themeManager.ossUrl() + "/iconStorePosition.png",
  //选择门店已选择图标
  iconStoreChecked: themeManager.ossUrl() + "/iconStoreChecked.png",
  //选择门店导航图标
  iconStoreNav: themeManager.ossUrl() + "/iconStoreNav.png",
  //充值有礼图标
  iconRechargeGift: themeManager.ossUrl() + "/iconRechargeGift.png",
  //充值已选择图标
  iconRechargeChecked: themeManager.ossUrl() + "/iconRechargeChecked.png",
  //充值密码图标
  iconRechargePassword: themeManager.ossUrl() + "/iconRechargePassword.png",
  //充值明细图标
  iconRechargeDetails: themeManager.ossUrl() + "/iconRechargeDetails.png",
  //详情页面拼团图标
  iconDetailsBlockRight: themeManager.ossUrl() + "/iconDetailsBlockRight.png",
  //公告前hot图标
  iconIndexHots: themeManager.ossUrl() + "/iconIndexHots.png",
  // 关注公众号提示
  iconOfficialAccount: themeManager.ossUrl() + "/iconOfficialAccount.png",
  //详情页跳转首页按钮图标
  iconDetailsHome: themeManager.ossUrl() + "/iconDetailsHome.png",
  //详情页购物车按钮图标
  icontabbar_shopcart: themeManager.ossUrl() + "/tabbar_shopcart.png",
  //详情页客服图标
  iconCustomerService: themeManager.ossUrl() + "/iconCustomerService.png",
  // 系统公告背景图
  iconNoticeBg: themeManager.ossUrl() + "/iconNoticeBg.png",
  // 首页搜索按钮图标
  iconSearch: themeManager.ossUrl() + "/iconSearch.png",
  //查看更多图标
  icon_more: themeManager.ossUrl() + "/icon_more.png",
  //首页拼团标题图标
  iconIndexGroup: themeManager.ossUrl() + "/iconIndexGroup.png",
  //首页秒杀标题图标
  iconIndexGrab: themeManager.ossUrl() + "/iconIndexGrab.png",
  //首页砍价标题图标
  iconIndexBargain: themeManager.ossUrl() + "/iconIndexBargain.png",
  // 添加购物车
  iconNewAdd: themeManager.ossUrl() + "/iconAdd.png",
  // 首页加载图标
  indexLoading: themeManager.ossUrl() + "/indexLoading.jpg",
  // 向右小箭头图标
  orderRight: themeManager.ossUrl() + "/orderRight.png",
  // 位置图标
  iconPeneryAddress: themeManager.ossUrl() + "/iconPeneryAddress.png",
  // 助力抽奖图标
  iconPeneryHelp: themeManager.ossUrl() + "/iconPeneryHelp.jpg",
  // 抽奖线
  iconPeneryLine: themeManager.ossUrl() + "/iconPeneryLine.png",
  // 抽奖结果图标
  iconPeneryResult: themeManager.ossUrl() + "/iconPeneryResult.jpg",
  // 分享抽奖图标
  iconPeneryShare: themeManager.ossUrl() + "/iconPeneryShare.jpg",
  // 抢购图标
  iconPenneryHand: themeManager.ossUrl() + "/iconPenneryHand.png",
  // 抽奖商品列表图标
  iconPenneryList: themeManager.ossUrl() + "/iconPenneryList.png",
  // 抽奖商品列表图标（选中）
  iconPenneryListActive: themeManager.ossUrl() + "/iconPenneryListActive.png",
  // 抽奖我的图标
  iconPenneryMy: themeManager.ossUrl() + "/iconPenneryMy.png",
  // 抽奖我的图标（选中）
  iconPenneryMyActive: themeManager.ossUrl() + "/iconPenneryMyActive.png",
  // 抽奖规则图标
  iconPenneryRules: themeManager.ossUrl() + "/iconPenneryRules.png",
  // 抽奖背景
  iconPenneryTopBg: themeManager.ossUrl() + "/iconPenneryTopBg.jpg",
  // 抽奖背景
  iconPenneryTopBg20190904: themeManager.ossUrl() + "/iconPenneryTopBg20190904.jpg",
  // 抽奖未助力背景
  iconPeneryUnHelp: themeManager.ossUrl() + "/iconPeneryUnHelp.jpg",
  // 抽奖助力背景
  iconPeneryHelp20190924: themeManager.ossUrl() + "/iconPeneryHelp20190924.jpg",
  // 抽奖背景
  iconPenneryTopBg20190924: themeManager.ossUrl() + "/iconPenneryTopBg20190924.jpg",
  // 充值抽奖助力背景
  iconLotteryHelp20191025: themeManager.ossUrl() + "/iconLotteryHelp20191025.jpg",
  // 充值抽奖背景
  iconLotteryTopBg20191025: themeManager.ossUrl() + "/iconLotteryTopBg20191025.jpg",
  // 充值抽奖背景
  iconLotteryTopBg20191106: themeManager.ossUrl() + "/iconLotteryTopBg20191106.jpg",
  // 分享抽奖图标
  iconPeneryShare20191106: themeManager.ossUrl() + "/iconPeneryShare20191106.jpg",
  // 微信分享图标
  iconPenneryWeChet: themeManager.ossUrl() + "/iconPenneryWeChet.png",
  // 无码商品图标
  iconOffLine: themeManager.ossUrl() + "/iconOffLine.jpg",
  // 砍价券
  iconBargainCoupon: themeManager.ossUrl() + "/iconBargainCoupon.png",

  // 申请信用卡图标
  iconToCreditCard: themeManager.ossUrl() + "/home_credit_card.png",
  // 申请合伙人图标
  iconToApplyDistributor: themeManager.ossUrl() + "/home_partner.png",
  // 取件图标
  iconToPickUp: themeManager.ossUrl() + "/home_pickup.png",
  // 邀请好友
  iconToInvite: themeManager.ossUrl() + "/home_invite_friends.png",
  // 我的红包
  iconToRedPacket: themeManager.ossUrl() + "/home_red_envelope.png",
  // 收货地址
  iconToAddress: themeManager.ossUrl() + "/home_address.png",
  // 我的评价
  iconToGoodsComment: themeManager.ossUrl() + "/home_evaluation.png",
  // 联系客服
  iconToCustomerService: themeManager.ossUrl() + "/home_customer_service.png",
  // 我的银行卡
  iconToMyBankCardList: themeManager.ossUrl() + "/home_bank.png",
  // 领券中心
  iconToCouponCenter: themeManager.ossUrl() + "/home_coupon.png",
  // 礼品卡中心
  iconToGiftCardCenter: themeManager.ossUrl() + "/home_gift_card.png",
  // 意见反馈
  iconToFeedback: themeManager.ossUrl() + "/home_feedback.png",
  // 余额明细
  iconToBalance: themeManager.ossUrl() + "/home_stored_value.png",
  // 会员资料
  iconToMemberData: themeManager.ossUrl() + "/home_member.png",
  // 系统设置
  iconToSystem: themeManager.ossUrl() + "/home_setting.png",
  // 我的分销中心
  iconDistribution: themeManager.ossUrl() + "/iconDistribution.png",
  // 会员中心右上角二维码图标
  iconNewMyCard: themeManager.ossUrl() + "/iconMemberCard.png",
  // 自定义导航栏返回
  navigation_bar_btn_goback: themeManager.ossUrl() + "/navigation-bar_btn_goback.png",
  // 自定义导航栏主页
  navigation_bar_btn_gohome: themeManager.ossUrl() + "/navigation-bar_btn_gohome.png",

  // 我的砍价
  iconToBargain: themeManager.ossUrl() + "/iconToBargain.png",
  // 商品详情配送信息
  iconStoreSelfDelivery: themeManager.ossUrl() + "/iconStoreSelfDelivery.png",
  /* 付费会员相关 */
  // VIP卡样
  iconVipBg: themeManager.ossUrl() + "/iconVipBg.png",
  // VIP特权块
  iconVipBlock: themeManager.ossUrl() + "/iconVipBlock.png",
  // VIP券
  iconVipCoupon: themeManager.ossUrl() + "/iconVipCoupon.png",
  // VIP券背景
  iconVipCouponBg: themeManager.ossUrl() + "/iconVipCouponBg.png",
  // VIP券内容
  iconVipCouponContent: themeManager.ossUrl() + "/iconVipCouponContent.png",
  // 皇冠
  iconVipCrown: themeManager.ossUrl() + "/iconVipCrown.png",
  // VIP折扣
  iconVipDiscount: themeManager.ossUrl() + "/iconVipDiscount.png",
  // VIP入口背景
  iconVipEntrance: themeManager.ossUrl() + "/iconVipEntrance.png",
  // VIP价背景
  iconVipLabel: themeManager.ossUrl() + "/iconVipLabel.png",
  // VIP更多
  iconVipMore: themeManager.ossUrl() + "/iconVipMore.png",
  // VIP支付标签
  iconVipPayLabel: themeManager.ossUrl() + "/iconVipPayLabel.png",
  // VIP积分
  iconVipScore: themeManager.ossUrl() + "/iconVipScore.png",
  // VIP
  memberVIP: themeManager.ossUrl() + "/memberVIP.png",
  // VIP积分
  iconVIPFlower: themeManager.ossUrl() + "/iconVIPFlower.png",
  // 购物车选中
  shoppingCartSelected: themeManager.ossUrl() + "/shoppingCartSelected.png",
  // 购物车未选择
  shoppingCartUnSelected: themeManager.ossUrl() + "/shoppingCartUnSelected.png",
  // 未读券背景
  iconUnreadCoupon: themeManager.ossUrl() + "/iconUnreadCoupon.png",
  // 未读券背景
  iconUnreadCouponIten: themeManager.ossUrl() + "/iconUnreadCouponIten.png",
  // 分享图下方价格区背景图
  iconSharePrice: themeManager.ossUrl() + "/sharePrice.png",
  // 分享图下方描述信息背景
  iconShareDesc: themeManager.ossUrl() + "/shareDesc.png",
  // 抽奖背景2
  iconLuckDrawBg2: themeManager.ossUrl() + "/iconLuckDrawBg2.jpg",
  // 返回顶部
  scrollTop: themeManager.ossUrl() + "/scrollTop.png",
  // 未读券顶部
  iconUnreadCouponTop: themeManager.ossUrl() + "/iconUnreadCouponTop.png",
  // 首页券背景
  couponIndexBg: themeManager.ossUrl() + "/5020a11ad4f103e259ba03327eb183fc_.png",
  // 首页券背景1
  couponIndexItemBg: themeManager.ossUrl() + "/ac82caac331d8fc4af57d65171c78475_.png",
  // 可用商品列表购物车
  iconCouponListCart: themeManager.ossUrl() + "/iconCouponListCart.png",
  // 可用商品列表券
  iconCouponListCoupon: themeManager.ossUrl() + "/iconCouponListCoupon.png",
  // 可用商品列表右侧箭头
  iconCouponListRight: themeManager.ossUrl() + "/iconCouponListRight.png",
  // 可用商品列表门店
  iconCouponListShop: themeManager.ossUrl() + "/iconCouponListShop.png",
  // 会员中心成长值钱包
  iconMemberPackage: themeManager.ossUrl() + "/iconMemberPackage.png",
  // 分类页面商品显示为列表
  iconProductShowList: themeManager.ossUrl() + "/iconProductShowList.png",
  // 分类页面商品显示为卡片
  iconProductShowCard: themeManager.ossUrl() + "/iconProductShowCard.png",
  /* 刷脸支付 */
  // 刷脸储值付款
  iconFacePayCard: themeManager.ossUrl() + "/iconFacePayCard.png",
  // 刷脸微信付款
  iconFacePayWX: themeManager.ossUrl() + "/iconFacePayWX.png",
  // 刷脸顶部
  iconFacePayTop: themeManager.ossUrl() + "/iconFacePayTop.png",
  // 刷脸选中
  iconFacePaySelected: themeManager.ossUrl() + "/iconFacePaySelected.png",
  // 刷脸更多
  iconFacePayMore: themeManager.ossUrl() + "/iconFacePayMore.png",
  // 刷脸未选中
  iconFacePayUnSelect: themeManager.ossUrl() + "/iconFacePayUnSelect.png",
  // 兑换优惠券背景图片
  couponBgImg: themeManager.ossUrl() + "/iconCouponBgImg.png",
  // 微信图片
  iconWechatLogo: themeManager.ossUrl() + "/iconWechatLogo.png",
  // 已兑完
  icon_exchange_out: themeManager.ossUrl() + "/icon_exchange_out.png",
  // 选择支付方式已选择
  orderSelected: themeManager.ossUrl() + "/orderSelected.png",
  // 已下架图标
  iconLowerShelf: themeManager.ossUrl() + "/iconLowerShelf.png",
  // 微信logo
  iconWeixinLogo: themeManager.ossUrl() + "/weixin.png",
  // 导购商品分享到朋友圈海报头部logo
  promotionShareTitle: themeManager.ossUrl() + "/promotionShareTitle.png",
  /* 直播相关图标 */
  // 直播返回首页图标
  livePlayHomeBack: themeManager.ossUrl() + "/livePlayHomeBack.png",
  // 直播分享图
  livePlayShareImage: themeManager.ossUrl() + "/livePlayShareImage.png",
  // 直播分享链接
  livePlayShareLink: themeManager.ossUrl() + "/livePlayShareLink.png",
  // 直播TV
  livePlayTV: themeManager.ossUrl() + "/livePlayTV.png",
  // 直播首页
  livePlayHome: themeManager.ossUrl() + "/livePlayHome.png",
  // 秒杀结束
  iconSeckillEnd: themeManager.ossUrl() + "/iconSeckillEnd.png",
  // 秒杀进行中
  iconSeckillHand: themeManager.ossUrl() + "/iconSeckillHand.png",
  // 分享标签
  iconNewShareLabel: themeManager.ossUrl() + "/iconNewShareLabel.png",
  /* 新下单及订单样式相关图标 */
  // 订单详情门店地址
  iconOrderDetailAddress: themeManager.ossUrl() + "/iconOrderDetailAddress.png",
  // 向上箭头
  iconCollect: themeManager.ossUrl() + "/iconCollect.png",
  // 向下箭头
  iconDropDown: themeManager.ossUrl() + "/iconDropDown.png",
  // 分割线白
  iconDividingline: themeManager.ossUrl() + "/iconDividingline.png",
  // 分割线白红
  iconDividingline2: themeManager.ossUrl() + "/iconDividingline2.png",
  // 完善订单券抵扣金额背景
  iconCouponBgRed: themeManager.ossUrl() + "/iconCouponBgRed.png",
  // 订单详情电话
  iconTelephone: themeManager.ossUrl() + "/iconTelephone.png",
  // 订单顶部图片
  iconOrderTopMore: themeManager.ossUrl() + "/iconOrderTopMore.png",
  // 接龙图片
  perfectOrderSolitaireImg: themeManager.ossUrl() + "/perfectOrderSolitaireImg.jpg",
  // 退款金额图标
  iconRefundMoney: themeManager.ossUrl() + "/iconRefundMoney.png",
  // 接龙分享按钮
  iconShareBtn: themeManager.ossUrl() + "/iconShareBtn.png",
  // 分享按钮
  iconShare: themeManager.ossUrl() + "/iconShare.png",
  // 分享对话框
  iconShareWechatMoments: themeManager.ossUrl() + "/iconShareWechatMoments.png",
  // 分享朋友圈
  iconShareWechatDialog: themeManager.ossUrl() + "/iconShareWechatDialog.png",
  // 分类箭头
  iconCategoryArrow: themeManager.ossUrl() + "/iconCategoryArrow.png",
  // 分类搜索图标
  iconiconCategorySearch: themeManager.ossUrl() + "/iconiconCategorySearch.png",
  // 分类显示详情
  iconCategoryShowCard: themeManager.ossUrl() + "/iconCategoryShowCard.png",
  // 分类显示列表
  iconCategoryShowList: themeManager.ossUrl() + "/iconCategoryShowList.png",
  // 接龙logo
  iconSolitaireLogo: themeManager.ossUrl() + "/iconSolitaireLogoMKH.png",
  // 接龙目录
  iconSolitaireMenu: themeManager.ossUrl() + "/iconSolitaireMenu.png",
  // 接龙分享
  iconSolitaireShare:  themeManager.ossUrl() + "/iconSolitaireShare-white.png",
  // 接龙电话
  iconSolitaireTel:  themeManager.ossUrl() + "/iconSolitaireTel-white.png",
  // 接龙分享2
  iconSolitaireShare2:  themeManager.ossUrl() + "/iconSolitaireShare2-white.png",
  solitairelistBg: themeManager.ossUrl() + "/solitairelist-bg.png",
  // 接龙选择门店图标
  iconSolitaireStoreRight:  themeManager.ossUrl() + "/iconIndexStoreRight.png",
  solitaireBackground: themeManager.ossUrl() + "/solitaireBackground.png",
  solitareCar: themeManager.ossUrl() + "/solitareCar.png",
  // 同步图标
  iconUserRefresh: themeManager.ossUrl() + "/iconUserRefresh.png",


  // 福利计划顶部图标
  welfarePlanTop: themeManager.ossUrl() + "/576986a0db3e27e0ab52a214c1fa51e.png",
  // 福利计划标题左边图标1
  welfarePlanTitleLeft: themeManager.ossUrl() + "/c5344713cceeda62ceb35f2ec3cf0926_.png",
  // 福利计划标题右边图标
  welfarePlanTitleRight: themeManager.ossUrl() + "/297b136ba8e3e64a3ad71513c4acdbff_.png",
  // welfarePlanIndexBg: themeManager.ossUrl() + "/1601045383738306561/32bb3875ab3e1b11f0c436d29179548f_.png",
  // 福利计划标题首页背景图标
  welfarePlanIndexBg1: themeManager.ossUrl() + "/ee1597476a6d5a1c99834e1fa972fba.png",
  // 福利计划标题首页明细背景图标
  welfarePlanIndexItemBg: themeManager.ossUrl() + "/6bca230a1f9f8c6c01100f28e3c1c087_.png",
  // 抽奖按钮
  scoreRaffleBtn: themeManager.ossUrl() + "/59aa1d2bdf3643208ff826abd170910.png",
  // 抽奖背景
  scoreRaffleBg: themeManager.ossUrl() + "/scoreRaffleBg.jpg",
  // 券可领取背景
  couponBg: themeManager.ossUrl() + "/ee137b26982576dd845ef49f3f5f3f1.png",
  // 券不可领取背景
  couponBg1: themeManager.ossUrl() + "/75ffcb95a74b9afbbf748f7ee47bfbf.png",
  // 券可领取按钮
  couponText: themeManager.ossUrl() + "/38baac4c577f5c6e554d35cb7760440.png",
  // 券不可领取按钮
  couponText1: themeManager.ossUrl() + "/55b739e898862adeca4532451fb3948.png",
  // 积分列表背景
  score_bg: themeManager.ossUrl() + "/f79d623519c5df8741ae109e605eb77.jpg",
  // 福利计划搜索logo
  search_logo: themeManager.ossUrl() + "/afe57ba56d10a28dc80ccf600e5e7ee.jpg",
  choose_img: themeManager.ossUrl() + "/a6d2639a99891af0f6ca5747cb80c51.png",
  skipMyTourism: themeManager.ossUrl() + "/7b9ff4150713392c61a2ea46b8c9329.png",
  noSeckillData: themeManager.ossUrl() + "/cdcae1c9919506efc4faa5eeaa27bd8.png",
  clusteringImg: themeManager.ossUrl() + "/b6074de5f940a3e6cd672211e0cf1ca.png",

  // 都市花乡新增图标
  searchIconBlack: themeManager.ossUrl() + '/searchIconBlack.png',
  searchIcon: themeManager.ossUrl() + '/searchIcon.png',
  toc: themeManager.ossUrl() + '/toc.png',
  iconRightWhite: themeManager.ossUrl() + '/iconRight-white.png',
  addressWhite: themeManager.ossUrl() + '/address-white.png',
  qrCodeBg: themeManager.ossUrl() + '/qcc.jpg',
  scoreBg: themeManager.ossUrl() + '/score-bg.png',
  scoreCoupon: themeManager.ossUrl() + '/score-coupon.png',
  scoreGroup: themeManager.ossUrl() + '/score-group.png',
  scoreRecordIcon: themeManager.ossUrl() + '/score-record-icon.png',
  scoreStoreIcon: themeManager.ossUrl() + '/score-store-icon.png',
  scoreHeng: themeManager.ossUrl() + '/score-heng.png',
  scoreShu: themeManager.ossUrl() + '/score-shu.png',
  upIcon: themeManager.ossUrl() + '/up.png',
  
  // 下单页面自提未选中图标
  iconOrderSelfTake: themeManager.ossUrl() + '/iconOrderSelfTakeActive-noSelect.png',
  // 下单页面自提选中图标
  iconOrderSelfTakeActive: themeManager.ossUrl() + '/iconOrderSelfTakeActive.png',
  // 外送
  iconOrderTakeout: themeManager.ossUrl() + "/iconOrderTakeout-noSelect.png",
  // 外送选中
  iconOrderTakeoutActive: themeManager.ossUrl() + "/iconOrderTakeout.png",
  // 下单页面配送未选中图标
  iconOrderDistribution: themeManager.ossUrl() + '/iconOrderDistribution-noSelect.png',
  // 下单页面配送选中图标
  iconOrderDistributionActive: themeManager.ossUrl() + '/iconOrderDistribution.png',
  //首页会员码按钮图标
  iconMemberCardBlack: themeManager.ossUrl() + "/iconMemberCardBlack.png",
  logo: themeManager.ossUrl() + "/logo.png",
  storeOrderIcon: themeManager.ossUrl() + "/store-order-icon.jpg",
  // 线下订单默认图片
  storeOrderDefaultIcon: themeManager.ossUrl() + "/storeOrderDefaultIcon.png",
  // 完善订单图标
  perfectOrderAddress: themeManager.ossUrl() + "/address.png",
  changeStore: themeManager.ossUrl() + "/change-store.png",
  distributionGood: themeManager.ossUrl() + "/distribution-good.png",
  nextDayGood: themeManager.ossUrl() + "/next-day-good.png",
  storeGood: themeManager.ossUrl() + "/store-good.png",

  // 商品列表会员价icon
  memberIcon: themeManager.ossUrl() + "/member-icon.png",
  // 福利计划标题首页背景图标
  welfarePlanIndexBg: themeManager.ossUrl() + "/welfarePlanIndexBg.png",

  // 好友助力送券标题
  assistanceCouponTitleBg: themeManager.ossUrl() + "/assistance-coupon-title.png",
  // 好友助力送券券背景
  assistanceCouponBg: themeManager.ossUrl() + "/assistance-coupon.png",
  // 门店列表企业微信icon
  enterpriseWechatIcon: themeManager.ossUrl() + "/enterpriseWechatIcon.png",
  // 查看会员信息背景
  memberInfoBg: themeManager.ossUrl() + "/memberInfoBg.jpg",
  // 会员信息背景
  memberCardBg: themeManager.ossUrl() + "/memberCardBg.jpg",
  // 订单修改时间
  orderEditTime: themeManager.ossUrl() + '/orderEditTime.png',
  // 订单导航
  orderAddress: themeManager.ossUrl() + '/orderAddress.png',

  // 花艺师相关图标
  floristAddress: themeManager.ossUrl() + '/floristAddress.png',
  floristDuration: themeManager.ossUrl() + '/floristDuration.png',
  floristIconStoreNav: themeManager.ossUrl() + '/floristIconStoreNav.png',
  floristMobile: themeManager.ossUrl() + '/floristMobile.png',
  floristPeopleNum: themeManager.ossUrl() + '/floristPeopleNum.png',
  floristTime: themeManager.ossUrl() + '/floristTime.png',
  houseIcon: themeManager.ossUrl() + '/house-icon.png',
  noServiceItems: themeManager.ossUrl() + '/no-service-items.png',
  noServiceStaff: themeManager.ossUrl() + '/no-service-staff.png',

  newSearchIcon: themeManager.ossUrl() + '/search-icon.png',
  newCouponActive: themeManager.ossUrl() + '/coupon-active.png',
  newCouponActive1: themeManager.ossUrl() + '/coupon-active1.png',
  newGouwucheIcon: themeManager.ossUrl() + '/gouwuche-icon.png',
  newHomeOrderIcon: themeManager.ossUrl() + '/home-order-icon.png',
}
export const useImagesPath = () => {
  return imagesPath
}

export default imagesPath