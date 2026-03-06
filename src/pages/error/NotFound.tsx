import { NavLink } from "react-router-dom"


export const NotFound = () => {
  return (
    <div className="container-fluid p-2">
      <div className="row h-100 p-5">
      <div className="col-12 d-flex flex-column justify-content-center px-5 mb-5">
        <NavLink to={"/"}><span className="fs-3">Go to home</span></NavLink>
        <h1 className="display-2">Something gone wrong</h1>
        <h3 className="display-3">Error 404</h3>
      </div>
     </div>
    </div>
  )
}
