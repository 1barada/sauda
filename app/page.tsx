'use client'

import { useAuth } from "@/hooks/useAuth";
import Loading from "./loading";


export default function Home() {
  const {user, isLoading, signIn, signOut} = useAuth();

  if (isLoading) return (
    <main>
      <Loading/>
    </main>
  );

  return (
    <main>
      {user
      ? <div>
          <p>Welcome: {user.name}</p>
          <button onClick={() => signOut()}>logout</button>
        </div>
      : <div>
          <p>not authorized</p>
          <button onClick={() => signIn()}>login</button>
        </div>
      }
    </main>
  );
}