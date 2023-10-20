import {
  Badge,
  Button,
  Center,
  Flex,
  Heading,
  Image,
  Input,
  Progress,
  Stack,
  Text,
  Textarea,
  useColorModeValue,
} from "@chakra-ui/react";
import axios from "axios";

import { useRouter } from "next/router";
import { Controller, useForm } from "react-hook-form";
import type { formInputs } from "~/pages/createtodo";
import { subTaskForDisplay } from "~/types/AllTypes";

interface TodoProps {
  id: number;
  title: string;
  detail: string | null;
  isCompleted: boolean;
  imageData: string;
  totalMinutes: number | null;
  remainingMinutes: number | null;
  isEditable: boolean;
  enterEditMode: (id: number | null) => void; // 追加
  subTasks: subTaskForDisplay[];
}

export default function TodoCardComponent({
  id,
  title,
  detail,
  isCompleted,
  imageData,
  isEditable,
  enterEditMode,
  totalMinutes,
  remainingMinutes,
  subTasks,
}: TodoProps) {
  const router = useRouter();
  // React Hook Formの初期化
  const { handleSubmit, control, setValue } = useForm({
    defaultValues: {
      taskTitle: title,
      taskDetail: detail ?? "",
    },
  });

  const completedSubTasks = subTasks.filter(
    (subTask) => subTask.isCompleted
  ).length;
  const totalSubTasks = subTasks.length;

  console.log(totalMinutes, "totalMinutesの値");
  console.log(remainingMinutes, "remainingMinutesの値");
  console.log(totalSubTasks, "totalSubTasksの値");
  console.log(completedSubTasks, "totalSubTasksの値");

  const onSubmit = async (data: formInputs) => {
    console.log(data, "編集コンポーネントにおける送信データ");
    try {
      const response = await axios.put(
        `http://localhost:3000/api/tasks/${id}`,
        {
          title: data.taskTitle,
          detail: data.taskDetail,
        }
      );
      console.log(response.data, "これがタスク更新時のレスポンスデータ");
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const clickHandler = async (q: string) => {
    await router.push(q);
  };
  if (isEditable) {
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <Center py={6}>
          <Stack
            borderWidth="1px"
            borderRadius="lg"
            w={{ sm: "100%", md: "540px" }}
            height={{ sm: "476px", md: "20rem" }}
            direction={{ base: "column", md: "row" }}
            // eslint-disable-next-line react-hooks/rules-of-hooks
            bg={useColorModeValue("white", "gray.900")}
            boxShadow={"2xl"}
            padding={4}
          >
            <Flex flex={1} bg="blue.200">
              <Image
                objectFit="cover"
                boxSize="100%"
                src={imageData}
                alt="#"
              />
            </Flex>
            <Stack
              flex={1}
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              p={1}
              pt={2}
            >
              <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                  name="taskTitle"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      size="lg"
                      fontWeight="bold"
                      variant="unstyled"
                      fontFamily={"body"}
                      fontSize={"2xl"}
                      bg={"gray.50"}
                      autoFocus // これを追加
                    />
                  )}
                />
                <Controller
                  name="taskDetail"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      size="md"
                      variant="unstyled"
                      textAlign={"center"}
                      bg={"gray.50"}
                      px={3}
                    />
                  )}
                />
              </form>
              {isCompleted ? (
                <Badge fontSize="1.2em" colorScheme="green">
                  討伐Done！
                </Badge>
              ) : (
                <Badge fontSize="1.2em">not yet！</Badge>
              )}

              <Stack
                width={"100%"}
                mt={"2rem"}
                direction={"row"}
                padding={2}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Button
                  flex={1}
                  fontSize={"sm"}
                  rounded={"full"}
                  _focus={{
                    bg: "gray.200",
                  }}
                  onClick={() => enterEditMode(null)}
                >
                  キャンセル
                </Button>
                <Button
                  flex={1}
                  fontSize={"sm"}
                  rounded={"full"}
                  colorScheme="teal"
                  boxShadow={
                    "0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)"
                  }
                  type="submit"
                  onClick={() => enterEditMode(null)}
                >
                  保存する
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Center>
      </form>
    );
  } else {
    return (
      <Center py={6}>
        <Stack
          borderWidth="1px"
          borderRadius="lg"
          w={{ sm: "100%", md: "540px" }}
          height={{ sm: "476px", md: "20rem" }}
          direction={{ base: "column", md: "row" }}
          // eslint-disable-next-line react-hooks/rules-of-hooks
          bg={useColorModeValue("white", "gray.900")}
          boxShadow={"2xl"}
          padding={4}
        >
          <Flex flex={1} bg="blue.200">
            <Image objectFit="cover" boxSize="100%" src={imageData} alt="#" />
          </Flex>
          <Stack
            flex={1}
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            p={1}
            pt={2}
          >
            <Heading fontSize={"2xl"} fontFamily={"body"}>
              {title}
            </Heading>
            <Text
              textAlign={"center"}
              // eslint-disable-next-line react-hooks/rules-of-hooks
              color={useColorModeValue("gray.700", "gray.400")}
              px={3}
            >
              {detail}
            </Text>
            {isCompleted && (
              <Badge fontSize="1.2em" colorScheme="teal">
                討伐Done！
              </Badge>
            )}
            {!isCompleted && totalMinutes === null && (
              <Badge fontSize="1.2em">not yet！</Badge>
            )}
            {totalMinutes !== null && !isCompleted && (
              <Badge colorScheme="yellow" fontSize="1.2em">
                on Progress
              </Badge>
            )}

            <Text fontSize="xs">
              残りタスク {completedSubTasks} / {totalSubTasks}
            </Text>
            <Progress
              isAnimated
              hasStripe
              rounded="lg"
              width={"full"}
              h={4}
              value={(completedSubTasks / totalSubTasks) * 100}
            />
            <Text fontSize="xs">
              残り時間 {remainingMinutes}分 / {totalMinutes} 分
            </Text>
            <Progress
              isAnimated
              hasStripe
              rounded="lg"
              width={"full"}
              h={4}
              value={(remainingMinutes / totalMinutes) * 100}
            />

            <Stack
              width={"100%"}
              mt={"2rem"}
              direction={"row"}
              padding={2}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Button
                flex={1}
                fontSize={"sm"}
                rounded={"full"}
                _focus={{
                  bg: "gray.200",
                }}
                onClick={() => enterEditMode(id)}
              >
                編集する
              </Button>
              {totalMinutes !== null && !isCompleted && (
                <Button
                  flex={1}
                  fontSize={"sm"}
                  rounded={"full"}
                  colorScheme="yellow"
                  boxShadow={
                    "0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)"
                  }
                  onClick={() =>
                    clickHandler(
                      `/battletask/${id}?imageurl=${imageData}`
                    )
                  }
                  color="white"
                >
                  続きから
                </Button>
              )}

              {!isCompleted && totalMinutes === null && (
                <Button
                  flex={1}
                  fontSize={"sm"}
                  rounded={"full"}
                  bg={"red.400"}
                  color={"white"}
                  boxShadow={
                    "0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)"
                  }
                  _hover={{
                    bg: "red.500",
                  }}
                  _focus={{
                    bg: "red.500",
                  }}
                  onClick={() =>
                    clickHandler(
                      `/createsubtask/${id}?title=${title}&imageurl=${imageData}`
                    )
                  }
                >
                  討伐する
                </Button>
              )}
            </Stack>
          </Stack>
        </Stack>
      </Center>
    );
  }
}
