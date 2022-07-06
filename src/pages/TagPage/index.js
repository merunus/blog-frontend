import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import styles from "./TagPage.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { Post } from "../../components";
import { TagsBlock } from "../../components/TagsBlock";
import { Link, useParams } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import { fetchPostsWithTags } from "../../redux/slices/posts";
export const TagPage = () => {
  const { name } = useParams();
  const dispatch = useDispatch();
  const { posts, tags } = useSelector((state) => state.posts);
  const userData = useSelector((state) => state.auth.data);
  const isPostsLoading = posts.status === "loading";
  const isTagsLoading = tags.status === "loading";

  useEffect(() => {
    dispatch(fetchPostsWithTags(name));
  }, [name]);

  return (
    <>
      <Button href="/" color="primary">
        <Link className={styles.link} to="/">
          Back to posts
        </Link>
      </Button>
      <Typography style={{ padding: "30px 0", fontWeight: "500", color: "grey" }} variant="h2">
        #{name}
      </Typography>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostsLoading ? [...Array(5)] : posts.items).map((obj, index) =>
            isPostsLoading ? (
              <Post key={index} isLoading={true} />
            ) : (
              <Post
                key={index}
                id={obj._id}
                title={obj.title}
                imageUrl={
                  obj.imageUrl ? `${process.env.REACT_APP_API_URL}{obj.imageUrl}` : ""
                }
                user={obj.user}
                createdAt={obj.createdAt}
                viewsCount={obj.viewsCount}
                commentsCount={3}
                tags={obj.tags}
                isEditable={userData?._id === obj.user._id}
              />
            )
          )}
        </Grid>
        <Grid  xs={4} item>
            <TagsBlock items={tags.items} isLoading={isTagsLoading} />
          </Grid>
      </Grid>
    </>
  );
};

/*

 */
