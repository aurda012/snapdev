import { ChatLayout } from "@/components/chat/chat-layout";
import { Loader } from "@/components/shared";
import { useGetChats, useGetCurrentUser } from "@/lib/react-query/queries";

const Chats = () => {
  const { data: currentUser, isLoading: isLoadingUser } = useGetCurrentUser();

  const { data: chats, isLoading } = useGetChats(
    currentUser?.chats || [],
    currentUser?.$id
  );

  const defaultLayout = undefined;

  return (
    <div className="common-container">
      <h2 className="h3-bold md:h2-bold text-left w-full">Chats</h2>
      {isLoading || isLoadingUser ? (
        <Loader />
      ) : (
        <div className="z-10 user-card rounded-lg max-w-5xl w-full h-[80vh] text-sm lg:flex">
          <ChatLayout
            defaultLayout={defaultLayout}
            navCollapsedSize={8}
            chats={chats}
            user={currentUser}
          />
        </div>
      )}
    </div>
  );
};
export default Chats;
