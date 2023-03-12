/*
 * @Author: zs
 * @Date: 2022-07-20 21:16:37
 * @FilePath: \SanGuo\assets\script\game\module\roleskin\v\com\RoleActivitySuitAttr.ts
 * @Description:
 *
 */

import { UtilColor } from '../../../../../app/base/utils/UtilColor';
import { IAttrBase } from '../../../../base/attribute/AttrConst';
import { Config } from '../../../../base/config/Config';
import { ConfigIndexer } from '../../../../base/config/indexer/ConfigIndexer';
import { ConfigRoleSkinIndexer } from '../../../../base/config/indexer/ConfigRoleSkinIndexer';
import { NdAttrBase } from '../../../../com/attr/NdAttrBase';
import ModelMgr from '../../../../manager/ModelMgr';
import { SUIT_PART_COUNT, SUIT_PART_STAR } from '../RoleSkinConst';

/*
 * @Author: zs
 * @Date: 2022-07-15 15:46:31
 * @FilePath: \SanGuo\assets\script\game\module\roleskin\v\com\RoleActivitySuitAttr.ts
 * @Description:
 *
 */
const { ccclass, property } = cc._decorator;
@ccclass
export class RoleActivitySuitAttr extends cc.Component {
    @property(cc.Node)
    private NodeAttrs: cc.Node = null;
    @property(cc.Node)
    private NodeActive: cc.Node = null;
    @property(cc.Node)
    private NodeUnActive: cc.Node = null;
    @property(cc.Label)
    private LabelDesc: cc.Label = null;
    @property(cc.Label)
    private LabelTime: cc.Label = null;
    @property(cc.Label)
    private LabelName: cc.Label = null;

    private cfgRoleSkin: ConfigRoleSkinIndexer;
    private cfgGradeSkin: ConfigIndexer;
    public setData(suitId: number, attrs: IAttrBase[]): void {
        if (!this.cfgRoleSkin) {
            this.cfgRoleSkin = Config.Get(Config.Type.Cfg_RoleSkin);
        }
        if (!this.cfgGradeSkin) {
            this.cfgGradeSkin = Config.Get(Config.Type.Cfg_GradeSkin);
        }
        // eslint-disable-next-line max-len
        const ActiveDesc: string = this.cfgRoleSkin.getSkinSuitValueByKey(suitId, 'ActiveDesc');
        this.updateAttrs(attrs);

        this.LabelDesc.string = ActiveDesc || '';
        if (ModelMgr.I.RoleSkinModel.getSuitActiveByNum(suitId, SUIT_PART_COUNT)) {
            this.NodeActive.active = true;
            this.NodeUnActive.active = false;
        } else {
            this.NodeActive.active = false;
            this.NodeUnActive.active = true;
        }
    }

    /** 属性 */
    private updateAttrs(attrs: IAttrBase[]) {
        for (let i = 0, n = Math.max(attrs.length, this.NodeAttrs.children.length); i < n; i++) {
            let node = this.NodeAttrs.children[i];
            if (attrs[i]) {
                node = node || cc.instantiate(this.NodeAttrs.children[0]);
                node.active = true;
                if (!this.NodeAttrs.children[i]) {
                    this.NodeAttrs.addChild(node);
                }
                const s = node.getComponent(NdAttrBase);
                s.setAttr(attrs[i], { s: '  +', nameC: UtilColor.OrangeV, valueC: UtilColor.OrangeV });
            } else if (node) {
                if (i === 0) {
                    node.active = false;
                } else {
                    node.destroy();
                    this.NodeAttrs.removeChild(node);
                }
            }
        }
    }
}
