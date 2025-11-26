<script lang="ts" setup>
const props = defineProps({
  title: {
    type: [String, Number],
  },
})
const emit = defineEmits(['click'])
const qicon =
  'https://oss.xay.xacloudy.cn/images/2025-03/1e50b516-f92b-4895-b551-8608c23486c9qicon.png'

const showBtn = ref(true)
const click = () => {
  emit('click', 1)
}
// setInterval(() => {
//   showBtn.value = !showBtn.value
// }, 3000)
defineOptions({
  options: {
    styleIsolation: 'shared',
  },
})
</script>

<template>
  <view class="animated shake">
    <wd-button block custom-class="bg-#F44D24! rounded-4px! " @click="click">
      <view class="flex justify-center gap-10px items-center">
        <wd-img :src="qicon" width="33px" height="22px"></wd-img>
        <text class="font-size-16px">{{ props.title }}</text>
      </view>
    </wd-button>
  </view>
</template>

<style lang="scss" scoped>
.animated {
  -webkit-animation-duration: 10s;
  animation-duration: 10s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}

@-webkit-keyframes shake {
  0%,
  100% {
    -webkit-transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    -webkit-transform: translateX(-10px);
  }
  20%,
  40%,
  60%,
  80% {
    -webkit-transform: translateX(10px);
  }
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-10px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(10px);
  }
}

.shake {
  -webkit-animation-name: shake;
  animation-name: shake;
}
</style>
