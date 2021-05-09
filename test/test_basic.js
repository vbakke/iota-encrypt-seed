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

        // Positive tests
        it('guess hex encoding', async function () {
            let encoding = vault.guessEncoding('BAD0005EED000102030405060708090A0B0C0D0E0F10111213141516171819FF');
            assert.equal(encoding, 'HEX');
        });
        it('guess hex encoding', async function () {
            let encoding = vault.guessEncoding('Bad0005eed000102030405060708090A0B0C0D0E0F10111213141516171819FF');
            assert.equal(encoding, 'hex');
        });
        it('guess bip39 encoding', async function () {
            let encoding = vault.guessEncoding('river length bless sure abandon library army level alcohol debate across beef radio alley deal tilt baby mountain shallow clay gesture metal gun wisdom');
            assert.equal(encoding, 'bip39');
        });
        it('guess bip39 encoding', async function () {
            let encoding = vault.guessEncoding('   river   length \t bless\tsure\nabandon\r\n\tlibrary army level alcohol debate across         beef radio alley deal tilt baby mountain shallow clay gesture metal gun wisdom  \r\n');
            assert.equal(encoding, 'bip39');
        });
        it('guess encrypted', async function () {
            let encoding = vault.guessEncoding('05E8KCM2AEJW04VAFG4SQGTH1ZE8MT2MM0KF1X8N41RQH2W41XD24763A6BQ3DJZKH780R33');
            assert.equal(encoding, 'ENCRYPTED');
        });
        it('guess encrypted', async function () {
            let encoding = vault.guessEncoding('049XXTEVDPH7TY3RKAGF2BYWEF6M6C4EPE4F3G1NQ0X15FC7DFHD40820C20A1G711RNP3Q4:T-2');
            assert.equal(encoding, 'ENCRYPTED');
        });
        it('guess address', async function () {
            let encoding = vault.guessEncoding('iota1qp7s4672nmyahvv4v4saxqj4rx7su8447dpa678n23ed706c55ey550d680');
            assert.equal(encoding, 'ADDRESS');
        });
        // Negative tests
        it('negative blank', async function () {
            let encoding = vault.guessEncoding('');
            assert.isUndefined(encoding);
        });
        it('negative enctypted too short', async function () {
            let encoding = vault.guessEncoding('05E8KCM2AEJW04VAFG4SQGTH1ZE8MT2MM0KF1X8N41RQH2W41XD24763A6BQ3DJZKH780R3');
            assert.isUndefined(encoding);
        });
        it('negative enctypted too long', async function () {
            let encoding = vault.guessEncoding('05E8KCM2AEJW04VAFG4SQGTH1ZE8MT2MM0KF1X8N41RQH2W41XD24763A6BQ3DJZKH780R333');
            assert.isUndefined(encoding);
        });
        
    });
}();

