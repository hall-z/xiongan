<route lang="json5" type="page">
{
  needLogin: true,
  style: {
    navigationBarTitleText: '设置',
    backgroundColor: '#fff',
    navigationBarBackgroundColor: '#fff',
    navigationBarTextStyle: 'black',
  },
}
</route>

<script lang="ts" setup>
import { logout } from '@/service/api/auth'
import { promotionDateStore } from '@/store'
import { useUserStore } from '@/store/user'
import { routeTo } from '@/utils'
import { useRequest } from 'alova/client'
import { storeToRefs } from 'pinia'
import { useMessage } from 'wot-design-uni'
import gywm from '../static/images/gywm.png'
import out from '../static/images/logout.png'
import mmdl from '../static/images/mmdl.png'
import shdz from '../static/images/shdz.png'
import yhxy from '../static/images/yhxy.png'
import yszc from '../static/images/yszc.png'
import zhzx from '../static/images/zhzx.png'
import { serveProps } from './utils/types'
const version = 'V' + import.meta.env.PACKAGE_VERSION
// const version = 'V' + '2.0.1'
const message = useMessage()
const serveList = ref<serveProps[]>([
  // #ifndef APP-PLUS
  {
    icon: mmdl,
    title: '小程序免密登录',
    path: '/pages-sub/system/sysconfig/setting',
    islink: true,
    isLoginShow: true,
  },
  // #endif

  {
    icon: shdz,
    title: '收货地址',
    path: '/pages-sub/userManager/address/list',
    islink: true,
    isLoginShow: true,
  },
  {
    icon: yhxy,
    title: '用户协议',
    path: '/pages-sub/webView/index',
    islink: true,
    data: {
      articleId: '1710488285782016006',
    },
  },
  {
    icon: yszc,
    title: '隐私政策',
    path: '/pages-sub/webView/index',
    islink: true,
    data: {
      articleId: '1710488285782016005',
    },
  },
  {
    icon: gywm,
    title: '版本',
    path: 'min',
    islink: false,
    value: version,
  },
  {
    icon: zhzx,
    title: '账号注销',
    islink: true,
    value: '注销后无法恢复，请谨慎操作',
    path: '/pages-sub/system/sysconfig/cancellation',
    isLoginShow: true,
  },
  {
    icon: out,
    title: '退出登录',
    path: '',
    islink: false,
    value: '',
    click: true,
    isLoginShow: true,
  },
])
const serveClick = (item: serveProps) => {
  if (item.islink) {
    routeTo({
      url: item.path,
      data: { type: item.data?.articleId, showTop: true, title: item.title },
    })
  } else {
    if (item.click) {
      logoutCimfirm()
      return
    }
    if (item.path) return
    uni.showToast({
      title: '功能开发中...',
      icon: 'none',
    })
  }
}
// 退出操作
const { loading, send: sendLogOut } = useRequest(logout, {
  immediate: false,
  loading: false,
})
const { clearUserInfo } = useUserStore()
const { clearPromotionDate } = promotionDateStore()
const { isLogined, userInfo } = storeToRefs(useUserStore())
const LogOut = async () => {
  setTimeout(() => {
    clearUserInfo()
    clearPromotionDate()
    uni.switchTab({
      url: '/pages/mine/index',
    })
  }, 100)
}

const logoutCimfirm = () => {
  message
    .confirm({
      msg: '确定退出系统吗？',
      title: '提示',
    })
    .then(() => {
      LogOut()
    })
}

serveList.value = isLogined.value
  ? serveList.value
  : serveList.value.filter((item) => !item.isLoginShow)
</script>

<template>
  <view class="py-10px">
    <view class="rounded-10px overflow-hidden">
      <wd-cell-group border>
        <wd-cell
          :is-link="item.islink"
          custom-class="custom-class-mine-cell"
          v-for="(item, index) in serveList"
          :key="index"
          clickable
          @click="serveClick(item)"
        >
          <template #icon>
            <wd-img :src="item.icon" width="28" height="28px"></wd-img>
          </template>
          <template #title>
            <view class="ml-10px">{{ item.title }}</view>
          </template>
          <view v-if="item.value" class="color-#999">{{ item.value }}</view>
        </wd-cell>
      </wd-cell-group>
    </view>
  </view>
</template>

<style lang="scss" scoped></style>
