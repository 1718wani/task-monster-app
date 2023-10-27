import type { GetServerSidePropsContext, NextPage } from "next";
import {
  Box,
  Button,
  Image,
  Progress,
  SimpleGrid,
  Stack,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { TimerOfTaskComponent } from "~/components/TimerOfTaskComponent";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { EndOfBattleModal } from "~/components/EndOfBattleModal";
import type {
  ProgressStatus,
  subTaskForDisplay,
  taskForDisplay,
} from "~/types/AllTypes";
import { useRouter } from "next/router";
import { TimeUpModal } from "~/components/TimeUpModal";
import CustomProgressBar from "~/components/ui/ProgressBar/CustomeProgressBar";
import { useInterval } from "usehooks-ts";
import { prisma } from "~/server/db";
import { Prisma } from "@prisma/client";
import { useTimer } from "react-timer-hook";
import { UseProgressManager } from "~/hooks/useProgressManager";
import { calculateSubtaskPercentage } from "~/util/calculateSubtaskPercentage";

type forBattleProps = {
  initialTask: taskForDisplay;
  imageurl: string | undefined;
};

export const BattleTask: NextPage<forBattleProps> = ({
  initialTask,
  imageurl,
}) => {
  const [subtasks, setSubtasks] = useState<subTaskForDisplay[]>(
    initialTask.subTasks
  );

  // remainingMinutesが定義されたらそちらを採用、そうでなければ減った時間のそちらを採用
  const remainingTotalSeconds = initialTask.remainingMinutes
    ? initialTask.remainingMinutes * 60
    : initialTask.totalMinutes * 60;

  // useTimerを初期化
  const { totalSeconds, seconds, minutes, hours, pause } = useTimer({
    expiryTimestamp: new Date(
      new Date().getTime() + remainingTotalSeconds * 1000
    ),
    onExpire: () => onTimeUpOpen(),
  });

  const { progressValue, setProgressStatus } = UseProgressManager({
    initialProgressValue: calculateSubtaskPercentage(subtasks),
    targetProgressValue: calculateSubtaskPercentage(subtasks),
    onReachZero: () => {
      pause();
      onOpen();
    },
  });

  const notify = () => toast("サブタスク完了によるこうげき", { icon: "👏" });
  // タスクを全部コンプリートした時のモーダル開閉の状態管理
  const { isOpen, onOpen, onClose } = useDisclosure();
  // タイマー終了時のモーダル開閉の状態管理
  const {
    isOpen: isTimeUpOpen,
    onOpen: onTimeUpOpen,
    onClose: onTimeUpClose,
  } = useDisclosure();
  const router = useRouter();

  // サブタスクの完了状態を変更する関数
  const toggleItemDone = async (id: number | string) => {
    try {
      // ここでAPIを呼び出します。例えば、PUTメソッドを使ってあるidのサブタスクの状態を更新する。
      const response = await axios.put(
        `http://localhost:3000/api/subtask/?subTaskId=${id}`,
        {
          // isCompletedのBoolean値が変更されます。
          isCompleted: !subtasks.find((subtask) => subtask.id === id)
            ?.isCompleted,
        }
      );

      // レスポンスから更新されたサブタスクのデータを取得
      const updatedSubtask = response.data;

      // 完了ボタンを押したsubtaskの値だけ、塗り替えてsubtasksを更新する
      setSubtasks((prevSubtasks) =>
        prevSubtasks.map((subtask) =>
          subtask.id === id ? updatedSubtask : subtask
        )
      );

      // Counting Downを開始する。
      setProgressStatus("isCountingDown");

      console.log(updatedSubtask, "更新されたサブタスク");
    } catch (error) {
      console.error("APIの呼び出しに失敗:", error);
    }
  };

  const backToHome = async () => {
    const id = router.query.id;

    try {
      const response = await axios.put(
        `http://localhost:3000/api/tasks/${id}`,
        {
          isOnGoing: false,
          // ここには、totalsecondsが入力されるべき
          remainingMinutes: Math.ceil((remainingTotalSeconds / 60) * 10) / 10,
        }
      );
      console.log(response.data, "これがタスク更新時のレスポンスデータ");
      await router.push("/");
    } catch (error) {
      console.error("Error updating totalminutes of task:", error);
    }
  };

  // 現在のタイムスタンプを表示するcurretnTimeStampを作成
  const currentTimeStamp = new Date();
  currentTimeStamp.setSeconds(
    currentTimeStamp.getSeconds() + remainingTotalSeconds
  );

  return (
    <SimpleGrid columns={2} spacingY="10px" py={20}>
      <Stack spacing={6} w={"full"} maxW={"xl"} ml="100">
        <TimerOfTaskComponent
          initialAmountSeconds={60 * initialTask.totalMinutes}
          totalSeconds={totalSeconds}
          seconds={seconds}
          minutes={minutes}
          hours={hours}
        />

        {subtasks.map((subtask) => (
          <Stack
            key={subtask.id}
            p="4"
            boxShadow="lg"
            m="4"
            borderRadius="sm"
            backgroundColor={subtask.isCompleted ? "gray" : ""}
          >
            <Stack
              direction={{ base: "column", md: "row" }}
              justifyContent="space-between"
            >
              <Box fontSize={{ base: "lg" }} textAlign="center" maxW={"4xl"}>
                {subtask.title}
              </Box>
              <Stack direction={{ base: "column", md: "row" }}>
                <Button variant="outline" colorScheme="green">
                  延長
                </Button>
                <Button
                  onClick={async () => {
                    await toggleItemDone(subtask.id); // async/awaitを使っています

                    notify();
                  }}
                  backgroundColor={
                    subtask.isCompleted ? "green.600" : "green.500"
                  }
                >
                  <Text color={"white"}>
                    {subtask.isCompleted ? "完了！" : "未完了"}
                  </Text>
                </Button>
                <Toaster />
              </Stack>
            </Stack>
          </Stack>
        ))}
        <Button onClick={backToHome}>
          <Text>戦闘を中断する</Text>
        </Button>
      </Stack>

      <VStack spacing={6} w={"full"} maxW={"xl"} ml="100">
        <Text fontSize={"lg"} as="b">
          あと
          <Text as="i" fontSize="4xl" display="inline" pr={2}>
            {progressValue}
          </Text>
          ％です。
        </Text>
        <CustomProgressBar
          value={progressValue}
          width="full"
          size="lg"
          height="25px"
        />

        <Image
          mt={20}
          rounded={20}
          boxSize="300px"
          src={imageurl ?? "defaultImageUrl"}
          alt="monster"
          shadow={"xl"}
        />
        <EndOfBattleModal isOpen={isOpen} onClose={onClose} />
        <TimeUpModal
          isOpen={isTimeUpOpen}
          onClose={onTimeUpClose}
          id={router.query.id}
        />
      </VStack>
    </SimpleGrid>
  );
};

export default BattleTask;

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  let initialTask: taskForDisplay;
  const id = context.params?.id;

  try {
    initialTask = await prisma.task.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        subTasks: true,
      },
    });
  } catch (error) {
    console.error("prisma.task.finduniqueの呼び出しに失敗:", error);
  }
  const imageurl = context.query.imageurl as string | undefined;

  return {
    props: {
      initialTask,
      imageurl,
    },
  };
};
