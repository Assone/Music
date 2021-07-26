import { shallowMount } from '@vue/test-utils';
import AppAside from '@/components/common/AppAside.vue';

describe('AppAside.vue', () => {
  it('created', () => {
    const wrapper = shallowMount(AppAside);

    expect(wrapper.classes()).toContain('app-aside');
  });

  it('render slot', () => {
    const template = '<span>default slot</span>';
    const wrapper = shallowMount(AppAside, {
      slots: {
        default: template,
      },
    });

    expect(wrapper.html()).toContain(template);
  });
});
