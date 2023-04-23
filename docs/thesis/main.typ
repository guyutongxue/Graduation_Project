#import "utils/template.typ": *

#let abstract = [
  程序设计在线评测系统（Online Judge，简称 OJ，直译“在线判题”）是一种软件系统，其通过计算机自动裁判若干用户提交的程序的正确性。现有的通用 OJ 系统中，评测系统通常是基于给定的若干组标准输入内容，并考察用户程序的标准输出是否符合期望，从而判定用户程序的正确性。但对于程序设计的初学者来说，丰富的图形界面、可视化程序开发则更具有吸引力；而这些程序也是人们日常使用的软件的重要组成部分。我们认为，基于标准输入、标准输出的程序虽然构成了计算机软件系统的根基，但它们更面向于科班、专业的技术人员；而在如今编程技能平民化、大众化的趋势下，更需要教育、普及对可视化程序的开发。OJ 系统在计算机教学中发挥的作用已有显著效应，而可视化程序的 OJ 系统设计则尚无成型原型。我在本论文中，提出了一种可视化程序设计 OJ 的组织方法，并实现了它的原型设计。首先，该 OJ 系统根据可视化程序设计的编程语言、构建流程和运行方式分为若干类别，对每一种类别的程序设计方法设计对应的判别方法：在原型设计中，我选用了 Web 程序、C\# Windows 窗体程序和 Python turtle 2D 图形程序三种基本类别。其次，设计统一的判题语法规则描述，教师、比赛组织者等用户可根据该规则描述制订具体的判题规则：在原型设计中，我选用了基于 JavaScript AST 的领域特定语言（DSL）描述，并提供了可视化组织界面。最后，将规则解释器、判题控制器、输入输出系统等组件结合，并提供恰当的最终用户交互界面，即可形成一个可用的可视化程序设计 OJ。本论文在原型设计的基础上，同时考察了其它判题类别的判别方法设计，对用户程序编译系统、用户程序安全性保障、多端并行通信与工业场景部署问题、与现有 OJ 前端系统的结合问题进行了深入讨论。
]

#let keywords = ("程序设计", "可视化程序", "在线编程", "在线评测", "实验教学")

#let enAbstract = [
  Online Judge (OJ) is a software system that automatically judges the correctness of a number of user submitted programs by computer. In existing general-purpose OJ systems, the judge system usually determines the correctness of a user's program based on a given set of standard inputs and examines whether the standard output of the user's program meets expectations. However, for beginners in programming, graphical interfaces and visual program development are more attractive; and these programs are an important part of the software that people use every day. We believe that although programs based on standard I/O form the foundation of computer software systems, they are more oriented to technical professionals; and with the trend of civilianization and popularization of programming skills, there is a greater need to educate and popularize the development of visual programs. There are no prototypes of OJ system design for visual programs. In this thesis, I propose a method for organizing and prototyping OJ for visual programming. First, the OJ system is divided into several categories according to the programming language, construction process and operation mode of visual programming, and the corresponding discriminative methods are designed for each category of programming methods: in this prototype, I chose three basic categories: Web programs, C\# Windows Forms programs and Python turtle 2D graphics programs. Secondly, I designed a uniform rule description of the judging syntax. Teachers, competition organizers, and other users can develop specific judging rules by this syntax. In this prototype, a JavaScript-AST-based domain-specific language (DSL) and a visualized user interface is provided. Finally, by combining components such as rule interpreters, problem-judging controllers, input and output systems, and providing appropriate end-user interaction interfaces, a usable visual programming OJ can be formed. This thesis also examines the design of other problem categories, the compilation system for user programs, the security assurance of user programs, the issues of parallel communication and deployment in industrial scenarios, and the design of the OJ front-end system. The integration with existing OJ front-end systems is also discussed in depth.
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

== OJ 系统简介

1970 年，德克萨斯 A & M 大学组织了第一次 ACM 国际大学生编程竞赛（ICPC），并为这场赛事设置了评测系统。随后这种赛制被大范围地推广，比如国际奥林匹克信息学竞赛（IOI）等诸多著名比赛都使用这样的评测系统来检查参赛选手的编程能力和算法运用能力。这种评测系统后来就被称作“在线评测”（Online Judge），简称 OJ。@Wasik2018 

OJ 的历史可以追溯到 1965 年斯坦福大学提出的自动评测程序系统。@Forsythe1965 在随后的数十年内，其发展迅速，许多大学、赛事机构、社会组织、教育机构都在建设自己的 OJ 系统。北京大学于 2005 年，为了促进北京大学竞赛队伍的竞争力，也开设了自己的 OJ 平台 POJ（全称 PKU JudgeOnline，中文名“北京大学程序在线评测系统”）。@Li2005 这类 OJ 平台可以给大量用户提供训练机会和学习机会，从而高效提升学生、选手的编程能力。 POJ 被视为中国境内最大的 OJ 平台。@Wasik2018

除了竞赛以外，OJ 系统也被用于计算机科学的教学工作。北京大学的老师们尝试将 POJ 平台用于《计算概论》《程序设计实习》等课程的教学中，比如在其中布置作业、考试等，以方便学生们完成编程的学习，也方便老师查看常见问题和错误。@Li2005 

传统 OJ 系统的工作流程是这样的：
- 教师/比赛组织者给定一个题目。题目的定义包括题目描述、输入输出格式、样例输入输出，和若干组输入输出数据（称为 _测试用例_ ）；
- 学生/选手将自己的程序代码提交到 OJ 系统；
- OJ 系统编译并运行学生的程序（称为 _用户程序_ ），以每组测试用例中的输入作为用户程序的标准输入，并记录用户程序的标准输出；
- OJ 系统比对标准输出与测试用例的输出是否一致，从而判断学生/选手的程序是否正确；
- 对于上述过程中遇到的系统异常，可能会得出超时（TLE，Time Limit Exceeded）、超内存（MLE、Memory Limit Exceeded）、运行时错误（RE、Runtime Error）等其它判题结果，通常也被视为用户程序的错误。@Li2005

Wasik 在 @Wasik2018 中以数学方式定义了宏观的 OJ 系统。在该数学定义下，OJ 系统的编译方式、判题方式和计分方式，均由自定义的算法决定。换句话说，系统管理员通常可以在这类 OJ 下自由地指定用户代码的编译方式或者上述判题流程。这种非传统的 OJ 系统也有所应用，如 UOJ（Universal OJ）。@vFleaking2014  UOJ 最典型的题目——quine，即通过检测程序输出与程序源码是否相同来得出判题结果。此外，卡内基·梅隆大学的 AutoLab 也可以算作一种非传统的 OJ 系统。@autolab2014

类似地，本论文将提出一种非传统的 OJ 系统。为了引入这一系统的特点，我们介绍可视化程序设计的相关概念。

== 可视化程序设计简介

_可视化程序设计_ 通常是指以可视化方式编写的程序设计平台、语言或软件。可视化方式可以指编写指令的过程是可视化的，也可以指编写得到的程序界面是可视化的。通常的可视化程序设计平台，这两者是结合完成的，如 Scratch、AppInventor 等；也有只考虑最终界面的可视化的，如 MIT LOGO。*CITATION NEEDED* 

可视化程序设计的出现，使得编程的门槛降低了，也使得编程的学习更加有趣。很多中小学生都可以通过相关平台学习编程的基本知识，而非计算机职业的人士、非计算机专业的学生也可以通过这类程序设计方式来编写他们想要完成的程序。

从程序的界面上划分，可视化程序设计通常得到图形界面程序。该界面可以是具体的、运行在某绘图环境中的图形界面，也可以是抽象的，运行在某高层次画布（如 HTML、WXML 等）及相关虚拟机平台的图形界面。这些图形界面通常由图形元素构成，比如按钮、文本框、下拉菜单等。

可视化程序设计即其对应的程序的开发过程通常可以抽象成流程图 @vp_flow：

#figure(
  image("img/vp_flow.png", width: 80%),
  caption: "可视化程序设计的开发流程",
) <vp_flow>

考虑到 OJ 系统在科班教学中的良好效应，如果将类似的软件系统运用于可视化程序设计的教学中，则会显著提高可视化程序设计的学习效率。因此，本文试图提出一种可视化程序设计的 OJ 系统的构成；它的核心为基于图形界面的 OJ 判别系统，即将 OJ 系统的判题流程扩展到图形界面程序的判别上。在下文中，我们称这种 OJ 系统为 VPOJ（即 Visual Programming Online Judge）。此外，我还实现了 VPOJ 的 _原型_ 系统，以验证本软件系统结构的可行性。

本论文的结构如下：
- @packages 讨论了 VPOJ 软件系统的边界和组件划分问题；
- @categories 讨论了原型实现选择的题目分类，及对每个题目类别的判题方法讨论；
- @transpiler 讨论了规则描述语言的设计，以及原型的实现细节；
- @ipc 讨论了将规则解释系统与判题后端结合的工作，以及其中的跨进程通信问题；
- @rtlib 讨论了规则解释系统中的运行时库的设计；
- @defdef 给出了一种定义规则解释系统更宏观抽象——DefDef 宏语言；
- @frontend 讨论了 VPOJ 在宏观意义下的前端设计；
- @security 讨论了 VPOJ 系统应考虑的安全性问题；
- @deployment 讨论了如何部署 VPOJ 系统以及与之相关的问题；
- @conclusion 总结了本论文的工作。

= VPOJ 系统组件与结构 <packages>

== 综述

接下来，我们将通过 @vp_flow 分析可视化程序设计开发流程中 OJ 参与的组分，确定 OJ 系统的边界。首先，从 _可视化的指令编写_ 到 _内部表示或编程语言_ 这一步通常不需要 OJ 系统参与，由可视化平台自身即可完成。其次， _内部表示或编程语言_ 到 _虚拟运行平台_ 这一步，对应到传统 OJ 的“编译”过程，也不是必须由 OJ 系统提供的功能。因此，作为 OJ 系统而言，我们只需要实现一个合适的 _虚拟运行平台_，当可视化程序运行在该平台时，实现我们所期望的判题流程，即可实现一个 VPOJ 系统。

因此，我们将 VPOJ 的核心系统——判题部分，固定为该可视化程序设计流程的特殊的 _虚拟运行平台_。考虑到可视化程序的特殊性——以图形界面作为交互手段，我们的 VPOJ 核心将解决图形界面的正确性判定问题。

为了定义一个程序在某个题目下的正确性，需要将这个题目以 _规则_ 的形式给出。若程序通过了规则所指定的判定，那么就视为是正确的。

#figure(
  image("img/structure_easy.png"),
  caption: "VPOJ 系统简化后的基本框架",
) <structure_easy>

可视化程序设计的最终结果是具有多样性的。它可以是一个类似表单样式的交互界面，也可以是供用户任意绘制的 2D 绘图界面。因此，针对不同的可视化程序设计结果，我们需要将其分类，并设计不同的规则与规则判定方法。

此外，我们需要将上述核心系统，与前端用户界面结合，供最终用户使用或作为中间件程序的接口。

上述组件构成了 VPOJ 的基本框架，简化后如 @structure_easy 所示。本章的余下部分，将分别讨论上述组件的简要设计。

== 题目类别与判题后端

图形界面将根据其运行平台和程序功能的不同分为不同的形式。不同形式的图形界面通常有很大的外观差异。

原型设计实现了三个判题后端：Web 程序、Windows 窗体程序和 Python turtle 2D 图形程序；它们的实现细节将在 @categories 中讨论。

== 判题规则描述系统

原型设计使用基于 JavaScript AST 的领域特定语言描述判题规则，其实现细节将在 @transpiler 中讨论。

== 规则派发与执行系统

== 前端用户界面

= 判题后端实现 <categories>

== Web 程序

== Windows 窗体程序

== Python turtle 2D 图形程序

== 其它程序

= 判题规则实现 <transpiler>

== 已有实践考察

== 基于现有编程语言的设计

== 基于全新 DSL 的设计

== 基于已有 AST 的 DSL 设计

= 规则派发与执行系统实现 <ipc>

== 跨进程通信考察

== 基于 JSON-RPC 的派发系统

= 运行时库与图像比对算法 <rtlib>

== 运行时库的必要性

== 已有的图像比对算法考察

== 原型中的图像比对算法设计

== 图像比对算法效果示例

== 图像比对算法的缺陷与改进方向

= 宏语言 DefDef 的实现 <defdef>

= 前端用户界面实现 <frontend>

== 本原型设计的前端用户界面

== 依赖于 DefDef 的规则智能提示系统

== VPOJ 系统的前端功能性考察

= 用户程序安全性 <security>

== 通用 OJ 系统的安全功能考察

== 本原型设计的安全性缺陷

== VPOJ 系统的可用安全性保障措施考察

= 系统部署 <deployment>

== 通用 OJ 系统的部署方案考察

== VPOJ 系统的可用部署方案考察

= 结论 <conclusion>

#bibliography("ref.bib",
 style: "ieee"
)

#appendix()

= 原型代码与构建方式

请访问 #text(blue, link("https://github.com/Guyutongxue/Graduation_Project")[GitHub: Guyutongxue/Graduation_Project]) 仓库。
