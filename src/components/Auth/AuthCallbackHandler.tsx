import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../services/AuthService"; // ✅ Import the service

const AuthCallbackHandler: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        AuthService.callbackHandling().then(() => {
            navigate("/");
        });
    }, [navigate]);

    return <h2>Processing Authentication...</h2>;
};

export default AuthCallbackHandler;
