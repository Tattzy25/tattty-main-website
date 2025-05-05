import { z } from "zod"

// PayPal API configuration
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET
const PAYPAL_API_URL =
  process.env.NODE_ENV === "production" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com"

// Schema for payment creation
const PaymentCreationSchema = z.object({
  id: z.string(),
  status: z.string(),
  links: z.array(
    z.object({
      href: z.string().url(),
      rel: z.string(),
      method: z.string(),
    }),
  ),
})

// Schema for payment capture
const PaymentCaptureSchema = z.object({
  id: z.string(),
  status: z.string(),
  payer: z
    .object({
      email_address: z.string().email().optional(),
      payer_id: z.string(),
    })
    .optional(),
  purchase_units: z
    .array(
      z.object({
        payments: z
          .object({
            captures: z.array(
              z.object({
                id: z.string(),
                status: z.string(),
              }),
            ),
          })
          .optional(),
      }),
    )
    .optional(),
})

// Get PayPal access token
async function getAccessToken(): Promise<string> {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64")

  const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${auth}`,
    },
    body: "grant_type=client_credentials",
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to get PayPal access token: ${error}`)
  }

  const data = await response.json()
  return data.access_token
}

// Create a PayPal payment
export async function createPayment(amount: number, description: string) {
  try {
    const accessToken = await getAccessToken()

    const payload = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: amount.toFixed(2),
          },
          description,
        },
      ],
      application_context: {
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`,
        brand_name: "Tattzy",
        user_action: "PAY_NOW",
        shipping_preference: "NO_SHIPPING",
      },
    }

    const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`PayPal payment creation failed: ${error}`)
    }

    const data = await response.json()
    const validatedData = PaymentCreationSchema.parse(data)

    // Find approval URL
    const approvalUrl = validatedData.links.find((link) => link.rel === "approve")?.href

    return {
      id: validatedData.id,
      status: validatedData.status,
      approvalUrl: approvalUrl || "#",
    }
  } catch (error) {
    console.error("Error creating PayPal payment:", error)
    throw error
  }
}

// Capture a PayPal payment
export async function capturePayment(paymentId: string) {
  try {
    const accessToken = await getAccessToken()

    const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders/${paymentId}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`PayPal payment capture failed: ${error}`)
    }

    const data = await response.json()
    const validatedData = PaymentCaptureSchema.parse(data)

    return {
      id: validatedData.id,
      status: validatedData.status,
    }
  } catch (error) {
    console.error("Error capturing PayPal payment:", error)
    throw error
  }
}

// Verify a PayPal webhook signature
export async function verifyWebhookSignature(headers: Record<string, string>, body: string, webhookId: string) {
  try {
    const accessToken = await getAccessToken()

    const payload = {
      auth_algo: headers["paypal-auth-algo"],
      cert_url: headers["paypal-cert-url"],
      transmission_id: headers["paypal-transmission-id"],
      transmission_sig: headers["paypal-transmission-sig"],
      transmission_time: headers["paypal-transmission-time"],
      webhook_id: webhookId,
      webhook_event: JSON.parse(body),
    }

    const response = await fetch(`${PAYPAL_API_URL}/v1/notifications/verify-webhook-signature`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`PayPal webhook verification failed: ${error}`)
    }

    const data = await response.json()
    return data.verification_status === "SUCCESS"
  } catch (error) {
    console.error("Error verifying PayPal webhook:", error)
    return false
  }
}
