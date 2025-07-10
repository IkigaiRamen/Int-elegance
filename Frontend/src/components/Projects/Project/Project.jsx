import TasksBanner from "../../Tasks/tasksBanner";
import TasksFunctionLayout from "../../Tasks/Task functions/TasksFunctionsLayout";
const project = () => {
  <div className="container-xxl">
    <TasksBanner />
    <div className="row clearfix  g-3">
      <div className="col-lg-12 col-md-12 flex-column">
      <TasksFunctionLayout />
      </div>
    </div>
  </div>;
};

export default project;
