import { playerStore } from "@/store/playerStore";

export default function usePlayerQueue() {
  const { setSongQueue } = playerStore();

  return setSongQueue;
}