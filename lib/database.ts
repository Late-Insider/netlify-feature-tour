"use server"

// In-memory database for v0 preview (replace with real database in production)
interface Subscriber {
  id: string
  email: string
  category: string
  name?: string
  portfolio?: string
  message?: string
  timestamp: number
  status: "active" | "unsubscribed"
}

interface ContactSubmission {
  id: string
  name: string
  email: string
  message: string
  timestamp: number
}

// Simple in-memory storage (would be replaced with actual database)
const subscribers: Subscriber[] = []
const contacts: ContactSubmission[] = []

export async function addSubscriber(data: {
  email: string
  category: string
  name?: string
  portfolio?: string
  message?: string
}): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    // Check if already subscribed
    const existing = subscribers.find((s) => s.email === data.email && s.category === data.category)
    if (existing && existing.status === "active") {
      return { success: false, error: "Already subscribed to this list" }
    }

    const subscriber: Subscriber = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: data.email,
      category: data.category,
      name: data.name,
      portfolio: data.portfolio,
      message: data.message,
      timestamp: Date.now(),
      status: "active",
    }

    subscribers.push(subscriber)
    console.log("Subscriber added:", subscriber)

    return { success: true, id: subscriber.id }
  } catch (error) {
    console.error("Error adding subscriber:", error)
    return { success: false, error: "Failed to add subscriber" }
  }
}

export async function addContactSubmission(data: {
  name: string
  email: string
  message: string
}): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const contact: ContactSubmission = {
      id: `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: data.name,
      email: data.email,
      message: data.message,
      timestamp: Date.now(),
    }

    contacts.push(contact)
    console.log("Contact submission added:", contact)

    return { success: true, id: contact.id }
  } catch (error) {
    console.error("Error adding contact submission:", error)
    return { success: false, error: "Failed to add contact submission" }
  }
}

export async function unsubscribeEmail(email: string, category: string): Promise<boolean> {
  try {
    const subscriber = subscribers.find((s) => s.email === email && s.category === category)
    if (subscriber) {
      subscriber.status = "unsubscribed"
      console.log("Unsubscribed:", email, category)
      return true
    }
    return false
  } catch (error) {
    console.error("Error unsubscribing:", error)
    return false
  }
}

export async function getSubscriberCount(category: string): Promise<number> {
  return subscribers.filter((s) => s.category === category && s.status === "active").length
}

export async function getContactCount(): Promise<number> {
  return contacts.length
}

export async function getAllCounts(): Promise<Record<string, number>> {
  return {
    newsletter: await getSubscriberCount("newsletter"),
    shop: await getSubscriberCount("shop"),
    podcast: await getSubscriberCount("podcast"),
    "auction-collector": await getSubscriberCount("auction-collector"),
    "auction-creator": await getSubscriberCount("auction-creator"),
    contact: await getContactCount(),
  }
}
