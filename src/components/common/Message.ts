/* eslint-disable no-param-reassign */
import { VNode, createVNode, render, ComponentPublicInstance, isVNode } from 'vue';

import { isString } from '@/utils';

import MessageConstructor from './AppMessage.vue';

interface MessageProps {
  message?: string | VNode;
  offset?: number;
  zIndex?: number;
  duration?: number;
  showClose?: boolean;
  dangerouslyUseHTMLString?: boolean;
  onClose?: () => void;
}

type MessageVM = VNode;
type MessageQueueItem = {
  vm: MessageVM;
};
type MessageQueue = MessageQueueItem[];

const instances: MessageQueue = [];
let seed = 1;

export const close = (id: string, userOnClose?: (vm: MessageVM) => void): void => {
  const idx = instances.findIndex(({ vm }) => {
    return id === vm.component?.props.id;
  });

  if (idx === -1) return;

  const { vm } = instances[idx];

  if (!vm) return;
  userOnClose?.(vm);

  const removeHeight = vm.el?.offsetHeight;
  instances.splice(idx, 1);

  const { length } = instances;

  if (length < 1) return;
  for (let i = idx; i < length; i++) {
    const pos = parseInt(instances[i].vm.el?.style.top, 10) - removeHeight - 16;

    instances[i].vm.component!.props.offset = pos;
  }
};

const Message = (options: (MessageProps & Record<string, unknown>) | string) => {
  if (isString(options)) {
    options = {
      message: options,
    };
  }
  const id = `message_${(seed += 1)}`;
  const container = document.createElement('div');

  let verticalOffset = options.offset || 20;
  instances.forEach(({ vm }) => {
    verticalOffset += (vm.el?.offsetHeight || 0) + 16;
  });
  verticalOffset += 16;

  const userOnClose = options.onClose;

  options = {
    ...options,
    offset: verticalOffset,
    id,
    onClose: () => {
      close(id, userOnClose);
    },
  };

  const { message } = options;
  const vm = createVNode(MessageConstructor, options, isVNode(message) ? { default: () => message } : null);

  // vm.props!.onDestroy = () => {
  //   render(null, container);
  // };

  render(vm, container);
  instances.push({ vm });
  if (container.firstChild) document.body.appendChild(container.firstChild);

  return {
    close: () => {
      (vm.component?.proxy as ComponentPublicInstance<{ show: boolean }>).show = false;
    },
  };
};

export default Message;
