import {
 Component, AnimationClip, Sprite, SpriteAtlas, SpriteFrame, utils, _decorator, Node, EventTouch, Color,
} from 'cc';
import { DEBUG } from 'cc/env';
import { EffectManager } from '../../common/EffectManager';
import { EventM } from '../../core/event/EventM';
import { ResManager } from '../../common/ResManager';
import { ServerMonitor } from '../../common/ServerMonitor';
import List from '../../component/List';
import GlobalConfig from '../../config/GlobalConfig';
import { FColor } from '../../global/GConst';
import HttpManager from '../../net/HttpManager';
import { ReportManager } from '../../net/ReportManager';
import UtilsCC from '../../utils/UtilsCC';
import UtilsStorage from '../../utils/UtilsStorage';
import { BaseView } from '../base/BaseView';
import MsgToast from '../Toast/MsgToast';
import { UI_NAME } from '../UIConfig';
import UIManager from '../UIManager';
import LoginCC from './LoginCC';
import LoginManager from './LoginManager';

const { ccclass, property } = _decorator;

interface pageInfo {
    labelText: string,
    min: number,
    max: number,
    page: number
}

interface JobInfo {
    AnimID: number,
    HeadImg: string,
    RaceID: number,
    RaceImg: string,
    RaceName: string,
    RoleID: number,
    RoleImg: string,
    Sex: number,
    SexImg: string,
    Skills: string,
    Sort: number,
    WeaponID: number,
    IsDefault?: number
}

@ccclass('ServerChose')
export class ServerChose extends BaseView {
    @property(List)
    private serverlist_list: List = undefined;

    @property(List)
    private serveritem_list: List = undefined;

    @property(Node)
    private serverlist_content: Node = undefined;

    @property(Node)
    private serveritem_content: Node = undefined;

    private list_nodes = {};
    private select_index = -1;
    private cur_server_list = [];
    private serverInfo: any = null;
    private list1Arg = [];
    private groupNum = 20;
    onLoad() {
        UtilsCC.setClickEvent('bg/btn_close', this.node, 'on_close_clicked', this);
        UtilsCC.setClickEvent('bg/btn_fanhui', this.node, 'on_close_clicked', this);
    }

    start() {
        this.showList(LoginManager.I.getServerInfo());
    }
    showList(info: any) {
        this.serverInfo = info;

        // 处理数据
        // 左侧列表
        this.list1Arg.length = 0;
        // 第一个是最近登录
        const _recArg = [{
            labelText: '最近登录',
            page: -1,
        }];
        // 根据max_id分页
        const _arg = DEBUG ? this.getPageFunDebug() : this.getPageFun();

        this.list1Arg = [..._recArg, ..._arg];

        // this.serverlist_list.numItems = this.list1Arg.length;

        UtilsCC.ensureListableChildren(this.serverlist_content, this.list1Arg.length);
        for (let i = 0, n = this.list1Arg.length; i < n; i++) {
            const node = this.serverlist_content.children[i];
            this.onRenderList(node, i);

            if (i === 0) {
                this.on_selectlist_clicked(undefined, 0);
            }
        }
    }

    // on_close_clicked () {
    //     UIManager.I.close(UI_NAME.ServerChose);
    // }

    on_selectlist_clicked(e: EventTouch, index: number) {
        if (this.select_index === index) { return; }
        const old_node = this.list_nodes[this.select_index];
        const new_node = this.list_nodes[index];
        if (old_node) {
            // UtilsCC.setSpriteFrameIndex(old_node, 0);
            UtilsCC.setColor('Label', old_node, FColor.Normall);
        }
        if (new_node) {
            // UtilsCC.setSpriteFrameIndex(new_node, 1);
            UtilsCC.setColor('Label', new_node, FColor.White);
        }
        this.select_index = index;
        const lac = UtilsStorage.getItem('acc_token');
        if (lac && JSON.parse(lac).account_id) {
            this.updateRightList();
        }
    }

    onRenderList(item: Node, index: number) {
        UtilsCC.setClickEventOnly(item, 'on_selectlist_clicked', this, index);
        item.name = `item_${index}`;
        this.list_nodes[index] = item;
        item.active = true;
        UtilsCC.setString('Label', item, this.list1Arg[index].labelText);
    }

    updateRightList() {
        const lac = UtilsStorage.getItem('acc_token');
        const lac_d = JSON.parse(lac);
        if (!lac_d.account_id) {
            MsgToast.ShowWithColor('用户ID获取错误', 5000);
            return;
        }
        if (!lac_d.token) {
            MsgToast.ShowWithColor('Token获取错误', 5000);
            return;
        }
        const item_data = this.list1Arg[this.select_index];
        if (item_data.page < 0) {
            const cur_server = this.serverInfo.play_server;
            this.updateItems(cur_server);
        } else {
            this.getServerInfo(item_data, lac_d.account_id, lac_d.token);
        }
    }

    updateItems(servers) {
        const c = this.list1Arg[this.select_index];
        const is_diy = DEBUG && c && c.page >= 0 && c.labelText !== '全部';
        this.cur_server_list.length = 0;
        const name = this.list1Arg[this.select_index].labelText;
        for (let i = 0, n = servers.length; i < n; i++) {
            if (!is_diy || servers[i].area_name.indexOf(name) >= 0) {
                this.cur_server_list.push(servers[i]);
            }
        }

        // this.serveritem_list.numItems = this.cur_server_list.length;
        // this.serveritem_list.scrollTo(0, 0.1);

        UtilsCC.ensureListableChildren(this.serveritem_content, this.cur_server_list.length);
        for (let i = 0, n = this.cur_server_list.length; i < n; i++) {
            const node = this.serveritem_content.children[i];
            this.onRenderItem(node, i);
        }
    }

    getServerInfo(data, uid, token) {
        // 请求服务器列表，判断是否有角色，从而判断是进入开始游戏界面，还是创建角色界面
        const reqData = {
            account_id: uid,
            token,
            pf: LoginManager.I.platform,
            ver: LoginManager.I.version,
            cps_id: LoginManager.I.channel_id ? LoginManager.I.channel_id : 0,
            min_id: data.min,
            max_id: data.max,
        };

        const need_show_name = [
            // '崔刚',
            // '俊惠',
            // '刘钊',
            // '艺韬',
            // '李浩',
            // '王浩'
        ];

        HttpManager.I.post(`${GlobalConfig.I.httpUrl}/api/playServerInfo`, reqData, (res2) => {
            res2 = JSON.parse(res2);
            if (res2.code === 1) {
                // let new_list = [];
                const _rep = res2.data.server_info.all_server;
                // for (let i = 0; i < _rep.length; i++) {
                //     for (let j = 0; j < need_show_name.length; j++) {
                //         if (_rep[i].area_name.indexOf(need_show_name[j]) >= 0) {
                //             new_list.push(_rep[i]);
                //             break;
                //         }
                //     }
                // }
                UtilsStorage.setItem('serverInfo', JSON.stringify(res2));
                this.updateItems(_rep);
            }
        });
    }
    onRenderItem(node: Node, index: number) {
        const item = this.cur_server_list[index];
        node.active = true;
        UtilsCC.setClickEventOnly(node, 'on_selectitem_clicked', this, index);

        const _data = item;
        if (!_data) {
            return;
        }
        // 0:维护1:正常,2:火爆，3新区
        let _str1 = ''; let // 左上角状态
            _str2 = '';// 圆形状态

        const _base = 'i/m/login/serverChose/';

        switch (_data.server_status) {
            case LoginManager.PlayServerStatus.dele:
                // 删除了
                _str1 = `${_base}img_jb_weihu`;
                _str2 = 'i/com/g/img_yongyou_dis';
                break;
            case LoginManager.PlayServerStatus.maintain:
                // 维护
                _str1 = `${_base}img_jb_weihu`;
                _str2 = 'i/com/g/img_yongyou_dis';
                break;
            case LoginManager.PlayServerStatus.normal:
                // 正常
                _str2 = `${_base}img_fwqlv`;
                break;
            case LoginManager.PlayServerStatus.hot:
                // 火爆
                _str1 = `${_base}img_jb_huobao`;
                _str2 = `${_base}img_fwqhong`;
                break;
            case LoginManager.PlayServerStatus.new:
                // 新区
                _str1 = `${_base}img_jb_new`;
                _str2 = `${_base}img_fwqlv`;
                break;
            case LoginManager.PlayServerStatus.test:
                // 测试
                _str1 = `${_base}img_jb_ceshi`;
                _str2 = `${_base}img_fwqlv`;
                break;
            default:
                _str2 = `${_base}img_fwqlv`;
                break;
        }
        if (_str1) {
            this.setSprite('state2', node, _str1);
            UtilsCC.setActive('state2', node, true);
        } else {
            UtilsCC.setActive('state2', node, false);
        }
        this.setSprite('state', node, _str2);
        UtilsCC.setString('Label', node, _data.area_name);
        // 如果有角色，显示角色头像
        if (_data.role_id) {
            const _d = this.getCfgJobInfoByRoleId(_data.role_id);

            if (_d) {
                this.setSprite('frame/head', node, `i/m/roleHead/${_d.HeadImg}`);
                // UtilsCC.setHeadIcon('frame/head', node, _d.HeadImg);
            }
            UtilsCC.setActive('frame/head', node, true);
            UtilsCC.setActive('frame', node, true);
        } else {
            UtilsCC.setActive('frame/head', node, false);
            UtilsCC.setActive('frame', node, false);
        }
    }

    on_selectitem_clicked(e: EventTouch, index: number) {
        // 进入游戏
        // 建立websocket 连接
        const _itemData = this.cur_server_list[index];
        if (!_itemData) {
            return;
        }
        const _serverState = LoginManager.I.chargeServerStatus(_itemData.server_status, _itemData.role_id);
        if (!_serverState || !_serverState.b) {
            if (_serverState.msg) {
                MsgToast.ShowWithColor(_serverState.msg || '');
            }
            return;
        }

        ServerMonitor.I.game_server.userId = _itemData.user_id;
        ServerMonitor.I.game_server.serverId = _itemData.server_id;
        ServerMonitor.I.game_server.areaId = _itemData.area_id;
        LoginManager.I.C2SLogin({
            AreaId: ServerMonitor.I.game_server.areaId,
        });
        // 如果没有角色，进入角色创建页面
        if (!_itemData.role_id) {
            UIManager.I.close(UI_NAME.ServerChose);
            UIManager.I.show(UI_NAME.CreateRole, undefined, { serverData: _itemData });
            ReportManager.I.SendDelay(ReportManager.Type.LoadCreateRole);
            // CreateRole.CreateData = _itemData;
            // Loading.mustLoadPrefab(UI_PH.StartLoading, (p: cc.Prefab) => {
            //     let node = cc.instantiate(p);
            //     GmMgr.I.loginUI.addChild(node);
            // })
            // return;
        }
        const _serverIpArg = _itemData.server_addr.split('|');
        let _serverIp: any;
        if (ServerMonitor.I.getWSType() === 'ws') {
            _serverIp = _serverIpArg[0];
        } else if (ServerMonitor.I.getWSType() === 'wss') {
            _serverIp = _serverIpArg[1];
        }

        ServerMonitor.I.game_server.ws = _serverIpArg[0];
        ServerMonitor.I.game_server.wss = _serverIpArg[1];
        LoginManager.I.user_id = _itemData.user_id;
        LoginManager.I.selectVersion = _itemData.client_ver;

        const _obj = {
            ws: _serverIpArg[0],
            wss: _serverIpArg[0],
        };
        UtilsStorage.setItem('wsInfo', JSON.stringify(_obj));

        if (!_serverIp) {
            return;
        }
        const _lac = UtilsStorage.getItem('acc_token');
        const _lacD = JSON.parse(_lac);
        if (!_lacD.account_id) {
            return;
        }
        if (!_lacD.token) {
            return;
        }
        UIManager.I.close(UI_NAME.ServerChose);
        // _itemData.area_name
        // StartGame.instance.ServerName.string = _itemData.area_name;
        // StartGame.instance.curServerData = _itemData;
        EventM.I.fire(EventM.Type.Login.UpdateSelectServer, _itemData);
    }

    getPageFun() {
        const _arg: pageInfo[] = [];
        // 根据根据max_id以及this.groupNum计算分页
        const _maxId: any = this.serverInfo.max_id;
        const _group: any = this.groupNum;// 分组
        if (_maxId / _group <= 1) {
            _arg.push({
                labelText: `1 - ${this.groupNum}服`,
                min: 1,
                max: this.groupNum,
                page: 1,
            });
            return _arg;
        }
        const _sf: any = _maxId / _group;
        let _s = parseInt(_sf);// 商
        const _y = _maxId % _group;// 余
        // 只要有余数，分页加1
        if (_y) {
            _s += 1;
        }
        for (let i = 0; i < _s; i++) {
            const _start = _group * i + 1;
            const _end = _group * (i + 1);
            const _page = i + 1;
            const _o = {
                labelText: `${_start} - ${_end}服`,
                min: _start,
                max: _end,
                page: _page,
            };
            _arg.push(_o);
        }
        // 排序，最新的服务器在最上面
        _arg.sort((a, b) => b.page - a.page);
        return _arg;
    }
    private names = [
        '测试',
        '增光',
        '林俊惠',
        '阳添',
        '明珠',
        '张童',
        '钟旭忠',
        '黄栎机',
        '崔刚',
        '刘钊',
        '王魁',
        '吴艺韬',
        '马静',
        '孙志勇',
        '兰才涛',
        '钮浩',
        '韩辉',
        '后台',
        '李浩',
        '全部',
    ];
    getPageFunDebug() {
        const _arg: pageInfo[] = [];
        for (let i = 0, n = this.names.length; i < n; i++) {
            _arg.push({
                labelText: this.names[i],
                min: 1,
                max: this.groupNum,
                page: 1,
            });
        }
        return _arg;
    }

    // 为了解决登录页在配置表加载之前初始化的问题
    private cfgJob: JobInfo[] = [
        {
            AnimID: 3001,
            HeadImg: 'role_1',
            RaceID: 1,
            RaceImg: 'img_renzu',
            RaceName: '人族',
            RoleID: 1,
            RoleImg: 'img_nanjuese1',
            Sex: 1,
            SexImg: '1',
            Skills: '104|102|103|101|105',
            Sort: 1,
            WeaponID: 4131,
        },
        {
            AnimID: 3002,
            HeadImg: 'role_2',
            IsDefault: 1,
            RaceID: 1,
            RaceImg: 'img_renzu',
            RaceName: '人族',
            RoleID: 2,
            RoleImg: 'img_nvjuese1',
            Sex: 2,
            SexImg: '2',
            Skills: '104|102|103|101|105',
            Sort: 2,
            WeaponID: 4132,
        },
        {
            AnimID: 3003,
            HeadImg: 'role_3',
            RaceID: 2,
            RaceImg: 'img_xianzu',
            RaceName: '仙族',
            RoleID: 3,
            RoleImg: 'img_nanjuese3',
            Sex: 1,
            SexImg: '1',
            Skills: '109|107|108|106|110',
            Sort: 3,
            WeaponID: 4133,
        },
        {
            AnimID: 3004,
            HeadImg: 'role_4',
            RaceID: 2,
            RaceImg: 'img_xianzu',
            RaceName: '仙族',
            RoleID: 4,
            RoleImg: 'img_nvjuese3',
            Sex: 2,
            SexImg: '2',
            Skills: '109|107|108|106|110',
            Sort: 4,
            WeaponID: 4134,
        },
        {
            AnimID: 3005,
            HeadImg: 'role_5',
            RaceID: 3,
            RaceImg: 'img_mozu',
            RaceName: '巫族',
            RoleID: 5,
            RoleImg: 'img_nanjuese2',
            Sex: 1,
            SexImg: '1',
            Skills: '114|112|113|111|115',
            Sort: 5,
            WeaponID: 4135,
        },
        {
            AnimID: 3006,
            HeadImg: 'role_6',
            RaceID: 3,
            RaceImg: 'img_mozu',
            RaceName: '巫族',
            RoleID: 6,
            RoleImg: 'img_nvjuese2',
            Sex: 2,
            SexImg: '2',
            Skills: '114|112|113|111|115',
            Sort: 6,
            WeaponID: 4136,
        },
    ];

    getCfgJob() {
        return this.cfgJob;
    }
    getCfgJobInfoByRoleId(roleId: number) {
        const _data = this.cfgJob;
        let _d: JobInfo = null;
        for (let i = 0, l = _data.length; i < l; i++) {
            const _item = _data[i];
            if (roleId === _item.RoleID) {
                _d = _item;
                break;
            }
        }
        return _d;
    }
    onDestroy() {

    }
}
