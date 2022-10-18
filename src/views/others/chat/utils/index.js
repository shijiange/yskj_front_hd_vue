import * as Date from "./date";

/**
 * 生成16进制随机颜色值
 * @returns string 随机16进制颜色值
 */
export function generateRandomColor() {
  let value = "#";
  for (let index = 0; index < 6; index++) {
    value += colorValues[parseInt(Math.random() * 16)];
  }
  return value;
}

export default {
  ...Date,
  generateRandomColor
};