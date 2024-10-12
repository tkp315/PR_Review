import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import axios from 'axios'

 export async function post (req:NextApiRequest,res:NextApiResponse){
    if(req.method!=='POST'){
        return res.status(405).json({messge:"Only POST request are allowed"})
    }
        try {
           const token = await getToken({req});
           console.log(token);
           if(!token)return res.status(401).json({message:"Github token is missing"});


           const {owner,repo, webhookUrl}   = req.body;

           if(!owner ||!repo || !webhookUrl)  return res.status(400).json({ message: 'Missing required fields: owner, repo, or webhookUrl' });

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
           return res.status(200).json({ message: 'Webhook created successfully', data: response.data });
        } catch (error) {
            console.error('Error creating webhook:', error);
    return res.status(500).json({ message: 'Failed to create webhook', error: error.message });
        }
    }


