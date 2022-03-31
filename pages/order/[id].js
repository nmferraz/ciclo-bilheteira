import {
    Alert,
    Box,
    Card,
    CircularProgress,
    Grid,
    Link,
    List,
    ListItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import NextLink from 'next/link';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import React, { useContext, useEffect, useReducer } from 'react';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import Layout from '../../components/Layout';
import classes from '../../utils/classes';
import { Store } from '../../utils/Store';
import { useRouter } from 'next/router';
import { getError } from '../../utils/error';
import axios from 'axios';
import { useSnackbar } from 'notistack';

function reducer(state, action) {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true, error: '' };
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, order: action.payload, error: '' };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        case 'PAY_REQUEST':
            return { ...state, loadingPay: true };
        case 'PAY_SUCCESS':
            return { ...state, loadingPay: false, successPay: true };
        case 'PAY_FAIL':
            return { ...state, loadingPay: false, errorPay: action.payload };
        case 'PAY_RESET':
            return { ...state, loadingPay: false, successPay: false, errorPay: '' };
    }
}

function OrderScreen({ params }) {
    const { enqueueSnackbar } = useSnackbar();
    const { id: orderId } = params;
    const [{ loading, error, order, successPay }, dispatch] = useReducer(
        reducer,
        {
            loading: true,
            order: {},
            error: '',
        }
    );

    const {
        paymentMethod,
        orderItems,
        itemsPrice,
        totalPrice,
        isPaid,
        paidAt,
    } = order;

    const router = useRouter();
    const { state } = useContext(Store);
    const { userInfo } = state;
    const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

    useEffect(() => {
        if (!userInfo) {
            return router.push('/login');
        }
        const fetchOrder = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const { data } = await axios.get(`/api/orders/${orderId}`, {
                    headers: { authorization: `Bearer ${userInfo.token}` },
                });

                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
            }
        };
        if (!order._id || successPay || (order._id && order._id !== orderId)) {
            fetchOrder();
            if (successPay) {
                dispatch({ type: 'PAY_RESET' });
            }
        } else {
            const loadPaypalScript = async () => {
                const { data: clientId } = await axios.get('/api/keys/paypal', {
                    headers: { authorization: `Bearer ${userInfo.token}` },
                });
                paypalDispatch({
                    type: 'resetOptions',
                    value: {
                        'client-id': clientId,
                        currency: 'EUR',
                    },
                });
                paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
            }
            loadPaypalScript();
        }
    }, [order, orderId, successPay, paypalDispatch, router, userInfo]);

    function createOrder(data, actions) {
        return actions.order
            .create({
                purchase_units: [
                    {
                        amount: { value: totalPrice },
                    },
                ],
            })
            .then((orderID) => {
                return orderID;
            });
    }
    function onApprove(data, actions) {
        return actions.order.capture().then(async function (details) {
            try {
                dispatch({ type: 'PAY_REQUEST' });
                const { data } = await axios.put(
                    `/api/orders/${order._id}/pay`,
                    details,
                    {
                        headers: { authorization: `Bearer ${userInfo.token}` },
                    }
                );
                dispatch({ type: 'PAY_SUCCESS', payload: data });
                enqueueSnackbar('Reserva paga', { variant: 'success' });
            } catch (err) {
                dispatch({ type: 'PAY_FAIL', payload: getError(err) });
                enqueueSnackbar(getError(err), { variant: 'error' });
            }
        });
    }
    function onError(err) {
        enqueueSnackbar(getError(err), { variant: 'error' });
    }

    return (
        <Layout title={`Reserva ${orderId} | CICLO`}>
            <Typography component="h1" variant="h1">
                Reserva {orderId}
            </Typography>
            {loading ? (
                <CircularProgress />
            ) : error ? (
                <Alert variant="error">{error}</Alert>
            ) : (
                <Grid container spacing={1}>
                    <Grid item md={9} xs={12}>
                        <Card sx={classes.section}>
                            <List>
                                <ListItem>
                                    <Typography component="h2" variant="h2">
                                        Método de Pagamento
                                    </Typography>
                                </ListItem>
                                <ListItem>{paymentMethod}</ListItem>
                                <ListItem>
                                    Status: {isPaid ? `pago a ${paidAt}` : 'ainda não está pago'}
                                </ListItem>
                            </List>
                        </Card>
                        <Card sx={classes.section}>
                            <List>
                                <ListItem>
                                    <Typography component="h2" variant="h2">
                                        Bilhetes
                                    </Typography>
                                </ListItem>
                                <ListItem>
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Cartaz</TableCell>
                                                    <TableCell>Nome</TableCell>
                                                    <TableCell align="right">Quantidade</TableCell>
                                                    <TableCell align="right">Preço</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {orderItems.map((item) => (
                                                    <TableRow key={item._key}>
                                                        <TableCell>
                                                            <NextLink href={`/product/${item.slug}`} passHref>
                                                                <Link>
                                                                    <Image
                                                                        src={item.image}
                                                                        alt={item.name}
                                                                        width={50}
                                                                        height={50}
                                                                    ></Image>
                                                                </Link>
                                                            </NextLink>
                                                        </TableCell>
                                                        <TableCell>
                                                            <NextLink href={`/product/${item.slug}`} passHref>
                                                                <Link>
                                                                    <Typography>{item.name}</Typography>
                                                                </Link>
                                                            </NextLink>
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <Typography>{item.quantity}</Typography>
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <Typography>{item.price}€</Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </ListItem>
                            </List>
                        </Card>
                    </Grid>
                    <Grid item md={3} xs={12}>
                        <Card sx={classes.section}>
                            <List>
                                <ListItem>
                                    <Typography variant="h2">Resumo</Typography>
                                </ListItem>
                                <ListItem>
                                    <Grid container>
                                        <Grid item xs={6}>
                                            <Typography>Bilhetes:</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography align="right">{itemsPrice}€</Typography>
                                        </Grid>
                                    </Grid>
                                </ListItem>
                                <ListItem>
                                    <Grid container>
                                        <Grid item xs={6}>
                                            <Typography>
                                                <strong>Total:</strong>
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography align="right">
                                                <strong>{totalPrice}€</strong>
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </ListItem>
                                {!isPaid && (
                                    <ListItem>
                                        {isPending ? (
                                            <CircularProgress />
                                        ) : (
                                            <Box sx={classes.fullWidth}>
                                                <PayPalButtons
                                                    createOrder={createOrder}
                                                    onApprove={onApprove}
                                                    onError={onError}
                                                ></PayPalButtons>
                                            </Box>
                                        )}
                                    </ListItem>
                                )}
                            </List>
                        </Card>
                    </Grid>
                </Grid>
            )}
        </Layout>
    );
}

export function getServerSideProps({ params }) {
    return { props: { params } };
}

export default dynamic(() => Promise.resolve(OrderScreen), { ssr: false });
