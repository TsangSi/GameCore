/*
 * @Author: kexd
 * @Date: 2022-04-25 15:40:31
 * @LastEditors: kexd
 * @LastEditTime: 2022-04-26 17:55:15
 * @FilePath: \sanguo\assets\script\app\base\map\road\Point.ts
 * @Description:Point
 *
 */
export default class Point {
    public x:number = 0;
    public y:number = 0;

    public constructor(x:number = 0, y:number = 0) {
        this.x = x;
        this.y = y;
    }
}
