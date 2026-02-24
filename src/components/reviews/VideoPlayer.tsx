import { SearchResultItem } from "@/services/reviews/interfaces/d.reviews.types";
import React, { useState } from "react";

interface Props {
    video: SearchResultItem
}


export const VideoPlayer: React.FC<Props> = ({ video }) => {

    const [isPlaying, setIsPlaying] = useState(false);

    // Extraemos los datos para que el código sea más legible
    const videoId = video.id.videoId;
    const { title, thumbnails } = video.snippet;

    return (
        <div className="col-12 col-md-4 col-lg-3 m-2 d-flex flex-column align-items-stretch p-0 m-4">

            <div className="ratio ratio-16x9 bg-secondartransp rounded-top position-relative overflow-hidden">
                {!isPlaying ? (
                    /* CAPA DE VISTA PREVIA (Optimización de rendimiento) */
                    <button
                        className="btn p-0 border-0 bg-transparent w-100 h-100 d-flex align-items-center justify-content-center position-absolute top-0 start-0"
                        style={{ cursor: "pointer" }}
                        onClick={() => setIsPlaying(true)}
                        aria-label="Reproducir video"
                    >
                        <img
                            src={thumbnails.high.url}
                            alt={title}
                            className="img-fluid w-100 h-100 object-fit-cover rounded-top"
                            style={{ objectFit: "cover" }}
                        />
                        <span
                            className="position-absolute top-50 start-50 translate-middle bg-danger text-white rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: 60, height: 60, fontSize: 32, opacity: 0.9 }}
                        >
                            ▶
                        </span>
                    </button>
                ) : (
                    /* REPRODUCTOR REAL (Se monta solo al hacer click) */
                    <iframe
                        className="w-100 h-100 rounded-top border-0"
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                        title={title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                )}
            </div>

            <div className="bg-secondartransp rounded-bottom p-3 flex-grow-1 d-flex flex-column justify-content-between">
                <h4 className="mb-2 card-title fw-bolder text-primary text-truncate-2" style={{ minHeight: '2.5em' }}>{title}</h4>
                <span className="lead text-primary ">{video.snippet.channelTitle}</span>
            </div>

        </div>
    );
};

// Utilidad para truncar texto a 2 líneas con Bootstrap 5
// Añade esto a tu CSS global o main.scss:
// .text-truncate-2 {
//   display: -webkit-box;
//   -webkit-line-clamp: 2;
//   -webkit-box-orient: vertical;
//   overflow: hidden;
// }