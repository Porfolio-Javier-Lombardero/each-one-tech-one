import React, { useState } from "react";
import { SearchIcon } from "../assets/Icons";
import { Link, useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();

  const [dropdown, setdropdown] = useState(false)


  const handleDropdown= ()=>{
      setdropdown(!dropdown)
  }

  const handleSubmit = (event) => {
    const field = new FormData(event.target);
    const find = field.get("query");

    navigate(`/${find}`);
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid ">
          <button
            className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"
           onClick={handleDropdown}  >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse "
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav m-2 mb-2 mb-lg-0 bg-secondary  border-2 rounded-pill p-1 ">
              <li className="nav-item">
                <div className="nav-link active" aria-current="page" href="#">
                  <Link to={"/"}>Home</Link>
                </div>
              </li>
              <li className="nav-item">
                <div className="nav-link "  href="#">
                  <Link to={"/App's & Software"}>App's & Software</Link>
                </div>
              </li>
              <li className="nav-item">
                <div className="nav-link "  href="#">
                  <Link to={"/Smartphones"}>Smartphones</Link>
                </div>
              </li>
              <li className="nav-item">
                <div className="nav-link "  href="#">
                  <Link to={"/Gadgets"}>Gadgets</Link>
                </div>
              </li>
              <li className="nav-item">
                <div className="nav-link "  href="#">
                  <Link to={"/A.I."}>A.I.</Link>
                </div>
              </li>
              <li className="nav-item">
                <div className="nav-link "  href="#">
                  <Link to={"/Politics & Regulation"}>
                    Politics & Regulation
                  </Link>
                </div>
              </li>

              <li className="nav-item">
                <div className="nav-link" href="#">
                  <Link to={"/Rapshody"}>R&R</Link>
                </div>
              </li>
              <li className="nav-item">
                <div className="nav-link" href="#">
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
              className="d-flex  bg-secondary rounded-pill mt-lg-2 py-2 border border-secondary border-2"
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
      <div className="container-fluid bg-secondary position-absolute z-3 " style={dropdown ? { top: "0" } : { top:"-100%" }}>
          <div className="row w-100 justify-content-end ">
            <div className="col-1 p-2"><button className="btn p-1 btn-lg" onClick={handleDropdown}>X</button></div>
          </div>
          <div className="row ">
          <ul className="pb-5 "  style={{listStyle:"none"}}>
        
              <li className="nav-item">
                <div className="nav-link fs-6 py-2 ps-2 "  href="#" onClick={handleDropdown}>
                  <Link to={"/"}>Home</Link>
                </div>
              </li>
              <li className="nav-item">
                <div className="nav-link fs-6 py-2 ps-2 "  href="#" onClick={handleDropdown}>
                  <Link to={"/App's & Software"}>App's & Software</Link>
                </div>
              </li>
              <li className="nav-item">
                <div className="nav-link fs-6 py-2 ps-2 "  href="#" onClick={handleDropdown}>
                  <Link to={"/Smartphones"}>Smartphones</Link>
                </div>
              </li>
              <li className="nav-item">
                <div className="nav-link fs-6 py-2 ps-2 "  href="#" onClick={handleDropdown}>
                  <Link to={"/Gadgets"}>Gadgets</Link>
                </div>
              </li>
              <li className="nav-item">
                <div className="nav-link fs-6 py-2 ps-2 "  href="#" onClick={handleDropdown}>
                  <Link to={"/A.I."}>A.I.</Link>
                </div>
              </li>
              <li className="nav-item">
                <div className="nav-link fs-6 py-2 ps-2 "  href="#" onClick={handleDropdown}>
                  <Link to={"/Politics & Regulation"}>
                    Politics & Regulation
                  </Link>
                </div>
              </li>

              <li className="nav-item">
                <div className="nav-link fs-6 py-2 ps-2" href="#" onClick={handleDropdown}>
                  <Link to={"/Rapshody"}>R&R</Link>
                </div>
              </li>
              <li className="nav-item">
                <div className="nav-link fs-6 py-2 ps-2" href="#" onClick={handleDropdown}>
                  <Link to={"/subscribe"}>Newsletter</Link>
                </div>
              </li>
              <li className="nav-item">
                <div className="nav-link fs-6 py-2 ps-2" aria-disabled="true" >
                  <Link to={"/Contact"}>contact</Link>
                </div>
              </li>
            </ul>
    
          </div>
      </div>
    

    </header>
  );
};
