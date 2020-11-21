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
    height: 330,
    resizable: false,
    title:'iMC Tunnel',
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

  if(process.platform === 'win32'){
    var trayMenuTemplate = [
      {
        label: '打开面板',
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

    var trayIcon = nativeImage.createFromPath(`${__dirname}/static/icons/icon.png`)
    trayIcon = trayIcon.resize({ width: 256, height: 256 });

    var appTray =new Tray(trayIcon)
    var contextMenu = Menu.buildFromTemplate(trayMenuTemplate);
    appTray.setToolTip('iMC Tunnel');
    appTray.setContextMenu(contextMenu);
    appTray.on('click',function(){
      mainWindow.setSkipTaskbar(false);
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


export default app