import { Message, UserData } from "@/lib/data";
import { cn } from "@/lib/utils";
import React, { useRef } from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import ChatBottombar from "./chat-bottombar";
import { AnimatePresence, motion } from "framer-motion";
import { Models } from "appwrite";
import { IUser } from "@/types";

interface ChatListProps {
  messages?: Message[];
  selectedChat: Models.Document;
  sendMessage: (newMessage: Message) => void;
  isMobile: boolean;
  currentUser: IUser;
}

export function ChatList({
  messages,
  selectedChat,
  sendMessage,
  isMobile,
  currentUser,
}: ChatListProps) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col">
      <div
        ref={messagesContainerRef}
        className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col"
      >
        <AnimatePresence>
          {messages?.map((message, index) => (
            <motion.div
              key={index}
              layout
              initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
              transition={{
                opacity: { duration: 0.1 },
                layout: {
                  type: "spring",
                  bounce: 0.3,
                  duration: messages.indexOf(message) * 0.05 + 0.2,
                },
              }}
              style={{
                originX: 0.5,
                originY: 0.5,
              }}
              className={cn(
                "flex flex-col gap-2 p-4 whitespace-pre-wrap",
                message.userId === currentUser.id ? "items-end" : "items-start"
              )}
            >
              <div className="flex gap-3 items-center">
                {message.userId !== currentUser.id && (
                  <Avatar className="flex justify-center items-center">
                    <AvatarImage
                      src={selectedChat.avatar}
                      alt={selectedChat.name}
                      width={6}
                      height={6}
                    />
                  </Avatar>
                )}
                <span className=" bg-neutral-500 p-3 rounded-md max-w-xs">
                  {message.text}
                </span>
                {message.userId === currentUser.id && (
                  <Avatar className="flex justify-center items-center">
                    <AvatarImage
                      src={currentUser.imageUrl}
                      alt={currentUser.name}
                      width={6}
                      height={6}
                    />
                  </Avatar>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <ChatBottombar
        sendMessage={sendMessage}
        isMobile={isMobile}
        chatId={selectedChat.$id}
        userId={currentUser.id}
      />
    </div>
  );
}
