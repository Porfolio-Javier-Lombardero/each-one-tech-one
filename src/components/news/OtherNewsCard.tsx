import { useNavigate } from "react-router-dom";
import { useNewsStore } from "../../stores/useNewsStore";


import { CardProps } from "./types/d.comp.types";
import { Topics } from "@/lib/constants/topics";



export const OtherNewsCard = ({ noticia }: CardProps) => {
  const defineSingleNew = useNewsStore(state => state.defineSingleNew);
  const navigate = useNavigate();

  const handleCategories = (noti: number | undefined)=>{
    if(noti === undefined){
      return "smartphones"
   }
  return  Object.keys(Topics).find(key => Topics[key as keyof typeof Topics] === noti) 
  }
 
  const handleClick = () => {
    defineSingleNew(noticia);
    navigate("/single", { state: { noticia } });
  };

  return (
    <article  onClick={handleClick} style={{ cursor: "pointer"}} >
      <div className="card p-3  bg-secondartransp  border border-0 ">
        <span className="border border-top border-primary mt-2 mb-2 rounded-4 "></span>
        <div className="col-6 d-flex ms-1 ">
          <button className="btn btn-sm btn-primary me-2 mt-2 mb-2 text-secondary ">
            {handleCategories(noticia.categories !=undefined ? noticia.categories[0] : undefined)}
          </button>
          {
          noticia.categories?.length > 1 ? 
          ( <button className="btn btn-sm btn-outline-primary mt-2 mb-2 lh-1">
           {handleCategories(noticia.categories != undefined ? noticia.categories[1] : undefined)}
          </button>) : ("")
          }
         
        </div>
        <div className="card-body pt-1 ">
          <h4 className="card-title  truncate-after-second-line pt-1">
            {noticia.titulo.replace(/[#&]|82\d*/g, ' ')}
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
    </article>
  );
};
