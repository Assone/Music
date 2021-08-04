<template>
  <div class="mask absolute top-0 right-0 bottom-0 left-0 justify-center items-center flex opacity-0 hover:opacity-100">
    <slot @click="$emit('click-inner')">
      <MaskPlay />
    </slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import MaskPlay from './MaskPlay.vue';

export default defineComponent({
  components: {
    MaskPlay,
  },
  emits: ['click', 'click-inner'],
});
</script>
