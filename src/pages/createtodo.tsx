import { useForm } from "react-hook-form";
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { RegisterationFailureNotification, RegisterationSuccessNotification } from "~/notifications/notifications";
import { useSession } from "next-auth/react";

type formInputs = {
  taskTitle: string;
  taskDetail: string;
};

export const CreateTodo = () => {
  // emailを一意の値として獲得できる。
  const {data:session} = useSession();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<formInputs>();

  const onSubmit = async (data: formInputs) => {
    console.log(data);

    try {
      const response = await axios.post("http://localhost:3000/api/task", {
        // APIエンドポイントに注意
        userId: session?.user.userId,
        title: data.taskTitle,
        detail: data.taskDetail,
        isCompleted: false,
      });

      console.log(response.data);

      await router.push('/'); 
      RegisterationSuccessNotification();
     
    } catch (error) {
      console.error("Error creating task:", error);
      RegisterationFailureNotification()
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl isInvalid={!errors.taskTitle}>
        <FormLabel htmlFor="tasktitle">タスクのタイトル</FormLabel>
        <Input
          id="tasktitle"
          placeholder="タスクのタイトル"
          {...register("taskTitle", {
            required: "This is required",
          })}
        />
        <FormErrorMessage>{errors.taskTitle?.toString()}</FormErrorMessage>
        <FormLabel htmlFor="taskdetail">タスクの詳細</FormLabel>
        <Input
          id="taskdetail"
          placeholder="タスクの詳細"
          {...register("taskDetail", {
            required: "This is required",
          })}
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
  );
};

export default CreateTodo;
