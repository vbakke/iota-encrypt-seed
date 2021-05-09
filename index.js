const vault = require('./src/iota-seed-encrypt');
module.exports = vault;

/*
(async() => {
    const { validateMnemonic } = require('bip39');
    let seed = vault.generateSeed();
    seed = vault.generateSeed('hex');
    seed = vault.generateSeed('binary');
    seed = vault.generateSeed('bip39');
    vault.guessEncoding('iota1qp7s4672nmyahvv4v4saxqj4rx7su8447dpa678n23ed706c55ey550d680');
    //let seed = new Uint8Array(vault.SEED_LEN);
    let salt = new Uint8Array(vault.SALT_LEN);
    seed[0] = 0xF0;
    seed[1] = 0x0F;
    seed[vault.SEED_LEN-1] = 0x01;
    seed = "useless job abandon    abandon \t abandon\tabandon\r\nabandon\nabandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon check";
    seed = [1,2,3,4,5,6,7,8,9,10,1,2,3,4,5,6,7,8,9,10,1,2,3,4,5,6,7,8,9,10,9,8];
    salt = [1,2,3,4,5,6,7,8];
    seed = "0102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1FFF";
    let encrypted = await vault.encryptSeed(seed, 'Ƥāssφräsę', 0, salt);
    console.log(encrypted.length, encrypted);
    let encoding = vault.guessEncoding(seed);
    let decrypted = await vault.decryptSeed(encrypted, 'Ƥāssφräsę', encoding);
    console.log(decrypted.length, decrypted);
    
    seed = vault.encodeByteSeed(vault.decodeSeedToBytes(seed), 'hex');
    decrypted = vault.encodeByteSeed(vault.decodeSeedToBytes(decrypted), 'hex');
    if (seed === decrypted) console.log('DECRYPTED SEED OK!');
    else console.log('DECRYPTED DOES NOT MATCH THE SEED');

   

})();
// */