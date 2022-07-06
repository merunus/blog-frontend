import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchPosts = createAsyncThunk("/posts/fetchPosts", async () => {
  const { data } = await axios.get("/posts");
  return data;
});

export const fetchPostsWithTags = createAsyncThunk("/posts/fetchPostsWithTags", async (tagName) => {
  const { data } = await axios.get(`/posts/withTags/${tagName}`);
  return data;
});
export const fetchPopularPosts = createAsyncThunk(
  "/posts/fetchPopularPosts",
  async () => {
    const { data } = await axios.get("/posts/popular");
    // console.log(data)
    return data;
  }
);
export const fetchTags = createAsyncThunk("/posts/fetchTags", async () => {
  const { data } = await axios.get("/tags");
  return data;
});

export const fetchCommentaries = createAsyncThunk("/posts/fetchCommentaries", async () => {
  const { data } = await axios.get("posts/commentaries");
  return data;
})


export const fetchRemovePost = createAsyncThunk(
  "/posts/fetchRemovePost",
  async (id) => {
    await axios.delete(`/posts/${id}`);
  }
);

const initialState = {
  posts: {
    items: [],
    status: "loading",
  },
  tags: {
    items: [],
    status: "loading",
  },
  commentaries: {
    items: null,
    status: "loading"
  }
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: {
    // Fetch Posts

    [fetchPosts.pending]: (state) => {
      state.posts.status = "loading";
    },
    [fetchPosts.fulfilled]: (state, { payload }) => {
      state.posts.items = payload;
      state.posts.status = "loaded";
    },
    [fetchPosts.rejected]: (state) => {
      state.posts.items = [];
      state.posts.status = "error";
    },

    // Fetch Popular Posts
    [fetchPopularPosts.pending]: (state) => {
      state.posts.status = "loading";
    },
    [fetchPopularPosts.fulfilled]: (state, { payload }) => {
      state.posts.items = payload;
      state.posts.status = "loaded";
    },
    [fetchPopularPosts.rejected]: (state) => {
      state.posts.items = [];
      state.posts.status = "error";
    },

    // Fetch tags

    [fetchTags.pending]: (state) => {
      state.tags.status = "loading";
    },
    [fetchTags.fulfilled]: (state, { payload }) => {
      state.tags.items = payload;
      state.tags.status = "loaded";
    },
    [fetchTags.rejected]: (state) => {
      state.tags.items = [];
      state.tags.status = "error";
    },

    // Fetch commentaries

    [fetchCommentaries.pending]: (state, {payload}) => {
      state.commentaries.status = "loading";
    },
    [fetchCommentaries.fulfilled]: (state, { payload }) => {
      state.commentaries.items = payload;
      state.commentaries.status = "loaded";
    },
    [fetchCommentaries.rejected]: (state) => {
      state.commentaries.items = [];
      state.commentaries.status = "error";
    },

    // Fetch Posts With Tags 

    [fetchPostsWithTags.pending]: (state) => {
      state.posts.status = "loading";
    },
    [fetchPostsWithTags.fulfilled]: (state, { payload }) => {
      state.posts.items = payload;
      state.posts.status = "loaded";
    },
    [fetchPostsWithTags.rejected]: (state) => {
      state.posts.items = [];
      state.posts.status = "error";
    },


    //Delete Posts

    [fetchRemovePost.pending]: (state, action) => {
      state.posts.items = state.posts.items.filter(
        (obj) => obj._id !== action.meta.arg
      );
    },
  },
});

export const postsReducer = postsSlice.reducer;
