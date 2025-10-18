import { 
  addSubscriber as supabaseAddSubscriber, 
  addContactSubmission as supabaseAddContact,
  addCreatorApplication as supabaseAddCreator 
} from "./supabase-db"

// Adapt the function signatures to match what your email-actions expects
export async function addSubscriber(data: {
  email: string
  category: string
  name?: string
  portfolio?: string
  message?: string
  unsubscribeToken?: string
}): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    // For now, ignore unsubscribeToken until we add it to your Supabase table
    const result = await supabaseAddSubscriber(data.email, data.category)
    return { success: true, id: result.id }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function addContactSubmission(data: {
  name: string
  email: string
  message: string
}): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const result = await supabaseAddContact(data.name, data.email, data.message)
    return { success: true, id: result.id }
  } catch (error: any) {
    return { success: false, error: error.message }
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
    return { success: true, id: result.id }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
