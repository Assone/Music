import { shallowMount } from '@vue/test-utils';
import AppAside from '@/components/common/AppAside.vue';
import { useTestCreated, useTestSlots } from '@test/helpers';

describe('AppAside.vue', () => {
  it('created', () => useTestCreated(AppAside));

  it('render slot', () => useTestSlots(AppAside, { slots: { default: '<span>default slot</span>' } }));

  it('set props width', async () => {
    const width = '50px';
    const wrapper = shallowMount(AppAside);

    expect(wrapper.get('aside').element.style.width).toBe('300px');

    await wrapper.setProps({ width });
    expect(wrapper.get('aside').element.style.width).toBe(width);
  });
});
