/* eslint-disable dot-notation */
/*
 * @Author: hrd
 * @Date: 2022-05-12 17:02:45
 * @FilePath: \SanGuo\assets\script\game\entity\EntityBattle.ts
 * @Description:
 *
 */

import { UtilCocos } from '../../app/base/utils/UtilCocos';
import { EntityAi } from '../battle/ai/EntityAi';
import { RoleInfo } from '../module/role/RoleInfo';
import Entity from './Entity';
import { EntityUnitType, MonsterType } from './EntityConst';

export default class EntityBattle extends Entity {
    public mAi: EntityAi = null;
    public _fightUnit: FightUnit = null;
    private _roleInfo: RoleInfo = null;

    public unitType: EntityUnitType = null;
    public monsterType: MonsterType = null;
    public isSelfCamp: boolean = false;

    public initAi(): void {
        if (this.mAi) return;
        const ai = new EntityAi();
        ai.init(this);
        this.mAi = ai;
    }

    public set FightUnit(v: FightUnit) {
        this._fightUnit = v;
    }

    public get FightUnit(): FightUnit {
        return this._fightUnit;
    }

    public set roleInfo(myData: RoleInfo) {
        this._roleInfo = myData;
    }
    public get roleInfo(): RoleInfo {
        return this._roleInfo;
    }

    /**
     * 显示buff 图标
     * @param id buff id
     * @param v 值
     * @param iconPath 图标资源路径
     * @returns
     */
    public showBuffIcon(id: number, v: number, iconPath?: string): void {
        const buffGroup: cc.Node = this.getBuffLayer().node;
        if (!buffGroup) return;
        const childList = buffGroup.children || [];
        if (v) {
            let curEle: cc.Node = null;
            for (let i = 0; i < childList.length; i++) {
                const ele = childList[i];
                if (ele['buff_id'] === id) {
                    curEle = ele;
                    break;
                }
            }
            if (!curEle) {
                const icon = buffGroup.getChildByName('icon');
                curEle = cc.instantiate(icon);
                curEle.active = true;
                curEle.name = 'bffIcon';
                curEle['buff_id'] = id;
                buffGroup.addChild(curEle);
                const path = iconPath;
                UtilCocos.LoadSpriteFrameRemote(curEle.getComponent(cc.Sprite), path);
            }
            curEle.getChildByName('LabNum').getComponent(cc.Label).string = `${v}`;
        } else if (childList.length) {
            for (let i = childList.length - 1; i >= 0; i--) {
                const ele = childList[i];
                if (ele['buff_id'] === id) {
                    // ele.removeFromParent();
                    ele.destroy();
                    break;
                }
            }
        }
    }

    public set hp(v: number) {
        if (v < 0) v = 0;
        const maxHp = this._roleInfo.d.FMaxHp;
        this._roleInfo.d.FCurrHp = v;
        const curHp = this._roleInfo.d.FCurrHp;
        const val = curHp / maxHp;
        this.setHpBar(val);
    }

    public get hp(): number {
        const curHp = this._roleInfo.d.FCurrHp;
        return curHp;
    }

    public set maxHp(v: number) {
        if (v < 0) v = 0;
        this._roleInfo.d.FMaxHp = v;
    }

    public get maxHp(): number {
        return this._roleInfo.d.FMaxHp;
    }

    public setEntityScale(scale: number, upHpPos: boolean = false): void {
        super.setEntityScale(scale);
        const bloodNd = this.getBloodBoxCom();
        if (bloodNd && upHpPos) {
            const y = bloodNd.y;
            const newY = y * scale;
            bloodNd.y = newY;
        }
    }

    public release(): void {
        if (this.mAi) {
            this.mAi.clear();
        }
        super.release();
    }
}
