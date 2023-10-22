import { Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTimer } from "react-timer-hook";
import CustomProgressBar from "./ui/ProgressBar/CustomeProgressBar";

export const TimerOfTaskComponent = ({
  expiryTimestamp,
  // ここで親から設定した時間を秒で受け取る
  amountSeconds,
  onTimeUpOpen,
}: {
  expiryTimestamp: Date; //Mon Sep 25 2023 08:13:34 GMT+0900
  amountSeconds: number;
  onTimeUpOpen: () => void;
}) => {
  const {
    totalSeconds, //設定された数字から1秒毎にカウントダウンされる。
    seconds,
    minutes,
    hours,
    pause,
  } = useTimer({
    expiryTimestamp,
    onExpire: () => onTimeUpOpen(),
  });
  const [progressValuePercentate, setProgressValuePercentate] = useState(100);

  // TODO useEffectで監視する以外の方法で書き直したい
  useEffect(() => {
    // 残り秒数(totalSeconds) / 設定した秒数(amountSeconds) * 100
    setProgressValuePercentate((totalSeconds / amountSeconds) * 100);
  }, [totalSeconds, amountSeconds, progressValuePercentate]);

  return (
    <>
      <VStack>
        <Text mb={4} fontSize={"lg"} as="b">
          あと
          <Text pl={1} as="i" fontSize="4xl" display="inline" pr={2}>
            {hours}時間:{minutes}分:{seconds}秒
          </Text>
          です
        </Text>

        <CustomProgressBar
          width={"full"}
          size="lg"
          height="25px"
          value={progressValuePercentate}
        />
      </VStack>
    </>
  );
};
