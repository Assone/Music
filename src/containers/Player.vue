<template>
  <div class="player sticky bottom-0 h-16 w-full bg-gray-100">
    <!-- <PlayerVideoCore v-if="isVideo" :track="currentTrack" /> -->
    <MediaControls />
  </div>
</template>

<script lang="ts">
import { computed } from 'vue';

import MediaControls from '@/components/MediaControls.vue';

import { useStore } from '@/store';

const store = useStore();
</script>

<script lang="ts" setup>
const currentTrack = computed(() => store.getters['media/currentTrack']);
const isVideo = computed(() => currentTrack.value?.type === 'video' || currentTrack.value?.type === 'mv');
</script>
