// export interface SessionData {
//   userId?:string;
//   username?:string;
//   img?:string;
//   isPro?:boolean
//   isBlocked?:boolean
//   isLoggedIn:boolean
// }

export const defaultSession = {
  isLoggedIn: false,
};

export const sessionOptions = {
  password: process.env.SECRET_KEY,
  cookieName: "new-cookie",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  },
};
