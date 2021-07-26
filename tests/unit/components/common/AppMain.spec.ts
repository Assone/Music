import { shallowMount } from '@vue/test-utils';
import AppMain from '@/components/common/AppMain.vue';

describe('AppMain.vue', () => {
  it('created', () => {
    const wrapper = shallowMount(AppMain);

    expect(wrapper.classes()).toContain('app-main');
  });

  it('render slot', () => {
    const template = '<span>default slots</span>';
    const wrapper = shallowMount(AppMain, { slots: { default: template } });

    expect(wrapper.html()).toContain(template);
  });
});
