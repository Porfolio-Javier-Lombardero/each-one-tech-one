import React from "react";
import { useNavigate } from "react-router-dom";
import { useNewsStore } from "../../stores/useNewsStore";
import { SingleNew } from "@/lib/types/d.news.types";




export const TopicCard = ({ noticia }: { noticia: SingleNew }) => {

  const defineSingleNew = useNewsStore(state => state.defineSingleNew);
  const navigate = useNavigate();


  const handleClick = () => {
    defineSingleNew(noticia);
    navigate("/single", { state: { noticia } });
  };


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
            <button className="btn btn-sm btn-outline-secondary text-secondary ms-2">
              interview
            </button>
            <button className="btn btn-sm btn-outline-secondary text-secondary ms-2">
              tech
            </button>
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
