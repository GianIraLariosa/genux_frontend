import { Outlet } from "react-router-dom";
import Header from "./Header";
import { Container } from "reactstrap";

const OutsideLayout = () => {
  return (
    <main>
      <div className="pageWrapper d-lg-flex">
        <div className="contentArea">
          <Container className="p-4 wrapper" fluid>
            <Outlet />
          </Container>
        </div>
      </div>
    </main>
  );
};

export default OutsideLayout;
