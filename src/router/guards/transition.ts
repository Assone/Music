import { NavigationHookAfter } from 'vue-router';

const transition: NavigationHookAfter = (to, from) => {
  const toDepth = to.path.split('/').length;
  const fromDepth = from.path.split('/').length;
  to.meta.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left';
};

export default transition;
