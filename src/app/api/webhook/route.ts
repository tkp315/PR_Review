import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import axios from 'axios';



export async function POST(req: NextRequest) {
  try {
    
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, raw: true });
    console.log("Token:", token);
    console.log(token);
    if (!token ) {
      return NextResponse.json({ message: "GitHub token is missing" }, { status: 401 });
    }

    
    const { owner, repo, webhookUrl,accessToken } = await req.json();

    console.log(req.json());


    if (!owner || !repo || !webhookUrl) {
      return NextResponse.json({ message: 'Missing required fields: owner, repo, or webhookUrl' }, { status: 400 });
    }

    
    const url = `https://api.github.com/repos/${owner}/${repo}/hooks`;

    
    const webhookData = {
      name: 'web',
      active: true,
      events: ["pull_request"], 
      config: {
        url: webhookUrl,
        content_type: 'json',
      },
    };

    const response = await axios.post(url, webhookData, {
      headers: {
        Authorization: `Bearer ${accessToken}`, 
        Accept: 'application/vnd.github+json',
      },
    });
    
     console.log(response)

    return NextResponse.json({ message: 'Webhook created successfully', data: response.data }, { status: 200 });

  } catch (error: unknown) {
    console.error('Error creating webhook:', error);
    
    
    if (error instanceof Error) {
   
      return NextResponse.json({ message: 'Failed to create webhook', error: error.message }, { status: 500 });
    } else {
      // Handle other types of errors (if any)
      return NextResponse.json({ message: 'Failed to create webhook', error: String(error) }, { status: 500 });
    }
  }
}
