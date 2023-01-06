import React from "react"
import Layout from '../components/Layout'
import DetalleProducto from "../components/DetalleProducto"
import useProductos from "../hooks/useProductos"

export default function Populares() {
  const { productos } = useProductos('votos')

  return (
    <>
      <Layout>
        <div className="listado-productos">
          <div className="contenedor">
            <ul className="bg-white">
              {productos && 
                productos.map(producto => (
                  <DetalleProducto 
                    key={producto.id}
                    producto={producto}
                  />
              ))}
            </ul>
          </div>
        </div> 
      </Layout>
    </>
  )
}

