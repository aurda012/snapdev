import { Message, UserData } from "@/lib/data";
import ChatTopbar from "./chat-topbar";
import { ChatList } from "./chat-list";
import React from "react";
import { Models } from "appwrite";
import { IUser } from "@/types";
import { useCreateMessage } from "@/lib/react-query/queries";

interface ChatProps {
  messages?: Message[];
  selectedChat: Models.Document;
  isMobile: boolean;
  currentUser: IUser;
}

export function Chat({
  messages,
  selectedChat,
  isMobile,
  currentUser,
}: ChatProps) {
  const [messagesState, setMessages] = React.useState<Message[]>(
    messages ?? []
  );

  const { data: message, mutate: createMessage } = useCreateMessage(
    selectedChat.$id
  );

  const sendMessage = (newMessage: Message) => {
    createMessage(newMessage);
    setMessages([...messagesState, newMessage]);
  };

  return (
    <div className="flex flex-col justify-between w-full h-full">
      <ChatTopbar selectedChat={selectedChat} />

      <ChatList
        messages={messagesState}
        selectedChat={selectedChat}
        currentUser={currentUser}
        sendMessage={sendMessage}
        isMobile={isMobile}
      />
    </div>
  );
}
