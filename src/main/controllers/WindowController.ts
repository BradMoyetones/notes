import { BrowserWindow, Menu, shell } from 'electron';
import { join } from 'path';
import { is } from '@electron-toolkit/utils';
import icon from '../../../resources/logos/logo-1.png?asset';

export class WindowController {
    private mainWindow: BrowserWindow | null = null;
    private webContents: Electron.WebContents | null = null;
    private helpWindow: BrowserWindow | null = null;

    createWindow(): BrowserWindow {
        this.mainWindow = new BrowserWindow({
            width: 900,
            height: 670,
            minWidth: 800,
            minHeight: 600,
            show: false,
            center: true,
            title: 'Notes',
            frame: true,
            autoHideMenuBar: true,
            vibrancy: 'under-window',
            visualEffectState: 'active',
            titleBarStyle: 'hidden',
            trafficLightPosition: { x: 15, y: 10 },
            ...(process.platform === 'linux' ? { icon } : {}),
            webPreferences: {
                preload: join(__dirname, '../preload/index.js'),
                sandbox: false,
                contextIsolation: true,
                nodeIntegration: false,
                devTools: true,
            },
        });

        this.webContents = this.mainWindow.webContents;

        const template = [
            {
                role: 'fileMenu',
                submenu: [
                    {
                        label: 'Create New',
                        click: () => {
                            this.webContents?.send('open-modal');
                        },
                        accelerator: 'CmdOrCtrl+O',
                    },
                    {
                        label: 'Search Items',
                        click: () => {
                            this.webContents?.send('focus-search');
                        },
                        accelerator: 'CmdOrCtrl+S',
                    },
                ],
            },
            {
                role: 'editMenu',
            },
            {
                role: 'windowMenu',
            },
            {
                label: 'Help',
                submenu: [
                    {
                        label: 'Learn more',
                        click: () => {
                                this.createHelpWindow();
                        },
                    },
                ],
            },
        ] as (Electron.MenuItemConstructorOptions | Electron.MenuItem)[];

        if (process.platform === 'darwin') {
            template.unshift({
                role: 'appMenu',
            });
        }
        const menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);

        this.setupWindowEvents();
        this.loadContent();
        this.hookLogs();

        return this.mainWindow;
    }

    createHelpWindow = () => {
        this.helpWindow = new BrowserWindow({
            maxWidth: 2000,
            maxHeight: 2000,
            width: 1200,
            height: 800,
            webPreferences: {
                contextIsolation: true,
                nodeIntegration: false,
            },
        });

        this.helpWindow.loadURL('https://github.com/BradMoyetones/notes');
    };

    private setupWindowEvents(): void {
        if (!this.mainWindow) return;

        this.mainWindow.on('ready-to-show', () => {
            this.mainWindow?.show();
        });

        this.mainWindow.webContents.setWindowOpenHandler((details) => {
            shell.openExternal(details.url);
            return { action: 'deny' };
        });

        this.mainWindow.on('maximize', () => {
            this.mainWindow?.webContents.send('maximize-changed', true);
        });

        this.mainWindow.on('unmaximize', () => {
            this.mainWindow?.webContents.send('maximize-changed', false);
        });
    }

    // private loadContent(): void {
    //     if (!this.mainWindow) return;

    //     if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    //         this.mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
    //     } else {
    //         this.mainWindow.loadFile(join(process.resourcesPath, 'app.asar.unpacked', 'out', 'renderer', 'index.html'));
    //     }
    // }

    private loadContent(): void {
        if (!this.mainWindow) return;

        if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
            this.mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
        } else {
            // SOLUCIÓN: Usar join(__dirname, ...)
            // En producción, __dirname apunta a la carpeta 'out/main' dentro del ASAR
            // Por lo tanto, subimos un nivel y entramos a 'renderer'
            this.mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
        }
    }

    getWindow(): BrowserWindow | null {
        return this.mainWindow;
    }

    minimize(): void {
        this.mainWindow?.minimize();
    }

    toggleMaximize(): boolean {
        if (!this.mainWindow) return false;

        if (this.mainWindow.isMaximized()) {
            this.mainWindow.unmaximize();
            return false;
        } else {
            this.mainWindow.maximize();
            return true;
        }
    }

    isMaximized(): boolean {
        return this.mainWindow?.isMaximized() ?? false;
    }

    close(): void {
        this.mainWindow?.close();
    }

    // Función auxiliar para convertir cualquier cosa a texto legible
    private formatArgs = (args: any) => {
        return args
            .map((arg) => {
                if (typeof arg === 'object' && arg !== null) {
                    // Si es un Error nativo, queremos ver el mensaje o el stack
                    if (arg instanceof Error) return arg.stack || arg.message;
                    // Si es un objeto, lo pasamos a JSON con indentación (2 espacios)
                    try {
                        return JSON.stringify(arg, null, 2);
                    } catch (e) {
                        return '[Circular Object]';
                    }
                }
                return arg;
            })
            .join(' ');
    };

    private hookLogs() {
        if (!this.mainWindow) return;

        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;

        console.log = (...args) => {
            originalLog(...args);
            if (!this.mainWindow?.webContents.isDestroyed()) {
                this.mainWindow?.webContents.send('app-log', {
                    type: 'info',
                    message: this.formatArgs(args),
                    time: new Date().toLocaleTimeString(),
                });
            }
        };

        console.error = (...args) => {
            originalError(...args);
            if (!this.mainWindow?.webContents.isDestroyed()) {
                this.mainWindow?.webContents.send('app-log', {
                    type: 'error',
                    message: this.formatArgs(args),
                    time: new Date().toLocaleTimeString(),
                });
            }
        };

        // Haz lo mismo con console.warn si quieres
        console.warn = (...args) => {
            originalWarn(...args);
            if (!this.mainWindow?.webContents.isDestroyed()) {
                this.mainWindow?.webContents.send('app-log', {
                    type: 'warn',
                    message: this.formatArgs(args),
                    time: new Date().toLocaleTimeString(),
                });
            }
        };
    }
}
