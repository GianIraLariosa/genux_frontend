import Dashboard from "./Dashboard";
import BpmnDiagram from "./Diagram_Editor";
import Header from "./Header";

const FullLayout = () => {
  return (
    <main>
      <div className="pageWrapper d-lg-flex">
        <Header /> {/* The header spans the full width of the page */}
        <div className="contentArea">
          <aside className="sidebarArea shadow" id="sidebarArea">
            <Dashboard />
          </aside>
          <div className="diagramArea">
            {/* <Experiment/> */}
            {/* <PlantUMLGenerator/> */}
            {/* <BpmnDiagram/> */}
            <BpmnDiagram />
          </div>
        </div>
      </div>
    </main>
  );
};

export default FullLayout;
