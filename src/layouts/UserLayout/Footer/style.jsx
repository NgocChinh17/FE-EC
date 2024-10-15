import styled from "styled-components";

export const FooterWrapper = styled.div`
  border-top: 1px solid #3333;
  padding-top: 20px;
  padding-bottom: 40px;
  padding-left: 88px;
  display: flex;
  justify-content: space-between;
  background-color: white;

  @media (max-width: 1028px) {
    height: 55vh;
  }
`;
export const FooterContainer = styled.div`
  flex: 1;
  margin-left: 70px;
  margin-right: 100px;

  @media (max-width: 1028px) {
    height: 55vh;
    margin-left: 68px;
    margin-right: 127px;
  }
`;
