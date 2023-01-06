import React, { useState, useEffect, useContext } from 'react';
import { FirebaseContext } from '../firebase';

const useProductos = orden => {
    const {firebase} = useContext(FirebaseContext)
    const [productos, setProductos] = useState([])

    useEffect( () => {
        const obtenerProductos = async () => {
          const prod = await firebase.obtenerDatos(orden)
          setProductos(prod)       
        }
        obtenerProductos()
      }, [])    

      return {
        productos
      }
}

export default useProductos