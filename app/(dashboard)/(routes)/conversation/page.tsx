"use client";

import * as z from "zod";
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Heading } from "@/components/heading";
import { MessageSquare } from "lucide-react";
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { formSchema } from "./constants";

type ChatCompletionRequestMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

const ConversationPage = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<number | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { prompt: "" }
  });

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const cleanText = (text: string): string => {
    const lines = text.split('\n');
    const cleanedLines = lines.map(line => {
      const match = line.match(/^\d+:"(.*)"/);
      return match ? match[1] : '';
    });
    return cleanedLines.join('')
      .replace(/\\n/g, ' ')
      .replace(/\\/g, '')
      .replace(/\*/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);

      const userMessage: ChatCompletionRequestMessage = {
        role: "user",
        content: values.prompt,
      };

      const newMessages = [...messages, userMessage];
      setMessages(newMessages);

      abortControllerRef.current = new AbortController();

      const response = await fetch("/api/conversation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: newMessages }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Failed to get reader from response body");
      }

      const decoder = new TextDecoder("utf-8");
      let done = false;
      let accumulatedResponse = "";

      setMessages((currentMessages) => [
        ...currentMessages,
        { role: "assistant", content: "" },
      ]);

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value, { stream: true });

        accumulatedResponse += chunkValue;
        const cleanedResponse = cleanText(accumulatedResponse);

        setMessages((currentMessages) => [
          ...currentMessages.slice(0, -1),
          { role: "assistant", content: cleanedResponse },
        ]);
      }

      form.reset();
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.log("Fetch aborted");
      } else {
        console.error("Error:", error);
      }
    } finally {
      setIsLoading(false);
      router.refresh();
    }
  };

  const handleCopy = (text: string, messageId: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedMessageId(messageId);
      setTimeout(() => {
        setCopiedMessageId(null);
      }, 2000);
    }).catch((error) => {
      console.error('Failed to copy text: ', error);
    });
  };

  return (
    <div>
      <Heading
        title="Conversation"
        description="Our Most Advanced Conversation Model"
        icon={MessageSquare}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="Message Genius"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button className="col-span-12 lg:col-span-2 w-full" disabled={isLoading}>
                Generate
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-4">
          <div className="flex flex-col-reverse gap-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`p-8 w-full flex items-start gap-x-8 rounded-lg ${message.role === 'user' ? 'bg-white border border-black/10' : 'bg-muted'}`}>
                {message.role === 'user' ? (
                  <>{message.content}</>
                ) : (
                  <div className="flex flex-col items-start relative">
                    <div className="flex items-center mb-2">
                      <Image src="/logo.png" alt="Genius Logo" width={24} height={24} className="mr-2" />
                      <h4 className="font-bold">Genius</h4>
                    </div>
                    <span>{message.content}</span>
                    <button
                      className={`absolute -bottom-6 -right-6 bg-gray-200 px-2 py-1 rounded text-sm hover:bg-gray-300 ${copiedMessageId === index ? 'bg-green-200' : ''}`}
                      onClick={() => handleCopy(message.content, index)}
                    >
                      {copiedMessageId === index ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationPage;
