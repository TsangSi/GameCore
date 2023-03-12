/* eslint-disable @typescript-eslint/no-unused-vars */
/*
 * @Author: kexd
 * @Date: 2022-05-12 17:01:55
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-12-07 12:21:32
 * @FilePath: \SanGuo2.4\assets\script\game\entity\EntityMonster.ts
 * @Description:
 *
 */

import { ANIM_TYPE, ACTION_DIRECT, ACTION_TYPE } from '../base/anim/AnimCfg';
import MapCfg from '../map/MapCfg';
import { RoleInfo } from '../module/role/RoleInfo';
import Entity from './Entity';

export class EntityMonster extends Entity {
    private _roleInfo: RoleInfo = null;

    public constructor(
        resId: number | string,
        resType: ANIM_TYPE,
        dir: ACTION_DIRECT = ACTION_DIRECT.DOWN,
        actType: ACTION_TYPE = ACTION_TYPE.STAND,
        wrapMode: number = cc.WrapMode.Loop,
        isFight: boolean = false,
    ) {
        super(resId, resType, dir, actType, wrapMode, isFight);
        this.name = 'EntityMonster';
    }

    public set roleInfo(myData: RoleInfo) {
        this._roleInfo = myData;
    }
    public get roleInfo(): RoleInfo {
        return this._roleInfo;
    }

    public mainUpdate(dt: number): void {
        //
    }

    /**
     * 销毁
     */
    public release(): void {
        super.release();
        this._roleInfo = null;
        if (this.isValid) {
            this.destroy();
        }
    }
}
