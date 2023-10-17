import { RoomInfo } from "./roomNameGenerator";
import { popIndex, randomInterval } from "../utility";
import { start } from "repl";

class Map {
    adjacencyList: Array<Room>;
	mapArray: Array<Array<Room>>;
	mapLength: number;
	centerCoord: [number, number];

	constructor() {
		this.adjacencyList = [];

		// from https://stackoverflow.com/questions/16512182/how-to-create-empty-2d-array-in-javascript
		// size x size array of undefineds
		this.mapLength = 25;
		this.mapArray = [...Array(this.mapLength)].map(e => Array(this.mapLength));
		const center = Math.ceil(this.mapLength/2);
		this.centerCoord = [center, center];

		this.generateFloor();
	}

	generateFloor() {
		const numOfRooms = 16;
		const startingRoom = new Room(this.centerCoord);
		this.adjacencyList.push(startingRoom);
		this.mapArray[startingRoom.coord[1]][startingRoom.coord[0]] = startingRoom;

		// from https://stackoverflow.com/a/2041539
		let realRoomCount = 0;
		while (realRoomCount < numOfRooms - 1) {
			const randomRoomIndex = Math.floor(Math.random() * this.adjacencyList.length);
			const randomRoom: Room = this.adjacencyList[randomRoomIndex];
			console.log(randomRoom);

			const newRoom = new Room([-1, -1]);
			if (randomRoom.connectToRoom(newRoom, this.mapArray)) {
				this.adjacencyList.push(newRoom);
				this.mapArray[newRoom.coord[1]][newRoom.coord[0]] = newRoom;
				realRoomCount++;
			}
		}

		this.printFloor();
		this.printMap();
	}

	addRandomEdges(numEdges: number) {
		// https://stackoverflow.com/questions/43241174/javascript-generating-all-combinations-of-elements-in-a-single-array-in-pairs
		const allPossibleEdges: Array<Array<Room>> = this.adjacencyList.flatMap(
			(room, i) => this.adjacencyList.slice(i+1).map( w => [room, w])
		);

		// add connections
		while (numEdges > 0 && allPossibleEdges.length > 0) {
			const randomEdgeIndex = Math.random() * allPossibleEdges.length;
			const randomEdge = popIndex(allPossibleEdges, randomEdgeIndex);

			if (! randomEdge[0].isConnectedTo(randomEdge[1])) {
				const connection = new Connection(randomEdge);
				randomEdge[0].connections.push(connection);
				randomEdge[1].connections.push(connection);

				numEdges--;
			}
		}
	}

	printFloor() {
		for (const r of this.adjacencyList) {
			console.log(r.info.name +
				" (" + r.coord + ") " + 
				" (" + r.getConnectedRooms() + ")");
		}
	}

	printMap() {
		let returnStr = "";

		for (let row = 0; row < this.mapLength; row++) {
			for (let col = 0; col < this.mapLength; col++) {

				const cell = this.mapArray[row][col];
				if (cell !== undefined) {
					let s = String(cell.coord).padStart(6);
					returnStr += s.padEnd(7);
				}
				else {
					returnStr += " _____ ";
				}
			}
			returnStr += "\n";
		}

		console.log(returnStr);
	}
}

class Room {
	// directional connections: North, East, South, West
    connections: [Connection|null, Connection|null, Connection|null, Connection|null];
	info: RoomInfo;
	coord: [number, number];

    constructor(coordinates: [number, number]) {
		this.connections = [null, null, null, null];
		this.info = new RoomInfo();
		this.coord = coordinates;
    }

	hasSpace(): boolean {
		return this.connections.filter(
			x => (x === null)
		).length > 0;
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
			if (this.connections[i] === null) {
				const connection = new Connection([this, otherRoom]);

				let newCoord: [number, number] = [-1, -1];
				if (i === 0) { // otherRoom is north of this
					newCoord = [this.coord[0], this.coord[1] - 1];
					otherRoom.connections[2] = connection;
				}
				else if (i === 1) { // otherRoom is east of this
					newCoord = [this.coord[0] + 1, this.coord[1]];
					otherRoom.connections[3] = connection;
				}
				else if (i === 2) { // otherRoom is south of this
					newCoord = [this.coord[0], this.coord[1] + 1];
					otherRoom.connections[0] = connection;
				}
				else if (i === 3) { // otherRoom is west of this
					newCoord = [this.coord[0] - 1, this.coord[1]];
					otherRoom.connections[1] = connection;
				}

				// coordinate of other room might already be taken on the map
				// or might be out of map bounds
				if ((newCoord[0] >= mapArray.length) ||
					(newCoord[0] < 0) ||
					(newCoord[1] >= mapArray.length) ||
					(newCoord[1] < 0) ||
					(mapArray[newCoord[1]][newCoord[0]] !== undefined)
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
				const otherRoom: Room = connection.nodes.filter(x => !(x === this))[0];
				connectedRooms.push(otherRoom.info.name);
			}
			else {
				connectedRooms.push("null")
			}
		}
		return connectedRooms;
	}
}

export {
    Room
};

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
}

export {
	Map
};