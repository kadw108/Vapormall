import * as PIXI from "pixi.js-legacy";
import { Context, moveInfo } from "..";
import * as PIXI_SOUND from "@pixi/sound";
import { IResources, Music } from "..";

const SFX = ["pressab","psn","ballpoof","hit","hitresisted","hitsupereffective","faint"];
const SHADERS = ["oppAppear", "plyAppear", "faint"];

export default class Resources implements IResources {
    uniforms: { [index: string]: { step: number; }; } = {};
    playingMusic: PIXI_SOUND.Sound | null = null;

    private readonly demoFrontTexture: PIXI.Texture;
    private readonly demoBackTexture: PIXI.Texture;

    private readonly loader = Context.createPIXILoader();

    private filters: Map<string, PIXI.Filter> = new Map();
    private shaderNames: Set<string> = new Set();

    private moveCache: Set<string> = new Set();

    constructor(moves: string[]) {
        this.demoFrontTexture = PIXI.Texture.from("demofront.png");
        this.demoBackTexture = PIXI.Texture.from("demoback.png");
        // this.demoFrontTexture = PIXI.Texture.WHITE;
        // this.demoBackTexture = PIXI.Texture.WHITE;

        for (const sfx of SFX) {
            this.loader.add(sfx, "assets/" + sfx + ".wav");
        }
        
        for (const fs of SHADERS) {
            this.shaderNames.add(fs);
            this.loader.add(`shaders/${fs}.fs`);
        }
        this.loadMoves(moves);
    }

    load(callback: (resources: IResources) => any) {
        this.loader.load((_, resources) => {
            this.createShaders(resources);
            callback(this);
            this.loader.reset();
        });
    }

    forceLoad(): Promise<IResources> {
        return new Promise((resolve, reject) => {
            this.loader.onError.add(err => console.error(err));
            this.load(resolve);
        })
    }

    loadMoves(moves: string[]) {
        for (const move of moves) {
            if (this.moveCache.has(move)) continue;
            this.moveCache.add(move);
            const moveStill = move + "_STILL";
            if (moveInfo[moveStill] != null) {
                moves.push(moveStill);
            }
            const moveData = moveInfo[move];
            if (moveData.sfx) {
                console.log(`Loading sfx "${moveData.sfx}"`);
                this.loader.add(moveData.sfx, `assets/attacksfx/${moveData.sfx}.wav`);
            }
            if (moveData.shaders) {
                moveData.shaders.forEach(s => {
                    const file = `shaders/${s}.fs`;
                    console.log(`Trying to load shader "${s}" at "${file}"`);
                    this.loader.add(file);
                    this.shaderNames.add(s);
                });
            }
        }
    }

    private createShaders(resources: any) {
        this.shaderNames.forEach(s => {
            if (this.filters.get(s) != null) return;
            console.log(`Created filter for ${s}`);
            this.uniforms[s] = { step: 0 };
            this.filters.set(s, new PIXI.Filter(
                undefined,
                resources[`shaders/${s}.fs`].data as string,
                this.uniforms[s]
            ));
        });
    }

    getMusic(music: Music): PIXI_SOUND.Sound | undefined {
        throw new Error("Method not implemented.");
    }

    getShader(name: string): PIXI.Filter | undefined {
        if (!this.filters.has(name)) {
            throw new Error(`filter ${name}`);
        }
        return this.filters.get(name)!;
    }
    getCry(id: string): string | undefined {
        return undefined;
    }
    getOpponentTrainerTexture(): PIXI.Texture<PIXI.Resource> | undefined {
        return undefined;
    }
    getPlayerTrainerTexture(): PIXI.Texture<PIXI.Resource> | undefined {
        return undefined;
    }
    getFront(id: string): PIXI.Texture<PIXI.Resource>[] {
        return [ this.demoFrontTexture ];
    }
    getBack(id: string): PIXI.Texture<PIXI.Resource> {
        return this.demoBackTexture;
    }
};