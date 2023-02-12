import { Allotment } from "allotment";
import RulePanel from "./RulePanel";
import SourcePanel from "./SourcePanel";
import ResultPanel from "./ResultPanel";
import "allotment/dist/style.css";

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
        <ResultPanel></ResultPanel>
      </Allotment.Pane>
    </Allotment>
  );
}

export default App;
