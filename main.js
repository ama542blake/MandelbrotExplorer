const electron = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs');
const { fstat } = require('fs');
const isMac = process.platform == 'darwin';
const SHOW_DEV = false;
const production = process.env.NODE_ENV == 'production';

const {app, BrowserWindow, Menu, ipcMain} = electron;

let win;
let maxItersInfoWin, coloringAlgsInfoWin, plottingAlgsInfoWin, rangeLimitsInfoWin;

// called on 'ready' event
function createWindow() {
    // create broswer window
    win = new BrowserWindow({
        width:800,
        height:600,
        webPreferences: {
            nodeIntegration: true
        }
        });

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

function createMaxItersInfoWin() {
    if (!maxItersInfoWin) {  // shouldn't be able to open window twice
        // create the window
        maxItersInfoWin = new BrowserWindow({
            parent: win,
            webPreferences: {
                nodeIntegration: true
            }
        });

        // retrieve the informational content to be displayed
        const info = fs.readFileSync('./info_text/maxIters.txt', 'utf8');
        
        // load the HTML for the page
        maxItersInfoWin.loadURL(url.format({
            pathname: path.join(__dirname, 'maxItersInfoWin.html'),
            protocol: "file:",
            slashes: true
        }));

        // send the info text to the newly created window
        // wrap in 'did-finish-load' to ensure that the new window has loaded and is ready to receive events
        maxItersInfoWin.webContents.on('did-finish-load', () => {
            maxItersInfoWin.webContents.send('send-max-iters-info', info);
        });

        maxItersInfoWin.on('close', () => {maxItersInfoWin = null;});
    }
}

function createColoringAlgsInfoWin() {
    if (!coloringAlgsInfoWin) { // shouldn't be able to open window twice
        // create the window
       coloringAlgsInfoWin = new BrowserWindow({
            parent: win,
            webPreferences: ({
                nodeIntegration: true
            })
        });

        // retrieve the informational content to be displayed
        // TODO: write coloringAlgsInfo.txt
        const info = fs.readFileSync('./info_text/coloringAlgsInfo.txt', 'utf8');
        
        // load the HTML for the page
        maxItersInfoWin.loadURL(url.format({
            pathname: path.join(__dirname, 'coloringAlgsInfoWin.html'),
            protocol: "file:",
            slashes: true
        }));

        // send the info text to the newly created window
        // wrap in 'did-finish-load' to ensure that the new window has loaded and is ready to receive events
        coloringAlgsInfoWin.webContents.on('did-finish-load', () => {
            coloringAlgsInfoWin.webContents.send('send-coloring-algs-info', info);
        });

        // allow window to be garbage collected when closed
        coloringAlgsInfoWin.on('close', () => {coloringAlgsInfoWin = null;});
    }
}

function createPlottingAlgsInfoWin() {
    if (!parent) { // shouldn't be able to open window twice
        // create the window
        plottingAlgsInfoWin = new BrowserWindow({
            parent: win,
            webPreferences: ({
                nodeIntegration: true
            })
        });

        // TODO: write polttingAlgsInfo.txt
        // retrieve the informational content to be displayed
        const info = fs.readFileSync('./info_text/plottingAlgsInfo.txt', 'utf8');
        
        // load the HTML for the page
        maxItersInfoWin.loadURL(url.format({
            pathname: path.join(__dirname, 'plottingAlgsInfoWin.html'),
            protocol: "file:",
            slashes: true
        }));

        // send the info text to the newly created window
        // wrap in 'did-finish-load' to ensure that the new window has loaded and is ready to receive events
        plottingAlgsInfoWin.webContents.on('did-finish-load', () => {
            plottingAlgsInfoWin.webContents.send('send-plotting-algs-info', info);
        });

        // allow window to be garbage collected when closed
        plottingAlgsInfoWin.on('close', () => {plottingAlgsInfoWin = null;});
        
    }
}


function createRangeLimitsInfoWin() {
    if (!rangeLimitsInfoWin) { // shouldn't be able to open window twice
        // create the window
        rangeLimitsInfoWin = new BrowserWindow({
            parent: win,
            webPreferences: ({
                nodeIntegration: true
            })
        });

        // TODO: write rangeLimitsInf.otxt
        // retrieve the informational content to be displayed
        const info = fs.readFileSync('./info_text/rangeLimitsInfo.txt', 'utf8');
        
        // load the HTML for the page
        maxItersInfoWin.loadURL(url.format({
            pathname: path.join(__dirname, 'rangeLimitsInfoWin.html'),
            protocol: "file:",
            slashes: true
        }));

        // send the info text to the newly created window
        // wrap in 'did-finish-load' to ensure that the new window has loaded and is ready to receive events
        rangeLimitsInfoWin.webContents.on('did-finish-load', () => {
            rangeLimitsInfoWin.webContents.send('send-range-limit-info', info);
        });

        // allow window to be garbage collected when closed
        rangeLimitsInfoWin.on('close', () => {rangeLimitInfoWin = null;});
        
    }
}



// function create<windowName>Win() {
//     if (!<windowName>) { // shouldn't be able to open window twice
//         // create the window
//        <windowName> = new BrowserWindow({
//             parent: win,
//             webPreferences: ({
//                 nodeIntegration: true
//             })
//         });

//         // retrieve the informational content to be displayed
//         const info = fs.readFileSync('./info_text/<infoName>.txt', 'utf8');
        
//         // load the HTML for the page
//         maxItersInfoWin.loadURL(url.format({
//             pathname: path.join(__dirname, '<windowName>.html'),
//             protocol: "file:",
//             slashes: true
//         }));

//         // send the info text to the newly created window
//         // wrap in 'did-finish-load' to ensure that the new window has loaded and is ready to receive events
//         <windowName>.webContents.on('did-finish-load', () => {
//             <windowName>.webContents.send('send-<infoName>-info', info);
//         });

//         // allow window to be garbage collected when closed
//         <windowName>.on('close', () => {<windowName> = null;});
        
//     }
// }

app.on('ready', createWindow);
app.on('window-all-closed', quitApplication);

ipcMain.on('open-max-iters-info', () => {
    createMaxItersInfoWin();

});

// TODO: implement emission of this event
ipcMain.on('open-coloring-algs-info', () => {
    createColoringAlgsInfoWin();
});

ipcMain.on('open-plotting-algs-info', () => {
    createPlottingAlgsInfoWin();
});

// TODO: implement emission of this event
ipcMain.on('open-coloring-algorithm-info', () => {
    createColoringAlgsInfoWin();
});

// TODO: implement emission of this event
ipcMain.on('open-range-limits-info', () => {
    createRangeLimitsInfoWin();
});


/* p5.js functions */