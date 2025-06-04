"use client";

import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";

// import {
//   Dialog,
//   DialogContent,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { LoginForm } from "@/components/auth/login-form";

interface LoginButtonProps {
  children: React.ReactNode;
  mode?: "modal" | "redirect",
  asChild?: boolean;
};

export const LoginButton = ({
  children,
  mode = "redirect",
  asChild
}: LoginButtonProps) => {
  const router = useRouter();

  const onClick = () => {
    console.log("goto /auth/login")
    router.push("/auth/login");
  };

//   if (mode === "modal") {
//     return (
//       <Dialog>
//         <DialogTrigger asChild={asChild}>
//           {children}
//         </DialogTrigger>
//         <DialogContent className="p-0 w-auto bg-transparent border-none">
//           <LoginForm />
//         </DialogContent>
//       </Dialog>
//     )
//   }

  return (
    // <span onClick={onClick} className="cursor-pointer">
    // {/* {children} */}
    // </span>
    <Button color="secondary" onPress={onClick} >
      {children}
    </Button>
  );
};