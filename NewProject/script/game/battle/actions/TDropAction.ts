/*
 * @Author: hrd
 * @Date: 2022-11-08 10:24:10
 * @Description: 掉落行为
 *
 */

import { ActionBase } from './base/ActionBase';

export class TDropAction extends ActionBase {
    /** 道具飞行目标坐标 */
    private _tagPos: cc.Vec2 = null;
    /** 道具掉落坐标 */
    private _fromPos: cc.Vec2 = null;
    /** 道具数据 */
    private _itemDataArr: ItemData[] = null;
    public static Create(tagPos: cc.Vec2, fromPos: cc.Vec2, itemArr: ItemData[]): TDropAction {
        const action = new TDropAction();
        action._tagPos = tagPos;
        action._fromPos = fromPos;
        action._itemDataArr = itemArr;
        return action;
    }

    public onEnter(): void {
        //
    }

    private playDropAnim(): void {
        //

    }
}
