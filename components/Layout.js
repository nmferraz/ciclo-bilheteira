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

export default function Layout({ title, description, children }) {
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
            mode: 'light',
            primary: {
                main: '#f0c000',
            },
            secondary: {
                main: '#208080',
            },
        },
    })
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
                        <NextLink href="/" passHref>
                            <Link>
                                <Typography sx={classes.brand}>CICLO</Typography>
                            </Link>
                        </NextLink>
                    </Toolbar>
                </AppBar>
                <Container component="main" sx={classes.main}>
                    {children}
                </Container>
                <Box component="footer" sx={classes.footer}>
                    <Typography>CICLO - Escola de Teatro da Retorta <br /> Alpha version - Desenvolvido por Nuno Miguel Ferraz</Typography>
                </Box>
            </ThemeProvider>
        </>
    )
}
