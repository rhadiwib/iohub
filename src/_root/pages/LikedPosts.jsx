import PropTypes from 'prop-types';
import { GridPostList, Loader } from "@/components/shared";
import { useGetCurrentUser } from "@/lib/react-query/queries";

/**
 * LikedPosts component
 * @returns {JSX.Element}
 */
const LikedPosts = () => {
  const { data: currentUser } = useGetCurrentUser();

  if (!currentUser)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <>
      {currentUser.liked.length === 0 && (
        <p className="text-light-4">No liked posts</p>
      )}

      <GridPostList posts={currentUser.liked} showStats={false} />
    </>
  );
};

GridPostList.propTypes = {
  posts: PropTypes.array.isRequired,
  showStats: PropTypes.bool
};

export default LikedPosts;