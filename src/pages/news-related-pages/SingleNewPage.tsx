
import { Loader } from "@/components/shared/Loader";
import { Facebook } from "@/assets/icons/Facebook";
import { Share } from "@/assets/icons/Share";
import { Tweeter } from "@/assets/icons/Tweeter";
import { useNewsStore } from "@/stores/useNewsStore";
import { cleanHTML } from "@/Utils/useCleanHtml";


export const SingleNewPage = () => {

  const singleNew = useNewsStore((state) => state.singleNew);



  if (!singleNew) {
    return <Loader />;
  }

  return (
    <div>
      <div className="container-fluid m-0 pb-0 " id="hero">
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
            <h1 className="display-4  text-warp">{singleNew.titulo}</h1>
          </div>
        </div>
      </div>

      <section className="container-fluid p-0  p-lg-4 bg-secondary ">
        <div className="row justify-content-start mx-3 border-top border-primary border-3 ">
          <div className="col-12 col-md-6 d-flex flex-column flex-md-row pt-3 ">
            <div className="d-flex flex-md-column justify-content-around m-md-3 p-0 text-primary ">
              <p className="fs-7 fs-md-3">Date: {singleNew.fecha}</p>
            </div>
          </div>
        </div>
        <div className="row g-0 g-md-5">
          <div className="col-12 pt-2 col-md-6  d-flex align-self-start justify-content-center p-5">
            {singleNew.img && (
              <img
                src={singleNew.img}
                alt=""
                className="img-fluid w-100 rounded"
              />
            )}
          </div>

          <div className="col-12 col-md-6 px-4 px-md-3 pt-3 d-flex justify-content-center align-items-stretch ">
            <div className="lh-lg" dangerouslySetInnerHTML={{ __html: cleanHTML(singleNew.cont) }} />
          </div>
          <div className="col-12 d-flex justify-content-center py-4 px-3">
            <h4 className="alt-font text-primary fw-bold ">{singleNew.desc}</h4>
          </div>
          <div className="col-12 col-lg-6 p-2">
            <div className="w-100 px-4 d-flex flex-wrap justify-content-around  "></div>
          </div>
          <div className="col-12 col-lg-6 px-4 ">
            <p className="lh-lg"></p>
          </div>
        </div>
      </section>
    </div>
  );
};
