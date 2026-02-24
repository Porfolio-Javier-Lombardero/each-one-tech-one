
export interface EventProps {
    title:string| undefined;
    location:string |undefined;
    date:string | undefined;
    url:string | undefined
}


export const EventCard = ({ title, location, date, url }: EventProps) => {
  return (
    <article className="row rounded-2 mb-3 p-3 bg-secondartransp w-sm-100 shadow-sm">
      <div className="col-12 col-md-2 mb-2 mb-md-0">
        <p className="lead mb-0">{date}</p>
      </div>

      <div className="col-12 col-md-10">
        <h3 className="h5 mb-1">{title}</h3>
        <p className="mb-2">{location}</p>
        <a href={url} className="text-decoration-none">+ info</a>
      </div>
    </article>
  )
}
