const vault = require('./src/iota-seed-encrypt');
module.exports = vault;

/*   
// Playground for current and potential testers and developers of the package
(async() => {
    // Generate true random seeds of various encodings
    let seed = vault.generateSeed();
    seed = vault.generateSeed('hex');
    seed = vault.generateSeed('binary');
    seed = vault.generateSeed('bip39');
 
    // Set a fixed seed, for testing
    //let seed = new Uint8Array(vault.SEED_LEN);
    seed[0] = 0xF0;
    seed[1] = 0x0F;
    seed[vault.SEED_LEN-1] = 0x01;
    
    seed = "useless job abandon    abandon \t abandon\tabandon\r\nabandon\nabandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon check";
    seed = "0102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1FFF";
    seed = [1,2,3,4,5,6,7,8,9,10,1,2,3,4,5,6,7,8,9,10,1,2,3,4,5,6,7,8,9,10,9,8];
    
    // Never set the salt yourself unless when debugging to control the encyption of the seed. (OR if you kow what you are doing.) 
    let salt;
    salt = new Uint8Array(vault.SALT_LEN);
    salt = [1,2,3,4,5,6,7,8];
    salt = undefined;
    
    let toughness = -1;  // Normally: zero or higher
    console.log('Original seed: ',seed.length, seed);
    let encrypted = await vault.encryptSeed(seed, 'Ƥāssφräsę', toughness, salt);
    console.log('Encrypted seed: ',encrypted.length, encrypted);
    
    
    // Decrypt back to the seed
    let decrypted;
    let encoding = vault.guessEncoding(seed);  // Decrypting back to original encoding is nice when testing, but not vital. Normally, use default bip39.
    try {
        decrypted = await vault.decryptSeed(encrypted, 'Ƥa\u0304ssφra\u0308se\u0328', encoding);  // Testing passphrase with decomposed UTF-8 characters
    } catch (err) {
        console.log('Cannot decrypt seed: ', err.message);
    }
    console.log('Decrypted the seed: ', decrypted);

    // Verify the decrypted 
    if (decrypted) {
        console.log(decrypted.length, decrypted);
        
        seed = vault.encodeByteSeed(vault.decodeSeedToBytes(seed), 'hex');
        decrypted = vault.encodeByteSeed(vault.decodeSeedToBytes(decrypted), 'hex');
        
        if (seed === decrypted) {
            console.log('DECRYPTED SEED OK!');
        } else {
            console.log('DECRYPTED DOES NOT MATCH THE SEED');
        }
    }

})();
// */