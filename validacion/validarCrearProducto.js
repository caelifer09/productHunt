export default function validarCrearProducto(valores) {
    let errores = {}

    if(!valores.nombre){
        errores.nombre = "DEBE INGRESAR UN NOMBRE"
    }
    if(!valores.empresa){
        errores.empresa = "DEBE INGRESAR UNA EMPRESA"
    }
    if(!valores.url) {
        errores.url = 'La URL del producto es obligatoria';
    } else if( !/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url) ) {
        errores.url = "URL mal formateada o no válida"
    }
    if(!valores.descripcion){
        errores.descripcion = "DEBE DESCRIBIR SU PRODUCTO O SERVICIO"
    }

    return errores
}