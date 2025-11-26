<route lang="json5" type="page">
{
  layout: 'default',
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
import { modelOther } from './hooks/lifespan'
import { dataDesensitization, routeTo } from '@/utils'
import { mainTypeEmums } from '@/enums/mainTypeEmum'
import { Constant } from '@/enums/constant'
import { useUserStore } from '@/store'
import dayjs from 'dayjs'

const { userInfo } = useUserStore()
const navTitle = ref('')
const baseCon = ref('')
const yktIcon = ref(
  'https://oss.xay.xacloudy.cn/images/2025-07/1318531d-961b-418f-90f6-fceb867d53d9ykt.png',
)

// 获取验证码

// 本人认证信息提交
const modelMe = reactive({
  cardName: userInfo.cardName,
  nameTm: userInfo.cardNameTm,
  cardCode: userInfo.idCardNumber,
  idCardNumberTm: userInfo.idCardNumberTm,
  applyType: '1',
})

const applyType = ref('')
const expireDate = ref('')
const issueDate = ref('')
const xaCardType = ref('')
const daysUntilExpiration = ref(null)
const familyRelation = ref('')
const cardList = ref([
  { label: '未知', value: '0' },
  { label: '第二代社保卡', value: '1' },
  { label: '第三代社保卡', value: '2' },
  { label: '雄安一卡通', value: '3' },
])
const goBusiness = () => {
  routeTo({ url: '/pages-sub/serveMassage/businessOutlets/index' })
}
const goShare = () => {}
const goApply = () => {
  if (xaCardType.value === '0') {
    routeTo({
      url: '/pages-sub/serveMain/cardApplyType',
      data: { base: 'shebaoksl', title: '社保卡申领', applyType: applyType.value },
    })
  } else {
    routeTo({
      url: '/pages-sub/serveMain/cardApplyType',
      data: { base: 'shebaokbh', title: '社保卡补换', applyType: applyType.value },
    })
  }
}

const getsex = (idCard) => {
  // 检查身份证号码长度
  if (!idCard || (idCard.length !== 15 && idCard.length !== 18)) {
    return '身份证号码长度不正确'
  }

  // 获取第17位数字（15位身份证取最后一位，18位身份证取第17位）
  const genderDigit = idCard.length === 15 ? idCard.charAt(14) : idCard.charAt(16)

  // 判断性别
  return parseInt(genderDigit, 10) % 2 === 1 ? '男' : '女'
}
// 回显字典值
const getLabelByValue = (list, value) => {
  const item = list.find((item) => item.value === value)
  return item ? item.label : '' // 如果找到对应的项，返回label，否则返回空字符串
}
onLoad((options: any) => {
  baseCon.value = options.base
  navTitle.value = decodeURIComponent(options.title)
  applyType.value = options.applyType
  expireDate.value = options.expireDate
  issueDate.value = options.issueDate
  xaCardType.value = options.xaCardType
  familyRelation.value = options.familyRelation
  daysUntilExpiration.value = options.daysUntilExpiration
})
onMounted(() => {
  onShareAppMessage((res) => {
    if (res.from === 'button') {
      const shareData = {
        title: '雄安一卡通',
        path: '/pages/index/index',
        imageUrl:
          'https://oss.xay.xacloudy.cn/images/2025-07/eff6b0f3-72b8-4524-9a9c-0e73ff0d24f7222.png',
        // imgPrefix.value + qrcodeImg.value?.body,
        complete: () => {
          // 分享记录
          useShare('/pages/index/index')
        },
      }
      return shareData
    }
  })
})
</script>

<template>
  <view class="min-h-100vh bg-#fff">
    <dy-navbar :leftTitle="navTitle" center customClass="nav_bg"></dy-navbar>
    <!--基本信息 -->
    <view class="pt-20rpx">
      <wd-form ref="form" :model="modelOther">
        <wd-cell-group>
          <wd-cell
            title="姓名"
            v-if="applyType === '1'"
            :value="dataDesensitization(modelMe.cardName, false, 'userName')"
          />
          <wd-cell
            title="身份证号码"
            v-if="applyType === '1'"
            :value="dataDesensitization(modelMe.cardCode, false, 'last')"
          />
          <wd-cell
            title="姓名"
            v-if="applyType === '2'"
            :value="dataDesensitization(modelOther.cardName, false, 'userName')"
          />
          <wd-cell
            title="身份证号码"
            v-if="applyType === '2'"
            :value="dataDesensitization(modelOther.cardCode, false, 'last')"
          />
          <wd-cell title="社保卡类型" :value="getLabelByValue(cardList, xaCardType)" />
          <wd-cell
            title="发卡日期"
            v-if="xaCardType !== '0'"
            :value="dayjs(issueDate).format('YYYY年MM月DD日')"
          />
          <wd-cell
            title="有效期至"
            v-if="xaCardType !== '0'"
            :value="dayjs(expireDate).format('YYYY年MM月DD日')"
          />
        </wd-cell-group>
      </wd-form>
      <view class="promptOutBox">
        <view class="promptInnerBox" v-if="xaCardType === '0'">
          <img :src="yktIcon" alt="" class="w-33px h-25px mt-3px" />
          <view class="tex">
            <view>
              <text>
                <!--                <text style="color: #ff0000">未查询到您的雄安一卡通社保卡信息。</text>-->
                <text style="color: #ff0000" v-if="applyType === '1'">
                  未查询到您的雄安一卡通社保卡信息。
                </text>
                <text
                  style="color: #ff0000"
                  v-if="applyType === '2' && getsex(modelOther.cardCode) === '男'"
                >
                  未查询到他的雄安一卡通社保卡信息。
                </text>
                <text
                  style="color: #ff0000"
                  v-if="applyType === '2' && getsex(modelOther.cardCode) === '女'"
                >
                  未查询到她的雄安一卡通社保卡信息。
                </text>

                <text style="color: #000000"></text>
              </text>
            </view>
            <view>换领“雄安一卡通”社保卡</view>
            <view>一卡多用，惠民福利，尽在雄安一卡通！</view>
          </view>
        </view>
        <view
          class="promptInnerBox"
          v-if="xaCardType !== '0' && daysUntilExpiration >= 0 && daysUntilExpiration < 180"
        >
          <img :src="yktIcon" alt="" class="w-33px h-25px mt-3px" />
          <view class="tex">
            <view>
              <text>
                <text style="color: #000000" v-if="applyType === '1'">{{ '您的社保卡' }}</text>
                <text
                  style="color: #000000"
                  v-if="applyType === '2' && getsex(modelOther.cardCode) === '男'"
                >
                  {{ '他的社保卡' }}
                </text>
                <text
                  style="color: #000000"
                  v-if="applyType === '2' && getsex(modelOther.cardCode) === '女'"
                >
                  {{ '她的社保卡' }}
                </text>

                <text style="color: #2d69ef">{{ '距离到期不足半年，' }}</text>
              </text>
            </view>
            <view>请及时更换“雄安一卡通”社保卡。</view>
            <view>一卡多用，惠民福利，尽在雄安一卡通！</view>
          </view>
        </view>
        <view class="promptInnerBox" v-if="xaCardType !== '0' && daysUntilExpiration < 0">
          <img :src="yktIcon" alt="" class="w-33px h-25px mt-3px" />
          <view class="tex">
            <view>
              <text>
                <text style="color: #000000" v-if="applyType === '1'">{{ '您的社保卡' }}</text>
                <text
                  style="color: #000000"
                  v-if="applyType === '2' && getsex(modelOther.cardCode) === '男'"
                >
                  {{ '他的社保卡' }}
                </text>
                <text
                  style="color: #000000"
                  v-if="applyType === '2' && getsex(modelOther.cardCode) === '女'"
                >
                  {{ '她的社保卡' }}
                </text>
                <text style="color: #ff0000">{{ '已超过有效期，' }}</text>
              </text>
            </view>
            <view>请及时更换“雄安一卡通”社保卡。</view>
            <view>一卡多用，惠民福利，尽在雄安一卡通！</view>
          </view>
        </view>
        <view
          class="promptInnerBox"
          v-if="
            xaCardType !== '0' &&
            daysUntilExpiration >= 0 &&
            daysUntilExpiration >= 180 &&
            xaCardType !== '3'
          "
        >
          <img :src="yktIcon" alt="" class="w-33px h-25px mt-3px" />
          <view class="tex">
            <view>换领“雄安一卡通”社保卡</view>
            <view>一卡多用，惠民福利，尽在雄安一卡通！</view>
          </view>
        </view>
      </view>
    </view>
    <!--   v-if="
        familyRelation === '0' ||
        !(xaCardType == '3' && daysUntilExpiration >= 0 && daysUntilExpiration >= 180)
      " -->
    <!-- #ifndef APP-PLUS -->
    <view
      class="mt-80rpx pr-40rpx pb-40rpx pl-40rpx botBox"
      v-if="!(xaCardType == '3' && daysUntilExpiration >= 0 && daysUntilExpiration >= 180)"
    >
      <view>
        <wd-button
          :round="false"
          block
          open-type="share"
          v-if="familyRelation === '0'"
          @click="goShare"
        >
          {{
            applyType == '2'
              ? '分享并提醒下' + (getsex(modelOther.cardCode) === '男' ? '他' : '她')
              : '分享'
          }}
        </wd-button>

        <wd-button :round="false" block v-else @click="goApply">
          {{
            applyType == '2'
              ? '代' + (getsex(modelOther.cardCode) === '男' ? '他' : '她') + '办理'
              : '线上申请'
          }}
        </wd-button>
        <view style="text-align: center" class="mt-20rpx">
          <wd-button type="text" @click="goBusiness">线下网点查询</wd-button>
        </view>
      </view>
    </view>

    <!-- #endif -->

    <!-- #ifdef APP-PLUS -->
    <view
      class="mt-80rpx pr-40rpx pb-40rpx pl-40rpx botBox"
      v-if="!(xaCardType == '3' && daysUntilExpiration >= 0 && daysUntilExpiration >= 180)"
    >
      <view>
        <wd-button :round="false" block v-if="familyRelation !== '0'" @click="goApply">
          {{
            applyType == '2'
              ? '代' + (getsex(modelOther.cardCode) === '男' ? '他' : '她') + '办理'
              : '线上申请'
          }}
        </wd-button>
        <view style="text-align: center" class="mt-20rpx">
          <wd-button type="text" @click="goBusiness">线下网点查询</wd-button>
        </view>
      </view>
    </view>

    <!-- #endif -->
  </view>
</template>

<style lang="scss" scoped>
:deep(.wd-cell__title) {
  color: #777777;
}

:deep(.wd-cell) {
  //加边框底色
  border-bottom: 1px solid #f1f1f1;
}

.promptOutBox {
  padding: 15px;

  .promptInnerBox {
    display: flex;
    align-items: flex-start;
    padding: 15px;
    background: #ebf8ff;
    border: 1px solid #d9f2ff;
    border-radius: 5px 5px 5px 5px;

    .tex {
      // width: calc(100% - 50px);
      margin-left: 15px;
      font-size: 15px;
      line-height: 22px;
    }
  }
}

.botBox {
  position: fixed;
  bottom: 20px;
  width: calc(100% - 2.5rem);
}

:deep(.wd-button.is-text) {
  color: #999999;
}
</style>
