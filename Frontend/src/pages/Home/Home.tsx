import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ProductList from "../../components/Products/ProductList";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const paymentStatus = params.get("payment");
    const orderId = params.get("orderId");

    if (paymentStatus === "success") {
      alert(`Thanh toán thành công. Mã đơn hàng: ${orderId}`);

      // localStorage.removeItem("cartId");

      navigate("/", { replace: true });
    }
  }, [location.search, navigate]);

  return <ProductList />;
};

export default Home;
