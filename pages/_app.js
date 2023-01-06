import firebase, { FirebaseContext } from "../firebase"
import useAuth from "../hooks/useAuth"

export default function App({ Component, pageProps }) {
  const usuario = useAuth()
  return (
    <FirebaseContext.Provider
      value={{
        firebase,
        usuario
      }}
    >
        <Component {...pageProps} />
        </FirebaseContext.Provider>
  )
}
