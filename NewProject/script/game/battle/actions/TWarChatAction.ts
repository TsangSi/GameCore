/*
 * @Author: hrd
 * @Date: 2022-09-26 10:30:11
 * @Description: TWarChatAction 战斗喊话
 *
 */

import EntityBattle from '../../entity/EntityBattle';
import { ActionBase } from './base/ActionBase';

export class TWarChatAction extends ActionBase {
    /** 喊话内容 */
    private mStrArr: string[] = [];
    private mEntity: EntityBattle = null;

    /**
     *
     * @param entity 喊话对象
     * @param talkId 喊话类型
     * @returns
     */
    public static Create(entity: EntityBattle, str: string[] = []): TWarChatAction {
        const action = new TWarChatAction();
        action.mStrArr = str;
        action.mEntity = entity;

        return action;
    }

    public onEnter(): void {
        super.onEnter();
        this.onPlay();
    }

    private onPlay() {
        if (!(this.mEntity && cc.isValid(this.mEntity))) {
            return;
        }
        //
        const strArr = this.mStrArr;
        if (!strArr) return;
        const entity = this.mEntity;
        entity.setChat(strArr);
    }
}
