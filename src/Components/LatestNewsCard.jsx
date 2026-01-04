import React from "react";

import { Link } from "react-router-dom";
import useSearchStore from "../Store/useSearchStore";

export const LatestNewsCard = ( {noticia} ) => {
  
const {SingleNew} = useSearchStore()




  return (
    <article onClick={()=>SingleNew(noticia)} >
      <Link to={"/single"}>
        <div className="card card-first bg-primary text-secondary d-flex  p-0 p-md-2" style={{maxHeight:"420px"}}>
         
          <div className="col-6 mt-3 mb-0 ms-3 d-flex ">
            <button className="btn btn-outline-secondary d-none d-sm-inline text-secondary ms-2" >Latest</button>
            <button className="btn btn-outline-secondary d-none d-sm-inline text-secondary ms-2" >Tech</button>
            <button className="btn btn-outline-secondary btn-sm d-inline d-sm-none text-secondary ms-2" >Latest</button>
            <button className="btn btn-outline-secondary btn-sm d-inline d-sm-none text-secondary ms-2" >Tech</button>
          
          </div>
          <div className="card-body ">
            <h3 className="card-title truncate-after-second-line text-secondary">
              {noticia.titulo}
            </h3>
            <p className="lead card-subtitle mb-4">{noticia.fecha}</p>
            <div className="ratio ratio-21x9 rounded ">
              <img
                className="img-fluid  h-75 object-fit-cover  pb-md-3 rounded "
                src={noticia.img}
                alt=""
                
              />
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};
