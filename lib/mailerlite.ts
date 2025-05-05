const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY

export async function subscribeToNewsletter(email: string, name?: string) {
  if (!MAILERLITE_API_KEY) {
    throw new Error('MailerLite API key is not configured')
  }
  
  try {\
    const response = await fetch('https://connect.mailerlite.com/api/subscribers
