<template>
<gm-transition name="slide-down" :show="show" custom-class="gm-notify" :custom-style="'background-color:' + backgroundColor + ';top:' + navHeight + 'px;'">
  {{text}}
</gm-transition>
</template>
<script setup>
import { reactive , watch} from "vue";
const app = getApp();
//获取应用实例
const state = reactive({
  navHeight: 0
});
let options = {
  addGlobalClass: true
};
const props = defineProps({
  text: {
    type: String,
    value: 'center'
  },
  color: {
    type: String,
    value: '#fff'
  },
  backgroundColor: {
    type: String,
    value: '#e64340'
  },
  duration: {
    type: Number,
    value: 3000
  }
});
function show() {
  const {
    duration
  } = state;
  clearTimeout(timer);
  state.show = true;
  if (duration > 0 && duration !== Infinity) {
    timer = setTimeout(() => {
      hide();
    }, duration);
  }
}
function hide() {
  clearTimeout(timer);
  state.show = false;
}

// Watch listeners converted from observers
watch(() => props.text, (t, e) => {
  if (t !== "") {
          state.navHeight = app.globalData.navHeight;
        } else {
          state.navHeight = 0;
        }
});

</script>
<style scoped>
.gm-notify{top:0;width:100%;z-index:110;color:#fff;position:fixed;min-height:64rpx;line-height:2;font-size:32rpx;text-align:center;background-color:#e64340;box-sizing: border-box;padding: 0 40rpx;}
</style>