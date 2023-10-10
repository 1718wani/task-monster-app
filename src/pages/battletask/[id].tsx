import { GetServerSidePropsContext, NextPage } from "next";
import {
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Progress,
  SimpleGrid,
  Stack,
  Text,
  VStack,
  cookieStorageManager,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { TimerOfTaskComponent } from "~/components/TimerOfTaskComponent";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { EndOfBattleModal } from "~/components/EndOfBattleModal";
import { subTaskForDisplay } from "~/types/AllTypes";
import { useRouter } from "next/router";

type Props = {
  subtasks: subTaskForDisplay[];
  imageurl: string | undefined;
};

export const BattleTask: NextPage<Props> = ({ subtasks, imageurl }) => {
  // 現在のカラー
  const [colorStates, SetColorStatus] = useState("teal");
  // パーセンテージ
  const [progressValuePercentate, setProgressValuePercentate] = useState(100);
  const [items, setItems] = useState(subtasks);

  const [targetProgressValue, setTargetProgressValue] = useState(100);
  const [isTransition, setIsTransition] = useState(false);
  console.log(items);
  const notify = () => toast("サブタスク完了によるこうげき", { icon: "👏" });
  const { isOpen, onOpen, onClose } = useDisclosure();
  console.log(imageurl, "現在の画像URL");
  const router = useRouter(); 

  // サブタスクの完了状態を変更する関数
  const toggleItemDone = (id: number | string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
      )
    );
  };

  console.log(subtasks, "現在のサブタスク");
  console.log(items, "現在のアイテム");
  console.log(progressValuePercentate, "現在のパーセンテージ");
  console.log(targetProgressValue, "ターゲットのパーセンテージ");

  // サブタスクの合計時間を計算する
  const total = items.reduce((acc, task) => acc + task.estimatedMinutes, 0);
  console.log(total, "合計時間");

  const testDate = new Date();
  testDate.setSeconds(testDate.getSeconds() + total * 60); // 10 minutes timer

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
    // タスクの合計時間
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

    if (progressPercentage === 0 ) {
      setTimeout(() => {
        onOpen();
      }, 900);
    } else if (progressPercentage <= 20) {
      SetColorStatus("red");
    } else if (progressPercentage > 60) {
      SetColorStatus("teal");
    } else {
      SetColorStatus("yellow");
    }

    // パーセンテージをsetState関数でセット
    setTargetProgressValue(progressPercentage);
    setIsTransition(true);
  };

  return (
    <SimpleGrid columns={2} spacingY="10px" py={20}>
      <Stack spacing={6} w={"full"} maxW={"xl"} ml="100">
        <TimerOfTaskComponent
          expiryTimestamp={testDate}
          amountSeconds={total * 60}
        />
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
                  onClick={() => {
                    toggleItemDone(item.id);
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
        <Button
        onClick={async() => {
          await router.push("/");
        }}
        >
          <Text>戦闘を中断する</Text>
        </Button>
      </Stack>

      <VStack spacing={6} w={"full"} maxW={"xl"} ml="100">
       < Text fontSize={"lg"} as="b">
         あと
          <Text as="i" fontSize="4xl" display="inline" pr={2}>
            {progressValuePercentate}
          </Text>
        ％です。
        </Text>
        <Progress
          width="full"
          colorScheme={colorStates}
          size="lg"
          value={progressValuePercentate}
          isAnimated
          hasStripe
          height="25px"
          shadow="dark-lg"
          rounded="lg"
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
