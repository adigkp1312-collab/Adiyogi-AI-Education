import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  UpdateCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import type { UserProfile, UserProgress, CoursePlan } from "@/types";
import { v4 as uuidv4 } from "uuid";

const ddbClient = new DynamoDBClient({
  region: process.env.AWS_REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const docClient = DynamoDBDocumentClient.from(ddbClient);

const USERS_TABLE = process.env.DYNAMODB_TABLE_USERS || "adiyogi-users";
const PROGRESS_TABLE = process.env.DYNAMODB_TABLE_PROGRESS || "adiyogi-progress";

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

  await docClient.send(
    new PutCommand({
      TableName: USERS_TABLE,
      Item: user,
    })
  );

  return user;
}

export async function getUser(userId: string): Promise<UserProfile | null> {
  const result = await docClient.send(
    new GetCommand({
      TableName: USERS_TABLE,
      Key: { userId },
    })
  );

  return (result.Item as UserProfile) || null;
}

export async function addPlanToUser(
  userId: string,
  planId: string
): Promise<void> {
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
    })
  );
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

  await docClient.send(
    new PutCommand({
      TableName: PROGRESS_TABLE,
      Item: progress,
    })
  );

  return progress;
}

export async function getProgress(
  userId: string,
  planId: string
): Promise<UserProgress | null> {
  const result = await docClient.send(
    new GetCommand({
      TableName: PROGRESS_TABLE,
      Key: { userId, planId },
    })
  );

  return (result.Item as UserProgress) || null;
}

export async function markResourceComplete(
  userId: string,
  planId: string,
  resourceId: string
): Promise<void> {
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
}

// Save course plan to S3-like storage via DynamoDB (for prototype)
export async function saveCoursePlan(plan: CoursePlan): Promise<void> {
  await docClient.send(
    new PutCommand({
      TableName: USERS_TABLE,
      Item: {
        userId: `plan#${plan.id}`,
        ...plan,
      },
    })
  );
}

export async function getCoursePlan(planId: string): Promise<CoursePlan | null> {
  const result = await docClient.send(
    new GetCommand({
      TableName: USERS_TABLE,
      Key: { userId: `plan#${planId}` },
    })
  );

  return (result.Item as CoursePlan) || null;
}
