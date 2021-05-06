const chai = require('chai');
const assert = chai.assert;
const vault = require('../src/iota-seed-encrypt');


module.exports = function () {

    describe('Testing basic', function () {

        it('generate seed in bip39 menemonic', async function () {
            let seed = vault.generateSeed();
            assert.equal(seed.split(/\s+/).length, vault.SEED_LEN/4*3);
            assert.match(seed, /^[a-z ]*$/);
        });
        it('generate seed as hex', async function () {
            let seed = vault.generateSeed('hex');
            assert.equal(seed.length, vault.SEED_LEN*2);
            assert.match(seed, /^[0-9a-f]{64}$/);
        });
        it('generate seed as hex', async function () {
            let seed = vault.generateSeed('HEX');
            assert.equal(seed.length, vault.SEED_LEN*2);
            assert.match(seed, /^[0-9A-F]{64}$/);
        });
        it('generate seed as binary array', async function () {
            let seed = vault.generateSeed('binary');
            assert.instanceOf(seed, Uint8Array);
            assert.equal(seed.length, vault.SEED_LEN);
        });

    });
}