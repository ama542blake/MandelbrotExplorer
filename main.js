const electron = require('electron');
const url = require('url');
const path = require('path');
const isMac = process.platform == 'darwin';
const SHOW_DEV = false;
const production = process.env.NODE_ENV == 'production';

const {app, BrowserWindow, Menu, ipcMain} = electron;

let win;

// called on 'ready' event
function createWindow() {
    // create broswer window
    win = new BrowserWindow({width:800, height:600});

    // loads main.html
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'main.html'),
        protocol: 'file:',
        slahes: true}
    ));

    // build menu bar
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);

    // allow window to be garbage collected
    win.on('closed', () => {win = null;});
}

// main menu template
const mainMenuTemplate = [
    // { role: 'appMenu' }
    ...(isMac ? [{
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    }] : []),
    // { role: 'fileMenu' }
    {
        label: 'File',
        submenu: [
          isMac ? { role: 'close' } : { role: 'quit' },
          {
              role: 'quit'
          },
        ]
    },
]

// add dev tools to the menu bar when in dev mode
if (!production) {
    mainMenuTemplate.push(
        {
            label: "Developer",
            submenu: [
                {
                    label: "Toggle Dev Console",
                    accelerator: "CommandOrControl+D",
                    click(item, focusedWindow) {
                        focusedWindow.toggleDevTools();
                    }
                },
                {
                    role: 'reload'  // reset the page
                }
            ]
        }
    );
}

// called on 'windows-all-closed' event
function quitApplication() {
    if (process.platform !== 'darwin') {
        app.quit();
    }
}

app.on('ready', createWindow);
app.on('window-all-closed', quitApplication);

/* p5.js functions */