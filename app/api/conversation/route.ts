import { NextResponse } from 'next/server';
import { StreamingTextResponse, LangChainStream } from 'ai';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, AIMessage } from '@langchain/core/messages';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const { stream, handlers } = LangChainStream();

    const llm = new ChatOpenAI({
      modelName: "llama3-8b-8192",
      streaming: true,
      temperature: 1,
      maxTokens: 1024,
      topP: 1,
      callbacks: [handlers],
      openAIApiKey: process.env.GROQ_API_KEY,
      configuration: {
        baseURL: "https://api.groq.com/openai/v1",
      },
    });

    const langchainMessages = messages.map((message: any) => 
      message.role === 'user' ? new HumanMessage(message.content) : new AIMessage(message.content)
    );

    llm.call(langchainMessages);

    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}