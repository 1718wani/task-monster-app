// // Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import { Task, User } from "@prisma/client";
// import type { NextApiRequest, NextApiResponse } from "next";
// import { ContentUpdateSchema, PublishUpdateSchema } from "~/schemas/zodSchema";
// import { prisma } from "~/server/db";
// import { ApiResponseData, CustomTodoApiRequest } from "~/types/AllTypes";
// import { validateTaskInput } from "~/validations/TodoApiValidation";

// export default async function handler(
//   req: CustomTodoApiRequest,
//   res: NextApiResponse<ApiResponseData>
// ) {
//   const { id, userId, title, detail, isCompleted } = req.body;

//   const { method } = req;
//   switch (method) {
//     case "GET":
//       const todos: Task[] = await prisma.task.findMany({
//         orderBy: {
//           id: "desc",
//         },
//       });

//       res.status(200).json(todos);
//       break;
//     case "POST":
//       const user = await prisma.user.findUnique({ where: { id: userId } });
//       if (!user) {
//         res.status(400).json({ error: "Invalid userId" });
//         return;
//       }

//       const { isValid, errors } = validateTaskInput(req.body);

//       if (!isValid) {
//         res.status(400).json({ error: JSON.stringify(errors) });
//         return;
//       }

//       try {
//         const todo: Task = await prisma.task.create({
//           data: {
//             userId: userId,
//             title: title,
//             detail: detail,
//             isCompleted: isCompleted,
//           },
//         });
//         res.status(200).json(todo);
//       } catch (error: unknown) {
//         if (error instanceof Error) {
//           res.status(500).json({ error: error.message });
//         } else {
//           res.status(500).json({ error: "An unknown error occurred" });
//         }
//       }
//       break;
    

    

//     default:
//       break;
//   }
// }
