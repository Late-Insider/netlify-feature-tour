import { sql } from "@vercel/postgres"

export interface Subscriber {
  id: number
  email: string
  category: string
  status: string
  unsubscribe_token: string | null
  created_at: Date
}

export interface CreatorApplication {
  id: number
  name: string
  email: string
  portfolio: string | null
  message: string
  status: string
  created_at: Date
}

export interface ContactSubmission {
  id: number
  name: string
  email: string
  message: string
  created_at: Date
}

/**
 * Add a new subscriber to the database
 */
export async function addSubscriber(data: {
  email: string
  category: string
  unsubscribeToken?: string
}): Promise<{ success: boolean; id?: number; error?: string }> {
  try {
    const result = await sql`
      INSERT INTO subscribers (email, category, status, unsubscribe_token)
      VALUES (${data.email}, ${data.category}, 'active', ${data.unsubscribeToken || null})
      ON CONFLICT (email, category) 
      DO UPDATE SET status = 'active', unsubscribe_token = ${data.unsubscribeToken || null}
      RETURNING id
    `

    return {
      success: true,
      id: result.rows[0]?.id,
    }
  } catch (error) {
    console.error("Error adding subscriber:", error)
    return {
      success: false,
      error: "Failed to add subscriber to database",
    }
  }
}

/**
 * Add a creator application to the database
 */
export async function addCreatorApplication(data: {
  name: string
  email: string
  portfolio?: string
  message: string
}): Promise<{ success: boolean; id?: number; error?: string }> {
  try {
    const result = await sql`
      INSERT INTO creator_applications (name, email, portfolio, message, status)
      VALUES (${data.name}, ${data.email}, ${data.portfolio || null}, ${data.message}, 'pending')
      RETURNING id
    `

    return {
      success: true,
      id: result.rows[0]?.id,
    }
  } catch (error) {
    console.error("Error adding creator application:", error)
    return {
      success: false,
      error: "Failed to add creator application",
    }
  }
}

/**
 * Add a contact submission to the database
 */
export async function addContactSubmission(data: {
  name: string
  email: string
  message: string
}): Promise<{ success: boolean; id?: number; error?: string }> {
  try {
    const result = await sql`
      INSERT INTO contact_submissions (name, email, message)
      VALUES (${data.name}, ${data.email}, ${data.message})
      RETURNING id
    `

    return {
      success: true,
      id: result.rows[0]?.id,
    }
  } catch (error) {
    console.error("Error adding contact submission:", error)
    return {
      success: false,
      error: "Failed to add contact submission",
    }
  }
}

/**
 * Unsubscribe a user using their token
 */
export async function unsubscribeByToken(token: string): Promise<{
  success: boolean
  email?: string
  category?: string
  error?: string
}> {
  try {
    const result = await sql`
      UPDATE subscribers 
      SET status = 'unsubscribed'
      WHERE unsubscribe_token = ${token} AND status = 'active'
      RETURNING email, category
    `

    if (result.rows.length === 0) {
      return {
        success: false,
        error: "Invalid or expired unsubscribe link",
      }
    }

    return {
      success: true,
      email: result.rows[0].email,
      category: result.rows[0].category,
    }
  } catch (error) {
    console.error("Error unsubscribing:", error)
    return {
      success: false,
      error: "Failed to unsubscribe",
    }
  }
}

/**
 * Get count of active subscribers by category
 */
export async function getSubscriberCount(category: string): Promise<number> {
  try {
    const result = await sql`
      SELECT COUNT(*) as count
      FROM subscribers
      WHERE category = ${category} AND status = 'active'
    `
    return Number.parseInt(result.rows[0]?.count || "0")
  } catch (error) {
    console.error("Error getting subscriber count:", error)
    return 0
  }
}

/**
 * Get count of contact submissions
 */
export async function getContactCount(): Promise<number> {
  try {
    const result = await sql`
      SELECT COUNT(*) as count
      FROM contact_submissions
    `
    return Number.parseInt(result.rows[0]?.count || "0")
  } catch (error) {
    console.error("Error getting contact count:", error)
    return 0
  }
}

/**
 * Get count of creator applications
 */
export async function getCreatorApplicationCount(): Promise<number> {
  try {
    const result = await sql`
      SELECT COUNT(*) as count
      FROM creator_applications
    `
    return Number.parseInt(result.rows[0]?.count || "0")
  } catch (error) {
    console.error("Error getting creator application count:", error)
    return 0
  }
}

/**
 * Get all counts for dashboard
 */
export async function getAllCounts(): Promise<Record<string, number>> {
  try {
    const [newsletter, shop, podcast, auctionCollector, contact, creatorApps] = await Promise.all([
      getSubscriberCount("newsletter"),
      getSubscriberCount("shop"),
      getSubscriberCount("podcast"),
      getSubscriberCount("auction-collector"),
      getContactCount(),
      getCreatorApplicationCount(),
    ])

    return {
      newsletter,
      shop,
      podcast,
      "auction-collector": auctionCollector,
      "auction-creator": creatorApps,
      contact,
    }
  } catch (error) {
    console.error("Error getting all counts:", error)
    return {
      newsletter: 0,
      shop: 0,
      podcast: 0,
      "auction-collector": 0,
      "auction-creator": 0,
      contact: 0,
    }
  }
}
