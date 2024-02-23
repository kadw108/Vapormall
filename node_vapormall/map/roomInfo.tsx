import { Room } from "./room";
import { RoomGen } from "./roomNameGenerator";

import { ROOMS } from "../data/room_data";
import { CONSTANTS } from "../data/constants";
import { SOUL_LIST } from "../data/soul";

import { IndividualSoul } from "../soul/individualSoul";
import { indefinite_article, popIndex, randIndex, randItem } from "../utility";

class RoomInfo {
	room: Room;

	name: string;
	description: string;
	
	encounter: Array<IndividualSoul>;

	constructor(room: Room) {
		this.room = room;

        const randNoun = randItem(ROOMS.CLOTHING);
		
        this.name = randNoun.word + " " + randItem(ROOMS.PLACES);
        this.name = RoomGen.addNumber(this.name);
        this.name = RoomGen.format(this.name);

        this.description = randItem(randNoun.descriptions);

		this.encounter = this.generateEncounters();
    }

	html(): JSX.Element {
		let exits: JSX.Element|string = "";
		// if (this.encounter.length === 0) {
		if (this.encounter.length === this.encounter.length) {
			exits = <p>
				Exits:
				{this.room.connections.filter(c => c !== null).map((c, i) => {
					return <span>
						{CONSTANTS.DIRECTIONS[i].name} to 

						{/* @ts-ignore for direction */}
						<a className="exitLink" direction={CONSTANTS.DIRECTIONS[i].name}>
							{c!.otherRoom(this.room).info.name}
						</a> | 
					</span>;
				})}
			</p>;
		}

		let encounters: JSX.Element|string = "";
		if (this.encounter.length === 0) {
		}
		else {
			encounters = <p>
				{(this.encounter.length === 1) &&
					<a className="battleLink">
						You see {indefinite_article(this.encounter[0].name)} {this.encounter[0].name}!
					</a>
				}
			</p>;
			/*
			else if (this.encounter.length >= 1) {
				encounters += "You see: ";
				for (let i = 0; i < this.encounter.length; i++) {
					encounters += indefinite_article(this.encounter[i].name) + " " + this.encounter[i].name;

					if (i === this.encounter.length - 2) {
						encounters += ", and "
					}
					else if (i < this.encounter.length - 1) {
						encounters += ", "
					}
				}
				encounters += "!";
			}
			*/
		}

		return (<div>
			<h3>{this.name}</h3>
			<p>{this.description}</p>

			{exits}
			{encounters}
		</div>);
	}

	generateEncounters() {
		const encounterArray = [];
		for (let i = 0; i < 1; i++) {
			const enemy1 = new IndividualSoul(SOUL_LIST.Adware, Math.ceil(Math.random() * 4));
			encounterArray.push(enemy1);

			if (Math.random() < 0.6) {
				break;
			}
		}
		return encounterArray;
	}

	popEncounter() {
		if (this.encounter.length === 0) {
			console.error("Trying to get encounter from room with no encounters!");
			return null;
		}
		else {
			return popIndex(this.encounter, randIndex(this.encounter));
		}
	}
}

export {
    RoomInfo
}