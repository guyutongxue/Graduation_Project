#import "utils/template.typ": *

#let abstract = [
  程序设计在线评测系统（Online Judge，简称 OJ，直译“在线判题”）是一种软件系统，其通过计算机自动裁判若干用户提交的程序的正确性。现有的通用 OJ 系统中，评测系统通常是基于给定的若干组标准输入内容，并考察用户程序的标准输出是否符合期望，从而判定用户程序的正确性。但对于程序设计的初学者来说，开发更易用、更直观的图形用户界面（Graphical User Interface，简称 GUI）程序则更具有吸引力；而这些程序也是人们日常使用的软件的重要组成部分。尽管基于标准输入、标准输出的程序虽然构成了计算机软件系统的根基，但它们更面向于科班、专业的技术人员；而在如今编程技能平民化、大众化的趋势下，更需要教育、普及对 GUI 程序的开发。OJ 系统在计算机教学中发挥的作用已有显著效应，而 GUI 程序的 OJ 系统设计则尚无成型原型。本论文提出了一种图形用户界面程序 OJ 的组织方法，并实现了其原型项目。首先，该 OJ 系统根据开发 GUI 程序所使用的编程语言、构建流程和运行方式分为若干类别，对每一种类别的程序设计方法设计对应的判别方法：原型选用了 Web 程序、C\# Windows 窗体程序和 Python turtle 2D 图形程序三种基本类别。其次，设计统一的判题语法规则描述，教师、比赛组织者等用户可根据该规则描述制订具体的判题规则：原型选用了基于 JavaScript AST 的领域特定语言（DSL）描述，并提供了可视化的规则编辑界面。最后，将规则解释器、判题控制器、输入输出系统等组件结合，并提供恰当的最终用户交互界面，即可形成一个可用的图形用户界面程序设计 OJ。本论文在原型项目的基础上，同时考察了其它判题类别的判别方法设计，对用户程序编译系统、用户程序安全性保障、多端并行通信与工业场景部署问题、与现有 OJ 前端系统的结合问题进行了深入讨论。
]

#let keywords = ("程序设计", "图形用户界面", "在线编程", "在线评测", "实验教学")

#let enAbstract = [
  Online Judge (OJ) is a software system that automatically judges the correctness of a number of user-submitted programs. In existing general-purpose OJ systems, the evaluation system usually determines the correctness of a user's program based on a given set of standard inputs and examines whether the standard output of the user's program meets expectations. However, for beginners in programming, it is more attractive to develop easier-to-use and intuitive Graphical User Interface (GUI) programs; these programs are also an important part of the software that people use every day. Although programs based on standard input and output form the basis of computer software systems, these programs are more oriented toward technical professionals. The trend toward the popularization of programming skills has created a greater need for education and popularization of the development of GUI programs. This thesis proposes a method for organizing and prototyping a OJ system judging GUI program. First, this OJ system is divided into several categories according to the programming language used to develop GUI programs, the construction process and the operation method. For each category, corresponding discriminative methods are designed. The prototype chose three basic categories: Web programs, C\# Windows Forms programs and Python turtle 2D graphics programs. Secondly, a universal syntax of judging rule description of the judging is designed, which can be used by teachers or competition organizers. The prototype chose a domain-specific language (DSL) description based on JavaScript AST, and provided a visualized rule-editing interface. Finally, a control system is formed to combine the rule interpreter, question controller, input/output system components and an appropriate end-user interaction interface. This thesis also discussed following topics in depth: the design of the user program compilation system, the security of the user program, the issues of multi-terminal parallel communication and industrial deployment, and the integration with existing OJ front-end systems.
]

#let enKeywords = ("programming design", "graphical user interface", "online programming", "online judge", "experimental teaching")

#let acknowledgements = [
  首先，我感谢邓习峰导师提供了这个选题，以及让我研究这类问题的机会。在理科为主、算法至上的北京大学教育氛围下，提出如此贴近现实环境、教育教学、工业生产的题目实在不容易。该题目也充分运用了我所擅长的软件工程、操作系统、编译原理相关的知识。

  感谢舍友#link("https://github.com/defensetongxue")[郭易]提供的图像识别算法思路；没有他的帮助，本论文可能要花更多的时间才能完善。

  感谢 #link("https://nodejs.org")[Node.js] 和 #link("https://www.python.org")[Python] 开发者提供的优秀的语言设计和开发框架。感谢以下开源第三方库的开发者：
  #link("https://pnpm.io/")[pnpm]、
  #link("https://babe.dev/")[Babel]、
  #link("https://www.fastify.io/")[Fastify]、
  #link("https://github.com/cthackers/adm-zip")[adm-zip]、
  #link("https://github.com/sindresorhus/get-port")[get-port]、
  #link("https://jayson.tedeh.net/4.0.0/")[jayson]、
  #link("https://nodemon.io/")[nodemon]、
  #link("https://github.com/raszi/node-tmp")[tmp]、
  #link("https://github.com/benjamingr/tmp-promise")[tmp-promise]、
  #link("https://github.com/dwmkerr/wait-port")[wait-port]、
  #link("https://rollupjs.org/")[Rollup]、
  #link("https://www.typescriptlang.org/")[TypeScript]、
  #link("https://github.com/FlaUI/FlaUI")[FlaUI]、
  #link("https://github.com/Astn/JSON-RPC.NET")[AustinHarris.JsonRpc]、
  #link("https://react.dev/")[React]、
  #link("https://allotment.mulberryhousesoftware.com/")[allotment]、
  #link("https://axios-http.com/")[axios]、
  #link("https://developers.google.com/blockly/")[Blockly]、
  #link("https://daisyui.com/")[DaisyUI]、
  #link("https://microsoft.github.io/monaco-editor/")[Monaco Editor]、
  #link("https://rxjs.dev/")[RxJS]、
  #link("https://postcss.org/")[PostCSS]、
  #link("https://tailwindcss.com/")[TailwindCSS]、
  #link("https://vitejs.dev/")[Vite]、
  #link("https://xmake.io/")[xmake]、
  #link("https://github.com/yhirose/cpp-httplib")[cpp-httplib]、
  #link("https://json.nlohmann.me/")[nlohmann_json]、
  #link("https://github.com/powturbo/Turbo-Base64/")[Turbo-Base64]、
  #link("https://boost.org/")[Boost]、
  #link("https://github.com/jsonrpcx/json-rpc-cxx")[json-rpc-cxx]、
  #link("https://github.com/okdshin/unique_resource")[okdshin/unique_resource]、
  #link("https://github.com/timocov/dts-bundle-generator")[dts-bundle-generator]、
  #link("https://github.com/esbuild-kit/tsx")[tsx]、
  #link("https://peggyjs.org/")[Peggy]、
  #link("https://github.com/isaacs/rimraf")[rimraf]、
  #link("https://definitelytyped.github.io/")[DefinitelyTyped] 和 
  #link("https://pptr.dev/")[Puppeteer]。本论文的实现离不开上述优秀的开源项目。

  感谢 Typst 项目的开发者，提供了如此易用的论文排版工具。感谢 GitHub 用户 #link("https://github.com/lucifer1004")[lucifer1004] 提供的基于 Typst 的北大学位论文模板。 

  感谢#link("https://www.microsoft.com/")[微软]主导开发的 #link("https://code.visualstudio.com/")[Visual Studio Code] 项目，让我能流畅舒服地完成编写代码、调试代码、编写论文等各个方面的工作。

  感谢舍友#link("https://github.com/zym401")[赵一鸣]四年的陪伴。
  
  感谢 OpenAI 的 #link("https://chat.openai.com")[ChatGPT] 和 GitHub 的 #link("https://github.com/features/copilot/")[Copilot] 提出一些有趣但不一定合适的回复，让我在编写代码或完成论文时多了一些灵感。

  感谢虚拟主播#link("https://space.bilibili.com/401480763")[真白花音]，在赶稿写代码的日子里用甜美的声音和温暖的歌声陪伴了我。感谢#link("https://www.mihoyo.com/")[米哈游]开发的 #link("https://ys.mihoyo.com/main/")[《原神》]游戏，极大程度地丰富了我的休息时间，让我能每天充满精力地完成论文工作。
]

#show: doc => conf(
  author: "谷雨",
  studentId: "1900012983",
  thesisName: "本科生毕业论文",
  header: "图形用户程序 OJ 技术研究",
  title: "图形用户界面程序 OJ 技术研究",
  enTitle: "Graphical User Interface Program OJ Technology Research",
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
  acknowledgements: acknowledgements,
  doc,
)

#let citation = box(fill: red, radius: 3pt, inset: 3pt)[
  #set text(fill: white)
  来源请求
]

= 引言

== OJ 系统简介

1970 年，德克萨斯 A & M 大学组织了第一次 ACM 国际大学生编程竞赛（ICPC），并为这场赛事设置了评测系统。随后这种赛制被大范围地推广，比如国际奥林匹克信息学竞赛（IOI）等诸多著名比赛都使用这样的评测系统来检查参赛选手的编程能力和算法运用能力。这种评测系统后来就被称作“在线评测”（Online Judge），简称 OJ。@Wasik2018 

OJ 的历史可以追溯到 1965 年斯坦福大学提出的自动评测程序系统。@Forsythe1965 在随后的数十年内，其发展迅速，许多大学、赛事机构、社会组织、教育机构都在建设自己的 OJ 系统。北京大学于 2005 年，为了促进北京大学竞赛队伍的竞争力，也开设了自己的 OJ 平台 POJ（全称 PKU JudgeOnline，中文名“北京大学程序在线评测系统”）。@Li2005 这类 OJ 平台可以给大量用户提供训练机会和学习机会，从而高效提升学生、选手的编程能力。 POJ 被视为中国境内最大的 OJ 平台。@Wasik2018

除了竞赛以外，OJ 系统也被用于计算机科学的教学工作。北京大学的老师们尝试将 POJ 平台用于《计算概论》《程序设计实习》等课程的教学中，比如在其中布置作业、考试等，以方便学生们完成编程的学习，也方便老师查看常见问题和错误。@Li2005 

传统 OJ 系统的工作流程如下所述：
- 教师或比赛组织者给定一个题目。题目的定义包括题目描述、输入输出格式、样例输入输出，和若干组输入输出数据（称为 _测试用例_ ）；
- 学生或选手将自己的程序代码提交到 OJ 系统；
- OJ 系统编译并运行学生的程序（称为 _用户程序_ ），以每组测试用例输入作为用户程序的标准输入，并记录用户程序的标准输出；
- OJ 系统比对标准输出与测试用例输出是否一致，以判断用户程序是否正确；
- 对于上述过程中遇到的系统异常，可能会得出超时（TLE，Time Limit Exceeded）、超内存（MLE、Memory Limit Exceeded）、运行时错误（RE、Runtime Error）等其它判题结果，通常也被视为用户程序的错误。@Li2005

#fix_id

Wasik 在 @Wasik2018 中以数学方式定义了宏观的 OJ 系统。在该数学定义下，OJ 系统的编译方式、判题方式和计分方式，均由自定义的算法决定。换句话说，系统管理员通常可以在这类 OJ 下自由地指定用户代码的编译方式或者上述判题流程。这种非传统的 OJ 系统也有所应用，如 UOJ（Universal OJ）。@vFleaking2014  UOJ 最典型的题目——quine，即通过检测程序输出与程序源码是否相同来得出判题结果。此外，卡内基·梅隆大学的 AutoLab 也可以算作一种非传统的 OJ 系统。@autolab2014

== 图形用户界面程序简介

_图形用户界面_（Graphical User Interface，GUI）是指采用图形方式显示的计算机操作用户界面。与早期计算机使用的命令行界面相比，除了降低用户的操作负担之外，对于新用户而言，图形界面对于用户来说在视觉上更易于接受，学习成本大幅下降，也让电脑的大众化得以实现。 @gui2021

图形用户界面可以是具体的、运行在某绘图环境中的图形界面，也可以是抽象的，运行在某高层次画布（如 HTML、WXML 等）及相关虚拟机平台的图形界面。这些图形界面通常由图形元素构成，比如按钮、文本框、下拉菜单等。

== 本文目标与结构

考虑到 OJ 系统在科班教学中的良好效应，若将其运用于 GUI 程序设计的教学中，则会显著提高 GUI 程序设计的学习效率。因此，本论文试图提出一种针对 GUI 的、非传统的 OJ 系统的构成，即将 OJ 系统的判题流程扩展到图形用户界面程序的判别上；下文称这种 OJ 系统为 GUI-OJ。此外，本文还实现了 GUI-OJ 的 _原型_ 系统（下文称 _原型项目_ 或 _本项目_），以验证 GUI-OJ 系统结构的可行性。原型项目支持 Web 程序等三种常见 GUI 程序的判题，并提供了较为易用的用户界面，供进一步测试和改进。

本文的结构如下：
- @packages 讨论了 GUI-OJ 软件系统的边界和组件划分问题；
- @categories 讨论了原型实现选择的题目分类，及对每个题目类别的判题方法讨论；
- @transpiler 讨论了规则描述语言的设计，以及原型的实现细节；
- @rdccs 讨论了联系规则描述系统、前端和判题后端的模块；
- @rtlib 讨论了规则描述系统中的运行时库的设计；
- @defdef 给出了一种定义规则描述系统更宏观抽象——DefDef 宏语言；
- @frontend 讨论了 GUI-OJ 在宏观意义下的前端设计；
- @security 讨论了 GUI-OJ 系统应考虑的安全性问题；
- @deployment 讨论了如何部署 GUI-OJ 系统以及与之相关的问题；
- @conclusion 总结了本论文的工作。

= GUI-OJ 系统组件与结构 <packages>

== 综述

GUI-OJ 的基本框架，简化后如 @fig_structure_easy 所示。

#figure(
  image("img/structure_easy.png"),
  caption: "GUI-OJ 系统简化后的基本框架",
) <fig_structure_easy>

GUI-OJ 系统的输入包括如下两部分：
- *用户程序*：以源码或者可执行文件的方式给出；
- *题目*：为了定义一个程序在某个题目下的正确性，需要以 *规则描述* 的形式给出题目的定义；若用户程序通过了规则所指定的判定，那么就视为是正确的；

#fix_id

GUI-OJ 系统的输出主要包括：
- *判题结果*：对于给定的用户程序和题目规则，返回该用户程序是否 _通过_。

#fix_id

以上输入输出部分为 GUI-OJ 软件系统的边界。若将 GUI-OJ 系统作为最终用户的后端（Backend），则与该系统边界交互的部分称为 _前端_。

接下来考虑 GUI-OJ 与传统 OJ 的不同点。GUI-OJ 的用户程序具有图形界面，而不同的图形界面程序的运行环境、运行方式都有很大的不同，因此判题规则也会随之变得多样化，无法基于传统 OJ 的输入输出模板实现；因此需要如下的组件设计。

== 判题规则描述系统

_判题规则描述系统_ 负责解析规则制订者提供的判题规则描述，是 GUI-OJ 相比传统 OJ 的独有模块。该规则描述通常是用户友好的，但其具有结构复杂、形式多样化的特点，因此需要单独模块将其解析成可供其它模块直接使用的数据结构。

在本文提出的原型项目中，该系统的用户端使用基于 JavaScript AST 的领域特定语言描述判题规则，并以 Blockly 可视化程序设计界面作为辅助，最终生成直接供 Node.js 运行的脚本。其实现细节将在 @transpiler 中讨论。

== 规则派发与通信控制系统和判题后端

虽然个人计算机上的图形用户界面在物理层面上大多是基于键盘、鼠标进行输入输出交互，但是大部分图形界面程序可以提供更高层次的抽象，如按钮、文本框等等。抽象层次的不同，也决定了程序设计方法的不同和程序功能的不同；在判题逻辑上，也需要做相应的分类讨论。

因此在结构上，需要有一个单独的系统负责将判题规则划分为若干 _类别_，从而每个类别内部的判题流程可以统一处理。本文称之为 _规则派发与通信控制系统_（后文简称 RDCCS，即 Rule Dispatch and Comm. Control System），该系统同时负责处理用户程序输入和判题结果的输出。对于每一个题目类别，提供对应的 _判题后端_ 以实现相应的判题流程。

原型项目使用 Node.js 作为该系统的实现框架；其实现细节将在 @rdccs 中讨论。综合考虑抽象层次和实际情况，本项目实现了三个判题后端：Web 程序、Windows 窗体程序和 Python turtle 2D 图形程序。
- Web 程序是抽象程度最高的图形界面程序；它的图形界面由 DOM（文档对象模型）组织，可以非常方便地使用浏览器相关 API 直接操作。
- Windows 窗体程序的抽象层次与 Web 类似，可以通过焦点控制、自动化测试等框架选中其中的可操作控件；但是产生提到操作本身仍然需要键盘和鼠标的事件模拟。
- Python turtle 2D 图形程序是最低层次的抽象，它只提供最简单的绘图功能。

#fix_id

上述判题后端的实现细节，以及其它分类的讨论将在 @categories 中给出。

== 前端

作为系统边界的前端的设计也是 GUI-OJ 系统需要考虑的问题。原型项目提供了供研究者测试用的 Web 前端用户界面，使用 React 框架实现。该实现细节，连同更宏观的生产环境前端设计，将在 @frontend 中讨论。

= 判题后端实现 <categories>

== Web 程序

Web 程序是当前互联网时代的最主流应用程序。它不仅应用在浏览器等传统 Web 环境中，也适用于桌面程序（Electron、Tauri 等）和移动程序（React Native、Flutter 等）。Web 程序通常使用 JavaScript 作为开发语言，并用 HTML 和 CSS 处理图形界面布局，但也可以使用 TypeScript、CoffeeScript、Dart 等语言开发。

原型项目先假定 Web 程序只运行在浏览器中（且是现代浏览器，即符合 W3C 最近五年规范的浏览器），从而简化问题的处理。在该假设下，只需要使用一个遵循规范的、可由程序控制的浏览器，如 Chromium，就可以实现对 Web 程序的判题。在此方面，原型采用了 Puppeteer 库 @puppeteer2023 ；该库可用于控制 Chromium 浏览器的行为，如加载页面、审查元素等等。Puppeteer 库提供了一个 Node.js 的 API，因此可以直接在 Node.js 环境中使用。稍后 @rdccs 所呈现的控制系统也在 Node.js 环境中运行，因此 Web 端的判题控制会相对容易很多。

另一方面，判题后端还需要将 Web 程序呈现在网页上。目前阶段先假定判题后端接收到的是一系列静态网页素材，那么浏览器可以有两种方式加载这些素材：
- 通过 HTTP 服务器加载；
- 通过本地文件系统协议（`file://`）加载。

#fix_id

由于本地文件系统协议的跨域访问通常是被禁止的 @cors2023 ，尽管性能更优，但许多 JavaScript 功能无法正常运行。为了尽可能模拟生产环境下 Web 程序的运作，本项目选择前者，即在本地启动一个轻量的 HTTP 服务器 —— Fastify 库 @fastify2023。它是 Node.js 环境下的新型 HTTP 服务端库，相比传统的 Express 等库综合性能更佳。

对于网页中的特定元素选择，可直接使用 CSS 选择器语法。它在 Chromium 浏览器开发者工具内受支持，且在 JavaScript 中也有对应的 API。

#figure(
  image("img/structure_web.png", width: 80%),
  caption: "Web 程序判题后端结构",
) <fig_structure_web>

@fig_structure_web 展示了上述 Web 端判题程序的模块结构。

该判题后端支持如下动作：
- 页面中特定 DOM 元素的点击；
- 页面中特定 DOM 输入元素的输入；
- 发送键盘按键。

及如下属性的读取：
- 页面标题；
- 页面中特定 DOM 元素的文本内容；
- 页面中特定 DOM 元素的 HTML 内容；
- 页面中特定 DOM 元素的特性（Attribute）值；
- 页面中特定 DOM 元素的计算后 CSS 样式。

以上功能基本覆盖了简单的 Web 程序测试需要。

== Windows 窗体程序

Windows 窗体（Windows Form）程序，是 Windows 平台上基于窗口的最经典的开发环境。它底层上是 MFC（微软基础类库，Microsoft Foundation Class）的封装，提供了一组基于 Win32 窗体控件的开发接口。Windows 窗体可以用 C\#、VB.NET、C++ 等语言开发。

Windows 窗体程序由控件（Control）组成，每个控件都有其独立的句柄。因此，判题后端可以通过获取一个 Windows 窗体程序的控件树，根据需要选定其中控件的句柄，然后基于句柄进行操作。

从 Windows 95 开始，系统便内置了可供程序操作的操作系统接口，其名为 Microsoft Active Accessibility（MSAA） @msaa2020。MSAA 为 Windows 窗体程序提供了一套标准的、可供程序访问的接口，包括控件树的获取、控件属性的获取、控件操作的执行等等。MSAA 也是早期 Windows 窗体程序的无障碍访问渠道，因此，任何一个 Windows 窗体程序都支持 MSAA （但非 Windows 窗体的程序，即“自绘窗体”，仍然使用起来有不便之处）。在随后的数十年内，该功能逐步升级为 UI Automation（UIA），以 C\# 和 C++ 的形式提供接口。 @uia2020

原型项目选用 FlaUI 库调用 UIA @flaui2022， C\# 11 编程语言和 .NET 7 运行时，以最大化开发效率和目标运行效率。

#figure(
  image("img/structure_form.png", width: 70%),
  caption: "Windows 窗体程序判题后端结构",
) <fig_structure_form>

不同于 DOM，Windows 窗体控件树没有一个合适的控件选择语法。因此原型项目提供了如下选择方式：
- 基于文本的选择：给定按钮文本、标签文本或文本框的文本，然后查找所有空间中符合文本或包含文本的控件。
- 基于 `automationId` 的选择：在 UIA 中，每个元素拥有其独立标识 `automationId`；在未经优化的 C\# Windows 窗体程序中，该名称等价于控件的名称（`Name` 属性）。因此，若规则制订者限制用户程序的编写方法，则可以通过 `automationId` 来选择某一特定控件。但是，对于没有限制的程序，这不是一个合适的手段。
- 基于文本及其周边空间的查找来选择：在窗体程序中，一个常见的模式为“标签+文本框”/* （如 @img_???） */；即在对标签进行基于文本的严格查找后，划定其坐标周围的范围，来查找其附近文本框。这种方式通用性相比前两种更弱，但是在大多数场合更常用。

#fix_id

@fig_structure_form 展示了上述 Windows 窗体程序判题后端的模块结构。

该判题后端支持如下动作：
- 点击按钮；
- 切换单选框（Radio Button）、复选框（Check Box）；
- 设置文本框的文本；
- 设置组合框（Combo Box）的选项；

及如下属性的读取：
- 窗体标题；
- 控件文本；
- 空间的启用性。

以上功能基本覆盖了简单的 Windows 窗体程序的测试需要。

== Python turtle 2D 图形程序

Python 是当前最流行的编程语言，也是非专业计算机学习者最常用的编程语言。Python `turtle` 是 Python 的一个标准库，其提供了一个简单的绘图接口，可以用来绘制 2D 图形。

`turtle` 库的设计来源于 Logo 编程语言的绘图库。@turtle2023 该绘图库假想一只带着画笔的海龟可以接受简单的命令，例如向前走 60 步，或者左转 45 度；进一步绘制出较为复杂的图形，例如正方形，三角形，圆等。@Goldman2004 Python 的 `turtle` 库提供若干全局函数，以实现类似 Logo 绘图的命令式接口；同时，它也提供面向对象的接口，以实现更高精细度的绘图控制。@turtle2023

对于这类程序的判别，需要考虑如下问题：
+ 作为解释型语言，需要提供合适的解释器即运行环境；
+ 限制用户程序可能影响判题的操作，如调整绘图速度、创建多个窗口等；
+ 一个合适的 2D 绘图正确性判定方法。

#fix_id

对于第一个问题，原型项目选择了 Python 3.11 并创建虚拟环境以免本机其它依赖库的干扰。对于第二个问题，可以使用打桩技术（Interposition）来限制 `turtle` 标准库的行为；即通过 `importlib` 控制导入库的行为，从而将 `turtle` 标准库的导入重定向到一个 GUI-OJ 系统内的、受限制的“伪” `turtle` 库即可。

对于第三个问题，在本论文提出的设计思路中，将使用一个专门针对教学用 2D 绘图的图像比对算法，将用户程序产生的图像与标准图像进行比对，得到相似率，并以某个阈值作为判定标准。该算法将在 @rtlib 中展开描述。

同时，该判题后端需要模拟键盘事件和鼠标事件，以发送给用户程序，观察其变化。该判题后端需要实现窗体的“截图”功能，以便于进行图像比对。由于上述操作接近 Windows 系统底层，故该判题后端使用 C++ 实现。

#figure(
  image("img/structure_turtle.png", width: 80%),
  caption: "Python turtle 2D 图形程序判题后端结构",
) <fig_structure_turtle>

@fig_structure_turtle 展示了上述判题后端的模块结构。

该判题后端支持如下动作：
- 发送点击事件；
- 发送按键事件；

及如下属性的读取：
- 窗体标题； // 还没有做，可能是忘了
- 窗体截图。

#fix_id

由于 2D 绘图程序本身的特性，该判题后端的功能较简洁，必须依赖于规则制订者提供详细的判题规则。

== 其它程序类别与跨平台问题

可在 Windows 下运行的其它窗体程序，也可以有选择地接入到上述判题后端。对于含有控件树的窗体（不限于 C\# Windows 窗体，包括 MFC、Qt、TKinter、WPF、WinUI 3 或 MAUI 等开发流程），可以直接接入“Windows 窗体程序”判题后端，但是不能直接使用 `automationId` 。对于“自绘窗体”，则可以使用类似“Python turtle 2D 绘图程序”判题后端的思路，但是需要在细节上做更多工作。

对于 Electron 或 Tauri 等基于 Web 界面的程序，可以直接基于 Web 程序判题后端，并进行适合性调整：如直接启动程序而非额外的 HTTP 服务器；使用 Puppeteer 时将 Chromium 指定为 Electron 内的 Chromium 或系统的 WebView 等。

非 Windows 的 GUI 程序的处理是有困难的。非 Windows 系统上，GUI 程序的实现多种多样：既可以直接使用 Wayland 或 X @wayland2018；也可以使用 GTK、Qt 等跨平台的 GUI 库。这些程序通常需要针对性地设计判题后端，没有很好的统一处理方法。本项目对非 Windows 的 GUI 程序暂时不做考虑。

= 判题规则实现 <transpiler>

== 现状考察及设计方向

传统 OJ 通过给定若干组测试输入输出样例来判定用户程序的正确性。但是 GUI 程序并不适用于文本形式的标准输入输出。因此，GUI-OJ 需要设计一种新的判题规则描述方式。

非传统的 OJ 如基于自定义规则的 AutoLab，使用了规约式的设计方法：要求规则制订者提供一个程序（或脚本），对于给定的用户程序，输出其得分。@autolab2023 这种方式的优点是灵活性高，可以适应各种各样的题目类型，但不适合应用于 GUI-OJ：规则制订者需要极高的编程能力，且必须对 GUI 程序十分熟悉，以给出各种细节的判定规则。

#figure(
  image("img/rule_concept.png"),
  caption: "GUI-OJ 规则概念与结构",
) <fig_rule_concept>

因此在 GUI-OJ 中需要设计一个简单易用的规则描述方法，在支持高精细度的控制的同时，不要求教师对 GUI 程序的细节有所了解。为此，GUI-OJ 使用代码作为规则描述，而非可视化的选项或表单界面。为平滑代码描述的学习曲线，可以通过一些前端的额外模块，实现从可视化界面到代码的转换；从而在一些简单的题目中，提供更易用的规则制订方式（在 @frontend 中讨论）。

该代码将指明一系列 _测试用例_。每个测试用例应当指明一个测试流程，即若干个按顺序执行的 _测试步骤_。测试步骤分为两个类别：_执行步骤_ 和 _判定步骤_。执行步骤将模拟用户操作，判定步骤将判定用户程序的输出是否符合预期。若用户程序成功执行了所有的执行步骤，且判定步骤的结果也符合规定，那么就视用户程序通过了这个用例。将所有用例的判定结果结合在一起，即可按照通用 OJ 的方式（如 ACM 风格、OI 风格）给出整个用户程序的成绩。上述规则的组织和解析方式如 @fig_rule_concept 所示。

== 基于现有编程语言的设计

充分利用已有的库，是软件设计的一大原则，即“不重复造轮子”。@Kemper2005 因此本文首先考察基于已有编程语言设计规则描述的方式是否可行。

观察到规则描述与单元测试用例的编写方式有一定相似性。受其启发，规则制订者可以编写类似 @code_js_rule 的规则代码。

#codeblock([
```js
// 含义：
// - 期望页面标题包含 "Hello, world"；
// - 点击页面中的按钮；
// - 期望页面中有一个 h1 元素，其内容为 "Hello, world!"。
test("case 0", (page) => {
    expect(page).toHaveTitle("Hello, world");
    page.click("button");
    expect(page.locator("h1")).toEqual("Hello, world!");
});
```],
  caption: "基于 JavaScript 的规则代码形式",
  outline: true
) <code_js_rule>

在这种编写方式下，只需给出合适的 `test` 和 `expect` 定义，即可以直接执行该代码的方式完成评测。但是这种方式的缺在于：写法冗繁复杂，需要用到箭头表达式等特性；`toEqual` 等方法名不如 `==` 运算符直观；容易增加拼写错误的可能。因此本文没有选用这种定义方式。

== 基于全新 DSL 的设计

因为现有语言本身的语法特性限制了规则的编写，可以考虑自行设计一种领域特定语言，以实现更加简洁的规则描述方式。一种可行的方案如 @code_dsl_rule 所示。

#codeblock([
```
test {
    assert title in "Hello, world";
    click $button;
    assert $h1 == "Hello, world!";
}
```],
  caption: "基于某种 DSL 的规则代码形式",
  outline: true
) <code_dsl_rule>

由于 DSL 的结构是完全自定义的，因此可以引入更多的关键字或语法形式。比如，语言可以定义 `assert` 关键字来代替原先复杂的 `expect` 函数；直接用 `==` 等比较运算符作为测试步骤，用 `$` 符号来引入选择器等等。这种方式的优点在于，一定程度上减轻了规则编写者的学习成本和编写成本，同时也可以更加灵活地定义规则。但是，其缺点在于 GUI-OJ 开发者需要编写一个完整的语言解析器，以将 DSL 解释或者转换为某种可执行的代码形式。解析器的编写成本可能会很高，且难以保证其正确性或通用性。出于成本的考量，原型项目中没有使用完整的 DSL，但可以考虑在之后的版本引入。

== 基于已有 AST 的 DSL 设计

考虑到 DSL 的编写成本，本文考虑使用已有的编程语言的抽象语法树（Abstract Syntax Tree, AST）来实现 DSL 的解析。这样做可以通过直接使用已有的编译器前端来解析 DSL 而无需自行编写解析器，从而减少开发成本。在得到 AST 后，再对其进行树的遍历算法，进行代码生成或规则执行等操作。

本原型实现使用了 JavaScript AST，因为 JavaScript 具有统一的 AST 格式 ESTree @estree2022，且有众多的解析器支持（如 Acorn、Babel、ESLint、SWC 等等），生态颇为成熟。原型实现使用了 Babel 作为解析器，并以 Babel 插件的形式给出具体的解析方法，最终产生可执行的 JavaScript 代码。一个具体的规则代码示例如 @code_ast_rule 所示。

#codeblock([
```js
"use web";
{
    assert: $.title in "Hello, world";
    $("button").click();
    assert: $("h1").text == "Hello, world!";
}

```],
  caption: "基于 JavaScript AST 设计的 DSL 的规则代码",
  outline: true
) <code_ast_rule>

这种 DSL 设计方式虽然略微提升了规则编写者的编码复杂度，但是其编写成本大幅降低，且可以比较轻松地扩展到更多判题后端。该 DSL 的文法限制为 JavaScript 的一个子集，具体结构如下：

#pad(left: 2em)[
  #show emph: it => {
    set text(font: 字体.楷体, style: "italic")
    it.body
    h(5pt)
  }
  _RuleModule_ `::` \
  #h(2em) _RuleCategoryDirective_ _RuleCases_ \
  _RuleCategoryDirective_ `::` \
  #h(2em) `"use` _RuleCategory_ `";` \
  _RuleCategory_ `::` \
  #h(2em) `web` \
  #h(2em) `form` \
  #h(2em) `graphics.turtle` \
  _RuleCases_ `::` \
  #h(2em) _RuleCase_ \
  #h(2em) _RuleCases_ _RuleCase_ \
  _RuleCase_ `::` \
  #h(2em) _ImportDeclaration_ \
  #h(2em) _LexicalDeclaration_ \
  #h(2em) _Block_
]

其中，_ImportDeclaration_、_LexicalDeclaration_ 和 _Block_ 的定义参见 ECMAScript 2023 标准 @ecmascript2023。

该 DSL 主要由 _RuleCategoryDirective_ 和若干个 _RuleCase_ 构成；前者指代判题类别（@categories），后者中的每个 _Block_ 则指代一个测试用例的具体流程。（_ImportDeclaration_ 见 @rtlib，_LexicalDeclaration_ 见 @frontend。）

在流程中，每条语句都会作为测试步骤解释执行；若该语句为 _LabelledStatement_ 且 _LabelIdentifier_ 为 `assert`，那么就将其解释为判定步骤；否则解释为操作步骤。判定步骤要求其 _Statement_ 为 _ExpressionStatement_，进一步求值并检查结果是否为实值（truthy），来得到判定结果。操作步骤则直接执行其 _Statement_。

规则代码使用 _后端操纵对象_ 与判题后端交互。@code_ast_rule 中的 `$` 即为 `web` 类别的后端操纵对象。它的若干方法如 `title`、`click`、`text` 等，会被 RDCCS 转换为发送给判题后端的交互命令，并返回后端的响应。不同的判题后端提供不同的功能，因此每个判题后端都有其对应的后端操纵对象。该对象的定义在原型实现中由 DefDef 宏语言生成，详见 @defdef。

规则描述系统将该代码输入分析为 AST 后，会做如下操作（如 @fig_structure_transpiler 所示）：
+ 校验规则代码是否符合上述定义；
+ 将 _RuleCategoryDirective_ 转换为控制判题类别的语句；
+ 将每一个 _RuleCase_ 转换为函数（类似 @code_js_rule 中的形式），并注册到相关的控制对象中；
+ 引入后端操纵对象，并将相关代码转换为发送交互命令的语句。

#fix_id

随后，该转换后代码即可直接由 RDCCS 解释执行。

#figure(
  image("img/structure_transpiler.png"),
  caption: "规则描述系统图示",
) <fig_structure_transpiler>

= 规则派发与通信控制系统 <rdccs>

== RDCCS 综述

本章解释 RDCCS 的实现。综合 @packages、@categories 与 @transpiler 的讨论，可得出 RDCCS 要实现的功能如下：
- 接受来自前端的请求，决定何时开始工作；
- 以特定的控制方式，执行规则描述系统输出的规则代码；
- 根据规则代码指明的判题类别，启动对应的判题后端；
- 对规则代码中的每个后端操纵命令，派发相应的命令到判题后端；
- 每次判题结束时，产生对应的结果，将结果返回给前端。

#fix_id

下文将根据 RDCCS 的主要两个通信客体（模块）：判题后端与前端，来讨论相关的实现细节。其基本模块划分如 @fig_structure_rdccs 所示。

#figure(
  image("img/structure_rdccs.png"),
  caption: "RDCCS 结构图",
) <fig_structure_rdccs>

== 与判题后端的通信 <ipc>

现考虑 RDCCS 已经拿到一个用户程序和一个判题规则（经规则描述系统处理后）。那么，RDCCS 需要执行判题规则所指定的行为，并将其中涉及后端操纵对象的代码转换为对后端的通信操作。这一过程需要讨论如何与判题后端进行有效、可靠的通信。

首先对需求进行分析。该跨进程通信是单方面（RDCCS）发起的，而非双向主动通信，因此可以用一个半双工通信信道解决问题。考虑到判题后端的独立性，其必然以进程为基本单位，故两者的通信是跨进程的（Inter-Process Communication, IPC）。跨进程通信在最底层可以基于管道（Pipe）、套接字（Socket）等操作系统设施，但是在实际使用中需要更高层的抽象以简化开发的复杂度。因此，原型项目选择了基于 HTTP 及 JSON-RPC 的通信方案。

JSON-RPC 是基于 JSON 的一个远程过程调用（Remote Procedure Call, RPC）协议。它的基本思想是，将函数调用转换为 JSON 对象，以 HTTP 请求、TCP 请求或管道的形式发送给服务端，服务端执行相应的操作，并将结果以 JSON 对象的形式返回给客户端。JSON-RPC 在 C++、Python、C\# 语言有第三方库提供包装，为本项目的编程工作提供便利。@jsonrpc2013

与判题后端通信的具体的流程如下。判题开始前，RDCCS 获取一个空闲的 TCP 端口号，并以该端口号作为启动参数启动判题后端。判题后端需要作为服务端监听该端口号上的 TCP 请求。当 RDCCS 检测到该端口号被监听后，即可开始判题流程。当 RDCCS 遇到后端操纵对象的操作时，会将该操作转换为 JSON-RPC 请求，并以 HTTP POST 请求形式发送给判题后端。判题后端收到请求后，会执行相应的操作，并将结果按 JSON-RPC 的约定返回给 RDCCS。类似地，当测试用例结束或者判题流程结束时，RDCCS 会向判题后端发送相应的通知或请求，以结束或开始新的判题操作。

在原型实现中，上述转换过程是由规则描述系统完成的；即将后端操纵对象的方法改写为 JSON-RPC 中的 JSON 对象的发送操作。该转换的信息则是由 DefDef（@defdef）提供的。判题后端对各个 JSON-RPC 的响应则需要手动维护。

== 与前端的通信 <backend-frontend>

由于前端的多样性，与前端通信的方法也不尽相同。原型实现中的前端为简单 Web 项目，因此采用 HTTP 作为通信方法。

原型中提供的通信数据包括：开始判题时的判题规则和用户程序、判题过程中的判题结果和判题结束得到的判题结果。前者是由前端主动发起的，后两者则是由 RDCCS 主动发起的，因此该通信的最佳实践应当为双端主动通信；信道选择上应为全双工的。在 HTTP 及更高层次的通信协议中，WebSocket 最为适合。@websockets2023 原型项目中出于项目复杂度的考虑，没有使用 WebSocket，而是直接使用基于简单 HTTP 的客户端轮询；相关的优劣讨论将在 @frontend 中讨论。

按照上述分析，原型中的 RDCCS 接受来自前端的如下请求：
- `POST /judge`：提交一个判题请求。请求体为 JSON 对象，包含判题规则和用户程序的信息。RDCCS 先分配一个判题请求 ID 并返回给前端，并启动新协程调用规则描述系统，然后执行 @ipc 所述通信流程。
- `GET /judgeStatus/:id`：查询一个判题请求的状态，其中 `:id` 为判题请求的 ID。前端通过定期轮询来获取判题结果。

#fix_id

= 运行时库与图像比对算法 <rtlib>

== 运行时库的必要性

相比 Python 等编程语言，作为规则描述底层的 JavaScript 语言没有足够多的标准库设施。例如，出于历史原因，JavaScript 没有提供合适、完备的字符串类型与数型数据相互转换的方法。而 @transpiler 强调作为规则描述的首要目的是减少规则编写者的学习成本，因此在设计规则描述系统时，需要引入必要的额外机制来补充语言的缺陷。

GUI-OJ 软件系统选择使用 _运行时库_（Runtime Library）概念来解决这一问题。运行时库是一组函数的集合，它们可以被规则描述者直接调用，以完成一些常见的操作如：字符串与数型数据的相互转换、简单的系统功能调用、图像比对等。运行时库的实现是由规则描述系统提供的，因此规则描述者可以直接调用运行时库中的函数，而无需关心其实现细节。

== 图像比对算法综述

下文将重点阐述图像比对功能。因为 GUI-OJ 的图像比对的目标是判别用户 2D 图形程序所产生的图像是否接近于标准图像；它与计算机视觉、人工智能领域所述的图像比对目标有一定差距。在 2D 图形程序中，没有明确的具名目标（如人物、车辆、水果等），取而代之的是构造简单、轮廓分明的几何图形（如正方形、圆等）。因此，基于通用的物品识别算法难以正常工作。

其次，传统图像相似度/差异度算法如 MSE 或 SSIM，则是针对图片整体的色彩或特征，而不是针对图像中的特定物体。2D 图形程序中的图像可能由多个图形构成的，因此整体的色彩或特征并不能反映出图像中的物体的差异。例如，题目标准图像由若干色彩各异的几何图形得到，而学生程序的图形位置、色彩、形状均有较大差异时，MSE 或 SSIM 在整体上得到的性质是趋同的。很显然这种程序在判题上应当不予通过。

最后考虑平凡的算法，即使用逐像素比对的简单算法。但这也有困难：学生可能提交的程序有轻微色差，或者位置上有小程度偏移，或者旋转角度不合适；但这些在教学领域上是可以被接受的误差。逐像素比对对于上述差异接受程度很低，因此不适用。

因此综上所述，本文针对 GUI-OJ 中所需的图像比对需求，设计了一种特殊的、专用的算法。

== GUI-OJ 图像比对算法

该算法的核心思想是：先提取画布中的所有可视元素，对每个元素的整体形状做分析，然后对元素之间的关系、以及背景相关性做分析，最后综合上述因素给出总体的相似度指标。因此，该算法分为如下三个步骤。 

*记号约定* 在本章的剩余部分，以加粗斜体字母如 $bold(X)$ 表示图像，其本质为三维张量，维数为长像素数、宽像素数和通道数。为方便数学描述，其取值总是在 $[0, 1)$ 之间。在 GUI-OJ 工作时，会截取 _用户程序图像_ 并与 _标准图像_ 进行比对。在不引起歧义的情况下，$bold(A)$ 表示标准图像，$bold(B)$ 表示用户程序图像。

*步骤 1* 提取画布中的可视元素。该步骤的具体实现是通过边缘检测算法检测到图像中的所有边缘，进行降采样后，边缘所围起的闭合区域即为一个可视元素。

规定数学记号如下。记 $cal(C)(bold(X))$ 为图像 $bold(X)$ 的轮廓构成的集合。记 $cal(L)_(bold(X)) = abs(cal(C)(bold(X)))$ 为图像 $bold(X)$ 的轮廓的个数。

随后，统计用户程序图像和标准图像的元素个数差异，依此计算 _计数相似度_ $d_N$。其计算方式为：

$ d_N(bold(A), bold(B)) = abs(cal(L)_(bold(A)) - cal(L)_(bold(B))) / (1 - cal(L)_(bold(A))) $

#fix_id

*步骤 2* 将两张图片的元素进行配对，并计算每对可视元素之间的内在差异。

将 $cal(C)(bold(A))$ 与 $cal(C)(bold(B))$ 的元素按面积从大到小排列，取前 $min(cal(L)_(bold(A)), cal(L)_(bold(B)))$ 个，将这样两组序列转置为二元数对的序列，记为 $cal(U C)(bold(A), bold(B))$，称之为 $bold(A)$ 和 $bold(B)$ 的 _联合轮廓_ 。

首先，比较每个轮廓形状的相似度。以下是 _轮廓相似度_ $d_S$ 的计算方法，核心部分用 HuMoment 算法给出：

$ d_S(bold(A), bold(B)) = sum_((a, b) in cal(U C)(bold(A), bold(B))) S(a) / (sum_(bold(A)) S) (1 - (op("Hu")(a, b)) / 8) $

其中 $sum_(bold(A)) S$ 为 $cal(U C)(bold(A), bold(B))$ 中位于 $bold(A)$ 的轮廓的面积的和。

随后，比较每个轮廓内部图像的相似度；此时，直接简单地套用 SSIM 算法即可。以下是 _图像相似度_ $d_I$ 的计算方法。

$ d_I(bold(A), bold(B)) = sum_((a, b) in cal(U C)(bold(A), bold(B))) S(a) / (sum_(bold(A)) S) op("SSIM")(bold(A)[a], bold(B)[b]) $

#fix_id

再次，对于每个轮廓之间的相对位置，比较两个图像的相似度。定义轮廓的 $c$ 的重心为 $M(c)$；对于轮廓集合 $C$，定义距离矩阵 $bold(Delta)_C = { delta_(i j) }$，其中 $delta_(i j) = abs(M(c_i) - M(c_j))$，$c_i, c_j in C$。

两个图像的 _相对位置相似度_ $d_R$ 分情况以下式定义：

$ d_R(bold(A), bold(B)) = cases(
  1 "                            ," abs( cal(U C)(bold(A), bold(B))) <= 1,
  abs(delta_(12,bold(A)) - delta_(12,bold(B))) / max(delta_(12,bold(A)), delta_(12,bold(B))) "              ," abs( cal(U C)(bold(A), bold(B))) = 2,
  op("Mantel")(bold(Delta)_(cal(C)(bold(A))), bold(Delta)_(cal(C)(bold(B)))) " otherwise"
) $

#fix_id

若联合轮廓只有一个元素，那么不考虑相对位置相似度（即设为 $1$）。只有两个元素时，以两个元素之间距离的差作为相似度。三个及以上元素时，使用 Mantel 测试算法判断相似程度，该算法常在生态学研究上用于判断环境效应是否存在。@Mantel1967

最后考察背景部分的相似程度。考虑到 2D 图形界面程序的简单性，此处只判断颜色的相似程度即颜色差。

记图像 $bold(X)$ 的背景部分，即去除所有轮廓的内含之后的剩余像素点集合为 $beta_(bold(X))=bold(X) - limits(union)_(c in cal(C)(bold(X))) integral_c$。记该像素点集的红通道、绿通道和蓝通道的平均值为 $R_beta_(bold(X))$、$G_beta_(bold(X))$ 和 $B_beta_(bold(X))$。记通道 $I$ 的颜色差 $Delta_I = I_beta_(bold(A)) - I_beta_(bold(B))$。

则 _背景颜色相似度_ $d_B$ 的定义由下式给出；它根据人眼对三原色的敏感度做了权重调整。@colour2019

$ d_B(bold(A), bold(B)) = cases(
  sqrt(2 Delta_R^2 + 4 Delta_G^2 + 3 Delta_B^2) "," macron(R) < 1 / 2,
  sqrt(3 Delta_R^2 + 4 Delta_G^2 + 2 Delta_B^2) "," macron(R) >= 1 / 2,
) $

其中 $macron(R) = 1/2 (R_beta_(bold(A)) + R_beta_(bold(B)))$。

*步骤 3* 综合步骤 2 分元素得到的 $d_N$、$d_S$、$d_I$、$d_R$ 和 $d_B$，给出整体图像相似度的公式如下：

$ op("Diff") (bold(A), bold(B)) = (1 - d_N) dot.op (w_S f(d_S) + w_I f(d_I) + w_R d_R + w_B d_B) $

其中 $w_S$、$w_I$、$w_R$ 和 $w_B$ 为权重参数，在原型中取值分别为 $0.3$、$0.3$、$0.2$ 和 $0.2$。$f$ 为非线性调整函数；当图像比较相似时 $d_S$ 和 $d_I$ 差异过小，不适合判题。$f(x)$ 在原型中取值为 $x^6$。

== 图像比对算法效果示例

#figure(
  caption: "图像比对算法效果示例",
  table(
    columns: (auto, 1fr, 1fr, auto),
    inset: 10pt,
    align: horizon + center,
    [*描述*], [*标准图像*], [*用户程序图像*], [*相似度*],
    "位置偏移", image("img/cmp/sun-std.png"), image("img/cmp/sun-offset.png"), "0.999",
    "相似形状", image("img/cmp/sun-std.png"), image("img/cmp/sun-less.png"), "0.957",
    "背景不同", image("img/cmp/sun-std.png"), image("img/cmp/sun-bg.png"), "0.789",
    "形状错乱", image("img/cmp/3shape-std.png"), image("img/cmp/3shape-wp.png"), "0.774",
    "颜色错乱", image("img/cmp/3shape-std.png"), image("img/cmp/3shape-wc.png"), "0.700",
    "相对位置不均", image("img/cmp/4pt-std.png"), image("img/cmp/4pt-miss.png"), "0.994",
    "元素缺失", image("img/cmp/4pt-std.png"), image("img/cmp/4pt-3.png"), "0.715",
  )
) <table_cmp>

从 @table_cmp 可以观察出，算法在“看上去相似”的图片组下，可以给出较高的相似度；而对于颜色、形状差异较大的图片组，相似度较低。通过给定合适的阈值，该算法基本可以满足相关的判题需求。

== 图像比对算法的缺陷与改进

在设计算法时，刻意地忽略了元素的平移效应，因为用户程序不太可能完美复刻标准图像中的具体位置。但是，元素大小和元素的旋转却没有得到考虑。这也是上述算法的两个严重问题。

在处理元素大小时，相同大小的元素容易出现匹配联合轮廓时的错误匹配。解决方法：在比较大小时保留一定阈值，在接近阈值范围内的元素使用基于相对位置的匹配。

在处理元素旋转时，由于采用了 Hu-矩比较轮廓形状，因此旋转因素被忽略。这导致判题程序将认为旋转过的元素也是正确的，这不符合预期结果。解决方法：改用不使用 Hu-矩的轮廓比较算法，目前还需要进一步调研。

== 运行时库的部署与改进

运行时库是为了补足规则描述系统采用的 DSL 的不足而设计的，故它被设计为嵌入规则描述系统。

在原型实现的 DSL 中，引入了 JavaScript 的 _ImportDeclaration_，即导入声明；若该声明来自某个特定的模块标识符（在原型中为 `graduate`），则将其解释为对运行时库中实体的导入。实现上，只需在 Babel 转译过程中将该标识符翻译为运行时库 JavaScript 模块的路径即可。

对于如图像相似度算法等非 JS 实现的程序，则通过 Node.js `child_process` 模块启动 Python 解释器执行。这会导致响应速度降低及性能瓶颈，但目前系统的功能较为简单，因而暂时忽略此问题。后续可考虑改为基于 C 接口的 FFI 调用。

此外，部分运行时库接口的设计不合理，如读取图片数据需要从第三方 URL 加载等等。这些设计需要配合整体系统部署和前端实现来改进。

= 宏语言 DefDef <defdef>

本章讨论专为 GUI-OJ 设计的一种宏性质 DSL——DefDef。

GUI-OJ 与传统 OJ 的最大不同点即在于不同判题后端提供功能各异的图形界面判题功能。DefDef（可认为是 Definition-of-the-Definition 的缩写，即“判题功能定义的定义”）以宏语言的方式，提供了在不同的系统模块中组织这些功能的能力。

在 @packages 所述的系统模块结构中，涉及判题功能列表的模块有：
- 判题后端：需要作为 JSON-RPC 服务端，给出判题功能的具体实现；
- RDCCS：需要将各项判题功能描述作为 JSON-RPC 请求转发给判题后端；
- 判题规则描述系统：需要将规则描述转换为对应的 JSON-RPC 请求格式；
- 前端：需要生成相关的智能提示、可视化编辑信息等。

上述四个组件都或多或少需要用到判题功能的信息，若分开管理它们，则难以同步、更新迭代。因此 DefDef 提供了这样的管理方法：编写一份 DefDef 源码，通过 DefDef 转译器生成上述各个模块所需要的格式的信息，从而实现统一管理。

DefDef 使用解析表达文法（Parsing Expression Grammar，PEG）作为文法格式。它相比传统的上下文无关文法（Context Free Grammar，CFG）更加简洁，且可以直接转换为递归下降解析器。出于篇幅的原因，此处不列出完整的 DefDef 文法定义；但可以从一个 DefDef 的示例来了解它的基本结构。

#codeblock([

```
using web;

[[description = "Get the count of elements matching the selector.", blockly = "count of $(selector=#id)"]]
define $(selector: string).count: number
  => selector with { component: "count" }

using form;

[[description = "Get form title.", blockly = "form's title"]]
define win.title: string
  => title
```
],
  caption: [`sample.dd`，原型实现 DefDef 的一部分],
  outline: true
) <code_defdef_sample>

DefDef 的设计借鉴了 C/C++、TypeScript 和 Rust。它的语法简单，目前只有三个关键字 `using` `define` 和 `with`。其中 `using` 用于表明判题类别，`define` 用于标记规则代码形式，`with` 用来标记 JSON-RPC 的请求参数格式。

DefDef 的基本结构是若干定义，对应于一项判题后端的功能。每个定义由三部分组成：
- 特性（Attributes，可选）：用于描述该定义的特性，如描述、可视化编辑信息等；
- 规则代码形式：在规则代码中使用后端操纵对象的形式，如 `$("...").count`，带有类型信息；
- JSON-RPC 请求格式：用于描述该功能对应的 JSON-RPC 请求格式。

#fix_id

DefDef 的规则代码形式采用“链式调用”格式，即函数调用运算符和成员访问运算符的结合；该写法自由度较高，且适用于大多数场景。比如 @code_defdef_sample 中的 `$(selector: string).count` 规则形式就表明规则代码中的 `$("button").count` 代码指代一个后端操纵命令，其对应的 JSON-RPC 请求方法名为 `selector`，附加参数为 `component: "count"`。

GUI-OJ 的规则代码形式秉持着直观、易用的原则；如上述规则形式中的 `$` 操纵对象就来自于常用的 jQuery 库的选择器；又如 `win.title` 规则形式中的 `win` 就指代 Windows 窗口。

每个规则的额外信息可以通过特性或者特性内部的子语法来描述。如 `blockly` 特性代表前端可视化编辑器的相关工具定义；其内部的 `#` 占位符子语法用来标记该工具定义的接口。

此外，DefDef 可以通过预处理命令嵌入其它编程语言的信息。目前阶段，它支持 `#ts` `#endts` 预处理命令来嵌入 TypeScript 代码，以更好地生成供前端使用的智能提示信息。

#figure(
  image("img/structure_defdef.png"),
  caption: "DefDef 与 deftools 工作流程（虚线部分未在原型实现）",
) <fig_structure_defdef>

DefDef 语言使用 `deftools` 转译器读取。该转译器会生成每个模块所需的数据，如 @fig_structure_defdef 所示。原型项目中，DefDef 会对规则描述系统和前端生成相关数据，包括从代码形式到 JSON-RPC 请求的转换规则、智能提示（类型）信息和可视化编辑信息等。

DefDef 的语义比较完备，因此还可以在如下模块中嵌入；它们尚未在本项目实现：
- 提供给 RDCCS 的防御式编程检查：检查来自规则描述系统的 JSON-RPC 请求是否在 DefDef 定义中，该设定可防止来自恶意的规则编写者的攻击；
- 提供给判题后端的单元测试模块：检查判题后端是否实现了全部 DefDef 所给定的功能。

= 前端用户界面实现 <frontend>

== 原型项目的前端

如 @backend-frontend 所讨论，前端将与 RDCCS 交互，原型实现采用 HTTP 通信。故在原型项目中，前端使用简单的 Web 程序实现。

原型前端整体基于 React 框架。React 是一个响应式 JavaScript 框架，以函数式思想提供各层组件的数据、状态和渲染逻辑。@react2023 原型前端的主要界面如 @fig_frontend_screenshot 所示。

#figure(
  image("img/frontend_screenshot.png"),
  caption: "原型前端界面",
  outlined: true
) <fig_frontend_screenshot>

该界面主要划分为三个部分：
+ *规则编辑器*：位于界面左侧，提供两种编辑方式：文本编辑和可视化编辑；
+ *用户代码提交处*：位于页面右侧，提供用户代码编辑器或上传用户代码；
+ *判题结果*：位于页面下方，显示判题结果。

#fix_id

使用原型时，只需分别在规则编辑器和用户代码提交处上传需要的规则和用户代码，然后点击提交按钮即可观察到判题结果。前端数据流图如 @fig_structure_frontend 所示，使用 RxJS 管理异步状态。

#figure(
  image("img/structure_frontend.png"),
  caption: "原型前端数据流图",
) <fig_structure_frontend>

== 规则智能提示系统

规则智能提示系统是提升前端体验的重要组成部分。智能提示，即智能代码补全（Intelligent Code Completion），是一种在代码编辑器中提供代码补全功能的技术。它可以根据当前光标位置的上下文信息，提供可能的代码补全选项。如 @fig_frontend_intellisense 中正在键入的 `$("#hello").` 就是一个智能提示的例子。

#figure(
  image("img/frontend_intellisense.png", width: 75%),
  caption: "原型前端规则智能提示界面",
  outlined: true
) <fig_frontend_intellisense>

由于规则代码使用 JavaScript AST，故目前的规则智能提示可基于 Monaco Editor 内置的 JavaScript LSP 系统提供。在原型实现中，通过给 Monaco Editor 适当的类型信息，即可在键入方法名、实参等场合下，给出基于类型的补全信息。该类型信息在原型实现中由 DefDef 规则形式的类型注释导出，参见 @defdef。

== 规则可视化编辑器

GUI-OJ 的设计目标包含让规则的制订更加轻松易用。因此，原型项目增设了可视化编辑器的模块，提供基于拖拽、点击等交互方式的规则编辑功能，如 @fig_frontend_blockly 所示。

#figure(
  image("img/frontend_blockly.png", width: 70%),
  caption: "原型前端规则可视化编辑器",
  outlined: true
) <fig_frontend_blockly>

Google 主导的 Blockly 项目提供可视化编程的框架，该项目被广泛应用于 Scratch、App Inventor 等面向初学者的可视化编程语言中。@blockly2023 Blockly 项目使用 JSON 定义工具栏、块等可视化编辑元素，使用 XML 作为可视化编辑器的内部表示。原型使用 DefDef 导出 Blockly 所需的工具栏、块定义，并提供了相应的导出 JavaScript 的转换函数。当用户选择使用可视化编辑器时，前端会通过上述定义将编辑器的形式转换为规则 DSL，然后发送给规则描述系统进行进一步处理。

== 完整的 GUI-OJ 系统前端概述

参考现有的 OJ 系统 @Li2005，完整的 GUI-OJ 系统应当类似地包含如下功能：
- *用户注册与登录*：用户可以注册账号并登录；账号应当具有权限区分，如网站管理员、管理员、教师、学生甚至助教；
- *用户信息编辑*：用户可以编辑个人信息，如用户名、密码、邮箱等；
- *题目列表*：用户可以查看题目列表，选择需要解答的题目；教师可以增加题目（包含规则描述）；
- *题目详情*：用户可以查看题目的详细信息，包括题目描述、输入输出格式等；
- *提交代码*：用户可以提交代码，以便判题；
- *判题结果*：用户可以查看判题结果，包括是否通过、运行时间、运行内存等。
- *其它*：如班级、考试模式、论坛问答等功能。

#fix_id

为了实现上述功能，除了一个前端 Web 程序外，通常还需要一个更加复杂的 Web 后端，处理来自用户的复杂功能请求。上述用户数据、题目数据、用户代码和判题结果等数据，也需要额外的数据库存储。在这种描述下，Web 前端、Web 后端、数据库共同构成了 GUI-OJ 系统的前端。但上述对 GUI-OJ 核心系统的讨论，包括系统边界等问题，在此复杂情形下仍然适用。

= 用户程序安全性 <security>

== 通用 OJ 系统的安全功能考察

OJ 系统会运行用户代码或用户程序，这就需要防止用户程序对系统造成破坏。可能的破坏途径有：
- 程序试图读取或删改无关文件，包括系统文件、系统配置等等；
- 程序试图无节制地申请内存，导致系统内存耗尽；
- 程序试图无节制地抢占 CPU，导致系统无法响应；
- 程序试图关机或重启系统；
- 程序试图访问网络，如发送邮件等；
- 程序试图访问系统外设，如摄像头、麦克风等；
- 程序试图诱导编译器超时或超内存等。

#fix_id

为了防止上述行为，OJ 系统通常会采取一些安全措施 @qduoj2022。根据防御措施的作用层级和复杂度，可采取：
+ 通过外部程序监控，限制程序的运行时间、内存使用量、CPU 使用量等；
+ 通过 `seccomp` 等系统组件，限制程序的文件访问、系统调用权限；
+ 使用低权限的用户运行程序，阻止程序访问系统关键文件；
+ 使用虚拟机、沙箱或容器等虚拟化技术，隔离程序与系统。

OJ 系统可以选择其中一种或多种安全措施，以防止用户程序对系统造成破坏。但这些安全措施也会带来性能下降等问题，在本文暂时不做讨论。

== 用户程序编译与编译安全

大多数通用 OJ 要求用户上传源代码而非可执行文件。相比可执行文件，源代码可以做更多的安全预防手段（如筛查简单的非预期系统调用等）。但是提交源代码会导致服务器增加编译操作，在编译过程中也有可能导致更多安全问题。

用户程序可能通过设计恶意谬构的代码，利用编译器本身的缺陷，导致编译器栈溢出或无法正常响应 @gccbug2020。最简单的攻击形式，即通过预处理指令引入 `/dev/random` 设备，从而导致随机数生成器快速竭尽，消耗系统资源。此外，用户程序也可能通过引入 `/etc/passwd` 等系统文件，读取关键系统配置以准备其它破坏手段。因此，编译程序也应有上述安全性保障，如在 `seccomp` 下运行编译器或使用第三方云编译方案等。

为减少应对编译安全的额外开发成本，本文建议优先考虑可执行文件的提交方式；仅针对解释型编程语言（如原型所述 Web 程序和 Python 程序）启用源代码提交。因此，下文不再讨论编译过程的安全性，仅考虑用户程序运行时的安全保障。

== GUI-OJ 系统的安全性保障措施考察

原型项目缺乏安全性考虑。本项目没有对用户程序的运行时间、内存或 CPU 用量做限制。也没有限制系统调用、用户权限或虚拟化技术。虽然作为原型演示，安全不是首要考虑的因素；但是作为完整系统而言，安全性保障是必不可少的。

首先考虑消极方案——_鸵鸟策略_，即遇到系统问题后，直接重启系统的消极解决办法。事实上，在理想的部署方案（见 @deployment）下，鸵鸟策略是可行的。但是该部署方案对硬件的需求较高，不具有实践意义。因此本文仍然从常规的方面考虑安全问题。

对于时空限制等客观因素，可以设计一个专用的外部程序，监控用户进程的运行时间、内存或 CPU 用量，在达到临界值时予以终止。该程序的设计本身并不复杂，但是这涉及到更多的 RDCCS 跨进程通信问题——判题后端与监控程序的并发问题也需要得到妥善解决。

其次，原型项目对用户程序的可访问系统调用没有做限制。在这一方面，GUI-OJ 与传统 OJ 的解决方法不具有共通性。传统 OJ 可以使用 `seccomp` 白名单，以限制绝大多数越权尝试；因为传统 OJ 所执行的 C/C++ 程序非常接近操作系统底层，合法程序对操作系统调用的数量是极其有限的。但是图形用户界面程序天然需要调用各种窗口系统的接口甚至底层绘图设备的接口，这使得白名单限制是不现实的。另一方面，如 @categories 讨论，本文所述的图形界面程序全部在 Windows 上运行，而 Windows 没有类似 `seccomp` 的机制。但可考虑第三方软件如 Sandboxie @sandboxie2023，并使用黑名单方式限制用户程序的系统调用。

再次，考察用户权限系统上的安全性措施。在 Windows 上，这似乎是可行的：软件可以利用 Windows 用户权限系统与 NTFS 文件权限系统共同限制用户程序的操作。但类似地，跨用户的操作增加了 RDCCS 的设计复杂度。

最后，考虑使用虚拟化技术如 Windows 沙盒、虚拟机工作站等机制。但是，跨虚拟机的进程控制是非常困难的，这要求项目构建时对 RDCCS 做更谨慎的设计——此部分将同系统部署于 @deployment 讨论。

= 系统部署 <deployment>

== 通用 OJ 系统的部署方案考察

直接从源码构建并进行本地部署，是最简单的部署方案；原型实现也采用了这种方案。但它的可移植性和可扩展性都很差，本文不再进行更多讨论。

对于一般的 OJ 系统，通常将数据库、Web 后端和判题后端部署到若干容器（如 Docker）中，并使用容器组织解决方案（如 Docker Compose）等进行部署。这种部署方案易于实现和应用，但相比直接本地部署，容器组织对硬件有一定要求，并一定程度上增加了开发的复杂度。

为了支持大量的用户判题请求，判题后端通常为若干容器构成的集群，它们可以由云计算服务商如 Amazon、阿里云等提供；AutoLab 所使用的部署方案即是如此。@autolab2014 本文可以根据这一模型提出类似的 GUI-OJ 系统的部署方案。

== GUI-OJ 系统的部署方案设计

综合 @security 提出的安全性需求，以及开发难度上的考量，GUI-OJ 可以类似地将判题后端以容器集群的形式部署在本地物理机或 ECS 云主机上，如 @fig_structure_deploy 所示。这样的部署方案可以满足安全性需求，也易于实现和应用。

#figure(
  image("img/structure_deploy.png"),
  caption: "一种可能的部署方案图示",
) <fig_structure_deploy>

其中，用户程序在启动时被发送给某个空闲判题后端，同时开启该判题后端的 HTTP 接口的监听。随后，发起判题的 RDCCS 服务器向该后端发送 JSON-RPC 请求，这之后的过程将与 @ipc 所讨论的本地通信方式基本相同。

在判题后端中，鸵鸟策略是可以接受的；容器本身对系统有一定的权限管理作用，这通常是足够应付大多数情形的。若剩余的情形较为罕见，则重启判题后端容器是一个简单有效的解决方案。在判题后端集群数量足够多的情况下，这种方案的性能也是可以接受的。

在前端（指 Web 后端和数据库系统）部署上，可以直接参考通用 OJ 的部署方案，使用反向代理、负载均衡等技术，以提高系统的可用性和性能。

= 结论 <conclusion>

本文提出了一种判定可视化程序正确性的在线评测系统（GUI-OJ），并对这个系统的各个组件的设计进行了详细剖析。本文的主要工作集中在：
+ 利用已有的测试框架软件，或集成操作系统调用，实现若干专用或通用的判题后端；
+ 提出了一种易用、易实现的规则描述语言，并给出了配套的描述系统；
+ 提出了一种判定 2D 图形程序输出的图像比对算法；
+ 对 RDCCS、前端等其它组件进行了深入分析。

// #fix_id

由于时间原因和能力有限，本文也存在一些待改进之处：
+ 各个判题后端的功能有待完善；
+ 2D 图形程序输出的图像比对算法有严重缺陷（见 @rtlib）；
+ 原型前端的实现离完整 GUI-OJ 仍有很大差距（见 @frontend）；
+ 缺乏安全性措施（见 @security）；
+ 对系统部署的讨论不够深入。

#bibliography("ref.bib",
 style: "ieee"
)

#appendix()

= 原型代码与构建方式

#[

#set par(first-line-indent: 0em)

== 原型代码

请访问 #text(blue, link("https://github.com/Guyutongxue/Graduation_Project")[GitHub: Guyutongxue/Graduation_Project]) 仓库。

此原型项目以单仓库（Monorepo）形式管理。文件夹 `packages` 下存放不同的子项目或模块：
- `backend` 对应于本文所述 RDCCS（@rdccs）；
- `defdef-syntax-highlight` 为 DefDef 语言的语法高亮插件；
- `formcheck` 对应于 Windows 窗体判题后端；
- `frontend` 对应于本文所述前端用户界面实现（@frontend）；
- `graphicscheck` 对应于 Python turtle 2D 判题后端；
- `rtlib` 对应于运行时库（@rtlib）；
- `transpiler` 对应于规则描述系统（@transpiler）及 DefDef 宏语言定义（@defdef）。
- `webcheck` 对应于 Web 判题后端。

此外，文件夹 `docs` 下存放本文档的源代码，以及一些其他文档。

== 构建与运行方式

上述模块中使用 Node.js 编写的，均使用 Pnpm 工作区管理。在根目录执行

```shell-unix-generic
pnpm install
```

即可安装上述模块的依赖。在 C\# 项目 `formcheck` 下，执行

```shell-unix-generic
dotnet build
```

即可安装其依赖并构建 Windows 窗体判题后端。在 C++ 项目 `graphicscheck` 下，执行

```shell-unix-generic
xmake configure
xmake build
```

即可构建 Python turtle 2D 判题后端。对于其他模块，执行

```shell-unix-generic
pnpm build
```

即可完成构建。在 `frontend` 和 `backend` 模块分别键入如下命令，即可运行原型项目：

```shell-unix-generic
pnpm start
```

]
