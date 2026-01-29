import React from "react";
import { useNavigate } from "react-router-dom";
import { useNewsStore } from "../../stores/useNewsStore";
import { SingleNew } from "@/lib/types/d.news.types";
import { Topics } from "@/lib/constants/topics";




export const TopicCard = ({ noticia }: { noticia: SingleNew }) => {

  const defineSingleNew = useNewsStore(state => state.defineSingleNew);
  const navigate = useNavigate();


  const handleClick = () => {
    defineSingleNew(noticia);
    navigate("/single", { state: { noticia } });
  };

    const handleCategories = (noti: number | undefined)=>{
      if(noti === undefined){
        return "smartphones"
     }
    return  Object.keys(Topics).find(key => Topics[key as keyof typeof Topics] === noti) 
    }
   

  return (
    <article onClick={handleClick} style={{ cursor: "pointer" }}>
      <div
        className="card position-relative rounded "
        style={{ minHeight: "500px" }}
      >
        <img
          src={noticia.img}
          className="img-fluid position-absolute h-100 object-fit-cover rounded "
          alt=""
        />
        <div
          className="card-img-overlay  d-flex flex-column justify-content-end rounded "
          style={{
            background: "linear-gradient(to top, #0A287E 2%, transparent)",
          }}
        >
          <div className="col-6 d-flex pb-2">
            <button className="btn btn-sm btn-primary me-2 mt-2 mb-2 text-secondary" >
            {handleCategories(noticia.categories !=undefined ? noticia.categories[0] : undefined)}
          </button>
          {
          noticia.categories?.length > 1 ? 
          ( <button className="btn btn-sm btn-outline-secondary mt-2 mb-2 lh-1">
           {handleCategories(noticia.categories != undefined ? noticia.categories[1] : undefined)}
          </button>) : ("")
          }
          </div>

          <h4 className="h6 card-title fw-bolder text-secondary truncate-after-second-line">
            {noticia ? noticia.titulo : ""}  </h4>

          <p className="card-subtitle  text-secondary ">
            {noticia ? noticia.fecha : ""}
          </p>
        </div>
      </div>
    </article>
  );
};
