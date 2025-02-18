import React from "react";
import NestedComment from "./_component/nestedComment";

const commentsData = [
  {
    id: 1,
    user: "Reader1",
    text: "Great story!",
    likes: 5,
    replies: [
      {
        id: 2,
        user: "Author",
        text: "Thank you!",
        likes: 2,
        replies: [
          {
            id: 3,
            user: "Reader1",
            text: "When's the next chapter?",
            likes: 1,
            replies: [],
          },
        ],
      },
    ],
  },
];
const page = () => {
  return (
    <div>
      {commentsData.map((comment: any) => (
        <NestedComment key={comment.id} comment={comment} />
      ))}
    </div>
  );
};

export default page;
