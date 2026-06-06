import { Article } from "@/domain/Article";
import { useArticleNavigation } from "@/features/news/hooks/useArticleNavigation";
import { LazyImage } from "@/shared/components/LazyImage";

export interface CardProps {
  noticia: Article;
}

export const LatestNewsCard = ({ noticia }: CardProps) => {
  const navigateToArticle = useArticleNavigation();
  const handleClick = () => navigateToArticle(noticia);


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
            <LazyImage
              src={noticia.img ?? undefined}
              alt=""
              className="img-fluid h-75 object-fit-cover pb-md-3 rounded-5 w-100"
              wrapperProps={{ style: { display: "block", width: "100%", height: "100%" } }}
            />
          </div>
        </div>
      </div>

    </article>
  );
};
