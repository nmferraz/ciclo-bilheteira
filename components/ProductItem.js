import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';
import NextLink from 'next/link';
import React from 'react';
import { urlForThumbnail } from '../utils/image';

export default function ProductItem({ product }) {
  return (
    <Card>
      <NextLink href={`/product/${product.slug.current}`} passHref>
        <CardActionArea>
          <CardMedia
            component="img"
            image={urlForThumbnail(product.image)}
            title={product.name}
          ></CardMedia>
          <CardContent>
            <Typography>{product.name}</Typography>
            <Typography>{product.countInStock > 0 ? 'Ainda há bilhetes disponíveis' : 'Já não há bilhetes disponíveis'}</Typography>
          </CardContent>
        </CardActionArea>
      </NextLink>
      <CardActions>
        <Typography>{product.price}€</Typography>
        <NextLink href={`/product/${product.slug.current}`} passHref>
          <Button
            size="small"
            color="primary"
          >
            Reservar
          </Button>
         </NextLink>
      </CardActions>
    </Card>
  );
}
