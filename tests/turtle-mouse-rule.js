"use graphics.turtle";
import { createImageFromUrl, imageSimilarity } from "utils";
{
    const standard = await createImageFromUrl("https://s1.ax1x.com/2023/03/27/ppsovjJ.png");
    g.click(0.25, 0.25);
    g.click(0.75, 0.25);
    g.click(0.25, 0.75);
    g.click(0.75, 0.75);
    const user = g.screenshot();
    const s = await imageSimilarity(standard, user);
    assert: s < 0;
}
