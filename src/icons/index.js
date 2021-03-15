

import SvgIcon from "@/icons/SvgIcon";
const componentPlugin = {
    install: function(vue,options) {
        if  (
            options &&
            options.imports &&
            Array.isArray(options.imports) &&
            options.imports.length > 0
        ) {
            const { imports } = options;
            imports.forEach(name => {
                require(`@/icons/svg/${name}.svg`)
            })
        } else {
            const ctx = require.context('@/icons/svg',false,/\.svg$/);
            ctx.keys().forEach(path => {
                const temp = path.match(/\.\/([A-Za-z0-9\-_]+)\.svg$/);
                if (!temp) return
                const name = temp[1]
                require(`@/icons/svg/${name}.svg`)
            })
        }
        vue.component(SvgIcon.name,SvgIcon)
    }
}

export default componentPlugin
