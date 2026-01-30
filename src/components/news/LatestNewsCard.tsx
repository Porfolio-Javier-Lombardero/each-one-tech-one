import { useNavigate } from "react-router-dom";
import { CardProps } from "./types/d.comp.types";
import { useStore } from "../../store/";



export const LatestNewsCard = ({ noticia }: CardProps) => {

  const defineSingleNew = useStore(state => state.defineSingleNew);
  const navigate = useNavigate();

  const handleClick = () => {
    defineSingleNew(noticia);
    navigate("/single", { state: { noticia } });
  };


  return (
    <article onClick={handleClick} style={{ cursor: "pointer" }} >

      <div className="card card-first bg-primary text-secondary d-flex  p-0 p-md-2 shadow" style={{ maxHeight: "450px" }}>

        <div className="col-6 mt-3 mb-0 ms-3 d-flex ">
          <button className="btn btn-outline-secondary d-none d-sm-inline text-secondary ms-2" >Latest</button>
          <button className="btn btn-outline-secondary d-none d-sm-inline text-secondary ms-2" >Tech</button>
          <button className="btn btn-outline-secondary btn-sm d-inline d-sm-none text-secondary ms-2" >Latest</button>
          <button className="btn btn-outline-secondary btn-sm d-inline d-sm-none text-secondary ms-2" >Tech</button>

        </div>
        <div className="card-body ">
          <h3 className="card-title truncate-after-second-line text-secondary">
            {noticia.titulo.replace(/[#&]|82\d*/g, ' ')}
          </h3>
          <p className="lead card-subtitle mb-4">{noticia.fecha}</p>
          <div className="ratio ratio-21x9 rounded ">
            <img
              className="img-fluid  h-75 object-fit-cover  pb-md-3 rounded-5 "
              src={noticia.img}
              alt=""

            />
          </div>
        </div>
      </div>

    </article>
  );
};
