declare enum ProtoId {
		C2SPing_ID=2,
		S2CPing_ID=3,
		S2CErrorRpc_ID=15,
		S2CRep_ID=16,
		C2SLogin_ID=25,
		S2CLogin_ID=26,
		C2SReLogin_ID=27,
		S2CReLogin_ID=28,
		C2SUpdateAttr_ID=30,
		C2SUpdateOnlineTime_ID=31,
		S2CNoticeDebug_ID=32,
		S2CRoleInfo_ID=33,
		C2SGetAreaOpenDay_ID=39,
		S2CGetAreaOpenDay_ID=40,
		C2SGetIDCardChargeRMB_ID=633,
		S2CGetIDCardChargeRMB_ID=634,
		C2SNewPlayerGuideAdd_ID=42,
		S2CNewPlayerGuidePush_ID=43,
		S2CDayResetPush_ID=49,
		S2CWeekResetPush_ID=50,
		S2CMonthResetPush_ID=51,
		C2SFightRecordWatch_ID=57,
		S2CKill_ID=58,
		C2SLoginEnd_ID=60,
		S2CLoginEnd_ID=61,
		C2SSaveClientData_ID=886,
		S2CSaveClientData_ID=895,
		S2CSendClientData_ID=896,
		S2CBagChange_ID=197,
		S2CBagInfo_ID=201,
		S2CItemFly_ID=214,
		C2SExtendEquipBag_ID=215,
		S2CExtendEquipBag_ID=216,
		C2SExchange_ID=219,
		S2CExchange_ID=220,
		C2SBatchExchange_ID=232,
		S2CBatchExchange_ID=233,
		C2SGetBattlePrize_ID=393,
		S2CTaskDataPush_ID=333,
		C2SChargeMallBuyReq_ID=202,
		S2CChargeMallBuyRep_ID=203,
		C2SGetChargeMallList_ID=206,
		S2CGetChargeMallList_ID=207,
		C2SCurrencyExchangeReq_ID=208,
		S2CCurrencyExchangeRep_ID=209,
		C2SGm_ID=66,
		S2CGm_ID=67,
		C2SGetMailAttachReq_ID=183,
		S2CGetMailAttachRep_ID=184,
		C2SReadMailReq_ID=185,
		S2CReadMailRep_ID=186,
		C2SDelMail_ID=194,
		S2CDelMail_ID=195,
		S2CAddMail_ID=191,
		C2SMailList_ID=217,
		S2CMailList_ID=213,
		C2SBossPersonalInfo_ID=245,
		S2CBossPersonalInfo_ID=240,
		C2SBossPersonalFight_ID=241,
		S2CBossPersonalFight_ID=242,
		C2SBossPersonalSweep_ID=243,
		S2CBossPersonalSweep_ID=244,
		C2SBossVipInfo_ID=354,
		S2CBossVipInfo_ID=355,
		C2SBossVipFight_ID=356,
		S2CBossVipFight_ID=357,
		C2SBossVipSweep_ID=358,
		S2CBossVipSweep_ID=359,
		C2SMultiBossFight_ID=635,
		S2CMultiBossFight_ID=636,
		C2SMultiBossInspire_ID=651,
		S2CMultiBossInspire_ID=652,
		C2SMultiBossBuyTimes_ID=637,
		S2CMultiBossBuyTimes_ID=638,
		C2SMultiBossGetRankData_ID=639,
		S2CMultiBossGetRankData_ID=640,
		C2SGetMultiBossData_ID=654,
		S2CGetMultiBossData_ID=655,
		C2SMultiBossGetPlayerData_ID=657,
		S2CMultiBossGetPlayerData_ID=658,
		C2SMultiBossGetHp_ID=666,
		S2CMultiBossGetHp_ID=667,
		C2SMultiBossFocus_ID=670,
		S2CMultiBossFocus_ID=672,
		C2SMultiBossGetBossList_ID=958,
		S2CMultiBossUpdateState_ID=687,
		C2SMultiBossGetReliveList_ID=695,
		S2CMultiBossGetReliveList_ID=696,
		C2SMultiBossRelive_ID=698,
		S2CMultiBossRelive_ID=699,
		S2CTips_ID=218,
		C2SSendChatMsg_ID=153,
		S2CSendChatMsg_ID=409,
		S2CPushChat_ID=76,
		C2SGetHistoryChat_ID=223,
		S2CGetHistoryChat_ID=224,
		C2SBlack_ID=254,
		S2CBlack_ID=255,
		C2SGetBlackList_ID=256,
		S2CGetBlackList_ID=257,
		S2CSendNotice_ID=200,
		C2SSendPlayWayChatMsg_ID=548,
		C2SShowItem_ID=274,
		S2CShowItem_ID=275,
		C2SGetShowInfo_ID=276,
		S2CGetShowInfo_ID=277,
		C2SGetRankData_ID=167,
		S2CGetRankData_ID=168,
		C2SRankWorship_ID=608,
		S2CRankWorship_ID=609,
		S2CMaterialListPush_ID=394,
		C2SMaterialChallenge_ID=398,
		C2SMaterialSweep_ID=399,
		C2SMaterialSweepOneKey_ID=400,
		C2SMaterialBuyTimes_ID=401,
		C2SMaterialBuyTimesOneKey_ID=402,
		S2CGradeListPush_ID=281,
		C2SGradeLevelUp_ID=284,
		C2SGradeLevelBreak_ID=285,
		C2SGradeGetUpGift_ID=286,
		C2SGradeGetThreeGift_ID=287,
		C2SGradeSkillLevelUp_ID=288,
		C2SGradeEquipAutoWear_ID=289,
		C2SGradeEquipPosLevelUp_ID=292,
		C2SGradeEquipMake_ID=291,
		C2SGradeEquipSmelting_ID=299,
		C2SGradeBeGoldLevelUp_ID=293,
		C2SGradeSoul_ID=294,
		C2SGradeGod_ID=295,
		C2SGradeSkinActive_ID=296,
		C2SGradeSkinLevelUp_ID=297,
		C2SGradeSkinUse_ID=298,
		C2SGradeSkinOff_ID=327,
		S2CTitleListPush_ID=265,
		C2STitleActive_ID=266,
		C2STitleUpGrade_ID=267,
		C2STitleWear_ID=268,
		C2STitleOff_ID=269,
		C2STitleInfo_ID=270,
		S2CTitleInfo_ID=300,
		S2CUpdateFightAttr_ID=313,
		S2CSendFuncOpenData_ID=315,
		S2CUpdateFuncOpen_ID=316,
		C2SOpenFuncRed_ID=970,
		S2COpenFuncRed_ID=971,
		C2SGetFuncPreviewPrize_ID=1269,
		S2CGetFuncPreviewPrize_ID=1270,
		C2SChangeNick_ID=555,
		S2CChangeNick_ID=556,
		S2CNoticeUnitDataChange_ID=85,
		S2CNoticePlayerBeAttack_ID=87,
		S2CNoticePlayerStopMove_ID=88,
		S2CNoticeMonsterLeaveMap_ID=89,
		S2CNoticeMapDataChange_ID=90,
		S2CNoticePlayerLeaveMap_ID=91,
		S2CNoticeMonsterEnterMap_ID=92,
		S2CNoticePlayerEnterMap_ID=93,
		S2CNoticePlayerMove_ID=94,
		S2CBattlefieldReport_ID=212,
		S2CPrizeReport_ID=372,
		C2SNoticeFightStateReq_ID=899,
		S2CNoticeFightStateRep_ID=900,
		C2SEnterMap_ID=113,
		S2CEnterMap_ID=198,
		C2SLeaveMap_ID=114,
		C2SStartMove_ID=115,
		C2SStopMove_ID=116,
		S2CNoticePlayerChangeMap_ID=117,
		C2SPlayerActModelData_ID=946,
		S2CPlayerActModelData_ID=947,
		S2CActListRedPush_ID=610,
		S2CActListPush_ID=258,
		C2SGetActivityConfig_ID=605,
		S2CGetActivityConfig_ID=606,
		C2SPlayerSignInUIData_ID=562,
		S2CPlayerSignInUIData_ID=563,
		C2SPlayerSignIn_ID=558,
		S2CPlayerSignIn_ID=559,
		C2SPlayerDoubleSignIn_ID=564,
		S2CPlayerDoubleSignIn_ID=565,
		C2SPlayerRemedySignIn_ID=566,
		S2CPlayerRemedySignIn_ID=567,
		C2SPlayerSignInNumReward_ID=560,
		S2CPlayerSignInNumReward_ID=561,
		C2SGetCDKeyReward_ID=1265,
		S2CGetCDKeyReward_ID=1266,
		C2SZhaoMuUIData_ID=822,
		S2CZhaoMuUIData_ID=823,
		C2SZhaoMuLuckyDraw_ID=824,
		S2CZhaoMuLuckyDraw_ID=825,
		C2SZhaoMuGetStageRw_ID=826,
		S2CZhaoMuGetStageRw_ID=827,
		C2SZhaoMuSetWish_ID=828,
		S2CZhaoMuSetWish_ID=829,
		C2SZhaoMuOpenLog_ID=830,
		S2CZhaoMuOpenLog_ID=831,
		C2SZhaoMuBagData_ID=832,
		S2CZhaoMuBagData_ID=833,
		C2SZhaoMuBagTakeOut_ID=834,
		S2CZhaoMuBagTakeOut_ID=835,
		C2SGetOnlineAward_ID=950,
		S2CGetOnlineAward_ID=951,
		C2SGetStageReward_ID=1100,
		S2CGetStageReward_ID=1101,
		C2SCashCowUIData_ID=996,
		S2CCashCowUIData_ID=997,
		C2SCashCowShake_ID=995,
		S2CCashCowShake_ID=998,
		C2SGetAllServerReward_ID=1121,
		S2CGetAllServerReward_ID=1122,
		C2SGetGeneralPassReward_ID=1123,
		S2CGetGeneralPassReward_ID=1134,
		S2CPlayWayIcon_ID=150,
		C2SOpenWorldBossUI_ID=489,
		S2COpenWorldBossUI_ID=490,
		C2SEnterWorldBoss_ID=469,
		S2CEnterWorldBoss_ID=470,
		C2SGetWorldBossRank_ID=493,
		S2CGetWorldBossRank_ID=494,
		C2SChallengeWorldBossPVE_ID=471,
		S2CChallengeWorldBossPVE_ID=472,
		S2CWorldBossShieldNotice_ID=515,
		S2CWorldBossShieldOpenNotice_ID=532,
		C2SChallengeWorldBossPVP_ID=473,
		S2CChallengeWorldBossPVP_ID=474,
		C2SWorldBossBuyBuff_ID=475,
		S2CWorldBossBuyBuff_ID=476,
		C2SWorldBossRandomDice_ID=477,
		S2CWorldBossRandomDice_ID=478,
		S2CWorldBossCurMaxDiceNumNotice_ID=520,
		S2CWorldBossRandomDiceOpenNotice_ID=533,
		C2SExitWorldBoss_ID=479,
		S2CExitWorldBoss_ID=480,
		C2SOpenBossHomeUI_ID=613,
		S2COpenBossHomeUI_ID=614,
		C2SEnterBossHome_ID=617,
		S2CEnterBossHome_ID=618,
		C2SExitBossHome_ID=664,
		S2CExitBossHome_ID=665,
		C2SGetBossHomeRankData_ID=644,
		S2CGetBossHomeRankData_ID=645,
		C2SBossHomePVE_ID=660,
		S2CBossHomePVE_ID=661,
		C2SGetBossHomePlayerPos_ID=675,
		S2CGetBossHomePlayerPos_ID=676,
		C2SBossHomePVP_ID=679,
		S2CBossHomePVP_ID=680,
		C2SBossHomeOpenBagUI_ID=714,
		S2CBossHomeOpenBagUI_ID=715,
		S2CBossHomeBagNew_ID=736,
		C2SBossHomeBagOneKeyGet_ID=683,
		S2CBossHomeBagOneKeyGet_ID=684,
		C2SBossHomeBuyBuff_ID=690,
		S2CBossHomeBuyBuff_ID=691,
		C2SBossHomeRelive_ID=704,
		S2CBossHomeRelive_ID=705,
		C2SBossHomeBuyEnergy_ID=708,
		S2CBossHomeBuyEnergy_ID=709,
		C2SBossHomeTreat_ID=710,
		S2CBossHomeTreat_ID=711,
		C2SBossHomeGetPlayerHpList_ID=726,
		S2CBossHomeGetPlayerHpList_ID=727,
		C2SOpenEscortUI_ID=1168,
		S2COpenEscortUI_ID=1169,
		C2SEscortRefreshUIData_ID=1230,
		S2CEscortRefreshUIData_ID=1231,
		C2SEscortRefreshCar_ID=1172,
		S2CEscortRefreshCar_ID=1173,
		C2SEscortCarStart_ID=1174,
		S2CEscortCarStart_ID=1175,
		C2SEscortQuickFinish_ID=1190,
		S2CEscortQuickFinish_ID=1191,
		C2SEscortGetFinishReward_ID=1209,
		S2CEscortGetFinishReward_ID=1210,
		S2CEscortFinishRewardNotice_ID=1218,
		C2SEscortGetCarData_ID=1178,
		S2CEscortGetCarData_ID=1187,
		C2SEscortCarRob_ID=1179,
		S2CEscortCarRob_ID=1180,
		S2CEscortCarRobNotice_ID=1214,
		C2SEscortOpenRobLog_ID=1183,
		S2CEscortOpenRobLog_ID=1184,
		C2SEscortRevenge_ID=1185,
		S2CEscortRevenge_ID=1186,
		C2SGetUserShowInfo_ID=649,
		S2CGetUserShowInfo_ID=650,
		C2SGetWorldLevel_ID=513,
		S2CGetWorldLevel_ID=514,
		C2SOpenRankMatchUI_ID=1076,
		S2COpenRankMatchUI_ID=1077,
		C2SRankMatchStartMatch_ID=1080,
		S2CRankMatchStartMatch_ID=1081,
		C2SRankMatchChallenge_ID=1084,
		S2CRankMatchChallenge_ID=1085,
		C2SRankMatchBuyChallengeNum_ID=1088,
		S2CRankMatchBuyChallengeNum_ID=1089,
		C2SRankMatchOpenFightLogUI_ID=1090,
		S2CRankMatchOpenFightLogUI_ID=1091,
		C2SRankMatchPlayFightLog_ID=1092,
		S2CRankMatchPlayFightLog_ID=1093,
		C2SRankMatchGetDayWinReward_ID=1094,
		S2CRankMatchGetDayWinReward_ID=1095,
		C2SRankMatchGetSessionWinReward_ID=1096,
		S2CRankMatchGetSessionWinReward_ID=1104,
		C2SRankMatchGetLevelReward_ID=1097,
		S2CRankMatchGetLevelReward_ID=1105,
		C2SGetRankMatchRank_ID=1098,
		S2CGetRankMatchRank_ID=1099,
		C2SMeltEquip_ID=221,
		S2CMeltEquip_ID=222,
		C2SAutoWearEquip_ID=230,
		S2CAutoWearEquip_ID=231,
		C2SWearOrRemoveEquip_ID=228,
		S2CWearOrRemoveEquip_ID=229,
		C2SEquipPosInfo_ID=238,
		S2CEquipPosInfo_ID=239,
		C2SStrengthEquipPos_ID=236,
		S2CStrengthEquipPos_ID=237,
		C2SAutoStrengthEquipPos_ID=246,
		S2CAutoStrengthEquipPos_ID=247,
		C2SResonateEquipPos_ID=252,
		S2CResonateEquipPos_ID=253,
		C2SBuildEquip_ID=278,
		S2CBuildEquip_ID=279,
		C2SRiseStarEquip_ID=282,
		S2CRiseStarEquip_ID=283,
		C2SEquipGemInlay_ID=1115,
		S2CEquipGemInlay_ID=1116,
		C2SEquipGemOneKeyInlay_ID=1117,
		S2CEquipGemOneKeyInlay_ID=1118,
		C2SEquipGemOneKeyLevelUp_ID=1119,
		S2CEquipGemOneKeyLevelUp_ID=1120,
		C2SSuitActive_ID=325,
		S2CSuitActive_ID=319,
		C2SSuitGradeUp_ID=1007,
		S2CSuitGradeUp_ID=1008,
		C2SSuitInfo_ID=326,
		S2CSuitInfo_ID=320,
		C2SSuitWearOrRemove_ID=331,
		S2CSuitWearOrRemove_ID=332,
		C2SRoleSkinInfo_ID=303,
		S2CRoleSkinInfo_ID=304,
		C2SRoleSkinActive_ID=305,
		S2CRoleSkinActive_ID=306,
		C2SRoleSkinRiseStar_ID=307,
		S2CRoleSkinRiseStar_ID=308,
		C2SRoleSkinWearOrRemove_ID=317,
		S2CRoleSkinWearOrRemove_ID=318,
		C2SRoleSkinSoulLevel_ID=321,
		S2CRoleSkinSoulLevel_ID=322,
		C2SRoleSkinGodNum_ID=323,
		S2CRoleSkinGodNum_ID=324,
		S2CItemPop_ID=314,
		S2CItemInfoPop_ID=383,
		S2CNotice_ID=1294,
		S2CRoleSkillList_ID=330,
		C2SRoleSkillUp_ID=328,
		S2CRoleSkillUp_ID=329,
		C2SRoleMartialList_ID=1046,
		S2CRoleMartialList_ID=1039,
		C2SRoleMartialLevelUp_ID=1040,
		S2CRoleMartialLevelUp_ID=1041,
		C2SArmyInfo_ID=342,
		S2CArmyInfo_ID=343,
		C2SArmyUp_ID=344,
		S2CArmyUp_ID=345,
		C2SArmyUseItem_ID=346,
		S2CArmyUseItem_ID=347,
		C2SArmyReward_ID=348,
		S2CArmyReward_ID=349,
		C2SArmySkillActive_ID=352,
		S2CArmySkillActive_ID=353,
		C2SArenaList_ID=373,
		S2CArenaList_ID=374,
		C2SArenaFight_ID=375,
		S2CArenaFight_ID=376,
		C2SArenaSweep_ID=377,
		S2CArenaSweep_ID=378,
		C2SArenaBuyTimes_ID=381,
		S2CArenaBuyTimes_ID=382,
		C2SGetArenaRankList_ID=390,
		S2CGetArenaRankList_ID=391,
		C2SChangeLineup_ID=455,
		S2CChangeLineup_ID=456,
		S2CLineupInfo_ID=457,
		S2CAllGeneral_ID=413,
		S2CAddGeneral_ID=414,
		S2CDelGeneral_ID=415,
		C2SGeneralLevelUp_ID=416,
		S2CGeneralLevelUp_ID=417,
		C2SGeneralQualityUp_ID=418,
		S2CGeneralQualityUp_ID=419,
		S2CGeneralUpdateAttr_ID=420,
		S2CGeneralListUpdateAttr_ID=421,
		C2SGeneralLock_ID=453,
		S2CGeneralLock_ID=454,
		C2SGeneralOneKeyQualityUp_ID=458,
		S2CGeneralOneKeyQualityUp_ID=459,
		C2SGeneralAwaken_ID=536,
		S2CGeneralAwaken_ID=537,
		C2SGeneralAwakenSkill_ID=820,
		S2CGeneralAwakenSkill_ID=821,
		C2SGeneralGradeUp_ID=538,
		S2CGeneralGradeUp_ID=539,
		C2SGeneralSkinLevelUp_ID=540,
		S2CGeneralSkinLevelUp_ID=541,
		S2CGeneralSkinUpdate_ID=554,
		C2SGeneralWearSkin_ID=542,
		S2CGeneralWearSkin_ID=543,
		C2SGeneralEquipWear_ID=716,
		S2CGeneralEquipWear_ID=717,
		C2SGeneralEquipOneKeyWear_ID=791,
		S2CGeneralEquipOneKeyWear_ID=792,
		C2SGeneralEquipStarUp_ID=718,
		S2CGeneralEquipStarUp_ID=719,
		C2SGeneralStudySkill_ID=730,
		S2CGeneralStudySkill_ID=731,
		C2SGeneralSkillLock_ID=732,
		S2CGeneralSkillLock_ID=733,
		C2SGeneralSkillRecycle_ID=793,
		S2CGeneralSkillRecycle_ID=794,
		C2SGeneralReturn_ID=987,
		S2CGeneralReturn_ID=988,
		C2SGeneralReborn_ID=989,
		S2CGeneralReborn_ID=990,
		C2SGeneralRelease_ID=991,
		S2CGeneralRelease_ID=992,
		C2SGeneralStick_ID=999,
		S2CGeneralStick_ID=1000,
		C2SComMaterial_ID=370,
		S2CComMaterial_ID=371,
		S2CRedDotStateList_ID=408,
		C2SVipInfo_ID=433,
		S2CVipInfo_ID=434,
		C2SVipLevelReward_ID=439,
		S2CVipLevelReward_ID=440,
		C2SVipDailyReward_ID=437,
		S2CVipDailyReward_ID=438,
		S2CSecretMallInfo_ID=467,
		C2SSecretMallBuy_ID=463,
		S2CSecretMallBuy_ID=464,
		C2SSecretMallRefresh_ID=465,
		S2CSecretMallRefresh_ID=466,
		C2SShoppingMallInfo_ID=483,
		S2CShoppingMallInfo_ID=484,
		C2SShoppingMallBuy_ID=485,
		S2CShoppingMallBuy_ID=486,
		C2SMainTaskInfo_ID=516,
		S2CMainTaskInfo_ID=517,
		C2SMainTaskReward_ID=518,
		S2CMainTaskReward_ID=519,
		C2SAFKInfo_ID=526,
		S2CAFKInfo_ID=527,
		C2SAFKReward_ID=528,
		S2CAFKReward_ID=529,
		C2SQuickAFK_ID=530,
		S2CQuickAFK_ID=531,
		C2SAFKRewardAdd_ID=642,
		S2CAFKRewardAdd_ID=643,
		C2SWelcome_ID=557,
		C2SStageFight_ID=523,
		S2CStageFight_ID=524,
		C2SStagePassInfo_ID=550,
		S2CStagePassInfo_ID=551,
		C2SStagePassReward_ID=552,
		S2CStagePassReward_ID=553,
		C2SOfficeInfo_ID=580,
		S2COfficeInfo_ID=581,
		C2SOfficeTargetReward_ID=572,
		S2COfficeTargetReward_ID=573,
		C2SOfficeDailyReward_ID=574,
		S2COfficeDailyReward_ID=575,
		C2SOfficeTaskReward_ID=576,
		S2COfficeTaskReward_ID=577,
		C2SOfficeUp_ID=578,
		S2COfficeUp_ID=579,
		C2SOfficeSignUp_ID=588,
		S2COfficeSignUp_ID=589,
		C2SOfficeSignAutoUp_ID=590,
		S2COfficeSignAutoUp_ID=591,
		C2SOfficeSignStar_ID=592,
		S2COfficeSignStar_ID=593,
		C2SOfficeSignAutoStar_ID=594,
		S2COfficeSignAutoStar_ID=595,
		C2SOfficeSignBreakStar_ID=596,
		S2COfficeSignBreakStar_ID=597,
		C2SOfficeSignRefine_ID=598,
		S2COfficeSignRefine_ID=599,
		C2SOfficeSignRefineBreak_ID=600,
		S2COfficeSignRefineBreak_ID=601,
		C2SBeautyInfo_ID=621,
		S2CBeautyInfo_ID=622,
		C2SBeautyActive_ID=623,
		S2CBeautyActive_ID=624,
		C2SBeautyLevelUp_ID=625,
		S2CBeautyLevelUp_ID=626,
		C2SBeautyLevelUpAuto_ID=627,
		S2CBeautyLevelUpAuto_ID=628,
		C2SBeautyStarUp_ID=629,
		S2CBeautyStarUp_ID=630,
		C2STeamDunInfo_ID=721,
		S2CTeamDunInfo_ID=722,
		C2SMyTeamInfo_ID=758,
		S2CMyTeamInfo_ID=759,
		C2STeamDunBuyPassTime_ID=734,
		S2CTeamDunBuyPassTime_ID=735,
		C2STeamDunSweep_ID=737,
		S2CTeamDunSweep_ID=738,
		C2STeamDunViewList_ID=762,
		S2CTeamDunViewList_ID=763,
		C2STeamDunCreate_ID=741,
		S2CTeamDunCreate_ID=742,
		C2STeamDunJoin_ID=743,
		S2CTeamDunJoin_ID=744,
		C2STeamDunLeaveOrCancel_ID=766,
		S2CTeamDunLeaveOrCancel_ID=769,
		C2STeamDunKick_ID=746,
		S2CTeamDunKick_ID=747,
		C2STeamDunStart_ID=751,
		S2CTeamDunStart_ID=750,
		C2STeamDunMatchPlayer_ID=752,
		S2CTeamDunMatchPlayer_ID=753,
		C2STeamDunLineupInfo_ID=786,
		S2CTeamDunLineupInfo_ID=787,
		C2STeamDunChangeLineup_ID=783,
		S2CTeamDunChangeLineup_ID=784,
		C2STeamDunSetAccept_ID=811,
		S2CTeamDunSetAccept_ID=812,
		C2STeamDunSetPowerLimit_ID=798,
		S2CTeamDunSetPowerLimit_ID=799,
		C2STeamDunInvite_ID=800,
		S2CTeamDunInvite_ID=801,
		C2STeamDunInviteAuto_ID=802,
		S2CTeamDunInviteAuto_ID=803,
		S2CTeamDunReceiveInvite_ID=804,
		C2STeamDunGetReport_ID=810,
		C2STeamDunMatchList_ID=814,
		S2CTeamDunMatchList_ID=817,
		C2STeamDunReject_ID=873,
		S2CTeamDunReject_ID=874,
		S2CRealNameTimeLimit_ID=611,
		C2SSysSettingsInfo_ID=688,
		S2CSysSettingsInfo_ID=689,
		C2SHeadInfo_ID=772,
		S2CHeadInfo_ID=773,
		C2SHeadActivate_ID=774,
		C2SHeadUpStar_ID=776,
		C2SHeadUse_ID=778,
		S2CHeadUpdate_ID=795,
		C2SRelationInfo_ID=836,
		S2CRelationInfo_ID=847,
		C2SApplyAddFriend_ID=837,
		S2CApplyAddFriend_ID=838,
		C2SApplyOperation_ID=839,
		S2CApplyOperation_ID=840,
		C2SDelFriend_ID=841,
		S2CDelFriend_ID=842,
		S2CAddRelation_ID=858,
		C2SFriendGifts_ID=843,
		S2CFriendGifts_ID=844,
		C2SGetFriendGifts_ID=878,
		S2CGetFriendGifts_ID=879,
		C2SFindPlayerInfo_ID=845,
		S2CFindPlayerInfo_ID=846,
		C2SRecommendList_ID=870,
		S2CRecommendList_ID=871,
		C2SFriendPrivateChat_ID=882,
		S2CFriendPrivateChat_ID=883,
		C2SFamilyTaskHelpPartner_ID=924,
		S2CFamilyTaskHelpPartner_ID=927,
		C2SFamilyTaskInfo_ID=917,
		S2CFamilyTaskInfo_ID=918,
		C2SFamilyTaskSetPartnerToHelp_ID=925,
		S2CFamilyTaskSetPartnerToHelp_ID=926,
		C2SFamilyTaskRefresh_ID=910,
		S2CFamilyTaskRefresh_ID=911,
		C2SFamilyTaskStart_ID=913,
		S2CFamilyTaskStart_ID=914,
		C2SFamilyTaskGetPrice_ID=915,
		S2CFamilyTaskGetPrice_ID=916,
		C2SFamilyMemberList_ID=933,
		S2CFamilyMemberList_ID=934,
		C2SFamilyInfo_ID=940,
		S2CFamilyInfo_ID=944,
		C2SFamilyRoleInfo_ID=1017,
		S2CFamilyRoleInfo_ID=1019,
		C2SFamilyTaskSpeed_ID=954,
		S2CFamilyTaskSpeed_ID=955,
		C2SFamilyTaskGetAllCanStart_ID=965,
		S2CFamilyTaskGetAllCanStart_ID=966,
		C2SFamilyTaskStartOneKey_ID=968,
		S2CFamilyTaskStartOneKey_ID=969,
		S2CFamilyLevelUp_ID=974,
		C2SFamilyTopPlayerData_ID=977,
		S2CFamilyTopPlayerData_ID=978,
		C2SFamilyRename_ID=1001,
		S2CFamilyRename_ID=1002,
		C2SFamilyRenameWord_ID=1003,
		S2CFamilyRenameWord_ID=1004,
		C2SFamilyWorship_ID=1005,
		S2CFamilyWorship_ID=1006,
		C2SFamilyDailySalary_ID=1015,
		S2CFamilyDailySalary_ID=1016,
		C2SFamilyPatriInfo_ID=1020,
		S2CFamilyPatriInfo_ID=1021,
		C2SFamilyPatriLeaderInfo_ID=1047,
		S2CFamilyPatriLeaderInfo_ID=1049,
		C2SFamilyPatriChallengeBoss_ID=1022,
		S2CFamilyPatriChallengeBoss_ID=1023,
		C2SFamilyPatriChallengeLeader_ID=1024,
		S2CFamilyPatriChallengeLeader_ID=1025,
		C2SFamilyPatriWatchVideos_ID=1028,
		S2CFamilyPatriWatchVideos_ID=1029,
		C2SFamilyPatriGetRank_ID=1030,
		S2CFamilyPatriGetRank_ID=1031,
		C2SFamilyPatriGetMyRank_ID=1032,
		S2CFamilyPatriGetMyRank_ID=1033,
		C2STotemInfo_ID=1106,
		S2CTotemInfo_ID=1108,
		C2STotemBuild_ID=1109,
		S2CTotemBuild_ID=1110,
		C2SGetDrillGroundInfo_ID=1067,
		S2CGetDrillGroundInfo_ID=1073,
		C2SDrillGroundResonateLevelUp_ID=1069,
		S2CDrillGroundResonateLevelUp_ID=1074,
		C2SDrillGroundLevelUp_ID=1071,
		S2CDrillGroundLevelUp_ID=1075,
		C2STrialCopyInfo_ID=1125,
		S2CTrialCopyInfo_ID=1126,
		C2STrialCopyBossInfo_ID=1140,
		S2CTrialCopyBossInfo_ID=1141,
		C2STrialCopyRank_ID=1127,
		S2CTrialCopyRank_ID=1144,
		C2STrialCopyRedPacketRank_ID=1165,
		S2CTrialCopyRedPacketRank_ID=1167,
		C2STrialCopyChallenge_ID=1128,
		S2CTrialCopyChallenge_ID=1129,
		C2STrialCopySweep_ID=1130,
		S2CTrialCopySweep_ID=1131,
		C2STrialCopyBuyNum_ID=1142,
		S2CTrialCopyBuyNum_ID=1143,
		C2STrialCopyReward_ID=1150,
		S2CTrialCopyReward_ID=1151,
		C2STrialCopyRedPacket_ID=1152,
		S2CTrialCopyRedPacket_ID=1153,
		S2CCollectionBookAllData_ID=903,
		S2CCollectionBookUpdate_ID=904,
		C2SCollectionBookActive_ID=905,
		S2CCollectionBookActive_ID=906,
		C2SCollectionBookStarUp_ID=907,
		S2CCollectionBookStarUp_ID=908,
		C2SCollectionBookTask_ID=921,
		S2CCollectionBookTask_ID=922,
		C2SCollectionBookLook_ID=936,
		S2CCollectionBookLook_ID=937,
		C2SSilkRoadInfo_ID=1220,
		S2CSilkRoadInfo_ID=1221,
		C2SSilkRoadStart_ID=1222,
		S2CSilkRoadStart_ID=1223,
		C2SSilkRoadFastFinish_ID=1224,
		S2CSilkRoadFastFinish_ID=1225,
		C2SSilkRoadBuyCount_ID=1226,
		S2CSilkRoadBuyCount_ID=1227,
		C2SSilkRoadReward_ID=1228,
		S2CSilkRoadReward_ID=1229,
		C2SExploreFight_ID=1194,
		S2CExploreFight_ID=1195,
		C2SExploreSweep_ID=1206,
		S2CExploreSweep_ID=1207,
		C2SDailyTaskInfo_ID=1234,
		S2CDailyTaskInfo_ID=1235,
		C2SResRecoveredInfo_ID=1246,
		S2CResRecoveredInfo_ID=1245,
		C2SDailyTaskReward_ID=1236,
		S2CDailyTaskReward_ID=1237,
		C2SDailyStageReward_ID=1238,
		S2CDailyStageReward_ID=1239,
		C2SResRecovered_ID=1240,
		S2CResRecovered_ID=1241,
		C2SAllResRecovered_ID=1249,
		S2CAllResRecovered_ID=1250,
		S2CAllIncrease_ID=1256,
		S2CIncreaseUpdate_ID=1257,
		S2CIncreaseDel_ID=1258,
		C2SAdventureInfo_ID=1259,
		S2CAdventureInfo_ID=1260,
		C2SAdventureComDice_ID=1261,
		S2CAdventureComDice_ID=1262,
		C2SAdventureGoldDice_ID=1263,
		S2CAdventureGoldDice_ID=1264,
		C2SAdventureEventUse_ID=1273,
		S2CAdventureEventUse_ID=1274,
		C2SAdviserInfo_ID=1299,
		S2CAdviserInfo_ID=1300,
		C2SAdviserLevelUp_ID=1303,
		S2CAdviserLevelUp_ID=1304,
		C2SAdviserLevelUpAuto_ID=1305,
		S2CAdviserLevelUpAuto_ID=1306,
		C2SAdviserMasteryLevelUp_ID=1309,
		S2CAdviserMasteryLevelUp_ID=1310,
}
declare class C2SPing
{
	constructor(data?);
}
declare class S2CPing
{
	constructor(data?);
}
declare class S2CErrorRpc
{
	Tag: number;
	constructor(data?);
}
declare class S2CRep
{
	Tag: number;
	constructor(data?);
}
declare class C2SLogin
{
	AccountID: number;
	AreaID: number;
	Token: string ;
	constructor(data?);
}
declare class S2CLogin
{
	Tag: number;
	UserId: number;
	constructor(data?);
}
declare class C2SReLogin
{
	UserId: number;
	Token: string ;
	AreaID: number;
	constructor(data?);
}
declare class S2CReLogin
{
	Tag: number;
	constructor(data?);
}
declare class IntAttr
{
	K: number;
	V: number;
	constructor(data?);
}
declare class IntAttr1
{
	K: number;
	V1: number;
	V2: number;
	constructor(data?);
}
declare class StrAttr
{
	K: number;
	V: string ;
	constructor(data?);
}
declare class CommonType
{
	A: number;
	B: number;
	constructor(data?);
}
declare class CommonType2
{
	A: number;
	B: number;
	C: number;
	constructor(data?);
}
declare class C2SUpdateAttr
{
	constructor(data?);
}
declare class C2SUpdateOnlineTime
{
	constructor(data?);
}
declare class S2CNoticeDebug
{
	Str: string ;
	T: number;
	constructor(data?);
}
declare class S2CRoleInfo
{
	UserId: number;
	A: Array<IntAttr>;
	B: Array<StrAttr>;
	constructor(data?);
}
declare class C2SGetAreaOpenDay
{
	constructor(data?);
}
declare class S2CGetAreaOpenDay
{
	Tag: number;
	Days: number;
	ServerTime: number;
	Version: string ;
	SvnVersion: string ;
	constructor(data?);
}
declare class C2SGetIDCardChargeRMB
{
	Gid: number;
	constructor(data?);
}
declare class S2CGetIDCardChargeRMB
{
	Tag: number;
	RMB: number;
	ChargeTag: number;
	constructor(data?);
}
declare class C2SNewPlayerGuideAdd
{
	NewPlayerGuideId: number;
	constructor(data?);
}
declare class S2CNewPlayerGuidePush
{
	NewPlayerGuideIds: Array<number>;
	constructor(data?);
}
declare class S2CDayResetPush
{
	constructor(data?);
}
declare class S2CWeekResetPush
{
	constructor(data?);
}
declare class S2CMonthResetPush
{
	constructor(data?);
}
declare class C2SFightRecordWatch
{
	OnlyKey: string ;
	constructor(data?);
}
declare class SkillInfo
{
	SkillId: number;
	SkillLv: number;
	SkillType: number;
	constructor(data?);
}
declare class S2CKill
{
	Tag: number;
	constructor(data?);
}
declare class C2SLoginEnd
{
	LockStepVer: number;
	DataVersion: string ;
	constructor(data?);
}
declare class S2CLoginEnd
{
	Tag: number;
	constructor(data?);
}
declare class C2SSaveClientData
{
	Param: Array<StrAttr>;
	constructor(data?);
}
declare class S2CSaveClientData
{
	Tag: number;
	Param: Array<StrAttr>;
	constructor(data?);
}
declare class S2CSendClientData
{
	Param: Array<StrAttr>;
	constructor(data?);
}
declare class ItemData
{
	OnlyId: string ;
	ItemId: number;
	ItemNum: number;
	Pos: number;
	Bind: number;
	EndTime: number;
	ItemAttr: Array<IntAttr>;
	AddAttr: Array<IntAttr1>;
	constructor(data?);
}
declare class ItemInfo
{
	ItemId: number;
	ItemNum: number;
	Bind: number;
	ItemValid: number;
	constructor(data?);
}
declare class ItemNum
{
	ItemId: number;
	ItemNum: number;
	constructor(data?);
}
declare class S2CBagChange
{
	Change: Array<ItemData>;
	constructor(data?);
}
declare class S2CBagInfo
{
	Items: Array<ItemData>;
	Init: number;
	End: number;
	EquipBagEnlargeSize: number;
	constructor(data?);
}
declare class S2CItemFly
{
	Items: Array<ItemNum>;
	constructor(data?);
}
declare class C2SExtendEquipBag
{
	BagType: number;
	Count: number;
	constructor(data?);
}
declare class S2CExtendEquipBag
{
	Tag: number;
	BagType: number;
	EnlargeSize: number;
	constructor(data?);
}
declare class C2SExchange
{
	OnlyId: string ;
	Count: number;
	Param: number;
	constructor(data?);
}
declare class S2CExchange
{
	Tag: number;
	constructor(data?);
}
declare class C2SBatchExchange
{
	Exchange: Array<C2SExchange>;
	constructor(data?);
}
declare class S2CBatchExchange
{
	Tag: number;
	constructor(data?);
}
declare class C2SGetBattlePrize
{
	constructor(data?);
}
declare class Task
{
	Id: number;
	IC: number;
	C: number;
	S: number;
	constructor(data?);
}
declare class S2CTaskDataPush
{
	Tag: number;
	Tasks: Array<Task>;
	constructor(data?);
}
declare class GoodsData
{
	Gid: number;
	Gn: string ;
	Mt: number;
	S: number;
	P: number;
	Pid: number;
	Gt: number;
	I: number;
	constructor(data?);
}
declare class C2SChargeMallBuyReq
{
	Gid: number;
	constructor(data?);
}
declare class S2CChargeMallBuyRep
{
	Tag: number;
	Gid: number;
	constructor(data?);
}
declare class C2SGetChargeMallList
{
	T: number;
	constructor(data?);
}
declare class S2CGetChargeMallList
{
	Tag: number;
	T: number;
	GoodsList: Array<GoodsData>;
	constructor(data?);
}
declare class C2SCurrencyExchangeReq
{
	ExchangeId: number;
	constructor(data?);
}
declare class S2CCurrencyExchangeRep
{
	Tag: number;
	ExchangeId: number;
	constructor(data?);
}
declare class C2SGm
{
	CmdStr: string ;
	Data: string ;
	constructor(data?);
}
declare class S2CGm
{
	Tag: number;
	ErrStr: string ;
	constructor(data?);
}
declare class MailData
{
	MailId: number;
	TplId: number;
	MailTplParam: string ;
	Title: string ;
	Content: string ;
	ReceiveTime: number;
	LifeTime: number;
	IsRead: number;
	IsReceive: number;
	MailType: number;
	AttachInfo: Array<ItemInfo>;
	AttachData: Array<ItemData>;
	TitleParam: string ;
	constructor(data?);
}
declare class C2SGetMailAttachReq
{
	MailId: number;
	MailType: number;
	constructor(data?);
}
declare class S2CGetMailAttachRep
{
	Tag: number;
	MailIds: Array<number>;
	constructor(data?);
}
declare class C2SReadMailReq
{
	MailId: number;
	MailType: number;
	constructor(data?);
}
declare class S2CReadMailRep
{
	Tag: number;
	MailIds: Array<number>;
	constructor(data?);
}
declare class C2SDelMail
{
	MailId: number;
	MailType: number;
	constructor(data?);
}
declare class S2CDelMail
{
	Tag: number;
	MailIds: Array<number>;
	constructor(data?);
}
declare class S2CAddMail
{
	Mail: MailData ;
	constructor(data?);
}
declare class C2SMailList
{
	constructor(data?);
}
declare class S2CMailList
{
	Mails: Array<MailData>;
	constructor(data?);
}
declare class BossPersonalInfo
{
	Id: number;
	LeftTimes: number;
	constructor(data?);
}
declare class C2SBossPersonalInfo
{
	constructor(data?);
}
declare class S2CBossPersonalInfo
{
	Tag: number;
	Infos: Array<BossPersonalInfo>;
	constructor(data?);
}
declare class C2SBossPersonalFight
{
	Id: number;
	constructor(data?);
}
declare class S2CBossPersonalFight
{
	Tag: number;
	Id: number;
	LeftTimes: number;
	constructor(data?);
}
declare class C2SBossPersonalSweep
{
	constructor(data?);
}
declare class S2CBossPersonalSweep
{
	Tag: number;
	Infos: Array<BossPersonalInfo>;
	constructor(data?);
}
declare class BossVipInfo
{
	Id: number;
	LeftTimes: number;
	constructor(data?);
}
declare class C2SBossVipInfo
{
	constructor(data?);
}
declare class S2CBossVipInfo
{
	Tag: number;
	Infos: Array<BossVipInfo>;
	constructor(data?);
}
declare class C2SBossVipFight
{
	Id: number;
	constructor(data?);
}
declare class S2CBossVipFight
{
	Tag: number;
	Id: number;
	LeftTimes: number;
	constructor(data?);
}
declare class C2SBossVipSweep
{
	constructor(data?);
}
declare class S2CBossVipSweep
{
	Tag: number;
	Infos: Array<BossVipInfo>;
	constructor(data?);
}
declare class MultiBossState
{
	Id: number;
	State: number;
	constructor(data?);
}
declare class MultiBossRelive
{
	Id: number;
	ReliveTime: number;
	RunAwayTime: number;
	constructor(data?);
}
declare class MultiBossRankData
{
	UserId: number;
	Rank: number;
	MaxDamage: number;
	VipLevel: number;
	ShowAreaId: number;
	Nick: string ;
	Head: number;
	HeadFrame: number;
	constructor(data?);
}
declare class C2SMultiBossFight
{
	Id: number;
	constructor(data?);
}
declare class S2CMultiBossFight
{
	Tag: number;
	Id: number;
	Ranks: Array<MultiBossRankData>;
	constructor(data?);
}
declare class C2SMultiBossInspire
{
	constructor(data?);
}
declare class S2CMultiBossInspire
{
	Tag: number;
	InspireTimes: number;
	InspireLeftTime: number;
	constructor(data?);
}
declare class C2SMultiBossBuyTimes
{
	constructor(data?);
}
declare class S2CMultiBossBuyTimes
{
	Tag: number;
	constructor(data?);
}
declare class C2SMultiBossGetRankData
{
	Id: number;
	Type: number;
	constructor(data?);
}
declare class S2CMultiBossGetRankData
{
	Tag: number;
	Id: number;
	Type: number;
	Items: Array<MultiBossRankData>;
	MyDamage: number;
	constructor(data?);
}
declare class C2SGetMultiBossData
{
	Id: number;
	constructor(data?);
}
declare class S2CGetMultiBossData
{
	Tag: number;
	Id: number;
	State: number;
	Hp: number;
	ReliveTimestamp: number;
	RunAwayTimestamp: number;
	CurrOwnerNick: string ;
	CurrOwnerAreaId: number;
	LastOwnerNick: string ;
	LastOwnerAreaId: number;
	Focus: number;
	constructor(data?);
}
declare class C2SMultiBossGetPlayerData
{
	constructor(data?);
}
declare class S2CMultiBossGetPlayerData
{
	LeftTimes: number;
	NextTime: number;
	InspireTimes: number;
	InspireLeftTime: number;
	FightBossId: number;
	Tag: number;
	constructor(data?);
}
declare class C2SMultiBossGetHp
{
	Id: number;
	constructor(data?);
}
declare class S2CMultiBossGetHp
{
	Id: number;
	Hp: number;
	State: number;
	constructor(data?);
}
declare class C2SMultiBossFocus
{
	Id: number;
	constructor(data?);
}
declare class S2CMultiBossFocus
{
	Id: number;
	Focus: number;
	constructor(data?);
}
declare class C2SMultiBossGetBossList
{
	constructor(data?);
}
declare class S2CMultiBossUpdateState
{
	Data: Array<MultiBossState>;
	constructor(data?);
}
declare class C2SMultiBossGetReliveList
{
	constructor(data?);
}
declare class S2CMultiBossGetReliveList
{
	List: Array<MultiBossRelive>;
	constructor(data?);
}
declare class C2SMultiBossRelive
{
	Id: number;
	constructor(data?);
}
declare class S2CMultiBossRelive
{
	Tag: number;
	Id: number;
	constructor(data?);
}
declare class S2CTips
{
	TipsId: number;
	constructor(data?);
}
declare class ChatPlayerInfo
{
	UserId: number;
	Nick: string ;
	Head: number;
	HeadFrame: number;
	VIP: number;
	Title: number;
	AreaId: number;
	HideVIP: number;
	OfficeLevel: number;
	Bubble: number;
	FamilyPos: number;
	constructor(data?);
}
declare class AtInfo
{
	UserId: number;
	Nick: string ;
	ShowAreaId: number;
	constructor(data?);
}
declare class ChatData
{
	ChatType: number;
	IntArray: Array<IntAttr>;
	StrArray: Array<StrAttr>;
	SendTime: number;
	Content: string ;
	SenderInfo: ChatPlayerInfo ;
	AtInfo: AtInfo ;
	ShowId: number;
	BigIcon: number;
	Index: number;
	constructor(data?);
}
declare class C2SSendChatMsg
{
	ChatType: number;
	Content: string ;
	AtUserId: number;
	BigIcon: number;
	constructor(data?);
}
declare class S2CSendChatMsg
{
	Tag: number;
	constructor(data?);
}
declare class S2CPushChat
{
	ChatData: Array<ChatData>;
	ChatType: number;
	constructor(data?);
}
declare class C2SGetHistoryChat
{
	constructor(data?);
}
declare class S2CGetHistoryChat
{
	Messages: Array<ChatData>;
	constructor(data?);
}
declare class C2SBlack
{
	Typ: number;
	UserId: number;
	constructor(data?);
}
declare class S2CBlack
{
	Tag: number;
	Typ: number;
	UserId: number;
	constructor(data?);
}
declare class C2SGetBlackList
{
	constructor(data?);
}
declare class BlackInfo
{
	UserId: number;
	Nick: string ;
	AreaId: number;
	constructor(data?);
}
declare class S2CGetBlackList
{
	Tag: number;
	BlackList: Array<BlackInfo>;
	constructor(data?);
}
declare class NoticeItem
{
	ItemId: number;
	ItemNum: number;
	constructor(data?);
}
declare class NoticeUser
{
	UserId: number;
	Nick: string ;
	AreaId: number;
	constructor(data?);
}
declare class S2CSendNotice
{
	Id: number;
	Items: Array<NoticeItem>;
	Users: Array<NoticeUser>;
	Params: Array<string>;
	LinkParam: Array<string>;
	ExtParam: Array<StrAttr>;
	SendTime: number;
	constructor(data?);
}
declare class C2SSendPlayWayChatMsg
{
	PlayWayId: number;
	Content: string ;
	AtUserId: number;
	constructor(data?);
}
declare class C2SShowItem
{
	ChatType: number;
	Type: number;
	Param1: number;
	Param2: string ;
	constructor(data?);
}
declare class S2CShowItem
{
	Tag: number;
	constructor(data?);
}
declare class C2SGetShowInfo
{
	ChatType: number;
	ShowId: number;
	constructor(data?);
}
declare class S2CGetShowInfo
{
	Tag: number;
	ShowId: number;
	ItemInfo: ItemData ;
	GeneralInfo: GeneralData ;
	OfficeInfo1: OfficeSign ;
	OfficeInfo2: OfficeSign ;
	Title: TitleData ;
	BeautyInfo: Beauty ;
	EquipPos: EquipPos ;
	constructor(data?);
}
declare class RankFirstPlayerData
{
	UserId: number;
	Name: string ;
	A: Array<IntAttr>;
	Items: Array<ItemData>;
	EquipPosList: Array<EquipPos>;
	constructor(data?);
}
declare class RankPlayerData
{
	UserId: number;
	Name: string ;
	HeadFrame: number;
	Head: number;
	Vip: number;
	ShowAreaId: number;
	constructor(data?);
}
declare class RankFirstData
{
	R: number;
	SortValue: number;
	PlayerInfo: RankFirstPlayerData ;
	constructor(data?);
}
declare class RankSimpleData
{
	R: number;
	SortValue: number;
	PlayerInfo: RankPlayerData ;
	constructor(data?);
}
declare class C2SGetRankData
{
	RankType: number;
	Param: number;
	constructor(data?);
}
declare class S2CGetRankData
{
	Tag: number;
	RankType: number;
	Param: number;
	MyData: RankSimpleData ;
	FirstData: RankFirstData ;
	SimpleData: Array<RankSimpleData>;
	constructor(data?);
}
declare class C2SRankWorship
{
	Type: number;
	constructor(data?);
}
declare class S2CRankWorship
{
	Tag: number;
	Type: number;
	Items: Array<ItemInfo>;
	constructor(data?);
}
declare class S2CMaterialListPush
{
	Tag: number;
	MaterialList: Array<MaterialData>;
	constructor(data?);
}
declare class MaterialData
{
	MaterialId: number;
	Num: number;
	Exp: number;
	Star: number;
	CanSweep: number;
	BuyNum: number;
	constructor(data?);
}
declare class C2SMaterialChallenge
{
	MaterialId: number;
	constructor(data?);
}
declare class C2SMaterialSweep
{
	MaterialId: number;
	constructor(data?);
}
declare class C2SMaterialSweepOneKey
{
	constructor(data?);
}
declare class C2SMaterialBuyTimes
{
	MaterialId: number;
	constructor(data?);
}
declare class C2SMaterialBuyTimesOneKey
{
	constructor(data?);
}
declare class GradeData
{
	GradeId: number;
	GradeLv: GradeLvData ;
	GradeSkill: GradeSkillData ;
	GradeEquip: GradeEquipData ;
	GradeSoul: GradeSoulData ;
	GradeGod: GradeGodData ;
	GradeSkin: GradeSkinData ;
	GradeBeGold: GradeBeGoldData ;
	GradeRefine: GradeRefineData ;
	GradeChanneling: GradeChannelingData ;
	constructor(data?);
}
declare class GradeLvData
{
	BigLv: number;
	SmallLv: number;
	Exp: number;
	UpGift: Array<number>;
	ThreeGift: Array<IntAttr1>;
	constructor(data?);
}
declare class GradeSkillData
{
	Skills: Array<IntAttr>;
	constructor(data?);
}
declare class GradeEquipData
{
	PosLv: Array<IntAttr>;
	constructor(data?);
}
declare class GradeSoulData
{
	Level: number;
	Exp: number;
	constructor(data?);
}
declare class GradeGodData
{
	Num: number;
	constructor(data?);
}
declare class GradeSkinData
{
	SkinLv: Array<IntAttr1>;
	constructor(data?);
}
declare class GradeBeGoldData
{
	PosLv: Array<IntAttr>;
	constructor(data?);
}
declare class GradeRefineData
{
	constructor(data?);
}
declare class GradeChannelingData
{
	constructor(data?);
}
declare class S2CGradeListPush
{
	Tag: number;
	GradeList: Array<GradeData>;
	constructor(data?);
}
declare class C2SGradeLevelUp
{
	GradeId: number;
	OneKey: number;
	AutoBuy: number;
	constructor(data?);
}
declare class C2SGradeLevelBreak
{
	GradeId: number;
	constructor(data?);
}
declare class C2SGradeGetUpGift
{
	GradeId: number;
	BigLv: number;
	constructor(data?);
}
declare class C2SGradeGetThreeGift
{
	GradeId: number;
	BigLv: number;
	IsThree: number;
	constructor(data?);
}
declare class C2SGradeSkillLevelUp
{
	GradeId: number;
	Part: number;
	constructor(data?);
}
declare class C2SGradeEquipAutoWear
{
	GradeId: number;
	constructor(data?);
}
declare class C2SGradeEquipPosLevelUp
{
	GradeId: number;
	PartList: Array<number>;
	constructor(data?);
}
declare class C2SGradeEquipMake
{
	GradeId: number;
	Part: number;
	BigLv: number;
	constructor(data?);
}
declare class C2SGradeEquipSmelting
{
	Items: Array<string>;
	constructor(data?);
}
declare class C2SGradeBeGoldLevelUp
{
	GradeId: number;
	Part: number;
	constructor(data?);
}
declare class C2SGradeSoul
{
	GradeId: number;
	constructor(data?);
}
declare class C2SGradeGod
{
	GradeId: number;
	constructor(data?);
}
declare class C2SGradeSkinActive
{
	GradeId: number;
	SkinId: number;
	constructor(data?);
}
declare class C2SGradeSkinLevelUp
{
	GradeId: number;
	SkinId: number;
	constructor(data?);
}
declare class C2SGradeSkinUse
{
	GradeId: number;
	SkinId: number;
	constructor(data?);
}
declare class C2SGradeSkinOff
{
	GradeId: number;
	constructor(data?);
}
declare class TitleData
{
	TitleId: number;
	Star: number;
	EndTime: number;
	RateValue: number;
	constructor(data?);
}
declare class S2CTitleListPush
{
	Tag: number;
	TitleList: Array<TitleData>;
	DelTitleIds: Array<number>;
	constructor(data?);
}
declare class C2STitleActive
{
	TitleId: number;
	constructor(data?);
}
declare class C2STitleUpGrade
{
	TitleId: number;
	constructor(data?);
}
declare class C2STitleWear
{
	TitleId: number;
	constructor(data?);
}
declare class C2STitleOff
{
	TitleId: number;
	constructor(data?);
}
declare class C2STitleInfo
{
	UserId: number;
	TitleId: number;
	constructor(data?);
}
declare class S2CTitleInfo
{
	Tag: number;
	UserId: number;
	TitleData: TitleData ;
	constructor(data?);
}
declare class FightAttrData
{
	Key: number;
	Attrs: Array<IntAttr>;
	Fv: number;
	constructor(data?);
}
declare class S2CUpdateFightAttr
{
	Attrs: Array<FightAttrData>;
	constructor(data?);
}
declare class S2CSendFuncOpenData
{
	OpenFuncData: Array<number>;
	OpenFuncRedList: Array<number>;
	FuncPreviewList: Array<number>;
	constructor(data?);
}
declare class S2CUpdateFuncOpen
{
	OpenFuncData: Array<number>;
	constructor(data?);
}
declare class C2SOpenFuncRed
{
	FuncId: number;
	constructor(data?);
}
declare class S2COpenFuncRed
{
	Tag: number;
	FuncId: number;
	constructor(data?);
}
declare class C2SGetFuncPreviewPrize
{
	FuncId: number;
	constructor(data?);
}
declare class S2CGetFuncPreviewPrize
{
	Tag: number;
	FuncId: number;
	constructor(data?);
}
declare class C2SChangeNick
{
	Nick: string ;
	Sex: number;
	constructor(data?);
}
declare class S2CChangeNick
{
	Tag: number;
	constructor(data?);
}
declare class S2CNoticeUnitDataChange
{
	Users: Array<BaseUserInfo>;
	Monsters: Array<BaseMonsterInfo>;
	constructor(data?);
}
declare class PlayerMoveData
{
	UserId: number;
	Source: Point ;
	Target: Point ;
	StartTime: number;
	Param: number;
	constructor(data?);
}
declare class S2CNoticePlayerBeAttack
{
	AttackId: number;
	Win: number;
	constructor(data?);
}
declare class S2CNoticePlayerStopMove
{
	UserId: number;
	Point: Point ;
	constructor(data?);
}
declare class S2CNoticeMonsterLeaveMap
{
	MonsterId: Array<number>;
	constructor(data?);
}
declare class S2CNoticeMapDataChange
{
	MapData: BaseMapInfo ;
	constructor(data?);
}
declare class S2CNoticePlayerLeaveMap
{
	UserId: Array<number>;
	constructor(data?);
}
declare class S2CNoticeMonsterEnterMap
{
	Monster: Array<BaseMonsterInfo>;
	constructor(data?);
}
declare class S2CNoticePlayerEnterMap
{
	Users: Array<BaseUserInfo>;
	constructor(data?);
}
declare class S2CNoticePlayerMove
{
	Players: Array<PlayerMoveData>;
	constructor(data?);
}
declare class BaseUserInfo
{
	UserId: number;
	A: Array<IntAttr>;
	B: Array<StrAttr>;
	constructor(data?);
}
declare class BaseMapInfo
{
	MapId: number;
	A: Array<IntAttr>;
	B: Array<StrAttr>;
	constructor(data?);
}
declare class BaseMonsterInfo
{
	Id: number;
	A: Array<IntAttr>;
	B: Array<StrAttr>;
	constructor(data?);
}
declare class FightUnit
{
	P: number;
	I: number;
	T: number;
	A: Array<IntAttr>;
	B: Array<StrAttr>;
	constructor(data?);
}
declare class FightStep
{
	AT: number;
	P: number;
	TP: number;
	PARAM: string ;
	S: number;
	R: number;
	EK: number;
	EV: number;
	ET: number;
	FS: Array<FightStep>;
	constructor(data?);
}
declare class HpList
{
	P: number;
	Hp: number;
	CampId: number;
	MonsterType: number;
	constructor(data?);
}
declare class SEffect
{
	K: number;
	V: string ;
	constructor(data?);
}
declare class S2CBattlefieldReport
{
	U: Array<FightUnit>;
	FS: Array<FightStep>;
	Idx: string ;
	T: number;
	P: number;
	Win: number;
	M: number;
	ORType: number;
	TotalHurt: number;
	TotalAtk: number;
	HL: Array<HpList>;
	SE: Array<SEffect>;
	PARAM: string ;
	FM: number;
	constructor(data?);
}
declare class S2CPrizeReport
{
	Items: Array<ItemData>;
	Type: number;
	FBType: number;
	Star: number;
	ORType: number;
	Idx: string ;
	IntData: Array<number>;
	StrData: Array<string>;
	PARAM: string ;
	constructor(data?);
}
declare class C2SNoticeFightStateReq
{
	State: number;
	constructor(data?);
}
declare class S2CNoticeFightStateRep
{
	Tag: number;
	constructor(data?);
}
declare class Point
{
	X: number;
	Y: number;
	constructor(data?);
}
declare class C2SEnterMap
{
	MapId: number;
	constructor(data?);
}
declare class S2CEnterMap
{
	Tag: number;
	constructor(data?);
}
declare class C2SLeaveMap
{
	MapId: number;
	constructor(data?);
}
declare class C2SStartMove
{
	Source: Point ;
	Target: Point ;
	Param: number;
	constructor(data?);
}
declare class C2SStopMove
{
	P: Point ;
	constructor(data?);
}
declare class S2CNoticePlayerChangeMap
{
	MapId: number;
	Point: Point ;
	constructor(data?);
}
declare class ZhaoMuLog
{
	LogString: string ;
	Items: Array<NoticeItem>;
	Users: Array<NoticeUser>;
	Params: Array<string>;
	LinkParam: Array<string>;
	LogId: string ;
	constructor(data?);
}
declare class PlayerActData
{
	FuncId: number;
	CycNo: number;
	State: number;
	ReadyTime: number;
	StartTime: number;
	EndTime: number;
	CloseTime: number;
	EndDate: number;
	Session: number;
	RewardSession: number;
	Red: number;
	Config: string ;
	constructor(data?);
}
declare class C2SPlayerActModelData
{
	FuncId: number;
	CycNo: number;
	constructor(data?);
}
declare class S2CPlayerActModelData
{
	Tag: number;
	FuncId: number;
	CycNo: number;
	OnlineAwardData: OnlineAwardByClient ;
	StageRewardClientData: StageRewardClientData ;
	GeneralPassClientData: GeneralPassClientData ;
	constructor(data?);
}
declare class S2CActListRedPush
{
	Tag: number;
	FuncId: number;
	CycNo: number;
	Red: number;
	constructor(data?);
}
declare class S2CActListPush
{
	Tag: number;
	ActivityList: Array<PlayerActData>;
	DelActIds: Array<IntAttr>;
	constructor(data?);
}
declare class C2SGetActivityConfig
{
	FuncId: number;
	CycNo: number;
	Ver: number;
	constructor(data?);
}
declare class S2CGetActivityConfig
{
	Tag: number;
	FuncId: number;
	CycNo: number;
	Ver: number;
	ConfigList: Array<ActivityConfig>;
	constructor(data?);
}
declare class ActivityConfig
{
	TableName: string ;
	Data: Array<string>;
	constructor(data?);
}
declare class DailySignInClientData
{
	CurTurnId: number;
	CurDay: number;
	SignDays: Array<number>;
	RemedyDays: Array<number>;
	ChargeDays: Array<number>;
	DoubleDays: Array<number>;
	SignNumRewardDays: Array<number>;
	constructor(data?);
}
declare class C2SPlayerSignInUIData
{
	FuncId: number;
	CycNo: number;
	constructor(data?);
}
declare class S2CPlayerSignInUIData
{
	Tag: number;
	FuncId: number;
	CycNo: number;
	ActData: DailySignInClientData ;
	constructor(data?);
}
declare class C2SPlayerSignIn
{
	FuncId: number;
	CycNo: number;
	Day: number;
	constructor(data?);
}
declare class S2CPlayerSignIn
{
	Tag: number;
	FuncId: number;
	CycNo: number;
	SignDays: Array<number>;
	constructor(data?);
}
declare class C2SPlayerDoubleSignIn
{
	FuncId: number;
	CycNo: number;
	Day: number;
	constructor(data?);
}
declare class S2CPlayerDoubleSignIn
{
	Tag: number;
	FuncId: number;
	CycNo: number;
	DoubleDays: Array<number>;
	constructor(data?);
}
declare class C2SPlayerRemedySignIn
{
	FuncId: number;
	CycNo: number;
	Day: number;
	constructor(data?);
}
declare class S2CPlayerRemedySignIn
{
	Tag: number;
	FuncId: number;
	CycNo: number;
	RemedyDays: Array<number>;
	DoubleDays: Array<number>;
	constructor(data?);
}
declare class C2SPlayerSignInNumReward
{
	FuncId: number;
	CycNo: number;
	Day: number;
	constructor(data?);
}
declare class S2CPlayerSignInNumReward
{
	Tag: number;
	FuncId: number;
	CycNo: number;
	SignNumRewardDays: Array<number>;
	constructor(data?);
}
declare class C2SGetCDKeyReward
{
	FuncId: number;
	CycNo: number;
	CDKey: string ;
	constructor(data?);
}
declare class S2CGetCDKeyReward
{
	Tag: number;
	FuncId: number;
	CycNo: number;
	constructor(data?);
}
declare class ZhaoMuClientData
{
	ZhaoMuLog: Array<ZhaoMuLog>;
	BaseRwNeedNum: number;
	FreeNum: number;
	BuyTimes: number;
	StageRwNum: number;
	StageRwGet: number;
	Wish: Array<number>;
	WishGet: Array<number>;
	TotalNum: number;
	BagLen: number;
	constructor(data?);
}
declare class C2SZhaoMuUIData
{
	FuncId: number;
	CycNo: number;
	constructor(data?);
}
declare class S2CZhaoMuUIData
{
	Tag: number;
	FuncId: number;
	CycNo: number;
	ActData: ZhaoMuClientData ;
	constructor(data?);
}
declare class C2SZhaoMuLuckyDraw
{
	FuncId: number;
	CycNo: number;
	Num: number;
	AutoBuy: number;
	constructor(data?);
}
declare class S2CZhaoMuLuckyDraw
{
	Tag: number;
	FuncId: number;
	CycNo: number;
	ActData: ZhaoMuClientData ;
	Reward: Array<ItemData>;
	Score: number;
	Num: number;
	constructor(data?);
}
declare class C2SZhaoMuGetStageRw
{
	FuncId: number;
	CycNo: number;
	constructor(data?);
}
declare class S2CZhaoMuGetStageRw
{
	Tag: number;
	FuncId: number;
	CycNo: number;
	StageRwGet: number;
	StageRwNum: number;
	constructor(data?);
}
declare class C2SZhaoMuSetWish
{
	FuncId: number;
	CycNo: number;
	WishList: Array<number>;
	constructor(data?);
}
declare class S2CZhaoMuSetWish
{
	Tag: number;
	FuncId: number;
	CycNo: number;
	WishList: Array<number>;
	constructor(data?);
}
declare class C2SZhaoMuOpenLog
{
	FuncId: number;
	CycNo: number;
	Type: number;
	Num: number;
	ClientFlag: number;
	constructor(data?);
}
declare class S2CZhaoMuOpenLog
{
	Tag: number;
	FuncId: number;
	CycNo: number;
	Type: number;
	ZhaoMuLog: Array<ZhaoMuLog>;
	ClientFlag: number;
	constructor(data?);
}
declare class C2SZhaoMuBagData
{
	FuncId: number;
	CycNo: number;
	constructor(data?);
}
declare class S2CZhaoMuBagData
{
	Tag: number;
	FuncId: number;
	CycNo: number;
	TempBagData: Array<ItemData>;
	constructor(data?);
}
declare class C2SZhaoMuBagTakeOut
{
	FuncId: number;
	CycNo: number;
	OnlyId: Array<string>;
	IsAll: number;
	constructor(data?);
}
declare class S2CZhaoMuBagTakeOut
{
	Tag: number;
	FuncId: number;
	CycNo: number;
	IsAll: number;
	OnlyId: Array<string>;
	constructor(data?);
}
declare class OnlineAwardByClient
{
	OnlineTime: number;
	LoginTime: number;
	Awards: Array<number>;
	constructor(data?);
}
declare class C2SGetOnlineAward
{
	FuncId: number;
	CycNo: number;
	AwardId: number;
	constructor(data?);
}
declare class S2CGetOnlineAward
{
	Tag: number;
	FuncId: number;
	CycNo: number;
	AwardId: number;
	Awards: Array<number>;
	constructor(data?);
}
declare class C2SGetStageReward
{
	FuncId: number;
	CycNo: number;
	RewardId: number;
	constructor(data?);
}
declare class S2CGetStageReward
{
	Tag: number;
	FuncId: number;
	CycNo: number;
	Rewards: Array<number>;
	constructor(data?);
}
declare class CashCowClientData
{
	Level: number;
	Exp: number;
	FreeNum: number;
	Coin3Num: number;
	Coin2Num: number;
	constructor(data?);
}
declare class C2SCashCowUIData
{
	FuncId: number;
	CycNo: number;
	constructor(data?);
}
declare class S2CCashCowUIData
{
	Tag: number;
	FuncId: number;
	CycNo: number;
	ActData: CashCowClientData ;
	constructor(data?);
}
declare class StageRewardClientData
{
	AwardIds: Array<number>;
	constructor(data?);
}
declare class GeneralPassClientData
{
	ChargeList: Array<number>;
	ChargeNum: number;
	RewardIds: Array<number>;
	ChargeRewardIds: Array<number>;
	WelfareRewardIds: Array<number>;
	constructor(data?);
}
declare class C2SCashCowShake
{
	FuncId: number;
	CycNo: number;
	ShakeType: number;
	IsOneKey: number;
	Num: number;
	constructor(data?);
}
declare class S2CCashCowShake
{
	Tag: number;
	FuncId: number;
	CycNo: number;
	CashCowClientData: CashCowClientData ;
	Reward: Array<CashCowShakeReward>;
	constructor(data?);
}
declare class CashCowShakeReward
{
	Rate: number;
	Items: Array<ItemInfo>;
	constructor(data?);
}
declare class C2SGetAllServerReward
{
	FuncId: number;
	CycNo: number;
	RewardId: number;
	constructor(data?);
}
declare class S2CGetAllServerReward
{
	Tag: number;
	FuncId: number;
	CycNo: number;
	Rewards: Array<number>;
	constructor(data?);
}
declare class C2SGetGeneralPassReward
{
	FuncId: number;
	CycNo: number;
	SectionId: number;
	constructor(data?);
}
declare class S2CGetGeneralPassReward
{
	Tag: number;
	FuncId: number;
	CycNo: number;
	RewardIds: Array<number>;
	ChargeRewardIds: Array<number>;
	constructor(data?);
}
declare class S2CPlayWayIcon
{
	Tag: number;
	PlayWayId: number;
	State: number;
	StageTime: number;
	constructor(data?);
}
declare class C2SOpenWorldBossUI
{
	constructor(data?);
}
declare class S2COpenWorldBossUI
{
	Tag: number;
	BossId: number;
	ReadyTime: number;
	StartTime: number;
	EndTime: number;
	CloseTime: number;
	constructor(data?);
}
declare class C2SEnterWorldBoss
{
	constructor(data?);
}
declare class S2CEnterWorldBoss
{
	Tag: number;
	ChallengeTimes: number;
	ChallengeCD: number;
	ChallengePrizeTimes: number;
	GrabTimes: number;
	GrabCD: number;
	BuffNum: number;
	BossId: number;
	ReadyTime: number;
	StartTime: number;
	EndTime: number;
	MyRank: number;
	MyScore: number;
	AreaRank: number;
	AreaScore: number;
	MyDiceNum: number;
	AreaShieldNum: number;
	AreaShieldBreakEndTime: number;
	constructor(data?);
}
declare class C2SGetWorldBossRank
{
	RankType: number;
	Start: number;
	End: number;
	constructor(data?);
}
declare class S2CGetWorldBossRank
{
	Tag: number;
	RankType: number;
	UserRankList: Array<WorldBossUserRankData>;
	AreaRankList: Array<WorldBossAreaRankData>;
	MyRank: number;
	MyScore: number;
	constructor(data?);
}
declare class WorldBossUserRankData
{
	UserId: number;
	R: number;
	Name: string ;
	HeadFrame: number;
	Head: number;
	Vip: number;
	FamilyName: string ;
	FightValue: number;
	Score: number;
	constructor(data?);
}
declare class WorldBossAreaRankData
{
	AreaId: number;
	R: number;
	Name: string ;
	FightNum: number;
	Score: number;
	constructor(data?);
}
declare class C2SChallengeWorldBossPVE
{
	constructor(data?);
}
declare class S2CChallengeWorldBossPVE
{
	Tag: number;
	ChallengeTimes: number;
	ChallengeCD: number;
	ChallengePrizeTimes: number;
	MyRank: number;
	MyScore: number;
	AreaRank: number;
	AreaScore: number;
	constructor(data?);
}
declare class S2CWorldBossShieldNotice
{
	Tag: number;
	AreaShieldNum: number;
	AreaShieldBreakEndTime: number;
	constructor(data?);
}
declare class S2CWorldBossShieldOpenNotice
{
	Tag: number;
	IsOpen: number;
	EndTime: number;
	constructor(data?);
}
declare class C2SChallengeWorldBossPVP
{
	TargetId: number;
	constructor(data?);
}
declare class S2CChallengeWorldBossPVP
{
	Tag: number;
	GrabTimes: number;
	GrabCD: number;
	MyRank: number;
	MyScore: number;
	AreaRank: number;
	AreaScore: number;
	Score: number;
	constructor(data?);
}
declare class C2SWorldBossBuyBuff
{
	constructor(data?);
}
declare class S2CWorldBossBuyBuff
{
	Tag: number;
	BuyBuffTimes: number;
	constructor(data?);
}
declare class C2SWorldBossRandomDice
{
	constructor(data?);
}
declare class S2CWorldBossRandomDice
{
	Tag: number;
	Points: number;
	constructor(data?);
}
declare class S2CWorldBossCurMaxDiceNumNotice
{
	Tag: number;
	UserId: number;
	Name: string ;
	MaxNum: number;
	LoginAreaId: number;
	constructor(data?);
}
declare class S2CWorldBossRandomDiceOpenNotice
{
	Tag: number;
	IsOpen: number;
	EndTime: number;
	constructor(data?);
}
declare class C2SExitWorldBoss
{
	constructor(data?);
}
declare class S2CExitWorldBoss
{
	Tag: number;
	constructor(data?);
}
declare class C2SOpenBossHomeUI
{
	constructor(data?);
}
declare class S2COpenBossHomeUI
{
	Tag: number;
	Data: Array<BossHomeData>;
	TempBagData: Array<ItemData>;
	constructor(data?);
}
declare class BossHomeData
{
	BossHomeId: number;
	BossData: Array<BossHomeBossData>;
	UserNum: number;
	constructor(data?);
}
declare class BossHomeBossData
{
	BossId: number;
	State: number;
	ReliveTime: number;
	UserId: number;
	constructor(data?);
}
declare class C2SEnterBossHome
{
	BossHomeId: number;
	constructor(data?);
}
declare class S2CEnterBossHome
{
	Tag: number;
	BossHomeId: number;
	BuffNum: number;
	BuffEndTime: number;
	constructor(data?);
}
declare class C2SExitBossHome
{
	constructor(data?);
}
declare class S2CExitBossHome
{
	Tag: number;
	constructor(data?);
}
declare class C2SGetBossHomeRankData
{
	BossHomeId: number;
	BossId: number;
	constructor(data?);
}
declare class S2CGetBossHomeRankData
{
	Tag: number;
	BossHomeId: number;
	BossId: number;
	RankData: Array<BossHomeRankData>;
	RankDel: Array<number>;
	constructor(data?);
}
declare class BossHomeRankData
{
	UserId: number;
	Damage: number;
	constructor(data?);
}
declare class C2SBossHomePVE
{
	BossHomeId: number;
	BossId: number;
	constructor(data?);
}
declare class S2CBossHomePVE
{
	Tag: number;
	constructor(data?);
}
declare class C2SGetBossHomePlayerPos
{
	BossHomeId: number;
	UserId: number;
	constructor(data?);
}
declare class S2CGetBossHomePlayerPos
{
	Tag: number;
	BossHomeId: number;
	UserId: number;
	X: number;
	Y: number;
	constructor(data?);
}
declare class C2SBossHomePVP
{
	BossHomeId: number;
	UserId: number;
	constructor(data?);
}
declare class S2CBossHomePVP
{
	Tag: number;
	constructor(data?);
}
declare class C2SBossHomeOpenBagUI
{
	constructor(data?);
}
declare class S2CBossHomeOpenBagUI
{
	Tag: number;
	TempBagData: Array<ItemData>;
	constructor(data?);
}
declare class S2CBossHomeBagNew
{
	Tag: number;
	TempBagData: Array<ItemData>;
	constructor(data?);
}
declare class C2SBossHomeBagOneKeyGet
{
	constructor(data?);
}
declare class S2CBossHomeBagOneKeyGet
{
	Tag: number;
	constructor(data?);
}
declare class C2SBossHomeBuyBuff
{
	constructor(data?);
}
declare class S2CBossHomeBuyBuff
{
	Tag: number;
	BuffNum: number;
	BuffEndTime: number;
	constructor(data?);
}
declare class C2SBossHomeRelive
{
	constructor(data?);
}
declare class S2CBossHomeRelive
{
	Tag: number;
	constructor(data?);
}
declare class C2SBossHomeBuyEnergy
{
	AutoBuy: number;
	constructor(data?);
}
declare class S2CBossHomeBuyEnergy
{
	Tag: number;
	Add: number;
	constructor(data?);
}
declare class C2SBossHomeTreat
{
	constructor(data?);
}
declare class S2CBossHomeTreat
{
	Tag: number;
	constructor(data?);
}
declare class C2SBossHomeGetPlayerHpList
{
	BossHomeId: number;
	UserId: number;
	constructor(data?);
}
declare class S2CBossHomeGetPlayerHpList
{
	Tag: number;
	HL: Array<HpList>;
	constructor(data?);
}
declare class CarData
{
	UserId: number;
	LoginAreaId: number;
	Level: number;
	UserShowInfo: BaseUserInfo ;
	QualityId: number;
	UseAmulet: number;
	EndTime: number;
	RobLog: Array<CarRobLog>;
	RewardInfo: Array<ItemInfo>;
	IsDoubleReward: number;
	constructor(data?);
}
declare class CarRobLog
{
	UserId: number;
	UserShowInfo: BaseUserInfo ;
	LostRewardInfo: Array<ItemInfo>;
	RobTime: number;
	IsDefeSucc: number;
	constructor(data?);
}
declare class C2SOpenEscortUI
{
	constructor(data?);
}
declare class S2COpenEscortUI
{
	Tag: number;
	CarData: Array<CarData>;
	EscortNum: number;
	RobNum: number;
	QualityId: number;
	constructor(data?);
}
declare class C2SEscortRefreshUIData
{
	UserIds: Array<number>;
	constructor(data?);
}
declare class S2CEscortRefreshUIData
{
	Tag: number;
	CarData: Array<CarData>;
	constructor(data?);
}
declare class C2SEscortRefreshCar
{
	Refresh: number;
	constructor(data?);
}
declare class S2CEscortRefreshCar
{
	Tag: number;
	QualityId: number;
	constructor(data?);
}
declare class C2SEscortCarStart
{
	UseAmulet: number;
	AutoBuy: number;
	constructor(data?);
}
declare class S2CEscortCarStart
{
	Tag: number;
	CarData: CarData ;
	EscortNum: number;
	QualityId: number;
	constructor(data?);
}
declare class C2SEscortQuickFinish
{
	constructor(data?);
}
declare class S2CEscortQuickFinish
{
	Tag: number;
	CarData: CarData ;
	constructor(data?);
}
declare class C2SEscortGetFinishReward
{
	constructor(data?);
}
declare class S2CEscortGetFinishReward
{
	Tag: number;
	CarData: CarData ;
	constructor(data?);
}
declare class S2CEscortFinishRewardNotice
{
	Tag: number;
	constructor(data?);
}
declare class C2SEscortGetCarData
{
	UserIds: Array<number>;
	constructor(data?);
}
declare class S2CEscortGetCarData
{
	Tag: number;
	CarData: Array<CarData>;
	constructor(data?);
}
declare class C2SEscortCarRob
{
	UserId: number;
	constructor(data?);
}
declare class S2CEscortCarRob
{
	Tag: number;
	CarData: CarData ;
	constructor(data?);
}
declare class S2CEscortCarRobNotice
{
	Tag: number;
	constructor(data?);
}
declare class C2SEscortOpenRobLog
{
	constructor(data?);
}
declare class S2CEscortOpenRobLog
{
	Tag: number;
	RobLog: Array<EscortRobLog>;
	constructor(data?);
}
declare class EscortRobLog
{
	UserId: number;
	UserShowInfo: BaseUserInfo ;
	RewardInfo: Array<ItemInfo>;
	IsRevenge: number;
	RobTime: number;
	IsRead: number;
	constructor(data?);
}
declare class C2SEscortRevenge
{
	UserId: number;
	RobTime: number;
	constructor(data?);
}
declare class S2CEscortRevenge
{
	Tag: number;
	RobLog: Array<EscortRobLog>;
	constructor(data?);
}
declare class C2SGetUserShowInfo
{
	UserIdList: Array<number>;
	constructor(data?);
}
declare class S2CGetUserShowInfo
{
	Tag: number;
	UserShowInfo: Array<BaseUserInfo>;
	constructor(data?);
}
declare class C2SGetWorldLevel
{
	constructor(data?);
}
declare class S2CGetWorldLevel
{
	Tag: number;
	WorldLevel: number;
	constructor(data?);
}
declare class RankMatchFightLog
{
	Time: number;
	State: number;
	ScoreChange: number;
	UserInfo: BaseUserInfo ;
	Report: S2CBattlefieldReport ;
	constructor(data?);
}
declare class C2SOpenRankMatchUI
{
	constructor(data?);
}
declare class S2COpenRankMatchUI
{
	Tag: number;
	EndTime: number;
	TopPlayers: Array<BaseUserInfo>;
	MyScore: number;
	MyRank: number;
	ChallengeNum: number;
	DayBuyNum: number;
	DayWinNum: number;
	IsGetDayWin: number;
	SessionWinNum: number;
	SessionGetRwList: Array<number>;
	LevelGetRwList: Array<number>;
	IsChangeSession: number;
	LastSessionScore: number;
	NextRefreshTime: number;
	constructor(data?);
}
declare class C2SRankMatchStartMatch
{
	constructor(data?);
}
declare class S2CRankMatchStartMatch
{
	Tag: number;
	Players: Array<BaseUserInfo>;
	constructor(data?);
}
declare class C2SRankMatchChallenge
{
	UserId: number;
	constructor(data?);
}
declare class S2CRankMatchChallenge
{
	Tag: number;
	TopPlayers: Array<BaseUserInfo>;
	MyScore: number;
	MyRank: number;
	ChallengeNum: number;
	DayWinNum: number;
	SessionWinNum: number;
	NextRefreshTime: number;
	constructor(data?);
}
declare class C2SRankMatchBuyChallengeNum
{
	IsAutoMatch: number;
	constructor(data?);
}
declare class S2CRankMatchBuyChallengeNum
{
	Tag: number;
	IsAutoMatch: number;
	ChallengeNum: number;
	DayBuyNum: number;
	NextRefreshTime: number;
	constructor(data?);
}
declare class C2SRankMatchOpenFightLogUI
{
	constructor(data?);
}
declare class S2CRankMatchOpenFightLogUI
{
	Tag: number;
	FightLog: Array<RankMatchFightLog>;
	constructor(data?);
}
declare class C2SRankMatchPlayFightLog
{
	Time: number;
	constructor(data?);
}
declare class S2CRankMatchPlayFightLog
{
	Tag: number;
	Report: RankMatchFightLog ;
	constructor(data?);
}
declare class C2SRankMatchGetDayWinReward
{
	constructor(data?);
}
declare class S2CRankMatchGetDayWinReward
{
	Tag: number;
	IsGetDayWin: number;
	constructor(data?);
}
declare class C2SRankMatchGetSessionWinReward
{
	RewardId: number;
	constructor(data?);
}
declare class S2CRankMatchGetSessionWinReward
{
	Tag: number;
	SessionGetRwList: Array<number>;
	constructor(data?);
}
declare class C2SRankMatchGetLevelReward
{
	LevelId: number;
	constructor(data?);
}
declare class S2CRankMatchGetLevelReward
{
	Tag: number;
	LevelGetRwList: Array<number>;
	constructor(data?);
}
declare class C2SGetRankMatchRank
{
	Start: number;
	End: number;
	constructor(data?);
}
declare class S2CGetRankMatchRank
{
	Tag: number;
	RankList: Array<BaseUserInfo>;
	MyScore: number;
	MyRank: number;
	constructor(data?);
}
declare class GemInfo
{
	Pos: number;
	ItemId: number;
	constructor(data?);
}
declare class EquipPos
{
	Pos: number;
	StrengthLevel: number;
	Gems: Array<GemInfo>;
	OnlyId: string ;
	constructor(data?);
}
declare class C2SMeltEquip
{
	Items: Array<string>;
	constructor(data?);
}
declare class S2CMeltEquip
{
	Tag: number;
	NewData: Array<ItemInfo>;
	constructor(data?);
}
declare class C2SAutoWearEquip
{
	Type: number;
	constructor(data?);
}
declare class S2CAutoWearEquip
{
	Tag: number;
	constructor(data?);
}
declare class C2SWearOrRemoveEquip
{
	OnlyIds: Array<string>;
	constructor(data?);
}
declare class S2CWearOrRemoveEquip
{
	Tag: number;
	OnlyIds: Array<string>;
	constructor(data?);
}
declare class C2SEquipPosInfo
{
	constructor(data?);
}
declare class S2CEquipPosInfo
{
	Tag: number;
	EquipPosList: Array<EquipPos>;
	ResonateLev: number;
	constructor(data?);
}
declare class C2SStrengthEquipPos
{
	Pos: number;
	constructor(data?);
}
declare class S2CStrengthEquipPos
{
	Tag: number;
	EquipPos: EquipPos ;
	constructor(data?);
}
declare class C2SAutoStrengthEquipPos
{
	constructor(data?);
}
declare class S2CAutoStrengthEquipPos
{
	Tag: number;
	EquipPosList: Array<EquipPos>;
	constructor(data?);
}
declare class C2SResonateEquipPos
{
	constructor(data?);
}
declare class S2CResonateEquipPos
{
	Tag: number;
	Level: number;
	constructor(data?);
}
declare class C2SBuildEquip
{
	EquipPart: number;
	UseStone: number;
	constructor(data?);
}
declare class S2CBuildEquip
{
	Tag: number;
	constructor(data?);
}
declare class C2SRiseStarEquip
{
	EquipPart: number;
	CostOId1: string ;
	CostOId2: string ;
	CostOId3: string ;
	constructor(data?);
}
declare class S2CRiseStarEquip
{
	Tag: number;
	constructor(data?);
}
declare class C2SEquipGemInlay
{
	EquipPart: number;
	Pos: number;
	ItemId: number;
	constructor(data?);
}
declare class S2CEquipGemInlay
{
	Tag: number;
	EquipPart: number;
	GemInfo: GemInfo ;
	constructor(data?);
}
declare class C2SEquipGemOneKeyInlay
{
	constructor(data?);
}
declare class S2CEquipGemOneKeyInlay
{
	Tag: number;
	EquipPosList: Array<EquipPos>;
	constructor(data?);
}
declare class C2SEquipGemOneKeyLevelUp
{
	constructor(data?);
}
declare class S2CEquipGemOneKeyLevelUp
{
	Tag: number;
	EquipPosList: Array<EquipPos>;
	constructor(data?);
}
declare class Suit
{
	Id: number;
	ActiveNum: Array<number>;
	Grade: number;
	constructor(data?);
}
declare class C2SSuitActive
{
	Id: number;
	Num: number;
	constructor(data?);
}
declare class S2CSuitActive
{
	Tag: number;
	Id: number;
	Num: number;
	constructor(data?);
}
declare class C2SSuitGradeUp
{
	Id: number;
	constructor(data?);
}
declare class S2CSuitGradeUp
{
	Tag: number;
	Id: number;
	GradeLevel: number;
	constructor(data?);
}
declare class C2SSuitInfo
{
	constructor(data?);
}
declare class S2CSuitInfo
{
	Tag: number;
	Data: Array<Suit>;
	constructor(data?);
}
declare class C2SSuitWearOrRemove
{
	Id: number;
	constructor(data?);
}
declare class S2CSuitWearOrRemove
{
	Tag: number;
	constructor(data?);
}
declare class RoleSkin
{
	Id: number;
	Star: number;
	constructor(data?);
}
declare class C2SRoleSkinInfo
{
	constructor(data?);
}
declare class S2CRoleSkinInfo
{
	SoulLevel: number;
	SoulValue: number;
	GodNum: number;
	Data: Array<RoleSkin>;
	Tag: number;
	constructor(data?);
}
declare class C2SRoleSkinActive
{
	SkinId: number;
	constructor(data?);
}
declare class S2CRoleSkinActive
{
	Tag: number;
	SkinId: number;
	constructor(data?);
}
declare class C2SRoleSkinRiseStar
{
	SkinId: number;
	constructor(data?);
}
declare class S2CRoleSkinRiseStar
{
	Tag: number;
	SkinId: number;
	Star: number;
	constructor(data?);
}
declare class C2SRoleSkinWearOrRemove
{
	WearOrRemoveId: number;
	constructor(data?);
}
declare class S2CRoleSkinWearOrRemove
{
	Tag: number;
	WearOrRemoveId: number;
	constructor(data?);
}
declare class C2SRoleSkinSoulLevel
{
	constructor(data?);
}
declare class S2CRoleSkinSoulLevel
{
	Tag: number;
	SoulLevel: number;
	SoulValue: number;
	constructor(data?);
}
declare class C2SRoleSkinGodNum
{
	constructor(data?);
}
declare class S2CRoleSkinGodNum
{
	Tag: number;
	GodNum: number;
	constructor(data?);
}
declare class S2CItemPop
{
	Tag: number;
	Type: number;
	ItemData: Array<ItemData>;
	constructor(data?);
}
declare class S2CItemInfoPop
{
	Tag: number;
	Type: number;
	ItemInfo: Array<ItemInfo>;
	constructor(data?);
}
declare class S2CNotice
{
	Tag: number;
	Id: number;
	Items1: Array<ItemNum>;
	Items2: Array<ItemNum>;
	constructor(data?);
}
declare class S2CRoleSkillList
{
	Skills: Array<SkillInfo>;
	constructor(data?);
}
declare class C2SRoleSkillUp
{
	SkillId: number;
	constructor(data?);
}
declare class S2CRoleSkillUp
{
	Tag: number;
	Skills: Array<SkillInfo>;
	constructor(data?);
}
declare class RoleMartialInfo
{
	Id: number;
	Level: number;
	Point: number;
	constructor(data?);
}
declare class C2SRoleMartialList
{
	constructor(data?);
}
declare class S2CRoleMartialList
{
	Tag: number;
	MartialList: Array<RoleMartialInfo>;
	constructor(data?);
}
declare class C2SRoleMartialLevelUp
{
	Id: number;
	constructor(data?);
}
declare class S2CRoleMartialLevelUp
{
	Tag: number;
	Martial: RoleMartialInfo ;
	constructor(data?);
}
declare class C2SArmyInfo
{
	constructor(data?);
}
declare class S2CArmyInfo
{
	Tag: number;
	IsUseItem: number;
	SkillIds: Array<number>;
	constructor(data?);
}
declare class C2SArmyUp
{
	constructor(data?);
}
declare class S2CArmyUp
{
	Tag: number;
	constructor(data?);
}
declare class C2SArmyUseItem
{
	constructor(data?);
}
declare class S2CArmyUseItem
{
	Tag: number;
	constructor(data?);
}
declare class C2SArmyReward
{
	Id: number;
	constructor(data?);
}
declare class S2CArmyReward
{
	Tag: number;
	Id: number;
	constructor(data?);
}
declare class C2SArmySkillActive
{
	SkillId: number;
	constructor(data?);
}
declare class S2CArmySkillActive
{
	Tag: number;
	SkillId: number;
	constructor(data?);
}
declare class ArenaRole
{
	UserId: number;
	Rank: number;
	IntAttr: Array<IntAttr>;
	StrAttr: Array<StrAttr>;
	Kill: number;
	Robot: number;
	constructor(data?);
}
declare class ArenaRankData
{
	Rank: number;
	AreaId: number;
	Nick: string ;
	FightValue: number;
	constructor(data?);
}
declare class C2SArenaList
{
	constructor(data?);
}
declare class S2CArenaList
{
	Tag: number;
	Roles: Array<ArenaRole>;
	constructor(data?);
}
declare class C2SArenaFight
{
	TargetId: number;
	TargetRank: number;
	Kill: number;
	constructor(data?);
}
declare class S2CArenaFight
{
	Tag: number;
	constructor(data?);
}
declare class C2SArenaSweep
{
	constructor(data?);
}
declare class S2CArenaSweep
{
	Tag: number;
	constructor(data?);
}
declare class C2SArenaBuyTimes
{
	constructor(data?);
}
declare class S2CArenaBuyTimes
{
	Tag: number;
	constructor(data?);
}
declare class C2SGetArenaRankList
{
	constructor(data?);
}
declare class S2CGetArenaRankList
{
	Tag: number;
	Ranks: Array<ArenaRankData>;
	MyRank: number;
	constructor(data?);
}
declare class LineupUnit
{
	Type: number;
	Pos: number;
	OnlyId: string ;
	constructor(data?);
}
declare class C2SChangeLineup
{
	Type: number;
	Pos: number;
	OnlyId: string ;
	constructor(data?);
}
declare class S2CChangeLineup
{
	Tag: number;
	Type: number;
	Pos: number;
	OnlyId: string ;
	OldOnlyId: string ;
	constructor(data?);
}
declare class S2CLineupInfo
{
	Lineup: Array<LineupUnit>;
	constructor(data?);
}
declare class GeneralSkill
{
	SkillId: number;
	SkillLv: number;
	SkillType: number;
	Lock: number;
	constructor(data?);
}
declare class GeneralSkin
{
	SkinId: number;
	SkinLv: number;
	constructor(data?);
}
declare class GeneralEquipData
{
	WearEquips: Array<number>;
	Level: number;
	Star: number;
	constructor(data?);
}
declare class GeneralData
{
	OnlyId: string ;
	IId: number;
	Level: number;
	Exp: number;
	AtkTalent: number;
	DefTalent: number;
	HpTalent: number;
	MaxAtkTalent: number;
	MaxDefTalent: number;
	MaxHpTalent: number;
	Grow: number;
	MaxGrow: number;
	Fv: number;
	Atk: number;
	Def: number;
	Hp: number;
	Title: number;
	Grade: number;
	Quality: number;
	TimeStamp: number;
	Lock: number;
	Skills: Array<GeneralSkill>;
	SkinId: number;
	AwakenItem: Array<ItemInfo>;
	MutationBaseCount: number;
	MutationTargetCount: number;
	EquipData: GeneralEquipData ;
	constructor(data?);
}
declare class S2CAllGeneral
{
	List: Array<GeneralData>;
	Skins: Array<GeneralSkin>;
	constructor(data?);
}
declare class S2CAddGeneral
{
	General: GeneralData ;
	constructor(data?);
}
declare class S2CDelGeneral
{
	OnlyIds: Array<string>;
	constructor(data?);
}
declare class C2SGeneralLevelUp
{
	OnlyId: string ;
	ItemId: number;
	ItemNum: number;
	constructor(data?);
}
declare class S2CGeneralLevelUp
{
	Tag: number;
	OnlyId: string ;
	Level: number;
	Exp: number;
	constructor(data?);
}
declare class C2SGeneralQualityUp
{
	OnlyId: string ;
	CostList: Array<string>;
	ItemId: number;
	constructor(data?);
}
declare class S2CGeneralQualityUp
{
	Tag: number;
	General: GeneralData ;
	constructor(data?);
}
declare class S2CGeneralUpdateAttr
{
	OnlyId: string ;
	Fv: number;
	Atk: number;
	Def: number;
	Hp: number;
	constructor(data?);
}
declare class S2CGeneralListUpdateAttr
{
	List: Array<S2CGeneralUpdateAttr>;
	constructor(data?);
}
declare class C2SGeneralLock
{
	OnlyId: string ;
	Lock: number;
	constructor(data?);
}
declare class S2CGeneralLock
{
	Tag: number;
	OnlyId: string ;
	Lock: number;
	constructor(data?);
}
declare class GeneralQualityUpParam
{
	MainId: string ;
	CostList: Array<string>;
	constructor(data?);
}
declare class C2SGeneralOneKeyQualityUp
{
	Params: Array<GeneralQualityUpParam>;
	constructor(data?);
}
declare class S2CGeneralOneKeyQualityUp
{
	Tag: number;
	Generals: Array<GeneralData>;
	constructor(data?);
}
declare class C2SGeneralAwaken
{
	OnlyId: string ;
	Type: number;
	AutoBuy: number;
	constructor(data?);
}
declare class S2CGeneralAwaken
{
	Tag: number;
	General: GeneralData ;
	constructor(data?);
}
declare class C2SGeneralAwakenSkill
{
	OnlyId: string ;
	constructor(data?);
}
declare class S2CGeneralAwakenSkill
{
	Tag: number;
	OnlyId: string ;
	Skills: Array<GeneralSkill>;
	constructor(data?);
}
declare class C2SGeneralGradeUp
{
	OnlyId: string ;
	CostList: Array<string>;
	constructor(data?);
}
declare class S2CGeneralGradeUp
{
	Tag: number;
	OnlyId: string ;
	GradeLv: number;
	Skill: GeneralSkill ;
	constructor(data?);
}
declare class C2SGeneralSkinLevelUp
{
	SkinId: number;
	constructor(data?);
}
declare class S2CGeneralSkinLevelUp
{
	Tag: number;
	constructor(data?);
}
declare class S2CGeneralSkinUpdate
{
	SkinId: number;
	SkinLv: number;
	constructor(data?);
}
declare class C2SGeneralWearSkin
{
	OnlyId: string ;
	SkinId: number;
	constructor(data?);
}
declare class S2CGeneralWearSkin
{
	Tag: number;
	OnlyId: string ;
	SkinId: number;
	constructor(data?);
}
declare class C2SGeneralEquipWear
{
	OnlyId: string ;
	Part: number;
	constructor(data?);
}
declare class S2CGeneralEquipWear
{
	Tag: number;
	OnlyId: string ;
	EquipData: GeneralEquipData ;
	constructor(data?);
}
declare class C2SGeneralEquipOneKeyWear
{
	OnlyId: string ;
	constructor(data?);
}
declare class S2CGeneralEquipOneKeyWear
{
	Tag: number;
	OnlyId: string ;
	EquipData: GeneralEquipData ;
	constructor(data?);
}
declare class C2SGeneralEquipStarUp
{
	OnlyId: string ;
	CostList: Array<string>;
	constructor(data?);
}
declare class S2CGeneralEquipStarUp
{
	Tag: number;
	OnlyId: string ;
	EquipData: GeneralEquipData ;
	MaxGrow: number;
	Grow: number;
	constructor(data?);
}
declare class C2SGeneralStudySkill
{
	OnlyId: string ;
	ItemId: number;
	constructor(data?);
}
declare class S2CGeneralStudySkill
{
	Tag: number;
	OnlyId: string ;
	Skills: Array<GeneralSkill>;
	SkillId: number;
	constructor(data?);
}
declare class C2SGeneralSkillLock
{
	OnlyId: string ;
	SkillId: number;
	constructor(data?);
}
declare class S2CGeneralSkillLock
{
	Tag: number;
	OnlyId: string ;
	Skill: GeneralSkill ;
	constructor(data?);
}
declare class C2SGeneralSkillRecycle
{
	Items: Array<ItemInfo>;
	constructor(data?);
}
declare class S2CGeneralSkillRecycle
{
	Tag: number;
	Items: Array<ItemInfo>;
	ItemIds: Array<number>;
	constructor(data?);
}
declare class C2SGeneralReturn
{
	OnlyId: string ;
	constructor(data?);
}
declare class S2CGeneralReturn
{
	Tag: number;
	Items: Array<ItemInfo>;
	constructor(data?);
}
declare class C2SGeneralReborn
{
	OnlyId: string ;
	constructor(data?);
}
declare class S2CGeneralReborn
{
	Tag: number;
	Items: Array<ItemInfo>;
	General: GeneralData ;
	constructor(data?);
}
declare class C2SGeneralRelease
{
	OnlyIds: Array<string>;
	constructor(data?);
}
declare class S2CGeneralRelease
{
	Tag: number;
	Items: Array<ItemInfo>;
	constructor(data?);
}
declare class C2SGeneralStick
{
	ItemId: number;
	ItemNum: number;
	constructor(data?);
}
declare class S2CGeneralStick
{
	Tag: number;
	constructor(data?);
}
declare class C2SComMaterial
{
	Id: number;
	Num: number;
	constructor(data?);
}
declare class S2CComMaterial
{
	Tag: number;
	constructor(data?);
}
declare class S2CRedDotStateList
{
	RedDotStateList: Array<RedDotState>;
	constructor(data?);
}
declare class RedDotState
{
	RedDotId: number;
	State: number;
	constructor(data?);
}
declare class C2SVipInfo
{
	constructor(data?);
}
declare class S2CVipInfo
{
	Tag: number;
	LevelReward: Array<number>;
	DailyReward: number;
	constructor(data?);
}
declare class C2SVipLevelReward
{
	VipLevel: number;
	constructor(data?);
}
declare class S2CVipLevelReward
{
	Tag: number;
	VipLevel: number;
	constructor(data?);
}
declare class C2SVipDailyReward
{
	constructor(data?);
}
declare class S2CVipDailyReward
{
	Tag: number;
	State: number;
	constructor(data?);
}
declare class S2CSecretMallInfo
{
	Tag: number;
	SecretMallList: Array<SecretMall>;
	NextRefreshUnix: number;
	RefreshTimes: number;
	constructor(data?);
}
declare class SecretMall
{
	Id: number;
	State: number;
	constructor(data?);
}
declare class C2SSecretMallBuy
{
	Id: number;
	constructor(data?);
}
declare class S2CSecretMallBuy
{
	Tag: number;
	Id: number;
	State: number;
	constructor(data?);
}
declare class C2SSecretMallRefresh
{
	constructor(data?);
}
declare class S2CSecretMallRefresh
{
	Tag: number;
	constructor(data?);
}
declare class C2SShoppingMallInfo
{
	constructor(data?);
}
declare class S2CShoppingMallInfo
{
	Tag: number;
	ShoppingMallList: Array<ShoppingMall>;
	constructor(data?);
}
declare class ShoppingMall
{
	Id: number;
	BuyTimes: number;
	constructor(data?);
}
declare class C2SShoppingMallBuy
{
	Id: number;
	Num: number;
	constructor(data?);
}
declare class S2CShoppingMallBuy
{
	Tag: number;
	Id: number;
	BuyTimes: number;
	constructor(data?);
}
declare class C2SMainTaskInfo
{
	constructor(data?);
}
declare class S2CMainTaskInfo
{
	Tag: number;
	CurTaskId: number;
	StageTarget: number;
	CurStage: number;
	LastTaskId: number;
	constructor(data?);
}
declare class C2SMainTaskReward
{
	constructor(data?);
}
declare class S2CMainTaskReward
{
	Tag: number;
	constructor(data?);
}
declare class C2SAFKInfo
{
	constructor(data?);
}
declare class S2CAFKInfo
{
	Tag: number;
	AFKTime: number;
	Items: Array<ItemInfo>;
	AFKEta: Array<ItemInfo>;
	RemainQuickTimes: number;
	MoneyCost: number;
	NextAFKEta: Array<ItemInfo>;
	constructor(data?);
}
declare class C2SAFKReward
{
	constructor(data?);
}
declare class S2CAFKReward
{
	Tag: number;
	constructor(data?);
}
declare class C2SQuickAFK
{
	constructor(data?);
}
declare class S2CQuickAFK
{
	Tag: number;
	RemainQuickTimes: number;
	MoneyCost: number;
	constructor(data?);
}
declare class C2SAFKRewardAdd
{
	constructor(data?);
}
declare class S2CAFKRewardAdd
{
	Tag: number;
	RewardAddList: Array<RewardAdd>;
	constructor(data?);
}
declare class RewardAdd
{
	Type: number;
	IntAttrList: Array<IntAttr>;
	constructor(data?);
}
declare class C2SWelcome
{
	constructor(data?);
}
declare class C2SStageFight
{
	constructor(data?);
}
declare class S2CStageFight
{
	Tag: number;
	Win: number;
	constructor(data?);
}
declare class C2SStagePassInfo
{
	constructor(data?);
}
declare class S2CStagePassInfo
{
	Tag: number;
	PassIdBuyList: Array<number>;
	ComRewardList: Array<number>;
	BuyRewardList: Array<number>;
	constructor(data?);
}
declare class C2SStagePassReward
{
	PassId: number;
	constructor(data?);
}
declare class S2CStagePassReward
{
	Tag: number;
	constructor(data?);
}
declare class OfficeTargetReward
{
	Level: number;
	State: number;
	LimitState: number;
	LimitExpireTimestamp: number;
	constructor(data?);
}
declare class OfficeSign
{
	Type: number;
	Level: number;
	LevelExp: number;
	Star: number;
	StarPos: number;
	StarExp: number;
	RefineLv: number;
	RefineValue: number;
	constructor(data?);
}
declare class C2SOfficeInfo
{
	constructor(data?);
}
declare class S2COfficeInfo
{
	Tag: number;
	TargetRewardList: Array<OfficeTargetReward>;
	DailyReward: number;
	TaskIds: Array<number>;
	SignList: Array<OfficeSign>;
	DailyOfficeLevel: number;
	constructor(data?);
}
declare class C2SOfficeTargetReward
{
	Level: number;
	constructor(data?);
}
declare class S2COfficeTargetReward
{
	Tag: number;
	Level: number;
	constructor(data?);
}
declare class C2SOfficeDailyReward
{
	constructor(data?);
}
declare class S2COfficeDailyReward
{
	Tag: number;
	State: number;
	constructor(data?);
}
declare class C2SOfficeTaskReward
{
	TaskId: number;
	constructor(data?);
}
declare class S2COfficeTaskReward
{
	Tag: number;
	TaskId: number;
	NewTaskId: number;
	constructor(data?);
}
declare class C2SOfficeUp
{
	constructor(data?);
}
declare class S2COfficeUp
{
	Tag: number;
	Level: number;
	constructor(data?);
}
declare class C2SOfficeSignUp
{
	Type: number;
	AutoBuy: number;
	constructor(data?);
}
declare class S2COfficeSignUp
{
	Tag: number;
	Type: number;
	Exp: number;
	Level: number;
	constructor(data?);
}
declare class C2SOfficeSignAutoUp
{
	Type: number;
	AutoBuy: number;
	constructor(data?);
}
declare class S2COfficeSignAutoUp
{
	Tag: number;
	Type: number;
	Exp: number;
	Level: number;
	constructor(data?);
}
declare class C2SOfficeSignStar
{
	Type: number;
	AutoBuy: number;
	constructor(data?);
}
declare class S2COfficeSignStar
{
	Tag: number;
	Type: number;
	Pos: number;
	Exp: number;
	constructor(data?);
}
declare class C2SOfficeSignAutoStar
{
	Type: number;
	AutoBuy: number;
	constructor(data?);
}
declare class S2COfficeSignAutoStar
{
	Tag: number;
	Type: number;
	Pos: number;
	Exp: number;
	constructor(data?);
}
declare class C2SOfficeSignBreakStar
{
	Type: number;
	constructor(data?);
}
declare class S2COfficeSignBreakStar
{
	Tag: number;
	Type: number;
	Star: number;
	Pos: number;
	Exp: number;
	constructor(data?);
}
declare class C2SOfficeSignRefine
{
	Type: number;
	IsUseItem: number;
	constructor(data?);
}
declare class S2COfficeSignRefine
{
	Tag: number;
	Type: number;
	RefineValue: number;
	IsOk: number;
	constructor(data?);
}
declare class C2SOfficeSignRefineBreak
{
	Type: number;
	IsUseItem: number;
	constructor(data?);
}
declare class S2COfficeSignRefineBreak
{
	Tag: number;
	Type: number;
	RefineLv: number;
	RefineValue: number;
	constructor(data?);
}
declare class Beauty
{
	BeautyId: number;
	Level: number;
	LevelExp: number;
	Star: number;
	constructor(data?);
}
declare class C2SBeautyInfo
{
	constructor(data?);
}
declare class S2CBeautyInfo
{
	Tag: number;
	BeautyList: Array<Beauty>;
	constructor(data?);
}
declare class C2SBeautyActive
{
	BeautyId: number;
	constructor(data?);
}
declare class S2CBeautyActive
{
	Tag: number;
	BeautyId: number;
	constructor(data?);
}
declare class C2SBeautyLevelUp
{
	BeautyId: number;
	AutoBuy: number;
	constructor(data?);
}
declare class S2CBeautyLevelUp
{
	Tag: number;
	Beauty: Beauty ;
	constructor(data?);
}
declare class C2SBeautyLevelUpAuto
{
	BeautyId: number;
	AutoBuy: number;
	constructor(data?);
}
declare class S2CBeautyLevelUpAuto
{
	Tag: number;
	Beauty: Beauty ;
	constructor(data?);
}
declare class C2SBeautyStarUp
{
	BeautyId: number;
	constructor(data?);
}
declare class S2CBeautyStarUp
{
	Tag: number;
	Beauty: Beauty ;
	constructor(data?);
}
declare class DunType
{
	DunType: number;
	PassTime: number;
	BuyTime: number;
	HelpPassTime: number;
	constructor(data?);
}
declare class DunId
{
	DunId: number;
	IsPass: number;
	constructor(data?);
}
declare class C2STeamDunInfo
{
	constructor(data?);
}
declare class S2CTeamDunInfo
{
	Tag: number;
	DunTypeList: Array<DunType>;
	DunIdList: Array<DunId>;
	TeamId: number;
	constructor(data?);
}
declare class C2SMyTeamInfo
{
	constructor(data?);
}
declare class S2CMyTeamInfo
{
	Tag: number;
	TeamId: number;
	DunId: number;
	PowerLimit: number;
	TeamMemberList: Array<TeamMember>;
	constructor(data?);
}
declare class TeamMember
{
	UserId: number;
	Pos: number;
	IntAttr: Array<IntAttr>;
	StrAttr: Array<StrAttr>;
	IsReal: number;
	constructor(data?);
}
declare class C2STeamDunBuyPassTime
{
	DunType: number;
	constructor(data?);
}
declare class S2CTeamDunBuyPassTime
{
	Tag: number;
	DunType: number;
	PassTime: number;
	BuyTime: number;
	constructor(data?);
}
declare class C2STeamDunSweep
{
	DunId: number;
	constructor(data?);
}
declare class S2CTeamDunSweep
{
	Tag: number;
	DunId: number;
	constructor(data?);
}
declare class C2STeamDunViewList
{
	DunId: number;
	constructor(data?);
}
declare class S2CTeamDunViewList
{
	Tag: number;
	TeamViewList: Array<TeamView>;
	constructor(data?);
}
declare class TeamView
{
	TeamId: number;
	TeamViewPlayerList: Array<TeamViewPlayer>;
	PowerLimit: number;
	constructor(data?);
}
declare class TeamViewPlayer
{
	UserId: number;
	Nick: string ;
	Fight: number;
	AreaId: number;
	HeadIcon: number;
	HeadFrame: number;
	State: number;
	constructor(data?);
}
declare class C2STeamDunCreate
{
	DunId: number;
	constructor(data?);
}
declare class S2CTeamDunCreate
{
	Tag: number;
	DunId: number;
	TeamId: number;
	constructor(data?);
}
declare class C2STeamDunJoin
{
	TeamId: number;
	constructor(data?);
}
declare class S2CTeamDunJoin
{
	Tag: number;
	TeamId: number;
	DunId: number;
	constructor(data?);
}
declare class C2STeamDunLeaveOrCancel
{
	constructor(data?);
}
declare class S2CTeamDunLeaveOrCancel
{
	Tag: number;
	LeaveType: number;
	TeamId: number;
	constructor(data?);
}
declare class C2STeamDunKick
{
	KickUserId: number;
	constructor(data?);
}
declare class S2CTeamDunKick
{
	Tag: number;
	KickUserId: number;
	constructor(data?);
}
declare class C2STeamDunStart
{
	constructor(data?);
}
declare class S2CTeamDunStart
{
	Tag: number;
	constructor(data?);
}
declare class C2STeamDunMatchPlayer
{
	constructor(data?);
}
declare class S2CTeamDunMatchPlayer
{
	Tag: number;
	constructor(data?);
}
declare class C2STeamDunLineupInfo
{
	constructor(data?);
}
declare class S2CTeamDunLineupInfo
{
	Tag: number;
	Lineup: Array<LineupUnit>;
	constructor(data?);
}
declare class C2STeamDunChangeLineup
{
	Pos: number;
	OnlyId: string ;
	constructor(data?);
}
declare class S2CTeamDunChangeLineup
{
	Tag: number;
	Type: number;
	Pos: number;
	OnlyId: string ;
	OldOnlyId: string ;
	Type2: number;
	Pos2: number;
	OnlyId2: string ;
	OldOnlyId2: string ;
	constructor(data?);
}
declare class C2STeamDunSetAccept
{
	IsAccept: number;
	constructor(data?);
}
declare class S2CTeamDunSetAccept
{
	Tag: number;
	IsAccept: number;
	constructor(data?);
}
declare class C2STeamDunSetPowerLimit
{
	PowerLimit: number;
	constructor(data?);
}
declare class S2CTeamDunSetPowerLimit
{
	Tag: number;
	PowerLimit: number;
	constructor(data?);
}
declare class C2STeamDunInvite
{
	InviteUserId: number;
	DunId: number;
	constructor(data?);
}
declare class S2CTeamDunInvite
{
	Tag: number;
	InviteUserId: number;
	constructor(data?);
}
declare class C2STeamDunInviteAuto
{
	DunId: number;
	Type: number;
	constructor(data?);
}
declare class S2CTeamDunInviteAuto
{
	Tag: number;
	Type: number;
	constructor(data?);
}
declare class S2CTeamDunReceiveInvite
{
	TeamId: number;
	LeaderName: string ;
	DunId: number;
	AreaId: number;
	InviteUserId: number;
	constructor(data?);
}
declare class C2STeamDunGetReport
{
	constructor(data?);
}
declare class C2STeamDunMatchList
{
	Type: number;
	constructor(data?);
}
declare class S2CTeamDunMatchList
{
	Tag: number;
	MatchList: Array<TeamViewPlayer>;
	Type: number;
	constructor(data?);
}
declare class C2STeamDunReject
{
	InviteUserId: number;
	constructor(data?);
}
declare class S2CTeamDunReject
{
	Tag: number;
	RejectUserId: number;
	RejectAreaId: number;
	RejectName: string ;
	constructor(data?);
}
declare class S2CRealNameTimeLimit
{
	Tag: number;
	constructor(data?);
}
declare class C2SSysSettingsInfo
{
	SysSettingsInfo: string ;
	constructor(data?);
}
declare class S2CSysSettingsInfo
{
	Tag: number;
	constructor(data?);
}
declare class HeadInfo
{
	HeadId: number;
	Star: number;
	Status: number;
	constructor(data?);
}
declare class C2SHeadInfo
{
	HeadType: number;
	constructor(data?);
}
declare class S2CHeadInfo
{
	Tag: number;
	HeadType: number;
	HeadList: Array<HeadInfo>;
	constructor(data?);
}
declare class C2SHeadActivate
{
	HeadType: number;
	HeadId: number;
	constructor(data?);
}
declare class C2SHeadUpStar
{
	HeadType: number;
	HeadId: number;
	constructor(data?);
}
declare class C2SHeadUse
{
	HeadType: number;
	HeadId: number;
	constructor(data?);
}
declare class S2CHeadUpdate
{
	Tag: number;
	HeadType: number;
	UpdateList: Array<HeadInfo>;
	constructor(data?);
}
declare class RelationPlayerData
{
	UserId: number;
	Name: string ;
	HeadFrame: number;
	Head: number;
	Level: number;
	Online: number;
	FightValue: number;
	Status: number;
	PrivateChatList: Array<FriendPrivateChatInfo>;
	constructor(data?);
}
declare class FriendPrivateChatInfo
{
	SendUserId: number;
	ReceiveUserId: number;
	Time: number;
	Content: string ;
	constructor(data?);
}
declare class C2SRelationInfo
{
	Relationype: number;
	constructor(data?);
}
declare class S2CRelationInfo
{
	Tag: number;
	Relationype: number;
	FetchGiftCount: number;
	PlayerInfoList: Array<RelationPlayerData>;
	constructor(data?);
}
declare class C2SApplyAddFriend
{
	UserId: number;
	constructor(data?);
}
declare class S2CApplyAddFriend
{
	Tag: number;
	constructor(data?);
}
declare class C2SApplyOperation
{
	UserId: number;
	Opt: number;
	constructor(data?);
}
declare class S2CApplyOperation
{
	Tag: number;
	constructor(data?);
}
declare class C2SDelFriend
{
	UserId: number;
	constructor(data?);
}
declare class S2CDelFriend
{
	Tag: number;
	UserId: number;
	constructor(data?);
}
declare class S2CAddRelation
{
	Tag: number;
	Relationype: number;
	PlayerData: RelationPlayerData ;
	constructor(data?);
}
declare class C2SFriendGifts
{
	UserId: number;
	constructor(data?);
}
declare class S2CFriendGifts
{
	Tag: number;
	PlayerData: RelationPlayerData ;
	constructor(data?);
}
declare class C2SGetFriendGifts
{
	UserId: number;
	constructor(data?);
}
declare class S2CGetFriendGifts
{
	Tag: number;
	UserId: number;
	constructor(data?);
}
declare class C2SFindPlayerInfo
{
	FindInfo: string ;
	constructor(data?);
}
declare class S2CFindPlayerInfo
{
	Tag: number;
	PlayerData: Array<RelationPlayerData>;
	constructor(data?);
}
declare class C2SRecommendList
{
	constructor(data?);
}
declare class S2CRecommendList
{
	Tag: number;
	PlayerDataList: Array<RelationPlayerData>;
	constructor(data?);
}
declare class C2SFriendPrivateChat
{
	FriendUserId: number;
	Content: string ;
	constructor(data?);
}
declare class S2CFriendPrivateChat
{
	Tag: number;
	ChatData: FriendPrivateChatInfo ;
	constructor(data?);
}
declare class FamilyTask
{
	TaskId: number;
	Quality: number;
	NameId: number;
	TaskTimestamp: number;
	PriceId: number;
	TaskConditionIds: Array<number>;
	TaskState: number;
	TaskFateId: number;
	PartnerNum: number;
	FateOk: number;
	DropItem: Array<ItemInfo>;
	constructor(data?);
}
declare class HelpPartner
{
	Id: string ;
	IId: number;
	PartnerType: number;
	UserNick: string ;
	UserId: number;
	Quality: number;
	Rarity: number;
	Camp: number;
	Title: number;
	constructor(data?);
}
declare class SetPartner
{
	Id: string ;
	PartnerType: number;
	constructor(data?);
}
declare class FamilyMember
{
	UserId: number;
	Name: string ;
	HeadFrame: number;
	Head: number;
	VIP: number;
	FightValue: number;
	LastLogout: number;
	Rank: number;
	Position: number;
	constructor(data?);
}
declare class FamilyPatriHurtRank
{
	UserId: number;
	Name: string ;
	AreaId: number;
	HeadFrame: number;
	Head: number;
	FightValue: number;
	Hurt: number;
	Rank: number;
	constructor(data?);
}
declare class CanStartTask
{
	TaskId: number;
	SetPartnerL: Array<SetPartner>;
	constructor(data?);
}
declare class C2SFamilyTaskHelpPartner
{
	constructor(data?);
}
declare class S2CFamilyTaskHelpPartner
{
	Tag: number;
	HelpPartnerL: Array<HelpPartner>;
	constructor(data?);
}
declare class C2SFamilyTaskInfo
{
	constructor(data?);
}
declare class S2CFamilyTaskInfo
{
	Tag: number;
	FamilyTaskList: Array<FamilyTask>;
	RefreshNum: number;
	UsePartnerId: Array<string>;
	HelpPartnerList: Array<SetPartner>;
	SetPartnerToHelpTime: number;
	HelpNum: number;
	StartNum: number;
	constructor(data?);
}
declare class C2SFamilyTaskSetPartnerToHelp
{
	SetPartnerList: Array<SetPartner>;
	constructor(data?);
}
declare class S2CFamilyTaskSetPartnerToHelp
{
	Tag: number;
	SetPartnerToHelpTime: number;
	constructor(data?);
}
declare class C2SFamilyTaskRefresh
{
	constructor(data?);
}
declare class S2CFamilyTaskRefresh
{
	Tag: number;
	FamilyTaskList: Array<FamilyTask>;
	RefreshNum: number;
	constructor(data?);
}
declare class C2SFamilyTaskStart
{
	TaskId: number;
	SetPartnerL: Array<SetPartner>;
	constructor(data?);
}
declare class S2CFamilyTaskStart
{
	Tag: number;
	FamilyTask: FamilyTask ;
	UsePartnerId: Array<string>;
	TaskId: number;
	StartNum: number;
	constructor(data?);
}
declare class C2SFamilyTaskGetPrice
{
	constructor(data?);
}
declare class S2CFamilyTaskGetPrice
{
	Tag: number;
	TaskIds: Array<number>;
	UsePartnerId: Array<string>;
	constructor(data?);
}
declare class C2SFamilyMemberList
{
	Start: number;
	End: number;
	constructor(data?);
}
declare class S2CFamilyMemberList
{
	Tag: number;
	FamilyMemberList: Array<FamilyMember>;
	constructor(data?);
}
declare class C2SFamilyInfo
{
	constructor(data?);
}
declare class S2CFamilyInfo
{
	Tag: number;
	Name: string ;
	Word: string ;
	Lv: number;
	Exp: number;
	OnlineNum: number;
	AllNum: number;
	constructor(data?);
}
declare class C2SFamilyRoleInfo
{
	constructor(data?);
}
declare class S2CFamilyRoleInfo
{
	Tag: number;
	DailySalary: number;
	Worship: number;
	Position: number;
	RenameNum: number;
	RenameTime: number;
	RenameWordTime: number;
	constructor(data?);
}
declare class C2SFamilyTaskSpeed
{
	TaskId: number;
	constructor(data?);
}
declare class S2CFamilyTaskSpeed
{
	Tag: number;
	TaskId: number;
	constructor(data?);
}
declare class C2SFamilyTaskGetAllCanStart
{
	constructor(data?);
}
declare class S2CFamilyTaskGetAllCanStart
{
	Tag: number;
	CanStartTaskL: Array<CanStartTask>;
	constructor(data?);
}
declare class C2SFamilyTaskStartOneKey
{
	CanStartTaskL: Array<CanStartTask>;
	constructor(data?);
}
declare class S2CFamilyTaskStartOneKey
{
	Tag: number;
	FamilyTaskList: Array<FamilyTask>;
	UsePartnerId: Array<string>;
	TaskIdL: Array<number>;
	StartNum: number;
	constructor(data?);
}
declare class S2CFamilyLevelUp
{
	NewLevel: number;
	constructor(data?);
}
declare class C2SFamilyTopPlayerData
{
	constructor(data?);
}
declare class S2CFamilyTopPlayerData
{
	Tag: number;
	UserShowInfo: Array<BaseUserInfo>;
	TermNum: number;
	TermTime: number;
	constructor(data?);
}
declare class C2SFamilyRename
{
	Name: string ;
	constructor(data?);
}
declare class S2CFamilyRename
{
	Tag: number;
	RenameNum: number;
	RenameTime: number;
	constructor(data?);
}
declare class C2SFamilyRenameWord
{
	Word: string ;
	constructor(data?);
}
declare class S2CFamilyRenameWord
{
	Tag: number;
	RenameWordTime: number;
	constructor(data?);
}
declare class C2SFamilyWorship
{
	constructor(data?);
}
declare class S2CFamilyWorship
{
	Tag: number;
	Worship: number;
	constructor(data?);
}
declare class C2SFamilyDailySalary
{
	constructor(data?);
}
declare class S2CFamilyDailySalary
{
	Tag: number;
	DailySalary: number;
	constructor(data?);
}
declare class C2SFamilyPatriInfo
{
	constructor(data?);
}
declare class S2CFamilyPatriInfo
{
	Tag: number;
	ActId: number;
	FirstType: number;
	StartTime: number;
	EndTime: number;
	NextOpenTime: number;
	LastEndTime: number;
	NextTerm: number;
	constructor(data?);
}
declare class C2SFamilyPatriLeaderInfo
{
	constructor(data?);
}
declare class S2CFamilyPatriLeaderInfo
{
	Tag: number;
	CandidateShowInfo: Array<BaseUserInfo>;
	LeaderShowInfo: Array<BaseUserInfo>;
	ReportIdxList: Array<ReportIdx>;
	constructor(data?);
}
declare class ReportIdx
{
	Win: number;
	Idx: string ;
	constructor(data?);
}
declare class C2SFamilyPatriChallengeBoss
{
	constructor(data?);
}
declare class S2CFamilyPatriChallengeBoss
{
	Tag: number;
	constructor(data?);
}
declare class C2SFamilyPatriChallengeLeader
{
	constructor(data?);
}
declare class S2CFamilyPatriChallengeLeader
{
	Tag: number;
	constructor(data?);
}
declare class C2SFamilyPatriWatchVideos
{
	Index: string ;
	constructor(data?);
}
declare class S2CFamilyPatriWatchVideos
{
	Tag: number;
	constructor(data?);
}
declare class C2SFamilyPatriGetRank
{
	Start: number;
	End: number;
	constructor(data?);
}
declare class S2CFamilyPatriGetRank
{
	Tag: number;
	FamilyPatriHurtRankList: Array<FamilyPatriHurtRank>;
	constructor(data?);
}
declare class C2SFamilyPatriGetMyRank
{
	constructor(data?);
}
declare class S2CFamilyPatriGetMyRank
{
	Tag: number;
	Rank: number;
	Val: number;
	MaxVal: number;
	constructor(data?);
}
declare class Totem
{
	Id: number;
	Level: number;
	Exp: number;
	constructor(data?);
}
declare class C2STotemInfo
{
	constructor(data?);
}
declare class S2CTotemInfo
{
	Tag: number;
	TotemList: Array<Totem>;
	constructor(data?);
}
declare class C2STotemBuild
{
	Id: number;
	constructor(data?);
}
declare class S2CTotemBuild
{
	Tag: number;
	constructor(data?);
}
declare class DrillGround
{
	Id: number;
	Lv: number;
	constructor(data?);
}
declare class C2SGetDrillGroundInfo
{
	constructor(data?);
}
declare class S2CGetDrillGroundInfo
{
	Tag: number;
	ResonateLv: number;
	DrillGroundA: Array<DrillGround>;
	constructor(data?);
}
declare class C2SDrillGroundResonateLevelUp
{
	constructor(data?);
}
declare class S2CDrillGroundResonateLevelUp
{
	Tag: number;
	ResonateLv: number;
	constructor(data?);
}
declare class C2SDrillGroundLevelUp
{
	Id: number;
	constructor(data?);
}
declare class S2CDrillGroundLevelUp
{
	Tag: number;
	Id: number;
	Lv: number;
	constructor(data?);
}
declare class C2STrialCopyInfo
{
	constructor(data?);
}
declare class S2CTrialCopyInfo
{
	Tag: number;
	CanNum: number;
	BuyNum: number;
	RewardList: Array<CommonType>;
	RedPacketList: Array<CommonType2>;
	HurtList: Array<IntAttr>;
	constructor(data?);
}
declare class C2STrialCopyBossInfo
{
	constructor(data?);
}
declare class S2CTrialCopyBossInfo
{
	Tag: number;
	TrialId: number;
	Hp: number;
	constructor(data?);
}
declare class C2STrialCopyRank
{
	constructor(data?);
}
declare class S2CTrialCopyRank
{
	Tag: number;
	TrialCopyRankList: Array<TrialCopyRank>;
	constructor(data?);
}
declare class TrialCopyRank
{
	AreaId: number;
	TrialId: number;
	Time: number;
	Rank: number;
	constructor(data?);
}
declare class C2STrialCopyRedPacketRank
{
	constructor(data?);
}
declare class S2CTrialCopyRedPacketRank
{
	Tag: number;
	RedPacketRankList: Array<RedPacketRank>;
	constructor(data?);
}
declare class RedPacketRank
{
	TrialId: number;
	Rank: number;
	RedNum: number;
	BaseUserInfo: BaseUserInfo ;
	constructor(data?);
}
declare class C2STrialCopyChallenge
{
	TrialId: number;
	constructor(data?);
}
declare class S2CTrialCopyChallenge
{
	Tag: number;
	CanNum: number;
	constructor(data?);
}
declare class C2STrialCopySweep
{
	TrialId: number;
	constructor(data?);
}
declare class S2CTrialCopySweep
{
	Tag: number;
	CanNum: number;
	constructor(data?);
}
declare class C2STrialCopyBuyNum
{
	constructor(data?);
}
declare class S2CTrialCopyBuyNum
{
	Tag: number;
	BuyNum: number;
	CanNum: number;
	constructor(data?);
}
declare class C2STrialCopyReward
{
	TrialId: number;
	constructor(data?);
}
declare class S2CTrialCopyReward
{
	Tag: number;
	TrialId: number;
	constructor(data?);
}
declare class C2STrialCopyRedPacket
{
	TrialId: number;
	constructor(data?);
}
declare class S2CTrialCopyRedPacket
{
	Tag: number;
	TrialId: number;
	RedPacketNum: number;
	constructor(data?);
}
declare class CollectionBookSt
{
	Id: number;
	Star: number;
	New: number;
	Share: number;
	constructor(data?);
}
declare class S2CCollectionBookAllData
{
	Items: Array<CollectionBookSt>;
	Level: number;
	Exp: number;
	TaskIds: Array<number>;
	constructor(data?);
}
declare class S2CCollectionBookUpdate
{
	Item: CollectionBookSt ;
	Level: number;
	Exp: number;
	constructor(data?);
}
declare class C2SCollectionBookActive
{
	Id: number;
	constructor(data?);
}
declare class S2CCollectionBookActive
{
	Tag: number;
	constructor(data?);
}
declare class C2SCollectionBookStarUp
{
	Id: number;
	constructor(data?);
}
declare class S2CCollectionBookStarUp
{
	Tag: number;
	constructor(data?);
}
declare class C2SCollectionBookTask
{
	TaskId: number;
	constructor(data?);
}
declare class S2CCollectionBookTask
{
	Tag: number;
	TaskId: number;
	NewTaskId: number;
	constructor(data?);
}
declare class C2SCollectionBookLook
{
	Id: number;
	constructor(data?);
}
declare class S2CCollectionBookLook
{
	Tag: number;
	constructor(data?);
}
declare class DailyStageReward
{
	Id: number;
	Status: number;
	LastTime: number;
	IsDouble: number;
	constructor(data?);
}
declare class SilkRoadCityInfo
{
	EventId: number;
	CityId: number;
	ItemInfos: Array<ItemInfo>;
	constructor(data?);
}
declare class SilkRoadInfo
{
	Id: number;
	Count: number;
	BuyCount: number;
	StartTime: number;
	FinishTime: number;
	Status: number;
	CityInfos: Array<SilkRoadCityInfo>;
	BaseItemInfos: Array<ItemInfo>;
	constructor(data?);
}
declare class C2SSilkRoadInfo
{
	constructor(data?);
}
declare class S2CSilkRoadInfo
{
	Tag: number;
	SilkRoadInfo: SilkRoadInfo ;
	constructor(data?);
}
declare class C2SSilkRoadStart
{
	Id: number;
	constructor(data?);
}
declare class S2CSilkRoadStart
{
	Tag: number;
	SilkRoadInfo: SilkRoadInfo ;
	constructor(data?);
}
declare class C2SSilkRoadFastFinish
{
	Id: number;
	constructor(data?);
}
declare class S2CSilkRoadFastFinish
{
	Tag: number;
	SilkRoadInfo: SilkRoadInfo ;
	constructor(data?);
}
declare class C2SSilkRoadBuyCount
{
	constructor(data?);
}
declare class S2CSilkRoadBuyCount
{
	Tag: number;
	BuyCount: number;
	constructor(data?);
}
declare class C2SSilkRoadReward
{
	constructor(data?);
}
declare class S2CSilkRoadReward
{
	Tag: number;
	SilkRoadInfo: SilkRoadInfo ;
	constructor(data?);
}
declare class C2SExploreFight
{
	ExploreType: number;
	constructor(data?);
}
declare class S2CExploreFight
{
	Tag: number;
	ExploreType: number;
	constructor(data?);
}
declare class C2SExploreSweep
{
	ExploreType: number;
	constructor(data?);
}
declare class S2CExploreSweep
{
	Tag: number;
	ExploreType: number;
	BStage: number;
	EStage: number;
	constructor(data?);
}
declare class ResRecoveredReward
{
	Id: number;
	Count: number;
	LastTime: number;
	IsDouble: number;
	ItemInfos: Array<ItemInfo>;
	constructor(data?);
}
declare class ResRecoveredInfo
{
	RecoveredType: number;
	ResRecovereds: Array<ResRecoveredReward>;
	constructor(data?);
}
declare class DailyTaskInfo
{
	DailyType: number;
	DailyStageInfo: Array<DailyStageReward>;
	constructor(data?);
}
declare class C2SDailyTaskInfo
{
	DailyType: number;
	constructor(data?);
}
declare class S2CDailyTaskInfo
{
	Tag: number;
	DailyTask: DailyTaskInfo ;
	constructor(data?);
}
declare class C2SResRecoveredInfo
{
	RecoveredType: number;
	constructor(data?);
}
declare class S2CResRecoveredInfo
{
	Tag: number;
	ResRecovered: ResRecoveredInfo ;
	constructor(data?);
}
declare class C2SDailyTaskReward
{
	TaskId: number;
	constructor(data?);
}
declare class S2CDailyTaskReward
{
	Tag: number;
	TaskId: number;
	constructor(data?);
}
declare class C2SDailyStageReward
{
	Id: number;
	constructor(data?);
}
declare class S2CDailyStageReward
{
	Tag: number;
	Id: number;
	constructor(data?);
}
declare class C2SResRecovered
{
	RecoveredType: number;
	Id: number;
	Num: number;
	constructor(data?);
}
declare class S2CResRecovered
{
	Tag: number;
	Id: number;
	Count: number;
	constructor(data?);
}
declare class C2SAllResRecovered
{
	RecoveredType: number;
	constructor(data?);
}
declare class S2CAllResRecovered
{
	Tag: number;
	Ids: Array<number>;
	constructor(data?);
}
declare class IncreaseSkill
{
	SkillId: number;
	LifeTime: number;
	GetTime: number;
	constructor(data?);
}
declare class S2CAllIncrease
{
	Skills: Array<IncreaseSkill>;
	constructor(data?);
}
declare class S2CIncreaseUpdate
{
	Skill: IncreaseSkill ;
	constructor(data?);
}
declare class S2CIncreaseDel
{
	SkillId: number;
	constructor(data?);
}
declare class AdventureEvent
{
	OnlyId: number;
	EventId: number;
	OverTime: number;
	State: number;
	EventWish: EventWish ;
	EventBuyList: Array<EventBuy>;
	EventGoldBuy: EventGoldBuy ;
	EventQuestion: EventQuestion ;
	constructor(data?);
}
declare class EventQuestion
{
	Id: number;
	Param: string ;
	OptionParam1: string ;
	OptionParam2: string ;
	Value: number;
	RightValue: number;
	constructor(data?);
}
declare class EventGoldBuy
{
	Id: number;
	BuyNum: number;
	constructor(data?);
}
declare class EventBuy
{
	Id: number;
	BuyNum: number;
	constructor(data?);
}
declare class EventWish
{
	WishState: number;
	CanGetTime: number;
	IdList: Array<number>;
	constructor(data?);
}
declare class AdventurePos
{
	Pos: number;
	Type: number;
	ItemInfo: Array<ItemInfo>;
	EventId: number;
	constructor(data?);
}
declare class C2SAdventureInfo
{
	constructor(data?);
}
declare class S2CAdventureInfo
{
	Tag: number;
	AdventurePosList: Array<AdventurePos>;
	Pos: number;
	LevelNum: number;
	AdventureEventList: Array<AdventureEvent>;
	constructor(data?);
}
declare class C2SAdventureComDice
{
	constructor(data?);
}
declare class S2CAdventureComDice
{
	Tag: number;
	Pos: number;
	DiceNum: number;
	AdventureEvent: AdventureEvent ;
	LevelNum: number;
	constructor(data?);
}
declare class C2SAdventureGoldDice
{
	DiceNum: number;
	constructor(data?);
}
declare class S2CAdventureGoldDice
{
	Tag: number;
	Pos: number;
	AdventureEvent: AdventureEvent ;
	Level: number;
	constructor(data?);
}
declare class C2SAdventureEventUse
{
	OnlyId: number;
	Value: number;
	constructor(data?);
}
declare class S2CAdventureEventUse
{
	Tag: number;
	AdventureEvent: AdventureEvent ;
	constructor(data?);
}
declare class Adviser
{
	Level: number;
	Exp: number;
	MasteryList: Array<IntAttr>;
	constructor(data?);
}
declare class C2SAdviserInfo
{
	constructor(data?);
}
declare class S2CAdviserInfo
{
	Tag: number;
	Adviser: Adviser ;
	constructor(data?);
}
declare class C2SAdviserLevelUp
{
	AutoBuy: number;
	constructor(data?);
}
declare class S2CAdviserLevelUp
{
	Tag: number;
	Adviser: Adviser ;
	constructor(data?);
}
declare class C2SAdviserLevelUpAuto
{
	AutoBuy: number;
	constructor(data?);
}
declare class S2CAdviserLevelUpAuto
{
	Tag: number;
	Adviser: Adviser ;
	constructor(data?);
}
declare class C2SAdviserMasteryLevelUp
{
	MasteryId: number;
	constructor(data?);
}
declare class S2CAdviserMasteryLevelUp
{
	Tag: number;
	MasteryInfo: IntAttr ;
	constructor(data?);
}
