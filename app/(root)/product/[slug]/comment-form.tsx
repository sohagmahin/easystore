"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { createComment } from "@/lib/actions/comment.actions";
import { commentFormDefaultValues } from "@/lib/constants";
import { insertCommentSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";

import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const CommentForm = ({
  userId,
  productId,
  onReviewSubmitted,
}: {
  userId?: string;
  productId: string;
  onReviewSubmitted: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof insertCommentSchema>>({
    resolver: zodResolver(insertCommentSchema),
    defaultValues: commentFormDefaultValues,
  });

  // open form handler
  const handleOpenForm = async () => {
    form.setValue("productId", productId);
    if (userId) form.setValue("userId", userId);

    setOpen(true);
  };

  // Open Form Handler
  const onSubmit: SubmitHandler<z.infer<typeof insertCommentSchema>> = async (
    values
  ) => {
    const res = await createComment({ ...values, productId });
    if (!res.success) {
      return toast({
        variant: "destructive",
        description: res.message,
      });
    }

    setOpen(false);
    onReviewSubmitted();

    form.reset();

    toast({
      description: res.message,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button className="mt-3" onClick={handleOpenForm} variant="default">
        Do Comments
      </Button>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form method="post" onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Write a comment</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              Share your thoughts on this product
            </DialogDescription>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter title" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comments</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter Your Comments" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CommentForm;
