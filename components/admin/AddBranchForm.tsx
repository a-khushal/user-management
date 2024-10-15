'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { addBranch } from '@/actions/addBranch';
import { useToast } from "@/hooks/use-toast";
import { PlusCircle } from "lucide-react"

const formSchema = z.object({
  branchName: z.string().min(5, {
    message: "Branch Name must be at least 5 characters",
  }),
  branchCode: z.string().max(5, {
    message: "Branch code cannot exceed 5 characters",
  }),
});

export default function AddBranchForm({ semester }: {
  semester: number
}) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      branchName: "",
      branchCode: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const props = {
      name: values.branchName,
      code: values.branchCode.toUpperCase(),
      semester: semester
    };
    const res = await addBranch(props);

    if (res && res.message) {
      toast({
        title: res.message,
      })
    } else if (res.error) {
      toast({
        title: res.error,
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Branch
        </Button>
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
            <Button type="submit" disabled={!form.formState.isValid || form.formState.isSubmitting}>Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
