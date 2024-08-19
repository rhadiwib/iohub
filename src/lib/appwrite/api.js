import {ID, Query} from "appwrite";
import {account, appwriteConfig, avatars, databases, storage} from "./config";

/** ============== **/
/** Helper Functions **/
/** ============== **/
// Error handling utility
const handleError = (error, customMessage = "") => {
  console.error(customMessage, error);
  throw error;
};

// Generic document creation
const createDocument = async (collectionId, data) => {
  try {
    return await databases.createDocument(
        appwriteConfig.databaseId,
        collectionId,
        ID.unique(),
        data
    );
  } catch (error) {
    handleError(error, `Failed to create document in ${collectionId}`);
  }
};

// Generic document update
const updateDocument = async (collectionId, documentId, data) => {
  try {
    return await databases.updateDocument(
        appwriteConfig.databaseId,
        collectionId,
        documentId,
        data
    );
  } catch (error) {
    handleError(error, `Failed to update document in ${collectionId}`);
  }
};

// Generic document deletion
const deleteDocument = async (collectionId, documentId) => {
  try {
    return await databases.deleteDocument(
        appwriteConfig.databaseId,
        collectionId,
        documentId
    );
  } catch (error) {
    handleError(error, `Failed to delete document in ${collectionId}`);
  }
};

/** ============== **/
/** Authentication **/
/** ============== **/

// SIGN UP
export async function createUserAccount(user) {
  try {
    const newAccount = await account.create(
        ID.unique(),
        user.email,
        user.password,
        user.name
    );
    if (!newAccount) throw new Error("Failed to create account");

    const avatarUrl = avatars.getInitials(user.name);
    return saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.username,
      imageUrl: avatarUrl,
    });
  } catch (error) {
    return handleError(error, "Failed to create user account");
  }
}

// SAVE USER TO DB
export const saveUserToDB = (user) => createDocument(
    appwriteConfig.userCollectionId,
    user);

// SIGN IN
export const signInAccount = async (user) => {
  try {
    return await account.createEmailPasswordSession(user.email, user.password);
  } catch (error) {
    handleError(error, "Error in signInAccount");
  }
};

// GET ACCOUNT
export const getAccount = async () => {
  try {
    return await account.get();
  } catch (error) {
    handleError(error, "Error in getAccount");
  }
};

// GET USER
export const getCurrentUser = async () => {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw new Error("No current account");

    const currentUser = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [Query.equal("accountId", currentAccount.$id)]
    );
    if (!currentUser) throw new Error("No current user");

    return currentUser.documents[0];
  } catch (error) {
    handleError(error, "Error in getCurrentUser");
  }
};

// SIGN OUT
export const signOutAccount = async () => {
  try {
    return await account.deleteSession("current");
  } catch (error) {
    handleError(error, "Error in signOutAccount");
  }
};

// ========
// POSTS
// ========

// UPLOAD FILE
export const uploadFile = async (file) => {
  try {
    return await storage.createFile(appwriteConfig.storageId, ID.unique(), file);
  } catch (error) {
    handleError(error, "Error in uploadFile");
  }
};

// GET FILE URL
export const getFilePreview = (fileId) => {
  try {
    return storage.getFilePreview(
        appwriteConfig.storageId,
        fileId,
        2000,
        2000,
        "top",
        100
    );
  } catch (error) {
    handleError(error, "Error in getFilePreview");
  }
};

// DELETE FILE
export const deleteFile = async (fileId) => {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);
    return { status: "ok" };
  } catch (error) {
    handleError(error, "Error in deleteFile");
  }
};

// POST HANDLING
export const createPost = async (post) => {
  try {
    const uploadedFile = await uploadFile(post.file[0]);
    if (!uploadedFile) throw new Error("Failed to upload file");

    const fileUrl = getFilePreview(uploadedFile.$id);
    if (!fileUrl) {
      await deleteFile(uploadedFile.$id);
      throw new Error("Failed to get file preview");
    }

    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // expiration time (24 hours from now)
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const newPost = await createDocument(
      appwriteConfig.postCollectionId,
        {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags,
        expiresAt: expiresAt, // expiration time
    });

    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      throw new Error("Failed to create post");
    }

    return newPost;
  } catch (error) {
    handleError(error, "Error in createPost");
  }
};

// GET POSTS
export const searchPosts = async (searchTerm) => {
  try {
    const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        [Query.search("caption", searchTerm)]
    );
    if (!posts) throw new Error("Failed to fetch posts");
    return posts;
  } catch (error) {
    handleError(error, "Error in searchPosts");
  }
};

// GET INFINITE SCROLL
export const getInfinitePosts = async ({ pageParam }) => {
  const queries = [Query.orderDesc("$updatedAt"), Query.limit(9)];
  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }

  try {
    const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        queries
    );
    if (!posts) throw new Error("Failed to fetch posts");
    return posts;
  } catch (error) {
    handleError(error, "Error in getInfinitePosts");
  }
};


// GET POST BY ID
export const getPostById = async (postId) => {
  try {
    const post = await databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        postId
    );
    if (!post) throw new Error("Post not found");
    return post;
  } catch (error) {
    handleError(error, "Error in getPostById");
  }
};

// UPDATE POST
export const updatePost = async (post) => {
  const hasFileToUpdate = post.file.length > 0;
  let image = { imageUrl: post.imageUrl, imageId: post.imageId };

  try {
    if (hasFileToUpdate) {
      const uploadedFile = await uploadFile(post.file[0]);
      if (!uploadedFile) throw new Error("Failed to upload new file");

      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw new Error("Failed to get new file preview");
      }

      image = { imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    const updatedPost = await updateDocument(
        appwriteConfig.postCollectionId,
        post.postId,
        {
          caption: post.caption,
          imageUrl: image.imageUrl,
          imageId: image.imageId,
          location: post.location,
          tags: tags,
        }
    );

    if (!updatedPost) {
      if (hasFileToUpdate) await deleteFile(image.imageId);
      throw new Error("Failed to update post");
    }

    if (hasFileToUpdate) await deleteFile(post.imageId);

    return updatedPost;
  } catch (error) {
    handleError(error, "Error in updatePost");
  }
};

// DELETE POST
export const deletePost = async (postId, imageId) => {
  if (!postId || !imageId) return;
  try {
    const status = await deleteDocument(appwriteConfig.postCollectionId, postId);
    if (!status) throw new Error("Failed to delete post");
    await deleteFile(imageId);
    return { status: "Ok" };
  } catch (error) {
    handleError(error, "Error in deletePost");
  }
};

// LIKE / UNLIKE POST
export const likePost = async (postId, likesArray) => {
  try {
    const updatedPost = await updateDocument(
        appwriteConfig.postCollectionId,
        postId,
        { likes: likesArray }
    );
    if (!updatedPost) throw new Error("Failed to update post likes");
    return updatedPost;
  } catch (error) {
    handleError(error, "Error in likePost");
  }
};

// SAVE POST
export const savePost = async (userId, postId) => {
  try {
    const savedPost = await createDocument(appwriteConfig.savesCollectionId, {
      user: userId,
      post: postId,
    });
    if (!savedPost) throw new Error("Failed to save post");
    return savedPost;
  } catch (error) {
    handleError(error, "Error in savePost");
  }
};

// DELETE SAVED POST
export const deleteSavedPost = async (savedRecordId) => {
  try {
    const status = await deleteDocument(appwriteConfig.savesCollectionId, savedRecordId);
    if (!status) throw new Error("Failed to delete saved post");
    return { status: "Ok" };
  } catch (error) {
    handleError(error, "Error in deleteSavedPost");
  }
};

// GET USER'S POST
export const getUserPosts = async (userId) => {
  if (!userId) return;
  try {
    const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
    );
    if (!posts) throw new Error("Failed to fetch user posts");
    return posts;
  } catch (error) {
    handleError(error, "Error in getUserPosts");
  }
};

// GET POPULAR POSTS (BY HIGHEST LIKE COUNT)
export const getRecentPosts = async () => {
  try {
    const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        [Query.orderDesc("$createdAt"), Query.limit(20)]
    );
    if (!posts) throw new Error("Failed to fetch recent posts");
    return posts;
  } catch (error) {
    handleError(error, "Error in getRecentPosts");
  }
};

// ================
// USER HANDLER
// ================

// GET USERS
export const getUsers = async (limit) => {
  const queries = [Query.orderDesc("$createdAt")];
  if (limit) {
    queries.push(Query.limit(limit));
  }
  try {
    const users = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        queries
    );
    if (!users) throw new Error("Failed to fetch users");
    return users;
  } catch (error) {
    handleError(error, "Error in getUsers");
  }
};

// GET USER BY ID
export const getUserById = async (userId) => {
  try {
    const user = await databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        userId
    );
    if (!user) throw new Error("User not found");
    return user;
  } catch (error) {
    handleError(error, "Error in getUserById");
  }
};

// UPDATE USER
export const updateUser = async (user) => {
  const hasFileToUpdate = user.file.length > 0;
  let image = { imageUrl: user.imageUrl, imageId: user.imageId };

  try {
    if (hasFileToUpdate) {
      const uploadedFile = await uploadFile(user.file[0]);
      if (!uploadedFile) throw new Error("Failed to upload new file");

      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw new Error("Failed to get new file preview");
      }

      image = { imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    const updatedUser = await updateDocument(
        appwriteConfig.userCollectionId,
        user.userId,
        {
          name: user.name,
          bio: user.bio,
          imageUrl: image.imageUrl,
          imageId: image.imageId,
        }
    );

    if (!updatedUser) {
      if (hasFileToUpdate) await deleteFile(image.imageId);
      throw new Error("Failed to update user");
    }

    if (user.imageId && hasFileToUpdate) {
      await deleteFile(user.imageId);
    }

    return updatedUser;
  } catch (error) {
    handleError(error, "Error in updateUser");
  }
};

export const updateExistingPosts = async () => {
  try {
      const posts = await databases.listDocuments(
                    import.meta.env.VITE_APPWRITE_DATABASE_ID, 
                    import.meta.env.VITE_APPWRITE_POST_COLLECTION_ID);
      for (const post of posts.documents) {
          if (!post.expiresAt) {
              const expiresAt = new Date(post.$createdAt);
              expiresAt.setHours(expiresAt.getHours() + 24);
              await databases.updateDocument(
                  import.meta.env.VITE_APPWRITE_DATABASE_ID,
                  import.meta.env.VITE_APPWRITE_POST_COLLECTION_ID,
                  post.$id,
                  { expiresAt: expiresAt.toISOString() }
              );
          }
      }
      console.log('Successfully updated existing posts');
  } catch (error) {
      console.error('Error updating existing posts:', error);
  }
};