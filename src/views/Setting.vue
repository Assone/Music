<template>
  <div class="view-setting">
    <div>
      <AppButtonGroup>
        <AppButton v-for="item in theme" :key="item" @click="setTheme(item)">{{ item }}</AppButton>
      </AppButtonGroup>
    </div>
    <div class="flex gap-8">
      <h2>主题色</h2>
      <AppRadioGroup v-model="color" class="flex gap-x-2">
        <AppRadio v-for="item in themeColor" :key="item" :label="item" :point-color="`hsl(${item})`" />
      </AppRadioGroup>
    </div>
    <div class="flex gap-8">
      <h2>语言设置</h2>
      <select v-model="locale">
        <option v-for="language in availableLocales" :key="`locale-${language}`" :value="language">
          {{ language }}
        </option>
      </select>
    </div>

    <AppButton @click="handleClick">test</AppButton>
  </div>
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n';

import Message from '@/components/common/Message';
import { useTheme } from '@/composables/useTheme';

import AppRadio from '@/components/common/AppRadio.vue';
import AppRadioGroup from '@/components/common/AppRadioGroup.vue';
import AppButton from '@/components/common/AppButton.vue';
import AppButtonGroup from '@/components/common/AppButtonGroup.vue';
</script>

<script lang="ts" setup>
const { locale, availableLocales } = useI18n();
const { color, themeColor, theme, setTheme } = useTheme();
const handleClick = () => {
  Message('test');
};
</script>
