import { Outlet } from "react-router-dom";

import Header from "./Header";
import Footer from "./Footer";

import * as S from "./style";

function UserLayout() {
  return (
    <S.UserLayoutWrapper>
      <Header />
      <S.UserLayoutContainer>
        <Outlet />
      </S.UserLayoutContainer>
      <Footer />
    </S.UserLayoutWrapper>
  );
}

export default UserLayout;
