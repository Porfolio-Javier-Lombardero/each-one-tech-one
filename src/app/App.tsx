import { useRoutes } from 'react-router-dom'
import ScrollToTop from "@/shared/hooks/useScrollToTop";
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
