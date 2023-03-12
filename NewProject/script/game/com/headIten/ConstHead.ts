export interface HeadData {
    quality: number, // 品质
    headIconId?: number, // 头像

    select?: boolean, // 正方形的一个选中框
    isCheck?: boolean, // 是否选中√
    isLockBig?: boolean, // 是否锁住 大的锁

    level?: string, // 等级 传入一个字符串 不传不显示
    levelColor?: cc.Color, // 等级颜色 不传默认白色

    sprTitlePath?: string, // 标题  背景 或者 极品 稀有 普通
    labTitle?: string, // 无双 盖世...
    sprRarityPath?: string, // 虎将 武将 名将...

    customData?: any, // 用户自定义数据 传入的头像数据，不一定是要用的数据 可能要获取这个头像的ID 英雄类型等
}
