/** 图片资源路径 */
export enum RES_ENUM {
    /** 远端资源路径 */

    // 注意命名 规范 例如 texture/activity/banner下的一张背景图
    // 则命名 为  Activity_Banner = ',activity/banner/',  命名如果太长可以简写   Act_Banner = ',activity/banner/',
    // 又例如 Com_Icon_hujian = "texture/com/icon/com_icon_hujian"
    // 注意 不要与他人重复了
    // 按texture下的 文件夹添加 如下

    /** activity文件夹 */

    /** arena文件夹 */

    /** bag文件夹 */

    /** battleSettle文件夹 */

    /** skill文件夹 */
    Skill = 'texture/skill/',
    Effect = 'texture/effect/',

    /** com文件夹 */
    Com = 'effect/com/',
    Com_Icon = 'texture/com/icon/',
    Com_Img = 'texture/com/img/',

    Com_Ui_102 = 'effect/com/ui_102',
    Com_Ui_111 = 'effect/com/ui_111',
    Com_Ui_116 = 'effect/com/ui_116',
    Com_Ui_6046 = 'effect/com/ui_6046',
    Com_Ui_8006 = 'effect/com/ui_8006',
    Com_Ui_8011 = 'effect/com/ui_8011',
    Com_Ui_9003 = 'effect/com/ui_9003',

    Com_Bg_Dadiban_02 = 'texture/com/bg/com_bg_dadiban_02@9[184_30_0_0]',
    Com_Bg_Com_Bg_Item_0 = 'texture/com/bg/com_bg_item_0',
    Com_Bg_Com_Bg_Sc_02 = 'texture/com/bg/com_bg_sc_02@9[10_460_0_0]',
    Com_Btn_Com_Btn_B_03 = 'texture/com/btn/com_btn_b_03',
    Com_Btn_Com_Btn_Fenye_2 = 'texture/com/btn/com_btn_fenye_2',
    Com_Btn_Com_Btn_Tab_09 = 'texture/com/btn/com_btn_tab_09',
    Com_Btn_Com_Btn_Weidacheng = 'texture/com/btn/com_btn_weidacheng',
    Com_Btn_Com_Btn_C01 = '/texture/com/btn/com_btn_c_01',
    Com_Btn_Com_Btn_Yilingqu = 'texture/com/btn/com_btn_yilingqu',
    Com_Font_Com_Font_Bei = 'texture/com/font/com_font_bei@ML',
    Com_Font_Com_Font_Gailvjiaobiao = 'texture/com/font/com_font_gailvjiaobiao@ML',
    Com_Font_Com_Font_Jhjn = 'texture/com/font/com_font_jhjn@ML',
    Com_Font_Com_Font_Jhjx = 'texture/com/font/com_font_jhjx@ML',
    Com_Font_Com_Font_Tianfu = 'texture/com/font/com_font_tianfu@ML',
    Com_Font_Com_Font_Zhuangtai_01 = 'texture/com/font/com_font_zhuangtai_01@ML',
    Com_Font_Com_Font_Zhuangtai_02 = 'texture/com/font/com_font_zhuangtai_02@ML',
    Com_Font_Com_Font_Zhuangtai_03 = 'texture/com/font/com_font_zhuangtai_03@ML',
    Com_Font_Com_Font_Zhuangtai_04 = 'texture/com/font/com_font_zhuangtai_04@ML',
    Com_Font_Com_Font_Zhuanshu = 'texture/com/font/com_font_zhuanshu@ML',
    Com_Head_2 = 'texture/com/head/2',
    Com_Head_Img_Zjm_Youxiang = 'texture/com/head/img_zjm_youxiang',
    Com_Img_Com_Icon_Dikaung = 'texture/com/img/com_icon_dikaung_',
    Com_Img_Com_Img_Di_11 = 'texture/com/img/com_img_di_11@9[5_5_5_5]',
    Com_Img_Com_Img_Gou = 'texture/com/img/com_img_gou',
    Com_WinTabBtn = 'texture/com/winTabBtn/',
    Com_WinTabTitle = 'texture/com/winTabTitle/',

    Com_Bg_Com_Bg_Item = 'texture/com/bg/com_bg_item_',
    Com_Bg_Com_Bg_Skill = 'texture/com/bg/com_bg_skill_',
    Com_Bg_Com_Bg_Tips = 'texture/com/bg/com_bg_tips_',
    Com_Btn_Com_Btn_Suo_1 = 'texture/com/btn/com_btn_suo_1',
    Com_Btn_Com_Btn_Suo_2 = 'texture/com/btn/com_btn_suo_2',
    Com_Btn_Com_Btn_Tips = 'texture/com/btn/com_btn_tips',
    Com_Bubble = 'texture/com/bubble/',
    Com_Font = 'texture/com/font/',
    Com_Font_Com_Font_Dan = 'texture/com/font/com_font_dan@ML',
    Com_Font_Com_Font_Item_Logo = 'texture/com/font/com_font_item_logo_',
    Com_Font_Com_Font_Junxian = 'texture/com/font/com_font_junxian_',
    Com_Font_Com_Font_Official = 'texture/com/font/com_font_official_',
    Com_Font_Com_Font_Quality_Big = 'texture/com/font/com_font_quality_big_',
    Com_Font_Com_Font_Quality_Small = 'texture/com/font/com_font_quality_small_',
    Com_Font_Com_Font_Qun = 'texture/com/font/com_font_qun@ML',
    Com_Font_Com_Font_Txts = 'texture/com/font/com_font_txts@ML',
    Com_Font_Com_Font_Wujiang = 'texture/com/font/com_font_wujiang_',
    Com_Font_Com_Img_Spcg = 'texture/com/font/com_img_spcg',
    Com_Font_Com_Img_Vip = 'texture/com/font/com_img_vip_',
    Com_HeadFrame = 'texture/com/headFrame/',
    Com_Icon_Com_Icon_Attr = 'texture/com/icon/com_icon_attr_',
    Com_Icon_Com_Icon_Hujian = 'texture/com/icon/com_icon_hujian',
    Com_Icon_Com_Icon_Huwan = 'texture/com/icon/com_icon_huwan',
    Com_Icon_Com_Icon_Jian = 'texture/com/icon/com_icon_jian',
    Com_Icon_Com_Icon_Kuzi = 'texture/com/icon/com_icon_kuzi',
    Com_Icon_Com_Icon_Toushi = 'texture/com/icon/com_icon_toushi',
    Com_Icon_Com_Icon_Xiezi = 'texture/com/icon/com_icon_xiezi',
    Com_Icon_Com_Icon_Yaodai = 'texture/com/icon/com_icon_yaodai',
    Com_Icon_Com_Icon_Yifu = 'texture/com/icon/com_icon_yifu',
    Com_Icon_Svip = 'texture/com/icon/com_icon_svip',
    Com_Icon_Vip = 'texture/com/icon/com_icon_vip',
    Com_Img_Com_Bg_Tips = 'texture/com/img/com_bg_tips_',
    Com_Img_Com_Font_Wujiang_T = 'texture/com/img/com_font_wujiang_t_',
    Com_Img_Com_Img_Htd = 'texture/com/img/com_img_htd@9[30_65_30_155]',
    Com_Img_Com_Img_Htd_02 = 'texture/com/img/com_img_htd_02@9[6_78_6_308]',
    Com_Img_Com_Img_Jinengkuang = 'texture/com/img/com_img_jinengkuang',
    Com_Img_Com_Img_Paiming_0 = 'texture/com/img/com_img_paiming_0',
    Com_Img_Com_Img_Pinzhitiao = 'texture/com/img/com_img_pinzhitiao_',
    Com_Img_Img_Gz_Pinjie_0 = 'texture/com/img/img_gz_pinjie_0',
    Com_ItemSource = 'texture/com/itemSource/',
    Com_Ui = 'effect/com/ui_',
    Com_Ui_101 = 'effect/com/ui_101',
    Com_Ui_103 = 'effect/com/ui_103',
    Com_Ui_103_2 = 'effect/com/ui_103_2',
    Com_Ui_104 = 'effect/com/ui_104',
    Com_Ui_106 = 'effect/com/ui_106',
    Com_Ui_8001 = 'effect/com/ui_8001',
    Com_Ui_8003 = 'effect/com/ui_8003',

    /** item文件夹 */
    Item = 'texture/item/',

    Item_1_H = 'texture/item/1_h',
    Item_2_H = 'texture/item/2_h',
    Item_3_H = 'texture/item/3_h',
    Item_4_H = 'texture/item/4_h',

    Item_Ui_117 = 'effect/item/ui_117',
    Item_Ui_118 = 'effect/item/ui_118',
    Item_Ui_6051 = 'effect/item/ui_6051',
    Item_Ui_6052 = 'effect/item/ui_6052',
    Item_Ui_6061 = 'effect/item/ui_6061',
    Item_Ui_6062 = 'effect/item/ui_6062',
    Item_Ui_6071 = 'effect/item/ui_6071',
    Item_Ui_6072 = 'effect/item/ui_6072',
    Item_Ui_6081 = 'effect/item/ui_6081',
    Item_Ui_6082 = 'effect/item/ui_6082',

    /** strength文件夹 */
    Strength_Ui_105 = 'effect/strength/ui_105',
    Strength_Ui_7001 = 'effect/strength/ui_7001',
    Strength_Ui_7002 = 'effect/strength/ui_7002',
    Strength_Ui_7004 = 'effect/strength/ui_7004',
    Strength_Ui_7003 = 'effect/strength/ui_7003',

    /** bag文件夹 */
    Bag_Icon_Beibaoi_Jszb = 'texture/bag/icon_beibaoi_jszb',

    /** battleSettle文件夹 */
    BattleResult = 'texture/battleSettle/',

    /** battleUI文件夹 */
    BattleUI_BuffIcon = 'texture/battleUI/buffIcon/',
    BattleUI_WordImg = 'texture/battleUI/wordImg/',
    BattleUI_Bg_Battle_Bg = 'texture/battleUI/bg/battle_bg_',

    /** chat文件夹 */
    Chat_Emoji_Img_Lt_1 = 'texture/chat/emoji/img_lt_1@ML',
    Chat_Emoji_Img_Lt_3 = 'texture/chat/emoji/img_lt_3@ML',
    Chat = 'texture/chat/',
    Chat_Emoji = 'texture/chat/emoji/',

    /** CollectionBook 文件夹 */
    CollectionBook_Bg_Bwz_Chahua = 'texture/collectionBook/bg_bwz_chahua',
    CollectionBook_Icon_Jianwen_Dengji = 'texture/collectionBook/icon_jianwen_dengji',
    CollectionBook_Oddity = 'texture/collectionBook/oddity/',

    /** createRole文件夹 */
    CreateRole_Btn_Cjjs_Xinggeweixuanzhong_01 = 'texture/createRole/btn_cjjs_xinggeweixuanzhong_01',
    CreateRole_Btn_Cjjs_Xinggeweixuanzhong_02 = 'texture/createRole/btn_cjjs_xinggeweixuanzhong_02',
    CreateRole_Btn_Cjjs_Xinggexuanzhong_01 = 'texture/createRole/btn_cjjs_xinggexuanzhong_01',
    CreateRole_Btn_Cjjs_Xinggexuanzhong_02 = 'texture/createRole/btn_cjjs_xinggexuanzhong_02',
    CreateRole_Img_Cjjs_Juese_01 = 'texture/createRole/img_cjjs_juese_01',
    CreateRole_Img_Cjjs_Juese_02 = 'texture/createRole/img_cjjs_juese_02',

    /** gameLevel */
    GameLevel = 'texture/gameLevel/',
    GameLevel_City = 'texture/gameLevel/city/',

    /** general 文件夹 */
    General_Img_Wujiang_Kapai = 'texture/general/img_wujiang_kapai_',
    General_Img_Wujiang_T1 = 'texture/general/img_wujiang_t1_',
    General_Img_Wujiang_T2 = 'texture/general/img_wujiang_t2_',
    General_Img_Wujiang_T3 = 'texture/general/img_wujiang_t3_',
    General_Img_Wujiang_T4 = 'texture/general/img_wujiang_t4_',
    General_Item = 'texture/general/item/',
    Img_Wujiang_T3_0 = 'texture/general/img_wujiang_t3_0',

    /** grade 文件夹 */
    Grade_Bnr_Jinjie_Huodongtu = 'texture/grade/bnr_jinjie_huodongtu@ML',
    Grade_Btn_Jj_An = 'texture/grade/btn_jj_an',
    Grade_Img_Jinjie_Huajin = 'texture/grade/img_jinjie_huajin',

    /** login 文件夹 */
    Login_Btn_Dl_Hf = 'texture/login/btn_dl_hf',

    /** player 文件夹 */
    Player_Shadow_1 = 'texture/player/shadow_1',

    /** shop 文件夹 */
    Shop_Img_Sc_Mianfei = 'texture/shop/img_sc_mianfei',
    Shop_Img_Sc_Zhekou = 'texture/shop/img_sc_zhekou',

    /** vip 文件夹 */

    Vip_Font_Svip = 'texture/vip/font_svip',
    Vip_Font_Vip = 'texture/vip/font_vip',
    Vip_Font_Vip_Guizu = 'texture/vip/font_vip_guizu@ML',
    Vip_Font_Vip_Wanghou = 'texture/vip/font_vip_wanghou@ML',
    Vip_Icon_Vip_Svip = 'texture/vip/icon_vip_svip',
    Vip_Icon_Vip_Svip_Zhanghaoshenji = 'texture/vip/icon_vip_svip_zhanghaoshenji',
    Vip_Icon_Vip_Vip = 'texture/vip/icon_vip_vip',
    Vip_Icon_Vip_Vip_Zhanghaoshenji = 'texture/vip/icon_vip_vip_zhanghaoshenji',
    Vip_Gift_Com_Font_Vip = 'texture/vip/gift/com_font_vip_',

    /** Water 文件夹 */
    Water = 'effect/Water',

    /** WorldBoss 文件夹 */
    WorldBoss_6061 = 'effect/worldBoss/6061',
    WorldBoss_6071 = 'effect/worldBoss/6071',
    WorldBoss_Bg_Mjlx_Bossbiejing = 'texture/worldBoss/bg_mjlx_bossbiejing',
    WorldBoss_Ui = 'effect/worldBoss/ui_',

    /** Activity 文件夹 */
    Activity_CashCow_Tree = 'texture/activity/cashCow/tree/',
    Activity_Icon = 'texture/activity/icon/',

    /** BeaconWar 文件夹 */
    BeaconWar_City = 'texture/beaconWar/city/',

    /** Exchange 文件夹 */
    Exchange_Img_Duihuan_Yuanbao = 'texture/exchange/img_duihuan_yuanbao_',

    /** Fight 文件夹 */
    Fight_Ui = 'effect/fight/ui_',
    Fuben_Ui_8001 = 'effect/fuben/ui_8001',
    Fuben_Ui_8002 = 'effect/fuben/ui_8002',

    /** Head 文件夹 */
    HeadIcon = 'texture/headIcon/',

    /** Mail 文件夹 */
    Mail_Icon_Yj_Tb = 'texture/mail/icon_yj_tb@ML',
    Mail_Icon_Yj_Tb2 = 'texture/mail/icon_yj_tb2@ML',

    /** Maincity 文件夹 */
    Maincity_Map = 'texture/maincity/map/',
    Maincity_Map_Minimap = 'texture/maincity/map/minimap/',

    /** material 文件夹 */
    Material = 'texture/material/',
    Material_Item_Bg = 'texture/material/item_bg',

    /** official 文件夹 */
    Official_Icon_Icon = 'texture/official/icon/icon_',
    Official_Icon_Icon_Guanzhi = 'texture/official/icon/icon_guanzhi_',
    Official_Icon_Icon_Hufu = 'texture/official/icon/icon_hufu_',

    /** Onhook 文件夹 */
    Onhook = 'effect/onhook/',
    Onhook_Ui_6582 = 'effect/onhook/ui_6582',
    Onhook_Ui_8046 = 'effect/onhook/ui_8046',
    Onhook_Ui_8047 = 'effect/onhook/ui_8047',

    /** portraitIcon 文件夹 */
    PortraitIcon = 'texture/portraitIcon/',

    /** rankList 文件夹 */
    RankList_Bg_Rank = 'texture/rankList/bg_rank',
    RankList_Bg_Rank_Di = 'texture/rankList/bg_rank_di',

    /** recharge 文件夹 */
    Recharge_Img_Chongzhi_Yubi = 'texture/recharge/img_chongzhi_yubi_',

    /** RoleHead 文件夹 */
    RoleHead = 'texture/roleHead/',

    /** role 文件夹 */
    Role_RoleArmy_Icon_Junxian = 'texture/role/roleArmy/icon_junxian_',

    /** roleskin 文件夹 */
    Roleskill_Img_Wy = 'texture/roleskill/img_wy_',
    Roleskin_Suit_Icon = 'texture/roleskin/suit/icon/',

    /** team 文件夹 */
    Team_Btn_Zd = 'texture/team/btn_zd_',
    Team_Img_Zd_Tu = 'texture/team/img_zd_tu_',
    /** title 文件夹 */
    Texture_Title = 'texture/title/',
    Effect_Title = 'effect/title/',
    /** touch 文件夹 */
    Touch_Ui = 'effect/touch/ui_',
    /** 功能预告 文件夹 */
    FuncPreviewKuang = 'texture/funcPreview/img_FuncPre_dk_02',
    FuncPreviewSelect = 'texture/funcPreview/img_FuncPre_dk_01',
    FuncPreviewUi = 'texture/funcPreview/ui/',
    FuncPreviewDesc = 'texture/funcPreview/desc/',
    FuncPreviewOpen = 'texture/funcPreview/open/',
    /** 新的标签图 */
    NewMark = 'texture/lobby/icon_zjm_xin@ML',
}
