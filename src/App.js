import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";

import { ROUTES } from "./constants/routes";
import { resetUser, updateUser } from "./redux/slicers/userSlides";

// HomePage components
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage.jsx";
import HomePage from "./pages/HomePage/HomePage.jsx";
import ProductPage from "./pages/ProductsPage/ProductsPage.jsx";
import OrderPage from "./pages/OrderPage/OrderPage.jsx";
import TypeProductPage from "./pages/TypeProductPage/TypeProductPage.jsx";
import ProductDetails from "./pages/ProductDetailsPage/ProductDetails.jsx";
import SignInPage from "./pages/SignInPage/SignInPage.jsx";
import SingUpPage from "./pages/SignUpPage/SingUpPage.jsx";
import ProfilePage from "./pages/Profile/ProfilePage.jsx";
import CheckoutPage from "./pages/CheckoutPage/CheckoutPage.jsx";
import OrderSuccess from "./pages/OrderSuccess/OrderSuccess.jsx";
import HistoryOrder from "./pages/HistoryOrder/HistoryOrder.jsx";
import DetailsOrderPage from "./pages/DetailsOrderPage/DetailsOrderPage.jsx";

// AdminPage components
import HomeAdmin from "./pages/Admin/HomeAdmin/HomeAdmin.jsx";

import * as UserService from "./services/UserService";
import { jwtDecode } from "jwt-decode";
import { isJsonString } from "./utils.js";

function App() {
  const dispatch = useDispatch();
  const [isloading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    setIsLoading(true);
    const { storageData, decoded } = handleDecoded();
    if (decoded?.id) {
      handleGetDetailsUser(decoded?.id, storageData);
    }
    setIsLoading(false);
  }, []);

  const handleDecoded = () => {
    let storageData = user?.access_token || localStorage.getItem("access_token");
    let decoded = {};
    if (storageData && isJsonString(storageData) && !user?.access_token) {
      storageData = JSON.parse(storageData);
      decoded = jwtDecode(storageData);
    }
    return { decoded, storageData };
  };

  UserService.axiosJWT.interceptors.request.use(
    async function (config) {
      const currentTime = new Date();
      const { decoded } = handleDecoded();
      let storageRefreshToken = localStorage.getItem("refresh_token");
      const refreshToken = JSON.parse(storageRefreshToken);
      const decodedRefreshToken = jwtDecode(refreshToken);
      if (decoded?.exp < currentTime.getTime() / 1000) {
        if (decodedRefreshToken?.exp > currentTime.getTime() / 1000) {
          const data = await UserService.refreshToken(refreshToken);
          config.headers["token"] = `Bearer ${data?.access_token}`;
        } else {
          dispatch(resetUser());
        }
      }
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  const handleGetDetailsUser = async (id, token) => {
    let storageRefreshToken = localStorage.getItem("refresh_token");
    const refreshToken = JSON.parse(storageRefreshToken);
    const res = await UserService.getDetailsUser(id, token);
    dispatch(
      updateUser({ ...res?.data, access_token: token, refreshToken: refreshToken })
    );
  };

  return (
    <>
      <Routes>
        <Route element={<UserLayout />}>
          <Route path={ROUTES.PAGES.HOME} element={<HomePage />} />
          <Route path={ROUTES.PAGES.PRODUCTS_PAGE} element={<ProductPage />} />
          <Route path={ROUTES.PAGES.ORDER_PAGE} element={<OrderPage />} />
          <Route path={ROUTES.PAGES.TYPE_PRODUCT_PAGE} element={<TypeProductPage />} />
          <Route path={ROUTES.PAGES.PRODUCT_DETAILS_PAGE} element={<ProductDetails />} />
          <Route path={ROUTES.PAGES.PROFILE} element={<ProfilePage />} />
          <Route path={ROUTES.PAGES.CHECKOUT_PAGE} element={<CheckoutPage />} />
          <Route path={ROUTES.PAGES.ORDER_SUCCESS} element={<OrderSuccess />} />
          <Route path={ROUTES.PAGES.HISTORY_ORDER} element={<HistoryOrder />} />
          <Route path={ROUTES.PAGES.DETAILS_ORDER_PAGE} element={<DetailsOrderPage />} />
        </Route>
        <Route element={<AdminLayout />}>
          <Route path={ROUTES.ADMIN.HOME_ADMIN} element={<HomeAdmin />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
        <Route path={ROUTES.SIGN_IN_PAGE} element={<SignInPage />} />
        <Route path={ROUTES.SIGN_UP_PAGE} element={<SingUpPage />} />
      </Routes>
    </>
  );
}

export default App;
