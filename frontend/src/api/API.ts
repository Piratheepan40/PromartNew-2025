import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Automatically attach token if available
API.interceptors.request.use((config) => {
  // console.log("🔄 API Request:", config.url);
  const savedUser = localStorage.getItem("promart_user");
  if (savedUser) {
    try {
      const parsed = JSON.parse(savedUser);
      // Handle both { token: "..." } and { user: { ... }, token: "..." } structures if they exist
      const token = parsed.token;

      if (token) {
        // console.log("🔑 Attaching auth token");
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.warn("⚠️ No token found in saved user data");
      }
    } catch (e) {
      console.error("❌ Error parsing user data from localStorage", e);
    }
  }
  return config;
});

// Handle 401 responses globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("⚠️ 401 Unauthorized - Clearing session");
      // Only clear if we actually got a 401, meaning the token is invalid
      localStorage.removeItem("promart_user");
      // Optionally redirect here or let the UI handle the empty state
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;
