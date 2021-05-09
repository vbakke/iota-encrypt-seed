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
                encrypted: '053RB5CQF3QD21CNPR89V3QZD4QTXFP6CX4K9EB0F57WVCRHG1P7C0820C20A1G7139YD0EV'
            },
            {
                seed: "BAD0005EED000102030405060708090A0B0C0D0E0F10111213141516171819FF",
                salt: [1, 2, 3, 4, 5, 6, 7, 8],
                toughness: 0,
                encrypted: '07Y5F5PDJ3MDE3WZQ0F9F17SDWTV986RFN9K5FVAED0W7E8VGSN7C0820C20A1G713WDQNHX'
            },
            {
                seed: "useless job abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon check",
                salt: [1, 2, 3, 4, 5, 6, 7, 8],
                toughness: -2,
                encrypted: '04N5ZRMQD8RC1GF4M7CFGFVAY66GB97ZZX8RR043PBZ11TZFGQD7R0820C20A1G71277AFDT:T-2'
            },
            {
                seed: "useless job abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon check",
                salt: [1, 2, 3, 4, 5, 6, 7, 8],
                toughness: -1,
                encrypted: '06GCQNFZW47CJDM74PBQVWWK74KC4S5D12W93QW9GJAGC1Q5SARDE0820C20A1G711K7XMJ7:T-1'
            },
            {
                seed: "useless job abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon check",
                salt: [1, 2, 3, 4, 5, 6, 7, 8],
                toughness: 0,
                encrypted: '06V8H5MKFQMDC3CWQGDS30ZHCRZVZB6NEDE25BKRC1AXDBRCKSSRG0820C20A1G711940EHM'
            },
            {
                seed: "useless job abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon check",
                salt: [1, 2, 3, 4, 5, 6, 7, 8],
                toughness: 1,
                encrypted: '05KGJ6SPM4PDDETJ2QF8TNNBNTXC17APSECNWXMFX6SBBS62WRPAT0820C20A1G710MHDTGP:T1'
            },
        ];

        for (let test of tests) {
            let seed = test.seed || vault.generateSeed();
            let passphrase = test.passphrase || 'Ƥāssφräsę';
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
}();