'use client'

import { historyStore } from "@/store/historyStore";
import { useRouter } from "next/navigation";

export default function useHistory() {
  const {
    history, 
    currentPage, 
    push: pushToStore, 
    replace: replaceInStore,
    back: backHistory, 
    forward: forwardHistory
  } = historyStore();
  const router = useRouter();

  function push(path: string) {
    if (pushToStore(path)) router.push(path);
  }

  function replace(path: string) {
    if (replaceInStore(path)) router.replace(path);
  }

  function back() {
    if (backHistory()) router.back();
  } 

  function forward() {
    if (forwardHistory()) router.forward();
  }

  return {
    history,
    currentPage,
    push,
    replace,
    back,
    forward,
    refresh: router.refresh,
    prefetch: router.prefetch
  };
}