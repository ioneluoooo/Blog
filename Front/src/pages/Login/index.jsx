import React, { useEffect } from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import styles from "./Login.module.scss";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import { fetchAuth, selectIsAuth } from "../../redux/slices/auth";
import { Navigate } from "react-router-dom";


export const Login = () => {
  const isAuth = useSelector(selectIsAuth)
  const dispatch = useDispatch();

  const { register, handleSubmit, setError, formState: { errors, isValid } } = useForm({
    defaultValues: {
      email: '',
      password: '12345'
    },
    mode: 'onChange'
  })

  const onSubmit = async (values) => {
    const data = await dispatch(fetchAuth(values));

    if(!data.payload) {
      return alert('Cannot auth')
    }

    // if there is a token in payload
    // in localstorage we are storing the token
    // due to the re-auth when we are updating the page
    if('token' in data.payload){
      window.localStorage.setItem('token', data.payload.token)
    } 
  }


  if(isAuth){
    return <Navigate to='/'/>
  }
  // Navigating to the main page after we authentificated
  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Вход в аккаунт
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* onSumbit will work only when the input in our fields is correct  */}
        <TextField
          className={styles.field}
          label="E-Mail"
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          type="email"
          {...register('email', { required: 'Ukajite pocitu zaipal' })}
          fullWidth
        />
        <TextField className={styles.field} label="Пароль" fullWidth
          {...register('paswword', { required: 'Ukajite paroli zaipal' })}
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message} />
        <Button type="submit" size="large" variant="contained" fullWidth>
          Войти
        </Button>
      </form>
    </Paper>
  );
};
