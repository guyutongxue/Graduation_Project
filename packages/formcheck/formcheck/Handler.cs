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

    Application? app;
    UIA3Automation? automation;

    [JsonRpcMethod]
    bool initialize(string path)
    {
      Environment.CurrentDirectory = (Path.GetDirectoryName(path) ?? "");
      app = Application.Launch(path);
      automation = new UIA3Automation();
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
        throw new Exception("Multiple button or no button");
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
          return null;
        case "inputTextBox":
          {
            if (e.AsTextBox() is TextBox textBox && value is not null)
            {
              if (textBox.IsReadOnly)
              {
                throw new InvalidOperationException("Try to input to a readonly textbox.");
              }
              textBox.Text = value;
              return null;
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
            return e.Name;
          }
        default: return null;
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
        throw new Exception("Multiple button or no button");
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
    }
  }

}
