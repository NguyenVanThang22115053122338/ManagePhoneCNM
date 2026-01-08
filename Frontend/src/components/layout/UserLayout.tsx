import { Outlet } from "react-router-dom";
import Header from "../HeaderComponent/header";
import Footer from "../FooterComponent/footer";
import Chatbot from "../chatbot";

const UserLayout = () => {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <main style={{ flex: 1, width: "100%", paddingTop: 150 }}>
        <Outlet />
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
};

export default UserLayout;
