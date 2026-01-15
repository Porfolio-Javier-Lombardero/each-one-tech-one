import React from "react";



export const TrendyNowCard = ({noticia}) => {

  return (
    <article>
     
    <div className="card mb-3 bg-white border rounded p-3 p-sm-4">
  <div className="row g-0">
    <div className="col-md-2">
    <p className="lead fs-6 fs-sm-4">{noticia.fecha}</p>
    </div>
    <div className="col-md-10">
      <div className="card-body">
        <h3 className="card-title">{noticia.desc}</h3>
        <p className="mb-0">More info at:</p>
       <p> <a href={noticia.url} className="link-underline-primary">{noticia.url}</a></p>
      </div>
    </div>
  </div>
</div>

    </article>
    
  );
};
