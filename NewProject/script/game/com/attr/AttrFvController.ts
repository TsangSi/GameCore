/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: kexd
 * @Date: 2022-07-14 11:57:14
 * @FilePath: \SanGuo\assets\script\game\com\attr\AttrFvController.ts
 * @Description: 属性变化
 */
import { EventProto } from '../../../app/base/event/EventProto';
import BaseController from '../../../app/core/mvc/controller/BaseController';
import ModelMgr from '../../manager/ModelMgr';

const { ccclass } = cc._decorator;
@ccclass('AttrFvController')
export default class AttrFvController extends BaseController {
    /** 网络监听 */
    public addNetEvent(): void {
        EventProto.I.on(ProtoId.S2CUpdateFightAttr_ID, this.onS2CUpdateAttr, this);
    }
    public delNetEvent(): void {
        EventProto.I.targetOff(this);
    }

    /** 事件监听 */
    public addClientEvent(): void {
        //
    }
    public delClientEvent(): void {
        //
    }
    public clearAll(): void {
        //
    }

    /** 战力、属性变化 */
    private onS2CUpdateAttr(data: S2CUpdateFightAttr) {
        console.log('--------战力、属性变化:', data);
        if (data && data.Attrs) {
            ModelMgr.I.AttrFvModel.setAttrData(data.Attrs);
        }
    }
}
