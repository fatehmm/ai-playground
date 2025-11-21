# Email Notification Setup

## Overview
This project now includes email notifications that are sent to `fatehmhtn@gmail.com` whenever a new user signs up.

## Required Environment Variable

Add the following environment variable to your `.env` file:

```bash
RESEND_API_KEY=your_resend_api_key_here
```

## Getting a Resend API Key

1. Go to [Resend.com](https://resend.com)
2. Sign up or log in to your account
3. Navigate to the API Keys section
4. Create a new API key
5. Copy the key and add it to your `.env` file

## Domain Configuration

The email is sent from `noreply@ai-playground.dev`. You'll need to:

1. In your Resend dashboard, add and verify the domain `ai-playground.dev`
2. Add the required DNS records to your domain provider
3. Wait for verification to complete

## How It Works

When a user signs up through the signup form:

1. The Better Auth `afterSignUp` event is triggered
2. The `sendSignupNotification` function is called
3. An email is sent to `fatehmhtn@gmail.com` with the new user's details

The email includes:
- User's name
- User's email address
- Formatted HTML and plain text versions

## Testing

To test the email functionality:

1. Make sure `RESEND_API_KEY` is set in your environment
2. Start the development server: `bun dev`
3. Navigate to the signup page
4. Create a new account
5. Check `fatehmhtn@gmail.com` for the notification email

If the API key is not configured, the system will log a warning and skip sending the email without breaking the signup process.
