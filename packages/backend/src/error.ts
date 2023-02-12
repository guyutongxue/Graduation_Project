
const ERROR_DESCRIPTION = {
  UnmetPrecondition: "前置条件不满足。如判题程序找不到对应的元素。",
  AssertionFailure: "断言失败。期望的条件不成立。",
  Timeout: "超时。",
  NoCase: "无测试用例。请正确编写规则代码。",
  ConnectionFailure: "连接失败。内部错误，无法与判题程序通信。",
  EmptyChecker: "判题程序为空。内部错误，判题程序尚未初始化。",
  UnknownCategory: "未知类别。找不到合适的判题程序。",
  InternalError: "内部错误。未知错误。", 
}

export type ErrorType = keyof typeof ERROR_DESCRIPTION;

export class JudgeError extends Error {
  constructor(public type: ErrorType, message?: string) {
    super(message);
  }
  get typeDescription() {
    return ERROR_DESCRIPTION[this.type];
  }
}
