import React, { useState } from "react";
import styles from "./AddComment.module.scss";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import axios from "../../axios";

export const Index = ({ data }) => {
  const [commentaries, setCommentaries] = useState("");





  const handleSubmitComment = async () => {
    try {
      const comment = {
        commentaries,
      };
      await axios.patch(`/posts/commentaries/${data._id}`, comment);
      setCommentaries("");
      window.location.reload(true)
    } catch (error) {
      console.log(error);
      alert("Can't create a comment!");
    }
  };

  return (
    <>
      <div className={styles.root}>
        <Avatar
          classes={{ root: styles.avatar }}
          // src="https://mui.com/static/images/avatar/5.jpg"
          src={
            data.user.imageUrl
              ? data.user.imageUrl
              : "https://toppng.com/uploads/preview/roger-berry-avatar-placeholder-11562991561rbrfzlng6h.png"
          }
        />
        <div className={styles.form}>
          <form onSubmit={handleSubmitComment}>
            <TextField
              label="Write comment"
              variant="outlined"
              maxRows={10}
              multiline
              value={commentaries}
              fullWidth
              onChange={(e) => setCommentaries(e.target.value)}
            />
            <Button onClick={handleSubmitComment} variant="contained">
             Send comment 
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};
