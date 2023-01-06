import React, {useContext} from 'react'
import Link from 'next/link'
import Router from 'next/router'

import styled from '@emotion/styled'
import { css } from '@emotion/react'

import Buscar from '../components/Buscar'
import Navegacion from './Navegacion'
import Boton from './styles/Boton'

import { FirebaseContext } from '../firebase'


const ContenedorHeader = styled.div`
  max-width: 1200px;
  width: 95%;
  margin: 0 auto;
  @media (min-width:768px){
    display:flex;
    justify-content:space-between;
  }
`
const Logo = styled.p`
  color: var(--naranja);
  font-size:4rem;
  line-height:0;
  font-weight:700;
  font-family:'Roboto Slap', serif;
  margin-right:2rem;
  cursor: pointer;
`

const Header = () => {
  const { usuario, firebase } = useContext(FirebaseContext)

  const handleCerrarSesion = async () => {
    try {
       await firebase.cerrarSesion()
       Router.push('/')
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <header
    css={css`
      border-bottom: 2px solid var(--gris3);
      padding: 1rem;
    `}
    >
        <ContenedorHeader>
                <div
                css={css`
                  display:flex;
                  align-items:baseline;
                `}
                >
                    <Link href={'/'}>
                      <Logo>p</Logo>
                    </Link>
                   
                    <Buscar />
                    <Navegacion />
                </div>

                <div
                css={css`
                  display:flex;
                  align-items:center;
                `}
                >
                   {usuario ? (
                    <>
                      <p
                      css={css`
                        margin-right: 2rem;
                      `}
                      >hola: {usuario.displayName}</p>
                      <Boton bgColor="true" onClick={() => handleCerrarSesion()}>Cerrar Sesion</Boton>
                    </>
                   ) : (
                    <>
                      <Link href={'/login'}>
                        <Boton bgColor="true">Login</Boton>
                      </Link>
                      <Link href={'/crear-cuenta'}>
                        <Boton>Crear Cuenta</Boton>
                      </Link>
                  </>
                   )}
                </div>
        </ContenedorHeader>
    </header>
  )
}

export default Header