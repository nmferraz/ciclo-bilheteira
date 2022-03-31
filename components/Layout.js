import { createTheme } from '@mui/material/styles';
import {
    AppBar,
    Badge,
    Box,
    Button,
    Container,
    CssBaseline,
    Divider,
    Drawer,
    IconButton,
    InputBase,
    Link,
    List,
    ListItem,
    ListItemText,
    Menu,
    MenuItem,
    Switch,
    ThemeProvider,
    Toolbar,
    Typography,
    useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import CancelIcon from '@mui/icons-material/Cancel';
import Head from 'next/head';
import NextLink from 'next/link';
import classes from '../utils/classes';
import { useContext } from 'react';
import { Store } from '../utils/Store';
import jsCookie from 'js-cookie';

export default function Layout({ title, description, children }) {
    const { state, dispatch } = useContext(Store);
    const { darkMode, cart, userInfo } = state;
    const theme = createTheme({
        components: {
            MuiLink: {
                defaultProps: {
                    underline: 'hover',
                },
            },
        },
        typography: {
            h1: {
                fontSize: '1.6rem',
                fontWeight: 400,
                margin: '1rem 0',
            },
            h2: {
                fontSize: '1.4rem',
                fontWeight: 400,
                margin: '1rem 0',
            },
        },
        palette: {
            mode: darkMode ? 'dark' : 'light',
            primary: {
                main: '#f0c000',
            },
            secondary: {
                main: '#208080',
            },
        },
    });
    const darkModeChangeHandler = () => {
        dispatch({ type: darkMode ? 'DARK_MODE_OFF' : 'DARK_MODE_ON' });
        const newDarkMode = !darkMode;
        jsCookie.set('darkMode', newDarkMode ? 'ON' : 'OFF');
    };
    return (
        <>
            <Head>
                <title>{title ? `${title} - CICLO | Bilheteira` : 'CICLO | Bilheteira'}</title>
                {description && <meta name="description" content={description}></meta>}
            </Head>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <AppBar position="static" sx={classes.appbar}>
                    <Toolbar sx={classes.toolbar}>
                        <Box display="flex" alignItems="center">
                            <NextLink href="/" passHref>
                                <Link>
                                    <Typography sx={classes.brand}>CICLO</Typography>
                                </Link>
                            </NextLink>
                        </Box>
                        <Box>
                            <Switch checked={darkMode} onChange={darkModeChangeHandler}></Switch>
                            <NextLink href="/cart" passHref>
                                <Link>
                                    <Typography component="span">
                                        {cart.cartItems.length > 0 ? (
                                            <Badge
                                                color="secondary"
                                                badgeContent={cart.cartItems.length}
                                            >
                                                Carrinho
                                            </Badge>
                                        ) : (
                                            'Cart'
                                        )}
                                    </Typography>
                                </Link>
                            </NextLink>
                            {userInfo ? (
                                <NextLink href="/profile" passHref>
                                    <Link>{userInfo.name}</Link>
                                </NextLink>
                            ) : (
                                <NextLink href="/login" passHref>
                                    <Link>Iniciar Sessão</Link>
                                </NextLink>
                            )}
                        </Box>
                    </Toolbar>
                </AppBar>
                <Container component="main" sx={classes.main}>
                    {children}
                </Container>
                <Box component="footer" sx={classes.footer}>
                    <Typography>Beta Version - Desenvolvido por Nuno Miguel Ferraz</Typography>
                </Box>
            </ThemeProvider>
        </>
    )
}
