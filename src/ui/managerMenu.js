import { setMapState } from "./map";
import { playerShip } from "../states/create";
import { requestSliderInput } from "../api/sliderRequest";

export var selectedTab = 0;

export function selectTab(index) {
    $(".managerMenuContentTab").css({
        "display": "none"
    });

    $($(".managerMenuContentTab")[index]).css({
        "display": "block"
    });

    switch (index) {
        case 0:
            setMapState(2);
            break;
        case 1:
            updateInventoryScreen();
            break;
    }
    $(".scrollmenu > a").removeClass("selected");
    $($(".scrollmenu > a")[index + 1]).addClass("selected");
}

export function generateManagerMenu() {
    $("#root").append(`
    
        <div class="managerMenuContainer">
            <div class="managerMenuTopBar">
                <div class="scrollmenu">
                    <a id="closeManagerMenu">X</a>
                    <a id="selectMapTab">Map</a>
                    <a id="selectInventoryTab">Inventory</a>
                    <a id="selectModulesTab">Modules</a>
                    <a>Universe</a>
                    <a>Market</a>
                    <a>Ship</a>
                    <a>Economy</a>
                </div>
            </div>
            <div class="managerMenuContent">
                <div class="managerMenuContentTab mapTab"></div>
                <div class="managerMenuContentTab inventoryTab"></div>
                <div class="managerMenuContentTab modulesTab"></div>
            </div>
        </div>

    `);

    $("#closeManagerMenu").click(function () {
        hideManagerMenu();
    });
    $("#selectMapTab").click(function () {
        selectTab(0);
    });
    $("#selectInventoryTab").click(function () {
        selectTab(1);
    });

    hideManagerMenu();
}


export function showManagerMenu(wh) {
    $(".managerMenuContainer").css({
        "display": "block"
    });
    $(".gameMapContainer").appendTo($(".mapTab"));
}

export function hideManagerMenu() {
    $(".managerMenuContainer").css({
        "display": "none"
    });
    $(".gameMapContainer").appendTo($("#root"));
    setMapState(1)

}

export function updateInventoryScreen() {
    $(".inventoryTab").html(`
        <div style="color:white;height:40px;line-height:40px;">${playerShip.Inventory.getUsed()}/${playerShip.Inventory.capacity}</div>
        <div id="inventoryTableContainer"></div>
    `);

    var table = new Tabulator("#inventoryTableContainer", {
        height: "calc(100% - 40px)",
        layout: "fitDataFill",
        responsiveLayout: "collapse",
        responsiveLayoutCollapseStartOpen: false,
        columns: [
            { formatter: "responsiveCollapse", width: 30, minWidth: 30, align: "center", resizable: false, headerSort: false },
            { title: "Item", field: "name", responsive: 0 },
            { title: "Amount", field: "amount", sorter: "number", align: "right" },
            { title: "Mass", field: "mass", sorter: "number" },
            //
            { title: "Mass per unit", field: "massPerUnit", sorter: "number" }
        ],
        rowClick: function (e, row) {
            if (!$(e.target).hasClass("tabulator-responsive-collapse-toggle-close")) {
                if (!$(e.target).hasClass("tabulator-responsive-collapse-toggle-open")) {
                    if (!$(e.target).hasClass("tabulator-responsive-collapse-toggle")) {
                        console.log(row._row.data.name.toLowerCase());
                        showItemInteractions(row._row.data.name.toLowerCase(), playerShip.Inventory);
                    }
                }
            }

        }
    });

    var tabledata = [];
    for (var i = 0; i < playerShip.Inventory.items.length; i++) {
        var item = playerShip.Inventory.items[i];
        var nm = item.name;
        tabledata.push({
            name: nm.capitalize(),
            amount: item.amount,
            mass: item.mass * item.amount,
            massPerUnit: item.mass,
            collapsed: true
        });
    }
    table.setData(tabledata);
}


function showItemInteractions(item, inventorySystem) {

    $("#root").append(`
        <div id="itemInteractionScreen" class="interactionBlackScreen">
            <div>
                <div class="closeInteractionAction">X</div>
                <span class="itemInteractionName">XXXX</span>
            </div>
            <div>
                <div class="itemInteractionAction">Drop</div>
                <div class="itemInteractionAction">Sniff</div>
            </div>
        </div>
    `);

    $(".itemInteractionName").html(item.capitalize());

    $(".closeInteractionAction").click(function () {
        $("#itemInteractionScreen").remove();
    });
    $(".itemInteractionAction:eq(0)").click(function () {
        // Drop option
        requestSliderInput({
            text:"Dropping algo muy largo probando 1 2 3 largfo largo" + item,
            min: 0,
            max: inventorySystem.getItem(item).amount
        }).then(function (amount) {
            if (amount !== 0) {
                inventorySystem.addItem(item, -amount);
            }
            updateInventoryScreen();
            $("#itemInteractionScreen").remove();
        });
    });
}