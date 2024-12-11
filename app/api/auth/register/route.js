import { Client, Account } from "appwrite";

// Initialize Appwrite Client
const client = new Client();
client.setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT).setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

const account = new Account(client);

export const POST = async (req, res) => {
  try {
    const body = await req.json();

    const { username, email, password } = body;

    // Check if email is already in use
    try {
      await account.create(email, password, username); // This registers the user with Appwrite
      return new Response(JSON.stringify({ message: "User registered successfully!" }), { status: 200 });
    } catch (error) {
      if (error.message.includes('Account already exists')) {
        return new Response("User already exists", {
          status: 400,
        });
      }
      console.log("Registration error:", error);
      return new Response("Failed to create a new user", {
        status: 500,
      });
    }
  } catch (err) {
    console.log(err);
    return new Response("Failed to create a new user", {
      status: 500,
    });
  }
};
