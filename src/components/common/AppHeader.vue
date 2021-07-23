<template>
  <header class="app-header" :style="{ height }">
    <slot />
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    height: {
      type: String,
      default: '60px',
    },
  },
});
</script>
