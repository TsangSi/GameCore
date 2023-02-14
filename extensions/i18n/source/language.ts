import { readFileSync } from 'fs';
import { join } from 'path';

const template = readFileSync(join(__dirname, './template.txt'), 'utf-8');

/**
 * 创建新的语言包
 * @param {string} name
 * @return {Promise}
 */
const create = (name) => {
    const js = template.replace('{{name}}', name);
    const url = `db://assets/gamelogic/i18n/${name}.ts`;
    return new Promise((resolve, reject) => {
        const t = Editor.Message.request('asset-db', 'create-asset', url, js, { overwrite: true });
        t.then(() => {
            resolve();
        }).catch((err) => {
            reject(err);
        });
    });
};

/**
 * 删除语言包
 * @param {string} name
 */
const remove = (name) => {
    const url = `db://assets/gamelogic/i18n/${name}.ts`;
    return new Promise((resolve, reject) => {
        const t = Editor.Message.request('asset-db', 'delete-asset', url);
        t.then(() => {
            resolve();
        }).catch((err) => {
            reject(err);
        });
    });
};

const _create = create;
export { _create as create };
const _remove = remove;
export { _remove as remove };
