import { CardProps } from "./LatestNewsCard";
import { useArticleNavigation } from "@/features/news/hooks/useArticleNavigation";
import { getTopicName } from "@/features/news/utils/topicUtils";
import { LazyImage } from "@/shared/components/LazyImage";

export const TopicCard = ({ noticia }: CardProps) => {
  const navigateToArticle = useArticleNavigation();
  const handleClick = () => navigateToArticle(noticia);

  return (
    <article
      className="mb-3 mb-lg-0"
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <div
        className="card position-relative rounded "
        style={{ minHeight: "500px" }}
      >
        <LazyImage
          src={noticia.img ?? undefined}
          alt=""
          className="img-fluid h-100 w-100 object-fit-cover"
          wrapperProps={{ style: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%" } }}
        />
        <div
          className="card-img-overlay  d-flex flex-column justify-content-end rounded "
          style={{
            background: "linear-gradient(to top, #0A287E 2%, transparent)",
          }}
        >
          <div className="col-6 d-flex pb-2">
            <button className="btn btn-sm btn-primary me-2 mt-2 mb-2 text-secondary">
              {getTopicName(noticia.categories?.[0])}
            </button>
            {noticia.categories?.length > 1 && (
              <button className="btn btn-sm btn-outline-secondary mt-2 mb-2 lh-1">
                {getTopicName(noticia.categories?.[1])}
              </button>
            )}
          </div>

          <h4 className="h6 card-title fw-bolder text-secondary truncate-after-second-line">
            {noticia ? noticia.titulo : ""}{" "}
          </h4>

          <p className="card-subtitle  text-secondary ">
            {noticia ? noticia.fecha : ""}
          </p>
        </div>
      </div>
    </article>
  );
};
