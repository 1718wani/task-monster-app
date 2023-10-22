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
import type { subTaskForDisplay } from "~/types/AllTypes";
import { useRouter } from "next/router";
import { TimeUpModal } from "~/components/TimeUpModal";
import CustomProgressBar from "~/components/ui/ProgressBar/CustomeProgressBar";

type Props = {
  subtasks: subTaskForDisplay[];
  imageurl: string | undefined;
};

export const BattleTask: NextPage<Props> = ({ subtasks, imageurl }) => {
  // 現在のカラー
  const [colorStates, SetColorStatus] = useState("teal");
  const [nowTime, SetNowTime] = useState<number>(0);
  const [isCountStop, setIsCountStop] = useState<boolean>(false);
  // パーセンテージ
  const [progressValuePercentate, setProgressValuePercentate] = useState(100);
  const [items, setItems] = useState(subtasks);

  const [targetProgressValue, setTargetProgressValue] = useState(100);
  const [isTransition, setIsTransition] = useState(false);

  const notify = () => toast("サブタスク完了によるこうげき", { icon: "👏" });
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
      // ここでAPIを呼び出します。例えば、PUTメソッドを使ってサブタスクの状態を更新するとします。
      const response = await axios.put(
        `http://localhost:3000/api/subtask/?subTaskId=${id}`,
        {
          isCompleted: !items.find((item) => item.id === id)?.isCompleted,
        }
      );

      // レスポンスから更新されたサブタスクのデータを取得
      const updatedSubtask = response.data;

      // 状態を更新
      setItems((prevItems) =>
        prevItems.map((item) => (item.id === id ? updatedSubtask : item))
      );

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
          remainingMinutes: Math.ceil((nowTime / 60) * 10) / 10,
        }
      );
      console.log(response.data, "これがタスク更新時のレスポンスデータ");
      await router.push("/");
    } catch (error) {
      console.error("Error updating totalminutes of task:", error);
    }
  };
  console.log(nowTime, "これが現在の時間nowTime");

  // サブタスクの合計時間を、subtaskのestimatedMinutesを合計して計算する
  const total = items.reduce((acc, task) => acc + task.estimatedMinutes, 0);
  console.log(total, "合計時間");
  
  // サブタスクの 
  const currentTimeStamp = new Date();
  currentTimeStamp.setSeconds(currentTimeStamp.getSeconds() + total * 60);

  // サブタスクの完了状態が変更されたら、パーセンテージを再計算する
  useEffect(() => {
    calculateNumberOfCheckedToPercentage();
  }, [items]);

  useEffect(() => {
    if (isTransition) {
      if (progressValuePercentate > targetProgressValue) {
        const intervalId = setInterval(() => {
          setProgressValuePercentate((prev) => {
            if (prev > targetProgressValue) {
              return prev - 0.2;
            } else {
              clearInterval(intervalId);
              return targetProgressValue;
            }
          });
        }, 9);
      } else {
        setProgressValuePercentate(targetProgressValue);
      }
    }
  }, [targetProgressValue, isTransition]);

  const calculateNumberOfCheckedToPercentage = () => {
    // タスクの合計時間を計算する関数
    const totalEstimatedMinutes = items.reduce(
      (acc, item) => acc + item.estimatedMinutes,
      0
    );

    // 完了したタスクの合計時間
    const completedEstimatedMinutes = items
      .filter((item) => item.isCompleted)
      .reduce((acc, item) => acc + item.estimatedMinutes, 0);

    // 進捗のパーセンテージを計算して、小数点以下第一位で切り捨て
    const progressPercentage = Math.floor(
      ((totalEstimatedMinutes - completedEstimatedMinutes) /
        totalEstimatedMinutes) *
        100
    );

    if (progressPercentage === 0) {
      setIsCountStop(true);
      setTimeout(() => {
        onOpen();
      }, 900);
    } 

    // パーセンテージをsetState関数でセット
    setTargetProgressValue(progressPercentage);
    setIsTransition(true);
  };

  return (
    <SimpleGrid columns={2} spacingY="10px" py={20}>
      <Stack spacing={6} w={"full"} maxW={"xl"} ml="100">
        {!isCountStop && (
          <TimerOfTaskComponent
            expiryTimestamp={currentTimeStamp}
            amountSeconds={total * 60}
            onTimeUpOpen={onTimeUpOpen}
          />
        )}

        {items.map((item) => (
          <Stack
            key={item.id}
            p="4"
            boxShadow="lg"
            m="4"
            borderRadius="sm"
            backgroundColor={item.isCompleted ? "gray" : ""}
          >
            <Stack
              direction={{ base: "column", md: "row" }}
              justifyContent="space-between"
            >
              <Box fontSize={{ base: "lg" }} textAlign="center" maxW={"4xl"}>
                {item.title}
              </Box>
              <Stack direction={{ base: "column", md: "row" }}>
                <Button variant="outline" colorScheme="green">
                  延長
                </Button>
                <Button
                  onClick={async () => {
                    await toggleItemDone(item.id); // async/awaitを使っています
                    calculateNumberOfCheckedToPercentage();
                    notify();
                  }}
                  backgroundColor={item.isCompleted ? "green.600" : "green.500"}
                >
                  <Text color={"white"}>
                    {item.isCompleted ? "完了！" : "未完了"}
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
            {progressValuePercentate}
          </Text>
          ％です。
        </Text>
        <CustomProgressBar
          value={progressValuePercentate}
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
  let subtasks: subTaskForDisplay[] = [];
  const id = context.params?.id;
  console.log(id, "これが呼び出すtaskAPIデータ");
  try {
    const response = await axios.get<subTaskForDisplay[]>(
      `http://localhost:3000/api/subtask?forGetTaskId=${id}`
    );
    subtasks = response.data;
    console.log(response.data, "これが呼び出すsubtaskAPIデータ");
  } catch (error) {
    console.error("subtaskAPIの呼び出しに失敗:", error);
  }
  const imageurl = context.query.imageurl as string | undefined;

  return {
    props: {
      subtasks,
      imageurl,
    },
  };
};
