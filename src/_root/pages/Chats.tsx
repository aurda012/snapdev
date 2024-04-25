import { ChatLayout } from "@/components/chat/chat-layout";
import { Loader } from "@/components/shared";

const Chats = () => {
  const defaultLayout = undefined;

  const isLoading = false;
  return (
    <div className="common-container">
      <h2 className="h3-bold md:h2-bold text-left w-full">Chats</h2>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="z-10 user-card rounded-lg max-w-5xl w-full h-[80vh] text-sm lg:flex">
          <ChatLayout defaultLayout={defaultLayout} navCollapsedSize={8} />
        </div>
      )}
    </div>
  );
};
export default Chats;
