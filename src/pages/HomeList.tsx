import {
  Box,
  Button,
  Grid,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  Center,
  Spinner,
  VStack,
} from "@chakra-ui/react";
import Head from "next/head";
import Link from "next/link";
import TodoCardComponent from "~/components/TodoCardComponent";
import axios from "axios";
import { useCookies } from "react-cookie";
import { FaSearchengin } from "react-icons/fa";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { supabase } from "~/lib/supabaseClient";
import { taskForDisplay, tasksForHome } from "~/types/AllTypes";
import { CreateNewMonsterButtonComponent } from "~/components/ui/Button/Button";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function HomeList({ tasks }: tasksForHome) {
  const router = useRouter();
  const { data: session, status } = useSession(); // status を取得
  const [isLoaded, setIsLoaded] = useState(false); // 新しい state を追加

  const { isOpen, onOpen, onClose } = useDisclosure();
  const clickHandler = async () => {
    await router.push("/createtodo");
  };
  console.log(session, "sessionの値");

  useEffect(() => {
    if (status === "loading") return; // セッションがまだロード中の場合は早期リターン
    setIsLoaded(true); // セッションがロードされたら isLoaded を true に設定
    if (!session) {
      onOpen();
    }
  }, [session, onOpen, status]);

  if (!isLoaded)
    return (
      <>
        <Center>
          <VStack>
          <Text>ロード中です</Text>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
          </VStack>
        </Center>
      </>
    );

  return (
    <>
      <Grid templateColumns={["1fr", null, "1fr 1fr"]} gap={1}>
        {tasks.map((task) => (
          <TodoCardComponent
            key={task.id}
            id={task.id}
            title={task.title}
            detail={task.detail}
            isCompleted={task.isCompleted}
            imageData={
              task.imageData ??
              "https://images.unsplash.com/photo-1682685797365-41f45b562c0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3270&q=80"
            } // 画像データがnullの場合、デフォルトのURLを使用
          />
        ))}
      </Grid>

      <CreateNewMonsterButtonComponent onClick={clickHandler} />
      <Modal
        closeOnOverlayClick={false}
        isCentered
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay
          bg="blackAlpha.400"
          backdropFilter="blur(3px)"
          backdropInvert="40%"
          backdropBlur="2px"
        />
        <ModalContent>
          <ModalHeader>ようこそ！</ModalHeader>
          <ModalBody>
            <Text>
              ログインボタンよりGoogleアカウント、もしくはメールアドレスでログイン・サインアップしてください。
            </Text>
            <Center p={5}>
              <Button
                onClick={() =>
                  signIn(undefined, { callbackUrl: "http://localhost:3000/" })
                }
                colorScheme="teal"
              >
                ログイン
              </Button>
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
