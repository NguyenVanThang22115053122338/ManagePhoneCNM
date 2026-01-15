import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RequireRole from "./components/RequireRole";
import UserLayout from "./components/layout/UserLayout";
import Layout from "./components/layout/Layout";

/* ===== USER ===== */
import Home from "./pages/Home/Home";
import LoginPage from "./pages/Login/LoginPage";
import LaptopPage from "./pages/catalog/LaptopPage";
import AccountPage from "./pages/AccountManager/Account";
import Shopping_cardPage from "./pages/WishlistPage/WishlistPage";
import ProductDetail from "./pages/DetailProduct/DetailProductPage";
import CartPage from "./pages/CartPage/CartPage";
import OrderHistoryPage from "./pages/OrderHistory/OrderHistoryPage";
import NotificationsPage from "./components/NotificationDropdown/NotificationDropdown.tsx";
import OrderPage from "./pages/Order/OrderPage";
import ProductReviewPage from "./pages/ReviewPage/ProductReviewPage";
import AboutPage from "./pages/About/AboutPage";

/* ===== ADMIN ===== */
import Category from "./Admin/category/category";
import Addcategory from "./Admin/category/add_category";
import UpdateDeleteCategory from "./Admin/category/update_delete_category";

import Product from "./Admin/product/product";
import AddProduct from "./Admin/product/add_product";
import UpdateDeleteProduct from "./Admin/product/update_delete_product";
import PaymentPage from './pages/Payment/PaymentPage.tsx';

import ProtectedRoute from './components/ProtectedRoute.tsx';
import ProductList from './components/Products/ProductList.tsx';
import './Global.css'

import Supplier from "./Admin/supplier/supplier";
import SupplierForm from "./Admin/supplier/add_supplier";
import SupplierEdit from "./Admin/supplier/update_delete_supplier";

import AccountManagement from "./Admin/account/manage_account";
import AccountDetail from "./Admin/account/AccountDetail";
import AccountCreate from "./Admin/account/AccountCreate";

import NotificationManagement from "./Admin/notification/manage_notification";
import NotificationDetailPage from "./Admin/notification/notification_detail";

import PendingOrders from "./Admin/order/order_approval";
import OrderDetailPage from "./Admin/order/order_approval_detail";

import StockManagement from "./Admin/stock/manage_stock";
import Batch from "./Admin/stock/batch";
import StockinReceipt from "./Admin/stock/stockin_receipt";
import StockoutReceipt from "./Admin/stock/stockout_receipt";

import Sales_And_Quantity from "./Admin/statistical/sales_and_quantity";

import BrandsView from "./Admin/brand/BrandsPage";
import AddBrandView from "./Admin/brand/BrandCreateView";
import BrandEditView from "./Admin/brand/BrandEditView";

import ProductValueOverTime from "./Admin/statistical/product_value_over_time";
import ProductQuantityBySupplier from "./Admin/statistical/product_quantity_by_supplier";
import InventoryQuantity from "./Admin/statistical/inventory_quantity";
import OrderStatusByTime from "./Admin/statistical/order_status_by_time";

import DiscountUpdate from "./Admin/discount/Discount_update.tsx";
import DiscountPage from "./Admin/discount/Discount.tsx";
import DiscountAdd from "./Admin/discount/Discount_add.tsx";
import DiscountsPage from "./pages/Discount/discounts.tsx";

function App() {
  return (
    <Router>
      <Routes>

        {/* ===== USER LAYOUT ===== */}
        <Route element={<UserLayout />}>

          {/* ===== PUBLIC USER ROUTES ===== */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/laptop" element={<LaptopPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/product-detail/:id" element={<ProductDetail />} />
          <Route path="/payment" element={<OrderPage />} />
          <Route path="/payment/:orderId" element={<PaymentPage />} />

          {/* ===== PROTECTED USER ROUTES ===== */}
          <Route element={<ProtectedRoute />}>
            <Route path="/account" element={<AccountPage />} />
            <Route path="/cartShop" element={<CartPage />} />
            <Route path="/historyOrder" element={<OrderHistoryPage />} />
            {/* <Route path="/notification" element={<NotificationsPage />} /> */}
            <Route path="/order/:orderId" element={<OrderPage />} />
            <Route path="/Shopping_card" element={<Shopping_cardPage />} />
            <Route path="discount" element={<DiscountsPage />} />
          </Route>
        </Route >

        {/* ===== ADMIN LAYOUT ===== */}
        < Route
          path="/admin"
          element={
            < RequireRole allow={[2]} >
              <Layout />
            </RequireRole >
          }
        >
          <Route path="category" element={<Category />} />
          <Route path="category/create" element={<Addcategory />} />
          <Route path="category/edit/:id" element={<UpdateDeleteCategory />} />

          <Route path="products" element={<Product />} />
          <Route path="products/create" element={<AddProduct />} />
          <Route path="products/edit/:id" element={<UpdateDeleteProduct />} />

          <Route path="brands" element={<BrandsView />} />
          <Route path="brands/create" element={<AddBrandView />} />
          <Route path="brands/edit/:id" element={<BrandEditView />} />

          <Route path="suppliers" element={<Supplier />} />
          <Route path="supplier/create" element={<SupplierForm />} />
          <Route path="supplier/edit/:id" element={<SupplierEdit />} />

          <Route path="manage_account" element={<AccountManagement />} />
          <Route path="accounts/:userId" element={<AccountDetail />} />
          <Route path="accounts/create" element={<AccountCreate />} />

          <Route path="manage_notification" element={<NotificationManagement />} />
          <Route path="notifications/:notificationId" element={<NotificationDetailPage />} />

          <Route path="order_approval" element={<PendingOrders />} />
          <Route path="orders/:id" element={<OrderDetailPage />} />

          <Route path="stock_management" element={<StockManagement />} />
          <Route path="batches" element={<Batch />} />
          <Route path="stockin_receipt" element={<StockinReceipt />} />
          <Route path="stockout_receipt" element={<StockoutReceipt />} />

          <Route
            path="sales_and_quantity"
            element={<Sales_And_Quantity />}
          />
          {/* <Route path="/Admin/sales_and_quantity" element={<Sales_And_Quantity />} /> */}
          <Route path="product_value_over_time" element={<ProductValueOverTime />} />
          <Route path="product_quantity_by_supplier" element={<ProductQuantityBySupplier model={[]} />} />
          <Route path="inventory_quantity" element={<InventoryQuantity model={[]} danhSachNam={[]} />} />
          <Route
            path="order_status_by_time"
            element={<OrderStatusByTime danhSachNam={[2023, 2024]} tongSoDon={0} donHoanThanh={0} donHuy={0} />}
          />
          <Route path="discounts" element={<DiscountPage />} />
          <Route path="discounts/add" element={<DiscountAdd />} />
          <Route path="discounts/:id/update" element={<DiscountUpdate />} />
        </Route >



      </Routes >
    </Router >
  );
}

export default App;
