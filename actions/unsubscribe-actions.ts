"use server"

import { processUnsubscribe } from "@/lib/unsubscribe"

export async function handleUnsubscribe(token: string) {
  return processUnsubscribe(token)
}
