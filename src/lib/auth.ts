import bcrypt from "bcryptjs";

export async function hashPassword(password: string): Promise<string> {
  try {
    const rounds = 10;
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, rounds, (err: any, hash: string | undefined) => {
        if (err) reject(err);
        else resolve(hash || "");
      });
    });
  } catch (error) {
    throw error;
  }
}

export async function comparePasswords(
  password: string,
  hash: string
): Promise<boolean> {
  try {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, hash, (err: any, isMatch: boolean | undefined) => {
        if (err) reject(err);
        else resolve(isMatch || false);
      });
    });
  } catch (error) {
    throw error;
  }
}

// Utility to set/get auth token in localStorage (client-side)
export function setAuthToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("authToken", token);
  }
}

export function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken");
  }
  return null;
}

export function clearAuthToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken");
  }
}

// Utility to set/get current user in localStorage
export function setCurrentUser(user: any): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("currentUser", JSON.stringify(user));
  }
}

export function getCurrentUser(): any | null {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("currentUser");
    return user ? JSON.parse(user) : null;
  }
  return null;
}

export function clearCurrentUser(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("currentUser");
  }
}
