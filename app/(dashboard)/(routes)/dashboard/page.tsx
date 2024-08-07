"use client";

import { Code, ImageIcon, MessageSquare, Music, VideoIcon, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const tools = [
  {
    label: "Conversation",
    icon: MessageSquare,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
    href: "/conversation",
  },
  {
    label: "Music Generation",
    icon: Music,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    href: "/music",
  },
  {
    label: "Image Generation",
    icon: ImageIcon,
    color: "text-pink-700",
    bgColor: "bg-pink-700/10",
    href: "/image",
  },
  {
    label: "Video Generation",
    icon: VideoIcon,
    color: "text-orange-700",
    bgColor: "bg-orange-700/10",
    href: "/video",
  },
  {
    label: "Code Generation",
    icon: Code,
    color: "text-green-700",
    bgColor: "bg-green-700/10",
    href: "/code",
  },
];

const DashboardPage = () => {
  const router = useRouter();
  return (
    <>
      <div className="mb-8 space-y-4">
        <h2 className="text-2xl font-bold text-center md:text-4xl">
          Explore the power of AI
        </h2>
        <p className="text-sm font-light text-center text-muted-foreground md:text-lg">
          Chat with Genius - Unleash the potential of AI
        </p>
      </div>

      <div className="px-4 md:px-20 lg:px-32 space-y-4">
        {tools.map((tool, index) => (
          <a
            key={index}
            href={tool.href}
            className="flex items-center justify-between p-4 rounded-lg bg-white shadow"
          >
            <div className="flex items-center">
              <div className={`p-2 rounded ${tool.bgColor}`}>
                <tool.icon className={`w-6 h-6 ${tool.color}`} />
              </div>
              <span className="ml-4 text-lg font-medium">{tool.label}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-500" />
          </a>
        ))}
      </div>
    </>
  );
};

export default DashboardPage;
