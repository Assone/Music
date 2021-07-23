<template>
  <div class="app-radio-group">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent, InjectionKey, nextTick, provide, reactive, toRefs } from 'vue';

export interface RadioGroupContext {
  name: 'AppRadioGroup';
  modelValue: boolean | string | number;
  disabled: boolean;
  changeEvent: (val: boolean | string | number) => void;
}
export const radioGroupKey: InjectionKey<RadioGroupContext> = 'radioGroup' as any;

export default defineComponent({
  props: {
    modelValue: {
      type: [String, Number, Boolean],
      default: '',
    },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const changeEvent = (value: boolean | string | number) => {
      emit('update:modelValue', value);
      nextTick(() => {
        emit('change', value);
      });
    };

    provide(
      radioGroupKey,
      reactive({
        name: 'AppRadioGroup',
        ...toRefs(props),
        changeEvent,
      })
    );
  },
});
</script>
