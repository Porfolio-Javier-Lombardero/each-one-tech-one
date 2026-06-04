import { NavLink } from 'react-router-dom';
import { Categories } from '@/domain/Topics';
import { useScrollToSection } from '@/shared/hooks/useScrollToSection';
import { SCROLL_SECTIONS } from './navConfig';

export const DesktopNav = () => {
  const scrollToSection = useScrollToSection();

  return (
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav m-2 mb-2 mb-lg-0 bg-secondartransp rounded-pill align-items-center shadow-sm">
        <li className="nav-item">
          <div className="nav-link active" aria-current="page">
            <NavLink to="/">Home</NavLink>
          </div>
        </li>
        {Object.values(Categories).map(value => (
          <li key={value} className="nav-item mt-3">
            <div className="nav-link">
              <NavLink to={`/topic/${value}`}>
                <p className="text-primary" style={{ cursor: 'pointer' }}>{value}</p>
              </NavLink>
            </div>
          </li>
        ))}
        {SCROLL_SECTIONS.map(({ id, label }) => (
          <li key={id} className="nav-item">
            <div className="nav-link">
              <a
                className="text-primary text-decoration-none p-0"
                onClick={() => scrollToSection(id)}
                style={{ cursor: 'pointer' }}
              >
                {label}
              </a>
            </div>
          </li>
        ))}
        <li className="nav-item">
          <div className="nav-link">
            <NavLink to="/subscribe">Newsletter</NavLink>
          </div>
        </li>
        <li className="nav-item">
          <div className="nav-link" aria-disabled="true">
            <NavLink to="/Contact">Contact</NavLink>
          </div>
        </li>
      </ul>
    </div>
  );
};
