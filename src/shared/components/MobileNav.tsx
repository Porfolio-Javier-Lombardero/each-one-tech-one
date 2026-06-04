import { NavLink } from 'react-router-dom';
import { Categories } from '@/domain/Topics';
import { useScrollToSection } from '@/shared/hooks/useScrollToSection';
import { SCROLL_SECTIONS } from './navConfig';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav = ({ isOpen, onClose }: MobileNavProps) => {
  const scrollToSection = useScrollToSection();

  return (
    <div
      className="container-sm w-75 w-md-25 rounded-4 bg-secondary position-absolute z-3 shadow-sm"
      style={isOpen ? { top: '2%', left: '12%' } : { top: '-120%' }}
    >
      <div className="row w-100 justify-content-end pe-5 pt-4">
        <div className="col-1">
          <button
            className="btn btn-md btn-outline-primary shadow-sm"
            style={{ fontSize: '0.8rem' }}
            onClick={onClose}
          >
            close
          </button>
        </div>
      </div>
      <div className="row">
        <ul className="pb-3" style={{ listStyle: 'none' }}>
          <li className="nav-item mobile-menu-item">
            <div onClick={onClose} className="nav-link fs-6 py-3 ps-2">
              <NavLink to="/">Home</NavLink>
            </div>
          </li>
          {Object.values(Categories).map(value => (
            <li key={value} className="nav-item mobile-menu-item">
              <div onClick={onClose} className="nav-link fs-6 py-1 ps-2" style={{ cursor: 'pointer' }}>
                <NavLink to={`/topic/${value}`}>
                  <p>{value}</p>
                </NavLink>
              </div>
            </li>
          ))}
          {SCROLL_SECTIONS.map(({ id, label }) => (
            <li key={id} className="nav-item mobile-menu-item">
              <div onClick={onClose} className="nav-link fs-6 py-2 ps-2">
                <a
                  className="text-primary text-decoration-none"
                  onClick={() => scrollToSection(id)}
                  style={{ cursor: 'pointer' }}
                >
                  {label}
                </a>
              </div>
            </li>
          ))}
          <li className="nav-item mobile-menu-item">
            <div onClick={onClose} className="nav-link fs-6 py-2 ps-2">
              <NavLink to="/subscribe">Newsletter</NavLink>
            </div>
          </li>
          <li className="nav-item mobile-menu-item">
            <div onClick={onClose} className="nav-link fs-6 py-3 ps-2" aria-disabled="true">
              <NavLink to="/Contact">Contact</NavLink>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};
