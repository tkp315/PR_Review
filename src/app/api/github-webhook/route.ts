import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest){
    
        const payload = await req.json();
        console.log(payload);
        const eventType = req.headers.get('x-github-event')
        if(eventType==='pull_request'){
            const prData = payload.pull_request;
            console.log("Pull request Data",prData);
            const prTitle = prData.title;
            const prAuthor = prData.user.login;
            const prState = prData.prData.state;
            console.log(`Title:${prTitle},Author:${prAuthor},State:${prState}`)

            return NextResponse.json({message:"pull request prcessed Successfully",prData})
        }
        return NextResponse.json({ message: 'Not a pull request event' }, { status: 400 });
   

}