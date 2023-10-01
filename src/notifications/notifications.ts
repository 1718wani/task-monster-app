import { toast } from "react-hot-toast";

export const RegisterationSuccessNotification = () => toast("新しくモンスターを生成しました", { icon: "👏" });
export const RegisterationFailureNotification = () => toast("タスクの作成に失敗しました");