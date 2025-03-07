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
import axios from "axios";
import PasswordInput from "./PasswordInput";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useChatStore } from "@/hooks/useChatStore";

// Zod Schema for Validation
const formSchema = z.object({
  name: z.string().min(3, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(4, "Min length of 4"),
  confirmPassword: z.string().min(4, "Min length of 4"),
  photoUrl: z.string().url("Photo URL must be a valid URL"),
});

type FormData = z.infer<typeof formSchema>;

const SignUp = () => {
  // React Hook Form Setup
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      photoUrl: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useChatStore();

  // Handle File Selection
  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setLoading(true);

    const maxSize = 2 * 1024 * 1024; // 2 MB
    if (file.size > maxSize) {
      toast.warning("File size should not exceed 2 MB");
      setLoading(false);
      return;
    }

    const supportedTypes = ["image/jpeg", "image/png", "image/jpg"];

    if (supportedTypes.includes(file.type)) {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "Chat-App");
      data.append("cloud_name", "dqwc6qu4h");
      fetch("https://api.cloudinary.com/v1_1/dqwc6qu4h/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          form.setValue("photoUrl", data.url.toString());
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      toast.warning("Please select an image");
      setLoading(false);
      return;
    }
  };

  // Submit Handler
  const onSubmit = async (formData: FormData) => {
    console.log("Form Submitted:", formData);

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords did not match");
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_URL}/api/user/register`,
        formData,
        config
      );
      toast.success("Registration Successful");
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      router.push("/chat");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-md mx-auto"
      >
        {/* Name Field */}
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Name <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email Field */}
        <FormField
          name="email"
          control={form.control}
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
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Password <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <PasswordInput
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Confirm Password <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <PasswordInput
                  showPassword={showConfirmPassword}
                  setShowPassword={setShowConfirmPassword}
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="photoUrl"
          control={form.control}
          render={() => (
            <FormItem>
              <FormLabel>Upload your Picture</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  placeholder="Choose File"
                  onChange={handleFileChange}
                  disabled={loading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-blue-400"
          disabled={form.formState.isSubmitting}
        >
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default SignUp;
