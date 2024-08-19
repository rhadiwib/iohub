import { Client, Databases, Realtime, Query } from "appwrite";
import { appwriteConfig } from "./config";

const client = new Client()
    .setEndpoint(appwriteConfig.url)
    .setProject(appwriteConfig.projectId);

const databases = new Databases(client);
const realtime = new Realtime(client);

export const subscribeToStories = (callback) => {
    const unsubscribe = realtime.subscribe([`databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.storiesCollectionId}.documents`], response => {
        if (response.events.includes('databases.*.collections.*.documents.*.create')) {
            console.log('New story created:', response.payload);
            callback('create', response.payload);
        }
        if (response.events.includes('databases.*.collections.*.documents.*.delete')) {
            console.log('Story deleted:', response.payload);
            callback('delete', response.payload);
        }
    });

    return unsubscribe;
};

export const getActiveStories = async () => {
  const now = new Date().toISOString();
  const stories = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.storiesCollectionId,
    [Query.greaterThan("expiresAt", now)]
  );
  return stories.documents;
};