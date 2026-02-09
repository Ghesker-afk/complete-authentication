import API from "../config/apiClient";

// This folder will hold all of our API calls to our auth
// server.

type LoginUserData = {
  email: string;
  password: string;
};

type RegisterUserData = LoginUserData & { confirmPassword: string };

export async function login(data: LoginUserData) {
  API.post("/auth/login", data);
}

export async function register(data: RegisterUserData) {
  API.post("/auth/register", data);
}
