import { NextApiRequest } from "next";
import { getToken } from "next-auth/jwt";
import axios from 'axios'

 export async function POST (req:NextApiRequest){
   
        try {
           const token = await getToken({req});
           console.log(token);
           
           if(!token)return Response.json({message:"Github token is missing"});


           const {owner,repo, webhookUrl}   = req.body;

           if(!owner ||!repo || !webhookUrl)  return Response.json({ message: 'Missing required fields: owner, repo, or webhookUrl' });

           const url = `https://api.github.com/repos/${owner}/${repo}/hooks`

           const webhookData = {
            name:'web',
            active:true,
            events:["pull_request"],
            config:{
                url:webhookUrl,
                content_type:'json',
                
            }
           }

           const response =await axios.post(url, webhookData,{headers:{
            Authorization:`Bearer ${token}`,
            Accept:'application/vnd.github+json',
           }})
           return Response.json({ message: 'Webhook created successfully', data: response.data });
        } catch (error) {
            console.error('Error creating webhook:', error);
    return Response.json({ message: 'Failed to create webhook', error: error.message });
        }
    }


