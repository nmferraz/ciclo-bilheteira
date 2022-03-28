import { Typography } from '@mui/material'
import Head from 'next/head'

export default function Home() {
  return (
    <div>
      <Head>
        <title>CICLO | Bilheteira</title>
        <meta name="description" content="A plataforma do Coletivo de Investigação e criação livre (CICLO) para comprar bilhtes para os espetáculos." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Typography component="h1" variant="h1">Bilheteira do CICLO</Typography>

    </div>
  )
}
