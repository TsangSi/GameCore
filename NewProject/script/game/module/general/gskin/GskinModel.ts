/*
 * @Author: kexd
 * @Date: 2022-09-22 16:44:23
 * @FilePath: \SanGuo\assets\script\game\module\general\gskin\GskinModel.ts
 * @Description: 武将-皮肤
 *
 */

import BaseModel from '../../../../app/core/mvc/model/BaseModel';
import { Config } from '../../../base/config/Config';
import { ConfigGeneralSkinIndexer } from '../../../base/config/indexer/ConfigGeneralSkinIndexer';

const { ccclass } = cc._decorator;
@ccclass('GskinModel')
export class GskinModel extends BaseModel {
    public clearAll(): void {
        //
    }

    // 因信息界面里也需要展示布阵相关的红点情况，红点处理都在GeneralModel里
    public init(): void {
        // 红点检测(统一做在GeneralModel里了)
    }

    public registerRedDotListen(): void {
        //
    }

    public hasGeneralSkin(generalId: number): boolean {
        const indexer: ConfigGeneralSkinIndexer = Config.Get(Config.Type.Cfg_GeneralSkin);
        const data: number[] = indexer.getGeneralSkinIds(generalId);
        return data && data.length > 0;
    }
}
