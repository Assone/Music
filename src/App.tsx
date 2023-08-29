import { ThemeProvider } from '@emotion/react';
import { Outlet } from '@tanstack/react-router';
import { AnimatePresence, LazyMotion, domMax, m } from 'framer-motion';

declare module '@emotion/react' {
  export interface Theme {
    color: {
      primary: string;
      // positive: string;
      // negative: string;
    };
  }
}

const App = () => (
  <LazyMotion features={domMax}>
    <ThemeProvider theme={{ color: { primary: 'red' } }}>
      <m.main className="min-h-screen">
        <AnimatePresence>
          <Outlet />
        </AnimatePresence>
      </m.main>
    </ThemeProvider>
  </LazyMotion>
);

export default App;
