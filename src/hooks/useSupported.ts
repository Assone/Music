export default function useSupported(predicate: () => boolean) {
  const [isSupported, setIsSupported] = useState(false);

  useMount(() => {
    setIsSupported(predicate());
  });

  return isSupported;
}
