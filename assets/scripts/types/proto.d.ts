declare enum ProtoId {
		Default_ID=0,
		C2SLogin_ID=1,
		S2CLogin_ID=2,
		S2CRoleInfo_ID=3,
		S2CServerInfo_ID=4,
		C2SGM_ID=5,
		S2CKill_ID=6,
		C2SRoleBaseInfo_ID=7,
		S2CRoleBaseInfo_ID=8,
		S2CRoleData_ID=9,
		C2SOtherInfo_ID=10,
		S2COtherInfo_ID=11,
		S2CNotice_ID=12,
		C2SRespect_ID=13,
		S2CRespect_ID=14,
		S2COfflinePrize_ID=15,
		C2SGetOfflinePrize_ID=16,
		S2CGetOfflinePrize_ID=17,
		C2SGetGift1_ID=18,
		S2CGetGift1_ID=19,
		C2SGetGift2_ID=20,
		S2CGetGift2_ID=21,
		Ping_ID=22,
		Pong_ID=23,
		LoginFinish_ID=24,
		C2SAchieveShow_ID=25,
		S2CAchieveShow_ID=26,
		C2SUserInfo_ID=27,
		S2CUserInfo_ID=28,
		C2SLoginEnd_ID=29,
		S2CReportFcm_ID=30,
		C2SSetFcm_ID=31,
		C2SFocusPrice_ID=32,
		S2CFocusPrice_ID=33,
		C2SFirstInvite_ID=34,
		S2CFirstInvite_ID=35,
		C2SNewStory_ID=36,
		S2CNewStory_ID=37,
		S2CAllData_ID=39,
		C2SAutoJump_ID=41,
		S2CRealNamePopups_ID=42,
		S2COtherInfoEquip_ID=45,
		S2COtherInfoPet_ID=46,
		S2COtherInfoFV_ID=47,
		S2CRoleTask_ID=48,
		C2SRoleInfo_ID=49,
		C2SChangeMap_ID=50,
		S2CChangeMap_ID=51,
		C2SStartMove_ID=52,
		S2CStartMove_ID=53,
		S2CPlayerMove_ID=54,
		C2SStopMove_ID=55,
		S2CPlayerStopMove_ID=56,
		S2CPlayerEnterMap_ID=57,
		S2CPlayerLeaveMap_ID=58,
		S2CMonsterEnterMap_ID=59,
		S2CMonsterLeaveMap_ID=60,
		C2SStartFight_ID=61,
		S2CStartFight_ID=62,
		S2CUpMonsterInfo_ID=63,
		S2CTransfer_ID=64,
		C2SCheckFight_ID=65,
		S2CCheckFight_ID=66,
		S2CStopMove_ID=67,
		C2SUpdateMapInfo_ID=68,
		C2SSearchPlayer_ID=69,
		S2CSearchPlayer_ID=70,
		C2SRoleSkillUp_ID=71,
		C2SRoleSkillUpAuto_ID=72,
		S2CRoleSkillUp_ID=73,
		C2SRoleSkillOrder_ID=74,
		S2CRoleSkillOrder_ID=75,
		C2SWelcome_ID=76,
		S2CReLoginState_ID=77,
		C2SUnlockSkin_ID=81,
		S2CUnlockSkin_ID=82,
		C2SWearSkin_ID=83,
		S2CWearSkin_ID=84,
		C2SGetVipPrize_ID=85,
		S2CGetVipPrize_ID=86,
		C2SGetNewPrize_ID=87,
		S2CGetNewPrize_ID=88,
		C2SClientSwitch_ID=89,
		S2CClientSwitch_ID=90,
		C2SReLogin_ID=91,
		S2CReLogin_ID=92,
		C2SStartCollect_ID=93,
		S2CStartCollect_ID=94,
		C2SEndCollect_ID=95,
		S2CEndCollect_ID=96,
		C2SShareSuccess_ID=97,
		S2CMonsterTalk_ID=98,
		C2SNewPlayerZF_ID=99,
		S2CPrizeReport_ID=100,
		S2CBattlefieldReport_ID=101,
		C2SEndFight_ID=102,
		C2SStageFight_ID=103,
		S2CStageFight_ID=104,
		C2SAutoStage_ID=105,
		C2SStageSeek_ID=106,
		S2CStageSeek_ID=107,
		C2SStageHelp_ID=108,
		S2CStageHelp_ID=109,
		S2CStagePrize_ID=110,
		C2SGetStagePrize_ID=111,
		S2CGetStagePrize_ID=112,
		C2SCatchPet_ID=113,
		S2CCatchPet_ID=114,
		C2SStagePrize_ID=115,
		C2SGetAllStagePrize_ID=116,
		S2CGetAllStagePrize_ID=117,
		C2SStageDraw_ID=118,
		S2CStageDraw_ID=119,
		C2SRealName_ID=120,
		S2CRealName_ID=121,
		C2SGetRealNamePrize_ID=122,
		S2CGetRealNamePrize_ID=123,
		C2SGetLimitCloth_ID=124,
		S2CGetLimitCloth_ID=125,
		S2CGetLimitClothEnd_ID=126,
		C2SSkinUp_ID=127,
		S2CSkinUp_ID=128,
		C2SStageDrawEnd_ID=129,
		C2SBuyVipPrize_ID=130,
		S2CBuyVipPrize_ID=131,
		C2SGetSuperVipQQ_ID=132,
		S2CGetSuperVipQQ_ID=133,
		C2SFightContinue_ID=135,
		C2SGetVipDayGift_ID=136,
		S2CGetVipDayGift_ID=137,
		C2SMoving_ID=138,
		S2CMoving_ID=139,
		C2SDropSkin_ID=140,
		S2CDropSkin_ID=141,
		C2SSkinReikiUp_ID=142,
		S2CSkinReikiUp_ID=143,
		C2SSkinSpiritUp_ID=144,
		S2CSkinSpiritUp_ID=145,
		C2SActiveSkinExt_ID=146,
		S2CActiveSkinExt_ID=147,
		C2SSkinSuitUp_ID=148,
		S2CSkinSuitUp_ID=149,
		C2SWearSkinSuit_ID=150,
		S2CWearSkinSuit_ID=151,
		C2SDropSkinSuit_ID=152,
		S2CDropSkinSuit_ID=153,
		C2SRoutePath_ID=154,
		S2CRoutePath_ID=155,
		C2SSkinSuitExtAttr_ID=156,
		S2CSkinSuitExtAttr_ID=157,
		S2CSimpleBattleReport_ID=160,
		S2CFightCD_ID=161,
		C2SOpenMomoMsg_ID=170,
		C2SGetMomoPrize_ID=171,
		S2CGetMomoPrize_ID=172,
		C2SGradeUp_ID=201,
		S2CGradeUp_ID=202,
		C2SGetGradePrize_ID=203,
		S2CGetGradePrize_ID=204,
		C2SGradeHuaJin_ID=205,
		S2CGradeHuaJin_ID=206,
		S2CUserGrade_ID=210,
		C2SReborn_ID=216,
		S2CReborn_ID=217,
		C2SGetFnPreviewPrize_ID=218,
		S2CGetFnPreviewPrize_ID=219,
		C2SFnPreviewCfg_ID=220,
		S2CGetFriends_ID=302,
		C2SFocus_ID=303,
		S2CFocus_ID=304,
		C2SCancelFocus_ID=305,
		S2CCancelFocus_ID=306,
		C2SHate_ID=307,
		S2CHate_ID=308,
		C2SCancelHate_ID=309,
		S2CCancelHate_ID=310,
		C2SGiveCoin_ID=311,
		S2CGiveCoin_ID=312,
		C2SGetCoin_ID=313,
		S2CGetCoin_ID=314,
		C2SGetSuggest_ID=315,
		S2CGetSuggest_ID=316,
		C2SOneKeyGiveCoin_ID=317,
		S2COneKeyGiveCoin_ID=318,
		C2SOneKeyGetCoin_ID=319,
		S2COneKeyGetCoin_ID=320,
		C2SOneKeyFocus_ID=321,
		S2COneKeyFocus_ID=322,
		C2SEnemyRecord_ID=330,
		S2CEnemyRecord_ID=331,
		C2SDelEnemy_ID=332,
		S2CDelEnemy_ID=333,
		C2SAddNewEnemy_ID=334,
		S2CAddNewEnemy_ID=335,
		C2SGetFriendInfos_ID=340,
		S2CGetFriendInfos_ID=341,
		C2SBlack_ID=342,
		S2CBlack_ID=343,
		S2CMasterMessage_ID=350,
		C2SSendMasterNotice_ID=351,
		S2CSendMasterNotice_ID=352,
		S2CMasterAds_ID=353,
		C2SMasterInvite_ID=354,
		S2CMasterInvite_ID=355,
		S2CInvitePupil_ID=356,
		C2SHandleMasterInvite_ID=357,
		S2CHandleMasterInvite_ID=358,
		C2SMasterGiveExp_ID=359,
		S2CMasterGiveExp_ID=360,
		C2SGetMasterExp_ID=361,
		S2CGetMasterExp_ID=362,
		C2SDeletePupil_ID=363,
		S2CDeletePupil_ID=364,
		C2SDeleteMaster_ID=365,
		S2CDeleteMaster_ID=366,
		C2SGetPupilTask_ID=367,
		S2CGetPupilTask_ID=368,
		S2CMarryStatus_ID=370,
		C2SGetMarryList_ID=371,
		S2CGetMarryList_ID=372,
		C2SGetMarry_ID=373,
		S2CGetMarry_ID=374,
		S2CSendMarry_ID=375,
		C2SSendFlower_ID=377,
		S2CSendFlower_ID=378,
		S2CGetFlower_ID=379,
		C2SMarryUpdate_ID=381,
		S2CMarryUpdate_ID=382,
		C2SHouseUpdate_ID=383,
		S2CHouseUpdate_ID=384,
		C2SGetUpdate_ID=386,
		S2CGetUpdate_ID=387,
		S2CNewMarry_ID=388,
		C2SSendMarryGift_ID=389,
		S2CSendMarryGift_ID=390,
		C2SHandelMarry_ID=391,
		S2CHandelMarry_ID=392,
		C2SDeleteWife_ID=393,
		S2CDeleteWife_ID=394,
		S2CMateOnline_ID=395,
		C2SGetHistoryChat_ID=401,
		S2CGetHistoryChat_ID=402,
		S2CNewChatMsg_ID=403,
		C2SSendChatMsg_ID=404,
		S2CSendChatMsg_ID=405,
		S2CDelHistoryChat_ID=408,
		C2SWhisper_ID=411,
		S2CWhisper_ID=412,
		C2SGetWhisper_ID=413,
		S2CGetWhisper_ID=414,
		S2CAllUnreadWhisper_ID=415,
		C2SGetOnlineStatus_ID=416,
		S2CGetOnlineStatus_ID=417,
		C2SRemoveWhisper_ID=418,
		S2CRemoveWhisper_ID=419,
		C2SChangeNick_ID=420,
		S2CChangeNick_ID=421,
		S2CNewAtMsg_ID=422,
		C2SGetShopMallTypeList_ID=428,
		S2CGetShopMallTypeList_ID=429,
		C2SGetShopMallList_ID=430,
		S2CGetShopMallList_ID=431,
		C2SShopBuy_ID=432,
		S2CShopBuy_ID=433,
		C2SGetGoodsLimit_ID=438,
		S2CGetGoodsLimit_ID=439,
		C2SMailList_ID=440,
		S2CMailList_ID=441,
		C2SGetMailAttach_ID=444,
		S2CGetMailAttach_ID=445,
		S2CNewMail_ID=446,
		C2SReadMail_ID=448,
		S2CReadMail_ID=449,
		S2CQuizAsk_ID=450,
		C2SAnswerQuiz_ID=451,
		S2CAnswerQuiz_ID=452,
		S2CQuizSum_ID=453,
		S2CQuizRank_ID=454,
		S2CQuizFirst_ID=455,
		S2CQuizStart_ID=456,
		C2SDelMail_ID=457,
		S2CDelMail_ID=458,
		S2CWestExp_ID=460,
		C2SGetProtectPlayer_ID=461,
		S2CGetProtectPlayer_ID=462,
		C2SGetWestExp_ID=463,
		S2CGetWestExp_ID=464,
		C2SQuickFinishWestExp_ID=465,
		S2CQuickFinishWestExp_ID=466,
		S2CFinishWestExp_ID=467,
		C2SGetWestPrize_ID=468,
		S2CGetWestPrize_ID=469,
		C2SGetRobbedList_ID=470,
		S2CGetRobbedList_ID=471,
		C2SSendRevenge_ID=472,
		S2CSendRevenge_ID=473,
		C2SStartWestExp_ID=474,
		S2CStartWestExp_ID=475,
		C2SSendRob_ID=476,
		S2CSendRob_ID=477,
		S2CBeRob_ID=478,
		S2CWestExpStart_ID=480,
		S2CNewProtectPlayer_ID=481,
		S2CEndProtectPlayer_ID=482,
		C2SWestPray_ID=483,
		S2CWestPray_ID=484,
		S2CWestPlayerPray_ID=485,
		C2SExtendEquipBag_ID=490,
		S2CExtendEquipBag_ID=491,
		C2SBagEquipBreak_ID=492,
		S2CBagEquipBreak_ID=493,
		C2SUserBag_ID=500,
		S2CUserBag_ID=501,
		C2SExtendBag_ID=504,
		S2CExtendBag_ID=505,
		C2SExchange_ID=502,
		S2CExchange_ID=503,
		C2SWearEquip_ID=506,
		S2CWearEquip_ID=507,
		C2SMeltEquip_ID=508,
		S2CMeltEquip_ID=509,
		C2SOpenTreasure_ID=510,
		S2COpenTreasure_ID=511,
		C2SAutoMelt_ID=512,
		S2CAutoMelt_ID=513,
		C2SBatchExchange_ID=514,
		S2CBatchExchange_ID=515,
		S2CBagChange_ID=520,
		C2SGetBattlePrize_ID=523,
		ItemFly_ID=524,
		C2SWearOneEquip_ID=525,
		S2CWearOneEquip_ID=526,
		C2SItemStick_ID=527,
		S2CItemStick_ID=528,
		C2SGoldBag_ID=530,
		S2CGoldBag_ID=531,
		C2SGetGoldBagInfo_ID=532,
		S2CGetGoldBagInfo_ID=533,
		C2SMeltRecord_ID=534,
		S2CMeltRecord_ID=535,
		C2SMeltSetting_ID=536,
		S2CMeltSetting_ID=537,
		C2SRemItemNew_ID=538,
		S2CRemItemNew_ID=539,
		S2CClientDb_ID=540,
		C2SClinetSet_ID=541,
		S2CClinetSet_ID=542,
		C2SCurrencyExchange_ID=545,
		S2CCurrencyExchange_ID=546,
		C2SItemSell_ID=547,
		S2CItemSell_ID=548,
		S2CEquipPosInfo_ID=550,
		C2SEquipSteel_ID=551,
		S2CEquipSteel_ID=552,
		C2SEquipStarGive_ID=553,
		S2CEquipStarGive_ID=554,
		C2SEquipStrength_ID=555,
		S2CEquipStrength_ID=556,
		C2SEquipStrengthOneKey_ID=557,
		S2CEquipStrengthOneKey_ID=558,
		C2SEquipStrengthSuit_ID=559,
		S2CEquipStrengthSuit_ID=560,
		C2SEquipForge_ID=561,
		S2CEquipForge_ID=562,
		C2SEquipStoneWearChange_ID=563,
		S2CEquipStoneWearChange_ID=564,
		C2SEquipStoneStickChange_ID=565,
		S2CEquipStoneStickChange_ID=566,
		C2SEquipStoneStick_ID=567,
		S2CEquipStoneStick_ID=568,
		C2SEquipRiseStar_ID=569,
		S2CEquipRiseStar_ID=570,
		C2SEquipOneKeyRiseStar_ID=571,
		S2CEquipOneKeyRiseStar_ID=572,
		C2SEquipBuild_ID=573,
		S2CEquipBuild_ID=574,
		S2CAutoMeltGain_ID=575,
		C2SEquipOneKeyRiseStarRobot_ID=576,
		S2CEquipOneKeyRiseStarRobot_ID=577,
		C2SEquipForgeLevel_ID=578,
		S2CEquipForgeLevel_ID=579,
		C2SEquipForgeOpen_ID=580,
		C2SGetBossGoodDrop_ID=599,
		S2CGetBossGoodDrop_ID=600,
		S2CBossPersonalInfo_ID=601,
		C2SBossPersonalFight_ID=602,
		S2CBossPersonalFight_ID=603,
		C2SBossPersonalSweep_ID=604,
		S2CBossPersonalSweep_ID=605,
		S2CInstanceMaterialInfo_ID=606,
		C2SInstanceMaterialFight_ID=607,
		S2CInstanceMaterialFight_ID=608,
		C2SInstanceMaterialSweep_ID=609,
		S2CInstanceMaterialSweep_ID=610,
		S2CInstanceTreasureInfo_ID=611,
		C2SInstanceTreasureFight_ID=612,
		S2CInstanceTreasureFight_ID=613,
		C2SInstanceTreasureSweep_ID=614,
		S2CInstanceTreasureSweep_ID=615,
		C2SGetInstanceTreasureBox_ID=616,
		S2CGetInstanceTreasureBox_ID=617,
		S2CInstanceHeavenlyInfo_ID=618,
		C2SInstanceHeavenlyFight_ID=619,
		S2CInstanceHeavenlyFight_ID=620,
		C2SInstanceHeavenlySweep_ID=621,
		S2CInstanceHeavenlySweep_ID=622,
		C2SGetInstanceHeavenlyBox_ID=623,
		S2CGetInstanceHeavenlyBox_ID=624,
		S2CInstanceTowerInfo_ID=625,
		C2SInstanceTowerFight_ID=626,
		S2CInstanceTowerFight_ID=627,
		S2CBossVipInfo_ID=661,
		C2SBossVipStart_ID=662,
		S2CBossVipStart_ID=663,
		C2SBossVipSweep_ID=664,
		S2CBossVipSweep_ID=665,
		S2CBossHillData_ID=671,
		C2SBossHillFight_ID=672,
		S2CBossHillFight_ID=673,
		C2SBossHillReplace_ID=674,
		S2CBossHillReplace_ID=675,
		C2SBossHillOpen_ID=676,
		S2CBossHillOpen_ID=677,
		S2CInstanceDemonInfo_ID=684,
		C2SInstanceDemonFight_ID=685,
		S2CInstanceDemonFight_ID=686,
		C2SInstanceDemonSweep_ID=687,
		S2CInstanceDemonSweep_ID=688,
		C2SGetInstanceDemonBox_ID=689,
		S2CGetInstanceDemonBox_ID=690,
		C2SGetTaskPrize_ID=703,
		S2CGetTaskPrize_ID=704,
		S2CLastDayRemain_ID=710,
		C2SLifeFind_ID=711,
		S2CLifeFind_ID=712,
		C2SGetHistoryTaskPrize_ID=713,
		S2CGetHistoryTaskPrize_ID=714,
		C2SPeaceFinish_ID=715,
		S2CPeaceFinish_ID=716,
		C2SLifeFastFind_ID=717,
		S2CLifeFastFind_ID=718,
		C2SWorldLevel_ID=719,
		S2CSMMonster_ID=720,
		C2SSMFight_ID=721,
		S2CSMFight_ID=722,
		C2SSMRefreshStar_ID=723,
		S2CSMRefreshStar_ID=724,
		C2SSMFastFinish_ID=725,
		S2CSMFastFinish_ID=726,
		C2SSignPrize_ID=730,
		S2CSignPrize_ID=731,
		C2SRobotCompleteTask_ID=734,
		S2CRobotCompleteTask_ID=735,
		C2SHistoryTaskInfo_ID=740,
		S2CHistoryTaskInfo_ID=741,
		C2SGetAllPartnerByType_ID=799,
		S2CGetAllPartnerByType_ID=800,
		C2SPartnerLevelUp_ID=801,
		S2CPartnerLevelUp_ID=802,
		C2SPartnerStarUp_ID=803,
		S2CPartnerStarUp_ID=804,
		C2SPartnerBattlePos_ID=805,
		S2CPartnerBattlePos_ID=806,
		C2SPartnerRefreshSkill_ID=807,
		S2CPartnerRefreshSkill_ID=808,
		C2SPartnerReplaceSkill_ID=809,
		S2CPartnerReplaceSkill_ID=810,
		C2SPartnerNick_ID=811,
		S2CPartnerNick_ID=812,
		C2SPartnerSuit_ID=813,
		S2CPartnerSuit_ID=814,
		C2SUnlockNewPartner_ID=815,
		S2CUnlockNewPartner_ID=816,
		C2SPartnerGradeUp_ID=817,
		S2CPartnerGradeUp_ID=818,
		C2SStickPartner_ID=819,
		S2CStickPartner_ID=820,
		C2SPartnerSuitRobot_ID=822,
		S2CUserDevil_ID=841,
		C2SDevilAwake_ID=842,
		S2CDevilAwake_ID=843,
		C2SDevilLevelUp_ID=844,
		S2CDevilLevelUp_ID=845,
		C2SDevilPos_ID=846,
		S2CDevilPos_ID=847,
		C2SPartnerDelSkill_ID=860,
		S2CPartnerDelSkill_ID=861,
		C2SPartnerUpSkill_ID=862,
		S2CPartnerUpSkill_ID=863,
		S2CPartnerNewSkill_ID=864,
		C2SPartnerBattlePosRobot_ID=895,
		C2SGetPartner_ID=896,
		S2CGetPartner_ID=897,
		C2SAllRank_ID=900,
		S2CAllRank_ID=901,
		S2CTeamFightStateChange_ID=906,
		S2CServerTime_ID=1001,
		S2CServerAge_ID=1002,
		C2SJJCList_ID=1101,
		S2CJJCList_ID=1102,
		C2SJJCFight_ID=1103,
		S2CJJCFight_ID=1104,
		C2SJJCBuyTimes_ID=1105,
		S2CJJCBuyTimes_ID=1106,
		C2SJJCGetBuyInfo_ID=1107,
		S2CJJCGetBuyInfo_ID=1108,
		C2SJJCSweep_ID=1109,
		S2CJJCSweep_ID=1110,
		C2SMultiBossInfo_ID=1130,
		S2CMultiBossInfo_ID=1111,
		C2SMultiBossStart_ID=1112,
		S2CMultiBossStart_ID=1113,
		C2SMultiBossCfg_ID=1114,
		C2SMultiBossInspire_ID=1115,
		S2CMultiBossInspire_ID=1116,
		C2SMultiBossGetBuyInfo_ID=1117,
		S2CMultiBossGetBuyInfo_ID=1118,
		C2SMultiBossBuyTimes_ID=1119,
		S2CMultiBossBuyTimes_ID=1120,
		C2SMultiBossGetDamageLog_ID=1121,
		S2CMultiBossGetDamageLog_ID=1122,
		C2SMultiBossJoinScene_ID=1123,
		S2CMultiBossJoinScene_ID=1124,
		C2SMultiBossPlayerInBoss_ID=1125,
		S2CMultiBossPlayerInBoss_ID=1126,
		C2SMultiBossLeaveScene_ID=1127,
		S2CMultiBossLeaveScene_ID=1128,
		S2CMultiBossGetMyDamage_ID=1129,
		C2SBossInspire_ID=1150,
		S2CBossInspire_ID=1151,
		J2SUserLogin_ID=1200,
		J2SUserLogout_ID=1201,
		S2JUserState_ID=1202,
		J2SStartLogin_ID=1203,
		C2SIntoSoulGradeUp_ID=1351,
		S2CIntoSoulGradeUp_ID=1352,
		C2SGodEquipAwake_ID=1353,
		S2CGodEquipAwake_ID=1354,
		C2SGodForge_ID=1355,
		S2CGodForge_ID=1356,
		C2SGodForgeSave_ID=1357,
		S2CGodForgeSave_ID=1358,
		C2SGodEquipMelt_ID=1359,
		S2CGodEquipMelt_ID=1360,
		C2SCreatePrecious_ID=1401,
		S2CCreatePrecious_ID=1402,
		C2SMeltPrecious_ID=1403,
		S2CMeltPrecious_ID=1404,
		C2SWearPrecious_ID=1405,
		S2CWearPrecious_ID=1406,
		C2SLockPrecious_ID=1407,
		S2CLockPrecious_ID=1408,
		C2SGetPreciousPos_ID=1409,
		S2CGetPreciousPos_ID=1410,
		C2SPreciousForge_ID=1411,
		S2CPreciousForge_ID=1412,
		C2SPreciousEat_ID=1413,
		S2CPreciousEat_ID=1414,
		C2SPreciousSoul_ID=1415,
		S2CPreciousSoul_ID=1416,
		C2SPreciousSoulUp_ID=1417,
		S2CPreciousSoulUp_ID=1418,
		C2SPreciousGive_ID=1419,
		S2CPreciousGive_ID=1420,
		C2SCreatePreciousFast_ID=1421,
		S2CCreatePreciousFast_ID=1422,
		C2SPreciousRobot_ID=1423,
		S2CPreciousRobot_ID=1424,
		C2SReviveLife_ID=1501,
		S2CReviveLife_ID=1502,
		C2SJoinActive_ID=1507,
		S2CJoinActive_ID=1508,
		C2SLeaveActive_ID=1509,
		S2CLeaveActive_ID=1510,
		C2SActTeamRecruit_ID=1515,
		S2CActTeamRecruit_ID=1516,
		C2STreatPlayer_ID=1518,
		S2CTreatPlayer_ID=1519,
		S2CTreatData_ID=1520,
		C2SActCreateTeam_ID=1527,
		S2CActCreateTeam_ID=1528,
		C2SActFindTeams_ID=1529,
		S2CActFindTeams_ID=1530,
		C2SActJoinTeam_ID=1531,
		S2CActJoinTeam_ID=1532,
		C2SActFindTeam_ID=1533,
		S2CActFindTeam_ID=1534,
		ActTeamInfo_ID=1535,
		ActTeamMemInfo_ID=1536,
		C2SActNeedFightVal_ID=1537,
		S2CActNeedFightVal_ID=1538,
		C2SGetActTimestamp_ID=1541,
		S2CGetActTimestamp_ID=1542,
		S2CActStart_ID=1561,
		S2CActOver_ID=1565,
		S2CActIcon_ID=1566,
		S2CActShowWindow_ID=1567,
		ActPreReport_ID=1568,
		S2CActStartPre_ID=1569,
		S2CActOverPre_ID=1570,
		S2CActList_ID=1571,
		C2SActExitTeam_ID=1576,
		S2CActExitTeam_ID=1577,
		C2SGetSendShopList_ID=1601,
		S2CGetSendShopList_ID=1602,
		C2SGetSendShopById_ID=1603,
		S2CGetSendShopById_ID=1604,
		C2SSendShopBuy_ID=1605,
		S2CSendShopBuy_ID=1606,
		C2SSendShopClear_ID=1607,
		S2CSendShopClear_ID=1608,
		C2SSendShopOnSale_ID=1609,
		S2CSendShopOnSale_ID=1610,
		C2SGetMySendShop_ID=1611,
		S2CGetMySendShop_ID=1612,
		C2SSaleLog_ID=1613,
		S2CSaleLog_ID=1614,
		C2SMarkSendShop_ID=1615,
		S2CMarkSendShop_ID=1616,
		C2SGetSendCfg_ID=1627,
		S2CGetSendCfg_ID=1628,
		C2SSendItem_ID=1629,
		S2CSendItem_ID=1630,
		C2SGetSendUserInfo_ID=1631,
		S2CGetSendUserInfo_ID=1632,
		C2SGetDragonLog_ID=1701,
		S2CGetDragonLog_ID=1702,
		C2SStartFightDragon_ID=1703,
		S2CStartFightDragon_ID=1704,
		C2SShowItem_ID=1801,
		S2CShowItem_ID=1802,
		S2CReportShowItem_ID=1803,
		C2SGetShowInfo_ID=1804,
		S2CGetShowInfo_ID=1805,
		S2C81Info_ID=1901,
		C2S81Sweep_ID=1902,
		S2C81Sweep_ID=1903,
		C2S81BuyBox_ID=1904,
		S2C81BuyBox_ID=1905,
		C2SViewInstance81Data_ID=1906,
		S2CViewInstance81Data_ID=1907,
		C2SGodClubSignUp_ID=2101,
		S2CGodClubSignUp_ID=2102,
		C2SGodClubFight_ID=2103,
		S2CGodClubFight_ID=2104,
		C2SGodClubFightReport_ID=2105,
		S2CGodClubFightReport_ID=2106,
		C2SGodClub16_ID=2107,
		S2CGodClub16_ID=2108,
		C2SGodClubStakeInfo_ID=2109,
		S2CGodClubStakeInfo_ID=2110,
		C2SGodClubStake_ID=2111,
		S2CGodClubStake_ID=2112,
		C2SEquipDuJin_ID=2210,
		S2CEquipDuJin_ID=2211,
		C2SEquipJingLian_ID=2212,
		S2CEquipJingLian_ID=2213,
		C2SEquipZhuHun_ID=2214,
		S2CEquipZhuHun_ID=2215,
		C2SEquipZhuHunCancel_ID=2216,
		S2CEquipZhuHunCancel_ID=2217,
		C2STotemUnlock_ID=2300,
		S2CTotemUnlock_ID=2301,
		C2STotemPetChange_ID=2302,
		S2CTotemPetChange_ID=2303,
		C2STotemHelpPetChange_ID=2304,
		S2CTotemHelpPetChange_ID=2305,
		S2CFamilyTotemPetsUpd_ID=2306,
		C2STotemPetAutoChange_ID=2307,
		S2CTotemPetAutoChange_ID=2308,
		C2STotemPetPassiveNotice_ID=2309,
		S2CTotemPetPassiveNoticeStatus_ID=2310,
		S2CTotemPetPassiveNotice_ID=2311,
		C2STotemGearUp_ID=2313,
		S2CTotemGearUp_ID=2314,
		C2SGetZF_ID=3001,
		S2CGetZF_ID=3002,
		C2SZFPetUp_ID=3003,
		S2CZFPetUp_ID=3004,
		C2SZFState_ID=3005,
		S2CZFState_ID=3006,
		C2SFuncOpen_ID=3101,
		S2CFuncOpen_ID=3102,
		C2SRobotZF_ID=3103,
		C2SZFUnlock_ID=3104,
		S2CZFUnlock_ID=3105,
		C2SSwordSoulEquip_ID=3201,
		S2CSwordSoulEquip_ID=3202,
		C2SSwordSoulLvUp_ID=3203,
		S2CSwordSoulLvUp_ID=3204,
		C2SSwordSoulResolve_ID=3205,
		S2CSwordSoulResolve_ID=3206,
		C2SSwordSoulHeCheng_ID=3207,
		S2CSwordSoulHeCheng_ID=3208,
		C2SSwordSoulStarUp_ID=3209,
		S2CSwordSoulStarUp_ID=3210,
		C2SSwordSoulStarDown_ID=3211,
		S2CSwordSoulStarDown_ID=3212,
		C2SSwordSoulStrength_ID=3213,
		S2CSwordSoulStrength_ID=3214,
		C2SSwordSoulResolveQuality_ID=3215,
		S2CSwordSoulResolveQuality_ID=3216,
		C2SSwordZhenActive_ID=3217,
		S2CSwordZhenActive_ID=3218,
		C2SSwordZhenStar_ID=3219,
		S2CSwordZhenStar_ID=3220,
		S2CSwordZhenData_ID=3221,
		C2SSwordSoulDisassemble_ID=3222,
		S2CSwordSoulDisassemble_ID=3223,
		C2SSwordZhenGradeUp_ID=3224,
		S2CSwordZhenGradeUp_ID=3225,
		C2SItemLianHua_ID=3300,
		S2CItemLianHua_ID=3301,
		C2SListLianHua_ID=3302,
		S2CListLianHua_ID=3303,
		S2CUserPhotoBook_ID=4101,
		C2SPhotoBookLevelUp_ID=4102,
		S2CPhotoBookLevelUp_ID=4103,
		C2SPhotoBookDel_ID=4104,
		S2CPhotoBookDel_ID=4105,
		C2SPhotoBookPrize_ID=4106,
		S2CPhotoBookPrize_ID=4107,
		C2SPhotoBookStrength_ID=4108,
		S2CPhotoBookStrength_ID=4109,
		C2SGetTeamList_ID=8101,
		S2CGetTeamList_ID=8102,
		C2SGetMemberList_ID=8103,
		S2CGetMemberList_ID=8104,
		C2SJoinInstance_ID=8108,
		S2CJoinInstance_ID=8109,
		C2SLeaveInstance_ID=8110,
		S2CLeaveInstance_ID=8111,
		C2SKillInstance_ID=8112,
		S2CKillInstance_ID=8113,
		C2SStartInstance_ID=8114,
		S2CStartInstance_ID=8115,
		C2SLeaveInstanceCopy_ID=8118,
		S2CLeaveInstanceCopy_ID=8119,
		C2SGoldTree_ID=8201,
		S2CGoldTree_ID=8202,
		C2SGetGoldTreeInfo_ID=8203,
		S2CGetGoldTreeInfo_ID=8204,
		S2CAllActivity_ID=8300,
		S2CActivityStart_ID=8301,
		S2CActivityEnd_ID=8302,
		S2CActivityInit_ID=8303,
		S2CActivityRedPoint_ID=8304,
		S2CActivityData_ID=8305,
		S2CActivityIcon_ID=8306,
		S2CContinueRechargeTaskNum_ID=8307,
		C2SActivityFreeTag_ID=8308,
		S2CActivityFreeTag_ID=8309,
		C2SGetActRechargeTurntabInfo_ID=8310,
		S2CGetActRechargeTurntabInfo_ID=8311,
		C2SActRechargeTurntabItem_ID=8312,
		S2CActRechargeTurntabItem_ID=8313,
		C2SActRechargeTurntabReward_ID=8314,
		S2CActRechargeTurntabReward_ID=8315,
		C2SGetRechargeTurntabLog_ID=8316,
		S2CGetRechargeTurntabLog_ID=8317,
		C2SBuyDrawItem_ID=11001,
		S2CBuyDrawItem_ID=11002,
		C2SDraw_ID=11003,
		S2CDraw_ID=11004,
		C2SGetDrawLog_ID=11005,
		S2CGetDrawLog_ID=11006,
		C2SGetDrawData_ID=11007,
		S2CGetDrawData_ID=11008,
		C2SPlayerDrawData_ID=11009,
		S2CPlayerDrawData_ID=11010,
		C2SGetDrawListRate_ID=11011,
		S2CGetDrawListRate_ID=11012,
		C2SGetActTurntabInfo_ID=11021,
		S2CGetActTurntabInfo_ID=11022,
		C2SGetActTurntabData_ID=11023,
		S2CGetActTurntabData_ID=11024,
		C2SActTurntabDraw_ID=11025,
		S2CActTurntabDraw_ID=11026,
		C2SGeTurntabDrawLog_ID=11027,
		S2CGetTurntabDrawLog_ID=11028,
		C2SActXunBaoJump_ID=11029,
		S2CActXunBaoJump_ID=11030,
		C2SGetActXunBaoInfo_ID=11031,
		S2CGetActXunBaoInfo_ID=11032,
		C2SGetActXunBaoData_ID=11033,
		S2CGetActXunBaoData_ID=11034,
		C2SActXunBaoDraw_ID=11035,
		S2CActXunBaoDraw_ID=11036,
		C2SGetXunBaoLog_ID=11037,
		S2CGetXunBaoLog_ID=11038,
		C2SActXunBaoScoreDraw_ID=11039,
		S2CActXunBaoScoreDraw_ID=11040,
		C2SActXunBaoAllTake_ID=11041,
		S2CActXunBaoAllTake_ID=11042,
		C2SGetXunBaoScoreLog_ID=11043,
		S2CGetXunBaoScoreLog_ID=11044,
		C2SGetActXunBaoExchangeData_ID=11045,
		S2CGetActXunBaoExchangeData_ID=11046,
		C2SActXunBaoExchange_ID=11047,
		S2CActXunBaoExchange_ID=11048,
		C2SActXunBaoExchangeFocus_ID=11049,
		S2CActXunBaoExchangeFocus_ID=11050,
		C2SGetScoreXunBaoData_ID=11051,
		S2CGetScoreXunBaoData_ID=11052,
		C2SReceiveActReachReward_ID=11053,
		S2CReceiveActReachReward_ID=11054,
		C2SGetRankPlayerData_ID=11055,
		S2CGetRankPlayerData_ID=11056,
		C2SGetWorshipPlayerData_ID=11057,
		S2CGetWorshipPlayerData_ID=11058,
		C2SActWorship_ID=11059,
		S2CActWorship_ID=11060,
		C2SRecvStepReward_ID=11061,
		S2CRecvStepReward_ID=11062,
		C2SGetWorshipGiftPlayerData_ID=11063,
		S2CGetWorshipGiftPlayerData_ID=11064,
		C2SGetWorshipRecord_ID=11065,
		S2CGetWorshipRecord_ID=11066,
		C2SPlayDice_ID=11067,
		S2CPlayDice_ID=11068,
		C2SDoPlayDice_ID=11069,
		S2CDoPlayDice_ID=11070,
		C2SPlayDiceGift_ID=11071,
		S2CPlayDiceGift_ID=11072,
		C2SReceiveFloorReward_ID=11073,
		S2CReceiveFloorReward_ID=11074,
		C2SRuinsPlayerData_ID=11075,
		S2CRuinsPlayerData_ID=11076,
		C2SSelectGrid_ID=11077,
		S2CSelectGrid_ID=11078,
		C2SGetLeftGird_ID=11079,
		S2CGetLeftGird_ID=11080,
		C2SSelectReward_ID=11081,
		S2CSelectReward_ID=11082,
		C2SFilterRewards_ID=11083,
		S2CFilterRewards_ID=11084,
		S2CUpdateAmount_ID=11086,
		C2SGetWishXunBaoData_ID=11087,
		S2CGetWishXunBaoData_ID=11088,
		C2SGetWishList_ID=11089,
		S2CGetWishList_ID=11090,
		C2SSelectWishReward_ID=11091,
		S2CSelectWishReward_ID=11092,
		C2SGetDragonXunBaoData_ID=11093,
		S2CGetDragonXunBaoData_ID=11094,
		C2SDragonXBBuyTimes_ID=11095,
		S2CDragonXBBuyTimes_ID=11096,
		C2SDragonChangeHotState_ID=11097,
		S2CDragonChangeHotState_ID=11098,
		C2SGetActBossInfo_ID=11101,
		S2CGetActBossInfo_ID=11102,
		C2SFightActBoss_ID=11103,
		S2CFightActBoss_ID=11104,
		C2SGetActBossPrize_ID=11105,
		S2CGetActBossPrize_ID=11106,
		C2SPlayerBossInfo_ID=11107,
		S2CPlayerBossInfo_ID=11108,
		C2SGetWishGiftData_ID=11121,
		S2CGetWishGiftData_ID=11122,
		C2SReceiveWishGift_ID=11123,
		S2CReceiveWishGift_ID=11124,
		C2SGetChargeReturnData_ID=11150,
		S2CGetChargeReturnData_ID=11151,
		C2SPlayerChargeReturnData_ID=11152,
		S2CPlayerChargeReturnData_ID=11153,
		C2SChargeReturn_ID=11154,
		S2CChargeReturn_ID=11155,
		C2SGetChargeReturnLog_ID=11156,
		S2CGetChargeReturnLog_ID=11157,
		C2SChargeReturnReceivePrize_ID=11158,
		S2CChargeReturnReceivePrize_ID=11159,
		C2SGetActDareBossInfo_ID=11201,
		S2CGetActDareBossInfo_ID=11202,
		C2SFightActDareBoss_ID=11203,
		S2CFightActDareBoss_ID=11204,
		C2SGetActDareBossPrize_ID=11205,
		S2CGetActDareBossPrize_ID=11206,
		C2SPlayerDareBossInfo_ID=11207,
		S2CPlayerDareBossInfo_ID=11208,
		C2SPlayerDareState_ID=11209,
		S2CPlayerDareState_ID=11210,
		C2SPlayerDareIsOpen_ID=11211,
		S2CPlayerDareIsOpen_ID=11212,
		C2SGetSignActPlayerData_ID=11301,
		S2CGetSignActPlayerData_ID=11302,
		C2SGetActShopList_ID=12001,
		S2CGetActShopList_ID=12002,
		C2SActShopBuy_ID=12003,
		S2CActShopBuy_ID=12004,
		C2SGetActGiftList_ID=12005,
		S2CGetActGiftList_ID=12006,
		C2SActGiftBuy_ID=12007,
		S2CActGiftBuy_ID=12008,
		C2SGetActGiftNewList_ID=12009,
		S2CGetActGiftNewList_ID=12010,
		C2SActGiftNewReceive_ID=12011,
		S2CActGiftNewReceive_ID=12012,
		C2SActShopHideRed_ID=12013,
		S2CActShopUnionBuy_ID=12014,
		C2SActRechargeShopHideRed_ID=12015,
		C2SGetActLiangYuanState_ID=12021,
		S2CGetActLiangYuanState_ID=12022,
		C2SActLiangYuanReceive_ID=12023,
		S2CActLiangYuanReceive_ID=12024,
		C2SGetActLiangYuanLog_ID=12025,
		S2CGetActLiangYuanLog_ID=12026,
		C2SGetActYiJiTanBaoInfo_ID=12031,
		S2CGetActYiJiTanBaoInfo_ID=12032,
		C2SActYiJiTanBaoDice_ID=12033,
		S2CActYiJiTanBaoDice_ID=12034,
		C2SActYiJiTanBaoGetAllPrize_ID=12035,
		S2CActYiJiTanBaoGetAllPrize_ID=12036,
		C2SGetChargeMallList_ID=12101,
		S2CGetChargeMallList_ID=12102,
		C2SChargeMallBuy_ID=12103,
		S2CChargeMallBuy_ID=12104,
		S2CPayNotify_ID=12105,
		S2CVipService_ID=12106,
		C2SGetActTask_ID=12151,
		S2CGetActTask_ID=12152,
		S2CGetFirstRechargeTask_ID=12153,
		C2SActTaskOneKeyFinish_ID=12154,
		S2CActTaskOneKeyFinish_ID=12155,
		C2SGetGodTowerActTaskDay_ID=12161,
		S2CGetGodTowerActTaskDay_ID=12162,
		C2SGetInvestInfo_ID=12201,
		S2CGetInvestInfo_ID=12202,
		C2SBuyInvest_ID=12203,
		S2CBuyInvest_ID=12204,
		C2SPlayerInvestData_ID=12205,
		S2CPlayerInvestData_ID=12206,
		C2SActInvestHideRed_ID=12207,
		C2SGetActRankInfo_ID=12301,
		S2CGetActRankInfo_ID=12302,
		C2SGetActRankData_ID=12303,
		S2CGetActRankData_ID=12304,
		C2SGetActRankEndData_ID=12305,
		S2CGetActRankEndData_ID=12306,
		C2SGetActRankEndDataN_ID=12307,
		S2CGetActRankEndDataN_ID=12308,
		C2SGetActPicture_ID=12350,
		S2CGetActPicture_ID=12351,
		C2SActPictureLight_ID=12352,
		S2CActPictureLight_ID=12353,
		C2SRedeemCode_ID=12401,
		S2CRedeemCode_ID=12402,
		C2SXuanShangBossInfo_ID=12451,
		S2CXuanShangBossInfo_ID=12452,
		C2SXuanShangBossBuyTimes_ID=12453,
		S2CXuanShangBossBuyTimes_ID=12454,
		C2SXuanShangBossRefresh_ID=12455,
		S2CXuanShangBossRefresh_ID=12456,
		C2SXuanShangBossAccept_ID=12457,
		S2CXuanShangBossAccept_ID=12458,
		C2SXuanShangBossJoinScene_ID=12459,
		S2CXuanShangBossJoinScene_ID=12460,
		C2SXuanShangBossCallHelp_ID=12461,
		S2CXuanShangBossCallHelp_ID=12462,
		C2SXuanShangBossGiveUp_ID=12463,
		S2CXuanShangBossGiveUp_ID=12464,
		S2CXuanShangResult_ID=12465,
		C2SXuanShangBossScoreReward_ID=12466,
		S2CXuanShangBossScoreReward_ID=12467,
		S2CXuanShangMonsterData_ID=12469,
		S2CAllGodItem_ID=13000,
		C2SUnlockGodItem_ID=13001,
		S2CUnlockGodItem_ID=13002,
		C2SGodItemLevelUp_ID=13003,
		S2CGodItemLevelUp_ID=13004,
		C2SGodItemSoulUp_ID=13005,
		S2CGodItemSoulUp_ID=13006,
		C2SGodItemSoul2Up_ID=13007,
		S2CGodItemSoul2Up_ID=13008,
		C2SGodItemSoul2SkillUp_ID=13009,
		S2CGodItemSoul2SkillUp_ID=13010,
		C2SGodItemSoul3Up_ID=13011,
		S2CGodItemSoul3Up_ID=13012,
		C2SGodItemForge_ID=13013,
		S2CGodItemForge_ID=13014,
		C2SGodItemForgeSave_ID=13015,
		S2CGodItemForgeSave_ID=13016,
		C2SGodItemSoul4Up_ID=13017,
		S2CGodItemSoul4Up_ID=13018,
		C2SGodItemStoneUp_ID=13019,
		S2CGodItemStoneUp_ID=13020,
		C2SGodItemStoneCut_ID=13021,
		S2CGodItemStoneCut_ID=13022,
		C2SKingState_ID=14000,
		S2CKingState_ID=14001,
		C2SKingMatch_ID=14002,
		S2CKingMatch_ID=14003,
		C2SKingFight_ID=14004,
		S2CKingFight_ID=14005,
		C2SKingRank_ID=14006,
		S2CKingRank_ID=14007,
		C2SKingPlayer_ID=14010,
		S2CKingPlayer_ID=14011,
		C2SKingBuyTimes_ID=14012,
		S2CKingBuyTimes_ID=14013,
		C2SKingInfo_ID=14014,
		S2CKingInfo_ID=14015,
		C2SKingRespect_ID=14016,
		S2CKingRespect_ID=14017,
		S2CWorldBossRank5_ID=15001,
		S2CActWorldBossSettlement_ID=15002,
		C2SGetWorldBossKillData_ID=15004,
		S2CGetWorldBossKillData_ID=15006,
		S2CBossRefreshTime_ID=15007,
		C2SGetWorldBossRank_ID=15008,
		S2CGetWorldBossRank_ID=15009,
		S2CWorldBossOwner_ID=15010,
		S2CWorldBossReachGoalPrize_ID=15011,
		C2SWorldBossReachGoalGetPrize_ID=15012,
		S2CWorldBossReachGoalGetPrize_ID=15013,
		S2CWorldBossBreakShieldInfo_ID=15014,
		C2SWorldBossStakePoints_ID=15015,
		S2CWorldBossStakePoints_ID=15016,
		S2CWorldBossLevel_ID=15017,
		S2CWorldBossEnd_ID=15018,
		S2CWorldBossCloseScene_ID=15019,
		S2CHomeBossInfo_ID=15030,
		C2SBossHomeJoinScene_ID=15031,
		S2CBossHomeJoinScene_ID=15032,
		C2SBossHomeLeaveScene_ID=15033,
		S2CBossHomeLeaveScene_ID=15034,
		S2CHomeBossDamageRank_ID=15035,
		S2CHomeBossDamageMy_ID=15036,
		S2CHomeBossOwner_ID=15037,
		C2SHomeBossBuyBodyPower_ID=15038,
		S2CHomeBossBodyPower_ID=15039,
		S2CHomeBossTempBagAdd_ID=15040,
		C2SHomeBossReceiveTempBag_ID=15041,
		S2CHomeBossReceiveTempBag_ID=15042,
		C2SBossHomeCfg_ID=15043,
		C2SHomeBossAutoBuy_ID=15044,
		S2CHomeBossAutoBuy_ID=15045,
		S2CHomeBossIfUseBodyPower_ID=15048,
		C2SHomeBossIfUseBodyPower_ID=15049,
		C2SHomeBossGetTempBag_ID=15050,
		S2CHomeBossGetTempBag_ID=15051,
		C2SWordsWear_ID=16001,
		S2CWordsWear_ID=16002,
		C2SWordsStick_ID=16003,
		S2CWordsStick_ID=16004,
		C2SGodHerbEnter_ID=17001,
		S2CGodHerbEnter_ID=17002,
		C2SGodHerbRefresh_ID=17003,
		S2CGodHerbRefresh_ID=17004,
		C2SGodHerbCollect_ID=17005,
		S2CGodHerbCollect_ID=17006,
		C2SGetGodHerbLog_ID=17007,
		S2CGetGodHerbLog_ID=17008,
		S2CRobberyInfo_ID=17101,
		C2SGetRobberyData_ID=17102,
		S2CGetRobberyData_ID=17103,
		C2SRobbery_ID=17104,
		S2CRobbery_ID=17105,
		C2SRobberyLuck_ID=17106,
		S2CRobberyLuck_ID=17107,
		C2SGetRobberyLog_ID=17108,
		S2CGetRobberyLog_ID=17109,
		C2SDevilSoulPos_ID=17202,
		S2CDevilSoulPos_ID=17203,
		C2SDevilSoulLevelUp_ID=17204,
		S2CDevilSoulLevelUp_ID=17205,
		C2SDevilSoulStarUp_ID=17206,
		S2CDevilSoulStarUp_ID=17207,
		C2SDevilSoulDel_ID=17208,
		S2CDevilSoulDel_ID=17209,
		C2SDevilSoulAuto_ID=17210,
		S2CDevilSoulAuto_ID=17211,
		C2SBuyChargeGift_ID=17300,
		S2CBuyChargeGift_ID=17301,
		S2CAllChargeGift_ID=17302,
		C2SAllPet2_ID=18001,
		S2CAllPet2_ID=18002,
		C2SPet2LevelUp_ID=18003,
		S2CPet2LevelUp_ID=18004,
		C2SPet2TalentUp_ID=18005,
		S2CPet2TalentUp_ID=18006,
		C2SPet2GrowUp_ID=18007,
		S2CPet2GrowUp_ID=18008,
		C2SPet2GiveUp_ID=18009,
		S2CPet2GiveUp_ID=18010,
		C2SPet2Lock_ID=18011,
		S2CPet2Lock_ID=18012,
		C2SPet2Compose_ID=18013,
		S2CPet2Compose_ID=18014,
		C2SPet2Reborn_ID=18015,
		S2CPet2Reborn_ID=18016,
		C2SPet2Nick_ID=18017,
		S2CPet2Nick_ID=18018,
		C2SPet2BattlePos_ID=18019,
		S2CPet2BattlePos_ID=18020,
		C2SPet2SkillBook_ID=18021,
		S2CPet2SkillBook_ID=18022,
		C2SPet2Reset_ID=18023,
		S2CPet2Reset_ID=18024,
		C2SBatchPet2GiveUp_ID=18025,
		S2CBatchPet2GiveUp_ID=18026,
		C2SPet2UnDevour_ID=18027,
		S2CPet2UnDevour_ID=18028,
		S2CUnlockNewPet2_ID=18030,
		C2SStickPet2_ID=18031,
		C2SPet2Info_ID=18033,
		S2CPet2Info_ID=18034,
		C2SRemPet2Mark_ID=18035,
		S2CRemPet2Mark_ID=18036,
		C2SPet2Exchange_ID=18039,
		S2CPet2Exchange_ID=18040,
		C2SGetRandSysPet2_ID=18041,
		S2CGetRandSysPet2_ID=18042,
		C2SGetPet2Chip_ID=18043,
		S2CGetPet2Chip_ID=18044,
		C2SPet2RaiseUp_ID=18045,
		S2CPet2RaiseUp_ID=18046,
		C2SPet2SkillLock_ID=18047,
		S2CPet2SkillLock_ID=18048,
		C2SPet2Devour_ID=18049,
		S2CPet2Devour_ID=18050,
		C2SRetrieveSkill_ID=18051,
		S2CRetrieveSkill_ID=18052,
		C2SOneKeyPet2Devour_ID=18053,
		S2COneKeyPet2Devour_ID=18054,
		C2SPetAwaken_ID=18055,
		S2CPetAwaken_ID=18056,
		C2SPetAwakenBack_ID=18057,
		S2CPetAwakenBack_ID=18058,
		C2SPetExchange_ID=18059,
		S2CPetExchange_ID=18060,
		C2SPetAwakenBackPets_ID=18061,
		S2CPetAwakenBackPets_ID=18062,
		C2SPetEvolution_ID=18063,
		S2CPetEvolution_ID=18064,
		C2SPetEquipBuild_ID=18101,
		S2CPetEquipBuild_ID=18102,
		C2SPetEquipStarUp_ID=18103,
		S2CPetEquipStarUp_ID=18104,
		C2SPetEquipQualityUp_ID=18105,
		S2CPetEquipQualityUp_ID=18106,
		C2SPetEquipSmelt_ID=18107,
		S2CPetEquipSmelt_ID=18108,
		C2SPetEquipWear_ID=18109,
		S2CPetEquipWear_ID=18110,
		C2SPetEquipTakeOff_ID=18111,
		S2CPetEquipTakeOff_ID=18112,
		C2SPetEquipOneKeyWear_ID=18113,
		S2CPetEquipOneKeyWear_ID=18114,
		C2SPetEquipOneKeyTakeOff_ID=18115,
		S2CPetEquipOneKeyTakeOff_ID=18116,
		C2SPetEquipExchangeWear_ID=18117,
		S2CPetEquipExchangeWear_ID=18118,
		C2SPetEquipSaveInfo_ID=18119,
		S2CPetEquipSaveInfo_ID=18120,
		C2SPetEquipLock_ID=18121,
		S2CPetEquipLock_ID=18122,
		S2CPetEquipFly_ID=18123,
		C2SSectReName_ID=19001,
		S2CSectReName_ID=19002,
		C2SEditSectNote_ID=19003,
		S2CEditSectNote_ID=19004,
		C2SRecvSectReward_ID=19005,
		S2CRecvSectReward_ID=19006,
		C2SWorship_ID=19007,
		S2CWorship_ID=19008,
		C2STribute_ID=19009,
		S2CTribute_ID=19010,
		C2SSectMembers_ID=19011,
		S2CSectMembers_ID=19012,
		C2SLevelSectSkill_ID=19013,
		S2CLevelSectSkill_ID=19014,
		C2SSectInfo_ID=19015,
		S2CSectInfo_ID=19016,
		C2SJoinSect_ID=19019,
		S2CJoinSect_ID=19020,
		C2SLevelSectSkillMaster_ID=19021,
		S2CLevelSectSkillMaster_ID=19022,
		C2SSectChallengeBoss_ID=19023,
		S2CSectChallengeBoss_ID=19024,
		C2SSectChallengeLeader_ID=19025,
		S2CSectChallengeLeader_ID=19026,
		C2SSectFightReports_ID=19027,
		S2CSectFightReports_ID=19028,
		C2SSectPlayerFightReport_ID=19029,
		S2CSectPlayerFightReport_ID=19030,
		C2SSectLeaderFightRank_ID=19031,
		S2CSectLeaderFightRank_ID=19032,
		C2SSectLeaderFightMyRank_ID=19033,
		S2CSectLeaderFightMyRank_ID=19034,
		C2SSectActStartTime_ID=19035,
		S2CSectActStartTime_ID=19036,
		C2SSectJobRank_ID=19037,
		S2CSectJobRank_ID=19038,
		C2SSectCandidate_ID=19039,
		S2CSectCandidate_ID=19040,
		C2SSectGodAnimalInfo_ID=19041,
		S2CSectGodAnimalInfo_ID=19042,
		C2SSectGodAnimalData_ID=19043,
		S2CSectGodAnimalData_ID=19044,
		C2SChallengeGodAnimal_ID=19045,
		S2CChallengeGodAnimal_ID=19046,
		C2SGodAnimalInvite_ID=19047,
		S2CGodAnimalInvite_ID=19048,
		C2SGodAnimalPassData_ID=19049,
		S2CGodAnimalPassData_ID=19050,
		C2SGodAnimalPassRecord_ID=19051,
		S2CGodAnimalPassRecord_ID=19052,
		C2SSectPrestigeLevelUp_ID=19053,
		S2CSectPrestigeLevelUp_ID=19054,
		C2SSectPrestigeRecv_ID=19055,
		S2CSectPrestigeRecv_ID=19056,
		C2SSectIMSeize_ID=19057,
		S2CSectIMSeize_ID=19058,
		S2CSectIMSeizeReward_ID=19060,
		C2SSectIMGiveUp_ID=19061,
		S2CSectIMGiveUp_ID=19062,
		C2SGetAllIMInfo_ID=19063,
		S2CGetAllIMInfo_ID=19064,
		C2SClearIMFightCD_ID=19065,
		S2CClearIMFightCD_ID=19066,
		C2SSectIMMyPos_ID=19067,
		S2CSectImMyPos_ID=19068,
		S2CSectIMSeizeNotice_ID=19070,
		S2CIMPlayerChange_ID=19072,
		C2SEnterAnimalPark_ID=19073,
		S2CEnterAnimalPark_ID=19074,
		C2SLeaveAnimalPark_ID=19075,
		S2CLeaveAnimalPark_ID=19076,
		C2SSearchPet_ID=19077,
		S2CSearchPet_ID=19078,
		S2CSearchRecord_ID=19079,
		S2CGodAnimalTimestamp_ID=19080,
		S2CCollapseNotice_ID=19082,
		S2CPushAnimalParkBuff_ID=19084,
		C2SAnimalParkGO_ID=19085,
		S2CAnimalParkGO_ID=19086,
		S2CAnimalParkCatch_ID=19088,
		C2SGroupInfo_ID=19089,
		S2CGroupInfo_ID=19090,
		C2SFightBoss_ID=19091,
		S2CFightBoss_ID=19092,
		C2SFightBossClearCD_ID=19093,
		S2CFightBossClearCD_ID=19094,
		S2CAnimalParkCatchTips_ID=19096,
		C2SBestPetRecord_ID=19097,
		S2CBestPetRecord_ID=19098,
		C2SAutoSearch_ID=19099,
		S2CAutoSearch_ID=19100,
		C2SSectSetSymbolId_ID=19101,
		S2CSectSetSymbolId_ID=19102,
		C2SSectMembersInfo_ID=19103,
		S2CSectMembersInfo_ID=19104,
		C2SSectMembers2_ID=19105,
		S2CSectMembers2_ID=19106,
		C2SEnterCrossPasture_ID=19201,
		S2CEnterCrossPasture_ID=19202,
		C2SLeaveCrossPasture_ID=19203,
		S2CLeaveCrossPasture_ID=19204,
		C2SUseTrap_ID=19205,
		S2CUseTrap_ID=19206,
		C2SCatchCrossPet_ID=19207,
		S2CCatchCrossPet_ID=19208,
		C2SFightSectCrossBoss_ID=19209,
		S2CFightSectCrossBoss_ID=19210,
		C2SSectCrossBossRank_ID=19211,
		S2CSectCrossBossRank_ID=19212,
		C2SSectCrossBossBox_ID=19213,
		S2CSectCrossBossBox_ID=19214,
		C2SOpenBoxTimestamp_ID=19215,
		S2COpenBoxTimestamp_ID=19216,
		S2CCrossPastureTrapList_ID=19218,
		C2SSectCrossFightPVP_ID=19219,
		S2CSectCrossFightPVP_ID=19220,
		C2SReceiveBoxReward_ID=19221,
		S2CReceiveBoxReward_ID=19222,
		C2SCatchRecord_ID=19223,
		S2CCatchRecord_ID=19224,
		S2CDelExpireTraps_ID=19226,
		C2SFightBossTimes_ID=19227,
		S2CFightBossTimes_ID=19228,
		S2CSectCrossSeizePets_ID=19230,
		C2SPickUpPetStart_ID=19231,
		S2CPickUpPetStart_ID=19232,
		C2SPickUpPetEnd_ID=19233,
		S2CPickUpPetEnd_ID=19234,
		C2SSeizePetChoice_ID=19235,
		S2CSeizePetChoice_ID=19236,
		S2CSeizePetCanChoice_ID=19238,
		C2SAutoCatch_ID=19239,
		S2CAutoCatch_ID=19240,
		C2SSeizeRecord_ID=19241,
		S2CSeizeRecord_ID=19242,
		S2CTrapPet_ID=19244,
		S2CPlayerProgressBar_ID=19246,
		C2SFightCrossBossClearCD_ID=19247,
		S2CFightCrossBossClearCD_ID=19248,
		C2SProgressBarBreak_ID=19249,
		S2CProgressBarBreak_ID=19250,
		C2SFamilyInfo_ID=20001,
		S2CFamilyInfo_ID=20002,
		C2SFamilyList_ID=20003,
		S2CFamilyList_ID=20004,
		C2SFamilyCreate_ID=20005,
		S2CFamilyCreate_ID=20006,
		C2SFamilyJoin_ID=20007,
		S2CFamilyJoin_ID=20008,
		C2SFamilyLeave_ID=20009,
		S2CFamilyLeave_ID=20010,
		C2SFamilyDel_ID=20011,
		S2CFamilyDel_ID=20012,
		C2SFamilyChangePos_ID=20013,
		S2CFamilyChangePos_ID=20014,
		C2SFamilyAccuse_ID=20015,
		S2CFamilyAccuse_ID=20016,
		C2SFamilyLevelPrizeInfo_ID=20017,
		S2CFamilyLevelPrizeInfo_ID=20018,
		C2SFamilyGetLevelPrize_ID=20019,
		S2CFamilyGetLevelPrize_ID=20020,
		C2SFamilyDonate_ID=20021,
		S2CFamilyDonate_ID=20022,
		S2CFamilyGetOut_ID=20023,
		C2SApplyJoin_ID=20024,
		S2CApplyJoin_ID=20025,
		C2SAgreeJoin_ID=20026,
		S2CAgreeJoin_ID=20027,
		C2SFamilyChangeName_ID=20028,
		S2CFamilyChangeName_ID=20029,
		C2SFamilyChangeSymbol_ID=20030,
		S2CFamilyChangeSymbol_ID=20031,
		C2SFamilyChangeAutoAgree_ID=20032,
		S2CFamilyChangeAutoAgree_ID=20033,
		C2SFamilyChangeHalo_ID=20034,
		S2CFamilyChangeHalo_ID=20035,
		C2SFamilyConfirmHalo_ID=20036,
		S2CFamilyConfirmHalo_ID=20037,
		C2SFamilyDonateRemainTimes_ID=20038,
		S2CFamilyDonateRemainTimes_ID=20039,
		S2CRedState_ID=21001,
		S2CPlayerRealm_ID=22001,
		C2SOpenRealmSystem_ID=22002,
		S2COpenRealmSystem_ID=22003,
		C2SRealmOverfulfil_ID=22004,
		S2CRealmOverfulfil_ID=22005,
		C2SGetRealmPrizeInfo_ID=22006,
		S2CGetRealmPrizeInfo_ID=22007,
		C2SGetRealmTargetPrize_ID=22008,
		S2CGetRealmTargetPrize_ID=22009,
		C2SGetRealmDayPrize_ID=22010,
		S2CGetRealmDayPrize_ID=22011,
		C2SRealmTask_ID=22012,
		S2CRealmTask_ID=22013,
		C2SRebornUp_ID=22101,
		S2CRebornUp_ID=22102,
		C2SRebornPill_ID=22103,
		S2CRebornPill_ID=22104,
		C2SRebornPillStick_ID=22105,
		S2CRebornPillStick_ID=22106,
		C2SAFKGetBuyInfo_ID=22151,
		S2CAFKGetBuyInfo_ID=22152,
		C2SAFKBuyTimes_ID=22153,
		S2CAFKBuyTimes_ID=22154,
		C2SGetAFKPrize_ID=22155,
		S2CGetAFKPrize_ID=22156,
		C2SDrugUse_ID=22201,
		S2CDrugUse_ID=22202,
		C2SDrugStick_ID=22203,
		S2CDrugStick_ID=22204,
		C2SPlayerGoldDrugGradeUp_ID=22251,
		S2CPlayerGoldDrugGradeUp_ID=22252,
		C2SPlayerGetAllGoldDrug_ID=22253,
		S2CPlayerGetAllGoldDrug_ID=22254,
		S2CSignData_ID=22301,
		C2SSign_ID=22302,
		S2CSign_ID=22303,
		C2SMakeUpSign_ID=22304,
		S2CMakeUpSign_ID=22305,
		C2STotalSignPrize_ID=22306,
		S2CTotalSignPrize_ID=22307,
		C2SSignSecond_ID=22308,
		C2SWeekCardDayPrize_ID=22401,
		S2CWeekCardDayPrize_ID=22402,
		C2SMonthCardDayPrize_ID=22403,
		S2CMonthCardDayPrize_ID=22404,
		C2SLifeCardDayPrize_ID=22405,
		S2CLifeCardDayPrize_ID=22406,
		C2SOpenCard_ID=22407,
		C2SFairyTreasureEnter_ID=22501,
		S2CFairyTreasureEnter_ID=22502,
		C2SFairyTreasureLeave_ID=22503,
		S2CFairyTreasureLeave_ID=22504,
		C2SGetDigTreasurePoint_ID=22505,
		S2CGetDigTreasurePoint_ID=22506,
		C2SDigTreasure_ID=22507,
		S2CDigTreasure_ID=22508,
		C2SGetDigTreasureLog_ID=22509,
		S2CGetDigTreasureLog_ID=22510,
		C2SDigTreasureFight_ID=22511,
		S2CDigTreasureFight_ID=22512,
		C2SDigTreasure10Times_ID=22513,
		S2CDigTreasure10Times_ID=22514,
		C2SClimbingTowerEnter_ID=22571,
		S2CClimbingTowerEnter_ID=22572,
		C2SClimbingTowerLeave_ID=22573,
		S2CClimbingTowerLeave_ID=22574,
		C2SClimbingTowerFight_ID=22575,
		S2CClimbingTowerFight_ID=22576,
		C2SClimbingTowerNextLayer_ID=22577,
		S2CClimbingTowerNextLayer_ID=22578,
		C2SClimbingTowerGetSepPrize_ID=22579,
		S2CClimbingTowerGetSepPrize_ID=22580,
		C2SClimbingTowerGetSwordSoulDayPrize_ID=22581,
		S2CClimbingTowerGetSwordSoulDayPrize_ID=22582,
		C2SClimbingTowerGetSwordSoulCircle_ID=22583,
		S2CClimbingTowerGetSwordSoulCircle_ID=22584,
		C2SClimbingTowerGetSwordSoulCircleEnd_ID=22585,
		S2CSendMarryInfo_ID=22600,
		C2SWeddingSeeking_ID=22601,
		S2CWeddingSeeking_ID=22602,
		C2SPostWeddingTie_ID=22607,
		S2CPostWeddingTie_ID=22608,
		C2SPropose_ID=22609,
		S2CPropose_ID=22610,
		S2CProposeNotify_ID=22611,
		S2CProposeGift_ID=22612,
		C2SDivorce_ID=22613,
		S2CDivorce_ID=22614,
		C2SWeddingRoomGearUp_ID=22615,
		C2SWeddingRoomLevelUp_ID=22617,
		S2CWeddingRoom_ID=22618,
		C2SWeddingRingGearUp_ID=22619,
		C2SWeddingRingGMLevelUp_ID=22621,
		C2SWeddingRingLevelUp_ID=22623,
		C2SWeddingRingSkillLevelUp_ID=22625,
		S2CWeddingRing_ID=22626,
		C2SWeddingInsInvite_ID=22627,
		S2CWeddingInsInvite_ID=22628,
		C2SWeddingInsFight_ID=22629,
		C2SWeddingInsInviteAck_ID=22631,
		S2CWeddingInsInviteAck_ID=22632,
		C2SWeddingRoomData_ID=22633,
		C2SWeddingRingData_ID=22635,
		C2SWeddingMsg_ID=22636,
		S2CWeddingMsg_ID=22637,
		C2SGetWeddingTask_ID=22638,
		S2CGetWeddingTask_ID=22639,
		C2SWeddingInsReport_ID=22640,
		S2CWeddingInsReport_ID=22641,
		C2STargetWeddingRingData_ID=22642,
		S2CTargetWeddingRing_ID=22643,
		S2CPartnerOnline_ID=22345,
		C2SWeddingIntimacy_ID=22346,
		C2SWeddingIntimacyLevelUp_ID=22348,
		C2SWeddingIntimacyReward_ID=22350,
		S2CWeddingIntimacy_ID=22351,
		C2SAllWeddingToken_ID=22352,
		S2CAllWeddingToken_ID=22353,
		C2SWeddingTokenGearUp_ID=22354,
		C2SWeddingTokenBuffUp_ID=22355,
		C2SWeddingTokenLevelUp_ID=22356,
		C2SWeddingTokenSkillLevelUp_ID=22358,
		S2CWeddingToken_ID=22359,
		C2SOneKeyWeddingIns_ID=22360,
		S2COneKeyWeddingIns_ID=22361,
		C2SUserPetA_ID=22701,
		S2CUserPetA_ID=22702,
		C2SGetPetAInfo_ID=22703,
		S2CGetPetAInfo_ID=22704,
		C2SUnlockNewPetA_ID=22705,
		S2CUnlockNewPetA_ID=22706,
		C2SPetABattlePos_ID=22707,
		S2CPetABattlePos_ID=22708,
		C2SPetALevelUp_ID=22709,
		S2CPetALevelUp_ID=22710,
		C2SPetAStarUp_ID=22711,
		S2CPetAStarUp_ID=22712,
		C2SGetPetAMergeInfo_ID=22730,
		S2CGetPetAMergeInfo_ID=22731,
		C2SGetPetAMergeFv_ID=22732,
		S2CGetPetAMergeFv_ID=22733,
		C2SPetAMergeUp_ID=22734,
		S2CPetAMergeUp_ID=22735,
		C2SPetAMergeActive_ID=22736,
		S2CPetAMergeActive_ID=22737,
		C2SRoleTalentUp_ID=22801,
		S2CRoleTalentUp_ID=22802,
		C2SRoleBodyUp_ID=22803,
		S2CRoleBodyUp_ID=22804,
		C2SGetDrugBase_ID=22851,
		S2CGetDrugBase_ID=22852,
		C2SDrugBaseEat_ID=22853,
		S2CDrugBaseEat_ID=22854,
		C2SAladdinLampUnlock_ID=22901,
		S2CAladdinLampUnlock_ID=22902,
		C2SAladdinLampStoneUse_ID=22903,
		S2CAladdinLampStoneUse_ID=22904,
		C2SAladdinLampStoneUpLevel_ID=22905,
		S2CAladdinLampStoneUpLevel_ID=22906,
		C2SAladdinLampWish_ID=22907,
		S2CAladdinLampWish_ID=22908,
		S2CChangeBaoWuTask_ID=22909,
		C2SReceiveBaoWuPrize_ID=22910,
		C2SOneKeyReceiveBaoWuPrize_ID=22912,
		S2COneKeyReceiveBaoWuPrize_ID=22913,
		C2SAladdinLampInfo_ID=22914,
		S2CAladdinLampInfo_ID=22915,
		C2SOtherBaoWuTask_ID=22919,
		S2COtherBaoWuTask_ID=22920,
		C2SInstanceMaterialInfo_ID=23001,
		C2SInsMatePurchase_ID=23003,
		S2CInsMatePurchase_ID=23004,
		C2SInstanceSLInfo_ID=23011,
		S2CInstanceSLInfo_ID=23012,
		C2SInstanceSLFight_ID=23013,
		S2CInstanceSLFight_ID=23014,
		C2SInstanceSLSweep_ID=23015,
		S2CInstanceSLSweep_ID=23016,
		C2SInsSLPurchase_ID=23017,
		S2CInsSLPurchase_ID=23018,
		C2SEnterSLFB_ID=23019,
		S2CEnterSLFB_ID=23020,
		C2SLeaveSLFB_ID=23021,
		S2CLeaveSLFB_ID=23022,
		C2SInsSLInspire_ID=23023,
		S2CInsSLInspire_ID=23024,
		C2SInstanceSLAutoFight_ID=23025,
		S2CInstanceSLAutoFight_ID=23026,
		C2SPlayerPractice_ID=23101,
		S2CPlayerPractice_ID=23102,
		C2SPracticeLevelUp_ID=23103,
		S2CPracticeLevelUp_ID=23104,
		C2SLastDayPracticeRemain_ID=23105,
		S2CLastDayPracticeRemain_ID=23106,
		C2SDayPracticeFind_ID=23107,
		S2CDayPracticeFind_ID=23108,
		C2SDayPracticeFastFind_ID=23109,
		S2CDayPracticeFastFind_ID=23110,
		C2SLastDayResourceRemain_ID=23111,
		S2CLastDayResourceRemain_ID=23112,
		C2SResourceFind_ID=23113,
		S2CResourceFind_ID=23114,
		C2SResourceFastFind_ID=23115,
		S2CResourceFastFind_ID=23116,
		S2CJXSCStageChange_ID=23202,
		C2SJXSCSignUp_ID=23203,
		S2CJXSCSignUp_ID=23204,
		C2SJXSCSkinChange_ID=23205,
		S2CJXSCSkinChange_ID=23206,
		C2SJXSCJoinNextLayer_ID=23207,
		S2CJXSCJoinNextLayer_ID=23208,
		C2SJXSCLeaveScene_ID=23209,
		S2CJXSCLeaveScene_ID=23210,
		C2SJXSCOpenBox_ID=23213,
		S2CJXSCOpenBox_ID=23214,
		C2SJXSCKeyNum_ID=23215,
		S2CJXSCKeyNum_ID=23216,
		C2SJXSCMyScore_ID=23217,
		S2CJXSCMyScore_ID=23218,
		S2CNearbyTarget_ID=23220,
		C2SJXSCSignUpInterval_ID=23223,
		S2CJXSCSignUpInterval_ID=23224,
		C2SJXSCReentry_ID=23226,
		S2CBusinessData_ID=23301,
		C2SGetBusinessData_ID=23302,
		C2SContinueBusiness_ID=23303,
		S2CContinueBusiness_ID=23304,
		C2SStartBusiness_ID=23305,
		S2CStartBusiness_ID=23306,
		C2SFastBusiness_ID=23307,
		S2CFastBusiness_ID=23308,
		S2CBusinessSurprise_ID=23309,
		S2CBusinessEnd_ID=23310,
		C2SGetBusinessPrize_ID=23311,
		S2CGetBusinessPrize_ID=23312,
		C2SMedalUp_ID=23401,
		S2CMedalUp_ID=23402,
		C2SMedalGetPrize_ID=23403,
		S2CMedalGetPrize_ID=23404,
		C2SGuardBuy_ID=23420,
		S2CGuardBuy_ID=23421,
		S2CGuardOverTime_ID=23422,
		C2SGetTitleGiftList_ID=23501,
		S2CGetTitleGiftList_ID=23502,
		C2SReceiveTitleGift_ID=23503,
		S2CReceiveTitleGift_ID=23504,
		C2SReceiveFirstRechargeGift_ID=23601,
		S2CReceiveFirstRechargeGift_ID=23602,
		C2SReceiveFirstRechargeInvestGift_ID=23603,
		S2CReceiveFirstRechargeInvestGift_ID=23604,
		C2SReceiveTotalRechargeGift_ID=23605,
		S2CReceiveTotalRechargeGift_ID=23606,
		C2SWarriorGoldChange_ID=23701,
		S2CWarriorGoldChange_ID=23702,
		S2CWarriorGCSingleData_ID=23703,
		S2CWarriorGoldChangeGetInfo_ID=23704,
		C2SWarriorGCUnlock_ID=23705,
		S2CWarriorGCUnlock_ID=23706,
		C2SSkinsExtUnlock_ID=23711,
		S2CSkinsExtUnlock_ID=23712,
		C2SSkinsExtLev_ID=23713,
		S2CSkinsExtLev_ID=23714,
		S2CSkinsExtSingleData_ID=23715,
		S2CSkinsExtAllData_ID=23716,
		C2SGodSkillSelect_ID=23717,
		S2CGodSkillSelect_ID=23718,
		C2SAnyRedPoint_ID=24001,
		C2SSetAttrInt_ID=24101,
		S2CGetActLimitTimeFight_ID=24201,
		C2SGetActPrize_ID=24202,
		S2CGetActPrize_ID=24203,
		S2CSeekingDragonInfo_ID=24301,
		C2SSeekingDragonRoll_ID=24302,
		S2CSeekingDragonRoll_ID=24303,
		C2SSeekingDragonTemBag_ID=24304,
		S2CSeekingDragonTemBag_ID=24305,
		C2SSeekingDragonPrize_ID=24306,
		S2CSeekingDragonPrize_ID=24307,
		C2SSeekingDragonTemBagList_ID=24308,
		S2CSeekingDragonTemBagList_ID=24309,
		C2SSeekingDragonCheckRed_ID=24310,
		S2CSeekingDragonEventOpen_ID=24311,
		C2SSeekingDragonGetAllTimeEvent_ID=24312,
		S2CSeekingDragonGetAllTimeEvent_ID=24313,
		C2SSeekingDragonEventAction_ID=24314,
		S2CSeekingDragonEventAction_ID=24315,
		C2SSeekingDragonGetEventLog_ID=24316,
		S2CSeekingDragonGetEventLog_ID=24317,
		C2SSeekingDragonRecEventReward_ID=24318,
		S2CSeekingDragonRecEventReward_ID=24319,
		S2CTeamInstanceData_ID=24401,
		C2STeamInstanceMatching_ID=24402,
		S2CTeamInstanceMatching_ID=24403,
		C2STeamInstanceStartFight_ID=24404,
		C2STeamInstanceGetReport_ID=24405,
		S2CTeamInstanceGetReport_ID=24406,
		C2STeamInstanceBuyTimes_ID=24407,
		S2CTeamInstanceBuyTimes_ID=24408,
		C2STeamInstanceSweep_ID=24409,
		S2CTeamInstanceSweep_ID=24410,
		C2STurnTabGearPrize_ID=24411,
		S2CTurnTabGearPrize_ID=24412,
		C2STurnTabGearPrizeState_ID=24413,
		S2CTurnTabGearPrizeState_ID=24414,
		C2SZeroBuyGiftReturnPlan_ID=24421,
		S2CZeroBuyGiftReturnPlan_ID=24422,
		C2SGetZeroBuyReturnMoney_ID=24423,
		S2CGetZeroBuyReturnMoney_ID=24424,
		S2CDirectGift_ID=24501,
		C2SGetDirectGiftPrize_ID=24502,
		S2CGetDirectGiftPrize_ID=24503,
		S2CSecretMallList_ID=24601,
		C2SSecretMallBuy_ID=24602,
		S2CSecretMallBuy_ID=24603,
		C2SSecretMallRefresh_ID=24604,
		S2CSecretMallRefresh_ID=24605,
		C2SSecretMallOpen_ID=24606,
		C2SRefreshTimeShop_ID=24621,
		S2CRefreshTimeShop_ID=24622,
		C2STimeShopGift_ID=24623,
		S2CTimeShopGift_ID=24624,
		C2SGetTimeShopGiftPrize_ID=24625,
		S2CGetTimeShopGiftPrize_ID=24626,
		C2SRefreshMoonlightBox_ID=24627,
		S2CRefreshMoonlightBox_ID=24628,
		C2SMoonlightBoxGift_ID=24629,
		S2CMoonlightBoxGift_ID=24630,
		C2SGetMoonlightBoxGiftPrize_ID=24631,
		S2CGetMoonlightBoxGiftPrize_ID=24632,
		C2SGetLimitFightData_ID=24701,
		S2CGetLimitFightData_ID=24702,
		C2SChallengeLimitFight_ID=24703,
		S2CChallengeLimitFight_ID=24704,
		C2SRecLimitFightReward_ID=24705,
		S2CRecLimitFightReward_ID=24706,
		C2SRecLimitFightSpeedReward_ID=24707,
		S2CRecLimitFightSpeedReward_ID=24708,
		C2SLimitFightRank_ID=24709,
		S2CLimitFightRank_ID=24710,
		C2SLimitFightSectRank_ID=24711,
		S2CLimitFightSectRank_ID=24712,
		C2SLimitFightBuyTimes_ID=24713,
		S2CLimitFightBuyTimes_ID=24714,
		C2SLimitFightBuyInfo_ID=24715,
		S2CLimitFightBuyInfo_ID=24716,
		S2CLimitFightUpdateTimes_ID=24717,
		S2CActScore_ID=25001,
		S2CSpecialLoginTips_ID=25102,
		S2CActLuckOpen_ID=25150,
		C2SActLuckEnter_ID=25151,
		S2CActLuckEnter_ID=25152,
		C2SActLuckFight_ID=25153,
		S2CActLuckFight_ID=25154,
		C2SActLuckLeave_ID=25155,
		S2CActLuckLeave_ID=25156,
		C2SNBAState_ID=25198,
		S2CNBAState_ID=25199,
		C2SNBASign_ID=25200,
		S2CNBASign_ID=25201,
		C2SNBASignCount_ID=25202,
		S2CNBASignCount_ID=25203,
		C2SNBALastWin_ID=25204,
		S2CNBALastWin_ID=25205,
		C2SNBAFrame_ID=25206,
		S2CNBAFrame_ID=25207,
		C2SNBAFinalData_ID=25208,
		S2CNBAFinalData_ID=25209,
		C2SNBAGuess_ID=25210,
		S2CNBAGuess_ID=25211,
		C2SNBAMatch_ID=25212,
		S2CNBAMatch_ID=25213,
		S2CNBAMatchResult_ID=25214,
		S2CNBAPreScore_ID=25215,
		C2SNBAFinalFightEnd_ID=25216,
		S2CNBAFinalDataOnPreEnd_ID=25217,
		S2CNBAPreStart_ID=25218,
		S2CNBAFinalEnd_ID=25219,
		C2SNBABuyAuto_ID=25220,
		S2CNBABuyAuto_ID=25221,
		C2SGetNBAFightReport_ID=25222,
		S2CGetNBAFightReport_ID=25223,
		C2SYiJiInfo_ID=25301,
		S2CYiJiInfo_ID=25302,
		C2SYiJiScoreRank_ID=25313,
		S2CYiJiScoreRank_ID=25314,
		C2SYiJiJoinScene_ID=25315,
		S2CYiJiJoinScene_ID=25316,
		C2SYiJiLeaveScene_ID=25317,
		S2CYiJiLeaveScene_ID=25318,
		C2SYiJiNearbyEnemyPlayer_ID=25319,
		S2CYiJiNearbyEnemyPlayer_ID=25320,
		C2SYiJiDamageRank_ID=25321,
		S2CYiJiDamageRank_ID=25322,
		S2CYiJiOwnerPlayer_ID=25324,
		C2SYiJiGiveUpOwner_ID=25325,
		S2CYiJiGiveUpOwner_ID=25326,
		C2SYiJiCallHelp_ID=25327,
		S2CYiJiCallHelp_ID=25328,
		S2CYiJiFlyPrize_ID=25330,
		S2CYiJiActEnd_ID=25332,
		C2SGetEntrustWallList_ID=25351,
		S2CGetEntrustWallList_ID=25352,
		C2SGetMyEntrustList_ID=25353,
		S2CGetMyEntrustList_ID=25354,
		C2SEntrustToWall_ID=25355,
		S2CEntrustToWall_ID=25356,
		C2SReceiveEntrust_ID=25357,
		S2CReceiveEntrust_ID=25358,
		C2SCancelEntrust_ID=25359,
		S2CCancelEntrust_ID=25360,
		C2SEntrustInfo_ID=25361,
		S2CEntrustInfo_ID=25362,
		C2SEntrustRed_ID=25363,
		S2CEntrustRed_ID=25364,
		C2SPlayerXZXS_ID=25401,
		S2CPlayerXZXS_ID=25402,
		C2SXZXSRefreshTask_ID=25403,
		S2CXZXSRefreshTask_ID=25404,
		C2SXZXSStartTask_ID=25405,
		S2CXZXSStartTask_ID=25406,
		C2SXZXSGetAllCanStartTask_ID=25407,
		S2CXZXSGetAllCanStartTask_ID=25408,
		C2SXZXSOneKeyStartTask_ID=25409,
		S2CXZXSOneKeyStartTask_ID=25410,
		C2SXZXSGetTaskPrize_ID=25411,
		S2CXZXSGetTaskPrize_ID=25412,
		C2SXZXSGetHelpPartnerList_ID=25413,
		S2CXZXSGetHelpPartnerList_ID=25414,
		C2SXZXSHelpPartnerSave_ID=25415,
		S2CXZXSHelpPartnerSave_ID=25416,
		C2SXZXSGetOthHelpPartnerList_ID=25417,
		S2CXZXSGetOthHelpPartnerList_ID=25418,
		C2SGetCityWarData_ID=25501,
		S2CCityWarData_ID=25502,
		C2SGetCityWarChooseItem_ID=25503,
		S2CGetCityWarChooseItem_ID=25504,
		C2SCityWarKillRank_ID=25505,
		S2CCityWarKillRank_ID=25506,
		C2SCityWarChoose_ID=25507,
		S2CCityWarChoose_ID=25508,
		S2CCityWarMapData_ID=25509,
		S2CCityWarMyScore_ID=25510,
		S2CCityWarCrystal_ID=25511,
		C2SCityWarOpenBox_ID=25512,
		S2CCityWarOpenBox_ID=25513,
		C2SCityWarGive_ID=25514,
		S2CCityWarGive_ID=25515,
		C2SCityWarCleanPVPCd_ID=25516,
		S2CCityWarCleanPVPCd_ID=25517,
		S2CCityWarWinner_ID=25518,
		S2CCityWarChooseChange_ID=25519,
		S2CCityWarDead_ID=25520,
		S2CCityWarCrystalDamange_ID=25521,
		C2SCityWarPrepareOpenBox_ID=25522,
		S2CCityWarPrepareOpenBox_ID=25523,
		C2SGetSectWarData_ID=25550,
		S2CSectWarData_ID=25551,
		C2SGetSectWarLeaderInfo_ID=25552,
		S2CSectWarLeaderInfo_ID=25553,
		C2SSectWarScoreRank_ID=25554,
		S2CSectWarScoreRank_ID=25555,
		S2CSectWarMapData_ID=25556,
		S2CSectWarMyScore_ID=25557,
		C2SSectWarOpenBox_ID=25558,
		S2CSectWarOpenBox_ID=25559,
		C2SSectWarCleanPVPCd_ID=25560,
		S2CSectWarCleanPVPCd_ID=25561,
		S2CSectWarWinner_ID=25562,
		S2CSectWarChooseChange_ID=25563,
		S2CSectWarDead_ID=25564,
		C2SSectWarGetScorePrize_ID=25565,
		S2CSectWarGetScorePrize_ID=25566,
		C2SSectWarGetRankPrize_ID=25567,
		S2CSectWarGetRankPrize_ID=25568,
		S2CSectWarWarrior_ID=25569,
		C2SSectWarGetCityPrize_ID=25570,
		S2CSectWarGetCityPrize_ID=25571,
		S2CSectWarDieMostPlayer_ID=25572,
		C2SGetSectWarLastWinLeader_ID=25573,
		S2CGetSectWarLastWinLeader_ID=25574,
		C2SPraiseSectWarLastWinLeader_ID=25575,
		S2CPraiseSectWarLastWinLeader_ID=25576,
		S2CSectWarAutoPrize_ID=25577,
		C2SActTheme2Lucky_ID=25601,
		S2CActTheme2Lucky_ID=25602,
		C2SActTheme2Do_ID=25603,
		S2CActTheme2Do_ID=25604,
		C2STheme2TreasuryState_ID=25605,
		S2CTheme2TreasuryState_ID=25606,
		C2SActTheme3Data_ID=25607,
		S2CActTheme3Data_ID=25608,
		C2SActTheme3TaskFastFinish_ID=25609,
		S2CActTheme3TaskFastFinish_ID=25610,
		C2SGoodsChecked_ID=25611,
		S2CGoodsChecked_ID=25612,
		C2SActRushRankGive_ID=25651,
		S2CActRushRankGive_ID=25652,
		C2SActGetReceiveUserList_ID=25653,
		S2CActGetReceiveUserList_ID=25654,
		C2SActGetGiveLogList_ID=25655,
		S2CActGetGiveLogList_ID=25656,
		C2SIllusionData_ID=25701,
		S2CIllusionData_ID=25702,
		C2SIllusionChapterData_ID=25703,
		S2CIllusionChapterData_ID=25704,
		C2SIllusionTeamList_ID=25705,
		S2CIllusionTeamList_ID=25706,
		C2SIllusionMyTeam_ID=25707,
		S2CIllusionMyTeam_ID=25708,
		C2SIllusionCreateTeam_ID=25709,
		S2CIllusionCreateTeam_ID=25710,
		C2SIllusionJoinTeam_ID=25711,
		S2CIllusionJoinTeam_ID=25712,
		C2SIllusionTeamInvite_ID=25713,
		S2CIllusionTeamInvite_ID=25714,
		S2CIllusionTeamBeInvited_ID=25715,
		C2SIllusionTeamBeInvited_ID=25716,
		C2SIllusionExitTeam_ID=25717,
		S2CIllusionExitTeam_ID=25718,
		C2SIllusionDelTeam_ID=25719,
		S2CIllusionDelTeam_ID=25720,
		C2SIllusionFight_ID=25721,
		S2CIllusionFight_ID=25722,
		C2SIllusionSweep_ID=25723,
		S2CIllusionSweep_ID=25724,
		C2SGetIllusionCanInviteList_ID=25725,
		S2CGetIllusionCanInviteList_ID=25726,
		C2SIllusionShout_ID=25727,
		S2CIllusionShout_ID=25728,
		S2CReportIllusionShout_ID=25729,
		C2SIllusionTeamSetFV_ID=25731,
		S2CIllusionTeamSetFV_ID=25732,
		C2SIllusionTeamNextCheckPoint_ID=25733,
		S2CIllusionTeamNextCheckPoint_ID=25734,
		C2SIllusionTeamReFight_ID=25735,
		S2CIllusionTeamReFight_ID=25736,
		C2SGetIllusionsByTabId_ID=25737,
		S2CGetIllusionsByTabId_ID=25738,
		C2SIllusionSweepByTabId_ID=25739,
		S2CIllusionSweepByTabId_ID=25740,
		C2SCommonShout_ID=25751,
		S2CCommonShout_ID=25752,
		S2CReportCommonShout_ID=25753,
		C2SBeasts_ID=25795,
		S2CBeasts_ID=25796,
		C2SUnlockBeast_ID=25797,
		C2SWearBeast_ID=25799,
		C2SOneKeyWearBeastEquip_ID=25801,
		C2SWearBeastEquip_ID=25802,
		C2SOneKeyStrengthenBeastEquip_ID=25803,
		C2SStarUpBeastEquip_ID=25804,
		C2SSkillLevelUp_ID=25805,
		S2CSavageBeast_ID=25806,
		S2CStarUpBeast_ID=25807,
		S2CWearBeast_ID=25808,
		S2CBeastAwaken_ID=25809,
		C2SBeastStar_ID=25810,
		S2CBeastStar_ID=25811,
		C2SGetPassCheckData_ID=25901,
		S2CGetPassCheckData_ID=25902,
		C2SPassCheckBuyLevel_ID=25903,
		S2CPassCheckBuyLevel_ID=25904,
		C2SPassCheckGetPrize_ID=25905,
		S2CPassCheckGetPrize_ID=25906,
		C2SPassCheckGetExpBox_ID=25907,
		S2CPassCheckGetExpBox_ID=25908,
		C2SGetRechargeGearData_ID=25950,
		S2CGetRechargeGearData_ID=25951,
		C2SRechargeGearDraw_ID=25952,
		S2CRechargeGearDraw_ID=25953,
		C2STRGearDraw_ID=25961,
		S2CTRGearDraw_ID=25962,
		C2SGetTRGearInfo_ID=25963,
		S2CGetTRGearInfo_ID=25964,
		C2STRGearSelectItem_ID=25965,
		S2CTRGearSelectItem_ID=25966,
		C2SXunBaoSelectItem_ID=25967,
		S2CXunBaoSelectItem_ID=25968,
		C2SGetSectHonorPlayer_ID=26001,
		S2CGetSectHonorPlayer_ID=26002,
		C2SSectHonorPraise_ID=26003,
		S2CSectHonorPraise_ID=26004,
		C2SSectHonorMandate_ID=26005,
		S2CSectHonorMandate_ID=26006,
		C2SSectHonorMandatePlayerList_ID=26007,
		S2CSectHonorMandatePlayerList_ID=26008,
		C2SSectHonorGetPrize_ID=26009,
		S2CSectHonorGetPrize_ID=26010,
		S2CChangeXldEntrustData_ID=26101,
		C2SGetXldEntrustList_ID=26103,
		S2CGetXldEntrustList_ID=26104,
		C2SXldEntrust_ID=26105,
		S2CXldEntrust_ID=26106,
		C2SResponseXldEntrust_ID=26107,
		S2CResponseXldEntrust_ID=26108,
		C2SXLDBossInfo_ID=26201,
		S2CXLDBossInfo_ID=26202,
		C2SXLDBossFight_ID=26203,
		S2CXLDBossFight_ID=26204,
		C2SXLDBossSweep_ID=26205,
		S2CXLDBossSweep_ID=26206,
		C2SXLDBossPurchase_ID=26207,
		S2CXLDBossPurchase_ID=26208,
		S2CXsdBossInfo_ID=26232,
		C2SXsdBossJoinScene_ID=26233,
		S2CXsdBossJoinScene_ID=26234,
		C2SXsdBossLeaveScene_ID=26235,
		S2CXsdBossLeaveScene_ID=26236,
		S2CXsdBossDamageRank_ID=26238,
		S2CXsdBossDamageMy_ID=26240,
		C2SXsdBossCfg_ID=26241,
		C2SXsdBossPurchase_ID=26243,
		S2CXsdBossPurchase_ID=26244,
		C2SXsdCollect_ID=26245,
		S2CXsdCollect_ID=26246,
		S2CAutoPushGift_ID=26301,
		C2SPushGiftShopBuy_ID=26302,
		S2CPushGiftShopBuy_ID=26303,
		C2SGetDropItems_ID=26401,
		S2CGetDropItems_ID=26402,
		C2SGetFuncEquipData_ID=26901,
		S2CGetFuncEquipData_ID=26902,
		C2SGetAllEquipData_ID=27001,
		S2CGetAllEquipData_ID=27002,
		C2SGetEquipData_ID=27003,
		S2CGetEquipData_ID=27004,
		C2SOneKeyEquipWear_ID=27005,
		S2COneKeyEquipWear_ID=27006,
		C2SEquipWear_ID=27007,
		S2CEquipWear_ID=27008,
		C2SOneKeyEquipStrengthS_ID=27009,
		S2COneKeyEquipStrengthS_ID=27010,
		C2SEquipStrengthS_ID=27011,
		S2CEquipStrengthS_ID=27012,
		C2SStrengthMaster_ID=27013,
		S2CStrengthMaster_ID=27014,
		C2SOneKeyMosaicWear_ID=27015,
		S2COneKeyMosaicWear_ID=27016,
		C2SOneKeyMosaicChange_ID=27017,
		S2COneKeyMosaicChange_ID=27018,
		C2SOneKeyMosaicUpLev_ID=27019,
		S2COneKeyMosaicUpLev_ID=27020,
		C2SEquipStars_ID=27021,
		S2CEquipStars_ID=27022,
		C2SEquipCompose_ID=27023,
		S2CEquipCompose_ID=27024,
		C2SEquipUpLev_ID=27025,
		S2CEquipUpLev_ID=27026,
		C2SYanJiaActive_ID=27027,
		S2CYanJiaActive_ID=27028,
		C2SYanJiaCoreActive_ID=27029,
		S2CYanJiaCoreActive_ID=27030,
		C2SYanJiaCoreLev_ID=27031,
		S2CYanJiaCoreLev_ID=27032,
		C2SYanJiaCoreStar_ID=27033,
		S2CYanJiaCoreStar_ID=27034,
		C2SYanJiaCoreWear_ID=27035,
		S2CYanJiaCoreWear_ID=27036,
		C2SEquipQuality_ID=27037,
		S2CEquipQuality_ID=27038,
		C2SEquipRefine_ID=27039,
		S2CEquipRefine_ID=27040,
		C2SGetYanJiaSoldierSoulData_ID=27041,
		S2CGetYanJiaSoldierSoulData_ID=27042,
		C2SYanJiaSoldierSoulDrug_ID=27043,
		S2CYanJiaSoldierSoulDrug_ID=27044,
		C2SYanJiaSoldierSoulSkillUpLev_ID=27045,
		S2CYanJiaSoldierSoulSkillUpLev_ID=27046,
		C2SBreakType_ID=27050,
		S2CBreakType_ID=27051,
		C2SEquipOneKeyUpLev_ID=27052,
		S2CEquipOneKeyUpLev_ID=27053,
		C2STeams_ID=27101,
		S2CTeams_ID=27102,
		C2STeamInfo_ID=27103,
		S2CTeamInfo_ID=27104,
		C2SCreateTeam_ID=27105,
		S2CCreateTeam_ID=27106,
		C2SJoinTeam_ID=27107,
		S2CJoinTeam_ID=27108,
		C2SInviteTeam_ID=27109,
		S2CInviteTeam_ID=27110,
		C2SLeaveTeam_ID=27111,
		S2CLeaveTeam_ID=27112,
		S2CDisbandTeam_ID=27114,
		C2SKickTeam_ID=27115,
		S2CKickTeam_ID=27116,
		S2CInviteTeamInfo_ID=27118,
		C2SGetCanInvite_ID=27119,
		S2CGetCanInvite_ID=27120,
		C2SEditTeam_ID=27121,
		S2CEditTeam_ID=27122,
		C2SRefuseInvite_ID=27123,
		S2CRefuseInvite_ID=27124,
		C2SEditTeamKey_ID=27125,
		S2CEditTeamKey_ID=27126,
		C2SGetHLBossList_ID=27131,
		S2CGetHLBossList_ID=27132,
		C2SEnterHLFB_ID=27133,
		S2CEnterHLFB_ID=27134,
		C2SLeaveHLFB_ID=27135,
		S2CLeaveHLFB_ID=27136,
		C2SStartFightHLPVE_ID=27137,
		S2CStartFightHLPVE_ID=27138,
		C2SStartFightHLPVP_ID=27139,
		S2CStartFightHLPVP_ID=27140,
		C2SGetHLRankList_ID=27141,
		S2CGetHLRankList_ID=27142,
		C2SReplyPower_ID=27143,
		S2CReplyPower_ID=27144,
		C2SAutoReply_ID=27145,
		S2CAutoReply_ID=27146,
		S2CNoPowerTip_ID=27148,
		C2SHuanLingList_ID=27151,
		S2CHuanLingList_ID=27152,
		C2SHLLevelUp_ID=27153,
		S2CHLLevelUp_ID=27154,
		C2SHLDan_ID=27155,
		S2CHLDan_ID=27156,
		C2SHLSkillLevelUp_ID=27157,
		S2CHLSkillLevelUp_ID=27158,
		C2SHLLWLevelUp_ID=27159,
		S2CHLLWLevelUp_ID=27160,
		C2SHLLWSkillLevelUp_ID=27161,
		S2CHLLWSkillLevelUp_ID=27162,
		C2SHLUnlock_ID=27163,
		S2CHLUnlock_ID=27164,
		C2SHLBattlePos_ID=27165,
		S2CHLBattlePos_ID=27166,
		S2CHLLevelList_ID=27168,
		C2SGetYJFBGuanQiaData_ID=27201,
		S2CGetYJFBGuanQiaData_ID=27202,
		C2SYJFBGuanQiaMove_ID=27203,
		S2CYJFBGuanQiaMove_ID=27204,
		C2SYJFBGuanQiaTriggerEvent_ID=27205,
		S2CYJFBGuanQiaTriggerEvent_ID=27206,
		C2SYJFBSweep_ID=27207,
		S2CYJFBSweep_ID=27208,
		C2SGetYJFBData_ID=27209,
		S2CGetYJFBData_ID=27210,
		C2SYJFBExchangeTiLi_ID=27211,
		S2CYJFBExchangeTiLi_ID=27212,
		S2CYJFBOutQuanQia_ID=27214,
		C2SYJFBAutoUseJuShenDan_ID=27215,
		S2CYJFBAutoUseJuShenDan_ID=27216,
		S2CYJFBFirstPass_ID=27218,
		C2SFeiShengStageUp_ID=27260,
		S2CFeiShengStageUp_ID=27261,
		S2CFaZhengData_ID=27270,
		C2SFaZhengLevelUp_ID=27271,
		S2CFaZhengLevelUp_ID=27272,
		C2SFaZhengStageUp_ID=27273,
		S2CFaZhengStageUp_ID=27274,
		S2CWareHouseAdd_ID=27302,
		C2SWareHouseGetInfo_ID=27303,
		S2CWareHouseGetInfo_ID=27304,
		C2SWareHouseReceiveItem_ID=27305,
		S2CWareHouseReceiveItem_ID=27306,
		C2SWareHousePartReceive_ID=27307,
		S2CWareHousePartReceive_ID=27308,
		S2CFamilyJJCData_ID=27350,
		C2SFamilyJJCAdd_ID=27351,
		S2CFamilyJJCAdd_ID=27352,
		C2SFamilyJJCBuyTimes_ID=27353,
		S2CFamilyJJCBuyTimes_ID=27354,
		C2SFamilyJJCRecieveAward_ID=27355,
		S2CFamilyJJCRecieveAward_ID=27356,
		C2SFamilyJJCJoin_ID=27357,
		S2CFamilyJJCJoin_ID=27358,
		C2SFamilyJJCFight_ID=27359,
		S2CFamilyJJCState_ID=27360,
		C2SFamilyJJCRank_ID=27361,
		S2CFamilyJJCRank_ID=27362,
		S2CFamilyJJCFight_ID=27363,
		C2SFamilyJJCGetBuyInfo_ID=27364,
		S2CFamilyJJCGetBuyInfo_ID=27365,
		C2SGetFamilyJJCData_ID=27366,
		S2CGetFamilyJJCData_ID=27367,
		C2SMiJingBossInfo_ID=27401,
		S2CMiJingBossInfo_ID=27402,
		C2SBossMiJingJoinScene_ID=27403,
		S2CBossMiJingJoinScene_ID=27404,
		C2SBossMiJingLeaveScene_ID=27405,
		S2CBossMiJingLeaveScene_ID=27406,
		C2SMiJingBossDamageRank_ID=27407,
		S2CMiJingBossDamageRank_ID=27408,
		S2CMiJingBossDamageMy_ID=27410,
		S2CMiJingBossOwner_ID=27414,
		C2SBossMiJingAutoFight_ID=27415,
		C2SMiJingBossOpenBox_ID=27417,
		S2CMiJingBossOpenBox_ID=27418,
		C2SMiJingBossBoxInfo_ID=27419,
		S2CMiJingBossBoxInfo_ID=27420,
		C2SMiJingFocusBoss_ID=27421,
		S2CMiJingFocusBoss_ID=27422,
		C2SMiJingBossFocusInfo_ID=27423,
		S2CMiJingBossFocusInfo_ID=27424,
		C2SGetKingEquipData_ID=27501,
		S2CGetKingEquipData_ID=27502,
		C2SOneKeyKingEquipWear_ID=27503,
		S2COneKeyKingEquipWear_ID=27504,
		C2SKingEquipWear_ID=27505,
		S2CKingEquipWear_ID=27506,
		C2SKingSuitHuanHua_ID=27507,
		S2CKingSuitHuanHua_ID=27508,
		C2SKingLifeLev_ID=27509,
		S2CKingLifeLev_ID=27510,
		C2SOneKeyJadeWear_ID=27511,
		S2COneKeyJadeWear_ID=27512,
		C2SKingWingHuanHua_ID=27513,
		S2CKingWingHuanHua_ID=27514,
		C2SKingWingStar_ID=27515,
		S2CKingWingStar_ID=27516,
		C2SKingEquipCompose_ID=27517,
		S2CKingEquipCompose_ID=27518,
		C2SStartHelper_ID=27600,
		S2CStartHelper_ID=27601,
		C2SStopHelper_ID=27602,
		S2CStopHelper_ID=27603,
		C2SGetHelperNext_ID=27604,
		S2CGetHelperNext_ID=27605,
		C2SGetHelperCfg_ID=27606,
		S2CGetHelperCfg_ID=27607,
		C2SGetHelperLog_ID=27608,
		S2CGetHelperLog_ID=27609,
		C2SMpFocusReward_ID=27701,
		S2CMpFocusReward_ID=27702,
		C2SBindPhoneReward_ID=27703,
		S2CBindPhoneReward_ID=27704,
		C2SGetMpFocusInfo_ID=27705,
		S2CGetMpFocusInfo_ID=27706,
		C2SGetBindPhoneInfo_ID=27707,
		S2CGetBindPhoneInfo_ID=27708,
		C2SAuthPoliteGetPrize_ID=27709,
		S2CAuthPoliteGetPrize_ID=27710,
		C2SWorldLevelInfo_ID=27720,
		S2CWorldLevelInfo_ID=27721,
		C2SGetFeedBack_ID=27750,
		S2CGetFeedBack_ID=27751,
		C2SNewFeedBack_ID=27752,
		S2CNewFeedBack_ID=27753,
		C2SReadFeedBack_ID=27754,
		C2SAppRatingState_ID=27755,
		S2CAppRatingState_ID=27756,
		C2SAppRatingGetPrize_ID=27757,
		S2CAppRatingGetPrize_ID=27758,
		C2SAppRatingOp_ID=27759,
		S2CAppRatingOp_ID=27760,
		C2SGetHeroList_ID=27801,
		S2CGetHeroList_ID=27802,
		C2SHeroActive_ID=27803,
		S2CHeroActive_ID=27804,
		C2SHeroIntoBattle_ID=27805,
		S2CHeroIntoBattle_ID=27806,
		C2SHeroLevelUp_ID=27807,
		S2CHeroLevelUp_ID=27808,
		C2SHeroStarUp_ID=27809,
		S2CHeroStarUp_ID=27810,
		C2SHeroGradeLevUp_ID=27811,
		S2CHeroGradeLevUp_ID=27812,
		C2SHeroSkillLevelUp_ID=27813,
		S2CHeroSkillLevelUp_ID=27814,
		C2SGetHeroInfo_ID=27815,
		S2CGetHeroInfo_ID=27816,
		C2SGetHeroBondInfo_ID=27817,
		S2CGetHeroBondInfo_ID=27818,
		C2SHeroBondLevelUp_ID=27819,
		S2CHeroBondLevelUp_ID=27820,
		C2SGetHeroAchiList_ID=27821,
		S2CGetHeroAchiList_ID=27822,
		S2CSendHeroAchi_ID=27823,
		C2SGetHeroAchiPrize_ID=27824,
		S2CGetHeroAchiPrize_ID=27825,
		C2SGetHeroGroupSkill_ID=27826,
		S2CGetHeroGroupSkill_ID=27827,
		C2SHeroGroupSkillLevelUp_ID=27828,
		S2CHeroGroupSkillLevelUp_ID=27829,
		C2SHeroBondSpeLevelUp_ID=27830,
		S2CHeroBondSpeLevelUp_ID=27831,
		C2SHeroSkillInfo_ID=27832,
		S2CHeroSkillInfo_ID=27833,
		C2STtBossActInfo_ID=27901,
		S2CTtBossActInfo_ID=27902,
		S2CTtBossInfo_ID=27904,
		C2STtBossInspire_ID=27905,
		S2CTtBossInspire_ID=27906,
		S2CTtBossFightEndReport_ID=27908,
		C2STtBossTeamDataRank_ID=27909,
		S2CTtBossTeamDataRank_ID=27910,
		S2CTtBossFightBoss_ID=27912,
		S2CTtBossCloseScene_ID=27914,
		S2CTtBossActEnd_ID=27916,
		C2SAuctionInfo_ID=28001,
		S2CAuctionInfo_ID=28002,
		S2CAucGoodsList_ID=28004,
		C2SBidding_ID=28005,
		S2CBidding_ID=28006,
		C2SGetBiddingLog_ID=28007,
		S2CGetBiddingLog_ID=28008,
		C2SAllAucSimData_ID=28009,
		S2CAllAucSimData_ID=28010,
		C2SAuctionBeOvertaken_ID=28011,
		C2SMergeFirstPrize_ID=28101,
		S2CMergeFirstPrize_ID=28102,
		C2SMergeFirstGetPrize_ID=28103,
		S2CMergeFirstGetPrize_ID=28104,
		S2CRandomShopList_ID=28200,
		C2SRandomShopBuy_ID=28201,
		S2CRandomShopBuy_ID=28202,
		C2SRandomShopRefresh_ID=28203,
		S2CRandomShopRefresh_ID=28204,
		C2SRandomShopOpen_ID=28205,
		C2SRandomShopList_ID=28206,
		C2SRandomShopFreeItem_ID=28207,
		S2CRandomShopFreeItem_ID=28208,
		C2SShengHenData_ID=28220,
		C2SShengHenSkillUp_ID=28221,
		S2CShengHenSkillUp_ID=28222,
		C2SShengWuSmelt_ID=28224,
		S2CShengWuSmelt_ID=28225,
		C2SShengHenLevelUp_ID=28226,
		S2CShengHenLevelUp_ID=28227,
		C2SGetAllShengHen_ID=28228,
		S2CGetAllShengHen_ID=28229,
		C2SShenYuHallTopPlayer_ID=28240,
		S2CShenYuHallTopPlayer_ID=28241,
		C2SShenYuHallEnter_ID=28242,
		S2CShenYuHallEnter_ID=28243,
		C2SShenYuHallPray_ID=28244,
		S2CShenYuHallPray_ID=28245,
		C2SShenYuHallBless_ID=28246,
		S2CShenYuHallBless_ID=28247,
		S2CShenYuHallTopList_ID=28249,
		C2SShenYuHallSeasonRank_ID=28250,
		S2CShenYuHallSeasonRank_ID=28251,
		C2SShenYuHallLeave_ID=28252,
		S2CShenYuHallLeave_ID=28253,
		C2SCollectBox_ID=28254,
		S2CCollectBox_ID=28255,
		C2SShenYuHelpReward_ID=28265,
		S2CShenYuHelpReward_ID=28266,
		C2SShenYuHelpGetReward_ID=28267,
		C2SShenYuData_ID=28270,
		S2CShenYuData_ID=28271,
		C2SShenYuFirstJoinAward_ID=28272,
		S2CShenYuFirstJoinAward_ID=28273,
		C2SGuideState_ID=28274,
		S2CGuideState_ID=28275,
		C2SGuideBattle_ID=28276,
		C2SShenYuHallSeasonTop_ID=28277,
		S2CShenYuHallSeasonTop_ID=28278,
		C2SShenYuTriggerEnterMapEvent_ID=28279,
		C2SShenYuSaveTigs_ID=28280,
		S2CShenYuSaveTigs_ID=28281,
		C2SShenYuGetSaveTigs_ID=28282,
		S2CShenYuGetSaveTigs_ID=28283,
		C2SGetSurperVipChannelReward_ID=28300,
		S2CGetSurperVipChannelReward_ID=28301,
		C2SGetSurperVipInfo_ID=28302,
		S2CGetSurperVipInfo_ID=28303,
		C2SGetAccountTransfer_ID=28310,
		S2CGetAccountTransfer_ID=28311,
		C2SGetPrefectWarData_ID=28401,
		S2CGetPrefectWarData_ID=28402,
		C2SGetPrefectWarHireList_ID=28403,
		S2CGetPrefectWarHireList_ID=28404,
		C2SPrefectWarHire_ID=28405,
		S2CPrefectWarHire_ID=28406,
		C2SPrefectWarFight_ID=28407,
		S2CPrefectWarFight_ID=28408,
		C2STeamUnit_ID=28501,
		S2CTeamUnit_ID=28502,
		C2SSetTeamUnit_ID=28503,
		S2CSetTeamUnit_ID=28504,
		C2SGetAlienData_ID=28601,
		S2CGetAlienData_ID=28602,
		C2SAlienLev_ID=28603,
		S2CAlienLev_ID=28604,
		C2SMPOneKeyWear_ID=28607,
		S2CMPOneKeyWear_ID=28608,
		C2SMPOneKeyStrength_ID=28609,
		S2CMPOneKeyStrength_ID=28610,
		C2SMPStrengthMaster_ID=28611,
		S2CMPStrengthMaster_ID=28612,
		C2SMPStar_ID=28613,
		S2CMPStar_ID=28614,
		C2SAlienActive_ID=28615,
		S2CAlienActive_ID=28616,
		C2SAlienIntoBattle_ID=28617,
		S2CAlienIntoBattle_ID=28618,
		S2CRedBag_ID=28662,
		C2SRoleGodSkillActive_ID=28680,
		S2CRoleGodSkillActive_ID=28681,
		C2SJungleHuntData_ID=28701,
		S2CJungleHuntData_ID=28702,
		C2SJungleHuntFight_ID=28703,
		S2CJungleHuntFight_ID=28704,
		C2SJungleHuntTreat_ID=28705,
		S2CJungleHuntTreat_ID=28706,
		C2SJungleHuntReset_ID=28707,
		S2CJungleHuntReset_ID=28708,
		C2SJungleHuntOpenBox_ID=28709,
		S2CJungleHuntOpenBox_ID=28710,
		C2SJungleHuntBlessRefresh_ID=28711,
		S2CJungleHuntBlessRefresh_ID=28712,
		C2SJungleHuntBlessPick_ID=28713,
		S2CJungleHuntBlessPick_ID=28714,
		C2SJungleHuntElvesLeave_ID=28715,
		S2CJungleHuntElvesLeave_ID=28716,
		C2SJungleHuntElvesBuy_ID=28717,
		S2CJungleHuntElvesBuy_ID=28718,
		C2SJungleHuntSweep_ID=28719,
		S2CJungleHuntSweep_ID=28720,
		C2SJungleHuntSetPartnerPos_ID=28721,
		S2CJungleHuntSetPartnerPos_ID=28722,
		C2SJungleHuntBattleArr_ID=28723,
		S2CJungleHuntBattleArr_ID=28724,
		S2COtherInfoSkin_ID=28801,
		C2SOtherInfoGradeInfo_ID=28802,
		S2COtherInfoGradeInfo_ID=28803,
		C2SOtherTotemInfo_ID=28804,
		S2COtherTotemInfo_ID=28805,
		C2SOtherPetAInfo_ID=28806,
		S2COtherPetAInfo_ID=28807,
		C2SOtherKidsInfo_ID=28808,
		S2COtherKidsInfo_ID=28809,
		C2SOtherYanJiaInfo_ID=28810,
		S2COtherYanJiaInfo_ID=28811,
		C2SOtherHeroInfo_ID=28812,
		S2COtherHeroInfo_ID=28813,
		C2SOtherAlienInfo_ID=28814,
		S2COtherAlienInfo_ID=28815,
		C2SOtherBeastInfo_ID=28816,
		S2COtherBeastInfo_ID=28817,
		C2SOtherHuanLingInfo_ID=28818,
		S2COtherHuanLingInfo_ID=28819,
		C2SOtherSwordSoulInfo_ID=28820,
		S2COtherSwordSoulInfo_ID=28821,
		C2SGetQiMenDunJiaData_ID=28901,
		S2CGetQiMenDunJiaData_ID=28902,
		C2SZhenFaHuanHua_ID=28903,
		S2CZhenFaHuanHua_ID=28904,
		C2SZhenFaActive_ID=28905,
		S2CZhenFaActive_ID=28906,
		C2SZhenWeiActive_ID=28907,
		S2CZhenWeiActive_ID=28908,
		C2SZhenFaLevelUp_ID=28911,
		S2CZhenFaLevelUp_ID=28912,
		C2SZhenFaEatDrug_ID=28913,
		S2CZhenFaEatDrug_ID=28914,
		C2SZhenFaStarUp_ID=28915,
		S2CZhenFaStarUp_ID=28916,
		C2SEnterYJYM_ID=29000,
		S2CEnterYJYM_ID=29001,
		C2SLeaveYJYM_ID=29002,
		S2CLeaveYJYM_ID=29003,
		C2SYJFXMatchStage_ID=29100,
		S2CYJFXMatchStage_ID=29101,
		C2SYJFXGetDengJianInfo_ID=29102,
		S2CYJFXGetDengJianInfo_ID=29103,
		C2SYJFXDengJian_ID=29104,
		S2CYJFXDengJian_ID=29105,
		C2SYJFXGetYunGongInfo_ID=29106,
		S2CYJFXGetYunGongInfo_ID=29107,
		C2SYJFXYunGong_ID=29108,
		S2CYJFXYunGong_ID=29109,
		C2SYJFXMatchData_ID=29110,
		S2CYJFXMatchData_ID=29111,
		C2SYJFXMatchBag_ID=29112,
		S2CYJFXMatchBag_ID=29113,
		S2CYJFXMatchBoss_ID=29114,
		C2SYJFXUseItem_ID=29115,
		S2CYJFXUseItem_ID=29116,
		C2SYJFXRank_ID=29118,
		S2CYJFXRank_ID=29119,
		C2SYJFXEnter_ID=29120,
		S2CYJFXEnter_ID=29121,
		C2SYJFXLeave_ID=29122,
		S2CYJFXLeave_ID=29123,
		C2SYJFXGetCanAttackList_ID=29124,
		S2CYJFXGetCanAttackList_ID=29125,
		C2SGetChannelGiftInfo_ID=29200,
		S2CGetChannelGiftInfo_ID=29201,
		C2SGetChannelGiftPrize_ID=29202,
		S2CGetChannelGiftPrize_ID=29203,
		C2SCreateRoleTask_ID=29211,
		S2CCreateRoleTask_ID=29212,
		C2SPhonePBSetting_ID=29221,
		S2CPhonePBSetting_ID=29222,
		C2SGetAllFTList_ID=29300,
		S2CGetAllFTList_ID=29301,
		C2SGetFTInfo_ID=29302,
		S2CGetFTInfo_ID=29303,
		C2SCreateFT_ID=29304,
		S2CCreateFT_ID=29305,
		C2SGetApplyList_ID=29306,
		S2CGetApplyList_ID=29307,
		C2SApplyJoinFT_ID=29308,
		S2CApplyJoinFT_ID=29309,
		C2SAgreeJoinFT_ID=29310,
		S2CAgreeJoinFT_ID=29311,
		C2SDeleteFT_ID=29312,
		S2CDeleteFT_ID=29313,
		C2SChangeLeader_ID=29314,
		S2CChangeFTLeader_ID=29315,
		C2SKickOutFT_ID=29316,
		S2CKickOutFT_ID=29317,
		C2SLeaveFT_ID=29318,
		S2CLeaveFT_ID=29319,
		C2SAccuseLeader_ID=29320,
		S2CAccuseLeader_ID=29321,
		C2SFTChangeName_ID=29322,
		S2CFTChangeName_ID=29323,
		C2SFTChangeAutoAgree_ID=29324,
		S2CFTChangeAutoAgree_ID=29325,
		C2SFTChangeDeclaration_ID=29326,
		S2CFTChangeDeclaration_ID=29327,
		C2SGetFTHaloInfo_ID=29328,
		S2CGetFTHaloInfo_ID=29329,
		C2SGetFTSearch_ID=29330,
		S2CGetFTSearch_ID=29331,
		S2CFTTips_ID=29332,
		C2SShenYuGodActionBuy_ID=29401,
		S2CShenYuGodActionBuy_ID=29402,
		C2SGetFuDaiData_ID=29411,
		S2CGetFuDaiData_ID=29412,
		C2SBuyFuDai_ID=29413,
		S2CBuyFuDai_ID=29414,
		C2SGetNightData_ID=29415,
		S2CGetNightData_ID=29416,
		C2SNightMake_ID=29417,
		S2CNightMake_ID=29418,
		C2SNightRewardLog_ID=29419,
		S2CNightRewardLog_ID=29420,
		C2SSLFallOK_ID=29501,
		S2CSLFallOK_ID=29502,
		C2SSLGetData_ID=29503,
		S2CSLGetData_ID=29504,
		C2SSLLev_ID=29505,
		S2CSLLev_ID=29506,
		C2SSLGrade_ID=29507,
		S2CSLGrade_ID=29508,
		C2SSLLight_ID=29509,
		S2CSLLight_ID=29510,
		C2SSLStar_ID=29511,
		S2CSLStar_ID=29512,
		C2SSLMosaic_ID=29513,
		S2CSLMosaic_ID=29514,
		C2SSLSoulResolve_ID=29515,
		S2CSLSoulResolve_ID=29516,
		C2SSLSoulHeCheng_ID=29517,
		S2CSLSoulHeCheng_ID=29518,
		C2SSLSoulWish_ID=29519,
		S2CSLSoulWish_ID=29520,
		C2SSLCall_ID=29521,
		S2CSLCall_ID=29522,
		C2SSLFightReport_ID=29523,
		S2CSLFightReport_ID=29524,
		C2SQieCuo_ID=29551,
		S2CQieCuo_ID=29552,
		C2SGetQieCuoLog_ID=29553,
		S2CGetQieCuoLog_ID=29554,
		C2SGetQieCuoReport_ID=29555,
		S2CGetQieCuoReport_ID=29556,
		C2SWeiXinShareSuccess_ID=29561,
		C2SFriendHelpDraw_ID=29563,
		S2CFriendHelpDraw_ID=29564,
		C2SFYTZRequestBind_ID=29565,
		S2CFYTZRequestBind_ID=29566,
		S2CFYTZRequestBindO_ID=29567,
		C2SFYTZResponseBind_ID=29569,
		S2CFYTZResponseBind_ID=29570,
		S2CFYTZResponseBindO_ID=29571,
		C2SFYTZUnBind_ID=29573,
		S2CFYTZUnBind_ID=29574,
		C2SFYTZGetBindUserInfo_ID=29575,
		S2CFYTZGetBindUserInfo_ID=29576,
		C2SGetShowUserInfo_ID=29577,
		S2CGetShowUserInfo_ID=29578,
		C2SGetHelpXunBaoData_ID=29579,
		S2CGetHelpXunBaoData_ID=29580,
		C2SBangDanJJSetPartnerPos_ID=29600,
		S2CBangDanJJSetPartnerPos_ID=29601,
		C2SBangDanJJInfo_ID=29602,
		S2CBangDanJJInfo_ID=29603,
		C2SBangDanJJFight_ID=29604,
		C2SBangDanJJRankInfo_ID=29605,
		S2CBangDanJJRankInfo_ID=29606,
		C2SBangDanJJViewFight_ID=29607,
		S2CBangDanJJViewFight_ID=29608,
		S2CBangDanJJFight_ID=29609,
		S2CBangDanJJTimesInfo_ID=29610,
		S2CBangDanJJStateInfo_ID=29611,
		C2SBangDanJJSweep_ID=29612,
		S2CBangDanJJSweep_ID=29613,
		S2NLogin_ID=30001,
		N2SLogout_ID=30002,
		N2SAddTouristTime_ID=30003,
		C2SCrossMessage_ID=50100,
		S2JFightInit_ID=50101,
		J2CFightInit_ID=50102,
		J2FFightStart_ID=50103,
		F2JFightStart_ID=50104,
		J2CYJFightInit_ID=50105,
		J2SSendMail_ID=50151,
		S2PSZCrossServer_ID=50201,
		P2SSZCrossServer_ID=50202,
		S2JSZPrepare_ID=50203,
		J2SSZPrepare_ID=50204,
		S2JSZJoin_ID=50205,
		J2SSZJoin_ID=50206,
		C2JSZBlocks_ID=50207,
		J2CSZBlocks_ID=50208,
		C2JSZOwnBuildings_ID=50209,
		J2CSZOwnBuildings_ID=50210,
		C2JSZOccupyBlock_ID=50211,
		J2CSZOccupyBlock_ID=50212,
		J2CSZLoseBlock_ID=50213,
		C2JSZBuildings_ID=50214,
		J2CSZBuildings_ID=50215,
		C2JSZBuilding_ID=50216,
		J2CSZBuilding_ID=50217,
		C2SSZMine_ID=50218,
		S2JSZMine_ID=50219,
		J2CSZMine_ID=50220,
		J2SSZReward_ID=50222,
		S2JSZReward_ID=50223,
		C2JSZSettlement_ID=50224,
		J2CSZSettlement_ID=50225,
		C2JSZPet_ID=50226,
		J2CSZPet_ID=50227,
		J2CSZUserBag_ID=50228,
		J2CSZBagChange_ID=50229,
		J2CSZNewItem_ID=50230,
		C2JSZRemItemNew_ID=50231,
		J2CSZRemItemNew_ID=50232,
		C2JSZExchange_ID=50233,
		J2CSZExchange_ID=50234,
		S2JSZAddItem_ID=50235,
		J2SSZAddItem_ID=50236,
		C2JSZShenWei_ID=50237,
		J2CSZShenWei_ID=50238,
		J2CSZTask_ID=50239,
		J2CSZTaskChange_ID=50240,
		C2JSZGetTaskPrize_ID=50241,
		J2CSZGetTaskPrize_ID=50242,
		S2JSZTriggerTask_ID=50243,
		J2CSZRelogin_ID=50244,
		J2CSZStrength_ID=50245,
		S2JSZXianzong_ID=50246,
		C2JSZRanking_ID=50247,
		J2CSZRanking_ID=50248,
		C2JSZReadReport_ID=50249,
		S2JSZChat_ID=50250,
		J2CSZChat_ID=50251,
		J2CSZReports_ID=50252,
		C2JSZMap_ID=50253,
		J2CSZMap_ID=50254,
		J2CSZState_ID=50255,
		S2JSZGM_ID=50256,
		C2JSZGetRankingPrize_ID=50257,
		J2CSZGetRankingPrize_ID=50258,
		C2JSZChats_ID=50259,
		J2CSZChats_ID=50260,
		J2CSZBuff_ID=50261,
		J2CSZBuffs_ID=50262,
		J2CSZStateTask_ID=50263,
		J2CSZStateTaskChange_ID=50264,
		C2JSZGetStatePrize_ID=50265,
		J2CSZGetStatePrize_ID=50266,
		J2SSZNotice_ID=50267,
		C2JSZOther_ID=50268,
		J2CSZOther_ID=50269,
		C2JSZDeleteReport_ID=50270,
		C2JSZOtherInfo_ID=50271,
		J2SSZShowOther_ID=50272,
		J2CSZShenShou_ID=50273,
		C2JSZStartDropBuilding_ID=50274,
		J2CSZStartDropBuilding_ID=50275,
		C2JSZStopDropBuilding_ID=50276,
		J2CSZStopDropBuilding_ID=50277,
		C2JSZDropBuilding_ID=50278,
		J2CSZDropBuilding_ID=50279,
		C2JSZZoneEnter_ID=50280,
		J2CSZZoneEnter_ID=50281,
		C2JSZZonePlayers_ID=50282,
		J2CSZZonePlayers_ID=50283,
		C2JSZZoneMove_ID=50284,
		J2CSZZoneMove_ID=50285,
		C2JSZZoneAttack_ID=50286,
		J2CSZZoneAttack_ID=50287,
		J2CSZZonePlayerNumber_ID=50288,
		J2CSZZoneDamageRanking_ID=50289,
		J2CSZZoneDamageRankingChange_ID=50290,
		J2CSZZoneBossOcuppy_ID=50291,
		J2CSZZonePoint_ID=50292,
		J2CSZAnnouncement_ID=50293,
		C2JSZZonePlayerInSiteNumber_ID=50294,
		J2CSZZonePlayerInSiteNumber_ID=50295,
		J2CSZZonePVP_ID=50296,
		J2CSZZoneHp_ID=50297,
		J2CSZZoneBossViolentNotify_ID=50298,
		J2CSZZoneBossViolent_ID=50299,
		C2JSZCampMainCity_ID=50300,
		J2CSZCampMainCity_ID=50301,
		C2JSZMineInfo_ID=50302,
		J2CSZMineInfo_ID=50303,
		C2JSZGetZoneRanking_ID=50330,
		J2CSZGetZoneRanking_ID=50331,
		C2JSZGetZoneRankingPrize_ID=50332,
		J2CSZGetZoneRankingPrize_ID=50333,
		J2CSZZoneTask_ID=50334,
		J2CSZZoneTaskChange_ID=50335,
		C2JSZGetZoneTaskPrize_ID=50336,
		J2CSZGetZoneTaskPrize_ID=50337,
		C2SSZInfo_ID=50350,
		S2CSZInfo_ID=50351,
		J2CSZOwnBlocks_ID=50352,
		C2JSZPlayerMapShow_ID=50353,
		J2CSZPlayerMapShow_ID=50354,
		J2CSZShenshouRanking_ID=50355,
		J2CSZShenshouDamage_ID=50356,
		J2CSZMyShenshouDamage_ID=50357,
		C2JSZShenshouReward_ID=50358,
		J2CSZShenshouReward_ID=50359,
		C2JSZShenshouRewardInfo_ID=50360,
		J2CSZShenshouRewardInfo_ID=50361,
		J2CSZMainTask_ID=50362,
		J2CSZMainTaskChange_ID=50363,
		C2JSZGetMainPrize_ID=50364,
		J2CSZGetMainPrize_ID=50365,
		C2JSZOpenView_ID=50366,
		J2SSZMainTask_ID=50367,
		C2JSZHeart_ID=50368,
		J2CSZHeart_ID=50369,
		J2CSZCampBuff_ID=50370,
		J2CSZCampBuffs_ID=50371,
		J2CSZActInfos_ID=50732,
		J2CSZActTaskInfos_ID=50733,
		J2CSZActTaskChange_ID=50734,
		C2JSZGetActTaskPrize_ID=50735,
		J2CSZGetActTaskPrize_ID=50736,
		S2JSZActRecharge_ID=50737,
		C2JSZActWishRankInfo_ID=50738,
		J2CSZActWishRankInfo_ID=50739,
		C2JSZGetActWishRankPrize_ID=50740,
		J2CSZGetActWishRankPrize_ID=50741,
		C2JSZPassCheckInfo_ID=50742,
		J2CSZPassCheckInfo_ID=50743,
		J2CSZPassCheckTaskChange_ID=50744,
		C2JSZGetPassCheckTaskPrize_ID=50745,
		J2CSZGetPassCheckTaskPrize_ID=50746,
		J2CSZAutoGetPassCheckTaskPrize_ID=50747,
		C2JSZGetPassCheckPrize_ID=50748,
		J2CSZGetPassCheckPrize_ID=50749,
		C2JSZGetPassCheckLoopPrize_ID=50750,
		J2CSZGetPassCheckLoopPrize_ID=50751,
		S2PSZInfo_ID=50752,
		P2SSZInfo_ID=50753,
		S2JSZPassCheckBuyPrize_ID=50754,
		J2CSZPassCheckBuyTimesUpdate_ID=50755,
		C2SSZPassCheckBuyLevelExp_ID=50756,
		S2CSZPassCheckBuyLevelExp_ID=50757,
		C2JSZLogin_ID=50758,
		S2CSZPassCheckBuyTimes_ID=50759,
		S2JAddSzBuff_ID=50760,
		J2CSZLMInfo_ID=50761,
		J2CSZLMProgressInfo_ID=50762,
		J2CSZLMStart_ID=50763,
		C2JSZLMDungeonInfo_ID=50764,
		J2CSZLMDungeonInfo_ID=50765,
		S2JSZLMGuwu_ID=50766,
		J2CSZLMGuwu_ID=50767,
		J2SSZLMGuwuFail_ID=50768,
		S2JSZLMResetMonster_ID=50769,
		J2CSZLMResetMonster_ID=50770,
		J2SSZLMResetMonsterFail_ID=50771,
		C2JSZLMChallenge_ID=50772,
		J2CSZLMChallenge_ID=50773,
		C2SSZLMGuwu_ID=50774,
		S2CSZLMGuwu_ID=50775,
		C2SSZLMResetMonster_ID=50776,
		S2CSZLMResetMonster_ID=50777,
		J2CSZLMKillBoss_ID=50778,
		C2JSZLMInfo_ID=50779,
		J2CSZLMEnd_ID=50780,
		J2CSZLMEliteMonsterInfo_ID=50781,
		S2JSZDeleteChatRecord_ID=50782,
		C2JSZMineRewardInfo_ID=50783,
		J2CSZMineRewardInfo_ID=50784,
		C2JSZMineReceiveReward_ID=50785,
		J2CSZMineReceiveReward_ID=50786,
		C2SEnterShenYu_ID=51001,
		S2CEnterShenYu_ID=51002,
		C2SLeaveShenYu_ID=51003,
		S2CLeaveShenYu_ID=51004,
		S2PYJCrossServer_ID=52201,
		P2SYJCrossServer_ID=52202,
		S2JYJPrepare_ID=52203,
		J2SYJPrepare_ID=52204,
		S2JYJJoin_ID=52205,
		J2SYJJoin_ID=52206,
		J2SYJReward_ID=52222,
		S2JYJReward_ID=52223,
		S2JYJGM_ID=52224,
		J2CYJRelogin_ID=52225,
		C2SYJInfo_ID=52226,
		S2CYJInfo_ID=52227,
		J2CYJRound_ID=52228,
		J2CYJAppearPlayer_ID=52229,
		J2CYJAppearMonster_ID=52230,
		J2CYJAppearBoss_ID=52231,
		J2CYJDisappearPlayer_ID=52232,
		J2CYJDisappearMonster_ID=52233,
		J2CYJDisappearBoss_ID=52234,
		C2JYJOther_ID=52235,
		J2CYJOther_ID=52236,
		S2JYJQuit_ID=52237,
		C2JYJMove_ID=52238,
		J2CYJMove_ID=52239,
		C2JYJMoving_ID=52240,
		C2JYJStop_ID=52241,
		J2CYJStop_ID=52242,
		J2CYJState_ID=52243,
		C2JYJAttackMonster_ID=52244,
		J2CYJAttackMonster_ID=52245,
		C2JYJAttackBoss_ID=52246,
		J2CYJAttackBoss_ID=52247,
		J2CYJBossHp_ID=52248,
		C2JYJCollect_ID=52249,
		J2CYJCollect_ID=52250,
		C2SYJOpen_ID=52251,
		S2CYJOpen_ID=52252,
		S2JYJOpen_ID=52253,
		J2SYJOpen_ID=52254,
		S2JYJXianzong_ID=52255,
		J2CYJRanking_ID=52256,
		J2CYJRankingChange_ID=52257,
		J2CYJBossAnger_ID=52258,
		J2CYJBossAddition_ID=52259,
		J2CYJDrops_ID=52260,
		J2CYJDrop_ID=52261,
		J2CYJPlayer_ID=52262,
		J2CYJBossNotice_ID=52263,
		J2CYJCooldown_ID=52264,
		C2JYJHeart_ID=52265,
		J2CYJHeart_ID=52266,
		J2CYJMonsterHp_ID=52267,
		S2JYJChat_ID=52268,
		J2CYJChat_ID=52269,
		J2SYJNotice_ID=52270,
		C2JYJChats_ID=52271,
		J2CYJChats_ID=52272,
		J2CYJAnnouncement_ID=52273,
		J2SStartAuction_ID=52274,
		C2JYJOtherInfo_ID=52275,
		J2SYJShowOther_ID=52276,
		S2CYJKeyTip_ID=52277,
		J2CYJChest_ID=52278,
		S2JYJDeleteChatRecord_ID=52279,
		C2SActTaskChoosePrize_ID=52301,
		S2CActTaskChoosePrize_ID=52302,
		S2CActTaskChoosePrizeSend_ID=52303,
		C2SCpsRPPlayerJoin_ID=53001,
		S2CCpsRPPlayerJoin_ID=53002,
		S2CCpsRPPlayerData_ID=53003,
		C2SCpsRPGetCfgInfo_ID=53004,
		S2CCpsRPGetCfgInfo_ID=53005,
		C2SCpsRPPlayerSwitch_ID=53006,
		S2CCpsRPPlayerSwitch_ID=53007,
		C2SCpsRPPlayerFinishTask_ID=53008,
		S2CCpsRPPlayerFinishTask_ID=53009,
		C2SCpsRPPlayerExchange_ID=53010,
		S2CCpsRPPlayerExchange_ID=53011,
		C2SGetWishTreeInfo_ID=54001,
		S2CGetWishTreeInfo_ID=54002,
		C2SReceiveWishTreeReward_ID=54003,
		S2CReceiveWishTreeReward_ID=54004,
		C2SSelectWishTreeReward_ID=54005,
		S2CSelectWishTreeReward_ID=54006,
		C2SBirthday_ID=54007,
		S2CBirthday_ID=54008,
		C2SDoCake_ID=54009,
		S2CDoCake_ID=54010,
		C2SGetPuTianTongQingData_ID=54011,
		S2CGetPuTianTongQingData_ID=54012,
		C2SRecPuTianTongQing_ID=54013,
		S2CRecPuTianTongQing_ID=54014,
		C2SGetYiLuYouNiData_ID=54015,
		S2CGetYiLuYouNiData_ID=54016,
		C2SRecYiLuYouNi_ID=54017,
		S2CRecYiLuYouNi_ID=54018,
		C2SCampPKInfo_ID=54019,
		S2CCampPKInfo_ID=54020,
		C2SSelectCamp_ID=54021,
		S2CSelectCamp_ID=54022,
		C2SDoVote_ID=54023,
		S2CDoVote_ID=54024,
		C2SExchangeAtRShop_ID=54025,
		S2CExchangeAtRShop_ID=54026,
		C2SReceiveAllCake_ID=54027,
		S2CReceiveAllCake_ID=54028,
		C2SGetYearTimeShop_ID=54029,
		S2CGetYearTimeShop_ID=54030,
		C2SYearTimeShopRefresh_ID=54031,
		S2CYearTimeShopRefresh_ID=54032,
		C2SYearTimeShopExchange_ID=54033,
		S2CYearTimeShopExchange_ID=54034,
		C2S1RMBPet_ID=54035,
		S2C1RMBPet_ID=54036,
		C2SCampRewardRecords_ID=54037,
		S2CCampRewardRecords_ID=54038,
		C2SHiedActRed_ID=54039,
		C2SGetAttr_ID=55301,
		S2CGetAttr_ID=55302,
		S2CSendActiveNotice_ID=55311,
}
declare class Ping
{
	constructor(data?);
}
declare class Pong
{
	constructor(data?);
}
declare class S2CServerTime
{
	T: number;
	constructor(data?);
}
declare class S2CServerAge
{
	T: number;
	UT: number;
	MT: number;
	constructor(data?);
}
declare class IntAttr
{
	k: number;
	v: number;
	constructor(data?);
}
declare class StrAttr
{
	k: number;
	v: string ;
	constructor(data?);
}
declare class ItemInfo
{
	ItemId: number;
	ItemNum: number;
	Bind: number;
	ItemValid: number;
	DSL: number;
	DSS: number;
	constructor(data?);
}
declare class ItemData
{
	Id: string ;
	Pos: number;
	IId: number;
	N: number;
	B: number;
	A: number;
	V: number;
	DSL: number;
	DSS: number;
	DSPos: number;
	Attr: Array<IntAttr>;
	Pet2: Pet2 ;
	Star: number;
	MaxStar: number;
	IsNew: number;
	State: number;
	PartnerId: number;
	Vows: string ;
	Lev: number;
	FeatureId: Array<number>;
	HLSkill: Array<Skill>;
	YQ: number;
	ObjType: number;
	EquipPart: number;
	Quality: number;
	HJLev: number;
	Exp: number;
	TotalExp: number;
	PEEffectId: number;
	PESuitId: number;
	PetId: string ;
	Lock: number;
	constructor(data?);
}
declare class ItemNum
{
	IId: number;
	N: number;
	constructor(data?);
}
declare class EquipAllData
{
	FuncId: number;
	ObjId: number;
	EquipData: Array<EquipData>;
	SuitLev: number;
	StrengthSLev: number;
	Lev_YanJia: number;
	SuitType: number;
	CoreList: Array<CoreList>;
	ShengHenLv: number;
	ShengHenSuit: Array<number>;
	ShengHenSkill: Array<number>;
	SoldierSoulDrug: Array<SoldierSoulDrug>;
	SoldierSoulSkillLev: number;
	EquipBreakType: Array<number>;
	MosaicBreakType: Array<number>;
	constructor(data?);
}
declare class SoldierSoulDrug
{
	Id: number;
	Lev: number;
	Count: number;
	constructor(data?);
}
declare class CoreList
{
	Id: number;
	Wear: number;
	Lev: number;
	Star: number;
	constructor(data?);
}
declare class EquipData
{
	Pos: number;
	ItemId: number;
	SL: number;
	MosaicInfo: Array<MosaicInfo>;
	SItemId: string ;
	RL: number;
	RLExp: number;
	constructor(data?);
}
declare class MosaicInfo
{
	Typ: number;
	Id: string ;
	constructor(data?);
}
declare class DrugBase
{
	Class: number;
	Type: number;
	Count: number;
	constructor(data?);
}
declare class PetAMerge
{
	PetAPosInfo: Array<PetAPosInfo>;
	PetAMergeActive: number;
	PetAMergeId: number;
	PetAMergeQuality: number;
	PetAMergeAwake: number;
	AwakeQuality: number;
	constructor(data?);
}
declare class PetAPosInfo
{
	Pos: number;
	PetAId: number;
	constructor(data?);
}
declare class SDEventInfo
{
	EventUid: string ;
	EventId: number;
	EndTime: number;
	ReturnTime: number;
	ReturnRec: number;
	constructor(data?);
}
declare class EnemyRecord
{
	Time: number;
	InstanceType: number;
	Nick: string ;
	World: string ;
	constructor(data?);
}
declare class RobberData
{
	Id: number;
	Times: number;
	constructor(data?);
}
declare class Skin
{
	Id: number;
	W: number;
	V: number;
	Old: number;
	L: number;
	constructor(data?);
}
declare class SkinExtAttr
{
	SuitId: number;
	Num: number;
	AttrId: number;
	constructor(data?);
}
declare class C2SChangeNick
{
	Nick: string ;
	RoleId: number;
	constructor(data?);
}
declare class S2CChangeNick
{
	Tag: number;
	constructor(data?);
}
declare class LimitFightRankData
{
	UserId: number;
	Nick: string ;
	RoleId: number;
	AreaId: number;
	Head: number;
	HeadFrame: number;
	Value: number;
	Sort: number;
	ShowAreaId: number;
	World: string ;
	constructor(data?);
}
declare class SectRankData
{
	ServerId: number;
	SectName: string ;
	SectLeaderName: string ;
	AreaId: number;
	Value: number;
	Sort: number;
	SectLeaderUserId: number;
	ShowAreaId: number;
	ShowSectAreaId: number;
	World: string ;
	SectWorld: string ;
	constructor(data?);
}
declare class C2SGetLimitFightData
{
	ActId: number;
	constructor(data?);
}
declare class S2CGetLimitFightData
{
	Tag: number;
	IsStart: number;
	IsPass: number;
	PassCount: number;
	Layers: number;
	PlayerLayers: number;
	SpeedRewardLayers: Array<number>;
	BossHp: number;
	BossMaxHP: number;
	Count: number;
	MaxCount: number;
	RecoveryTimes: number;
	ActEndTimes: number;
	FightValue: number;
	constructor(data?);
}
declare class C2SChallengeLimitFight
{
	constructor(data?);
}
declare class S2CChallengeLimitFight
{
	Tag: number;
	IsWin: number;
	IsPass: number;
	constructor(data?);
}
declare class C2SRecLimitFightReward
{
	constructor(data?);
}
declare class S2CRecLimitFightReward
{
	Tag: number;
	constructor(data?);
}
declare class C2SRecLimitFightSpeedReward
{
	Layer: number;
	constructor(data?);
}
declare class S2CRecLimitFightSpeedReward
{
	Tag: number;
	Layer: number;
	SpeedRewardLayers: Array<number>;
	constructor(data?);
}
declare class C2SLimitFightRank
{
	RankType: number;
	constructor(data?);
}
declare class S2CLimitFightRank
{
	Tag: number;
	RankType: number;
	PlayerSort: number;
	PlayerValue: number;
	RankData: Array<LimitFightRankData>;
	constructor(data?);
}
declare class C2SLimitFightSectRank
{
	constructor(data?);
}
declare class S2CLimitFightSectRank
{
	Tag: number;
	Sort: number;
	Value: number;
	RankData: Array<SectRankData>;
	constructor(data?);
}
declare class C2SLimitFightBuyTimes
{
	constructor(data?);
}
declare class S2CLimitFightBuyTimes
{
	Tag: number;
	Count: number;
	RecoveryTimes: number;
	constructor(data?);
}
declare class C2SLimitFightBuyInfo
{
	constructor(data?);
}
declare class S2CLimitFightBuyInfo
{
	Coin: number;
	CoinType: number;
	Times: number;
	LeftTimes: number;
	TotalTimes: number;
	NoticeTimes: number;
	NoticeVip: number;
	constructor(data?);
}
declare class S2CLimitFightUpdateTimes
{
	Tag: number;
	Count: number;
	RecoveryTimes: number;
	constructor(data?);
}
declare class S2CServerInfo
{
	IsOpenRealName: number;
	IsOpenFcm: number;
	SendShopMaxNum: number;
	OpenDragon: number;
	IsOpenSend: number;
	Version: number;
	DataVersion: number;
	BuildTime: string ;
	DataBuildTime: string ;
	constructor(data?);
}
declare class Default
{
	constructor(data?);
}
declare class C2SLogin
{
	AreaId: number;
	AccountId: number;
	Token: string ;
	UserId: number;
	Fcm: number;
	LoginPf: string ;
	Timestamp: number;
	CheckWordUrl: string ;
	CodeVersion: number;
	ExcelVersion: number;
	constructor(data?);
}
declare class S2CLogin
{
	Tag: number;
	UserId: number;
	NoCharge: number;
	constructor(data?);
}
declare class C2SReLogin
{
	AccountId: number;
	Token: string ;
	UserId: number;
	CodeVersion: number;
	ExcelVersion: number;
	constructor(data?);
}
declare class S2CReLogin
{
	Tag: number;
	constructor(data?);
}
declare class S2CReLoginState
{
	constructor(data?);
}
declare class C2SLoginEnd
{
	CodeVersion: number;
	ExcelVersion: number;
	constructor(data?);
}
declare class S2CAllData
{
	constructor(data?);
}
declare class C2SUserInfo
{
	AccountId: number;
	Token: string ;
	constructor(data?);
}
declare class S2CUserInfo
{
	Tag: number;
	MapId: number;
	MapX: number;
	MapY: number;
	A: Array<IntAttr>;
	constructor(data?);
}
declare class S2COfflinePrize
{
	Gold: number;
	Exp: number;
	Equip: number;
	LogoutTime: number;
	constructor(data?);
}
declare class C2SGetOfflinePrize
{
	Multi: number;
	constructor(data?);
}
declare class S2CGetOfflinePrize
{
	Tag: number;
	constructor(data?);
}
declare class LoginFinish
{
	constructor(data?);
}
declare class C2SGetGift1
{
	constructor(data?);
}
declare class S2CGetGift1
{
	Tag: number;
	constructor(data?);
}
declare class C2SGetGift2
{
	constructor(data?);
}
declare class S2CGetGift2
{
	Tag: number;
	constructor(data?);
}
declare class C2SFocusPrice
{
	Type: number;
	constructor(data?);
}
declare class S2CFocusPrice
{
	Tag: number;
	constructor(data?);
}
declare class C2SFirstInvite
{
	constructor(data?);
}
declare class S2CFirstInvite
{
	Tag: number;
	constructor(data?);
}
declare class C2SNewStory
{
	constructor(data?);
}
declare class S2CNewStory
{
	Tag: number;
	constructor(data?);
}
declare class C2SRoleInfo
{
	constructor(data?);
}
declare class S2CRoleInfo
{
	UserId: number;
	A: Array<IntAttr>;
	B: Array<StrAttr>;
	constructor(data?);
}
declare class C2SOtherInfo
{
	UserId: number;
	OnlyAttr: number;
	constructor(data?);
}
declare class S2COtherInfo
{
	UserId: number;
	A: Array<IntAttr>;
	B: Array<StrAttr>;
	MateNick: string ;
	Tag: number;
	Enemy: number;
	Friend: number;
	Team: number;
	Shield: number;
	FamilyName: string ;
	FamilyPos: number;
	GodLevel: number;
	SectName: string ;
	Rank: number;
	MateWorld: string ;
	World: string ;
	Recharge: number;
	HistoryTaskId: number;
	CurrStage: number;
	OpenFunc: string ;
	SwordSoulTowerStageMax: number;
	constructor(data?);
}
declare class S2COtherInfoEquip
{
	UserId: number;
	Equip1: Array<ItemData>;
	Equip2: Array<ItemData>;
	Equip3: Array<ItemData>;
	EquipPos: Array<EquipPos>;
	EquipDuJins: Array<EquipDuJin>;
	EquipJingLians: EquipJingLian ;
	EquipZhuHuns: EquipZhuHun ;
	PlayerKingEquips: Array<PlayerKingEquip>;
	SpeEquipFv: number;
	constructor(data?);
}
declare class PetEquipInfo
{
	PetId: string ;
	Items: Array<ItemData>;
	constructor(data?);
}
declare class S2COtherInfoPet
{
	UserId: number;
	Pet: Array<Pet2>;
	PartenInfos: Array<PartenInfo>;
	PetEquip: Array<PetEquipInfo>;
	constructor(data?);
}
declare class S2COtherInfoFV
{
	UserId: number;
	SelfEquip1: number;
	SelfEquip2: number;
	SelfPet: number;
	SelfStrength: number;
	SelfStone: number;
	SelfSteel: number;
	SelfCloth: number;
	SelfHorse: number;
	SelfWing: number;
	SelfGuard: number;
	SelfGod: number;
	SelfStar: number;
	SelfForge: number;
	SelfPetA: number;
	SelfWarrior: number;
	SelfPrecious: number;
	SelfSkill: number;
	SelfJingLian: number;
	SelfZhuHun: number;
	SelfDuJin: number;
	SelfPhotoBook: number;
	SelfDrug: number;
	SelfFairy: number;
	SelfYanJia: number;
	SelfHero: number;
	SelfBeast: number;
	SelfHuanLing: number;
	SelfShengWu: number;
	SelfDuoBaoGe: number;
	SelfRealm: number;
	SelfReborn: number;
	SelfFeiSheng: number;
	SelfFaZhen: number;
	SelfAlien: number;
	SelfSwordSoul: number;
	SelfGoldDrug: number;
	OtherEquip1: number;
	OtherEquip2: number;
	OtherPet: number;
	OtherStrength: number;
	OtherStone: number;
	OtherSteel: number;
	OtherCloth: number;
	OtherHorse: number;
	OtherWing: number;
	OtherGuard: number;
	OtherGod: number;
	OtherStar: number;
	OtherForge: number;
	OtherPetA: number;
	OtherWarrior: number;
	OtherPrecious: number;
	OtherSkill: number;
	OtherJingLian: number;
	OtherZhuHun: number;
	OtherDuJin: number;
	OtherPhotoBook: number;
	OtherDrug: number;
	OtherFairy: number;
	OtherYanJia: number;
	OtherHero: number;
	OtherBeast: number;
	OtherHuanLing: number;
	OtherShengWu: number;
	OtherDuoBaoGe: number;
	OtherRealm: number;
	OtherReborn: number;
	OtherFeiSheng: number;
	OtherFaZhen: number;
	OtherAlien: number;
	OtherSwordSoul: number;
	OtherGoldDrug: number;
	constructor(data?);
}
declare class S2COtherInfoSkin
{
	SelfSkinTotalFV: number;
	SelfSkinNum: number;
	SelfWearSkinFV: Array<WearSkinFV>;
	OtherSkinTotalFV: number;
	OtherSkinNum: number;
	OtherWearSkinFV: Array<WearSkinFV>;
	constructor(data?);
}
declare class WearSkinFV
{
	SkinId: number;
	FV: number;
	IsSuit: number;
	constructor(data?);
}
declare class C2SOtherInfoGradeInfo
{
	GradeId: number;
	TargetPlayerId: number;
	constructor(data?);
}
declare class S2COtherInfoGradeInfo
{
	GradeId: number;
	TargetPlayerId: number;
	Grade: Array<Grade>;
	CurSkinId: number;
	SkinInfo: Array<Skin>;
	Equips: Array<ItemData>;
	ZSData: Array<SkinsExtData>;
	constructor(data?);
}
declare class C2SOtherTotemInfo
{
	TargetPlayerId: number;
	constructor(data?);
}
declare class S2COtherTotemInfo
{
	TargetPlayerId: number;
	TotemInfos: Array<TotemInfo>;
	constructor(data?);
}
declare class C2SOtherPetAInfo
{
	TargetPlayerId: number;
	constructor(data?);
}
declare class S2COtherPetAInfo
{
	TargetPlayerId: number;
	P: Array<PetA>;
	PetAMerge: PetAMerge ;
	EquipAllData: Array<EquipAllData>;
	CurSkinId: number;
	SkinInfo: Array<Skin>;
	Fv: number;
	Equips: Array<ItemData>;
	PetASXData: Array<SkinsExtData>;
	A: Array<IntAttr>;
	B: Array<StrAttr>;
	constructor(data?);
}
declare class C2SOtherKidsInfo
{
	TargetPlayerId: number;
	constructor(data?);
}
declare class S2COtherKidsInfo
{
	TargetPlayerId: number;
	P: Array<Partner>;
	DrugBase: Array<DrugBase>;
	ToyMasterLev: number;
	T: Array<PhotoBook>;
	Fv: number;
	DrugFv: number;
	ToyFv: number;
	CurKidBoy: number;
	CurKidBoySkinId: number;
	CurKidGirl: number;
	CurKidGirlSkinId: number;
	SkinInfo: Array<Skin>;
	KidsQNData: Array<SkinsExtData>;
	constructor(data?);
}
declare class C2SOtherYanJiaInfo
{
	TargetPlayerId: number;
	constructor(data?);
}
declare class S2COtherYanJiaInfo
{
	TargetPlayerId: number;
	EquipAllData: Array<EquipAllData>;
	YanJiaId: number;
	YanJiaSkinId: number;
	YanJiaSkinInfo: Array<Skin>;
	Fv: number;
	Equips: Array<ItemData>;
	ZJData: Array<SkinsExtData>;
	constructor(data?);
}
declare class C2SOtherHeroInfo
{
	TargetPlayerId: number;
	constructor(data?);
}
declare class S2COtherHeroInfo
{
	TargetPlayerId: number;
	EquipAllData: Array<EquipAllData>;
	HeroId: number;
	PlayerHeroDevelop: Array<PlayerHeroDevelop>;
	PlayerHeroAchi: Array<PlayerHeroAchi>;
	PlayerHeroBond: Array<PlayerHeroBond>;
	Equips: Array<ItemData>;
	Fv: number;
	HeroSkinId: number;
	SkinInfo: Array<Skin>;
	HeroWSData: Array<SkinsExtData>;
	WSGodSkillId: number;
	WSGodCount: number;
	constructor(data?);
}
declare class C2SOtherAlienInfo
{
	TargetPlayerId: number;
	constructor(data?);
}
declare class S2COtherAlienInfo
{
	TargetPlayerId: number;
	PlayerAlien: Array<PlayerAlien>;
	AlienId: number;
	Fv: number;
	constructor(data?);
}
declare class C2SOtherBeastInfo
{
	TargetPlayerId: number;
	constructor(data?);
}
declare class S2COtherBeastInfo
{
	TargetPlayerId: number;
	Beasts: Array<SavageBeast>;
	BeastId: number;
	Equips: Array<ItemData>;
	constructor(data?);
}
declare class C2SOtherHuanLingInfo
{
	TargetPlayerId: number;
	constructor(data?);
}
declare class S2COtherHuanLingInfo
{
	TargetPlayerId: number;
	HuanLingList: Array<HuanLingDev>;
	HLId: number;
	Equips: Array<ItemData>;
	ActiveSkills: Array<Skill>;
	HL1_Skin: number;
	HL1_SkinInfo: Array<Skin>;
	HL2_Skin: number;
	HL2_SkinInfo: Array<Skin>;
	HL3_Skin: number;
	HL3_SkinInfo: Array<Skin>;
	HL4_Skin: number;
	HL4_SkinInfo: Array<Skin>;
	HL5_Skin: number;
	HL5_SkinInfo: Array<Skin>;
	LW1_Skin: number;
	LW1_SkinInfo: Array<Skin>;
	LW2_Skin: number;
	LW2_SkinInfo: Array<Skin>;
	LW3_Skin: number;
	LW3_SkinInfo: Array<Skin>;
	LW4_Skin: number;
	LW4_SkinInfo: Array<Skin>;
	LW5_Skin: number;
	LW5_SkinInfo: Array<Skin>;
	constructor(data?);
}
declare class C2SOtherSwordSoulInfo
{
	TargetPlayerId: number;
	constructor(data?);
}
declare class S2COtherSwordSoulInfo
{
	TargetPlayerId: number;
	SwordSouls: SwordSoul ;
	Equips: Array<ItemData>;
	constructor(data?);
}
declare class C2SSearchPlayer
{
	AreaId: number;
	Nick: string ;
	constructor(data?);
}
declare class S2CSearchPlayer
{
	Tag: number;
	List: Array<RushRankUserInfo>;
	constructor(data?);
}
declare class S2CRoleData
{
	ActiveSkills: Array<Skill>;
	Skins: Array<Skin>;
	VIPPrize: Array<number>;
	WorldLevel: WorldLevel ;
	Precious: Array<Precious>;
	NewPrize: Array<number>;
	VIPGift: Array<number>;
	ChargeGift: Array<number>;
	FnPreviewPrize: Array<number>;
	EquipDuJins: Array<EquipDuJin>;
	EquipJingLians: EquipJingLian ;
	EquipZhuHuns: EquipZhuHun ;
	SkinExtAttr: Array<SkinExtAttr>;
	TotemInfos: Array<TotemInfo>;
	TotemHelpPets: Array<string>;
	pushGiftList: Array<S2CAutoPushGift>;
	SwordSouls: SwordSoul ;
	constructor(data?);
}
declare class S2CRoleTask
{
	Task: Array<S2CTask>;
	Counters: Array<S2CCounter>;
	AllData: number;
	constructor(data?);
}
declare class C2SAchieveShow
{
	AchieveShow: number;
	constructor(data?);
}
declare class S2CAchieveShow
{
	AchieveShow: Array<number>;
	constructor(data?);
}
declare class S2CRoleBaseInfo
{
	UserId: number;
	Nick: string ;
	LogoutTime: number;
	FightValue: number;
	VipLevel: number;
	Level: number;
	RoleId: number;
	OnLine: number;
	HideVIP: number;
	constructor(data?);
}
declare class C2SRoleBaseInfo
{
	UserId: number;
	constructor(data?);
}
declare class S2CKill
{
	Tag: number;
	constructor(data?);
}
declare class FightUnit
{
	P: number;
	I: number;
	T: number;
	A: Array<IntAttr>;
	B: Array<StrAttr>;
	F: number;
	H: number;
	MH: number;
	H1: number;
	MH1: number;
	IsMH1: number;
	RealmLevel: number;
	SectPetId: number;
	FeiShengId: number;
	SLActiveSkill: number;
	constructor(data?);
}
declare class Effect
{
	K: number;
	V: number;
	Protect: number;
	From: number;
	Param: number;
	constructor(data?);
}
declare class AtkUnit
{
	P: number;
	E: Array<Effect>;
	IsHp1: number;
	IsAtk: number;
	AtkOrder: number;
	AngerValue: number;
	CurSkin: number;
	IsSwallow: number;
	AngerValueMax: number;
	ShenLongDBTXMax: number;
	constructor(data?);
}
declare class FightStep
{
	P: number;
	S: number;
	U: Array<AtkUnit>;
	CU: Array<FightUnit>;
	R: number;
	E: Array<Effect>;
	KILL: number;
	MultiAtk: number;
	NoAtk: number;
	ShowSkill: number;
	Together: number;
	TogetherBuff: number;
	HLID: number;
	AtkContinue: number;
	ChangeHL: number;
	ChangeHLSkin: number;
	SwallowStatus: number;
	CurSkin: number;
	SamePlayFlag: number;
	SamePlayBuff: number;
	S2: number;
	ShapeStage: number;
	constructor(data?);
}
declare class S2CBattlefieldReport
{
	U: Array<FightUnit>;
	S: Array<FightStep>;
	I: Array<ItemInfo>;
	T: number;
	P: number;
	Win: number;
	Idx: number;
	M: number;
	PVP: number;
	Num: number;
	Video: number;
	ShowBuff: Array<Skill>;
	ZhanFaIDs: Array<number>;
	OverRound: number;
	OverRoundType: number;
	WinUserId: number;
	PlayerBossTotalHp: number;
	NextCanFightTimestamp: number;
	constructor(data?);
}
declare class S2CFightCD
{
	T: number;
	NextCanFightTimestamp: number;
	constructor(data?);
}
declare class S2CSimpleBattleReport
{
	AtkId: number;
	AtkUnitType: number;
	AtkNick: string ;
	AtkHead: number;
	AtkHeadFrame: number;
	AtkShowAreaId: number;
	TargetId: number;
	TargetUnitType: number;
	TargetNick: string ;
	TargetHead: number;
	TargetHeadFrame: number;
	TargetShowAreaId: number;
	Idx: number;
	Winner: number;
	AtkWorld: string ;
	TargetWorld: string ;
	constructor(data?);
}
declare class C2SEndFight
{
	Idx: number;
	constructor(data?);
}
declare class C2SFightContinue
{
	constructor(data?);
}
declare class S2CPrizeReport
{
	Items: Array<ItemData>;
	Idx: number;
	Type: number;
	Star: number;
	JJC: number;
	FBType: number;
	FightNick: string ;
	Data: Array<number>;
	OverRound: number;
	OverRoundType: number;
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
declare class C2SAutoStage
{
	State: number;
	constructor(data?);
}
declare class C2SStageSeek
{
	constructor(data?);
}
declare class S2CStageSeek
{
	Tag: number;
	UserId: number;
	StageId: number;
	constructor(data?);
}
declare class C2SStageHelp
{
	UserId: number;
	StageId: number;
	constructor(data?);
}
declare class S2CStageHelp
{
	Tag: number;
	constructor(data?);
}
declare class C2SChangeMap
{
	MapId: number;
	constructor(data?);
}
declare class S2CChangeMap
{
	Tag: number;
	MapId: number;
	X: number;
	Y: number;
	constructor(data?);
}
declare class C2SRoutePath
{
	MapId: number;
	FX: number;
	FY: number;
	TX: number;
	TY: number;
	constructor(data?);
}
declare class S2CRoutePath
{
	Tag: number;
	MapId: number;
	Points: Array<number>;
	constructor(data?);
}
declare class C2SAutoJump
{
	V: number;
	constructor(data?);
}
declare class StagePrizeInfo
{
	Id: number;
	Num: number;
	constructor(data?);
}
declare class C2SStagePrize
{
	constructor(data?);
}
declare class S2CStagePrize
{
	Items: Array<StagePrizeInfo>;
	constructor(data?);
}
declare class C2SGetStagePrize
{
	Id: number;
	constructor(data?);
}
declare class S2CGetStagePrize
{
	Tag: number;
	Id: number;
	constructor(data?);
}
declare class C2SGetAllStagePrize
{
	constructor(data?);
}
declare class S2CGetAllStagePrize
{
	Tag: number;
	constructor(data?);
}
declare class C2SStageDraw
{
	constructor(data?);
}
declare class S2CStageDraw
{
	Tag: number;
	Id: Array<number>;
	constructor(data?);
}
declare class C2SStageDrawEnd
{
	constructor(data?);
}
declare class C2SCatchPet
{
	constructor(data?);
}
declare class S2CCatchPet
{
	Tag: number;
	Win: number;
	ItemId: number;
	MonsterId: number;
	constructor(data?);
}
declare class C2SStartMove
{
	P: Array<number>;
	constructor(data?);
}
declare class S2CStartMove
{
	Tag: number;
	constructor(data?);
}
declare class S2CPlayerMove
{
	UserId: number;
	P: Array<number>;
	constructor(data?);
}
declare class C2SStopMove
{
	X: number;
	Y: number;
	constructor(data?);
}
declare class S2CStopMove
{
	constructor(data?);
}
declare class S2CPlayerStopMove
{
	UserId: number;
	X: number;
	Y: number;
	constructor(data?);
}
declare class C2SUpdateMapInfo
{
	UserId: number;
	X: number;
	Y: number;
	constructor(data?);
}
declare class C2SMoving
{
	UserId: number;
	X: number;
	Y: number;
	constructor(data?);
}
declare class S2CMoving
{
	UserId: number;
	X: number;
	Y: number;
	constructor(data?);
}
declare class S2CTransfer
{
	UserId: number;
	X: number;
	Y: number;
	constructor(data?);
}
declare class C2SCheckFight
{
	constructor(data?);
}
declare class S2CCheckFight
{
	Tag: number;
	NextTime: number;
	constructor(data?);
}
declare class S2CPlayerEnterMap
{
	UserId: number;
	A: Array<IntAttr>;
	B: Array<StrAttr>;
	X: number;
	Y: number;
	P: Array<number>;
	MT: number;
	constructor(data?);
}
declare class S2CPlayerLeaveMap
{
	UserId: number;
	constructor(data?);
}
declare class S2CMonsterEnterMap
{
	Id: number;
	IID: number;
	X: number;
	Y: number;
	MHp: number;
	Hp: number;
	MHp1: number;
	Hp1: number;
	Fx: number;
	MT: number;
	Belong: number;
	constructor(data?);
}
declare class S2CUpMonsterInfo
{
	MHp: number;
	Hp: number;
	MHp1: number;
	Hp1: number;
	Id: number;
	LifeState: number;
	IsCollect: number;
	constructor(data?);
}
declare class S2CMonsterLeaveMap
{
	Id: number;
	constructor(data?);
}
declare class C2SStartFight
{
	Id: number;
	Type: number;
	constructor(data?);
}
declare class S2CStartFight
{
	Tag: number;
	constructor(data?);
}
declare class C2SStartCollect
{
	Id: number;
	constructor(data?);
}
declare class S2CStartCollect
{
	Tag: number;
	constructor(data?);
}
declare class C2SEndCollect
{
	Id: number;
	Ret: number;
	constructor(data?);
}
declare class S2CEndCollect
{
	Tag: number;
	Ret: number;
	constructor(data?);
}
declare class S2CMonsterTalk
{
	Id: number;
	TalkId: number;
	constructor(data?);
}
declare class Skill
{
	I: number;
	L: number;
	constructor(data?);
}
declare class C2SRoleSkillUp
{
	Id: number;
	constructor(data?);
}
declare class C2SRoleSkillUpAuto
{
	constructor(data?);
}
declare class S2CRoleSkillUp
{
	Tag: number;
	Skill: Array<Skill>;
	SkillId: Array<number>;
	constructor(data?);
}
declare class C2SRoleSkillOrder
{
	Skill: Array<Skill>;
	constructor(data?);
}
declare class S2CRoleSkillOrder
{
	Tag: number;
	constructor(data?);
}
declare class C2SWelcome
{
	constructor(data?);
}
declare class C2SUnlockSkin
{
	SkinId: number;
	constructor(data?);
}
declare class S2CUnlockSkin
{
	Tag: number;
	Skins: Array<Skin>;
	SkinId: number;
	constructor(data?);
}
declare class C2SWearSkin
{
	SkinId: number;
	constructor(data?);
}
declare class S2CWearSkin
{
	Tag: number;
	SkinId: number;
	constructor(data?);
}
declare class C2SSkinUp
{
	SkinId: number;
	constructor(data?);
}
declare class S2CSkinUp
{
	Tag: number;
	SkinId: number;
	SkinLevel: number;
	constructor(data?);
}
declare class C2SDropSkin
{
	SkinId: number;
	constructor(data?);
}
declare class S2CDropSkin
{
	Tag: number;
	SkinId: number;
	constructor(data?);
}
declare class C2SSkinSuitExtAttr
{
	SuitId: number;
	Num: number;
	constructor(data?);
}
declare class S2CSkinSuitExtAttr
{
	Tag: number;
	SkinExtAttr: SkinExtAttr ;
	constructor(data?);
}
declare class C2SSkinReikiUp
{
	ItemId: number;
	ItemNum: number;
	Auto: number;
	constructor(data?);
}
declare class S2CSkinReikiUp
{
	Tag: number;
	constructor(data?);
}
declare class C2SSkinSpiritUp
{
	ItemId: number;
	ItemNum: number;
	Auto: number;
	constructor(data?);
}
declare class S2CSkinSpiritUp
{
	Tag: number;
	constructor(data?);
}
declare class C2SActiveSkinExt
{
	SuitId: number;
	PartNum: number;
	constructor(data?);
}
declare class S2CActiveSkinExt
{
	Tag: number;
	constructor(data?);
}
declare class C2SSkinSuitUp
{
	SuitId: number;
	Auto: number;
	constructor(data?);
}
declare class S2CSkinSuitUp
{
	Tag: number;
	constructor(data?);
}
declare class C2SWearSkinSuit
{
	SuitId: number;
	constructor(data?);
}
declare class S2CWearSkinSuit
{
	Tag: number;
	constructor(data?);
}
declare class C2SDropSkinSuit
{
	SuitId: number;
	constructor(data?);
}
declare class S2CDropSkinSuit
{
	Tag: number;
	constructor(data?);
}
declare class C2SGetVipPrize
{
	VIPLevel: number;
	constructor(data?);
}
declare class S2CGetVipPrize
{
	Tag: number;
	VIPLevel: number;
	constructor(data?);
}
declare class C2SBuyVipPrize
{
	VIPLevel: number;
	constructor(data?);
}
declare class S2CBuyVipPrize
{
	Tag: number;
	VIPLevel: number;
	constructor(data?);
}
declare class C2SGetVipDayGift
{
	constructor(data?);
}
declare class S2CGetVipDayGift
{
	Tag: number;
	constructor(data?);
}
declare class C2SGetSuperVipQQ
{
	constructor(data?);
}
declare class S2CGetSuperVipQQ
{
	Tag: number;
	constructor(data?);
}
declare class C2SGetNewPrize
{
	Id: number;
	constructor(data?);
}
declare class S2CGetNewPrize
{
	Tag: number;
	Id: number;
	constructor(data?);
}
declare class C2SGetFnPreviewPrize
{
	Id: number;
	constructor(data?);
}
declare class S2CGetFnPreviewPrize
{
	Tag: number;
	Id: number;
	constructor(data?);
}
declare class C2SFnPreviewCfg
{
	Cfg: string ;
	constructor(data?);
}
declare class C2SClientSwitch
{
	Value: number;
	constructor(data?);
}
declare class S2CClientSwitch
{
	Tag: number;
	constructor(data?);
}
declare class C2SShareSuccess
{
	constructor(data?);
}
declare class S2CUserGrade
{
	Grade: Array<Grade>;
	constructor(data?);
}
declare class C2SReborn
{
	constructor(data?);
}
declare class S2CReborn
{
	Tag: number;
	constructor(data?);
}
declare class Grade
{
	T: number;
	L: number;
	P: number;
	S: number;
	M: number;
	SL: number;
	SE: number;
	SK1: number;
	SK2: number;
	SK3: number;
	SK4: number;
	Prize: Array<number>;
	TongLing: number;
	ForgeExp: number;
	ForgeLevel: number;
	ForgeOpen: number;
	TongLingLev: number;
	constructor(data?);
}
declare class C2SGradeUp
{
	T: number;
	F: number;
	Times: number;
	AutoBuy: number;
	constructor(data?);
}
declare class S2CGradeUp
{
	Tag: number;
	Multi: number;
	New: number;
	T: number;
	F: number;
	constructor(data?);
}
declare class C2SGetGradePrize
{
	T: number;
	L: number;
	Multi: number;
	constructor(data?);
}
declare class S2CGetGradePrize
{
	Tag: number;
	TagP: string ;
	constructor(data?);
}
declare class C2SGradeHuaJin
{
	T: number;
	Part: number;
	constructor(data?);
}
declare class S2CGradeHuaJin
{
	Tag: number;
	T: number;
	Part: number;
	constructor(data?);
}
declare class FriendInfos
{
	Uid: number;
	Nick: string ;
	Server: number;
	World: string ;
	constructor(data?);
}
declare class C2SGetFriendInfos
{
	constructor(data?);
}
declare class S2CGetFriendInfos
{
	Tag: number;
	BList: Array<FriendInfos>;
	B: number;
	Tb: number;
	constructor(data?);
}
declare class C2SBlack
{
	Typ: number;
	FriendId: number;
	Nick: string ;
	Server: number;
	Wrold: string ;
	constructor(data?);
}
declare class S2CBlack
{
	Tag: number;
	Typ: number;
	FriendId: number;
	constructor(data?);
}
declare class DBFriend
{
	FId: number;
	T: number;
	Cs: number;
	E: number;
	constructor(data?);
}
declare class Friend
{
	F: DBFriend ;
	A: number;
	N: string ;
	L: number;
	S: number;
	V: number;
	O: number;
	Gl: number;
	Gn: string ;
	Server: number;
	World: string ;
	constructor(data?);
}
declare class S2CGetFriends
{
	F: number;
	Tf: number;
	A: number;
	Ta: number;
	B: number;
	Tb: number;
	S: number;
	Ts: number;
	R: number;
	Tr: number;
	List: Array<Friend>;
	E: number;
	Eb: number;
	constructor(data?);
}
declare class C2SFocus
{
	FriendId: number;
	constructor(data?);
}
declare class S2CFocus
{
	Tag: number;
	FriendId: number;
	constructor(data?);
}
declare class C2SCancelFocus
{
	FriendId: number;
	constructor(data?);
}
declare class S2CCancelFocus
{
	Tag: number;
	FriendId: number;
	constructor(data?);
}
declare class C2SHate
{
	FriendId: number;
	constructor(data?);
}
declare class S2CHate
{
	Tag: number;
	FriendId: number;
	constructor(data?);
}
declare class C2SCancelHate
{
	FriendId: number;
	constructor(data?);
}
declare class S2CCancelHate
{
	Tag: number;
	FriendId: number;
	constructor(data?);
}
declare class C2SGiveCoin
{
	FriendId: number;
	constructor(data?);
}
declare class S2CGiveCoin
{
	Tag: number;
	FriendId: number;
	constructor(data?);
}
declare class C2SGetCoin
{
	FriendId: number;
	constructor(data?);
}
declare class S2CGetCoin
{
	Tag: number;
	FriendId: number;
	constructor(data?);
}
declare class C2SGetSuggest
{
	constructor(data?);
}
declare class S2CGetSuggest
{
	List: Array<Friend>;
	constructor(data?);
}
declare class C2SOneKeyGiveCoin
{
	constructor(data?);
}
declare class S2COneKeyGiveCoin
{
	Tag: number;
	Num: number;
	constructor(data?);
}
declare class C2SOneKeyGetCoin
{
	constructor(data?);
}
declare class S2COneKeyGetCoin
{
	Tag: number;
	Num: number;
	constructor(data?);
}
declare class C2SOneKeyFocus
{
	constructor(data?);
}
declare class S2COneKeyFocus
{
	Tags: Array<number>;
	Num: number;
	constructor(data?);
}
declare class C2SEnemyRecord
{
	constructor(data?);
}
declare class S2CEnemyRecord
{
	N: Array<EnemyRecord>;
	constructor(data?);
}
declare class C2SDelEnemy
{
	Id: number;
	constructor(data?);
}
declare class S2CDelEnemy
{
	Tag: number;
	constructor(data?);
}
declare class C2SAddNewEnemy
{
	Id: number;
	constructor(data?);
}
declare class S2CAddNewEnemy
{
	Tag: number;
	Id: number;
	constructor(data?);
}
declare class ChatMsg
{
	ID: number;
	ChannelId: number;
	Type: number;
	Content: string ;
	SenderId: number;
	SenderNick: string ;
	SenderRoleId: number;
	SenderGodLevel: number;
	AreaId: number;
	SenderHead: number;
	SenderHeadFrame: number;
	SenderChatFrame: number;
	SenderTitle: number;
	SenderVIP: number;
	AtUserShowAreaId: number;
	AtUserNick: string ;
	AtUserId: number;
	World: string ;
	AtWorld: string ;
	HideVIP: number;
	constructor(data?);
}
declare class C2SSendChatMsg
{
	ChannelId: number;
	Content: string ;
	AtUserId: number;
	constructor(data?);
}
declare class S2CSendChatMsg
{
	Tag: number;
	constructor(data?);
}
declare class C2SGetHistoryChat
{
	constructor(data?);
}
declare class S2CGetHistoryChat
{
	Chatmessage: Array<ChatMsg>;
	constructor(data?);
}
declare class S2CDelHistoryChat
{
	Tag: number;
	UserId: number;
	MsgId: number;
	constructor(data?);
}
declare class S2CNewChatMsg
{
	Chatmessage: ChatMsg ;
	constructor(data?);
}
declare class WhisperMsg
{
	SenderId: number;
	SenderNick: string ;
	SenderRoleId: number;
	SenderGodLevel: number;
	ReceiverId: number;
	ReceiverNick: string ;
	ReceiverRoleId: number;
	ReceiverGodLevel: number;
	Content: string ;
	Time: number;
	constructor(data?);
}
declare class C2SWhisper
{
	ReceiverId: number;
	Content: string ;
	constructor(data?);
}
declare class S2CWhisper
{
	Tag: number;
	M: WhisperMsg ;
	constructor(data?);
}
declare class C2SGetWhisper
{
	PlayerId: number;
	constructor(data?);
}
declare class S2CGetWhisper
{
	m: Array<WhisperMsg>;
	TargetId: number;
	constructor(data?);
}
declare class S2CAllUnreadWhisper
{
	m: Array<WhisperMsg>;
	constructor(data?);
}
declare class C2SGetOnlineStatus
{
	UidList: Array<number>;
	constructor(data?);
}
declare class PlayerOnlineStatus
{
	Uid: number;
	Status: number;
	constructor(data?);
}
declare class S2CGetOnlineStatus
{
	List: Array<PlayerOnlineStatus>;
	constructor(data?);
}
declare class C2SRemoveWhisper
{
	PlayerId: number;
	constructor(data?);
}
declare class S2CRemoveWhisper
{
	Tag: number;
	constructor(data?);
}
declare class RoleBag
{
	Items: Array<ItemData>;
	Size: number;
	Auto: number;
	BeastSize: number;
	HuanLingSize: number;
	constructor(data?);
}
declare class BagChange
{
	T: number;
	Item: ItemData ;
	constructor(data?);
}
declare class S2CBagChange
{
	Change: Array<BagChange>;
	constructor(data?);
}
declare class S2CNewItem
{
	Change: Array<BagChange>;
	constructor(data?);
}
declare class C2SRemItemNew
{
	Id: string ;
	constructor(data?);
}
declare class S2CRemItemNew
{
	Tag: number;
	Id: string ;
	constructor(data?);
}
declare class C2SUserBag
{
	constructor(data?);
}
declare class S2CUserBag
{
	Bag: RoleBag ;
	Init: number;
	End: number;
	constructor(data?);
}
declare class C2SExtendBag
{
	Count: number;
	constructor(data?);
}
declare class S2CExtendBag
{
	Tag: number;
	Size: number;
	constructor(data?);
}
declare class C2SExtendEquipBag
{
	Type: number;
	Count: number;
	constructor(data?);
}
declare class S2CExtendEquipBag
{
	Tag: number;
	Type: number;
	Size: number;
	constructor(data?);
}
declare class C2SBagEquipBreak
{
	Type: number;
	ItemIds: Array<string>;
	constructor(data?);
}
declare class S2CBagEquipBreak
{
	Tag: number;
	Type: number;
	constructor(data?);
}
declare class C2SExchange
{
	ItemID: string ;
	Count: number;
	Param1: number;
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
declare class C2SGoldBag
{
	Buy: number;
	constructor(data?);
}
declare class S2CGoldBag
{
	Tag: number;
	constructor(data?);
}
declare class C2SGetGoldBagInfo
{
	constructor(data?);
}
declare class S2CGetGoldBagInfo
{
	TodayRamin: number;
	NextVipTimes: number;
	constructor(data?);
}
declare class C2SCurrencyExchange
{
	ExchangeId: number;
	constructor(data?);
}
declare class S2CCurrencyExchange
{
	Tag: number;
	constructor(data?);
}
declare class ItemSell
{
	SItemId: string ;
	ItemNum: number;
	constructor(data?);
}
declare class C2SItemSell
{
	ItemSell: Array<ItemSell>;
	constructor(data?);
}
declare class S2CItemSell
{
	Tag: number;
	constructor(data?);
}
declare class C2SWearEquip
{
	Type: number;
	constructor(data?);
}
declare class S2CWearEquip
{
	Tag: number;
	constructor(data?);
}
declare class C2SWearOneEquip
{
	ItemId: Array<string>;
	constructor(data?);
}
declare class S2CWearOneEquip
{
	Tag: number;
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
	NewEquip: Array<ItemData>;
	constructor(data?);
}
declare class S2CAutoMeltGain
{
	Items: Array<ItemData>;
	constructor(data?);
}
declare class C2SMeltRecord
{
	constructor(data?);
}
declare class S2CMeltRecord
{
	Tag: number;
	Record: Array<MeltRecord>;
	constructor(data?);
}
declare class MeltRecord
{
	Nick: string ;
	Equip: ItemData ;
	constructor(data?);
}
declare class C2SMeltSetting
{
	Type: number;
	Value: number;
	constructor(data?);
}
declare class S2CMeltSetting
{
	Tag: number;
	constructor(data?);
}
declare class C2SOpenTreasure
{
	ItemID: string ;
	Count: number;
	constructor(data?);
}
declare class S2COpenTreasure
{
	Tag: number;
	constructor(data?);
}
declare class C2SAutoMelt
{
	constructor(data?);
}
declare class S2CAutoMelt
{
	Tag: number;
	Auto: number;
	Melt: number;
	constructor(data?);
}
declare class C2SGetBattlePrize
{
	constructor(data?);
}
declare class ItemFly
{
	Item: Array<ItemNum>;
	constructor(data?);
}
declare class C2SItemStick
{
	Id: number;
	Times: number;
	constructor(data?);
}
declare class S2CItemStick
{
	Tag: number;
	Id: number;
	Times: number;
	constructor(data?);
}
declare class EquipPos
{
	Pos: number;
	StrengthLevel: number;
	Attr: Array<IntAttrQ>;
	Stone: Array<number>;
	Steel: number;
	MaxSteel: number;
	ForgeLevel: number;
	MaxReborn: number;
	maxStar: number;
	EquipDuJin: EquipDuJin ;
	EquipZhuHun: EquipZhuHun ;
	EquipJingLian: EquipJingLian ;
	constructor(data?);
}
declare class IntAttrQ
{
	k: number;
	v: number;
	q: number;
	constructor(data?);
}
declare class S2CEquipPosInfo
{
	EquipPos: Array<EquipPos>;
	constructor(data?);
}
declare class C2SEquipSteel
{
	Pos: number;
	Luck: number;
	Auto: number;
	Gold: number;
	constructor(data?);
}
declare class S2CEquipSteel
{
	Tag: number;
	Success: number;
	Pos: number;
	Steel: number;
	constructor(data?);
}
declare class C2SEquipStarGive
{
	Id1: string ;
	Id2: string ;
	constructor(data?);
}
declare class S2CEquipStarGive
{
	Tag: number;
	Id1: string ;
	Id2: string ;
	constructor(data?);
}
declare class C2SEquipRiseStar
{
	Quality: number;
	Reborn: number;
	Star: number;
	EquipPart: number;
	Id1: string ;
	Id2: string ;
	Id3: string ;
	constructor(data?);
}
declare class S2CEquipRiseStar
{
	Tag: number;
	Id: string ;
	constructor(data?);
}
declare class C2SEquipOneKeyRiseStar
{
	Quality: number;
	Reborn: number;
	Star: number;
	EquipPart: number;
	constructor(data?);
}
declare class S2CEquipOneKeyRiseStar
{
	Tag: number;
	Ids: Array<string>;
	constructor(data?);
}
declare class C2SEquipOneKeyRiseStarRobot
{
	constructor(data?);
}
declare class S2CEquipOneKeyRiseStarRobot
{
	Tag: number;
	constructor(data?);
}
declare class C2SEquipBuild
{
	EquipSys: number;
	EquipLevel: number;
	EquipPart: number;
	PrefBuild: number;
	ExcBuild: number;
	constructor(data?);
}
declare class S2CEquipBuild
{
	Tag: number;
	Id: string ;
	constructor(data?);
}
declare class C2SEquipStrength
{
	Pos: number;
	constructor(data?);
}
declare class S2CEquipStrength
{
	Tag: number;
	Pos: number;
	StrengthLevel: number;
	constructor(data?);
}
declare class C2SEquipStrengthOneKey
{
	constructor(data?);
}
declare class S2CEquipStrengthOneKey
{
	Tag: number;
	Pos: Array<number>;
	constructor(data?);
}
declare class C2SEquipStrengthSuit
{
	constructor(data?);
}
declare class S2CEquipStrengthSuit
{
	Tag: number;
	Level: number;
	constructor(data?);
}
declare class C2SEquipForge
{
	Pos: number;
	T: number;
	LockAttr: Array<number>;
	Luck: number;
	constructor(data?);
}
declare class S2CEquipForge
{
	Tag: number;
	Pos: number;
	T: number;
	LockAttr: Array<number>;
	Attr: Array<IntAttrQ>;
	constructor(data?);
}
declare class C2SEquipForgeLevel
{
	Pos: number;
	constructor(data?);
}
declare class S2CEquipForgeLevel
{
	Tag: number;
	Pos: number;
	constructor(data?);
}
declare class C2SEquipForgeOpen
{
	constructor(data?);
}
declare class C2SEquipStoneWearChange
{
	constructor(data?);
}
declare class S2CEquipStoneWearChange
{
	Tag: number;
	constructor(data?);
}
declare class C2SEquipStoneStickChange
{
	constructor(data?);
}
declare class S2CEquipStoneStickChange
{
	Tag: number;
	constructor(data?);
}
declare class C2SEquipStoneStick
{
	Id: number;
	Times: number;
	constructor(data?);
}
declare class S2CEquipStoneStick
{
	Tag: number;
	Id: number;
	constructor(data?);
}
declare class C2SGetShopMallTypeList
{
	constructor(data?);
}
declare class S2CGetShopMallTypeList
{
	MallTypeIdList: Array<number>;
	constructor(data?);
}
declare class C2SGetShopMallList
{
	MallType: number;
	constructor(data?);
}
declare class ShopGoodsInfo
{
	GoodsId: number;
	LimitBuy: number;
	LimitUseTimes: number;
	LimitTotalTimes: number;
	LimitTimesType: number;
	MallType: number;
	Sort: number;
	constructor(data?);
}
declare class S2CGetShopMallList
{
	GoodsData: Array<ShopGoodsInfo>;
	LimitValue: number;
	MallType: number;
	constructor(data?);
}
declare class C2SShopBuy
{
	GoodsId: number;
	Num: number;
	constructor(data?);
}
declare class S2CShopBuy
{
	Tag: number;
	GoodsId: number;
	LimitBuy: number;
	LimitUseTimes: number;
	LimitTotalTimes: number;
	LimitTimesType: number;
	MallType: number;
	constructor(data?);
}
declare class C2SGetGoodsLimit
{
	GoodsId: number;
	constructor(data?);
}
declare class S2CGetGoodsLimit
{
	Tag: number;
	LimitUseTimes: number;
	LimitTotalTimes: number;
	LimitTimesType: number;
	constructor(data?);
}
declare class C2SGetSendShopList
{
	Td: number;
	Page: number;
	Size: number;
	constructor(data?);
}
declare class SendShopGroup
{
	Iid: number;
	Sn: number;
	M: number;
	constructor(data?);
}
declare class S2CGetSendShopList
{
	List: Array<SendShopGroup>;
	Td: number;
	Tag: number;
	Page: number;
	Total: number;
	constructor(data?);
}
declare class C2SGetSendShopById
{
	Iid: number;
	Page: number;
	Size: number;
	constructor(data?);
}
declare class SendShopSingle
{
	ItemData: ItemData ;
	P: number;
	Ln: number;
	N: number;
	Et: number;
	Lid: string ;
	constructor(data?);
}
declare class S2CGetSendShopById
{
	Iid: number;
	List: Array<SendShopSingle>;
	Page: number;
	Total: number;
	constructor(data?);
}
declare class SellItem
{
	ItemData: ItemData ;
	L: number;
	U: number;
	P: number;
	OtherList: Array<SendShopSingle>;
	constructor(data?);
}
declare class C2SGetMySendShop
{
	constructor(data?);
}
declare class S2CGetMySendShop
{
	List: Array<SendShopSingle>;
	ItemList: Array<SellItem>;
	Lt: number;
	constructor(data?);
}
declare class C2SSendShopOnSale
{
	ItemData: ItemData ;
	P: number;
	constructor(data?);
}
declare class S2CSendShopOnSale
{
	Tag: number;
	SaleCount: number;
	constructor(data?);
}
declare class C2SSendShopBuy
{
	Lid: string ;
	N: number;
	constructor(data?);
}
declare class S2CSendShopBuy
{
	Tag: number;
	constructor(data?);
}
declare class C2SSendShopClear
{
	Lid: string ;
	IsLower: number;
	constructor(data?);
}
declare class S2CSendShopClear
{
	Tag: number;
	IsLower: number;
	constructor(data?);
}
declare class SaleItemLog
{
	Iid: number;
	N: number;
	Gn: number;
	St: number;
	constructor(data?);
}
declare class C2SSaleLog
{
	constructor(data?);
}
declare class S2CSaleLog
{
	List: Array<SaleItemLog>;
	constructor(data?);
}
declare class C2SMarkSendShop
{
	Iid: number;
	A: number;
	constructor(data?);
}
declare class S2CMarkSendShop
{
	Tag: number;
	Iid: number;
	A: number;
	constructor(data?);
}
declare class C2SGetSendCfg
{
	ItemId: number;
	constructor(data?);
}
declare class S2CGetSendCfg
{
	T: number;
	constructor(data?);
}
declare class SendUserInfo
{
	UserId: number;
	Nick: string ;
	FightValue: number;
	Level: number;
	VipLevel: number;
	RoleId: number;
	GodLevel: number;
	AreaId: number;
	ServerId: number;
	RealmLevel: number;
	Reborn: number;
	Break: number;
	HideVIP: number;
	constructor(data?);
}
declare class C2SGetSendUserInfo
{
	UseId: number;
	constructor(data?);
}
declare class S2CGetSendUserInfo
{
	Tag: number;
	Info: SendUserInfo ;
	constructor(data?);
}
declare class C2SSendItem
{
	Uid: number;
	Iid: number;
	In: number;
	constructor(data?);
}
declare class S2CSendItem
{
	Tag: number;
	constructor(data?);
}
declare class S2CCounter
{
	T: number;
	C: number;
	P: number;
	constructor(data?);
}
declare class S2CTask
{
	Id: number;
	T: number;
	S: number;
	IC: number;
	constructor(data?);
}
declare class C2SGetTaskPrize
{
	TaskId: number;
	TaskType: number;
	Multi: number;
	constructor(data?);
}
declare class S2CGetTaskPrize
{
	Tag: number;
	Prize: Array<ItemInfo>;
	constructor(data?);
}
declare class C2SHistoryTaskInfo
{
	constructor(data?);
}
declare class S2CHistoryTaskInfo
{
	MainTaskId: number;
	NowStage: number;
	NewMapId: number;
	WaitId: number;
	TaskStage: number;
	constructor(data?);
}
declare class C2SGetHistoryTaskPrize
{
	TaskId: number;
	constructor(data?);
}
declare class S2CGetHistoryTaskPrize
{
	Tag: number;
	Prize: Array<ItemInfo>;
	NextTask: S2CTask ;
	constructor(data?);
}
declare class C2SRobotCompleteTask
{
	TaskId: number;
	TaskType: number;
	constructor(data?);
}
declare class S2CRobotCompleteTask
{
	Tag: number;
	constructor(data?);
}
declare class LifeRemain
{
	TaskId: number;
	Type: number;
	Times: number;
	constructor(data?);
}
declare class S2CLastDayRemain
{
	List: Array<LifeRemain>;
	constructor(data?);
}
declare class C2SLifeFind
{
	TaskId: number;
	Type: number;
	Count: number;
	constructor(data?);
}
declare class S2CLifeFind
{
	Tag: number;
	Remain: LifeRemain ;
	constructor(data?);
}
declare class C2SLifeFastFind
{
	constructor(data?);
}
declare class S2CLifeFastFind
{
	Tag: number;
	constructor(data?);
}
declare class C2SWorldLevel
{
	constructor(data?);
}
declare class WorldLevel
{
	Level: number;
	Players: Array<Rank>;
	constructor(data?);
}
declare class C2SPeaceFinish
{
	constructor(data?);
}
declare class S2CPeaceFinish
{
	Tag: number;
	constructor(data?);
}
declare class SMMonster
{
	Id: number;
	Star: number;
	constructor(data?);
}
declare class S2CSMMonster
{
	Monster: Array<SMMonster>;
	constructor(data?);
}
declare class C2SSMFight
{
	Monster: SMMonster ;
	constructor(data?);
}
declare class S2CSMFight
{
	Tag: number;
	Prize: Array<ItemInfo>;
	constructor(data?);
}
declare class C2SSMRefreshStar
{
	Monster: SMMonster ;
	constructor(data?);
}
declare class S2CSMRefreshStar
{
	Tag: number;
	OldMonster: SMMonster ;
	NewMonster: SMMonster ;
	constructor(data?);
}
declare class C2SSMFastFinish
{
	constructor(data?);
}
declare class S2CSMFastFinish
{
	Tag: number;
	Prize: Array<ItemInfo>;
	constructor(data?);
}
declare class MailInfo
{
	MailId: number;
	MailTplId: number;
	MailTplParam: string ;
	Title: string ;
	MailType: number;
	IsRead: number;
	IsReceive: number;
	ReceiveTime: string ;
	Content: string ;
	AttachInfo: Array<ItemInfo>;
	AttachData: Array<ItemData>;
	constructor(data?);
}
declare class C2SMailList
{
	MailType: number;
	constructor(data?);
}
declare class S2CMailList
{
	MailList: Array<MailInfo>;
	constructor(data?);
}
declare class C2SGetMailAttach
{
	MailId: number;
	MailType: number;
	constructor(data?);
}
declare class S2CGetMailAttach
{
	Tag: number;
	constructor(data?);
}
declare class C2SReadMail
{
	MailId: number;
	MailType: number;
	constructor(data?);
}
declare class S2CReadMail
{
	Tag: number;
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
	constructor(data?);
}
declare class C2SGM
{
	Data: string ;
	constructor(data?);
}
declare class S2CNewMail
{
	constructor(data?);
}
declare class BossGoodDrop
{
	IT: string ;
	Nick: string ;
	Time: number;
	Item: number;
	World: string ;
	constructor(data?);
}
declare class C2SGetBossGoodDrop
{
	constructor(data?);
}
declare class S2CGetBossGoodDrop
{
	List: Array<BossGoodDrop>;
	constructor(data?);
}
declare class BossPersonalInfo
{
	Id: number;
	K: number;
	L: number;
	NT: number;
	constructor(data?);
}
declare class S2CBossPersonalInfo
{
	Items: Array<BossPersonalInfo>;
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
	Win: number;
	NT: number;
	constructor(data?);
}
declare class C2SBossPersonalSweep
{
	constructor(data?);
}
declare class S2CBossPersonalSweep
{
	Tag: number;
	Ids: Array<BossPersonalInfo>;
	constructor(data?);
}
declare class BossVipInfo
{
	Id: number;
	K: number;
	L: number;
	NT: number;
	constructor(data?);
}
declare class S2CBossVipInfo
{
	Items: Array<BossVipInfo>;
	constructor(data?);
}
declare class C2SBossVipStart
{
	Id: number;
	constructor(data?);
}
declare class S2CBossVipStart
{
	Tag: number;
	Id: number;
	Win: number;
	NT: number;
	constructor(data?);
}
declare class C2SBossVipSweep
{
	constructor(data?);
}
declare class S2CBossVipSweep
{
	Tag: number;
	Ids: Array<BossVipInfo>;
	constructor(data?);
}
declare class MultiBossInfo
{
	Id: number;
	CurrHp: number;
	MaxHP: number;
	Num: number;
	ReliveTimestamp: number;
	RunAwayTimestamp: number;
	State: number;
	LastNick: string ;
	LastUserId: number;
	constructor(data?);
}
declare class C2SMultiBossInfo
{
	constructor(data?);
}
declare class S2CMultiBossInfo
{
	Items: Array<MultiBossInfo>;
	constructor(data?);
}
declare class C2SMultiBossPlayerInBoss
{
	constructor(data?);
}
declare class S2CMultiBossPlayerInBoss
{
	BossId: number;
	DamageOrder: number;
	Damage: number;
	constructor(data?);
}
declare class C2SMultiBossJoinScene
{
	Id: number;
	constructor(data?);
}
declare class S2CMultiBossJoinScene
{
	Tag: number;
	Id: number;
	constructor(data?);
}
declare class C2SMultiBossLeaveScene
{
	Id: number;
	constructor(data?);
}
declare class S2CMultiBossLeaveScene
{
	Tag: number;
	constructor(data?);
}
declare class C2SMultiBossStart
{
	Id: number;
	constructor(data?);
}
declare class S2CMultiBossStart
{
	Tag: number;
	constructor(data?);
}
declare class C2SMultiBossInspire
{
	Id: number;
	InspireType: number;
	constructor(data?);
}
declare class S2CMultiBossInspire
{
	Tag: number;
	Id: number;
	IsInspireOpen: number;
	InspireTimestamp: number;
	constructor(data?);
}
declare class C2SMultiBossCfg
{
	Cfg: string ;
	constructor(data?);
}
declare class C2SMultiBossGetBuyInfo
{
	constructor(data?);
}
declare class S2CMultiBossGetBuyInfo
{
	Coin: number;
	CoinType: number;
	Times: number;
	LeftTimes: number;
	TotalTimes: number;
	NoticeTimes: number;
	NoticeVip: number;
	constructor(data?);
}
declare class C2SMultiBossBuyTimes
{
	Num: number;
	constructor(data?);
}
declare class S2CMultiBossBuyTimes
{
	Tag: number;
	constructor(data?);
}
declare class MultiBossDamageRank
{
	UserId: number;
	DamageTime: number;
	Nick: string ;
	Damage: number;
	Head: number;
	HeadFrame: number;
	World: string ;
	constructor(data?);
}
declare class C2SMultiBossGetDamageLog
{
	Id: number;
	constructor(data?);
}
declare class S2CMultiBossGetDamageLog
{
	BossId: number;
	BossState: number;
	Items: Array<MultiBossDamageRank>;
	MyDamage: number;
	constructor(data?);
}
declare class S2CMultiBossGetMyDamage
{
	BossId: number;
	MyDamage: number;
	constructor(data?);
}
declare class C2SBossInspire
{
	InstanceId: string ;
	InspireType: number;
	constructor(data?);
}
declare class S2CBossInspire
{
	Tag: number;
	InstanceId: string ;
	InspireType: number;
	IsInspireOpen: number;
	InspireTimestamp: number;
	constructor(data?);
}
declare class EnemyData
{
	UserId: number;
	Nick: string ;
	EnmityPlace: string ;
	constructor(data?);
}
declare class S2CAddEnemy
{
	data: EnemyData ;
	constructor(data?);
}
declare class WorldBossOwnerData
{
	UserId: number;
	Nick: string ;
	AreaId: number;
	ShowHead: number;
	ShowHeadFrame: number;
	Hp: number;
	World: string ;
	constructor(data?);
}
declare class S2CWorldBossOwner
{
	Data: WorldBossOwnerData ;
	constructor(data?);
}
declare class WorldBossReachGoalPrize
{
	Id: number;
	State: number;
	constructor(data?);
}
declare class S2CWorldBossReachGoalPrize
{
	FightTimes: number;
	Items: Array<WorldBossReachGoalPrize>;
	constructor(data?);
}
declare class C2SWorldBossReachGoalGetPrize
{
	Id: number;
	constructor(data?);
}
declare class S2CWorldBossReachGoalGetPrize
{
	Tag: number;
	Id: number;
	constructor(data?);
}
declare class WorldBossBreakShieldOwnerData
{
	UserId: number;
	Nick: string ;
	AreaId: number;
	Points: number;
	World: string ;
	constructor(data?);
}
declare class S2CWorldBossBreakShieldInfo
{
	OverTimestamp: number;
	Owner: WorldBossBreakShieldOwnerData ;
	MyState: number;
	MyPoints: number;
	constructor(data?);
}
declare class C2SWorldBossStakePoints
{
	Op: number;
	constructor(data?);
}
declare class S2CWorldBossStakePoints
{
	Tag: number;
	State: number;
	Points: number;
	constructor(data?);
}
declare class S2CWorldBossLevel
{
	Level: number;
	constructor(data?);
}
declare class S2CBossRefreshTime
{
	RefreshTime: number;
	constructor(data?);
}
declare class S2CWorldBossEnd
{
	Tag: number;
	SceneCloseTime: number;
	constructor(data?);
}
declare class S2CWorldBossCloseScene
{
	Tag: number;
	constructor(data?);
}
declare class HomeBossInfo
{
	HomeId: number;
	BossId: number;
	CurrHp: number;
	MaxHP: number;
	BossOwner: HomeBossOwnerData ;
	State: number;
	ReliveTimestamp: number;
	MonsterLevel: number;
	constructor(data?);
}
declare class S2CHomeBossInfo
{
	Items: Array<HomeBossInfo>;
	constructor(data?);
}
declare class C2SBossHomeJoinScene
{
	HomeId: number;
	constructor(data?);
}
declare class S2CBossHomeJoinScene
{
	Tag: number;
	HomeId: number;
	constructor(data?);
}
declare class C2SBossHomeLeaveScene
{
	HomeId: number;
	constructor(data?);
}
declare class S2CBossHomeLeaveScene
{
	Tag: number;
	HomeId: number;
	constructor(data?);
}
declare class HomeBossDamage
{
	UserId: number;
	DamageTime: number;
	Nick: string ;
	Damage: number;
	AreaId: number;
	ShowHead: number;
	ShowHeadFrame: number;
	World: string ;
	constructor(data?);
}
declare class S2CHomeBossDamageRank
{
	HomeId: number;
	BossId: number;
	Items: Array<HomeBossDamage>;
	constructor(data?);
}
declare class S2CHomeBossDamageMy
{
	HomeId: number;
	BossId: number;
	MyDamage: number;
	constructor(data?);
}
declare class HomeBossOwnerData
{
	UserId: number;
	Nick: string ;
	AreaId: number;
	ShowHead: number;
	ShowHeadFrame: number;
	Hp: number;
	World: string ;
	constructor(data?);
}
declare class S2CHomeBossOwner
{
	HomeId: number;
	BossId: number;
	Data: HomeBossOwnerData ;
	constructor(data?);
}
declare class C2SHomeBossBuyBodyPower
{
	constructor(data?);
}
declare class S2CHomeBossBodyPower
{
	Tag: number;
	constructor(data?);
}
declare class C2SHomeBossAutoBuy
{
	AutoBuy: number;
	constructor(data?);
}
declare class S2CHomeBossAutoBuy
{
	Tag: number;
	AutoBuy: number;
	constructor(data?);
}
declare class S2CHomeBossIfUseBodyPower
{
	KickOutTimestamp: number;
	HomeId: number;
	constructor(data?);
}
declare class C2SHomeBossIfUseBodyPower
{
	Use: number;
	HomeId: number;
	constructor(data?);
}
declare class S2CHomeBossTempBagAdd
{
	Items: Array<ItemData>;
	constructor(data?);
}
declare class C2SHomeBossGetTempBag
{
	constructor(data?);
}
declare class S2CHomeBossGetTempBag
{
	Items: Array<ItemData>;
	constructor(data?);
}
declare class C2SHomeBossReceiveTempBag
{
	constructor(data?);
}
declare class S2CHomeBossReceiveTempBag
{
	Tag: number;
	constructor(data?);
}
declare class C2SBossHomeCfg
{
	Cfg: string ;
	constructor(data?);
}
declare class WorldBossRankData
{
	UserId: number;
	Nick: string ;
	RoleId: number;
	Damage: number;
	AreaId: number;
	World: string ;
	constructor(data?);
}
declare class S2CWorldBossRank5
{
	Rank: Array<WorldBossRankData>;
	constructor(data?);
}
declare class S2CActWorldBossSettlement
{
	KillNick: string ;
	KillGang: string ;
	KillAreaId: number;
	FirstNick: string ;
	FirstGang: string ;
	FirstAreaId: number;
	Rank: number;
	IsKill: number;
	KillRoleId: number;
	FirstRoleId: number;
	constructor(data?);
}
declare class WorldBossKillData
{
	UserId: number;
	Nick: string ;
	GangName: string ;
	AreaId: number;
	World: string ;
	constructor(data?);
}
declare class C2SGetWorldBossKillData
{
	constructor(data?);
}
declare class S2CGetWorldBossKillData
{
	Data: WorldBossKillData ;
	constructor(data?);
}
declare class C2SGetWorldBossRank
{
	Num: number;
	constructor(data?);
}
declare class S2CGetWorldBossRank
{
	Rank: Array<WorldBossRankData>;
	SelfRank: number;
	SelfDamage: number;
	constructor(data?);
}
declare class InstanceMaterialInfo
{
	Id: number;
	K: number;
	L: number;
	V: number;
	C: number;
	T: number;
	S: number;
	E: number;
	LB: number;
	constructor(data?);
}
declare class C2SInstanceMaterialInfo
{
	constructor(data?);
}
declare class S2CInstanceMaterialInfo
{
	Items: Array<InstanceMaterialInfo>;
	constructor(data?);
}
declare class C2SInstanceMaterialFight
{
	Id: number;
	constructor(data?);
}
declare class S2CInstanceMaterialFight
{
	Tag: number;
	info: InstanceMaterialInfo ;
	constructor(data?);
}
declare class C2SInstanceMaterialSweep
{
	Id: number;
	constructor(data?);
}
declare class S2CInstanceMaterialSweep
{
	Tag: number;
	constructor(data?);
}
declare class C2SInsMatePurchase
{
	Id: number;
	constructor(data?);
}
declare class S2CInsMatePurchase
{
	Tag: number;
	FBId: number;
	constructor(data?);
}
declare class InstanceSLInfo
{
	Id: number;
	K: number;
	L: number;
	V: number;
	C: number;
	T: number;
	Max: number;
	LB: number;
	constructor(data?);
}
declare class C2SEnterSLFB
{
	Id: number;
	constructor(data?);
}
declare class S2CEnterSLFB
{
	Tag: number;
	constructor(data?);
}
declare class C2SLeaveSLFB
{
	Id: number;
	constructor(data?);
}
declare class S2CLeaveSLFB
{
	Tag: number;
	constructor(data?);
}
declare class C2SInstanceSLInfo
{
	constructor(data?);
}
declare class S2CInstanceSLInfo
{
	Items: Array<InstanceSLInfo>;
	constructor(data?);
}
declare class C2SInstanceSLFight
{
	Id: number;
	Auto: number;
	constructor(data?);
}
declare class S2CInstanceSLFight
{
	Tag: number;
	info: InstanceSLInfo ;
	constructor(data?);
}
declare class C2SInstanceSLAutoFight
{
	Id: number;
	Auto: number;
	constructor(data?);
}
declare class S2CInstanceSLAutoFight
{
	Tag: number;
	Auto: number;
	constructor(data?);
}
declare class C2SInstanceSLSweep
{
	Id: number;
	constructor(data?);
}
declare class S2CInstanceSLSweep
{
	Tag: number;
	constructor(data?);
}
declare class C2SInsSLPurchase
{
	Id: number;
	constructor(data?);
}
declare class S2CInsSLPurchase
{
	Tag: number;
	FBId: number;
	constructor(data?);
}
declare class C2SInsSLInspire
{
	Id: number;
	IsCoin3: number;
	IsCoin4: number;
	Coin3Auto: number;
	Coin4Auto: number;
	constructor(data?);
}
declare class S2CInsSLInspire
{
	Tag: number;
	Id: number;
	Coin3Times: number;
	Coin4Times: number;
	Coin3Auto: number;
	Coin4Auto: number;
	constructor(data?);
}
declare class InstanceTreasureInfo
{
	Id: number;
	S: number;
	L: number;
	constructor(data?);
}
declare class S2CInstanceTreasureInfo
{
	Items: Array<InstanceTreasureInfo>;
	B: Array<number>;
	constructor(data?);
}
declare class C2SInstanceTreasureFight
{
	Id: number;
	constructor(data?);
}
declare class S2CInstanceTreasureFight
{
	Tag: number;
	Star: number;
	Id: number;
	constructor(data?);
}
declare class C2SInstanceTreasureSweep
{
	constructor(data?);
}
declare class S2CInstanceTreasureSweep
{
	Tag: number;
	Ids: Array<number>;
	constructor(data?);
}
declare class C2SGetInstanceTreasureBox
{
	Id: number;
	constructor(data?);
}
declare class S2CGetInstanceTreasureBox
{
	Tag: number;
	Ids: Array<number>;
	constructor(data?);
}
declare class S2CInstanceHeavenlyInfo
{
	M: number;
	D: number;
	B: Array<number>;
	constructor(data?);
}
declare class C2SInstanceHeavenlyFight
{
	Id: number;
	constructor(data?);
}
declare class S2CInstanceHeavenlyFight
{
	Tag: number;
	Id: number;
	Win: number;
	constructor(data?);
}
declare class C2SInstanceHeavenlySweep
{
	constructor(data?);
}
declare class S2CInstanceHeavenlySweep
{
	Tag: number;
	D: number;
	constructor(data?);
}
declare class C2SGetInstanceHeavenlyBox
{
	Id: number;
	constructor(data?);
}
declare class S2CGetInstanceHeavenlyBox
{
	Tag: number;
	Id: number;
	constructor(data?);
}
declare class S2CInstanceDemonInfo
{
	M: number;
	D: number;
	B: Array<number>;
	constructor(data?);
}
declare class C2SInstanceDemonFight
{
	Id: number;
	constructor(data?);
}
declare class S2CInstanceDemonFight
{
	Tag: number;
	Id: number;
	Win: number;
	constructor(data?);
}
declare class C2SInstanceDemonSweep
{
	constructor(data?);
}
declare class S2CInstanceDemonSweep
{
	Tag: number;
	D: number;
	constructor(data?);
}
declare class C2SGetInstanceDemonBox
{
	Id: number;
	constructor(data?);
}
declare class S2CGetInstanceDemonBox
{
	Tag: number;
	Id: number;
	constructor(data?);
}
declare class S2CInstanceTowerInfo
{
	M: number;
	constructor(data?);
}
declare class C2SInstanceTowerFight
{
	Id: number;
	constructor(data?);
}
declare class S2CInstanceTowerFight
{
	Tag: number;
	Id: number;
	Win: number;
	constructor(data?);
}
declare class Partner
{
	Id: number;
	T: number;
	L: number;
	E: number;
	AS: Array<Skill>;
	PS: Array<Skill>;
	PS2: Array<Skill>;
	R: number;
	B: number;
	S: number;
	SE: number;
	G: number;
	GE: number;
	N: string ;
	M: number;
	Use: number;
	Sex: number;
	constructor(data?);
}
declare class C2SGetAllPartnerByType
{
	Type: number;
	constructor(data?);
}
declare class S2CGetAllPartnerByType
{
	Partners: Array<Partner>;
	constructor(data?);
}
declare class C2SGetPartner
{
	Id: number;
	Type: number;
	constructor(data?);
}
declare class S2CGetPartner
{
	P: Partner ;
	constructor(data?);
}
declare class C2SPartnerLevelUp
{
	Id: number;
	Type: number;
	Auto: number;
	Times: number;
	ItemId: number;
	constructor(data?);
}
declare class S2CPartnerLevelUp
{
	Tag: number;
	Id: number;
	Type: number;
	L: number;
	E: number;
	PassiveSkills: Array<Skill>;
	constructor(data?);
}
declare class C2SPartnerStarUp
{
	Id: number;
	Type: number;
	constructor(data?);
}
declare class S2CPartnerStarUp
{
	Tag: number;
	Id: number;
	Type: number;
	S: number;
	SE: number;
	ActiveSkills: Array<Skill>;
	constructor(data?);
}
declare class C2SPartnerGradeUp
{
	Id: number;
	Type: number;
	constructor(data?);
}
declare class S2CPartnerGradeUp
{
	Tag: number;
	Id: number;
	Type: number;
	G: number;
	GE: number;
	constructor(data?);
}
declare class C2SPartnerBattlePos
{
	Id: number;
	Type: number;
	Pos: number;
	constructor(data?);
}
declare class S2CPartnerBattlePos
{
	Tag: number;
	Id: number;
	Type: number;
	RestId: number;
	Pos: number;
	constructor(data?);
}
declare class C2SPartnerBattlePosRobot
{
	Type: number;
	constructor(data?);
}
declare class C2SPartnerRefreshSkill
{
	Id: number;
	Type: number;
	RefreshType: number;
	LockSkills: Array<Skill>;
	Auto: number;
	constructor(data?);
}
declare class S2CPartnerRefreshSkill
{
	Tag: number;
	Skills: Array<Skill>;
	Id: number;
	Type: number;
	RefreshType: number;
	LockSkills: Array<Skill>;
	Times: number;
	constructor(data?);
}
declare class C2SPartnerDelSkill
{
	Id: number;
	SkillId: number;
	constructor(data?);
}
declare class S2CPartnerDelSkill
{
	Tag: number;
	Id: number;
	Skills: Array<Skill>;
	constructor(data?);
}
declare class C2SPartnerUpSkill
{
	Id: number;
	SkillId: number;
	constructor(data?);
}
declare class S2CPartnerUpSkill
{
	Tag: number;
	Id: number;
	Skills: Array<Skill>;
	constructor(data?);
}
declare class C2SPartnerReplaceSkill
{
	Id: number;
	Type: number;
	constructor(data?);
}
declare class S2CPartnerReplaceSkill
{
	Tag: number;
	Id: number;
	Type: number;
	PS: Array<Skill>;
	constructor(data?);
}
declare class C2SPartnerNick
{
	Id: number;
	Type: number;
	N: string ;
	constructor(data?);
}
declare class S2CPartnerNick
{
	Tag: number;
	Id: number;
	Type: number;
	N: string ;
	constructor(data?);
}
declare class C2SPartnerSuit
{
	Id: number;
	constructor(data?);
}
declare class S2CPartnerSuit
{
	Tag: number;
	Id: number;
	constructor(data?);
}
declare class C2SPartnerSuitRobot
{
	constructor(data?);
}
declare class C2SUnlockNewPartner
{
	Id: number;
	Type: number;
	constructor(data?);
}
declare class S2CUnlockNewPartner
{
	Tag: number;
	Id: number;
	Type: number;
	constructor(data?);
}
declare class C2SStickPartner
{
	Id: number;
	Type: number;
	constructor(data?);
}
declare class S2CStickPartner
{
	Tag: number;
	Id: number;
	Type: number;
	constructor(data?);
}
declare class S2CPartnerNewSkill
{
	Type: number;
	Id: number;
	PS: Array<Skill>;
	constructor(data?);
}
declare class PetA
{
	P: Partner ;
	constructor(data?);
}
declare class C2SUserPetA
{
	constructor(data?);
}
declare class S2CUserPetA
{
	P: Array<PetA>;
	constructor(data?);
}
declare class C2SGetPetAInfo
{
	Id: number;
	constructor(data?);
}
declare class S2CGetPetAInfo
{
	Tag: number;
	P: PetA ;
	constructor(data?);
}
declare class C2SUnlockNewPetA
{
	Id: number;
	constructor(data?);
}
declare class S2CUnlockNewPetA
{
	Tag: number;
	Id: number;
	P: PetA ;
	constructor(data?);
}
declare class C2SPetABattlePos
{
	Id: number;
	Pos: number;
	constructor(data?);
}
declare class S2CPetABattlePos
{
	Tag: number;
	Id: number;
	RestId: number;
	Pos: number;
	constructor(data?);
}
declare class C2SPetALevelUp
{
	Id: number;
	Auto: number;
	Times: number;
	constructor(data?);
}
declare class S2CPetALevelUp
{
	Tag: number;
	Id: number;
	Level: number;
	Exp: number;
	constructor(data?);
}
declare class C2SPetAStarUp
{
	Id: number;
	constructor(data?);
}
declare class S2CPetAStarUp
{
	Tag: number;
	Id: number;
	Star: number;
	Exp: number;
	constructor(data?);
}
declare class C2SGetPetAMergeInfo
{
	constructor(data?);
}
declare class S2CGetPetAMergeInfo
{
	Tag: number;
	PetAMerge: PetAMerge ;
	constructor(data?);
}
declare class C2SGetPetAMergeFv
{
	constructor(data?);
}
declare class S2CGetPetAMergeFv
{
	Fv: number;
	BaseFv: number;
	ActiveFv: number;
	AwakeFv: number;
	constructor(data?);
}
declare class C2SPetAMergeUp
{
	Pos: number;
	PetAId: number;
	constructor(data?);
}
declare class S2CPetAMergeUp
{
	Tag: number;
	Pos: number;
	PetAId: number;
	constructor(data?);
}
declare class C2SPetAMergeActive
{
	constructor(data?);
}
declare class S2CPetAMergeActive
{
	Tag: number;
	PetAMergeId: number;
	constructor(data?);
}
declare class Devil
{
	P: Partner ;
	constructor(data?);
}
declare class S2CUserDevil
{
	P: Array<Devil>;
	DevilPos: Array<DevilPos>;
	constructor(data?);
}
declare class C2SDevilAwake
{
	constructor(data?);
}
declare class S2CDevilAwake
{
	Tag: number;
	constructor(data?);
}
declare class C2SDevilLevelUp
{
	Id: number;
	Item: Array<ItemInfo>;
	constructor(data?);
}
declare class S2CDevilLevelUp
{
	Tag: number;
	Id: number;
	L: number;
	E: number;
	constructor(data?);
}
declare class DevilPos
{
	T: number;
	Id: number;
	constructor(data?);
}
declare class C2SDevilPos
{
	T: number;
	Id: number;
	constructor(data?);
}
declare class S2CDevilPos
{
	Tag: number;
	DevilPos: Array<DevilPos>;
	constructor(data?);
}
declare class C2SDevilSoulPos
{
	Pos: number;
	Id: string ;
	constructor(data?);
}
declare class S2CDevilSoulPos
{
	Tag: number;
	constructor(data?);
}
declare class C2SDevilSoulDel
{
	Id: Array<string>;
	constructor(data?);
}
declare class S2CDevilSoulDel
{
	Tag: number;
	constructor(data?);
}
declare class C2SDevilSoulAuto
{
	Auto: number;
	constructor(data?);
}
declare class S2CDevilSoulAuto
{
	Tag: number;
	constructor(data?);
}
declare class C2SDevilSoulLevelUp
{
	Id: string ;
	constructor(data?);
}
declare class S2CDevilSoulLevelUp
{
	Tag: number;
	Id: string ;
	DevilSoul: ItemData ;
	constructor(data?);
}
declare class C2SDevilSoulStarUp
{
	Id: string ;
	SameId: Array<string>;
	AnyId: Array<string>;
	constructor(data?);
}
declare class S2CDevilSoulStarUp
{
	Tag: number;
	Id: string ;
	DevilSoul: ItemData ;
	constructor(data?);
}
declare class SkyGod
{
	P: Partner ;
	constructor(data?);
}
declare class S2CUserSkyGod
{
	P: Array<SkyGod>;
	constructor(data?);
}
declare class MasterPupilList
{
	U: number;
	N: string ;
	L: number;
	OnlineState: number;
	IsMaster: number;
	IsGiveExp: number;
	RoleId: number;
	constructor(data?);
}
declare class S2CMasterMessage
{
	OutTime: number;
	List: Array<MasterPupilList>;
	InviteList: Array<MasterArray>;
	constructor(data?);
}
declare class C2SSendMasterNotice
{
	constructor(data?);
}
declare class S2CSendMasterNotice
{
	Tag: number;
	constructor(data?);
}
declare class MasterArray
{
	U: number;
	N: string ;
	L: number;
	D: number;
	S: number;
	T: number;
	DeleteTime: number;
	constructor(data?);
}
declare class S2CMasterAds
{
	PupilList: Array<MasterArray>;
	constructor(data?);
}
declare class C2SMasterInvite
{
	U: number;
	constructor(data?);
}
declare class S2CMasterInvite
{
	Tag: number;
	constructor(data?);
}
declare class S2CInvitePupil
{
	U: number;
	N: string ;
	constructor(data?);
}
declare class C2SHandleMasterInvite
{
	U: number;
	Y: number;
	constructor(data?);
}
declare class S2CHandleMasterInvite
{
	Tag: number;
	constructor(data?);
}
declare class C2SMasterGiveExp
{
	U: number;
	constructor(data?);
}
declare class S2CMasterGiveExp
{
	Tag: number;
	constructor(data?);
}
declare class C2SGetMasterExp
{
	constructor(data?);
}
declare class S2CGetMasterExp
{
	Tag: number;
	constructor(data?);
}
declare class C2SDeletePupil
{
	U: number;
	constructor(data?);
}
declare class S2CDeletePupil
{
	Tag: number;
	constructor(data?);
}
declare class C2SDeleteMaster
{
	T: number;
	constructor(data?);
}
declare class S2CDeleteMaster
{
	Tag: number;
	constructor(data?);
}
declare class MasterTask
{
	Id: number;
	State: number;
	Count: number;
	constructor(data?);
}
declare class C2SGetPupilTask
{
	Id: number;
	constructor(data?);
}
declare class S2CGetPupilTask
{
	Tag: number;
	Task: Array<MasterTask>;
	constructor(data?);
}
declare class C2SGetMarryList
{
	constructor(data?);
}
declare class MarryList
{
	U: number;
	N: string ;
	L: number;
	F: number;
	R: number;
	constructor(data?);
}
declare class S2CGetMarryList
{
	Tag: number;
	List: Array<MarryList>;
	constructor(data?);
}
declare class C2SGetMarry
{
	I: number;
	P: number;
	U: number;
	constructor(data?);
}
declare class S2CGetMarry
{
	Tag: number;
	constructor(data?);
}
declare class S2CSendMarry
{
	I: number;
	N: string ;
	L: number;
	F: number;
	R: number;
	M: number;
	U: number;
	constructor(data?);
}
declare class C2SHandelMarry
{
	U: number;
	Y: number;
	constructor(data?);
}
declare class S2CHandelMarry
{
	Tag: number;
	constructor(data?);
}
declare class C2SSendFlower
{
	F: number;
	N: number;
	Bn: number;
	constructor(data?);
}
declare class S2CSendFlower
{
	Tag: number;
	Mv: number;
	constructor(data?);
}
declare class S2CGetFlower
{
	N: string ;
	F: number;
	NM: number;
	MV: number;
	constructor(data?);
}
declare class S2CMarryStatus
{
	U: number;
	N: string ;
	R: number;
	D: number;
	M: number;
	HL: number;
	HS: number;
	MV: number;
	Pos: number;
	LT: number;
	List: Array<HouseUpList>;
	constructor(data?);
}
declare class C2SMarryUpdate
{
	constructor(data?);
}
declare class S2CMarryUpdate
{
	Tag: number;
	constructor(data?);
}
declare class C2SHouseUpdate
{
	M: number;
	constructor(data?);
}
declare class S2CHouseUpdate
{
	Tag: number;
	constructor(data?);
}
declare class HouseUpList
{
	T: number;
	V: number;
	constructor(data?);
}
declare class C2SGetUpdate
{
	constructor(data?);
}
declare class S2CGetUpdate
{
	Tag: number;
	constructor(data?);
}
declare class S2CNewMarry
{
	U: number;
	RM: number;
	RF: number;
	HN: string ;
	WN: string ;
	constructor(data?);
}
declare class C2SSendMarryGift
{
	I: number;
	U: number;
	constructor(data?);
}
declare class S2CSendMarryGift
{
	Tag: number;
	constructor(data?);
}
declare class C2SDeleteWife
{
	constructor(data?);
}
declare class S2CDeleteWife
{
	Tag: number;
	constructor(data?);
}
declare class S2CMateOnline
{
	R: number;
	constructor(data?);
}
declare class S2CQuizAsk
{
	Qid: number;
	Num: number;
	Aid: Array<number>;
	AserTime: number;
	NextTime: number;
	constructor(data?);
}
declare class S2CQuizRank
{
	RankList: Array<QuizRank>;
	Mn: number;
	Ms: number;
	constructor(data?);
}
declare class QuizRank
{
	Nick: string ;
	Score: number;
	Num: number;
	Id: number;
	constructor(data?);
}
declare class C2SAnswerQuiz
{
	Aid: number;
	constructor(data?);
}
declare class S2CAnswerQuiz
{
	Y: number;
	constructor(data?);
}
declare class S2CQuizSum
{
	Mn: number;
	Ms: number;
	I: string ;
	constructor(data?);
}
declare class S2CQuizFirst
{
	Nick: string ;
	constructor(data?);
}
declare class S2CQuizStart
{
	constructor(data?);
}
declare class RobbedPlayer
{
	EnemyId: number;
	ProId: number;
	Y: number;
	R: number;
	LogId: number;
	N: string ;
	Idx: number;
	Prize: Array<ItemInfo>;
	AreaId: number;
	World: string ;
	constructor(data?);
}
declare class S2CWestExp
{
	Lt: number;
	Tt: number;
	Rl: number;
	Rt: number;
	IsHavePrize: number;
	St: number;
	RobberList: Array<RobbedPlayer>;
	PrayId: number;
	IsDouble: number;
	Level: number;
	constructor(data?);
}
declare class ProtectingPlayer
{
	Uid: number;
	Rid: number;
	N: string ;
	Gn: string ;
	Fv: number;
	I: number;
	Pt: number;
	C: number;
	PrayId: number;
	IsDouble: number;
	Head: number;
	HeadFrame: number;
	AreaId: number;
	Level: number;
	World: string ;
	constructor(data?);
}
declare class C2SGetProtectPlayer
{
	constructor(data?);
}
declare class S2CGetProtectPlayer
{
	List: Array<ProtectingPlayer>;
	constructor(data?);
}
declare class S2CNewProtectPlayer
{
	List: ProtectingPlayer ;
	constructor(data?);
}
declare class S2CEndProtectPlayer
{
	Uid: number;
	constructor(data?);
}
declare class C2SGetWestExp
{
	GetType: number;
	constructor(data?);
}
declare class S2CGetWestExp
{
	Tag: number;
	I: number;
	constructor(data?);
}
declare class C2SQuickFinishWestExp
{
	constructor(data?);
}
declare class S2CQuickFinishWestExp
{
	Tag: number;
	constructor(data?);
}
declare class C2SStartWestExp
{
	constructor(data?);
}
declare class S2CStartWestExp
{
	Tag: number;
	constructor(data?);
}
declare class S2CFinishWestExp
{
	I: number;
	P: string ;
	List: Array<RobbedPlayer>;
	D: number;
	constructor(data?);
}
declare class C2SGetWestPrize
{
	constructor(data?);
}
declare class S2CGetWestPrize
{
	Tag: number;
	constructor(data?);
}
declare class C2SGetRobbedList
{
	constructor(data?);
}
declare class Robber
{
	U: number;
	Fv: number;
	N: string ;
	I: number;
	Y: number;
	Lid: string ;
	G: string ;
	Uid: number;
	Head: number;
	HeadFrame: number;
	Prize: Array<ItemInfo>;
	AreaId: number;
	World: string ;
	constructor(data?);
}
declare class S2CGetRobbedList
{
	List: Array<Robber>;
	constructor(data?);
}
declare class C2SSendRob
{
	U: number;
	constructor(data?);
}
declare class S2CSendRob
{
	Tag: number;
	constructor(data?);
}
declare class S2CBeRob
{
	constructor(data?);
}
declare class C2SSendRevenge
{
	Lid: string ;
	constructor(data?);
}
declare class S2CSendRevenge
{
	Tag: number;
	P: string ;
	Y: number;
	Lid: string ;
	constructor(data?);
}
declare class S2CWestExpStart
{
	constructor(data?);
}
declare class C2SWestPray
{
	Id: number;
	constructor(data?);
}
declare class S2CWestPray
{
	Tag: number;
	constructor(data?);
}
declare class S2CWestPlayerPray
{
	Id: number;
	PrayId: number;
	constructor(data?);
}
declare class Rank
{
	Id: number;
	R: number;
	A: Array<IntAttr>;
	B: Array<StrAttr>;
	SortValue: number;
	AdditionalOk: number;
	Pet: RankPetData ;
	constructor(data?);
}
declare class SimpleRank
{
	Id: number;
	R: number;
	Name: string ;
	HeadFrame: number;
	Head: number;
	Level: number;
	Sid: number;
	Fv: number;
	SortValue: number;
	Vip: number;
	AdditionalOk: number;
	Family: string ;
	EquipFv: number;
	PetFv: number;
	Reborn: number;
	RealmLevel: number;
	FamilyLevel: number;
	SkinFv: number;
	SkinNum: number;
	AreaId: number;
	SortValue1: number;
	rrUserInfo: Array<ActRushRankReceiveData>;
	GiveUserCount: number;
	Sex: number;
	World: string ;
	HideVIP: number;
	constructor(data?);
}
declare class C2SAllRank
{
	Type: number;
	Param: number;
	FullDataRank: Array<number>;
	SimpleDataRank: Array<number>;
	DataType: number;
	constructor(data?);
}
declare class S2CAllRank
{
	Type: number;
	Param: number;
	FullDataRank: Array<Rank>;
	SimpleDataRank: Array<SimpleRank>;
	MyData: SimpleRank ;
	DataType: number;
	constructor(data?);
}
declare class C2SRespect
{
	Type: number;
	constructor(data?);
}
declare class S2CRespect
{
	Tag: number;
	Prize: Array<ItemInfo>;
	Type: number;
	constructor(data?);
}
declare class JJCRole
{
	UserId: number;
	A: Array<IntAttr>;
	B: Array<StrAttr>;
	Kill: number;
	Robot: number;
	constructor(data?);
}
declare class C2SJJCList
{
	constructor(data?);
}
declare class S2CJJCList
{
	Tag: number;
	Roles: Array<JJCRole>;
	constructor(data?);
}
declare class C2SJJCFight
{
	TargetId: number;
	TargetRank: number;
	Kill: number;
	constructor(data?);
}
declare class S2CJJCFight
{
	Tag: number;
	IsWin: number;
	HonorPrize: number;
	Coin1Prize: number;
	Coin4Prize: number;
	HistoryRank: number;
	NowRank: number;
	Kill: number;
	constructor(data?);
}
declare class C2SJJCSweep
{
	constructor(data?);
}
declare class S2CJJCSweep
{
	Tag: number;
	HonorPrize: number;
	Coin1Prize: number;
	Coin4Prize: number;
	constructor(data?);
}
declare class C2SJJCGetBuyInfo
{
	constructor(data?);
}
declare class S2CJJCGetBuyInfo
{
	Coin: number;
	CoinType: number;
	Times: number;
	LeftTimes: number;
	NoticeTimes: number;
	NoticeVip: number;
	constructor(data?);
}
declare class C2SJJCBuyTimes
{
	constructor(data?);
}
declare class S2CJJCBuyTimes
{
	Tag: number;
	constructor(data?);
}
declare class C2SGodEquipAwake
{
	int32: number;
	constructor(data?);
}
declare class S2CGodEquipAwake
{
	Tag: number;
	constructor(data?);
}
declare class C2SIntoSoulGradeUp
{
	int32: number;
	constructor(data?);
}
declare class S2CIntoSoulGradeUp
{
	Tag: number;
	Directly: number;
	Grade: Grade ;
	constructor(data?);
}
declare class C2SGodForge
{
	int32: number;
	Type: number;
	Times: number;
	constructor(data?);
}
declare class S2CGodForge
{
	Tag: number;
	Grade1: Grade ;
	Grade2: Grade ;
	constructor(data?);
}
declare class C2SGodForgeSave
{
	int32: number;
	constructor(data?);
}
declare class S2CGodForgeSave
{
	Tag: number;
	Grade1: Grade ;
	Grade2: Grade ;
	constructor(data?);
}
declare class C2SGodEquipMelt
{
	ItemId: string ;
	constructor(data?);
}
declare class S2CGodEquipMelt
{
	Tag: number;
	constructor(data?);
}
declare class TeamInfo
{
	TeamId: number;
	Nick: string ;
	Num: number;
	constructor(data?);
}
declare class MemberInfo
{
	UserId: number;
	Nick: string ;
	Level: number;
	RoleId: number;
	Value: number;
	Leader: number;
	constructor(data?);
}
declare class C2SGetTeamList
{
	InstanceType: number;
	InstanceId: number;
	constructor(data?);
}
declare class S2CGetTeamList
{
	Tag: number;
	InstanceType: number;
	InstanceId: number;
	Teams: Array<TeamInfo>;
	constructor(data?);
}
declare class C2SGetMemberList
{
	InstanceType: number;
	TeamId: number;
	constructor(data?);
}
declare class S2CGetMemberList
{
	Tag: number;
	TeamId: number;
	Member: Array<MemberInfo>;
	constructor(data?);
}
declare class C2SJoinInstance
{
	InstanceType: number;
	InstanceId: number;
	TeamId: number;
	Type: number;
	constructor(data?);
}
declare class S2CJoinInstance
{
	Tag: number;
	TeamId: number;
	LeaderId: number;
	InstanceType: number;
	constructor(data?);
}
declare class C2SLeaveInstance
{
	InstanceType: number;
	TeamId: number;
	constructor(data?);
}
declare class S2CLeaveInstance
{
	Tag: number;
	constructor(data?);
}
declare class C2SLeaveInstanceCopy
{
	constructor(data?);
}
declare class S2CLeaveInstanceCopy
{
	Tag: number;
	constructor(data?);
}
declare class C2SKillInstance
{
	InstanceType: number;
	TeamId: number;
	KillId: number;
	constructor(data?);
}
declare class S2CKillInstance
{
	Tag: number;
	constructor(data?);
}
declare class C2SStartInstance
{
	InstanceType: number;
	TeamId: number;
	constructor(data?);
}
declare class S2CStartInstance
{
	Tag: number;
	constructor(data?);
}
declare class Precious
{
	Id: string ;
	IId: number;
	Quality: number;
	Pos: number;
	Skills: Array<Skill>;
	Lock: number;
	Creator: string ;
	EatLevel: number;
	EatExp: number;
	SoulId: number;
	SoulLevel: number;
	SoulExp: number;
	constructor(data?);
}
declare class PreciousPos
{
	Id: number;
	ForgeTime: number;
	Attr: Array<IntAttr>;
	constructor(data?);
}
declare class C2SGetPreciousPos
{
	constructor(data?);
}
declare class S2CGetPreciousPos
{
	Pos: Array<PreciousPos>;
	constructor(data?);
}
declare class C2SCreatePrecious
{
	Type: number;
	Auto: number;
	constructor(data?);
}
declare class S2CCreatePrecious
{
	Tag: number;
	NewPrecious: Precious ;
	constructor(data?);
}
declare class C2SCreatePreciousFast
{
	Type: number;
	constructor(data?);
}
declare class S2CCreatePreciousFast
{
	Tag: number;
	NewPrecious: Array<Precious>;
	Precious: Array<Precious>;
	constructor(data?);
}
declare class C2SMeltPrecious
{
	Precious: Array<string>;
	constructor(data?);
}
declare class S2CMeltPrecious
{
	Tag: number;
	Precious: Array<string>;
	constructor(data?);
}
declare class C2SWearPrecious
{
	Id: string ;
	Pos: number;
	constructor(data?);
}
declare class S2CWearPrecious
{
	Tag: number;
	Id: string ;
	Pos: number;
	constructor(data?);
}
declare class C2SLockPrecious
{
	Id: string ;
	constructor(data?);
}
declare class S2CLockPrecious
{
	Tag: number;
	Id: string ;
	Lock: number;
	constructor(data?);
}
declare class C2SPreciousForge
{
	Pos: number;
	T: number;
	LockAttr: Array<number>;
	constructor(data?);
}
declare class S2CPreciousForge
{
	Tag: number;
	Pos: number;
	T: number;
	LockAttr: Array<number>;
	Attr: Array<IntAttr>;
	Times: number;
	constructor(data?);
}
declare class C2SPreciousEat
{
	Id: string ;
	AutoBuy: number;
	constructor(data?);
}
declare class S2CPreciousEat
{
	Tag: number;
	Id: string ;
	EatLevel: number;
	EatExp: number;
	constructor(data?);
}
declare class C2SPreciousSoul
{
	Id: string ;
	SoulId: number;
	constructor(data?);
}
declare class S2CPreciousSoul
{
	Tag: number;
	Id: string ;
	SoulId: number;
	constructor(data?);
}
declare class C2SPreciousSoulUp
{
	Id: string ;
	SoulId: Array<ItemInfo>;
	constructor(data?);
}
declare class S2CPreciousSoulUp
{
	Tag: number;
	Id: string ;
	SoulLevel: number;
	SoulExp: number;
	constructor(data?);
}
declare class C2SPreciousGive
{
	Id: string ;
	Id2: string ;
	T: number;
	constructor(data?);
}
declare class S2CPreciousGive
{
	Tag: number;
	Id: string ;
	Id2: string ;
	T: number;
	constructor(data?);
}
declare class C2SPreciousRobot
{
	constructor(data?);
}
declare class S2CPreciousRobot
{
	Precious: Array<Precious>;
	constructor(data?);
}
declare class C2SGetActTimestamp
{
	ActId: number;
	constructor(data?);
}
declare class S2CGetActTimestamp
{
	Tag: number;
	ActId: number;
	StartTime: number;
	OverTime: number;
	constructor(data?);
}
declare class S2CActStart
{
	AId: number;
	OT: number;
	constructor(data?);
}
declare class S2CActOver
{
	AId: number;
	constructor(data?);
}
declare class S2CActIcon
{
	AIds: Array<ActIcon>;
	constructor(data?);
}
declare class ActIcon
{
	Id: number;
	B: number;
	E: number;
	constructor(data?);
}
declare class S2CActShowWindow
{
	AId: number;
	constructor(data?);
}
declare class ActPreReport
{
	AId: number;
	OT: number;
	constructor(data?);
}
declare class S2CActStartPre
{
	ActPreReport: ActPreReport ;
	constructor(data?);
}
declare class S2CActOverPre
{
	AId: number;
	constructor(data?);
}
declare class S2CActList
{
	ActPreReport: Array<ActPreReport>;
	constructor(data?);
}
declare class C2SActCreateTeam
{
	TeamType: number;
	constructor(data?);
}
declare class S2CActCreateTeam
{
	Tag: number;
	TI: ActTeamInfo ;
	constructor(data?);
}
declare class C2SActFindTeams
{
	TeamType: number;
	constructor(data?);
}
declare class S2CActFindTeams
{
	TIS: Array<ActTeamInfo>;
	Tag: number;
	constructor(data?);
}
declare class C2SActJoinTeam
{
	TId: number;
	constructor(data?);
}
declare class S2CActJoinTeam
{
	Tag: number;
	TI: ActTeamInfo ;
	constructor(data?);
}
declare class C2SActFindTeam
{
	constructor(data?);
}
declare class S2CActFindTeam
{
	Tag: number;
	TI: ActTeamInfo ;
	constructor(data?);
}
declare class C2SActNeedFightVal
{
	FV: number;
	constructor(data?);
}
declare class S2CActNeedFightVal
{
	Tag: number;
	TI: ActTeamInfo ;
	constructor(data?);
}
declare class C2SActExitTeam
{
	Uid: number;
	constructor(data?);
}
declare class S2CActExitTeam
{
	Tag: number;
	Uid: number;
	constructor(data?);
}
declare class ActTeamInfo
{
	Id: number;
	NFV: number;
	MS: Array<ActTeamMemInfo>;
	constructor(data?);
}
declare class ActTeamMemInfo
{
	UId: number;
	UN: string ;
	L: number;
	RId: number;
	LV: number;
	FV: number;
	MHP: number;
	HP: number;
	constructor(data?);
}
declare class C2SActTeamRecruit
{
	constructor(data?);
}
declare class S2CActTeamRecruit
{
	Tag: number;
	constructor(data?);
}
declare class C2SJoinActive
{
	AId: number;
	constructor(data?);
}
declare class S2CJoinActive
{
	Tag: number;
	AId: number;
	constructor(data?);
}
declare class C2SLeaveActive
{
	AId: number;
	constructor(data?);
}
declare class S2CLeaveActive
{
	Tag: number;
	AId: number;
	constructor(data?);
}
declare class C2SReviveLife
{
	ReviveType: number;
	constructor(data?);
}
declare class S2CReviveLife
{
	Tag: number;
	ReviveType: number;
	constructor(data?);
}
declare class C2STreatPlayer
{
	constructor(data?);
}
declare class S2CTreatPlayer
{
	Tag: number;
	constructor(data?);
}
declare class S2CTreatData
{
	Items: Array<FightHpData>;
	constructor(data?);
}
declare class FightHpData
{
	UnitType: number;
	Id: number;
	Idx: number;
	FightPos: number;
	MaxHp: number;
	CurrHp: number;
	HpPercent: number;
	IdStr: string ;
	constructor(data?);
}
declare class SignData
{
	Id: number;
	State: number;
	IsReCharge: number;
	SignNum: number;
	constructor(data?);
}
declare class TotalSignData
{
	Id: number;
	State: number;
	constructor(data?);
}
declare class S2CSignData
{
	items: Array<SignData>;
	totalItems: Array<TotalSignData>;
	constructor(data?);
}
declare class C2SSign
{
	constructor(data?);
}
declare class C2SSignSecond
{
	constructor(data?);
}
declare class S2CSign
{
	Tag: number;
	constructor(data?);
}
declare class C2SMakeUpSign
{
	Id: number;
	constructor(data?);
}
declare class S2CMakeUpSign
{
	Tag: number;
	constructor(data?);
}
declare class C2STotalSignPrize
{
	Id: number;
	constructor(data?);
}
declare class S2CTotalSignPrize
{
	Tag: number;
	constructor(data?);
}
declare class C2SSignPrize
{
	constructor(data?);
}
declare class S2CSignPrize
{
	Tag: number;
	constructor(data?);
}
declare class C2SGoldTree
{
	constructor(data?);
}
declare class S2CGoldTree
{
	Tag: number;
	Gold: number;
	NextMulti: number;
	constructor(data?);
}
declare class C2SGetGoldTreeInfo
{
	constructor(data?);
}
declare class S2CGetGoldTreeInfo
{
	TodayUse: number;
	TodayTotal: number;
	NextVipTimes: number;
	ActId: number;
	constructor(data?);
}
declare class NoticeUser
{
	Id: number;
	Nick: string ;
	AreaId: number;
	World: string ;
	constructor(data?);
}
declare class NoticePet
{
	Id: number;
	Num: number;
	constructor(data?);
}
declare class NoticePetInfo
{
	Pet2: Pet2 ;
	constructor(data?);
}
declare class NoticeItem
{
	Id: number;
	Num: number;
	Item: ItemData ;
	constructor(data?);
}
declare class NoticeFaBao
{
	IId: number;
	Id: string ;
	Quality: number;
	constructor(data?);
}
declare class S2CNotice
{
	Id: number;
	U: Array<NoticeUser>;
	Pet: Array<NoticePet>;
	PetInfo: Array<NoticePetInfo>;
	I: Array<NoticeItem>;
	Stage: Array<number>;
	P: Array<string>;
	FaBao: NoticeFaBao ;
	Skill: Array<number>;
	LinkParam: Array<string>;
	constructor(data?);
}
declare class DragonLogItemClient
{
	Time: number;
	User: NoticeUser ;
	InstanceId: number;
	Item: Array<ItemData>;
	constructor(data?);
}
declare class C2SGetDragonLog
{
	Type: number;
	constructor(data?);
}
declare class S2CGetDragonLog
{
	Type: number;
	Logs: Array<DragonLogItemClient>;
	constructor(data?);
}
declare class C2SStartFightDragon
{
	Id: number;
	Auto: number;
	ItemId: number;
	Num: number;
	constructor(data?);
}
declare class S2CStartFightDragon
{
	Tag: number;
	Id: number;
	ItemId: number;
	constructor(data?);
}
declare class ActRushRankReceiveData
{
	user: RushRankUserInfo ;
	giveCount: number;
	constructor(data?);
}
declare class ZeroBuyGiftReturnPlan
{
	GiftId: number;
	Days: number;
	Type: number;
	Total: number;
	BuyDay: number;
	Receive: number;
	constructor(data?);
}
declare class C2SZeroBuyGiftReturnPlan
{
	ActId: number;
	constructor(data?);
}
declare class S2CZeroBuyGiftReturnPlan
{
	ActId: number;
	ZeroBuyGiftReturnPlan: Array<ZeroBuyGiftReturnPlan>;
	constructor(data?);
}
declare class C2SGetZeroBuyReturnMoney
{
	ActId: number;
	GiftId: number;
	constructor(data?);
}
declare class S2CGetZeroBuyReturnMoney
{
	Tag: number;
	constructor(data?);
}
declare class S2CContinueRechargeTaskNum
{
	Number: number;
	constructor(data?);
}
declare class Activity
{
	ActId: number;
	Type: number;
	InitTime: number;
	StartTime: number;
	EndTime: number;
	Pos: string ;
	Container: string ;
	RedPoint: number;
	Name: string ;
	Order: number;
	Icon: Array<ActivityIcon>;
	RMB: number;
	Param: number;
	ShowTagType: number;
	HideTimestamp: number;
	BannerPath: string ;
	RedInitState: number;
	ActIsClosed: number;
	WorldLevel: number;
	UnionStartDay: number;
	constructor(data?);
}
declare class ActivityIcon
{
	Pos: number;
	Container: number;
	Order: number;
	Icon: number;
	Circle: number;
	constructor(data?);
}
declare class S2CAllActivity
{
	Activity: Array<Activity>;
	constructor(data?);
}
declare class S2CActivityInit
{
	Activity: Array<Activity>;
	constructor(data?);
}
declare class S2CActivityStart
{
	Activity: Array<Activity>;
	constructor(data?);
}
declare class S2CActivityEnd
{
	ActId: Array<number>;
	constructor(data?);
}
declare class C2SActivityFreeTag
{
	ActId: number;
	constructor(data?);
}
declare class S2CActivityFreeTag
{
	ActId: number;
	Free: number;
	constructor(data?);
}
declare class S2CActivityRedPoint
{
	ActId: number;
	RedPoint: number;
	constructor(data?);
}
declare class S2CActivityIcon
{
	ActId: number;
	Pos: number;
	Icon: number;
	constructor(data?);
}
declare class S2CActivityData
{
	S2CGetDrawData: Array<S2CGetDrawData>;
	S2CPlayerDrawData: Array<S2CPlayerDrawData>;
	S2CGetActShopList: Array<S2CGetActShopList>;
	S2CGetActGiftNewList: Array<S2CGetActGiftNewList>;
	S2CGetActBossInfo: Array<S2CGetActBossInfo>;
	S2CPlayerBossInfo: Array<S2CPlayerBossInfo>;
	S2CGetActTask: Array<S2CGetActTask>;
	S2CGetInvestInfo: Array<S2CGetInvestInfo>;
	S2CPlayerInvestData: Array<S2CPlayerInvestData>;
	S2CGetActRankInfo: Array<S2CGetActRankInfo>;
	S2CGetGoldTreeInfo: Array<S2CGetGoldTreeInfo>;
	S2CGetActPicture: Array<S2CGetActPicture>;
	S2CGetChargeReturnData: Array<S2CGetChargeReturnData>;
	S2CGetActLimitTimeFight: Array<S2CGetActLimitTimeFight>;
	constructor(data?);
}
declare class C2SGetActPrize
{
	ActId: number;
	Param1: number;
	Param2: number;
	constructor(data?);
}
declare class S2CGetActPrize
{
	Tag: number;
	ActId: number;
	Param1: number;
	Param2: number;
	constructor(data?);
}
declare class C2SGetDrawData
{
	ActId: number;
	constructor(data?);
}
declare class S2CGetDrawData
{
	ActId: number;
	Name: string ;
	Luck: number;
	LowDraw: string ;
	HighDrawOne: string ;
	HighDrawTen: string ;
	GaiID: number;
	Detail: Array<DrawDetail>;
	DoubleRate: number;
	constructor(data?);
}
declare class DrawDetail
{
	ID: number;
	ItemId: number;
	ItemCount: number;
	TitleType: number;
	SortId: number;
	ShowRate: string ;
	Name: string ;
	constructor(data?);
}
declare class C2SPlayerDrawData
{
	ActId: number;
	constructor(data?);
}
declare class S2CPlayerDrawData
{
	Tag: number;
	ActId: number;
	Luck: number;
	Score: number;
	Free: number;
	MustDrawId: number;
	ActType: number;
	LuckDraw: Array<LuckDraw>;
	LowDrawTimes: number;
	DrawTimes: number;
	Discount: number;
	constructor(data?);
}
declare class LuckDraw
{
	Value: number;
	Id: number;
	Have: number;
	constructor(data?);
}
declare class C2SGetDrawListRate
{
	ActId: number;
	constructor(data?);
}
declare class S2CGetDrawListRate
{
	ActId: number;
	Item: Array<string>;
	Rate: Array<string>;
	constructor(data?);
}
declare class C2SBuyDrawItem
{
	ActId: number;
	Type: number;
	Count: number;
	constructor(data?);
}
declare class S2CBuyDrawItem
{
	Tag: number;
	ActId: number;
	constructor(data?);
}
declare class C2SDraw
{
	ActId: number;
	Type: number;
	constructor(data?);
}
declare class S2CDraw
{
	Tag: number;
	ActId: number;
	Prize: Array<ItemInfo>;
	CritLuck: number;
	SpecialShow: Array<number>;
	constructor(data?);
}
declare class DrawLog
{
	Nick: string ;
	DataId: number;
	World: string ;
	constructor(data?);
}
declare class C2SGetDrawLog
{
	ActId: number;
	constructor(data?);
}
declare class S2CGetDrawLog
{
	Tag: number;
	Log: Array<DrawLog>;
	ActId: number;
	constructor(data?);
}
declare class C2SGetActXunBaoInfo
{
	ActId: number;
	constructor(data?);
}
declare class S2CGetActXunBaoInfo
{
	Tag: number;
	ActId: number;
	XunBaoItem: Array<XunBaoItem>;
	ScoreItem: Array<XunBaoItem>;
	OneTimeItemId: number;
	GoldType: number;
	GoodsPrice: number;
	SalePrice: number;
	FiftyTimeDiscount: number;
	XunBaoTotalOdd: number;
	ScoreTotalOdd: number;
	OneTimeNeedScore: number;
	Type3ItemId: number;
	Type3ItemCount: number;
	Type3ItemNeedTotalTimes: number;
	RelatedCfg: string ;
	DoubleDayStart: number;
	DoubleDayEnd: number;
	TenTimeDiscount: number;
	Score: number;
	constructor(data?);
}
declare class XunBaoItem
{
	Id: number;
	ItemId: number;
	ItemCount: number;
	SortId: number;
	PrizeType: number;
	Odd: number;
	ExtParam: number;
	OddClient: string ;
	Quality: number;
	Category: number;
	Sort: number;
	constructor(data?);
}
declare class C2SGetActXunBaoData
{
	ActId: number;
	constructor(data?);
}
declare class S2CGetActXunBaoData
{
	Tag: number;
	ActId: number;
	TotalTimes: number;
	XunBaoScore: number;
	WareHouse: Array<ItemInfo>;
	HaveFreeTime: number;
	DoublePrize: number;
	constructor(data?);
}
declare class C2SActXunBaoJump
{
	Jump: number;
	constructor(data?);
}
declare class S2CActXunBaoJump
{
	Tag: number;
	constructor(data?);
}
declare class DrawPrize
{
	Prize: ItemInfo ;
	PrizeParam: number;
	PrizeType: number;
	Pos: number;
	constructor(data?);
}
declare class C2SActXunBaoDraw
{
	ActId: number;
	Type: number;
	AutoBuy: number;
	constructor(data?);
}
declare class S2CActXunBaoDraw
{
	Tag: number;
	ActId: number;
	Score: number;
	AddScore: number;
	DrawPrize: Array<DrawPrize>;
	constructor(data?);
}
declare class C2SActXunBaoScoreDraw
{
	ActId: number;
	Times: number;
	constructor(data?);
}
declare class S2CActXunBaoScoreDraw
{
	Tag: number;
	ActId: number;
	Prize: Array<ItemInfo>;
	constructor(data?);
}
declare class C2SActXunBaoAllTake
{
	ActId: number;
	constructor(data?);
}
declare class S2CActXunBaoAllTake
{
	Tag: number;
	constructor(data?);
}
declare class XunBaoLog
{
	Nick: string ;
	AreaId: number;
	ItemId: number;
	ItemQuality: number;
	Timestamp: number;
	ItemNum: number;
	World: string ;
	Percent: number;
	PrizeType: number;
	constructor(data?);
}
declare class C2SGetXunBaoLog
{
	ActId: number;
	IsSelf: number;
	constructor(data?);
}
declare class S2CGetXunBaoLog
{
	Tag: number;
	ActId: number;
	Log: Array<XunBaoLog>;
	IsSelf: number;
	constructor(data?);
}
declare class C2SGetXunBaoScoreLog
{
	ActId: number;
	constructor(data?);
}
declare class S2CGetXunBaoScoreLog
{
	Tag: number;
	ActId: number;
	Log: Array<XunBaoLog>;
	constructor(data?);
}
declare class XunBaoExchangeItem
{
	Id: number;
	ItemId: number;
	Focus: number;
	LimitUseTimes: number;
	LimitTotalTimes: number;
	LimitTimesType: number;
	constructor(data?);
}
declare class C2SGetActXunBaoExchangeData
{
	ActId: number;
	constructor(data?);
}
declare class S2CGetActXunBaoExchangeData
{
	Tag: number;
	ActId: number;
	Items: Array<XunBaoExchangeItem>;
	XunBaoScore: number;
	constructor(data?);
}
declare class C2SActXunBaoExchange
{
	ActId: number;
	ExcId: number;
	Num: number;
	constructor(data?);
}
declare class S2CActXunBaoExchange
{
	Tag: number;
	ActId: number;
	ExcId: number;
	Num: number;
	constructor(data?);
}
declare class C2SActXunBaoExchangeFocus
{
	ActId: number;
	ExcId: number;
	OpType: number;
	constructor(data?);
}
declare class S2CActXunBaoExchangeFocus
{
	Tag: number;
	ActId: number;
	ExcId: number;
	OpType: number;
	constructor(data?);
}
declare class C2SGetActTurntabInfo
{
	ActId: number;
	constructor(data?);
}
declare class S2CGetActTurntabInfo
{
	Tag: number;
	ActId: number;
	TurntabItem: Array<TurntabItem>;
	constructor(data?);
}
declare class TurntabItem
{
	Id: number;
	ItemId: number;
	ItemCount: number;
	SortId: number;
	Odd: number;
	constructor(data?);
}
declare class C2SGetActTurntabData
{
	ActId: number;
	constructor(data?);
}
declare class S2CGetActTurntabData
{
	Tag: number;
	ActId: number;
	PlayerTurntabItem: Array<PlayerTurntabItem>;
	Times: number;
	Progress: number;
	TotalProgress: number;
	DrawLog: Array<DrawLog>;
	constructor(data?);
}
declare class PlayerTurntabItem
{
	SortId: number;
	State: number;
	constructor(data?);
}
declare class C2SActTurntabDraw
{
	ActId: number;
	Type: number;
	constructor(data?);
}
declare class S2CActTurntabDraw
{
	Tag: number;
	ActId: number;
	SortId: number;
	Prize: Array<ItemInfo>;
	constructor(data?);
}
declare class C2SGeTurntabDrawLog
{
	ActId: number;
	IsSelf: number;
	constructor(data?);
}
declare class S2CGetTurntabDrawLog
{
	Tag: number;
	ActId: number;
	IsSelf: number;
	DrawLogs: Array<DrawLog>;
	constructor(data?);
}
declare class RechargeTurnLog
{
	Nick: string ;
	AreaId: number;
	ItemId: number;
	ItemNum: number;
	Timestamp: number;
	World: string ;
	constructor(data?);
}
declare class C2SGetActRechargeTurntabInfo
{
	ActId: number;
	constructor(data?);
}
declare class S2CGetActRechargeTurntabInfo
{
	Tag: number;
	ActId: number;
	Times: number;
	MoneyPoint: number;
	RewardId: Array<number>;
	constructor(data?);
}
declare class C2SActRechargeTurntabItem
{
	ActId: number;
	Type: number;
	constructor(data?);
}
declare class S2CActRechargeTurntabItem
{
	Tag: number;
	ActId: number;
	Type: number;
	Id: number;
	Prize: Array<ItemInfo>;
	constructor(data?);
}
declare class C2SActRechargeTurntabReward
{
	ActId: number;
	Id: number;
	constructor(data?);
}
declare class S2CActRechargeTurntabReward
{
	Tag: number;
	ActId: number;
	Id: number;
	RewardId: Array<number>;
	constructor(data?);
}
declare class C2SGetRechargeTurntabLog
{
	ActId: number;
	Type: number;
	constructor(data?);
}
declare class S2CGetRechargeTurntabLog
{
	Tag: number;
	ActId: number;
	Type: number;
	Logs: Array<RechargeTurnLog>;
	constructor(data?);
}
declare class C2SGetChargeReturnData
{
	ActId: number;
	constructor(data?);
}
declare class S2CGetChargeReturnData
{
	ActId: number;
	IsReset: number;
	MaxTime: number;
	Mutil: Array<number>;
	constructor(data?);
}
declare class C2SPlayerChargeReturnData
{
	ActId: number;
	constructor(data?);
}
declare class S2CPlayerChargeReturnData
{
	Tag: number;
	ActId: number;
	Times: number;
	TotalCharge: number;
	Need: number;
	Base: number;
	TodayUseTimes: number;
	constructor(data?);
}
declare class ReturnDetail
{
	Item: number;
	T: number;
	Have: number;
	constructor(data?);
}
declare class C2SChargeReturn
{
	ActId: number;
	constructor(data?);
}
declare class S2CChargeReturn
{
	Tag: number;
	ActId: number;
	Multi: number;
	constructor(data?);
}
declare class C2SChargeReturnReceivePrize
{
	ActId: number;
	constructor(data?);
}
declare class S2CChargeReturnReceivePrize
{
	Tag: number;
	ActId: number;
	Multi: number;
	constructor(data?);
}
declare class ChargeReturnLog
{
	Nick: string ;
	Base: number;
	Multi: number;
	constructor(data?);
}
declare class C2SGetChargeReturnLog
{
	ActId: number;
	constructor(data?);
}
declare class S2CGetChargeReturnLog
{
	Tag: number;
	Log: Array<ChargeReturnLog>;
	ActId: number;
	constructor(data?);
}
declare class C2SGetActShopList
{
	Aid: number;
	constructor(data?);
}
declare class ActShopGoods
{
	Gid: number;
	F: number;
	Bt: number;
	T: number;
	Sort: number;
	ABt: number;
	AT: number;
	LimitTimesType: number;
	constructor(data?);
}
declare class S2CGetActShopList
{
	Aid: number;
	List: Array<ActShopGoods>;
	Checked: Array<number>;
	constructor(data?);
}
declare class S2CActShopUnionBuy
{
	ABt: number;
	AT: number;
	Gid: number;
	constructor(data?);
}
declare class C2SActShopBuy
{
	Gid: number;
	Num: number;
	constructor(data?);
}
declare class S2CActShopBuy
{
	Tag: number;
	Gid: number;
	MsgParam: number;
	Goods: ActShopGoods ;
	constructor(data?);
}
declare class C2SActShopHideRed
{
	Actid: number;
	constructor(data?);
}
declare class C2SActRechargeShopHideRed
{
	Actid: number;
	constructor(data?);
}
declare class C2SGetActGiftList
{
	Aid: number;
	constructor(data?);
}
declare class ActGift
{
	Gid: number;
	ItemStr: string ;
	CostType: number;
	CostNum: number;
	Price: number;
	Price2: number;
	Sort: number;
	CanBuy: number;
	Content: string ;
	TabName: string ;
	IsRec: number;
	OpenDay: number;
	OpenDayBuy: number;
	LoginDay: number;
	LoginDayBuy: number;
	UseYuan: number;
	DevilSoulgift: string ;
	BuyTime: number;
	BuyTimeLimit: number;
	constructor(data?);
}
declare class S2CGetActGiftList
{
	Aid: number;
	ActType: number;
	List: Array<ActGift>;
	constructor(data?);
}
declare class C2SActGiftBuy
{
	Gid: number;
	Aid: number;
	constructor(data?);
}
declare class S2CActGiftBuy
{
	Tag: number;
	P: string ;
	Gid: number;
	Close: number;
	constructor(data?);
}
declare class C2SGetActGiftNewList
{
	Aid: number;
	constructor(data?);
}
declare class ActGiftNew
{
	Gid: number;
	Goodname: string ;
	GoodType: number;
	GoodList: string ;
	ExistDay: number;
	ItemStr: string ;
	CostType: number;
	CostNum: number;
	Price: number;
	LimConId: number;
	Sort: number;
	CanBuy: number;
	BuyDay: number;
	RecRcord: Array<RecRecord>;
	LimConDes: string ;
	constructor(data?);
}
declare class RecRecord
{
	Day: number;
	State: number;
	constructor(data?);
}
declare class S2CGetActGiftNewList
{
	Aid: number;
	ActType: number;
	List: Array<ActGiftNew>;
	constructor(data?);
}
declare class C2SActGiftNewReceive
{
	Gid: number;
	Aid: number;
	constructor(data?);
}
declare class S2CActGiftNewReceive
{
	Tag: number;
	Gid: number;
	Aid: number;
	constructor(data?);
}
declare class C2SGoodsChecked
{
	ActId: number;
	GoodsId: number;
	Checked: number;
	constructor(data?);
}
declare class S2CGoodsChecked
{
	Tag: number;
	constructor(data?);
}
declare class ActTheme2Lucky
{
	Type: number;
	Lucky: number;
	constructor(data?);
}
declare class C2SActTheme2Lucky
{
	ActId: number;
	constructor(data?);
}
declare class S2CActTheme2Lucky
{
	ActId: number;
	ActTheme2Lucky: Array<ActTheme2Lucky>;
	constructor(data?);
}
declare class C2SActTheme2Do
{
	ActId: number;
	Type: number;
	Times: number;
	constructor(data?);
}
declare class S2CActTheme2Do
{
	Tag: number;
	Items: Array<ItemInfo>;
	constructor(data?);
}
declare class C2STheme2TreasuryState
{
	ActId: number;
	constructor(data?);
}
declare class S2CTheme2TreasuryState
{
	ActId: number;
	State: number;
	constructor(data?);
}
declare class C2SActTheme3Data
{
	ActId: number;
	constructor(data?);
}
declare class S2CActTheme3Data
{
	ActId: number;
	Unlock: number;
	Score: number;
	IsDiscountBuy: number;
	constructor(data?);
}
declare class C2SActTheme3TaskFastFinish
{
	ActId: number;
	TaskId: number;
	constructor(data?);
}
declare class S2CActTheme3TaskFastFinish
{
	Tag: number;
	TagP: string ;
	ActId: number;
	TaskId: number;
	constructor(data?);
}
declare class RushRankUserInfo
{
	UserId: number;
	Nick: string ;
	ShowAreaId: number;
	FamilyId: string ;
	ShowHead: number;
	ShowHeadFrame: number;
	Fv: number;
	Level: number;
	Realm: number;
	Vip: number;
	World: string ;
	HideVIP: number;
	constructor(data?);
}
declare class C2SActRushRankGive
{
	ActId: number;
	recevieUserId: number;
	giveCount: number;
	constructor(data?);
}
declare class S2CActRushRankGive
{
	Tag: number;
	ActId: number;
	ItemId: number;
	ItemCount: number;
	GiveItemCount: number;
	constructor(data?);
}
declare class C2SActGetReceiveUserList
{
	ActId: number;
	isRefresh: number;
	constructor(data?);
}
declare class S2CActGetReceiveUserList
{
	Tag: number;
	ActId: number;
	info1: Array<RushRankUserInfo>;
	info2: Array<RushRankUserInfo>;
	info3: Array<RushRankUserInfo>;
	GiveItemCount: number;
	constructor(data?);
}
declare class C2SActGetGiveLogList
{
	ActId: number;
	constructor(data?);
}
declare class ActRushRankGiveLogInfo
{
	logType: number;
	userIfo: RushRankUserInfo ;
	ItemId: number;
	ItemCount: number;
	constructor(data?);
}
declare class S2CActGetGiveLogList
{
	Tag: number;
	ActId: number;
	infoList: Array<ActRushRankGiveLogInfo>;
	constructor(data?);
}
declare class ActBossInfo
{
	Id: number;
	Name: string ;
	Order: number;
	BossId: number;
	PetId: number;
	Prize: string ;
	constructor(data?);
}
declare class C2SGetActBossInfo
{
	ActId: number;
	constructor(data?);
}
declare class S2CGetActBossInfo
{
	Tag: number;
	ActId: number;
	Info: Array<ActBossInfo>;
	constructor(data?);
}
declare class PlayerBossData
{
	Id: number;
	State: number;
	Prize: number;
	constructor(data?);
}
declare class C2SPlayerBossInfo
{
	ActId: number;
	constructor(data?);
}
declare class S2CPlayerBossInfo
{
	Tag: number;
	ActId: number;
	Info: Array<PlayerBossData>;
	constructor(data?);
}
declare class C2SFightActBoss
{
	ActId: number;
	BossId: number;
	constructor(data?);
}
declare class S2CFightActBoss
{
	Tag: number;
	ActId: number;
	BossId: number;
	Prize: Array<ItemInfo>;
	constructor(data?);
}
declare class C2SGetActBossPrize
{
	ActId: number;
	BossId: number;
	constructor(data?);
}
declare class S2CGetActBossPrize
{
	Tag: number;
	ActId: number;
	BossId: number;
	Prize: Array<ItemInfo>;
	constructor(data?);
}
declare class ActDareBossInfo
{
	Id: number;
	Name: string ;
	Order: number;
	BossId: number;
	ObjType: number;
	TypeId: number;
	Prize: string ;
	constructor(data?);
}
declare class C2SGetActDareBossInfo
{
	ActId: number;
	constructor(data?);
}
declare class S2CGetActDareBossInfo
{
	Tag: number;
	ActId: number;
	Info: Array<ActDareBossInfo>;
	constructor(data?);
}
declare class PlayerDareBossData
{
	Id: number;
	State: number;
	Prize: number;
	constructor(data?);
}
declare class C2SPlayerDareBossInfo
{
	ActId: number;
	constructor(data?);
}
declare class S2CPlayerDareBossInfo
{
	Tag: number;
	ActId: number;
	State: number;
	DeadLine: number;
	Info: Array<PlayerDareBossData>;
	EndTimestamp: number;
	ActIsOpen: number;
	constructor(data?);
}
declare class ActLimitTimeFightItem
{
	Idx: number;
	Prize: Array<ItemInfo>;
	FightValue: number;
	AnimId: number;
	FinalPrizeShow: string ;
	constructor(data?);
}
declare class S2CGetActLimitTimeFight
{
	ActId: number;
	Items: Array<ActLimitTimeFightItem>;
	CurrIdx: number;
	constructor(data?);
}
declare class DareState
{
	ActId: number;
	State: number;
	constructor(data?);
}
declare class C2SPlayerDareState
{
	constructor(data?);
}
declare class S2CPlayerDareState
{
	States: Array<DareState>;
	constructor(data?);
}
declare class C2SPlayerDareIsOpen
{
	constructor(data?);
}
declare class S2CPlayerDareIsOpen
{
	Open: number;
	EndTimestamp: Array<DareEndTimestamp>;
	constructor(data?);
}
declare class DareEndTimestamp
{
	ActId: number;
	EndTimestamp: number;
	State: number;
	constructor(data?);
}
declare class C2SFightActDareBoss
{
	ActId: number;
	BossId: number;
	constructor(data?);
}
declare class S2CFightActDareBoss
{
	Tag: number;
	ActId: number;
	BossId: number;
	Prize: Array<ItemInfo>;
	Win: number;
	constructor(data?);
}
declare class C2SGetActDareBossPrize
{
	ActId: number;
	BossId: number;
	constructor(data?);
}
declare class S2CGetActDareBossPrize
{
	Tag: number;
	ActId: number;
	BossId: number;
	Prize: Array<ItemInfo>;
	constructor(data?);
}
declare class C2SGetActLiangYuanState
{
	Aid: number;
	constructor(data?);
}
declare class S2CGetActLiangYuanState
{
	Aid: number;
	State: number;
	constructor(data?);
}
declare class C2SActLiangYuanReceive
{
	Aid: number;
	constructor(data?);
}
declare class S2CActLiangYuanReceive
{
	Tag: number;
	constructor(data?);
}
declare class C2SGetActLiangYuanLog
{
	Aid: number;
	constructor(data?);
}
declare class S2CGetActLiangYuanLog
{
	Aid: number;
	Items: Array<LiangYuanLog>;
	constructor(data?);
}
declare class LiangYuanLog
{
	Nick: string ;
	MateNick: string ;
	AreaId: number;
	MateAreaId: number;
	World: string ;
	MateWorld: string ;
	constructor(data?);
}
declare class C2SGetActYiJiTanBaoInfo
{
	ActId: number;
	constructor(data?);
}
declare class S2CGetActYiJiTanBaoInfo
{
	ActId: number;
	FloorId: number;
	GridId: number;
	Grid: Array<YiJiTanBaoGridCfg>;
	WareHouse: Array<ItemInfo>;
	constructor(data?);
}
declare class YiJiTanBaoGridCfg
{
	Id: number;
	Item: ItemInfo ;
	constructor(data?);
}
declare class C2SActYiJiTanBaoDice
{
	ActId: number;
	Type: number;
	constructor(data?);
}
declare class S2CActYiJiTanBaoDice
{
	Tag: number;
	DicePoint: number;
	GridId: number;
	NeedNextFloor: number;
	Prize: Array<ItemInfo>;
	constructor(data?);
}
declare class C2SActYiJiTanBaoGetAllPrize
{
	ActId: number;
	constructor(data?);
}
declare class S2CActYiJiTanBaoGetAllPrize
{
	Tag: number;
	ActId: number;
	constructor(data?);
}
declare class C2SGetChargeMallList
{
	T: number;
	constructor(data?);
}
declare class GoodsList
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
declare class S2CGetChargeMallList
{
	List: Array<GoodsList>;
	constructor(data?);
}
declare class C2SChargeMallBuy
{
	Gid: number;
	constructor(data?);
}
declare class S2CChargeMallBuy
{
	Tag: number;
	data: string ;
	constructor(data?);
}
declare class S2CPayNotify
{
	Type: number;
	constructor(data?);
}
declare class ActTask
{
	Id: number;
	Name: string ;
	Type: number;
	CounterType: number;
	Param: number;
	Target: number;
	Prize: string ;
	Order: number;
	AnimId: string ;
	ClientFuncId: number;
	RevelValue: number;
	ShowCond: number;
	constructor(data?);
}
declare class C2SGetActTask
{
	ActId: number;
	constructor(data?);
}
declare class S2CGetActTask
{
	Tag: number;
	ActId: number;
	Task: Array<ActTask>;
	constructor(data?);
}
declare class C2SActTaskOneKeyFinish
{
	ActId: number;
	constructor(data?);
}
declare class S2CActTaskOneKeyFinish
{
	Tag: number;
	ActId: number;
	Prize: Array<ItemInfo>;
	constructor(data?);
}
declare class S2CGetFirstRechargeTask
{
	Task: Array<ActTask>;
	constructor(data?);
}
declare class GodTowerDayInfo
{
	Day: number;
	stage: number;
	constructor(data?);
}
declare class C2SGetGodTowerActTaskDay
{
	constructor(data?);
}
declare class S2CGetGodTowerActTaskDay
{
	Task: Array<GodTowerDayInfo>;
	constructor(data?);
}
declare class C2SGetInvestInfo
{
	ActId: number;
	constructor(data?);
}
declare class S2CGetInvestInfo
{
	Tag: number;
	ActId: number;
	AnimId: number;
	Task: Array<ActTask>;
	Name: string ;
	constructor(data?);
}
declare class C2SPlayerInvestData
{
	ActId: number;
	constructor(data?);
}
declare class S2CPlayerInvestData
{
	Tag: number;
	ActId: number;
	Buy: number;
	constructor(data?);
}
declare class C2SBuyInvest
{
	ActId: number;
	constructor(data?);
}
declare class S2CBuyInvest
{
	Tag: number;
	ActId: number;
	constructor(data?);
}
declare class C2SActInvestHideRed
{
	Actid: number;
	constructor(data?);
}
declare class RankData
{
	Id: number;
	RankMin: number;
	RankMax: number;
	BasePrize: string ;
	AddPrize: string ;
	PrizeTitle: string ;
	PrizeContent: string ;
	CompareParam: number;
	constructor(data?);
}
declare class C2SGetActRankInfo
{
	ActId: number;
	constructor(data?);
}
declare class S2CGetActRankInfo
{
	Tag: number;
	ActId: number;
	Name: string ;
	RankType: number;
	Param: number;
	Data: Array<RankData>;
	constructor(data?);
}
declare class C2SGetActRankData
{
	ActId: number;
	FullDataRank: Array<number>;
	SimpleDataRank: Array<number>;
	constructor(data?);
}
declare class S2CGetActRankData
{
	ActId: number;
	FullDataRank: Array<Rank>;
	SimpleDataRank: Array<SimpleRank>;
	MyData: SimpleRank ;
	constructor(data?);
}
declare class C2SGetActRankEndData
{
	Active: number;
	constructor(data?);
}
declare class S2CGetActRankEndData
{
	ActName: string ;
	ActEndTime: number;
	SimpleDataRank: Array<SimpleRank>;
	MyData: SimpleRank ;
	constructor(data?);
}
declare class C2SGetActRankEndDataN
{
	constructor(data?);
}
declare class S2CGetActRankEndDataN
{
	ActName: string ;
	ActEndTime: number;
	SettleRank10: Array<SettleRank>;
	MyRank: number;
	constructor(data?);
}
declare class SettleRank
{
	UserId: number;
	R: number;
	SortValue: number;
	Name: string ;
	World: string ;
	constructor(data?);
}
declare class C2SGetActPicture
{
	ActId: number;
	constructor(data?);
}
declare class S2CGetActPicture
{
	Tag: number;
	ActId: number;
	Task: Array<ActTask>;
	Pictures: Array<number>;
	PicAnimId: number;
	PartCount: number;
	PartAnimId: Array<number>;
	StickCount: number;
	Prize: number;
	Intro: number;
	PartItem: Array<number>;
	constructor(data?);
}
declare class C2SActPictureLight
{
	ActId: number;
	Part: number;
	constructor(data?);
}
declare class S2CActPictureLight
{
	Tag: number;
	ActId: number;
	Pictures: Array<number>;
	constructor(data?);
}
declare class C2SShowItem
{
	Type: number;
	Param1: number;
	Param2: string ;
	ChannelType: number;
	Param3: string ;
	constructor(data?);
}
declare class S2CShowItem
{
	Tag: number;
	constructor(data?);
}
declare class S2CReportShowItem
{
	UserId: number;
	Nick: string ;
	RoleId: number;
	GodLevel: number;
	Type: number;
	Param1: number;
	Param2: string ;
	PetQ: number;
	ChannelType: number;
	ShowId: number;
	SenderGodLevel: number;
	AreaId: number;
	SenderHead: number;
	SenderHeadFrame: number;
	SenderChatFrame: number;
	SenderTitle: number;
	SenderVIP: number;
	World: string ;
	HideVIP: number;
	PetAwaken: number;
	Param3: string ;
	constructor(data?);
}
declare class C2SGetShowInfo
{
	UserId: number;
	Type: number;
	Param1: number;
	Param2: string ;
	ShowId: number;
	constructor(data?);
}
declare class S2CGetShowInfo
{
	Tag: number;
	Type: number;
	ItemInfo: ItemData ;
	PartnerInfo: Partner ;
	PetInfo: Pet2 ;
	PreciousInfo: Precious ;
	GodEquip: Array<Grade>;
	PreciousPosInfo: PreciousPos ;
	ShowId: number;
	MedalId: number;
	MedalLevel: number;
	FightAttr: Array<IntAttr>;
	PEEffectKey: number;
	PESuitKey: Array<number>;
	PetEquip: Array<ItemData>;
	PlayerId: number;
	constructor(data?);
}
declare class C2SRedeemCode
{
	Code: string ;
	ActivityId: number;
	constructor(data?);
}
declare class S2CRedeemCode
{
	Tag: number;
	RewardList: string ;
	ActivityId: number;
	constructor(data?);
}
declare class C2SRealName
{
	Name: string ;
	Card: string ;
	constructor(data?);
}
declare class S2CRealName
{
	Tag: number;
	constructor(data?);
}
declare class C2SGetRealNamePrize
{
	RealName: number;
	constructor(data?);
}
declare class S2CGetRealNamePrize
{
	Tag: number;
	constructor(data?);
}
declare class S2CReportFcm
{
	FcmMinute: number;
	FcmStatus: number;
	constructor(data?);
}
declare class C2SSetFcm
{
	Fcm: number;
	constructor(data?);
}
declare class S2CRealNamePopups
{
	PopupsId: number;
	RealTimeType: number;
	ForceOffline: number;
	param: number;
	constructor(data?);
}
declare class C2SGetLimitCloth
{
	constructor(data?);
}
declare class S2CGetLimitCloth
{
	Tag: number;
	constructor(data?);
}
declare class S2CGetLimitClothEnd
{
	constructor(data?);
}
declare class BossHillBox
{
	BoxId: number;
	Pos: number;
	OpenTime: number;
	constructor(data?);
}
declare class S2CBossHillData
{
	Box: Array<BossHillBox>;
	Instances: Array<IntAttr>;
	constructor(data?);
}
declare class C2SBossHillFight
{
	Id: number;
	constructor(data?);
}
declare class S2CBossHillFight
{
	Tag: number;
	BoxId: number;
	Id: number;
	Win: number;
	constructor(data?);
}
declare class C2SBossHillReplace
{
	Pos: number;
	constructor(data?);
}
declare class S2CBossHillReplace
{
	Tag: number;
	BoxId: number;
	OpenTime: number;
	Pos: number;
	constructor(data?);
}
declare class C2SBossHillOpen
{
	IsCoin: number;
	Pos: number;
	constructor(data?);
}
declare class S2CBossHillOpen
{
	Tag: number;
	Pos: number;
	Items: Array<ItemData>;
	constructor(data?);
}
declare class Instance81Data
{
	InstanceId: number;
	FirstTeam: Array<string>;
	FirstTime: number;
	FirstRound: number;
	QuickTeam: Array<string>;
	QuickTime: number;
	QuickRound: number;
	constructor(data?);
}
declare class Player81Data
{
	InstanceId: number;
	State: number;
	FightTimes: number;
	IsBoxOpen: number;
	constructor(data?);
}
declare class S2C81Info
{
	Data: Array<Player81Data>;
	HelpTimes: number;
	constructor(data?);
}
declare class C2SViewInstance81Data
{
	InstanceId: number;
	constructor(data?);
}
declare class S2CViewInstance81Data
{
	InstanceId: number;
	Instance: Instance81Data ;
	constructor(data?);
}
declare class C2S81Sweep
{
	InstanceId: number;
	isSweepAll: number;
	constructor(data?);
}
declare class S2C81Sweep
{
	Tag: number;
	InstanceId: Array<number>;
	Items: Array<ItemData>;
	constructor(data?);
}
declare class C2S81BuyBox
{
	Id: number;
	Chapter: number;
	constructor(data?);
}
declare class S2C81BuyBox
{
	Tag: number;
	id: number;
	Chapter: number;
	Items: Array<ItemData>;
	constructor(data?);
}
declare class GodItem
{
	Id: number;
	L: number;
	S: number;
	S2: number;
	SS1: number;
	SS2: number;
	SS3: number;
	S3: number;
	LS1: number;
	LS2: number;
	LS3: number;
	LS1T: number;
	LS2T: number;
	LS3T: number;
	S4: number;
	LSTIME: number;
	ST: number;
	STC: number;
	constructor(data?);
}
declare class S2CAllGodItem
{
	GodItem: Array<GodItem>;
	constructor(data?);
}
declare class C2SUnlockGodItem
{
	Id: number;
	constructor(data?);
}
declare class S2CUnlockGodItem
{
	Tag: number;
	Id: number;
	constructor(data?);
}
declare class C2SGodItemLevelUp
{
	Id: number;
	constructor(data?);
}
declare class S2CGodItemLevelUp
{
	Tag: number;
	Id: number;
	Level: number;
	constructor(data?);
}
declare class C2SGodItemSoulUp
{
	Id: number;
	constructor(data?);
}
declare class S2CGodItemSoulUp
{
	Tag: number;
	Id: number;
	S: number;
	constructor(data?);
}
declare class C2SGodItemSoul2Up
{
	Id: number;
	constructor(data?);
}
declare class S2CGodItemSoul2Up
{
	Tag: number;
	Id: number;
	S2: number;
	constructor(data?);
}
declare class C2SGodItemSoul2SkillUp
{
	Id: number;
	SkillId: number;
	constructor(data?);
}
declare class S2CGodItemSoul2SkillUp
{
	Tag: number;
	Id: number;
	SkillId: number;
	SS: number;
	constructor(data?);
}
declare class C2SGodItemSoul3Up
{
	Id: number;
	constructor(data?);
}
declare class S2CGodItemSoul3Up
{
	Tag: number;
	Id: number;
	S3: number;
	constructor(data?);
}
declare class C2SGodItemForge
{
	Id: number;
	Type: number;
	Times: number;
	constructor(data?);
}
declare class S2CGodItemForge
{
	Tag: number;
	Id: number;
	Times: number;
	LS1T: number;
	LS2T: number;
	LS3T: number;
	constructor(data?);
}
declare class C2SGodItemForgeSave
{
	Id: number;
	constructor(data?);
}
declare class S2CGodItemForgeSave
{
	Tag: number;
	Id: number;
	LS1: number;
	LS2: number;
	LS3: number;
	constructor(data?);
}
declare class C2SGodItemSoul4Up
{
	Id: number;
	constructor(data?);
}
declare class S2CGodItemSoul4Up
{
	Tag: number;
	Id: number;
	S4: number;
	constructor(data?);
}
declare class C2SGodItemStoneUp
{
	Id: number;
	constructor(data?);
}
declare class S2CGodItemStoneUp
{
	Tag: number;
	Id: number;
	ST: number;
	constructor(data?);
}
declare class C2SGodItemStoneCut
{
	Id: number;
	constructor(data?);
}
declare class S2CGodItemStoneCut
{
	Tag: number;
	Id: number;
	STC: number;
	constructor(data?);
}
declare class C2SKingInfo
{
	constructor(data?);
}
declare class S2CKingInfo
{
	Tag: number;
	KingRank: number;
	Win: number;
	ContinueWin: number;
	Respect: number;
	Times: number;
	NextTime: number;
	constructor(data?);
}
declare class C2SKingState
{
	constructor(data?);
}
declare class S2CKingState
{
	State: number;
	constructor(data?);
}
declare class KingMatch
{
	UserId: number;
	ServerId: number;
	RoleId: number;
	Nick: string ;
	Rank: number;
	World: string ;
	constructor(data?);
}
declare class C2SKingMatch
{
	constructor(data?);
}
declare class S2CKingMatch
{
	Tag: number;
	MatchList: Array<KingMatch>;
	Target: KingMatch ;
	constructor(data?);
}
declare class C2SKingFight
{
	constructor(data?);
}
declare class S2CKingFight
{
	Tag: number;
	constructor(data?);
}
declare class KingRank
{
	KingRank: number;
	ServerId: number;
	Nick: string ;
	Win: number;
	Sort: number;
	Head: number;
	HeadFrame: number;
	FV: number;
	Id: number;
	World: string ;
	constructor(data?);
}
declare class C2SKingRank
{
	Type: number;
	constructor(data?);
}
declare class S2CKingRank
{
	Type: number;
	Rank: Array<KingRank>;
	MyRank: KingRank ;
	constructor(data?);
}
declare class C2SKingPlayer
{
	constructor(data?);
}
declare class S2CKingPlayer
{
	Id: number;
	ServerId: number;
	A: Array<IntAttr>;
	B: Array<StrAttr>;
	Win: number;
	World: string ;
	constructor(data?);
}
declare class C2SKingBuyTimes
{
	T: number;
	constructor(data?);
}
declare class S2CKingBuyTimes
{
	Tag: number;
	constructor(data?);
}
declare class C2SKingRespect
{
	constructor(data?);
}
declare class S2CKingRespect
{
	Tag: number;
	constructor(data?);
}
declare class C2SWordsWear
{
	Part: number;
	constructor(data?);
}
declare class S2CWordsWear
{
	Tag: number;
	Parts: Array<number>;
	constructor(data?);
}
declare class C2SWordsStick
{
	Part: number;
	Times: number;
	Level: number;
	constructor(data?);
}
declare class S2CWordsStick
{
	Tag: number;
	constructor(data?);
}
declare class PlayerRealm
{
	CurExp: number;
	Level: number;
	constructor(data?);
}
declare class S2CPlayerRealm
{
	Data: PlayerRealm ;
	constructor(data?);
}
declare class C2SOpenRealmSystem
{
	constructor(data?);
}
declare class S2COpenRealmSystem
{
	Tag: number;
	constructor(data?);
}
declare class C2SRealmOverfulfil
{
	constructor(data?);
}
declare class S2CRealmOverfulfil
{
	Tag: number;
	constructor(data?);
}
declare class RealmTargetPrize
{
	RealmLevel: number;
	PrizeState: number;
	LimitPrizeState: number;
	LimitPrizeExpireTimestamp: number;
	constructor(data?);
}
declare class C2SGetRealmPrizeInfo
{
	constructor(data?);
}
declare class S2CGetRealmPrizeInfo
{
	Tag: number;
	TargetPrize: Array<RealmTargetPrize>;
	DayPrizeState: number;
	constructor(data?);
}
declare class C2SGetRealmTargetPrize
{
	RealmLevel: number;
	constructor(data?);
}
declare class S2CGetRealmTargetPrize
{
	Tag: number;
	Data: RealmTargetPrize ;
	constructor(data?);
}
declare class C2SGetRealmDayPrize
{
	constructor(data?);
}
declare class S2CGetRealmDayPrize
{
	Tag: number;
	constructor(data?);
}
declare class C2SRealmTask
{
	constructor(data?);
}
declare class S2CRealmTask
{
	Tasks: Array<RealmTask>;
	constructor(data?);
}
declare class RealmTask
{
	Id: number;
	S: number;
	IC: number;
	C: number;
	SortIdx: number;
	constructor(data?);
}
declare class C2SGodClubSignUp
{
	constructor(data?);
}
declare class S2CGodClubSignUp
{
	Tag: number;
	constructor(data?);
}
declare class GodClubFightUser
{
	UserId: number;
	A: Array<IntAttr>;
	B: Array<StrAttr>;
	constructor(data?);
}
declare class C2SGodClubFight
{
	FightIdx: number;
	constructor(data?);
}
declare class S2CGodClubFight
{
	A: GodClubFightUser ;
	B: GodClubFightUser ;
	Win: Array<number>;
	FightIdx: number;
	constructor(data?);
}
declare class C2SGodClubFightReport
{
	FightIdx: number;
	GameIdx: number;
	constructor(data?);
}
declare class S2CGodClubFightReport
{
	Tag: number;
	constructor(data?);
}
declare class GodClub16User
{
	UserId: number;
	RoleId: number;
	Nick: string ;
	AreaId: number;
	Pos: number;
	Win: Array<number>;
	constructor(data?);
}
declare class C2SGodClub16
{
	constructor(data?);
}
declare class S2CGodClub16
{
	Users: Array<GodClub16User>;
	Stakes: Array<number>;
	constructor(data?);
}
declare class C2SGodClubStakeInfo
{
	FightId: number;
	constructor(data?);
}
declare class S2CGodClubStakeInfo
{
	FightId: number;
	Pos: number;
	StakeId: number;
	A: GodClubFightUser ;
	B: GodClubFightUser ;
	constructor(data?);
}
declare class C2SGodClubStake
{
	FightId: number;
	Pos: number;
	StackId: number;
	constructor(data?);
}
declare class S2CGodClubStake
{
	Tag: number;
	constructor(data?);
}
declare class C2SGodHerbEnter
{
	Id: number;
	constructor(data?);
}
declare class S2CGodHerbEnter
{
	Tag: number;
	Id: number;
	constructor(data?);
}
declare class C2SGodHerbRefresh
{
	constructor(data?);
}
declare class S2CGodHerbRefresh
{
	Tag: number;
	constructor(data?);
}
declare class C2SGodHerbCollect
{
	Id: number;
	Num: number;
	AutoBuy: number;
	constructor(data?);
}
declare class S2CGodHerbCollect
{
	Tag: number;
	Num: number;
	Data: Array<ItemData>;
	constructor(data?);
}
declare class C2SGetGodHerbLog
{
	Type: number;
	constructor(data?);
}
declare class GodHerbLogItemClient
{
	Time: number;
	User: NoticeUser ;
	GodHerbId: number;
	Item: Array<ItemData>;
	constructor(data?);
}
declare class S2CGetGodHerbLog
{
	Type: number;
	Logs: Array<GodHerbLogItemClient>;
	constructor(data?);
}
declare class RobberyLogItem
{
	UserId: number;
	Nick: string ;
	AreaId: number;
	Time: number;
	Pos: number;
	Mul: number;
	Coin3: number;
	constructor(data?);
}
declare class S2CRobberyInfo
{
	Items: Array<RobberData>;
	constructor(data?);
}
declare class C2SGetRobberyData
{
	ItemId: number;
	Num: number;
	constructor(data?);
}
declare class S2CGetRobberyData
{
	Coin3: number;
	Id: number;
	Mul: number;
	constructor(data?);
}
declare class C2SRobbery
{
	ItemId: number;
	Num: number;
	Pos: number;
	constructor(data?);
}
declare class S2CRobbery
{
	Tag: number;
	Id: number;
	Items: Array<RobberData>;
	constructor(data?);
}
declare class C2SRobberyLuck
{
	Id: number;
	constructor(data?);
}
declare class S2CRobberyLuck
{
	Tag: number;
	Id: number;
	constructor(data?);
}
declare class C2SGetRobberyLog
{
	Type: number;
	constructor(data?);
}
declare class S2CGetRobberyLog
{
	Items: Array<RobberyLogItem>;
	Type: number;
	constructor(data?);
}
declare class ClientDb
{
	Key: string ;
	Value: string ;
	constructor(data?);
}
declare class S2CClientDb
{
	Items: Array<ClientDb>;
	constructor(data?);
}
declare class C2SClinetSet
{
	Key: string ;
	Value: string ;
	constructor(data?);
}
declare class S2CClinetSet
{
	Tag: number;
	constructor(data?);
}
declare class ZF
{
	Id: number;
	State: number;
	PetId: Array<number>;
	constructor(data?);
}
declare class C2SGetZF
{
	constructor(data?);
}
declare class S2CGetZF
{
	Tag: number;
	ZF: Array<ZF>;
	constructor(data?);
}
declare class C2SZFPetUp
{
	Id: number;
	Pos: number;
	PetId: number;
	constructor(data?);
}
declare class S2CZFPetUp
{
	Tag: number;
	Id: number;
	Pos: number;
	PetId: number;
	constructor(data?);
}
declare class C2SZFState
{
	Id: number;
	State: number;
	constructor(data?);
}
declare class S2CZFState
{
	Tag: number;
	Id: number;
	State: number;
	constructor(data?);
}
declare class C2SZFUnlock
{
	Id: number;
	constructor(data?);
}
declare class S2CZFUnlock
{
	Tag: number;
	Id: number;
	constructor(data?);
}
declare class RankPetData
{
	Id: string ;
	IId: number;
	Name: string ;
	Level: number;
	Reborn: number;
	Fv: number;
	Q: number;
	T: number;
	Awaken: number;
	constructor(data?);
}
declare class C2SFuncOpen
{
	FuncId: number;
	constructor(data?);
}
declare class S2CFuncOpen
{
	Tag: number;
	constructor(data?);
}
declare class C2SRobotZF
{
	constructor(data?);
}
declare class PhotoBook
{
	Id: number;
	L: number;
	SL: number;
	constructor(data?);
}
declare class PhotoBookPrize
{
	Type: number;
	Num: number;
	constructor(data?);
}
declare class S2CUserPhotoBook
{
	T: Array<PhotoBook>;
	constructor(data?);
}
declare class C2SPhotoBookLevelUp
{
	Id: number;
	constructor(data?);
}
declare class S2CPhotoBookLevelUp
{
	Tag: number;
	Id: number;
	L: number;
	SL: number;
	constructor(data?);
}
declare class C2SPhotoBookDel
{
	constructor(data?);
}
declare class S2CPhotoBookDel
{
	Tag: number;
	constructor(data?);
}
declare class C2SPhotoBookPrize
{
	Type: number;
	Num: number;
	constructor(data?);
}
declare class S2CPhotoBookPrize
{
	Tag: number;
	Prize: Array<PhotoBookPrize>;
	constructor(data?);
}
declare class C2SPhotoBookStrength
{
	Id: number;
	Type: number;
	constructor(data?);
}
declare class S2CPhotoBookStrength
{
	Tag: number;
	Id: number;
	Type: number;
	SL: number;
	constructor(data?);
}
declare class C2SBuyChargeGift
{
	Id: number;
	constructor(data?);
}
declare class S2CBuyChargeGift
{
	Tag: number;
	Id: number;
	constructor(data?);
}
declare class S2CAllChargeGift
{
	List: Array<number>;
	constructor(data?);
}
declare class S2CVipService
{
	QQ: string ;
	constructor(data?);
}
declare class C2SNewPlayerZF
{
	constructor(data?);
}
declare class Pet2
{
	Id: string ;
	IId: number;
	L: number;
	E: number;
	R: number;
	ATalent: number;
	DTalent: number;
	HTalent: number;
	Grow: number;
	S: Array<PetSkill>;
	B: number;
	N: string ;
	A: number;
	D: number;
	H: number;
	IsNew: number;
	TimeStamp: number;
	MaxATalent: number;
	MaxDTalent: number;
	MaxHTalent: number;
	MaxGrow: number;
	Boundary: number;
	Lock: number;
	PetType: number;
	Q: number;
	Fv: number;
	RaiseUpItem: Array<ItemInfo>;
	Awaken: number;
	BaseFv: number;
	Equips: Array<string>;
	BdjjIds: Array<number>;
	constructor(data?);
}
declare class PetSkill
{
	I: number;
	L: number;
	Lock: number;
	constructor(data?);
}
declare class C2SAllPet2
{
	constructor(data?);
}
declare class S2CAllPet2
{
	Tag: number;
	List: Array<Pet2>;
	constructor(data?);
}
declare class C2SPet2Info
{
	Id: string ;
	constructor(data?);
}
declare class S2CPet2Info
{
	Tag: number;
	Pet2: Array<Pet2>;
	constructor(data?);
}
declare class C2SPet2LevelUp
{
	Id: string ;
	ItemId: number;
	ItemNum: number;
	constructor(data?);
}
declare class S2CPet2LevelUp
{
	Tag: number;
	Pet2: Pet2 ;
	constructor(data?);
}
declare class C2SPet2TalentUp
{
	Id: string ;
	ItemId: number;
	Type: number;
	Auto: number;
	constructor(data?);
}
declare class S2CPet2TalentUp
{
	Tag: number;
	Type: number;
	Pet2: Pet2 ;
	constructor(data?);
}
declare class C2SPet2GrowUp
{
	Id: string ;
	ItemId: number;
	Auto: number;
	constructor(data?);
}
declare class S2CPet2GrowUp
{
	Tag: number;
	Pet2: Pet2 ;
	constructor(data?);
}
declare class C2SPet2RaiseUp
{
	Id: string ;
	ItemId: number;
	Auto: number;
	constructor(data?);
}
declare class S2CPet2RaiseUp
{
	Tag: number;
	Pet2: Pet2 ;
	constructor(data?);
}
declare class C2SPet2Devour
{
	Id: string ;
	Ids: string ;
	ItemId: number;
	constructor(data?);
}
declare class S2CPet2Devour
{
	Tag: number;
	Pet2: Pet2 ;
	Type: number;
	constructor(data?);
}
declare class C2SOneKeyPet2Devour
{
	Params: Array<DevourParam>;
	IsPart: number;
	constructor(data?);
}
declare class S2COneKeyPet2Devour
{
	Tag: number;
	Pets: Array<Pet2>;
	constructor(data?);
}
declare class DevourParam
{
	MainId: string ;
	Ids: Array<string>;
	constructor(data?);
}
declare class C2SPet2Lock
{
	Id: string ;
	Lock: number;
	constructor(data?);
}
declare class S2CPet2Lock
{
	Tag: number;
	Pet2: Pet2 ;
	constructor(data?);
}
declare class C2SPet2GiveUp
{
	Id: string ;
	constructor(data?);
}
declare class S2CPet2GiveUp
{
	Tag: number;
	Id: string ;
	ItemInfo: Array<ItemInfo>;
	constructor(data?);
}
declare class C2SBatchPet2GiveUp
{
	Ids: Array<string>;
	constructor(data?);
}
declare class S2CBatchPet2GiveUp
{
	Tag: number;
	Ids: Array<string>;
	ItemInfo: Array<ItemInfo>;
	constructor(data?);
}
declare class C2SPet2Compose
{
	Id1: string ;
	Id2: string ;
	Protect: number;
	Auto: number;
	constructor(data?);
}
declare class S2CPet2Compose
{
	Tag: number;
	Id1: string ;
	Id2: string ;
	NewPet: Pet2 ;
	ADiff: number;
	DDiff: number;
	HDiff: number;
	GDiff: number;
	constructor(data?);
}
declare class C2SPet2Reborn
{
	Id: string ;
	constructor(data?);
}
declare class S2CPet2Reborn
{
	Tag: number;
	Id: string ;
	Pet2: Pet2 ;
	constructor(data?);
}
declare class C2SPet2Reset
{
	Id: string ;
	constructor(data?);
}
declare class S2CPet2Reset
{
	Tag: number;
	Pet2: Pet2 ;
	ItemInfo: Array<ItemInfo>;
	constructor(data?);
}
declare class C2SPet2UnDevour
{
	Id: string ;
	constructor(data?);
}
declare class S2CPet2UnDevour
{
	Tag: number;
	Pet2: Pet2 ;
	constructor(data?);
}
declare class C2SPet2Nick
{
	Id: string ;
	N: string ;
	constructor(data?);
}
declare class S2CPet2Nick
{
	Tag: number;
	Id: string ;
	N: string ;
	constructor(data?);
}
declare class C2SPet2BattlePos
{
	Id: string ;
	IId: number;
	Pos: number;
	constructor(data?);
}
declare class S2CPet2BattlePos
{
	Tag: number;
	Id: string ;
	RestId: string ;
	Pos: number;
	constructor(data?);
}
declare class C2SPet2SkillLock
{
	Id: string ;
	SkillId: number;
	constructor(data?);
}
declare class S2CPet2SkillLock
{
	Tag: number;
	Pet2: Pet2 ;
	constructor(data?);
}
declare class C2SPet2SkillBook
{
	Id: string ;
	ItemId: number;
	Auto: number;
	constructor(data?);
}
declare class S2CPet2SkillBook
{
	Tag: number;
	NewPet: Pet2 ;
	newId: number;
	constructor(data?);
}
declare class C2SRetrieveSkill
{
	books: string ;
	constructor(data?);
}
declare class S2CRetrieveSkill
{
	Tag: number;
	constructor(data?);
}
declare class C2SStickPet2
{
	Id: number;
	constructor(data?);
}
declare class S2CUnlockNewPet2
{
	Tag: number;
	Pet2: Array<Pet2>;
	IsShow: number;
	constructor(data?);
}
declare class C2SRemPet2Mark
{
	id: string ;
	constructor(data?);
}
declare class S2CRemPet2Mark
{
	Tag: number;
	id: string ;
	constructor(data?);
}
declare class C2SPet2Exchange
{
	id: string ;
	iid: number;
	constructor(data?);
}
declare class S2CPet2Exchange
{
	Tag: number;
	Id: string ;
	Pet2: Pet2 ;
	constructor(data?);
}
declare class Pet2Skill
{
	Id: number;
	Name: string ;
	Quality: number;
	SKType: number;
	Summary: string ;
	AttrInc: number;
	ItemId: number;
	DropProb: number;
	RetrieveItem: string ;
	constructor(data?);
}
declare class SysPet2
{
	Id: number;
	Quality: number;
	Skills: Array<Pet2Skill>;
	Show_Id: number;
	constructor(data?);
}
declare class C2SGetRandSysPet2
{
	Id: string ;
	IsDefault: number;
	constructor(data?);
}
declare class S2CGetRandSysPet2
{
	Tag: number;
	SysPet2: SysPet2 ;
	constructor(data?);
}
declare class C2SGetPet2Chip
{
	constructor(data?);
}
declare class S2CGetPet2Chip
{
	Tag: number;
	ItemData: Array<ItemData>;
	constructor(data?);
}
declare class C2SPetAwaken
{
	Id: string ;
	IdStr: string ;
	constructor(data?);
}
declare class S2CPetAwaken
{
	Tag: number;
	Pet2: Pet2 ;
	constructor(data?);
}
declare class C2SPetAwakenBackPets
{
	Id: string ;
	constructor(data?);
}
declare class S2CPetAwakenBackPets
{
	Tag: number;
	Pet2: Array<Pet2>;
	Items: Array<ItemInfo>;
	constructor(data?);
}
declare class C2SPetAwakenBack
{
	Id: string ;
	constructor(data?);
}
declare class S2CPetAwakenBack
{
	Tag: number;
	Pet2: Pet2 ;
	Pets: Array<Pet2>;
	Items: Array<ItemInfo>;
	constructor(data?);
}
declare class C2SPetExchange
{
	Id: string ;
	ItemId: number;
	PetId: number;
	constructor(data?);
}
declare class S2CPetExchange
{
	Tag: number;
	Pet2: Pet2 ;
	constructor(data?);
}
declare class C2SPetEvolution
{
	id: string ;
	constructor(data?);
}
declare class S2CPetEvolution
{
	Tag: number;
	Pet2: Pet2 ;
	DelId: string ;
	constructor(data?);
}
declare class Sect
{
	Id: number;
	Name: string ;
	ReName: number;
	Leader: number;
	LoseLeader: number;
	ViceLeader: number;
	Elders: Array<number>;
	Warrior: Array<number>;
	ReceiveGift: number;
	Level: number;
	Exp: number;
	Note: string ;
	Reappointment: number;
	Session: number;
	Statue: Statue ;
	Sid: number;
	Timestamp: number;
	SymbolId: number;
	ReSymbolId: number;
	World: string ;
	constructor(data?);
}
declare class Statue
{
	A: Array<IntAttr>;
	B: Array<StrAttr>;
	constructor(data?);
}
declare class C2SSectInfo
{
	constructor(data?);
}
declare class S2CSectInfo
{
	Sect: Sect ;
	constructor(data?);
}
declare class C2SSectReName
{
	NewName: string ;
	constructor(data?);
}
declare class S2CSectReName
{
	Tag: number;
	NewName: string ;
	constructor(data?);
}
declare class C2SEditSectNote
{
	Note: string ;
	constructor(data?);
}
declare class S2CEditSectNote
{
	Tag: number;
	Note: string ;
	constructor(data?);
}
declare class C2SSectSetSymbolId
{
	SymbolId: number;
	constructor(data?);
}
declare class S2CSectSetSymbolId
{
	Tag: number;
	SymbolId: number;
	constructor(data?);
}
declare class C2SRecvSectReward
{
	Level: number;
	constructor(data?);
}
declare class S2CRecvSectReward
{
	Tag: number;
	Reward: string ;
	Level: string ;
	constructor(data?);
}
declare class C2SWorship
{
	constructor(data?);
}
declare class S2CWorship
{
	Tag: number;
	constructor(data?);
}
declare class C2STribute
{
	constructor(data?);
}
declare class S2CTribute
{
	Tag: number;
	constructor(data?);
}
declare class SectMember
{
	Id: number;
	Nick: string ;
	RoleId: number;
	FamilyName: string ;
	FamilyFv: number;
	SectExp: number;
	Fv: number;
	Job: number;
	Head: number;
	HeadFrame: number;
	Prestige: number;
	Sid: number;
	FSid: number;
	OfflineTime: number;
	VipLv: number;
	World: string ;
	FWorld: string ;
	HideVIP: number;
	constructor(data?);
}
declare class C2SJoinSect
{
	constructor(data?);
}
declare class S2CJoinSect
{
	Tag: number;
	constructor(data?);
}
declare class C2SSectMembers
{
	Page: number;
	Size: number;
	constructor(data?);
}
declare class S2CSectMembers
{
	Tag: number;
	members: Array<SectMember>;
	Total: number;
	Online: number;
	Page: number;
	constructor(data?);
}
declare class C2SSectMembers2
{
	Page: number;
	Size: number;
	constructor(data?);
}
declare class S2CSectMembers2
{
	Tag: number;
	members: Array<SectMember>;
	Total: number;
	Online: number;
	Page: number;
	JobMembers: Array<SectMember>;
	constructor(data?);
}
declare class C2SSectMembersInfo
{
	constructor(data?);
}
declare class S2CSectMembersInfo
{
	Tag: number;
	Total: number;
	Online: number;
	TotalFv: number;
	SelfSectExp: number;
	SectRank: number;
	constructor(data?);
}
declare class C2SLevelSectSkill
{
	SkillId: number;
	constructor(data?);
}
declare class S2CLevelSectSkill
{
	Tag: number;
	SectSkills: Array<Skill>;
	constructor(data?);
}
declare class C2SLevelSectSkillMaster
{
	constructor(data?);
}
declare class S2CLevelSectSkillMaster
{
	Tag: number;
	Level: number;
	constructor(data?);
}
declare class C2SSectChallengeBoss
{
	constructor(data?);
}
declare class S2CSectChallengeBoss
{
	Tag: number;
	IsWin: number;
	constructor(data?);
}
declare class C2SSectChallengeLeader
{
	constructor(data?);
}
declare class S2CSectChallengeLeader
{
	Tag: number;
	constructor(data?);
}
declare class SectFightReports
{
	UserId1: number;
	UserId2: number;
	Win: number;
	constructor(data?);
}
declare class C2SSectFightReports
{
	constructor(data?);
}
declare class S2CSectFightReports
{
	Tag: number;
	SectFightReports: Array<SectFightReports>;
	constructor(data?);
}
declare class C2SSectPlayerFightReport
{
	Index: number;
	constructor(data?);
}
declare class S2CSectPlayerFightReport
{
	Tag: number;
	constructor(data?);
}
declare class SectBossFight
{
	UserId: number;
	Nick: string ;
	Fv: number;
	RoleId: number;
	Level: number;
	HurtVal: number;
	Head: number;
	HeadFrame: number;
	Sid: number;
	World: string ;
	constructor(data?);
}
declare class C2SSectLeaderFightRank
{
	constructor(data?);
}
declare class S2CSectLeaderFightRank
{
	Tag: number;
	SectBossFightArr: Array<SectBossFight>;
	MyRank: number;
	constructor(data?);
}
declare class C2SSectLeaderFightMyRank
{
	constructor(data?);
}
declare class S2CSectLeaderFightMyRank
{
	Tag: number;
	MyRank: number;
	MyHurtVal: number;
	constructor(data?);
}
declare class C2SSectActStartTime
{
	constructor(data?);
}
declare class S2CSectActStartTime
{
	Tag: number;
	StartTime: number;
	FirstOverTime: number;
	SecondStartTime: number;
	OverTime: number;
	constructor(data?);
}
declare class JobInfo
{
	UserId: number;
	Nick: string ;
	Fv: number;
	Job: number;
	RoleId: number;
	Level: number;
	Rank: number;
	Head: number;
	HeadFrame: number;
	Sid: number;
	World: string ;
	constructor(data?);
}
declare class C2SSectJobRank
{
	constructor(data?);
}
declare class S2CSectJobRank
{
	Tag: number;
	JobRank: Array<JobInfo>;
	MyRank: number;
	constructor(data?);
}
declare class C2SSectCandidate
{
	constructor(data?);
}
declare class S2CSectCandidate
{
	A: Array<IntAttr>;
	B: Array<StrAttr>;
	constructor(data?);
}
declare class SectGodAnimalInfo
{
	level: number;
	Num: number;
	ActiveSkills: Array<number>;
	PassiveSkills: Array<string>;
	WinNum: number;
	constructor(data?);
}
declare class C2SSectGodAnimalInfo
{
	constructor(data?);
}
declare class S2CSectGodAnimalInfo
{
	Tag: number;
	SectGodAnimalInfo: SectGodAnimalInfo ;
	constructor(data?);
}
declare class GodAnimalPlayerData
{
	Id: number;
	Num: number;
	Invite: Array<GodAnimalInvite>;
	constructor(data?);
}
declare class C2SSectGodAnimalData
{
	constructor(data?);
}
declare class S2CSectGodAnimalData
{
	GodAnimalPlayerData: GodAnimalPlayerData ;
	constructor(data?);
}
declare class GodAnimalPassRecord
{
	UserId: number;
	Nick: string ;
	RaceId: number;
	Fv: number;
	Num: number;
	PassNum: number;
	Head: number;
	HeadFrame: number;
	Sid: number;
	World: string ;
	constructor(data?);
}
declare class C2SGodAnimalPassData
{
	constructor(data?);
}
declare class S2CGodAnimalPassData
{
	Tag: number;
	GodAnimalPassRecord: GodAnimalPassRecord ;
	constructor(data?);
}
declare class C2SGodAnimalPassRecord
{
	constructor(data?);
}
declare class S2CGodAnimalPassRecord
{
	GodAnimalPassRecord: Array<GodAnimalPassRecord>;
	constructor(data?);
}
declare class C2SChallengeGodAnimal
{
	constructor(data?);
}
declare class S2CChallengeGodAnimal
{
	Tag: number;
	IsWin: number;
	constructor(data?);
}
declare class GodAnimalInvite
{
	UserId: number;
	A: Array<IntAttr>;
	B: Array<StrAttr>;
	constructor(data?);
}
declare class C2SGodAnimalInvite
{
	constructor(data?);
}
declare class S2CGodAnimalInvite
{
	Tag: number;
	GodAnimalInvite: Array<GodAnimalInvite>;
	constructor(data?);
}
declare class C2SSectPrestigeLevelUp
{
	constructor(data?);
}
declare class S2CSectPrestigeLevelUp
{
	Tag: number;
	constructor(data?);
}
declare class C2SSectPrestigeRecv
{
	constructor(data?);
}
declare class S2CSectPrestigeRecv
{
	Tag: number;
	constructor(data?);
}
declare class IMPlayerInfo
{
	UserId: number;
	Nick: string ;
	RoleId: number;
	Sid: number;
	SectId: number;
	SectName: string ;
	Pos: number;
	Realm: number;
	SectAdd: number;
	Hp: number;
	HpMax: number;
	Fv: number;
	Level: number;
	AreaId: number;
	World: string ;
	SWorld: string ;
	constructor(data?);
}
declare class C2SSectIMMyPos
{
	constructor(data?);
}
declare class S2CSectImMyPos
{
	Tag: number;
	Id: number;
	Reward: Array<ItemInfo>;
	FightTimestamp: number;
	Timestamp: number;
	SectAdd: number;
	Pos: number;
	constructor(data?);
}
declare class C2SGetAllIMInfo
{
	Id: number;
	constructor(data?);
}
declare class S2CGetAllIMInfo
{
	Tag: number;
	Id: number;
	Players: Array<IMPlayerInfo>;
	Fail: Array<number>;
	constructor(data?);
}
declare class C2SSectIMSeize
{
	Id: number;
	Pos: number;
	SectName: string ;
	constructor(data?);
}
declare class S2CSectIMSeize
{
	Tag: number;
	Id: number;
	Pos: number;
	SectAdd: number;
	Timestamp: number;
	FightTimestamp: number;
	constructor(data?);
}
declare class S2CSectIMSeizeNotice
{
	Nick: string ;
	constructor(data?);
}
declare class S2CSectIMSeizeReward
{
	Tag: number;
	Id: number;
	Pos: number;
	Timestamp: number;
	Reward: Array<ItemInfo>;
	constructor(data?);
}
declare class C2SSectIMGiveUp
{
	Id: number;
	Pos: number;
	constructor(data?);
}
declare class S2CSectIMGiveUp
{
	Tag: number;
	constructor(data?);
}
declare class C2SClearIMFightCD
{
	constructor(data?);
}
declare class S2CClearIMFightCD
{
	Tag: number;
	constructor(data?);
}
declare class S2CIMPlayerChange
{
	Id: number;
	constructor(data?);
}
declare class BestPetRecord
{
	UserId: number;
	Nick: string ;
	AreaId: number;
	PetId: number;
	Rarity: number;
	Quality: number;
	Type: number;
	Module: number;
	World: string ;
	constructor(data?);
}
declare class PasturePet
{
	UserId: number;
	Id: number;
	PetId: number;
	PointX: number;
	PointY: number;
	Event: number;
	IsFight: number;
	Timestamp: number;
	constructor(data?);
}
declare class PastureBuff
{
	UserId: number;
	BuffId: number;
	Timestamp: number;
	Flag: number;
	constructor(data?);
}
declare class SearchRecord
{
	UserId: number;
	ItemId: number;
	PetId: number;
	Event: number;
	constructor(data?);
}
declare class C2SGroupInfo
{
	constructor(data?);
}
declare class S2CGroupInfo
{
	GroupId: number;
	GroupTimestamp: number;
	constructor(data?);
}
declare class C2SEnterAnimalPark
{
	constructor(data?);
}
declare class S2CEnterAnimalPark
{
	Tag: number;
	GodAnimalRageTimestamp: number;
	CollapseTimestamp: number;
	GodAnimalRageFightTimes: number;
	SearchRecord: Array<SearchRecord>;
	Pet: Array<PasturePet>;
	Buff: Array<PastureBuff>;
	GodAnimalRageFightTimestamp: number;
	constructor(data?);
}
declare class C2SLeaveAnimalPark
{
	constructor(data?);
}
declare class S2CLeaveAnimalPark
{
	Tag: number;
	constructor(data?);
}
declare class C2SAutoSearch
{
	ItemId: Array<number>;
	constructor(data?);
}
declare class S2CAutoSearch
{
	Tag: number;
	constructor(data?);
}
declare class C2SSearchPet
{
	ItemId: number;
	constructor(data?);
}
declare class S2CSearchPet
{
	Tag: number;
	Pet: PasturePet ;
	Buff: PastureBuff ;
	constructor(data?);
}
declare class S2CSearchRecord
{
	SearchRecord: SearchRecord ;
	constructor(data?);
}
declare class S2CGodAnimalTimestamp
{
	Timestamp: number;
	constructor(data?);
}
declare class S2CCollapseNotice
{
	Timestamp: number;
	constructor(data?);
}
declare class S2CPushAnimalParkBuff
{
	Buff: Array<PastureBuff>;
	constructor(data?);
}
declare class DelPets
{
	PetId: number;
	PetX: number;
	PetY: number;
	constructor(data?);
}
declare class C2SAnimalParkGO
{
	PetId: number;
	X: number;
	Y: number;
	constructor(data?);
}
declare class S2CAnimalParkGO
{
	Tag: number;
	Times: number;
	DelPets: Array<DelPets>;
	constructor(data?);
}
declare class S2CAnimalParkCatch
{
	Tag: number;
	PetId: number;
	Drop: Array<ItemData>;
	constructor(data?);
}
declare class S2CAnimalParkCatchTips
{
	Pet2: Pet2 ;
	UserId: number;
	Nick: string ;
	AreaId: number;
	World: string ;
	constructor(data?);
}
declare class C2SBestPetRecord
{
	constructor(data?);
}
declare class S2CBestPetRecord
{
	Tag: number;
	BestPetRecord: Array<BestPetRecord>;
	constructor(data?);
}
declare class C2SFightBoss
{
	constructor(data?);
}
declare class S2CFightBoss
{
	Tag: number;
	GodAnimalRageFightTimestamp: number;
	Timestamp: number;
	constructor(data?);
}
declare class C2SFightBossClearCD
{
	constructor(data?);
}
declare class S2CFightBossClearCD
{
	Tag: number;
	Timestamp: number;
	constructor(data?);
}
declare class C2SEnterCrossPasture
{
	constructor(data?);
}
declare class S2CEnterCrossPasture
{
	Tag: number;
	constructor(data?);
}
declare class C2SLeaveCrossPasture
{
	constructor(data?);
}
declare class S2CLeaveCrossPasture
{
	Tag: number;
	constructor(data?);
}
declare class CrossPastureTrap
{
	ItemId: number;
	PetId: number;
	Wait: number;
	X: number;
	Y: number;
	Expire: number;
	constructor(data?);
}
declare class S2CCrossPastureTrapList
{
	Tag: number;
	TrapList: Array<CrossPastureTrap>;
	constructor(data?);
}
declare class C2SUseTrap
{
	ItemId: number;
	constructor(data?);
}
declare class S2CUseTrap
{
	Tag: number;
	Trap: CrossPastureTrap ;
	constructor(data?);
}
declare class C2SCatchCrossPet
{
	PetId: number;
	X: number;
	Y: number;
	constructor(data?);
}
declare class S2CCatchCrossPet
{
	Tag: number;
	PetId: number;
	Drop: Array<ItemData>;
	Trap: CrossPastureTrap ;
	constructor(data?);
}
declare class S2CDelExpireTraps
{
	Tag: number;
	Traps: Array<CrossPastureTrap>;
	constructor(data?);
}
declare class CatchRecord
{
	UserId: number;
	Nick: string ;
	AreaId: number;
	PetId: number;
	World: string ;
	constructor(data?);
}
declare class C2SCatchRecord
{
	constructor(data?);
}
declare class S2CCatchRecord
{
	Tag: number;
	Records: Array<CatchRecord>;
	constructor(data?);
}
declare class C2SFightSectCrossBoss
{
	constructor(data?);
}
declare class S2CFightSectCrossBoss
{
	Tag: number;
	constructor(data?);
}
declare class SectCrossBossRankItem
{
	Rank: number;
	UserId: number;
	Nick: string ;
	AreaId: number;
	ShowHead: number;
	ShowHeadFrame: number;
	Vip: number;
	FamilyAreaId: number;
	Family: string ;
	SectName: string ;
	HurtVal: number;
	SectAreaId: number;
	World: string ;
	SWorld: string ;
	HideVIP: number;
	Fv: number;
	constructor(data?);
}
declare class C2SSectCrossBossRank
{
	constructor(data?);
}
declare class S2CSectCrossBossRank
{
	Tag: number;
	PersonalRank: Array<SectCrossBossRankItem>;
	SectRank: Array<SectCrossBossRankItem>;
	constructor(data?);
}
declare class SectCrossBossBox
{
	ItemId: number;
	X: number;
	Y: number;
	UserId: number;
	Timestamp: number;
	MonsterId: number;
	constructor(data?);
}
declare class C2SSectCrossBossBox
{
	constructor(data?);
}
declare class S2CSectCrossBossBox
{
	Tag: number;
	Boxes: Array<SectCrossBossBox>;
	constructor(data?);
}
declare class PlayerProgressBar
{
	UserId: number;
	Type: number;
	X: number;
	Y: number;
	Timestamp: number;
	MonsterId: number;
	constructor(data?);
}
declare class S2CPlayerProgressBar
{
	Tag: number;
	PlayerProgressBar: PlayerProgressBar ;
	constructor(data?);
}
declare class C2SOpenBoxTimestamp
{
	BoxId: number;
	X: number;
	Y: number;
	MonsterId: number;
	constructor(data?);
}
declare class S2COpenBoxTimestamp
{
	Tag: number;
	constructor(data?);
}
declare class C2SReceiveBoxReward
{
	BoxId: number;
	X: number;
	Y: number;
	MonsterId: number;
	constructor(data?);
}
declare class S2CReceiveBoxReward
{
	Tag: number;
	constructor(data?);
}
declare class C2SSectCrossFightPVP
{
	UserId: number;
	constructor(data?);
}
declare class S2CSectCrossFightPVP
{
	Tag: number;
	constructor(data?);
}
declare class C2SFightBossTimes
{
	ActId: number;
	constructor(data?);
}
declare class S2CFightBossTimes
{
	Tag: number;
	Times: number;
	Timestamp: number;
	constructor(data?);
}
declare class C2SFightCrossBossClearCD
{
	ActId: number;
	constructor(data?);
}
declare class S2CFightCrossBossClearCD
{
	Tag: number;
	Timestamp: number;
	constructor(data?);
}
declare class C2SProgressBarBreak
{
	constructor(data?);
}
declare class S2CProgressBarBreak
{
	Tag: number;
	UserId: number;
	constructor(data?);
}
declare class SectCrossSeizePet
{
	PetId: number;
	X: number;
	Y: number;
	UserId: number;
	Timestamp: number;
	AreaId: number;
	Nick: string ;
	Fv: number;
	IsSeize: number;
	ReleaseTime: number;
	MonsterId: number;
	World: string ;
	constructor(data?);
}
declare class S2CSectCrossSeizePets
{
	Tag: number;
	pets: Array<SectCrossSeizePet>;
	constructor(data?);
}
declare class S2CSeizePetCanChoice
{
	Tag: number;
	pets: Array<SectCrossSeizePet>;
	constructor(data?);
}
declare class C2SSeizePetChoice
{
	PetId: number;
	X: number;
	Y: number;
	constructor(data?);
}
declare class S2CSeizePetChoice
{
	Tag: number;
	constructor(data?);
}
declare class C2SPickUpPetStart
{
	PetId: number;
	X: number;
	Y: number;
	constructor(data?);
}
declare class S2CPickUpPetStart
{
	Tag: number;
	constructor(data?);
}
declare class C2SPickUpPetEnd
{
	PetId: number;
	X: number;
	Y: number;
	constructor(data?);
}
declare class S2CPickUpPetEnd
{
	Tag: number;
	constructor(data?);
}
declare class C2SAutoCatch
{
	ItemId: Array<number>;
	constructor(data?);
}
declare class S2CAutoCatch
{
	Tag: number;
	constructor(data?);
}
declare class SeizeRecord
{
	UserId: number;
	Nick: string ;
	AreaId: number;
	PetId: number;
	TagUserId: number;
	TagNick: string ;
	TagAreaId: number;
	World: string ;
	TagWorld: string ;
	constructor(data?);
}
declare class C2SSeizeRecord
{
	constructor(data?);
}
declare class S2CSeizeRecord
{
	Tag: number;
	Records: Array<SeizeRecord>;
	constructor(data?);
}
declare class S2CTrapPet
{
	Tag: number;
	PetId: number;
	constructor(data?);
}
declare class FamilyTotemPet
{
	UserId: number;
	PetId: string ;
	PetIId: number;
	Quality: number;
	UseUserId: number;
	TotemId: number;
	PetType: number;
	World: string ;
	PetAwaken: number;
	UseUsers: Array<TotemUseUsers>;
	constructor(data?);
}
declare class TotemUseUsers
{
	UseUserId: number;
	TotemId: number;
	constructor(data?);
}
declare class DBFamilyApply
{
	Id: number;
	Timestamp: number;
	RoleId: number;
	FV: number;
	Nick: string ;
	Head: number;
	HeadFrame: number;
	Sid: number;
	World: string ;
	constructor(data?);
}
declare class FamilyListInfo
{
	Id: string ;
	Name: string ;
	Level: number;
	MemberCount: number;
	LeaderNick: string ;
	LeaderServerId: number;
	FightValue: number;
	IsApply: number;
	Sid: number;
	World: string ;
	constructor(data?);
}
declare class FamilyMember
{
	Id: number;
	Pos: number;
	Exp: number;
	Accuse: number;
	RoleId: number;
	FV: number;
	OfflineTime: number;
	Nick: string ;
	Head: number;
	HeadFrame: number;
	Sid: number;
	VipLevel: number;
	World: string ;
	HideVIP: number;
	constructor(data?);
}
declare class C2SFamilyInfo
{
	FuncType: number;
	constructor(data?);
}
declare class S2CFamilyInfo
{
	Tag: number;
	Id: string ;
	Name: string ;
	Level: number;
	Exp: number;
	Members: Array<FamilyMember>;
	AccuseEndTime: number;
	Apply: Array<DBFamilyApply>;
	Sid: number;
	TotemPets: Array<FamilyTotemPet>;
	FuncType: number;
	SymbolId: number;
	NextChangeNameTime: number;
	AutoAgree: number;
	AutoAgreeFv: number;
	HaloId: number;
	World: string ;
	constructor(data?);
}
declare class C2SFamilyList
{
	Page: number;
	NotFull: number;
	NumPerPage: number;
	constructor(data?);
}
declare class S2CFamilyList
{
	FamilyListInfo: Array<FamilyListInfo>;
	Page: number;
	Total: number;
	NotFull: number;
	NumPerPage: number;
	constructor(data?);
}
declare class C2SFamilyCreate
{
	NewName: string ;
	Sid: number;
	SymbolId: number;
	constructor(data?);
}
declare class S2CFamilyCreate
{
	Tag: number;
	Info: S2CFamilyInfo ;
	constructor(data?);
}
declare class C2SApplyJoin
{
	Id: string ;
	constructor(data?);
}
declare class S2CApplyJoin
{
	Tag: number;
	constructor(data?);
}
declare class C2SAgreeJoin
{
	Id: number;
	State: number;
	constructor(data?);
}
declare class S2CAgreeJoin
{
	Tag: number;
	constructor(data?);
}
declare class C2SFamilyJoin
{
	Id: string ;
	constructor(data?);
}
declare class S2CFamilyJoin
{
	Tag: number;
	Info: S2CFamilyInfo ;
	constructor(data?);
}
declare class C2SFamilyLeave
{
	constructor(data?);
}
declare class S2CFamilyLeave
{
	Tag: number;
	constructor(data?);
}
declare class C2SFamilyDel
{
	constructor(data?);
}
declare class S2CFamilyDel
{
	Tag: number;
	constructor(data?);
}
declare class C2SFamilyChangePos
{
	Id: number;
	Pos: number;
	constructor(data?);
}
declare class S2CFamilyChangePos
{
	Tag: number;
	Id: number;
	Pos: number;
	constructor(data?);
}
declare class S2CFamilyGetOut
{
	constructor(data?);
}
declare class C2SFamilyAccuse
{
	constructor(data?);
}
declare class S2CFamilyAccuse
{
	Tag: number;
	AccuseEndTime: number;
	constructor(data?);
}
declare class C2SFamilyLevelPrizeInfo
{
	constructor(data?);
}
declare class S2CFamilyLevelPrizeInfo
{
	GetLevelPrize: Array<number>;
	constructor(data?);
}
declare class C2SFamilyGetLevelPrize
{
	Level: number;
	constructor(data?);
}
declare class S2CFamilyGetLevelPrize
{
	Tag: number;
	GetLevelPrize: Array<number>;
	constructor(data?);
}
declare class C2SFamilyDonate
{
	ItemId: number;
	constructor(data?);
}
declare class S2CFamilyDonate
{
	Tag: number;
	FamilyExp: number;
	SelfExp: number;
	constructor(data?);
}
declare class C2SFamilyDonateRemainTimes
{
	constructor(data?);
}
declare class S2CFamilyDonateRemainTimes
{
	Tag: number;
	DonateRemainTimes: Array<DonateRemainTimes>;
	constructor(data?);
}
declare class DonateRemainTimes
{
	ItemId: number;
	RemainTimes: number;
	constructor(data?);
}
declare class C2SFamilyChangeName
{
	FamilyName: string ;
	constructor(data?);
}
declare class S2CFamilyChangeName
{
	Tag: number;
	FamilyName: string ;
	NextChangeNameTime: number;
	constructor(data?);
}
declare class C2SFamilyChangeSymbol
{
	SymbolId: number;
	constructor(data?);
}
declare class S2CFamilyChangeSymbol
{
	Tag: number;
	SymbolId: number;
	constructor(data?);
}
declare class C2SFamilyChangeAutoAgree
{
	IsAutoAgree: number;
	AgreeFv: number;
	constructor(data?);
}
declare class S2CFamilyChangeAutoAgree
{
	Tag: number;
	IsAutoAgree: number;
	AgreeFv: number;
	constructor(data?);
}
declare class C2SFamilyChangeHalo
{
	constructor(data?);
}
declare class S2CFamilyChangeHalo
{
	Tag: number;
	SkillId: number;
	SkillLv: number;
	constructor(data?);
}
declare class C2SFamilyConfirmHalo
{
	constructor(data?);
}
declare class S2CFamilyConfirmHalo
{
	Tag: number;
	SkillId: number;
	SkillLv: number;
	constructor(data?);
}
declare class RedState
{
	RedDotId: number;
	State: number;
	constructor(data?);
}
declare class S2CRedState
{
	List: Array<RedState>;
	constructor(data?);
}
declare class C2SRebornUp
{
	constructor(data?);
}
declare class S2CRebornUp
{
	Tag: number;
	constructor(data?);
}
declare class C2SRebornPill
{
	constructor(data?);
}
declare class S2CRebornPill
{
	Tag: number;
	constructor(data?);
}
declare class C2SRebornPillStick
{
	ItemId: number;
	constructor(data?);
}
declare class S2CRebornPillStick
{
	Tag: number;
	constructor(data?);
}
declare class C2SAFKGetBuyInfo
{
	constructor(data?);
}
declare class S2CAFKGetBuyInfo
{
	Times: number;
	LeftTimes: number;
	NoticeTimes: number;
	NoticeVip: number;
	Coin: number;
	constructor(data?);
}
declare class C2SAFKBuyTimes
{
	constructor(data?);
}
declare class S2CAFKBuyTimes
{
	Tag: number;
	constructor(data?);
}
declare class C2SGetAFKPrize
{
	constructor(data?);
}
declare class S2CGetAFKPrize
{
	Tag: number;
	constructor(data?);
}
declare class C2SDrugUse
{
	UType: number;
	constructor(data?);
}
declare class S2CDrugUse
{
	Tag: number;
	constructor(data?);
}
declare class C2SDrugStick
{
	Id: number;
	Times: number;
	constructor(data?);
}
declare class S2CDrugStick
{
	Tag: number;
	Id: number;
	constructor(data?);
}
declare class C2SWeekCardDayPrize
{
	Day: number;
	constructor(data?);
}
declare class S2CWeekCardDayPrize
{
	Tag: number;
	constructor(data?);
}
declare class C2SMonthCardDayPrize
{
	Day: number;
	constructor(data?);
}
declare class S2CMonthCardDayPrize
{
	Tag: number;
	constructor(data?);
}
declare class C2SLifeCardDayPrize
{
	constructor(data?);
}
declare class S2CLifeCardDayPrize
{
	Tag: number;
	constructor(data?);
}
declare class C2SOpenCard
{
	constructor(data?);
}
declare class C2SFairyTreasureEnter
{
	Id: number;
	constructor(data?);
}
declare class S2CFairyTreasureEnter
{
	Tag: number;
	Id: number;
	constructor(data?);
}
declare class C2SFairyTreasureLeave
{
	Id: number;
	constructor(data?);
}
declare class S2CFairyTreasureLeave
{
	Tag: number;
	Id: number;
	constructor(data?);
}
declare class C2SGetDigTreasurePoint
{
	Id: number;
	constructor(data?);
}
declare class S2CGetDigTreasurePoint
{
	Tag: number;
	Id: number;
	X: number;
	Y: number;
	constructor(data?);
}
declare class C2SDigTreasure
{
	Id: number;
	X: number;
	Y: number;
	constructor(data?);
}
declare class S2CDigTreasure
{
	Tag: number;
	Id: number;
	DigType: number;
	Data: Array<ItemData>;
	BossId: number;
	constructor(data?);
}
declare class C2SDigTreasure10Times
{
	Id: number;
	constructor(data?);
}
declare class S2CDigTreasure10Times
{
	Tag: number;
	Id: number;
	List: Array<DigTreasureData>;
	constructor(data?);
}
declare class DigTreasureData
{
	Id: number;
	Data: Array<ItemData>;
	constructor(data?);
}
declare class C2SDigTreasureFight
{
	Id: number;
	BossId: number;
	constructor(data?);
}
declare class S2CDigTreasureFight
{
	Tag: number;
	Id: number;
	BossId: number;
	Win: number;
	Data: Array<ItemData>;
	constructor(data?);
}
declare class C2SGetDigTreasureLog
{
	Type: number;
	constructor(data?);
}
declare class DigTreasureItem
{
	Time: number;
	User: NoticeUser ;
	FairyTreasureId: number;
	Item: Array<ItemData>;
	constructor(data?);
}
declare class S2CGetDigTreasureLog
{
	Type: number;
	Logs: Array<DigTreasureItem>;
	constructor(data?);
}
declare class C2SClimbingTowerEnter
{
	TowerType: number;
	constructor(data?);
}
declare class S2CClimbingTowerEnter
{
	Tag: number;
	TowerType: number;
	constructor(data?);
}
declare class C2SClimbingTowerLeave
{
	TowerType: number;
	constructor(data?);
}
declare class S2CClimbingTowerLeave
{
	Tag: number;
	TowerType: number;
	constructor(data?);
}
declare class C2SClimbingTowerFight
{
	TowerType: number;
	Id: number;
	constructor(data?);
}
declare class S2CClimbingTowerFight
{
	Tag: number;
	TowerType: number;
	Id: number;
	Win: number;
	constructor(data?);
}
declare class C2SClimbingTowerNextLayer
{
	TowerType: number;
	constructor(data?);
}
declare class S2CClimbingTowerNextLayer
{
	Tag: number;
	TowerType: number;
	constructor(data?);
}
declare class C2SClimbingTowerGetSepPrize
{
	TowerType: number;
	constructor(data?);
}
declare class S2CClimbingTowerGetSepPrize
{
	Tag: number;
	TowerType: number;
	constructor(data?);
}
declare class C2SClimbingTowerGetSwordSoulDayPrize
{
	constructor(data?);
}
declare class S2CClimbingTowerGetSwordSoulDayPrize
{
	Tag: number;
	constructor(data?);
}
declare class C2SClimbingTowerGetSwordSoulCircle
{
	constructor(data?);
}
declare class S2CClimbingTowerGetSwordSoulCircle
{
	Tag: number;
	RewardId: Array<number>;
	constructor(data?);
}
declare class C2SClimbingTowerGetSwordSoulCircleEnd
{
	constructor(data?);
}
declare class WeddingTie
{
	UserId: number;
	Nick: string ;
	Vip: number;
	Head: number;
	HeadBox: number;
	Sid: number;
	Aid: number;
	Vows: string ;
	BetrothalAmount: string ;
	Timestamp: number;
	World: string ;
	HideVIP: number;
	constructor(data?);
}
declare class WeddingRoom
{
	Gear: number;
	Level: number;
	Exp: number;
	constructor(data?);
}
declare class WeddingRing
{
	Gear: number;
	GmLevel: number;
	GMExp: number;
	Level: number;
	Exp: number;
	ExclusiveSkills: Array<Skill>;
	CommonSkills: Array<Skill>;
	constructor(data?);
}
declare class WeddingIntimacy
{
	Level: number;
	Exp: number;
	Received: Array<number>;
	constructor(data?);
}
declare class WeddingToken
{
	Id: number;
	Gear: number;
	Level: number;
	Exp: number;
	Skills: Array<Skill>;
	BuffLevel: number;
	constructor(data?);
}
declare class S2CSendMarryInfo
{
	constructor(data?);
}
declare class C2SWeddingSeeking
{
	Nick: string ;
	Page: number;
	Size: number;
	constructor(data?);
}
declare class S2CWeddingSeeking
{
	Tag: number;
	WeddingSeekers: Array<WeddingTie>;
	Total: number;
	TagP: string ;
	constructor(data?);
}
declare class C2SPostWeddingTie
{
	VowsId: number;
	Vows: string ;
	Item: string ;
	constructor(data?);
}
declare class S2CPostWeddingTie
{
	Tag: number;
	constructor(data?);
}
declare class C2SPropose
{
	ItemId: string ;
	ItemBoxId: string ;
	TargetId: number;
	constructor(data?);
}
declare class S2CPropose
{
	Tag: number;
	constructor(data?);
}
declare class S2CProposeNotify
{
	Ring: ItemData ;
	BetrothalGift: Array<ItemData>;
	Item1: ItemData ;
	Item2: ItemData ;
	UserId: number;
	Nick: string ;
	Vip: number;
	Head: number;
	HeadBox: number;
	Sid: number;
	World: string ;
	HideVIP: number;
	constructor(data?);
}
declare class S2CProposeGift
{
	UserId1: number;
	Name1: string ;
	Head1: number;
	HeadBox1: number;
	Sid1: number;
	UserId2: number;
	Name2: string ;
	Head2: number;
	HeadBox2: number;
	Sid2: number;
	RedBag: Array<ItemData>;
	World1: string ;
	World2: string ;
	constructor(data?);
}
declare class C2SDivorce
{
	constructor(data?);
}
declare class S2CDivorce
{
	Tag: number;
	constructor(data?);
}
declare class C2SWeddingRoomData
{
	constructor(data?);
}
declare class C2SWeddingRoomGearUp
{
	Gear: number;
	constructor(data?);
}
declare class C2SWeddingRoomLevelUp
{
	ItemId: number;
	ItemNum: number;
	Auto: number;
	constructor(data?);
}
declare class S2CWeddingRoom
{
	Tag: number;
	WeddingRoom: WeddingRoom ;
	constructor(data?);
}
declare class C2SWeddingRingData
{
	constructor(data?);
}
declare class C2SWeddingRingGearUp
{
	ItemId: string ;
	constructor(data?);
}
declare class C2SWeddingRingGMLevelUp
{
	ItemId: number;
	ItemNum: number;
	Rings: string ;
	Auto: number;
	constructor(data?);
}
declare class C2SWeddingRingLevelUp
{
	ItemId: number;
	ItemNum: number;
	Auto: number;
	constructor(data?);
}
declare class C2SWeddingRingSkillLevelUp
{
	SkillId: number;
	SkillType: number;
	Auto: number;
	constructor(data?);
}
declare class S2CWeddingRing
{
	Tag: number;
	WeddingRing: WeddingRing ;
	constructor(data?);
}
declare class C2SWeddingIntimacy
{
	constructor(data?);
}
declare class C2SWeddingIntimacyLevelUp
{
	ItemNum: number;
	Auto: number;
	constructor(data?);
}
declare class C2SWeddingIntimacyReward
{
	Level: number;
	constructor(data?);
}
declare class S2CWeddingIntimacy
{
	Tag: number;
	Intimacy: WeddingIntimacy ;
	constructor(data?);
}
declare class C2SAllWeddingToken
{
	constructor(data?);
}
declare class S2CAllWeddingToken
{
	Tag: number;
	WeddingToken: Array<WeddingToken>;
	constructor(data?);
}
declare class C2SWeddingTokenGearUp
{
	TokenId: number;
	Auto: number;
	constructor(data?);
}
declare class C2SWeddingTokenBuffUp
{
	TokenId: number;
	constructor(data?);
}
declare class C2SWeddingTokenLevelUp
{
	TokenId: number;
	Auto: number;
	constructor(data?);
}
declare class C2SWeddingTokenSkillLevelUp
{
	TokenId: number;
	SkillId: number;
	Auto: number;
	constructor(data?);
}
declare class S2CWeddingToken
{
	Tag: number;
	WeddingToken: WeddingToken ;
	constructor(data?);
}
declare class C2STargetWeddingRingData
{
	UserId: number;
	constructor(data?);
}
declare class S2CTargetWeddingRing
{
	Tag: number;
	WeddingRing: WeddingRing ;
	Vows: string ;
	TargetId: number;
	constructor(data?);
}
declare class WeddingTask
{
	Type: number;
	Id: number;
	My: number;
	Partner: number;
	constructor(data?);
}
declare class C2SGetWeddingTask
{
	constructor(data?);
}
declare class S2CGetWeddingTask
{
	Tag: number;
	DayTask: Array<WeddingTask>;
	OneTask: Array<WeddingTask>;
	constructor(data?);
}
declare class C2SWeddingInsInvite
{
	constructor(data?);
}
declare class S2CWeddingInsInvite
{
	Tag: number;
	P: number;
	Timestamp: number;
	constructor(data?);
}
declare class C2SWeddingInsInviteAck
{
	Ack: number;
	constructor(data?);
}
declare class S2CWeddingInsInviteAck
{
	Tag: number;
	Ack: number;
	constructor(data?);
}
declare class C2SWeddingInsFight
{
	constructor(data?);
}
declare class C2SWeddingInsReport
{
	Index: number;
	constructor(data?);
}
declare class S2CWeddingInsReport
{
	Tag: number;
	Index: number;
	Report: S2CBattlefieldReport ;
	Total: number;
	constructor(data?);
}
declare class C2SOneKeyWeddingIns
{
	constructor(data?);
}
declare class S2COneKeyWeddingIns
{
	Tag: number;
	constructor(data?);
}
declare class C2SWeddingMsg
{
	Msg: string ;
	constructor(data?);
}
declare class S2CWeddingMsg
{
	Tag: number;
	M: WhisperMsg ;
	constructor(data?);
}
declare class S2CPartnerOnline
{
	UserId: number;
	Nick: string ;
	Head: number;
	HeadFrame: number;
	Vip: number;
	AreaId: number;
	State: number;
	Type: number;
	World: string ;
	HideVIP: number;
	constructor(data?);
}
declare class C2SRoleTalentUp
{
	Id: number;
	constructor(data?);
}
declare class S2CRoleTalentUp
{
	Tag: number;
	Id: number;
	constructor(data?);
}
declare class C2SRoleBodyUp
{
	Id: number;
	Type: number;
	constructor(data?);
}
declare class S2CRoleBodyUp
{
	Tag: number;
	Id: number;
	Type: number;
	constructor(data?);
}
declare class C2SGetDrugBase
{
	constructor(data?);
}
declare class S2CGetDrugBase
{
	DrugBase: Array<DrugBase>;
	constructor(data?);
}
declare class C2SDrugBaseEat
{
	Class: number;
	Type: number;
	constructor(data?);
}
declare class S2CDrugBaseEat
{
	Tag: number;
	Class: number;
	Type: number;
	Count: number;
	constructor(data?);
}
declare class LampStone
{
	Pos: number;
	Level: number;
	constructor(data?);
}
declare class C2SAladdinLampInfo
{
	UserId: number;
	constructor(data?);
}
declare class S2CAladdinLampInfo
{
	LampStone: Array<LampStone>;
	LampWishId: number;
	constructor(data?);
}
declare class C2SAladdinLampUnlock
{
	constructor(data?);
}
declare class S2CAladdinLampUnlock
{
	Tag: number;
	constructor(data?);
}
declare class C2SAladdinLampStoneUse
{
	Pos: number;
	constructor(data?);
}
declare class S2CAladdinLampStoneUse
{
	Tag: number;
	Stone: LampStone ;
	constructor(data?);
}
declare class C2SAladdinLampStoneUpLevel
{
	Pos: number;
	constructor(data?);
}
declare class S2CAladdinLampStoneUpLevel
{
	Tag: number;
	Stone: LampStone ;
	constructor(data?);
}
declare class C2SAladdinLampWish
{
	constructor(data?);
}
declare class S2CAladdinLampWish
{
	Tag: number;
	Id: number;
	constructor(data?);
}
declare class BaoWuTask
{
	Id: number;
	Type: number;
	State: number;
	constructor(data?);
}
declare class S2CChangeBaoWuTask
{
	Taskzcpx: Array<BaoWuTask>;
	Taskzlhu: Array<BaoWuTask>;
	constructor(data?);
}
declare class C2SOtherBaoWuTask
{
	OtherId: number;
	constructor(data?);
}
declare class S2COtherBaoWuTask
{
	OtherId: number;
	Taskzcpx: Array<BaoWuTask>;
	Taskzlhu: Array<BaoWuTask>;
	constructor(data?);
}
declare class C2SReceiveBaoWuPrize
{
	Id: number;
	Type: number;
	constructor(data?);
}
declare class C2SOneKeyReceiveBaoWuPrize
{
	Type: number;
	constructor(data?);
}
declare class S2COneKeyReceiveBaoWuPrize
{
	Tag: number;
	Type: number;
	constructor(data?);
}
declare class PlayerPractice
{
	CurExp: number;
	Level: number;
	constructor(data?);
}
declare class C2SPlayerPractice
{
	constructor(data?);
}
declare class S2CPlayerPractice
{
	Data: PlayerPractice ;
	constructor(data?);
}
declare class C2SPracticeLevelUp
{
	constructor(data?);
}
declare class S2CPracticeLevelUp
{
	Tag: number;
	Exp: number;
	Level: number;
	constructor(data?);
}
declare class DayPracticeRemain
{
	TaskId: number;
	FindType: number;
	Times: number;
	constructor(data?);
}
declare class C2SLastDayPracticeRemain
{
	constructor(data?);
}
declare class S2CLastDayPracticeRemain
{
	List: Array<DayPracticeRemain>;
	constructor(data?);
}
declare class C2SDayPracticeFind
{
	TaskId: number;
	Type: number;
	Times: number;
	constructor(data?);
}
declare class S2CDayPracticeFind
{
	Tag: number;
	Remain: DayPracticeRemain ;
	constructor(data?);
}
declare class C2SDayPracticeFastFind
{
	constructor(data?);
}
declare class S2CDayPracticeFastFind
{
	Tag: number;
	constructor(data?);
}
declare class ResourceRemain
{
	Id: number;
	ItemData: Array<ItemData>;
	Times: number;
	constructor(data?);
}
declare class C2SLastDayResourceRemain
{
	constructor(data?);
}
declare class S2CLastDayResourceRemain
{
	List: Array<ResourceRemain>;
	constructor(data?);
}
declare class C2SResourceFind
{
	Id: number;
	Times: number;
	constructor(data?);
}
declare class S2CResourceFind
{
	Tag: number;
	Remain: ResourceRemain ;
	constructor(data?);
}
declare class C2SResourceFastFind
{
	constructor(data?);
}
declare class S2CResourceFastFind
{
	Tag: number;
	constructor(data?);
}
declare class S2CJXSCStageChange
{
	Stage: number;
	EndTimestamp: number;
	constructor(data?);
}
declare class C2SJXSCSignUp
{
	constructor(data?);
}
declare class S2CJXSCSignUp
{
	Tag: number;
	constructor(data?);
}
declare class C2SJXSCSkinChange
{
	constructor(data?);
}
declare class S2CJXSCSkinChange
{
	Tag: number;
	Id: number;
	constructor(data?);
}
declare class C2SJXSCJoinNextLayer
{
	constructor(data?);
}
declare class S2CJXSCJoinNextLayer
{
	Tag: number;
	constructor(data?);
}
declare class C2SJXSCLeaveScene
{
	constructor(data?);
}
declare class S2CJXSCLeaveScene
{
	Tag: number;
	constructor(data?);
}
declare class C2SJXSCKeyNum
{
	constructor(data?);
}
declare class S2CJXSCKeyNum
{
	KeyNum: number;
	constructor(data?);
}
declare class C2SJXSCMyScore
{
	constructor(data?);
}
declare class S2CJXSCMyScore
{
	MyRank: number;
	MyScore: number;
	constructor(data?);
}
declare class C2SJXSCOpenBox
{
	Id: number;
	constructor(data?);
}
declare class S2CJXSCOpenBox
{
	Tag: number;
	Id: number;
	ItemData: Array<ItemData>;
	constructor(data?);
}
declare class NearbyTarget
{
	Id: number;
	Type: number;
	ChangeSkinId: number;
	HaveKey: number;
	Head: number;
	HeadFrame: number;
	Nick: string ;
	Area: number;
	IsLeader: number;
	World: string ;
	constructor(data?);
}
declare class S2CNearbyTarget
{
	State: number;
	Items: Array<NearbyTarget>;
	constructor(data?);
}
declare class C2SJXSCSignUpInterval
{
	constructor(data?);
}
declare class S2CJXSCSignUpInterval
{
	StartTime: number;
	SignUpEndTime: number;
	constructor(data?);
}
declare class C2SJXSCReentry
{
	constructor(data?);
}
declare class BusinessData
{
	State: number;
	LastPos: number;
	NextPos: number;
	ThisStartPos: number;
	ThisEndPos: number;
	ThisStartTime: number;
	LastPosStartTime: number;
	ThisWay: Array<BusinessWay>;
	Ticket: number;
	Goods: Array<ItemInfo>;
	Gold: number;
	TodayTimes: number;
	TradeResult: number;
	TradeGold: number;
	GoodResultTime: number;
	OldState: number;
	SurpriseItem: Array<ItemInfo>;
	constructor(data?);
}
declare class BusinessWay
{
	Id: number;
	ArriveTime: number;
	constructor(data?);
}
declare class S2CBusinessData
{
	Data: BusinessData ;
	constructor(data?);
}
declare class C2SGetBusinessData
{
	constructor(data?);
}
declare class C2SContinueBusiness
{
	constructor(data?);
}
declare class S2CContinueBusiness
{
	Tag: number;
	constructor(data?);
}
declare class C2SStartBusiness
{
	Id: number;
	constructor(data?);
}
declare class S2CStartBusiness
{
	Tag: number;
	TagP: string ;
	constructor(data?);
}
declare class C2SFastBusiness
{
	constructor(data?);
}
declare class S2CFastBusiness
{
	Tag: number;
	TagP: string ;
	constructor(data?);
}
declare class S2CBusinessSurprise
{
	Data: ItemInfo ;
	constructor(data?);
}
declare class S2CBusinessEnd
{
	Data: Array<ItemInfo>;
	Suprise: Array<ItemInfo>;
	constructor(data?);
}
declare class C2SGetBusinessPrize
{
	constructor(data?);
}
declare class S2CGetBusinessPrize
{
	Tag: number;
	TagP: string ;
	Ticket: number;
	constructor(data?);
}
declare class C2SMedalUp
{
	Id: number;
	constructor(data?);
}
declare class S2CMedalUp
{
	Tag: number;
	constructor(data?);
}
declare class C2SMedalGetPrize
{
	Id: number;
	constructor(data?);
}
declare class S2CMedalGetPrize
{
	Tag: number;
	constructor(data?);
}
declare class C2SGuardBuy
{
	constructor(data?);
}
declare class S2CGuardBuy
{
	Tag: number;
	constructor(data?);
}
declare class S2CGuardOverTime
{
	constructor(data?);
}
declare class TitleGift
{
	GoodId: number;
	State: number;
	EndTimestamp: number;
	constructor(data?);
}
declare class C2SGetTitleGiftList
{
	constructor(data?);
}
declare class S2CGetTitleGiftList
{
	TitleGift: Array<TitleGift>;
	constructor(data?);
}
declare class C2SReceiveTitleGift
{
	GoodId: number;
	constructor(data?);
}
declare class S2CReceiveTitleGift
{
	Tag: number;
	constructor(data?);
}
declare class C2SReceiveFirstRechargeGift
{
	constructor(data?);
}
declare class S2CReceiveFirstRechargeGift
{
	Tag: number;
	constructor(data?);
}
declare class C2SReceiveFirstRechargeInvestGift
{
	constructor(data?);
}
declare class S2CReceiveFirstRechargeInvestGift
{
	Tag: number;
	constructor(data?);
}
declare class C2SReceiveTotalRechargeGift
{
	Stage: number;
	Day: number;
	constructor(data?);
}
declare class S2CReceiveTotalRechargeGift
{
	Tag: number;
	Stage: number;
	Day: number;
	constructor(data?);
}
declare class C2SXuanShangBossInfo
{
	constructor(data?);
}
declare class S2CXuanShangBossInfo
{
	XuanShangID: number;
	LeftFreeRefreshTimes: number;
	NextFreeRefreshTimesTimeStamp: number;
	Status: number;
	BossID: number;
	XuanShangLimitTimeStamp: number;
	LeftKillTimes: number;
	LeftBuyKillTimes: number;
	BuyKillTimesItemID: number;
	BuyKillTimesItemNum: number;
	CurScore: number;
	ScoreRewardGet: Array<number>;
	constructor(data?);
}
declare class C2SXuanShangBossBuyTimes
{
	BuyType: number;
	constructor(data?);
}
declare class S2CXuanShangBossBuyTimes
{
	Tag: number;
	constructor(data?);
}
declare class C2SXuanShangBossRefresh
{
	RefreshType: number;
	constructor(data?);
}
declare class S2CXuanShangBossRefresh
{
	Tag: number;
	RefreshType: number;
	LeftFreeRefreshTimes: number;
	NextFreeRefreshTimesTimeStamp: number;
	XuanShangID: number;
	constructor(data?);
}
declare class C2SXuanShangBossAccept
{
	constructor(data?);
}
declare class S2CXuanShangBossAccept
{
	Tag: number;
	BossID: number;
	XuanShangLimitTimeStamp: number;
	constructor(data?);
}
declare class C2SXuanShangBossJoinScene
{
	BossID: number;
	constructor(data?);
}
declare class S2CXuanShangBossJoinScene
{
	Tag: number;
	BossID: number;
	constructor(data?);
}
declare class C2SXuanShangBossCallHelp
{
	OnlyFamily: number;
	constructor(data?);
}
declare class S2CXuanShangBossCallHelp
{
	Tag: number;
	constructor(data?);
}
declare class C2SXuanShangBossGiveUp
{
	constructor(data?);
}
declare class S2CXuanShangBossGiveUp
{
	Tag: number;
	constructor(data?);
}
declare class S2CXuanShangResult
{
	Tag: number;
	Reward: Array<CommonItemType>;
	constructor(data?);
}
declare class C2SXuanShangBossScoreReward
{
	constructor(data?);
}
declare class S2CXuanShangBossScoreReward
{
	Tag: number;
	ScoreRewardGet: Array<number>;
	constructor(data?);
}
declare class CommonItemType
{
	ItemID: number;
	ItemNum: number;
	constructor(data?);
}
declare class S2CXuanShangMonsterData
{
	MonsterID: number;
	CurHp: number;
	MaxHP: number;
	MonsterLevel: number;
	LeaderUserID: number;
	limitTimeStamp: number;
	constructor(data?);
}
declare class C2SAnyRedPoint
{
	RedId: number;
	State: number;
	constructor(data?);
}
declare class S2CTeamFightStateChange
{
	LeaderUid: number;
	FightState: number;
	constructor(data?);
}
declare class EquipDuJin
{
	EquipPart: number;
	DuJinLevel: number;
	constructor(data?);
}
declare class C2SEquipDuJin
{
	EquipPart: number;
	constructor(data?);
}
declare class S2CEquipDuJin
{
	Tag: number;
	EquipPart: number;
	NewLevel: number;
	constructor(data?);
}
declare class EquipJingLian
{
	CurLevel: number;
	CurExp: number;
	EquipSuitInfos: Array<EquipSuitInfo>;
	constructor(data?);
}
declare class EquipSuitInfo
{
	SuitNum: number;
	SuitId: number;
	constructor(data?);
}
declare class C2SEquipJingLian
{
	constructor(data?);
}
declare class S2CEquipJingLian
{
	Tag: number;
	constructor(data?);
}
declare class EquipZhuHun
{
	EquipZhuHunLevelInfos: Array<EquipZhuHunLevelInfo>;
	EquipZhuHunSuitInfos: Array<EquipZhuHunSuitInfo>;
	constructor(data?);
}
declare class EquipZhuHunLevelInfo
{
	EquipPart: number;
	MingHunID: number;
	Level: number;
	constructor(data?);
}
declare class EquipZhuHunSuitInfo
{
	SuitID: number;
	Level: number;
	constructor(data?);
}
declare class C2SEquipZhuHun
{
	EquipPart: number;
	MingHunID: number;
	constructor(data?);
}
declare class S2CEquipZhuHun
{
	Tag: number;
	EquipPart: number;
	MingHunID: number;
	NewLevel: number;
	constructor(data?);
}
declare class C2SEquipZhuHunCancel
{
	EquipPart: number;
	constructor(data?);
}
declare class S2CEquipZhuHunCancel
{
	Tag: number;
	EquipPart: number;
	MingHunID: number;
	NewLevel: number;
	constructor(data?);
}
declare class TotemInfo
{
	TotemId: number;
	TotemPets: Array<TotemPet>;
	TotemPowers: Array<TotemPower>;
	Gear: number;
	AttrId: number;
	AttrMul: number;
	constructor(data?);
}
declare class TotemPet
{
	Pos: number;
	PetId: string ;
	OwnerUserId: number;
	constructor(data?);
}
declare class TotemPower
{
	PowerId: number;
	PetNum: number;
	IsActive: number;
	constructor(data?);
}
declare class C2STotemUnlock
{
	TotemId: number;
	constructor(data?);
}
declare class S2CTotemUnlock
{
	Tag: number;
	TotemId: number;
	constructor(data?);
}
declare class C2STotemGearUp
{
	TotemId: number;
	constructor(data?);
}
declare class S2CTotemGearUp
{
	Tag: number;
	TotemId: number;
	Gear: number;
	constructor(data?);
}
declare class C2STotemPetChange
{
	TotemId: number;
	ChangeType: number;
	Pos: number;
	OwnerUserId: number;
	PetId: string ;
	constructor(data?);
}
declare class S2CTotemPetChange
{
	Tag: number;
	TotemId: number;
	ChangeType: number;
	Pos: number;
	OwnerUserId: number;
	PetId: string ;
	constructor(data?);
}
declare class C2STotemHelpPetChange
{
	UpPetId: string ;
	DownPetId: string ;
	constructor(data?);
}
declare class S2CTotemHelpPetChange
{
	Tag: number;
	UpPetId: string ;
	DownPetId: string ;
	constructor(data?);
}
declare class S2CFamilyTotemPetsUpd
{
	PoolPets: Array<FamilyTotemPet>;
	constructor(data?);
}
declare class C2STotemPetAutoChange
{
	OpType: number;
	TotemId: number;
	constructor(data?);
}
declare class S2CTotemPetAutoChange
{
	Tag: number;
	OpType: number;
	TotemId: number;
	constructor(data?);
}
declare class TotemPetPassiveNotice
{
	OpType: number;
	TotemId: number;
	DownPetName: string ;
	TimeStamp: number;
	DownPetPlayerName: string ;
	DownPetPlayerSect: number;
	DownPetQuality: number;
	World: string ;
	constructor(data?);
}
declare class S2CTotemPetPassiveNotice
{
	data: Array<TotemPetPassiveNotice>;
	constructor(data?);
}
declare class C2STotemPetPassiveNotice
{
	constructor(data?);
}
declare class S2CTotemPetPassiveNoticeStatus
{
	constructor(data?);
}
declare class C2SSetAttrInt
{
	AttrId: number;
	AttrVal: number;
	constructor(data?);
}
declare class SeekingDragonInfo
{
	Floor: number;
	Pos: number;
	Type: number;
	Prize: Array<ItemInfo>;
	Hight: number;
	EventId: number;
	constructor(data?);
}
declare class S2CSeekingDragonInfo
{
	Items: Array<SeekingDragonInfo>;
	MaxFloor: number;
	constructor(data?);
}
declare class C2SSeekingDragonCheckRed
{
	constructor(data?);
}
declare class C2SSeekingDragonRoll
{
	Point: number;
	constructor(data?);
}
declare class S2CSeekingDragonRoll
{
	Tag: number;
	Point: number;
	constructor(data?);
}
declare class C2SSeekingDragonTemBagList
{
	constructor(data?);
}
declare class S2CSeekingDragonTemBagList
{
	Items: Array<ItemInfo>;
	constructor(data?);
}
declare class C2SSeekingDragonTemBag
{
	constructor(data?);
}
declare class S2CSeekingDragonTemBag
{
	Tag: number;
	constructor(data?);
}
declare class C2SSeekingDragonPrize
{
	Id: number;
	constructor(data?);
}
declare class S2CSeekingDragonPrize
{
	Tag: number;
	Id: number;
	constructor(data?);
}
declare class S2CSeekingDragonEventOpen
{
	EventUid: string ;
	EventId: number;
	OpenTime: number;
	Pos: number;
	constructor(data?);
}
declare class C2SSeekingDragonGetAllTimeEvent
{
	constructor(data?);
}
declare class S2CSeekingDragonGetAllTimeEvent
{
	Tag: number;
	SDEventInfo: Array<SDEventInfo>;
	constructor(data?);
}
declare class C2SSeekingDragonEventAction
{
	EventUid: string ;
	EventId: number;
	Val1: number;
	Val2: number;
	Val3: number;
	constructor(data?);
}
declare class S2CSeekingDragonEventAction
{
	Tag: number;
	EventUid: string ;
	EventId: number;
	Val1: number;
	Val2: number;
	Val3: number;
	constructor(data?);
}
declare class C2SSeekingDragonRecEventReward
{
	Id: number;
	constructor(data?);
}
declare class S2CSeekingDragonRecEventReward
{
	Tag: number;
	Id: number;
	constructor(data?);
}
declare class C2SSeekingDragonGetEventLog
{
	constructor(data?);
}
declare class S2CSeekingDragonGetEventLog
{
	Log: Array<string>;
	constructor(data?);
}
declare class TeamInstanceData
{
	InstanceType: number;
	Times: number;
	BuyTimes: number;
	MaxStage: number;
	MinRound: number;
	constructor(data?);
}
declare class TeamPlayer
{
	UserId: number;
	Nick: string ;
	AreaId: number;
	ShowHead: number;
	ShowHeadFrame: number;
	FightValue: number;
	VipLevel: number;
	ShowHeroId: number;
	ShowHeroLevel: number;
	ShowHeroQuality: number;
	ShowHeroGrade: number;
	ShowHeroStar: number;
	World: string ;
	HideVIP: number;
	LogoutTime: number;
	constructor(data?);
}
declare class S2CTeamInstanceData
{
	Items: Array<TeamInstanceData>;
	constructor(data?);
}
declare class C2STeamInstanceMatching
{
	InstanceType: number;
	constructor(data?);
}
declare class S2CTeamInstanceMatching
{
	Tag: number;
	InstanceType: number;
	Players: Array<TeamPlayer>;
	constructor(data?);
}
declare class C2STeamInstanceStartFight
{
	InstanceType: number;
	UserIds: Array<number>;
	constructor(data?);
}
declare class C2STeamInstanceGetReport
{
	InstanceType: number;
	Index: number;
	constructor(data?);
}
declare class S2CTeamInstanceGetReport
{
	Tag: number;
	InstanceType: number;
	Index: number;
	Total: number;
	Report: S2CBattlefieldReport ;
	constructor(data?);
}
declare class C2STeamInstanceBuyTimes
{
	InstanceType: number;
	constructor(data?);
}
declare class S2CTeamInstanceBuyTimes
{
	Tag: number;
	InstanceType: number;
	constructor(data?);
}
declare class C2STeamInstanceSweep
{
	InstanceType: number;
	constructor(data?);
}
declare class S2CTeamInstanceSweep
{
	Tag: number;
	InstanceType: number;
	constructor(data?);
}
declare class C2STurnTabGearPrize
{
	ActId: number;
	PrizeId: number;
	constructor(data?);
}
declare class S2CTurnTabGearPrize
{
	Tag: number;
	constructor(data?);
}
declare class C2STurnTabGearPrizeState
{
	ActId: number;
	constructor(data?);
}
declare class S2CTurnTabGearPrizeState
{
	Tag: number;
	TurnTabGearPrizeState: Array<TurnTabGearPrizeState>;
	constructor(data?);
}
declare class TurnTabGearPrizeState
{
	PrizeId: number;
	State: number;
	constructor(data?);
}
declare class DirectGift
{
	GoodID: number;
	GoodName: string ;
	EndTime: number;
	CostNum: number;
	OpenWin: number;
	BgImg: string ;
	AdvImg: string ;
	IconImg: number;
	GroupOrder: number;
	State: number;
	Pre: number;
	ItemStr: string ;
	PrizeShow: string ;
	IconShowAnim: number;
	BuyTimes: number;
	TotalTimes: number;
	AnimationShow: string ;
	OpenTime: number;
	constructor(data?);
}
declare class S2CDirectGift
{
	List: Array<DirectGift>;
	constructor(data?);
}
declare class C2SGetDirectGiftPrize
{
	GoodID: number;
	constructor(data?);
}
declare class S2CGetDirectGiftPrize
{
	Tag: number;
	GoodID: number;
	constructor(data?);
}
declare class C2SRefreshTimeShop
{
	constructor(data?);
}
declare class S2CRefreshTimeShop
{
	Tag: number;
	constructor(data?);
}
declare class C2STimeShopGift
{
	constructor(data?);
}
declare class S2CTimeShopGift
{
	List: Array<DirectGift>;
	constructor(data?);
}
declare class C2SGetTimeShopGiftPrize
{
	GiftId: number;
	constructor(data?);
}
declare class S2CGetTimeShopGiftPrize
{
	Tag: number;
	constructor(data?);
}
declare class C2SRefreshMoonlightBox
{
	constructor(data?);
}
declare class S2CRefreshMoonlightBox
{
	Tag: number;
	constructor(data?);
}
declare class C2SMoonlightBoxGift
{
	constructor(data?);
}
declare class S2CMoonlightBoxGift
{
	List: Array<DirectGift>;
	constructor(data?);
}
declare class C2SGetMoonlightBoxGiftPrize
{
	GiftId: number;
	constructor(data?);
}
declare class S2CGetMoonlightBoxGiftPrize
{
	Tag: number;
	constructor(data?);
}
declare class SecretMall
{
	Id: number;
	State: number;
	constructor(data?);
}
declare class S2CSecretMallList
{
	List: Array<SecretMall>;
	NextTime: number;
	constructor(data?);
}
declare class C2SSecretMallBuy
{
	GoodID: number;
	constructor(data?);
}
declare class S2CSecretMallBuy
{
	Tag: number;
	GoodID: number;
	TagP: string ;
	constructor(data?);
}
declare class C2SSecretMallRefresh
{
	constructor(data?);
}
declare class S2CSecretMallRefresh
{
	Tag: number;
	TagP: string ;
	constructor(data?);
}
declare class C2SSecretMallOpen
{
	constructor(data?);
}
declare class S2CActScore
{
	ActId: number;
	ActScore: number;
	constructor(data?);
}
declare class S2CSpecialLoginTips
{
	TipsId: number;
	Priority: number;
	TipsArr: Array<number>;
	Head: number;
	HeadFrame: number;
	Nick: string ;
	FamilySid: number;
	FamilyName: string ;
	FightValue: number;
	Vip: number;
	AreaId: number;
	UserId: number;
	World: string ;
	HideVIP: number;
	constructor(data?);
}
declare class S2CActLuckOpen
{
	ActId: Array<number>;
	constructor(data?);
}
declare class C2SActLuckEnter
{
	ActId: number;
	constructor(data?);
}
declare class S2CActLuckEnter
{
	Tag: number;
	ActId: number;
	constructor(data?);
}
declare class C2SActLuckFight
{
	ActId: number;
	constructor(data?);
}
declare class S2CActLuckFight
{
	Tag: number;
	ActId: number;
	Win: number;
	constructor(data?);
}
declare class C2SActLuckLeave
{
	ActId: number;
	constructor(data?);
}
declare class S2CActLuckLeave
{
	Tag: number;
	ActId: number;
	constructor(data?);
}
declare class C2SGetNBAFightReport
{
	UserId1: number;
	UserId2: number;
	constructor(data?);
}
declare class S2CGetNBAFightReport
{
	Tag: number;
	user1: ShowUserInfo ;
	user2: ShowUserInfo ;
	Report: S2CBattlefieldReport ;
	constructor(data?);
}
declare class C2SNBAState
{
	constructor(data?);
}
declare class S2CNBAState
{
	State: number;
	Auto: number;
	constructor(data?);
}
declare class C2SNBASign
{
	constructor(data?);
}
declare class S2CNBASign
{
	Tag: number;
	constructor(data?);
}
declare class C2SNBASignCount
{
	constructor(data?);
}
declare class S2CNBASignCount
{
	Count: number;
	Self: number;
	constructor(data?);
}
declare class C2SNBALastWin
{
	constructor(data?);
}
declare class S2CNBALastWin
{
	Tag: number;
	UserId: number;
	A: Array<IntAttr>;
	B: Array<StrAttr>;
	constructor(data?);
}
declare class NBAFrame
{
	UserId: number;
	Rank: number;
	Head: number;
	HeadFrame: number;
	Area: number;
	Nick: string ;
	FV: number;
	Times: number;
	World: string ;
	constructor(data?);
}
declare class C2SNBAFrame
{
	constructor(data?);
}
declare class S2CNBAFrame
{
	Tag: number;
	List: Array<NBAFrame>;
	MyRank: number;
	MyTimes: number;
	constructor(data?);
}
declare class NBAFinalData
{
	Pos: number;
	UserId: number;
	Head: number;
	HeadFrame: number;
	Area: number;
	Nick: string ;
	FV: number;
	Times: number;
	Level: number;
	Realm: number;
	VIP: number;
	Guess: Array<number>;
	State: number;
	Win: number;
	FightEnd: number;
	World: string ;
	HideVIP: number;
	HaveSaveReport: number;
	constructor(data?);
}
declare class C2SNBAFinalFightEnd
{
	constructor(data?);
}
declare class C2SNBAFinalData
{
	constructor(data?);
}
declare class S2CNBAFinalData
{
	List: Array<NBAFinalData>;
	constructor(data?);
}
declare class S2CNBAFinalDataOnPreEnd
{
	Result: number;
	List: Array<NBAFinalData>;
	constructor(data?);
}
declare class C2SNBAGuess
{
	UserId: number;
	Rank: number;
	constructor(data?);
}
declare class S2CNBAGuess
{
	Tag: number;
	TagP: string ;
	UserId: number;
	Rank: number;
	constructor(data?);
}
declare class C2SNBAMatch
{
	constructor(data?);
}
declare class S2CNBAMatch
{
	SelfReady: number;
	TargetReady: number;
	EndTime: number;
	Target: NBAFinalData ;
	State: number;
	constructor(data?);
}
declare class S2CNBAMatchResult
{
	Type: number;
	Data: number;
	constructor(data?);
}
declare class S2CNBAPreScore
{
	Score: number;
	Rank: number;
	constructor(data?);
}
declare class S2CNBAPreStart
{
	constructor(data?);
}
declare class S2CNBAFinalEnd
{
	constructor(data?);
}
declare class C2SNBABuyAuto
{
	constructor(data?);
}
declare class S2CNBABuyAuto
{
	Tag: number;
	TagP: string ;
	constructor(data?);
}
declare class YiJiInfo
{
	Id: number;
	OccupiedAreaId: number;
	OccupiedSectName: string ;
	BossState: number;
	ReliveTimestamp: number;
	SceneCloseTime: number;
	bossLockBloodTime: number;
	isOpen: number;
	World: string ;
	constructor(data?);
}
declare class C2SYiJiInfo
{
	constructor(data?);
}
declare class S2CYiJiInfo
{
	Items: Array<YiJiInfo>;
	constructor(data?);
}
declare class YiJiPlayerData
{
	UserId: number;
	Nick: string ;
	AreaId: number;
	FamilyId: string ;
	Head: number;
	HeadFrame: number;
	FightValue: number;
	ShowAreaId: number;
	LoginAreaId: number;
	World: string ;
	constructor(data?);
}
declare class YiJiAreaScoreData
{
	AreaId: number;
	SectName: string ;
	Score: number;
	LoginAreaId: number;
	World: string ;
	constructor(data?);
}
declare class C2SYiJiScoreRank
{
	Id: number;
	constructor(data?);
}
declare class S2CYiJiScoreRank
{
	Id: number;
	Items: Array<YiJiAreaScoreData>;
	constructor(data?);
}
declare class C2SYiJiJoinScene
{
	Id: number;
	constructor(data?);
}
declare class S2CYiJiJoinScene
{
	Id: number;
	Tag: number;
	constructor(data?);
}
declare class C2SYiJiLeaveScene
{
	Id: number;
	constructor(data?);
}
declare class S2CYiJiLeaveScene
{
	Id: number;
	Tag: number;
	constructor(data?);
}
declare class C2SYiJiNearbyEnemyPlayer
{
	Id: number;
	constructor(data?);
}
declare class S2CYiJiNearbyEnemyPlayer
{
	Id: number;
	Players: Array<YiJiPlayerData>;
	constructor(data?);
}
declare class YiJiDamageData
{
	Player: YiJiPlayerData ;
	Order: number;
	Damage: number;
	constructor(data?);
}
declare class C2SYiJiDamageRank
{
	Id: number;
	constructor(data?);
}
declare class S2CYiJiDamageRank
{
	Id: number;
	Items: Array<YiJiDamageData>;
	constructor(data?);
}
declare class S2CYiJiOwnerPlayer
{
	Player: YiJiPlayerData ;
	HpPercent: number;
	constructor(data?);
}
declare class C2SYiJiGiveUpOwner
{
	Id: number;
	constructor(data?);
}
declare class S2CYiJiGiveUpOwner
{
	Tag: number;
	constructor(data?);
}
declare class C2SYiJiCallHelp
{
	Id: number;
	constructor(data?);
}
declare class S2CYiJiCallHelp
{
	Tag: number;
	constructor(data?);
}
declare class S2CYiJiFlyPrize
{
	Items: Array<ItemNum>;
	constructor(data?);
}
declare class S2CYiJiActEnd
{
	constructor(data?);
}
declare class C2SPlayerXZXS
{
	constructor(data?);
}
declare class S2CPlayerXZXS
{
	Level: number;
	MaxLevel: number;
	CurExp: number;
	ResetTimestamp: number;
	Tasks: Array<XZXSTask>;
	constructor(data?);
}
declare class XZXSTask
{
	TaskId: number;
	TaskNameId: number;
	Star: number;
	TaskDuration: number;
	TaskExp: number;
	TaskPrize: Array<ItemInfo>;
	PartnerNum: number;
	TaskConditionId: Array<number>;
	TaskFateId: number;
	TaskState: number;
	TaskFateOk: number;
	TaskTimestamp: number;
	partners: Array<XZXSPartner>;
	constructor(data?);
}
declare class XZXSPartner
{
	PType: number;
	Id: number;
	IdStr: string ;
	Quality: number;
	Rarity: number;
	TaskId: number;
	UserId: number;
	Nick: string ;
	AreaId: number;
	FamilyId: string ;
	PetType: number;
	constructor(data?);
}
declare class C2SXZXSRefreshTask
{
	constructor(data?);
}
declare class S2CXZXSRefreshTask
{
	Tag: number;
	constructor(data?);
}
declare class XZXSStartTaskData
{
	TaskId: number;
	partners: Array<XZXSPartner>;
	constructor(data?);
}
declare class C2SXZXSStartTask
{
	Data: XZXSStartTaskData ;
	constructor(data?);
}
declare class S2CXZXSStartTask
{
	Tag: number;
	Task: XZXSTask ;
	constructor(data?);
}
declare class C2SXZXSGetAllCanStartTask
{
	constructor(data?);
}
declare class S2CXZXSGetAllCanStartTask
{
	Tag: number;
	Data: Array<XZXSStartTaskData>;
	constructor(data?);
}
declare class C2SXZXSOneKeyStartTask
{
	Datas: Array<XZXSStartTaskData>;
	constructor(data?);
}
declare class S2CXZXSOneKeyStartTask
{
	Tasks: Array<XZXSTask>;
	constructor(data?);
}
declare class C2SXZXSGetTaskPrize
{
	TaskId: number;
	constructor(data?);
}
declare class S2CXZXSGetTaskPrize
{
	Tag: number;
	TaskIds: Array<number>;
	constructor(data?);
}
declare class XZXSHelpPartner
{
	Partner: XZXSPartner ;
	Id: number;
	LockedTimestamp: number;
	constructor(data?);
}
declare class C2SXZXSGetHelpPartnerList
{
	constructor(data?);
}
declare class S2CXZXSGetHelpPartnerList
{
	Items: Array<XZXSHelpPartner>;
	constructor(data?);
}
declare class C2SXZXSHelpPartnerSave
{
	Items: Array<XZXSHelpPartner>;
	constructor(data?);
}
declare class S2CXZXSHelpPartnerSave
{
	Items: Array<XZXSHelpPartner>;
	constructor(data?);
}
declare class C2SXZXSGetOthHelpPartnerList
{
	constructor(data?);
}
declare class S2CXZXSGetOthHelpPartnerList
{
	Items: Array<XZXSPartner>;
	constructor(data?);
}
declare class CityWarData
{
	ActState: number;
	CityData: Array<CityData>;
	Session: number;
	constructor(data?);
}
declare class CityData
{
	CityId: number;
	CityState: number;
	Familys: Array<CityFamily>;
	WinnerFamily: string ;
	constructor(data?);
}
declare class CityFamily
{
	FamilyId: string ;
	FamilyName: string ;
	FamilyArea: number;
	Player: Array<CityPlayer>;
	FamilyScore: number;
	FamilyState: number;
	World: string ;
	constructor(data?);
}
declare class CityPlayer
{
	Id: number;
	FamilyId: string ;
	AreaId: number;
	Nick: string ;
	Kill: number;
	Score: number;
	Rank: number;
	Head: number;
	HeadFrame: number;
	PVPCD: number;
	World: string ;
	constructor(data?);
}
declare class C2SGetCityWarData
{
	constructor(data?);
}
declare class S2CCityWarData
{
	Data: CityWarData ;
	constructor(data?);
}
declare class C2SGetCityWarChooseItem
{
	constructor(data?);
}
declare class S2CGetCityWarChooseItem
{
	Id: Array<number>;
	constructor(data?);
}
declare class C2SCityWarKillRank
{
	constructor(data?);
}
declare class S2CCityWarKillRank
{
	List: Array<CityPlayer>;
	MyData: CityPlayer ;
	constructor(data?);
}
declare class C2SCityWarChoose
{
	Id: number;
	constructor(data?);
}
declare class S2CCityWarChoose
{
	Tag: number;
	Id: number;
	constructor(data?);
}
declare class S2CCityWarMapData
{
	Familys: Array<CityFamily>;
	constructor(data?);
}
declare class S2CCityWarMyScore
{
	Kill: number;
	Score: number;
	PVPCD: number;
	constructor(data?);
}
declare class S2CCityWarCrystal
{
	Data: Array<CityWarCrystal>;
	constructor(data?);
}
declare class CityWarCrystal
{
	Id: number;
	State: number;
	FamilyId: string ;
	FamilyName: string ;
	FamilyArea: number;
	Damange: Array<CityWarCrystalDamage>;
	FamilyWorld: string ;
	constructor(data?);
}
declare class CityWarCrystalDamage
{
	FamilyId: string ;
	FamilyName: string ;
	FamilyArea: number;
	Damange: number;
	FamilyWorld: string ;
	constructor(data?);
}
declare class S2CCityWarCrystalDamange
{
	Id: number;
	Data: Array<CityWarCrystalDamage>;
	constructor(data?);
}
declare class C2SCityWarPrepareOpenBox
{
	Type: number;
	constructor(data?);
}
declare class S2CCityWarPrepareOpenBox
{
	Tag: number;
	Type: number;
	constructor(data?);
}
declare class C2SCityWarOpenBox
{
	Id: number;
	constructor(data?);
}
declare class S2CCityWarOpenBox
{
	Tag: number;
	Id: number;
	constructor(data?);
}
declare class C2SCityWarGive
{
	constructor(data?);
}
declare class S2CCityWarGive
{
	Tag: number;
	constructor(data?);
}
declare class C2SCityWarCleanPVPCd
{
	constructor(data?);
}
declare class S2CCityWarCleanPVPCd
{
	Tag: number;
	TagP: string ;
	constructor(data?);
}
declare class S2CCityWarWinner
{
	FamilyId: string ;
	FamilyName: string ;
	FamilyArea: number;
	IsMyFamily: number;
	CityName: string ;
	FamilyWorld: string ;
	constructor(data?);
}
declare class S2CCityWarChooseChange
{
	constructor(data?);
}
declare class S2CCityWarDead
{
	PlayerName: string ;
	FamilyName: string ;
	FamilyArea: number;
	World: string ;
	constructor(data?);
}
declare class SectWarData
{
	ActState: number;
	CityData: Array<SectCityData>;
	Session: number;
	CityPrize: Array<CityPrize>;
	Rank1: Array<SectCityPlayer>;
	Rank2: Array<SectCityPlayer>;
	Rank3: Array<SectCityPlayer>;
	CrystalDie: number;
	constructor(data?);
}
declare class CityPrize
{
	PlayerId: number;
	Prize: Array<number>;
	constructor(data?);
}
declare class SectLeaderInfo
{
	Id: number;
	AreaId: number;
	Nick: string ;
	FV: number;
	Head: number;
	HeadFrame: number;
	VIP: number;
	SectNick: string ;
	FamilyNick: string ;
	ShowAreaId: number;
	World: string ;
	HideVIP: number;
	constructor(data?);
}
declare class SectCityData
{
	CityId: number;
	CityState: number;
	Sects: Array<CitySect>;
	WinnerSect: number;
	PrizeState: number;
	WinnerSectShowId: number;
	DieCount: number;
	DiePlayerId: number;
	SectWarWarriorScore: Array<SectWarWarriorScore>;
	SectWarWarriorPlayerScore: Array<SectWarWarriorPlayerScore>;
	SectWarAnimalScore: Array<SectWarWarriorScore>;
	SectWarAnimalPlayerScore: Array<SectWarWarriorPlayerScore>;
	SectWarLeaderScore: Array<SectWarWarriorScore>;
	SectWarLeaderPlayerScore: Array<SectWarWarriorPlayerScore>;
	SectWarCrystalScore: Array<SectWarWarriorScore>;
	SectWarCrystalPlayerScore: Array<SectWarWarriorPlayerScore>;
	SectCurMonsterData: Array<SectCurMonster>;
	constructor(data?);
}
declare class SectCurMonster
{
	SectArea: number;
	CurMonster: number;
	constructor(data?);
}
declare class CitySect
{
	SectName: string ;
	SectArea: number;
	Player: Array<SectCityPlayer>;
	SectScore: number;
	SectState: number;
	ShowAreaId: number;
	IncreaseBuff: Array<number>;
	World: string ;
	constructor(data?);
}
declare class SectCityPlayer
{
	Id: number;
	SectId: string ;
	AreaId: number;
	Nick: string ;
	Kill: number;
	Score: number;
	Rank: number;
	Head: number;
	HeadFrame: number;
	PVPCD: number;
	PrizeSecond: number;
	NextPrize: number;
	GetScorePrize: Array<number>;
	GetRankPrize: Array<number>;
	GetCityPrize: Array<number>;
	Team: number;
	ShowAreaId: number;
	DieCount: number;
	EachScore: Array<number>;
	EachRank: Array<number>;
	MultiKill: number;
	World: string ;
	constructor(data?);
}
declare class C2SGetSectWarData
{
	constructor(data?);
}
declare class S2CSectWarData
{
	Data: SectWarData ;
	GetCityPrize: Array<number>;
	constructor(data?);
}
declare class C2SGetSectWarLeaderInfo
{
	constructor(data?);
}
declare class S2CSectWarLeaderInfo
{
	Data: Array<SectLeaderInfo>;
	constructor(data?);
}
declare class C2SSectWarScoreRank
{
	Type: number;
	constructor(data?);
}
declare class S2CSectWarScoreRank
{
	Type: number;
	List: Array<SectCityPlayer>;
	MyData: SectCityPlayer ;
	constructor(data?);
}
declare class S2CSectWarMapData
{
	Sects: Array<CitySect>;
	Increase: Array<Skill>;
	WarriorBelong: number;
	ShowAreaId: number;
	constructor(data?);
}
declare class S2CSectWarMyScore
{
	Kill: number;
	Score: number;
	PVPCD: number;
	NextPrize: number;
	GetScorePrize: Array<number>;
	Team: number;
	constructor(data?);
}
declare class C2SSectWarOpenBox
{
	Id: number;
	constructor(data?);
}
declare class S2CSectWarOpenBox
{
	Tag: number;
	Id: number;
	constructor(data?);
}
declare class C2SSectWarCleanPVPCd
{
	constructor(data?);
}
declare class S2CSectWarCleanPVPCd
{
	Tag: number;
	TagP: string ;
	constructor(data?);
}
declare class S2CSectWarWinner
{
	ShowAreaId: number;
	SectName: string ;
	SectArea: number;
	IsMySect: number;
	CityName: string ;
	World: string ;
	EndWay: number;
	constructor(data?);
}
declare class S2CSectWarChooseChange
{
	constructor(data?);
}
declare class S2CSectWarDead
{
	PlayerName: string ;
	SectName: string ;
	SectArea: number;
	Score: number;
	ShowAreaId: number;
	World: string ;
	constructor(data?);
}
declare class C2SSectWarGetScorePrize
{
	constructor(data?);
}
declare class S2CSectWarGetScorePrize
{
	Tag: number;
	Prize: Array<ItemInfo>;
	constructor(data?);
}
declare class C2SSectWarGetRankPrize
{
	Type: number;
	constructor(data?);
}
declare class S2CSectWarGetRankPrize
{
	Tag: number;
	constructor(data?);
}
declare class C2SSectWarGetCityPrize
{
	Layer: number;
	constructor(data?);
}
declare class S2CSectWarGetCityPrize
{
	Tag: number;
	GetCityPrize: Array<number>;
	constructor(data?);
}
declare class S2CSectWarWarrior
{
	State: number;
	SectName: string ;
	SectArea: number;
	ShowAreaId: number;
	Score: Array<SectWarWarriorScore>;
	MyDamage: number;
	AnimalDamage: number;
	MyAnimalDamage: number;
	LeaderDamage: number;
	MyLeaderDamage: number;
	CrystalDamage: number;
	MyCrystalDamage: number;
	CurMonster: number;
	World: string ;
	constructor(data?);
}
declare class SectWarWarriorScore
{
	SectName: string ;
	SectArea: number;
	Score: number;
	ShowAreaId: number;
	World: string ;
	constructor(data?);
}
declare class SectWarWarriorPlayerScore
{
	PlayerId: number;
	Damage: number;
	constructor(data?);
}
declare class S2CSectWarDieMostPlayer
{
	Id: number;
	LastId: number;
	constructor(data?);
}
declare class C2SGetSectWarLastWinLeader
{
	constructor(data?);
}
declare class S2CGetSectWarLastWinLeader
{
	PlayerId: number;
	AreaId: number;
	Nick: string ;
	SectNick: string ;
	RoleId: number;
	FamilyNick: string ;
	Praise: number;
	Realm: number;
	FV: number;
	World: string ;
	SWorld: string ;
	constructor(data?);
}
declare class C2SPraiseSectWarLastWinLeader
{
	constructor(data?);
}
declare class S2CPraiseSectWarLastWinLeader
{
	Tag: number;
	Praise: number;
	constructor(data?);
}
declare class S2CSectWarAutoPrize
{
	Prize: Array<ItemInfo>;
	constructor(data?);
}
declare class ShowUserInfo
{
	UserId: number;
	Nick: string ;
	ShowAreaId: number;
	FamilyId: string ;
	ShowHead: number;
	ShowHeadFrame: number;
	Fv: number;
	Param: number;
	World: string ;
	LogoutTime: number;
	VipInfo: VipInfo ;
	constructor(data?);
}
declare class IllusionTeamUserInfo
{
	User: ShowUserInfo ;
	TeamRole: number;
	constructor(data?);
}
declare class IllusionTeamInfo
{
	TeamId: number;
	Users: Array<IllusionTeamUserInfo>;
	MinFv: number;
	PassTime: string ;
	constructor(data?);
}
declare class IllusionChapterData
{
	IllusionType: number;
	ChapterId: number;
	ChapterState: number;
	constructor(data?);
}
declare class IllusionCheckPointData
{
	IllusionType: number;
	ChapterId: number;
	CheckPointId: number;
	CheckPointState: number;
	FirstTeam: IllusionTeamInfo ;
	constructor(data?);
}
declare class C2SIllusionData
{
	IllusionType: number;
	constructor(data?);
}
declare class S2CIllusionData
{
	Tag: number;
	IllusionType: number;
	Chapters: Array<IllusionChapterData>;
	TodayHelpTimes: number;
	TagStr: string ;
	constructor(data?);
}
declare class C2SIllusionChapterData
{
	IllusionType: number;
	ChapterId: number;
	constructor(data?);
}
declare class S2CIllusionChapterData
{
	Tag: number;
	IllusionType: number;
	ChapterId: number;
	ChapterState: number;
	CheckPoints: Array<IllusionCheckPointData>;
	constructor(data?);
}
declare class C2SIllusionTeamList
{
	IllusionType: number;
	ChapterId: number;
	CheckPointId: number;
	constructor(data?);
}
declare class S2CIllusionTeamList
{
	Tag: number;
	IllusionType: number;
	ChapterId: number;
	CheckPointId: number;
	Teams: Array<IllusionTeamInfo>;
	constructor(data?);
}
declare class IllusionTeamUserDetailInfo
{
	UserId: number;
	TeamRole: number;
	A: Array<IntAttr>;
	B: Array<StrAttr>;
	constructor(data?);
}
declare class IllusionTeamDetailInfo
{
	TeamId: number;
	Users: Array<IllusionTeamUserDetailInfo>;
	MinFv: number;
	constructor(data?);
}
declare class C2SIllusionMyTeam
{
	constructor(data?);
}
declare class S2CIllusionMyTeam
{
	Tag: number;
	IllusionType: number;
	ChapterId: number;
	CheckPointId: number;
	Team: IllusionTeamDetailInfo ;
	constructor(data?);
}
declare class C2SIllusionTeamSetFV
{
	MinFV: number;
	constructor(data?);
}
declare class S2CIllusionTeamSetFV
{
	Tag: number;
	constructor(data?);
}
declare class C2SIllusionCreateTeam
{
	IllusionType: number;
	ChapterId: number;
	CheckPointId: number;
	constructor(data?);
}
declare class S2CIllusionCreateTeam
{
	Tag: number;
	Team: S2CIllusionMyTeam ;
	constructor(data?);
}
declare class C2SIllusionJoinTeam
{
	IllusionType: number;
	ChapterId: number;
	CheckPointId: number;
	TeamId: number;
	constructor(data?);
}
declare class S2CIllusionJoinTeam
{
	Tag: number;
	IllusionType: number;
	ChapterId: number;
	CheckPointId: number;
	TeamId: number;
	TagStr: string ;
	constructor(data?);
}
declare class C2SGetIllusionCanInviteList
{
	InviteRange: number;
	IllusionType: number;
	ChapterId: number;
	CheckPointId: number;
	constructor(data?);
}
declare class S2CGetIllusionCanInviteList
{
	Tag: number;
	InviteRange: number;
	Users: Array<ShowUserInfo>;
	IllusionType: number;
	ChapterId: number;
	CheckPointId: number;
	constructor(data?);
}
declare class C2SIllusionTeamInvite
{
	InviteUserId: number;
	InviteRange: number;
	constructor(data?);
}
declare class S2CIllusionTeamInvite
{
	Tag: number;
	Timestamp: number;
	Index: number;
	constructor(data?);
}
declare class S2CIllusionTeamBeInvited
{
	IllusionType: number;
	ChapterId: number;
	CheckPointId: number;
	TeamId: number;
	InviteUserNick: string ;
	InviteAreaId: number;
	World: string ;
	constructor(data?);
}
declare class C2SIllusionTeamBeInvited
{
	IllusionType: number;
	ChapterId: number;
	CheckPointId: number;
	TeamId: number;
	Reply: number;
	Param: number;
	constructor(data?);
}
declare class C2SIllusionExitTeam
{
	UserId: number;
	constructor(data?);
}
declare class S2CIllusionExitTeam
{
	Tag: number;
	Team: S2CIllusionMyTeam ;
	constructor(data?);
}
declare class C2SIllusionDelTeam
{
	constructor(data?);
}
declare class S2CIllusionDelTeam
{
	Tag: number;
	constructor(data?);
}
declare class C2SIllusionFight
{
	constructor(data?);
}
declare class S2CIllusionFight
{
	Tag: number;
	RetStr: string ;
	IllusionType: number;
	ChapterId: number;
	CheckPointId: number;
	TeamId: number;
	constructor(data?);
}
declare class C2SIllusionSweep
{
	IllusionType: number;
	constructor(data?);
}
declare class S2CIllusionSweep
{
	Tag: number;
	IllusionType: number;
	constructor(data?);
}
declare class C2SIllusionSweepByTabId
{
	TabId: number;
	constructor(data?);
}
declare class S2CIllusionSweepByTabId
{
	Tag: number;
	TabId: number;
	constructor(data?);
}
declare class C2SIllusionShout
{
	IllusionType: number;
	ChapterId: number;
	CheckPointId: number;
	TeamId: number;
	ChannelId: number;
	constructor(data?);
}
declare class S2CIllusionShout
{
	Tag: number;
	constructor(data?);
}
declare class S2CReportIllusionShout
{
	IllusionType: number;
	ChapterId: number;
	CheckPointId: number;
	TeamId: number;
	ChannelType: number;
	SendId: number;
	SenderGodLevel: number;
	AreaId: number;
	SenderHead: number;
	SenderHeadFrame: number;
	SenderChatFrame: number;
	SenderTitle: number;
	SenderVIP: number;
	SenderNick: string ;
	World: string ;
	constructor(data?);
}
declare class C2SCommonShout
{
	NoticeId: number;
	ChannelId: number;
	Param1: string ;
	Param2: string ;
	constructor(data?);
}
declare class S2CCommonShout
{
	Tag: number;
	NoticeId: number;
	ChannelId: number;
	Param1: string ;
	Param2: string ;
	constructor(data?);
}
declare class S2CReportCommonShout
{
	NoticeId: number;
	ChannelType: number;
	Param1: string ;
	Param2: string ;
	SenderId: number;
	SenderGodLevel: number;
	SenderAreaId: number;
	SenderHead: number;
	SenderHeadFrame: number;
	SenderChatFrame: number;
	SenderTitle: number;
	SenderVIP: number;
	SenderNick: string ;
	World: string ;
	HideVIP: number;
	constructor(data?);
}
declare class C2SIllusionTeamNextCheckPoint
{
	IllusionType: number;
	ChapterId: number;
	CheckPointId: number;
	TeamId: number;
	constructor(data?);
}
declare class S2CIllusionTeamNextCheckPoint
{
	Tag: number;
	constructor(data?);
}
declare class C2SIllusionTeamReFight
{
	IllusionType: number;
	ChapterId: number;
	CheckPointId: number;
	TeamId: number;
	constructor(data?);
}
declare class S2CIllusionTeamReFight
{
	Tag: number;
	constructor(data?);
}
declare class C2SGetIllusionsByTabId
{
	TabId: number;
	constructor(data?);
}
declare class S2CGetIllusionsByTabId
{
	Tag: number;
	TabId: number;
	States: Array<IllusionState>;
	constructor(data?);
}
declare class IllusionState
{
	IllusionType: number;
	State: number;
	constructor(data?);
}
declare class SavageBeast
{
	BeastId: number;
	IsWear: number;
	IsAwaken: number;
	IsUnlock: number;
	Skills: Array<Skill>;
	BeastEquips: Array<BeastEquip>;
	Fv: number;
	BeastStar: number;
	constructor(data?);
}
declare class BeastEquip
{
	Pos: number;
	ItemId: number;
	Level: number;
	Star: number;
	constructor(data?);
}
declare class C2SBeasts
{
	constructor(data?);
}
declare class S2CBeasts
{
	Tag: number;
	Beasts: Array<SavageBeast>;
	constructor(data?);
}
declare class C2SUnlockBeast
{
	BeastId: number;
	constructor(data?);
}
declare class C2SWearBeast
{
	BeastId: number;
	constructor(data?);
}
declare class S2CWearBeast
{
	Tag: number;
	BeastId: number;
	constructor(data?);
}
declare class C2SOneKeyWearBeastEquip
{
	BeastId: number;
	constructor(data?);
}
declare class C2SWearBeastEquip
{
	BeastId: number;
	Pos: number;
	constructor(data?);
}
declare class S2CBeastAwaken
{
	Tag: number;
	BeastId: number;
	constructor(data?);
}
declare class C2SOneKeyStrengthenBeastEquip
{
	BeastId: number;
	constructor(data?);
}
declare class C2SStarUpBeastEquip
{
	BeastId: number;
	Pos: number;
	quality: number;
	reborn: number;
	star: number;
	id1: string ;
	id2: string ;
	id3: string ;
	constructor(data?);
}
declare class S2CStarUpBeast
{
	Tag: number;
	EquipId: string ;
	constructor(data?);
}
declare class C2SSkillLevelUp
{
	BeastId: number;
	SkillId: number;
	constructor(data?);
}
declare class S2CSavageBeast
{
	Tag: number;
	SavageBeast: SavageBeast ;
	constructor(data?);
}
declare class C2SBeastStar
{
	BeastId: number;
	constructor(data?);
}
declare class S2CBeastStar
{
	Tag: number;
	BeastId: number;
	constructor(data?);
}
declare class RechargeGearLog
{
	Nick: string ;
	AreaId: number;
	ItemId: number;
	ItemNum: number;
	Timestamp: number;
	ActId: number;
	World: string ;
	constructor(data?);
}
declare class C2SGetRechargeGearData
{
	ActId: number;
	constructor(data?);
}
declare class S2CGetRechargeGearData
{
	Tag: number;
	ActId: number;
	ReturnDetail: Array<ReturnDetail>;
	RechargeGearLog: Array<RechargeGearLog>;
	MyLog: Array<RechargeGearLog>;
	constructor(data?);
}
declare class C2SRechargeGearDraw
{
	ActId: number;
	constructor(data?);
}
declare class S2CRechargeGearDraw
{
	Tag: number;
	ActId: number;
	Multi: number;
	ItemNum: ItemInfo ;
	constructor(data?);
}
declare class C2STRGearDraw
{
	ActId: number;
	constructor(data?);
}
declare class S2CTRGearDraw
{
	Tag: number;
	ActId: number;
	ItemNum: ItemInfo ;
	constructor(data?);
}
declare class C2STRGearSelectItem
{
	ActId: number;
	Pos: number;
	ItemId: number;
	constructor(data?);
}
declare class S2CTRGearSelectItem
{
	Tag: number;
	constructor(data?);
}
declare class C2SGetTRGearInfo
{
	ActId: number;
	constructor(data?);
}
declare class S2CGetTRGearInfo
{
	Tag: number;
	ActId: number;
	ReturnDetail: Array<ReturnDetail>;
	MyLog: Array<XunBaoLog>;
	HadDraw: Array<number>;
	Amount: number;
	Items: Array<TRGearItems>;
	HadDrawPos: Array<number>;
	constructor(data?);
}
declare class TRGearItems
{
	Id: number;
	Gear: number;
	ItemId: number;
	ItemNum: number;
	ShowPos: number;
	Quality: number;
	GroupId: number;
	constructor(data?);
}
declare class C2SGetPassCheckData
{
	ActId: number;
	constructor(data?);
}
declare class S2CGetPassCheckData
{
	Tag: number;
	ActId: number;
	Session: number;
	LevelGroup: number;
	TaskGroup: number;
	BuyCount: number;
	SessionStartTime: number;
	Level: number;
	Exp: number;
	Prize1: number;
	Prize2: number;
	Unlock: number;
	TodayExpBox: number;
	constructor(data?);
}
declare class C2SPassCheckBuyLevel
{
	ActId: number;
	BuyLevel: number;
	constructor(data?);
}
declare class S2CPassCheckBuyLevel
{
	Tag: number;
	TagP: string ;
	ActId: number;
	constructor(data?);
}
declare class C2SPassCheckGetPrize
{
	ActId: number;
	constructor(data?);
}
declare class S2CPassCheckGetPrize
{
	Tag: number;
	Prize: Array<ItemInfo>;
	PrizeLevel: Array<number>;
	constructor(data?);
}
declare class C2SPassCheckGetExpBox
{
	ActId: number;
	constructor(data?);
}
declare class S2CPassCheckGetExpBox
{
	Tag: number;
	constructor(data?);
}
declare class SectHonorPlayer
{
	UserId: number;
	Pos: number;
	A: Array<IntAttr>;
	B: Array<StrAttr>;
	Praise: number;
	constructor(data?);
}
declare class C2SGetSectHonorPlayer
{
	constructor(data?);
}
declare class S2CGetSectHonorPlayer
{
	FamilyId: string ;
	Players: Array<SectHonorPlayer>;
	constructor(data?);
}
declare class C2SSectHonorPraise
{
	Pos: number;
	constructor(data?);
}
declare class S2CSectHonorPraise
{
	Tag: number;
	Pos: number;
	Praise: number;
	constructor(data?);
}
declare class C2SSectHonorMandate
{
	Pos: number;
	UserId: number;
	constructor(data?);
}
declare class S2CSectHonorMandate
{
	Tag: number;
	Pos: number;
	UserId: number;
	constructor(data?);
}
declare class C2SSectHonorMandatePlayerList
{
	constructor(data?);
}
declare class MandatePlayer
{
	UserId: number;
	Nick: string ;
	FightValue: number;
	Territory: number;
	Head: number;
	HeadFrame: number;
	Pos: number;
	ShowAreaId: number;
	State: number;
	World: string ;
	constructor(data?);
}
declare class S2CSectHonorMandatePlayerList
{
	Tag: number;
	Players: Array<MandatePlayer>;
	constructor(data?);
}
declare class C2SSectHonorGetPrize
{
	constructor(data?);
}
declare class S2CSectHonorGetPrize
{
	Tag: number;
	constructor(data?);
}
declare class S2CNewAtMsg
{
	constructor(data?);
}
declare class EntrustData
{
	user: ShowUserInfo ;
	EntrustType: number;
	EntrustState: number;
	EntrustTimes: number;
	LeftTimes: number;
	UniqueId: number;
	constructor(data?);
}
declare class C2SGetEntrustWallList
{
	EntrustId: number;
	constructor(data?);
}
declare class S2CGetEntrustWallList
{
	EntrustId: number;
	List: Array<EntrustData>;
	constructor(data?);
}
declare class C2SGetMyEntrustList
{
	EntrustId: number;
	constructor(data?);
}
declare class S2CGetMyEntrustList
{
	EntrustId: number;
	List: Array<EntrustData>;
	constructor(data?);
}
declare class C2SEntrustToWall
{
	EntrustId: number;
	EntrustTimes: number;
	constructor(data?);
}
declare class S2CEntrustToWall
{
	Tag: number;
	EntrustId: number;
	EntrustTimes: number;
	constructor(data?);
}
declare class C2SReceiveEntrust
{
	EntrustId: number;
	UserId: number;
	constructor(data?);
}
declare class S2CReceiveEntrust
{
	Tag: number;
	EntrustId: number;
	UserId: number;
	constructor(data?);
}
declare class C2SCancelEntrust
{
	EntrustId: number;
	UserId: number;
	constructor(data?);
}
declare class S2CCancelEntrust
{
	Tag: number;
	EntrustId: number;
	UserId: number;
	TagP: string ;
	constructor(data?);
}
declare class C2SEntrustInfo
{
	EntrustId: number;
	constructor(data?);
}
declare class S2CEntrustInfo
{
	EntrustId: number;
	Push: number;
	leftTimes: number;
	constructor(data?);
}
declare class C2SEntrustRed
{
	EntrustId: number;
	Push: number;
	constructor(data?);
}
declare class S2CEntrustRed
{
	Tag: number;
	EntrustId: number;
	Push: number;
	constructor(data?);
}
declare class S2CChangeXldEntrustData
{
	BossId: number;
	Data: EntrustData ;
	constructor(data?);
}
declare class C2SGetXldEntrustList
{
	BossId: number;
	constructor(data?);
}
declare class S2CGetXldEntrustList
{
	Tag: number;
	BossId: number;
	List: Array<EntrustData>;
	constructor(data?);
}
declare class C2SXldEntrust
{
	BossId: number;
	UserId: number;
	constructor(data?);
}
declare class S2CXldEntrust
{
	Tag: number;
	BossId: number;
	UserId: number;
	constructor(data?);
}
declare class C2SResponseXldEntrust
{
	BossId: number;
	UserId: number;
	Result: number;
	constructor(data?);
}
declare class S2CResponseXldEntrust
{
	Tag: number;
	BossId: number;
	UserId: number;
	constructor(data?);
}
declare class XLDBossInfo
{
	Id: number;
	K: number;
	L: number;
	V: number;
	C: number;
	T: number;
	S: number;
	E: number;
	LB: number;
	NT: number;
	BossState: number;
	EntrustRedOk: number;
	constructor(data?);
}
declare class C2SXLDBossInfo
{
	constructor(data?);
}
declare class S2CXLDBossInfo
{
	Items: Array<XLDBossInfo>;
	constructor(data?);
}
declare class C2SXLDBossFight
{
	Id: number;
	constructor(data?);
}
declare class S2CXLDBossFight
{
	Tag: number;
	info: XLDBossInfo ;
	constructor(data?);
}
declare class C2SXLDBossSweep
{
	Id: number;
	constructor(data?);
}
declare class S2CXLDBossSweep
{
	Tag: number;
	constructor(data?);
}
declare class C2SXLDBossPurchase
{
	Id: number;
	constructor(data?);
}
declare class S2CXLDBossPurchase
{
	Tag: number;
	constructor(data?);
}
declare class XsdBossInfo
{
	XsdId: number;
	BossId: number;
	State: number;
	ReliveTimestamp: number;
	BossOwner: XsdBossOwnerData ;
	constructor(data?);
}
declare class S2CXsdBossInfo
{
	Items: Array<XsdBossInfo>;
	constructor(data?);
}
declare class C2SXsdBossJoinScene
{
	XsdId: number;
	BossId: number;
	constructor(data?);
}
declare class S2CXsdBossJoinScene
{
	Tag: number;
	XsdId: number;
	BossId: number;
	constructor(data?);
}
declare class C2SXsdBossLeaveScene
{
	XsdId: number;
	BossId: number;
	constructor(data?);
}
declare class S2CXsdBossLeaveScene
{
	Tag: number;
	XsdId: number;
	BossId: number;
	constructor(data?);
}
declare class XsdBossOwnerData
{
	User: ShowUserInfo ;
	Hp: number;
	constructor(data?);
}
declare class XsdBossDamage
{
	User: ShowUserInfo ;
	DamageTime: number;
	Damage: number;
	constructor(data?);
}
declare class S2CXsdBossDamageRank
{
	XsdId: number;
	BossId: number;
	Items: Array<XsdBossDamage>;
	constructor(data?);
}
declare class S2CXsdBossDamageMy
{
	XsdId: number;
	BossId: number;
	MyDamage: number;
	MyRank: number;
	constructor(data?);
}
declare class C2SXsdBossCfg
{
	Cfg: string ;
	constructor(data?);
}
declare class C2SXsdBossPurchase
{
	XsdId: number;
	constructor(data?);
}
declare class S2CXsdBossPurchase
{
	Tag: number;
	XsdId: number;
	LeftTimes: number;
	constructor(data?);
}
declare class C2SXsdCollect
{
	XsdId: number;
	CollId: number;
	CollAct: number;
	constructor(data?);
}
declare class S2CXsdCollect
{
	Tag: number;
	XsdId: number;
	CollId: number;
	StartTimestamp: number;
	FinishTimestamp: number;
	CollUserId: number;
	CollState: number;
	constructor(data?);
}
declare class C2SGetAllEquipData
{
	constructor(data?);
}
declare class S2CGetAllEquipData
{
	EquipAllData: Array<EquipAllData>;
	constructor(data?);
}
declare class C2SGetFuncEquipData
{
	FuncId: number;
	constructor(data?);
}
declare class S2CGetFuncEquipData
{
	EquipAllData: Array<EquipAllData>;
	constructor(data?);
}
declare class C2SGetEquipData
{
	FuncId: number;
	ObjId: number;
	constructor(data?);
}
declare class S2CGetEquipData
{
	Tag: number;
	EquipAllData: EquipAllData ;
	constructor(data?);
}
declare class C2SOneKeyEquipWear
{
	FuncId: number;
	ObjId: number;
	constructor(data?);
}
declare class S2COneKeyEquipWear
{
	Tag: number;
	FuncId: number;
	ObjId: number;
	constructor(data?);
}
declare class C2SEquipWear
{
	FuncId: number;
	ObjId: number;
	Pos: number;
	Id: string ;
	constructor(data?);
}
declare class S2CEquipWear
{
	Tag: number;
	FuncId: number;
	ObjId: number;
	Pos: number;
	constructor(data?);
}
declare class C2SOneKeyEquipStrengthS
{
	FuncId: number;
	ObjId: number;
	constructor(data?);
}
declare class S2COneKeyEquipStrengthS
{
	Tag: number;
	FuncId: number;
	ObjId: number;
	constructor(data?);
}
declare class C2SEquipStrengthS
{
	FuncId: number;
	Pos: number;
	ObjId: number;
	constructor(data?);
}
declare class S2CEquipStrengthS
{
	Tag: number;
	FuncId: number;
	ObjId: number;
	Pos: number;
	constructor(data?);
}
declare class C2SStrengthMaster
{
	FuncId: number;
	ObjId: number;
	constructor(data?);
}
declare class S2CStrengthMaster
{
	Tag: number;
	FuncId: number;
	ObjId: number;
	constructor(data?);
}
declare class C2SOneKeyMosaicWear
{
	FuncId: number;
	ObjId: number;
	constructor(data?);
}
declare class S2COneKeyMosaicWear
{
	Tag: number;
	FuncId: number;
	ObjId: number;
	constructor(data?);
}
declare class C2SOneKeyMosaicChange
{
	FuncId: number;
	ObjId: number;
	constructor(data?);
}
declare class S2COneKeyMosaicChange
{
	Tag: number;
	FuncId: number;
	ObjId: number;
	constructor(data?);
}
declare class C2SOneKeyMosaicUpLev
{
	FuncId: number;
	ObjId: number;
	constructor(data?);
}
declare class S2COneKeyMosaicUpLev
{
	Tag: number;
	FuncId: number;
	ObjId: number;
	constructor(data?);
}
declare class C2SEquipStars
{
	FuncId: number;
	ObjId: number;
	Quality: number;
	Star: number;
	EquipPart: number;
	Id1: string ;
	Id2: string ;
	Id3: string ;
	constructor(data?);
}
declare class S2CEquipStars
{
	Tag: number;
	FuncId: number;
	ObjId: number;
	Id: string ;
	constructor(data?);
}
declare class C2SEquipCompose
{
	FuncId: number;
	ObjId: number;
	ItemId: number;
	constructor(data?);
}
declare class S2CEquipCompose
{
	Tag: number;
	FuncId: number;
	ObjId: number;
	ItemId: number;
	constructor(data?);
}
declare class C2SEquipUpLev
{
	FuncId: number;
	ObjId: number;
	Id: string ;
	constructor(data?);
}
declare class S2CEquipUpLev
{
	Tag: number;
	FuncId: number;
	ObjId: number;
	Id: string ;
	constructor(data?);
}
declare class C2SEquipOneKeyUpLev
{
	FuncId: number;
	ObjId: number;
	Id: number;
	constructor(data?);
}
declare class S2CEquipOneKeyUpLev
{
	Tag: number;
	FuncId: number;
	ObjId: number;
	Id: number;
	constructor(data?);
}
declare class C2SYanJiaActive
{
	FuncId: number;
	ObjId: number;
	constructor(data?);
}
declare class S2CYanJiaActive
{
	Tag: number;
	FuncId: number;
	ObjId: number;
	constructor(data?);
}
declare class C2SYanJiaCoreActive
{
	FuncId: number;
	ObjId: number;
	Id: number;
	constructor(data?);
}
declare class S2CYanJiaCoreActive
{
	Tag: number;
	FuncId: number;
	ObjId: number;
	Id: number;
	constructor(data?);
}
declare class C2SYanJiaCoreLev
{
	FuncId: number;
	ObjId: number;
	Id: number;
	constructor(data?);
}
declare class S2CYanJiaCoreLev
{
	Tag: number;
	FuncId: number;
	ObjId: number;
	Id: number;
	constructor(data?);
}
declare class C2SYanJiaCoreStar
{
	FuncId: number;
	ObjId: number;
	Id: number;
	constructor(data?);
}
declare class S2CYanJiaCoreStar
{
	Tag: number;
	FuncId: number;
	ObjId: number;
	Id: number;
	constructor(data?);
}
declare class C2SYanJiaCoreWear
{
	FuncId: number;
	ObjId: number;
	Id: number;
	constructor(data?);
}
declare class S2CYanJiaCoreWear
{
	Tag: number;
	FuncId: number;
	ObjId: number;
	Id: number;
	constructor(data?);
}
declare class C2SGetYanJiaSoldierSoulData
{
	FuncId: number;
	ObjId: number;
	constructor(data?);
}
declare class S2CGetYanJiaSoldierSoulData
{
	SoldierSoulDrug: Array<SoldierSoulDrug>;
	SoldierSoulSkillLev: number;
	constructor(data?);
}
declare class C2SYanJiaSoldierSoulDrug
{
	FuncId: number;
	ObjId: number;
	Id: number;
	constructor(data?);
}
declare class S2CYanJiaSoldierSoulDrug
{
	Tag: number;
	FuncId: number;
	ObjId: number;
	Id: number;
	constructor(data?);
}
declare class C2SYanJiaSoldierSoulSkillUpLev
{
	FuncId: number;
	ObjId: number;
	constructor(data?);
}
declare class S2CYanJiaSoldierSoulSkillUpLev
{
	Tag: number;
	FuncId: number;
	ObjId: number;
	constructor(data?);
}
declare class C2SEquipQuality
{
	FuncId: number;
	ObjId: number;
	Id: string ;
	constructor(data?);
}
declare class S2CEquipQuality
{
	Tag: number;
	FuncId: number;
	ObjId: number;
	Id: number;
	constructor(data?);
}
declare class C2SEquipRefine
{
	FuncId: number;
	ObjId: number;
	Type: number;
	Pos: number;
	constructor(data?);
}
declare class S2CEquipRefine
{
	Tag: number;
	FuncId: number;
	ObjId: number;
	Type: number;
	Pos: number;
	constructor(data?);
}
declare class C2SBreakType
{
	Type: number;
	BreakType: Array<number>;
	constructor(data?);
}
declare class S2CBreakType
{
	Tag: number;
	Type: number;
	BreakType: Array<number>;
	constructor(data?);
}
declare class Develop
{
	FuncId: number;
	ObjId: number;
	Part: number;
	Key: string ;
	Type: string ;
	Level: number;
	Star: number;
	Exp: number;
	State: number;
	FightPos: number;
	Unlock: number;
	DrugLevel: number;
	HLSkillId: number;
	constructor(data?);
}
declare class S2CAutoPushGift
{
	Id: number;
	GiftType: number;
	EndTime: number;
	GoodsPrice: number;
	SalePrice: number;
	ItemString: string ;
	ChatTips: string ;
	LimitVip: number;
	GoldType: number;
	GiftId: number;
	IconSrc: string ;
	Ratio: string ;
	status: number;
	TotalTimes: number;
	BuyTimes: number;
	constructor(data?);
}
declare class C2SPushGiftShopBuy
{
	GoodsId: number;
	Num: number;
	constructor(data?);
}
declare class S2CPushGiftShopBuy
{
	Tag: number;
	Gid: number;
	MsgParam: number;
	ItemString: string ;
	constructor(data?);
}
declare class Team
{
	TeamId: number;
	Key1: number;
	Key2: number;
	Players: Array<TeamPlayer>;
	FightValue: number;
	FightLimit: number;
	FuncId: number;
	Key3: number;
	Key4: number;
	constructor(data?);
}
declare class TeamPlayerShow
{
	UserId: number;
	A: Array<IntAttr>;
	B: Array<StrAttr>;
	constructor(data?);
}
declare class C2STeams
{
	Key1: number;
	Key2: number;
	IsCross: number;
	FuncId: number;
	Key4: number;
	constructor(data?);
}
declare class S2CTeams
{
	Tag: number;
	Teams: Array<Team>;
	FuncId: number;
	constructor(data?);
}
declare class S2CTeamInfo
{
	Tag: number;
	Team: Team ;
	Players: Array<TeamPlayerShow>;
	constructor(data?);
}
declare class C2STeamInfo
{
	constructor(data?);
}
declare class C2SCreateTeam
{
	Key1: number;
	Key2: number;
	IsCross: number;
	FightLimit: number;
	FuncId: number;
	Key3: number;
	Key4: number;
	constructor(data?);
}
declare class S2CCreateTeam
{
	Tag: number;
	Team: Team ;
	Players: Array<TeamPlayerShow>;
	constructor(data?);
}
declare class C2SEditTeam
{
	TeamId: number;
	fvLimit: number;
	constructor(data?);
}
declare class S2CEditTeam
{
	Tag: number;
	Team: Team ;
	Players: Array<TeamPlayerShow>;
	constructor(data?);
}
declare class C2SEditTeamKey
{
	TeamId: number;
	Key1: number;
	Key2: number;
	Key3: number;
	Key4: number;
	constructor(data?);
}
declare class S2CEditTeamKey
{
	Tag: number;
	Team: Team ;
	constructor(data?);
}
declare class C2SJoinTeam
{
	TeamId: number;
	JoinType: number;
	constructor(data?);
}
declare class S2CJoinTeam
{
	Tag: number;
	Team: Team ;
	Players: Array<TeamPlayerShow>;
	constructor(data?);
}
declare class C2SInviteTeam
{
	TeamId: number;
	UserId: number;
	InviteType: number;
	constructor(data?);
}
declare class S2CInviteTeam
{
	Tag: number;
	Timestamp: number;
	Index: number;
	constructor(data?);
}
declare class C2SRefuseInvite
{
	TeamId: number;
	FuncId: number;
	Param: number;
	constructor(data?);
}
declare class S2CRefuseInvite
{
	TagStr: string ;
	Param: number;
	constructor(data?);
}
declare class S2CInviteTeamInfo
{
	Tag: number;
	Key1: number;
	Key2: number;
	TeamId: number;
	Player: TeamPlayer ;
	FuncId: number;
	Key4: number;
	constructor(data?);
}
declare class C2SLeaveTeam
{
	TeamId: number;
	constructor(data?);
}
declare class S2CLeaveTeam
{
	Tag: number;
	FuncId: number;
	constructor(data?);
}
declare class S2CDisbandTeam
{
	Tag: number;
	FuncId: number;
	constructor(data?);
}
declare class C2SKickTeam
{
	TeamId: number;
	UserId: number;
	constructor(data?);
}
declare class S2CKickTeam
{
	Tag: number;
	FuncId: number;
	constructor(data?);
}
declare class C2SGetCanInvite
{
	Type: number;
	constructor(data?);
}
declare class S2CGetCanInvite
{
	Tag: number;
	Players: Array<TeamPlayer>;
	Type: number;
	constructor(data?);
}
declare class HLBoss
{
	Id: number;
	InsId: number;
	State: number;
	Revive: number;
	BossId: number;
	Owner: ShowUserInfo ;
	constructor(data?);
}
declare class HLRank
{
	UserId: number;
	Nick: string ;
	AreaId: number;
	ShowHead: number;
	ShowHeadFrame: number;
	Hurt: number;
	World: string ;
	constructor(data?);
}
declare class C2SGetHLBossList
{
	InsId: number;
	constructor(data?);
}
declare class S2CGetHLBossList
{
	Tag: number;
	HLBossList: Array<HLBoss>;
	constructor(data?);
}
declare class C2SGetHLRankList
{
	InsId: number;
	BossId: number;
	constructor(data?);
}
declare class S2CGetHLRankList
{
	Tag: number;
	HLRankList: Array<HLRank>;
	BossId: number;
	MyRank: number;
	MyHurt: number;
	constructor(data?);
}
declare class C2SReplyPower
{
	InsId: number;
	constructor(data?);
}
declare class S2CReplyPower
{
	Tag: number;
	constructor(data?);
}
declare class C2SAutoReply
{
	Auto: number;
	constructor(data?);
}
declare class S2CAutoReply
{
	Tag: number;
	constructor(data?);
}
declare class C2SEnterHLFB
{
	Type: number;
	InsId: number;
	constructor(data?);
}
declare class S2CEnterHLFB
{
	Tag: number;
	constructor(data?);
}
declare class C2SLeaveHLFB
{
	InsId: number;
	constructor(data?);
}
declare class S2CLeaveHLFB
{
	Tag: number;
	constructor(data?);
}
declare class C2SStartFightHLPVE
{
	InsId: number;
	BossId: number;
	constructor(data?);
}
declare class S2CStartFightHLPVE
{
	Tag: number;
	BossId: number;
	TagP: string ;
	constructor(data?);
}
declare class C2SStartFightHLPVP
{
	InsId: number;
	UseId: number;
	constructor(data?);
}
declare class S2CStartFightHLPVP
{
	Tag: number;
	constructor(data?);
}
declare class S2CNoPowerTip
{
	Tag: number;
	Timestamp: number;
	constructor(data?);
}
declare class HuanLingDev
{
	HuanLing: Develop ;
	Skills: Array<Develop>;
	LingDan: Develop ;
	LingWu: Develop ;
	LWSkill: Array<Develop>;
	Equips: EquipAllData ;
	constructor(data?);
}
declare class C2SHuanLingList
{
	constructor(data?);
}
declare class S2CHuanLingList
{
	Tag: number;
	HuanLingList: Array<HuanLingDev>;
	constructor(data?);
}
declare class S2CHLLevelList
{
	Tag: number;
	HLLevelInfo: Array<HLLevelInfo>;
	constructor(data?);
}
declare class HLLevelInfo
{
	HlId: number;
	Level: number;
	constructor(data?);
}
declare class C2SHLUnlock
{
	HLId: number;
	constructor(data?);
}
declare class S2CHLUnlock
{
	Tag: number;
	HuanLing: Develop ;
	TagP: string ;
	constructor(data?);
}
declare class C2SHLLevelUp
{
	HLId: number;
	Auto: number;
	OneFull: number;
	constructor(data?);
}
declare class S2CHLLevelUp
{
	Tag: number;
	HuanLing: Develop ;
	TagP: string ;
	constructor(data?);
}
declare class C2SHLBattlePos
{
	HLId: number;
	constructor(data?);
}
declare class S2CHLBattlePos
{
	Tag: number;
	HuanLing: Develop ;
	TagP: string ;
	constructor(data?);
}
declare class C2SHLDan
{
	HLId: number;
	constructor(data?);
}
declare class S2CHLDan
{
	Tag: number;
	LingDan: Develop ;
	TagP: string ;
	constructor(data?);
}
declare class C2SHLSkillLevelUp
{
	HLId: number;
	SkillId: number;
	constructor(data?);
}
declare class S2CHLSkillLevelUp
{
	Tag: number;
	Skill: Develop ;
	TagP: string ;
	constructor(data?);
}
declare class C2SHLLWLevelUp
{
	HLId: number;
	LWId: number;
	constructor(data?);
}
declare class S2CHLLWLevelUp
{
	Tag: number;
	LingWu: Develop ;
	TagP: string ;
	constructor(data?);
}
declare class C2SHLLWSkillLevelUp
{
	HLId: number;
	LWId: number;
	SkillId: number;
	constructor(data?);
}
declare class S2CHLLWSkillLevelUp
{
	Tag: number;
	Skill: Develop ;
	TagP: string ;
	constructor(data?);
}
declare class C2SGetDropItems
{
	DropId: number;
	constructor(data?);
}
declare class S2CGetDropItems
{
	DropId: number;
	ItemData: Array<ItemData>;
	constructor(data?);
}
declare class C2SGetScoreXunBaoData
{
	ActId: number;
	constructor(data?);
}
declare class S2CGetScoreXunBaoData
{
	Tag: number;
	Score: number;
	Reward: Array<number>;
	DoublePrize: number;
	FreeTimes: number;
	Amount: number;
	ActId: number;
	Items: Array<TRGearItems>;
	constructor(data?);
}
declare class C2SXunBaoSelectItem
{
	ActId: number;
	Pos: number;
	ItemId: number;
	constructor(data?);
}
declare class S2CXunBaoSelectItem
{
	Tag: number;
	constructor(data?);
}
declare class C2SGetWishXunBaoData
{
	ActId: number;
	constructor(data?);
}
declare class S2CGetWishXunBaoData
{
	Tag: number;
	ActId: number;
	FreeTimes: number;
	WishProgress: number;
	CostTimes: number;
	WishId: number;
	WishXBCheckData: Array<WishXBCheckData>;
	RecoverTime: number;
	constructor(data?);
}
declare class WishXBCheckData
{
	WishId: number;
	Times: number;
	constructor(data?);
}
declare class C2SGetWishList
{
	ActId: number;
	constructor(data?);
}
declare class S2CGetWishList
{
	Tag: number;
	WishList: Array<WishReward>;
	ActId: number;
	constructor(data?);
}
declare class WishReward
{
	Id: number;
	ItemId: number;
	ItemNum: number;
	FuncId: number;
	Multiple: number;
	Times: number;
	constructor(data?);
}
declare class C2SSelectWishReward
{
	ActId: number;
	WishId: number;
	constructor(data?);
}
declare class S2CSelectWishReward
{
	Tag: number;
	constructor(data?);
}
declare class C2SGetWishGiftData
{
	ActId: number;
	constructor(data?);
}
declare class S2CGetWishGiftData
{
	Tag: number;
	ActId: number;
	Gifts: Array<number>;
	HadReceiveDays: Array<GiftReceiveDays>;
	MailPrize: string ;
	BuyTimes: number;
	constructor(data?);
}
declare class GiftReceiveDays
{
	GiftId: number;
	Days: Array<number>;
	constructor(data?);
}
declare class C2SReceiveWishGift
{
	ActId: number;
	GiftId: number;
	Day: number;
	constructor(data?);
}
declare class S2CReceiveWishGift
{
	Tag: number;
	constructor(data?);
}
declare class C2SGetDragonXunBaoData
{
	ActId: number;
	constructor(data?);
}
declare class S2CGetDragonXunBaoData
{
	Tag: number;
	ActId: number;
	FreeTimes: number;
	Coin1BuyTimes: number;
	Coin1BuyTotalTimes: number;
	Coin2BuyTimes: number;
	Coin2BuyTotalTimes: number;
	HotState: number;
	constructor(data?);
}
declare class C2SDragonXBBuyTimes
{
	ActId: number;
	Type: number;
	Times: number;
	constructor(data?);
}
declare class S2CDragonXBBuyTimes
{
	Tag: number;
	constructor(data?);
}
declare class C2SDragonChangeHotState
{
	ActId: number;
	State: number;
	constructor(data?);
}
declare class S2CDragonChangeHotState
{
	Tag: number;
	State: number;
	constructor(data?);
}
declare class S2CUpdateAmount
{
	Tag: number;
	ActId: number;
	Amount: number;
	constructor(data?);
}
declare class C2SGetRankPlayerData
{
	ActId: number;
	constructor(data?);
}
declare class S2CGetRankPlayerData
{
	Tag: number;
	Reward: Array<number>;
	constructor(data?);
}
declare class C2SGetWorshipPlayerData
{
	ActId: number;
	constructor(data?);
}
declare class S2CGetWorshipPlayerData
{
	Tag: number;
	Score: number;
	DevoutScore: number;
	DevoutPlayer: Array<ShowUserInfo>;
	PlayerScore: number;
	Reward: Array<number>;
	ActId: number;
	CurrDevoutPlayer: ShowUserInfo ;
	StepScore: number;
	Step: number;
	constructor(data?);
}
declare class C2SGetWorshipGiftPlayerData
{
	ActId: number;
	constructor(data?);
}
declare class S2CGetWorshipGiftPlayerData
{
	Tag: number;
	PlayerScore: number;
	Reward2: Array<number>;
	Reward3: Array<number>;
	ActId: number;
	Score: number;
	constructor(data?);
}
declare class C2SReceiveActReachReward
{
	ActId: number;
	Id: number;
	Type: number;
	constructor(data?);
}
declare class S2CReceiveActReachReward
{
	Tag: number;
	RewardId: Array<number>;
	ActId: number;
	Type: number;
	constructor(data?);
}
declare class C2SActWorship
{
	ActId: number;
	ItemId: number;
	Auto: number;
	constructor(data?);
}
declare class S2CActWorship
{
	Tag: number;
	ActId: number;
	ItemId: number;
	Reward: ItemInfo ;
	constructor(data?);
}
declare class C2SRecvStepReward
{
	ActId: number;
	RewardId: number;
	constructor(data?);
}
declare class S2CRecvStepReward
{
	Tag: number;
	RewardId: Array<number>;
	ActId: number;
	constructor(data?);
}
declare class WorshipRecord
{
	UserId: number;
	Nick: string ;
	ShowAreaId: number;
	ItemId: number;
	WorshipId: number;
	World: string ;
	constructor(data?);
}
declare class C2SGetWorshipRecord
{
	ActId: number;
	constructor(data?);
}
declare class S2CGetWorshipRecord
{
	Tag: number;
	Records: Array<WorshipRecord>;
	constructor(data?);
}
declare class C2SPlayDice
{
	ActId: number;
	constructor(data?);
}
declare class S2CPlayDice
{
	Tag: number;
	ActId: number;
	Imprint: Array<number>;
	Pos: number;
	Floor: number;
	constructor(data?);
}
declare class C2SDoPlayDice
{
	ActId: number;
	ItemId: number;
	Pos: number;
	Auto: number;
	constructor(data?);
}
declare class S2CDoPlayDice
{
	Tag: number;
	ActId: number;
	Pos: number;
	Imprint: Array<number>;
	ItemId: number;
	constructor(data?);
}
declare class C2SReceiveFloorReward
{
	ActId: number;
	constructor(data?);
}
declare class S2CReceiveFloorReward
{
	Tag: number;
	constructor(data?);
}
declare class C2SPlayDiceGift
{
	ActId: number;
	constructor(data?);
}
declare class S2CPlayDiceGift
{
	Tag: number;
	ActId: number;
	Score: number;
	RewardId: Array<number>;
	constructor(data?);
}
declare class RuinsGrid
{
	Id: number;
	Effect: number;
	ItemId: number;
	constructor(data?);
}
declare class RuinsFloorReward
{
	Id: number;
	Num: number;
	MaxNum: number;
	ItemNum: number;
	constructor(data?);
}
declare class C2SRuinsPlayerData
{
	ActId: number;
	constructor(data?);
}
declare class S2CRuinsPlayerData
{
	Tag: number;
	ActId: number;
	Floor: number;
	RuinsGrid: Array<RuinsGrid>;
	DefaultGrids: Array<number>;
	SelectItem: number;
	RuinsFloorReward: Array<RuinsFloorReward>;
	SelectItemInfo: ItemInfo ;
	constructor(data?);
}
declare class C2SSelectReward
{
	ActId: number;
	Floor: number;
	ItemId: number;
	constructor(data?);
}
declare class S2CSelectReward
{
	Tag: number;
	constructor(data?);
}
declare class C2SSelectGrid
{
	ActId: number;
	Floor: number;
	GridId: number;
	constructor(data?);
}
declare class S2CSelectGrid
{
	Tag: number;
	ActId: number;
	RuinsGrid: RuinsGrid ;
	constructor(data?);
}
declare class C2SGetLeftGird
{
	ActId: number;
	Floor: number;
	constructor(data?);
}
declare class S2CGetLeftGird
{
	Tag: number;
	ActId: number;
	RuinsGrid: Array<RuinsGrid>;
	constructor(data?);
}
declare class C2SFilterRewards
{
	ActId: number;
	Floor: number;
	constructor(data?);
}
declare class S2CFilterRewards
{
	Tag: number;
	RuinsFloorReward: Array<RuinsFloorReward>;
	constructor(data?);
}
declare class C2SGetSignActPlayerData
{
	ActId: number;
	constructor(data?);
}
declare class S2CGetSignActPlayerData
{
	Tag: number;
	Reward: Array<number>;
	PlayerScore: number;
	ActId: number;
	constructor(data?);
}
declare class C2SSwordSoulEquip
{
	ItemId: string ;
	CellId: number;
	constructor(data?);
}
declare class S2CSwordSoulEquip
{
	Tag: number;
	ItemId: string ;
	CellId: number;
	constructor(data?);
}
declare class C2SSwordSoulLvUp
{
	ItemId: string ;
	constructor(data?);
}
declare class S2CSwordSoulLvUp
{
	Tag: number;
	ItemId: string ;
	constructor(data?);
}
declare class C2SSwordSoulResolve
{
	ItemIds: Array<string>;
	constructor(data?);
}
declare class S2CSwordSoulResolve
{
	Tag: number;
	ItemIds: Array<string>;
	constructor(data?);
}
declare class C2SSwordSoulHeCheng
{
	ItemIId: number;
	ItemIds: Array<string>;
	constructor(data?);
}
declare class S2CSwordSoulHeCheng
{
	Tag: number;
	ItemIId: number;
	ItemIds: Array<string>;
	constructor(data?);
}
declare class C2SSwordSoulStarUp
{
	ItemIId: number;
	constructor(data?);
}
declare class S2CSwordSoulStarUp
{
	Tag: number;
	ItemIId: number;
	constructor(data?);
}
declare class C2SSwordSoulStarDown
{
	ItemIId: number;
	constructor(data?);
}
declare class S2CSwordSoulStarDown
{
	Tag: number;
	ItemIId: number;
	constructor(data?);
}
declare class C2SSwordSoulStrength
{
	constructor(data?);
}
declare class S2CSwordSoulStrength
{
	Tag: number;
	Level: number;
	constructor(data?);
}
declare class SwordSoul
{
	SwordSoulCells: Array<SwordSoulCell>;
	SwordSoulTulus: Array<SwordSoulTulu>;
	TuluStrengthLevel: number;
	ResolveQuality: Array<number>;
	AutoResolve: number;
	constructor(data?);
}
declare class SwordSoulCell
{
	CellId: number;
	ItemId: string ;
	constructor(data?);
}
declare class SwordSoulTulu
{
	ItemIId: number;
	LevelId: number;
	constructor(data?);
}
declare class C2SSwordSoulResolveQuality
{
	Quality: Array<number>;
	AutoResolve: number;
	constructor(data?);
}
declare class S2CSwordSoulResolveQuality
{
	Tag: number;
	Quality: Array<number>;
	AutoResolve: number;
	constructor(data?);
}
declare class C2SSwordSoulDisassemble
{
	ItemIds: Array<string>;
	constructor(data?);
}
declare class S2CSwordSoulDisassemble
{
	Tag: number;
	ItemIds: Array<string>;
	constructor(data?);
}
declare class C2SGetYJFBData
{
	constructor(data?);
}
declare class S2CGetYJFBData
{
	Tag: number;
	Fb: Array<SimYJFB>;
	constructor(data?);
}
declare class SimYJFB
{
	FuBenId: number;
	Gq: Array<SimGuanQia>;
	constructor(data?);
}
declare class SimGuanQia
{
	FuBenId: number;
	GuanQiaId: number;
	GuanQiaState: number;
	TriEventNum: number;
	AllEventNum: number;
	FirstPass: number;
	constructor(data?);
}
declare class C2SGetYJFBGuanQiaData
{
	FuBenId: number;
	GuanQiaId: number;
	constructor(data?);
}
declare class S2CGetYJFBGuanQiaData
{
	Tag: number;
	FuBenId: number;
	GuanQiaId: number;
	GuanQiaState: number;
	Grids: Array<YJFBGrid>;
	PlayerGrid: YJFBGrid ;
	YJFBHelper: Array<YJFBHelper>;
	constructor(data?);
}
declare class YJFBGrid
{
	X: number;
	Y: number;
	State: number;
	Kind: number;
	EventId: number;
	FaceRes: number;
	Param: number;
	EventType: number;
	constructor(data?);
}
declare class C2SYJFBGuanQiaMove
{
	FuBenId: number;
	GuanQiaId: number;
	TargetGrid: YJFBGrid ;
	constructor(data?);
}
declare class S2CYJFBGuanQiaMove
{
	Tag: number;
	FuBenId: number;
	GuanQiaId: number;
	MovePath: Array<MoveYJFBGrid>;
	constructor(data?);
}
declare class MoveYJFBGrid
{
	MoveGrid: YJFBGrid ;
	NewVisibleGrid: Array<YJFBGrid>;
	constructor(data?);
}
declare class C2SYJFBGuanQiaTriggerEvent
{
	FuBenId: number;
	GuanQiaId: number;
	TriggerGrid: YJFBGrid ;
	constructor(data?);
}
declare class S2CYJFBGuanQiaTriggerEvent
{
	Tag: number;
	FuBenId: number;
	GuanQiaId: number;
	TriggerGrid: YJFBGrid ;
	TriEventNum: number;
	YJFBHelper: Array<YJFBHelper>;
	constructor(data?);
}
declare class YJFBHelper
{
	X: number;
	Y: number;
	constructor(data?);
}
declare class C2SYJFBSweep
{
	FuBenId: number;
	GuanQiaId: number;
	constructor(data?);
}
declare class S2CYJFBSweep
{
	Tag: number;
	constructor(data?);
}
declare class C2SYJFBExchangeTiLi
{
	constructor(data?);
}
declare class S2CYJFBExchangeTiLi
{
	Tag: number;
	constructor(data?);
}
declare class S2CYJFBOutQuanQia
{
	Tag: number;
	constructor(data?);
}
declare class C2SYJFBAutoUseJuShenDan
{
	Use: number;
	constructor(data?);
}
declare class S2CYJFBAutoUseJuShenDan
{
	Tag: number;
	constructor(data?);
}
declare class S2CYJFBFirstPass
{
	Tag: number;
	FuBenId: number;
	GuanQiaId: number;
	IsFirstPass: number;
	constructor(data?);
}
declare class S2CWareHouseAdd
{
	WhId: number;
	Items: Array<ItemData>;
	constructor(data?);
}
declare class C2SWareHouseGetInfo
{
	WhId: number;
	constructor(data?);
}
declare class S2CWareHouseGetInfo
{
	Tag: number;
	WhId: number;
	Items: Array<ItemData>;
	constructor(data?);
}
declare class C2SWareHouseReceiveItem
{
	WhId: number;
	constructor(data?);
}
declare class S2CWareHouseReceiveItem
{
	Tag: number;
	WhId: number;
	constructor(data?);
}
declare class C2SWareHousePartReceive
{
	WhId: number;
	ItemIds: Array<number>;
	constructor(data?);
}
declare class S2CWareHousePartReceive
{
	Tag: number;
	WhId: number;
	constructor(data?);
}
declare class C2SFeiShengStageUp
{
	Type: number;
	constructor(data?);
}
declare class S2CFeiShengStageUp
{
	Type: number;
	Tag: number;
	constructor(data?);
}
declare class PlayerKingEquip
{
	Id: number;
	KingEquipData: Array<KingEquipData>;
	SuitLev: number;
	CollectId: number;
	LifePos: number;
	LifeLev: number;
	KingWingData: Array<KingWingData>;
	WingStar: number;
	constructor(data?);
}
declare class KingEquipData
{
	Pos: number;
	SItemId: string ;
	constructor(data?);
}
declare class KingWingData
{
	Pos: number;
	SItemId: string ;
	constructor(data?);
}
declare class C2SGetKingEquipData
{
	constructor(data?);
}
declare class S2CGetKingEquipData
{
	PlayerKingEquip: Array<PlayerKingEquip>;
	constructor(data?);
}
declare class C2SOneKeyKingEquipWear
{
	Id: number;
	constructor(data?);
}
declare class S2COneKeyKingEquipWear
{
	Tag: number;
	Id: number;
	constructor(data?);
}
declare class C2SKingEquipWear
{
	Id: number;
	Pos: number;
	constructor(data?);
}
declare class S2CKingEquipWear
{
	Tag: number;
	Id: number;
	Pos: number;
	constructor(data?);
}
declare class C2SKingSuitHuanHua
{
	Id: number;
	constructor(data?);
}
declare class S2CKingSuitHuanHua
{
	Tag: number;
	Id: number;
	constructor(data?);
}
declare class C2SKingLifeLev
{
	Id: number;
	constructor(data?);
}
declare class S2CKingLifeLev
{
	Tag: number;
	Id: number;
	constructor(data?);
}
declare class C2SOneKeyJadeWear
{
	Id: number;
	constructor(data?);
}
declare class S2COneKeyJadeWear
{
	Tag: number;
	Id: number;
	constructor(data?);
}
declare class C2SKingWingHuanHua
{
	Id: number;
	constructor(data?);
}
declare class S2CKingWingHuanHua
{
	Tag: number;
	Id: number;
	constructor(data?);
}
declare class C2SKingWingStar
{
	Id: number;
	constructor(data?);
}
declare class S2CKingWingStar
{
	Tag: number;
	Id: number;
	constructor(data?);
}
declare class C2SKingEquipCompose
{
	ItemId: number;
	ItemIds1: string ;
	ItemIds2: string ;
	ItemIds3: string ;
	constructor(data?);
}
declare class S2CKingEquipCompose
{
	Tag: number;
	ItemId: number;
	SItemId: string ;
	constructor(data?);
}
declare class MiJingBossInfo
{
	LayerId: number;
	BossId: number;
	CurrHp: number;
	MaxHP: number;
	BossOwner: MiJingBossOwnerData ;
	State: number;
	ReliveTimestamp: number;
	BossLockBloodTime: number;
	BoxUniqueId: number;
	BoxExpireTimestamp: number;
	BoxUserId: number;
	constructor(data?);
}
declare class C2SMiJingBossInfo
{
	constructor(data?);
}
declare class S2CMiJingBossInfo
{
	Items: Array<MiJingBossInfo>;
	constructor(data?);
}
declare class C2SBossMiJingJoinScene
{
	LayerId: number;
	constructor(data?);
}
declare class S2CBossMiJingJoinScene
{
	Tag: number;
	LayerId: number;
	constructor(data?);
}
declare class C2SBossMiJingLeaveScene
{
	LayerId: number;
	constructor(data?);
}
declare class S2CBossMiJingLeaveScene
{
	Tag: number;
	LayerId: number;
	constructor(data?);
}
declare class MiJingBossDamage
{
	User: ShowUserInfo ;
	DamageTime: number;
	Damage: number;
	constructor(data?);
}
declare class C2SMiJingBossDamageRank
{
	LayerId: number;
	BossId: number;
	constructor(data?);
}
declare class S2CMiJingBossDamageRank
{
	LayerId: number;
	BossId: number;
	Items: Array<MiJingBossDamage>;
	constructor(data?);
}
declare class S2CMiJingBossDamageMy
{
	LayerId: number;
	BossId: number;
	MyDamage: number;
	constructor(data?);
}
declare class MiJingBossOwnerData
{
	User: ShowUserInfo ;
	Hp: number;
	constructor(data?);
}
declare class S2CMiJingBossOwner
{
	LayerId: number;
	BossId: number;
	Data: MiJingBossOwnerData ;
	constructor(data?);
}
declare class C2SBossMiJingAutoFight
{
	Auto: number;
	constructor(data?);
}
declare class C2SMiJingBossOpenBox
{
	LayerId: number;
	BossId: number;
	OpenType: number;
	constructor(data?);
}
declare class S2CMiJingBossOpenBox
{
	Tag: number;
	OpenType: number;
	BoxInfo: S2CMiJingBossBoxInfo ;
	constructor(data?);
}
declare class C2SMiJingBossBoxInfo
{
	LayerId: number;
	BossId: number;
	constructor(data?);
}
declare class S2CMiJingBossBoxInfo
{
	LayerId: number;
	BossId: number;
	ExpireTimestamp: number;
	OpenTimes: number;
	TotalOpenTimes: number;
	UniqueId: number;
	BoxUserId: number;
	constructor(data?);
}
declare class C2SMiJingFocusBoss
{
	LayerId: number;
	BossId: number;
	State: number;
	constructor(data?);
}
declare class S2CMiJingFocusBoss
{
	Tag: number;
	LayerId: number;
	BossId: number;
	State: number;
	constructor(data?);
}
declare class MiJingBossFocusInfo
{
	LayerId: number;
	BossId: number;
	State: number;
	constructor(data?);
}
declare class C2SMiJingBossFocusInfo
{
	LayerId: number;
	constructor(data?);
}
declare class S2CMiJingBossFocusInfo
{
	LayerId: number;
	Items: Array<MiJingBossFocusInfo>;
	constructor(data?);
}
declare class FaZhengData
{
	Id: number;
	Level: number;
	Stage: number;
	constructor(data?);
}
declare class S2CFaZhengData
{
	List: Array<FaZhengData>;
	constructor(data?);
}
declare class C2SFaZhengLevelUp
{
	Id: number;
	constructor(data?);
}
declare class S2CFaZhengLevelUp
{
	Tag: number;
	Id: number;
	Level: number;
	constructor(data?);
}
declare class C2SFaZhengStageUp
{
	Id: number;
	constructor(data?);
}
declare class S2CFaZhengStageUp
{
	Tag: number;
	Id: number;
	Stage: number;
	constructor(data?);
}
declare class HelperCfg
{
	Id: number;
	FuncId: number;
	CfgParam: Array<number>;
	ServeryCfgParam: Array<number>;
	constructor(data?);
}
declare class HelperLog
{
	Id: number;
	FuncId: number;
	Time: number;
	State: number;
	CostMode: number;
	CostItemId: number;
	CostItemNum: number;
	SubName: string ;
	Val1: number;
	Val2: number;
	World: string ;
	constructor(data?);
}
declare class C2SGetHelperCfg
{
	constructor(data?);
}
declare class S2CGetHelperCfg
{
	Cfg: Array<HelperCfg>;
	constructor(data?);
}
declare class C2SStartHelper
{
	Cfg: Array<HelperCfg>;
	constructor(data?);
}
declare class S2CStartHelper
{
	Tag: number;
	constructor(data?);
}
declare class C2SStopHelper
{
	constructor(data?);
}
declare class S2CStopHelper
{
	Tag: number;
	TagP: string ;
	constructor(data?);
}
declare class C2SGetHelperNext
{
	constructor(data?);
}
declare class S2CGetHelperNext
{
	Tag: number;
	Cfg: HelperCfg ;
	constructor(data?);
}
declare class C2SGetHelperLog
{
	constructor(data?);
}
declare class S2CGetHelperLog
{
	Tag: number;
	HelperLog: Array<HelperLog>;
	constructor(data?);
}
declare class C2SMpFocusReward
{
	ActId: number;
	constructor(data?);
}
declare class S2CMpFocusReward
{
	Tag: number;
	constructor(data?);
}
declare class C2SBindPhoneReward
{
	ActId: number;
	constructor(data?);
}
declare class S2CBindPhoneReward
{
	Tag: number;
	constructor(data?);
}
declare class C2SGetMpFocusInfo
{
	AppId: number;
	ChannelId: number;
	constructor(data?);
}
declare class S2CGetMpFocusInfo
{
	Tag: number;
	ActId: number;
	AppId: number;
	ChannelId: number;
	Type: number;
	ImgName: string ;
	MpName: string ;
	ImgReward: Array<ItemInfo>;
	Desc: string ;
	constructor(data?);
}
declare class C2SGetBindPhoneInfo
{
	AppId: number;
	ChannelId: number;
	constructor(data?);
}
declare class S2CGetBindPhoneInfo
{
	Tag: number;
	ActId: number;
	AppId: number;
	ChannelId: number;
	ImgReward: Array<ItemInfo>;
	ImgName: string ;
	constructor(data?);
}
declare class C2SAuthPoliteGetPrize
{
	ActId: number;
	constructor(data?);
}
declare class S2CAuthPoliteGetPrize
{
	Tag: number;
	constructor(data?);
}
declare class C2SWorldLevelInfo
{
	constructor(data?);
}
declare class S2CWorldLevelInfo
{
	WorldLevelOfToday: number;
	WorldLevelOfWeek: number;
	SWorldLevelOfToday: number;
	SWorldLevelOfWeek: number;
	constructor(data?);
}
declare class C2SFamilyJJCAdd
{
	UserId: number;
	Pos: number;
	constructor(data?);
}
declare class S2CFamilyJJCAdd
{
	Tag: number;
	constructor(data?);
}
declare class FamilyTeamMember
{
	UserId: number;
	A: Array<IntAttr>;
	B: Array<StrAttr>;
	constructor(data?);
}
declare class FamillyJJCRankItem
{
	Name: string ;
	Score: number;
	World: string ;
	constructor(data?);
}
declare class C2SGetFamilyJJCData
{
	constructor(data?);
}
declare class S2CGetFamilyJJCData
{
	Tag: number;
	constructor(data?);
}
declare class C2SFamilyJJCRank
{
	constructor(data?);
}
declare class S2CFamilyJJCRank
{
	Player: Array<FamillyJJCRankItem>;
	Family: Array<FamillyJJCRankItem>;
	PlayerScore: number;
	PlayerRank: number;
	FamilyScore: number;
	FamilyRank: number;
	constructor(data?);
}
declare class S2CFamilyJJCState
{
	state: number;
	constructor(data?);
}
declare class S2CFamilyJJCData
{
	Member: Array<FamilyTeamMember>;
	State: Array<number>;
	constructor(data?);
}
declare class C2SFamilyJJCBuyTimes
{
	constructor(data?);
}
declare class S2CFamilyJJCBuyTimes
{
	Tag: number;
	constructor(data?);
}
declare class C2SFamilyJJCRecieveAward
{
	Id: number;
	constructor(data?);
}
declare class S2CFamilyJJCRecieveAward
{
	Tag: number;
	constructor(data?);
}
declare class C2SFamilyJJCJoin
{
	constructor(data?);
}
declare class S2CFamilyJJCJoin
{
	Tag: number;
	Self: Array<FamilyTeamMember>;
	Enemy: Array<FamilyTeamMember>;
	SelfSymbolId: number;
	TargetSymbolId: number;
	constructor(data?);
}
declare class C2SFamilyJJCFight
{
	UserId: Array<number>;
	constructor(data?);
}
declare class S2CFamilyJJCFight
{
	Tag: number;
	constructor(data?);
}
declare class C2SFamilyJJCGetBuyInfo
{
	constructor(data?);
}
declare class S2CFamilyJJCGetBuyInfo
{
	Coin: number;
	CoinType: number;
	LeftTimes: number;
	constructor(data?);
}
declare class FeedBack
{
	MsgId: string ;
	Type: number;
	Msg: string ;
	ReplyMsg: string ;
	State: number;
	constructor(data?);
}
declare class C2SGetFeedBack
{
	constructor(data?);
}
declare class S2CGetFeedBack
{
	Tag: number;
	Data: Array<FeedBack>;
	constructor(data?);
}
declare class C2SNewFeedBack
{
	Type: number;
	Msg: string ;
	constructor(data?);
}
declare class S2CNewFeedBack
{
	Tag: number;
	constructor(data?);
}
declare class C2SReadFeedBack
{
	constructor(data?);
}
declare class C2SAppRatingState
{
	constructor(data?);
}
declare class S2CAppRatingState
{
	OpenState: number;
	Title: string ;
	constructor(data?);
}
declare class C2SAppRatingOp
{
	Op: number;
	Msg: string ;
	constructor(data?);
}
declare class S2CAppRatingOp
{
	Tag: number;
	constructor(data?);
}
declare class C2SAppRatingGetPrize
{
	constructor(data?);
}
declare class S2CAppRatingGetPrize
{
	Tag: number;
	constructor(data?);
}
declare class PlayerHeroDevelop
{
	Id: number;
	Quality: number;
	Star: number;
	Lev: number;
	GradeLev: number;
	LevExp: number;
	ActiveSkills: Array<Skill>;
	PassiveSkills: Array<Skill>;
	constructor(data?);
}
declare class C2SGetHeroList
{
	constructor(data?);
}
declare class S2CGetHeroList
{
	HeroDevelopData: Array<PlayerHeroDevelop>;
	constructor(data?);
}
declare class C2SHeroActive
{
	Id: number;
	constructor(data?);
}
declare class S2CHeroActive
{
	Tag: number;
	Id: number;
	constructor(data?);
}
declare class C2SHeroIntoBattle
{
	Id: number;
	constructor(data?);
}
declare class S2CHeroIntoBattle
{
	Tag: number;
	Id: number;
	constructor(data?);
}
declare class C2SGetHeroInfo
{
	Id: number;
	constructor(data?);
}
declare class S2CGetHeroInfo
{
	Tag: number;
	Data: PlayerHeroDevelop ;
	constructor(data?);
}
declare class C2SHeroLevelUp
{
	Id: number;
	Level: number;
	constructor(data?);
}
declare class S2CHeroLevelUp
{
	Tag: number;
	constructor(data?);
}
declare class C2SHeroStarUp
{
	Id: number;
	constructor(data?);
}
declare class S2CHeroStarUp
{
	Tag: number;
	HeroId: number;
	QualityUp: number;
	constructor(data?);
}
declare class C2SHeroGradeLevUp
{
	Id: number;
	constructor(data?);
}
declare class S2CHeroGradeLevUp
{
	Tag: number;
	constructor(data?);
}
declare class C2SHeroSkillLevelUp
{
	HeroId: number;
	SkillId: number;
	constructor(data?);
}
declare class S2CHeroSkillLevelUp
{
	Tag: number;
	constructor(data?);
}
declare class PlayerHeroAchi
{
	AchiId: number;
	Count: number;
	Receive: number;
	constructor(data?);
}
declare class PlayerHeroBond
{
	BondId: number;
	Lev: number;
	LevExp: number;
	SpeSkill: Skill ;
	GroupSkillLev: number;
	constructor(data?);
}
declare class C2SGetHeroBondInfo
{
	BondId: number;
	constructor(data?);
}
declare class S2CGetHeroBondInfo
{
	Tag: number;
	BondId: number;
	HeroDevelopData: Array<PlayerHeroDevelop>;
	Lev: number;
	LevExp: number;
	SpeSkill: Skill ;
	GroupSkillLev: number;
	constructor(data?);
}
declare class C2SGetHeroGroupSkill
{
	BondId: number;
	constructor(data?);
}
declare class S2CGetHeroGroupSkill
{
	BondId: number;
	SkillLevel: number;
	constructor(data?);
}
declare class C2SGetHeroAchiList
{
	BondId: number;
	constructor(data?);
}
declare class S2CGetHeroAchiList
{
	BondId: number;
	HeroAchiList: Array<PlayerHeroAchi>;
	constructor(data?);
}
declare class C2SHeroGroupSkillLevelUp
{
	BondId: number;
	constructor(data?);
}
declare class S2CHeroGroupSkillLevelUp
{
	Tag: number;
	constructor(data?);
}
declare class C2SHeroBondLevelUp
{
	BondId: number;
	Level: number;
	constructor(data?);
}
declare class S2CHeroBondLevelUp
{
	Tag: number;
	constructor(data?);
}
declare class C2SHeroBondSpeLevelUp
{
	BondId: number;
	constructor(data?);
}
declare class S2CHeroBondSpeLevelUp
{
	Tag: number;
	constructor(data?);
}
declare class C2SGetHeroAchiPrize
{
	AchiId: number;
	constructor(data?);
}
declare class S2CGetHeroAchiPrize
{
	Tag: number;
	constructor(data?);
}
declare class S2CSendHeroAchi
{
	HeroBond: PlayerHeroAchi ;
	constructor(data?);
}
declare class C2SHeroSkillInfo
{
	HeroId: number;
	constructor(data?);
}
declare class S2CHeroSkillInfo
{
	Tag: number;
	HeroId: number;
	Skills: Array<Skill>;
	constructor(data?);
}
declare class C2SCrossMessage
{
	SendId: number;
	UserId: number;
	MapId: number;
	Order: number;
	Receiver: Array<number>;
	Body: number;
	constructor(data?);
}
declare class J2CFightInit
{
	Tag: number;
	Report: S2CBattlefieldReport ;
	Prize: Array<ItemInfo>;
	MyDamage: number;
	constructor(data?);
}
declare class J2CYJFightInit
{
	Tag: number;
	Report: S2CBattlefieldReport ;
	Prize: Array<ItemInfo>;
	MyDamage: number;
	constructor(data?);
}
declare class C2STtBossActInfo
{
	constructor(data?);
}
declare class S2CTtBossActInfo
{
	StageId: number;
	EndTimestamp: number;
	constructor(data?);
}
declare class S2CTtBossFightBoss
{
	StageId: number;
	BossId: number;
	constructor(data?);
}
declare class TtBossInfo
{
	StageId: number;
	BossId: number;
	State: number;
	CurrHp: number;
	MaxHP: number;
	BossOwner: TtBossOwnerData ;
	BossLockBloodTime: number;
	constructor(data?);
}
declare class S2CTtBossInfo
{
	Items: Array<TtBossInfo>;
	constructor(data?);
}
declare class TtBossOwnerData
{
	OwnerLeader: ShowUserInfo ;
	OwnerDamage: number;
	MyDamage: number;
	constructor(data?);
}
declare class S2CTtBossFightEndReport
{
	Stage: number;
	MyNum: number;
	FirstTotalNum: number;
	MyTotalNum: number;
	MyRank: number;
	constructor(data?);
}
declare class TtBossTeamData
{
	Leader: ShowUserInfo ;
	TeamOrder: number;
	TeamData: number;
	constructor(data?);
}
declare class C2STtBossTeamDataRank
{
	StageId: number;
	BossId: number;
	constructor(data?);
}
declare class S2CTtBossTeamDataRank
{
	StageId: number;
	BossId: number;
	Items: Array<TtBossTeamData>;
	MyTeamOrder: number;
	MyTeamData: number;
	constructor(data?);
}
declare class C2STtBossInspire
{
	constructor(data?);
}
declare class S2CTtBossInspire
{
	Tag: number;
	TeamId: number;
	TeamInspireId: number;
	constructor(data?);
}
declare class S2CTtBossCloseScene
{
	constructor(data?);
}
declare class S2CTtBossActEnd
{
	AuctionOpen: number;
	constructor(data?);
}
declare class C2SAllAucSimData
{
	constructor(data?);
}
declare class S2CAllAucSimData
{
	List: Array<AucSimData>;
	constructor(data?);
}
declare class AucSimData
{
	AucId: number;
	State: number;
	constructor(data?);
}
declare class C2SAuctionInfo
{
	AucId: number;
	constructor(data?);
}
declare class S2CAuctionInfo
{
	Tag: number;
	AucId: number;
	EndTimestamp: number;
	GoodsList: Array<AucGoodsData>;
	constructor(data?);
}
declare class AucGoodsData
{
	GoodsId: number;
	State: number;
	Bid: number;
	BidUserId: number;
	constructor(data?);
}
declare class S2CAucGoodsList
{
	AucId: number;
	GoodsList: Array<AucGoodsData>;
	constructor(data?);
}
declare class C2SBidding
{
	AucId: number;
	GoodsId: number;
	BidType: number;
	constructor(data?);
}
declare class S2CBidding
{
	Tag: number;
	AucId: number;
	GoodsId: number;
	BidType: number;
	TagStr: string ;
	constructor(data?);
}
declare class C2SGetBiddingLog
{
	AucId: number;
	constructor(data?);
}
declare class BiddingLogItem
{
	Time: number;
	GoodsId: number;
	BidPrice: number;
	UserId: number;
	LogType: number;
	constructor(data?);
}
declare class S2CGetBiddingLog
{
	AucId: number;
	Logs: Array<BiddingLogItem>;
	constructor(data?);
}
declare class C2SAuctionBeOvertaken
{
	AucId: number;
	BeOvertaken: number;
	constructor(data?);
}
declare class FristMergeInfo
{
	Id: number;
	Num: number;
	constructor(data?);
}
declare class C2SMergeFirstPrize
{
	constructor(data?);
}
declare class S2CMergeFirstPrize
{
	Items: Array<FristMergeInfo>;
	constructor(data?);
}
declare class C2SMergeFirstGetPrize
{
	FuncId: number;
	constructor(data?);
}
declare class S2CMergeFirstGetPrize
{
	Tag: number;
	info: FristMergeInfo ;
	constructor(data?);
}
declare class C2SSZInfo
{
	constructor(data?);
}
declare class S2CSZInfo
{
	Tag: number;
	Term: number;
	PrepareStartTime: number;
	PrepareEndTime: number;
	StartTime: number;
	EndTime: number;
	OutlandFinishTime: number;
	InnerlandFinishTime: number;
	OutlandZoneStartTime: number;
	OutlandZoneFinishTime: number;
	InnerlandZoneStartTime: number;
	InnerlandZoneFinishTime: number;
	OutlandZonePrepareFinishTime: number;
	InnerlandZonePrepareFinishTime: number;
	Group: number;
	MaxOpenNum: number;
	constructor(data?);
}
declare class C2SShenYuData
{
	constructor(data?);
}
declare class S2CShenYuData
{
	Season: number;
	FirstReward: number;
	Tag: number;
	constructor(data?);
}
declare class S2CSZPrepare
{
	Tag: number;
	constructor(data?);
}
declare class C2JSZOtherInfo
{
	UserId: number;
	constructor(data?);
}
declare class J2CSZShenShou
{
	ShenShou: number;
	Camp: number;
	constructor(data?);
}
declare class C2JSZStartDropBuilding
{
	SzState: number;
	Block: number;
	constructor(data?);
}
declare class J2CSZStartDropBuilding
{
	Tag: number;
	SzState: number;
	Block: number;
	DropTime: number;
	constructor(data?);
}
declare class C2JSZStopDropBuilding
{
	SzState: number;
	Block: number;
	constructor(data?);
}
declare class J2CSZStopDropBuilding
{
	Tag: number;
	SzState: number;
	Block: number;
	constructor(data?);
}
declare class C2JSZDropBuilding
{
	SzState: number;
	Block: number;
	constructor(data?);
}
declare class J2CSZDropBuilding
{
	Tag: number;
	SzState: number;
	Block: number;
	constructor(data?);
}
declare class C2JSZOpenView
{
	View: number;
	constructor(data?);
}
declare class C2SEnterShenYu
{
	constructor(data?);
}
declare class S2CEnterShenYu
{
	Tag: number;
	State: number;
	Center: number;
	Block: number;
	Camp: number;
	Time: number;
	ZoneState: number;
	Term: number;
	WorldLevel: number;
	GuideState: number;
	BuildingNumber: number;
	Timestamp: number;
	constructor(data?);
}
declare class C2SLeaveShenYu
{
	constructor(data?);
}
declare class S2CLeaveShenYu
{
	Tag: number;
	constructor(data?);
}
declare class C2SShenYuFirstJoinAward
{
	constructor(data?);
}
declare class S2CShenYuFirstJoinAward
{
	Tag: number;
	constructor(data?);
}
declare class C2SGuideState
{
	Index: number;
	constructor(data?);
}
declare class S2CGuideState
{
	Tag: number;
	GuideState: number;
	constructor(data?);
}
declare class C2SGuideBattle
{
	constructor(data?);
}
declare class C2SShenYuTriggerEnterMapEvent
{
	constructor(data?);
}
declare class C2JSZBlocks
{
	State: number;
	Center: number;
	constructor(data?);
}
declare class J2CSZBlocks
{
	Tag: number;
	State: number;
	Center: number;
	Blocks: number;
	Occupys: Array<SZOccupy>;
	Players: Array<SZPlayerMap>;
	constructor(data?);
}
declare class C2JSZOwnBuildings
{
	SzState: number;
	constructor(data?);
}
declare class J2CSZOwnBuildings
{
	Tag: number;
	SzState: number;
	Buildings: Array<SZOccupy>;
	constructor(data?);
}
declare class J2CSZOwnBlocks
{
	Tag: number;
	SzState: number;
	Blocks: Array<number>;
	constructor(data?);
}
declare class C2JSZOccupyBlock
{
	SzState: number;
	Block: number;
	Owner: number;
	constructor(data?);
}
declare class J2CSZOccupyBlock
{
	Tag: number;
	SzState: number;
	Block: number;
	Building: number;
	constructor(data?);
}
declare class J2CSZLoseBlock
{
	Tag: number;
	SzState: number;
	Block: number;
	Building: number;
	constructor(data?);
}
declare class SZOccupy
{
	Block: number;
	Protect: number;
	UserId: number;
	MineTime: number;
	Head: number;
	DropTime: number;
	BlockType: number;
	MinerId: number;
	HeadFrame: number;
	Nick: string ;
	AreaId: number;
	Xianzong: string ;
	Camp: number;
	WorldName: string ;
	LoginMergeAreaId: number;
	MergeWorldName: string ;
	constructor(data?);
}
declare class PlayerShow
{
	A: Array<IntAttr>;
	B: Array<StrAttr>;
	constructor(data?);
}
declare class C2JSZBuildings
{
	SzState: number;
	Blocks: Array<number>;
	constructor(data?);
}
declare class J2CSZBuildings
{
	Tag: number;
	SzState: number;
	Blocks: Array<SZOccupy>;
	Drops: Array<number>;
	constructor(data?);
}
declare class C2JSZBuilding
{
	SzState: number;
	Block: number;
	constructor(data?);
}
declare class J2CSZBuilding
{
	Tag: number;
	SzState: number;
	Block: SZOccupy ;
	show: PlayerShow ;
	Hp: number;
	RecoverTime: number;
	MaxHp: number;
	Attacked: number;
	Garrison: number;
	Monster: number;
	Rewarded: number;
	constructor(data?);
}
declare class C2SSZMine
{
	SzState: number;
	Block: number;
	Pet: string ;
	FuncId: number;
	constructor(data?);
}
declare class J2CSZMine
{
	Tag: number;
	SzState: number;
	Block: SZOccupy ;
	Pet: string ;
	constructor(data?);
}
declare class C2JSZSettlement
{
	SzState: number;
	constructor(data?);
}
declare class J2CSZSettlement
{
	Tag: number;
	SzState: number;
	Prize: Array<ItemInfo>;
	constructor(data?);
}
declare class C2JSZPet
{
	SzState: number;
	constructor(data?);
}
declare class J2CSZPet
{
	Tag: number;
	SzState: number;
	Pets: Array<string>;
	constructor(data?);
}
declare class C2JSZMap
{
	SzState: number;
	constructor(data?);
}
declare class J2CSZMap
{
	Tag: number;
	Blocks: number;
	BlockNumber: number;
	OccupyBlockNumber: number;
	BuildingNumber: Array<IntAttr>;
	OccupyBuildingNumber: Array<IntAttr>;
	constructor(data?);
}
declare class J2CSZState
{
	SzState: number;
	ZoneState: number;
	constructor(data?);
}
declare class C2JSZOther
{
	UserId: number;
	constructor(data?);
}
declare class J2CSZOther
{
	Tag: number;
	show: PlayerShow ;
	constructor(data?);
}
declare class J2CSZUserBag
{
	Bag: RoleBag ;
	constructor(data?);
}
declare class J2CSZBagChange
{
	Change: Array<BagChange>;
	constructor(data?);
}
declare class J2CSZNewItem
{
	Change: Array<BagChange>;
	constructor(data?);
}
declare class C2JSZRemItemNew
{
	ItemId: string ;
	constructor(data?);
}
declare class J2CSZRemItemNew
{
	Tag: number;
	ItemId: string ;
	constructor(data?);
}
declare class C2JSZExchange
{
	ItemID: string ;
	Count: number;
	Param1: number;
	constructor(data?);
}
declare class J2CSZExchange
{
	Tag: number;
	constructor(data?);
}
declare class C2JSZShenWei
{
	ShenWei: number;
	constructor(data?);
}
declare class J2CSZShenWei
{
	Tag: number;
	ShenWei: number;
	Prize: Array<ItemInfo>;
	constructor(data?);
}
declare class J2CSZTask
{
	T: Array<SZTask>;
	constructor(data?);
}
declare class J2CSZTaskChange
{
	T: Array<SZTask>;
	constructor(data?);
}
declare class J2CSZStateTask
{
	T: Array<SZTask>;
	constructor(data?);
}
declare class J2CSZStateTaskChange
{
	T: Array<SZTask>;
	constructor(data?);
}
declare class J2CSZMainTask
{
	T: Array<SZTask>;
	constructor(data?);
}
declare class J2CSZMainTaskChange
{
	T: Array<SZTask>;
	constructor(data?);
}
declare class SZTask
{
	TaskId: number;
	T: number;
	S: number;
	I: number;
	constructor(data?);
}
declare class C2JSZGetTaskPrize
{
	TaskId: number;
	constructor(data?);
}
declare class J2CSZGetTaskPrize
{
	Tag: number;
	TaskId: number;
	Prize: Array<ItemInfo>;
	constructor(data?);
}
declare class C2JSZGetStatePrize
{
	SzState: number;
	constructor(data?);
}
declare class J2CSZGetStatePrize
{
	Tag: number;
	SzState: number;
	Prize: Array<ItemInfo>;
	constructor(data?);
}
declare class C2JSZGetMainPrize
{
	TaskId: number;
	constructor(data?);
}
declare class J2CSZGetMainPrize
{
	Tag: number;
	TaskId: number;
	Prize: Array<ItemInfo>;
	constructor(data?);
}
declare class J2CSZRelogin
{
	constructor(data?);
}
declare class J2CSZStrength
{
	Strength: number;
	RecoverTime: number;
	constructor(data?);
}
declare class J2CSZBuff
{
	BuffId: number;
	ExpireTime: number;
	Value: number;
	constructor(data?);
}
declare class J2CSZBuffs
{
	Buffs: Array<J2CSZBuff>;
	constructor(data?);
}
declare class SZPlayerShow
{
	UserId: number;
	Nick: string ;
	RoleId: number;
	GodLevel: number;
	AreaId: number;
	Head: number;
	HeadFrame: number;
	ChatFrame: number;
	Title: number;
	VIP: number;
	Xianzong: string ;
	Camp: number;
	WorldName: string ;
	LoginMergeAreaId: number;
	MergeWorldName: string ;
	HideVIP: number;
	constructor(data?);
}
declare class SZRanking
{
	Sort: number;
	Name: string ;
	Camp: number;
	RankValue: number;
	Show: SZPlayerShow ;
	UserId: number;
	Xianzong: number;
	AreaId: number;
	WorldName: string ;
	LoginMergeAreaId: number;
	MergeWorldName: string ;
	constructor(data?);
}
declare class C2JSZRanking
{
	RankingId: number;
	Start: number;
	Length: number;
	constructor(data?);
}
declare class J2CSZRanking
{
	RankingId: number;
	Ranking: Array<SZRanking>;
	Index: number;
	Count: number;
	RankingPrize: number;
	constructor(data?);
}
declare class C2JSZGetRankingPrize
{
	RankingId: number;
	constructor(data?);
}
declare class J2CSZGetRankingPrize
{
	Tag: number;
	RankingId: number;
	Prize: Array<ItemInfo>;
	constructor(data?);
}
declare class J2CSZShenshouRanking
{
	Ranking: Array<SZRanking>;
	constructor(data?);
}
declare class J2CSZShenshouDamage
{
	Ranking: SZRanking ;
	constructor(data?);
}
declare class J2CSZMyShenshouDamage
{
	Damage: number;
	constructor(data?);
}
declare class J2CSZChat
{
	Tag: number;
	ChannelId: number;
	Content: string ;
	Show: SZPlayerShow ;
	AtUserShowAreaId: number;
	AtUserNick: string ;
	AtUserId: number;
	AtUserWorldName: string ;
	AtUserLoginMergeAreaId: number;
	AtUserMergeWorldName: string ;
	constructor(data?);
}
declare class C2JSZChats
{
	ChannelId: number;
	constructor(data?);
}
declare class J2CSZChats
{
	chats: Array<J2CSZChat>;
	constructor(data?);
}
declare class SZReports
{
	ReportId: number;
	ReportTplId: number;
	TitleParams: Array<string>;
	ContentParams: Array<string>;
	LeftButtonParams: Array<string>;
	RightButtonParams: Array<string>;
	ReportTime: number;
	IsRead: number;
	constructor(data?);
}
declare class J2CSZReports
{
	reports: Array<SZReports>;
	constructor(data?);
}
declare class C2JSZReadReport
{
	ReportId: Array<number>;
	constructor(data?);
}
declare class C2JSZDeleteReport
{
	ReportId: Array<number>;
	constructor(data?);
}
declare class C2JSZZoneEnter
{
	ZoneState: number;
	constructor(data?);
}
declare class SZZone
{
	ZoneState: number;
	UserId: number;
	Site: number;
	Sex: number;
	MovingEndTime: number;
	MoveEndTime: number;
	AttackEndTime: number;
	Hp: number;
	Point: number;
	ZoneEndTime: number;
	DieEndTime: number;
	constructor(data?);
}
declare class J2CSZZoneEnter
{
	Tag: number;
	zone: SZZone ;
	constructor(data?);
}
declare class C2JSZZonePlayers
{
	ZoneState: number;
	ZoneSite: number;
	constructor(data?);
}
declare class SZZonePlayer
{
	UserId: number;
	Nick: string ;
	Power: number;
	AreaId: number;
	XianzongName: string ;
	Camp: number;
	Hp: number;
	Sex: number;
	MovingEndTime: number;
	WorldName: string ;
	LoginMergeAreaId: number;
	MergeWorldName: string ;
	LoginAreaId: number;
	constructor(data?);
}
declare class J2CSZZonePlayers
{
	Tag: number;
	players: Array<SZZonePlayer>;
	constructor(data?);
}
declare class C2JSZZoneMove
{
	ZoneState: number;
	TargetSite: number;
	constructor(data?);
}
declare class J2CSZZoneMove
{
	Tag: number;
	player: SZZonePlayer ;
	SrcSite: number;
	TargetSite: number;
	MoveEndTime: number;
	DieEndTime: number;
	constructor(data?);
}
declare class C2JSZZoneAttack
{
	ZoneState: number;
	TargetId: number;
	constructor(data?);
}
declare class J2CSZZoneAttack
{
	Tag: number;
	zone: SZZone ;
	TargetId: number;
	Attack: number;
	constructor(data?);
}
declare class J2CSZZonePlayerNumber
{
	Number: number;
	constructor(data?);
}
declare class SZZoneDamage
{
	AreaId: number;
	XianzongName: string ;
	Camp: number;
	Damage: number;
	DamageTime: number;
	WorldName: string ;
	LoginMergeAreaId: number;
	MergeWorldName: string ;
	Xianzong: number;
	LoginAreaId: number;
	constructor(data?);
}
declare class J2CSZZoneDamageRanking
{
	rankings: Array<SZZoneDamage>;
	RankingType: number;
	constructor(data?);
}
declare class J2CSZZoneDamageRankingChange
{
	ranking: SZZoneDamage ;
	RankingType: number;
	constructor(data?);
}
declare class J2CSZZoneBossOcuppy
{
	BossId: number;
	BossTime: number;
	BossIndex: number;
	BossRefreshTime: number;
	constructor(data?);
}
declare class J2CSZZonePoint
{
	Point: number;
	Add: number;
	Reason: number;
	constructor(data?);
}
declare class J2CSZZoneHp
{
	UserId: number;
	Hp: number;
	constructor(data?);
}
declare class J2CSZAnnouncement
{
	NoticeId: number;
	parameters: Array<string>;
	show: SZPlayerShow ;
	constructor(data?);
}
declare class C2JSZZonePlayerInSiteNumber
{
	ZoneState: number;
	constructor(data?);
}
declare class J2CSZZonePlayerInSiteNumber
{
	Tag: number;
	Numbers: Array<IntAttr>;
	constructor(data?);
}
declare class J2CSZZonePVP
{
	AttackerId: number;
	AttackerCamp: number;
	AttackerHpReduce: number;
	AttackerHp: number;
	Attacker: PlayerShow ;
	DefenderId: number;
	DefenderCamp: number;
	DefenderHpReduce: number;
	DefenderHp: number;
	Defender: PlayerShow ;
	Win: number;
	constructor(data?);
}
declare class C2JSZGetZoneRanking
{
	RankingId: number;
	Start: number;
	Length: number;
	constructor(data?);
}
declare class J2CSZGetZoneRanking
{
	Tag: number;
	RankingId: number;
	Ranking: Array<SZRanking>;
	Index: number;
	Count: number;
	RankingPrize: number;
	Point: number;
	constructor(data?);
}
declare class C2JSZGetZoneRankingPrize
{
	RankingId: number;
	constructor(data?);
}
declare class J2CSZGetZoneRankingPrize
{
	Tag: number;
	RankingId: number;
	Prize: Array<ItemInfo>;
	constructor(data?);
}
declare class J2CSZZoneTask
{
	T: Array<SZTask>;
	constructor(data?);
}
declare class J2CSZZoneTaskChange
{
	T: Array<SZTask>;
	constructor(data?);
}
declare class C2JSZGetZoneTaskPrize
{
	TaskId: number;
	constructor(data?);
}
declare class J2CSZGetZoneTaskPrize
{
	Tag: number;
	TaskId: number;
	Prize: Array<ItemInfo>;
	constructor(data?);
}
declare class J2CSZZoneBossViolentNotify
{
	Time: number;
	constructor(data?);
}
declare class J2CSZZoneBossViolent
{
	constructor(data?);
}
declare class SZPlayerShowDetailed
{
	UserId: number;
	Nick: string ;
	RoleId: number;
	GodLevel: number;
	AreaId: number;
	Head: number;
	HeadFrame: number;
	ChatFrame: number;
	Title: number;
	VIP: number;
	Xianzong: string ;
	Zongzhu: number;
	Power: number;
	Military: number;
	WorldName: string ;
	LoginMergeAreaId: number;
	MergeWorldName: string ;
	HideVIP: number;
	constructor(data?);
}
declare class C2JSZCampMainCity
{
	SzState: number;
	Block: number;
	constructor(data?);
}
declare class J2CSZCampMainCity
{
	Tag: number;
	SzState: number;
	Camp: number;
	PlayerNumber: number;
	XianzongNumber: number;
	BlockNumber: number;
	TotalBlockNumber: number;
	show: Array<SZPlayerShowDetailed>;
	constructor(data?);
}
declare class C2JSZMineInfo
{
	SzState: number;
	constructor(data?);
}
declare class J2CSZMineInfo
{
	Tag: number;
	SzState: number;
	MainCity: number;
	Mine: number;
	constructor(data?);
}
declare class SZPlayerMapShow
{
	UserId: number;
	Nick: string ;
	RoleId: number;
	GodLevel: number;
	AreaId: number;
	Horse: number;
	Skin: number;
	God: number;
	Wing: number;
	WorldName: string ;
	LoginMergeAreaId: number;
	MergeWorldName: string ;
	Xianzong: string ;
	Suit: number;
	constructor(data?);
}
declare class SZPlayerMap
{
	UserId: number;
	position: number;
	constructor(data?);
}
declare class C2JSZPlayerMapShow
{
	UserIds: Array<number>;
	constructor(data?);
}
declare class J2CSZPlayerMapShow
{
	Players: Array<SZPlayerMapShow>;
	constructor(data?);
}
declare class C2JSZShenshouReward
{
	SzState: number;
	Block: number;
	RewardId: number;
	constructor(data?);
}
declare class J2CSZShenshouReward
{
	Tag: number;
	SzState: number;
	RewardId: number;
	Prize: Array<ItemInfo>;
	constructor(data?);
}
declare class C2JSZShenshouRewardInfo
{
	constructor(data?);
}
declare class J2CSZShenshouRewardInfo
{
	Prizes: Array<number>;
	constructor(data?);
}
declare class C2JSZHeart
{
	constructor(data?);
}
declare class J2CSZHeart
{
	Time: number;
	constructor(data?);
}
declare class J2CSZCampBuff
{
	BuffId: number;
	ExpireTime: number;
	Value: number;
	constructor(data?);
}
declare class J2CSZCampBuffs
{
	Buffs: Array<J2CSZBuff>;
	constructor(data?);
}
declare class ShenYuActInfo
{
	ActId: number;
	ActType: number;
	Open: number;
	StartTime: number;
	EndTime: number;
	CloseTime: number;
	constructor(data?);
}
declare class ShenYuActTask
{
	TaskId: number;
	ActId: number;
	Type: number;
	State: number;
	Count: number;
	constructor(data?);
}
declare class J2CSZActInfos
{
	T: Array<ShenYuActInfo>;
	constructor(data?);
}
declare class J2CSZActTaskInfos
{
	T: Array<ShenYuActTask>;
	constructor(data?);
}
declare class J2CSZActTaskChange
{
	T: Array<ShenYuActTask>;
	constructor(data?);
}
declare class C2JSZGetActTaskPrize
{
	ActTaskId: number;
	constructor(data?);
}
declare class J2CSZGetActTaskPrize
{
	Tag: number;
	TaskId: number;
	Prize: Array<ItemInfo>;
	ActId: number;
	constructor(data?);
}
declare class C2JSZActWishRankInfo
{
	ActId: number;
	constructor(data?);
}
declare class J2CSZActWishRankInfo
{
	Tag: number;
	ActId: number;
	MySort: number;
	MyWish: number;
	ReceiveAward: number;
	RankInfo: Array<WishRankInfo>;
	constructor(data?);
}
declare class C2JSZGetActWishRankPrize
{
	ActId: number;
	constructor(data?);
}
declare class J2CSZGetActWishRankPrize
{
	Tag: number;
	ActId: number;
	Prize: Array<ItemInfo>;
	constructor(data?);
}
declare class WishRankInfo
{
	Sort: number;
	AreaId: number;
	Name: string ;
	Camp: number;
	Wish: number;
	WorldName: string ;
	constructor(data?);
}
declare class C2JSZPassCheckInfo
{
	constructor(data?);
}
declare class J2CSZPassCheckInfo
{
	Tag: number;
	BuyTimes: number;
	BuyPrize: number;
	Exp: number;
	T: Array<SZTask>;
	GR: number;
	SR: number;
	buyExp: number;
	constructor(data?);
}
declare class J2CSZPassCheckTaskChange
{
	T: Array<SZTask>;
	constructor(data?);
}
declare class C2JSZGetPassCheckTaskPrize
{
	TaskId: number;
	constructor(data?);
}
declare class J2CSZGetPassCheckTaskPrize
{
	Tag: number;
	TaskId: number;
	Exp: number;
	Prize: Array<ItemInfo>;
	constructor(data?);
}
declare class J2CSZAutoGetPassCheckTaskPrize
{
	TaskId: Array<number>;
	Exp: number;
	Prize: Array<ItemInfo>;
	constructor(data?);
}
declare class C2JSZGetPassCheckPrize
{
	constructor(data?);
}
declare class J2CSZGetPassCheckPrize
{
	Tag: number;
	GR: number;
	SR: number;
	Prize: Array<ItemInfo>;
	constructor(data?);
}
declare class C2JSZGetPassCheckLoopPrize
{
	Step: number;
	constructor(data?);
}
declare class J2CSZGetPassCheckLoopPrize
{
	Step: number;
	LoopLevel: number;
	Prize: Array<ItemInfo>;
	constructor(data?);
}
declare class J2CSZPassCheckBuyTimesUpdate
{
	BuyTimes: number;
	constructor(data?);
}
declare class C2SSZPassCheckBuyLevelExp
{
	LevelExp: number;
	constructor(data?);
}
declare class S2CSZPassCheckBuyLevelExp
{
	Tag: number;
	LevelExp: number;
	constructor(data?);
}
declare class C2JSZLogin
{
	constructor(data?);
}
declare class S2CSZPassCheckBuyTimes
{
	constructor(data?);
}
declare class C2JSZMineRewardInfo
{
	constructor(data?);
}
declare class J2CSZMineRewardInfo
{
	Tag: number;
	Items: Array<ItemInfo>;
	constructor(data?);
}
declare class C2JSZMineReceiveReward
{
	constructor(data?);
}
declare class J2CSZMineReceiveReward
{
	Tag: number;
	Items: Array<ItemInfo>;
	constructor(data?);
}
declare class C2SShenYuHelpReward
{
	constructor(data?);
}
declare class S2CShenYuHelpReward
{
	Reward: Array<number>;
	Tag: number;
	Id: number;
	constructor(data?);
}
declare class C2SShenYuHelpGetReward
{
	Id: number;
	constructor(data?);
}
declare class ShenYuRankData
{
	UserId: number;
	ShenYuId: number;
	RankValue: number;
	Show: PlayerShow ;
	ShenWei: number;
	Season: number;
	constructor(data?);
}
declare class ShenYuHallRankItem
{
	Rank: number;
	Name: string ;
	ShenYuId: number;
	Military: number;
	constructor(data?);
}
declare class C2SShenYuHallTopPlayer
{
	constructor(data?);
}
declare class S2CShenYuHallTopPlayer
{
	Top: ShenYuRankData ;
	CanBless: number;
	CanPray: number;
	Season: number;
	AllSeasonIds: Array<number>;
	constructor(data?);
}
declare class C2SCollectBox
{
	Id: number;
	constructor(data?);
}
declare class S2CCollectBox
{
	Tag: number;
	Award: Array<ItemInfo>;
	constructor(data?);
}
declare class C2SShenYuHallEnter
{
	constructor(data?);
}
declare class S2CShenYuHallEnter
{
	Tag: number;
	From: number;
	constructor(data?);
}
declare class C2SShenYuHallLeave
{
	constructor(data?);
}
declare class S2CShenYuHallLeave
{
	Tag: number;
	constructor(data?);
}
declare class C2SShenYuHallPray
{
	Season: number;
	constructor(data?);
}
declare class S2CShenYuHallPray
{
	Tag: number;
	constructor(data?);
}
declare class C2SShenYuHallBless
{
	constructor(data?);
}
declare class S2CShenYuHallBless
{
	Tag: number;
	constructor(data?);
}
declare class S2CShenYuHallTopList
{
	Player: Array<ShenYuRankData>;
	constructor(data?);
}
declare class C2SShenYuHallSeasonRank
{
	Season: number;
	constructor(data?);
}
declare class S2CShenYuHallSeasonRank
{
	Season: number;
	MyShenYuId: number;
	Player: Array<ShenYuHallRankItem>;
	constructor(data?);
}
declare class C2SShenYuHallSeasonTop
{
	constructor(data?);
}
declare class S2CShenYuHallSeasonTop
{
	Top: ShenYuRankData ;
	constructor(data?);
}
declare class RandomShop
{
	Id: number;
	State: number;
	constructor(data?);
}
declare class C2SRandomShopList
{
	ShopId: number;
	constructor(data?);
}
declare class S2CRandomShopList
{
	ShopId: number;
	List: Array<RandomShop>;
	NextTime: number;
	Tag: number;
	FreeItem: ItemInfo ;
	constructor(data?);
}
declare class C2SRandomShopBuy
{
	ShopId: number;
	GoodID: number;
	constructor(data?);
}
declare class S2CRandomShopBuy
{
	Tag: number;
	ShopId: number;
	GoodID: number;
	TagP: string ;
	constructor(data?);
}
declare class C2SRandomShopRefresh
{
	ShopId: number;
	constructor(data?);
}
declare class S2CRandomShopRefresh
{
	Tag: number;
	TagP: string ;
	constructor(data?);
}
declare class C2SRandomShopOpen
{
	ShopId: number;
	constructor(data?);
}
declare class C2SRandomShopFreeItem
{
	ShopId: number;
	constructor(data?);
}
declare class S2CRandomShopFreeItem
{
	Tag: number;
	constructor(data?);
}
declare class C2SShengHenData
{
	Id: number;
	constructor(data?);
}
declare class C2SGetAllShengHen
{
	constructor(data?);
}
declare class S2CGetAllShengHen
{
	Tag: number;
	ShengHen: Array<EquipAllData>;
	constructor(data?);
}
declare class C2SShengWuSmelt
{
	Id: Array<string>;
	constructor(data?);
}
declare class S2CShengWuSmelt
{
	Tag: number;
	constructor(data?);
}
declare class C2SShengHenLevelUp
{
	Id: number;
	constructor(data?);
}
declare class S2CShengHenLevelUp
{
	Tag: number;
	constructor(data?);
}
declare class C2SShengHenSkillUp
{
	ShengHenId: number;
	SkillPos: number;
	constructor(data?);
}
declare class S2CShengHenSkillUp
{
	Tag: number;
	SkillPos: number;
	constructor(data?);
}
declare class SurperVipChannelReward
{
	ChannelId: number;
	TodayRecharge: number;
	TotalRecharge: number;
	Reward: string ;
	constructor(data?);
}
declare class C2SGetSurperVipChannelReward
{
	constructor(data?);
}
declare class S2CGetSurperVipChannelReward
{
	data: Array<SurperVipChannelReward>;
	constructor(data?);
}
declare class SurperVipInfo
{
	Sn: number;
	AreaId: number;
	ChannelId: string ;
	WeiXin: string ;
	QQ: string ;
	ChatAccount: string ;
	constructor(data?);
}
declare class C2SGetSurperVipInfo
{
	constructor(data?);
}
declare class S2CGetSurperVipInfo
{
	data: Array<SurperVipInfo>;
	constructor(data?);
}
declare class AccountTransfer
{
	ChannelId: number;
	Level: number;
	Online: number;
	Show: number;
	Charge: number;
	Reward: string ;
	Rewardcode: string ;
	constructor(data?);
}
declare class C2SGetAccountTransfer
{
	constructor(data?);
}
declare class S2CGetAccountTransfer
{
	Tag: number;
	Data: AccountTransfer ;
	constructor(data?);
}
declare class C2SGetPrefectWarData
{
	constructor(data?);
}
declare class S2CGetPrefectWarData
{
	TabItems: Array<PrefectWarTabData>;
	constructor(data?);
}
declare class PrefectWarTabData
{
	Items: Array<PrefectWarCpData>;
	CurCpId: number;
	State: number;
	StateResetTimestamp: number;
	PassTimes: number;
	TabId: number;
	UnlockState: number;
	constructor(data?);
}
declare class PrefectWarCpData
{
	CpId: number;
	Star: number;
	constructor(data?);
}
declare class C2SGetPrefectWarHireList
{
	CpId: number;
	TabId: number;
	constructor(data?);
}
declare class S2CGetPrefectWarHireList
{
	Tag: number;
	CpId: number;
	List: Array<HirePlayer>;
	TabId: number;
	constructor(data?);
}
declare class HirePlayer
{
	Player: TeamPlayer ;
	HireState: number;
	constructor(data?);
}
declare class C2SPrefectWarHire
{
	CpId: number;
	UserId: number;
	TabId: number;
	constructor(data?);
}
declare class S2CPrefectWarHire
{
	Tag: number;
	CpId: number;
	UserId: number;
	TabId: number;
	constructor(data?);
}
declare class C2SPrefectWarFight
{
	CpId: number;
	BossId: number;
	TabId: number;
	constructor(data?);
}
declare class S2CPrefectWarFight
{
	Tag: number;
	CpId: number;
	BossId: number;
	TabId: number;
	constructor(data?);
}
declare class TeamUnit
{
	Pos: number;
	Type: number;
	Id: string ;
	constructor(data?);
}
declare class C2STeamUnit
{
	constructor(data?);
}
declare class S2CTeamUnit
{
	Tag: number;
	Unit: Array<TeamUnit>;
	constructor(data?);
}
declare class C2SSetTeamUnit
{
	Unit: TeamUnit ;
	constructor(data?);
}
declare class S2CSetTeamUnit
{
	Tag: number;
	Unit: Array<TeamUnit>;
	constructor(data?);
}
declare class PlayerAlien
{
	Id: number;
	Active: number;
	Star: number;
	Lev: number;
	LevExp: number;
	MPId: number;
	PosData: Array<PosData>;
	SMLev: number;
	constructor(data?);
}
declare class PosData
{
	Pos: number;
	Wear: number;
	SL: number;
	Star: number;
	constructor(data?);
}
declare class C2SGetAlienData
{
	constructor(data?);
}
declare class S2CGetAlienData
{
	PlayerAlien: Array<PlayerAlien>;
	constructor(data?);
}
declare class C2SAlienActive
{
	Id: number;
	constructor(data?);
}
declare class S2CAlienActive
{
	Tag: number;
	Id: number;
	constructor(data?);
}
declare class C2SAlienIntoBattle
{
	Id: number;
	constructor(data?);
}
declare class S2CAlienIntoBattle
{
	Tag: number;
	Id: number;
	constructor(data?);
}
declare class C2SAlienLev
{
	Id: number;
	ItemId: number;
	Type: number;
	constructor(data?);
}
declare class S2CAlienLev
{
	Tag: number;
	Id: number;
	ItemId: number;
	Type: number;
	constructor(data?);
}
declare class C2SMPOneKeyWear
{
	MPId: number;
	constructor(data?);
}
declare class S2CMPOneKeyWear
{
	Tag: number;
	MPId: number;
	constructor(data?);
}
declare class C2SMPOneKeyStrength
{
	MPId: number;
	constructor(data?);
}
declare class S2CMPOneKeyStrength
{
	Tag: number;
	MPId: number;
	constructor(data?);
}
declare class C2SMPStrengthMaster
{
	MPId: number;
	constructor(data?);
}
declare class S2CMPStrengthMaster
{
	Tag: number;
	MPId: number;
	SL: number;
	constructor(data?);
}
declare class C2SMPStar
{
	MPId: number;
	Pos: number;
	constructor(data?);
}
declare class S2CMPStar
{
	Tag: number;
	MPId: number;
	Pos: number;
	constructor(data?);
}
declare class S2CRedBag
{
	Id: Array<number>;
	constructor(data?);
}
declare class C2SRoleGodSkillActive
{
	Id: number;
	constructor(data?);
}
declare class S2CRoleGodSkillActive
{
	Tag: number;
	RoleGodSkill: string ;
	constructor(data?);
}
declare class JungleHuntCpData
{
	CpId: number;
	BoxOpenState: number;
	BuffIds: Array<number>;
	PickedBuffId: number;
	ElvesGoodsId: number;
	ElvesBuyState: number;
	CpState: number;
	MirrorRank: number;
	FirstOpenBox: number;
	constructor(data?);
}
declare class C2SJungleHuntData
{
	constructor(data?);
}
declare class S2CJungleHuntData
{
	Items: Array<JungleHuntCpData>;
	CurCpId: number;
	UseBuffIds: Array<number>;
	HavePass: number;
	constructor(data?);
}
declare class C2SJungleHuntFight
{
	CpId: number;
	constructor(data?);
}
declare class S2CJungleHuntFight
{
	Tag: number;
	CpId: number;
	Pass: number;
	Win: number;
	constructor(data?);
}
declare class C2SJungleHuntTreat
{
	constructor(data?);
}
declare class S2CJungleHuntTreat
{
	Tag: number;
	constructor(data?);
}
declare class C2SJungleHuntReset
{
	constructor(data?);
}
declare class S2CJungleHuntReset
{
	Tag: number;
	constructor(data?);
}
declare class C2SJungleHuntOpenBox
{
	CpId: number;
	constructor(data?);
}
declare class S2CJungleHuntOpenBox
{
	Tag: number;
	CpId: number;
	constructor(data?);
}
declare class C2SJungleHuntBlessRefresh
{
	CpId: number;
	constructor(data?);
}
declare class S2CJungleHuntBlessRefresh
{
	Tag: number;
	CpId: number;
	BuffIds: Array<number>;
	constructor(data?);
}
declare class C2SJungleHuntBlessPick
{
	CpId: number;
	BuffId: number;
	constructor(data?);
}
declare class S2CJungleHuntBlessPick
{
	Tag: number;
	CpId: number;
	BuffId: number;
	constructor(data?);
}
declare class C2SJungleHuntElvesLeave
{
	CpId: number;
	ElvesGoodsId: number;
	constructor(data?);
}
declare class S2CJungleHuntElvesLeave
{
	Tag: number;
	CpId: number;
	ElvesGoodsId: number;
	ElvesBuyState: number;
	constructor(data?);
}
declare class C2SJungleHuntElvesBuy
{
	CpId: number;
	ElvesGoodsId: number;
	constructor(data?);
}
declare class S2CJungleHuntElvesBuy
{
	Tag: number;
	CpId: number;
	ElvesGoodsId: number;
	ElvesBuyState: number;
	constructor(data?);
}
declare class C2SJungleHuntSweep
{
	constructor(data?);
}
declare class S2CJungleHuntSweep
{
	Tag: number;
	constructor(data?);
}
declare class C2SJungleHuntSetPartnerPos
{
	PType: number;
	Id: number;
	IdStr: string ;
	Pos: number;
	constructor(data?);
}
declare class S2CJungleHuntSetPartnerPos
{
	Tag: number;
	PType: number;
	Id: number;
	IdStr: string ;
	Pos: number;
	constructor(data?);
}
declare class C2SJungleHuntBattleArr
{
	CpId: number;
	constructor(data?);
}
declare class S2CJungleHuntBattleArr
{
	Tag: number;
	CpId: number;
	User: ShowUserInfo ;
	Items: Array<JhFightHpData>;
	constructor(data?);
}
declare class JhFightHpData
{
	UnitType: number;
	Id: number;
	IdStr: string ;
	Pos: number;
	HpPercent: number;
	SkinId: number;
	Rarity: number;
	Quality: number;
	PetType: number;
	constructor(data?);
}
declare class PlayerGoldDrug
{
	Type: number;
	Grade: number;
	Exp: number;
	IsBreak: number;
	Sum: number;
	constructor(data?);
}
declare class C2SPlayerGoldDrugGradeUp
{
	Type: number;
	Op: number;
	constructor(data?);
}
declare class S2CPlayerGoldDrugGradeUp
{
	Tag: number;
	Type: number;
	Op: number;
	constructor(data?);
}
declare class C2SPlayerGetAllGoldDrug
{
	constructor(data?);
}
declare class S2CPlayerGetAllGoldDrug
{
	PlayerAllGoldGrade: Array<PlayerGoldDrug>;
	constructor(data?);
}
declare class C2SOpenMomoMsg
{
	Open: number;
	constructor(data?);
}
declare class C2SGetMomoPrize
{
	constructor(data?);
}
declare class S2CGetMomoPrize
{
	Tag: number;
	constructor(data?);
}
declare class PartenInfo
{
	T: number;
	Id: number;
	Attr: Array<IntAttr>;
	FV: number;
	AS: Array<Skill>;
	PS: Array<Skill>;
	SS: Array<Skill>;
	Skin: number;
	Quality: number;
	Star: number;
	Level: number;
	Grade: number;
	constructor(data?);
}
declare class PlayerZhenFa
{
	Id: number;
	Active: number;
	Lev: number;
	DrugLevel: number;
	ZhenWei: Array<ZhenWei>;
	Star: number;
	constructor(data?);
}
declare class ZhenWei
{
	Pos: number;
	Active: number;
	constructor(data?);
}
declare class C2SGetQiMenDunJiaData
{
	constructor(data?);
}
declare class S2CGetQiMenDunJiaData
{
	PlayerZhenFa: Array<PlayerZhenFa>;
	constructor(data?);
}
declare class C2SZhenFaHuanHua
{
	Id: number;
	constructor(data?);
}
declare class S2CZhenFaHuanHua
{
	Tag: number;
	Id: number;
	constructor(data?);
}
declare class C2SZhenFaActive
{
	Id: number;
	constructor(data?);
}
declare class S2CZhenFaActive
{
	Tag: number;
	Id: number;
	constructor(data?);
}
declare class C2SZhenWeiActive
{
	Id: number;
	Pos: number;
	constructor(data?);
}
declare class S2CZhenWeiActive
{
	Tag: number;
	Id: number;
	Pos: number;
	constructor(data?);
}
declare class C2SZhenFaLevelUp
{
	Id: number;
	constructor(data?);
}
declare class S2CZhenFaLevelUp
{
	Tag: number;
	Id: number;
	constructor(data?);
}
declare class C2SZhenFaEatDrug
{
	Id: number;
	constructor(data?);
}
declare class S2CZhenFaEatDrug
{
	Tag: number;
	Id: number;
	constructor(data?);
}
declare class C2SZhenFaStarUp
{
	Id: number;
	constructor(data?);
}
declare class S2CZhenFaStarUp
{
	Tag: number;
	Id: number;
	constructor(data?);
}
declare class C2SEnterYJYM
{
	constructor(data?);
}
declare class S2CEnterYJYM
{
	Tag: number;
	YjState: number;
	Grid: number;
	Camp: number;
	WorldLevel: number;
	constructor(data?);
}
declare class C2SLeaveYJYM
{
	constructor(data?);
}
declare class S2CLeaveYJYM
{
	Tag: number;
	constructor(data?);
}
declare class C2SYJInfo
{
	constructor(data?);
}
declare class S2CYJInfo
{
	Error: number;
	Term: number;
	PrepareStartTime: number;
	PrepareEndTime: number;
	StartTime: number;
	EndTime: number;
	FirstEndTime: number;
	SecondEndTime: number;
	constructor(data?);
}
declare class StrIntAttr
{
	k: string ;
	v: number;
	constructor(data?);
}
declare class J2CYJRelogin
{
	constructor(data?);
}
declare class J2CYJState
{
	YjState: number;
	constructor(data?);
}
declare class YJPlayer
{
	UserId: number;
	Grid: number;
	constructor(data?);
}
declare class YJMonster
{
	MonsterId: number;
	MonsterModelId: number;
	Grid: number;
	Hp: number;
	MAXHp: number;
	constructor(data?);
}
declare class YJBoss
{
	MonsterId: number;
	MonsterModelId: number;
	Grid: number;
	Hp: number;
	MAXHp: number;
	Shield: number;
	MAXShield: number;
	InvincibleShield: number;
	constructor(data?);
}
declare class J2CYJRound
{
	Players: Array<YJPlayer>;
	Monsters: Array<YJMonster>;
	Bosses: Array<YJBoss>;
	constructor(data?);
}
declare class J2CYJAppearPlayer
{
	Players: YJPlayer ;
	constructor(data?);
}
declare class J2CYJAppearMonster
{
	Monsters: Array<YJMonster>;
	constructor(data?);
}
declare class J2CYJAppearBoss
{
	Bosses: Array<YJBoss>;
	constructor(data?);
}
declare class J2CYJDisappearPlayer
{
	Players: number;
	constructor(data?);
}
declare class J2CYJDisappearMonster
{
	Monsters: Array<number>;
	constructor(data?);
}
declare class J2CYJDisappearBoss
{
	Bosses: Array<number>;
	constructor(data?);
}
declare class C2JYJOther
{
	UserId: number;
	constructor(data?);
}
declare class J2CYJOther
{
	Tag: number;
	UserId: number;
	Camp: number;
	show: PlayerShow ;
	Grid: number;
	Steps: Array<number>;
	constructor(data?);
}
declare class J2CYJCooldown
{
	Cooldown: Array<StrIntAttr>;
	constructor(data?);
}
declare class C2JYJMove
{
	Grid: number;
	Steps: Array<number>;
	constructor(data?);
}
declare class J2CYJMove
{
	Tag: number;
	UserId: number;
	Grid: number;
	Steps: Array<number>;
	constructor(data?);
}
declare class C2JYJMoving
{
	Grid: number;
	constructor(data?);
}
declare class C2JYJStop
{
	Grid: number;
	constructor(data?);
}
declare class J2CYJStop
{
	Tag: number;
	UserId: number;
	Grid: number;
	constructor(data?);
}
declare class C2JYJAttackMonster
{
	MonsterId: number;
	constructor(data?);
}
declare class J2CYJAttackMonster
{
	Tag: number;
	MonsterId: number;
	Cooldown: StrIntAttr ;
	constructor(data?);
}
declare class C2JYJAttackBoss
{
	MonsterId: number;
	constructor(data?);
}
declare class J2CYJAttackBoss
{
	Tag: number;
	MonsterId: number;
	Cooldown: StrIntAttr ;
	constructor(data?);
}
declare class J2CYJBossHp
{
	Boss: YJBoss ;
	constructor(data?);
}
declare class J2CYJMonsterHp
{
	Monster: YJMonster ;
	constructor(data?);
}
declare class C2JYJCollect
{
	MonsterId: number;
	constructor(data?);
}
declare class J2CYJCollect
{
	Tag: number;
	MonsterId: number;
	Cooldown: StrIntAttr ;
	constructor(data?);
}
declare class C2SYJOpen
{
	MonsterId: number;
	Type: number;
	constructor(data?);
}
declare class S2CYJOpen
{
	Tag: number;
	MonsterId: number;
	Type: number;
	Cooldown: StrIntAttr ;
	constructor(data?);
}
declare class YJRanking
{
	RankKey: number;
	RankValue: number;
	RankTime: number;
	constructor(data?);
}
declare class J2CYJRanking
{
	RankingId: number;
	Ranking: Array<YJRanking>;
	constructor(data?);
}
declare class J2CYJRankingChange
{
	RankingId: number;
	Ranking: YJRanking ;
	constructor(data?);
}
declare class J2CYJBossAnger
{
	Anger: number;
	constructor(data?);
}
declare class J2CYJBossAddition
{
	Addition: number;
	constructor(data?);
}
declare class J2CYJDrops
{
	DropItems: Array<IntAttr>;
	constructor(data?);
}
declare class J2CYJDrop
{
	DropItem: IntAttr ;
	constructor(data?);
}
declare class J2CYJPlayer
{
	Player: YJPlayer ;
	constructor(data?);
}
declare class J2CYJBossNotice
{
	Time: number;
	constructor(data?);
}
declare class YJPlayerShow
{
	UserId: number;
	Nick: string ;
	RoleId: number;
	GodLevel: number;
	AreaId: number;
	Head: number;
	HeadFrame: number;
	ChatFrame: number;
	Title: number;
	VIP: number;
	Xianzong: string ;
	Camp: number;
	WorldName: string ;
	LoginMergeAreaId: number;
	MergeWorldName: string ;
	HideVIP: number;
	constructor(data?);
}
declare class J2CYJChat
{
	Tag: number;
	ChannelId: number;
	Content: string ;
	Show: YJPlayerShow ;
	AtUserShowAreaId: number;
	AtUserNick: string ;
	AtUserId: number;
	AtUserWorldName: string ;
	AtUserLoginMergeAreaId: number;
	AtUserMergeWorldName: string ;
	constructor(data?);
}
declare class C2JYJChats
{
	ChannelId: number;
	constructor(data?);
}
declare class J2CYJChats
{
	chats: Array<J2CYJChat>;
	constructor(data?);
}
declare class J2CYJAnnouncement
{
	NoticeId: number;
	parameters: Array<string>;
	show: YJPlayerShow ;
	constructor(data?);
}
declare class C2JYJHeart
{
	constructor(data?);
}
declare class J2CYJHeart
{
	Time: number;
	constructor(data?);
}
declare class C2JYJOtherInfo
{
	UserId: number;
	constructor(data?);
}
declare class S2CYJKeyTip
{
	Tag: number;
	constructor(data?);
}
declare class J2CYJChest
{
	YjChestTimes: number;
	constructor(data?);
}
declare class SectBoss
{
	Id: number;
	State: number;
	constructor(data?);
}
declare class ShowYJFXSectRankData
{
	SectId: number;
	SectName: string ;
	SectAreaId: number;
	WorldName: string ;
	DengJianCount: number;
	Rank: number;
	Complete: number;
	UseTimes: number;
	Distance: number;
	constructor(data?);
}
declare class ShowDengJianInfo
{
	UserId: number;
	WorldName: string ;
	Nick: string ;
	A: Array<IntAttr>;
	B: Array<StrAttr>;
	constructor(data?);
}
declare class ShowYunGongInfo
{
	UserId: number;
	WorldName: string ;
	Nick: string ;
	VIP: number;
	HideVIP: number;
	constructor(data?);
}
declare class ShowMatchInfo
{
	SectId: number;
	WorldName: string ;
	SectName: string ;
	DengJianCount: number;
	Speed: number;
	Distance: number;
	Complete: number;
	Rank: number;
	Id: number;
	BossHp: number;
	ShowDengJianInfo: Array<ShowDengJianInfo>;
	Durable: number;
	UseTimes: number;
	JieSuan: number;
	YuJian: number;
	QiangHuaTimes: number;
	ZhangQiTimes: number;
	HuDunTimes: number;
	DurableTimes: number;
	BossDownTimes: number;
	BossUpTimes: number;
	HuDunCount: number;
	BossState: Array<SectBoss>;
	constructor(data?);
}
declare class ShowBossInfo
{
	Id: number;
	Hp: number;
	MaxHp: number;
	BossDownTimes: number;
	BossUpTimes: number;
	PlayerHurts: Array<ShowAttackPlayer>;
	constructor(data?);
}
declare class ShowAttackPlayer
{
	Nick: string ;
	Hurt: number;
	constructor(data?);
}
declare class ShowAttack
{
	SectId: number;
	WorldName: string ;
	SectName: string ;
	Rank: number;
	constructor(data?);
}
declare class C2SYJFXEnter
{
	constructor(data?);
}
declare class S2CYJFXEnter
{
	Tag: number;
	constructor(data?);
}
declare class C2SYJFXLeave
{
	constructor(data?);
}
declare class S2CYJFXLeave
{
	Tag: number;
	constructor(data?);
}
declare class C2SYJFXMatchStage
{
	constructor(data?);
}
declare class S2CYJFXMatchStage
{
	State: number;
	EndTimes: number;
	SectDengJian: number;
	RewardTips: number;
	RewardItems: Array<ItemInfo>;
	constructor(data?);
}
declare class C2SYJFXGetDengJianInfo
{
	constructor(data?);
}
declare class S2CYJFXGetDengJianInfo
{
	SectId: number;
	WorldName: string ;
	SectName: string ;
	DengJianCount: number;
	Speed: number;
	YunGong: number;
	TotalFv: number;
	ShowDengJianInfo: Array<ShowDengJianInfo>;
	constructor(data?);
}
declare class C2SYJFXDengJian
{
	constructor(data?);
}
declare class S2CYJFXDengJian
{
	Tag: number;
	constructor(data?);
}
declare class C2SYJFXGetYunGongInfo
{
	constructor(data?);
}
declare class S2CYJFXGetYunGongInfo
{
	ShowYunGongInfo: Array<ShowYunGongInfo>;
	PlayerYunGong: number;
	constructor(data?);
}
declare class C2SYJFXYunGong
{
	constructor(data?);
}
declare class S2CYJFXYunGong
{
	Tag: number;
	constructor(data?);
}
declare class C2SYJFXMatchData
{
	constructor(data?);
}
declare class S2CYJFXMatchData
{
	ShowMatchInfo: Array<ShowMatchInfo>;
	constructor(data?);
}
declare class C2SYJFXMatchBag
{
	constructor(data?);
}
declare class S2CYJFXMatchBag
{
	BagItems: Array<ItemData>;
	constructor(data?);
}
declare class S2CYJFXMatchBoss
{
	ShowBossInfo: ShowBossInfo ;
	constructor(data?);
}
declare class C2SYJFXUseItem
{
	ItemId: number;
	ItemNum: number;
	SectId: number;
	constructor(data?);
}
declare class S2CYJFXUseItem
{
	Tag: number;
	ItemId: number;
	ItemNum: number;
	SectId: number;
	constructor(data?);
}
declare class C2SYJFXRank
{
	constructor(data?);
}
declare class S2CYJFXRank
{
	ShowYJFXSectRankData: Array<ShowYJFXSectRankData>;
	Dengjian: number;
	State: number;
	constructor(data?);
}
declare class C2SYJFXGetCanAttackList
{
	constructor(data?);
}
declare class S2CYJFXGetCanAttackList
{
	ShowAttack: Array<ShowAttack>;
	constructor(data?);
}
declare class C2SGetChannelGiftInfo
{
	constructor(data?);
}
declare class S2CGetChannelGiftInfo
{
	Tag: number;
	TagP: string ;
	Prize: Array<ItemInfo>;
	constructor(data?);
}
declare class C2SGetChannelGiftPrize
{
	constructor(data?);
}
declare class S2CGetChannelGiftPrize
{
	Tag: number;
	TagP: string ;
	constructor(data?);
}
declare class C2SCreateRoleTask
{
	Nick: string ;
	RoleId: number;
	constructor(data?);
}
declare class S2CCreateRoleTask
{
	Tag: number;
	constructor(data?);
}
declare class ActTaskChoosePrize
{
	TaskId: number;
	Order: number;
	Prize: ItemInfo ;
	constructor(data?);
}
declare class C2SActTaskChoosePrize
{
	TaskId: number;
	Order: number;
	Prize: ItemInfo ;
	constructor(data?);
}
declare class S2CActTaskChoosePrize
{
	Tag: number;
	TagP: string ;
	constructor(data?);
}
declare class S2CActTaskChoosePrizeSend
{
	ChangeTaskId: number;
	Choose: Array<ActTaskChoosePrize>;
	constructor(data?);
}
declare class C2SCpsRPPlayerJoin
{
	constructor(data?);
}
declare class S2CCpsRPPlayerJoin
{
	Tag: number;
	constructor(data?);
}
declare class CpsRPPlayerTask
{
	TaskId: number;
	Count: number;
	FinishFlag: number;
	constructor(data?);
}
declare class CpsRPPlayerExchange
{
	Id: number;
	Type: number;
	Cost: number;
	Add: number;
	ConditionType: number;
	ConditionParam: number;
	Timestamp: number;
	Status: number;
	OrderId: string ;
	constructor(data?);
}
declare class CpsRPPlayerInfo
{
	PlayerId: number;
	AreaId: number;
	AreaName: string ;
	Level: number;
	JoinTimestamp: number;
	Charge: number;
	XianJin: number;
	FreezeXianJin: number;
	TaskData: Array<CpsRPPlayerTask>;
	PlayerNick: string ;
	ActEnd: number;
	FinishTimestamp: number;
	constructor(data?);
}
declare class CpsRPAccountInfo
{
	AccountId: number;
	SelectPlayerId: number;
	ActId: number;
	BondStatus: number;
	ExchangeData: Array<CpsRPPlayerExchange>;
	constructor(data?);
}
declare class S2CCpsRPPlayerData
{
	PlayerData: Array<CpsRPPlayerInfo>;
	AccountData: CpsRPAccountInfo ;
	constructor(data?);
}
declare class C2SCpsRPPlayerSwitch
{
	PlayerId: number;
	constructor(data?);
}
declare class S2CCpsRPPlayerSwitch
{
	Tag: number;
	constructor(data?);
}
declare class CpsRPTask
{
	TaskId: number;
	TaskName: string ;
	TaskContent: string ;
	TaskIcon: number;
	TaskClientType: number;
	TaskType: number;
	Param: number;
	FixPrize: number;
	RandPrizeMin: number;
	RandPrizeMax: number;
	FuncId: number;
	constructor(data?);
}
declare class CpsRPExchange
{
	Id: number;
	LimitNum: number;
	LimitDays: number;
	ConditionType: number;
	ConditionParam: number;
	Need: number;
	Type: number;
	Coin: number;
	constructor(data?);
}
declare class C2SCpsRPGetCfgInfo
{
	constructor(data?);
}
declare class S2CCpsRPGetCfgInfo
{
	ActId: number;
	StartDate: number;
	EndDate: number;
	IsBegin: number;
	LimitAccountNum: number;
	ActTime: number;
	LimitTiXian: number;
	LimitTiXianType1: number;
	LimitTiXianType2: number;
	ActDuration: number;
	ActXuanChuanYu: string ;
	WeChatName: string ;
	TaskInfo: Array<CpsRPTask>;
	ExchangeInfo: Array<CpsRPExchange>;
	ActXuanChuanPrize: number;
	constructor(data?);
}
declare class C2SCpsRPPlayerFinishTask
{
	TaskId: number;
	constructor(data?);
}
declare class S2CCpsRPPlayerFinishTask
{
	Tag: number;
	constructor(data?);
}
declare class C2SCpsRPPlayerExchange
{
	ExchangeId: number;
	constructor(data?);
}
declare class S2CCpsRPPlayerExchange
{
	Tag: number;
	constructor(data?);
}
declare class C2SPhonePBSetting
{
	PhoneType: string ;
	constructor(data?);
}
declare class S2CPhonePBSetting
{
	PhoneType: string ;
	List: Array<number>;
	constructor(data?);
}
declare class FTListInfo
{
	Id: string ;
	Name: string ;
	World: string ;
	CreateTime: number;
	Declaration: string ;
	MemberCount: number;
	LeaderUid: number;
	LeaderHeadImg: number;
	HeadFrame: number;
	LeaderVip: number;
	LeaderHideVip: number;
	Fv: number;
	State: number;
	constructor(data?);
}
declare class FTMember
{
	Uid: number;
	Nick: string ;
	WorldName: string ;
	A: Array<IntAttr>;
	B: Array<StrAttr>;
	Pos: number;
	OfflineTime: number;
	SectName: string ;
	SectWorldName: string ;
	constructor(data?);
}
declare class FTApplyMember
{
	Uid: number;
	Nick: string ;
	World: string ;
	Head: number;
	HeadFrame: number;
	FV: number;
	CreateTime: number;
	constructor(data?);
}
declare class C2SGetAllFTList
{
	constructor(data?);
}
declare class S2CGetAllFTList
{
	FTListInfo: Array<FTListInfo>;
	constructor(data?);
}
declare class C2SGetFTInfo
{
	Id: string ;
	constructor(data?);
}
declare class S2CGetFTInfo
{
	Tag: number;
	Id: string ;
	Name: string ;
	World: string ;
	Declaration: string ;
	Members: Array<FTMember>;
	AccuseEndTime: number;
	NextChangeNameTime: number;
	AutoAgree: number;
	AgreeFv: number;
	ExistApplys: number;
	constructor(data?);
}
declare class C2SCreateFT
{
	Name: string ;
	Declaration: string ;
	constructor(data?);
}
declare class S2CCreateFT
{
	Tag: number;
	constructor(data?);
}
declare class C2SGetApplyList
{
	constructor(data?);
}
declare class S2CGetApplyList
{
	Tag: number;
	ApplyMembers: Array<FTApplyMember>;
	constructor(data?);
}
declare class C2SApplyJoinFT
{
	Id: string ;
	constructor(data?);
}
declare class S2CApplyJoinFT
{
	Tag: number;
	constructor(data?);
}
declare class C2SAgreeJoinFT
{
	Id: number;
	State: number;
	constructor(data?);
}
declare class S2CAgreeJoinFT
{
	Tag: number;
	constructor(data?);
}
declare class C2SDeleteFT
{
	constructor(data?);
}
declare class S2CDeleteFT
{
	Tag: number;
	constructor(data?);
}
declare class C2SChangeLeader
{
	Uid: number;
	constructor(data?);
}
declare class S2CChangeFTLeader
{
	Tag: number;
	Uid: number;
	constructor(data?);
}
declare class C2SKickOutFT
{
	Uid: number;
	constructor(data?);
}
declare class S2CKickOutFT
{
	Tag: number;
	Uid: number;
	constructor(data?);
}
declare class C2SLeaveFT
{
	constructor(data?);
}
declare class S2CLeaveFT
{
	Tag: number;
	constructor(data?);
}
declare class C2SAccuseLeader
{
	constructor(data?);
}
declare class S2CAccuseLeader
{
	Tag: number;
	AccuseEndTime: number;
	constructor(data?);
}
declare class C2SFTChangeName
{
	FTName: string ;
	constructor(data?);
}
declare class S2CFTChangeName
{
	Tag: number;
	FTName: string ;
	NextChangeNameTime: number;
	constructor(data?);
}
declare class C2SFTChangeAutoAgree
{
	AutoAgree: number;
	AgreeFv: number;
	constructor(data?);
}
declare class S2CFTChangeAutoAgree
{
	Tag: number;
	AutoAgree: number;
	AgreeFv: number;
	constructor(data?);
}
declare class C2SFTChangeDeclaration
{
	FTDeclaration: string ;
	constructor(data?);
}
declare class S2CFTChangeDeclaration
{
	Tag: number;
	FTDeclaration: string ;
	constructor(data?);
}
declare class C2SGetFTHaloInfo
{
	constructor(data?);
}
declare class S2CGetFTHaloInfo
{
	Tag: number;
	PeopleNum: number;
	Skills: Array<Skill>;
	constructor(data?);
}
declare class C2SGetFTSearch
{
	FTName: string ;
	constructor(data?);
}
declare class S2CGetFTSearch
{
	Tag: number;
	FTListInfo: Array<FTListInfo>;
	constructor(data?);
}
declare class S2CFTTips
{
	Tips: string ;
	constructor(data?);
}
declare class C2SShenYuGodActionBuy
{
	Type: number;
	constructor(data?);
}
declare class S2CShenYuGodActionBuy
{
	Type: number;
	Tag: number;
	constructor(data?);
}
declare class C2SShenYuSaveTigs
{
	data: Array<ShenYuTipsState>;
	IsClean: number;
	constructor(data?);
}
declare class S2CShenYuSaveTigs
{
	Tag: number;
	constructor(data?);
}
declare class C2SShenYuGetSaveTigs
{
	constructor(data?);
}
declare class S2CShenYuGetSaveTigs
{
	data: Array<ShenYuTipsState>;
	constructor(data?);
}
declare class ShenYuTipsState
{
	Name: string ;
	Status: number;
	constructor(data?);
}
declare class WarriorGoldChange
{
	Id: number;
	Grade: number;
	Level: number;
	Status: number;
	constructor(data?);
}
declare class C2SWarriorGoldChange
{
	Skin: number;
	Grade: number;
	Level: number;
	CostSkin: string ;
	constructor(data?);
}
declare class S2CWarriorGoldChange
{
	Tag: number;
	constructor(data?);
}
declare class C2SWarriorGCUnlock
{
	Skin: number;
	constructor(data?);
}
declare class S2CWarriorGCUnlock
{
	Tag: number;
	constructor(data?);
}
declare class S2CWarriorGoldChangeGetInfo
{
	WarriorGoldChangeData: Array<WarriorGoldChange>;
	constructor(data?);
}
declare class S2CWarriorGCSingleData
{
	WarriorGoldChangeData: WarriorGoldChange ;
	constructor(data?);
}
declare class SkinsExtData
{
	FuncId: number;
	Id: number;
	Grade: number;
	Level: number;
	Status: number;
	constructor(data?);
}
declare class C2SSkinsExtUnlock
{
	FuncId: number;
	SkinId: number;
	constructor(data?);
}
declare class S2CSkinsExtUnlock
{
	Tag: number;
	constructor(data?);
}
declare class C2SSkinsExtLev
{
	FuncId: number;
	SkinId: number;
	Grade: number;
	Level: number;
	constructor(data?);
}
declare class S2CSkinsExtLev
{
	Tag: number;
	constructor(data?);
}
declare class S2CSkinsExtAllData
{
	SkinsExtData: Array<SkinsExtData>;
	constructor(data?);
}
declare class S2CSkinsExtSingleData
{
	SkinsExtData: SkinsExtData ;
	constructor(data?);
}
declare class C2SGodSkillSelect
{
	FuncId: number;
	SkillId: number;
	constructor(data?);
}
declare class S2CGodSkillSelect
{
	Tag: number;
	constructor(data?);
}
declare class PlayerSL
{
	Grade: number;
	Lev: number;
	LevExp: number;
	Star: number;
	Node: number;
	SLMosaicInfo: Array<SLMosaicInfo>;
	Call: number;
	constructor(data?);
}
declare class SLMosaicInfo
{
	Pos: number;
	Id: string ;
	Active: number;
	constructor(data?);
}
declare class C2SSLFallOK
{
	constructor(data?);
}
declare class S2CSLFallOK
{
	Tag: number;
	constructor(data?);
}
declare class C2SSLGetData
{
	constructor(data?);
}
declare class S2CSLGetData
{
	Data: PlayerSL ;
	constructor(data?);
}
declare class C2SSLLev
{
	ItemId: number;
	Type: number;
	constructor(data?);
}
declare class S2CSLLev
{
	Tag: number;
	ItemId: number;
	Type: number;
	constructor(data?);
}
declare class C2SSLGrade
{
	constructor(data?);
}
declare class S2CSLGrade
{
	Tag: number;
	constructor(data?);
}
declare class C2SSLLight
{
	constructor(data?);
}
declare class S2CSLLight
{
	Tag: number;
	Star: number;
	Node: number;
	constructor(data?);
}
declare class C2SSLStar
{
	constructor(data?);
}
declare class S2CSLStar
{
	Tag: number;
	Star: number;
	Node: number;
	constructor(data?);
}
declare class C2SSLCall
{
	constructor(data?);
}
declare class S2CSLCall
{
	Tag: number;
	constructor(data?);
}
declare class C2SSLMosaic
{
	Pos: number;
	Id: string ;
	constructor(data?);
}
declare class S2CSLMosaic
{
	Tag: number;
	Pos: number;
	Id: string ;
	constructor(data?);
}
declare class C2SSLSoulResolve
{
	ItemIds: Array<string>;
	constructor(data?);
}
declare class S2CSLSoulResolve
{
	Tag: number;
	ItemIds: Array<string>;
	constructor(data?);
}
declare class C2SSLSoulHeCheng
{
	ItemId: string ;
	Items: Array<ItemInfo>;
	constructor(data?);
}
declare class S2CSLSoulHeCheng
{
	Tag: number;
	ItemId: string ;
	Items: Array<ItemInfo>;
	LevelUp: number;
	constructor(data?);
}
declare class C2SSLSoulWish
{
	Type: number;
	constructor(data?);
}
declare class S2CSLSoulWish
{
	Tag: number;
	Prize: Array<ItemInfo>;
	constructor(data?);
}
declare class C2SSLFightReport
{
	Id: number;
	constructor(data?);
}
declare class S2CSLFightReport
{
	Value: string ;
	constructor(data?);
}
declare class VipInfo
{
	UserId: number;
	VIP: number;
	HideVIP: number;
	constructor(data?);
}
declare class C2SSwordZhenActive
{
	Id: number;
	constructor(data?);
}
declare class S2CSwordZhenActive
{
	Tag: number;
	SwordZhenData: SwordZhenData_New ;
	constructor(data?);
}
declare class C2SSwordZhenStar
{
	Id: number;
	Times: number;
	constructor(data?);
}
declare class S2CSwordZhenStar
{
	Tag: number;
	SwordZhenData: SwordZhenData_New ;
	constructor(data?);
}
declare class SwordZhenData_New
{
	Id: number;
	Grade: number;
	Star: number;
	Exp: number;
	constructor(data?);
}
declare class S2CSwordZhenData
{
	SwordZhenData: Array<SwordZhenData_New>;
	constructor(data?);
}
declare class C2SSwordZhenGradeUp
{
	Id: number;
	constructor(data?);
}
declare class S2CSwordZhenGradeUp
{
	Tag: number;
	SwordZhenData: SwordZhenData_New ;
	constructor(data?);
}
declare class C2SQieCuo
{
	UserId: number;
	constructor(data?);
}
declare class S2CQieCuo
{
	Tag: number;
	UserId: number;
	constructor(data?);
}
declare class QieCuoLog
{
	UserId1: number;
	UserId2: number;
	User2Nick: string ;
	Win: number;
	FightTimestamp: number;
	constructor(data?);
}
declare class C2SGetQieCuoLog
{
	constructor(data?);
}
declare class S2CGetQieCuoLog
{
	Tag: number;
	List: Array<QieCuoLog>;
	constructor(data?);
}
declare class C2SGetQieCuoReport
{
	UserId1: number;
	UserId2: number;
	FightTimestamp: number;
	constructor(data?);
}
declare class S2CGetQieCuoReport
{
	Tag: number;
	Report: S2CBattlefieldReport ;
	constructor(data?);
}
declare class J2CSZLMInfo
{
	StartTime: number;
	EndTime: number;
	LmEndTime: number;
	BlockIds: Array<IntAttr>;
	constructor(data?);
}
declare class J2CSZLMProgressInfo
{
	Progress: number;
	AddTime: number;
	constructor(data?);
}
declare class J2CSZLMStart
{
	Camp: number;
	BlockId: number;
	LmEndTime: number;
	MyCamp: number;
	constructor(data?);
}
declare class C2JSZLMDungeonInfo
{
	constructor(data?);
}
declare class J2CSZLMDungeonInfo
{
	Tag: number;
	NormalKillNum: number;
	ElitePartakeNum: number;
	EliteKillNum: number;
	GuwuNum: number;
	NormalMonster: Array<LMNormalMonster>;
	EliteMonster: Array<LMEliteMonster>;
	UsedPartnerIds: Array<string>;
	constructor(data?);
}
declare class J2CSZLMGuwu
{
	Tag: number;
	GuwuNum: number;
	constructor(data?);
}
declare class J2CSZLMResetMonster
{
	Tag: number;
	PreId: number;
	monster: LMNormalMonster ;
	constructor(data?);
}
declare class C2JSZLMChallenge
{
	Id: number;
	xiezhan: Array<LMXieZhan>;
	constructor(data?);
}
declare class J2CSZLMChallenge
{
	Tag: number;
	Id: number;
	Kill: number;
	Hp: number;
	ChallengeNum: number;
	NormalKillNum: number;
	ElitePartakeNum: number;
	EliteKillNum: number;
	constructor(data?);
}
declare class LMNormalMonster
{
	Id: number;
	Fighting: number;
	XiezhanId: Array<number>;
	ResetNum: number;
	Kill: number;
	constructor(data?);
}
declare class LMEliteMonster
{
	Id: number;
	Show: PlayerShow ;
	ServerName: string ;
	camp: number;
	Hp: number;
	ChallengeNum: number;
	Kill: number;
	shield: number;
	MaxHp: number;
	constructor(data?);
}
declare class LMXieZhan
{
	xiezhanId: number;
	PartenType: Array<number>;
	PartnerNum: number;
	PartnerId: Array<number>;
	Quality: Array<number>;
	PetId: Array<string>;
	constructor(data?);
}
declare class J2CSZLMKillBoss
{
	Prize: Array<ItemInfo>;
	constructor(data?);
}
declare class J2CSZLMEliteMonsterInfo
{
	Id: number;
	Hp: number;
	Kill: number;
	shield: number;
	MaxHp: number;
	constructor(data?);
}
declare class C2SSZLMGuwu
{
	GuwuCount: number;
	constructor(data?);
}
declare class C2SSZLMResetMonster
{
	MonsterId: number;
	ResetCount: number;
	constructor(data?);
}
declare class S2CSZLMGuwu
{
	Tag: number;
	GuwuNum: number;
	RightGuwuNum: number;
	constructor(data?);
}
declare class S2CSZLMResetMonster
{
	Tag: number;
	constructor(data?);
}
declare class C2JSZLMInfo
{
	constructor(data?);
}
declare class J2CSZLMEnd
{
	Camp: number;
	BlockId: number;
	MyCamp: number;
	constructor(data?);
}
declare class C2SWeiXinShareSuccess
{
	Typ: number;
	constructor(data?);
}
declare class C2SFriendHelpDraw
{
	constructor(data?);
}
declare class S2CFriendHelpDraw
{
	Tag: number;
	constructor(data?);
}
declare class C2SFYTZRequestBind
{
	BindTargetUserId: number;
	RequestUserNick: string ;
	constructor(data?);
}
declare class S2CFYTZRequestBind
{
	Tag: number;
	BindTargetUserId: number;
	constructor(data?);
}
declare class S2CFYTZRequestBindO
{
	RequestUserId: number;
	RequestUserNick: string ;
	constructor(data?);
}
declare class C2SFYTZResponseBind
{
	RequestUserId: number;
	Op: number;
	constructor(data?);
}
declare class S2CFYTZResponseBind
{
	Tag: number;
	RequestUserId: number;
	Op: number;
	constructor(data?);
}
declare class S2CFYTZResponseBindO
{
	Tag: number;
	BindTargetUserId: number;
	Op: number;
	constructor(data?);
}
declare class C2SFYTZUnBind
{
	constructor(data?);
}
declare class S2CFYTZUnBind
{
	Tag: number;
	constructor(data?);
}
declare class C2SFYTZGetBindUserInfo
{
	constructor(data?);
}
declare class S2CFYTZGetBindUserInfo
{
	Tag: number;
	BindUserId: number;
	Nick: string ;
	Level: number;
	OfflineTime: number;
	constructor(data?);
}
declare class C2SGetShowUserInfo
{
	UserId: number;
	constructor(data?);
}
declare class S2CGetShowUserInfo
{
	Tag: number;
	ShowUserInfo: ShowUserInfo ;
	constructor(data?);
}
declare class C2SGetHelpXunBaoData
{
	ActId: number;
	constructor(data?);
}
declare class S2CGetHelpXunBaoData
{
	Tag: number;
	ActId: number;
	TotalTimes: number;
	BigPrizeNum: number;
	TodayDrawTimes: number;
	constructor(data?);
}
declare class C2SItemLianHua
{
	Items: Array<string>;
	constructor(data?);
}
declare class S2CItemLianHua
{
	Tag: number;
	CurrLevel: number;
	CurrExp: number;
	constructor(data?);
}
declare class C2SListLianHua
{
	constructor(data?);
}
declare class S2CListLianHua
{
	SysState: Array<SysState>;
	constructor(data?);
}
declare class SysState
{
	Type: number;
	Value: string ;
	constructor(data?);
}
declare class WishTreeItemStatus
{
	Item1Id: number;
	Status1: number;
	Item2Id: number;
	Status2: number;
	Item3Id: number;
	Status3: number;
	Item4Id: number;
	Status4: number;
	constructor(data?);
}
declare class C2SGetWishTreeInfo
{
	ActId: number;
	constructor(data?);
}
declare class S2CGetWishTreeInfo
{
	Tag: number;
	ActId: number;
	TreeInfo: WishTreeItemStatus ;
	Times: number;
	IsOpen: number;
	constructor(data?);
}
declare class C2SReceiveWishTreeReward
{
	ActId: number;
	constructor(data?);
}
declare class S2CReceiveWishTreeReward
{
	Tag: number;
	constructor(data?);
}
declare class C2SSelectWishTreeReward
{
	ActId: number;
	Type: number;
	Id: number;
	constructor(data?);
}
declare class S2CSelectWishTreeReward
{
	Tag: number;
	constructor(data?);
}
declare class C2SBirthday
{
	ActId: number;
	constructor(data?);
}
declare class S2CBirthday
{
	Tag: number;
	Score: number;
	Reward: Array<number>;
	ActId: number;
	constructor(data?);
}
declare class C2SDoCake
{
	ActId: number;
	ItemId: number;
	Auto: number;
	constructor(data?);
}
declare class S2CDoCake
{
	Tag: number;
	ActId: number;
	ItemId: number;
	constructor(data?);
}
declare class C2SReceiveAllCake
{
	ActId: number;
	constructor(data?);
}
declare class S2CReceiveAllCake
{
	Tag: number;
	ActId: number;
	constructor(data?);
}
declare class C2SGetPuTianTongQingData
{
	ActId: number;
	constructor(data?);
}
declare class S2CGetPuTianTongQingData
{
	Tag: number;
	ActId: number;
	Day: number;
	RecDays: Array<RecDays>;
	RecCumDays: Array<RecDays>;
	constructor(data?);
}
declare class RecDays
{
	Day: number;
	State: number;
	constructor(data?);
}
declare class C2SRecPuTianTongQing
{
	ActId: number;
	Types: number;
	Day: number;
	constructor(data?);
}
declare class S2CRecPuTianTongQing
{
	Tag: number;
	constructor(data?);
}
declare class C2SGetYiLuYouNiData
{
	ActId: number;
	constructor(data?);
}
declare class S2CGetYiLuYouNiData
{
	Tag: number;
	ActId: number;
	Score: number;
	constructor(data?);
}
declare class C2SRecYiLuYouNi
{
	ActId: number;
	constructor(data?);
}
declare class S2CRecYiLuYouNi
{
	Tag: number;
	constructor(data?);
}
declare class C2SCampPKInfo
{
	ActId: number;
	constructor(data?);
}
declare class S2CCampPKInfo
{
	Tag: number;
	ActId: number;
	AScore: number;
	BScore: number;
	MyScore: number;
	Rewards: Array<number>;
	MyCamp: number;
	ServerRewards: Array<number>;
	ANum: number;
	BNum: number;
	constructor(data?);
}
declare class C2SSelectCamp
{
	ActId: number;
	Camp: number;
	constructor(data?);
}
declare class S2CSelectCamp
{
	Tag: number;
	ActId: number;
	Camp: number;
	constructor(data?);
}
declare class C2SDoVote
{
	ActId: number;
	ItemId: number;
	Auto: number;
	constructor(data?);
}
declare class S2CDoVote
{
	Tag: number;
	ActId: number;
	MyScore: number;
	Score: number;
	constructor(data?);
}
declare class CampRewardRecords
{
	Camp: number;
	UserId: number;
	Nick: string ;
	World: string ;
	Num: number;
	constructor(data?);
}
declare class C2SCampRewardRecords
{
	ActId: number;
	constructor(data?);
}
declare class S2CCampRewardRecords
{
	Tag: number;
	ActId: number;
	Records: Array<CampRewardRecords>;
	constructor(data?);
}
declare class C2SExchangeAtRShop
{
	ActId: number;
	Gid: number;
	constructor(data?);
}
declare class S2CExchangeAtRShop
{
	Tag: number;
	constructor(data?);
}
declare class YearTimeShop
{
	GoodId: number;
	Status: number;
	constructor(data?);
}
declare class C2SGetYearTimeShop
{
	ActId: number;
	constructor(data?);
}
declare class S2CGetYearTimeShop
{
	Tag: number;
	ActId: number;
	Items: Array<YearTimeShop>;
	constructor(data?);
}
declare class C2SYearTimeShopRefresh
{
	ActId: number;
	constructor(data?);
}
declare class S2CYearTimeShopRefresh
{
	Tag: number;
	constructor(data?);
}
declare class C2SYearTimeShopExchange
{
	ActId: number;
	GoodId: number;
	constructor(data?);
}
declare class S2CYearTimeShopExchange
{
	Tag: number;
	constructor(data?);
}
declare class Act1RMBPetRecord
{
	UserId: number;
	Nick: string ;
	AreaId: number;
	PetIndexId: number;
	constructor(data?);
}
declare class C2S1RMBPet
{
	ActId: number;
	constructor(data?);
}
declare class S2C1RMBPet
{
	Tag: number;
	ActId: number;
	PetId: number;
	Amount: number;
	Timestamp: number;
	PublicityTime: number;
	Records: Array<Act1RMBPetRecord>;
	MyAmount: number;
	constructor(data?);
}
declare class C2SHiedActRed
{
	ActId: number;
	constructor(data?);
}
declare class C2SBangDanJJSetPartnerPos
{
	JJId: number;
	UnitData: BangDanJJUnitData ;
	constructor(data?);
}
declare class S2CBangDanJJSetPartnerPos
{
	Tag: number;
	JJId: number;
	UnitData: BangDanJJUnitData ;
	constructor(data?);
}
declare class C2SBangDanJJInfo
{
	constructor(data?);
}
declare class S2CBangDanJJInfo
{
	Tag: number;
	AllData: Array<BangDanJJData>;
	constructor(data?);
}
declare class BangDanJJData
{
	JJId: number;
	HaveFight: number;
	ETime: number;
	State: number;
	LeftTimes: number;
	MyRank: number;
	Damage: number;
	TDamage: number;
	UnitData: BangDanJJUnitData ;
	constructor(data?);
}
declare class BangDanJJUnitData
{
	HeroId: number;
	PetId1: string ;
	PetId2: string ;
	PetId3: string ;
	PetAId: number;
	AlienId: number;
	constructor(data?);
}
declare class C2SBangDanJJFight
{
	JJId: number;
	constructor(data?);
}
declare class S2CBangDanJJFight
{
	Tag: number;
	JJId: number;
	FirstTotalNum: number;
	MyRank: number;
	MyTotalNum: number;
	ItemData: Array<ItemData>;
	constructor(data?);
}
declare class BangDanJJUnitDamage
{
	UnitType: number;
	Id: number;
	Damage: number;
	SkinId: number;
	Rarity: number;
	Quality: number;
	PetType: number;
	constructor(data?);
}
declare class BangDanRankReport
{
	Id: number;
	Units: Array<BangDanJJUnitDamage>;
	Report: S2CBattlefieldReport ;
	constructor(data?);
}
declare class BangDanJJRank
{
	Id: number;
	Rank: number;
	AreaId: number;
	Head: number;
	HeadFrame: number;
	Nick: string ;
	Damage: number;
	World: string ;
	Vip: number;
	HideVIP: number;
	constructor(data?);
}
declare class C2SBangDanJJRankInfo
{
	JJId: number;
	Type: number;
	constructor(data?);
}
declare class S2CBangDanJJRankInfo
{
	Tag: number;
	JJId: number;
	Type: number;
	List: Array<BangDanJJRank>;
	MyRank: number;
	Damage: number;
	TDamage: number;
	constructor(data?);
}
declare class C2SBangDanJJViewFight
{
	JJId: number;
	Type: number;
	PlayerId: number;
	constructor(data?);
}
declare class S2CBangDanJJViewFight
{
	Tag: number;
	JJId: number;
	Type: number;
	PlayerId: number;
	Report: BangDanRankReport ;
	constructor(data?);
}
declare class S2CBangDanJJTimesInfo
{
	JJId: number;
	LeftTimes: number;
	HaveFight: number;
	constructor(data?);
}
declare class S2CBangDanJJStateInfo
{
	JJId: number;
	ETime: number;
	State: number;
	constructor(data?);
}
declare class C2SBangDanJJSweep
{
	JJId: number;
	constructor(data?);
}
declare class S2CBangDanJJSweep
{
	Tag: number;
	JJId: number;
	Times: number;
	MyRank: number;
	MaxDamage: number;
	ItemData: Array<ItemData>;
	constructor(data?);
}
declare class C2SPetEquipBuild
{
	Id: number;
	EffectId: number;
	constructor(data?);
}
declare class S2CPetEquipBuild
{
	Tag: number;
	Id: string ;
	constructor(data?);
}
declare class C2SPetEquipStarUp
{
	ItemId: string ;
	constructor(data?);
}
declare class S2CPetEquipStarUp
{
	Tag: number;
	constructor(data?);
}
declare class C2SPetEquipQualityUp
{
	ItemId: string ;
	constructor(data?);
}
declare class S2CPetEquipQualityUp
{
	Tag: number;
	constructor(data?);
}
declare class C2SPetEquipSmelt
{
	ItemIds: Array<string>;
	constructor(data?);
}
declare class S2CPetEquipSmelt
{
	Tag: number;
	constructor(data?);
}
declare class C2SPetEquipWear
{
	PetId: string ;
	ItemId: string ;
	constructor(data?);
}
declare class S2CPetEquipWear
{
	Tag: number;
	Pet2: Pet2 ;
	ItemId: string ;
	constructor(data?);
}
declare class C2SPetEquipExchangeWear
{
	PetId: string ;
	ItemId: string ;
	constructor(data?);
}
declare class S2CPetEquipExchangeWear
{
	Tag: number;
	ItemId: string ;
	DPet2: Pet2 ;
	TPet2: Pet2 ;
	ItemId2: string ;
	constructor(data?);
}
declare class C2SPetEquipTakeOff
{
	PetId: string ;
	ItemId: string ;
	constructor(data?);
}
declare class S2CPetEquipTakeOff
{
	Tag: number;
	Pet2: Pet2 ;
	Part: number;
	constructor(data?);
}
declare class C2SPetEquipOneKeyWear
{
	PetId: string ;
	constructor(data?);
}
declare class S2CPetEquipOneKeyWear
{
	Tag: number;
	Pet2: Pet2 ;
	constructor(data?);
}
declare class C2SPetEquipOneKeyTakeOff
{
	PetId: string ;
	constructor(data?);
}
declare class S2CPetEquipOneKeyTakeOff
{
	Tag: number;
	Pet2: Pet2 ;
	constructor(data?);
}
declare class C2SPetEquipSaveInfo
{
	List: Array<number>;
	constructor(data?);
}
declare class S2CPetEquipSaveInfo
{
	List: Array<number>;
	constructor(data?);
}
declare class C2SPetEquipLock
{
	Id: string ;
	constructor(data?);
}
declare class S2CPetEquipLock
{
	Tag: number;
	Id: string ;
	Lock: number;
	constructor(data?);
}
declare class S2CPetEquipFly
{
	Ids: Array<string>;
	constructor(data?);
}
declare class C2SGetFuDaiData
{
	ActId: number;
	constructor(data?);
}
declare class S2CGetFuDaiData
{
	Tag: number;
	ActId: number;
	FuDaiData: Array<FuDaiData>;
	constructor(data?);
}
declare class FuDaiData
{
	ActId: number;
	Types: number;
	Id: number;
	DayTimes: number;
	LifeTimes: number;
	constructor(data?);
}
declare class C2SBuyFuDai
{
	ActId: number;
	Types: number;
	Id: number;
	constructor(data?);
}
declare class S2CBuyFuDai
{
	Tag: number;
	ActId: number;
	Types: number;
	Id: number;
	Prize: Array<ItemInfo>;
	constructor(data?);
}
declare class C2SGetNightData
{
	ActId: number;
	constructor(data?);
}
declare class S2CGetNightData
{
	Tag: number;
	ActId: number;
	constructor(data?);
}
declare class C2SNightMake
{
	ActId: number;
	Id: number;
	constructor(data?);
}
declare class S2CNightMake
{
	Tag: number;
	ActId: number;
	Id: number;
	constructor(data?);
}
declare class RewardLog
{
	PlayerId: number;
	Nick: string ;
	AreaId: number;
	World: string ;
	Timestamp: number;
	ItemId: number;
	ItemNum: number;
	constructor(data?);
}
declare class C2SNightRewardLog
{
	ActId: number;
	constructor(data?);
}
declare class S2CNightRewardLog
{
	Tag: number;
	ActId: number;
	RewardLog: Array<RewardLog>;
	constructor(data?);
}
declare class Attr
{
	Key: Array<string>;
	AttrId: number;
	Multi: number;
	ExtMulti: number;
	Attrs: Array<IntAttr>;
	FV: number;
	constructor(data?);
}
declare class C2SGetAttr
{
	Keys: Array<string>;
	constructor(data?);
}
declare class S2CGetAttr
{
	Attrs: Array<Attr>;
	FV: number;
	constructor(data?);
}
declare class S2CSendActiveNotice
{
	ActiveId: number;
	PicPath: string ;
	IconPath: string ;
	TitlePath: string ;
	StartDate: number;
	EndDate: number;
	State: number;
	constructor(data?);
}
