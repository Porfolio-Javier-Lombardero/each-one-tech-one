import { useNavigate } from "react-router-dom";
import { Categories } from "@/domain/Topics";
import React from "react";
import { Article } from "@/domain/Article";
import { useArticleNavigation } from "@/features/news/hooks/useArticleNavigation";
import { getTopicName } from "@/features/news/utils/topicUtils";

export interface CardProps {
  noticia: Article;
}

export const OtherNewsCard = ({ noticia }: CardProps) => {
  const navigate = useNavigate();
  const navigateToArticle = useArticleNavigation();

  const handleClick = () => navigateToArticle(noticia);


  const navigateToTopicPage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const topic = e.currentTarget.textContent as string
    const categoryValue = Object.keys(Categories).find(key =>
      key.toLowerCase() === topic?.toLowerCase());

    const categoryTitle = categoryValue ?
      Categories[categoryValue as keyof typeof Categories] : undefined;

    if (categoryTitle === undefined) {
      navigate('/');
      return;
    }
    navigate(`/topic/${categoryTitle || ''}`);
  }

  return (
    <article onClick={handleClick} style={{ cursor: "pointer" }} >
      <div className="card p-3  bg-secondartransp  border border-0 shadow ">
        <span className="border border-top border-primary mt-2 mb-2 rounded-4 "></span>
        <div className="col-6 d-flex ms-1 ">
          <button onClick={(e) => navigateToTopicPage(e)} className="btn btn-sm btn-primary me-2 mt-2 mb-2 text-secondary ">
            {getTopicName(noticia.categories?.[0])}
          </button>
          {noticia.categories?.length > 1 && (
            <button onClick={(e) => navigateToTopicPage(e)} className="btn btn-sm btn-outline-primary mt-2 mb-2 lh-1">
              {getTopicName(noticia.categories?.[1])}
            </button>
          )}

        </div>
        <div className="card-body pt-1 ">
          <h4 className="card-title  truncate-after-second-line pt-1">
            {noticia.titulo.replace(/&#82\d+;/g, "'")}
          </h4>
          <p className="card-subtitle  text-primary mb-3 ">
            {noticia.fecha}
          </p>
        </div>
        <div className="ratio ratio-4x3">
          <img className="card-img object-fit-cover " alt=""
            src={noticia.img ?? undefined}
          />


        </div>
      </div>
    </article>
  );
};
