
import { Facebook } from "@/assets/icons/Facebook";
import { Share } from "@/assets/icons/Share";
import { Tweeter } from "@/assets/icons/Tweeter";
import { useStore } from "@/store";
import { cleanHTML } from "@/services/news/helpers/useCleanHtml";

import { OtherNewsSkeleton } from "@/components/news/OtherNewsSkeleton";


export const SingleNewPage = () => {

  const singleNew = useStore((state) => state.singleNew);



  if (!singleNew) {
    return <OtherNewsSkeleton/>
  }

  return (
    <div>
      <div className="container-fluid m-0 pb-0 topic-page-gradient" id="hero">
        <div className="row  ps-1 ps-md-4 pt-5 pb-0 m-0  gy-0 gy-lg-5 flex-column flex-md-row justify-content-between ">
          <div className="col-12 col-md-8 d-flex justify-content-center justify-content-md-start  ps-0 ps-md-2 pb-0  mb-0 "></div>
          <div
            className="col-4  d-flex justify-content-around justify-content-md-evenly align-items-center pb-4"
            style={{ cursor: "pointer" }}
          >
            <Facebook />
            <Share />
            <Tweeter />
          </div>
          <div className=" col-12  p-3  p-md-0 p-md-3  ">
            <h1> {singleNew.titulo.replace(/[#&;]|82\d*/g, ' ')}</h1>
          </div>
        </div>
      </div>

      <section className="container-fluid p-0  p-lg-4 bg-secondary ">
        <div className="row justify-content-start mx-3 border-top border-primary border-3 ">
          <div className="col-12 d-flex flex-column flex-md-row pt-3 ">
            <div className="d-flex flex-md-column justify-content-around m-md-3 p-0 text-primary ">
              <p className="fs-7 fs-md-3">Date: {singleNew.fecha}</p>
            </div>
          </div>
        </div>
        <div className="row g-0 g-md-5">
          <div className="col-12 d-flex justify-content-center py-4 px-4">
            <h3> {singleNew.description.replace(/<\/?p>|[#&;]|82\d*/g, '')}</h3>

          </div>
          <div className="col-12 pt-2  d-flex align-self-start justify-content-center p-5">
            {singleNew.img && (
              <img
                src={singleNew.img}
                alt=""
                className="img-fluid  w-75 rounded"
              />
            )}
          </div>

          <div className="col-12  px-4 px-md-5  d-flex justify-content-center align-items-stretch ">
            <div className="lh-lg" dangerouslySetInnerHTML={{ __html: cleanHTML(singleNew.cont) }} />
          </div>


          <div className="col-12 p-4">
            <p className="fs-5 px-3">Font:</p>
            <a className="px-4" href={singleNew.url}> {singleNew.url}</a>
          </div>
        </div>
      </section>
    </div>
  );
};
