// Supports weights 100-900
import '@fontsource-variable/onest';
import './styles/globals.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from './components/theme-provider'
import { ConsoleTerminal } from './components/ConsoleTerminal'
import { Toaster } from './components/ui/sonner'
import { RouterProvider } from 'react-router'
import router from './router'
import { VersionProvider } from './contexts'



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <VersionProvider>
        <RouterProvider router={router} />
      </VersionProvider>
      <Toaster />
      <ConsoleTerminal />
    </ThemeProvider>
  </StrictMode>
)
