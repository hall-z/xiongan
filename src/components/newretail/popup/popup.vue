<template>
  <view v-if="overlay" 
    class="overlay-class popup__overlay" 
    :class="{ 'popup--show': show }" 
    :style="overlayStyle" 
    @click="onClickOverlay"
  />
  
  <form v-if="show && form" @submit="onClickOverlay">
    <button form-type="submit" class="submitButton"></button>
  </form>
  
  <view 
    class="custom-class popup" 
    :class="[position ? 'popup--' + position : '', { 'popup--show': show }]"
    :style="navHeight ? `top:${navHeight}px;` : ''"
  >
    <slot />
  </view>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'Popup',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    overlayStyle: {
      type: String,
      default: ''
    },
    overlay: {
      type: Boolean,
      default: true
    },
    closeOnClickOverlay: {
      type: Boolean,
      default: true
    },
    position: {
      type: String,
      default: 'center',
      validator: (value: string) => ['center', 'top', 'top2', 'right', 'bottom', 'left'].includes(value)
    },
    form: {
      type: Boolean,
      default: false
    }
  },

  setup(props, { emit }) {
    const store = useStore()
    const navHeight = ref(0)

    // 监听position变化
    watch(() => props.position, (newVal, oldVal) => {
      if (newVal === 'top' || newVal === 'top2') {
        navHeight.value = store.state.navHeight || 0
      } else {
        navHeight.value = 0
      }
    }, { immediate: true })

    const onClickOverlay = (e: Event) => {
      e.stopPropagation()
      emit('click-overlay')

      if (props.closeOnClickOverlay) {
        emit('close')
      }
    }

    return {
      navHeight,
      onClickOverlay
    }
  }
})
</script>

<style scoped>
.popup {
  top: 50%;
  left: 50%;
  z-index: 11;
  max-height: 100%;
  box-sizing: border-box;
  -webkit-overflow-scrolling: touch;
  -webkit-transform: translate3d(-50%, -50%, 0);
  transform: translate3d(-50%, -50%, 0);
}

.popup, .popup__overlay {
  display: none;
  position: fixed;
  -webkit-animation: fade-in 0.3s ease;
  animation: fade-in 0.3s ease;
}

.popup__overlay {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.7);
}

.popup--top {
  width: 100%;
  top: 0;
  right: auto;
  bottom: auto;
  left: 50%;
  -webkit-transform: translate3d(-50%, 0, 0);
  transform: translate3d(-50%, 0, 0);
  -webkit-animation-name: popup-top;
  animation-name: popup-top;
}

.popup--top2 {
  width: 100%;
  top: 0;
  right: auto;
  bottom: auto;
  left: 50%;
  -webkit-transform: translate3d(-50%, 0, 0);
  transform: translate3d(-50%, 0, 0);
}

.popup--right {
  top: 50%;
  right: 0;
  bottom: auto;
  left: auto;
  -webkit-transform: translate3d(0, -50%, 0);
  transform: translate3d(0, -50%, 0);
  -webkit-animation-name: popup-right;
  animation-name: popup-right;
}

.popup--bottom {
  width: 100%;
  top: auto;
  bottom: 0;
  right: auto;
  left: 50%;
  -webkit-transform: translate3d(-50%, 0, 0);
  transform: translate3d(-50%, 0, 0);
  -webkit-animation-name: popup-bottom;
  animation-name: popup-bottom;
}

.popup--left {
  top: 50%;
  right: auto;
  bottom: auto;
  left: 0;
  -webkit-transform: translate3d(0, -50%, 0);
  transform: translate3d(0, -50%, 0);
  -webkit-animation-name: popup-left;
  animation-name: popup-left;
}

.popup--show {
  display: block;
}

@-webkit-keyframes popup-top {
  from {
    -webkit-transform: translate3d(-50%, -100%, 0);
    transform: translate3d(-50%, -100%, 0);
  }
}

@keyframes popup-top {
  from {
    -webkit-transform: translate3d(-50%, -100%, 0);
    transform: translate3d(-50%, -100%,  dilat0);
  }
}

@-webkit-keyframes popup-bottom {
  from {
    -webkit-transform: translate3d(-50%, 100%, 0);
    transform: translate3d(-50%, 100%, 0);
  }
}

@keyframes popup-bottom {
  from {
    -webkit-transform: translate3d(-50%, 100%, 0);
    transform: translate3d(-50%, 100%, 0);
  }
}

@-webkit-keyframes popup-left {
  from {
    -webkit-transform: translate3d(-100%, -50%, 0);
    transform: translate3d(-100%, -50%, 0);
  }
}

@keyframes popup-left {
  from {
    -webkit-transform: translate3d(-100%, -50%, 0);
    transform: translate3d(-100%, -50%, 0);
  }
}

@-webkit-keyframes popup-right {
  from {
    -webkit-transform: translate3d(100%, -50%, 0);
    transform: translate3d(100%, -50%, 0);
  }
}

@keyframes popup-right {
  from {
    -webkit-transform: translate3d(100%, -50%, 0);
    transform: translate3d(100%, -50%, 0);
  }
}

@-webkit-keyframes fade-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

button.submitButton {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 10;
  background: transparent;
  position: absolute;
  border: 0;
}

button.submitButton::after {
  border: none;
}
</style>