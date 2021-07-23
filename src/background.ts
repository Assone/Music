/* eslint-disable import/no-extraneous-dependencies */
import { cwd } from 'process';
import { resolve } from 'path';
import { app, BrowserWindow } from 'electron';
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer';

const isDev = !app.isPackaged;
const devServe = 'http://localhost:1212';

const loadPage = (view: BrowserWindow) => {
  view.loadURL(devServe).catch(() => {
    console.log('Wait dev server, will try again in 1000ms');
    setTimeout(() => {
      loadPage(view);
    }, 1000);
  });

  installExtension(VUEJS3_DEVTOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log('An error occurred: ', err));
};

const createWindow = (view: BrowserWindow) => {
  view.loadFile(resolve(cwd(), 'dist/index.html'));
};

app.whenReady().then(() => {
  const view = new BrowserWindow();

  if (isDev) {
    try {
      // eslint-disable-next-line global-require
      require('electron-reloader');
    } finally {
      loadPage(view);
    }
  } else {
    createWindow(view);
  }
});
