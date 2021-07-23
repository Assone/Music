<template>
  <picture class="app-image h-full">
    <template v-if="source">
      <source v-for="item in source" :key="item.src" v-bind="item" />
    </template>
    <slot v-if="loading" name="loading">
      <div class="app-image__loading"></div>
    </slot>
    <slot v-else-if="error" name="error">
      <div class="app-image__error">Error</div>
    </slot>
    <img v-else :style="style" class="app-image__inner" :src="src" :loading="lazy ? 'lazy' : 'eager'" v-bind="$attrs" />
  </picture>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  getCurrentInstance,
  onMounted,
  PropType,
  ref,
  toRefs,
  watch,
  HTMLAttributes,
} from 'vue';

type SizeType = { width: number; height: number };

// eslint-disable-next-line no-shadow
const enum Fit {
  NONE = 'none',
  CONTAIN = 'contain',
  COVER = 'cover',
  FILL = 'fill',
  SCALE_DOWN = 'scale-down',
}

const isSupperObjectFit = () => document.documentElement.style.objectFit !== undefined;
const useElementSize = (element: Element): SizeType => ({
  width: element.clientWidth,
  height: element.clientHeight,
});

export default defineComponent({
  inheritAttrs: false,
  props: {
    loading: Boolean,
    error: Boolean,
    lazy: {
      type: Boolean,
      default: false,
    },
    src: {
      type: String,
      require: true,
    },
    source: Array as PropType<{ src: string; srcset: string; type: string; media: string }[]>,
    fit: String as PropType<'none' | 'contain' | 'cover' | 'fill' | 'scale-down'>,
  },
  emits: ['error'],
  setup(props, ctx) {
    const { lazy, src, fit } = toRefs(props);
    const instance = getCurrentInstance();

    const loading = ref(true);
    const error = ref(false);
    const show = ref(!lazy);
    const width = ref(0);
    const height = ref(0);

    const getImageStyle = (options: 'none' | 'contain' | 'cover' | 'fill' | 'scale-down') => {
      const { width: containerWidth, height: containerHeight } = useElementSize(instance?.proxy?.$el);
      let type = options;

      if (!containerWidth || !containerHeight || !width.value || !height.value) return {};

      const vertical = width.value / height.value < 1;
      if (type === Fit.SCALE_DOWN) {
        const isSmaller = width.value < containerWidth && height.value < containerHeight;
        type = isSmaller ? Fit.NONE : Fit.CONTAIN;
      }

      switch (type) {
        case Fit.NONE:
          return { width: 'auto', height: 'auto' };
        case Fit.CONTAIN:
          return vertical ? { width: 'auto' } : { height: 'auto' };
        case Fit.COVER:
          return vertical ? { height: 'auto' } : { width: 'auto' };
        default:
          return {};
      }
    };

    const style = computed(() => {
      if (fit.value) {
        return (
          isSupperObjectFit() ? { 'object-fit': fit.value } : getImageStyle(fit.value)
        ) as HTMLAttributes['style'];
      }

      return {};
    });

    const handleLoad = (img: HTMLImageElement) => {
      loading.value = false;
      error.value = false;
      width.value = img.width;
      height.value = img.height;
    };
    const handleError = () => {
      loading.value = false;
      error.value = true;
      ctx.emit('error');
    };
    const loadImage = () => {
      loading.value = true;
      error.value = false;

      const image = new Image();
      image.addEventListener('load', () => handleLoad(image));
      image.addEventListener('error', handleError);

      Object.entries(ctx.attrs).forEach(([key, value]) => image.setAttribute(key, value as string));
      image.src = src?.value as string;
    };

    watch(
      () => src,
      (url) => {
        if (url?.value) loadImage();
      }
    );

    onMounted(() => {
      if (lazy.value) {
        const io = new IntersectionObserver(
          (entries) =>
            entries.forEach((entry) => {
              if (entry.intersectionRatio > 0.5) {
                loadImage();
                show.value = true;
                io.unobserve(instance?.proxy?.$el);
                io.disconnect();
              }
            }),
          { threshold: [1] }
        );

        io.observe(instance?.proxy?.$el);
      } else {
        loadImage();
      }
    });

    return {
      style,
    };
  },
});
</script>

<style lang="scss">
%size {
  width: 100%;
  height: 100%;
}

@include b(app, image) {
  position: relative;
  display: flex;
  justify-items: center;
  align-items: center;
  overflow: hidden;

  @include e(loading) {
    background: #f5f7fa;

    @extend %size;
  }

  @include e(inner) {
    @extend %size;
  }
}
</style>
