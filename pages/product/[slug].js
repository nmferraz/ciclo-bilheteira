import {
    Alert,
    Box,
    Button,
    Card,
    CircularProgress,
    Grid,
    Link,
    List,
    ListItem,
    Typography,
} from '@mui/material';
import Image from 'next/image';
import NextLink from 'next/link';
import Layout from '../../components/Layout';
import classes from '../../utils/classes';
import client from '../../utils/client';
import { urlFor, urlForThumbnail } from '../../utils/image';
import { Store } from '../../utils/Store';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';

export default function ProductScreen(props) {
    const router = useRouter();
    const { slug } = props;
    const {
        state: { cart },
        dispatch,
    } = useContext(Store);
    const { enqueueSnackbar } = useSnackbar();
    const [state, setState] = useState({
        product: null,
        loading: true,
        error: '',
    });
    const { product, loading, error } = state;
    useEffect(() => {
        const fetchData = async () => {
            try {
                const product = await client.fetch(
                    `
                *[_type == "product" && slug.current == $slug][0]`,
                    { slug }
                );
                setState({ ...state, product, loading: false });
            } catch (err) {
                setState({ ...state, error: err.message, loading: false });
            }
        };
        fetchData();
    }, []);

    const addToCartHandler = async () => {
        const existItem = cart.cartItems.find((x) => x._id === product._id);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        const { data } = await axios.get(`/api/products/${product._id}`);
        if (data.countInStock < 1) {
            enqueueSnackbar('Lamentamos. Os bilhetes para esta data estão esgotados.', { variant: 'error' });
            return;
        }
        dispatch({
            type: 'CART_ADD_ITEM',
            payload: {
                _key: product._id,
                name: product.name,
                countInStock: product.countInStock,
                slug: product.slug.current,
                price: product.price,
                image: urlForThumbnail(product.image),
                quantity,
            },
        });
        enqueueSnackbar(`${product.name} foi adicionado ao carrinho`, {
            variant: 'success',
        });
        router.push('/cart');
    };

    return (
        <Layout title={product?.title}>
            {loading ? (
                <CircularProgress />
            )
                : error ? (
                    <Alert varient='error'>{error}</Alert>
                )
                    :
                    (
                        <Box sx={classes.section}>
                            <Box>
                                <NextLink href="/" passHref>
                                    <Link>
                                        <Typography>Voltar</Typography>
                                    </Link>
                                </NextLink>
                            </Box>
                            <Grid container spacing={1}>
                                <Grid item md={6} xs={12}>
                                    <Image
                                        src={urlFor(product.image)}
                                        alt={product.name}
                                        layout="responsive"
                                        width={250}
                                        height={300}
                                    />
                                </Grid>
                                <Grid item md={3} xs={12}>
                                    <List>
                                        <ListItem>
                                            <Typography component="h1" variant="h1">
                                                {product.name}
                                            </Typography>
                                        </ListItem>
                                        <ListItem>
                                            Peça: {product.category}
                                        </ListItem>
                                        <ListItem>
                                            <Typography>{product.countInStock > 0 ? 'Ainda há bilhetes disponíveis' : 'Já não há bilhetes disponíveis'}</Typography>
                                        </ListItem>
                                        <ListItem>
                                            <Typography>
                                                Descrição: {product.description}
                                            </Typography>
                                        </ListItem>
                                    </List>
                                </Grid>
                                <Grid item md={3} xs={12}>
                                    <Card>
                                        <List>
                                            <ListItem>
                                                <Grid container>
                                                    <Grid item xs={6}>
                                                        <Typography>Preço</Typography>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Typography>{product.price}€</Typography>
                                                    </Grid>
                                                </Grid>
                                            </ListItem>
                                            <ListItem>
                                                <Grid container>
                                                    <Grid item xs={6}>
                                                        <Typography>Status</Typography>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Typography>{product.countInStock > 0 ? 'Em stock' : 'Esgotado'}</Typography>
                                                    </Grid>
                                                </Grid>
                                            </ListItem>
                                            <ListItem>
                                                <Button onClick={addToCartHandler} fullWidth variant="contained">
                                                    Reservar
                                                </Button>
                                            </ListItem>
                                        </List>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Box>
                    )
            }
        </Layout>
    )

}

export function getServerSideProps(context) {
    return {
        props: { slug: context.params.slug },
    }
}
