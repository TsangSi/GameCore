export interface ISysInfo {
    musicSwitch: boolean, // 音乐开关
    musicEffSwitch: boolean, // 音效开关
    musicVol: number, // 音乐音量
    effVol: number, // 音效音量
    lcMode: boolean, // 流畅模式
    pbSkillEff: boolean, // 屏蔽特效
    pbBeiShi: boolean, // 屏蔽背饰
    pbModel: boolean, // 屏蔽场景模型

    wuJiang: boolean, // 武将
    hongYan: boolean, // 红颜
    junShi: boolean, // 军师

    autoFight: boolean, // 挂机战斗

    pbSpecialPower: boolean, // 特权等级

    frameRate: number, // 帧率
}
