import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import { MantineProvider } from '@mantine/core'
import { theme } from './theme.ts'
import { Landing } from './components/Landing.tsx'
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { LanguageProvider } from './context/LanguageContext/LanguageContext.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider } from './context/AuthContext/AuthContext.tsx'
import { Notifications } from '@mantine/notifications'
import { TopBar } from './components/TopBar.tsx'
import { Authorization } from './components/Authorization.tsx'
import { Budgets } from './components/Budgets.tsx'
import { ProtectedRoute } from './components/ProtectedRoute.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <MantineProvider theme={theme}>
            <Notifications />
            <LanguageProvider>
                <AuthProvider>
                    <TopBar />
                    <GoogleOAuthProvider clientId={'1044533121358-2rs5bvb5cinl5s4lj4srncvon1tavvk3.apps.googleusercontent.com'}>
                        <BrowserRouter>
                            <Routes>
                                <Route index element={<Landing />} />
                                <Route element={<ProtectedRoute redirectIfFullyAuthorized />}>
                                    <Route path='authorization' element={<Authorization />} />
                                </Route>
                                <Route element={<ProtectedRoute requireDrive />}>
                                    <Route path='budgets' element={<Budgets />} />
                                </Route>
                            </Routes>
                        </BrowserRouter>
                    </GoogleOAuthProvider>
                </AuthProvider>
            </LanguageProvider>
        </MantineProvider>
    </StrictMode>,
)