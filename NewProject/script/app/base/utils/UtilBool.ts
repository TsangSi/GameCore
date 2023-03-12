/*
 * @Author: hwx
 * @Date: 2022-03-30 14:47:15
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-08-18 21:11:20
 * @FilePath: \SanGuo\assets\script\base\utils\UtilBool.ts
 * @Description: 布尔工具类
 */
/**
 * 布尔工具类
 */
export class UtilBool {
    /** 获取随机布尔值 @returns 真/假 */
    // public static Random(): boolean {
    //     return Math.random() > 0.5;
    // }

    /** 判断一个对象或者基本类型的变量是否存在 */
    public static isNullOrUndefined(a: any): boolean {
        return a === null || a === undefined;
    }
}
