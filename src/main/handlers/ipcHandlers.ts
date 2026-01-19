import { ipcMain, app } from 'electron';
import type { WindowController } from '../controllers/WindowController';
import type { UpdateController } from '../controllers/UpdateController';
import { CreateNote, DeleteNote, GetNotes, ReadNote, WriteNote } from '@app/shared/types';
import { createNote, deleteNote, getNotes, readNote, writeNote } from '../lib';

export function registerIpcHandlers(windowController: WindowController, updateController: UpdateController): void {
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
    ipcMain.handle('getNotes', (_, ...args: Parameters<GetNotes>) => getNotes(...args));
    ipcMain.handle('readNote', (_, ...args: Parameters<ReadNote>) => readNote(...args));
    ipcMain.handle('writeNote', (_, ...args: Parameters<WriteNote>) => writeNote(...args));
    ipcMain.handle('createNote', (_, ...args: Parameters<CreateNote>) => createNote(...args));
    ipcMain.handle('deleteNote', (_, ...args: Parameters<DeleteNote>) => deleteNote(...args));

    // Update handlers
    ipcMain.handle('restart-app', () => {
        updateController.quitAndInstall();
    });
}
