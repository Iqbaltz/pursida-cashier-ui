"use client";
import { useRouter } from "next-nprogress-bar";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/cashier");
  }, []);

  return (
    <div className="w-full flex justify-center items-center p-8">
      <h1 className="font-bold text-2xl">POS Demo Cashier Dashboard</h1>
    </div>
  );
}
