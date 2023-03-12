/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/*
 * @Author: kexd
 * @Date: 2022-07-01 11:17:41
 * @FilePath: \SanGuo2.4\assets\script\game\base\utils\UtilHead.ts
 * @Description: 展示头像的通用接口
 *
 */

import { UtilCocos } from '../../../app/base/utils/UtilCocos';
import { EffectMgr } from '../../manager/EffectMgr';
import { AssetType } from '../../../app/core/res/ResConst';
import { Config } from '../config/Config';
import { ConfigConst } from '../config/ConfigConst';
import ConfigPhotoIndexer from '../config/indexer/ConfigPhotoIndexer';
import UtilItem from './UtilItem';
import { HeadPhotoType } from '../../module/head/HeadConst';
import { ESex } from '../../const/GameConst';
import { RoleMgr } from '../../module/role/RoleMgr';
import { RES_ENUM } from '../../const/ResPath';

export default class UtilHead {
    /**
     * 解析 服务端下发的皮肤资源id
     * @param headId 皮肤资源+是否是动态资源   例子 ：0是静态 1是动态。 皮肤的资源id是 1231那么NoAnid就是12310 是静态 12311是动态
     */
    public static headResIsAnim(headId: number): boolean {
        const _str = headId.toString();
        const _isAnim = Number(_str[_str.length - 1]);
        return _isAnim === 1;
    }

    /** 0: 1:男 2：女 3：不区分 */
    public static ChangeHeadRes(headId: number, sex: number = 1): number {
        // console.log('头像 ChangeHeadRes', headId);
        const indexer: ConfigPhotoIndexer = Config.Get(ConfigConst.Cfg_Photo);
        const itemCfg = indexer.getPhotoConfig(HeadPhotoType.Head, Math.floor(headId / 100));
        if (itemCfg) {
            const iconCfg = itemCfg.AnimId.split('|');
            const iconPath = sex === ESex.Male ? iconCfg[0] : iconCfg[1] ?? iconCfg[0];
            return Number(iconPath);
        }
        // console.warn('没有头像数据', headId);
        return sex === ESex.Male ? 11001 : 11002;
    }

    /**
     * 根据资源 路径获取到配置表里的id
     */
    public static getHedaConfigId(headId: number): number {
        const headStr = headId.toString();
        return parseInt(headStr.slice(0, headStr.length - 2));
    }

    /**
     *  聊天气泡
     * @param bubbleId 气泡ID
     * @param bubbleSpr 气泡Sprite
     * @param insetMode 九宫模式
     */
    public static setBubble(
        bubbleId: number,
        bubbleSpr: cc.Sprite,
        insetMode: boolean = false,
    ): void {
        UtilCocos.LoadSpriteFrameRemote(bubbleSpr, `${RES_ENUM.Com_Bubble}${bubbleId}`, AssetType.SpriteFrame, (spr) => {
            if (insetMode) {
                const insets: any = {
                    300110: [62, 50],
                    300210: [62, 50],
                    300310: [62, 50],
                    300410: [62, 50],
                    300510: [36, 60],
                    300610: [66, 22],
                    300710: [60, 46],
                    300810: [56, 40],
                    300910: [36, 78],
                    301010: [28, 78],
                    301110: [64, 44],
                };
                spr.spriteFrame.insetLeft = insets[bubbleId][0];
                spr.spriteFrame.insetRight = insets[bubbleId][1];
            }
        });
    }

    /**
     *  展示头像和头像框
     * @param headData 头像数据
     * @param sprHead 头像Sprite
     * @param headBgData 头像框数据
     * @param sprHeadBg 头像框Sprite
     * @param HeadScale 缩放
     */
    public static setHead(
        headId: number,
        sprHead: cc.Sprite,
        headBgId: number,
        sprHeadBg: cc.Sprite,
        HeadScale?: number,
        isNeedQualityFrame?: boolean,
    ): void {
        if (sprHead) {
            sprHead.spriteFrame = null;
            sprHead.node.destroyAllChildren();
            sprHead.node.removeAllChildren();
            const _isAnim = this.headResIsAnim(headId);
            let quality = 0;
            if (headId < 10000) {
                headId = 1;
            }
            if (_isAnim) {
                if (headId < 10000) {
                    UtilCocos.LoadSpriteFrameRemote(sprHead, `${RES_ENUM.RoleHead}${headId}`, AssetType.SpriteFrame);
                } else {
                    EffectMgr.I.showEffect(`${RES_ENUM.RoleHead}${headId}`, sprHead.node, cc.WrapMode.Loop);
                }
            } else {
                if (isNeedQualityFrame !== false) {
                    // 处理加载品质
                    const indexer: ConfigPhotoIndexer = Config.Get(ConfigConst.Cfg_Photo);
                    const itemCfg = indexer.getPhotoConfig(HeadPhotoType.Head, Math.floor(headId / 100));
                    if (!itemCfg) {
                        quality = 0;
                    } else {
                        quality = itemCfg.Quality ?? 0;
                    }
                    const qualityPath = UtilItem.GetItemQualityBgPath(quality);
                    UtilCocos.LoadSpriteFrameRemote(sprHead, qualityPath, AssetType.SpriteFrame);
                }
                const sprNd = new cc.Node();
                sprNd.width = sprHead.node.width - 4;
                sprNd.height = sprHead.node.height - 4;
                const spr = sprNd.addComponent(cc.Sprite);
                sprHead.node.addChild(sprNd);
                spr.sizeMode = cc.Sprite.SizeMode.CUSTOM;

                UtilCocos.LoadSpriteFrameRemote(spr, `${RES_ENUM.RoleHead}${headId}`, AssetType.SpriteFrame);
            }
            sprHead.node.scale = HeadScale ?? 1;
        }

        if (sprHeadBg) {
            sprHeadBg.spriteFrame = null;
            sprHeadBg.node.destroyAllChildren();
            sprHeadBg.node.removeAllChildren();
            const _isAnim = this.headResIsAnim(headBgId);
            if (headBgId < 10000) {
                headBgId = 200110;
            }
            if (_isAnim) {
                EffectMgr.I.showEffect(`${RES_ENUM.RoleHead}${headBgId}`, sprHeadBg.node, cc.WrapMode.Loop);
            } else {
                UtilCocos.LoadSpriteFrameRemote(sprHeadBg, `${RES_ENUM.RoleHead}${headBgId}`, AssetType.SpriteFrame);
            }
        }
    }
}
