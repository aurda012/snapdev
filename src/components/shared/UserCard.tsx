import { Models } from "appwrite";
import { Link } from "react-router-dom";

import { Button } from "../ui/button";
import {
  useFollowUser,
  useGetCurrentUser,
  useUnfollowUser,
} from "@/lib/react-query/queries";
import { useEffect, useState } from "react";
import { set } from "zod";

type UserCardProps = {
  user: Models.Document;
};

const UserCard = ({ user }: UserCardProps) => {
  const { data: currentUser } = useGetCurrentUser();
  const [isFollowing, setIsFollowing] = useState(false);

  const { mutate: followUser } = useFollowUser();
  const { mutate: unfollowUser } = useUnfollowUser();

  const followingRecord = currentUser?.follows.find(
    (record: Models.Document) => record.following.$id === user.$id
  );

  useEffect(() => {
    setIsFollowing(!!followingRecord);
  }, [currentUser]);

  const handleFollowUser = () => {
    if (currentUser) {
      if (followingRecord) {
        unfollowUser(followingRecord.$id);
        return setIsFollowing(false);
      }

      followUser({ follower: currentUser.$id, following: user.$id });
      setIsFollowing(true);
    }
  };

  return (
    <div className="user-card">
      <Link to={`/profile/${user.$id}`}>
        <img
          src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
          alt="creator"
          className="rounded-full w-14 h-14 mx-auto mb-3"
        />

        <div className="flex-center flex-col gap-1">
          <p className="base-medium text-light-1 text-center line-clamp-1">
            {user.name}
          </p>
          <p className="small-regular text-light-3 text-center line-clamp-1">
            @{user.username}
          </p>
        </div>
      </Link>

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
    </div>
  );
};

export default UserCard;
