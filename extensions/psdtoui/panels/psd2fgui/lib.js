/*!
 * psd2fgui
 * @license [MIT]
 * @copyright http://www.fairygui.com/
 */

"use strict";

const PSD = require('psd');
const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');
const archiver = require('archiver');
const xmlbuilder = require('xmlbuilder');
const resizeImg = require('resize-img');
const PNG = require('pngjs').PNG;
const gm = require("gm").subClass({imageMagick: true});;

//The group name prefix identified as a component.
// const componentPrefix = 'Com';

// //The group name prefix identified as a common button.
// const commonButtonPrefix = 'Button';

// //The group name prefix identified as a checkbox button.
// const checkButtonPrefix = 'CheckButton';

// //The group name prefix identified as a radio button.
// const radioButtonPrefix = 'RadioButton';

//The layer name suffix of each status of the button.
const buttonStatusSuffix = ['@up', '@down', '@over', '@selectedOver'];

const NodeType = {
    Com: 'Com',
    Btn: 'Button',
    Check: 'CheckButton',
    Radio: 'RadioButton'
}

const SubType = {
    Grid9: '@9#'
}

exports.constants = {
    NO_PACK: 1,
    IGNORE_FONT: 2
};

var targetPackage;
var add_id = 0;
/**
 * Convert a PSD file to a fairygui package.
 * @param {string} psdFile path of the psd file.
 * @param {string} outputFile optional. output file path.
 * @param {integer} option psd2fgui.constants.
 * @param {string} buildId optinal. You can use same build id to keep resource ids unchanged during multiple converting for a psd file.
 * @return {string} output file path.
 */
exports.convert = function (psdFile, outputFile, option, buildId) {
    return new Promise(function (resolve, reject) {
        if (!option)
            option = 0;
        if (!buildId)
            buildId = genBuildId();

        var pathInfo = path.parse(psdFile);
        var outputDirectory;

        if (option & exports.constants.NO_PACK) {
            outputDirectory = outputFile;
            if (!outputDirectory)
                outputDirectory = path.join(pathInfo.dir, pathInfo.name + '-fairypackage');
        }
        else {
            outputDirectory = path.join(pathInfo.dir, pathInfo.name + '~temp');
            fs.emptyDirSync(outputDirectory);

            if (!outputFile)
                outputFile = path.join(pathInfo.dir, pathInfo.name + '.fairypackage');
        }

        var psd = PSD.fromFile(psdFile);
        psd.parse();

        targetPackage = new UIPackage(outputDirectory, buildId);
        targetPackage.exportOption = option;
        add_id = 0;
        let aNode = psd.tree();
        // createComponent(aNode, pathInfo.name);
        let info = serializationNode(aNode, pathInfo.name);
        // console.log('info=======', info);
        var pkgDesc = xmlbuilder.create('packageDescription');
        pkgDesc.att('id', targetPackage.id);
        var resourcesNode = pkgDesc.ele('resources');
        var savePromises = [];
        var img_files = [];
        // let index = 0;
        let ui_info = {};
        ui_info.width = aNode.get('width');
        ui_info.height = aNode.get('height');
        // ui_info.children = [];
        
        ui_info.imgs = [];
        ui_info.info = info;
        // ui_info.aNode = 'aNode';
            // console.log('targetPackage=', targetPackage);
        // console.log('width, height=', aNode.get('width'), aNode.get('height'));
        let scale9Grids = [];
        targetPackage.resources.forEach(function (item) {
            // var resNode = resourcesNode.ele(item.type);
            let name = item.name.split('|')[0]; 
            // resNode.att('id', item.id).att('name', name).att('path', '/');
            // if (item.type == 'image') {
            //     if (item.scale9Grid) {
            //         resNode.att('scale', item.scale);
            //         resNode.att('scale9Grid', item.scale9Grid);
            //     }
            // }
            // if (index == 0) {
            //     console.log('resNode=', item);
            // }
            // ++index;
            // console.log('item========', item.data);
            if (item.type == 'image') {
                let long_path = path.join(targetPackage.basePath, name);
                savePromises.push(item.data.saveAsPng(long_path));
                let fileinfo = {};
                fileinfo.path = long_path;
                    // path = 
                    fileinfo.name = name;

                if (item.scale9Grid) {
                    fileinfo.scale9Grid = item.scale9Grid;
                    scale9Grids.push({path: long_path, name: name, scale9Grid: item.scale9Grid, width: item.width, height: item.height});
                    // fileinfo.scale9Grid = scale9Grid;
                }

                // }
                ui_info.imgs.push(fileinfo);
            } else {
                savePromises.push(fs.writeFile(path.join(targetPackage.basePath, name), item.data));
            }
        });
        // resolve(img_files);
        // for (let i = 0; i < img_files.length; i++) {
        //     console.log('file=', img_files[i]);
        // }
        // for (let key in Editor.Message) {
        //     console.log('Editor key=', key);
        // }
        // let tt = Editor.Message.request('asset-db', 'import-asset', img_files[0].data, 'db://assets/textures/'+pathInfo.name + '/test.png');
        // console.log('tt=', tt);
        // savePromises.push(fs.writeFile(path.join(targetPackage.basePath, 'package.xml'),
        //     pkgDesc.end({ pretty: true })));

        var pa = Promise.all(savePromises);
        if (option & exports.constants.NO_PACK) {
            pa.then(function () {
                // console.log(psdFile + '->' + outputDirectory);
                resolve(ui_info);
            }).catch(function (reason) {
                reject(reason);
            });
        }
        else {

            // 左 上 右 下
            // 上下左右
            pa.then(()=> {
                if (scale9Grids.length) {
                    let offset = 4;
                    let taskPromises = [];
                    for (let si = 0; si < scale9Grids.length; si++) {
                        let tmp_info = scale9Grids[si];
                        let png_name = tmp_info.path.split('.')[0];
                        if (tmp_info.scale9Grid && tmp_info.scale9Grid[4] && tmp_info.scale9Grid[5]) {
                            let top = tmp_info.scale9Grid[0] + offset;
                            let bottom = tmp_info.scale9Grid[1] + offset;
                            let left = tmp_info.scale9Grid[2] + offset;
                            let right = tmp_info.scale9Grid[3] + offset;
                            let ltop_x = 0;
                            let ltop_y = 0;
                            let rtop_y = 0;
                            let lbom_x = 0;
                            let rtop_x = tmp_info.width - right;
                            let lbom_y = tmp_info.height - bottom;
                            let rbom_x = tmp_info.width - right;
                            let rbom_y = tmp_info.height - bottom;
                            
                            let lefttop_path = png_name + '_lefttop.png';
                            let righttop_path = png_name + '_righttop.png';
                            let leftbottom_path = png_name + '_leftbottom.png';
                            let rightbottom_path = png_name + '_rightbottom.png';
                            let left_path = png_name + '_newleft.png';
                            let right_path = png_name + '_newright.png';
                            taskPromises.push({
                                func: 'crop',
                                params: [left, top, ltop_x, ltop_y],
                                path: tmp_info.path,
                                write_path: lefttop_path
                            });
                            taskPromises.push({
                                func: 'crop',
                                params: [right, top, rtop_x, rtop_y],
                                path: tmp_info.path,
                                write_path: righttop_path
                            });
                            taskPromises.push({
                                func: 'crop',
                                params: [left, bottom, lbom_x, lbom_y],
                                path: tmp_info.path,
                                write_path: leftbottom_path
                            });
                            taskPromises.push({
                                func: 'crop',
                                params: [right, bottom, rbom_x, rbom_y],
                                path: tmp_info.path,
                                write_path: rightbottom_path
                            });
                            taskPromises.push({
                                func: 'append',
                                params: [lefttop_path, leftbottom_path],
                                write_path: left_path
                            });
                            taskPromises.push({
                                func: 'append',
                                params: [righttop_path, rightbottom_path],
                                write_path: right_path
                            });
                            taskPromises.push({
                                func: 'unlink',
                                path: tmp_info.path
                            });
                            taskPromises.push({
                                func: 'append',
                                params: [left_path, right_path, true],
                                write_path: tmp_info.path
                            });
                            taskPromises.push({
                                func: 'callback',
                                callback1: ()=> {
                                    fs.unlinkSync(lefttop_path);
                                    fs.unlinkSync(leftbottom_path);
                                    fs.unlinkSync(righttop_path);
                                    fs.unlinkSync(rightbottom_path);
                                    fs.unlinkSync(left_path);
                                    fs.unlinkSync(right_path);
                                }
                            });
                        }
                    }
                    if (taskPromises.length > 0) {
                        taskPromises.push({
                            func: 'callback',
                            callback1: ()=> {
                                resolve(ui_info);
                            }
                        })
                        scaleGrid(taskPromises);
                    } else {
                        resolve(ui_info);
                    }
                } else {
                    resolve(ui_info);
                }
            }).catch(function (reason) {
                reject(reason);
            });
        }
    });
}

function scaleGrid(taskPromises) {
    if (taskPromises.length == 0) { return; }
    let p = taskPromises.shift();
    if (p.func == 'crop') {
        gm(p.path).crop(p.params[0], p.params[1], p.params[2], p.params[3]).write(p.write_path, function(err){
            if (err) {
                return console.log('crop err=', err);
            }    
            scaleGrid(taskPromises);
        });
    } else if (p.func == 'append') {
        if (p.params.length == 3) {
            gm().append(p.params[0], p.params[1], p.params[2]).write(p.write_path, function(err) {
                if (err) {
                    return console.log('append err=', err);
                }
                scaleGrid(taskPromises);
            });
        } else if (p.params.length == 2) {
            gm().append(p.params[0], p.params[1]).write(p.write_path, function(err) {
                if (err) {
                    return console.log('append err=', err);
                }
                scaleGrid(taskPromises);
            });
        }    
    } else if (p.func == 'unlink') {
        fs.unlink(p.path);
        scaleGrid(taskPromises);
    } else if (p.func == 'callback') {
        p.callback1();
        scaleGrid(taskPromises);
    }
}

/*****
 * 
 */

/** 自增id */
function getAdd() {
    add_id++;
    return add_id;
}

function serializationNode(aNode, name) {
    let child_length = aNode.children().length;
    let info = {
        name: name,
        width: aNode.get('width'),
        height: aNode.get('height')
    };
    info.children = [];
    for (let i = child_length - 1; i >= 0; i--) {
        let one_info = createNodeCC(aNode.children()[i], aNode);
        if (one_info) {
            info.children.push(one_info);
        }    
    }
    info.id = getAdd();
    return info;
}

function createNodeCC(aNode, rootNode, rootSrcPos) {
    let names = aNode.get('name').split('|');
    let name = names[0];
    let type = names[1];
    if (type) {
        type = names[1].split('@')[0];
    }
    // console.log('name, type=', name, aNode.isGroup(), type);
    var specialUsage;
    if (name.indexOf('@title') != -1)
        specialUsage = 'title';
    else if (name.indexOf('@icon') != -1)
        specialUsage = 'icon';
    let width = aNode.width;
    let height = aNode.height;
    rootSrcPos = rootSrcPos || {x: 0, y: 0};
    let srcX = (aNode.left - rootNode.left)
    let srcY = (rootNode.top - aNode.top)
    let x = srcX - rootSrcPos.x;
    let y = -1280 - srcY*0.5 + height  - rootSrcPos.y;
    rootSrcPos.x = srcX;
    rootSrcPos.y = srcY;
    let info = {
        x: srcX,
        y: srcY,
        name: name,
        width: width,
        height: height
    };
    // console.log('======11name=', name, x, y, rootSrcPos.x, rootSrcPos.y);
    // console.log('======aNode.left, aNode.right, aNode.top, aNode.bottom=', aNode.left, aNode.right, aNode.top, aNode.bottom);
    // console.log('======rootNode.left, rootNode.right, rootNode.top, rootNode.bottom=', rootNode.left, rootNode.right, rootNode.top, rootNode.bottom);
    let opacity = aNode.get('opacity');
    // console.log('======22name=', name);
    if (opacity < 255) {
        info.alpha = (opacity / 255).toFixed(2);
    }
    if (aNode.isGroup()) {
        let cnt = aNode.children().length;
        info.type = 'node';
        info.children = [];
        for (let i = cnt - 1; i >= 0; i--) {
            let one_info = createNodeCC(aNode.children()[i], rootNode, rootSrcPos);
            if (one_info) {
                info.children.push(one_info);
            }    
        }
    } else {
        let typeTool = aNode.get('typeTool');
        if (typeTool) {
            info.type = 'text';
            info.text = typeTool.textValue
            if (specialUsage == 'title') {
                info.x = 0;
                // info.y = aNode.top - rootNode.top - 4;
                info.y = rootNode.top - aNode.top + 4;
                info.width = rootNode.width;
                info.height = rootNode.height+8;
                info.align = 'center';
            } else {
                info.x = aNode.left - rootNode.left - 4;
                // info.y = aNode.top - rootNode.top - 4;
                info.y = rootNode.top - aNode.top + 4;
                info.width = aNode.width+8;
                info.height = aNode.height+8;
                let align_str = typeTool.alignment()[0];
                if (align_str != 'left') {
                    info.align = align_str;
                }
            }
            if (!(targetPackage.exportOption & exports.constants.IGNORE_FONT))
                info.font = typeTool.fonts()[0];
            info.fontSize = Math.floor(typeTool.sizes()[0] * typeTool.transform.yy);
            info.color = convertToHtmlColor(typeTool.colors()[0]);
        } else if (!aNode.isEmpty()) {
            let packageItem = createImage(aNode);
            switch(type) {
                case NodeType.Com:
                    info.type = 'node';
                    break;
                case NodeType.Btn:
                    info.type = 'button';
                    break;
                case NodeType.Check:
                    info.type = 'check';
                    break;
                case NodeType.Radio:
                    info.type = 'radio';
                    break;
                default:
                    info.type = 'img';
                    break;
            }
            if (specialUsage == 'icon') {
                info.specialUsage = 'icon';
            } else {
                info.src = packageItem.name;
                info.scale9Grid = packageItem.scale9Grid;
                // console.log('info.src=', info.name, packageItem.name);
            }
        } else {
            return;
        }
    }
    
    if (!info.children || info.children.length == 0) {
        info.showArrow = false;
    }
    info.id = getAdd();
    return info;
}

//=====================================================================================
function UIPackage(basePath, buildId) {
    this.id = buildId.substr(0, 8);
    this.itemIdBase = buildId.substr(8);
    this.nextItemIndex = 0;
    this.getNextItemId = function () {
        return this.itemIdBase + (this.nextItemIndex++).toString(36);
    };

    this.basePath = basePath;
    fs.ensureDirSync(basePath);

    this.resources = [];
    this.sameDataTestHelper = {};
    this.sameNameTestHelper = {};
}

function createImage(aNode, scale9Grid) {
    let width = aNode.get('width');
    let height = aNode.get('height');
    let nodeName = aNode.get('name');
    if (nodeName.indexOf(SubType.Grid9) != -1) {
        let names = nodeName.split('|');
        nodeName = names[0];
        let type = names[1];
        if (type) {
            let pattern = new RegExp(`${SubType.Grid9}([0-9|_]+)`, "g");
            let s9InfoArr = type.match(pattern);
            let s9Info = s9InfoArr ? s9InfoArr[0].substr(SubType.Grid9.length) : '';
            let s9Cfg = s9Info.split('_');
            if (s9Cfg.length >= 1) {
                let left = Number(s9Cfg[2]);
                if (left < width && left < height) {
                    let up = Number(s9Cfg[0] || left);
                    let bottom = Number(s9Cfg[1] || up);
                    let right = Number(s9Cfg[3] || left);
                    scale9Grid = [up, bottom, left, right];
                    if (s9Cfg[4] && s9Cfg[5]) {
                        let middleWidth = Number(s9Cfg[4] || 4);
                        let middleHeight = Number(s9Cfg[5] || middleWidth);
                        scale9Grid.push(middleWidth);
                        scale9Grid.push(middleHeight);
                    }
                }
            }
        }
    }


    var packageItem = createPackageItem('image', nodeName + '.png', aNode, scale9Grid);
    if (scale9Grid) {
        packageItem.scale = '9grid';
        packageItem.scale9Grid = scale9Grid;
    }
    packageItem.width = width;
    packageItem.height = height;

    return packageItem;
}

function createComponent(aNode, name) {
    var component = xmlbuilder.create('component');
    component.att('size', aNode.get('width') + ',' + aNode.get('height'));
    var displayList = component.ele('displayList');

    var cnt = aNode.children().length;
    for (var i = cnt - 1; i >= 0; i--) {
        parseNode(aNode.children()[i], aNode, displayList);
    }

    return createPackageItem('component', (name ? name : aNode.get('name')) + '.xml', component.end({ pretty: true }));
}

function createButton(aNode, instProps) {
    var component = xmlbuilder.create('component');
    component.att('size', aNode.get('width') + ',' + aNode.get('height'));
    component.att('extention', 'Button');

    var images = [];
    var imagePages = [];
    var imageCnt = 0;
    aNode.descendants().forEach(function (childNode) {
        var nodeName = childNode.get('name');
        for (var i in buttonStatusSuffix) {
            if (nodeName.indexOf(buttonStatusSuffix[i]) != -1) {
                images[i] = childNode;
                imageCnt++;
            }
        };
    });
    for (var i in buttonStatusSuffix) {
        imagePages[i] = [];
        if (!images[i]) {
            if (i == 3 && images[1]) //if no 'selectedOver', use 'down'
                imagePages[1].push(i);
            else //or else, use 'up'
                imagePages[0].push(i);
        }
        else {
            imagePages[i].push(i);
        }
    }

    var onElementCallback = function (child, node) {
        var nodeName = node.get('name');
        var j = images.indexOf(node);
        if (j != -1) {
            var gear = child.ele('gearDisplay');
            gear.att('controller', 'button');
            gear.att('pages', imagePages[j].join(','));
        }

        if (nodeName.indexOf('@title') != -1) {
            if (child.attributes['text']) {
                instProps['@title'] = child.attributes['text'].value;
                child.removeAttribute('text');
            }
        }
        else if (nodeName.indexOf('@icon') != -1) {
            if (child.attributes['url']) {
                instProps['@icon'] = child.attributes['url'].value;
                child.removeAttribute('url');
            }
        }
    };

    var controller = component.ele('controller');
    controller.att('name', 'button');
    controller.att('pages', '0,up,1,down,2,over,3,selectedOver');

    var displayList = component.ele('displayList');
    var cnt = aNode.children().length;
    for (i = cnt - 1; i >= 0; i--) {
        parseNode(aNode.children()[i], aNode, displayList, onElementCallback);
    }

    var extension = component.ele('Button');
    if (aNode.get('name').indexOf(NodeType.Check) == 0) {
        extension.att('mode', 'Check');
        instProps['@checked'] = 'true';
    }
    else if (aNode.get('name').indexOf(NodeType.Radio) == 0)
        extension.att('mode', 'Radio');

    if (imageCnt == 1) {
        extension.att('downEffect', 'scale');
        extension.att('downEffectValue', '1.1');
    }

    return createPackageItem('component', aNode.get('name') + '.xml', component.end({ pretty: true }));
}

function createPackageItem(type, fileName, data, scale9Grid) {
    var dataForHash;
    if (type == 'image') //data should a psd layer
        dataForHash = Buffer.from(data.get('image').pixelData);
    else
        dataForHash = data;
    var hash = crypto.createHash('md5').update(dataForHash).digest('hex');
    var item = targetPackage.sameDataTestHelper[hash];
    if (!item) {
        item = {};
        item.type = type;
        item.id = targetPackage.getNextItemId();

        var i = fileName.lastIndexOf('.');
        var basename = fileName.substr(0, i);
        var ext = fileName.substr(i);
        basename = basename.split('|')[0];
        basename = basename.replace(/[\@\'\"\\\/\b\f\n\r\t\$\%\*\:\?\<\>\|]/g, '_');
        fileName = basename + ext;
        item.name = fileName;
        item.data = data;
        targetPackage.resources.push(item);
        targetPackage.sameDataTestHelper[hash] = item;
    }

    return item;
}

function parseNode(aNode, rootNode, displayList, onElementCallback) {
    var child;
    var packageItem;
    var instProps;
    var str;

    var nodeName = aNode.get('name');
    var specialUsage;
    if (nodeName.indexOf('@title') != -1)
        specialUsage = 'title';
    else if (nodeName.indexOf('@icon') != -1)
        specialUsage = 'icon';

    if (aNode.isGroup()) {
        if (nodeName.indexOf(NodeType.Com) == 0) {
            packageItem = createComponent(aNode);
            child = xmlbuilder.create('component');
            str = 'n' + (displayList.children.length + 1);
            child.att('id', str + '_' + targetPackage.itemIdBase);
            child.att('name', specialUsage ? specialUsage : str);
            child.att('src', packageItem.id);
            child.att('fileName', packageItem.name);
            child.att('xy', (aNode.left - rootNode.left) + ',' + (aNode.top - rootNode.top));
        }
        else if (nodeName.indexOf(NodeType.Btn) == 0 || nodeName.indexOf(NodeType.Check) == 0 || nodeName.indexOf(NodeType.Radio) == 0) {
            instProps = {};
            packageItem = createButton(aNode, instProps);
            child = xmlbuilder.create('component');
            str = 'n' + (displayList.children.length + 1);
            child.att('id', str + '_' + targetPackage.itemIdBase);
            child.att('name', specialUsage ? specialUsage : str);
            child.att('src', packageItem.id);
            child.att('fileName', packageItem.name);
            child.att('xy', (aNode.left - rootNode.left) + ',' + (aNode.top - rootNode.top));
            child.ele({ Button: instProps });
        }
        else {
            var cnt = aNode.children().length;
            for (var i = cnt - 1; i >= 0; i--)
                parseNode(aNode.children()[i], rootNode, displayList, onElementCallback);
        }
    }
    else {
        var typeTool = aNode.get('typeTool');
        if (typeTool) {
            child = xmlbuilder.create('text');
            str = 'n' + (displayList.children.length + 1);
            child.att('id', str + '_' + targetPackage.itemIdBase);
            child.att('name', specialUsage ? specialUsage : str);
            child.att('text', typeTool.textValue);
            if (specialUsage == 'title') {
                child.att('xy', '0,' + (aNode.top - rootNode.top - 4));
                child.att('size', rootNode.width + ',' + (aNode.height + 8));
                child.att('align', 'center');
            }
            else {
                child.att('xy', (aNode.left - rootNode.left - 4) + ',' + (aNode.top - rootNode.top - 4));
                child.att('size', (aNode.width + 8) + ',' + (aNode.height + 8));
                str = typeTool.alignment()[0];
                if (str != 'left')
                    child.att('align', str);
            }
            child.att('vAlign', 'middle');
            child.att('autoSize', 'none');
            if (!(targetPackage.exportOption & exports.constants.IGNORE_FONT))
                child.att('font', typeTool.fonts()[0]);
            child.att('fontSize', typeTool.sizes()[0]);
            child.att('color', convertToHtmlColor(typeTool.colors()[0]));
        }
        else if (!aNode.isEmpty()) {
            packageItem = createImage(aNode);
            if (specialUsage == 'icon')
                child = xmlbuilder.create('loader');
            else
                child = xmlbuilder.create('image');
            str = 'n' + (displayList.children.length + 1);
            child.att('id', str + '_' + targetPackage.itemIdBase);
            child.att('name', specialUsage ? specialUsage : str);
            child.att('xy', (aNode.left - rootNode.left) + ',' + (aNode.top - rootNode.top));
            if (specialUsage == 'icon') {
                child.att('size', aNode.width + ',' + aNode.height);
                child.att('url', 'ui://' + targetPackage.id + packageItem.id);
            }
            else
                child.att('src', packageItem.id);
            child.att('fileName', packageItem.name);
        }
    }

    if (child) {
        var opacity = aNode.get('opacity');
        if (opacity < 255)
            child.att('alpha', (opacity / 255).toFixed(2));

        if (onElementCallback)
            onElementCallback(child, aNode);

        displayList.importDocument(child);
    }

    return child;
}

//=====================================================================================
function genBuildId() {
    var magicNumber = Math.floor(Math.random() * 36).toString(36).substr(0, 1);
    var s1 = '0000' + Math.floor(Math.random() * 1679616).toString(36);
    var s2 = '000' + Math.floor(Math.random() * 46656).toString(36);
    var count = 0;
    for (var i = 0; i < 4; i++) {
        var c = Math.floor(Math.random() * 26);
        count += Math.pow(26, i) * (c + 10);
    }
    count += Math.floor(Math.random() * 1000000) + Math.floor(Math.random() * 222640);

    return magicNumber + s1.substr(s1.length - 4) + s2.substr(s2.length - 3) + count.toString(36);
}

function convertToHtmlColor(rgbaArray, includingAlpha) {
    var result = '#';
    var str;
    if (includingAlpha) {
        str = rgbaArray[3].toString(16);
        if (str.length == 1)
            str = '0' + str;
        result += str;
    }

    for (var i = 0; i < 3; i++) {
        str = rgbaArray[i].toString(16);
        if (str.length == 1)
            str = '0' + str;
        result += str;
    }

    return result;
}
