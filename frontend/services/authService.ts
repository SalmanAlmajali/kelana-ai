const apiUri = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export class AuthService {
  static async getMe(serverToken?: string) {
    const token = serverToken || (typeof window !== 'undefined' ? localStorage.getItem("token") : null);

    const response = await fetch(`${apiUri}/api/v1/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { "Authorization": `Bearer ${token}` } : {})
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Not authenticated");
    }

    return data;
  }

  static async login(email: string, password: string) {
    const response = await fetch(`${apiUri}/api/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Invalid credentials");
    }

    return data;
  }

  static async register(name: string, email: string, password: string) {
    const response = await fetch(`${apiUri}/api/v1/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Registration failed");
    }

    return data;
  }
}
