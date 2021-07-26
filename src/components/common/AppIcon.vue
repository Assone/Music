<template>
  <svg class="app-icon" aria-hidden="true">
    <use :xlink:href="symbolId" :fill="color" />
  </svg>
</template>

<script lang="ts">
import { defineComponent, computed, toRefs } from 'vue';

export default defineComponent({
  props: {
    prefix: {
      type: String,
      default: 'icon',
    },
    type: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: '#333',
    },
  },
  setup(props) {
    const { prefix, type } = toRefs(props);

    const symbolId = computed(() => `#${prefix.value}-${type.value}`);

    return { symbolId };
  },
});
</script>

<style lang="scss" scoped>
@include b(app, icon) {
  display: inline;
  width: 32px;
  height: 32px;

  cursor: pointer;
  fill: currentColor;
}
</style>
