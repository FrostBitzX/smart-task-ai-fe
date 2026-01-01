import apiClient from ".";
import { SigninRequest } from "@/types/auth/signin";
import { SignupRequest } from "@/types/auth/signup";

export const signup = (payload: SignupRequest) => {
  return apiClient.post("/api/signup", payload);
};

export const signin = (payload: SigninRequest) => {
  return apiClient.post("/api/login", payload);
};
