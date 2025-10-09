// This is just an explanation file, not actual code

// The email confirmation system works as follows:

// 1. When a user submits a form (in any section), the form calls the handleFormSubmission function:
//    - This is set up in all form components (BookSection, ShopTeaser, PodcastSection, etc.)
//    - The auction waitlist form also uses this function

// 2. The handleFormSubmission function in actions/email-actions.ts:
//    - Processes the form data
//    - Submits the data to Formspree (which sends you a notification)
//    - Calls sendConfirmationEmail to send an email to the visitor

// 3. The sendConfirmationEmail function in lib/resend.ts:
//    - Uses the Resend API (with your RESEND_API_KEY)
//    - Sends a formatted HTML email to the visitor
//    - Also CCs contact@late.ltd so you receive a copy
//    - Uses different templates based on the form type

// The system is fully automated - when someone submits their email:
// - You get notified via Formspree
// - You get a CC of the confirmation email
// - The visitor receives a confirmation email
