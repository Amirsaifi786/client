import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./layout/Layout";
import Home from "./pages/Home";
import "./index.css";
import Roomlist from "./pages/Roomlist";
import Myprofile from "./pages/Myprofile";
import Contact from "./pages/Contact";
import SubmitProperty from "./pages/Submitproperty";
import MyResponses from "./pages/MyResponses";
import MyProperties from "./pages/MyProperties";
import Bookmark from "./pages/Bookmark";
import Myaccount from "./pages/MyAccount";
import Roompartnerlist from "./pages/Roompartnerlist";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import PropertyDetail from "./pages/Roomdetail";
import LocationPage from "./pages/Location";
import AutoPopup from "./components/AutoPopup";
import ChangePassword from "./pages/ChangePassword";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  return (
    
    <BrowserRouter>
    {/* GLOBAL POPUP */}
      <AutoPopup />
      {/* routes */}
      <ToastContainer position="top-right" autoClose={3000} />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/property/:slug?" element={<Roomlist />} />
          <Route path="/location/:locationSlug" element={<Roomlist />} />
          <Route path="/location/:locationSlug/:slug" element={<Roomlist />} />
          <Route path="/propertydetail/:slug" element={<PropertyDetail />} />
          <Route path="/submit-property" element={<SubmitProperty />} />
          <Route path="/room-seekers" element={<Roompartnerlist />} />

          <Route path="/submit-property/:id" element={<SubmitProperty />} />
          <Route path="/location" element={<LocationPage />} />
          <Route path="/my-responses" element={<MyResponses />} />
          <Route path="/my-properties" element={<MyProperties />} />
          <Route path="/my-bookmarks" element={<Bookmark />} />
          <Route path="/my-profile" element={<Myaccount />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/myprofile" element={<Myprofile />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;