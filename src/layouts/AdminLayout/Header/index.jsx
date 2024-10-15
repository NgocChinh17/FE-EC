import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { AppleOutlined, HomeOutlined, UserOutlined } from "@ant-design/icons";
import { Col, Row, Button, Popover } from "antd";

import { resetUser } from "../../../redux/slicers/userSlides";
import { Loading } from "../../../components/LoadingComponent/Loading";

import * as UserService from "../../../services/UserService";

import * as S from "./style";
import { ROUTES } from "../../../constants/routes";

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);

  const [userName, setUserName] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const [loading, setLoading] = useState(false);

  const content = (
    <div>
      <S.WrapperContentPopup
        style={{ marginBottom: 10, cursor: "pointer" }}
        onClick={() => navigate("/profile")}
      >
        Thông Tin Tài Khoản
      </S.WrapperContentPopup>
      {!user?.isAdmin && (
        <S.WrapperContentPopup
          style={{ marginBottom: 10, cursor: "pointer" }}
          onClick={() => navigate("/historyOrder")}
        >
          Lịch Sử Mua Hàng
        </S.WrapperContentPopup>
      )}
      <S.WrapperContentPopup
        style={{ marginBottom: 10, cursor: "pointer" }}
        onClick={() => handleLogout()}
      >
        Đăng Xuất
      </S.WrapperContentPopup>
    </div>
  );

  useEffect(() => {
    setLoading(true);
    setUserName(user?.name);
    setUserAvatar(user?.avatar);
    setLoading(false);
  }, [user?.name, user?.avatar]);

  const handleLogin = () => {
    navigate("/signin");
  };

  const handleLogout = async () => {
    setLoading(true);
    navigate(ROUTES.PAGES.HOME);
    await UserService.logoutUser();
    dispatch(resetUser());
    setLoading(false);
  };

  return (
    <S.HeaderWrapper>
      <Row>
        <Col span={2} style={{ marginLeft: 80, marginRight: 65 }}>
          <Button style={{ width: 200, fontSize: 20, fontWeight: 600, color: "black" }}>
            Văn Dương <AppleOutlined />
          </Button>
        </Col>
        <Col span={13}>
          <Button style={{ fontWeight: 600, marginLeft: 30 }}>
            <HomeOutlined />
            <Link to={ROUTES.PAGES.HOME}>Trang Chủ</Link>
          </Button>
        </Col>

        <Col span={2} style={{ marginLeft: 250 }}>
          <Loading isLoading={loading}>
            <div>
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
                <Button style={{ fontWeight: 600 }} onClick={() => handleLogin()}>
                  <UserOutlined />
                  Đăng Nhập
                </Button>
              )}
            </div>
          </Loading>
        </Col>
      </Row>
    </S.HeaderWrapper>
  );
}

export default Header;
