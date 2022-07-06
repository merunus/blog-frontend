import React, { useState, useEffect } from "react";
import { SideBlock } from "./SideBlock";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Skeleton from "@mui/material/Skeleton";
import { Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Clear";
import axios from "../axios";

export const CommentsBlock = ({
  postId,
  isEditable,
  // comments,
  children,
  isLoading = true,
  userData,
}) => {
  const [comments, setComments] = useState(null);
  useEffect(() => {
    axios
      .get(`/posts/${postId}`)
      .then((res) => {
        setComments(res.data.commentaries);
        // setIsLoading(false);
      })
      .catch((error) => {
        console.warn(error);
        alert("Error while getting post!");
      });
  }, []);

  const handleDeleteComment = (id) => {
    if (id) {
      if (window.confirm("Are you sure you want delete this post?")) {
        axios.patch(`/posts/commentaries/${postId}/${id}`);
        window.location.reload(true);
      }
    }
  };

  return (
    <SideBlock title="Commentaries">
      {comments ? (
        <List>
          {(isLoading ? [...Array(5)] : comments).map((obj, index) => (
            <React.Fragment>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  {isLoading ? (
                    <Skeleton variant="circular" width={40} height={40} />
                  ) : (
                    <Avatar src={obj.avatarUrl} />
                  )}
                </ListItemAvatar>
                {isLoading ? (
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <Skeleton variant="text" height={25} width={120} />
                    <Skeleton variant="text" height={18} width={230} />
                  </div>
                ) : (
                  <ListItemText
                    primary={obj.userName}
                    secondary={obj.comment}
                  />
                )}
                {/* {userData._id === obj.userId && ( */}
                {isEditable && (
                  <IconButton
                    id={obj.commentId}
                    onClick={(e) => handleDeleteComment(e.target.id)}
                    color="secondary"
                  >
                    <DeleteIcon hidden id={obj.commentId} />
                  </IconButton>
                )}
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Typography>No comments yet</Typography>
      )}
      {children}
    </SideBlock>
  );
};
