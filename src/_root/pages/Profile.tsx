import {
  Route,
  Routes,
  Link,
  Outlet,
  useParams,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { Button } from "@/components/ui";
import { LikedPosts } from "@/_root/pages";
import { useUserContext } from "@/context/AuthContext";
import {
  useCreateChat,
  useFollowUser,
  useGetCurrentUser,
  useGetUserById,
  useUnfollowUser,
} from "@/lib/react-query/queries";
import { GridPostList, Loader } from "@/components/shared";
import { useEffect, useState } from "react";
import { Models } from "appwrite";
import { createChat, getChatByUser } from "@/lib/appwrite/api";
import { checkIfChatExists } from "@/lib/utils";

interface StabBlockProps {
  value: string | number;
  label: string;
}

const StatBlock = ({ value, label }: StabBlockProps) => (
  <div className="flex-center gap-2">
    <p className="small-semibold lg:body-bold text-primary-500">{value}</p>
    <p className="small-medium lg:base-medium text-light-2">{label}</p>
  </div>
);

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: user } = useGetCurrentUser();
  const { pathname } = useLocation();
  const [isFollowing, setIsFollowing] = useState(false);

  const { mutate: followUser } = useFollowUser();
  const { mutate: unfollowUser } = useUnfollowUser();
  // const { mutate: createChat } = useCreateChat();

  const { data: currentUser } = useGetUserById(id || "");

  const followingRecord = user?.follows.find(
    (record: Models.Document) => record.following.$id === currentUser?.$id
  );

  const existingChat = checkIfChatExists(user?.chats || [], currentUser?.$id);

  useEffect(() => {
    setIsFollowing(!!followingRecord);
  }, [user, currentUser]);

  const handleFollowUser = () => {
    if (user && currentUser) {
      if (followingRecord) {
        unfollowUser(followingRecord.$id);
        return setIsFollowing(false);
      }

      followUser({ follower: user.$id, following: currentUser.$id });
      setIsFollowing(true);
    }
  };

  const handleCreateChat = async () => {
    if (currentUser?.$id && user?.$id) {
      if (existingChat) {
        console.log("Chat exists", existingChat);
        navigate(`/chats`);
        return;
      }
      await createChat([currentUser.$id, user.$id]);
      navigate(`/chats`);
    }
  };

  if (!currentUser || !user)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <div className="profile-container">
      <div className="profile-inner_container">
        <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
          <img
            src={
              currentUser.imageUrl || "/assets/icons/profile-placeholder.svg"
            }
            alt="profile"
            className="w-28 h-28 lg:h-36 lg:w-36 rounded-full"
          />
          <div className="flex flex-col flex-1 justify-between md:mt-2">
            <div className="flex flex-col w-full">
              <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">
                {currentUser.name}
              </h1>
              <p className="small-regular md:body-medium text-light-3 text-center xl:text-left">
                @{currentUser.username}
              </p>
            </div>

            <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
              <StatBlock value={currentUser.posts.length} label="Posts" />
              <StatBlock
                value={currentUser.followers.length}
                label="Followers"
              />
              <StatBlock value={currentUser.follows.length} label="Following" />
            </div>

            <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
              {currentUser.bio}
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <div className={`${id !== user.$id && "hidden"}`}>
              <Link
                to={`/update-profile/${user.$id}`}
                className={`h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg ${
                  id !== user.$id && "hidden"
                }`}
              >
                <img
                  src={"/assets/icons/edit.svg"}
                  alt="edit"
                  width={20}
                  height={20}
                />
                <p className="flex whitespace-nowrap small-medium">
                  Edit Profile
                </p>
              </Link>
            </div>
            <div className={`${user.$id === id && "hidden"} flex`}>
              <Button
                type="button"
                size="sm"
                className={`${
                  isFollowing
                    ? "shad-button_dark border-primary border-2"
                    : "shad-button_primary"
                } px-5`}
                onClick={handleFollowUser}
              >
                {isFollowing ? "Following" : "Follow"}
              </Button>
              <Button
                type="button"
                size="sm"
                className="shad-button_dark border-primary border-2 px-5 ml-2"
                onClick={handleCreateChat}
              >
                Message
              </Button>
            </div>
          </div>
        </div>
      </div>

      {user.$id === id && (
        <div className="flex max-w-5xl w-full">
          <Link
            to={`/profile/${id}`}
            className={`profile-tab rounded-l-lg ${
              pathname === `/profile/${id}` && "!bg-dark-3"
            }`}
          >
            <img
              src={"/assets/icons/posts.svg"}
              alt="posts"
              width={20}
              height={20}
            />
            Posts
          </Link>
          <Link
            to={`/profile/${id}/liked-posts`}
            className={`profile-tab rounded-r-lg ${
              pathname === `/profile/${id}/liked-posts` && "!bg-dark-3"
            }`}
          >
            <img
              src={"/assets/icons/like.svg"}
              alt="like"
              width={20}
              height={20}
            />
            Liked Posts
          </Link>
        </div>
      )}

      <Routes>
        <Route
          index
          element={<GridPostList posts={currentUser.posts} showUser={false} />}
        />
        {currentUser.$id === user.$id && (
          <Route path="/liked-posts" element={<LikedPosts />} />
        )}
      </Routes>
      <Outlet />
    </div>
  );
};

export default Profile;
