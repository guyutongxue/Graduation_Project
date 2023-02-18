using FlaUI.Core.Input;
using FlaUI.Core.WindowsAPI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace formcheck
{
  interface IKey
  {
    void Press();
  }
  class ControlKey : IKey
  {
    VirtualKeyShort? keyCode;

    public ControlKey(string controlName)
    {
      keyCode = controlName switch
      {
        "F1" => VirtualKeyShort.F1,
        "F2" => VirtualKeyShort.F2,
        "F3" => VirtualKeyShort.F3,
        "F4" => VirtualKeyShort.F4,
        "F5" => VirtualKeyShort.F5,
        "F6" => VirtualKeyShort.F6,
        "F7" => VirtualKeyShort.F7,
        "F8" => VirtualKeyShort.F8,
        "F9" => VirtualKeyShort.F9,
        "F10" => VirtualKeyShort.F10,
        "F11" => VirtualKeyShort.F11,
        "F12" => VirtualKeyShort.F12,
        "TAB" => VirtualKeyShort.TAB,
        "ESC" => VirtualKeyShort.ESC,
        "ENTER" => VirtualKeyShort.ENTER,
        "BACKSPACE" => VirtualKeyShort.BACK,
        "DELETE" => VirtualKeyShort.DELETE,
        "UP" => VirtualKeyShort.UP,
        "DOWN" => VirtualKeyShort.DOWN,
        "LEFT" => VirtualKeyShort.LEFT,
        "RIGHT" => VirtualKeyShort.RIGHT,
        "HOME" => VirtualKeyShort.HOME,
        "INSERT" => VirtualKeyShort.INSERT,
        "LT" => null,
        _ => throw new InvalidDataException($"{controlName} not valid")
      };
    }

    public void Press()
    {
      if (keyCode is VirtualKeyShort k)
      {
        Keyboard.Press(k);
      } else
      {
        Keyboard.Type("<");
      }
    }
  }

  class TextKey : IKey
  {
    string Text { get; set; }
    public TextKey(string text) { Text = text; }

    public void Press()
    {
      Keyboard.Type(Text);
    }
  }
  
  static class KeyPresser
  {
    static public void Press(string keys)
    {
      var inControl = false;
      var currentSnip = "";
      var keyList = new List<IKey>();
      for (int i = 0; i < keys.Length; i++)
      {
        if (inControl && keys[i] == '>')
        {
          keyList.Add(new ControlKey(currentSnip));
          inControl = false;
          currentSnip = "";
          continue;
        } else if (!inControl && keys[i] == '<')
        {
          keyList.Add(new TextKey(currentSnip));
          inControl = true;
          currentSnip = "";
          continue;
        } else
        {
          currentSnip += keys[i];
        }
      }
      if (currentSnip != "")
      {
        if (inControl)
        {
          throw new InvalidDataException("Unterminate control key name");
        }
        keyList.Add(new TextKey(currentSnip));
      }
      foreach (var key in keyList)
      {
        key.Press();
      }
    }
  }
}
