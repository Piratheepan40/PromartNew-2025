import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { toast } from "sonner";

interface Message {
    role: "user" | "model";
    parts: { text: string }[];
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "model",
            parts: [{ text: "Hello! I'm the ProMart Assistant. How can I help you today?" }],
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            role: "user",
            parts: [{ text: input.trim() }],
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const { data } = await axios.post(`${API_URL}/ai/chat`, {
                message: userMessage.parts[0].text,
                history: messages.map(m => ({
                    role: m.role,
                    parts: m.parts
                })),
            });

            const botMessage: Message = {
                role: "model",
                parts: [{ text: data.text }],
            };

            setMessages((prev) => [...prev, botMessage]);
        } catch (error: any) {
            console.error("Chatbot error:", error);
            const errorMessage = error.response?.data?.message || "Failed to get response";
            toast.error(errorMessage);

            setMessages((prev) => [
                ...prev,
                {
                    role: "model",
                    parts: [{ text: "Sorry, I'm having trouble connecting right now. Please try again later." }],
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="mb-4 flex h-[500px] w-[350px] flex-col overflow-hidden rounded-2xl border bg-background shadow-2xl sm:w-[400px]"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between bg-primary p-4 text-primary-foreground">
                            <div className="flex items-center gap-2">
                                <div className="rounded-full bg-primary-foreground/20 p-1.5">
                                    <Bot size={20} />
                                </div>
                                <div>
                                    <h3 className="font-semibold leading-none">ProMart AI</h3>
                                    <p className="text-xs opacity-80">Online & Ready to help</p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-primary-foreground hover:bg-white/10"
                                onClick={() => setIsOpen(false)}
                            >
                                <X size={20} />
                            </Button>
                        </div>

                        {/* Messages */}
                        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                            <div className="space-y-4">
                                {messages.map((msg, i) => (
                                    <div
                                        key={i}
                                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
                                            }`}
                                    >
                                        <div
                                            className={`flex max-w-[80%] items-start gap-2 rounded-2xl p-3 text-sm ${msg.role === "user"
                                                ? "bg-primary text-primary-foreground rounded-tr-none"
                                                : "bg-muted text-foreground rounded-tl-none border"
                                                }`}
                                        >
                                            {msg.role === "model" && <Bot size={16} className="mt-0.5 shrink-0 opacity-50" />}
                                            <p className="whitespace-pre-wrap">{msg.parts[0].text}</p>
                                            {msg.role === "user" && <User size={16} className="mt-0.5 shrink-0 opacity-50" />}
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="bg-muted text-foreground rounded-2xl rounded-tl-none border p-3">
                                            <Loader2 size={16} className="animate-spin opacity-50" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>

                        {/* Input */}
                        <div className="border-t p-4">
                            <form
                                className="flex items-center gap-2"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSend();
                                }}
                            >
                                <Input
                                    placeholder="Type your message..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    className="flex-1"
                                    disabled={isLoading}
                                />
                                <Button size="icon" type="submit" disabled={!input.trim() || isLoading}>
                                    <Send size={18} />
                                </Button>
                            </form>
                            <p className="mt-2 text-center text-[10px] text-muted-foreground">
                                Powered by Promart • 100% Free Support
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Button
                size="icon"
                className="h-14 w-14 rounded-full shadow-lg"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </Button>
        </div>
    );
};

export default Chatbot;
