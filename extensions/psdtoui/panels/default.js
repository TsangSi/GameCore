'use strict';
const Path = require('path');
const Fs = require('fs');
// const Convert = require('./psd2fgui/convert');
var psd2fgui = require("./psd2fgui/lib.js");
const gm = require("./psd2fgui/node_modules/gm/index").subClass({imageMagick: true});;

const { IncomingMessage } = require('http');


let img_uuids = [];

// html 文本
// exports.template = Fs.readFileSync(Path.join(__dirname, './template/home.html'), 'utf-8');
exports.template = `
<div>
<input type="file" class="filedia" accept=".psd" >
</div>
<div>
    <ui-tree class="example" ref="example" style="width:280px; height: 600px; float:left; display:inline"></ui-tree>
    <ui-label value="资源目录名"></ui-label>
    <ui-prop name="MainFoldNmae" slidable tooltip="该界面的图片目录">
        <ui-input style="text-align:right;" class="foldname" value="res fold"></ui-input>
    </ui-prop>

    <div style="float:left; width: 200px">
        <ui-label value="节点属性"></ui-label>

        <div style="float:left; width:200px;">
            <ui-prop slidable tooltip="节点名字">
                <span>名字：</span><ui-input style="width:120px; text-align:right;" class="nodename" value""></ui-input>
            </ui-prop>
            <ui-checkbox class="hulue">不导出该资源</ui-checkbox>
        </div>
        <div class="div_scale9" style="float:left; width:200px;">
            <ui-label value="九宫格属性"></ui-label>
            <ui-prop slidable tooltip="上、下">
                <span>top:</span><ui-input style="width:50px; text-align:right;" class="scale9top" value""></ui-input>
                <span>bottom:</span><ui-input style="width:50px; text-align:right;" class="scale9bottom" value""></ui-input>
            </ui-prop>
            <ui-prop slidable tooltip="左、右">
                <span>left:</span><ui-input style="width:50px; text-align:right;" class="scale9left" value=""></ui-input>
                <span>   right:</span><ui-input style="width:50px; text-align:right;" class="scale9right" value=""></ui-input>
            </ui-prop>
            <ui-button class="btn_reduction">还原</ui-button>
            <ui-button class="btn_save">保存</ui-button>
        </div>
    </div>    
</div>

<div class="div_res" style="float:left; width:800px; height:620px">
    <ui-prop slidable tooltip="该资源路径">
        <span>该资源路径：</span><ui-input style="text-align:right;width:300px;" class="img_res_path" value=""></ui-input>
    </ui-prop>
    <ui-button class="btn_change_path">修改</ui-button>
    <ui-asset class="img_res" style="width:300px;" droppable="cc.ImageAsset" value=""></ui-asset>
    <ui-image class="image" value=""></ui-image>
</div>
`;
// console.log('1222');
// 样式文本
exports.style = '';
// 渲染后 html 选择器
exports.$ = {
    filedia: '.filedia',
    example: '.example',
    nodename: '.nodename',
    foldname: '.foldname',
    hulue: '.hulue',
    img_res_path: '.img_res_path',
    img_res: '.img_res',
    image: '.image',
    btn_reduction: '.btn_reduction',
    btn_save: '.btn_save',
    scale9top: '.scale9top',
    scale9bottom: '.scale9bottom',
    scale9left: '.scale9left',
    scale9right: '.scale9right',
    div_scale9: '.div_scale9',
    div_res: '.div_res',
    btn_change_path: '.btn_change_path',
    // fileclass: '.fileclass',
    // label_file: '$label_file',
    // header: 'header',
    // test: '.test',
};

exports.load = function () {
    console.log('default.js load');
}
// 面板上的方法
exports.methods = {
    // on_reduction_clicked() {
    //     console.log('还原');
    //     let common = this.common_res[this.cur_select_id];
    //     if (common && common.new_scale9Grid) {
    //         this.$.scale9top.value = common.new_scale9Grid[0] = common.scale9Grid[0];
    //         this.$.scale9bottom.value = common.new_scale9Grid[1] = common.scale9Grid[1];
    //         this.$.scale9left.value = common.new_scale9Grid[2] = common.scale9Grid[2];
    //         this.$.scale9right.value = common.new_scale9Grid[3] = common.scale9Grid[3];
            
    //     }
    // },

    // on_save_clicked() {
    //     console.log('保存');
    //     let common = this.common_res[this.cur_select_id];
    //     if (common && common.new_scale9Grid) {
    //         common.new_scale9Grid[0] = this.$.scale9top.value;
    //         common.new_scale9Grid[1] = this.$.scale9bottom.value;
    //         common.new_scale9Grid[2] = this.$.scale9left.value;
    //         common.new_scale9Grid[3] = this.$.scale9right.value;
    //     }

    // },

    click() {
        console.log('忽略');
    },
    showNodeTree(tree) {

        this.common_res = {};
        this.change_fold_res = {};


        this.$.example.setTemplate('text', `<span class="name"></span>`);
        this.$.example.setTemplateInit('text', ($text) => {
            $text.$name = $text.querySelector('.name');
            // $text.$link = $text.querySelector('.link');
        });
        this.$.example.setRender('text', ($text, data) => {
            $text.$name.innerHTML = data.name;
            // $text.$link.innerHTML = `link(${data.index})`;
        });

        // this.$.example.setTemplate('right', '<ui-icon value="reset"></ui-icon>');
        // this.$.example.setTemplateInit('right', ($right) => {
        //     $right.$refresh = $right.querySelector('ui-icon');
        //     $right.$refresh.addEventListener('click', (event) => {
        //         console.log($right.data);
        //     });
        // });

        this.$.example.tree = tree;

        this.$.example.addEventListener('keydown', (event) => {
            const $dom = this.$.example;
            if (event.code === 'ArrowUp') {
                const item = $dom.selectItems[$dom.selectItems.length - 1];
                const index = Math.max(item.index - 1, 0);
                if (event.shiftKey) {
                    $dom.select($dom.list[index]);
                } else {
                    $dom.clear();
                    $dom.select($dom.list[index]);
                }
                $dom.render();
            } else if (event.code === 'ArrowDown') {
                const item = $dom.selectItems[$dom.selectItems.length - 1];
                const index = Math.min(item.index + 1, $dom.list.length - 1);
                if (event.shiftKey) {
                    $dom.select($dom.list[index]);
                } else {
                    $dom.clear();
                    $dom.select($dom.list[index]);
                }
                $dom.render();
            }
        });

        this.$.example.setTemplateInit('item', ($div) => {
            const $dom = this.$.example;
            $div.addEventListener('click', (event) => {
                if (event.ctrlKey || event.metaKey) {
                    $dom.select($div.data);
                } else {
                    $dom.clear();
                    $dom.select($div.data);
                }
                $dom.render();
                // console.log('======', $div.data);
                this.$.nodename.value = $div.data.name;
                this.cur_select_id = $div.data.id;
                let select_common_info = this.common_res[this.cur_select_id];
                if ($div.data.src) {
                    let url = 'db://assets/textures/' + this.$.foldname.value + '/' + $div.data.src;
                    // let url = img_path + '/' + this.$.foldname.value + '/' + $div.data.src + '/spriteFrame';
                    /** 该资源是否有改过路径 */
                    // let sp_url = url+'/spriteFrame';
                    if (select_common_info && select_common_info.path) {
                        this.$.img_res.value = select_common_info.path;
                        this.$.image.value = select_common_info.path;
                        this.$.img_res_path.value = select_common_info.path;
                        // img_path = img_path + '/' + select_common_info.path;
                    } else {
                        if (this.change_fold_res[url]) {
                            this.$.img_res.value = this.change_fold_res[url];
                            this.$.image.value = this.change_fold_res[url] + '/spriteFrame';
                            this.$.img_res_path.value = this.change_fold_res[url];   
                        } else {
                            this.$.img_res.value = url;
                            this.$.image.value = url + '/spriteFrame';
                            this.$.img_res_path.value = url;
                        }
                    }
                    if (select_common_info && select_common_info.ischeck) {
                        this.$.hulue.value = true;
                    } else {
                        this.$.hulue.value = false;
                    }
                    
                    // 九宫格
                    if ($div.data.scale9Grid) {
                        if (!select_common_info) {
                            select_common_info = this.common_res[this.cur_select_id] = {};
                        }
                        if (!select_common_info.scale9Grid) {
                            select_common_info.scale9Grid = [];
                            select_common_info.new_scale9Grid = [];
                            for (let si = 0; si < $div.data.scale9Grid.length; si++) {
                                select_common_info.scale9Grid[si] = $div.data.scale9Grid[si];
                                select_common_info.new_scale9Grid[si] = $div.data.scale9Grid[si];
                            }
                        }
                        this.$.scale9top.value = select_common_info.new_scale9Grid[0];
                        this.$.scale9bottom.value = select_common_info.new_scale9Grid[1];
                        this.$.scale9left.value = select_common_info.new_scale9Grid[2];
                        this.$.scale9right.value = select_common_info.new_scale9Grid[3];
                    } else {
                        this.$.scale9top.value = 0;
                        this.$.scale9bottom.value = 0;
                        this.$.scale9left.value = 0;
                        this.$.scale9right.value = 0;
                    }
                    this.$.div_scale9.style.display = '';
                    this.$.div_res.style.display = '';   
                    this.$.hulue.style.display = '';
                } else {
                    this.$.div_scale9.style.display = 'none';
                    this.$.div_res.style.display = 'none';
                    this.$.hulue.style.display = 'none';
                }
            });
        });
        this.$.example.setRender('item', ($div, data) => {
            if (data.disabled) {
                $div.setAttribute('disabled', '');
            } else {
                $div.removeAttribute('disabled');
            }
        });

        this.$.example.setItemRender;

        this.$.example.css = `
            .item[disabled] {
                opacity: 0.4;
            }

            .text > .link {
                margin-left: 10px;
                cursor: pointer;
                color: yellow;
            }

            .right > ui-icon {
                cursor: pointer;
                color: green;
            }
        `;
    
    }
};
// 面板上触发的事件
exports.listeners = {
    /**
     * 面板隐藏的时候触发
     */
     hide() {
        console.log(this.hidden);
    },
    /**
     * 面板显示的时候触发
     */
    show() {
        console.log(this.hidden);
    },
    /**
     * 面板大小更改的时候触发
     */
    resize() {
        console.log(this.clientHeight);
        console.log(this.clientWidth);
    },
};

// 当面板渲染成功后触发
exports.ready = async function() {

    // 还原九宫格拉伸数据
    this.$.btn_reduction.addEventListener('confirm', (event)=> {
        let common = this.common_res[this.cur_select_id];
        if (common && common.new_scale9Grid) {
            let change = 0;
            if (this.$.scale9top.value != common.scale9Grid[0]) {
                this.$.scale9top.value = common.new_scale9Grid[0] = common.scale9Grid[0];
                change++;
            }    
            if (this.$.scale9bottom.value != common.scale9Grid[1]) {
                this.$.scale9bottom.value = common.new_scale9Grid[1] = common.scale9Grid[1];
                change++;
            }    
            if (this.$.scale9left.value != common.scale9Grid[2]) {
                this.$.scale9left.value = common.new_scale9Grid[2] = common.scale9Grid[2];
                change++;
            }    
            if (this.$.scale9right.value != common.scale9Grid[3]) {
                this.$.scale9right.value = common.new_scale9Grid[3] = common.scale9Grid[3];
                change++;
            }    
            if (change > 0) {
                Editor.Message.request('asset-db', 'query-asset-meta', this.$.image.value).then((meta_info)=> {
                    meta_info.userData.borderTop = common.new_scale9Grid[0];
                    meta_info.userData.borderBottom = common.new_scale9Grid[1];
                    meta_info.userData.borderLeft = common.new_scale9Grid[2];
                    meta_info.userData.borderRight = common.new_scale9Grid[3];
                    Editor.Message.request('asset-db', 'save-asset-meta', this.$.image.value, JSON.stringify(meta_info));
                });
            }
        }
    });

    /** 保存九宫格拉伸数据 */
    this.$.btn_save.addEventListener('confirm', (event)=> {
        let common = this.common_res[this.cur_select_id];
        if (common && common.new_scale9Grid) {
            let change = 0;
            if (common.new_scale9Grid[0] != this.$.scale9top.value) {
                common.new_scale9Grid[0] = this.$.scale9top.value;
                change++;
            }
            if (common.new_scale9Grid[1] != this.$.scale9bottom.value) {
                common.new_scale9Grid[1] = this.$.scale9bottom.value;
                change++;
            }
            if (common.new_scale9Grid[2] != this.$.scale9left.value) {
                common.new_scale9Grid[2] = this.$.scale9left.value;
                change++;
            }
            if (common.new_scale9Grid[3] != this.$.scale9right.value) {
                common.new_scale9Grid[3] = this.$.scale9right.value;
                change++;
            }
            if(change > 0) {
                Editor.Message.request('asset-db', 'query-asset-meta', this.$.image.value).then((meta_info)=> {
                    meta_info.userData.borderTop = common.new_scale9Grid[0];
                    meta_info.userData.borderBottom = common.new_scale9Grid[1];
                    meta_info.userData.borderLeft = common.new_scale9Grid[2];
                    meta_info.userData.borderRight = common.new_scale9Grid[3];
                    Editor.Message.request('asset-db', 'save-asset-meta', this.$.image.value, JSON.stringify(meta_info));
                });
            }
        }
    });

    /** 不导出资源 */
    this.$.hulue.addEventListener("confirm", (event)=> {
        this.common_res[this.cur_select_id] = this.common_res[this.cur_select_id] || {};
        this.common_res[this.cur_select_id].ischeck = event.target.value;
        // console.log('this.cur_select_id=', this.cur_select_id, typeof(event.target.value));
    });

    /** imageAsset 选择 */
    this.$.img_res.addEventListener("confirm", (event)=> {
        // console.log('event=', event);
        // console.log('event.target.value=', event.target.value);
        let new_uuid = event.target.value;
        if (new_uuid) {
            let old_path = this.$.image.value;
            Editor.Message.request('asset-db', 'query-url', new_uuid).then((new_url)=> {
                this.$.image.value = new_url;
                this.$.img_res_path.value = new_url;
                this.common_res[this.cur_select_id] = this.common_res[this.cur_select_id] || {};
                this.common_res[this.cur_select_id].path = new_url;

                let cur_old_path = old_path.split('/spriteFrame')[0];
                
                /** 处理A换成B，然后B又换成C，key要保持是A的key */
                let is_find = false;
                for (let k in this.change_fold_res) {
                    if (this.change_fold_res[k] == cur_old_path) {
                        this.change_fold_res[k] = new_url;
                        is_find = true;
                    }
                }
                if (!is_find) {
                    this.change_fold_res[old_path.split('/spriteFrame')[0]] = new_url;
                }
                Editor.Message.request('asset-db', 'query-uuid', old_path).then((uuid)=> {
                    Editor.Message.request('asset-db', 'query-uuid', new_url + '/spriteFrame').then((newuuid)=> {
                        Editor.Message.request('scene', 'execute-scene-script', {
                            name: 'psdtoui',
                            method: 'updateSpriteFrame',
                            args:[uuid, newuuid]
                        });
                    });
                });
            });
        }



    });

    /** 修改资源路径 */
    this.$.btn_change_path.addEventListener("confirm", (event)=> { 
        Editor.Message.request('asset-db', 'move-asset', this.$.img_res.value, this.$.img_res_path.value, {overwrite:true}).then((err)=> {
            this.$.img_res.value = this.$.img_res_path.value;
            this.$.image.value = this.$.img_res_path.value;
            
            let select_common_info = this.common_res[this.cur_select_id];
            if (!select_common_info) {
                select_common_info = this.common_res[this.cur_select_id] = {};
            }
            select_common_info.path = this.$.img_res_path.value;
        });
        
    });

    /** 选择psd文件 */
    let _this = this;
    this.$.filedia.addEventListener("change", function() {
        let psd_path = this.files[0].path;
        let fold_name = this.files[0].name.split('.')[0];
        
        _this.$.foldname.value = fold_name;
        psd2fgui.convert(psd_path).then((ui_info)=> {
            let num = 0;
            for (let i = 0, n = ui_info.imgs.length; i < n; i++) {
                let img = ui_info.imgs[i];
                let name = img.name;
                let db_url = 'db://assets/textures/'+ fold_name + '/' + name;
                img.src = 'assets/textures/' + fold_name + '/' + name.split('.')[0];
                let t = Editor.Message.request('asset-db', 'import-asset', img.path, db_url, {overwrite: true});
                t.then((aaa)=> {
                    num++;
                    let update_callback = function (childrens, name, uuid) {
                        for (let k = 0; k < childrens.length; k++) {
                            let child = childrens[k];
                            if (child.src && child.src == name) {
                                child.uuid = uuid;
                            }
                            if (child.children && child.children.length > 0) {
                                update_callback(child.children, name, uuid);
                            }
                        }
                    }
                    if (img.scale9Grid) {
                        Editor.Message.request('asset-db', 'query-asset-meta', aaa.redirect.uuid).then((meta_info)=> {
                            meta_info.userData.borderTop = img.scale9Grid[0];
                            meta_info.userData.borderBottom = img.scale9Grid[1];
                            meta_info.userData.borderLeft = img.scale9Grid[2];
                            meta_info.userData.borderRight = img.scale9Grid[3];
                            Editor.Message.request('asset-db', 'save-asset-meta', aaa.redirect.uuid, JSON.stringify(meta_info));
                        });
                    }
                    update_callback(ui_info.info.children, name, aaa.redirect.uuid);
                    if (num == n) {
                        Editor.Message.request('scene', 'execute-scene-script', {
                            name: 'psdtoui',
                            method: 'createRoot',
                            args:[ui_info]
                        });
                    }
                })
            }
            // console.log('ui_info=', ui_info.info);
            _this.showNodeTree([JSON.parse(JSON.stringify(ui_info.info))]);

        }).catch(
            (err)=> {
                console.log('err========', err);
            }
        );
    }, false);
};
// 尝试关闭面板的时候触发
exports.beforeClose = async function() {};
// 当面板实际关闭后触发
exports.close = async function() {};