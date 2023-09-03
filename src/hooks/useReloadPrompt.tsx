import { toast } from 'react-hot-toast';
import { useRegisterSW } from 'virtual:pwa-register/react';

const intervalMS = 60 * 60 * 1000;

export default function useReloadPrompt() {
  const {
    needRefresh: [needRefresh],
    offlineReady: [offlineReady],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      // eslint-disable-next-line prefer-template
      if (r) {
        setInterval(() => {
          r.update().catch((error) => {
            console.error(
              '%c[Error]: updateServiceWorker',
              'color: red; ',
              error,
            );
          });
        }, intervalMS);
      }
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  const content = useCallback(
    () => (
      <div className="flex gap-2">
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
    if (offlineReady || needRefresh) {
      toast(content, {
        position: 'top-center',
      });
    }
  }, [content, needRefresh, offlineReady]);
}
