import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { prisma } from "~/server/db";
import { z } from "zod";
import { callApiHandleError } from "~/util/callApiHandleError";
import { generateImage } from "~/util/generateAiImage";
import { supabase } from "~/lib/supabaseClient";

const CreateTaskSchema = z.object({
  userId: z.string(),
  title: z.string(),
  detail: z.string().optional(),
  isPublished: z.boolean().optional(),
  imageData: z.string().optional(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 認証情報のチェックはまた今度行います。
    const session = await getServerSession(req, res, authOptions);
    console.log("/taskがよびだされた際の session on server side", session);
    if (session) {
      // Signed in
      console.log("Session on /task Server side", JSON.stringify(session, null, 2));
    } else {
      // Not Signed in
      res.status(401).json({ error: "Unauthorized at /task API Routes" });
      return;
    }

  const userId = session.user?.userId;
  
  const getIsPublished = req.query.getIsPublished as
    | "true"
    | "false"
    | undefined;
  
 

  const getIsOngoing = req.query.getIsOngoing as "true" | "false" | undefined;

  try {
    switch (req.method) {
      case "GET":
        let whereClause = {};

        // getIsPublishedがtrueの場合、isPublishedがtrueのものを取得
        if (getIsPublished === "true"){
          whereClause = { ...whereClause, isPublished: true };
          console.log("getIsPublishedがtrueのため、isPublishedがtrueのものを取得")
        }
          
        // getIsOngoingがtrueの場合、isOnGoingがtrueかつuserIdが一致しないものを取得
        if (getIsOngoing === "true") {
          if (userId) {
            whereClause = {
              ...whereClause,
              userId: { not: userId },
              isOnGoing: true,
            };
            console.log("getIsOngoingがtrueのため、isOnGoingがtrueかつuserIdが一致しないものを取得")
          } else {
            console.log("not authorized")
          }
        }

        // クエリパラメータが設定されていない場合、userIdが一致するもののみ取得
        if (!getIsPublished && !getIsOngoing && userId){
          console.log("クエリパラメータが設定されていないため、userIdが一致するもののみ取得")
          whereClause = { ...whereClause, userId };
        }
          

        // クエリが不正な場合（userIdが指定されていなく、getIsPublishedとgetIsOngoingも指定されていない場合）
        if (!getIsPublished && !getIsOngoing && !userId) {
          res.status(400).json({ error: "Invalid query parameters" });
          return;
        }

        const tasks = await prisma.task.findMany({
          where: whereClause,
          orderBy: { id: "desc" },
          include: {
            subTasks: true, 
          },
        });

        console.log(tasks, "/taskのGETメソッドによってサーバーサイドで呼び出したtasks");
      
        res.status(200).json(tasks);

        break;

      case "POST":
        const postData = CreateTaskSchema.safeParse(req.body);
        if (!postData.success) {
          res.status(400).json({ error: "Invalid data" });
          return;
        }

        const imageBuffer = await generateImage();
        if (!imageBuffer) {
          // Handle the case where generateImage returns undefined
          res.status(500).json({ error: "Failed to generate image" });
          return;
        }
        console.log(imageBuffer, "Bufferの値");
        const random8Num = Math.random().toString(32).substring(2);
        const filePath = `monsters/${random8Num}.png`;
        const my_bucket = "monster-todo-bucket";

        const { error } = await supabase.storage
          .from(my_bucket)
          .upload(filePath, imageBuffer, {
            contentType: "image/png",
          });
        if (error) {
          console.error("アップロードエラー", error.message);
          throw error;
        }

        // 画像のURLを取得
        const { data } = supabase.storage
          .from(my_bucket)
          .getPublicUrl(filePath);
        const imageUrl = data.publicUrl;
        console.log(imageUrl, "imageUrl");

        const newTaskData = {
          ...postData.data,
          imageData: imageUrl,
        };

        const newTask = await prisma.task.create({
          data: newTaskData,
        });
        console.log(newTask, "サーバーサイドでCreateされたnewTask")
        res.status(201).json(newTask);

      default:
        res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    callApiHandleError(error, res);
  }
}
