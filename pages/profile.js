import { Button, List, ListItem, TextField, Typography } from '@mui/material';
import axios from 'axios';
import jsCookie from 'js-cookie';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React, { useContext, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Form from '../components/Form';
import Layout from '../components/Layout';
import { getError } from '../utils/error';
import { Store } from '../utils/Store';

function ProfileScreen() {
    const router = useRouter();
    const { state, dispatch } = useContext(Store);
    const { userInfo } = state;
    const {
        handleSubmit,
        control,
        formState: { errors },
        setValue,
    } = useForm();

    useEffect(() => {
        if (!userInfo) {
            return router.push('/login');
        }
        setValue('name', userInfo.name);
        setValue('email', userInfo.email);
    }, [router, setValue, userInfo]);

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const submitHandler = async ({ name, email, password, confirmPassword }) => {
        closeSnackbar();
        if (password !== confirmPassword) {
            enqueueSnackbar("Passwords don't match", { variant: 'error' });
            return;
        }
        try {
            const { data } = await axios.put(
                '/api/users/profile',
                {
                    name,
                    email,
                    password,
                },
                { headers: { authorization: `Bearer ${userInfo.token}` } }
            );
            dispatch({ type: 'USER_LOGIN', payload: data });
            jsCookie.set('userInfo', JSON.stringify(data));
            enqueueSnackbar('Profile updated successfully', { variant: 'success' });
        } catch (err) {
            enqueueSnackbar(getError(err), { variant: 'error' });
        }
    };
    return (
        <Layout title="Profile">
            <Typography component="h1" variant="h1">
                Este é o seu perfil
            </Typography>
            <Form onSubmit={handleSubmit(submitHandler)}>
                <List>
                    <ListItem>
                        <Controller
                            name="name"
                            control={control}
                            defaultValue=""
                            rules={{
                                required: true,
                                minLength: 2,
                            }}
                            render={({ field }) => (
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    id="name"
                                    label="Nome"
                                    inputProps={{ type: 'text' }}
                                    error={Boolean(errors.name)}
                                    helperText={
                                        errors.name
                                            ? errors.name.type === 'minLength'
                                                ? 'O comprimento do Nome tem que ser superior a 1'
                                                : 'O Nome é expressamente necessário'
                                            : ''
                                    }
                                    {...field}
                                ></TextField>
                            )}
                        ></Controller>
                    </ListItem>
                    <ListItem>
                        <Controller
                            name="email"
                            control={control}
                            defaultValue=""
                            rules={{
                                required: true,
                                pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                            }}
                            render={({ field }) => (
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    id="email"
                                    label="Endereço de email"
                                    inputProps={{ type: 'email' }}
                                    error={Boolean(errors.email)}
                                    helperText={
                                        errors.email
                                            ? errors.email.type === 'pattern'
                                                ? 'O endereço de email por algum motivo não é válido'
                                                : 'O endereço de email é expressamente necessário'
                                            : ''
                                    }
                                    {...field}
                                ></TextField>
                            )}
                        ></Controller>
                    </ListItem>
                    <ListItem>
                        <Controller
                            name="password"
                            control={control}
                            defaultValue=""
                            rules={{
                                validate: (value) =>
                                    value === '' ||
                                    value.length > 5 ||
                                    'Password length is more than 5',
                            }}
                            render={({ field }) => (
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    id="password"
                                    label="Palavra-passe"
                                    inputProps={{ type: 'password' }}
                                    error={Boolean(errors.password)}
                                    helperText={
                                        errors.password ? 'A Palavra-Passe tem que ter um comprimento maior de 5 caracteres' : ''
                                    }
                                    {...field}
                                ></TextField>
                            )}
                        ></Controller>
                    </ListItem>
                    <ListItem>
                        <Controller
                            name="confirmPassword"
                            control={control}
                            defaultValue=""
                            rules={{
                                validate: (value) =>
                                    value === '' ||
                                    value.length > 5 ||
                                    'confirmPassword length is more than 5',
                            }}
                            render={({ field }) => (
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    id="confirmPassword"
                                    label="Confirmar Palavra-passe"
                                    inputProps={{ type: 'password' }}
                                    error={Boolean(errors.confirmPassword)}
                                    helperText={
                                        errors.confirmPassword
                                            ? 'A Palavra-Passe tem que ter um comprimento maior de 5 caracteres'
                                            : ''
                                    }
                                    {...field}
                                ></TextField>
                            )}
                        ></Controller>
                    </ListItem>
                    <ListItem>
                        <Button variant="contained" type="submit" fullWidth color="primary">
                            Atualizar
                        </Button>
                    </ListItem>
                </List>
            </Form>
        </Layout>
    );
}

export default dynamic(() => Promise.resolve(ProfileScreen), { ssr: false });