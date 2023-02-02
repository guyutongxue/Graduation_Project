using AustinHarris.JsonRpc;
using FlaUI.UIA3;
using FlaUI.Core.AutomationElements;
using FlaUI.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace formcheck
{
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
      path = @"C:\Users\guyutongxue\Documents\MyFiles\Code\Csharp\WeiboFishHack\WeiboFishHack\bin\Debug\net7.0-windows\WeiboFishHack.exe";

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
    void clickButtonByText(string text)
    {
      var window = app.GetMainWindow(automation);
      var buttons = window.FindAllDescendants(cf => cf.ByText(text));
      if (buttons.Length != 1)
      {
        throw new Exception("Multiple button or no button");
      }
      buttons[0].Click();
    }

    [JsonRpcMethod]
    void clickButtonByName(string name)
    {
      if (app is null || automation is null)
      {
        throw new NullReferenceException();
      }
      var window = app.GetMainWindow(automation);
      var buttons = window.FindAllDescendants(cf => cf.ByAutomationId(name));
      if (buttons.Length != 1)
      {
        throw new Exception("Multiple button or no button");
      }
      buttons[0].Click();
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
