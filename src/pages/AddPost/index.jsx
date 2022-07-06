import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from "react";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import SimpleMDE from "react-simplemde-editor";
import { selectIsAuth } from "../../redux/slices/auth";
import "easymde/dist/easymde.min.css";
import styles from "./AddPost.module.scss";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Navigate, useParams } from "react-router-dom";
import axios from "../../axios";

export const AddPost = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isAuth = useSelector(selectIsAuth);
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const inputFileRef = useRef(null);

  const isEditing = Boolean(id);

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append("image", file);
      const { data } = await axios.post("/upload", formData);
      console.log(data);
      setImageUrl(data.url);
    } catch (error) {
      console.log(error);
      alert("Error while uploading file");
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl("");
  };

  const onChange = useCallback((value) => {
    setText(value);
  }, []);

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      const fields = {
        title,
        imageUrl,
        text,
        tags,
      }

      const { data } = isEditing
        ? await axios.patch(`/posts/${id}`, fields)
        : await axios.post("/posts", fields);
      const _id = isEditing ? id : data._id;
      navigate(`/posts/${_id}`);
    } catch (error) {
      console.warn(error);
      alert("Error while uploading post!");
    }
  };

  useEffect(() => {
    if (id) {
      axios
        .get(`/posts/${id}`)
        .then(({ data }) => {
          setTitle(data.title);
          setText(data.text);
          setImageUrl(data.imageUrl);
          setTags(data.tags);
        })
        .catch((error) => {
          console.log(error);
          alert("Error while getting post");
        });
    }
  }, []);

  const options = useMemo(
    () => ({
      spellChecker: false,
      maxHeight: "400px",
      autofocus: true,
      placeholder: "Enter text...",
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    []
  );

  if (!window.localStorage.getItem("token") && !isAuth) {
    return <Navigate to="/"></Navigate>;
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button
        onClick={() => inputFileRef.current.click()}
        variant="outlined"
        size="large"
      >
        Upload preview
      </Button>
      <input
        type="file"
        onChange={handleChangeFile}
        hidden
        ref={inputFileRef}
      />
      {imageUrl && (
        <>
          <Button
            variant="contained"
            color="error"
            onClick={onClickRemoveImage}
          >
            Delete
          </Button>
          <img
            className={styles.image}
            src={`${process.env.REACT_APP_API_URL}${imageUrl}`}
            alt="Uploaded"
          />
        </>
      )}

      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Post title..."
        fullWidth
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Tags"
        fullWidth
        value={tags}
        onChange={(e) => setTags(e.target.value.trim())}
      />
      <SimpleMDE
        className={styles.editor}
        value={text}
        onChange={onChange}
        options={options}
      />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing ? "Save changes" : "Post"}
        </Button>
        <a href="/">
          <Button size="large">Cancel</Button>
        </a>
      </div>
    </Paper>
  );
};
