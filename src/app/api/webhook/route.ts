import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import axios from 'axios';

export async function POST(req: NextRequest) {
  try {
    // Get the GitHub OAuth token using NextAuth
    const token = await getToken({ req });
    console.log(token);
    if (!token || !token.accessToken) {
      return NextResponse.json({ message: "GitHub token is missing" }, { status: 401 });
    }

    // Get the request body
    const { owner, repo, webhookUrl } = await req.json();

    // Validate required fields
    if (!owner || !repo || !webhookUrl) {
      return NextResponse.json({ message: 'Missing required fields: owner, repo, or webhookUrl' }, { status: 400 });
    }

    // GitHub API URL for creating the webhook
    const url = `https://api.github.com/repos/${owner}/${repo}/hooks`;

    // Webhook data to send to GitHub
    const webhookData = {
      name: 'web',
      active: true,
      events: ["pull_request"], // You can modify events as needed
      config: {
        url: webhookUrl,
        content_type: 'json',
      },
    };

    // Make the API request to GitHub to create the webhook
    const response = await axios.post(url, webhookData, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`, // Use the accessToken from the token
        Accept: 'application/vnd.github+json',
      },
    });

    // Return success response with webhook data
    return NextResponse.json({ message: 'Webhook created successfully', data: response.data }, { status: 200 });

  } catch (error) {
    console.error('Error creating webhook:', error);
    return NextResponse.json({ message: 'Failed to create webhook', error: error.message }, { status: 500 });
  }
}
