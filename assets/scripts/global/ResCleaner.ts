import { _decorator, Component, Node, game, js, director, Asset, ForwardPipeline, RenderPipeline, log, warn, assetManager, AssetManager, ImageAsset, Material, JsonAsset } from 'cc';
const { ccclass, property } = _decorator;

const debugUrl = ''

// copy from cocos engine. ugly
function parseDepends (key, parsed) {
    let item = assetManager.assets.get(key);
    if (item) {
        let depends = item['dependKeys'];
        if (depends) {
            for (let i = 0; i < depends.length; i++) {
                let depend = depends[i];
                if ( !parsed[depend] ) {
                    parsed[depend] = true;

                    if (debugUrl === depend) {
                        log('debug')
                    }

                    parseDepends(depend, parsed);
                }
            }
        }
    }
}

function visitAsset (asset, excludeMap) {
    // Skip assets generated programmatically or by user (e.g. label texture)
    if (!asset._uuid) {
        return;
    }
    let asset_key = '';
    assetManager.assets.find((val, key) => {
        let is_find = val === asset;
        if (is_find) {
            asset_key = key;
        }
        return is_find;
    });
    if (asset_key && !excludeMap[asset_key] ) {
        excludeMap[asset_key] = true;

        if (debugUrl === asset_key) {
            log('debug')
        }

        parseDepends(asset_key, excludeMap);
    }
}

function visitComponent (comp, excludeMap) {
    let props = Object.getOwnPropertyNames(comp);
    for (let i = 0; i < props.length; i++) {
        let value = comp[props[i]];
        if (typeof value === 'object' && value) {
            if (Array.isArray(value)) {
                for (let j = 0; j < value.length; j++) {
                    let val = value[j];
                    if (val instanceof Asset) {
                        visitAsset(val, excludeMap);
                    }
                }
            }
            else if (!value.constructor || value.constructor === Object) {
                let keys = Object.getOwnPropertyNames(value);
                for (let j = 0; j < keys.length; j++) {
                    let val = value[keys[j]];
                    if (val instanceof Asset) {
                        visitAsset(val, excludeMap);
                    }
                }
            }
            else if (value instanceof Asset) {
                visitAsset(value, excludeMap);
            }
        }
    }
}

function visitNode (node, excludeMap) {
    for (let i = 0; i < node._components.length; i++) {
        visitComponent(node._components[i], excludeMap);
    }
    for (let i = 0; i < node._children.length; i++) {
        visitNode(node._children[i], excludeMap);
    }
}

function visitItem(item: AssetManager.Task, excludeMap) {
    // if (excludeMap[item.url] ) return

    // if (item.complete) {
    //     let asset = item.content
    //     if (asset) {
    //         if (asset instanceof Asset) {
    //             visitAsset(asset, excludeMap)
    //         }
    //         else {
    //             log('asset instanceof Asset === false')
    //         }
    //     }
    //     else {
    //         log('item.complete === true, but item.content  is empty')
    //     }
    //     excludeMap[item.url] = true

    //     if (debugUrl === item.url) {
    //         log('debug')
    //     }
    // }
    // else {
    //     excludeMap[item.url] = true

    //     if (debugUrl === item.url) {
    //         log('debug')
    //     }

    //     let deps = item.deps
    //     if (deps && deps.length > 0) {
    //         for (let i = 0; i < deps.length; i++) {
    //             const item = deps[i];
    //             visitItem(item, excludeMap)
    //         }
    //     }
    // }
}

export class ResCleaner {


   // 资源清理
    static clean() {
        log('--->资源释放 开始')
        let start = Date.now()
        let excludeMap = js.createMap()
        let cache = assetManager.assets;

        // 排除场景引用的资源
        let nodeList = director.getScene().children
        for (let i = 0; i < nodeList.length; i++) {
            visitNode(nodeList[i], excludeMap)
        }

        // 剔除加载中的资源
        // let runningQueues = {}
        // cache.forEach((val, key) => {
        //     if (val.url) {
        //         assetManager.pipeline.pipes.forEach((pipe) => {
        //             pipe()
        //         });
        //     }
        // });
        // for (const key in cache) {
        //     let item = cache[key]
        //     let queue = assetManager.pipeline.pipes LoadingItems.getQueue(item)
        //     if (queue) {
        //         let queueId = queue['_id']
        //         runningQueues[queueId] = queue
        //     }
        // }
        // for (const queueId in runningQueues) {
        //     const queue: LoadingItems = runningQueues[queueId];
        //     for (const url in queue.map) {
        //         const item: IItem = queue.map[url];
        //         visitItem(item, excludeMap)
        //     }
        // }

        // 遍历资源缓存，逐个资源判断是否被场景引用，若未被场景上的节点引用则释放。
        let releaseList = []
        cache.forEach((val, key) => {
            if (!excludeMap[key]) {
                if (val instanceof Material || val instanceof JsonAsset) {
                } else {
                    // console.log('key, val=', key, val);
                    // assetManager.releaseAsset(val);
                    // val.decRef();
                }
            }
        });

        let timeSpan = Date.now() - start
        log('<---资源释放 结束。  耗时：', timeSpan, 'ms')
    }
}
