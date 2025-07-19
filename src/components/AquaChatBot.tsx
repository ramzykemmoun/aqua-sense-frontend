import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { MastraClient } from "@mastra/client-js";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
};

const baseUrl =
  import.meta.env.NEXT_MASTRA_API_URL! || "http://192.168.137.1:4111";

const client = new MastraClient({
  baseUrl,
});

const MarkdownRenderer = ({ content }: { content: string }) => {
  const renderMarkdown = (text: string) => {
    let html = text
      .replace(
        /^### (.*$)/gim,
        '<h3 class="text-lg font-semibold mt-3 mb-2">$1</h3>'
      )
      .replace(
        /^## (.*$)/gim,
        '<h2 class="text-xl font-bold mt-4 mb-2">$1</h2>'
      )
      .replace(
        /^# (.*$)/gim,
        '<h1 class="text-2xl font-bold mt-4 mb-3">$1</h1>'
      )
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/```[\s\S]*?```/g, (match) => {
        const code = match.replace(/```/g, "").trim();
        return `<pre class="bg-gray-100 dark:bg-gray-800 p-2 rounded mt-2 mb-2 overflow-x-auto"><code class="text-sm">${code}</code></pre>`;
      })
      .replace(
        /`([^`]+)`/g,
        '<code class="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm">$1</code>'
      )
      .replace(/^\* (.*)$/gim, '<li class="ml-4">• $1</li>')
      .replace(/^- (.*)$/gim, '<li class="ml-4">• $1</li>')
      .replace(/\n/g, "<br />");

    return html;
  };

  return (
    <div
      className="prose prose-sm max-w-none dark:prose-invert"
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  );
};

const FloatingRobot = ({ onClick }: { onClick: () => void }) => {
  return (
    <div
      onClick={onClick}
      className="relative cursor-pointer transform hover:scale-110 transition-all duration-300 animate-bounce"
      style={{
        animation:
          "float 3s ease-in-out infinite, glow 2s ease-in-out infinite alternate",
      }}
    >
      <div className="relative w-16 h-20">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg shadow-lg border-2 border-blue-300">
          <div className="absolute top-2 left-1.5 w-2 h-2 bg-cyan-300 rounded-full animate-pulse"></div>
          <div className="absolute top-2 right-1.5 w-2 h-2 bg-cyan-300 rounded-full animate-pulse"></div>
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0.5 h-2 bg-gray-400"></div>
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-red-400 rounded-full animate-ping"></div>
        </div>
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-12 h-10 bg-gradient-to-br from-gray-300 to-gray-500 rounded-lg shadow-lg border-2 border-gray-200">
          <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-8 h-6 bg-gradient-to-br from-blue-100 to-blue-200 rounded border border-blue-300">
            <div className="absolute top-1 left-1 w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
            <div
              className="absolute top-1 right-1 w-1 h-1 bg-yellow-400 rounded-full animate-pulse"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-0.5 bg-blue-400 rounded"></div>
          </div>
        </div>

        <div className="absolute top-10 left-0 w-3 h-6 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full shadow-md transform rotate-12"></div>
        <div className="absolute top-10 right-0 w-3 h-6 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full shadow-md transform -rotate-12"></div>
      </div>
      <div className="absolute -top-2 -left-2 w-1 h-1 bg-blue-300 rounded-full animate-ping opacity-75"></div>
      <div
        className="absolute -top-1 -right-1 w-0.5 h-0.5 bg-cyan-300 rounded-full animate-ping opacity-75"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute -bottom-1 -left-1 w-0.5 h-0.5 bg-blue-400 rounded-full animate-ping opacity-75"
        style={{ animationDelay: "2s" }}
      ></div>
    </div>
  );
};

export default function AquaChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm your AquaSense assistant. How can I help you with your aquaculture management today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue("");
    setIsLoading(true);

    try {
      const agent = client.getAgent("aquaAgent");

      const conversationHistory = messages.concat(userMessage).map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const assistantMessageId = (Date.now() + 1).toString();
      const assistantMessage: Message = {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
        isStreaming: true,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      try {
        const response = await agent.generate({
          messages: conversationHistory,
        });

        let fullContent = "";

        if (response && response.text) {
          fullContent = response.text;

          const words = fullContent.split(" ");
          let streamedContent = "";

          for (let i = 0; i < words.length; i++) {
            await new Promise((resolve) => setTimeout(resolve, 50));
            streamedContent += (i > 0 ? " " : "") + words[i];

            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessageId
                  ? { ...msg, content: streamedContent }
                  : msg
              )
            );
          }
        } else {
          fullContent = "Sorry, I couldn't process your request.";
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? { ...msg, content: fullContent }
                : msg
            )
          );
        }

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId ? { ...msg, isStreaming: false } : msg
          )
        );
      } catch (mastraError) {
        console.log("Mastra not available, using fallback responses");

        // Fallback responses for aquaculture with markdown formatting
        const responses = [
          `## Water Quality Analysis for "${currentInput}"

I can help you monitor your pond's **key parameters**:
- **Temperature**: 23-26°C optimal
- **pH**: 6.8-7.5 range
- **Dissolved Oxygen**: >5mg/L critical

*Regular monitoring ensures healthy fish growth.*`,

          `### Fish Health Recommendations

Based on your question, here are **essential guidelines**:
- Keep water temperature between **23-26°C**
- Maintain pH between **6.8-7.5**
- Monitor \`dissolved oxygen\` levels daily

*Proper conditions = healthier fish!*`,

          `## Aeration System Check

For optimal results:
1. **Check oxygen levels** - should be >5mg/L
2. **Inspect air stones** for blockages
3. **Verify pump operation** runs 24/7

\`Good aeration is crucial for fish health\``,

          `### Feeding Schedule Guidelines

**Temperature-based feeding**:
- **Cold water** (15-20°C): Feed once daily
- **Optimal temp** (23-26°C): Feed 2-3 times daily
- **Warm water** (>26°C): Reduce feeding frequency

*Adjust portions based on fish response*`,

          `## Sensor Calibration Guide

**Important calibration steps**:
1. **pH sensors**: Weekly calibration
2. **Temperature probes**: Monthly check
3. **DO sensors**: Bi-weekly cleaning

Would you like detailed \`calibration procedures\`?`,

          `### Daily Water Testing Protocol

**Essential parameters to monitor**:
- Temperature (**daily**)
- pH level (**daily**)
- Dissolved oxygen (**daily**)
- Ammonia levels (**weekly**)

*Consistent testing prevents problems before they start*`,

          `## Algae Growth Management

**High algae indicates**:
- Excess nutrients in water
- Overfeeding issues
- Poor filtration

**Solutions**:
1. Reduce feeding amounts
2. Check filtration system
3. Test nitrogen levels

\`Balance is key to healthy pond ecosystem\``,
        ];

        const contextualResponse =
          responses[Math.floor(Math.random() * responses.length)];

        let streamedContent = "";
        const words = contextualResponse.split(" ");

        for (let i = 0; i < words.length; i++) {
          await new Promise((resolve) => setTimeout(resolve, 50)); // Simulate typing
          streamedContent += (i > 0 ? " " : "") + words[i];

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? { ...msg, content: streamedContent }
                : msg
            )
          );
        }

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId ? { ...msg, isStreaming: false } : msg
          )
        );
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content:
          "Sorry, I'm having trouble connecting right now. Please try again later.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && <FloatingRobot onClick={() => setIsOpen(true)} />}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-10px) rotate(1deg); }
            66% { transform: translateY(-5px) rotate(-1deg); }
          }
          @keyframes glow {
            0% { filter: drop-shadow(0 0 5px rgba(59, 130, 246, 0.5)); }
            100% { filter: drop-shadow(0 0 15px rgba(59, 130, 246, 0.8)) drop-shadow(0 0 25px rgba(59, 130, 246, 0.4)); }
          }
        `,
        }}
      />
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
          <Card className="h-full flex flex-col border-2 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-t-lg flex-shrink-0">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Bot className="h-5 w-5 animate-pulse" />
                AquaSense Assistant
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-primary-foreground hover:bg-primary-foreground/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0 min-h-0">
              <ScrollArea className="flex-1 p-4 max-h-[450px]">
                <div className="space-y-4 pr-2">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] rounded-lg px-3 py-2 transition-all duration-200 ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "bg-muted text-foreground shadow-sm border"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {message.role === "assistant" && (
                            <Bot
                              className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                                message.isStreaming ? "animate-pulse" : ""
                              }`}
                            />
                          )}
                          {message.role === "user" && (
                            <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          )}
                          <div className="text-sm overflow-hidden">
                            {message.role === "assistant" ? (
                              <MarkdownRenderer content={message.content} />
                            ) : (
                              <div>{message.content}</div>
                            )}
                            {message.isStreaming && (
                              <span className="inline-block w-2 h-4 bg-current animate-pulse ml-1">
                                |
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-muted text-muted-foreground rounded-lg px-3 py-2 border">
                        <div className="flex items-center gap-2">
                          <Bot className="h-4 w-4 animate-pulse" />
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-current rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-current rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <div className="border-t bg-background/50 p-4 flex-shrink-0">
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about your ponds, fish, water quality..."
                    className="flex-1 focus:ring-2 focus:ring-primary/20"
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    size="sm"
                    className="transition-all duration-200"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground mt-2 text-center">
                  Powered by AquaSense AI
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
