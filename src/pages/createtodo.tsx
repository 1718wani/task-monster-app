import { useForm } from "react-hook-form";
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Progress,
  Image,
  Box,
  Skeleton,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import {
  RegisterationFailureNotification,
  RegisterationSuccessNotification,
} from "~/notifications/notifications";
import { useSession } from "next-auth/react";
import { taskValidation } from "~/schemas/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import type { NextPage } from "next";
import { useState } from "react";
import { CustomTodoApiRequest, TodoFormData } from "~/types/AllTypes";

type formInputs = {
  taskTitle: string;
  taskDetail: string | null;
};

export const CreateTodo: NextPage = () => {
  // emailを一意の値として獲得できる。
  const { data: session } = useSession();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [apiResponse, setApiResponse] = useState();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<formInputs>({
    resolver: zodResolver(taskValidation),
  });

  const onSubmit = async (data: formInputs) => {
    console.log(data);
    onOpen();

    try {
      const response = await axios.post("http://localhost:3000/api/task", {
        // APIエンドポイントに注意
        userId: session?.user.userId,
        title: data.taskTitle,
        detail: data.taskDetail,
        isCompleted: false,
      });

      setApiResponse(response.data);
      console.log(response.data, "これがタスク作成時のレスポンスデータ");
    } catch (error) {
      console.error("Error creating task:", error);
      RegisterationFailureNotification();
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={!!errors.taskTitle}>
          <FormLabel htmlFor="tasktitle">タスクのタイトル</FormLabel>
          <Input
            id="tasktitle"
            placeholder="タスクのタイトル"
            {...register("taskTitle")}
          />
          {errors.taskTitle && (
            <FormErrorMessage>{errors.taskTitle.message}</FormErrorMessage>
          )}
          <FormLabel htmlFor="taskdetail">タスクの詳細</FormLabel>
          <Input
            id="taskdetail"
            placeholder="タスクの詳細"
            {...register("taskDetail")}
          />
        </FormControl>
        <Button
          mt={4}
          colorScheme="teal"
          loadingText="送信中です"
          isLoading={isSubmitting}
          type="submit"
        >
          送信する
        </Button>
      </form>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {isSubmitting && <Box>現在モンスターを作成しています</Box>}
            {isSubmitSuccessful && <Box>モンスターの作成が成功しました！</Box>}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isSubmitting && <Progress size="md" isIndeterminate />}
            {isSubmitting && <Skeleton rounded={20} boxSize="300px" />}
            {isSubmitSuccessful && (
              <Image
                rounded={20}
                boxSize="300px"
                src={apiResponse?.imageData}
                alt="monster"
                shadow={"xl"}
              />
            )}
          </ModalBody>
          <ModalFooter>
            {isSubmitSuccessful && (
              <Button
                colorScheme={"blue"}
                variant={"solid"}
                onClick={async () => await router.push("/")}
              >
                ホームに戻る
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateTodo;
