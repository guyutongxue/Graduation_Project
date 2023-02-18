"use web";
{
  assert: $.title == "Calculator"
}
{
  for (let i = 0; i < 5; i++) {
    const a = Math.floor(Math.random() * 100);
    const b = Math.floor(Math.random() * 100);
    $("#a").input(a.toString());
    $("#b").input(b.toString());
    $("#calculate").click();
    assert: $("#c").text == (a + b).toString();
  }
}
