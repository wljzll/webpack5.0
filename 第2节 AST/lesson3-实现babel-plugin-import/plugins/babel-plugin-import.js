/**
 * 实现自己的babel-plugin-import
 */

const babelCore = require('@babel/core');
const types = require('@babel/types');

const plugin = {
    visitor: {
        // ImportDeclaration: {
        //     enter(nodePath, state) {
        //         console.log(state, '==============');
        //     }
        // }
        ImportDeclaration(nodePath, state) {
            let { node } = nodePath;
            let source = node.source;
            // 从state上解构出opts 这是webpack配置传递过来的配置项 { libraryName: 'lodash' }
            let { opts: { libraryName } } = state;
            // 获取导入语法的语法树 import { flatten, concat } from 'lodash';
            const specifiers = node.specifiers;
            if (
                libraryName === source.value // 如果进入这个节点的库和配置的库相同
                &&
                !types.isImportDefaultSpecifier(specifiers[0]) // 并且不是默认导入
            ) {
                // 遍历每个specifiers
                const declarations = specifiers.map((specifier, index) => {
                    // 创建默认导入声明并返回
                    return types.importDeclaration(
                        [types.importDefaultSpecifier(specifier.local)],
                        types.stringLiteral(`${source.value}/${specifier.local.name}`)
                    )
                });
                nodePath.replaceWithMultiple(declarations)
            }

        }
    }
}

// 导出一个函数 函数执行返回插件定义
module.exports = function () {
    return plugin;
}