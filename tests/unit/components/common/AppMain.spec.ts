import AppMain from '@/components/common/AppMain.vue';
import { useTestCreated, useTestSlots } from '@test/helpers';

describe('AppMain.vue', () => {
  it('created', () => useTestCreated(AppMain));

  it('render slot', () => useTestSlots(AppMain, { slots: { default: '<span>default slot</span>' } }));
});
