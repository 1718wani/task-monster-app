import React, { useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { NextPage } from "next";
import axios from "axios";
import { useCookies } from "react-cookie";
import { string } from "zod";

const Login: NextPage = () => {
  const { data: session } = useSession();
  const [cookies, setCookie, removeCookie] = useCookies(["userInfo"]);
  console.log(session, "sessionの値");

  useEffect(() => {
    if (session) {
      // Fetch the userId from our API route
      axios
        .get("http://localhost:3000/api/userid")
        .then((response) => {
          setCookie("userInfo", response.data);
        })
        .catch((err) => {
          console.error("Error fetching userId:", err);
        });
    }
  }, [session]);

  return (
    <>
      {session && (
        <div>
          <h1>ようこそ, {session.user && session.user.email}</h1>
          <button onClick={() => signOut()}>ログアウト</button>
        </div>
      )}
      {!session && (
        <div>
          <p>ログインしていません</p>
          <button onClick={() => signIn( )}>
            ログイン
          </button>
        </div>
      )}
    </>
  );
};

export default Login;
