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
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
  Select,
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

const options = [
  { value: 1 },
  { value: 5 },
  { value: 10 },
  { value: 15 },
  { value: 30 },
  { value: 60 },
];

export const BattleTask: NextPage<forBattleProps> = ({
  initialTask,
  imageurl,
}) => {
  const [subtasks, setSubtasks] = useState<subTaskForDisplay[]>(
    initialTask.subTasks
  );
  const [minutesToAdd, setMinutesToAdd] = useState<number>(0);
  console.log(minutesToAdd, "minutesToAddの時間チェック");

  // remainingMinutesが定義されたらそちらを採用、そうでなければ減った時間のそちらを採用
  const [remainingTotalSeconds, setRemainingTotalSeconds] = useState(
    initialTask.remainingMinutes
      ? initialTask.remainingMinutes * 60
      : initialTask.totalMinutes * 60
  );
  console.log(remainingTotalSeconds, "remainingTotalSecondsの時間チェック");
  // useTimerを初期化
  const { totalSeconds, seconds, minutes, hours, pause, restart } = useTimer({
    expiryTimestamp: new Date(
      new Date().getTime() + remainingTotalSeconds * 1000
    ),
    onExpire: () => onTimeUpOpen(),
  });
  console.log(totalSeconds, "totalSecondsの時間チェック");

  const { progressValue, setProgressStatus } = UseProgressManager({
    initialProgressValue: calculateSubtaskPercentage(subtasks),
    targetProgressValue: calculateSubtaskPercentage(subtasks),
    duration: 30,
    onReachZero: () => {
      pause();
      onOpen();
    },
  });

  const {
    progressValue: progressValueOfTimer,
    setProgressStatus: setProgressStatusOfTimer,
    progressStatus: progressStatusOfTimer,
  } = UseProgressManager({
    initialProgressValue: totalSeconds,
    targetProgressValue: totalSeconds + minutesToAdd * 60,
    duration: 1,
    onReachCountingUpTarget: () => {
      const _newRemainingTotalSeconds = totalSeconds + minutesToAdd * 60;
      restart(
        new Date(new Date().getTime() + _newRemainingTotalSeconds * 1000)
      );
      setMinutesToAdd(0);
    },
  });

  console.log(progressValueOfTimer, "ProgressValueofTimerの状態だ！！！");

  const notify = () => toast("サブタスク完了によるこうげき", { icon: "👏" });
  // タスクを全部コンプリートした時のモーダル開閉の状態管理
  const { isOpen, onOpen, onClose } = useDisclosure();
  // タイマー終了時のモーダル開閉の状態管理
  const {
    isOpen: isTimeUpOpen,
    onOpen: onTimeUpOpen,
    onClose: onTimeUpClose,
  } = useDisclosure();

  const {
    isOpen: popoverIsOpen,
    onOpen: openPopover,
    onClose: closePopover,
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

  const handleToAddMinutesChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setMinutesToAdd(parseInt(value, 10));
  };

  const handleToAddMinutesSubmit = () => {
    closePopover()
    // まずタイマーをストップする。
    pause();
    // 新しい remainingTotalSeconds の値を計算
    const newRemainingTotalSeconds = totalSeconds + minutesToAdd * 60;

    // 現在の時間にminutestoadd×60を足す。
    setRemainingTotalSeconds(newRemainingTotalSeconds);
    // セットする。
    setProgressStatusOfTimer("isCountingUp");
    // タイマーをリスタートさせる。
  };

  return (
    <SimpleGrid columns={2} spacingY="10px" py={20}>
      <Stack spacing={6} w={"full"} maxW={"xl"} ml="100">
        <TimerOfTaskComponent
          initialAmountSeconds={60 * initialTask.totalMinutes}
          totalSeconds={totalSeconds}
          seconds={seconds}
          minutes={minutes}
          hours={hours}
          progressValueOfTimer={progressValueOfTimer}
          progressStatusOfTimer={progressStatusOfTimer}
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
        <Popover isOpen={popoverIsOpen} onClose={closePopover}>
          <PopoverTrigger>
            <Button onClick={openPopover}>体力（残り時間）を回復する</Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>残り時間を追加しますか？</PopoverHeader>

            <PopoverBody>
              元々の設定時間を超えた時間には設定できません。
              <Select onChange={handleToAddMinutesChange}>
                <option value={0} disabled selected >
                  選択してください
                </option>
                {options.map((option) => (
                  <option
                    key={option.value}
                    disabled={
                      initialTask.totalMinutes * 60 <
                      totalSeconds + option.value * 60
                    }
                    value={option.value}
                  >
                    {option.value}
                  </option>
                ))}
              </Select>
              <Button
                colorScheme="blue"
                mr={3}
                onClick={handleToAddMinutesSubmit}
                isDisabled={minutesToAdd === 0}
              >
                {minutesToAdd}分だけ延長する
              </Button>
            </PopoverBody>
          </PopoverContent>
        </Popover>
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
