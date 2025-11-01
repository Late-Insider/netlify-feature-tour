import {
  addSubscriber as supabaseAddSubscriber,
  addContactSubmission as supabaseAddContact,
  addCreatorApplication as supabaseAddCreator,
} from "./supabase"

// Adapt the function signatures to match what your email-actions expects
export async function addSubscriber(data: {
  email: string
  category: string
  source?: string | null
  name?: string | null
}): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const result = await supabaseAddSubscriber({
      email: data.email,
      category: data.category,
      source: data.source ?? null,
    })

    if (result.disabled) {
      return { success: false, error: "Supabase is not configured" }
    }

    if (result.error) {
      return { success: false, error: result.error }
    }

    return { success: true, id: (result.data as { id?: string } | null)?.id }
  } catch (error: any) {
    return { success: false, error: error?.message ?? "Unknown error" }
  }
}

export async function addContactSubmission(data: {
  name: string
  email: string
  message: string
}): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const result = await supabaseAddContact(data.name, data.email, data.message)
    if (!result) {
      return { success: false, error: "Supabase is not configured" }
    }

    return { success: true, id: (result as { id?: string }).id }
  } catch (error: any) {
    return { success: false, error: error?.message ?? "Unknown error" }
  }
}

export async function addCreatorApplication(data: {
  name: string
  email: string
  portfolio?: string
  message: string
}): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const result = await supabaseAddCreator(data.name, data.email, data.portfolio, data.message)
    if (!result) {
      return { success: false, error: "Supabase is not configured" }
    }

    return { success: true, id: (result as { id?: string }).id }
  } catch (error: any) {
    return { success: false, error: error?.message ?? "Unknown error" }
  }
}
