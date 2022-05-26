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
import { Store } from '../utils/Store';
import { useRouter } from 'next/router';
import jsCookie from 'js-cookie';
import { getError } from '../utils/error';

export default function LoginScreen() {
    const { state, dispatch } = useContext(Store);
    const { userInfo } = state;
    const router = useRouter();
    const { redirect } = router.query;
    useEffect(() => {
        if (userInfo) {
            router.push(redirect || '/');
        }
    }, [router, userInfo]);
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm();

    const { enqueueSnackbar } = useSnackbar();
    const submitHandler = async ({ email, password }) => {
        try {
            const { data } = await axios.post('/api/users/login', {
                email,
                password,
            });
            dispatch({ type: 'USER_LOGIN', payload: data });
            jsCookie.set('userInfo', JSON.stringify(data));
            router.push(redirect || '/');
        } catch (err) {
            enqueueSnackbar(getError(err), { variant: 'error' });
        }
    };
    return (
        <Layout title="Iniciar Sessão | CICLO">
            <Form onSubmit={handleSubmit(submitHandler)}>
                <Typography component="h1" variant="h1">
                    Iniciar Sessão
                </Typography>
                <List>
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
                                                ? 'Email inválido'
                                                : 'O email é expressamente necessário'
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
                        <Button variant="contained" type="submit" fullWidth color="primary">
                            Iniciar Sessão
                        </Button>
                    </ListItem>
                    <ListItem>
                        <NextLink href={`/register?redirect=${redirect || '/'}`} passHref>
                            <Link>Não tenho conta. Clique para criar uma.</Link>
                        </NextLink>
                    </ListItem>
                </List>
            </Form>
        </Layout>
    );
}