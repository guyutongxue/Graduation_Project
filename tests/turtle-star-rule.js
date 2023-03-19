"use graphics.turtle";
import { createImageFromUrl, imageSimilarity } from "utils";
{
    const standard = await createImageFromUrl("https://s1.ax1x.com/2023/03/12/ppMKu5T.png");
    const user = g.screenshot();
    const s = await imageSimilarity(standard, user);
    assert: s < 0;
}
