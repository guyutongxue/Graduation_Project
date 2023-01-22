// See https://aka.ms/new-console-template for more information
using FlaUI.UIA3;
using FlaUI.Core;
using Microsoft.Build.Evaluation;
using Microsoft.Build.Execution;
using Microsoft.Build.Logging;
using Buildalyzer;
using System.Diagnostics;

static void Build(string solutionFilepath)
{
  // C:\Program Files\Microsoft Visual Studio\2022\Community\Common7\IDE\CommonExtensions\Microsoft\NuGet\Microsoft.Build.NuGetSdkResolver.dll
  var msbuildRoot = @"C:\Program Files\Microsoft Visual Studio\2022\Community\MsBuild";
  var msbuildExe = Path.Combine(msbuildRoot, @"Current\Bin\MsBuild.exe");
  //var sdkPath = Path.Combine(msbuildRoot, "Sdks");
  Environment.SetEnvironmentVariable("MSBUILD_EXE_PATH", msbuildExe);
  //Environment.SetEnvironmentVariable("MSBUILDSDKSPATH", @"C:\Program Files\dotnet\sdk\7.0.102");
  //Environment.SetEnvironmentVariable("MSBuildExtensionsPath", msbuildRoot);

  var proc = Process.Start(new ProcessStartInfo
  {
    FileName = msbuildExe,
    WorkingDirectory = msbuildRoot,
    Arguments = solutionFilepath
  });
  proc.WaitForExit();

  //var pc = new ProjectCollection();
  //var bp = new BuildParameters(pc);
  //var logger = new ConsoleLogger();
  //bp.Loggers = new [] { logger };
  //var properties = new Dictionary<string, string> {
  //  { "Configuration", "Debug" },
  //  { "Platform", "Any CPU" }
  //};
  //var req = new BuildRequestData(
  //  solutionFilepath,
  //  properties,
  //  null,
  //  new string[] { "Rebuild" },
  //  null
  //);

  //var br = BuildManager.DefaultBuildManager.Build(
  //  bp,
  //  req
  //);
  //Console.WriteLine( br );
}

static void Check(string exePath)
{
  Application? app = null;
  try
  {
    Console.WriteLine("Hello, World!");
    app = Application.Launch("notepad.exe");
    using var automation = new UIA3Automation();
    var window = app.GetMainWindow(automation);
    Console.WriteLine(window.Title);
  }
  finally
  {
    app?.Close();
  }
}

Build(@"C:\Users\guyutongxue\Documents\MyFiles\Code\Csharp\WeiboFishHack\WeiboFishHack\WeiboFishHack.csproj");
