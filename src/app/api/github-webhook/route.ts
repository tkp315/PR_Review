import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest){
    
        const payload = await req.json();

        console.log("This is payload",payload);
        const eventType = req.headers.get('x-github-event')
        if(eventType==='pull_request'){
            const prData = payload.pull_request;
            console.log("Pull request Data",prData);
           console.log('created webhook');

            return NextResponse.json({message:"pull request prcessed Successfully",prData})
        }
        return NextResponse.json({ message: 'Not a pull request event' }, { status: 400 });
   

}