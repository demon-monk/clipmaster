import { app, globalShortcut, Menu } from 'electron';
// import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import { enableLiveReload } from 'electron-compile';
import * as path from 'path'
import {menubar as createMenubar} from 'menubar'

const menubar = createMenubar({
  preloadWindow: true,
  index: `file://${path.join(__dirname, 'index.html')}`
})
menubar.on('ready', () => {
  const secondaryMenu = Menu.buildFromTemplate([{
    label: 'Quit',
    click() {
      menubar.app.quit()
    },
    accelerator: 'CommandOrControl+Q'
  }])
  menubar.tray.on('right-click', () => {
    menubar.tray.popUpContextMenu(secondaryMenu)
  })
  const createClippingShortcut = globalShortcut.register('CommandOrControl+!', () => {
    menubar.window && menubar.window.webContents.send('create-new-clipping')
  }) as unknown as boolean;
  if (!createClippingShortcut) {
    console.error('Registration failed', 'createClippingShortcut')
  }
  const writeToClippingShortcut = globalShortcut.register('CommandOrControl+@', () => {
    menubar.window && menubar.window.webContents.send('write-to-clipboard')
  }) as unknown as boolean;
  if (!writeToClippingShortcut) {
    console.error('Registration failed', 'writeToClippingShortcut')
  }
})

menubar.on('after-create-window', () => {

})
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: Electron.BrowserWindow | null = null;

const isDevMode = process.execPath.match(/[\\/]electron/);

if (isDevMode) {
  enableLiveReload({strategy: 'react-hmr'});
}

// const createWindow = async () => {
//   // Create the browser window.
//   mainWindow = new BrowserWindow({
//     width: 800,
//     height: 600,
//   });

//   // and load the index.html of the app.
//   mainWindow.loadURL(`file://${path.join(__dirname, 'index.html')}`)

//   // Open the DevTools.
//   if (isDevMode) {
//     await installExtension(REACT_DEVELOPER_TOOLS);
//     mainWindow.webContents.openDevTools();
//   }

//   // Emitted when the window is closed.
//   mainWindow.on('closed', () => {
//     // Dereference the window object, usually you would store windows
//     // in an array if your app supports multi windows, this is the time
//     // when you should delete the corresponding element.
//     mainWindow = null;
//   });
// };

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// app.on('activate', () => {
//   // On OS X it's common to re-create a window in the app when the
//   // dock icon is clicked and there are no other windows open.
//   if (mainWindow === null) {
//     createWindow();
//   }
// });

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
