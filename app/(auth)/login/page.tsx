import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import LoginForm from "./components/login-form";

type Props = {};

export default function LoginPage({}: Props) {
  return (
    <div className="flex min-h-screen justify-center items-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login POS</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm />
        <p className="mt-2 text-sm text-gray-500">
          Hint: Email{" "}
          <span className="font-mono text-blue-500">admin@testing.com</span><br />
          Password: <span className="font-mono text-blue-500">password</span>
        </p>
        </CardContent>
      </Card>
    </div>
  );
}
