import API from "../config/apiClient";

// This folder will hold all of our API calls to our auth
// server.

type LoginData = {
  email: string;
  password: string;
};

export async function login(data: LoginData) {
  API.post("/auth/login", data);
}