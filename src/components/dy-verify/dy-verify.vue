<script setup lang="ts">
const { getCodeUrl, codeImg } = useImageVerify()

// vue3.2 版本不支持
// defineOptions({
//   name: "ReImageVerify",
// });

const props = defineProps({
  width: {
    type: Number || String,
    default: 100,
  },
  height: {
    type: Number || String,
    default: 30,
  },
})
</script>

<template>
  <wd-img :width="props.width" :height="props.height" :src="codeImg" @click="getCodeUrl"></wd-img>
</template>
