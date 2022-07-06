import React, { useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";
import { Post } from "../components/Post";
import { TagsBlock } from "../components/TagsBlock";
import { CommentsBlockHome } from "../components/CommentsBlockHome";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCommentaries,
  fetchPopularPosts,
  fetchPosts,
  fetchTags,
} from "../redux/slices/posts";

export const Home = () => {
  const dispatch = useDispatch();
  const { posts, tags, commentaries } = useSelector((state) => state.posts);
  const userData = useSelector((state) => state.auth.data);
  const [tabValue, setTabValue] = useState(0);
  const isPostsLoading = posts.status === "loading";
  const isTagsLoading = tags.status === "loading";
  const {items} = posts


  useEffect(() => {
    tabValue === 0 ? dispatch(fetchPosts()) : dispatch(fetchPopularPosts());
    dispatch(fetchTags());
  }, [tabValue]);

  useEffect(()=>{
    dispatch(fetchCommentaries())
  }, [])
  


  const tabsHandler = (e, newValue) => {
    setTabValue(newValue);
    if (e.target.textContent === "New") {
      dispatch(fetchPosts());
    } else if (e.target.textContent === "Popular") {
      dispatch(fetchPopularPosts());
    }
  };

  return (
    <>
      <Tabs
        onChange={tabsHandler}
        style={{ marginBottom: 15 }}
        value={tabValue}
        aria-label="basic tabs example"
      >
        <Tab index={0} label="New" />
        <Tab index={1} label="Popular" />
      </Tabs>
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
                  obj.imageUrl ? `http://localhost:4444${obj.imageUrl}` : ""
                }
                user={obj.user}
                createdAt={obj.createdAt}
                viewsCount={obj.viewsCount}
                commentsCount={obj.commentaries.length}
                tags={obj.tags}
                isEditable={userData?._id === obj.user._id}
              />
            )
          )}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
          <CommentsBlockHome
            comments={commentaries}
            isLoading={false}
          />
        </Grid>
      </Grid>
    </>
  );
};
