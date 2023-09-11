export namespace CONSTANTS {
  export enum STATS {
    HP = "HP",
    OFFENSE = "offense",
    DEFENSE = "defense",
    GLITCHOFFENSE = "glitch offense",
    GLITCHDEFENSE = "glitch defense",
    SPEED = "speed"
  }

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
}

export type StatDict = { [key in CONSTANTS.STATS] : number };