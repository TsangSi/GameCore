/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable dot-notation */
/*
 * @Author: hrd
 * @Date: 2022-06-21 14:39:30
 * @FilePath: \SanGuo\assets\script\game\battle\effect\WordEffect.ts
 * @Description:
 *
 */

import { UtilCocos } from '../../../app/base/utils/UtilCocos';
import { UtilNum } from '../../../app/base/utils/UtilNum';
import { UtilString } from '../../../app/base/utils/UtilString';
import { ResMgr } from '../../../app/core/res/ResMgr';
import { BMFont } from '../../base/components/BMFont';
import { Config } from '../../base/config/Config';
import { ConfigConst } from '../../base/config/ConfigConst';
import { ConfigIndexer } from '../../base/config/indexer/ConfigIndexer';
import { RES_ENUM } from '../../const/ResPath';
import { BattleMgr } from '../BattleMgr';
import { WordVType } from '../WarConst';

enum WNodeName {
    /** 飘字预制节点名字 */
    WordPre = 'dh'
}

// AtkEffect_Normal          AtkEffect = 1 //普通攻击
// AtkEffect_Miss            AtkEffect = 2 //闪避
// AtkEffect_Cri             AtkEffect = 3 //暴击
// AtkEffect_Seckill         AtkEffect = 4 //秒杀

/** 攻击效果 */
export enum AtkEffect {
    /** 普通攻击 */
    Normal = 1,
    /** 闪避 */
    Miss = 2,
    /** 暴击 */
    Cri = 3,
    /** 秒杀 */
    Seckill = 4,
    /** 加血 */
    AddBlood = 5,
    /** 护盾伤害 */
    ShieldVal = 6,
    /** 分摊伤害 */
    SplitDamage = 7,
    /** 神击 */
    GodStrike = 8,
    /** 仙击 */
    FairyStrike = 9,
    /** 致命一击 */
    CriticalStrike = 10,
    /** 掉血伤害 */
    BloodDamage = 11,
    /** 反弹伤害 */
    ReboundDamage = 12,
    /** buff吸血 */
    SuckBlood = 10005,
}

export class WordEffect {
    private prefabPath: string = 'animPrefab/battle/wordEff/anim/';
    private imgPath: string = RES_ENUM.BattleUI_WordImg;
    private fontPath: string = 'bMFont/battleFont/';
    private _wordEffPools: { [key: string]: cc.NodePool; } = {};

    private static Instance: WordEffect;
    public static get I(): WordEffect {
        if (!this.Instance) {
            this.Instance = new WordEffect();
        }
        return this.Instance;
    }

    /**
     * 根据飘字出战位置获取偏移值
     * @param posNum
     * @returns
     */
    private getPosXOffset(posNum: number, cfg: Cfg_WordEffect, _str: string, _wordNode: cc.Node, _pos: cc.Vec2): number {
        let x = 0;
        const tPosNumArr: number[] = [25, 10];
        if (tPosNumArr.indexOf(posNum) === -1) {
            return x;
        }
        const len = this.getStrEffOffsetLen(cfg, _str);
        const pos = _wordNode.position;
        const newVec2 = _wordNode.convertToWorldSpaceAR(pos);
        const s = cc.view.getFrameSize();
        let mm = 0;
        const xx = 16;
        switch (posNum) {
            case 25:
                // 左上
                mm = (Math.abs(newVec2.x) + Math.abs(len / 2)) - s.width / 2;
                if (mm > 0) x = mm + xx;
                break;
            case 10:
                // 右下
                mm = (Math.abs(newVec2.x) + Math.abs(len / 2)) - s.width / 2;
                if (mm > 0) x = -(mm + xx);
                break;
            default:
                break;
        }
        return x;
    }

    private getStrEffOffsetLen(cfg: Cfg_WordEffect, _str: string): number {
        const strLen = _str.length + 42;
        let imgLen = 0;
        for (let i = 1; i <= 5; i++) {
            if (cfg[`FontImg${i}`]) {
                imgLen += 100;
            }
        }
        return imgLen + strLen;
    }

    public showWordEff(
        effKey: string,
        _str: string,
        _targetNd: cc.Node,
        tagPos: cc.Vec2 = cc.v2(0, 0),
        posNum: number = 0,
        re,
    ): void {
        const key = effKey;
        const cfg: Cfg_WordEffect = this.getWordEffCfg(key);
        if (!cfg) {
            console.error('Cfg_WordEffect 找不到对应飘字id请检测配置表', key);
            return;
        }
        if (!this._wordEffPools[key]) {
            this._wordEffPools[key] = new cc.NodePool();
        }
        const wordNode = this._wordEffPools[key].get();
        // cfg.cc.Font = 'attackFont';
        // cfg.PrefabName = 'diaoxue';
        // cfg.BeginY = 200;
        const prefabName = cfg.PrefabName;
        const fontName = cfg.Font;
        const img1Name = cfg.FontImg1;
        const img2Name = cfg.FontImg2;
        const img3Name = cfg.FontImg3;

        const randomX = UtilNum.RandomInt(0, 50);
        const randomY = UtilNum.RandomInt(0, 40);
        const randomDir = UtilNum.RandomInt(0, 1);
        // if (randomDir) {
        //     randomX *= -1;
        // }

        // let finalPosX = tagPos.x + cfg.BeginX + randomX;
        // let finalPosY = tagPos.y + cfg.BeginY + randomY;

        // const finalPosX = tagPos.x + cfg.BeginX;
        // const finalPosY = tagPos.y + cfg.BeginY;

        const finalPosX = tagPos.x;
        const finalPosY = tagPos.y;
        const pos: cc.Vec2 = cc.v2(finalPosX, finalPosY);

        if (!prefabName) {
            console.error('==========没有飘字预制文件=请检测配置表===========', prefabName, key);
            return;
        }

        // 设置飘字图片
        const setWordImgsFunc = (nd: cc.Node, img1: string, idx: number) => {
            // const nodePath = `NdFont/Fontimg${idx}`;
            // const imgNd = nd.getChildByPath(nodePath);
            const imgNd = nd.getChildByName('NdFont').getChildByName(`Fontimg${idx}`);
            if (!imgNd) {
                return;
            }
            if (!img1) {
                imgNd.active = false;
                return;
            }
            imgNd.active = true;
            const spr = imgNd.getComponent(cc.Sprite);
            UtilCocos.LoadSpriteFrameRemote(spr, this.imgPath + img1);
        };

        // 播放飘字动画
        const doPlayWordFunc = (nd: cc.Node) => {
            re(nd);
            const anim = nd.getComponent(cc.Animation);
            const clip = anim.getClips()[0];
            if (clip) {
                const name = clip.name;
                const animState = anim.getAnimationState(name);
                if (animState) animState.speed = BattleMgr.I.getWarSpeed() || 1;
            }
            anim.play(clip.name);
   			//anim.scheduleOnce(() => {
            //    if (nd && nd.isValid) {
             //       nd.active = false;
             //       if (this._wordEffPools && this._wordEffPools[key]) {
             //           this._wordEffPools[key].put(nd);
            //        } else {
            //            nd.destroy();
            //        }
           //     }
           // }, 1.5);

            // const len = this._floatWords.length;
            // if (len) {
            //     const preLastY = this._floatWords[len - 1].y;// 最后一个原来的y
            //     for (let i = len - 1; i >= 0; i--) { // 取出400
            //         const item = this._floatWords[i];
            //         // if (this._floatWords[i].effKey === param.effKey) { // 上一个是否与当前相同
            //         const stopY = item.y + 50;
            //         let stopScale = item.scale - 0.1;
            //         if (stopScale <= 0.1) {
            //             stopScale = 0.1;
            //         }

            //         // item.y = -50;
            //         // } else {
            //         //     break;
            //         // }
            //         // if (i !== 0) {
            //         //     nd.y = this._floatWords[i - 1].y;
            //         // }

            //         // item.y = stopY;
            //         cc.Tween.stopAllByTarget(this._floatWords[i]);
            //         cc.tween(this._floatWords[i]).to(0.5, { y: stopY, scale: stopScale }).start();
            //     }
            //     nd.y = preLastY;
            //     this._floatWords.push(nd);// 400 0
            //     cc.Tween.stopAllByTarget(nd);
            //     cc.tween(nd).to(0.5, { y: nd.y }).start();
            // } else { // 放入第一个
            //     this._floatWords.push(nd);// 400 0
            // }

            // setTimeout(() => {
            //     const nd = this._floatWords.shift();
            //     if (nd && nd.isValid) {
            //         cc.Tween.stopAllByTarget(nd);
            //         if (this._wordEffPools && this._wordEffPools[key]) {
            //             // this._wordEffPools[key].y = 0;
            //             // this._wordEffPools[key].scale = 1;
            //             this._wordEffPools[key].put(nd);
            //         } else {
            //             nd.destroy();
            //         }
            //     }
            // }, 1000);
        };

        const setWordNodePos = (_wordNode: cc.Node, _pos: cc.Vec2, posNum: number, _str: string) => {
            _wordNode.setPosition(_pos);
            const offPosX = this.getPosXOffset(posNum, cfg, _str, _wordNode, _pos);
            if (offPosX) {
                _wordNode.x += offPosX;
            }
        };

        if (!wordNode) {
            ResMgr.I.showPrefabAsync(this.prefabPath + prefabName).then((_wordNode) => {
                if (!(_targetNd && _targetNd.isValid)) return;
                if (!_wordNode) {
                    console.error('==========_wordNode============', prefabName, _wordNode, key);
                    return;
                }
                _targetNd.addChild(_wordNode);
                setWordNodePos(_wordNode, pos, posNum, _str);
                this.setWordLabel(key, _wordNode, _str, fontName, true);
                setWordImgsFunc(_wordNode, img1Name, 1);
                setWordImgsFunc(_wordNode, img2Name, 2);
                setWordImgsFunc(_wordNode, img3Name, 3);
                doPlayWordFunc(_wordNode);
            }).catch((err) => {
                console.log(err);
            });
        } else {
            _targetNd.addChild(wordNode);
            setWordNodePos(wordNode, pos, posNum, _str);
            wordNode.active = true;
            this.setWordLabel(key, wordNode, _str, fontName);
            setWordImgsFunc(wordNode, img1Name, 1);
            setWordImgsFunc(wordNode, img2Name, 2);
            setWordImgsFunc(wordNode, img3Name, 3);
            doPlayWordFunc(wordNode);
        }
    }

    /**
    * 设置飘着文本
    * @param effKey 飘字key
    * @param nd 飘字动画节点
    * @param str 文本内容
    * @param fontName 字体资源名
    * @param isInit 是否初始化
    * @returns
    */
    private setWordLabel(effKey: string, nd: cc.Node, str: string, fontName: string, isInit: boolean = false) {
        const cfg: Cfg_WordEffect = this.getWordEffCfg(effKey);
        if (!cfg.FormatTxt) {
            const labNd = nd.getChildByName('NdFont').getChildByName('LabStr');
            if (!labNd) {
                return;
            }
            const labNum = labNd.getComponent(cc.Label);
            labNum.string = str;
            const fontPath = this.fontPath + fontName;
            if (fontName && isInit) {
                this.loadFont(fontPath, labNum);
            }
        } else {
            const fontLayout = nd.getChildByName('NdFont');
            const strArr = UtilString.StringToArray(str);
            const fontPath = this.fontPath + fontName;
            const fontChildren = fontLayout.children;
            for (let i = 0; i < fontChildren.length; i++) {
                const nd = fontChildren[i];
                if (!nd) continue;
                const char = strArr[i];
                if (char) {
                    const labNd = fontLayout.getChildByName(`LabStr${i + 1}`);
                    if (labNd) {
                        const LabStr = labNd.getComponent(cc.Label);
                        LabStr.string = char;
                        if (fontName && isInit) {
                            this.loadFont(fontPath, LabStr);
                        }
                    }
                } else {
                    const labNd = fontLayout.getChildByName(`LabStr${i + 1}`);
                    if (labNd) {
                        const LabStr = labNd.getComponent(cc.Label);
                        LabStr.string = '';
                    }
                }
            }
        }
    }

    private loadFont(path: string, lab: cc.Label) {
        let ss = lab.getComponent(BMFont);
        if (!ss) {
            ss = lab.addComponent(BMFont);
        }
        ss.setFont(path);
    }

    /** 清除缓存池数据 */
    public clearAllPool(): void {
        for (const key in this._wordEffPools) {
            if (Object.prototype.hasOwnProperty.call(this._wordEffPools, key)) {
                const pool = this._wordEffPools[key];
                pool.clear();
            }
        }
        this._wordEffPools = {};
    }

    public clearAll(): void {
        this.clearAllPool();
    }

    /**
     *
     * @param TID 飘字id
     * @param atkUnit
     * @returns
     */
    public getWordEffCfgKey(TID: number, atkUnit?: FightUnit): string {
        const vType = this.getVType(TID);
        let key = `${TID}_${0}`;
        let _cType = 0; // 子类型
        switch (vType) {
            case WordVType.Unit:
                _cType = atkUnit.T;
                break;
            default:
                break;
        }

        // switch (TID) {
        //     case AtkEffect.Normal: // 普通攻击
        //     case AtkEffect.Cri: // 暴击
        //     case AtkEffect.GodStrike:
        //     case AtkEffect.FairyStrike:
        //     case AtkEffect.CriticalStrike:
        //     case AtkEffect.SuckBlood:
        //         _cType = atkUnit.T;
        //         break;
        //     default:
        //         break;
        // }
        key = `${TID}_${_cType}`;
        // key = `${1}_${1}`;
        return key;
    }

    public getWordEffCfg(key: string): Cfg_WordEffect {
        const cfg: Cfg_WordEffect = Config.Get(ConfigConst.Cfg_WordEffect).getValueByKey(key);
        return cfg;
    }

    private _Cfg_WordEffect_Type: { [key: number]: number; } = null;
    /** 获取飘字专属类型 */
    public getVType(EffId: number): number {
        let _Cfg_WordEffect_Type = this._Cfg_WordEffect_Type;
        if (!_Cfg_WordEffect_Type) {
            _Cfg_WordEffect_Type = {};
            const Cfg_WordEffect: ConfigIndexer = Config.Get(ConfigConst.Cfg_WordEffect);
            Cfg_WordEffect.forEach((cfg: Cfg_WordEffect) => {
                // console.log('================');
                _Cfg_WordEffect_Type[cfg.EffId] = cfg.VType;
                return true;
            });
        }
        return _Cfg_WordEffect_Type[EffId] || 0;
    }
}
