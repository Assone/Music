import { toast } from 'react-hot-toast';
import { useRegisterSW } from 'virtual:pwa-register/react';

const ReloadPrompt: React.FC = () => {
  const {
    needRefresh: [needRefresh],
    offlineReady: [offlineReady],
    updateServiceWorker,
  } = useRegisterSW();

  const content = useCallback(
    () => (
      <div>
        <div>
          {offlineReady ? (
            <span>App ready to work offline</span>
          ) : (
            <span>
              New content available, click on reload button to update.
            </span>
          )}
        </div>
        {needRefresh && (
          <button
            type="button"
            onClick={() => {
              updateServiceWorker(true).catch((error) => {
                console.error(
                  '%c[Error]: updateServiceWorker',
                  'color: red; ',
                  error,
                );
              });
            }}
          >
            Reload
          </button>
        )}
      </div>
    ),
    [needRefresh, offlineReady, updateServiceWorker],
  );

  useEffect(() => {
    if (offlineReady || needRefresh || true) {
      toast(content);
    }
  }, [content, needRefresh, offlineReady]);
};

export default ReloadPrompt;
