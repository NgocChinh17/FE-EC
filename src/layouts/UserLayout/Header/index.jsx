import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  PhoneOutlined,
  EnvironmentOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  AppleOutlined,
} from "@ant-design/icons";
import { Col, Row, Button, Input, Space, Popover, Badge } from "antd";

import { resetUser } from "../../../redux/slicers/userSlides";
import { Loading } from "../../../components/LoadingComponent/Loading";

import * as UserService from "../../../services/UserService";

import * as S from "./style";
import { ROUTES } from "../../../constants/routes";
import { searchProduct } from "../../../redux/slicers/productSlides";

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);

  const [userName, setUserName] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const order = useSelector((state) => state.order);
  const { Search } = Input;

  useEffect(() => {
    setLoading(true);
    setUserName(user?.name);
    setUserAvatar(user?.avatar);
    setLoading(false);
  }, [user?.name, user?.avatar]);

  const handleLogin = useCallback(() => {
    navigate("/signIn");
  }, [navigate]);

  const handleLogout = useCallback(async () => {
    setLoading(true);
    await UserService.logoutUser();
    localStorage.removeItem("access_token");
    dispatch(resetUser());
    setLoading(false);
  }, [dispatch]);

  const onSearch = useCallback(
    (e) => {
      setSearch(e.target.value);
      dispatch(searchProduct(e.target.value));
    },
    [dispatch]
  );

  const content = useMemo(
    () => (
      <div>
        {user?.isAdmin && (
          <S.WrapperContentPopup
            style={{ marginBottom: 10 }}
            onClick={() => navigate("/admin")}
          >
            Quản Lý Hệ Thống
          </S.WrapperContentPopup>
        )}
        <S.WrapperContentPopup
          style={{ marginBottom: 10 }}
          onClick={() => navigate("/profile")}
        >
          Thông Tin Tài Khoản
        </S.WrapperContentPopup>
        {!user?.isAdmin && (
          <S.WrapperContentPopup
            style={{ marginBottom: 10 }}
            onClick={() => navigate("/historyOrder")}
          >
            Lịch Sử Mua Hàng
          </S.WrapperContentPopup>
        )}
        <S.WrapperContentPopup style={{ marginBottom: 10 }} onClick={handleLogout}>
          Đăng Xuất
        </S.WrapperContentPopup>
      </div>
    ),
    [user, navigate, handleLogout]
  );

  const handleClickCart = () => {
    navigate(ROUTES.PAGES.ORDER_PAGE);
  };

  return (
    <S.HeaderWrapper>
      <Row>
        <Col span={6}>
          <Link to={ROUTES.PAGES.HOME}>
            <Space>
              <Button style={{ fontWeight: 600, marginLeft: 100, width: 240 }}>
                <AppleOutlined />
                Văn Dương MOBIFONE
              </Button>
            </Space>
          </Link>
        </Col>
        <Col span={6}>
          <S.input>
            <Search placeholder="Input search text" allowClear onChange={onSearch} />
          </S.input>
        </Col>
        <Col span={6}>
          <Space>
            <Button>
              <S.icon>
                <PhoneOutlined />
              </S.icon>
              <div style={{ fontSize: 10, fontWeight: 700 }}>
                <p>Gọi Mua Hàng</p>
                <p>123456789</p>
              </div>
            </Button>
            <Button>
              <EnvironmentOutlined />
              <div style={{ fontWeight: 600 }}>Địa chỉ cửa hàng </div>
            </Button>

            <Badge
              count={order?.orderItems?.length}
              style={{
                borderRadius: "50%",
                height: 21,
                width: 22,
                paddingTop: 3,
              }}
              size="small"
            >
              <Button onClick={() => handleClickCart()}>
                <Space>
                  <ShoppingCartOutlined />
                  <div style={{ fontWeight: 600 }}>Giỏ Hàng</div>
                </Space>
              </Button>
            </Badge>
          </Space>
        </Col>
        <Col span={6}>
          <Loading isLoading={loading}>
            <S.login>
              {user?.access_token ? (
                <>
                  <Popover content={content} title="Tài Khoản Của Tôi" trigger="click">
                    <Button>
                      {userAvatar ? (
                        <img
                          src={userAvatar}
                          alt="avatar"
                          style={{
                            height: "20px",
                            width: "20px",
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <UserOutlined />
                      )}
                      {userName?.length ? userName : user?.email}
                    </Button>
                  </Popover>
                </>
              ) : (
                <Button style={{ fontWeight: 600 }} onClick={handleLogin}>
                  <UserOutlined />
                  Đăng Nhập
                </Button>
              )}
            </S.login>
          </Loading>
        </Col>
      </Row>
    </S.HeaderWrapper>
  );
}

export default Header;
