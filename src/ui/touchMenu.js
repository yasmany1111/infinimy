import { playerShip } from "../states/create";
import { toggleFullScreen, executeResizeEvent } from "./resizer";
import { setMapState, mapState, showMapFullScreen } from "./map";
import { showManagerMenu, selectTab } from "./managerMenu";
import { MAP_STATE } from "../generalVariables";

export function generateTouchMenu() {
    $("#toolsCogs").remove();

    window.oncontextmenu = function () { return false; }
    var left = $("<div></div>")
        .attr("id", "toolsCogs")
        .appendTo($("#root"))
        .css({
            "z-index": "5",
            "color": "white",
            "position": "absolute",
            "bottom": "0px",
            "right": "0px",
            "width": "80px",
            "height": "60px",
            "text-algin": "center",
            "line-height": "60px"
        }).html(`
        <i style="font-size: 40px;text-algin: center;line-height:60px;height:60px;padding-left: 10px;" class="fas fa-cogs"></i>

        `);
    var centerZone = $("<div><i style='width:100%;height:100%' class='fas fa-anchor'></i></div>")
        .appendTo($("#root"))
        .css({
            "z-index": "5",
            "color": "white",
            "position": "absolute",
            "bottom": "5px",
            "left": "160px",
            "width": "calc(100% - 280px)",
            "height": "60px",
            "background": "rgba(0, 0, 255, 0)"
        });

    var hammerTool = new Hammer(centerZone[0]);
    hammerTool.on("press", function (e) {
        playerShip.toolButtonDown.apply(playerShip);
    });
    hammerTool.on("pressup panend", function (e) {
        playerShip.toolButtonUp.apply(playerShip);
    });

    yy.ui.touchUI({
        container: "body",
        initiator: "#toolsCogs",
        styleClass: "touchUI_style",
        effectClass: "touchUI_active",
        colWidth: 50,
        threshold: 50,
        direction: "right",
        onStart: function () {
            $("#toolsCogs").hide();
        },
        onEnd: function () {
            $("#toolsCogs").show();
        },
        centerLine: true,
        items: [
            {
                content: `<i class="fas fa-bug"></i>`,
                click: function () {
                   // $("#debugDisplay").toggle();
                },
                items: [{
                    content: '<i class="fas fa-redo"></i>',
                    click: function () {
                        window.location.reload();
                    }
                }, {
                    content: '<i class="fas fa-desktop"></i>',
                    click: function () {
                        toggleFullScreen();
                        setTimeout(function () {
                            executeResizeEvent();
                        }, 1000);
                    }
                }]
            },
            {
                content: '<i class="fas fa-suitcase"></i>',
                click: function () {
                    showManagerMenu();
                    selectTab(1);
                }
            },
            {
                content: '<i class="fas fa-map"></i>',
                click: function () {
                    showMapFullScreen();

                }
            },
            {
                content: `<i class="fas fa-wrench"></i>`,
                items: [{
                    content: '<i class="fas fa-long-arrow-alt-up"></i>',
                    click: function () {
                        playerShip.selectTool.apply(playerShip, [0]);
                    }
                },
                {
                    content: '<i class="fas fa-map-pin"></i>',
                    click: function () {
                        playerShip.selectTool.apply(playerShip, [1]);
                    },
                    items: [{
                        content: '<i class="fas fa-long-arrow-alt-up"></i>',
                        click: function () {
                            playerShip.Sprite.setMaxVelocity(20000);
                        }
                    }],
                },
                {
                    content: '<i class="fas fa-arrows-alt"></i>',
                    click: function () {
                        playerShip.toggleInertiaDampeners();
                    }
                }]
            }
        ]
    });

    var midScreen = window.innerWidth / 2 - 50;
    var midScreen2 = window.innerHeight / 2 - 50;
    yy.writeCSS(`
        .touchUI_style {
            color: white;
            font-size: 35px;
        }
        .touchUI_active {
            transform: translateX(-25px)
        }
        .touchUI_active_ {
            left: ${midScreen}px !important;
        }
    `);
    setTimeout(function () {
        // $("#debugDisplay").toggle();
    }, 500);
}