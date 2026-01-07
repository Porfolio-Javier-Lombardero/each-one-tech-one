import { LatestNewsCard } from "../Components/LatestNewsCard";
import { OtherNewsCard } from "../Components/OtherNewsCard";
import { TopicCard } from "../Components/TopicCard";
import { TrendyNowCard } from "../Components/TrendyNowCard";
import useSearchStore from "../Store/useSearchStore";
import { useFetch } from "../Hooks/useFetch";
import { useEffect } from "react";

// import TopHeadlines from "../Mocks/TopHeadlines.json";

export const HomePage = () => {
  // const [tops, settops] = useState(TopHeadlines.articles);

  const { fetchData } = useFetch(null);

  const {
    SearchEvents,
    SearchRapsodhy,
    events,
    rapshody,
    SearchHeadlines,
    // news,
  } = useSearchStore();

  useEffect(() => {
    //SearchHeadlines()
    SearchEvents();
    SearchRapsodhy();
  }, []);

  if (fetchData.isLoading) {
    return <div>Cargando...</div>;
  }

  if (fetchData.isError) {
    return <div>Error al cargar las noticias...</div>;
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
            <h3 className="text-center">Where tech Meets</h3>
          </div>
        </div>
      </section>
      <section
        className="container-fluid pb-4 p-1 p-sm-4  bg-secondary  pb-4"
        id="latest-news"
      >
        <div className="row p-4 mb-3">
          <div className="col-12 py-2 border-top border-primary border-2">
            <h2 className="h2 display-3">LATEST NEWS</h2>
          </div>
        </div>
        <div className="row align-items-end justify-content-between px-3 gx-2 gy-5">
          {/* {news &&
            news.map((noticia, index) => {
              return index === 0 ? (
                <div className="col-12 col-lg-6" key={index}>
                  <LatestNewsCard key={noticia.id} noticia={noticia} />
                </div>
              ) : index < 10 ? (
                <div className="col-12 col-md-4 col-lg-3" key={index * 99}>
                  <OtherNewsCard key={noticia.id} noticia={noticia} />
                </div>
              ) : (
                ""
              );
            })} */}
          {fetchData.data &&
            fetchData.data.map((noticia, index) => {
              return index === 0 ? (
                <div className="col-12 col-lg-6" key={index}>
                  <LatestNewsCard key={noticia.id} noticia={noticia} />
                </div>
              ) : index < 10 ? (
                <div className="col-12 col-md-4 col-lg-3" key={index * 99}>
                  <OtherNewsCard key={noticia.id} noticia={noticia} />
                </div>
              ) : (
                ""
              );
            })}

          {/* <button className="col-2 btn btn-primary">see all</button> */}
        </div>
        <div className="row p-4  g-2 px-6 align-items-end "></div>
      </section>

      <section
        className="container-fluid p-1 p-sm-4 pb-4 bg-secondary"
        id="topics"
      >
        <div className="row p-4 mb-3">
          <div className="col-12 py-2 border-top border-primary border-2">
            <h2 className="h2 display-3">TRENDY NOW</h2>
          </div>
        </div>
        <div className="row  align-items-end px-3 gx-3 gy-3 gy-md px-4 pb-5">
          {fetchData.data &&
            fetchData.data
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
        className="conteiner-fluid p-1 p-sm-4 pb-4 bg-secondary"
        id="trendy"
      >
        <div className="row p-4 mb-3">
          <div className="col-12 py-2 border-top border-primary border-2">
            <h2 className="h2 display-3">SAVE THE DATE</h2>
          </div>
        </div>
        <div className="row p-3 px-md-5">
          {events &&
            events.map((noticia, i) => {
              return i < 8 ? (
                <div className="col-12" key={noticia.id}>
                  <TrendyNowCard noticia={noticia} />
                </div>
              ) : (
                ""
              );
            })}
        </div>
      </section>

      <section
        className="container-fluid p-1 p-sm-4 bg-secondary"
        id="rapshody"
      >
        <div className="row p-4 mb-3">
          <div className="col-12 py-2 border-top border-primary border-2">
            <h2 className="h2 display-3">REVIEWS & RELEASES</h2>
          </div>
        </div>

        <div className="row   px-3">
          <div className="col-12 px-3 px-sm-5 ">
            <div className="row  mb-2 px-2 px-sm-4 justify-content-between">
              {rapshody &&
                rapshody.map((noiticia) => {
                  return (
                    <div className="col-12 col-md-5  my-4" key={noiticia.id}>
                      <TopicCard noticia={noiticia} />
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
