import { Box, Button, Heading, Progress, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTimer } from "react-timer-hook";

export const TimerOfTaskComponent = ({
  expiryTimestamp,
  amountSeconds,
 
}: {
  expiryTimestamp: Date;
  amountSeconds: number;
  onPause?:()=> void;
}) => {
  const {
    totalSeconds,
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({
    expiryTimestamp,
    onExpire: () => console.warn("onExpire called"),
    
  });

  const [colorStates, SetColorStatus] = useState("teal");
  const [progressValuePercentate, setProgressValuePercentate] = useState(100);

  console.log(totalSeconds,"秒数")//716から下にカウントダウンする
  console.log(expiryTimestamp,"タイムスタンプ")//Mon Sep 25 2023 08:13:34 GMT+0900
  console.log(amountSeconds,"合計秒数")

  useEffect(() => {

    const percentage = (totalSeconds / amountSeconds) * 100;
    setProgressValuePercentate(percentage);

    if (percentage <= 20) {
      SetColorStatus("red");
    } else if (percentage > 60) {
      SetColorStatus("teal");
    } else {
      SetColorStatus("yellow");
    }

    console.log(totalSeconds, "これが継承後");
    console.log(progressValuePercentate, "今のProgress");
  }, [totalSeconds]);

  

  return (
    <>
      <VStack>
      <Text  mb={4}  fontSize={"lg"} as="b">
          あと
          <Text pl={1} as="i" fontSize="4xl" display="inline" pr={2}>
          {hours}時間:{minutes}分:{seconds}秒
          </Text>
        です
        </Text>
      
        <Progress
          width={"full"}
          colorScheme={colorStates}
          size="lg"
          value={progressValuePercentate}
          isAnimated
          hasStripe
          height="25px"
          shadow="dark-lg"
          rounded="lg"
        />
        {/* <Box>{isRunning ? "カウント中" : "停止中"}</Box>
        <Button onClick={pause}>一時停止</Button>
        <Button onClick={resume}>途中から再開</Button> */}
      </VStack>
    </>
  );
};
