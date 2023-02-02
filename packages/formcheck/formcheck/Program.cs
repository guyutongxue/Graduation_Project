using System.Diagnostics;
using System.Net;
using AustinHarris.JsonRpc;
using System.Text;

namespace formcheck
{
  class Program { 
    static void Listen(int port)
    {
      using var obj = new Handler();
      var listener = new HttpListener();
      listener.Prefixes.Add($"http://localhost:{port}/");
      listener.Start();

      var httpRequestHandle = (HttpListenerRequest request) => {
        if (request.HttpMethod == "POST")
        {
          using var sr = new StreamReader(request.InputStream, Encoding.UTF8);
          var task = JsonRpcProcessor.Process(sr.ReadToEnd());
          return task.Result;
        }
        else
        {
          return "Method not supported";
        }
      };

      while (true)
      {
        ThreadPool.QueueUserWorkItem(
            (c) => {
              var context = c as HttpListenerContext;
              var request = context.Request;
              var response = context.Response;

              try
              {
                string responseText = httpRequestHandle(request);
                byte[] buf = Encoding.UTF8.GetBytes(responseText);
                response.ContentLength64 = buf.Length;
                response.OutputStream.Write(buf, 0, buf.Length);
              }
              catch (Exception ex)
              {
                Console.WriteLine(ex.Message);
              }
              finally
              {
                response.OutputStream.Close();
              }

            }
            , listener.GetContext());
      }

    }

    static void Main(String[] args)
    {
      //if (args.Length < 1 || !int.TryParse(args[1], out var port)) {
      //  throw new Exception("Port not number");
      //}
      Listen(9876);
    }
  
  }
}


