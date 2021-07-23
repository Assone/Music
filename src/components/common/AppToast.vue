<template>
  <div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, VNode } from 'vue';

export default defineComponent({
  props: {
    message: {
      type: [String, Object] as PropType<string | VNode>,
      deault: '',
    },
    duration: {
      type: Number,
      default: 2000,
    },
  },
});
</script>
