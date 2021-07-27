import AppSection from '@/components/common/AppSection.vue';
import { useTestCreated, useTestSlots } from '@test/helpers';

describe('AppSection.vue', () => {
  it('created', () => useTestCreated(AppSection));

  it('render slot', () => useTestSlots(AppSection, { slots: { default: '<span>default slot</span>' } }));
});
