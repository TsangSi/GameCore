/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/*
 * @Author: kexd
 * @Date: 2022-07-01 11:17:41
 * @FilePath: \SanGuo2.4\assets\script\game\base\utils\UtilTitle.ts
 * @Description: 展示称号的通用接口
 *
 */

/** import {' cc.AnimationClip, cc.Node, cc.Sprite } 'from 'cc';  // */
import { UtilCocos } from '../../../app/base/utils/UtilCocos';
import { EffectMgr } from '../../manager/EffectMgr';
import { AssetType } from '../../../app/core/res/ResConst';
import { Config } from '../config/Config';
import { UtilColor } from '../../../app/base/utils/UtilColor';
import { RES_ENUM } from '../../const/ResPath';

export default class UtilTitle {
    /**
     * 设置称号 (偏移量需要在配置表中读取)
     * @param parent 节点
     * @param titleId 称号id
     * @param inMap 是否在场景中展示（因为场景里的称号偏移和ui里的偏移不同；场景里的称号缩放和ui里的缩放也不同。）
     * @param scale 缩放
     * @param gray 是否置灰
     * @returns
     */
    public static setTitle(parent: cc.Node, titleId: number, inMap: boolean = false, scale: number = 1, gray: boolean = false): void {
        if (!parent) return;
        if (!parent.isValid) {
            parent['titleRes'] = null;
            parent['titleId'] = null;
            return;
        }

        const cfgTitle: Cfg_Title = Config.Get(Config.Type.Cfg_Title).getValueByKey(titleId);
        let posY = 0;
        if (cfgTitle) {
            if (parent.children.length > 0 && parent['titleRes']
                && parent['gray'] === gray
                && ((cfgTitle.Dynamic && parent['titleRes'] === cfgTitle.Dynamic) || (cfgTitle.AnimID && parent['titleRes'] === cfgTitle.AnimID))) {
                // console.log('资源一致，不必重复加载了');
                return;
            }
            posY = inMap ? cfgTitle.MapSetY : cfgTitle.UISetY;
            parent['titleRes'] = null;
            parent.destroyAllChildren();
            parent.removeAllChildren();
            if (cfgTitle.Dynamic) {
                const url = `${RES_ENUM.Effect_Title}${cfgTitle.Dynamic}`;
                EffectMgr.I.showAnim(url, (_node: cc.Node) => {
                    if (_node['_curLoadPath'].indexOf(url) < 0) {
                        _node.destroy();
                        return;
                    }

                    if (parent && parent.isValid) {
                        parent.destroyAllChildren();
                        parent.removeAllChildren();
                        const eff = parent.getChildByName(cfgTitle.Dynamic);
                        if (eff) {
                            eff.destroy();
                        }
                        parent.addChild(_node);
                        parent.attr({ titleRes: cfgTitle.Dynamic, gray });
                        _node.name = cfgTitle.Dynamic;
                        _node.y = posY;
                        if (scale) {
                            if (inMap) {
                                _node.scale = cfgTitle.MapScale ? scale * cfgTitle.MapScale / 100 : scale;
                            } else {
                                _node.scale = cfgTitle.UIScale ? scale * cfgTitle.UIScale / 100 : scale;
                            }
                        }
                    }
                }, cc.WrapMode.Loop, null, gray);
            } else if (cfgTitle.AnimID) {
                const _node = new cc.Node();

                _node.setPosition(0, posY, 0);
                const sprite = _node.addComponent(cc.Sprite);
                const url = `${RES_ENUM.Texture_Title}${cfgTitle.AnimID}`;
                UtilCocos.LoadSpriteFrameRemote(sprite, url, AssetType.SpriteFrame, (spr: cc.Sprite) => {
                    if (spr['_frameUuid'].indexOf(url) < 0) {
                        _node.destroy();
                        return;
                    }
                    if (parent && parent.isValid) {
                        parent.destroyAllChildren();
                        parent.removeAllChildren();

                        UtilColor.setGray(sprite.node, gray);
                        parent.addChild(_node);
                        parent.attr({ titleRes: cfgTitle.AnimID, gray });
                        if (scale) {
                            if (inMap) {
                                _node.scale = cfgTitle.MapScale ? scale * cfgTitle.MapScale / 100 : scale;
                            } else {
                                _node.scale = cfgTitle.UIScale ? scale * cfgTitle.UIScale / 100 : scale;
                            }
                        }
                    }
                });
            }
        } else {
            parent['titleRes'] = null;
            parent['titleId'] = null;
            parent.destroyAllChildren();
            parent.removeAllChildren();
        }
    }
}
