import { Suspense } from "react";
import { Outlet } from "react-router";

export default function RootLayout() {
    return (
        <div>
            <Suspense fallback={<div className="flex items-center justify-center fixed inset-0"><div className="animate-spin size-20 rounded-full border-t-4 border-primary/80" /></div>}>
                <Outlet />
            </Suspense>
        </div>
    )
}
