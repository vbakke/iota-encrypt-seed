const chai = require('chai');
const assert = chai.assert;
const vault = require('../src/iota-seed-encrypt');


module.exports = function () {

    describe('Encrypt and decrypting seeds', function () {

        const tests = [
            {
                // All default
            },
            {
                passphrase: 'Someting else'
            },
            {
                seed: "useless job abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon check",
            },
            {
                seed: "0102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1FFF",
                salt: [1, 2, 3, 4, 5, 6, 7, 8],
                passphrase: 'Ƥāssφräsę',
                encrypted: '053RB5CQF3QD21CNPR89V3QZD4QTXFP6CX4K9EB0F57WVCRHG1P7C0820C20A1G7139YD0EV'
            },
            {
                seed: "useless job abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon check",
                salt: [1, 2, 3, 4, 5, 6, 7, 8],
                toughness: -2,
                encrypted: '049XXTEVDPH7TY3RKAGF2BYWEF6M6C4EPE4F3G1NQ0X15FC7DFHD40820C20A1G711RNP3Q4:T-2'
            },
            {
                seed: "useless job abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon check",
                salt: [1, 2, 3, 4, 5, 6, 7, 8],
                toughness: -1,
                encrypted: '07FGG02Q2AEKPDER3X9DY94BGS0RTA68662V68SXZ16RZFD7XCN5J0820C20A1G711TEKHSM:T-1'
            },
            {
                seed: "useless job abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon check",
                salt: [1, 2, 3, 4, 5, 6, 7, 8],
                toughness: 0,
                encrypted: '062KQ013WVR3THJN8VZZD6JQ5G3TBRM0DEN6D0KXKQE7WAXEM2CX60820C20A1G713RTXWBS'
            },
            {
                seed: "useless job abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon check",
                salt: [1, 2, 3, 4, 5, 6, 7, 8],
                toughness: 1,
                encrypted: '0555ZNYX0S3NHQWVXD77YV1ZEHWV0XK1GBQ8DVYAM8JHJZX4DA9YW0820C20A1G712FW1WP5:T1'
            },
        ];

        for (let test of tests) {
            let seed = test.seed || vault.generateSeed();
            let passphrase = test.passphrase || 'Passφräsę';
            it('should encrypt: "' + seed + '" with: "' + passphrase + '"', async function () {
                this.timeout(15 * 1000);

                let toughness = test.toughness || 0;
                let salt = test.salt || undefined;

                let encrypted = await vault.encryptSeed(seed, passphrase, toughness, salt);
                assert.isNotNull(encrypted, 'For ' + passphrase);
                if (test.encrypted) assert.strictEqual(encrypted, test.encrypted, 'For ' + passphrase);
                console.log('DBG: Encrypted seed:', encrypted);

                let encoding = vault.guessEncoding(seed);
                let decrypted = await vault.decryptSeed(encrypted, passphrase, encoding);
                assert.isNotNull(decrypted, 'For ' + passphrase);
                assert.strictEqual(decrypted, seed, 'For ' + passphrase);

            });
        }
    });
}