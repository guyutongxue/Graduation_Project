import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

import "react-tabs/style/react-tabs.css";

export default function SourcePanel() {
  return (
    <Tabs>
      <TabList>
        <Tab>Title 1</Tab>
        <Tab>Title 2</Tab>
      </TabList>

      <TabPanel>
        <h2>Any content 1</h2>
        <h1 className="text-blue-500">Test</h1>
      </TabPanel>
      <TabPanel>
        <h2>Any content 2</h2>
      </TabPanel>
    </Tabs>
  );
}
