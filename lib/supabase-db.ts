import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export async function addSubscriber(data: {
  email: string
  category: string
  name?: string
  portfolio?: string
  message?: string
  unsubscribeToken?: string
}): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    // Check if already subscribed
    const { data: existing } = await supabase
      .from('subscribers')
      .select('email')
      .eq('email', data.email)
      .eq('category', data.category)
      .eq('status', 'active')
      .single()

    if (existing) {
      return { success: false, error: "Already subscribed to this list" }
    }

    const { data: subscriber, error } = await supabase
      .from('subscribers')
      .insert([
        {
          email: data.email,
          category: data.category,
          name: data.name,
          portfolio: data.portfolio,
          message: data.message,
          status: 'active',
          unsubscribe_c: data.unsubscribeToken
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return { success: false, error: error.message }
    }

    console.log("Subscriber added to Supabase:", subscriber)
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
    // Use subscribers table for contact submissions too, with category 'contact'
    const result = await addSubscriber({
      ...data,
      category: 'contact'
    })
    return result
  } catch (error) {
    console.error("Error adding contact submission:", error)
    return { success: false, error: "Failed to add contact submission" }
  }
}

export async function addCreatorApplication(data: {
  name: string
  email: string
  portfolio?: string
  message: string
}): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    // For creator applications, use the same subscribers table with category 'auction-creator'
    const { data: application, error } = await supabase
      .from('subscribers')
      .insert([
        {
          email: data.email,
          category: 'auction-creator',
          name: data.name,
          portfolio: data.portfolio,
          message: data.message,
          status: 'active'
        }
      ])
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, id: application.id }
  } catch (error) {
    console.error("Error adding creator application:", error)
    return { success: false, error: "Failed to add application" }
  }
}

export async function unsubscribeEmail(email: string, category: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('subscribers')
      .update({ status: 'unsubscribed' })
      .eq('email', email)
      .eq('category', category)

    return !error
  } catch (error) {
    console.error("Error unsubscribing:", error)
    return false
  }
}

export async function getSubscriberCount(category: string): Promise<number> {
  const { count, error } = await supabase
    .from('subscribers')
    .select('*', { count: 'exact', head: true })
    .eq('category', category)
    .eq('status', 'active')

  return count || 0
}

export async function getContactCount(): Promise<number> {
  const { count, error } = await supabase
    .from('subscribers')
    .select('*', { count: 'exact', head: true })
    .eq('category', 'contact')

  return count || 0
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
