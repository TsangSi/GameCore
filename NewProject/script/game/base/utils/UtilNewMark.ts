/*
 * @Author: kexd
 * @Date: 2023-02-21 17:56:16
 * @FilePath: \SanGuo2.4\assets\script\game\base\utils\UtilNewMark.ts
 * @Description: 为节点添加一个‘新’的标签图
 *
 */

import { UtilCocos } from '../../../app/base/utils/UtilCocos';
import { RES_ENUM } from '../../const/ResPath';
import { NewMark } from '../../module/newMark/NewMark';

export default class UtilNewMark {
    /**
     * 为节点（按钮，一级页签，二级页签等）绑定脚本
     * @param funcId 功能id
     * @param parent 节点
     * @param pos ‘新’角标显示位置
     * @returns
     */
    public static Bind(funcId: number, parent: cc.Node, pos: cc.Vec2, scale: number = 1): void {
        if (!funcId) {
            console.log('绑定的功能id不能为0 或者undefined');
            return;
        }
        let s = parent.getComponent(NewMark);
        if (!s) {
            s = parent.addComponent(NewMark);
        }
        parent.getComponent(NewMark).setData(funcId, pos, scale);
    }

    /**
     * 显示或清除‘新’标签
     * @param parent 节点
     * @param isShow 是否显示
     * @param pos ‘新’角标显示位置
     */
    public static UptNewMark(parent: cc.Node, isShow: boolean, pos: cc.Vec2, scale: number = 1): void {
        const imgMark = parent.getChildByName('NewMark');
        if (isShow) {
            const markSrc = RES_ENUM.NewMark;
            if (!imgMark) {
                const node = UtilCocos.NewNode(parent, [cc.Sprite]);
                node.name = 'NewMark';
                node.setPosition(pos);
                node.zIndex = 9999;
                node.active = true;
                node.scale = scale;
                const sp = node.getComponent(cc.Sprite);
                sp.sizeMode = cc.Sprite.SizeMode.RAW;
                sp.type = cc.Sprite.Type.SIMPLE;
                UtilCocos.LoadSpriteFrame(sp, markSrc);
            } else {
                imgMark.active = true;
                UtilCocos.LoadSpriteFrame(imgMark.getComponent(cc.Sprite), markSrc);
            }
        } else if (imgMark) {
            imgMark.destroy();
        }
    }
}
