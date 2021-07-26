<template>
  <div class="media-controls">
    <AppIcon type="media-prev" @click="$emit('prev')" />
    <AppIcon :type="`media-${playing ? 'pause' : 'play'}`" @click="$emit(`${playing ? 'pause' : 'play'}`)" />
    <AppIcon type="media-next" @click="$emit('next')" />
  </div>
</template>

<script lang="ts" setup>
import { defineEmits } from 'vue';
import AppIcon from './common/AppIcon.vue';

defineEmits(['play', 'pause', 'next', 'prev']);
defineProps({
  playing: Boolean,
});
</script>
