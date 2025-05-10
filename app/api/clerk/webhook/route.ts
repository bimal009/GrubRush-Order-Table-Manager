import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { clerkClient, WebhookEvent } from '@clerk/nextjs/server'
import { createUser, updateUser, deleteUser } from '@/lib/actions/user.actions'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, svix-id, svix-timestamp, svix-signature',
  }

  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204, 
      headers: corsHeaders 
    })
  }

  const client = await clerkClient()
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET

  if (!WEBHOOK_SECRET) {
    return new Response('Missing WEBHOOK_SECRET', {
      status: 500,
      headers: corsHeaders
    })
  }

  const headerPayload = await headers()
  const svix_id = headerPayload.get("svix-id")
  const svix_timestamp = headerPayload.get("svix-timestamp")
  const svix_signature = headerPayload.get("svix-signature")

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred -- missing svix headers', {
      status: 400,
      headers: corsHeaders
    })
  }

  let payload
  try {
    payload = await req.json()
  } catch (error) {
    return new Response('Error parsing request body', {
      status: 400,
      headers: corsHeaders
    })
  }

  const body = JSON.stringify(payload)
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (error) {
    return new Response('Error verifying webhook', {
      status: 400,
      headers: corsHeaders
    })
  }

  const { id } = evt.data
  const eventType = evt.type

  try {
    if (eventType === 'user.created') {
      const { id, email_addresses, image_url, first_name, last_name, username } = evt.data
      const safeUsername = username || email_addresses?.[0]?.email_address?.split('@')[0] || `user_${Date.now()}`
      const safeImageUrl = image_url || `https://ui-avatars.com/api/?name=${first_name}+${last_name}`

      const user = {
        clerkId: id || '',
        email: email_addresses?.[0]?.email_address || '',
        username: safeUsername,
        firstName: first_name || 'Anonymous',
        lastName: last_name || 'User',
        photo: safeImageUrl,
      }

      const missingFields = []
      if (!user.clerkId) missingFields.push('clerkId')
      if (!user.email) missingFields.push('email')

      if (missingFields.length > 0) {
        return new Response(`User creation failed: Missing ${missingFields.join(', ')}`, { 
          status: 400,
          headers: corsHeaders
        })
      }

      try {
        const newUser = await createUser(user)

        if (!newUser) {
          return new Response('User creation failed - Database error', { 
            status: 500,
            headers: corsHeaders
          })
        }

        if (newUser._id) {
         
            await client.users.updateUserMetadata(id, {
              publicMetadata: {
                userId: newUser._id
              }
            })
       
        }

        return NextResponse.json({ message: 'OK', user: newUser }, { headers: corsHeaders })
      } catch (error) {
        return new Response(`User creation exception: ${error}`, {
          status: 500,
          headers: corsHeaders
        })
      }
    }

    if (eventType === 'user.updated') {
      const { id, image_url, first_name, last_name, username } = evt.data

      const user = {
        firstName: first_name || '',
        lastName: last_name || '',
        username: username || '',
        photo: image_url || '',
      }

      const updatedUser = await updateUser(id, user)

      if (!updatedUser) {
        return new Response('User update failed', { 
          status: 500,
          headers: corsHeaders
        })
      }

      return NextResponse.json({ message: 'OK', user: updatedUser }, { headers: corsHeaders })
    }

    if (eventType === 'user.deleted') {
      const { id } = evt.data
      const deletedUser = await deleteUser(id!)

      if (!deletedUser) {
        return new Response('User deletion failed', { 
          status: 500,
          headers: corsHeaders
        })
      }

      return NextResponse.json({ message: 'OK', user: deletedUser }, { headers: corsHeaders })
    }
  } catch (error) {
    console.error('Error processing webhook:', error)
   
  }

  return new Response('', { status: 200, headers: corsHeaders })
}
