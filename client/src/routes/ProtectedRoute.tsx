import type { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";

import { useAppSelector } from "@/app/hooks";

export function ProtectedRoute({children,}: PropsWithChildren) {
    const {isAuthenticated, isInitialized} = useAppSelector(state => state.auth);

    if (!isInitialized) {
        return (
            <div className="flex h-screen items-center justify-center">
                Loading...
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}