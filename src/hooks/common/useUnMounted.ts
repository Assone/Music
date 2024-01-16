export default function useUnMounted(callback: VoidFunction) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => callback, []);
}
