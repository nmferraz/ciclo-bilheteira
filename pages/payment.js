import {
    Button,
    FormControl,
    FormControlLabel,
    List,
    ListItem,
    Radio,
    RadioGroup,
    Typography,
} from '@mui/material';
import jsCookie from 'js-cookie';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React, { useContext, useEffect, useState } from 'react';
import CheckoutWizard from '../components/CheckoutWizard';
import Form from '../components/Form';
import Layout from '../components/Layout';
import { Store } from '../utils/Store';

export default function PaymentScreen() {
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();
    const { state, dispatch } = useContext(Store);
    const [paymentMethod, setPaymentMethod] = useState('');

    const submitHandler = (e) => {
        e.preventDefault();
        if (!paymentMethod) {
            enqueueSnackbar('Selecione um método de pagamento', { variant: 'error' });
        } else {
            dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethod });
            jsCookie.set('paymentMethod', paymentMethod);
            router.push('/placeorder');
        }
    }

    const {
        userInfo,
    } = state;

    useEffect(() => {
        if (!userInfo) {
            return router.push('/login?redirect=/payment');
        } else {
            setPaymentMethod(jsCookie.get('paymentMethod') || '');
        }
    }, [router, userInfo]);

    return (
        <Layout title="Metódo de Pagamento | CICLO">
            <CheckoutWizard activeStep={1}></CheckoutWizard>
            <Form onSubmit={submitHandler}>
                <Typography component="h1" variant="h1">Metódo de Pagamento</Typography>
                <List>
                    <ListItem>
                        <FormControl component="fieldset">
                            <RadioGroup
                                aria-label="Payment Method"
                                name="paymentMethod"
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            >
                                <FormControlLabel value="PayPal" label="PayPal ou Cartão de débito/crédito" control={<Radio />}></FormControlLabel>
                                <FormControlLabel value="Cash" label="Pagar no local" control={<Radio />}></FormControlLabel>
                            </RadioGroup>
                        </FormControl>
                    </ListItem>
                    <ListItem>
                        <Button fullWidth type="submit" variant="contained" color="primary">
                            Continuar
                        </Button>
                    </ListItem>
                    <ListItem>
                        <Button fullWidth type="button" variant="contained" color="secondary" onClick={() => router.push('/cart')}>
                            Voltar
                        </Button>
                    </ListItem>
                </List>
            </Form>
        </Layout>
    )
}