export default function useUpdate() {
  const [, update] = useState({});

  return useCallback(() => update({}), []);
}
