import React, {useState, useEffect} from 'react'
import firebase from '../firebase'

function useAuth() {
    const [usuario, setUsuario] = useState(null)

    useEffect(() => {
        const unsuscribe = firebase.auth.onAuthStateChanged(usuario => {
            if(usuario) {
                setUsuario(usuario)
            }else {
                setUsuario(null)
            }
        })
        return () => unsuscribe()
    },[])
    return usuario
}

export default useAuth