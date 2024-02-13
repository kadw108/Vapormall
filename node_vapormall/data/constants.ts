export namespace CONSTANTS {
  export enum STATS {
    HP = "HP",
    ATTACK = "attack",
    DEFENSE = "defense",
    GLITCHATTACK = "glitch attack",
    GLITCHDEFENSE = "glitch defense",
    SPEED = "speed"
  }
  export const STAT_ABBREVIATION: { [id: string] : string; } = {
    "HP": "HP",
    "attack": "atk",
    "defense": "def",
    "glitch attack": "glA",
    "glitch defense": "glD",
    "speed": "spe"
  };

  export enum SKILLCATEGORIES {
    NORMALDAMAGE = "normal damage",
    GLITCHDAMAGE = "glitch damage",
    STATUS = "status"
  }

  export enum TYPES {
    TYPELESS = "typeless",
    SWEET = "sweet",
    EDGE = "edge",
    CORPORATE = "corporate",
    SANGFROID = "sangfroid",
    ERROR = "error"
  }

  export enum TARGETS {
    SELECTED,
    OPPOSING,
    ALLIED,
    ALLY,
    ALL,
    SELF,
    NONE
  }

  interface Direction {
    name: string,
    number: number
  }
  export const DIRECTIONS: Array<Direction> = [
    {"name": "north", "number": 0},
    {"name": "east", "number": 1},
    {"name": "south", "number": 2},
    {"name": "west", "number": 3},
  ];
}

export type StatDict = { [key in CONSTANTS.STATS] : number };