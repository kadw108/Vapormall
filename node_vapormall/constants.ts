export namespace CONSTANTS {
  export enum STATS {
    HP,
    OFFENSE,
    DEFENSE,
    GLITCHOFFENSE,
    GLITCHDEFENSE,
    SPEED
  }

  export enum SKILLCATEGORIES {
    NORMALDAMAGE,
    GLITCHDAMAGE,
    STATUS
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
