import { useLocalStorage } from '@vueuse/core';
import { NavigationGuard } from 'vue-router';

const token = useLocalStorage<string | undefined>('token', undefined);
const profile = useLocalStorage<IrUserProfile | undefined>('profile', undefined);
const account = useLocalStorage('account', undefined);

const auth: NavigationGuard = (to) => {
  const { name } = to;

  if (name === 'Login' && token.value && profile.value && account.value) {
    return { name: 'Home' };
  }

  return true;
};

export default auth;
