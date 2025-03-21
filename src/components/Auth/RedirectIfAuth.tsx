import { Navigate } from "react-router-dom";
import { ReactElement, FC } from "react";
import AuthService from "../../services/AuthService";

interface RedirectIfAuthProps {
    children: ReactElement;
}

const RedirectIfAuth: FC<RedirectIfAuthProps> = ({ children }) => {
    const token = AuthService.getToken();

    return token ? <Navigate to="/" replace /> : children;
};

export default RedirectIfAuth;
