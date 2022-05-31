const bodyLoaded = () => {

    // check empty input
    // set defaults and reload page
    if (location.hash === "") {
        // exapmle tikers: NQ1!,ES1!,RTY1!
        location.hash = `{"style":"cells4x2","tikers":"US100,US500,US2000,ARKG,GLD,BTCUSD,BLUE,VIR"}`;
        location.reload();
        return;
    }

    let params = JSON.parse(decodeURI(location.hash).slice(1));
    // example: {"style":"cells3x3","tikers":"US100,US500,RTY1!,cnk,ccl,rig,ccl,m"}

    //let stylePattern = params.style.match(/cells(\d)x(\d)/);
    let style = params.style.match(/cells(\d)x(\d)|line/);
    // ["cells3x4", "3", "4", index: 0, input: "cells3x4", groups: undefined]

    if (style == null) {
        console.error("unhandled style", params.style);
    } else {
        if (style[0].match('^cells')) {
            let [cols, rows] = [Number(style[2]), Number(style[1])]
            addStyle(`
                .main-container {
                    height: ` + (100/cols) + `%;
                    display: flex;
                    flex-wrap: wrap;
                }
                .main-container > div {
                    flex-basis: calc(` + (100/rows) + `%);
                    height: 100%;
                }
            `);
        }
        if (style[0] === 'line') {
            addStyle(`
                .main-container {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
                    grid-auto-rows: minmax(250px, auto);
                    grid-auto-flow: dense;
                }
            `);
        }
    }

    (params.tikers || "")
        .split(",")
        .forEach((symbol) => addSymbol(symbol));

    window.onhashchange = () => location.reload();

}

const addStyle = (style) => {
    var sheet = document.createElement("style");
    sheet.innerHTML = style;
    document.body.appendChild(sheet);
}

const addSymbol = (symbol) => {
    let cont = document.createElement("div");
    cont.id = Math.random().toString(36).slice(2);
    document.getElementById("app").appendChild(cont);
    new TradingView.widget({
        "autosize": true,
        "symbol": symbol,
        "interval": "D", "timezone": "Europe/Moscow", "locale": "en",
        "theme": "dark", "style": "0", "toolbar_bg": "#f1f3f6",
        "enable_publishing": false, "allow_symbol_change": true, "show_popup_button": true, "hide_legend": false, "hide_side_toolbar": true,
        "popup_width": "1000", "popup_height": "650",
        "studies": [],
        "container_id": cont.id
    });
}