import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { ProgressInfo, UpdateDownloadedEvent, UpdateInfo } from 'electron-updater';

// Custom APIs for renderer
const api = {
  // ---------------------------------------------------
  // Window controls
  // ---------------------------------------------------
  minimize: () => ipcRenderer.send("minimize"),
  maximize: () => ipcRenderer.invoke("maximize"),
  isMaximized: () => ipcRenderer.invoke("isMaximized"),
  close: () => ipcRenderer.send("close"),
  onMaximizeChanged: (callback: (isMax: boolean) => void) => {
    ipcRenderer.on("maximize-changed", (_, value) => callback(value));
  },

  onLog: (callback: (log: { type: 'info' | 'error'; message: string; time: string }) => void) => {
    ipcRenderer.on('app-log', (_, log) => callback(log));
  },
  // ---------------------------------------------------
  // App info
  // ---------------------------------------------------
  getAppVersion: () => ipcRenderer.invoke("get-app-version"),
  getPlatform: () => ipcRenderer.invoke("get-platform"),
  getReleaseNotes: (): Promise<string> => ipcRenderer.invoke("get-release-notes"),

  // ---------------------------------------------------
  // NOTES Management
  // ---------------------------------------------------

  getAllNotes: (): Promise<any[]> => ipcRenderer.invoke('getAllNotes'),
  createNote: (input: any): Promise<any> => ipcRenderer.invoke('createNote', input),
  updateNote: (id: string, input: any): Promise<any | null> => ipcRenderer.invoke('updateNote', id, input),
  deleteNote: (note: any): Promise<{ success: boolean }> => ipcRenderer.invoke('deleteNote', note),

  // Eventos
  onNoteUpdated: (callback: (note: any) => void) => {
    ipcRenderer.on('cron-updated', (_e, cron) => callback(cron));
  },
  onNoteDeleted: (callback: (cronId: string) => void) => {
    ipcRenderer.on("cron-deleted", (_, cronId) => callback(cronId))
  },

  exportNotes: (ids: string[]): Promise<{ 
    success: boolean; 
    message?: string | undefined 
  }> => ipcRenderer.invoke("exportNotes", ids),
  importNotes: (): Promise<{
    success: boolean;
    imported: any[];
    message?: string;
  }> => ipcRenderer.invoke("importNotes"),


  // ---------------------------------------------------
  // Updater
  // ---------------------------------------------------
  // Evento: Actualización disponible
  onUpdateAvailable: (callback: (info: UpdateInfo) => void) => 
    ipcRenderer.on('update-available', (_event, value) => callback(value)),

  // Evento: Progreso de descarga
  onDownloadProgress: (callback: (progress: ProgressInfo) => void) => 
    ipcRenderer.on('download-progress', (_event, value) => callback(value)),

  // Evento: Descarga lista
  onUpdateDownloaded: (callback: (info: UpdateDownloadedEvent) => void) => 
    ipcRenderer.on('update-downloaded', (_event, value) => callback(value)),

  // Evento: Error
  onUpdateError: (callback: (err: Error) => void) => 
    ipcRenderer.on('update-error', (_event, value) => callback(value)),

  // Acción: Reiniciar app
  restartApp: () => ipcRenderer.invoke('restart-app'),
  
  // Limpiar listeners (importante en React useEffect)
  removeAllUpdateListeners: () => {
    ipcRenderer.removeAllListeners('update-available')
    ipcRenderer.removeAllListeners('download-progress')
    ipcRenderer.removeAllListeners('update-downloaded')
  }
}

export type Api = typeof api

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
  // @ts-ignore (define in dts)
  window.whatsappApi = whatsappApi
}
