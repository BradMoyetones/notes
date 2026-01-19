import { createHashRouter } from "react-router";
import { lazy } from "react";
import RootLayout from "./app/layouts/RootLayout";
import ErrorBoundary from "./app/pages/(errors)/ErrorBoundary";
import NotFound from "./app/pages/(errors)/NotFound";
const RootPage = lazy(() => import("./app/pages/(root)/page"));

const router = createHashRouter([
    {
        path: "/",
        element: <RootLayout />,
        errorElement: (
            <ErrorBoundary fallback={<NotFound />}><NotFound /></ErrorBoundary>
        ),
        children: [
            {
                index: true,
                element: <RootPage />
            }
        ]
    }
])

export default router