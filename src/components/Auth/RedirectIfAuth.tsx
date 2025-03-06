import { Navigate } from "react-router-dom";
import { ReactElement } from "react";

interface RedirectIfAuthProps {
    children: ReactElement;
}

const RedirectIfAuth = ({ children }: RedirectIfAuthProps): ReactElement => {
    const token = localStorage.getItem("jwt");

    return token ? <Navigate to="/" replace /> : children;
};

export default RedirectIfAuth;
