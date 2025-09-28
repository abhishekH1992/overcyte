import { Effect, pipe } from "effect";
import { db } from "@/lib/db";
import { users, posts } from "@/lib/db/schema";
import { hashPassword } from "@/lib/auth/utils";

interface NotificationResult {
  sent: boolean;
  messageId: string;
}

interface RegistrationResult {
  success: boolean;
  user: any;
  welcomePost: any;
  notification: NotificationResult;
}

// Effect-based password hashing
const hashPasswordEffect = (password: string) =>
  Effect.tryPromise({
    try: () => hashPassword(password),
    catch: (error) => new Error(`Failed to process password: ${error}`),
  });

// Effect-based user creation
const createUserEffect = (username: string, hashedPassword: string) =>
  Effect.tryPromise({
    try: () =>
      db
        .insert(users)
        .values({
          username,
          hashedPassword,
          createdAt: new Date(),
        })
        .returning(),
    catch: (error) => new Error(`Failed to create user account: ${error}`),
  });

// Effect-based welcome post creation
const createWelcomePostEffect = (username: string, userId: number) =>
  Effect.tryPromise({
    try: () =>
      db
        .insert(posts)
        .values({
          title: `Welcome ${username}!`,
          content: `Welcome to our platform, ${username}! We're excited to have you here.`,
          authorId: userId,
          likeCount: 0,
          createdAt: new Date(),
        })
        .returning(),
    catch: (error) => new Error(`Failed to create welcome post: ${error}`),
  });

// Effect-based notification sending
const sendWelcomeNotificationEffect = (username: string, userId: number) =>
  Effect.tryPromise({
    try: () => sendWelcomeNotification(username, userId),
    catch: (error) => new Error(`Failed to send welcome notification: ${error}`),
  });

// Main registration workflow using Effect
export const registerUserEffect = (username: string, password: string) =>
  pipe(
    // Step 1: Hash password
    hashPasswordEffect(password),
    // Step 2: Create user with hashed password
    Effect.flatMap((hashedPassword) =>
      createUserEffect(username, hashedPassword).pipe(
        Effect.map((users) => users[0])
      )
    ),
    // Step 3: Create welcome post and send notification in parallel
    Effect.flatMap((newUser) =>
      Effect.all([
        createWelcomePostEffect(username, newUser.id).pipe(
          Effect.map((posts) => posts[0])
        ),
        sendWelcomeNotificationEffect(username, newUser.id),
      ]).pipe(
        Effect.map(([welcomePost, notification]) => ({
          success: true,
          user: newUser,
          welcomePost,
          notification,
        }))
      )
    ),
    // Add logging for debugging
    Effect.tap((result) =>
      Effect.sync(() => console.log("Registration successful:", result.user.username))
    ),
    // Handle errors with proper logging
    Effect.catchAll((error) =>
      Effect.sync(() => console.error("Registration failed:", error)).pipe(
        Effect.flatMap(() => Effect.fail(error))
      )
    )
  );

// Legacy function for backward compatibility
export async function registerUser(username: string, password: string) {
  return Effect.runPromise(registerUserEffect(username, password));
}

async function sendWelcomeNotification(
  username: string,
  userId: number
): Promise<NotificationResult> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.1) {
        resolve({
          sent: true,
          messageId: `msg_${userId}_${Date.now()}`,
        });
      } else {
        reject(new Error("Notification service unavailable"));
      }
    }, 500);
  });
}
