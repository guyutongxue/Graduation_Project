namespace FormCalculator
{
  public partial class Form1 : Form
  {
    public Form1()
    {
      InitializeComponent();
    }

    private void button1_Click(object sender, EventArgs e)
    {
      var a = int.Parse(textBox1.Text);
      var b = int.Parse(textBox2.Text);
      label2.Text = $"= {a + b}";
    }
  }
}
