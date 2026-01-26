import React from 'react'
import { EventProps } from './types/d.comp.types'



export const EventCard = ({title, location, date} :EventProps) => {
  return (
    <article className='row d-flex rounded-2 mx-3  mb-3 p-3 bg-white'>
        <p className='lead col-2'>{date}</p>
        <p className='col-9 d-flex flex-column'> 
        <h3>{title}</h3>
        <p className='fw-regular'>{location}</p>
        </p>
    </article>
  )
}
