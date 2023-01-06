import React, {useEffect, useState} from 'react'
import {useRouter} from 'next/router'
import DetalleProducto from "../components/DetalleProducto"
import useProductos from "../hooks/useProductos"
import Layout from '../components/Layout'

const buscar = () => {
  const router = useRouter()
  const { query: {q}} = router
  const { productos } = useProductos('creado')
  const [resultado, setResultado] = useState([])

  useEffect(() => {
    if(q) {
      const busqueda = q.toLowerCase();
    const filtro =  productos.filter(producto => {
      return (
        producto.nombre.toLowerCase().includes(busqueda) || 
        producto.descripcion.toLowerCase().includes(busqueda)
      )
    });
    setResultado(filtro);    
    }
  }, [ q, productos ]);

  return (
      <Layout>
        <div className="listado-productos">
          <div className="contenedor">
            <ul className="bg-white">
              {resultado && 
                resultado.map(producto => (
                  <DetalleProducto 
                    key={producto.id}
                    producto={producto}
                  />
              ))}
            </ul>
          </div>
        </div> 
      </Layout>
  )
}

export default buscar