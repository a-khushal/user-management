"use client";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { addBranch } from "@/actions/addBranch";

const formSchema = z.object({
  branchName: z.string().min(5, {
    message: "Branch Name must be at least 5 characters",
  }),
  branchCode: z.string().max(5, {
    message: "Branch code cannot exceed 5 characters",
  }),
});

export default function AddBranchDialog() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      branchName: "",
      branchCode: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const props = {
        name: values.branchName,
        code: values.branchCode
    };
    const res = addBranch(props);
    console.log(res);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">+</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add branch</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Add a new branch here. Click submit when done.
        </DialogDescription>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="branchName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Computer Science" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="branchCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch Code</FormLabel>
                  <FormControl>
                    <Input placeholder="CSE" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogTrigger asChild>
                <Button type="submit">Submit</Button>
            </DialogTrigger>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
