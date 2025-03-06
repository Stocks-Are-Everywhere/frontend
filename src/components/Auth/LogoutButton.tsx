import React from "react";
import AuthService from "../../services/AuthService"

const LogoutButton: React.FC = () => {
    return <button onClick={AuthService.logoutGoogle}>Logout</button>
}

export default LogoutButton;