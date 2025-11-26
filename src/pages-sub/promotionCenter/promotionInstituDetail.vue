<route lang="json5" type="page">
{
  layout: 'default',
  // needLogin: true,
  realNameAuthentication: true,
  style: {
    navigationStyle: 'custom',
    'mp-alipay': {
      transparentTitle: 'always',
      titlePenetrate: 'YES',
      defaultTitle: '',
      titlePenetrate: 'NO',
    },
  },
}
</route>
<script lang="ts" setup>
import {
  getCountStatus,
  getUserCountByTimeWindow,
  getUserListByTime,
  checkPromoterOrgUser,
  getOrgUserByUserId,
} from '@/service/api/system'
import { dataDesensitization } from '@/utils'
import UCharts from '@qiun/ucharts/u-charts'
import { useRequest, useWatcher } from 'alova/client'
import dayjs from 'dayjs'
import PromotionSuccessful from './components/PromotionInstSuccessful.vue'
import Promotion from './utils/promotion'
import {
  activationResult,
  IGetCountStatusData,
  IGetUserCountByTimeWindowData,
  IGetUserListByTimeData,
} from './utils/types'
const uChartsInstance = ref({})
const { statusList } = Promotion()
const cWidth = ref(660)
const cHeight = ref(400)
const navTitle = ref('机构推广')

const coreIcon1 = ref(
  'https://oss.xay.xacloudy.cn/images/2025-05/cd4dcb6e-415f-4c66-9a05-bf7336e7ff56proImg1.png',
)
const coreIcon2 = ref(
  'https://oss.xay.xacloudy.cn/images/2025-05/da0ff690-c57e-4ed8-96ce-60f73b4badabproImg2.png',
)
const coreIcon3 = ref(
  'https://oss.xay.xacloudy.cn/images/2025-05/d3d454bf-e71e-4f3e-b95f-03ea4f9a4fe8proImg3.png',
)
const dcIcon = ref(
  'https://oss.xay.xacloudy.cn/images/2025-05/fd85ac45-6a40-4e32-aa9f-2e50578c6bf1Oub6Jb1MYAVT99626a733143def5543fb5e19a9fef74.png',
)

const status = ref<number>(null)
const optionStatus = ref<Record<string, any>[]>([
  { label: '全部状态', value: null },
  { label: '待处理', value: 0 },
  { label: '已申领', value: 1 },
])
function handleChange1({ value }) {
  console.log(value)
}
const dateValue = ref<any>('1')
const timeType1 = ref('week')
function dateChange(e) {
  dateValue.value = e
  if (e === '1') {
    timeType1.value = 'week'
  } else {
    timeType1.value = 'month'
  }
}
const dateValue2 = ref<any>('1')
const timeType2 = ref('day')
const dateChange2 = (e) => {
  dateValue2.value = e
  if (e === '1') {
    timeType2.value = 'day'
  } else if (e === '2') {
    timeType2.value = 'week'
  } else {
    timeType2.value = 'month'
  }
}
const getServerData = (x, y) => {
  // 模拟从服务器获取数据时的延时
  setTimeout(() => {
    const res = {
      categories: x,
      series: [
        {
          name: '人数',
          data: y,
          areaStyle: { color: '#2D69EF' },
        },
      ],
    }
    drawCharts('canvasLine', res)
  }, 500)
}
const drawCharts = (id, data) => {
  const ctx = uni.createCanvasContext(id)
  uChartsInstance[id] = new UCharts({
    type: 'area',
    context: ctx,
    width: cWidth.value,
    height: cHeight.value,
    categories: data.categories,
    series: data.series,
    color: ['#2D69EF'],
    touchMoveLimit: 24,
    enableScroll: true,
    padding: [30, 10, 10, 10],
    legend: {
      show: false, // 关键参数，关闭图例
    },
    xAxis: {
      disableGrid: true,
      disabled: false,
      axisLine: false,
      axisLineColor: '#CCCCCC',
      calibration: true,
      fontColor: '#666666',
      fontSize: 12,
      lineHeight: 20,
      marginTop: 5,
      rotateLabel: true,
      rotateAngle: 45,
      itemCount: 7,
      boundaryGap: 'center',
      splitNumber: 7,
      gridColor: '#CCCCCC',
      gridType: 'solid',
      dashLength: 4,
      gridEval: 1,
      scrollShow: false,
      scrollAlign: 'left',
      scrollColor: '#A6A6A6',
      scrollBackgroundColor: '#EFEBEF',
    },
    yAxis: {
      gridType: 'dash',
      // data: [{ min: 0 }],
    },
    extra: {
      area: {
        type: 'straight',
        opacity: 0.2,
        addLine: true,
        width: 2,
        gradient: true,
        activeType: 'hollow',
      },
    },
  })
}
function tap(e) {
  uChartsInstance[e.target.id].touchLegend(e)
  uChartsInstance[e.target.id].showToolTip(e)
}

const successfulRef = ref()
const orgUserId = ref()
// 根据当前用户id 查询推广人信息
useRequest(() => getOrgUserByUserId(), {
  immediate: true,
  loading: false,
}).onSuccess((res: any) => {
  console.log('getOrgUserByUserId', res)
  if (res.data.id) {
    if (successfulRef.value) {
      // 调用码子接口
      orgUserId.value = res.data.id
      // successfulRef.value.sendUnlimitedQRCodeFun({ id: res.data.id })
      successfulRef.value.sendUnlimitedQRCodeFun(res.data)
      sedGetCountStatus()
      sedGetUserCountByTimeWindow()
      sedGetUserListByTime()
    }
  }
})
const { send: sedGetCountStatus, data: CountStatusData } = useRequest(
  () => getCountStatus<IGetCountStatusData>({ orgUserId: orgUserId.value }),
  {
    immediate: false,
    loading: false,
    initialData: {
      total: 0,
      workTotal: 0,
      todayCount: 0,
    },
  },
)
const { send: sedGetUserCountByTimeWindow } = useWatcher(
  () => {
    const params = {
      timeType: timeType1.value,
      orgUserId: orgUserId.value,
    }
    return getUserCountByTimeWindow<IGetUserCountByTimeWindowData[]>(params)
  },
  [timeType1],
  {
    immediate: false,
    loading: false,
  },
).onSuccess((res) => {
  const xdata = []
  const ydata = []
  res.data.forEach((item: IGetUserCountByTimeWindowData, index: number) => {
    xdata.push(item.ymd)
    ydata.push(item.total)
  })
  getServerData(xdata, ydata)
})

// 列表
const { send: sedGetUserListByTime, data: userListBytimeData } = useWatcher(
  () => {
    const params = {
      page: 1,
      size: 100,
      timeType: timeType2.value,
      status: status.value,
      orgUserId: orgUserId.value,
    }
    return getUserListByTime<IGetUserListByTimeData>(params)
  },
  [timeType2, status],
  {
    immediate: false,
    loading: false,
    initialData: {
      content: [],
    },
    async middleware(ctx, next) {
      const result = await next()
      result.content = result.content.map((item: any) => {
        const cstatus = statusList.value.find((i: any) => i.value === item.status)
        item.createTime = dayjs(item.createTime).format('YYYY-MM-DD HH:mm')
        item.statusName = cstatus?.label
        item.statusColor = cstatus?.color
        // item.userName = dataDesensitization(item.userName, false, 'promoterName')
        return item
      })
      return result
    },
  },
)

onLoad((options: any) => {})

onReady(() => {
  // 这里的 750 对应 css .charts 的 width
  cWidth.value = uni.upx2px(660)
  // 这里的 500 对应 css .charts 的 height
  cHeight.value = uni.upx2px(400)
})
</script>

<template>
  <view class="dy-blue-deep-bg">
    <dy-navbar :leftTitle="navTitle" center isNavShow color="#000"></dy-navbar>
    <view class="">
      <view class="promoDetailBox">
        <Promotion-Successful ref="successfulRef" title="推广码" :type="2" :id="orgUserId" />
        <view class="promotionTitle">核心数据概览</view>
        <view class="coreBox">
          <view class="coreItem coreItem1">
            <wd-img width="35px" height="35px" :src="coreIcon1" />
            <view class="txt1">{{ CountStatusData.total }}</view>
            <view class="txt2">累计推广人数</view>
          </view>
          <view class="coreItem coreItem2">
            <wd-img width="35px" height="35px" :src="coreIcon2" />
            <view class="txt1">{{ CountStatusData.workTotal }}</view>
            <view class="txt2">完成申领人数</view>
          </view>
          <!-- <view class="coreItem coreItem3">
            <wd-img width="35px" height="35px" :src="coreIcon3" />
            <view class="txt1">
              {{
                CountStatusData.total > 0 && CountStatusData.workTotal > 0
                  ? ((CountStatusData.workTotal / CountStatusData.total) * 100).toFixed(2) + '%'
                  : 0
              }}
            </view>
            <view class="txt2">转化率</view>
          </view> -->
        </view>
        <view class="trendBox">
          <view class="trendTitle">
            <view>推广人数趋势</view>
            <!-- <view class="trendRadioBox">
              <view
                :class="dateValue === '1' ? 'tRadioItem tRadioItemActive' : 'tRadioItem'"
                style="margin-right: 5px"
                @click="dateChange('1')"
              >
                7天
              </view>
              <view
                :class="dateValue === '2' ? 'tRadioItem tRadioItemActive' : 'tRadioItem'"
                @click="dateChange('2')"
              >
                30天
              </view>
            </view> -->
          </view>
          <view class="trendCharts">
            <canvas
              canvas-id="canvasLine"
              id="canvasLine"
              :style="{
                width: '100%',
                height: '215px',
              }"
              @tap="tap"
              :inScrollView="true"
              :canvas2d="true"
            ></canvas>
          </view>
        </view>
        <view class="promotionTitle promotionTitle2">
          <view>明细数据</view>
          <!-- <view class="dcBtu">
            <wd-img width="15px" height="15px" style="margin-right: 5px" :src="dcIcon" />
            导出报表
          </view> -->
        </view>
        <view class="trendBox detailList" style="margin-top: 0px">
          <view class="trendTitle" style="justify-content: flex-end">
            <!-- <view class="ml-[-10px]">
              <wd-drop-menu>
                <wd-drop-menu-item
                  v-model="status"
                  :options="optionStatus"
                  @change="handleChange1"
                />
              </wd-drop-menu>
            </view> -->
            <view class="trendRadioBox">
              <view
                :class="dateValue2 === '1' ? 'tRadioItem tRadioItemActive' : 'tRadioItem'"
                style="margin-right: 5px"
                @click="dateChange2('1')"
              >
                今日
              </view>
              <view
                :class="dateValue2 === '2' ? 'tRadioItem tRadioItemActive' : 'tRadioItem'"
                style="margin-right: 5px"
                @click="dateChange2('2')"
              >
                本周
              </view>
              <view
                :class="dateValue2 === '3' ? 'tRadioItem tRadioItemActive' : 'tRadioItem'"
                @click="dateChange2('3')"
              >
                本月
              </view>
            </view>
          </view>
          <view class="py-10px min-h-200px">
            <template v-if="userListBytimeData?.content?.length > 0">
              <view
                class="px-10px py-10px flex items-center gap-10px Listitem relative mb-10px"
                v-for="item in userListBytimeData?.content"
                :key="item.id"
              >
                <wd-img width="40" height="40" round :src="coreIcon2" mode="aspectFit" />
                <view class="text-16px color-#333333">{{ item.userName }}</view>
                <!-- <view class="text-14px color-#888888">{{ item.userBankName }}</view> -->
                <view class="text-12px color-#888888 ml-auto">
                  {{ item.createTime }}
                </view>
                <!-- <view
                  class="text-12px px-10px py-2px absolute right-0 top-0 rounded-bl-15px bg-#F1F6F2"
                  :style="{ color: item.statusColor }"
                >
                  {{ item.statusName }}
                </view> -->
              </view>
            </template>
            <template v-else>
              <wd-status-tip image="content" tip="暂无内容" />
            </template>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.promoDetailBox {
  padding: 15px;
  .promotionTitle {
    padding-bottom: 15px;
    padding-left: 8px;
    font-size: 16px;
    color: #000;
  }
  .promotionTitle2 {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 15px;
    .dcBtu {
      font-size: 14px;
      color: #2d69ef;
      :deep(.wd-img) {
        margin-right: 6px;
      }
    }
  }

  .coreBox {
    display: flex;
    justify-content: space-around;
    height: 150px;
    .coreItem {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: calc((100% - 18px) / 3);
      height: 100%;
      padding: 10px;
      border-radius: 6px;
      .txt1 {
        margin-top: 20px;
        margin-bottom: 5px;
        font-size: 24px;
        color: #000;
      }
      .txt2 {
        font-size: 14px;
        color: #888888;
      }
    }
    .coreItem1 {
      box-shadow: inset 0px 0px 20px 1px rgba(255, 188, 130, 0.31);
    }
    .coreItem2 {
      box-shadow: inset 0px 0px 20px 1px rgba(115, 176, 255, 0.31);
    }
    .coreItem3 {
      box-shadow: inset 0px 0px 20px 1px rgba(74, 205, 82, 0.31);
    }
  }
  .trendBox {
    padding: 15px;
    padding-bottom: 0px;
    margin-top: 15px;
    background-color: #fff;
    border-radius: 6px;
    .trendTitle {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 16px;
      .trendRadioBox {
        display: flex;
        .tRadioItem {
          width: 45px;
          height: 25px;
          font-size: 12px;
          line-height: 25px;
          color: #000;
          text-align: center;
          cursor: pointer;
          background-color: #f2f3f7;
          border-radius: 3px;
        }
        .tRadioItemActive {
          color: #fff;
          background-color: #2d69ef;
        }
      }
    }
    .trendCharts {
      width: 100%;
      height: 215px;
      margin-top: 15px;
    }
  }
}
.Listitem {
  background: #ffffff;
  border-radius: 6px 6px 6px 6px;
  box-shadow: 0px 0px 10px 1px rgba(77, 153, 255, 0.28);
}
</style>
