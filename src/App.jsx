import { Route, Routes } from "react-router-dom";
import React from "react";
import { NotFound } from "./Pages/NotFound";
import { HomePage } from "./Pages/HomePage";
import { TopicPage } from "./Pages/TopicPage";
import { SingleNewPage } from "./Pages/SingleNewPage";
import { ContactPage } from "./Pages/ContactPage";
import { TechRapsodyPage } from "./Pages/TechRapsodyPage";
import { SubscribePage } from "./Pages/SubscribePage";
import { SearchResults } from "./Pages/SearchResults";
import ScrollToTop from './Utils/scrollToTop';




function App() {
  return (
 <>
  <ScrollToTop/>
      <Routes>
        <Route path="*" element={<NotFound/>} />
        <Route path="/" element={<HomePage/>} />
        <Route path="/:topic" element={<TopicPage/>} />
        <Route path="/single" element={<SingleNewPage />} />
        <Route path="/subscribe" element={<SubscribePage/>} />
        <Route path="/Contact" element={<ContactPage />} />
        <Route path="/Rapshody" element={<TechRapsodyPage/>} />
        <Route path="/:" element={<SearchResults/>} />
      </Routes>
</>
  );
}

export default App;
