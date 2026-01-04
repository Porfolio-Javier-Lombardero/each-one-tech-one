import React from 'react'
import { Facebook, Share, Tweeter} from '../assets/Icons'
import fondoContact  from "../assets/img/fondoContact.png"

export const ContactPage = () => {
  return (
    <>
    <section className='container-fluid mb-0 pb-3 ' id='herOther'>
      <div className="row justify-content-center mb-0">
      <div className="col-12 p-2 mt-3 ps-3 ms-5">
        <h1 className='h1 display-1 fw-bolder text-primary'>Contact Us</h1>
      </div>
      <div className="col-12 d-flex justify-content-center  p-4 ">
      
        <img  className="img-fluid  rounded-4 p-5 m-5" src={fondoContact} />
       
      </div>
      <div className="col-6"></div>
      <div className="col-12 col-md-6 d-flex flex-column align-items-center">
        <p className='text fs-4 fw-bold'>
          eachonetechone@gmail.com
        </p>
        <p>Denver, CO</p>
        <strong>Follow us: </strong>
        <div className='d-flex justify-content-around w-25 mt-4 mb-0 pb-3'>
          <Tweeter/>
          <Facebook/>
          <Share/>
        </div>
      </div>
      </div>
    
    </section>
    </>
  )
}
