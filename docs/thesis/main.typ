#import "utils/template.typ": *

#let abstract = [
  程序设计在线评测系统（Online Judge，简称 OJ，直译“在线判题”）是一种软件系统，其通过计算机自动裁判若干用户提交的程序的正确性。现有的通用 OJ 系统中，评测系统通常是基于给定的若干组标准输入内容，并考察用户程序的标准输出是否符合期望，从而判定用户程序的正确性。但对于程序设计的初学者来说，丰富的图形界面、可视化程序开发则更具有吸引力；而这些程序也是人们日常使用的软件的重要组成部分。我们认为，基于标准输入、标准输出的程序虽然构成了计算机软件系统的根基，但它们更面向于科班、专业的技术人员；而在如今编程技能平民化、大众化的趋势下，更需要教育、普及对可视化程序的开发。OJ 系统在计算机教学中发挥的作用已有显著效应，而可视化程序的 OJ 系统设计则尚无成型原型。我在本论文中，提出了一种可视化程序设计 OJ 的组织方法，并实现了它的原型设计。首先，该 OJ 系统根据可视化程序设计的编程语言、构建流程和运行方式分为若干类别，对每一种类别的程序设计方法设计对应的判别方法：在原型设计中，我选用了 Web 程序、C\# Windows 窗体程序和 Python turtle 2D 图形程序三种基本类别。其次，设计统一的判题语法规则描述，教师、比赛组织者等用户可根据该规则描述制订具体的判题规则：在原型设计中，我选用了基于 JavaScript AST 的领域特定语言（DSL）描述，并提供了可视化组织界面。最后，将规则解释器、判题控制器、输入输出系统等组件结合，并提供恰当的最终用户交互界面，即可形成一个可用的可视化程序设计 OJ。本论文在原型设计的基础上，同时考察了其它判题类别的判别方法设计，对用户程序编译系统、用户程序安全性保障、多端并行通信与工业场景部署问题、与现有 OJ 前端系统的结合问题进行了深入讨论。
]

#let keywords = ("程序设计", "可视化程序", "在线编程", "在线评测", "实验教学")

#let enAbstract = [
  Online Judge (OJ) is a software system that automatically judges the correctness of a number of user submitted programs by computer. In existing general-purpose OJ systems, the judge  system usually determines the correctness of a user's program based on a given set of standard inputs and examines whether the standard output of the user's program meets expectations. However, for beginners in programming, rich graphical interfaces and visual program development are more attractive; and these programs are an important part of the software that people use every day. We believe that although programs based on standard I/O form the foundation of computer software systems, they are more oriented to technical professionals in the classroom; and with the trend of civilianization and popularization of programming skills, there is a greater need to educate and popularize the development of visual programs. There are no prototypes of OJ system design for visual programs. In this thesis, I propose a method for organizing and prototyping OJ for visual programming. First, the OJ system is divided into several categories according to the programming language, construction process and operation mode of visual programming, and the corresponding discriminative methods are designed for each category of programming methods: in the prototype design, I choose three basic categories: Web programs, C\# Windows Forms programs and Python turtle 2D graphics programs. Secondly, I designed a uniform rule description of the judging syntax, according to which teachers, competition organizers, and other users can develop specific judging rules: I chose a JavaScript-AST-based domain-specific language (DSL) description for the prototype design, and provided a visual organization interface. Finally, by combining components such as rule interpreters, problem-judging controllers, input and output systems, and providing appropriate end-user interaction interfaces, a usable visual programming OJ can be formed. This thesis builds on the prototype design and also examines the design of discriminatory methods for other question categories, the compilation system for user programs, the security assurance of user programs, the issues of multi-terminal parallel communication and deployment in industrial scenarios, and the design of the OJ front-end system, The integration with existing OJ front-end systems is also discussed in depth.
]

#let enKeywords = ("programming design", "visual programming", "online programming", "online judge", "experimental teaching")

#show: doc => conf(
  author: "谷雨",
  studentId: "1900012983",
  thesisName: "本科生毕业论文",
  header: "可视化程序设计 OJ 技术研究",
  title: "可视化程序设计 OJ 技术研究",
  enTitle: "Visual Programming Online Judge Techonology Research",
  school: "信息科学技术学院",
  major: "计算机科学与技术（科学方向）",
  supervisor: "邓习峰",
  svDept: "信息科学技术学院",
  svTitle: "讲师",
  date: "二〇二三年五月",
  abstract: abstract,
  keywords: keywords,
  enAbstract: enAbstract,
  enKeywords: enKeywords,
  acknowledgements: [感谢 Typst 开发者的辛勤付出。 #lorem(300)],
  doc,
)
= 引言

#lorem(5)

最初，OJ 在 ACM 等信息学竞赛中用作裁判系统，随后也被各中学、大学用作计算机科学、信息科学等课程的辅助教学手段。 @wang2010guide 该

#lorem(500)

= VPOJ 系统组件与结构

== 综述

#lorem(10)

== 题目类别与判题后端

== 判题规则描述系统

== 规则派发与执行系统

== 前端用户界面

= 判题后端实现

== Web 程序

== Windows 窗体程序

== Python turtle 2D 图形程序

== 其它程序

= 判题规则实现

== 已有实践考察

== 基于现有编程语言的设计

== 基于全新 DSL 的设计

== 基于已有 AST 的 DSL 设计

= 规则派发与执行系统实现

== 跨进程通信考察

== 基于 JSON-RPC 的派发系统

= 运行时库与图像比对算法

== 运行时库的必要性

== 已有的图像比对算法考察

== 原型中的图像比对算法设计

== 图像比对算法效果示例

== 图像比对算法的缺陷与改进方向

= 宏语言 DefDef 的实现

= 前端用户界面实现

== 本原型设计的前端用户界面

== 依赖于 DefDef 的规则智能提示系统

== VPOJ 系统的前端功能性考察

= 用户程序安全性

== 通用 OJ 系统的安全功能考察

== 本原型设计的安全性缺陷

== VPOJ 系统的可用安全性保障措施考察

= 系统部署

== 通用 OJ 系统的部署方案考察

== VPOJ 系统的可用部署方案考察

= 结论

#bibliography("ref.bib",
 style: "ieee"
)

#appendix()

= 原型代码与构建方式

请访问 #text(blue, link("https://github.com/Guyutongxue/Graduation_Project")[GitHub: Guyutongxue/Graduation_Project]) 仓库。
