"use server";

import { sessionOptions, defaultSession } from "@/lib/sessionManagment";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

let username = "john";
let isPro = true;
let isBlocked = true;

// lib/SessionActions.js
import { getIronSession } from "iron-session";

export const getSession = async (req, res) => {
  const session = await getIronSession(req, res, sessionOptions);
  console.log(session, " session in get session ");
  if (!session.isLoggedIn) {
    session.isLoggedIn = false;
  }

  // Placeholder checks, replace with actual logic
  session.isBlocked = false;
  session.isPro = false;

  return session;
};

// export const getSession = async () => {
//   const session = await getIronSession(cookies(), sessionOptions);

//   if (!session.isLoggedIn) {
//     session.isLoggedIn = defaultSession.isLoggedIn;
//   }

//   // CHECK THE USER IN THE DB
//   session.isBlocked = isBlocked;
//   session.isPro = isPro;

//   return session;
// };

// export const getSession = async () => {
//   const session = await getIronSession(cookies(), sessionOptions);

//   if (!session.isLoggedIn) {
//     session.isLoggedIn = defaultSession.isLoggedIn;
//   }

//   // CHECK THE USER IN THE DB
//   session.isBlocked = isBlocked;
//   session.isPro = isPro;

//   return session;
// };

// export const login = async (
//   prevState: { error: undefined | string },
//   formData: FormData
// ) => {
//   const session = await getSession();

//   const formUsername = formData.get("username") as string;
//   const formPassword = formData.get("password") as string;

//   // CHECK USER IN THE DB
//   // const user = await db.getUser({username,password})

//   if (formUsername !== username) {
//     return { error: "Wrong Credentials!" };
//   }

//   session.userId = "1";
//   session.username = formUsername;
//   session.isPro = isPro;
//   session.isLoggedIn = true;

//   await session.save();
//   redirect("/");
// };

export const logout = async () => {
  const session = await getSession();
  session.destroy();
  redirect("/");
};

export const changePremium = async () => {
  const session = await getSession();

  isPro = !session.isPro;
  session.isPro = isPro;
  await session.save();
  revalidatePath("/profile");
};

export const changeUsername = async (formData) => {
  const session = await getSession();

  const newUsername = formData.get("username");

  username = newUsername;

  session.username = username;
  await session.save();
  revalidatePath("/");
};
