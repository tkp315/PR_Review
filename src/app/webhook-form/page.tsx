"use client";
import { z } from "zod";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useSession } from "next-auth/react";
import { FormProvider } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FiLoader } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


const inputFieldData: Array<{
  field: keyof FormData;
  type: string;
  label: string;
}> = [
  { field: "owner", type: "text", label: "Owner Name" },
  { field: "repo", type: "text", label: "Repository Name" },
  { field: "webhookUrl", type: "text", label: "Webhook URL" },
];

const formSchema = z.object({
  owner: z.string().min(1, { message: "Owner name is required" }),
  repo: z.string().min(1, { message: "Repo name is required" }),
  webhookUrl: z.string().url({ message: "Invalid webhook URL" }), 
  accessToken:z.string()
});

type FormData = z.infer<typeof formSchema>;

function Page() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      owner: "",
      repo: "",
      webhookUrl: "",
    },
  });

  const { formState: { errors } } = form;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session} = useSession();
  const accessToken = session?.accessToken
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!accessToken) {
      console.error("Access token is not available");
      return;
    }

    setIsSubmitting(true);

    try {
      const dataObj = {...data,accessToken:accessToken}
      const res = await axios.post("/api/webhook", dataObj, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Pass the token in the Authorization header
          "Content-Type": "application/json",
        },
      });

      console.log("Webhook created successfully:", res.data);
    } catch (error) {
      console.error("Error creating webhook:", error);
      // Optionally, you can handle the error to display a message to the user
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="justify-center items-center flex min-h-screen">
      <div className="w-fit p-10 bg-slate-200 shadow-lg rounded-md">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-3 flex flex-col gap-4">
            {inputFieldData.map((item) => (
              <FormField
                key={item.field}
                control={form.control}
                name={item.field}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">{item.label}</FormLabel>
                    <FormControl>
                      <Input
                        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        {...field}
                        type={item.type}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs">
                      {errors[item.field]?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
            ))}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isSubmitting ? (
                <>
                  <FiLoader className="mr-2 h-4 w-4 animate-spin" /> Please wait
                </>
              ) : (
                "Save"
              )}
            </Button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}

export default Page;
