import React from "react";

import { Link } from "react-router-dom";
import useSearchStore from "../Store/useSearchStore";
export const OtherNewsCard = ({noticia}) => {

  const {SingleNew} = useSearchStore()

  return (
    <article onClick={()=>SingleNew(noticia)}>
      <Link to={"/single"} className="text-decoration-none">
        <div className=" card p-2  bg-secondary border border-secondary ">
          <div className="col-12 border border-info mb-3"></div>
          <div className="col-6 d-flex ms-1 ">
            <button className="btn btn-sm btn-primary me-1">
              Interviwes
            </button>
            <button className="btn btn-sm btn-outline-primary lh-sm">
              New Release
            </button>
          </div>
          <div className="card-body pt-1 ">
            <h4 className="card-title  truncate-after-second-line pt-1">
            {noticia.titulo}
            </h4>
            <p className="card-subtitle  text-primary mb-3 ">
              {noticia.fecha}
            </p>
          </div>
         <div className="ratio ratio-4x3">
          <img className="card-img object-fit-cover " alt="" 
          src={noticia.img}
           />
          </div>
        </div>
      </Link>
    </article>
  );
};
