"use client";

import { createContext,  useContext,  useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

import { UserInfo } from "@/types/user";

interface AuthContextType {
  user?: UserInfo;
  isLoading: boolean;
  error?: Error ;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserInfo | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    const supabase = createClient();
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          const userInfo: UserInfo = {
            id: session.user.id,
            name: session.user.identities?.[0].identity_data?.name,
            avatarUrl: session.user.identities?.[0].identity_data?.avatar_url,
          };

          setUser(userInfo);
        } else {
          setUser(undefined);
        }

        if (event === "INITIAL_SESSION") setIsLoading(false);
      }
    );

    return () => authListener.subscription.unsubscribe();
  }, []);

  async function signIn() {
    if (isLoading) return;
    setIsLoading(true);

    const supabase = createClient();
    const {error} = await supabase.auth.signInWithOAuth({ provider: "google" });

    if (error) setError(error);
    
    setIsLoading(false);
  };

  async function signOut() {
    if (isLoading) return;
    setIsLoading(true);

    const supabase = createClient();
    const {error} = await supabase.auth.signOut();

    if (error) setError(error);

    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        signIn,
        signOut
      }}
      children={children}
    />
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must me used within a AuthProvider");
  }

  return context;
}
