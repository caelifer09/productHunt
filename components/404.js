import React from 'react'
import styled from '@emotion/styled'

const Parrafo = styled.p`
  color:red;
  margin-top:5rem;
  text-align:center;
  font-weight:bold;
  font-size:5rem;

`
const Error404 = ({texto}) => {
  return (
    <>
    <Parrafo>{texto}</Parrafo>
    </>
  )
}

export default Error404