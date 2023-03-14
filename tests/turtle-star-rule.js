"use graphics.turtle";
import { createImageFromUrl, compareImageStrict } from "utils";
{
    const expected = await createImageFromUrl("https://s1.ax1x.com/2023/03/12/ppMKu5T.png");
    const current = g.screenshot();
    assert: await compareImageStrict(current, expected);
}
