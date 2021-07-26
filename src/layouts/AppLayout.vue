<template>
  <suspense>
    <component
      :is="layout"
      :style="themeColorStyle"
      :class="$style.layout"
      class="transition duration-700 dark:bg-gray-900 dark:text-white"
    >
      <template #head>
        <NavBarTitle v-bind="{ title, logo }" />
        <NavBarLinks :links="links" />
      </template>
      <router-view v-slot="{ Component, route }">
        <transition :name="route.meta.transition || 'fade'" mode="out-in">
          <!-- <keep-alive> -->
          <component :is="Component" :key="route.meta.usePathKey ? route.path : undefined" />
          <!-- </keep-alive> -->
        </transition>
      </router-view>
    </component>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </suspense>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent } from 'vue';

import NavBarTitle from '@/components/NavBarTitle.vue';
import NavBarLinks from '@/components/NavBarLinks.vue';

// import { useRoute } from 'vue-router';
import useStoreState from '@/composables/useStoreState';
import { useThemeColorHSL } from '@/composables/useTheme';

export default defineComponent({
  components: {
    Default: defineAsyncComponent(() => import('./Default.vue')),
  },
});
</script>

<script lang="ts" setup>
// const route = useRoute();
const { logo, layout, title, links } = useStoreState();
const { themeColorStyle } = useThemeColorHSL();

// const keepAlive = computed(() => route.meta.keepAlive);
</script>

<style lang="scss">
@include transition(fade) {
  @include direction(enter-active, leave-active) {
    transition: opacity 0.5s ease;
  }

  @include direction(enter-from, leave-to) {
    opacity: 0;
  }
}
</style>

<style module>
.layout {
  --theme-color: hsl(var(--theme-color-raw));
  min-height: 100vh;
}
</style>
