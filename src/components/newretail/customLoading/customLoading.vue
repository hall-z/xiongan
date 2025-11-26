<template>
  <view class="loading-mask" v-if="showLoading">
    <image :src="loadingImage" mode="widthFix" style="width: 240rpx;" />
  </view>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'CustomLoading',
  setup() {
    const store = useStore()
    const showLoading = ref(true)
    const loadingImage = ref('')

    onMounted(() => {
      loadingImage.value = store.state.systemConfigure?.customizedPicture || ''
    })

    const show = () => {
      showLoading.value = true
    }

    const hide = () => {
      showLoading.value = false
    }

    return {
      showLoading,
      loadingImage,
      show,
      hide
    }
  }
})
</script>

<style scoped>
.loading-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
</style>