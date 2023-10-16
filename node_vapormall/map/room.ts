import { RoomInfo } from "./roomNameGenerator";
import { popIndex } from "../utility";

class Map {
    adjacencyList: Array<Room>;

	constructor() {
		this.adjacencyList = [];
		this.generateFloor();
	}

	generateFloor() {
		const tempRoomList = [];
		// const numOfRooms = Math.floor(Math.random() * 50);
		const numOfRooms = 10;
		for (let i = 0; i < numOfRooms; i++) {
			const newRoom = new Room();
			tempRoomList.push(newRoom);
		}

		const startingRoom = new Room();
		this.adjacencyList.push(startingRoom);

		// https://stackoverflow.com/questions/2041517/random-simple-connected-graph-generation-with-given-sparseness
		let currentRoom = startingRoom;
		while (tempRoomList.length > 0) {
			const randomRoomIndex = Math.floor(Math.random() * tempRoomList.length);
			const randomRoom: Room = tempRoomList[randomRoomIndex];

			if (! this.adjacencyList.includes(randomRoom)) {
				const connection = new Connection([currentRoom, randomRoom]);

				currentRoom.connections.push(connection);
				randomRoom.connections.push(connection);

				popIndex(tempRoomList, randomRoomIndex);
				this.adjacencyList.push(randomRoom);
			}

			currentRoom = randomRoom;
		}

		this.printFloor();
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
			console.log(r.info.name + " (" + r.getConnectedRooms() + ")");
		}
	}
}

class Room {
    connections: Array<Connection>;
	info: RoomInfo;

    constructor() {
		this.connections = [];
		this.info = new RoomInfo();
		console.log("info");
		console.log(this.info);
    }

	isConnectedTo(otherRoom: Room) {
		for (const connection of this.connections) {
			if (connection.nodes.includes(otherRoom)) {
				return true;
			}
		}
		return false;
	}

	getConnectedRooms() {
		const connectedRooms = [];
		for (const connection of this.connections) {
			const otherRoom: Room = connection.nodes.filter(x => !(x === this))[0];
			connectedRooms.push(otherRoom.info.name);
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