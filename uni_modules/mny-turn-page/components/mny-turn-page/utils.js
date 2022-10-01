/*
 * @Description:
 * @Autor: maonianyou@foxmail.com
 * @Date: 2022-10-01 21:59:20
 * @LastEditors: Archmage | 大法师 <maonianyou@pay.media>
 */

export function isPC() {
  //判断pc端与移动端
  const userAgentInfo = navigator.userAgent;
  const agents = [
    "Android",
    "iPhone",
    "SymbianOS",
    "Windows Phone",
    "iPad",
    "iPod",
  ];
  return !agents.some((n) => userAgentInfo.includes(n));
}
