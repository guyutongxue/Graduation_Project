type Action = "clickButton" | "inputTextBox" | "text" | "enabled";

interface ByName {
  method: "byName",
  action: Action
}

interface ByText {
  method: "byText",
  action: Exclude<Action, "text">,
}

export type FormCommand = ByName | ByText;
