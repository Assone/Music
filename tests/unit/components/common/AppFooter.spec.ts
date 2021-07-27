import { shallowMount } from '@vue/test-utils';
import AppFooter from '@/components/common/AppFooter.vue';
import { useTestCreated, useTestSlots } from '@test/helpers';

describe('AppFooter.vue', () => {
  it('created', () => useTestCreated(AppFooter));

  it('render slot', () => useTestSlots(AppFooter, { slots: { default: '<span>default slot</span>' } }));

  it('set props height', async () => {
    const height = '50px';
    const wrapper = shallowMount(AppFooter);

    expect(wrapper.get('footer').element.style.height).toBe('60px');

    await wrapper.setProps({ height });
    expect(wrapper.get('footer').element.style.height).toBe(height);
  });
});
