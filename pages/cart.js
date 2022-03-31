import {
    Box,
    Button,
    Card,
    Grid,
    Link,
    List,
    ListItem,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import axios from 'axios';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import NextLink from 'next/link';
import { useSnackbar } from 'notistack';
import { useContext } from 'react';
import Layout from '../components/Layout';
import { Store } from '../utils/Store';

function CartScreen() {
    const {
        state: {
            cart: { cartItems },
        },
        dispatch,
    } = useContext(Store);

    const { enqueueSnackbar } = useSnackbar();

    const updateCartHandler = async (item, quantity) => {
        const { data } = await axios.get(`/api/products/${item._id}`);
        if (data.countInStock < quantity) {
            enqueueSnackbar('Lamentamos. Bilhetes esgotados', { variant: 'error' });
            return;
        }
        dispatch({
            type: 'CART_ADD_ITEM',
            payload: {
                _key: item._key,
                name: item.name,
                countInStock: item.countInStock,
                slug: item.slug,
                price: item.price,
                image: item.image,
                quantity,
            },
        });
        enqueueSnackbar(`${item.name} foi atualizado no seu carrinho`, {
            variant: 'success',
        });
    };
    const removeItemHandler = (item) => {
        dispatch({ type: 'CART_REMOVE_ITEM', payload: item });
    };
    return (
        <Layout title="Carrinho de Compras | CICLO">
            <Typography component="h1" variant="h1">
                Carrinho de Compras
            </Typography>
            {cartItems.length === 0 ? (
                <Box>
                    <Typography>
                        O carrinho está vazio.{' '}
                        <NextLink href="/" passHref>
                            <Link>Dê uma olhadela aos espetáculos em cartaz...</Link>
                        </NextLink>
                    </Typography>
                </Box>
            ) : (
                <Grid container spacing={5}>
                    <Grid item md={9} xs={12}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Cartaz</TableCell>
                                        <TableCell>Nome</TableCell>
                                        <TableCell align="right">Quantidade</TableCell>
                                        <TableCell align="right">Preço</TableCell>
                                        <TableCell align="right">Ação</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {cartItems.map((item) => (
                                        <TableRow key={item._key}>
                                            <TableCell>
                                                <NextLink href={`/product/${item.slug}`} passHref>
                                                    <Link>
                                                        <Image src={item.image} alt={item.name} width={50} height={50}></Image>
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
                                                <Select value={item.quantity} onChange={(e) => updateCartHandler(item, e.target.value)}>{[...Array(item.countInStock).keys()].map((x) => <MenuItem key={x + 1} value={x + 1}>{x + 1}</MenuItem>)}</Select>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Typography>{item.price}€</Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Button variant="contained" color="secondary" onClick={() => removeItemHandler(item)}>x</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            <Typography>
                                                <NextLink href="/" passHref>
                                                    <Link>Veja mais espetáculos em cartaz</Link>
                                                </NextLink>
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    <Grid item md={3} xs={12}>
                        <Card>
                            <List>
                                <ListItem>
                                    <Typography variant="h2">Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '} items) : {cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}€</Typography>
                                </ListItem>
                                <ListItem>
                                    <Button fullWidth color="primary" variant="contained">Finalizar Reserva</Button>
                                </ListItem>
                            </List>
                        </Card>
                    </Grid>
                </Grid>
            )}
        </Layout>
    );
}

export default dynamic(() => Promise.resolve(CartScreen), { ssr: false });