/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: hrd
 * @Date: 2022-06-23 15:54:42
 * @FilePath: \SanGuo2.4\assets\script\game\battle\actions\base\UnitEntityAction.ts
 * @Description: 角色动作
 *
 */

import EntityBattle from '../../../entity/EntityBattle';
import { EntityAcionName } from '../../../entity/EntityConst';
import { ActionBase } from './ActionBase';

export class UnitEntityAction extends ActionBase {
    private mActionName: EntityAcionName = null;
    private mEntity: EntityBattle;
    private mDirect: number = null;

    public static Create(src: EntityBattle, name: EntityAcionName, direct: number = null): UnitEntityAction {
        const action = new UnitEntityAction();
        action.mActionName = name;
        action.mEntity = src;
        action.mDirect = direct;
        return action;
    }

    public onEnter(): void {
        super.onEnter();
        if (cc.isValid(this.mEntity)) {
            this.mEntity.forcePlay = true;
            this.mEntity.setPlaySpeed(this.mWar.getSpeed());
            switch (this.mActionName) {
                case EntityAcionName.run:
                    this.mEntity.mAnimState.run(this.mDirect);
                    break;
                case EntityAcionName.stand:
                    this.mEntity.mAnimState.stand(this.mDirect);
                    break;
                case EntityAcionName.atk0:
                    this.mEntity.mAnimState.attack(this.mDirect);
                    break;
                default:
                    this.mEntity.mAnimState.skill(this.mActionName, this.mDirect);
                    break;
            }
        }
    }
}
