"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import axios from "axios";
import { Loader2 } from "lucide-react";
import PasswordInput from "./PasswordInput";
import { useRouter } from "next/navigation";
import useLocalStorage from "@/hooks/useLocalStorage";

// Zod Schema for Validation
const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(4, "Min length of 4"),
});

type FormData = z.infer<typeof formSchema>;

const Login = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    control,
    formState: { isSubmitting },
    handleSubmit
  } = form;

  const router = useRouter();
  const [show, setShow] = useState(false);
  const [, setUser] = useLocalStorage("user", null);

  const handleGuestCredentials = () => {
    form.setValue("email", "guest@example.com");
    form.setValue("password", "Guest@1234");
  };

  const onSubmit = async (formData: FormData) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_URL}/api/user/login`,
        formData,
        config
      );
      setUser(data);
      toast.success("Login successful");
      router.push("/chat");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        method="POST"
        className="space-y-4 max-w-md mx-auto"
      >
        <FormField
          name="email"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Email Address <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Password <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <PasswordInput
                  showPassword={show}
                  setShowPassword={setShow}
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-blue-400">
          {!isSubmitting ? (
            "Login"
          ) : (
            <>
              <Loader2 className="animate-spin" />
              LoggingIn...
            </>
          )}
        </Button>

        <Button
          type="button"
          className="w-full bg-red-700 hover:bg-rose-400 transition"
          onClick={handleGuestCredentials}
        >
          Get Guest User Credentials
        </Button>
      </form>
    </Form>
  );
};

export default Login;
