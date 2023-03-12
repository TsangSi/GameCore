/*
 * @Author: zs
 * @Date: 2022-07-12 17:20:42
 * @FilePath: \SanGuo-2.4-main\assets\script\game\module\roleskin\v\RoleSkinPageBase.ts
 * @Description:
 *
 */

import { Executor } from '../../../../app/base/executor/Executor';
import { ResMgr } from '../../../../app/core/res/ResMgr';
import { WinTabPage } from '../../../com/win/WinTabPage';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import ModelMgr from '../../../manager/ModelMgr';
import { ICfgRoleSkin, SUIT_PART_COUNT, SUIT_PART_STAR } from './RoleSkinConst';

const { ccclass, property } = cc._decorator;

interface IFieldCfgSkin {
    [field: number]: ICfgRoleSkin[]
}
@ccclass
export class RoleSkinPageBase extends WinTabPage {
    /** 当前选中的皮肤，套装的话就是当前选中的套装id */
    protected get selectSuitId(): number {
        return this.proxyFunc(this.RoleSkinCommon, 'getSelectSkinId') || 0;
    }
    /** 套装的时候才有皮肤列表 */
    protected get skinIds(): number[] {
        return this.proxyFunc(this.RoleSkinCommon, 'getSelectSkinIds') || [];
    }
    private readonly RoleSkinCommon = 'RoleSkinCommon';
    protected start(): void {
        super.start();

        this.addPropertyPrefab(this.RoleSkinCommon, UI_PATH_ENUM.RoleSkinCommon, this.node, (n) => {
            n.setSiblingIndex(2);
        });
    }

    public init(winId: number, param: any[], tabIdx: number = 0): void {
        super.init(winId, param, tabIdx);
        if (param && param[1]) {
            this.refreshPage(undefined, param);
        }
    }

    public refreshPage(winId: number, params: any[]): void {
        if (params) {
            const suitId: number = params[1];
            if (suitId) {
                this.selectSkin(suitId);
            }
        }
    }

    protected updateRed(redStates: { [field: number]: number[] }): void {
        this.proxyFunc(this.RoleSkinCommon, 'updateRed', redStates);
    }
    protected updateRedOne(filed?: number, skinId?: number): void {
        this.proxyFunc(this.RoleSkinCommon, 'updateRedOne', filed, skinId);
    }

    protected showFields(skinIndexList: ICfgRoleSkin[], selectSkinFunc?: Executor): void;
    protected showFields(fields: number[], skinIndexList: IFieldCfgSkin, selectSkinFunc?: Executor): void;
    protected showFields(fields, skinIndexList?, selectSkinFunc?: Executor): void {
        this.proxyFunc(this.RoleSkinCommon, 'showFields', fields, skinIndexList, selectSkinFunc);
    }

    /** 选中某个皮肤 */
    protected selectSkin(skinId: number, field?: number, needRef?: boolean): void {
        this.proxyFunc(this.RoleSkinCommon, 'selectSkin', skinId, field, needRef);
    }

    protected setNodeStarActive(active: boolean): void {
        this.proxyFunc(this.RoleSkinCommon, 'setNodeStarActive', active);
    }

    protected updatePower(value: number): void {
        this.proxyFunc(this.RoleSkinCommon, 'updatePower', value);
    }

    protected updateNodeItems(skinId?: number): void {
        this.proxyFunc(this.RoleSkinCommon, 'updateNodeItems', skinId);
    }

    protected updateSkinItem(skinId: number): void {
        this.proxyFunc(this.RoleSkinCommon, 'updateSkinItem', skinId);
    }

    /** 添加代理预制体 */
    protected addPropertyPrefab(compName: string, path: string, parent: cc.Node, func?: (n: cc.Node) => void): void {
        const isLoad = this[`_is${compName}`];
        const funcs: Executor[] = this[`_${compName}Funcs`] = this[`_${compName}Funcs`] || [];
        if (!isLoad) {
            this[`is${compName}`] = true;
            ResMgr.I.showPrefab(path, parent, (e, n) => {
                if (e) {
                    this[`_is${compName}`] = false;
                    return;
                }
                if (func) {
                    func(n);
                }
                this[`_${compName}`] = n.getComponent(compName);
                funcs.forEach((ex) => {
                    ex.invoke();
                    ex.clear();
                    ex = undefined;
                });
                funcs.length = 0;
            });
        }
    }

    /** 异步预制体代理接口 */
    protected proxyFunc<T>(compName: string, funcName: string, ...args: any[]): T {
        const compScript: cc.Component = this[`_${compName}`];
        if (compScript) {
            const func = compScript[funcName] as (...args: any[]) => void;
            return func?.call(compScript, ...args) as T;
        } else {
            const funcs: Executor[] = this[`_${compName}Funcs`] = this[`_${compName}Funcs`] || [];
            funcs.push(new Executor(this.proxyFunc, this, compName, funcName, ...args));
        }
        return undefined;
    }
    /** 获取套装已激活的部件数量 */
    protected getActivePartNum(): number {
        return ModelMgr.I.RoleSkinModel.getSuitActivePartCount(this.selectSuitId);
    }

    /** 获取套装的红点 */
    protected getSuitRedState(suitId?: number): boolean {
        suitId = suitId || this.selectSuitId;
        const actives = ModelMgr.I.RoleSkinModel.getSuitInfo(suitId);
        /** 已激活的部件数量 */
        const activePartNum: number = ModelMgr.I.RoleSkinModel.getSuitActivePartCount(suitId);
        for (let i = SUIT_PART_STAR; i <= SUIT_PART_COUNT; i++) {
            if (actives.indexOf(i) === -1 && activePartNum >= i) {
                return true;
            }
        }
        return false;
    }

    protected onDestroy(): void {
        super.onDestroy();
    }
}
