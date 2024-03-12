import React, { useRef, useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import { useSelector } from 'react-redux';
import { selectIsAuth } from '../../redux/slices/auth';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import axios from '../../axios.js'

export const AddPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuth)
  const [text, setText] = useState('');
  const [ isLoading ,setIsLoading] = useState('');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const inputFileRef = useRef(null)
  const isEditing = Boolean(id);

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append('image', file);
      const { data } = await axios.post('/upload', formData)
      
      setImageUrl(data.url)
    } catch (error) {
      console.warn(error)
      alert('Error when uploading')
    }
  };

  const onClickRemoveImage = async () => {
    setImageUrl('')
  };

  const onSubmit = async () => {
    try {
      setIsLoading(true)
      const fields = {
        title,
        text,
        imageUrl,
        tags : tags.split(',')
      };

      const { data } = isEditing ? 
      await axios.patch(`/posts/${id}`, fields) : 
      await axios.post('/posts', fields);

      // if isEditing we are navigating from the id we got
      // if its not we are navigating to the new id 
      const _id = isEditing ? id : data._id
      console.log(_id)

      navigate(`/posts/${_id}`)

    } catch (error) {
      console.warn(error);
      alert('Error when creating')
    }
  }

  const onChange = React.useCallback((value) => {
    setText(value); // for SimpleMDE useCallback is esential
  }, []);

  // for the editing part
  // we are getting from the response the data for the post with the same id
  useEffect(() => {
    if(id){
      axios.get(`/posts/${id}`).then(({data}) => {
        setTitle(data.title);
        setText(data.text);
        setImageUrl(data.imageUrl);
        setTags(data.tags.join(','));
      }).catch(err => {
        console.log(err)
        alert('Smth went wrong with editing')
      })
    }
  }, [])

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Введите текст...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );

  if (!window.localStorage.getItem('token') && !isAuth) {
    // checking for the token , bcuz when we rerender the app for a second we are unauthorized so it navigates back to home
    return <Navigate to="/" />
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button onClick={() => inputFileRef.current.click()}
        // after the button there is a hidden input 
        // so when the button is clicked
        // the click goes to the input 
        variant="outlined" size="large">
        Загрузить превью
      </Button>
      <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
      {imageUrl && (
        <>
          <Button variant="contained" color="error" onClick={onClickRemoveImage}>
            Удалить
          </Button>
          <img className={styles.image} src={`http://localhost:4444${imageUrl}`} alt="Uploaded" />
        </>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        value={title}
        onChange={e => setTitle(e.target.value)}
        fullWidth
      />
      <TextField
        value={tags}
        onChange={e => setTags(e.target.value)}
        classes={{ root: styles.tags }} variant="standard" placeholder="Тэги" fullWidth />
      <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing ? 'Update' : 'Opublicovati'}
        </Button>
        <a href="/">
          <Button size="large">Отмена</Button>
        </a>
      </div>
    </Paper>
  );
};
