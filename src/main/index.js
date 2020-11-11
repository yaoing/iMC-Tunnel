import { app, ipcMain,BrowserWindow,Tray,Menu,nativeImage} from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    frame:false,
    width: 560,
    height: 360,
    resizable: false,
    // radius: [5, 5, 5, 5],
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
      defaultFontFamily:{
        standard:'Microsoft YaHei'
      },
},
  })
  mainWindow.loadURL(winURL)
  // mainWindow.webContents.openDevTools()
  mainWindow.setMenu(null)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  if(process.platform === 'win32'){
    var trayMenuTemplate = [
      {
        label: '打开',
        click: () => {
          mainWindow.show();
        }
      },
      {
        label: '退出',
        click: () => {
          app.quit()
        }
      }
    ];

    var trayIcon = nativeImage.createFromPath('D:\\work\\iMC\\build\\icons\\icon.ico')
    trayIcon = trayIcon.resize({ width: 16, height: 16 });

    var appTray =new Tray(trayIcon)
    var contextMenu = Menu.buildFromTemplate(trayMenuTemplate);
    appTray.setToolTip('iMC Tunnel');
    appTray.setContextMenu(contextMenu);
    appTray.on('click',function(){
      mainWindow.show();
    })
    appTray.on('right-click', () => {
      appTray.popUpContextMenu(trayMenuTemplate);
    })
  }
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})


ipcMain.on('minWin',e=>mainWindow.minimize())
ipcMain.on('closeWin',
        e=>{
          mainWindow.hide();
          mainWindow.setSkipTaskbar(true);
          e.preventDefault();
        })



/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */


export default app