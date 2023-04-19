#import "helpers.typ": *
#import "../third_parties/tablex.typ" : tablex, rowspanx, colspanx

#let 字号 = (
  初号: 42pt,
  小初: 36pt,
  一号: 26pt,
  小一: 24pt,
  二号: 22pt,
  小二: 18pt,
  三号: 16pt,
  小三: 15pt,
  四号: 14pt,
  中四: 13pt,
  小四: 12pt,
  五号: 10.5pt,
  小五: 9pt,
  六号: 7.5pt,
  小六: 6.5pt,
  七号: 5.5pt,
  小七: 5pt,
)

#let 字体 = (
  仿宋: ("Times New Roman", "FangSong"),
  宋体: ("Times New Roman", "Source Han Serif SC", "SimSun"),
  黑体: ("Calibri", "SimHei"),
  楷体: ("Times New Roman", "KaiTi", "SimKai"),
  代码: ("New Computer Modern Mono", "Consolas", "Courier New"),
)

#let textit(it) = [
  #set text(font: 字体.楷体, style: "italic")
  #h(0em, weak: true)
  #it
  #h(0em, weak: true)
]

#let textbf(it) = [
  #set text(font: 字体.黑体, weight: "semibold")
  #h(0em, weak: true)
  #it
  #h(0em, weak: true)
]

#let lengthceil(len, unit: 字号.小四) = calc.ceil(len / unit) * unit

#let partcounter = counter("part")
#let chaptercounter = counter("chapter")
#let appendixcounter = counter("appendix")
#let rawcounter = counter(figure.where(kind: "code"))
#let imagecounter = counter(figure.where(kind: image))
#let tablecounter = counter(figure.where(kind: table))
#let equationcounter = counter(math.equation)
#let appendix() = {
  appendixcounter.update(10)
  chaptercounter.update(())
  counter(heading).update(())
}

#let chinesenumber(num, standalone: false) = if num < 11 {
  ("零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十").at(num)
} else if num < 100 {
  if calc.mod(num, 10) == 0 {
    chinesenumber(calc.floor(num / 10)) + "十"
  } else if num < 20 and standalone {
    "十" + chinesenumber(calc.mod(num, 10))
  } else {
    chinesenumber(calc.floor(num / 10)) + "十" + chinesenumber(calc.mod(num, 10))
  }
} else if num < 1000 {
  let left = chinesenumber(calc.floor(num / 100)) + "百"
  if calc.mod(num, 100) == 0 {
    left
  } else if calc.mod(num, 100) < 10 {
    left + "零" + chinesenumber(calc.mod(num, 100))
  } else {
    left + chinesenumber(calc.mod(num, 100))
  }
} else {
  let left = chinesenumber(calc.floor(num / 1000)) + "千"
  if calc.mod(num, 1000) == 0 {
    left
  } else if calc.mod(num, 1000) < 10 {
    left + "零" + chinesenumber(calc.mod(num, 1000))
  } else if calc.mod(num, 1000) < 100 {
    left + "零" + chinesenumber(calc.mod(num, 1000))
  } else {
    left + chinesenumber(calc.mod(num, 1000))
  }
}

#let chinesenumbering(..nums, location: none, brackets: false) = locate(loc => {
  let actual_loc = if location == none { loc } else { location }
  if appendixcounter.at(actual_loc).first() < 10 {
    if nums.pos().len() == 1 {
      "第" + chinesenumber(nums.pos().first(), standalone: true) + "章"
    } else {
      numbering(if brackets { "(1.1)" } else { "1.1" }, ..nums)
    }
  } else {
    if nums.pos().len() == 1 {
      "附录 " + numbering("A.1", ..nums)
    } else {
      numbering(if brackets { "(A.1)" } else { "A.1" }, ..nums)
    }
  }
})

#let underlineCell(body, width: 350pt) = {
  rect(
    width: width,
    stroke: (bottom: 1pt, rest: none),
    [
      #set align(center)
      #set text(size: 字号.一号, font: 字体.黑体, weight: "bold")
      #body
    ]
  )
}

#let chineseoutline(title: "目录", depth: none, indent: false) = {
  heading(title, numbering: none, outlined: false)
  locate(it => {
    let elements = query(heading.where(outlined: true), after: it)

    for el in elements {
      // Skip list of images and list of tables
      if partcounter.at(el.location()).first() < 20 and el.numbering == none { continue }

      // Skip headings that are too deep
      if depth != none and el.level > depth { continue }

      let maybe_number = if el.numbering != none {
        if el.numbering == chinesenumbering {
          chinesenumbering(..counter(heading).at(el.location()), location: el.location())
        } else {
          numbering(el.numbering, ..counter(heading).at(el.location()))
        }
        h(0.5em)
      }

      let line = {
        if indent {
          h(1em * (el.level - 1 ))
        }

        if el.level == 1 {
          v(0.5em, weak: true)
        }

        if maybe_number != none {
          style(styles => {
            let width = measure(maybe_number, styles).width
            box(
              width: lengthceil(width),
              if el.level == 1 {
                textbf(maybe_number)
              } else {
                maybe_number
              }
            )
          })
        }

        if el.level == 1 {
          textbf(el.body)
        } else {
          el.body
        }

        // Filler dots
        if el.level == 1 {
          box(width: 1fr, h(10pt) + box(width: 1fr) + h(10pt))
        } else {
          box(width: 1fr, h(10pt) + box(width: 1fr, repeat[.]) + h(10pt))
        }

        // Page number
        let footer = query(<__footer__>, after: el.location())
        let page_number = if footer == () {
          0
        } else {
          counter(page).at(footer.first().location()).first()
        }
        if el.level == 1 {
          textbf(str(page_number))
        } else {
          str(page_number)
        }

        linebreak()
        v(-0.2em)
      }

      link(el.location(), line)
    }
  })
}

#let listoffigures(title: "插图", kind: image) = {
  heading(title, numbering: none, outlined: false)
  locate(it => {
    let elements = query(figure.where(kind: kind), after: it)

    for el in elements {
      let maybe_number = {
        let el_loc = el.location()
        chinesenumbering(chaptercounter.at(el_loc).first(), counter(figure.where(kind: kind)).at(el_loc).first(), location: el_loc)
        h(0.5em)
      }
      let line = {
        style(styles => {
          let width = measure(maybe_number, styles).width
          box(
            width: lengthceil(width),
            maybe_number
          )
        })

        el.caption

        // Filler dots
        box(width: 1fr, h(10pt) + box(width: 1fr, repeat[.]) + h(10pt))

        // Page number
        let footers = query(<__footer__>, after: el.location())
        let page_number = if footers == () {
          0
        } else {
          counter(page).at(footers.first().location()).first()
        }
        str(page_number)
        linebreak()
        v(-0.2em)
      }

      link(el.location(), line)
    }
  })
}

#let codeblock(raw, caption: none, outline: false) = {
  figure(
    if outline {
      rect(width: 100%)[
        #set align(left)
        #raw
      ]
    } else {
      set align(left)
      raw
    },
    caption: caption, kind: "code", supplement: ""
  )
}

#let booktab(columns: (), aligns: (), width: auto, caption: none, ..cells) = {
  let headers = cells.pos().slice(0, columns.len())
  let contents = cells.pos().slice(columns.len(), cells.pos().len())
  set align(center)

  if aligns == () {
    for i in range(0, columns.len()) {
      aligns.push(center)
    }
  }

  let content_aligns = ()
  for i in range(0, contents.len()) {
    content_aligns.push(aligns.at(calc.mod(i, aligns.len())))
  }

  figure(
    block(
      width: width,
      grid(
        columns: (auto),
        row-gutter: 1em,
        line(length: 100%),
        [
          #set align(center)
          #box(
            width: 100% - 1em,
            grid(
              columns: columns,
              ..zip(headers, aligns).map(it => [
                #set align(it.last())
                #textbf(it.first())
              ])
            )
          )
        ],
        line(length: 100%),
        [
          #set align(center)
          #box(
            width: 100% - 1em,
            grid(
              columns: columns,
              row-gutter: 1em,
              ..zip(contents, content_aligns).map(it => [
                #set align(it.last())
                #it.first()
              ])
            )
          )
        ],
        line(length: 100%),
      ),
    ),
    caption: caption,
    kind: table
  )
}

#let conf(
  author: "张三",
  // enAuthor: "Zhang San",
  studentId: "19000xxxxx",
  // blindId: "L2023XXXXX",
  thesisName: "本科生毕业论文",
  header: "北京大学博士学位论文",
  title: "北京大学学位论文 Typst 模板",
  enTitle: "Typst Template for Peking University Dissertations",
  school: "某个学院",
  // firstMajor: "某个一级学科",
  major: "某个专业",
  // enMajor: "Some Major",
  // direction: "某个研究方向",
  supervisor: "李四",
  // enSupervisor: "Li Si",
  svDept: "某个学院",
  svTitle: "教授",
  date: "二〇二三年五月",
  abstract: [],
  keywords: (),
  enAbstract: [],
  enKeywords: (),
  acknowledgements: [],
  lineSpacing: 1em,
  outlineDepth: 3,
  // blind: false,
  listOfImage: false,
  listOfTable: false,
  listOfCode: false,
  // oddStartPage: true,
  doc,
) = {
  set page("a4",
    header: locate(loc => {
      [
        #set text(字号.五号)
        #set align(center)
        #if partcounter.at(loc).at(0) < 10 {
          // Handle the first page of Chinese abstract specailly
          // let headings = query(heading, after: loc)
          // let next_heading = if headings == () {
          //   ()
          // } else {
          //   headings.first().body
          // }
          // if next_heading == "摘要" and calc.odd(loc.page()) {
          //   [
          //     摘要
          //     #v(-1em)
          //     #line(length: 100%)
          //   ]
          // }
        } else if partcounter.at(loc).at(0) > 20 {
        } else {
          // if calc.even(loc.page()) {
            [
              #align(center, header)
              #v(-1em)
              #line(length: 100%)
            ]
          // } else {
          //   let footers = query(<__footer__>, after: loc)
          //   let elems = if footers == () {
          //     ()
          //   } else {
          //     query(
          //       heading.where(level: 1), before: footers.first().location()
          //     )
          //   }
          //   if elems == () {
          //   } else {
          //     let el = elems.last()
          //     [
          //       #let numbering = if el.numbering == chinesenumbering {
          //         chinesenumbering(..counter(heading).at(el.location()), location: el.location())
          //       } else if el.numbering != none {
          //         numbering(el.numbering, ..counter(heading).at(el.location()))
          //       }
          //       #if numbering != none {
          //         numbering
          //         h(0.5em)
          //       }
          //       #el.body
          //       #v(-1em)
          //       #line(length: 100%)
          //     ]
          //   }
          // }
      }]}),
    footer: locate(loc => {
      [
        #set text(字号.五号)
        #set align(center)
        #if query(heading, before: loc).len() < 2 or query(heading, after: loc).len() == 0 {
          // Skip cover, copyright and origin pages
        } else {
          let headers = query(heading, before: loc)
          let part = partcounter.at(headers.last().location()).first()
          [
            #if part < 20 {
              numbering("I", counter(page).at(loc).first())
            } else {
              str(counter(page).at(loc).first())
            }
          ]
        }
        #label("__footer__")
      ]
    }),
    margin: (
      top: 30mm,
      bottom: 25mm,
      y: 26mm
    )
  )

  set text(字号.一号, font: 字体.宋体, lang: "zh")
  set align(center + horizon)
  set heading(numbering: chinesenumbering)
  set figure(
    numbering: (..nums) => locate(loc => {
      if appendixcounter.at(loc).first() < 10 {
        numbering("1.1", chaptercounter.at(loc).first(), ..nums)
      } else {
        numbering("A.1", chaptercounter.at(loc).first(), ..nums)
      }
    })
  )
  set math.equation(
    numbering: (..nums) => locate(loc => {
      set text(font: 字体.宋体)
      if appendixcounter.at(loc).first() < 10 {
        numbering("(1.1)", chaptercounter.at(loc).first(), ..nums)
      } else {
        numbering("(A.1)", chaptercounter.at(loc).first(), ..nums)
      }
    })
  )
  set list(indent: 2em)
  set enum(indent: 2em)

  show strong: it => textbf(it)
  show emph: it => textit(it)
  show par: set block(spacing: lineSpacing)
  show raw: set text(font: 字体.代码)

  show heading: it => [
    // Cancel indentation for headings of level 2 or above
    #set par(first-line-indent: 0em)

    #let sizedheading(it, size) = [
      #set text(size)
      #v(2em)
      #if it.numbering != none {
        textbf(counter(heading).display())
        h(0.5em)
      }
      #textbf(it.body)
      #v(1em)
    ]

    #if it.level == 1 {
      // if not it.body.text in ("Abstract", "学位论文使用授权说明")  {
        pagebreak(weak: true)
      // }
      locate(loc => {
        // if it.body.text == "摘要" {
        //   partcounter.update(10)
        //   counter(page).update(1)
        // } else 
        if it.numbering != none and partcounter.at(loc).first() < 20 {
          partcounter.update(20)
          counter(page).update(1)
        }
      })
      if it.numbering != none {
        chaptercounter.step()
      }
      imagecounter.update(())
      tablecounter.update(())
      rawcounter.update(())
      equationcounter.update(())

      set align(center)
      sizedheading(it, 字号.三号)
    } else {
      if it.level == 2 {
        sizedheading(it, 字号.四号)
      } else if it.level == 3 {
        sizedheading(it, 字号.中四)
      } else {
        sizedheading(it, 字号.小四)
      }
    }
  ]

  show figure: it => [
    #set align(center)
    #if not it.has("kind") {
      it
    } else if it.kind == image {
      it.body
      [
        #set text(字号.五号)
        图
        #locate(loc => {
          chinesenumbering(chaptercounter.at(loc).first(), imagecounter.at(loc).first(), location: loc)
        })
        #h(1em)
        #it.caption
      ]
    } else if it.kind == table {
      [
        #set text(字号.五号)
        表
        #locate(loc => {
          chinesenumbering(chaptercounter.at(loc).first(), tablecounter.at(loc).first(), location: loc)
        })
        #h(1em)
        #it.caption
      ]
      it.body
    } else if it.kind == "code" {
      [
        #set text(字号.五号)
        代码
        #locate(loc => {
          chinesenumbering(chaptercounter.at(loc).first(), rawcounter.at(loc).first(), location: loc)
        })
        #h(1em)
        #it.caption
      ]
      it.body
    }
  ]

  show ref: it => {
    locate(loc => {
      let elems = query(it.target, loc)

      if elems == () {
        // Keep citations as is
        it
      } else {
        // Remove prefix spacing
        h(0em, weak: true)

        let el = elems.first()
        let el_loc = el.location()
        if el.func() == math.equation {
          // Handle equations
          link(el_loc, [
            式
            #chinesenumbering(chaptercounter.at(el_loc).first(), equationcounter.at(el_loc).first(), location: el_loc, brackets: true)
          ])
        } else if el.func() == figure {
          // Handle figures
          if el.kind == image {
            link(el_loc, [
              图
              #chinesenumbering(chaptercounter.at(el_loc).first(), imagecounter.at(el_loc).first(), location: el_loc)
            ])
          } else if el.kind == table {
            link(el_loc, [
              表
              #chinesenumbering(chaptercounter.at(el_loc).first(), tablecounter.at(el_loc).first(), location: el_loc)
            ])
          } else if el.kind == "code" {
            link(el_loc, [
              代码
              #chinesenumbering(chaptercounter.at(el_loc).first(), rawcounter.at(el_loc).first(), location: el_loc)
            ])
          }
        } else if el.func() == heading {
          // Handle headings
          if el.level == 1 {
            link(el_loc, chinesenumbering(..counter(heading).at(el_loc), location: el_loc))
          } else {
            link(el_loc, [
              节
              #chinesenumbering(..counter(heading).at(el_loc), location: el_loc)
            ])
          }
        } else {
          // Handle code blocks
          // Since the ref is linked to the code block instead of the internal
          // `figure`, we need to do an extra query here.
          let figure_el = query(figure, after: el_loc).first()
          let el_loc = figure_el.location()
          link(el_loc, [
            #if figure_el.kind == image {
              [图]
            } else if figure_el.kind == table {
              [表]
            } else if figure_el.kind == "code" {
              [代码]
            }
            #chinesenumbering(
              chaptercounter.at(el_loc).first(),
              counter(figure.where(kind: figure_el.kind)).at(el_loc).first(), location: el_loc
           )]
          )
        }

        // Remove suffix spacing
        h(0em, weak: true)
      }
    })
  }

  let fieldname(name) = [
    // #set align(right + top)
    #set text(size: 字号.小三, font: 字体.黑体)
    #textbf(name)
  ]

  let fieldvalue(value) = [
    #set align(center + horizon)
    #set text(size: 字号.三号, font: 字体.仿宋)
    #rect(
      width: 15em,
      stroke: (bottom: 1pt, rest: none),
      [#value]
    )
  ]

  // if blind {
  //   set align(center + top)
  //   text(字号.初号)[#textbf(header)]
  //   linebreak()
  //   set text(字号.三号, font: 字体.仿宋)
  //   set par(justify: true, leading: 1em)
  //   [（匿名评阅论文封面）]
  //   v(2fr)
  //   grid(
  //     columns: (80pt, 320pt),
  //     row-gutter: 1.5em,
  //     align(left + top)[中文题目：],
  //     align(left + top)[#title],
  //     align(left + top)[英文题目：],
  //     align(left + top)[#enTitle],
  //   )
  //   v(2em)
  //   grid(
  //     columns: (80pt, 320pt),
  //     row-gutter: 1.5em,
  //     align(left + top)[一级学科：],
  //     align(left + top)[#firstMajor],
  //     align(left + top)[二级学科：],
  //     align(left + top)[#major],
  //     align(left + top)[论文编号：],
  //     align(left + top)[#blindId],
  //   )

  //   v(4fr)
  //   text(字号.小二, font: 字体.仿宋)[#date]
  //   v(1fr)
  // } else {
    box(
      grid(
        columns: (auto, auto),
        gutter: 0.4em,
        image("../img/pkulogo.svg", height: 2.7em, fit: "contain"),
        image("../img/pkuword.svg", height: 1.8em, fit: "contain")
      )
    )
    linebreak()
    text(size: 字号.小初, textbf(thesisName))

    set text(字号.二号)
    v(60pt)
    grid(
      columns: (auto, auto),
      row-gutter: 14pt,
      [
        #set align(right + bottom)
        题目：
      ],
      [
        #set align(center + horizon)
        #underlineCell(title)
      ],
      [],
      [
        #set align(center + horizon)
        #underlineCell(enTitle)
      ]
    )

    v(60pt)

    grid(
      columns: (auto, auto),
      row-gutter: 12pt,
      fieldname[姓#h(2em)名：],
      fieldvalue(author),
      fieldname[学#h(2em)号：],
      fieldvalue(studentId),
      fieldname[院#h(2em)系：],
      fieldvalue(school),
      fieldname[专#h(2em)业：],
      fieldvalue(major),
      // fieldname("研究方向："),
      // fieldvalue(direction),
      fieldname[导师姓名：],
      fieldvalue(supervisor),
    )

    v(60pt)
    text(字号.三号, textbf[#date])
  // }

  // locate(loc => {
  //   if oddStartPage {
  //     pagebreak()
  //   }
  // })
  
  pagebreak()
  
  set align(left)
  set text(size: 字号.小四)
  
  align(center, text(size: 16pt)[北京大学本科毕业论文导师评阅表])
  
  v(1em)
  
  block(height: 100% - 64pt, table(
    columns: (1fr),
    rows: (auto, auto, 1fr),
    inset: 0pt,
    stroke: none,
    tablex(
      columns: (auto, auto, auto, 10em, auto, 1fr),
      align: horizon,
      inset: 0.7em,
      [学生姓名], author,[本科院系], school, rowspanx(2)[论文成绩 \ （等级制）], rowspanx(2)[],
      [学生学号], studentId, [本科专业], major,
      [导师姓名], supervisor,[导师单位/ \ 所在学院], svDept, [导师职称], svTitle,
    ),
    tablex(
      columns: (auto, auto, 1fr),
      align: horizon,
      inset: 0.7em,
      rowspanx(2)[论文题目],[#h(1em)中文#h(1em)],[可视化程序设计 OJ 技术研究],
      [#h(1em)英文#h(1em)],[Visual Programming Online Judge Techonology Research],
    ),
    table(
      columns: (1fr),
      rows: (1fr),
      inset: 1em,
      [
        #set align(center + top)
        导师评语
        
        _（包含对论文的性质、难度、分量、综合训练等是否符合培养目标的目的等评价）_

        #place(
          bottom + right,
          dx: -3em,
          [导师签名： #h(8em) \ \ \ #h(2em) 年 #h(2em) 月 #h(2em)  日]
        )
      ]
    )
  ))

  set align(left + top)
  set text(字号.小四)
  heading(numbering: none, outlined: false, "版权声明")
  par(justify: true, first-line-indent: 2em, leading: lineSpacing)[
    任何收存和保管本论文各种版本的单位和个人，未经本论文作者同意，不得将本论文转借他人，亦不得随意复制、抄录、拍照或以任何方式传播。否则，引起有碍作者著作权之问题，将可能承担法律责任。
  ]

  // locate(loc => {
  //   if oddStartPage {
  //     pagebreak()
  //   }
  // })

  par(justify: true, first-line-indent: 2em, leading: lineSpacing)[
    #heading(numbering: none, outlined: false, "摘要")
    #abstract
    // #v(1fr)
    #v(1em)
    #set par(first-line-indent: 0em)
    *关键词：*
    #keywords.join("，")
    #v(2em)
  ]
  pagebreak()

  locate(loc => {
    // if oddStartPage and calc.even(loc.page()) {
    //   pagebreak()
    // }

    par(justify: true, first-line-indent: 2em, leading: lineSpacing)[
      // #[
      //   #set text(字号.小二)
      //   #set align(center)
      //   #textbf(enTitle)
      // ]
      // #[
      //   #set align(center)
      //   #enAuthor \(#enMajor\) \
      //   Directed by #enSupervisor
      // ]
      #heading(numbering: none, outlined: false, "Abstract")
      #enAbstract
      // #v(1fr)
      #v(1em)
      #set par(first-line-indent: 0em)
      *Keywords:*
      #h(0.5em, weak: true)
      #enKeywords.join(", ")
      #v(2em)
    ]
  })
  pagebreak()

  locate(loc => {
    // if oddStartPage and calc.even(loc.page()) {
    //   pagebreak()
    // }

    chineseoutline(
      title: "目录",
      depth: outlineDepth,
      indent: true,
    )
  })

  if listOfImage {
    listoffigures()
  }

  if listOfTable {
    listoffigures(title: "表格", kind: table)
  }

  if listOfCode {
    listoffigures(title: "代码", kind: "code")
  }

  set align(left + top)
  par(justify: true, first-line-indent: 2em, leading: lineSpacing)[
    #doc
  ]

  // if not blind {
    par(justify: true, first-line-indent: 2em, leading: lineSpacing)[
      #heading(numbering: none, "致谢")
      #acknowledgements
    ]

    partcounter.update(30)
    heading(numbering: none, "北京大学学位论文原创性声明和使用授权说明")
    align(center)[#heading(level: 2, numbering: none, outlined: false, "原创性声明")]
    par(justify: true, first-line-indent: 2em, leading: lineSpacing)[
      本人郑重声明：
      所呈交的学位论文，是本人在导师的指导下，独立进行研究工作所取得的成果。
      除文中已经注明引用的内容外，
      本论文不含任何其他个人或集体已经发表或撰写过的作品或成果。
      对本文的研究做出重要贡献的个人和集体，均已在文中以明确方式标明。
      本声明的法律结果由本人承担。

      #v(1em)

      #align(right)[
        论文作者签名：
        #h(5em) \
        日期：
        #h(2em)
        年
        #h(2em)
        月
        #h(2em)
        日
      ]

      #v(100pt)

      #align(center)[#heading(level: 2, numbering: none, outlined: false, "学位论文使用授权说明")]
      #v(-0.33em, weak: true)
      // #align(center)[#text(字号.五号)[（必须装订在提交学校图书馆的印刷本）]]
      #v(字号.小三)

      本人完全了解北京大学关于收集、保存、使用学位论文的规定，即：

      - 按照学校要求提交学位论文的印刷本和电子版本；
      - 学校有权保存学位论文的印刷本和电子版，并提供目录检索与阅览服务，在校园网上提供服务；
      - 学校可以采用影印、缩印、数字化或其它复制手段保存论文/* ；
      - 因某种特殊原因须要延迟发布学位论文电子版，授权学校 #box[#rect(width: 9pt, height: 9pt)] 一年 /	 #box[#rect(width: 9pt, height: 9pt)] 两年 / #box[#rect(width: 9pt, height: 9pt)] 三年以后，在校园网上全文发布 */。

      // #align(center)[（保密论文在解密后遵守此规定）]

      #v(1em)
      #align(right)[
        论文作者签名：
        #h(5em)
        导师签名：
        #h(5em) \
        日期：
        #h(2em)
        年
        #h(2em)
        月
        #h(2em)
        日
      ]
    ]
  // }
}