import { useRouter } from 'next/router'
import Image from 'next/image'
import React, {useContext, useEffect, useState} from 'react'
import styled from '@emotion/styled'
import {css} from '@emotion/react'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { es } from 'date-fns/locale'
import Layout from '../../components/Layout'
import Error404 from '../../components/404'
import Spinner from '../../components/Spinner'
import { Campo, InputSubmit } from '../../components/styles/Formulario'
import {formatearFecha} from '../../helpers'
import { FirebaseContext } from '../../firebase'

const ContenedorProducto = styled.div`
   @media (min-width:768px) {
        display: grid;
        grid-template-columns: 2fr 1fr;
        column-gap: 2rem;
   }
`;
const CreadorProducto = styled.p`
    padding: .5rem;
    background-color: #DA552F;
    color: #fff;
    text-transform: uppercase;
    font-weight: bold;
    display: inline-block;
    text-align: center;
    border-radius:30px;
`
const Botones = styled.button`
    background-color:var(--naranja);
    width:100%;
    padding:.5rem;
    text-align: center;
    color:#fff;
    font-size:1.8rem;
    text-transform:uppercase;
    border:none;
    font-family:'PT Sans', sans-serif;
    font-weight:700;
    margin-bottom:1rem;
    border-radius:30px;
    &:hover {
        cursor: pointer;
    }
`
const BtnEliminar = styled.button`
    background-color:red;
    width:100%;
    padding:.5rem;
    text-align: center;
    color:#FFF;
    font-size:1.8rem;
    text-transform:uppercase;
    border:none;
    font-family:'PT Sans', sans-serif;
    font-weight:700;
    margin-bottom:1rem;
    margin-top:5rem;
    border-radius:30px;
    &:hover {
        cursor: pointer;
    }
`
const ComentarioContenedor = styled.div`
    display:block;
    border-bottom:1px solid #6f6f6f;

`
const Comentarios = styled.div`
    display:flex;
    font-size:2rem;
    margin-bottom:.2rem;
    justify-content: space-between;
    p {
        color: #3d3d3d;
        font-size:1.2rem;
        margin-top:0;
    }

`


export default function Producto() {
    const router = useRouter()
    const { query : { id }} = router
    const {usuario, firebase} = useContext(FirebaseContext)
    const [producto, setProducto] = useState(null)
    const [error, setError] = useState(false)
    const [comentario, setComentario] = useState({})
    const [consDB, setConsDB] = useState(true)
    const [comen, setComen] = useState('')

    useEffect(() => {
        const buscar = async () => {
            if(id && consDB){
                const prod = await firebase.buscarProyecto(id)
                if(typeof prod !== "string"){
                    setProducto(prod)
                    setConsDB(false)
                }else{
                    setError(true)
                    setConsDB(false)
                }
            }
        }
       buscar()
    },[id])

    const handleVotar = async () => {
        if(producto?.haVotado.includes(usuario.uid.toString())) {
            return
        }
        const votoActual = producto.votos
        const nuevoHaVotado = [...producto?.haVotado, usuario.uid];
        const nuevoTotal = votoActual + 1
        await firebase.submitVoto({id, nuevoTotal, nuevoHaVotado})
        setProducto({
            ...producto,
            votos: nuevoTotal
        })
        setConsDB(true)
    }
    const comentarioChange = e => {
        setComentario({
            ...comentario,
            [e.target.name]: e.target.value
        })
    }
    const handleSubmit = async e => {
        e.preventDefault()
        comentario.usuarioId = usuario.uid;
        comentario.usuarioNombre = usuario.displayName;
        comentario.fecha = Date.now()

        // Tomar copia de comentarios y agregarlos al arreglo
        const nuevosComentarios = [...producto.comentarios, comentario];
        await firebase.agregarComentario({ id, nuevosComentarios})
        setProducto({
            ...producto,
            comentarios: nuevosComentarios
        })
        setConsDB(true)
        setComentario({
            ...comentario,
           mensaje: '',
           usuarioId: '',
           usuarioNombre: '',
           fecha: ''
        })
    }
    const esCreador = id => {
        if(producto.creador.id === id){
            return true
        }
    }
    const puedeBorrar = () => {
        if(!usuario) {
            return false
        }
        if(producto.creador.id === usuario.uid){
            return true
        }
    }
    const handleEliminar = async () => {
        await firebase.eliminaProducto(id)
        router.push('/')
    }
    return (    
        <Layout>
            {error ? <Error404 texto="Producto no encontrado"/> : (
                        <>
                        {producto?.nombre ? (
                            <div className='contenedor'>
                            <h1
                            css={css`
                                text-align:center;
                                margin-top:.4rem;
                            `}
                            >{producto?.nombre}</h1>
                            <ContenedorProducto>
                                <div>
                                    <p>Publicado por <span>{producto?.creador.nombre}</span> hace: {formatDistanceToNow(new Date(producto?.creado), {locale : es})}</p>
                                    <Image src={producto?.urlImage} alt={producto?.nombre} width={400} height={300} />      
                                    <p>{producto?.descripcion}</p>
                                    {usuario && (
                                        <>
                                            <h2>Agrega tu Comentario</h2>
                                            <form
                                            onSubmit={handleSubmit}
                                            >
                                                <Campo>
                                                    <input 
                                                        type="text"
                                                        name="mensaje"
                                                        value={comentario.mensaje}
                                                        onChange={comentarioChange}
                                                    />
                                                </Campo>
                                                <InputSubmit 
                                                    type="submit"
                                                    value="Comentar"
                                                />
                                            </form>
                                        </>
                                    )}
                                    <h2
                                    css={css` 
                                        margin: 2rem 0;
                                        border-bottom:1px solid #6f6f6f;
                                    `}
                                    >Comentarios</h2>
                                    {producto?.comentarios?.map((comentario, i) => (
                                            <ComentarioContenedor
                                            key={`${comentario.usuarioId}-${i}`}
                                            >     
                                                    <p>{comentario.mensaje}</p>
                                                    <Comentarios>
                                                        <p>Escrito por: {comentario.usuarioNombre}  { esCreador( comentario.usuarioId ) && <CreadorProducto>Es Creador</CreadorProducto> }</p>
                                                        <p>{formatearFecha(comentario.fecha)}</p>
                                                    </Comentarios>
                                            </ComentarioContenedor>                                
                                    ))}
                                </div>
                                <aside>
                                    <a 
                                    target="_blank"
                                    href={producto?.url}
                                    >
                                    <Botones>Visitar {producto.empresa}</Botones></a>
                                    <div
                                        css={css`
                                        margin-top: 5rem;
                                    `}
                                        >
                                        <p css={css`
                                        text-align: center;
                                        margin-bottom:2rem;
                                        font-size:1.8rem;
                                        font-weight:700;
                                        `}>{producto?.votos} Votos</p>

                                        { usuario && (
                                            <Botones
                                            onClick={handleVotar}
                                            >
                                            Votar
                                            </Botones>
                                        ) }
                                    </div>
                                    { puedeBorrar() && <BtnEliminar onClick={handleEliminar}>Eliminar Producto</BtnEliminar>}
                                </aside>
                            </ContenedorProducto>
                        </div>         
                        ) : (
                            <Spinner />
                        )}
                </>
            )}
        </Layout>    
    )
}


