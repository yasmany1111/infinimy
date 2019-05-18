export function requestSliderInput(options) {
    options = options || {};
    var min = options.min || 0;
    var max = options.max || 10;
    var text = options.text || "Value";

    return new Promise(function (resolve, reject) {
        var resolveValue = 0;
        $(".sliderInputScreen").remove();
        $("#root").append(`
            <div class="interactionBlackScreen sliderInputScreen" style="background: black;z-index:25;">
                <div class="cancelSliderRequest">X</div>
                <div class="sliderRequestText">${text}</div>
                <div style="clear:both;padding-top:30px">
                    <input type="range" min="${min}" max="${max}" value="0">
                    <br>
                    <span class="sliderRequestText" style="color:white;" id="requestRangeValue">0</span>
                    <br>
                    <button id="acceptValueRequest">Accept</button>
                </div>
            </div>
        `);
        $('input[type="range"]').rangeslider({
            polyfill: false,
            // Default CSS classes
            rangeClass: 'rangeslider',
            disabledClass: 'rangeslider--disabled',
            horizontalClass: 'rangeslider--horizontal',
            verticalClass: 'rangeslider--vertical',
            fillClass: 'rangeslider__fill',
            handleClass: 'rangeslider__handle',
            // Callback function
            onInit: function () { 

                $('input[type="range"]').val(0).change();
                $("#requestRangeValue").html("0");
                resolveValue = 0;
            },

            // Callback function
            onSlide: function (position, value) {
                $("#requestRangeValue").html(value);
                resolveValue = value;

            },

            // Callback function
            onSlideEnd: function (position, value) { }
        });

        $(".cancelSliderRequest").click(function () {
            reject();
            $(".sliderInputScreen").remove();
        });
        $("#acceptValueRequest").click(function () {
            resolve(resolveValue);
            $(".sliderInputScreen").remove();
        });
    });
} 