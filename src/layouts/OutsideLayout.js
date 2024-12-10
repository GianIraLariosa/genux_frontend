import { Outlet } from "react-router-dom";
import Header from "./Header";
import { Container } from "reactstrap";
import backgroundIMG from "../assets/images/bg/seaside2.jpg";

const OutsideLayout = () => {
  return (
    <main
      style={{
        margin: 0,
        padding: 0,
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
      }}
    >
      <div
        className="pageWrapper d-lg-flex Outsidelayout-background"
        style={{
          backgroundImage: `url(${backgroundIMG})`,
        }}
      >
        <div
          className="contentArea"
        >
          <Container>
            <Outlet />
          </Container>
        </div>
      </div>
    </main>
  );
};

export default OutsideLayout;
