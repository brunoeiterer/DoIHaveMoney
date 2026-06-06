import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import { MantineProvider } from '@mantine/core'
import { theme } from './theme.ts'
import { Landing } from './components/Landing/Landing.tsx'
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { LanguageProvider } from './context/LanguageContext/LanguageContext.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider } from './context/AuthContext/AuthContext.tsx'
import { Notifications } from '@mantine/notifications'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider theme={theme}>
      <Notifications />
        <LanguageProvider>
          <AuthProvider>
            <GoogleOAuthProvider clientId={'1044533121358-2rs5bvb5cinl5s4lj4srncvon1tavvk3.apps.googleusercontent.com'}>
              <BrowserRouter>
                <Routes>
                  <Route index element={<Landing />} />
                </Routes>
              </BrowserRouter>
            </GoogleOAuthProvider>
          </AuthProvider>
        </LanguageProvider>
    </MantineProvider>
  </StrictMode>,
)