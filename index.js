const { validateMnemonic } = require('bip39');
const vault = require('./src/iota-seen-encrypt/iota-seed-encrypt');

(async() => {

    let seed = new Uint8Array(vault.SEED_LEN);
    let salt = new Uint8Array(vault.SALT_LEN);
    encrypted = await vault.encryptSeed(seed, 'ThisIsABenchmark!123', null, '13245678');
    encrypted = await vault.encryptSeed(seed, 'password', null, salt);
    console.log(encrypted, encrypted.length);
    console.log(encrypted = await vault.encryptSeed(seed, 'password', 1, 'saltsalt'));
    console.log(encrypted = await vault.encryptSeed(seed, 'password', 1, salt));

    salt[0]+= 0x80;
    salt[vault.SALT_LEN-1]++;

    encrypted = await vault.encryptSeed(seed, 'pass', null, salt);
    console.log(encrypted);
    
    encrypted = await vault.generateEncryptedSeed('Pãssprasë');
    console.log(encrypted);

})();