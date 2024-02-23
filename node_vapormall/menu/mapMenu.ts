import { GameState } from "../gameState";
import { Manager } from "../manager";
import Konva from "konva";
import { Room } from "../map/room";
import { CONSTANTS } from "../data/constants";

class MapMenu {
    private static ROOM_WIDTH = 70;
    private static CONNECTION_LENGTH = 10;

    constructor() {
        this.refresh();

        Manager.menuButton("mapButton", "map", "Map");

        const mapButton = document.getElementById("mapButton");
        mapButton?.addEventListener("click", () => {
            this.refresh();
        });
    }

    private static centerPos(xOrY: number, widthOrHeight: number): number {
        return xOrY - widthOrHeight / 2;
    }

    private static drawCoordinates(
        roomCoord: [number, number]
    ): [number, number] {
        const adjustedCoord = [
            roomCoord[0] - GameState.currentFloor.currentLocation[0],
            roomCoord[1] - GameState.currentFloor.currentLocation[1],
        ];

        return [
            adjustedCoord[0] *
                (MapMenu.ROOM_WIDTH + MapMenu.CONNECTION_LENGTH * 2),
            adjustedCoord[1] *
                (MapMenu.ROOM_WIDTH + MapMenu.CONNECTION_LENGTH * 2),
        ];
    }

    private refresh(): void {
        const menu = document.getElementById("map");
        if (menu === null) {
            console.error("Map div is null!");
            return;
        }
        menu.innerHTML = "";
        this.drawMap();
    }

    private drawnRoom(room: Room, width: number, height: number) {
        const adjustedCoord = MapMenu.drawCoordinates(room.coord);
        const roomX = width / 2 + adjustedCoord[0];
        const roomY = height / 2 + adjustedCoord[1];

        const startingRoom = new Konva.Rect({
            x: MapMenu.centerPos(roomX, MapMenu.ROOM_WIDTH),
            y: MapMenu.centerPos(roomY, MapMenu.ROOM_WIDTH),
            width: MapMenu.ROOM_WIDTH,
            height: MapMenu.ROOM_WIDTH,
            fill: "#356",
            stroke: "#ffffff",
        });

        const name = new Konva.Text({
            x: MapMenu.centerPos(roomX, MapMenu.ROOM_WIDTH),
            y: MapMenu.centerPos(roomY, MapMenu.ROOM_WIDTH),
            width: MapMenu.ROOM_WIDTH,
            height: MapMenu.ROOM_WIDTH,
            text: room.info.name,

            align: "center",
            verticalAlign: "middle",
            fontFamily: "Monospace",
            fontSize: 10,
            padding: 3,
            fill: "#ffffff",
        });

        const exits = [];
        for (let i = 0; i < room.connections.length; i++) {
            if (room.connections[i] === null) {
                continue;
            }

            let point1, point2;

            if (CONSTANTS.DIRECTIONS[i].name === "north") {
                point1 = { x: roomX, y: roomY - MapMenu.ROOM_WIDTH / 2 };
                point2 = {
                    x: roomX,
                    y:
                        roomY -
                        MapMenu.ROOM_WIDTH / 2 -
                        MapMenu.CONNECTION_LENGTH,
                };
            } else if (CONSTANTS.DIRECTIONS[i].name === "east") {
                point1 = { x: roomX + MapMenu.ROOM_WIDTH / 2, y: roomY };
                point2 = {
                    x:
                        roomX +
                        MapMenu.ROOM_WIDTH / 2 +
                        MapMenu.CONNECTION_LENGTH,
                    y: roomY,
                };
            } else if (CONSTANTS.DIRECTIONS[i].name === "south") {
                point1 = { x: roomX, y: roomY + MapMenu.ROOM_WIDTH / 2 };
                point2 = {
                    x: roomX,
                    y:
                        roomY +
                        MapMenu.ROOM_WIDTH / 2 +
                        MapMenu.CONNECTION_LENGTH,
                };
            } else if (CONSTANTS.DIRECTIONS[i].name === "west") {
                point1 = { x: roomX - MapMenu.ROOM_WIDTH / 2, y: roomY };
                point2 = {
                    x:
                        roomX -
                        MapMenu.ROOM_WIDTH / 2 -
                        MapMenu.CONNECTION_LENGTH,
                    y: roomY,
                };
            }

            const exit = new Konva.Line({
                // @ts-expect-error
                points: [point1.x, point1.y, point2.x, point2.y],
                stroke: "#ffffff",
                strokeWidth: 3,
                lineCap: "square",
            });
            exits.push(exit);
        }

        return [startingRoom, name, ...exits];
    }

    private drawMap(): void {
        let screenContents = document.getElementById("screenContents");
        if (screenContents === null) {
            console.error("screenContents div is null!");
            return;
        }

        const width = screenContents.clientWidth - 20;
        const height = screenContents.clientHeight - 20;

        var stage = new Konva.Stage({
            container: "map",
            width: width,
            height: height,
            draggable: true,
        });

        var layer = new Konva.Layer();
        stage.add(layer);

        GameState.VisitedRooms.forEach((room) => {
            const drawing = this.drawnRoom(room, width, height);
            layer.add(...drawing);
        });
    }
}

export { MapMenu };
