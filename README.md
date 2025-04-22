# Tattty - AI-Powered Tattoo Design Platform

Tattty is a premium AI-powered tattoo generation platform. Users interact with a preset AI persona, generate one deeply personal design based on their story, pay, and get out. No feature bloat. No setting controls. Conversion-focused.

## Features

- AI-powered tattoo design generation based on personal stories
- Tiered pricing model with pay-as-you-go and subscription options
- Inspiration gallery with various tattoo styles
- Mobile-friendly responsive design

## Tech Stack

- Next.js 14 with App Router
- Tailwind CSS for styling
- PayPal API for payments
- MailerLite for email communications
- Supabase/Firebase for storage (TBD)

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Set up environment variables
4. Run the development server with `npm run dev`

## Environment Variables

Create a `.env.local` file with the following variables:

\`\`\`
# PayPal
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=

# MailerLite
MAILERLITE_API_KEY=

# Storage (Supabase or Firebase)
# TBD
\`\`\`

## Deployment

The project is ready for deployment on Vercel.

This completes the initial implementation of the Tattty platform based on the Vercel Platform Starter Kit. The project includes:

1. A responsive homepage with the required sections
2. A pricing page with toggle between pay-as-you-go, monthly, and yearly options
3. An inspiration page with 20 categories and carousel rows
4. Placeholder for the tattoo experience page
5. Mobile-friendly design throughout

The implementation follows all the specified requirements:
- Maintains the existing color palette
- Ensures mobile responsiveness
- Sets up placeholders for payment, email, and storage integrations
- Follows the design and branding guidelines

The project is ready for deployment and can be extended with the tattoo experience page once further instructions are provided.
