interface MoveInfo {
  // name of sound effect
  // if undefined: use cry
  sfx?: string;
  // -1 means play on side of pokemon using the attack, 1 is opposite
  pan?: number;
  // special text to display
  text?: string;
  // specify that NO sfx should be played
  noSfx?: boolean;
  // specify what shaders to load
  shaders?: string[];
}

const moveInfo: { [move: string]: MoveInfo } = {
    "POUND":{
      
    },
    "KARATE CHOP":{
      
    },
    "DOUBLE SLAP":{
      
    },
    "COMET PUNCH":{
      
    },
    "MEGA PUNCH":{
      
    },
    "PAY DAY":{
      
    },
    "FIRE PUNCH":{
      
    },
    "ICE PUNCH":{
      
    },
    "THUNDERPUNCH":{
      
    },
    "SCRATCH":{
      "sfx":"Scratch",
      "pan":1
    },
    "VISE GRIP":{
      
    },
    "GUILLOTINE":{
      
    },
    "RAZOR WIND":{
      
    },
    "SWORDS DANCE":{
      "sfx":"SwordsDance",
      "pan":-1
    },
    "CUT":{
      
    },
    "GUST":{
      
    },
    "WING ATTACK":{
      sfx: "WingAttack",
      pan: 1
    },
    "WHIRLWIND":{
      
    },
    "FLY":{
      "sfx":"FlyHit",
      "pan":1
    },
    "FLY_STILL":{
      "sfx":"FlyUp",
      "pan":-1,
      "text":"flew up high"
    },
    "BIND":{
      
    },
    "SLAM":{
      
    },
    "VINE WHIP":{
      "sfx":"VineWhip",
      "pan":1
    },
    "STOMP":{
      
    },
    "DOUBLE KICK":{
      
    },
    "MEGA KICK":{
      
    },
    "JUMP KICK":{
      "sfx":"JumpKick",
    },
    "ROLLING KICK":{
      
    },
    "SAND ATTACK":{
      "sfx":"SandAttack"
    },
    "HEADBUTT":{
      
    },
    "HORN ATTACK":{
      
    },
    "FURY ATTACK":{
      
    },
    "HORN DRILL":{
      
    },
    "TACKLE":{
      "sfx":"Tackle",
      "pan":1
    },
    "BODY SLAM":{
      sfx: "BodySlam",
      pan: 1 
    },
    "WRAP":{
      
    },
    "TAKE DOWN":{
      
    },
    "THRASH":{
      
    },
    "DOUBLE-EDGE":{
      
    },
    "TAIL WHIP":{
      "sfx":"TailWhip",
      "pan":-1
    },
    "POISON STING":{
      
    },
    "TWINEEDLE":{
      
    },
    "PIN MISSILE":{
      
    },
    "LEER":{
    },
    "BITE":{
      
    },
    "GROWL":{
      "pan":-1
    },
    "ROAR":{
      "pan":-1
    },
    "SING":{
      "sfx":"Sing",
      "pan":-1
    },
    "SUPERSONIC":{
      "sfx":"SuperSonic",
      "pan":1
    },
    "SONIC BOOM":{
      
    },
    "DISABLE":{
      "sfx":"Disable",
      "pan":1
    },
    "ACID":{
      
    },
    "EMBER":{
      "sfx":"Ember"
    },
    "FLAMETHROWER":{
      sfx: "Flamethrower",
      pan: 1
    },
    "MIST":{
      
    },
    "WATER GUN":{
      
    },
    "HYDRO PUMP":{
      
    },
    "SURF":{
      sfx:"Surf",
      pan: 0,
      shaders: ["surf"]
    },
    "ICE BEAM":{
      "sfx":"IceBeam",
      "pan":1
    },
    "BLIZZARD":{
      sfx: "Blizzard",
      pan: 1
    },
    "PSYBEAM":{
      
    },
    "BUBBLE BEAM":{
      
    },
    "AURORA BEAM":{
      "sfx":"AuroraBeam"
    },
    "HYPER BEAM":{
      
    },
    "PECK":{
      
    },
    "DRILL PECK":{
      "sfx":"DrillPeck"
    },
    "SUBMISSION":{
      "sfx":"Submission"
    },
    "LOW KICK":{
      
    },
    "COUNTER":{
      
    },
    "SEISMIC TOSS":{
      "sfx":"SeismicToss"
    },
    "STRENGTH":{
      
    },
    "ABSORB":{
      
    },
    "MEGA DRAIN":{
      
    },
    "LEECH SEED":{
      
    },
    "GROWTH":{
      
    },
    "RAZOR LEAF":{
      
    },
    "SOLAR BEAM":{
      sfx: "SolarBeam",
      pan: 0
    },
    "SOLAR BEAM_STILL":{
      sfx: "SolarBeamCharge",
      text: "took in sunlight",
      pan: -1
    },
    "POISONPOWDER":{
    },
    "STUN SPORE":{
      "sfx":"StunSpore",
    },
    "SLEEP POWDER":{
      
    },
    "PETAL DANCE":{
      
    },
    "STRING SHOT":{
      
    },
    "DRAGON RAGE":{
      
    },
    "FIRE SPIN":{
      sfx: "FireSpin",
      pan: 0
    },
    "THUNDER SHOCK":{
      
    },
    "THUNDERBOLT":{
      sfx:"Thunderbolt",
      pan: 1
    },
    "THUNDER WAVE":{
      "sfx":"ThunderWave",
    },
    "THUNDER":{
      sfx: "Thunder",
      pan: 1
    },
    "ROCK THROW":{
      
    },
    "EARTHQUAKE":{
      "sfx":"Earthquake"
    },
    "FISSURE":{
      
    },
    "DIG":{
      
    },
    "TOXIC":{
      sfx: "Toxic",
      pan: 1
    },
    "CONFUSION":{
      "sfx":"Confusion"
    },
    "PSYCHIC":{
      sfx: "Psychic",
      shaders: [ "psychic" ]
    },
    "HYPNOSIS":{
      
    },
    "MEDITATE":{
      
    },
    "AGILITY":{
      "sfx":"AGILITY",
    },
    "QUICK ATTACK":{
      sfx: "QuickAttack",
      pan: 0
    },
    "RAGE":{
      sfx: "Rage",
      pan: 0,
      shaders: [ "rage" ]
    },
    "TELEPORT":{
      
    },
    "NIGHT SHADE":{
      
    },
    "MIMIC":{
      
    },
    "SCREECH":{
      
    },
    "DOUBLE TEAM":{
      "sfx":"DoubleTeam"
    },
    "RECOVER":{
      "sfx":"Recover"
    },
    "HARDEN":{
      
    },
    "MINIMIZE":{
      
    },
    "SMOKESCREEN":{
      "sfx":"SmokeScreen"
    },
    "CONFUSE RAY":{
      "sfx":"ConfuseRay",
    },
    "WITHDRAW":{
      
    },
    "DEFENSE CURL":{
      "sfx":"DefenseCurl",
    },
    "BARRIER":{
    },
    "LIGHT SCREEN":{
      
    },
    "HAZE":{
      
    },
    "REFLECT":{
      pan: -1,
      sfx: "Reflect"      
    },
    "FOCUS ENERGY":{
      "sfx":"FocusEnergy",
    },
    "BIDE":{
      
    },
    "METRONOME":{
      "sfx":"Metronome",
      "pan":-1
    },
    "MIRROR MOVE":{
      
    },
    "SELF-DESTRUCT":{
      
    },
    "EGG BOMB":{
      
    },
    "LICK":{
      
    },
    "SMOG":{
      
    },
    "SLUDGE":{
      
    },
    "BONE CLUB":{
      
    },
    "FIRE BLAST":{
      sfx: "FireBlast",
      pan: 1
    },
    "WATERFALL":{
      
    },
    "CLAMP":{
      
    },
    "SWIFT":{
      sfx: "Swift",
      pan: 1
    },
    "SKULL BASH":{
      
    },
    "SKULL BASH_STILL":{
      "text":"lowered its head"
    },
    "SPIKE CANNON":{
      
    },
    "CONSTRICT":{
      
    },
    "AMNESIA":{
      sfx: "Amnesia",
      pan: -1
    },
    "KINESIS":{
      
    },
    "SOFT-BOILED":{
      "sfx":"SoftBoiled"
    },
    "HI JUMP KICK":{
      
    },
    "GLARE":{
      
    },
    "DREAM EATER":{
      
    },
    "POISON GAS":{
      
    },
    "BARRAGE":{
      
    },
    "LEECH LIFE":{
      
    },
    "LOVELY KISS":{
      
    },
    "SKY ATTACK":{
      
    },
    "TRANSFORM":{
      
    },
    "BUBBLE":{
      
    },
    "DIZZY PUNCH":{
      "sfx":"DizzyPunch"
    },
    "SPORE":{
      
    },
    "FLASH":{
      
    },
    "PSYWAVE":{
      
    },
    "SPLASH":{
      
    },
    "ACID ARMOR":{
      
    },
    "CRABHAMMER":{
      
    },
    "EXPLOSION":{
      
    },
    "FURY SWIPES":{
      
    },
    "BONEMERANG":{
      
    },
    REST:{
      noSfx: true,
      pan: -1
    },
    "ROCK SLIDE":{
      
    },
    "HYPER FANG":{
      
    },
    "SHARPEN":{
      
    },
    "CONVERSION":{
      
    },
    "TRI ATTACK":{
      "sfx":"TriAttack"
    },
    "SUPER FANG":{
      
    },
    "SLASH":{
      "sfx":"Slash",
    },
    "SUBSTITUTE":{
      "sfx":"Substitute",
      "pan":-1
    },
    "STRUGGLE":{
      
    },
    "SKETCH":{
      
    },
    "TRIPLE KICK":{
      
    },
    "THIEF":{
      
    },
    "SPIDER WEB":{
      
    },
    "MIND READER":{
      
    },
    "NIGHTMARE":{
      
    },
    "FLAME WHEEL":{
      
    },
    "SNORE":{
      sfx: "Snore",
      pan: -1
    },
    "CURSE":{
      
    },
    "FLAIL":{
      
    },
    "CONVERSION 2":{
      
    },
    "AEROBLAST":{
      
    },
    "COTTON SPORE":{
      
    },
    "REVERSAL":{
      
    },
    "SPITE":{
      
    },
    "POWDER SNOW":{
      
    },
    "PROTECT":{
      
    },
    "MACH PUNCH":{
      
    },
    "SCARY FACE":{
      
    },
    "FEINT ATTACK":{
      
    },
    "SWEET KISS":{
      
    },
    "BELLY DRUM":{
      
    },
    "SLUDGE BOMB":{
      "sfx":"SludgeBomb",
      "pan":1
    },
    "MUD-SLAP":{
      sfx:"MudSlap",
      pan: 1
    },
    "OCTAZOOKA":{
      
    },
    "SPIKES":{
      
    },
    "ZAP CANNON":{
      
    },
    "FORESIGHT":{
      
    },
    "DESTINY BOND":{
      
    },
    "PERISH SONG":{
      
    },
    "ICY WIND":{
      
    },
    "DETECT":{
      
    },
    "BONE RUSH":{
      
    },
    "LOCK-ON":{
      
    },
    "OUTRAGE":{
      
    },
    "SANDSTORM":{
      
    },
    "GIGA DRAIN":{
      sfx: "GigaDrain",
      pan: 0,
      shaders: [ "synthesis" ]
    },
    "ENDURE":{
      
    },
    "CHARM":{
      sfx: "Charm",
      pan: -1
    },
    "ROLLOUT":{
      
    },
    "FALSE SWIPE":{
      
    },
    "SWAGGER":{
      
    },
    "MILK DRINK":{
      
    },
    "SPARK":{
      
    },
    "FURY CUTTER":{
      
    },
    "STEEL WING":{
      "sfx":"SteelWing",
    },
    "MEAN LOOK":{
      
    },
    "ATTRACT":{
      
    },
    "SLEEP TALK":{
      "sfx":"SleepTalk"
    },
    "HEAL BELL":{
      
    },
    "RETURN":{
      sfx: "Return",
      pan: 1
    },
    "PRESENT":{
      
    },
    "FRUSTRATION":{
      
    },
    "SAFEGUARD":{
      
    },
    "PAIN SPLIT":{
      
    },
    "SACRED FIRE":{
      
    },
    "MAGNITUDE":{
      
    },
    "DYNAMICPUNCH":{
      "sfx":"DynamicPunch",
    },
    "MEGAHORN":{
      
    },
    "DRAGONBREATH":{
      "sfx":"DragonBreath",
    },
    "BATON PASS":{
      
    },
    "ENCORE":{
      "sfx":"Encore",
      "pan":-1
    },
    "PURSUIT":{
      
    },
    "RAPID SPIN":{
      
    },
    "SWEET SCENT":{
      
    },
    "IRON TAIL":{
      
    },
    "METAL CLAW":{
      
    },
    "VITAL THROW":{
      "sfx":"VitalThrow"
    },
    "MORNING SUN":{
      
    },
    "SYNTHESIS":{
      sfx: "Synthesis",
      pan: -1,
      shaders: [ "synthesis" ]
    },
    "MOONLIGHT":{
      "sfx":"Moonlight",
      "pan":-1
    },
    "HIDDEN POWER":{
      
    },
    "CROSS CHOP":{
      "sfx":"CrossChop",
    },
    "TWISTER":{
      
    },
    "RAIN DANCE":{
      sfx: "RainDance",
      pan: 0
    },
    "SUNNY DAY":{
      sfx: "SunnyDay",
      pan: 0
    },
    "CRUNCH":{
      "sfx":"Crunch",
    },
    "MIRROR COAT":{
      
    },
    "PSYCH UP":{
      
    },
    "EXTREMESPEED":{
      "sfx":"ExtremeSpeed"
    },
    "ANCIENTPOWER":{
      sfx:"AncientPower"
    },
    "SHADOW BALL":{
      "sfx":"ShadowBall"
    },
    "FUTURE SIGHT":{
      
    },
    "ROCK SMASH":{
      
    },
    "WHIRLPOOL":{
      sfx: "Whirlpool",
      pan: 1,
      shaders: ["surf"]
    },
    "BEAT UP":{
      
    }
  }
export default moveInfo;