/**
 * 
 */
const crypto = require('crypto');
const bip39 = require('bip39');
const { argon2id, argon2Verify } = require('hash-wasm');
const aes = require('aes-js');
const base32 = require('base32.js');


// const sha256 = require('sha256');


const SEED_LEN = 32;
const SALT_LEN = 12;
const AES_CTR_LEN = 16;


async function generateEncryptedSeed(passphrase, toughness, salt) {
    const seed = generateSeed('binary');
    return await encryptSeed(seed, passphrase, toughness, salt);
}

async function encryptSeed(seed, passphrase, toughness, salt) {
    toughness = toughness || 0;
    salt = salt || crypto.randomBytes(SALT_LEN);

    let time = Date.now();
    const key = await generateKey(passphrase, salt, toughness);
    time = Date.now() - time;
    console.log('Secret key: '+key.toString('hex'))
    const encrypted = await encrypt(seed, key, salt);

    let merged = merge(encrypted, salt);

    let encoded = base32.encode(merged);
    //if (toughness != 0)
    encoded += ':T'+toughness;
    return encoded;
}



const preEncoding = {
    'bip39': 'hex',
    'binary': null,
}

function generateSeed(encoding) {
    encoding = encoding || 'HEX';
    let first_encoding = (preEncoding.hasOwnProperty(encoding)) ? preEncoding[encoding] : encoding;
    let seed = crypto.randomBytes(SEED_LEN);
    
    if (first_encoding)
        seed =  seed.toString(first_encoding);

    if (encoding === 'HEX') seed = seed.toUpperCase();
    else if (encoding === 'bip39') seed = seedToMnemonic(seed);

    return seed;
}


async function generateKey(passphrase, salt, toughness) {
    let opts = argonOptions(toughness);
    opts.salt = salt;
    opts.password = aes.utils.utf8.toBytes(passphrase);
    opts.hashLength = 32; // bytes
    opts.outputType = 'binary'; // return standard encoded string containing parameters needed to verify the key

    let start = Date.now();
    let encryptionKey = await argon2id(opts);
    let time = Date.now() - start;
    //console.log('Generating key in '+time+' ms');
    return encryptionKey;
}


function encrypt(plain, encryptionKey, counter) {
    if (counter instanceof Uint8Array && counter.length < AES_CTR_LEN) {
        counter = extendArray(counter, AES_CTR_LEN);
    }

    const cryptor = new aes.ModeOfOperation.ctr(encryptionKey, counter);
    const encrypted = cryptor.encrypt(plain);
    return encrypted;
}


function seedToMnemonic(seed) {
    const mnemonic = bip39.entropyToMnemonic(seed);
    return mnemonic;
}

function mnemonicToSeed(mnemonic) {
    const seed = bip39.mnemonicToEntropy(mnemonic);
    return seed;
}


function extendArray(arr, len) {
    const zero = new Uint8Array(len - arr.length);
    return merge(zero, arr);
}
function merge(arr1, arr2) {
    const merged = new Uint8Array(arr1.length + arr2.length);
    merged.set(arr1);
    merged.set(arr2, arr1.length);
    return merged;
}

function argonOptions(toughness) {
    let iter_exp = 10 + toughness;
    let iterations = Math.pow(2, iter_exp);
    //console.log('Argon toughness: '+toughness+' iterations: '+iterations);
    return {
        parallelism: 1,
        iterations,
        memorySize: 512, // use 512KB memory
    }
}


module.exports = {
    SEED_LEN,
    SALT_LEN,
    generateSeed,
    generateEncryptedSeed,
    encryptSeed,

}