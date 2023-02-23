start
  = _ types:tsBlock? _ defs:(@unit _)* { return { types, defs }; }

tsBlock
  = "#" [ \t]* "ts" [ \t]* newline
  	definitions:$tsLine* 
    "#" [ \t]* "endts" [ \t]* newline
    { return definitions; }

tsLine
  = first:[^#\n] rest:[^\n]* newline
  / newline

unit = usingDecl / def

usingDecl "Using declaration"
  = "using" _ category:category _ ";"? { return category; }

category "Category"
  = "web" / "form"

def "Rule definition"
  = attr:(@attributes _)?
    "define" _ form:form _ 
    type:(":" _ @type _)?
    "=>" _ production:production _  ";"? 
    { return { attr, form, type, production }; }

attributes
  = "[[" _ first:attribute rest:(_ "," _ @attribute)* _ "]]" {
    return Object.fromEntries([first, ...rest]);
  }

attribute
  = key:id _ "=" _ value:literal { return [key, value]; }

production "Production"
  = method:methodName param:paramClause? {
    const r = { method };
    if (param) {
      for (const [k, v] of param) {
        r[k] = v;
      }
    }
    return r;
  }

paramClause "Parameter clause"
  = _ "with" _ "{" _ kv:(paramKV+) _ "}" { return kv; }

form "Rule form"
  = top:topLevelId _ rest:restPart * { return [{ type: "identifier", identifier: top }, ...rest]; }

topLevelId "Top level identifier"
  = id:id { return id; }

restPart "Rest part"
  = "." _ identifier:id { return { type: "identifier", identifier }; }
  / "(" _ parameters:parameters? _ ")" { 
    return { type: "call", parameters: parameters ?? [] }; 
  }

parameters "Parameters"
  = head:parameter tail:(_ "," _ @parameter)* { return [head, ...tail]; }

parameter "Parameter"
  = name:paramId type:(_ ":" _ @type)? { return { name, type }; }

paramId "Parameter identifier"
  = id

type "Type notation"
  = id

methodName "Method name"
  = id

paramKV "Param Key & Value"
  = k:id _ ":" _ v:literal { return [k, v]; }

id
  = !keyword f:[a-zA-Z_$] r:[a-zA-Z0-9_$]* { return f + r.join(""); }

literal "Literal"
  = numericLiteral
  / stringLiteral
  
numericLiteral
  = c:[0-9]+ { return Number(c.join("")); }

stringLiteral
  = "\"" c:sChar* "\"" { return c.join(""); }

sChar
  = [^"\\]
  / "\\" e:[tnr"\\] { return e; }

keyword "Keyword"
  = "with"
  / "define"
  / "using"

_
  = ([ \t\r\n] / comment)*

newline
  = "\n"
  / "\r\n"

comment "Comment"
  = "//" [^\n]* "\n"*
