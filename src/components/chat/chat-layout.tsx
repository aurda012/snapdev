"use client";

import { userData } from "@/lib/data";
import React, { useEffect, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import { Sidebar } from "./chat-sidebar";
import { Chat } from "./chat";
import { Models } from "appwrite";
import { IUser } from "@/types";

interface ChatLayoutProps {
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
  chats: Models.Document[];
  user: Models.Document;
}

export function ChatLayout({
  defaultLayout = [320, 480],
  defaultCollapsed = false,
  navCollapsedSize,
  chats,
  user,
}: ChatLayoutProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const [selectedChat, setSelectedChat] = React.useState<Models.Document>(
    chats[0]
  );
  const [isMobile, setIsMobile] = useState(false);

  const currentUser = {
    id: user.$id,
    name: user.name,
    username: user.username,
    email: user.email,
    imageUrl: user.imageUrl,
  } as IUser;

  useEffect(() => {
    const checkScreenWidth = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check
    checkScreenWidth();

    // Event listener for screen width changes
    window.addEventListener("resize", checkScreenWidth);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", checkScreenWidth);
    };
  }, []);

  const handleSelectChat = (chat: string) => {
    setSelectedChat((prev) => {
      let newChat = chats.find((c) => c.$id === chat);
      return { ...newChat, messages: newChat?.messages ?? [] };
    });
  };

  return (
    <ResizablePanelGroup
      direction="horizontal"
      onLayout={(sizes: number[]) => {
        document.cookie = `react-resizable-panels:layout=${JSON.stringify(
          sizes
        )}`;
      }}
      className="h-full items-stretch "
    >
      <ResizablePanel
        defaultSize={defaultLayout[0]}
        collapsedSize={navCollapsedSize}
        collapsible={true}
        minSize={isMobile ? 0 : 24}
        maxSize={isMobile ? 8 : 30}
        onCollapse={() => {
          setIsCollapsed(true);
          document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
            true
          )}`;
        }}
        onExpand={() => {
          setIsCollapsed(false);
          document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
            false
          )}`;
        }}
        className={cn(
          isCollapsed &&
            "min-w-[50px] md:min-w-[70px] transition-all duration-300 ease-in-out"
        )}
      >
        <Sidebar
          isCollapsed={isCollapsed || isMobile}
          links={chats.map((chat) => ({
            name: chat.name,
            messages: chat.messages ?? [],
            avatar: chat.avatar,
            variant: selectedChat.name === chat.name ? "grey" : "ghost",
            id: chat.$id,
          }))}
          isMobile={isMobile}
          setSelectedChat={handleSelectChat}
        />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
        <Chat
          selectedChat={selectedChat}
          isMobile={isMobile}
          currentUser={currentUser}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
