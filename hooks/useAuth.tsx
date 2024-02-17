'use client'

import { UserInfo } from "@/types";
import { createClient } from "@/utils/supabase/client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user?: UserInfo;
  isLoading: boolean;
  signIn: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<UserInfo | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const supabase = createClient();
    const {data: authListener} = supabase.auth.onAuthStateChange((event, session) => {
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
      setIsLoading(false);
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  const signIn = useCallback(async () => {
    setIsLoading(true);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({provider: 'google'});
    setIsLoading(false)
  }, [user]);
  
  const signOut = useCallback(async () => {
    setIsLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    setIsLoading(false)
  }, [user]);

  return <AuthContext.Provider 
    value={{
      user,
      isLoading,
      signIn,
      signOut
    }}
    children={children}
  />
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must me used within a AuthProvider');
  }
  
  return context;
}