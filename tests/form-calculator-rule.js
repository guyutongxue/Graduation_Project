"use form";
{
  win.textBoxWithName("textBox1").input('36');
  win.textBoxWithName("textBox2").input('64');
  win.buttonWithText('计算').click();
  assert: '100' in win.textOf("label2");
}
