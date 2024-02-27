'use server'

import { cookies } from "next/headers"
import { createClient } from "./supabase/server"
import { UserInfo } from "@/types/user";

export default async function getServerUser(): Promise<UserInfo | undefined> {
  const supabase = createClient(cookies());
  const {data: {user}} = await supabase.auth.getUser();

  if (!user) return undefined;

  const userInfo: UserInfo = {
    id: user.id,
    name: user.identities?.[0].identity_data?.name,
    avatarUrl: user.identities?.[0].identity_data?.avatar_url,
  };
  
  return userInfo;
}
