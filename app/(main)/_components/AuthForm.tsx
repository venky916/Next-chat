"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import Login from "./Login";
import SignUp from "./Signup";

const AuthForm = () => {
  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-inner">
      <Tabs defaultValue="login">
        <TabsList className="w-full ">
          <TabsTrigger value="login" className="w-full font-bold bg-transparent rounded-full">
            Log In
          </TabsTrigger>
          <TabsTrigger value="signup" className="w-full font-bold rounded-full">
            Sign Up
          </TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Login />
        </TabsContent>
        <TabsContent value="signup">
          <SignUp />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthForm;
