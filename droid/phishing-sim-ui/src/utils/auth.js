// Authentication utility functions

export const checkAuthStatus = async () => {
  try {
    const response = await fetch("/api/auth/user", {
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        return { authenticated: true, user: data.user };
      }
    }

    localStorage.removeItem("user");
    return { authenticated: false, user: null };
  } catch (error) {
    console.error("Auth check failed:", error);
    localStorage.removeItem("user");
    return { authenticated: false, user: null };
  }
};

export const logout = async () => {
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  } catch (error) {
    console.error("Logout error:", error);
  }

  localStorage.removeItem("user");
  window.location.href = "/";
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  try {
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    localStorage.removeItem("user");
    return null;
  }
};

export const makeAuthenticatedRequest = async (url, options = {}) => {
  const defaultOptions = {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, defaultOptions);

  if (response.status === 401) {
    // Redirect to login if authentication fails
    localStorage.removeItem("user");
    window.location.href = "/";
    throw new Error("Authentication required");
  }

  return response;
};
