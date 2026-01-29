import React, { useState, useEffect } from "react";
import { SearchIcon } from "../../../assets/icons/SearchIcon";
import { Link, useNavigate } from "react-router-dom";
import { useCategoryFilter } from "@/hooks/useCategoryFilter";
import { Categories } from "@/lib/constants/topics";
import { scrollToElement } from "@/utils/scrollToElement";

export const Header = () => {
  const navigate = useNavigate();

  const [dropdown, setdropdown] = useState(false)

  const { setCategory } = useCategoryFilter()

  // Cerrar el dropdown al cambiar el tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setdropdown(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDropdown = () => {
    setdropdown(!dropdown)
  };

  const handleClick = (topic: string) => {
    setCategory(topic)
    navigate(`/${topic}`);

  };

  const handleScrollToReviews = () => {
    // Si estamos en la homepage, hacer scroll directo
    if (window.location.pathname === '/') {
      scrollToElement('reviews', 100); // 100px offset para el header
    } else {
      // Si estamos en otra página, navegar al home y luego hacer scroll
      navigate('/');
      setTimeout(() => {
        scrollToElement('reviews', 100);
      }, 100);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const field = new FormData(event.currentTarget);
    const find = field.get("query");

    navigate(`/${find}`);
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg ">
        <div className="container-fluid d-flex flex-column flex-xl-row align-items-start align-items-xl-center">
          <button
            className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"
            onClick={handleDropdown}  >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse"
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav m-2 mb-2 mb-lg-0 bg-secondary border border-primary border-2 rounded-pill  align-items-center">
              <li className="nav-item">
                <div className="nav-link active" aria-current="page">
                  <Link to={"/"}>Home</Link>
                </div>
              </li>
              {
                Object.values(Categories).map(value => (
                  <li key={value} className="nav-item mt-3" onClick={() => handleClick(value)}>
                    <div className="nav-link " >
                      <p className="text-primary" style={{ cursor: "pointer" }}>{value}</p>
                    </div>
                  </li>
                ))
              }

              <li className="nav-item">
                <div className="nav-link" >
                  <a
                    className="text-primary text-decoration-none p-0 "
                    onClick={handleScrollToReviews}
                    style={{ cursor: "pointer" }}
                  >
                    R&R
                  </a>
                </div>
              </li>
              <li className="nav-item">
                <div className="nav-link" >
                  <Link to={"/subscribe"}>Newsletter</Link>
                </div>
              </li>
              <li className="nav-item">
                <div className="nav-link" aria-disabled="true" >
                  <Link to={"/Contact"}>Contact</Link>
                </div>
              </li>
            </ul>

          </div>
          <form
            className="d-flex  bg-secondary  mt-lg-2 py-3 border border-primary border-2 rounded-pill"
            role="search"
            onSubmit={handleSubmit}
          >
            <button className="btn btn-sm m-0 text-primary" type="submit">
              <SearchIcon />
            </button>
            <input
              className="form-control p-1"
              type="search"
              placeholder="separate,by,comma"
              aria-label="Search"
              name="query"
            />
          </form>
        </div>
      </nav>
      <div className="container-fluid bg-secondary position-absolute z-3 " style={dropdown ? { top: "0" } : { top: "-100%" }}>
        <div className="row w-100 justify-content-end ">
          <div className="col-1 p-2"><button className="btn p-1 btn-lg" onClick={handleDropdown}>X</button></div>
        </div>
        <div className="row ">
          <ul className="pb-5 " style={{ listStyle: "none" }}>

            <li className="nav-item">
              <div className="nav-link fs-6 py-2 ps-2 " onClick={handleDropdown}>
                <Link to={"/"}>Home</Link>
              </div>
            </li>
            {Object.values(Categories).map(value => (
              <li key={value} className="nav-item" onClick={() => handleClick(value)}>
                <div className="nav-link fs-6 py-2 ps-2 "style={{ cursor: "pointer" }} >
                  <p >{value}</p>
                </div>
              </li>
            ))
            }
             <li className="nav-item">
                <div className="nav-link fs-6 py-2 ps-2" >
                  <a
                    className="text-primary text-decoration-none "
                    onClick={handleScrollToReviews}
                    style={{ cursor: "pointer" }}
                  >
                    R&R
                  </a>
                </div>
              </li>
            <li className="nav-item">
              <div className="nav-link fs-6 py-2 ps-2" onClick={handleDropdown}>
                <Link to={"/subscribe"}>Newsletter</Link>
              </div>
            </li>
            <li className="nav-item">
              <div className="nav-link fs-6 py-2 ps-2" aria-disabled="true" >
                <Link to={"/Contact"}>Contact</Link>
              </div>
            </li>
          </ul>

        </div>
      </div>


    </header>
  );
};
