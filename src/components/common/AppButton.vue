<template>
  <button
    class="inline-flex px-2 py-1 hover:bg-gray-300"
    :class="['app-button', type ? `app-button__type--${type}` : '', classList]"
    :autofocus="autofocus"
    :disabled="disabled"
    :type="nativeType"
  >
    <AppIcon v-if="icon" :type="icon" class="mr-1" />
    <slot />
  </button>
</template>

<script lang="ts">
import { computed, defineAsyncComponent, defineComponent, PropType, toRefs } from 'vue';

export default defineComponent({
  components: {
    AppIcon: defineAsyncComponent(() => import('./AppIcon.vue')),
  },
  props: {
    round: Boolean,
    circle: Boolean,
    disabled: Boolean,
    loading: Boolean,
    autofocus: Boolean,
    type: {
      type: String,
      default: 'default',
    },
    nativeType: {
      type: String as PropType<'button' | 'submit' | 'reset'>,
      validator: (type: string) => ['button', 'submit', 'reset'].includes(type),
    },
    icon: String,
  },
  setup(props) {
    const { round, circle, disabled, loading } = toRefs(props);

    const classList = computed(() => [
      {
        'is-round': round.value,
        'is-circle': circle.value,
        'is-disabled': disabled.value,
        'is-loading': loading.value,
      },
    ]);

    return {
      classList,
    };
  },
});
</script>

<!-- <style lang="scss" scoped>
@include b(app, button) {
  display: inline-flex;
  cursor: pointer;
  align-items: center;

  padding: 5px 10px;
  border: 1px solid #dcdfe6;
  border-radius: 5px;

  font-size: 1rem;
  text-align: center;

  background: #fff;

  transition: 0.1s;

  & + & {
    margin-left: 1vw;
  }

  @include when(disabled) {
    cursor: not-allowed;
  }

  @include when(circle) {
    padding: 12px;
    border-radius: 100%;
  }

  @include when(round) {
    border-radius: 20px;
  }

  @include e(type) {
    @include m(text) {
      border-color: transparent;
      color: #409eff;
      background: transparent;
      padding-left: 0;
      padding-right: 0;

      &:hover,
      &:focus {
        color: mix(
          $--color-white,
          $--color-primary,
          $--button-hover-tint-percent
        );
        border-color: transparent;
        background-color: transparent;
      }
    }
  }
}
</style> -->
