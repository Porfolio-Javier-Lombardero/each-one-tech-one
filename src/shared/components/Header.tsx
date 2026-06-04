import { useDropdown } from '@/shared/hooks/useDropdown';
import { DesktopNav } from './DesktopNav';
import { MobileNav } from './MobileNav';
import { NewsSearchForm } from './NewsSearchForm';

export const Header = () => {
  const { isOpen, toggle, close } = useDropdown();

  return (
    <header>
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid d-flex flex-row flex-lg-column flex-xl-column align-items-start align-items-xl-start">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
            onClick={toggle}
          >
            <span className="navbar-toggler-icon" style={{ display: isOpen ? 'none' : 'block' }} />
          </button>
          <DesktopNav />
          <NewsSearchForm />
        </div>
      </nav>
      <MobileNav isOpen={isOpen} onClose={close} />
    </header>
  );
};
