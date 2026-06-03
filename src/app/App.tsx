import { useRoutes } from 'react-router-dom'
import ScrollToTop from "../shared/Hooks/scrollToTop";
import { Routes } from './router';

function App() {
  const routing = useRoutes(Routes);

  return (
    <>
      <ScrollToTop />
      {routing}
    </>
  );
}

export default App;
