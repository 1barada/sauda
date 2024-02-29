import { useEffect } from "react";
import { useAuth } from "./useAuth"
import { AppProps } from "next/app";

export default function withAuth({Component, pageProps}: AppProps): React.JSX.Element {
  return () => {
    const {user, isLoading} = useAuth();
    

  }
}