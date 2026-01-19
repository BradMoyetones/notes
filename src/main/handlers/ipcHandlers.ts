import { ipcMain, app } from 'electron';
import type { WindowController } from '../controllers/WindowController';
import type { UpdateController } from '../controllers/UpdateController';

export function registerIpcHandlers(
    windowController: WindowController,
    updateController: UpdateController,
): void {
    // Window handlers
    ipcMain.on('minimize', () => windowController.minimize());

    ipcMain.handle('maximize', () => windowController.toggleMaximize());

    ipcMain.handle('isMaximized', () => windowController.isMaximized());

    ipcMain.on('close', () => app.quit());

    // App info handlers
    ipcMain.handle('get-app-version', () => app.getVersion());

    ipcMain.handle('get-platform', () => process.platform);

    ipcMain.handle('get-release-notes', async () => {
        return await updateController.getReleaseNotes();
    });

    // Notes handlers
    ipcMain.handle('allNotes', async () => {
        return [];
    });

    ipcMain.handle('createNote', async (event, input) => {
        return null;
    });

    ipcMain.handle('updateNote', async (event, id, input) => {
        return null;
    });

    ipcMain.handle('deleteNote', async (event, cron) => {
        return false;
    });

    // Update handlers
    ipcMain.handle('restart-app', () => {
        updateController.quitAndInstall();
    });
}
