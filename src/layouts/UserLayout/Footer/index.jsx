import React from "react";
import { Space, Row, Col } from "antd";
import {
  FacebookOutlined,
  GoogleOutlined,
  InstagramOutlined,
  YoutubeOutlined,
  TwitterOutlined,
} from "@ant-design/icons";

import * as S from "./style";

function Footer() {
  return (
    <S.FooterWrapper>
      <S.FooterContainer>
        <div className="gutter-example">
          <Row gutter={16}>
            <Col className="gutter-row" span={8}>
              <div className="gutter-box">
                <h2 style={{ marginBottom: 10 }}>Thông Tin</h2>
                <p>Công ty TNHH một thành viên </p>
                <p>
                  <span style={{ fontWeight: 500 }}>Địa chỉ :</span> Đà Nẵng, Hải Châu, Sơn Trà, Toa
                  Nhà Plaza
                </p>
                <p>
                  <span style={{ fontWeight: 500 }}>Số Điện Thoại :</span> 0987654321
                </p>
                <p>
                  <span style={{ fontWeight: 500 }}>Email :</span> Email@gmail.com
                </p>
                <div style={{ fontSize: 25 }}>
                  <Space>
                    <div style={{ marginRight: 10 }}>
                      <FacebookOutlined />
                    </div>
                    <div style={{ marginRight: 10 }}>
                      <GoogleOutlined />
                    </div>
                    <div style={{ marginRight: 10 }}>
                      <InstagramOutlined />
                    </div>
                    <div style={{ marginRight: 10 }}>
                      <YoutubeOutlined />
                    </div>
                    <div>
                      <TwitterOutlined />
                    </div>
                  </Space>
                </div>
              </div>
            </Col>
            <Col className="gutter-row" span={6}>
              <div className="gutter-box">
                <h2 style={{ marginBottom: 10 }}>Dịch vụ khách hàng</h2>
                <p>Chính sách điều khoản</p>
                <p>Hướng dẫn mua hàng</p>
                <p>Chính sách thanh toán</p>
                <p>Chính sách đổi trả</p>
                <p>Chính sách bảo hành</p>
              </div>
            </Col>
            <Col className="gutter-row" span={6}>
              <div className="gutter-box">
                <h2 style={{ marginBottom: 10 }}>Liên hệ</h2>
                <p>Hotline</p>
                <p>Email</p>
                <p>Live Chat</p>
                <p>Messenger</p>
                <p>Liên hệ</p>
              </div>
            </Col>
            <Col className="gutter-row" span={4}>
              <div className="gutter-box">
                <h2 style={{ marginBottom: 10 }}>Download App</h2>
                <div style={{ width: 150 }}>
                  <img src="https://pubcdn.ivymoda.com/ivy2/images/appstore.png" alt="aaaa" />
                  <img src="https://pubcdn.ivymoda.com/ivy2/images/googleplay.png" alt="bbbb" />
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </S.FooterContainer>
    </S.FooterWrapper>
  );
}

export default Footer;
