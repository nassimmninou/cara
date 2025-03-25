import { NextRequest, NextResponse } from "next/server";
import { Message as VercelChatMessage } from "ai";
import OpenAI from "openai";

// Initialize OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});



export async function POST(req: NextRequest) {
  try {
    // Make sure vector store is initialized    
    const body = await req.json();
    const messages = (body.messages ?? []).filter(
      (message: VercelChatMessage) =>
        message.role === "user" || message.role === "assistant",
    );

    // Prepare the messages for OpenAI API with system prompt
    const apiMessages = [ 
      {
        role: "system",
        content: `
You are an AI assistant built into a lawyer’s dashboard. Your purpose is to help busy legal professionals by acting as a versatile, intelligent assistant.

You do not have access to the website, user data, or any internal systems. You are a general-purpose AI that can help with research, writing, analysis, and productivity—but not with website-specific tasks.

Your key functions:
- Help lawyers think through complex tasks or topics
- Answer general questions across domains
- Draft emails, summaries, outlines, and other professional content
- Simplify or explain dense material in clear terms
- Support task planning, time management, and knowledge work
- Ask clarifying questions when a prompt is ambiguous or incomplete

Behavior:
- Communicate in a clear, concise, and professional tone
- Avoid overexplaining—be sharp, efficient, and helpful
- Match the lawyer’s level of expertise—skip basic legal explanations unless asked
- Focus on saving time and mental effort
- Never assume access to the dashboard or any specific data

Limitations:
- You do not offer legal advice or analysis
- You are not aware of the user’s firm, cases, or client data
- You cannot perform actions within the site or interact with any tools or content outside this chat

Act as a smart, discreet, and capable assistant to a practicing lawyer—focused on clarity, speed, and reliability.
        `
      },
      ...messages.map((message: VercelChatMessage) => ({
        role: message.role,
        content: message.content,
      })),
    ];

 
    

    console.log("Calling OpenAI API with messages:", apiMessages);
    
    // Call OpenAI API with function calling
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: apiMessages,
      temperature: 0.7,
    });

    const responseMessage = response.choices[0].message;
    console.log("OpenAI response:", responseMessage);


    // If no function call was made, return the original response
    return new NextResponse(responseMessage.content, {
      headers: {
        'Content-Type': 'text/plain',
      }
    });
  } catch (e: any) {
    console.error("Error processing request:", e);
    return new NextResponse(`Error: ${e.message}`, { 
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      }
    });
  }
}
