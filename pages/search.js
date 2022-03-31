import {
    Alert,
    Button,
    CircularProgress,
    Grid,
    List,
    ListItem,
    MenuItem,
    Rating,
    Select,
    Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React, { useContext, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import ProductItem from '../components/ProductItem';
import classes from '../utils/classes';
import client from '../utils/client';
import { urlForThumbnail } from '../utils/image';
import { Store } from '../utils/Store';

export default function SearchScreen() {
    const router = useRouter();
    const {
        category = 'all',
        query = 'all',
        sort = 'default',
    } = router.query;
    const [state, setState] = useState({
        categories: [],
        products: [],
        error: '',
        loading: true,
    });

    const { loading, products, error } = state;
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get(`/api/products/categories`);
                setCategories(data);
            } catch (err) {
                console.log(err.message);
            }
        };
        fetchCategories();

        const fetchData = async () => {
            try {
                let gQuery = '*[_type == "product"';
                if (category !== 'all') {
                    gQuery += ` && category match "${category}" `;
                }
                if (query !== 'all') {
                    gQuery += ` && name match "${query}" `;
                }
                let order = '';
                if (sort !== 'default') {
                    if (sort === 'lowest') order = '| order(price asc)';
                    if (sort === 'highest') order = '| order(price desc)';
                    if (sort === 'toprated') order = '| order(rating desc)';
                }

                gQuery += `] ${order}`;
                setState({ loading: true });

                const products = await client.fetch(gQuery);
                setState({ products, loading: false });
            } catch (err) {
                setState({ error: err.message, loading: false });
            }
        };
        fetchData();
    }, [category, query, sort]);

    const filterSearch = ({ category, sort, searchQuery, price, rating }) => {
        const path = router.pathname;
        const { query } = router;
        if (searchQuery) query.searchQuery = searchQuery;
        if (category) query.category = category;
        if (sort) query.sort = sort;
        if (price) query.price = price;
        if (rating) query.rating = rating;

        router.push({
            pathname: path,
            query: query,
        });
    };
    const categoryHandler = (e) => {
        filterSearch({ category: e.target.value });
    };

    const {
        state: { cart },
        dispatch,
    } = useContext(Store);

    const { enqueueSnackbar } = useSnackbar();
    const addToCartHandler = async (product) => {
        const existItem = cart.cartItems.find((x) => x._id === product._id);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        const { data } = await axios.get(`/api/products/${product._id}`);
        if (data.countInStock < quantity) {
            enqueueSnackbar('Lamentamos.Esgotado!', { variant: 'error' });
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
        enqueueSnackbar(`${product.name} adicionado ao carrinho`, {
            variant: 'success',
        });
        router.push('/cart');
    };

    return (
        <Layout title="search">
            <Grid sx={classes.section} container spacing={2}>
                <Grid item md={3}>
                    <List>
                        <ListItem>
                            <Box sx={classes.fullWidth}>
                                <Typography>Categorias</Typography>
                                <Select fullWidth value={category} onChange={categoryHandler}>
                                    <MenuItem value="all">Todos</MenuItem>
                                    {categories &&
                                        categories.map((category) => (
                                            <MenuItem key={category} value={category}>
                                                {category}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </Box>
                        </ListItem>
                    </List>
                </Grid>
                <Grid item md={9}>
                    <Grid container justifyContent="space-between" alignItems="center">
                        <Grid item>
                            {products && products.length !== 0 ? products.length : 'Sem'}{' '}
                            Resultados
                            {query !== 'all' && query !== '' && ' : ' + query}
                            {(query !== 'all' && query !== '')? (
                                <Button onClick={() => router.push('/search')}>X</Button>
                            ) : null}
                        </Grid>
                    </Grid>

                    <Grid sx={classes.section} container spacing={3}>
                        {loading ? (
                            <CircularProgress />
                        ) : error ? (
                            <Alert>{error}</Alert>
                        ) : (
                            <Grid container spacing={3}>
                                {products.map((product) => (
                                    <Grid item md={4} key={product.name}>
                                        <ProductItem
                                            product={product}
                                            addToCartHandler={addToCartHandler}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </Grid>
                </Grid>
            </Grid>
        </Layout>
    );
}