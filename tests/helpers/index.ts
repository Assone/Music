import { DefineComponent } from 'vue';
import { shallowMount, MountingOptions } from '@vue/test-utils';

type MountOptions = MountingOptions<Record<string, unknown>>;
type Component = DefineComponent<unknown, unknown, unknown>;

export const useTestCreated = (component: Component, options?: MountOptions): void => {
  const wrapper = shallowMount(component, options);

  expect(wrapper.exists()).toBeTruthy();
};

export const useTestSlots = (component: Component, options: MountOptions): void => {
  const wrapper = shallowMount(component, options);

  Object.values(options.slots || {}).forEach((template) => {
    expect(wrapper.html()).toContain(template);
  });
};
