import React, { useEffect, useState } from "react";

import { Post } from "../components/Post";

import { AddComment } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import { useParams } from "react-router-dom";
import axios from "../axios";
import ReactMarkdown from "react-markdown";

export const FullPost = () => {
  const [data, setData] = useState();
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  

  useEffect(() => {
    if (id) {
      axios
        .get(`/posts/${id}`)
        .then((res) => {
          setData(res.data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.warn(error);
          alert('An error occurred while fetching the data.');
        });

      axios
        .get(`/posts/${id}/comments`)
        .then((res) => {
          setComments(res.data);
        })
        .catch((error) => {
          console.log(error);
          alert('An error occurred while fetching comments.');
        });
    } else {
      alert('ID is undefined.');
    }
  }, [id]);



  if (isLoading) {
    return <Post isLoading={isLoading} isFullPost />
  }

  return (
    <>
      <Post
        id={data._id}
        title={data.title}
        imageUrl={data.imageUrl ? `http://localhost:4444${data.imageUrl}` : ''}
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={comments.length}
        tags={data.tags}
        isFullPost
      >
        <ReactMarkdown children={data.text} />
      </Post>
      <CommentsBlock
        items={comments.map((comment) => ({
          user: {
            fullName: comment.user.fullName,
            avatarUrl: comment.user.avatarUrl
          },
          text: comment.text
        }))}
        isLoading={false}
      >
        <AddComment />
      </CommentsBlock>
    </>
  );
};
