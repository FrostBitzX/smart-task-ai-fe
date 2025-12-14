import apiClient from ".";
import { SignupRequest } from "../types/signup";

export const signup = (payload: SignupRequest) => {
  return apiClient.post("/api/signup", payload);
};
