<template>
  <aside class="app-aside" :style="{ width }">
    <slot />
  </aside>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    width: {
      type: String,
      default: '300px',
    },
  },
});
</script>
