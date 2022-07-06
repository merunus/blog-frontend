import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import axios from "../axios";
import ReactMarkdown from "react-markdown";
import { useSelector } from "react-redux";

export const FullPost = () => {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const userData = useSelector((state) => state.auth.data);

  useEffect(() => {
    axios
      .get(`/posts/${id}`)
      .then((res) => {
        setData(res.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.warn(error);
        alert("Error while getting post!");
      });
  }, []);

  
  if (isLoading) {
    return <Post isLoading={isLoading} />;
  }

  return (
    <>
      <Post
        id={data._id}
        title={data.title}
        imageUrl={data.imageUrl ? `${process.env.REACT_APP_API_URL}{data.imageUrl}` : ""}
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={data.commentaries.length}
        tags={data.tags}
        isFullPost
      >
        <ReactMarkdown children={data.text} />
        {/* <p>{data.text}</p> */}
      </Post>
      <CommentsBlock
        comments={data.commentaries}
        isLoading={false}
        isEditable={userData?._id === data.user._id}
        postId={data._id}
        userData = {userData}
        postData = {data}
      >
        <Index data={data} />
      </CommentsBlock>
    </>
  );
};
