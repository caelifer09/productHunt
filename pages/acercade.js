import React from 'react'
import Layout from '../components/Layout'
import styled from '@emotion/styled'

const AcercaContenedor = styled.div`
    display:flex;
    justify-content:center;
    margin:2rem;
    padding:2rem;
`
const Titulo = styled.h1`
    font-family: 'PT Sans', sans-serif;
    font-weight:700;
    text-align:center;
    text-transform:uppercase;
    margin: 5rem;
`
const Contenido = styled.div`
    display:block;
    margin-left:5rem;
    p {
        font-weight:700;
        font-size:2.5rem;
    }
`

const acercade = () => {
  return (
    <Layout>
            <Titulo>acerca de este proyecto</Titulo>
            <AcercaContenedor>
                <Contenido>
                    <p>Desarrollador: </p>
                    <p>Tecnologias</p>
                </Contenido>
                <Contenido>
                    <p>Claudio Baeza</p>
                    <p>FrontEnd: NextJS</p>
                    <p>Estilos: Emotion</p>
                    <p>BD: firebase</p>
                </Contenido>
                
            </AcercaContenedor>
    </Layout>
  )
}

export default acercade