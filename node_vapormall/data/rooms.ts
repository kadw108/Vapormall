interface RoomNoun {
    word: string;
    descriptions: Array<string>;
}

export namespace ROOMS {
    export const CLOTHING: Array<RoomNoun> = [
        {word: "dress", descriptions: [
            "Velvet sundresses sway in the digital breeze.",
            "Pleated skirts and petticoats. Perfume seeps into simulated nasal ducts."
        ]},
        {word: "suit", descriptions: [
            "Double-breasted. Rows of gleaming silver buttons untarnished by time.",
            "Pinstripe black and white. Urbane flair."
        ]},
        {word: "perfume", descriptions: [
            "Glittering bottles."
        ]},
        {word: "tie", descriptions: [
            "Slick, sharp, colored in vaguely nauseating fashion."
        ]},
        {word: "shirt", descriptions: [
            "Cloth scraps in a scrapyard world."
        ]},
        {word: "jacket", descriptions: [
            "Sleek leather jackets, demure gray cotton jackets, formal suit jackets..."
        ]},
        {word: "shimmer", descriptions: [
            "Shimmering skins for your avatar! Now 30% off!"
        ]},
        {word: "gloves", descriptions: [
            "Fingerless gloves drifting in the air. There is no gravity here."
        ]},
        {word: "trouser", descriptions: [
            "Denim, denim, denim."
        ]},
        {word: "face", descriptions: [
            "Bearing expressions of all kinds, so you can emote properly."
        ]},
        {word: "sunglasses", descriptions: [
            "Mysterious aviator glasses or blue-rimmed horned lenses for the scholar?"
        ]},
        {word: "hands", descriptions: [
            "Of all shapes and colors!"
        ]}
    ];

    export const PLACES = [
        "lounge", "suite", "court", "plaza", "aisle", "outlet", "store", "boutique", "hall"
    ];

}