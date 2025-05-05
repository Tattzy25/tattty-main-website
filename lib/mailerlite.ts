const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY

export async function subscribeToNewsletter(email: string, name?: string) {
  if (!MAILERLITE_API_KEY) {
    throw new Error("MailerLite API key is not configured")
  }

  try {
    const response = await fetch("https://connect.mailerlite.com/api/subscribers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${MAILERLITE_API_KEY}`,
      },
      body: JSON.stringify({
        email,
        fields: name ? { name } : undefined,
        groups: ["tattzy-newsletter"], // Update this with your actual group ID or slug
        status: "active",
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`MailerLite API error: ${JSON.stringify(errorData)}`)
    }

    const data = await response.json()
    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error("Newsletter subscription error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function unsubscribeFromNewsletter(email: string) {
  if (!MAILERLITE_API_KEY) {
    throw new Error("MailerLite API key is not configured")
  }

  try {
    // First, find the subscriber by email
    const searchResponse = await fetch(
      `https://connect.mailerlite.com/api/subscribers?filter[email]=${encodeURIComponent(email)}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${MAILERLITE_API_KEY}`,
        },
      },
    )

    if (!searchResponse.ok) {
      const errorData = await searchResponse.json()
      throw new Error(`MailerLite API error: ${JSON.stringify(errorData)}`)
    }

    const searchData = await searchResponse.json()

    if (!searchData.data || searchData.data.length === 0) {
      return {
        success: false,
        error: "Subscriber not found",
      }
    }

    const subscriberId = searchData.data[0].id

    // Update the subscriber status to unsubscribed
    const updateResponse = await fetch(`https://connect.mailerlite.com/api/subscribers/${subscriberId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${MAILERLITE_API_KEY}`,
      },
      body: JSON.stringify({
        status: "unsubscribed",
      }),
    })

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json()
      throw new Error(`MailerLite API error: ${JSON.stringify(errorData)}`)
    }

    return {
      success: true,
    }
  } catch (error) {
    console.error("Newsletter unsubscribe error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function getSubscriberStatus(email: string) {
  if (!MAILERLITE_API_KEY) {
    throw new Error("MailerLite API key is not configured")
  }

  try {
    const response = await fetch(
      `https://connect.mailerlite.com/api/subscribers?filter[email]=${encodeURIComponent(email)}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${MAILERLITE_API_KEY}`,
        },
      },
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`MailerLite API error: ${JSON.stringify(errorData)}`)
    }

    const data = await response.json()

    if (!data.data || data.data.length === 0) {
      return {
        success: true,
        isSubscribed: false,
      }
    }

    return {
      success: true,
      isSubscribed: data.data[0].status === "active",
      status: data.data[0].status,
      subscriberData: data.data[0],
    }
  } catch (error) {
    console.error("Get subscriber status error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}
