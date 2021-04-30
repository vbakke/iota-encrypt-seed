const { validateMnemonic } = require('bip39');
const vault = require('./src/iota-seen-encrypt/iota-seed-encrypt');

(async() => {

    let seed = new Uint8Array(vault.SEED_LEN);
    let salt = new Uint8Array(vault.SALT_LEN);
    let encrypted = await vault.encryptSeed(seed, 'argon2', 1, salt);
    console.log(encrypted.length, encrypted);
    let decrypted = await vault.decryptSeed(encrypted, 'argon2');
    console.log(decrypted.length, decrypted);
    
    // let key;
    // for (let t=0; t<10; t++) {
    //      await vault.generateKey('argon2', '12345678', t-5);
    // }
    // encrypted = await vault.encryptSeed(seed, 'ThisIsABenchmark!123', null, '12345678');
    // console.log(encrypted, encrypted.length);
    // console.log(encrypted = await vault.encryptSeed(seed, 'password', 1, 'saltsalt'));
    // console.log(encrypted = await vault.encryptSeed(seed, 'password', 1, salt));

    // salt[0]+= 0x80;
    // salt[vault.SALT_LEN-1]++;

    // encrypted = await vault.encryptSeed(seed, 'pass', null, salt);
    // console.log(encrypted);
    
    // encrypted = await vault.generateEncryptedSeed('Pãssprasë');
    // console.log(encrypted);

})();