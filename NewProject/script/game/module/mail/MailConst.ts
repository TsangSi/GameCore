/*
 * @Author: kexd
 * @Date: 2022-06-14 16:11:10
 * @FilePath: \SanGuo2.4\assets\script\game\module\mail\MailConst.ts
 * @Description: 邮件常量
 *
 */

import { TabData } from '../../com/tab/TabData';
import { RID } from '../reddot/RedDotConst';
import { i18n, Lang } from '../../../i18n/i18n';

export enum EMailState {
    /** 未读或未领取 */
    UnreadOrUnReceive = 1,
    /** 已读或已领取 */
    ReadedOrReceived = 2,
}

export enum MailPageType {
    /** 普通邮件 */
    Normal = 0,
    /** 重要邮件 */
    Important = 1,
}

/** 邮件页签类别 */
export const MailPageTabs: TabData[] = [
    {
        id: MailPageType.Normal,
        title: i18n.tt(Lang.mail_tab_0),
        redId: RID.Bag.Mail.Normal,
    },
    {
        id: MailPageType.Important,
        title: i18n.tt(Lang.mail_tab_1),
        redId: RID.Bag.Mail.Importance,
    },
];
