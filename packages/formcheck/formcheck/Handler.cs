using AustinHarris.JsonRpc;
using FlaUI.UIA3;
using FlaUI.Core.AutomationElements;
using FlaUI.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using FlaUI.Core.Input;

namespace formcheck
{
  struct ByTextArg
  {
    public string text;
    public string action;
    public string? value;
  }
  struct ByNameArg
  {
    public string name;
    public string action;
    public string? value;
  }

  struct KeyArg
  {
    public string keys;
  }

  class Handler : JsonRpcService, IDisposable
  {
    public Handler()
    {
      Console.WriteLine("Handler registered. Do not optimize me");
    }

    string path = "";
    Application? app;
    UIA3Automation? automation;

    [JsonRpcMethod]
    bool initialize(string path)
    {
      this.path = Path.GetDirectoryName(path) ?? "";
      Environment.CurrentDirectory = this.path;
      app = Application.Launch(this.path);
      automation = new UIA3Automation();
      return true;
    }

    [JsonRpcMethod]
    bool restart()
    {
      app?.Close();
      app?.Dispose();
      app = Application.Launch(this.path);
      return true;
    }

    [JsonRpcMethod]
    string title()
    {
      if (app is null || automation is null)
      {
        throw new NullReferenceException();
      }
      var window = app.GetMainWindow(automation);
      return window.Title;
    }

    [JsonRpcMethod]
    object? byText(ByTextArg arg)
    {
      if (app is null || automation is null)
      {
        throw new NullReferenceException();
      }
      var window = app.GetMainWindow(automation);
      var eles = window.FindAllDescendants(cf => cf.ByText(arg.text));
      if (eles.Length != 1)
      {
        throw new Exception("Multiple element or no element");
      }
      return ActionOnElement(eles[0], arg.action, arg.value);
    }

    object? ActionOnElement(AutomationElement e, string action, string? value)
    {
      switch (action)
      {
        case "clickButton": 
          e.Click();
          Thread.Sleep(100);
          return true;
        case "inputTextBox":
          {
            if (e.AsTextBox() is TextBox textBox && value is not null)
            {
              if (textBox.IsReadOnly)
              {
                throw new InvalidOperationException("Try to input to a read-only textbox.");
              }
              textBox.Text = value;
              Thread.Sleep(100);
              return textBox.Text;
            }
            else
            {
              throw new NullReferenceException("Element is not a textbox");
            }
          }
        case "enabled": return e.IsEnabled;
        case "text":
          {
            if (e.AsLabel() is Label l)
            {
              return l.Text;
            }
            if (e.AsTextBox() is TextBox tb)
            {
              return tb.Text;
            }
            if (e.AsComboBox() is  ComboBox cb)
            {
              return cb.SelectedItem.Text;
            }
            return e.Name;
          }
        case "checked":
          {
            if (e.AsCheckBox() is CheckBox cb)
            {
              return cb.IsChecked;
            }
            if (e.AsRadioButton() is RadioButton rb)
            {
              return rb.IsChecked;
            }
            throw new InvalidOperationException("Element is neither CheckBox nor RadioButton");
          }
        case "toggleCheck":
          {
            if (e.AsCheckBox() is CheckBox cb)
            {
              cb.IsChecked = !cb.IsChecked;
            } else if (e.AsRadioButton() is RadioButton rb)
            {
              rb.IsChecked = !rb.IsChecked;
            } else
            {
              throw new InvalidOperationException("Element is neither CheckBox nor RadioButton");
            }
            Thread.Sleep(100);
            return true;
          }
        case "selectCombo":
          {
            if (e.AsComboBox() is ComboBox cb)
            {
              return cb.Select(value);
            }
            throw new InvalidOperationException("Element is not a ComboBox");
          }
        default:
          {
            return false;
          }
      }
    }

    [JsonRpcMethod]
    object? byName(ByNameArg arg)
    {
      if (app is null || automation is null)
      {
        throw new NullReferenceException();
      }
      var window = app.GetMainWindow(automation);
      var eles = window.FindAllDescendants(cf => cf.ByAutomationId(arg.name));
      if (eles.Length != 1)
      {
        throw new Exception("Multiple element or no element");
      }
      return ActionOnElement(eles[0], arg.action, arg.value);
    }

    [JsonRpcMethod]
    object? key(KeyArg arg)
    {
      if (app is null || automation is null)
      {
        throw new NullReferenceException();
      }
      var window = app.GetMainWindow(automation);
      window.Focus();
      KeyPresser.Press(arg.keys);
      Thread.Sleep(100);
      return null;
    }

    [JsonRpcMethod]
    void dispose()
    {
      Dispose();
    }

    public void Dispose()
    {
      automation?.Dispose();
      app?.Close();
      app?.Dispose();
    }
  }

}
