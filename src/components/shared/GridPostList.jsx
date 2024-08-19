import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

import { PostStats } from "@/components/shared";
import { useUserContext } from "@/context/AuthContext";

/**
 * GridPostList component
 * @param {Object} props
 * @param {Array} props.posts - Array of post objects
 * @param {boolean} [props.showUser=true] - Whether to show user information
 * @param {boolean} [props.showStats=true] - Whether to show post statistics
 * @returns {JSX.Element}
 */
const GridPostList = ({ posts, showUser = true, showStats = true }) => {
  const { user } = useUserContext();

  return (
    <ul className="grid-container">
      {posts.map((post) => (
        <li key={post.$id} className="relative min-w-80 h-80">
          <Link to={`/posts/${post.$id}`} className="grid-post_link">
            <img
              src={post.imageUrl}
              alt="post"
              className="h-full w-full object-cover"
            />
          </Link>

          <div className="grid-post_user">
            {showUser && (
              <div className="flex items-center justify-start gap-2 flex-1">
                <img
                  src={
                    post.creator.imageUrl ||
                    "/assets/icons/profile-placeholder.svg"
                  }
                  alt="creator"
                  className="w-8 h-8 rounded-full"
                />
                <p className="line-clamp-1">{post.creator.name}</p>
              </div>
            )}
            {showStats && <PostStats post={post} userId={user.id} />}
          </div>
        </li>
      ))}
    </ul>
  );
};

GridPostList.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.shape({
    $id: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    creator: PropTypes.shape({
      imageUrl: PropTypes.string,
      name: PropTypes.string.isRequired
    }).isRequired
  })).isRequired,
  showUser: PropTypes.bool,
  showStats: PropTypes.bool
};

export default GridPostList;