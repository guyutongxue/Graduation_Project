#import "utils/template.typ": *

#let abstract = [
  程序设计在线评测系统（Online Judge，简称 OJ，直译“在线判题”）是一种软件系统，其通过计算机自动裁判若干用户提交的程序的正确性。现有的通用 OJ 系统中，评测系统通常是基于给定的若干组标准输入内容，并考察用户程序的标准输出是否符合期望，从而判定用户程序的正确性。但对于程序设计的初学者来说，开发更易用、更直观的图形用户界面（Graphical User Interface，简称 GUI）程序则更具有吸引力；而这些程序也是人们日常使用的软件的重要组成部分。我们认为，基于标准输入、标准输出的程序虽然构成了计算机软件系统的根基，但它们更面向于科班、专业的技术人员；而在如今编程技能平民化、大众化的趋势下，更需要教育、普及对 GUI 程序的开发。OJ 系统在计算机教学中发挥的作用已有显著效应，而 GUI 程序的 OJ 系统设计则尚无成型原型。我在本论文中，提出了一种图形用户界面程序 OJ 的组织方法，并实现了它的原型设计。首先，该 OJ 系统根据开发 GUI 程序所使用的编程语言、构建流程和运行方式分为若干类别，对每一种类别的程序设计方法设计对应的判别方法：在原型设计中，我选用了 Web 程序、C\# Windows 窗体程序和 Python turtle 2D 图形程序三种基本类别。其次，设计统一的判题语法规则描述，教师、比赛组织者等用户可根据该规则描述制订具体的判题规则：在原型设计中，我选用了基于 JavaScript AST 的领域特定语言（DSL）描述，并提供了可视化的规则编辑界面。最后，将规则解释器、判题控制器、输入输出系统等组件结合，并提供恰当的最终用户交互界面，即可形成一个可用的图形用户界面程序设计 OJ。本论文在原型设计的基础上，同时考察了其它判题类别的判别方法设计，对用户程序编译系统、用户程序安全性保障、多端并行通信与工业场景部署问题、与现有 OJ 前端系统的结合问题进行了深入讨论。
]

#let keywords = ("程序设计", "图形用户界面", "在线编程", "在线评测", "实验教学")

#let enAbstract = [
  Online Judge (OJ) is a software system that automatically judges the correctness of a number of user submitted programs. In existing general-purpose OJ systems, the evaluation system usually determines the correctness of a user's program based on a given set of standard inputs and examines whether the standard output of the user's program meets expectations. However, for beginners in programming, it is more attractive to develop easier-to-use and intuitive Graphical User Interface (GUI) programs; these programs are also an important part of the software that people use every day. We believe that although programs based on standard input and output form the basis of computer software systems, these programs are more oriented toward technical professionals. The trend toward the popularization of programming skills has created a greater need for education and popularization of the development of GUI programs. In this thesis, I propose a method for organizing and prototyping a OJ system judging GUI program. First, this OJ system is divided into several categories according to the programming language used to develop GUI programs, the construction process and the operation method. For each category, corresponding discriminative methods are designed. In the prototype design, I chose three basic categories: Web programs, C\# Windows Forms programs and Python turtle 2D graphics programs. Secondly, I designed a universal syntax of judging rule description of the judging, which can be used by teachers or competition organizers. In the prototype design, I chose a domain-specific language (DSL) description based on JavaScript AST, and provided a visualized rule-editing interface. Finally, a control system is formed to combine the rule interpreter, question controller, input/output system components and an appropriate end-user interaction interfaces. This thesis also discussed following topics in depth: the design of the user program compilation system, the security of the user program, the issues of multi-terminal parallel communication and industrial deployment, and the integration with existing OJ front-end systems.
]

#let enKeywords = ("programming design", "graphical user interface", "online programming", "online judge", "experimental teaching")

#let acknowledgements = [
  首先，我感谢邓习峰导师提供了这个选题，以及让我研究这类问题的机会。在理科为主、算法至上的北京大学教育氛围下，提出如此贴近现实环境、教育教学、工业生产的题目实在不容易。该题目也充分发挥了我所擅长的软件工程、操作系统、编译原理等知识的运用。

  感谢舍友郭易提供的图像识别算法思路；没有他的帮助，本论文可能要花更多的时间才能完善。

  感谢 Node.js 和 Python 开发者提供的优秀的语言设计和开发框架。感谢以下开源第三方库的开发者：pnpm、Babel、Fastify、adm-zip、get-port、jayson、nodemon、tmp 与 tmp-promise、wait-port、Rollup、TypeScript、FlaUI、AustinHarris.JsonRpc、React、allotment、axios、Blockly、DaisyUI、Monaco Editor、RxJS、PostCSS、TailwindCSS、Vite、xmake、cpp-httplib、nlohmann_json、turbobase64、Boost、json-rpc-cxx、unique_resource、dts-bundle-generator、tsx、Peggy、rimraf、DefinitelyTyped 和 Puppeteer。本论文的实现离不开上述优秀的开源项目。

  感谢 Typst 项目的开发者，提供了如此易用的论文排版工具。感谢 GitHub 用户 #link("https://github.com/lucifer1004")[lucifer1004] 提供的基于 Typst 的北大学位论文模板。 

  感谢#link("https://www.microsoft.com/")[微软]主导开发的 #link("https://code.visualstudio.com/")[Visual Studio Code] 项目，让我能流畅舒服地完成编写代码、调试代码、编写论文等各个方面的工作。

  感谢舍友赵一鸣四年的陪伴。
  
  感谢 OpenAI 的 ChatGPT 和 GitHub 的 Copilot 提出一些有趣但不一定合适的回复，让我在编写代码或完成论文时多了一些灵感。

  感谢虚拟主播#link("https://space.bilibili.com/401480763")[真白花音]，在赶稿写代码的日子里用甜美的声音和温暖的歌声陪伴了我。感谢#link("https://www.mihoyo.com/")[米哈游]开发的 #link("https://ys.mihoyo.com/main/")[《原神》]游戏，极大程度地丰富了我的休息时间，让我能每天充满精力地完成论文工作。
]

#show: doc => conf(
  author: "谷雨",
  studentId: "1900012983",
  thesisName: "本科生毕业论文",
  header: "GUI 程序 OJ 技术研究",
  title: "图形用户界面程序 OJ 技术研究",
  enTitle: "Graphical User Interface Program OJ Techonology Research",
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

传统 OJ 系统的工作流程是这样的：
- 教师/比赛组织者给定一个题目。题目的定义包括题目描述、输入输出格式、样例输入输出，和若干组输入输出数据（称为 _测试用例_ ）；
- 学生/选手将自己的程序代码提交到 OJ 系统；
- OJ 系统编译并运行学生的程序（称为 _用户程序_ ），以每组测试用例中的输入作为用户程序的标准输入，并记录用户程序的标准输出；
- OJ 系统比对标准输出与测试用例的输出是否一致，从而判断学生/选手的程序是否正确；
- 对于上述过程中遇到的系统异常，可能会得出超时（TLE，Time Limit Exceeded）、超内存（MLE、Memory Limit Exceeded）、运行时错误（RE、Runtime Error）等其它判题结果，通常也被视为用户程序的错误。@Li2005

#fix_id

Wasik 在 @Wasik2018 中以数学方式定义了宏观的 OJ 系统。在该数学定义下，OJ 系统的编译方式、判题方式和计分方式，均由自定义的算法决定。换句话说，系统管理员通常可以在这类 OJ 下自由地指定用户代码的编译方式或者上述判题流程。这种非传统的 OJ 系统也有所应用，如 UOJ（Universal OJ）。@vFleaking2014  UOJ 最典型的题目——quine，即通过检测程序输出与程序源码是否相同来得出判题结果。此外，卡内基·梅隆大学的 AutoLab 也可以算作一种非传统的 OJ 系统。@autolab2014

类似地，本论文将提出一种非传统的 OJ 系统。为了引入这一系统的特点，我们介绍图形用户界面程序的相关概念。

== 图形用户界面程序简介

_图形用户界面_（Graphical User Interface，GUI）是指采用图形方式显示的计算机操作用户界面。与早期计算机使用的命令行界面相比，除了降低用户的操作负担之外，对于新用户而言，图形界面对于用户来说在视觉上更易于接受，学习成本大幅下降，也让电脑的大众化得以实现。 #citation

图形用户界面可以是具体的、运行在某绘图环境中的图形界面，也可以是抽象的，运行在某高层次画布（如 HTML、WXML 等）及相关虚拟机平台的图形界面。这些图形界面通常由图形元素构成，比如按钮、文本框、下拉菜单等。

考虑到 OJ 系统在科班教学中的良好效应，如果将类似的软件系统运用于 GUI 程序设计的教学中，则会显著提高 GUI 程序设计的学习效率。因此，本文试图提出一种针对 GUI 的 OJ 系统的构成，即将 OJ 系统的判题流程扩展到图形用户界面程序的判别上。在下文中，我们称这种 OJ 系统为 GUI-OJ。此外，我还实现了 GUI-OJ 的 _原型_ 系统，以验证本软件系统结构的可行性。

本论文的结构如下：
- @packages 讨论了 GUI-OJ 软件系统的边界和组件划分问题；
- @categories 讨论了原型实现选择的题目分类，及对每个题目类别的判题方法讨论；
- @transpiler 讨论了规则描述语言的设计，以及原型的实现细节；
- @rdccs 讨论了将规则解释系统与判题后端结合的工作，以及其中的跨进程通信问题；
- @rtlib 讨论了规则解释系统中的运行时库的设计；
- @defdef 给出了一种定义规则解释系统更宏观抽象——DefDef 宏语言；
- @frontend 讨论了 GUI-OJ 在宏观意义下的前端设计；
- @security 讨论了 GUI-OJ 系统应考虑的安全性问题；
- @deployment 讨论了如何部署 GUI-OJ 系统以及与之相关的问题；
- @conclusion 总结了本论文的工作。

= GUI-OJ 系统组件与结构 <packages>

== 综述

GUI-OJ 的基本框架，简化后如 @structure_easy 所示。

#figure(
  image("img/structure_easy.png"),
  caption: "GUI-OJ 系统简化后的基本框架",
) <structure_easy>

GUI-OJ 系统的输入包括如下两部分：
- *用户程序*：以源码或者可执行文件的方式给出；
- *题目*：为了定义一个程序在某个题目下的正确性，需要以 *规则描述* 的形式给出题目的定义；若用户程序通过了规则所指定的判定，那么就视为是正确的；

#fix_id

GUI-OJ 系统的输出主要包括：
- *判题结果*：对于给定的用户程序和题目规则，返回该用户程序是否 _通过_。

#fix_id

以上输入输出部分为 GUI-OJ 软件系统的边界。若将 GUI-OJ 系统作为最终用户的后端（Backend），则与该系统边界交互的部分称为 _前端_。

接下来考虑 GUI-OJ 与传统 OJ 的不同点。GUI-OJ 的用户程序具有图形界面，而不同的图形界面程序的运行环境、运行方式都有很大的不同，因此判题规则也会随之变得多样化，无法基于传统 OJ 的输入输出模板实现。因此我们需要如下的组件设计。

== 判题规则描述系统

_判题规则描述系统_ 是 GUI-OJ 与传统 OJ 的最大不同点，它责解析教室和比赛组织者提供的判题规则描述。该规则描述通常是用户友好的，但其具有结构复杂、形式多样化的特点，因此需要单独模块将其解析成可供其它模块直接使用的数据结构。

在本文提出的原型设计中，该系统的用户端使用基于 JavaScript AST 的领域特定语言描述判题规则，并以 Blockly 可视化程序设计界面作为辅助，最终生成直接供 Node.js 运行的脚本。其实现细节将在 @transpiler 中讨论。

== 规则派发与通信控制系统和判题后端

虽然个人计算机上的图形用户界面在物理层面上大多是基于键盘、鼠标进行输入输出交互，但是大部分图形界面程序可以提供更高层次的抽象，如按钮、文本框等等。抽象层次的不同，也决定了程序设计方法的不同和程序功能的不同；在判题逻辑上，也需要做相应的分类讨论。

因此在结构上，需要有一个单独的系统负责将判题规则划分为若干 _类别_，从而每个类别内部的判题流程可以统一处理。我们称之为 _规则派发与通信控制系统_（后文简称 RDCCS，即 Rule Dispatch and Comm. Control System），该系统也负责处理用户程序输入和判题结果的输出。对于每一个题目类别，提供对应的 _判题后端_，实现相应的判题流程。

原型设计使用 Node.js 作为该系统的实现框架；其实现细节将在 @rdccs 中讨论。原型设计综合考虑抽象层次和实际情况，实现了三个判题后端：Web 程序、Windows 窗体程序和 Python turtle 2D 图形程序。
- Web 程序是抽象层度最高的图形界面程序；它的图形界面由 DOM（文档对象模型）组织，可以非常方便地使用浏览器相关 API 直接操作。
- Windows 窗体程序的抽象层次与 Web 类似，我们可以通过焦点控制、自动化测试等框架选中其中的可操作控件，但是产生提到操作本身仍然需要键盘和鼠标的事件模拟。
- Python turtle 2D 图形程序是最低层次的抽象，它只提供最简单的绘图功能。

#fix_id

上述判题后端的实现细节，以及其它分类的讨论将在 @categories 中给出。

== 前端

作为系统边界的前端的设计也是 GUI-OJ 系统需要考虑的问题。原型设计提供了供研究者测试用的 Web 前端用户界面，使用 React 框架实现。该实现细节，连同更宏观的生产环境前端设计，将在 @frontend 中讨论。

= 判题后端实现 <categories>

== Web 程序

Web 程序是当前互联网时代的最主流应用程序。它不仅应用在浏览器等传统 Web 环境中，也适用于桌面程序（Electron、Tauri 等）和移动程序（React Native、Flutter 等）。Web 程序通常使用 JavaScript 作为开发语言，并用 HTML 和 CSS 处理图形界面布局，但也可以使用 TypeScript、CoffeeScript、Dart 等语言开发。

在原型设计中，我们先假定 Web 程序只运行在浏览器中（且是现代浏览器，即符合 W3C 最近五年规范的浏览器），从而简化问题的处理。在该假设下，我们只需要使用一个遵循规范的、可由程序控制的浏览器，如 Chromium，就可以实现对 Web 程序的判题。

在原型设计中，我采用了 Puppeteer 库 #citation 。该库可用于控制 Chromium 浏览器的行为，如加载页面、审查元素等等。Puppeteer 库提供了一个 Node.js 的 API，因此可以直接在 Node.js 环境中使用。稍后 @rdccs 所呈现的控制系统也在 Node.js 环境中运行，因此 Web 段的判题控制会相对容易很多。

另一方面，我们还需要将 Web 程序呈现在网页上。我们假定目前判题后端接收到的是一系列静态网页素材，那么浏览器可以有两种方式加载这些素材：
- 通过 HTTP 服务器加载，这是最常见的方式，也是原型设计采用的方式。
- 通过本地文件系统协议（`file://`）加载，这种方式可以避免 HTTP 服务配置，拥有更优的性能。但是本地文件系统协议的跨域访问通常是被禁止的 #citation ，从而许多功能无法正常运行。

#fix_id

为了尽可能在生产环境模拟 Web 程序的运作，我们选择本地启动一个轻量的 HTTP 服务器。在原型设计中，我们使用了 Fastify 库 #citation。它也是 Node.js 环境下的新型 HTTP 服务端库，相比传统的 Express 等库，它的性能更好。

对于网页中的特定元素选择，可直接使用 CSS 选择器语法。它在 Chromium 浏览器内部受支持，且在 JavaScript 中也有对应的 API。

/* @fig_web */ 展示了上述 Web 端判题程序的模块结构。

该判题后端支持如下动作：
- 页面中特定 DOM 元素的点击；
- 页面中特定 DOM 输入元素的输入；
- 发送键盘按键。

#fix_id

该判题后端支持如下属性的读取：
- 页面标题；
- 页面中特定 DOM 元素的文本内容；
- 页面中特定 DOM 元素的 HTML 内容；
- 页面中特定 DOM 元素的特性（Attribute）值；
- 页面中特定 DOM 元素的计算后 CSS 样式。

以上功能基本覆盖了简单的 Web 程序测试需要。

== Windows 窗体程序

Windows 窗体（Windows Form）程序，是 Windows 平台上基于窗口的最经典的开发环境。它底层上是 MFC（微软基础类库，Microsoft Foundation Class）的封装，提供了一组基于 Win32 窗体控件的开发接口。Windows 窗体可以用 C\#、VB.NET、C++ 等语言开发。

Windows 窗体程序由控件（Control）组成，每个控件都有其独立的句柄。因此，我们可以通过获取一个 Windows 窗体程序的控件树，根据需要选定其中控件的句柄，然后基于句柄进行操作。

从 Windows 95 开始，系统便内置了可供程序操作的操作系统接口，其名为 Microsoft Active Accessibility（MSAA） #citation。MSAA 为 Windows 窗体程序提供了一套标准的、可供程序访问的接口，包括控件树的获取、控件属性的获取、控件操作的执行等等。MSAA 也是早期 Windows 窗体程序的无障碍访问渠道，因此，任何一个 Windows 窗体程序都支持 MSAA （但非 Windows 窗体的程序，即“自绘窗体”，仍然使用起来有不便之处）。在随后的数十年内，该功能逐步升级为 UI Automation（UIA），以 C\# 和 C++ 的形式提供接口。 #citation

原型设计并没有选择直接调用 UIA，而是选择其上的一个包装库 FlaUI  #citation。该库为 C\# 库，可以简单地用 .NET 运行时来测试所有 Windows 窗体程序。在原型设计中，我们使用了 .NET 7 运行时；虽然它不在操作系统上预装，但是能够获得更多的性能提升，并提升开发人员的编码效率。

不同于 DOM，Windows 窗体控件树没有一个合适的控件选择语法。因此我提供了如下选择方式：
- 基于文本的选择：给定按钮文本、标签文本或文本框的文本，然后查找所有空间中符合文本或包含文本的控件。
- 基于 `automationId` 的选择：在 UIA 中，每个元素拥有其独立标识 `automationId`；在未经优化的 C\# Windows 窗体程序中，该名称等价于控件的名称（`Name` 属性）。因此，我们若限制用户程序的编写方法，则可以通过 `automationId` 来选择某一特定控件。但是，对于没有限制的程序，这不是一个合适的手段。
- 基于文本及其周边空间的查找来选择：在窗体程序中，一个常见的模式为“标签+文本框”（如 /* @img_??? */），我们在对标签进行基于文本的严格查找后，划定其坐标周围的范围，来查找其附近文本框。这种方式通用性相比前两种更弱，但是在大多数场合更常用。

#fix_id

/* @fig_forms */ 展示了上述 Windows 窗体程序判题后端的模块结构。

该判题后端支持如下动作：
- 点击按钮；
- 切换单选框（Radio Button）、复选框（Check Box）；
- 设置文本框的文本；
- 设置组合框（Combo Box）的选项；

#fix_id

该判题后端支持如下属性的读取：
- 窗体标题；
- 控件文本；
- 空间的启用性。

#fix_id

以上功能基本覆盖了简单的 Windows 窗体程序的测试需要。

== Python turtle 2D 图形程序

Python 是当前最流行的编程语言，也是非专业计算机学习者最常用的编程语言。Python `turtle` 是 Python 的一个标准库，它提供了一个简单的绘图接口，可以用来绘制 2D 图形。

`turtle` 库的设计来源于 Logo 编程语言的绘图库。#citation 该绘图库假想一只带着画笔的海龟可以接受简单的命令，例如向前走 100 步，或者左转 30 度。通过对这只海龟发送命令，可以让它绘制出较为复杂的图形，例如正方形，三角形，圆等。#citation  Python 的 `turtle` 库提供若干全局函数，以实现类似 Logo 绘图的命令式接口；同时，它也提供面向对象的接口，以实现更为复杂的图形。#citation

对于这类程序的判别，需要考虑如下问题：
+ 作为解释型语言，需要提供合适的解释器即运行环境；
+ 限制用户程序可能影响判题的操作，如调整绘图速度、创建多个窗口等；
+ 一个合适的 2D 绘图正确性判定方法。

#fix_id

对于第一个问题，我们选择了 Python 3.11 并创建虚拟环境以免本机其它依赖库的干扰。对于第二个问题，可以使用打桩技术（Interpositioning）来限制 `turtle` 标准库的行为；即通过 `importlib` 控制导入库的行为，从而将 `turtle` 标准库的导入重定向到一个 GUI-OJ 系统内的、受限制的“伪” `turtle` 库即可。

对于第三个问题，在本论文提出的设计思路中，将使用一个专门针对教学用 2D 绘图的图像比对算法，将用户程序产生的图像与标准图像进行比对，得到相似率，并以某个阈值作为判定标准。该算法将在 @rtlib 中展开描述。

同时，该判题后端需要模拟键盘事件和鼠标事件，以发送给用户程序，观察其变化。该判题后端需要实现窗体的“截图”功能，以便于进行图像比对。由于上述操作接近 Windows 系统底层，故该判题后端使用 C++ 实现。

/* @fig_forms */ 展示了上述判题后端的模块结构。

该判题后端支持如下动作：
- 发送点击事件；
- 发送按键事件；

#fix_id

该判题后端支持如下属性的读取：
- 窗体标题； // 还没有做，可能是忘了
- 窗体截图。

#fix_id

由于 2D 绘图程序本身的特性，该判题后端的功能较简洁，必须依赖于规则制订者提供详细的判题规则。

== 其它程序类别与跨平台问题

可在 Windows 下运行的其它窗体程序，也可以有选择地接入到上述判题后端。对于含有控件树的窗体（不限于 C\# Windows 窗体，包括 MFC、Qt、TKinter、WPF、WinUI 3 或 MAUI 等开发流程），可以直接接入“Windows 窗体程序”判题后端，但是不能直接使用 `automationId` 。对于“自绘窗体”，则可以使用类似“Python turtle 2D 绘图程序”判题后端的思路，但是需要在细节上做一些修改。

对于 Electron 或 Tauri 等基于 Web 界面的程序，可以使用类似“Web 程序”判题后端的思路，但是在细节上要做大量修改，比如直接启动程序而非额外的 HTTP 服务器；使用 Puppeteer 时，需要将 Chromium 指定为 Electron 内的 Chromium 或系统的 WebView 等。

非 Windows 的 GUI 程序则更加难以处理。非 Windows 系统上，GUI 程序的实现多种多样：既可以直接使用 X #citation；也可以使用 GTK、Qt 等跨平台的 GUI 库。对于这些程序，需要针对性地设计判题后端，没有很好的统一处理的途径。因此，本次原型设计对非 Windows 的 GUI 程序暂时不做考虑。

= 判题规则实现 <transpiler>

== 现状考察及设计方向

对于传统的 OJ，只需给定若干组测试输入输出样例，即可判定用户程序的正确性。但是对于 GUI 程序，这种方式并不适用。因此，需要设计一种新的判题规则描述方式。

考察非传统的 OJ，如基于自定义规则的 AutoLab，则使用了规约式的设计方法：要求教师或比赛组织者提供一个程序（或脚本），对于给定的用户程序，输出其得分。 #citation 
// https://docs.autolabproject.com/lab/#writing-autograders 
这种方式的优点是灵活性高，可以适应各种各样的题目类型，但是缺点也很明显：需要教师或比赛组织者极高的编程能力，且必须对 GUI 程序十分熟悉，以给出各种细节的判定规则。

因此在 GUI-OJ 中，我们希望设计一个简单易用的规则描述方法，在支持高精细度的控制的同时，不需要教师对 GUI 程序的细节有所了解。为了确保这一点，我们决定使用代码作为规则描述，而非可视化的选项或表单界面。但我们可以通过一些前端的额外模块，来实现从可视化界面到代码的转换，从而在一些简单的题目中，提供更易用的规则制订方式（在 @frontend 中讨论）。

该代码将指明一系列 _测试用例_。每个测试用例应当指明一个测试流程，即若干个按顺序执行的 _测试步骤_。测试步骤分为两个类别：_执行步骤_ 和 _判定步骤_。执行步骤将模拟用户操作，判定步骤将判定用户程序的输出是否符合预期。若用户程序成功执行了所有的执行步骤，且判定步骤的结果也符合规定，那么就视用户程序通过了这个用例。将所有用例的判定结果结合在一起，即可按照通用 OJ 的方式（如 ACM 风格、OI 风格）给出整个用户程序的成绩。上述规则的组织和解析方式如 /* @fig_rule_concept */ 所示。

// TODO: @fig_rule_concept

== 基于现有编程语言的设计

充分利用已有的库，是软件设计的一大原则，即“不重复造轮子”。#citation
// https://en.wikipedia.org/wiki/Reinventing_the_wheel#cite_ref-1
因此我们首先考察基于已有编程语言设计规则描述的方式是否可行。

我们观察到规则描述与单元测试用例的编写方式有一定相似性。受其启发，我们可以编写类似 @code_js_rule 的规则代码。

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

在这种编写方式下，只需给出合适的 `test` 和 `expect` 定义，即可以直接执行该代码的方式完成评测。但是这种方式的缺点体现在其写法不算简洁，需要用到箭头表达式等特性；此外 `toEqual` 等方法名也不如 `==` 运算符直观，且容易增加拼写错误的可能。因此，我们没有选用这种定义方式。

== 基于全新 DSL 的设计

考虑到简化上述语言本身带来的不合适语法特性，我们可以考虑自行设计一种领域特定语言，来实现更加简洁的规则描述方式。一种可行的方案如 @code_dsl_rule 所示。

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

由于 DSL 的结构是完全自定义的，因此可以引入更多的关键字或语法形式。比如，我们可以定义 `assert` 关键字来代替原先复杂的 `expect` 函数；直接用 `==` 等比较运算符作为测试步骤，用 `$` 符号来引入选择器等等。这种方式的优点在于，一定程度上减轻了规则编写者的学习成本和编写成本，同时也可以更加灵活地定义规则。但是，其缺点在于 GUI-OJ 开发者需要编写一个完整的语言解析器，以将 DSL 解释或者转换为某种可执行的代码形式。解析器的编写成本可能会很高，且难以保证其正确性或通用性。出于成本的考量，我在原型设计中没有使用完整的 DSL，但可以考虑在之后的版本引入。

== 基于已有 AST 的 DSL 设计

考虑到 DSL 的编写成本，我们可以考虑使用已有的编程语言的抽象语法树（Abstract Syntax Tree, AST）来实现 DSL 的解析。这样做的好处在于，我们可以直接使用已有的编译器前端来解析 DSL，而无需自行编写解析器，从而减少开发成本。在得到 AST 后，再对其进行树的遍历算法，进行代码生成或规则执行等操作。

本原型实现使用了 JavaScript AST，因为 JavaScript 具有统一的 AST 格式 ESTree #citation 
// https://github.com/estree/estree
，且有众多的解析器支持（如 Acorn、Babel、ESLint、SWC 等等），生态颇为成熟。原型实现使用了 Babel 作为解析器，并以 Babel 插件的形式给出具体的解析方法，最终产生可执行的 JavaScript 代码。一个具体的规则代码示例如 @code_ast_rule 所示。

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
  #h(2em) _LexicalDeclaration_ |
  #h(2em) _Block_
]

其中，_ImportDeclaration_、_LexicalDeclaration_ 和 _Block_ 的定义参见 ECMAScript 2023 标准 #citation。
// https://tc39.es/ecma262/

该 DSL 主要由 _RuleCategoryDirective_ 和若干个 _RuleCase_ 构成；前者指代判题类别（@categories），后者中的每个 _Block_ 则指代一个测试用例的具体流程。（_ImportDeclaration_ 见 @rtlib，_LexicalDeclaration_ 见 @frontend。）

在流程中，每条语句都会作为测试步骤解释执行；若该语句为 _LabelledStatement_ 且 _LabelIdentifier_ 为 `assert`，那么就将其解释为判定步骤；否则解释为操作步骤。判定步骤要求其 _Statement_ 为 _ExpressionStatement_，进一步求值并检查结果是否为实值（truthy），来得到判定结果。操作步骤则直接执行其 _Statement_。

规则代码使用 _后端操纵对象_ 与判题后端交互。@code_ast_rule 中的 `$` 即为 `web` 类别的后端操纵对象。它的若干方法如 `title`、`click`、`text` 等，会被 RDCCS 转换为发送给判题后端的交互命令，并返回后端的响应。不同的判题后端提供不同的功能，因此每个判题后端都有其对应的后端操纵对象。该对象的定义在原型实现中由 DefDef 宏语言生成，详见 @defdef。

规则解释系统将该代码输入分析为 AST 后，会做如下操作：
+ 校验规则代码是否符合上述定义；
+ 将 _RuleCategoryDirective_ 转换为控制判题类别的语句；
+ 将每一个 _RuleCase_ 转换为函数（类似 @code_js_rule 中的形式），并注册到相关的控制对象中；
+ 引入后端操纵对象，并将相关代码转换为发送交互命令的语句。

#fix_id

随后，该转换后代码即可直接由 RDCCS 解释执行。

= 规则派发与通信控制系统 <rdccs>

== RDCCS 综述

本章解释 RDCCS 的实现。综合 @packages、@categories 与 @transpiler 的讨论，可得出 RDCCS 要实现的功能如下：
- 接受来自前端的请求，决定何时开始工作；
- 以特定的控制方式，执行规则解释系统输出的规则代码；
- 根据规则代码指明的判题类别，启动对应的判题后端；
- 对规则代码中的每个后端操纵命令，派发相应的命令到判题后端；
- 每次判题结束时，产生对应的结果，将结果返回给前端。

#fix_id

下文将根据 RDCCS 的主要两个通信客体（模块）：判题后端与前端，来讨论相关的实现细节。

== 与判题后端的通信 <ipc>

现在考虑 RDCCS 已经拿到一个用户程序和一个判题规则（经规则解释系统处理后）。那么，RDCCS 需要执行判题规则所指定的行为，并将其中涉及后端操纵对象的代码转换为对后端的通信操作。这一过程需要讨论如何与判题后端进行有效、可靠的通信。

首先对需求进行分析。该跨进程通信是单方面（RDCCS）发起的，而非双向主动通信，因此可以用一个半双工通信信道解决问题。考虑到判题后端的独立性，其必然以进程为基本单位，故两者的通信是跨进程的（Inter-Process Communitation, IPC）。跨进程通信在最底层可以基于管道（Pipe）、套接字（Socket）等操作系统设施，但是在实际使用中我们需要更高层的抽象以简化开发的复杂度。因此，我选择了基于 HTTP 及 JSON-RPC 的通信方案。

JSON-RPC 是基于 JSON 的一个远程过程调用（Remote Procedure Call, RPC）协议。它的基本思想是，将函数调用转换为 JSON 对象，以 HTTP 请求、TCP 请求或管道的形式发送给服务端，服务端执行相应的操作，并将结果以 JSON 对象的形式返回给客户端。JSON-RPC 在 C++、Python、C\# 语言有第三方库提供包装，为我们的编程工作提供便利 #citation。

与判题后端通信的具体的流程如下。判题开始前，RDCCS 获取一个空闲的 TCP 端口号，并以该端口号作为启动参数启动判题后端。判题后端需要作为服务端监听该端口号上的 TCP 请求。当 RDCCS 检测到该端口号被监听后，即可开始判题流程。当 RDCCS 遇到后端操纵对象的操作时，会将该操作转换为 JSON-RPC 请求，并以 HTTP POST 请求形式发送给判题后端。判题后端收到请求后，会执行相应的操作，并将结果按 JSON-RPC 的约定返回给 RDCCS。类似地，当测试用例结束或者判题流程结束时，RDCCS 会向判题后端发送相应的通知或请求，以结束或开始新的判题操作。

在原型实现中，上述转换过程是由规则解释系统完成的；即将后端操纵对象的方法改写为 JSON-RPC 中的 JSON 对象的发送操作。该转换的信息则是由 DefDef（@defdef）提供的。判题后端对各个 JSON-RPC 的响应则需要手动维护。

== 与前端的通信

由于前端的多样性，与前端通信的方法也不尽相同。原型实现中的前端为简单 Web 项目，因此原型采用 HTTP 作为通信方法。

原型中提供的通信数据包括：开始判题时的判题规则和用户程序、判题过程中的判题结果和判题结束得到的判题结果。前者是由前端主动发起的，后两者则是由 RDCCS 主动发起的，因此该通信的最佳实践应当为双端主动通信；信道选择上应为全双工的。在 HTTP 及更高层次的通信协议中，WebSocket 最为适合。#citation 原型设计中出于项目复杂度的考虑，没有使用 WebSocket，而是直接使用基于简单 HTTP 的客户端轮询；相关的优劣讨论将在 @frontend 中讨论。

按照上述分析，原型中的 RDCCS 接受来自前端的如下请求：
- `POST /judge`：提交一个判题请求。请求体为 JSON 对象，包含判题规则和用户程序的信息。RDCCS 先分配一个判题请求 ID 并返回给前端，并启动新协程调用规则解释系统，然后执行 @ipc 所述通信流程。
- `GET /judgeStatus/:id`：查询一个判题请求的状态，其中 `:id` 为判题请求的 ID。前端通过定期轮询来获取判题结果。

#fix_id

= 运行时库与图像比对算法 <rtlib>

== 运行时库的必要性

相比 Python 等编程语言，作为规则描述底层的 JavaScript 语言的标准库可谓十分匮乏。例如，出于历史原因，JavaScript 甚至没有提供合适、完备的字符串类型与数型数据相互转换的方法。而 @transpiler 强调过作为规则描述的首要目的是减少规则编写者的学习成本，因此在设计规则解释系统时，需要引入必要的额外机制来补充语言的缺陷。

在 GUI-OJ 软件系统中，我选择了 _运行时库_（Runtime Library）的概念来解决这一问题。运行时库是一组函数的集合，它们可以被规则描述者直接调用，以完成一些常见的操作。例如，GUI-OJ 中的运行时库包含了字符串与数型数据的相互转换、简单的系统功能调用、图像比对等功能。运行时库的实现是由规则解释系统提供的，因此规则描述者可以直接调用运行时库中的函数，而无需关心其实现细节。

== 图像比对算法综述

下文将重点阐述图像比对功能。因为 GUI-OJ 的图像比对的目标是判别用户 2D 图形程序所产生的图像是否接近于标准图像；它与计算机视觉、人工智能领域所述的图像比对目标有一定差距。在 2D 图形程序中，没有明确的具名目标（如人物、车辆、水果等），取而代之的是构造简单、轮廓分明的几何图形（如正方形、圆等）。因此，基于通用的物品识别算法难以正常工作。

其次，传统图像相似度/差异度算法如 MSE 或 SSIM，则是针对图片整体的色彩或特征，而不是针对图像中的特定物体。2D 图形程序中的图像可能由多个图形构成的，因此整体的色彩或特征并不能反映出图像中的物体的差异。例如，题目标准图像由若干色彩各异的几何图形得到，而学生程序的图形位置、色彩、形状均有较大差异时，MSE 或 SSIM 在整体上得到的性质是趋同的。很显然这种程序在判题上应当不予通过。

最后考虑平凡的算法，即使用逐像素比对的简单算法。但这也有困难：学生可能提交的程序有轻微色差，或者位置上有小程度偏移，或者旋转角度不合适；但这些在教学领域上是可以被接受的误差。逐像素比对对于上述差异接受程度很低，因此不适用。

因此综上所述，我针对 GUI-OJ 中所需的图像比对需求，设计了一种特殊的、专用的算法。

== GUI-OJ 图像比对算法

该算法的核心思想是：先提取画布中的所有可视元素，对每个元素的整体性状做分析，然后对元素之间的关系、以及背景相关性做分析，最后综合上述因素给出总体的相似度指标。因此，该算法分为如下三个步骤。 

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

若联合轮廓只有一个元素，那么不考虑相对位置相似度（即设为 $1$）。只有两个元素时，以两个元素之间距离的差作为相似度。三个及以上元素时，使用 Mantel 测试算法判断相似程度，该算法常在生态学研究上用于判断环境效应是否存在。#citation

最后考察背景部分的相似程度。考虑到 2D 图形界面程序的简单性，此处只判断颜色的相似程度即颜色差。

记图像 $bold(X)$ 的背景部分，即去除所有轮廓的内含之后的剩余像素点集合为 $beta_(bold(X))=bold(X) - limits(union)_(c in cal(C)(bold(X))) integral_c$。记该像素点集的红通道、绿通道和蓝通道的平均值为 $R_beta_(bold(X))$、$G_beta_(bold(X))$ 和 $B_beta_(bold(X))$。记通道 $I$ 的颜色差 $Delta_I = I_beta_(bold(A)) - I_beta_(bold(B))$。

则 _背景颜色相似度_ $d_B$ 的定义由下式给出；它根据人眼对三原色的敏感度做了权重调整。#citation

$ d_B(bold(A), bold(B)) = cases(
  sqrt(2 Delta_R^2 + 4 Delta_G^2 + 3 Delta_B^2) "," macron(R) < 1 / 2,
  sqrt(3 Delta_R^2 + 4 Delta_G^2 + 2 Delta_B^2) "," macron(R) >= 1 / 2,
) $

其中 $macron(R) = 1/2 (R_beta_(bold(A)) + R_beta_(bold(B)))$。

// https://en.wikipedia.org/wiki/Color_difference

*步骤 3* 综合步骤 2 分元素得到的 $d_N$、$d_S$、$d_I$、$d_R$ 和 $d_B$，给出整体图像相似度的公式如下：

$ op("Diff") (bold(A), bold(B)) = (1 - d_N) dot.op (w_S f(d_S) + w_I f(d_I) + w_R d_R + w_B d_B) $

其中 $w_S$、$w_I$、$w_R$ 和 $w_B$ 为权重参数，在原型中取值分别为 $0.3$、$0.3$、$0.2$ 和 $0.2$。$f$ 为非线性调整函数；当图像比较相似时 $d_S$ 和 $d_I$ 差异过小，不适合判题。$f(x)$ 在原型中取值为 $x^6$。

== 图像比对算法效果示例

// insert a table here
// sun - sun (position diff)
// sun - lesser sun
// four point - three point
// circle - square
// background diff

== 图像比对算法的缺陷与改进

在设计算法时，刻意地忽略了元素的平移效应，因为用户程序不太可能完美复刻标准图像中的具体位置。但是，元素大小和元素的旋转却没有得到考虑。这也是上述算法的两个严重问题。

在处理元素大小时，相同大小的元素容易出现匹配联合轮廓时的错误匹配。解决方法：在比较大小时保留一定阈值，在接近阈值范围内的元素使用基于相对位置的匹配。

在处理元素旋转时，由于采用了 Hu-矩比较轮廓形状，因此旋转因素被忽略。这导致判题程序将认为旋转过的元素也是正确的，这不符合预期结果。解决方法：改用不使用 Hu-矩的轮廓比较算法，目前还需要进一步调研。

== 运行时库的部署与改进

运行时库是为了补足规则解释系统采用的 DSL 的不足而设计的，因此它被设计为嵌入规则解释系统。

在原型实现的 DSL 中，引入了 JavaScript 的 _ImportDeclaration_，即导入声明；若该声明来自某个特定的模块标识符（在原型中为 `graduate`），则将其解释为对运行时库中实体的导入。实现上，只需在 Babel 转译过程中将该标识符翻译为运行时库 JavaScript 模块的路径即可。

对于如图像相似度算法等非 JS 实现的程序，则通过 Node.js `child_process` 模块启动 Python 解释器执行。这会导致性能降低并导致性能瓶颈，但目前系统的功能较为简单，因而暂时忽略此问题。后续可考虑改为基于 C 接口的 FFI 调用。

此外，部分运行时库接口的设计不合理，如读取图片数据需要从第三方 URL 加载等等。这些设计的改进需要配合整体系统部署以及前端实现的改进。

= 宏语言 DefDef <defdef>

本章讨论专为 GUI-OJ 设计的一种宏性质 DSL——DefDef。

GUI-OJ 与传统 OJ 的最大不同点即在于不同判题后端提供功能各异的图形界面判题功能。DefDef（可认为是 Definition-of-the-Definition 的缩写，即“判题功能定义的定义”）以宏语言的方式，提供了在不同的系统模块中组织这些功能的能力。

在 @packages 所述的系统模块结构中，涉及判题功能列表的模块有：
- 判题后端：需要作为 JSON-RPC 服务端，给出判题功能的具体实现；
- RDCCS：需要将各项判题功能描述作为 JSON-RPC 请求转发给判题后端；
- 判题规则描述系统：需要将规则描述转换为对应的 JSON-RPC 请求格式；
- 前端：需要生成相关的智能提示、可视化编辑信息等。

上述四个组件都或多或少需要用到判题功能的信息，若分开管理它们，则难以同步、更新迭代。因此 DefDef 提供了这样的管理方法：编写一份 DefDef 源码，通过 DefDef 转译器生成上述各个模块所需要的格式的信息，从而实现统一管理。

DefDef 使用解析表达文法（Parsing Expression Grammar，PEG）作为文法格式。它相比传统的上下文无关文法（Context-Free Grammar，CFG）更加简洁，且可以直接转换为递归下降解析器。出于篇幅的原因，我不在这里列出完整的 DefDef 文法定义；但可以从一个 DefDef 的示例来了解它的基本结构。

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
) <defdef-sample>

DefDef 的设计借鉴了 C/C++、TypeScript 和 Rust。它的语法简单，目前只有三个关键字 `using` `define` 和 `with`。其中 `using` 用于表明判题类别，`define` 用于标记规则代码形式，`with` 用来标记 JSON-RPC 的请求参数格式。

DefDef 的基本结构是一个个的定义，对应于一项判题后端的功能。每个定义由三部分组成：
- 特性（Attributes，可选）：用于描述该定义的特性，如描述、可视化编辑信息等；
- 规则代码形式：在规则代码中使用后端操纵对象的形式，如 `$("...").count`，带有类型信息；
- JSON-RPC 请求格式：用于描述该功能对应的 JSON-RPC 请求格式。

#fix_id

DefDef 的规则代码形式采用“链式调用”格式，即函数调用运算符和成员访问运算符的结合；该写法自由度较高，且适用于大多数场景。比如 @defdef-sample 中的 `$(selector: string).count` 规则形式就表明规则代码中的 `$("button").count` 代码指代一个后端操纵命令，其对应的 JSON-RPC 请求方法名为 `selector`，附加参数为 `component: "count"`。

GUI-OJ 的规则代码形式秉持着直观、易用的原则；如上述规则形式中的 `$` 操纵对象就来自于常用的 jQuery 库的选择器；又如 `win.title` 规则形式中的 `win` 就指代 Windows 窗口。

每个规则的额外信息可以通过特性或者特性内部的子语法来描述。如 `blockly` 特性代表前端可视化编辑器的相关工具定义；其内部的 `#` 占位符子语法用来标记该工具定义的接口。

此外，DefDef 可以通过预处理命令嵌入其它编程语言的信息。目前阶段，它支持 `#ts` `#endts` 预处理命令来嵌入 TypeScript 代码，以更好地生成供前端使用的智能提示信息。

DefDef 语言使用 `deftools` 转译器读取。该转译器会生成每个模块所需的数据。原型设计中，DefDef 会对规则解释系统和前端生成相关数据，包括从代码形式到 JSON-RPC 请求的转换规则、智能提示（类型）信息和可视化编辑信息等。

DefDef 的语义比较完备，因此还可以在如下模块中嵌入；它们尚未在本论文的原型设计中实现：
- 提供给 RDCCS 的防御式编程检查：检查来自规则解释系统的 JSON-RPC 请求是否在 DefDef 定义中，该设定可防止来自恶意的规则编写者的攻击；
- 提供给判题后端的单元测试模块：检查判题后端是否实现了全部 DefDef 所给定的功能。

= 前端用户界面实现 <frontend>

== 原型设计的前端



== 依赖于 DefDef 的规则智能提示系统

== 完整的 GUI-OJ 系统前端概述

= 用户程序安全性 <security>

== 通用 OJ 系统的安全功能考察

== 原型设计的安全性缺陷

== GUI-OJ 系统的可用安全性保障措施考察

= 系统部署 <deployment>

== 通用 OJ 系统的部署方案考察

== GUI-OJ 系统的可用部署方案考察

= 结论 <conclusion>

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
- `transpiler` 对应于规则解释系统（@transpiler）及 DefDef 宏语言定义（@defdef）。
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
