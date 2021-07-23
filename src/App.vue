<template>
  <AppLayout />
  <Player />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AppLayout from '@/layouts/AppLayout.vue';
import Player from '@/containers/Player.vue';

export default defineComponent({
  name: 'App',
  components: {
    AppLayout,
    Player,
  },
});
</script>

<style lang="scss">
#app {
  font-family: Barlow, -apple-system, BlinkMacSystemFont, Helvetica Neue, PingFang SC, Microsoft YaHei,
    Source Han Sans SC, Noto Sans CJK SC, WenQuanYi Micro Hei, sans-serif;

  height: 100%;
}

html,
body {
  height: 100%;
  min-height: 100vh;
}
</style>
