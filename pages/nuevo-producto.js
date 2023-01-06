import React, {useState, useContext} from "react"
import Router from 'next/router'
import {css} from '@emotion/react'
import Layout from '../components/Layout'
import Error404 from "../components/404"
import { Formulario, Campo, InputSubmit, Error } from '../components/styles/Formulario'

import {FirebaseContext} from '../firebase'
import { ref, getDownloadURL, uploadBytesResumable } from '@firebase/storage'

import useValidacion from "../hooks/useValidacion"
import validarCrearProducto from "../validacion/validarCrearProducto"

const STATE_INICIAL = {
  nombre: '',
  empresa: '',
  imagen: '',
  url: '',
  descripcion: ''
}

export default function NuevoProducto() {
  const { usuario, firebase } = useContext(FirebaseContext)
  const [error, setError] = useState(false)
  const {valores, errores, handleSubmit, handleChange, handleBlur} = useValidacion(STATE_INICIAL, validarCrearProducto, crearProducto)
  const [uploading, setUploading] = useState(false);
  const [URLImage, setURLImage] = useState('');


  const handleImageUpload = e => {
    // Se obtiene referencia de la ubicación donde se guardará la imagen
    const newName = Math.floor(Math.random() * 100000);
    const file = e.target.files[0];

    const imageRef = ref(firebase.storage, 'product/' + newName +'.jpg');
  
    // Se inicia la subida
    setUploading(true);
    const uploadTask = uploadBytesResumable(imageRef, file);
  
    // Registra eventos para cuando detecte un cambio en el estado de la subida
    uploadTask.on('state_changed', 
        // Muestra progreso de la subida
        snapshot => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Subiendo imagen: ${progress}% terminado`);
        },
        // En caso de error
        error => {
            setUploading(false);
            console.error(error);
        },
        // Subida finalizada correctamente
        () => {
            setUploading(false);
            getDownloadURL(uploadTask.snapshot.ref).then(url => {
                console.log('Imagen disponible en:', url);
                setURLImage(url);
            });
        }
    );
  };

  async function crearProducto() {
    const producto = {
      nombre: valores.nombre,
      empresa: valores.empresa,
      url: valores.url,
      urlImage: URLImage,
      descripcion: valores.descripcion,
      votos: 0,
      haVotado: [],
      comentarios: [],
      creado: Date.now(),
      creador:{
        id: usuario.uid,
        nombre: usuario.displayName
      }
    }
    try {
      await firebase.guardarProducto(producto)
      Router.push('/')
    } catch (error) {
      console.error('Hubo un error al insertar producto', error.message)
      setError(error.message)
      setTimeout(() => {
        setError(false)
      }, 3000);
    }
  }

  return (
      <Layout>
          {usuario ? (
            <>
              <h1
                css={css`
                  text-align:center;
                  margin-top:1rem;
                `}
              >Nuevo Producto</h1>
              <Formulario
              onSubmit={handleSubmit}
              >
                <fieldset>
                  <legend>Informacion General</legend>
                      <Campo>
                        <label htmlFor="nombre">Nombre</label>
                        <input 
                          id="nombre"
                          type="text"
                          placeholder="Nombre de tu producto"
                          name="nombre"
                          value={valores.nombre}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </Campo>
                      {errores.nombre && <Error>{errores.nombre}</Error>}
      
                      <Campo>
                        <label htmlFor="empresa">Empresa</label>
                        <input 
                          id="empresa"
                          type="text"
                          placeholder="tu empresa o compañia"
                          name="empresa"
                          value={valores.empresa}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </Campo>
                      {errores.empresa && <Error>{errores.empresa}</Error>}
      
                      <Campo>
                        <label htmlFor="imagen">Imagen</label>
                        <input
                            accept="image/*"
                            type="file"
                            id="image"
                            name="image"
                            onChange={handleImageUpload}
                        />
                      </Campo>
                      {errores.imagen && <Error>{errores.imagen}</Error>}
      
                      <Campo>
                        <label htmlFor="url">URL</label>
                        <input 
                          id="url"
                          type="url"
                          name="url"
                          placeholder="Direccion de tu sitio web "
                          value={valores.url}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </Campo>
                      {errores.url && <Error>{errores.url}</Error>}
                </fieldset>
                <fieldset>
                  <legend>Sobre tu Producto</legend>
                  <Campo>
                        <label htmlFor="descripcion">Descripcion</label>
                        <textarea 
                          id="descripcion"
                          placeholder="Describe tu producto o servicio...."
                          name="descripcion"
                          value={valores.descripcion}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </Campo>
                      {errores.descripcion && <Error>{errores.descripcion}</Error>}
                </fieldset>
                {error && <Error>{error}</Error>}
                <InputSubmit 
                type="submit"
                value="Crear Producto"
                />
              </Formulario>
            </> 
          ) : (
            <Error404 texto="Sin acceso, prueba iniciar Sesion"/>
          )}
      </Layout>
  )
}