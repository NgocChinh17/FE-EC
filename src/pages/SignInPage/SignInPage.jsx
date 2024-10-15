import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Image } from "antd";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";

import { Loading } from "../../components/LoadingComponent/Loading";
import { useMutationHooks } from "../../hooks/userMutatitonHook";
import { updateUser } from "../../redux/slicers/userSlides";

import InputForm from "../../components/InputForm/InputForm";

import login from "../../assets/image/login.png";

import * as UserService from "../../services/UserService";
import * as S from "./style";

const SignInPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [showPassword, setIsShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const mutation = useMutationHooks((data) => UserService.loginUser(data));
  const { data, isLoading, isSuccess } = mutation;

  useEffect(() => {
    if (isSuccess) {
      const accessToken = data?.access_token;
      if (accessToken) {
        localStorage.setItem("access_token", JSON.stringify(accessToken));
        localStorage.setItem("refresh_token", JSON.stringify(data?.refresh_token));
        try {
          const decoded = jwtDecode(accessToken);
          if (decoded?.id) {
            handleGetDetailsUser(decoded?.id, accessToken, data?.refresh_token);
          }
        } catch (error) {
          console.error("Invalid access token:", error);
        }
      }
      if (location?.state?.from) {
        navigate(location.state.from);
      } else {
        navigate("/");
      }
    }
  }, [isSuccess]);

  const handleGetDetailsUser = async (id, token) => {
    const refreshToken = localStorage.getItem("refresh_token");
    if (token) {
      const res = await UserService.getDetailsUser(id, token);
      const user = res?.data;
      dispatch(updateUser({ ...user, access_token: token, refreshToken }));
      if (user?.isAdmin) {
        navigate("/admin");
      }
    }
  };

  const handleSignUp = () => {
    navigate("/signUp");
  };

  const handleSignIps = () => {
    mutation.mutate({
      email,
      password,
    });
  };

  const handleOnchangeEmail = (value) => {
    setEmail(value);
  };

  const handleOnchangePassword = (value) => {
    setPassword(value);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ccc",
        height: "100vh",
      }}
    >
      <div
        style={{
          width: 800,
          height: 445,
          borderRadius: 6,
          backgroundColor: "#fff",
          display: "flex",
        }}
      >
        <S.WrapperContainerLeft>
          <h1>Xin Chào</h1>
          <p>Đăng Nhập Và Tạo Tài Khoản</p>
          <S.WrapperInput>
            <InputForm
              placeholder="abc@gmail.com"
              value={email}
              onChange={handleOnchangeEmail}
            />
          </S.WrapperInput>
          <div style={{ position: "relative" }}>
            <span
              style={{
                zIndex: 10,
                position: "absolute",
                top: "4px",
                right: "8px",
              }}
              onClick={() => setIsShowPassword(!showPassword)}
            >
              {showPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
            </span>
            <InputForm
              placeholder="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handleOnchangePassword}
            />
          </div>
          {data?.status === "ERR" && (
            <span style={{ color: "red" }}>{data?.message}</span>
          )}
          <Loading isLoading={isLoading}>
            <Button
              type="primary"
              style={{ width: "100%", marginTop: 10, marginBottom: 10 }}
              disabled={!email.length || !password.length}
              onClick={() => handleSignIps()}
            >
              Đăng Nhập
            </Button>
          </Loading>
          <S.WrapperTextLight>
            <p>Quên Mật Khẩu</p>
          </S.WrapperTextLight>
          <p>
            Chưa có Tài Khoản ?{" "}
            <S.WrapperTextLight onClick={() => handleSignUp()}>
              <span>Tạo Tài Khoản</span>
            </S.WrapperTextLight>
          </p>
        </S.WrapperContainerLeft>
        <S.WrapperContainerRight>
          <Image
            src={login}
            alt="login"
            preview={false}
            style={{ height: 203, width: 203 }}
          />
          <h4>Mua Sắm Tại Đây</h4>
          <p>Ưu Đãi Mỗi Ngày</p>
        </S.WrapperContainerRight>
      </div>
    </div>
  );
};

export default SignInPage;
