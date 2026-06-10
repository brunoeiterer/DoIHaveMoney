import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme.ts";
import { Landing } from "./components/Landing.tsx";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";
import { LanguageProvider } from "./context/LanguageContext/LanguageContext.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthContext/AuthContext.tsx";
import { Notifications } from "@mantine/notifications";
import { TopBar } from "./components/TopBar.tsx";
import { Authorization } from "./components/Authorization.tsx";
import { Budgets } from "./components/Budgets/Budgets.tsx";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Budget } from "./components/Budget/Budget.tsx";
import { ApiError } from "./lib/googleDriveApi.ts";
import { setAuthSession } from "./context/AuthContext/AuthGlobal.ts";

const refresh = async () => {
  try {
    const res = await fetch("/api/auth-refresh", { method: "POST" });
    if (!res.ok) throw new Error("Refresh token expired");

    const data = await res.json();

    setAuthSession(data.accessToken, data.user);

    return true;
  } catch (e) {
    setAuthSession(null, null);
    return false;
  }
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status === 401) {
          refresh()
            .then(() => true)
            .catch(() => false);
        }

        return failureCount < 3;
      },
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider theme={theme}>
      <Notifications />
      <LanguageProvider>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <TopBar />
              <GoogleOAuthProvider
                clientId={
                  "1044533121358-2rs5bvb5cinl5s4lj4srncvon1tavvk3.apps.googleusercontent.com"
                }
              >
                <Routes>
                  <Route index element={<Landing />} />
                  <Route element={<ProtectedRoute redirectIfFullyAuthorized />}>
                    <Route path="authorization" element={<Authorization />} />
                  </Route>
                  <Route element={<ProtectedRoute requireDrive />}>
                    <Route path="budgets" element={<Budgets />} />
                  </Route>
                  <Route element={<ProtectedRoute requireDrive />}>
                    <Route path="budgets/:id" element={<Budget />} />
                  </Route>
                </Routes>
              </GoogleOAuthProvider>
            </BrowserRouter>
          </QueryClientProvider>
        </AuthProvider>
      </LanguageProvider>
    </MantineProvider>
  </StrictMode>,
);
