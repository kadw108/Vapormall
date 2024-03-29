import { randomInterval } from "../utility";
import { CONSTANTS } from "../data/constants";
import { RoomInfo } from "./roomInfo";

export type ConnectionDict = [
    Connection | null,
    Connection | null,
    Connection | null,
    Connection | null
];

class Room {
    connections: ConnectionDict;
    coord: [number, number];
    info: RoomInfo;

    constructor(coordinates: [number, number]) {
        this.connections = [null, null, null, null];
        this.coord = coordinates;
        this.info = new RoomInfo(this);
    }

    hasSpace(): boolean {
        return this.connections.filter((x) => x === null).length > 0;
    }

    // returns success value if connection succeeded.
    // if returns false, means all connections have filled up already.
    // assumes this room has coordinates (is in map) and other room doesn't
    connectToRoom(otherRoom: Room, mapArray: Array<Array<Room>>): boolean {
        if (!this.hasSpace()) {
            return false;
        }

        // iterate from 0 to (connections.length - 1), starting at random number in that range
        for (const i of randomInterval(this.connections.length)) {
            /*
			for (let key in this.connections) {
				const keyType = key as unknown as CONSTANTS.DIRECTIONS;
				if (this.connections[keyType] !== 0) {
					return true;
				}
			} */

            if (this.connections[i] === null) {
                const connection = new Connection([this, otherRoom]);

                let newCoord: [number, number] = [-1, -1];
                if (CONSTANTS.DIRECTIONS[i].name === "north") {
                    newCoord = [this.coord[0], this.coord[1] - 1];
                    otherRoom.connections[2] = connection;
                } else if (CONSTANTS.DIRECTIONS[i].name === "east") {
                    newCoord = [this.coord[0] + 1, this.coord[1]];
                    otherRoom.connections[3] = connection;
                } else if (CONSTANTS.DIRECTIONS[i].name === "south") {
                    newCoord = [this.coord[0], this.coord[1] + 1];
                    otherRoom.connections[0] = connection;
                } else if (CONSTANTS.DIRECTIONS[i].name === "west") {
                    newCoord = [this.coord[0] - 1, this.coord[1]];
                    otherRoom.connections[1] = connection;
                }

                // coordinate of other room might already be taken on the map
                // or might be out of map bounds
                if (
                    newCoord[0] >= mapArray.length ||
                    newCoord[0] < 0 ||
                    newCoord[1] >= mapArray.length ||
                    newCoord[1] < 0 ||
                    mapArray[newCoord[1]][newCoord[0]] !== undefined
                ) {
                    otherRoom.connections = [null, null, null, null];
                    break;
                }

                this.connections[i] = connection;
                otherRoom.coord = newCoord;
                return true;
            }
        }
        return false;
    }

    isConnectedTo(otherRoom: Room) {
        for (const connection of this.connections) {
            if (connection !== null && connection.nodes.includes(otherRoom)) {
                return true;
            }
        }
        return false;
    }

    getConnectedRooms() {
        const connectedRooms = [];
        for (const connection of this.connections) {
            if (connection !== null) {
                const otherRoom: Room = connection.nodes.filter(
                    (x) => !(x === this)
                )[0];
                connectedRooms.push(otherRoom.info.name);
            } else {
                connectedRooms.push("null");
            }
        }
        return connectedRooms;
    }

    render() {}
}

// all connections are 2-way
class Connection {
    nodes: [Room, Room];

    enterText: string;
    name: string;

    constructor(nodes: [Room, Room]) {
        this.nodes = nodes;
        this.enterText = "You leave one place and enter another.";
        this.name = "Door #" + Math.floor(Math.random() * 1000);
    }

    otherRoom(room: Room) {
        if (this.nodes[0] === room) {
            return this.nodes[1];
        }
        return this.nodes[0];
    }
}

export { Room, Connection };
