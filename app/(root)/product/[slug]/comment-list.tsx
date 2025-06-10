"use client";

import { Comment } from "@/types";
import { useEffect, useState } from "react";
import { getComment } from "@/lib/actions/comment.actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, User } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import CommentForm from "./comment-form";

const CommentList = ({
  userId,
  productId,
}: {
  userId: string;
  productId: string;
}) => {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const loadComments = async () => {
      const res = await getComment({ productId });
      const normalizedData = res.data.map(({ user, ...rest }) => ({
        ...rest,
        user: user ?? undefined,
        userId: userId ?? undefined,
      }));
      setComments(normalizedData);
    };
    loadComments();
  }, [productId]);

  // Reload reviews after created
  const reload = async () => {
    const res = await getComment({ productId });
    const normalizedData = res.data.map(({ user, ...rest }) => ({
      ...rest,
      user: user ?? undefined,
      userId: userId ?? undefined,
    }));
    setComments([...normalizedData]);
  };

  return (
    <div className="space-y-4">
      {comments.length === 0 && <div>No Comments yet</div>}
      <CommentForm
        productId={productId}
        userId={userId}
        onReviewSubmitted={reload}
      />
      <div className="flex flex-col gap-3">
        {comments.map((comment) => (
          <Card key={comment.id}>
            <CardHeader>
              <div className="flex-between">
                <CardTitle>{comment.title}</CardTitle>
              </div>
              <CardDescription>{comment.body}</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="flex space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <User className="mr-1 h-3 w-3" />
                  {comment.user ? comment.user.name : "Annonymous"}
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-1 h-3 w-3" />
                  {formatDateTime(comment.createdAt).dateTime}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CommentList;
