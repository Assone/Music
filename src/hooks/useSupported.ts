export default function useSupported(predicate: () => boolean) {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported(predicate());
  }, [predicate]);

  return isSupported;
}
