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
import { motion } from "framer-motion";

import { useRouter } from "next/router";
import type { subTaskForDisplay } from "~/types/AllTypes";
import EditableCard from "./ui/Card/EditableCard";
import NotStartedCard from "./ui/Card/NotStartedCard";
import OnProgressCard from "./ui/Card/OnProgressCard";
import IsCompletedCard from "./ui/Card/IsCompletedCard";

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

  const completedSubTasks = subTasks
    ? subTasks.filter((subTask) => subTask.isCompleted).length
    : 0;

  const totalSubTasks = subTasks ? subTasks.length : 0;

  const remainingMinutesorZero = remainingMinutes ? remainingMinutes : 0;

  const clickHandler = async (q: string) => {
    await router.push(q);
  };
  if (isEditable) {
    return (
      <EditableCard
        title={title}
        detail={detail}
        id={id}
        imageData={imageData}
        enterEditMode={enterEditMode}
      />
    );
  } else if (!isCompleted && totalMinutes === null) {
    return (
      <NotStartedCard
        title={title}
        detail={detail}
        id={id}
        imageData={imageData}
        enterEditMode={enterEditMode}
      />
    );
  } else if (!isCompleted && totalMinutes !== null) {
    return (
      <OnProgressCard
        title={title}
        detail={detail}
        id={id}
        imageData={imageData}
        enterEditMode={enterEditMode}
        totalMinutes={totalMinutes}
        remainingMinutes={remainingMinutesorZero}
        subTasks={subTasks}
      />
    );
  } else if (isCompleted) {
    return (
      <IsCompletedCard
        title={title}
        detail={detail}
        id={id}
        imageData={imageData}
        enterEditMode={enterEditMode}
      />
    );
  }
  return (
    <Center py={6}>
      <motion.div
        initial={{ x: 0, y: 0 }}
        whileHover={{ x: -3, y: -3 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
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
                    clickHandler(`/battletask/${id}?imageurl=${imageData}`)
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
      </motion.div>
    </Center>
  );
}
