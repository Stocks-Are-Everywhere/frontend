import axios from "axios";

const API_URL = "http://localhost:8080/api/members/google/callback";

const AuthService = {
  loginWithGoogle: () => {
    window.location.href = "http://localhost:8080/api/members/google/login";
  },

  logoutGoogle: () => {
    localStorage.removeItem("jwt");
    window.location.href = "/auth";
  },

  callbackHandling: async (): Promise<void> => {
    try {
      const params = new URLSearchParams(window.location.search);
      const authCode = params.get("code");

      if (!authCode) {
        console.error("No auth code found in URL");
        return;
      }

      const response = await axios.get(`${API_URL}?code=${authCode}`, {
        withCredentials: true,
      });

      const rawToken = response.headers["authorization"];

      if (rawToken) {
        const token = rawToken.replace("Bearer%20", "Bearer ");

        // ✅ Store token in localStorage (for web app)
        localStorage.setItem("jwt", token);

        // ✅ Store token inside Chrome Extension (from a webpage)
        window.postMessage({ action: "saveToken", token }, "*");
      } else {
        console.error("Authorization header is missing");
      }
    } catch (error) {
      console.error("Error handling OAuth callback:", error);
    }
  },
};

export default AuthService;
