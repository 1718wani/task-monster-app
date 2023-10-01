import { Button } from "@chakra-ui/react";
import Head from "next/head";
import Link from "next/link";
import TodoCardComponent from "~/components/TodoCardComponent";
import axios from "axios";
import { useCookies } from "react-cookie";
import { FaSearchengin } from "react-icons/fa";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { supabase } from "~/lib/supabaseClient";
import HomeList from "./HomeList";
import { taskForDisplay, tasksForHome } from "~/types/AllTypes";

export default function Home(props: tasksForHome) {
  const [cookies, setCookie, removeCookie] = useCookies(["userId"]);
  console.log(cookies, "これがクッキーdayoho-menochakr");
  return (
    <>
      <HomeList tasks={props.tasks}></HomeList>

    </>
  );
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  let tasks: taskForDisplay[] = [];

  // クッキーからuserIdを取得
  const cookies = context.req.cookies;
  const userId = cookies.userId;

  if (!userId) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  try {
    const response = await axios.get<taskForDisplay[]>(
      "http://localhost:3000/api/task",
      {
        params: {
          userId: userId,
        },
      }
    );
    tasks = response.data;
  } catch (error) {
    console.error("APIの呼び出しに失敗:", error);
  }

  

  return {
    props: {
      tasks,
    },
  };
};

