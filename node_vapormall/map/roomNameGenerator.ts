class RoomNameGenerator {

    public static roomName():string {
        return "room" + Math.floor(Math.random() * 100000);
    }
}

export {
    RoomNameGenerator
};
