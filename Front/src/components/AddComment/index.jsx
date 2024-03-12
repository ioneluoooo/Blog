import React, { useState } from "react";

import styles from "./AddComment.module.scss";

import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import axios from '../../axios'
import { useParams } from 'react-router-dom';


export const AddComment = () => {
  const { id, avatarUrl } = useParams();

  const [text, setText] = useState('')

  const onChange = (event) => {
   setText(event.target.value)
  }

  const onSubmit = async () => {
  try {
      const fields = {
        text,
      }
      await axios.post(`/posts/${id}/comments`, fields);

      setText('')
  } catch (error) {
    console.log(error)
    alert('Error when creating comments')
  }

  }
  return (
    <>
      <div className={styles.root}>
        <Avatar
          classes={{ root: styles.avatar }}
          src={avatarUrl}
        />
        <form className={styles.form}>
          <TextField
            label="Написать комментарий"
            variant="outlined"
            maxRows={10}
            multiline
            onChange={onChange}
            value={text}
            fullWidth
          />
          <Button onClick={onSubmit} variant="contained">Отправить</Button>
        </form>
      </div>
    </>
  );
};
