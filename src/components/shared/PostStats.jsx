import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { useLocation } from "react-router-dom";

import { checkIsLiked } from "@/lib/utils";
import {
  useLikePost,
  useSavePost,
  useDeleteSavedPost,
  useGetCurrentUser,
} from "@/lib/react-query/queries";

const PostStats = ({ post, userId }) => {
  const location = useLocation();
  const likesList = post.likes.map((user) => user.$id);

  const [likes, setLikes] = useState(likesList);
  const [isSaved, setIsSaved] = useState(false);

  const { mutate: likePost } = useLikePost();
  const { mutate: savePost } = useSavePost();
  const { mutate: deleteSavePost } = useDeleteSavedPost();

  const { data: currentUser } = useGetCurrentUser();

  useEffect(() => {
    if (currentUser && currentUser.save) {
      const savedPostRecord = currentUser.save.find(
        (record) => record.post.$id === post.$id
      );
      setIsSaved(!!savedPostRecord);
    }
  }, [currentUser, post.$id]);

  const handleLikePost = (e) => {
    e.stopPropagation();

    let newLikes = [...likes];

    if (newLikes.includes(userId)) {
      newLikes = newLikes.filter((id) => id !== userId);
    } else {
      newLikes.push(userId);
    }

    setLikes(newLikes);
    likePost({ postId: post.$id, likesArray: newLikes });
  };

  const handleSavePost = (e) => {
    e.stopPropagation();

    if (isSaved) {
      setIsSaved(false);
      deleteSavePost(currentUser?.save.find((record) => record.post.$id === post.$id)?.$id);
    } else {
      savePost({ userId: userId, postId: post.$id });
      setIsSaved(true);
    }
  };

  const containerStyles = location.pathname.startsWith("/profile")
    ? "w-full"
    : "";

  return (
    <div className={`flex justify-between items-center z-20 ${containerStyles}`}>
      <div className="flex gap-2 mr-5">
        <img
          src={checkIsLiked(likes, userId) ? "/assets/icons/liked.svg" : "/assets/icons/like.svg"}
          alt="like"
          width={20}
          height={20}
          onClick={handleLikePost}
          className="cursor-pointer"
        />
        <p className="small-medium lg:base-medium">{likes.length}</p>
      </div>

      <div className="flex gap-2">
        <img
          src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
          alt="save"
          width={20}
          height={20}
          className="cursor-pointer"
          onClick={handleSavePost}
        />
      </div>
    </div>
  );
};

PostStats.propTypes = {
  post: PropTypes.shape({
    $id: PropTypes.string.isRequired,
    likes: PropTypes.arrayOf(PropTypes.shape({
      $id: PropTypes.string.isRequired,
    })).isRequired,
  }).isRequired,
  userId: PropTypes.string.isRequired,
};

export default PostStats;