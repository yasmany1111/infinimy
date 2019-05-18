var overlayCounter = 0;

export function showOverlayOver(options) {
    overlayCounter += 1;
    options = options || {};
    options.remove = true;
    if (options.remove) {
        $(".quickOverlay").remove();
    }

    $("#root").append(`
        <div class="quickOverlay" id="quickOverlay${overlayCounter}">
            <div class="quickOverlayCloseContainer">X</div>
            <div class="quickOverlayData">
                ${options.content}
            </div>
            
        </div>
    `);
    var qo = $("#quickOverlay" + overlayCounter);

    qo.find(".quickOverlayCloseContainer").click(function () {
        qo.remove();
    });



}