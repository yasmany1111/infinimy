var first = true;
export function optionSelect(options) {
    options = options || {};
    injectCSS();
    var html = yuy;

    var optionsUI = html`
        <div class="optionsSelectContainer">
            <div>
                <div class="closeInteractionAction">X</div>
                <span class="itemInteractionName">XXXX</span>
            </div>
            <div>
                <div class="itemInteractionAction">Drop</div>
                <div class="itemInteractionAction">Sniff</div>
            </div>
        </div>
    `;

    console.log(html);
}

function injectCSS() {
    if (first) {
        yy.injectCSS(html`
            <button><
        `);
        first = false;
    }
}