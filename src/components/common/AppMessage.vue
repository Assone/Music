<template>
  <transition name="app-message-fade" @before-leave="onClose" @after-leave="$emit('destroy')">
    <div
      v-show="show"
      :style="customStyle"
      class="fixed left-2/4 top-5 flex items-center transition-all -translate-x-1/2 z-[200]"
      role="alert"
      @mouseenter="clearTimer"
      @mouseleave="startTimer"
    >
      <i></i>
      <slot>
        <p v-if="!dangerouslyUseHTMLString">{{ message }}</p>
        <p v-else v-html="message" />
      </slot>
      <div v-if="showClose"></div>
    </div>
  </transition>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, PropType, ref, toRefs, VNode } from 'vue';
import { isNumber } from '@/utils';
import { useEventListener } from '@vueuse/core';

export default defineComponent({
  props: {
    message: {
      type: [String, Object] as PropType<string | VNode>,
      deault: '',
    },
    id: { type: String, default: '' },
    showClose: Boolean,
    onClose: {
      type: Function as PropType<() => void>,
      required: true,
    },
    offset: {
      type: Number,
      default: 20,
    },
    zIndex: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
      default: 2000,
    },
    dangerouslyUseHTMLString: Boolean,
  },
  emits: ['destroy'],
  setup(props) {
    const { offset, zIndex, duration } = toRefs(props);

    const show = ref(false);
    let timer: NodeJS.Timeout | null = null;

    const customStyle = computed(() => ({
      top: `${offset.value}px`,
      zIndex: zIndex.value,
    }));

    const close = () => {
      show.value = false;
    };
    const startTimer = () => {
      if (duration.value > 0) {
        timer = setTimeout(() => {
          if (show.value) {
            close();
          }
        }, duration.value);
      }
    };
    const clearTimer = () => {
      if (isNumber(timer)) {
        clearTimeout(timer);
        timer = null;
      }
    };
    const handleKeyDown = ({ code }: KeyboardEvent) => {
      if (code === 'esc') {
        if (show.value) {
          close();
        } else {
          startTimer();
        }
      }
    };

    onMounted(() => {
      startTimer();
      show.value = true;
      useEventListener(document, 'keydown', handleKeyDown);
    });

    return {
      show,
      customStyle,

      startTimer,
      clearTimer,
      close,
    };
  },
});
</script>

<style lang="scss">
@include transition(app-message-fade) {
  @include direction(enter-from, leave-to) {
    opacity: 0;
    transform: translate(-50%, -100%);
  }
}
</style>
