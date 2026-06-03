
import { NewsSections } from "@/features/news/components/NewsSections";
import { EventSection } from "@/features/events/components/EventSection";
import { ReviewsSection } from "@/features/reviews/components/ReviewsSection";



export const HomePage = () => {



 





  return (


        
      <div className="home home-page-gradient">
            <section id="hero" className="container-fluid d-flex justify-content-center align-items-center" >
        <div className="row p-2">
          <div className="col-12">
            <h1 className="h1 display-1">
              <span className="alt-font-thin ">Each</span> One <br />
              Tech
              <span className="alt-font-thin"> One</span>
            </h1>
            <h3
              className="text-center"
              style={{ textShadow: "1px 1px 10px white" }}
            >
              Where tech Meets
            </h3>
          </div>
        </div>
      </section>
      <NewsSections/>
      <EventSection/>  
      <ReviewsSection/>
      </div>
     

   

  
  );
};
