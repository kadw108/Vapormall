import {Room, Connection} from "./room";
import { popIndex } from "../utility";
import { GameState } from "../gameState";
import { CONSTANTS } from "../data/constants"

class MallMap {
    adjacencyList: Array<Room>;
	mapArray: Array<Array<Room>>; // south increases y
	mapLength: number;
	centerCoord: [number, number];

    currentLocation: [number, number];

	constructor() {
		this.adjacencyList = [];

		// from https://stackoverflow.com/questions/16512182/how-to-create-empty-2d-array-in-javascript
		// size x size array of undefineds
		this.mapLength = 25;
		this.mapArray = [...Array(this.mapLength)].map(e => Array(this.mapLength));
		const center = Math.ceil(this.mapLength/2);
		this.centerCoord = [center, center];

		this.generateFloor();
		this.currentLocation = this.centerCoord;
		GameState.addVisitedRoom(this.currentRoom());

		this.renderRoom();
	}

	currentRoom(): Room {
		return this.mapArray[this.currentLocation[1]][this.currentLocation[0]];
	}

	generateFloor() {
		const numOfRooms = 12;
		const startingRoom = new Room(this.centerCoord);
		this.adjacencyList.push(startingRoom);
		this.mapArray[startingRoom.coord[1]][startingRoom.coord[0]] = startingRoom;

		// from https://stackoverflow.com/a/2041539
		let realRoomCount = 0;
		while (realRoomCount < numOfRooms - 1) {
			const randomRoomIndex = Math.floor(Math.random() * this.adjacencyList.length);
			const randomRoom: Room = this.adjacencyList[randomRoomIndex];

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

	/*
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
	*/

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

	move(dir: string) {
		switch (dir) {
			case "north":
				this.currentLocation = [this.currentLocation[0], this.currentLocation[1] - 1];
				break;

			case "east":
				this.currentLocation = [this.currentLocation[0] + 1, this.currentLocation[1]];
				break;

			case "south":
				this.currentLocation = [this.currentLocation[0], this.currentLocation[1] + 1];
				break;

			case "west":
				this.currentLocation = [this.currentLocation[0] - 1, this.currentLocation[1]];
				break;
		}

		GameState.addVisitedRoom(this.currentRoom());

		this.renderRoom();
	}

	renderRoom() {
		const room = this.currentRoom();

		const nameDiv = document.getElementById("roomName");
		if (nameDiv !== null) {
			nameDiv.innerText = room.info.name;
		}

		const bottomContent = document.getElementById("bottomContent");
		if (bottomContent !== null) {
			bottomContent.innerHTML = room.info.html();
		}

		const exits = document.querySelectorAll('.exitLink');
		exits.forEach((e, key) => {
			const element = e as HTMLElement;

			element.onclick = function(this: MallMap) {
				const dir = element.getAttribute("direction");
				if (dir !== null) {
					this.move(dir);
				}
			}.bind(this);
		})

		const battles = document.querySelectorAll('.battleLink');
		battles.forEach((e, key) => {
			const element = e as HTMLElement;
			element.onclick = function() {
				GameState.currentEnemy = room.info.popEncounter();
				const result = story.showSnippet("Battle", false);
			}
		})
	}
}

export {
    MallMap
}