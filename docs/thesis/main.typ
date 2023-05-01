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

类似地，本论文将提出一种非传统的 OJ 系统。为了引入这一系统的特点，我们介绍图形用户界面程序的相关概念。

== 图形用户界面程序简介

_图形用户界面_（Graphical User Interface，GUI）是指采用图形方式显示的计算机操作用户界面。与早期计算机使用的命令行界面相比，除了降低用户的操作负担之外，对于新用户而言，图形界面对于用户来说在视觉上更易于接受，学习成本大幅下降，也让电脑的大众化得以实现。 *CITATION NEEDED*

图形用户界面可以是具体的、运行在某绘图环境中的图形界面，也可以是抽象的，运行在某高层次画布（如 HTML、WXML 等）及相关虚拟机平台的图形界面。这些图形界面通常由图形元素构成，比如按钮、文本框、下拉菜单等。

考虑到 OJ 系统在科班教学中的良好效应，如果将类似的软件系统运用于 GUI 程序设计的教学中，则会显著提高 GUI 程序设计的学习效率。因此，本文试图提出一种针对 GUI 的 OJ 系统的构成，即将 OJ 系统的判题流程扩展到图形用户界面程序的判别上。在下文中，我们称这种 OJ 系统为 GUI-OJ。此外，我还实现了 GUI-OJ 的 _原型_ 系统，以验证本软件系统结构的可行性。

本论文的结构如下：
- @packages 讨论了 GUI-OJ 软件系统的边界和组件划分问题；
- @categories 讨论了原型实现选择的题目分类，及对每个题目类别的判题方法讨论；
- @transpiler 讨论了规则描述语言的设计，以及原型的实现细节；
- @ipc 讨论了将规则解释系统与判题后端结合的工作，以及其中的跨进程通信问题；
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

GUI-OJ 系统的输出主要包括：
- *判题结果*：对于给定的用户程序和题目规则，返回该用户程序是否 _通过_。

以上输入输出部分为 GUI-OJ 软件系统的边界。若将 GUI-OJ 系统作为最终用户的后端（Backend），则与该系统边界交互的部分称为 _前端_。

接下来考虑 GUI-OJ 与传统 OJ 的不同点。GUI-OJ 的用户程序具有图形界面，而不同的图形界面程序的运行环境、运行方式都有很大的不同，因此判题规则也会随之变得多样化，无法基于传统 OJ 的输入输出模板实现。因此我们需要如下的组件设计。

== 判题规则描述系统

_判题规则描述系统_ 是 GUI-OJ 与传统 OJ 的最大不同点，它责解析教室和比赛组织者提供的判题规则描述。该规则描述通常是用户友好的，但其具有结构复杂、形式多样化的特点，因此需要单独模块将其解析成可供其它模块直接使用的数据结构。

在本文提出的原型设计中，该系统的用户端使用基于 JavaScript AST 的领域特定语言描述判题规则，并以 Blockly 可视化程序设计界面作为辅助，最终生成直接供 Node.js 运行的脚本。其实现细节将在 @transpiler 中讨论。

== 规则派发与通信控制系统和判题后端

虽然个人计算机上的图形用户界面在物理层面上大多是基于键盘、鼠标进行输入输出交互，但是大部分图形界面程序可以提供更高层次的抽象，如按钮、文本框等等。抽象层次的不同，也决定了程序设计方法的不同和程序功能的不同；在判题逻辑上，也需要做相应的分类讨论。

因此在结构上，需要有一个单独的系统负责将判题规则划分为若干 _类别_，从而每个类别内部的判题流程可以统一处理。我们称之为 _规则派发与通信控制系统_，该系统也负责处理用户程序输入和判题结果的输出。对于每一个题目类别，提供对应的 _判题后端_，实现相应的判题流程。

原型设计使用 Node.js 作为该系统的实现框架；其实现细节将在 @ipc 中讨论。原型设计综合考虑抽象层次和实际情况，实现了三个判题后端：Web 程序、Windows 窗体程序和 Python turtle 2D 图形程序。
- Web 程序是抽象层度最高的图形界面程序；它的图形界面由 DOM（文档对象模型）组织，可以非常方便地使用浏览器相关 API 直接操作。
- Windows 窗体程序的抽象层次与 Web 类似，我们可以通过焦点控制、自动化测试等框架选中其中的可操作控件，但是产生提到操作本身仍然需要键盘和鼠标的事件模拟。
- Python turtle 2D 图形程序是最低层次的抽象，它只提供最简单的绘图功能。

上述判题后端的实现细节，以及其它分类的讨论将在 @categories 中给出。

== 前端

作为系统边界的前端的设计也是 GUI-OJ 系统需要考虑的问题。原型设计提供了供研究者测试用的 Web 前端用户界面，使用 React 框架实现。该实现细节，连同更宏观的生产环境前端设计，将在 @frontend 中讨论。

= 判题后端实现 <categories>

== Web 程序

Web 程序是当前互联网时代的最主流应用程序。它不仅应用在浏览器等传统 Web 环境中，也适用于桌面程序（Electron、Tauri 等）和移动程序（React Native、Flutter 等）。Web 程序通常使用 JavaScript 作为开发语言，并用 HTML 和 CSS 处理图形界面布局，但也可以使用 TypeScript、CoffeeScript、Dart 等语言开发。

在原型设计中，我们先假定 Web 程序只运行在浏览器中（且是现代浏览器，即符合 W3C 最近五年规范的浏览器），从而简化问题的处理。在该假设下，我们只需要使用一个遵循规范的、可由程序控制的浏览器，如 Chromium，就可以实现对 Web 程序的判题。

在原型设计中，我采用了 Puppeteer 库 *CITATION NEEDED* 。该库可用于控制 Chromium 浏览器的行为，如加载页面、审查元素等等。Puppeteer 库提供了一个 Node.js 的 API，因此可以直接在 Node.js 环境中使用。稍后 @ipc 所呈现的控制系统也在 Node.js 环境中运行，因此 Web 段的判题控制会相对容易很多。

另一方面，我们还需要将 Web 程序呈现在网页上。我们假定目前判题后端接收到的是一系列静态网页素材，那么浏览器可以有两种方式加载这些素材：
- 通过 HTTP 服务器加载，这是最常见的方式，也是原型设计采用的方式。
- 通过本地文件系统协议（`file://`）加载，这种方式可以避免 HTTP 服务配置，拥有更优的性能。但是本地文件系统协议的跨域访问通常是被禁止的 *CITATION NEEDED* ，从而许多功能无法正常运行。

为了尽可能在生产环境模拟 Web 程序的运作，我们选择本地启动一个轻量的 HTTP 服务器。在原型设计中，我们使用了 Fastify 库 *CITATION NEEDED*。它也是 Node.js 环境下的新型 HTTP 服务端库，相比传统的 Express 等库，它的性能更好。

对于网页中的特定元素选择，可直接使用 CSS 选择器语法。它在 Chromium 浏览器内部受支持，且在 JavaScript 中也有对应的 API。

/* @fig_web */ 展示了上述 Web 端判题程序的模块结构。

该判题后端支持如下动作：
- 页面中特定 DOM 元素的点击；
- 页面中特定 DOM 输入元素的输入；
- 发送键盘按键。

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

从 Windows 95 开始，系统便内置了可供程序操作的操作系统接口，其名为 Microsoft Active Accessibility（MSAA） *CITATION NEEDED*。MSAA 为 Windows 窗体程序提供了一套标准的、可供程序访问的接口，包括控件树的获取、控件属性的获取、控件操作的执行等等。MSAA 也是早期 Windows 窗体程序的无障碍访问渠道，因此，任何一个 Windows 窗体程序都支持 MSAA （但非 Windows 窗体的程序，即“自绘窗体”，仍然使用起来有不便之处）。在随后的数十年内，该功能逐步升级为 UI Automation（UIA），以 C\# 和 C++ 的形式提供接口。 *CITATION NEEDED*

原型设计并没有选择直接调用 UIA，而是选择其上的一个包装库 FlaUI  *CITATION NEEDED*。该库为 C\# 库，可以简单地用 .NET 运行时来测试所有 Windows 窗体程序。在原型设计中，我们使用了 .NET 7 运行时；虽然它不在操作系统上预装，但是能够获得更多的性能提升，并提升开发人员的编码效率。

不同于 DOM，Windows 窗体控件树没有一个合适的控件选择语法。因此我提供了如下选择方式：
- 基于文本的选择：给定按钮文本、标签文本或文本框的文本，然后查找所有空间中符合文本或包含文本的控件。
- 基于 `automationId` 的选择：在 UIA 中，每个元素拥有其独立标识 `automationId`；在未经优化的 C\# Windows 窗体程序中，该名称等价于控件的名称（`Name` 属性）。因此，我们若限制用户程序的编写方法，则可以通过 `automationId` 来选择某一特定控件。但是，对于没有限制的程序，这不是一个合适的手段。
- 基于文本及其周边空间的查找来选择：在窗体程序中，一个常见的模式为“标签+文本框”（如 /* @img_??? */），我们在对标签进行基于文本的严格查找后，划定其坐标周围的范围，来查找其附近文本框。这种方式通用性相比前两种更弱，但是在大多数场合更常用。

/* @fig_forms */ 展示了上述 Windows 窗体程序判题后端的模块结构。

该判题后端支持如下动作：
- 点击按钮；
- 切换单选框（Radio Button）、复选框（Check Box）；
- 设置文本框的文本；
- 设置组合框（Combo Box）的选项；

该判题后端支持如下属性的读取：
- 窗体标题；
- 控件文本；
- 空间的启用性。

以上功能基本覆盖了简单的 Windows 窗体程序的测试需要。

== Python turtle 2D 图形程序

Python 是当前最流行的编程语言，也是非专业计算机学习者最常用的编程语言。Python `turtle` 是 Python 的一个标准库，它提供了一个简单的绘图接口，可以用来绘制 2D 图形。

`turtle` 库的设计来源于 Logo 编程语言的绘图库。*CITATION NEEDED* 该绘图库假想一只带着画笔的海龟可以接受简单的命令，例如向前走 100 步，或者左转 30 度。通过对这只海龟发送命令，可以让它绘制出较为复杂的图形，例如正方形，三角形，圆等。*CITATION NEEDED*  Python 的 `turtle` 库提供若干全局函数，以实现类似 Logo 绘图的命令式接口；同时，它也提供面向对象的接口，以实现更为复杂的图形。*CITATION NEEDED*

对于这类程序的判别，需要考虑如下问题：
+ 作为解释型语言，需要提供合适的解释器即运行环境；
+ 限制用户程序可能影响判题的操作，如调整绘图速度、创建多个窗口等；
+ 一个合适的 2D 绘图正确性判定方法。

对于第一个问题，我们选择了 Python 3.11 并创建虚拟环境以免本机其它依赖库的干扰。对于第二个问题，可以使用打桩技术（Interpositioning）来限制 `turtle` 标准库的行为；即通过 `importlib` 控制导入库的行为，从而将 `turtle` 标准库的导入重定向到一个 GUI-OJ 系统内的、受限制的“伪” `turtle` 库即可。

对于第三个问题，在本论文提出的设计思路中，将使用一个专门针对教学用 2D 绘图的图像比对算法，将用户程序产生的图像与标准图像进行比对，得到相似率，并以某个阈值作为判定标准。该算法将在 @rtlib 中展开描述。

同时，该判题后端需要模拟键盘事件和鼠标事件，以发送给用户程序，观察其变化。该判题后端需要实现窗体的“截图”功能，以便于进行图像比对。由于上述操作接近 Windows 系统底层，故该判题后端使用 C++ 实现。

/* @fig_forms */ 展示了上述判题后端的模块结构。

该判题后端支持如下动作：
- 发送点击事件；
- 发送按键事件；

该判题后端支持如下属性的读取：
- 窗体标题； // 还没有做，可能是忘了
- 窗体截图。

由于 2D 绘图程序本身的特性，该判题后端的功能较简洁，必须依赖于规则制订者提供详细的判题规则。

== 其它程序类别与跨平台问题

可在 Windows 下运行的其它窗体程序，也可以有选择地接入到上述判题后端。对于含有控件树的窗体（不限于 C\# Windows 窗体，包括 MFC、Qt、TKinter、WPF、WinUI 3 或 MAUI 等开发流程），可以直接接入“Windows 窗体程序”判题后端，但是不能直接使用 `automationId` 。对于“自绘窗体”，则可以使用类似“Python turtle 2D 绘图程序”判题后端的思路，但是需要在细节上做一些修改。

对于 Electron 或 Tauri 等基于 Web 界面的程序，可以使用类似“Web 程序”判题后端的思路，但是在细节上要做大量修改，比如直接启动程序而非额外的 HTTP 服务器；使用 Puppeteer 时，需要将 Chromium 指定为 Electron 内的 Chromium 或系统的 WebView 等。

非 Windows 的 GUI 程序则更加难以处理。非 Windows 系统上，GUI 程序的实现多种多样：既可以直接使用 X *CITATION NEEDED*；也可以使用 GTK、Qt 等跨平台的 GUI 库。对于这些程序，需要针对性地设计判题后端，没有很好的统一处理的途径。因此，本次原型设计对非 Windows 的 GUI 程序暂时不做考虑。

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

= 宏语言 DefDef <defdef>

= 前端用户界面实现 <frontend>

== 本原型设计的前端用户界面

== 依赖于 DefDef 的规则智能提示系统

== GUI-OJ 系统的前端功能性考察

= 用户程序安全性 <security>

== 通用 OJ 系统的安全功能考察

== 本原型设计的安全性缺陷

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

请访问 #text(blue, link("https://github.com/Guyutongxue/Graduation_Project")[GitHub: Guyutongxue/Graduation_Project]) 仓库。
