import { Task } from "@prisma/client";
import { NextApiRequest } from "next";

export type ClientType = {
  clientId: string;
  clientSecret: string;
};

export type TodoProps = {
  id: number;
  title: string;
  isCompleted: boolean;
  imageData: string;
};

export interface CustomTodoApiRequest extends NextApiRequest {
  body: {
    id?: number;
    userId: string;
    title: string;
    detail?: string;
    isCompleted: boolean;
  };
}

export type ApiResponseData = Task | { error: string } | Task[];

export type TodoFormData = {
  userId: string;
  title: string;
  detail?: string | null; // '?' はこのプロパティがオプションであることを示します
  isCompleted?: boolean;
  imageData?: string | null;
  isPublished?: boolean;
  publishedTitle?: string | null;
  publishedStrategy?: string | null;
};


export type taskForDisplay = {
  id: number;
  userId:string;
  title: string;
  detail:string|null;
  isCompleted: boolean;
  imageData: string | null;
};

export type tasksForHome = {
  tasks: taskForDisplay[];
};

export type subTaskForDisplay = {
  id: string;
  title: string;
  detail:string|null;
  isCompleted: boolean;
  estimatedMinutes: number;
};
