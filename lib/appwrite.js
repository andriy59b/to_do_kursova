import { Account, Avatars, Client, ID, Databases } from 'react-native-appwrite';
import 'react-native-url-polyfill/auto'

export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.to.do.list',
    projectId: '6708e8af001155ee7ff3',
    databaseId: '6708ea130013203595bc',
    userCollectionId: '6708ea56003a7117626e',
    tasksCollectionId: '6708ec1100059dabdcae',
    storageId: '6708ed9d003d0b142b84'

}

// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint) // Your Appwrite Endpoint
    .setProject(config.projectId) // Your project ID
    .setPlatform(config.platform) // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const createUser = async (email, password, username) => {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        )

        if(!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(username)

        await signIn(email, password);

        const newUser = await databases.createDocument(
            config.databaseId,
            config.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email,
                username,
                avatar: avatarUrl
            }
        )

        return newUser;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

export async function signIn(email, password) {
    try {
        const session = await account.createEmailPasswordSession(email, password)

        return session;
    } catch (error) {
        throw new Error(error);
    }
}
