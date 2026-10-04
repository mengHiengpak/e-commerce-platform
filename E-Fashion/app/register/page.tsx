import type { Metadata } from "next";

import { RegisterPage } from "@/components/sections/auth-pages";

export const metadata: Metadata = {
  title: "Register",
  description: "Create an account to save favourites and check out faster.",
};

export default function Register() {
  return <RegisterPage />;
}
