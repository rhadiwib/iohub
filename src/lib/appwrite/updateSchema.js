const sdk = require('node-appwrite');

// Initialize the Appwrite client
const client = new sdk.Client();
client
    .setEndpoint(import.meta.env.VITE_APPWRITE_URL)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID)
    .setKey(import.meta.env.VITE_APPWRITE_API_KEY);

const databases = new sdk.Databases(client);

async function addExpiresAtField() {
    try {
        await databases.createDatetimeAttribute(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_POST_COLLECTION_ID, // Replace with your posts/stories collection ID
            'expiresAt',
            true, // Required
            null, // Default value (null means no default)
            false // Is array?
        );
        console.log('Successfully added expiresAt field to the collection');
    } catch (error) {
        console.error('Error adding expiresAt field:', error);
    }
}

addExpiresAtField();