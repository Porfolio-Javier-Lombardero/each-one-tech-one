import { useState } from "react";
import { LatestNewsCard } from "../components/news/LatestNewsCard";
import { OtherNewsCard } from "../components/news/OtherNewsCard";
import { LatestNewsSkeleton } from "../components/news/LatestNewsSkeleton";
import { OtherNewsSkeleton } from "../components/news/OtherNewsSkeleton";
import { useHomeNews } from "@/hooks/useHomeNews";
import { EventCard } from "@/components/news/EventCard";
import { TopicCard } from "@/components/news/TopicCard";
import { VideoPlayer } from "@/components/reviews/VideoPlayer";

export const HomePage = () => {

  const [seeAll, setSeeAll] = useState(false)

  const { news, loading, events, reviews } = useHomeNews();



  const handleSeeAll = () => {
    setSeeAll(!seeAll)
  }

  return (
    <div className="home">
      <section
        className="container-fluid d-flex justify-content-center align-items-center "
        id="hero"
      >
        <div className="row p-2">
          <div className="col-12">
            <h1 className="h1 display-1">
              <span className="alt-font-thin ">Each</span> One <br />
              Tech
              <span className="alt-font-thin"> One</span>
            </h1>
            <h3 className="text-center" style={{ textShadow: "1px 1px 10px white" }}>Where tech Meets</h3>
          </div>
        </div>
      </section>
      <section
        className="container-fluid pb-4 p-1 p-sm-4    pb-4"
        id="latest-news"
      >
        <div className="row p-4 mb-3">
          <div className="col-12 py-2 border-top border-primary border-2">
            <h2 className="h2 display-3">LATEST NEWS</h2>
          </div>
        </div>
        <div className="row align-items-end justify-content-between px-3 gx-2 gy-5">
          {loading ? (
            <>
              <div className="col-12 col-lg-6">
                <LatestNewsSkeleton />
              </div>
              {Array.from({ length: 8 }).map((_, i) => (
                <div className="col-12 col-md-4 col-lg-3" key={`skeleton-${i}`}>
                  <OtherNewsSkeleton />
                </div>
              ))}
            </>
          ) : (
            <>
              {news &&
                news.map((noticia, index) => {
                  if (index === 0) {
                    return (
                      <div className="col-12 col-lg-6" key={index}>
                        <LatestNewsCard key={noticia.id} noticia={noticia} />
                      </div>
                    );
                  } else if (index < 10) {
                    return (
                      <div className="col-12 col-md-4 col-lg-3" key={index * 99}>
                        <OtherNewsCard key={noticia.id} noticia={noticia} />
                      </div>
                    );
                  }
                  return null;
                })}
              {seeAll &&
                news?.slice(10).map((noticia) => (
                  <div className="col-12 col-md-4 col-lg-3" key={noticia.id}>
                    <OtherNewsCard noticia={noticia} />
                  </div>
                ))}
            </>
          )}
        </div>
        <button className="col-2 btn btn-primary m-3" onClick={handleSeeAll}>{seeAll ? "view less" : "view All"}</button>
        <div className="row p-4  g-2 px-6 align-items-end "></div>
      </section>

      <section
        className="container-fluid p-1 p-sm-4 pb-4 "
        id="topics"
      >
        <div className="row p-4 mb-3">
          <div className="col-12 py-2 border-top border-primary border-2">
            <h2 className="h2 display-3">TRENDY NOW</h2>
          </div>
        </div>
        <div className="row px-1 d-flex">
          {news &&
            news
              .map((noticia) => {
                return (
                  <div className="col-12  col-md-6  col-lg-3" key={noticia.id}>
                    <TopicCard noticia={noticia} />
                  </div>
                );
              })
              .splice(0, 4)}
        </div>
      </section>

      <section
        className="conteiner-fluid p-1 p-sm-4 pb-4 "
        id="events"
      >
        <div className="row p-4 mb-3">
          <div className="col-12 py-2 border-top border-primary border-2">
            <h2 className="h2 display-3">SAVE THE DATE</h2>
          </div>
        </div>
        <div className="row p-3 px-md-5 ">
          {
            events && events.map((event) => {
              const desglosedEvent = event.split(",")
              return <EventCard
                date={desglosedEvent[0]}
                title={desglosedEvent[1]}
                location={desglosedEvent[2]}
                url={desglosedEvent[3]} />

            })
          }
        </div>
      </section>

      <section
        className="container-fluid p-1 p-sm-4 "
        id="reviews"
      >
        <div className="row p-4 mb-3">
          <div className="col-12 py-2 border-top border-primary border-2">
            <h2 className="h2 display-3">REVIEWS & RELEASES</h2>
          </div>
        </div>

        <div className="row px-3 justify-content-center">
          {reviews?.map((item) => (
            <VideoPlayer
              key={item.id.videoId}
              video={item}
              showDetails={true}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
