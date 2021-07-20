export function getScriptType(script) {
    var type = undefined

    if (script[0] == bitcoin.opcodes.OP_0 &&
        script[1] == 20) {
        type = 'bech32'
    }

    if (script[0] == bitcoin.opcodes.OP_HASH160 &&
        script[1] == 20) {
        type = 'segwit'
    }

    if (script[0] == bitcoin.opcodes.OP_DUP &&
        script[1] == bitcoin.opcodes.OP_HASH160 &&
        script[2] == 20) {
        type = 'legacy'
    }

    return type
}
//
// 02000000000101ad4e0774a7eff738335d7b271bbace67092726bba92c79c9dfb421611e0911591900000000ffffffff02a086010000000000  2d73756761723171727979616e6376347333766c786c776c756a637775776430613975337438783438706c346370ae56042a010000002d7375676172317171747a346b386b6b6a3035737a756461367336353264633261633965766b307a74733674636402473044022018a49146d0e23bfb3a7d9b0333ade2964474b0ff2c9a30c2a3d2a1a89f70b40d02205e1082d10fd9ace301745511238846a78d8123690056d163d0909f44293e4aa2    0121033c1428996b0f38f84ad44b0e81d8d39c0ccfc061da8b09ef736b5e36ad49552100000000
// 02000000000101ad4e0774a7eff738335d7b271bbace67092726bba92c79c9dfb421611e0911591900000000ffffffff02a086010000000000  1600141909d9e1958459f37ddfe4b0ee39afe979159cd58633042a0100000016001402c55b1ed693e90171bdd43545370aee0b9659e202473044022056ee3f8e79d32df0b5f32344330bd75a89b2cd5ddbe18ae5eb05efabbb89651502200b9eba1ae4dccc8dce6237887ae1174849e4799e6da80a43291581c8461a7d9f                                                                                                0121033c1428996b0f38f84ad44b0e81d8d39c0ccfc061da8b09ef736b5e36ad49552100000000