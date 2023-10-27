import { useState } from "react";
import { useInterval } from "usehooks-ts";
import { ProgressStatus } from "~/types/AllTypes";

type UseProgressOptions = {
  initialProgressValue: number;
  targetProgressValue: number;
  onReachZero: () => void;
};

export const UseProgressManager = ({
  initialProgressValue, // 最初のProgressValue
  targetProgressValue, // 目指すprogressValue
  onReachZero, // ０になったときに呼び出す
}: UseProgressOptions) => {
  const [progressValue, setProgressValue] = useState(initialProgressValue);
  const [progressStatus, setProgressStatus] =
    useState<ProgressStatus>("neutral");

  useInterval(
    () => {
      if (progressStatus === "isCountingDown") {
        if (progressValue === 0) {
          onReachZero();
        }
        if (progressValue > targetProgressValue) {
          setProgressValue((prev) => prev - 1);
        } else {
          setProgressStatus("neutral");
        }
      } else if (progressStatus === "isCountingUp") {
        if (progressValue < targetProgressValue) {
          setProgressValue((prev) => prev + 1);
        } else {
          setProgressStatus("neutral");
        }
      }
    },
    progressStatus !== "neutral" ? 30 : null // 1秒ごとに実行
  );

  return {
    progressValue,
    setProgressValue,
    progressStatus,
    setProgressStatus,
    onReachZero,
  };
};
