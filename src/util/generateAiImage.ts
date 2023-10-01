import axios from "axios";
import { Computerender } from "computerender";

export async function generateImage() {
//   const randomInt = Math.floor(Math.random() * (20000 - 0 + 1)) + 1;
  const cr = new Computerender(process.env.COM_RENDER_KEY);
  const params = {
    prompt:
      "white background,Hyperrealistic,Unreal Engine, 8K, Ultra-High Definition, highest quality, High quality texture,realistic photo,full body,white background, mythical beast",
    seed: 7777,
  };

  try {
    const imageResult = await cr.generateImage(params);
    console.log(imageResult, "resultよ");
    return imageResult;
  } catch (error) {
    console.error("Error generating image:", error);
    // エラーレスポンスを送信
    res.status(500).json({ name: "Image generation failed" });
  }
}
