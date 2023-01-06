import React, {useState} from "react"
import Router from 'next/router'
import {css} from '@emotion/react'
import Layout from '../components/Layout'
import { Formulario, Campo, InputSubmit, Error } from '../components/styles/Formulario'

import firebase from '../firebase'

import useValidacion from "../hooks/useValidacion"
import validarCrearCuenta from "../validacion/validarCrearCuenta"

const STATE_INICIAL = {
  nombre: '',
  email: '',
  password: ''
}

export default function CrearCuenta() {
  const [error, setError] = useState(false)
  const {valores, errores, handleSubmit, handleChange, handleBlur} = useValidacion(STATE_INICIAL, validarCrearCuenta, crearCuenta)

  async function crearCuenta() {
    try {
      
      await firebase.registrar(valores)
      Router.push('/')
    } catch (error) {
      console.error('Hubo un error al crear el usuario', error.message)
      setError(error.message)
      setTimeout(() => {
        setError(false)
      }, 3000);
    }
  }
  return (
    <>
      <Layout>
        <>
        <h1
          css={css`
            text-align:center;
            margin-top:5rem;
          `}
        >Crear Cuenta</h1>
        <Formulario
        onSubmit={handleSubmit}
        >
          <Campo>
            <label htmlFor="nombre">Nombre</label>
            <input 
              id="nombre"
              type="text"
              placeholder="tu nombre"
              name="nombre"
              value={valores.nombre}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Campo>
          {errores.nombre && <Error>{errores.nombre}</Error>}
          <Campo>
            <label htmlFor="email">Email</label>
            <input 
              id="email"
              type="email"
              placeholder="tu Email"
              name="email"
              value={valores.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Campo>
          {errores.email && <Error>{errores.email}</Error>}
          <Campo>
            <label htmlFor="password">Password</label>
            <input 
              id="password"
              type="password"
              placeholder="tu Password"
              name="password"
              value={valores.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Campo>
          {errores.password && <Error>{errores.password}</Error>}
          {error && <Error>{error}</Error>}
          <InputSubmit 
          type="submit"
          value="Crear Cuenta"
          />
        </Formulario>
        </>
      </Layout>
    </>
  )
}