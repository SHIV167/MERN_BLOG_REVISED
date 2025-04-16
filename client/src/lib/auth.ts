import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

interface LoginCredentials {
  username: string;
  password: string;
}

interface User {
  id: number;
  username: string;
  isAdmin: boolean;
}

// Login function
export async function login(credentials: LoginCredentials): Promise<User> {
  const response = await apiRequest("POST", "/api/auth/login", credentials);
  const user = await response.json();
  
  // Update auth query cache
  queryClient.setQueryData(['/api/auth/me'], user);
  
  return user;
}

// Logout function
export async function logout(): Promise<void> {
  await apiRequest("POST", "/api/auth/logout");
  
  // Clear auth query cache
  queryClient.setQueryData(['/api/auth/me'], null);
  
  // Invalidate all queries to force refetch
  queryClient.invalidateQueries();
}

// Check if user is authenticated
export function useIsAuthenticated(): boolean {
  const user = queryClient.getQueryData<User | null>(['/api/auth/me']);
  return user !== null && user !== undefined;
}

// Check if user is admin
export function useIsAdmin(): boolean {
  const user = queryClient.getQueryData<User | null>(['/api/auth/me']);
  return user !== null && user !== undefined && user.isAdmin === true;
}

// Redirect to login if not authenticated
export function requireAuth(isAuthenticated: boolean, navigate: (to: string) => void): void {
  if (!isAuthenticated) {
    navigate("/admin/login");
  }
}

// Redirect to login if not admin
export function requireAdmin(isAdmin: boolean, navigate: (to: string) => void): void {
  if (!isAdmin) {
    navigate("/admin/login");
  }
}
