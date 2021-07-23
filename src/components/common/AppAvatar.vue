<template>
  <article :class="['app-avatar', avatarClass, $attrs.class]" :style="avatarStyle">
    <AppIcon v-if="icon" :type="icon" />
    <slot v-else>
      <AppImage v-bind="{ ...$attrs, class: {} }" />
    </slot>
  </article>
</template>

<script lang="ts">
import { computed, defineComponent, defineAsyncComponent, PropType, toRefs } from 'vue';

export default defineComponent({
  components: {
    AppImage: defineAsyncComponent(() => import('./AppImage.vue')),
    AppIcon: defineAsyncComponent(() => import('./AppIcon.vue')),
  },
  inheritAttrs: false,
  props: {
    icon: String,
    size: {
      type: [Number, String] as PropType<'large' | 'medium' | 'small' | number>,
      validator: (size: string | number) =>
        typeof size === 'string' ? ['large', 'medium', 'small'].includes(size) : typeof size === 'number',
    },
    shape: {
      type: String as PropType<'circle' | 'square'>,
      default: 'circle',
      validator: (shape: string) => ['circle', 'square'].includes(shape),
    },
  },
  setup(props) {
    const { icon, size, shape } = toRefs(props);

    const avatarClass = computed(() => {
      const list: string[] = [];

      if (typeof size?.value === 'string') list.push(`app-avatar--${size.value}`);
      if (icon?.value) list.push(`app-avatar--icon`);
      if (shape?.value) list.push(`app-avatar--${shape.value}`);

      return list;
    });
    const avatarStyle = computed(() =>
      typeof size?.value === 'number'
        ? {
            width: `${size.value}px`,
            height: `${size.value}px`,
            lineHeight: `${size.value}px`,
          }
        : {}
    );

    return {
      avatarClass,
      avatarStyle,
    };
  },
});
</script>

<style lang="scss">
@include b(app, avatar) {
  display: inline-block;

  width: 40px;
  height: 40px;

  line-height: 40px;
  text-align: center;

  overflow: hidden;

  @include m(circle) {
    border-radius: 50%;
  }

  @include m(square) {
    border-radius: 4px;
  }

  @include m(icon) {
    font-size: 18px;
  }

  @include m(large) {
    width: 40px;
    height: 40px;
    line-height: 40px;
  }

  @include m(medium) {
    width: 36px;
    height: 36px;
    line-height: 36px;
  }

  @include m(small) {
    width: 28px;
    height: 28px;
    line-height: 28px;
  }
}
</style>
