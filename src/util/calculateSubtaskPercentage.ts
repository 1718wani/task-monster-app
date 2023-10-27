// 1. 型定義

import { subTaskForDisplay } from "~/types/AllTypes";

  
  // 2. 関数定義
  export const calculateSubtaskPercentage = (subtasks: subTaskForDisplay[]): number => {
    // フィルタリングと集計
    const completedMinutes = subtasks
      .filter((task) => task.isCompleted)
      .reduce((acc, curr) => acc + curr.estimatedMinutes, 0);
  
    const totalMinutes = subtasks.reduce((acc, curr) => acc + curr.estimatedMinutes, 0);
  
    // ゼロ除算を防ぐ
    if (totalMinutes === 0) {
      return 0;
    }
  
    // 計算
    const result = (1 - completedMinutes / totalMinutes) * 100;
  
    // 結果の返却（Math.ceilで切り上げ）
    return Math.ceil(result);
  };
  

  