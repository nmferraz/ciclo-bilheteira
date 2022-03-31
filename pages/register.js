import React, { useContext, useEffect } from 'react';
import Layout from '../components/Layout';
import { useForm, Controller } from 'react-hook-form';
import NextLink from 'next/link';
import Form from '../components/Form';
import {
    Button,
    Link,
    List,
    ListItem,
    TextField,
    Typography,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import jsCookie from 'js-cookie';
import { useRouter } from 'next/router';
import { Store } from '../utils/Store';
import { getError } from '../utils/error';

export default function RegisterScreen() {
    const { state, dispatch } = useContext(Store);
    const { userInfo } = state;
    const router = useRouter();
    useEffect(() => {
        if (userInfo) {
            router.push('/');
        }
    }, [router, userInfo]);
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm();

    const { enqueueSnackbar } = useSnackbar();

    const submitHandler = async ({
        name,
        email,
        password,
        confirmPassword,
    }) => {
        if (password !== confirmPassword) {
            enqueueSnackbar("As palavras-passe não coincidem", { variant: 'error' });
            return;
        }
        try {
            const { data } = await axios.post('/api/users/register', {
                name,
                email,
                password,
            });
            dispatch({ type: 'USER_LOGIN', payload: data });
            jsCookie.set('userInfo', JSON.stringify(data));
            router.push('/');
        } catch (err) {
            enqueueSnackbar(getError(err), { variant: 'error' });
        }
};
return (
    <Layout title="Criar Conta | CICLO">
        <Form onSubmit={handleSubmit(submitHandler)}>
            <Typography component="h1" variant="h1">
                Criar Conta
            </Typography>
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
                                inputProps={{ type: 'name' }}
                                error={Boolean(errors.name)}
                                helperText={
                                    errors.name
                                        ? errors.name.type === 'minLength'
                                            ? 'O Nome tem que ter um comprimento maior de 1 caracter'
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
                                label="Endereço de Email"
                                inputProps={{ type: 'email' }}
                                error={Boolean(errors.email)}
                                helperText={
                                    errors.email
                                        ? errors.email.type === 'pattern'
                                            ? 'Email is not valid'
                                            : 'O Endereço de email é expressamente necessário'
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
                            required: true,
                            minLength: 6,
                        }}
                        render={({ field }) => (
                            <TextField
                                variant="outlined"
                                fullWidth
                                id="password"
                                label="Palavra-Passe"
                                inputProps={{ type: 'password' }}
                                error={Boolean(errors.password)}
                                helperText={
                                    errors.password
                                        ? errors.password.type === 'minLength'
                                            ? 'A Palavra-Passe tem que ter um comprimento maior de 5 caracteres'
                                            : 'A Palavra-Passe é expressamente necessário'
                                        : ''
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
                            required: true,
                            minLength: 6,
                        }}
                        render={({ field }) => (
                            <TextField
                                variant="outlined"
                                fullWidth
                                id="confirmPassword"
                                label="Confirmar Palavra-Passe"
                                inputProps={{ type: 'password' }}
                                error={Boolean(errors.confirmPassword)}
                                helperText={
                                    errors.confirmPassword
                                        ? errors.confirmPassword.type === 'minLength'
                                            ? 'A confirmação da Palavra-Passe tem que ter um comprimento maior de 5 caracteres'
                                            : 'A confirmação da Palavra-Passe é expressamente necessário'
                                        : ''
                                }
                                {...field}
                            ></TextField>
                        )}
                    ></Controller>
                </ListItem>
                <ListItem>
                    <Button variant="contained" type="submit" fullWidth color="primary">
                        Criar a minha Conta
                    </Button>
                </ListItem>
                <ListItem>
                    Já tens uma conta?{' '}
                    <NextLink href={'/login'} passHref>
                        <Link>Ótimo, inicia sessão.</Link>
                    </NextLink>
                </ListItem>
            </List>
        </Form>
    </Layout>
);
}