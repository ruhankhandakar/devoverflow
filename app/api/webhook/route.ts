import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import { createUser, deleteUser, updateUser } from '@/lib/actions/user.action';

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      'Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local'
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svixId = headerPayload.get('svix-id');
  const svixTimestamp = headerPayload.get('svix-timestamp');
  const svixSignature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new SVIX instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400,
    });
  }

  // Get the ID and type
  const eventType = evt.type;

  if (eventType === 'user.created') {
    const {
      id,
      email_addresses: emails,
      image_url: imageUrl,
      username,
      first_name: firstName,
      last_name: lastName,
    } = evt.data;

    const mongoUser = await createUser({
      clerkId: id,
      name: `${firstName}${lastName ? ' ' + lastName : ''}`,
      username: username!,
      email: emails[0].email_address,
      picture: imageUrl,
    });

    return NextResponse.json({
      message: 'OK',
      user: mongoUser,
    });
  }

  if (eventType === 'user.updated') {
    const {
      id,
      email_addresses: emails,
      image_url: imageUrl,
      username,
      first_name: firstName,
      last_name: lastName,
    } = evt.data;

    await updateUser({
      clerkId: id,
      updateData: {
        name: `${firstName}${lastName ? ' ' + lastName : ''}`,
        username: username!,
        email: emails[0].email_address,
        picture: imageUrl,
      },
      path: `/profile/${id}`,
    });

    return NextResponse.json({
      message: 'OK',
    });
  }
  if (eventType === 'user.deleted') {
    const { id } = evt.data;

    const deletedUser = await deleteUser({
      clerkId: id!,
    });

    return NextResponse.json({
      message: 'OK',
      user: deletedUser,
    });
  }

  return new Response('', { status: 201 });
}
