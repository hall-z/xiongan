/* stylelint-disable selector-type-no-unknown */
<script lang="ts" setup>
import picImage from '../static/images/picImage.png'
const card1 = ref(
  'https://oss.xay.xacloudy.cn/images/2025-04/f2224a93-e9ee-4039-a56e-93a259a1fe6bidCard1.png',
)
const card2 = ref(
  'https://oss.xay.xacloudy.cn/images/2025-04/f8353652-55f9-425d-8e34-5c78cdbcf933idCard2.png',
)
const card3 = ref(
  'https://oss.xay.xacloudy.cn/images/2025-04/1802cb79-14bf-4306-a5b6-620509ad9bedidCard4.png',
)

onMounted(() => {
  current.value = data.value.find((item) => {
    return item.type === props.type
  })
})
const emit = defineEmits<{
  (e: 'unloadClick', value: any): void
}>()
const props = defineProps({
  type: {
    type: Number,
    default: 0,
  },

  smTitle: {
    type: String,
    default: '',
  },
  imgUrl: {
    type: String,
    default: '',
  },
})
const data = ref([
  {
    type: 0,
    name: '',
    url: '',
    des: '照片',
  },
  {
    type: 1,
    name: '国徽面',
    url: card2,
    des: '本人身份证',
  },
  {
    type: 2,
    name: '人像面',
    url: card1,
    des: '本人身份证',
  },
  {
    type: 3,
    name: '国徽面',
    url: card2,
    des: '代办人身份证',
  },
  {
    type: 4,
    name: '人像面',
    url: card1,
    des: '代办人身份证',
  },
  {
    type: 5,
    name: '首页',
    url: card3,
  },
  {
    type: 6,
    name: '本人页',
    url: card3,
  },
])
const current = ref({
  type: 0,
  name: '',
  url: '',
})
</script>

<template>
  <view>
    <view
      class="custom-class custom-preview-class relative overflow-hidden text-center"
      :class="{ 'photo-custom-class': current!.type === 0 }"
    >
      <image
        class="custom-class-img"
        :src="props.imgUrl"
        v-if="props.imgUrl"
        mode="widthFix"
        :class="current!.type !== 0 ? 'img1' : 'img2'"
      ></image>
      <!--   -->
      <image :src="current!.url" class="custom-class-img" v-else></image>
      <view class="cardDes" v-if="current!.type !== 0 && !props.imgUrl">
        <view class="addIcon">
          <wd-icon name="add1" size="30px" color="#fff"></wd-icon>
        </view>
        <view
          class="desText"
          v-if="
            current!.type === 1 || current!.type === 2 || current!.type === 3 || current!.type === 4
          "
        >
          请上传身份证（{{ current!.name }}）
        </view>
        <view class="desText" v-if="current!.type === 5 || current!.type === 6">
          请上传户口本（{{ current!.name }}）
        </view>
      </view>
      <view v-if="current!.type === 0 && !props.imgUrl" class="cardDes imageDes">
        <view class="imgIcon">
          <image :src="picImage"></image>
        </view>
        <view class="uploadText">点击上传</view>
      </view>
    </view>
    <view class="text-center mt-10px">{{ props.smTitle }}{{ current!.name }}</view>
  </view>
</template>

<style lang="scss" scoped>
:deep(.custom-class) {
  @apply w-80% mx-a bd-dashed_#1890ff rounded-10px;
}
:deep(.custom-evoke-class),
:deep(.custom-preview-class) {
  @apply w-full h-203px  m-0;
}
:deep(.custom-class-img) {
  @apply overflow-hidden rounded-10px;
}
:deep(.wd-img),
:deep(.wd-img__image) {
  @apply wh-full!;
}
.img1 {
  // transform: rotate(270deg) scaleY(1.8) scaleX(1.4);
}
.img2 {
  // @apply w-50%!;
}
.custom-class {
  position: relative;
  border: none;
  border-radius: 0px;

  .custom-class-img {
    width: 320px;
    height: 203px;
  }

  .cardDes {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    .addIcon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      margin: 65px auto 20px;
      background: #2d69ef;
      border-radius: 50%;
    }

    .desText {
      font-size: 16px;
      font-weight: 400;
      color: #333333;
    }
  }
}

.custom-class.photo-custom-class {
  height: 148px;
  margin-top: 0 !important;
  background: #fff;
  border: 1px dashed #2d69ef;

  .custom-class-img {
    width: 100%;
    height: 148px;
    border-radius: 0;
  }

  .imgIcon {
    width: 37px;
    height: 32px;
    margin: 42px auto 14px;
    image {
      width: 100%;
      height: 100%;
    }
  }

  .uploadText {
    font-size: 14px;
    font-weight: 400;
    color: #2d69ef;
    text-align: center;
  }
}
</style>
