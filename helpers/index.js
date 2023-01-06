export const formatearFecha = fecha => {
    const fechaNueva = new Date(fecha);
    const opcones = {
        year: 'numeric',
        month:'long',
        day: '2-digit',
    }

    return fechaNueva.toLocaleDateString('es-ES', opcones)
}