import React from "react";

export const LatestNewsSkeleton: React.FC = () => {
    return (
        <article aria-hidden="true">
            <div className="card card-first bg-primary text-secondary d-flex p-0 p-md-2 shadow placeholder-wave" style={{ maxHeight: "450px" }}>
                <div className="col-6 mt-3 mb-0 ms-3 d-flex">
                    <span className="placeholder col-2 me-2"></span>
                    <span className="placeholder col-2 me-2"></span>
                    <span className="placeholder col-2 d-inline d-sm-none me-2"></span>
                    <span className="placeholder col-2 d-inline d-sm-none me-2"></span>
                </div>

                <div className="card-body">
                    <h3 className="card-title text-secondary">
                        <span className="placeholder col-8"></span>
                    </h3>
                    <p className="lead card-subtitle mb-4">
                        <span className="placeholder col-4"></span>
                    </p>

                    <div className="ratio ratio-21x9 rounded">
                        <div className="placeholder w-100 h-100 rounded-5"></div>
                    </div>
                </div>
            </div>
        </article>
    );
};
