import { createClient as createSupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey)
}

if (!isSupabaseConfigured()) {
  console.warn("Supabase environment variables are not configured")
}

export const supabase = isSupabaseConfigured() ? createSupabaseClient(supabaseUrl, supabaseAnonKey) : null

export const createClient = () => {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.",
    )
  }
  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

export async function addContactSubmission(name: string, email: string, message: string) {
  if (!supabase) {
    throw new Error("Supabase is not configured")
  }

  const { data, error } = await supabase
    .from("contact_submissions")
    .insert([
      {
        name,
        email,
        message,
        created_at: new Date().toISOString(),
      },
    ])
    .select()

  if (error) {
    console.error("Error adding contact submission:", error)
    throw error
  }

  return data
}

export async function addSubscriber(email: string, source: string) {
  if (!supabase) {
    throw new Error("Supabase is not configured")
  }

  const { data, error } = await supabase
    .from("subscribers")
    .insert([
      {
        email,
        source,
        subscribed_at: new Date().toISOString(),
        is_active: true,
      },
    ])
    .select()

  if (error) {
    if (error.code === "23505") {
      const { data: existingData, error: updateError } = await supabase
        .from("subscribers")
        .update({ is_active: true, subscribed_at: new Date().toISOString() })
        .eq("email", email)
        .select()

      if (updateError) {
        console.error("Error updating subscriber:", updateError)
        throw updateError
      }

      return existingData
    }
    console.error("Error adding subscriber:", error)
    throw error
  }

  return data
}

export async function addCreatorApplication(name: string, email: string, portfolio_url: string, message: string) {
  if (!supabase) {
    throw new Error("Supabase is not configured")
  }

  const { data, error } = await supabase
    .from("creator_applications")
    .insert([
      {
        name,
        email,
        portfolio_url,
        message,
        created_at: new Date().toISOString(),
        status: "pending",
      },
    ])
    .select()

  if (error) {
    console.error("Error adding creator application:", error)
    throw error
  }

  return data
}

export async function getDashboardStats() {
  if (!supabase) {
    throw new Error("Supabase is not configured")
  }

  const { data: subscribersData, error: subscribersError } = await supabase
    .from("subscribers")
    .select("*", { count: "exact", head: true })

  if (subscribersError) {
    console.error("Error fetching subscribers count:", subscribersError)
  }

  const { data: contactData, error: contactError } = await supabase
    .from("contact_submissions")
    .select("*", { count: "exact", head: true })

  if (contactError) {
    console.error("Error fetching contact submissions count:", contactError)
  }

  const { data: creatorsData, error: creatorsError } = await supabase
    .from("creator_applications")
    .select("*", { count: "exact", head: true })

  if (creatorsError) {
    console.error("Error fetching creator applications count:", creatorsError)
  }

  return {
    subscribers: subscribersData?.length || 0,
    contactSubmissions: contactData?.length || 0,
    creatorApplications: creatorsData?.length || 0,
  }
}

export async function testSupabaseConnection() {
  if (!supabase) {
    return {
      success: false,
      message: "Supabase is not configured",
    }
  }

  try {
    const { data, error } = await supabase.from("subscribers").select("count")

    if (error) {
      return {
        success: false,
        message: error.message,
        error,
      }
    }

    return {
      success: true,
      message: "Successfully connected to Supabase",
      data,
    }
  } catch (error) {
    return {
      success: false,
      message: "Failed to connect to Supabase",
      error,
    }
  }
}
