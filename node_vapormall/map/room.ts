import { RoomGen } from "./roomNameGenerator";
import { randomInterval, capitalizeFirstLetter, indefinite_article, randIndex } from "../utility";
import { CONSTANTS } from "../data/constants";

export type ConnectionDict = [Connection | null, Connection | null, Connection | null, Connection | null];

class Room {
    connections: ConnectionDict;
	coord: [number, number];
	info: RoomInfo;

    constructor(coordinates: [number, number]) {
		this.connections = [null, null, null, null]
		this.coord = coordinates;
		this.info = new RoomInfo(this);
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
				}
				else if (CONSTANTS.DIRECTIONS[i].name === "east") { 
					newCoord = [this.coord[0] + 1, this.coord[1]];
					otherRoom.connections[3] = connection;
				}
				else if (CONSTANTS.DIRECTIONS[i].name === "south") {
					newCoord = [this.coord[0], this.coord[1] + 1];
					otherRoom.connections[0] = connection;
				}
				else if (CONSTANTS.DIRECTIONS[i].name === "west") {
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

import { ROOMS } from "../data/room_data";
import { randItem } from "../utility";
import { IndividualSoul } from "../individualSoul";
import { SOUL_LIST } from "../data/soul";

class RoomInfo {
	room: Room;

	name: string;
	description: string;
	
	encounters: Array<Array<IndividualSoul>>;

	constructor(room: Room) {
		this.room = room;

        const randNoun = randItem(ROOMS.CLOTHING);
		
        this.name = randNoun.word + " " + randItem(ROOMS.PLACES);
        this.name = RoomGen.addNumber(this.name);
        this.name = RoomGen.format(this.name);

        this.description = randItem(randNoun.descriptions);

		this.encounters = [];
		this.generateEncounters();
    }

	html(): string {
		const title = "<h3>" + this.name + "</h3>";

		const description = "<p>" + this.description + "</p>";

		let exits = "";
		let encounters = "";

			exits = "<p>Exits: ";
			for (let i = 0; i < this.room.connections.length; i++) {
				const c = this.room.connections[i];
				if (c !== null) {
					exits += CONSTANTS.DIRECTIONS[i].name + " to ";

					exits += "<a class='exitLink' direction='" + CONSTANTS.DIRECTIONS[i].name + "'>";
					exits += c.otherRoom(this.room).info.name;
					exits += "</a>";

					exits += " | ";
				}
			}
			exits += "</p>";

		if (this.encounters.length === 0) {
		}
		else {
			let encounter_index = randIndex(this.encounters);
			let encounter = this.encounters[encounter_index];

			encounters = "<p>"
			encounters += "<a class='battleLink' encounterIndex=" + encounter_index + ">";
			if (encounter!.length === 1) {
				encounters += "You see " + indefinite_article(encounter![0].name) + " " + encounter![0].name + "!";
			}
			else if (encounter!.length >= 1) {
				encounters += "You see: ";
				for (let i = 0; i < encounter!.length; i++) {
					encounters += indefinite_article(encounter![i].name) + " " + encounter![i].name;

					if (i === encounter!.length - 2) {
						encounters += ", and "
					}
					else if (i < encounter!.length - 1) {
						encounters += ", "
					}
				}
				encounters += "!";
			}
			else {
				console.error("Room contains encounter with 0 enemies!");
			}
			encounters += "</a></p>";
		}


		return title + description + exits + encounters;
	}

	generateEncounters() {
		const encounterArray = [];
		for (let i = 0; i < Math.random() * 5 + 1; i++) {
			const enemy1 = new IndividualSoul(SOUL_LIST.Adware, 1);
			encounterArray.push(enemy1);

			if (Math.random() < 0.6) {
				break;
			}
		}
		this.encounters.push(encounterArray);
	}
}

export {
    Room,
	Connection
};