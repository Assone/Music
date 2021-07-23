<template>
  <label class="app-radio text-sm" :aria-checked="model === label">
    <!-- :aria-disabled="isDisabled" -->
    <span class="inline-flex align-middle cursor-pointer">
      <span
        :style="[`background: ${pointColor}`]"
        class="app-radio__inner relative inline-block h-4 w-4 rounded-3xl"
        :class="[`bg-green-500`, { 'is-checked': model === label }]"
      />
      <input v-model="model" class="hidden" type="radio" :value="label" :name="name" aria-hidden="true" />
    </span>
    <span v-if="$slots.default || showLabel" class="ml-2">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script lang="ts">
import { computed, defineComponent, inject, toRefs } from 'vue';
import { radioGroupKey } from './AppRadioGroup.vue';

export default defineComponent({
  props: {
    label: [String, Number],
    modelValue: {
      type: [String, Boolean, Number],
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
    disabled: Boolean,
    pointColor: String,
    showLabel: Boolean,
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const { modelValue } = toRefs(props);

    const radioGroup = inject(radioGroupKey);
    const isGroup = computed(() => radioGroup?.name === 'AppRadioGroup');

    const model = computed({
      get() {
        return isGroup.value ? radioGroup!.modelValue : modelValue.value;
      },
      set(val: string | number | boolean) {
        if (isGroup.value) {
          radioGroup?.changeEvent(val);
        } else {
          emit('update:modelValue', val);
        }
      },
    });

    return {
      model,
    };
  },
});
</script>

<style lang="scss">
@include b(app, radio) {
  @include e(inner) {
    &::before {
      content: '';

      position: absolute;
      top: 50%;
      left: 50%;

      width: 4px;
      height: 4px;
      border-radius: 100%;

      background-color: #fff;

      transition: transform 0.15s ease-in;
      transform: translate(-50%, -50%) scale(0);
    }

    @include when(checked) {
      &::before {
        transform: translate(-50%, -50%) scale(1);
      }
    }
  }
}
</style>
