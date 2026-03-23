import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  UpdateCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import type { UserProfile, UserProgress, CoursePlan } from "@/types";
import type { EnrichedProfile, ProfileSignal } from "@/types/profile";
import { v4 as uuidv4 } from "uuid";
import { getAwsCredentials, getAwsRegion } from "@/lib/api-utils";

function createDocClient(): DynamoDBDocumentClient {
  const credentials = getAwsCredentials();
  const config: ConstructorParameters<typeof DynamoDBClient>[0] = {
    region: getAwsRegion(),
  };

  if (credentials) {
    config.credentials = credentials;
  }

  return DynamoDBDocumentClient.from(new DynamoDBClient(config));
}

const docClient = createDocClient();

const USERS_TABLE = process.env.DYNAMODB_TABLE_USERS || "adiyogi-users";
const PROGRESS_TABLE = process.env.DYNAMODB_TABLE_PROGRESS || "adiyogi-progress";
const PROFILES_TABLE = process.env.DYNAMODB_TABLE_PROFILES || "adiyogi-profiles";
const SIGNALS_TABLE = process.env.DYNAMODB_TABLE_SIGNALS || "adiyogi-profile-signals";

// User Profile Operations
export async function createUser(
  name: string,
  preferredLanguage: string
): Promise<UserProfile> {
  const user: UserProfile = {
    userId: uuidv4(),
    name,
    preferredLanguage,
    interests: [],
    activePlans: [],
    createdAt: new Date().toISOString(),
    level: "beginner",
    goal: "",
    language: preferredLanguage,
    education: "",
    hoursPerWeek: 0,
    learningStyle: "visual",
  };

  try {
    await docClient.send(
      new PutCommand({
        TableName: USERS_TABLE,
        Item: user,
      })
    );
  } catch (error) {
    console.error("Failed to create user in DynamoDB:", error instanceof Error ? error.message : error);
    throw new Error("Failed to create user");
  }

  return user;
}

export async function getUser(userId: string): Promise<UserProfile | null> {
  try {
    const result = await docClient.send(
      new GetCommand({
        TableName: USERS_TABLE,
        Key: { userId },
      })
    );
    return (result.Item as UserProfile) || null;
  } catch (error) {
    console.error("Failed to get user from DynamoDB:", error instanceof Error ? error.message : error);
    throw new Error("Failed to fetch user");
  }
}

export async function addPlanToUser(
  userId: string,
  planId: string
): Promise<void> {
  try {
    await docClient.send(
      new UpdateCommand({
        TableName: USERS_TABLE,
        Key: { userId },
        UpdateExpression:
          "SET activePlans = list_append(if_not_exists(activePlans, :empty), :plan)",
        ExpressionAttributeValues: {
          ":plan": [planId],
          ":empty": [],
        },
        ConditionExpression: "attribute_exists(userId)",
      })
    );
  } catch (error) {
    console.error("Failed to add plan to user:", error instanceof Error ? error.message : error);
    throw new Error("Failed to update user plans");
  }
}

// Progress Tracking Operations
export async function saveProgress(
  userId: string,
  planId: string,
  completedResources: string[],
  currentWeek: number,
  totalResources: number
): Promise<UserProgress> {
  const progress: UserProgress = {
    userId,
    planId,
    completedResources,
    currentWeek,
    lastAccessedAt: new Date().toISOString(),
    progressPercent:
      totalResources > 0
        ? Math.round((completedResources.length / totalResources) * 100)
        : 0,
  };

  try {
    await docClient.send(
      new PutCommand({
        TableName: PROGRESS_TABLE,
        Item: progress,
      })
    );
  } catch (error) {
    console.error("Failed to save progress:", error instanceof Error ? error.message : error);
    throw new Error("Failed to save progress");
  }

  return progress;
}

export async function getProgress(
  userId: string,
  planId: string
): Promise<UserProgress | null> {
  try {
    const result = await docClient.send(
      new GetCommand({
        TableName: PROGRESS_TABLE,
        Key: { userId, planId },
      })
    );
    return (result.Item as UserProgress) || null;
  } catch (error) {
    console.error("Failed to get progress:", error instanceof Error ? error.message : error);
    throw new Error("Failed to fetch progress");
  }
}

export async function markResourceComplete(
  userId: string,
  planId: string,
  resourceId: string
): Promise<void> {
  try {
    await docClient.send(
      new UpdateCommand({
        TableName: PROGRESS_TABLE,
        Key: { userId, planId },
        UpdateExpression:
          "SET completedResources = list_append(if_not_exists(completedResources, :empty), :res), lastAccessedAt = :now",
        ExpressionAttributeValues: {
          ":res": [resourceId],
          ":empty": [],
          ":now": new Date().toISOString(),
        },
      })
    );
  } catch (error) {
    console.error("Failed to mark resource complete:", error instanceof Error ? error.message : error);
    throw new Error("Failed to update progress");
  }
}

// Save course plan (stored in users table with plan# prefix for prototype)
export async function saveCoursePlan(plan: CoursePlan): Promise<void> {
  try {
    await docClient.send(
      new PutCommand({
        TableName: USERS_TABLE,
        Item: {
          userId: `plan#${plan.id}`,
          ...plan,
        },
      })
    );
  } catch (error) {
    console.error("Failed to save course plan:", error instanceof Error ? error.message : error);
    throw new Error("Failed to save course plan");
  }
}

export async function getCoursePlan(planId: string): Promise<CoursePlan | null> {
  try {
    const result = await docClient.send(
      new GetCommand({
        TableName: USERS_TABLE,
        Key: { userId: `plan#${planId}` },
      })
    );
    return (result.Item as CoursePlan) || null;
  } catch (error) {
    console.error("Failed to get course plan:", error instanceof Error ? error.message : error);
    throw new Error("Failed to fetch course plan");
  }
}

// --- Enriched Profile Operations ---

export async function saveEnrichedProfile(profile: EnrichedProfile): Promise<void> {
  try {
    await docClient.send(
      new PutCommand({
        TableName: PROFILES_TABLE,
        Item: profile,
        ConditionExpression: "attribute_not_exists(userId) OR version < :v",
        ExpressionAttributeValues: { ":v": profile.version },
      })
    );
  } catch (error) {
    console.error("Failed to save enriched profile:", error instanceof Error ? error.message : error);
    throw new Error("Failed to save profile");
  }
}

export async function getEnrichedProfile(userId: string): Promise<EnrichedProfile | null> {
  try {
    const result = await docClient.send(
      new GetCommand({
        TableName: PROFILES_TABLE,
        Key: { userId },
      })
    );
    return (result.Item as EnrichedProfile) || null;
  } catch (error) {
    console.error("Failed to get enriched profile:", error instanceof Error ? error.message : error);
    throw new Error("Failed to fetch profile");
  }
}

export async function updateEnrichedProfile(
  userId: string,
  updates: Partial<EnrichedProfile>,
): Promise<void> {
  const expressions: string[] = [];
  const names: Record<string, string> = {};
  const values: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(updates)) {
    if (key === "userId") continue;
    const safeKey = `#${key}`;
    const safeVal = `:${key}`;
    expressions.push(`${safeKey} = ${safeVal}`);
    names[safeKey] = key;
    values[safeVal] = value;
  }

  // Always increment version
  expressions.push("#version = #version + :one");
  names["#version"] = "version";
  values[":one"] = 1;

  try {
    await docClient.send(
      new UpdateCommand({
        TableName: PROFILES_TABLE,
        Key: { userId },
        UpdateExpression: `SET ${expressions.join(", ")}`,
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
        ConditionExpression: "attribute_exists(userId)",
      })
    );
  } catch (error) {
    console.error("Failed to update enriched profile:", error instanceof Error ? error.message : error);
    throw new Error("Failed to update profile");
  }
}

// --- Profile Signal Operations ---

export async function appendSignal(signal: ProfileSignal): Promise<void> {
  try {
    await docClient.send(
      new PutCommand({
        TableName: SIGNALS_TABLE,
        Item: signal,
      })
    );
  } catch (error) {
    console.error("Failed to append signal:", error instanceof Error ? error.message : error);
    throw new Error("Failed to save signal");
  }
}

export async function getRecentSignals(
  userId: string,
  limit: number = 50,
): Promise<ProfileSignal[]> {
  try {
    const result = await docClient.send(
      new QueryCommand({
        TableName: SIGNALS_TABLE,
        KeyConditionExpression: "userId = :uid",
        ExpressionAttributeValues: { ":uid": userId },
        ScanIndexForward: false,
        Limit: limit,
      })
    );
    return (result.Items as ProfileSignal[]) || [];
  } catch (error) {
    console.error("Failed to get recent signals:", error instanceof Error ? error.message : error);
    throw new Error("Failed to fetch signals");
  }
}
