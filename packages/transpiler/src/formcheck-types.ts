type NoParamAction = "clickButton" | "text" | "enabled";

type ByName = {
  method: "byName",
  name: string,
} & ({
  action: NoParamAction
} | {
  action: "inputTextBox",
  value: string
})

type ByText = {
  method: "byText",
  text: string,
} & ({
  action: Exclude<NoParamAction, "text">
} | {
  action: "inputTextBox",
  value: string
})

export type FormCommand = ByName | ByText;
