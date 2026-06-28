import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

interface LoginInput {
  email: string;
  password: string;
}

interface RegisterInput {
  nom: string;
  email: string;
  telephone: string;
  password: string;
  confirmPassword: string;
}

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  const login = useCallback(
    async (data: LoginInput) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Erreur de connexion");
        }

        const result = await response.json();
        setUser(result.user);
        router.push("/");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Erreur inconnue";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [router],
  );

  const register = useCallback(
    async (data: RegisterInput) => {
      if (data.password !== data.confirmPassword) {
        setError("Les mots de passe ne correspondent pas");
        throw new Error("Les mots de passe ne correspondent pas");
      }

      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nom: data.nom,
            email: data.email,
            telephone: data.telephone,
            password: data.password,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Erreur d'inscription");
        }

        const result = await response.json();
        setUser(result.user);
        // Redirect to login with success message
        router.push("/login?registered=true");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Erreur inconnue";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [router],
  );

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la déconnexion");
      }

      setUser(null);
      router.push("/login");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [router]);

  const getMe = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (!response.ok) {
        setUser(null);
        return null;
      }
      const result = await response.json();
      setUser(result.user);
      return result;
    } catch (err) {
      setUser(null);
      return null;
    }
  }, []);

  return {
    login,
    register,
    logout,
    getMe,
    loading,
    error,
    user,
  };
}
