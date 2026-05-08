import React from "react";

export const OtherNewsSkeleton: React.FC = () => {
    return (
        <article aria-hidden="true">
            <div className="card p-3 skeleton-card-bg border border-0 shadow placeholder-wave">
                <span className="border border-top border-primary mt-2 mb-2 rounded-4"></span>

                <div className="col-6 d-flex ms-1">
                    <span className="placeholder btn btn-sm me-2 mt-2 mb-2 col-3"></span>
                    <span className="placeholder btn btn-sm mt-2 mb-2 col-3"></span>
                </div>

                <div className="card-body pt-1">
                    <h4 className="card-title pt-1">
                        <span className="placeholder col-10"></span>
                        <span className="placeholder col-7 mt-2"></span>
                    </h4>
                    <p className="card-subtitle text-primary mb-3">
                        <span className="placeholder col-4"></span>
                    </p>
                </div>

                <div className="ratio ratio-4x3">
                    <div className="placeholder w-100 h-100 rounded-4"></div>
                </div>
            </div>
        </article>
    );
};
