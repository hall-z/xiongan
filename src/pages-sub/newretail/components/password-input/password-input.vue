<template>
<!--components/password-input/password-input.wxml-->
<view class="custom-input-box">
  <!-- 输入框（表格） -->
  <view :class="(interval ? 'pay_number' : 'pay_number_interval') + '  ' + (focus_class ? 'get_focus' : '')" @click.stop="set_focus" :style="'width:' + width + ';height:' + height + ';'">
    <view :class="(focus_class ? interval ? 'get_focus_dot' : 'get_focus_dot_interval' : interval ? 'password_dot' : 'password_dot_interval') + ' ' + (index == 0 ? 'noBorder' : '')" v-for="(item , index) in value_num" :key="index">
      <view v-if="value_length == item - 1 && focus_class" class="cursor"></view>
      <view v-if="value_length >= item" :class="see ? '' : 'dot'">{{see ? val_arr[index] : ""}}</view>
    </view>
  </view>
  <!-- 输入框（隐藏） -->
  <input :value="input_value" :focus="get_focus" maxlength="6" type="number" class="input_container" placeholder="" @input="get_value" @focus="get_focus" @blur="blur">
</view>
</template>
<script setup>
import { reactive , watch} from "vue";
// components/password-input/password-input.js
const state = reactive({});
const props = defineProps({
  //输入框密码位数
  value_length: {
    type: Number,
    value: 0,
    // 监听输入框密码变化
  },
  // 是否显示间隔输入框
  interval: {
    type: Boolean,
    value: true
  },
  // 是否有下一步按钮（如果有则当输入6位数字时不自动清空内容）
  isNext: {
    type: Boolean,
    value: false
  },
  //输入框聚焦状态
  get_focus: {
    type: Boolean,
    value: false
  },
  //输入框初始内容
  input_value: {
    type: String,
    value: ""
  },
  //输入框聚焦样式 
  focus_class: {
    type: Boolean,
    value: false
  },
  //输入框格子数
  value_num: {
    type: Array,
    value: [1, 2, 3, 4, 5, 6]
  },
  //输入框高度
  height: {
    type: String,
    value: "98rpx"
  },
  //输入框宽度
  width: {
    type: String,
    value: "604rpx"
  },
  //是否明文展示
  see: {
    type: Boolean,
    value: false
  }
});
function get_focus() {
  let that = this;
  state.focus_class = true;
}
function blur() {
  let that = this;
  state.focus_class = false;
}
function set_focus() {
  let that = this;
  state.get_focus = true;
}
function get_value(data) {
  let that = this;
  // 设置空数组用于明文展现
  let val_arr = [];
  // 获取当前输入框的值
  let now_val = data.detail.value;
  // 遍历把每个数字加入数组
  for (let i = 0; i < 6; i++) {
    val_arr.push(now_val.substr(i, 1));
  }
  // 获取输入框值的长度
  let value_length = data.detail.value.length;
  // 更新数据
  state.value_length = value_length;
  state.val_arr = val_arr;
  state.input_value = now_val;
}
function clearValue() {
  const that = this;
  state.value_length = 0;
  state.val_arr = [];
  state.input_value = "";
}

// Watch listeners converted from observers
watch(() => props.value_length, (newVal, oldVal) => {
  let that = this;
        let input_value = state.input_value;
        triggerEvent('valueNow', input_value);
        // 当输入框的值等于6时（发起支付等...）
        if (newVal == 6) {
          // 设定延时事件处理
          setTimeout(function () {
            // 引用组件页面的自定义函数(前一个参数为函数，后一个为传递给父页面的值)
            triggerEvent('valueSix', input_value);
            // 当没有
            // if (!that.data.isNext) {
            //   // 回到初始样式
            //   that.setData({
            //     get_focus: false,
            //     value_length: 0,
            //     input_value: ""
            //   });
            // }
          }, 100);
        }
});

watch(() => props.interval, (newVal, oldVal) => {
  
});

watch(() => props.isNext, (newVal, oldVal) => {
  
});

watch(() => props.get_focus, (newVal, oldVal) => {
  
});

watch(() => props.input_value, (newVal, oldVal) => {
  if (newVal === "") {
          clearValue();
        }
});

watch(() => props.focus_class, (newVal, oldVal) => {
  
});

watch(() => props.value_num, (newVal, oldVal) => {
  
});

watch(() => props.height, (newVal, oldVal) => {
  
});

watch(() => props.width, (newVal, oldVal) => {
  
});

watch(() => props.see, (newVal, oldVal) => {
  
});

</script>
<style scoped>
/* components/password-input/password-input.wxss */
/* 支付密码框 */
.custom-input-box {
  position: relative;
}
.pay_number {
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  border: 1px solid #dcdcdc;
}
.pay_number_interval {
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  border-left: 1px solid #dcdcdc;
  /* border:none; */
}
/* 第一个格子输入框 */
.custom-input-box .noBorder {
  border-left: none;
}
/* 支付密码框聚焦的时候 */
.get_focus {
  border-color: #dcdcdc;
}
/* 单个格式样式 */
.password_dot {
  flex: 1;
  border-left: 1px solid #dcdcdc;
  display: flex;
  align-items: center;
  justify-content: center;
}
.password_dot_interval {
  flex: 1;
  border: 1px solid #dcdcdc;
  margin-right: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}
/* 单个格式样式（聚焦的时候） */
.get_focus_dot {
  flex: 1;
  border-left: 1px solid #dcdcdc;
  display: flex;
  align-items: center;
  justify-content: center;
}
.get_focus_dot_interval {
  flex: 1;
  border: 1px solid #dcdcdc;
  margin-right: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}
/* 模拟光标 */
.cursor {
  width: 1px;
  height: 42rpx;
  background-color: #dcdcdc;
  animation: focus 0.7s infinite;
}
/* 光标动画 */
@keyframes focus {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
/* 格式中的点 */
.dot {
  width: 30rpx;
  height: 30rpx;
  background-color: #8b8b8b;
  border-radius: 50%;
}
/* 输入框 */
.input_container {
    height: 100%;
    width: 200%;
    min-height: 0;
    position: absolute;
    left: -100%;
    top: 0;
}
</style>