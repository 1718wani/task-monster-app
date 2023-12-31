import { z } from "zod";

export const PublishUpdateSchema = z.object({
  isPublished: z.boolean(),
  publishedTitle: z.string(),
  publishedStrategy: z.string(),
});

export const ContentUpdateSchema = z.object({
  title: z.string(),
  detail: z.string().optional(),
});



// 数値が自然数かどうかをチェックするカスタムバリデーション
const naturalNumber = z.number().min(1, "1以上の数値を入力してください。");

const minofValidation = z.union([
  // 文字列の場合のバリデーション
  z.string()
    .refine(value => !isNaN(Number(value)), {
      message: "有効な数値を入力してください。",
    })
    .refine(value => Number(value) > 0, {
      message: "1以上の整数を入力してください。",
    }),

  // 数値の場合のバリデーション
  naturalNumber
]);
  

export const subTaskValidation = z.object({
  tasks: z.array(
    z.object({
      subtask: z.string().nonempty("必須項目です。"),
      minof: minofValidation,
    })
  ),
});

