import { Allotment } from "allotment";

import RulePanel from "./RulePanel";

import "allotment/dist/style.css";
import SourcePanel from "./SourcePanel";

function App() {
  return (
    <Allotment className="h-[100vh] w-[100vw]" vertical defaultSizes={[2, 1]}>
      <Allotment.Pane>
        <Allotment>
          <RulePanel></RulePanel>
          <SourcePanel></SourcePanel>
        </Allotment>
      </Allotment.Pane>
      <Allotment.Pane>
        <h1 className="text-blue-500">Result</h1>
      </Allotment.Pane>
    </Allotment>
  );
}

export default App;
