
import { OtherNewsSkeleton } from "@/shared/components/OtherNewsSkeleton";
import { useGetEvents } from '../hooks/useGetEvents';
import { EventCard } from "./EventCard";

export const EventSection = () => {
      const { isLoading: loadingEvents, events } = useGetEvents();
  return (
      <section className="container-fluid p-1 p-sm-4 pb-4 " id="events">
           <div className="row p-4 mb-3">
             <div className="col-12 py-2 border-top border-primary border-2">
               <h2 className="h2 display-3">SAVE THE DATE</h2>
             </div>
           </div>
           <div className="row p-3 px-md-5 ">
             {loadingEvents ? (
               <OtherNewsSkeleton />
             ) : (
               events &&
               events.map((event) => (
                 <EventCard
                   key={event.url}
                   date={event.date}
                   title={event.title}
                   location={event.location}
                   url={event.url}
                 />
               ))
             )}
           </div>
         </section>
  )
}
