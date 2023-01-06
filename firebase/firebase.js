import app from 'firebase/compat/app'

import firebaseConfig from './config'
import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { getFirestore, collection , addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, deleteObject, orderBy, query } from 'firebase/firestore'
import { getStorage } from '@firebase/storage'

class Firebase {
    constructor() {
       app.initializeApp(firebaseConfig);
       this.auth = getAuth()
       this.db = getFirestore()
       this.storage = getStorage()
    }

    async registrar(valores){
        const {nombre, email, password} = valores
        const nuevoUsuario = await createUserWithEmailAndPassword(this.auth, email, password)
        return await updateProfile(nuevoUsuario.user, {
            displayName: nombre
        })
    }

    async sesion(valores){
        const { email, password} = valores
        return await signInWithEmailAndPassword(this.auth, email, password)
    }
    async cerrarSesion() {
        await signOut(this.auth)
    }

    async guardarProducto (producto){
        return await addDoc(collection(this.db,"productos"), producto);
    }
    async obtenerDatos (campo){
      const ref = collection(this.db, 'productos')
      const q = query(ref , orderBy(campo , 'desc') )
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        return {
          id: doc.id,
        ...doc.data()
      }
      });
    }
    async buscarProyecto(id) {        
        const productoQuery = doc(collection(this.db, 'productos'), id);             
        const resul = await getDoc(productoQuery)
        if(resul.exists()){
            return resul.data()
        }else {
            return 'hubo un error'
        }        
    }
    async submitVoto(datos) {
        const { id , nuevoTotal, nuevoHaVotado } = datos

        const docRef = doc(this.db, "productos", `${id}`) 
           await updateDoc(docRef, {
                 votos: nuevoTotal,
                 haVotado: nuevoHaVotado
        });
    }
    async agregarComentario(datos) {
        const { id, nuevosComentarios} = datos
        const docRef = doc(this.db, "productos", `${id}`) 
        await updateDoc(docRef, {
              comentarios: nuevosComentarios
     });
    }
    async eliminaProducto(id){
        try {
            // Eliminar Producto
            await deleteDoc(doc(firebase.db, "productos", id))
            // Eliminar imagen
            const storage = getStorage()
            const imgRef = ref(storage, urlimage)
            deleteObject(imgRef).then(() => {
              // Imagen eliminada correctamente
            }) .catch((error) => {
              console.log(error)
            })
          } catch (error) {
            console.log(error)
          }
    }
}

const firebase = new Firebase()

export default firebase