import { Button, Grid } from "@chakra-ui/react";
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

export default function HomeList({ tasks }: tasksForHome) {
  const router = useRouter();

  const clickHandler = async () => {
    await router.push("/createtodo");
  };

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

      <CreateNewMonsterButtonComponent onClick={clickHandler} /> {/* 新しいコンポーネントを使用 */}
    </>
  );
}
