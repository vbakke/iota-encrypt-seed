/**
 * 
 */
const crypto = require('crypto');
const xor = require('buffer-xor');
const bip39 = require('bip39');
const { argon2id } = require('hash-wasm');
const base32 = require('base32.js');


// const sha256 = require('sha256');


const VERSION = 0x01;
const SEED_LEN = 32;
const SALT_LEN = 8;
const CHECK_LEN = 4;
const ADDR_LEN = 64;
const BASE32_TYPE = 'crockford';
const VALID_ENCODINGS = ['bip39', 'hex', 'HEX', 'binary'];

async function generateEncryptedSeed(passphrase, toughness, salt) {
    const seed = generateSeed('binary');
    return await encryptSeed(seed, passphrase, toughness, salt);
}

async function encryptSeed(seed, passphrase, toughness, salt, encoding) {
    toughness = toughness || 0;
    salt = salt || generateSalt(SALT_LEN);
    encoding = encoding || guessEncoding(seed);

    if (!VALID_ENCODINGS.includes(encoding)) {
        throw Error('Does not recognize the format of the seed');
    }

    let byteSeed = decodeSeedToBytes(seed, encoding);
    let len = byteSeed.length;
    let time = Date.now();
    const key64 = await generateKey(passphrase, salt, 2*len, toughness);
    time = Date.now() - time;
    let key1 = key64.slice(0, len);
    let key2 = key64.slice(len);

    let encrypted = xor(byteSeed, key1);


    let checksum = await generateChecksum(key2, encrypted, CHECK_LEN);
    let header = new Uint8Array([VERSION]);
    

    let encoded = packInfo({header, encrypted, salt, checksum, toughness});
    
    return encoded;
}

async function decryptSeed(encrypted, passphrase, encoding) {
    let info = extractInfo(encrypted);
    let salt =  info.salt;
    let toughness =  info.toughness;
    let version =  info.version;

    if (version !== VERSION) {
        throw Error('Encrypted seed is unknown version.');
    }

    let len = SEED_LEN;
    let time = Date.now();
    const key64 = await generateKey(passphrase, salt, 2*len, toughness);
    time = Date.now() - time;
    let key1 = key64.slice(0, len);
    let key2 = key64.slice(len);

    let seed = xor(info.encrypted, key1);
    let checksum = await generateChecksum(key2, info.encrypted, CHECK_LEN);

    if (!equalBytes(checksum,  info.checksum)) {
        throw Error('Incorrect passphrase');
    }

    seed = encodeByteSeed(seed, encoding);
    
    return seed;
}



function generateSeed(encoding) {
    let seed = crypto.randomBytes(SEED_LEN);
    return encodeByteSeed(seed, encoding);
}


async function generateKey(passphrase, salt, len, toughness) {
    let opts = argonOptions(passphrase, salt, len, toughness);

    let start = Date.now();
    let encryptionKey = await argon2id(opts);
    let time = Date.now() - start;
    //console.log('Generating key in '+time+' ms: '+Buffer.from(encryptionKey).toString('base64'));
    //console.log('T: '+toughness+' Mem: '+(Math.log(opts.memorySize)/Math.log(2)).toFixed(1)+' iter: '+opts.iterations+': '+time+' ms: '+Buffer.from(encryptionKey).toString('hex'));
    return encryptionKey;
}

function generateSalt(len) {
    let salt = crypto.randomBytes(len);
    
    // for (let i = 0; i<len; i++) {
    //     salt[i] = i.toString();
    // }

    return salt;
}

async function generateChecksum(key, encrypted, len) {
    let opts = {
        memorySize: 8, //kilobytes
        parallelism: 1,
        iterations: 1,
        hashLength: len,
        password: key,
        salt: encrypted,
        outputType: 'binary', 
    }

    let checksum = await argon2id(opts);

    return checksum;
}

function packInfo(info) {
    
    let merged = merge(info.header, info.encrypted, info.salt, info.checksum);
    let encoded = base32.encode(merged, { type: BASE32_TYPE });
    if (info.toughness != 0) encoded += ':T'+info.toughness;

    return encoded;
}

function extractInfo(qrstr) {
    let split = qrstr.split(':');
    let toughness = 0;
    if (split.length>1) {
        let tail = split[1];
        if (tail[0] === 'T') {
            try {
                toughness = parseInt(tail.slice(1));
            } catch  {
                // pass
            }
        }
    }
    let bytes = base32.decode(split[0], { type: BASE32_TYPE });
    bytes = Uint8Array.from(bytes);

    let version = bytes[0];
    let encrypted = bytes.slice(1, 1+SEED_LEN);
    let salt = bytes.slice(1+SEED_LEN, 1+SEED_LEN+SALT_LEN);
    let checksum = bytes.slice(1+SEED_LEN+SALT_LEN);

    return {version, salt, encrypted, checksum, toughness};
}


const tempEncoding = {
    'bip39': 'hex',
    'binary': null,
}


function guessEncoding(seed) {
    if (seed  instanceof Uint8Array) return 'binary';
    else if (Array.isArray(seed)) return 'binary';
    else if (typeof seed === 'string') {
        seed = seed.trim();
        if (seed.includes(':')) seed = seed.split(':')[0];
        if (seed.split(/\s+/).length == SEED_LEN/4*3) return 'bip39';
        else if (seed.match(/^[0-9A-F]+$/) && seed.length === SEED_LEN*2) return 'HEX';
        else if (seed.match(/^[0-9a-fA-F]+$/) && seed.length === SEED_LEN*2) return 'hex';
        else if (seed.match(/^[0-9A-TV-Z]+$/) && seed.length === Math.ceil((1+SEED_LEN+SALT_LEN+CHECK_LEN)/5)*8) return 'ENCRYPTED';
        else if (seed.match(/^iota1[0-9a-z]+$/) && seed.length === ADDR_LEN) return 'ADDRESS';
    }
    
    return undefined;
}

function encodeByteSeed(byteSeed, encoding) {
    encoding = encoding || 'bip39';
    let seed = byteSeed;
    let first_encoding = (tempEncoding.hasOwnProperty(encoding)) ? tempEncoding[encoding] : encoding;
    if (first_encoding) {
        if (Array.isArray(byteSeed) && encoding.toLowerCase() == 'hex') {
            seed = byteSeed.map(x => x.toString(16).padStart(2, '0')).join('')
        } else {
            seed =  byteSeed.toString(first_encoding);
        }
    }

    if (encoding === 'HEX') seed = seed.toUpperCase();
    else if (encoding === 'bip39') seed = seedToMnemonic(seed);

    return seed;
}


function decodeSeedToBytes(seed, encoding) {
    encoding = encoding || guessEncoding(seed);
    if (encoding === 'bip39') seed = mnemonicToSeed(seed);
    else if(encoding && encoding.toLowerCase() === 'hex') seed = Buffer.from(seed, 'hex');

    return seed;
}


function seedToMnemonic(seed) {
    const mnemonic = bip39.entropyToMnemonic(seed);
    return mnemonic;
}

function mnemonicToSeed(mnemonic) {
    mnemonic = mnemonic.replace(/\s+/g, ' ');
    let seed = bip39.mnemonicToEntropy(mnemonic);
    seed = decodeSeedToBytes(seed, 'hex');
    return seed;
}


function merge(...args) {
    let len = 0;
    for (let arr of args) len += arr.length;

    const merged = new Uint8Array(len);
    let pos = 0;
    for (let arr of args) {
        merged.set(arr, pos);
        pos += arr.length;
    }
    
    return merged;
}
function equalBytes (buf1, buf2)
{
    if (buf1.byteLength != buf2.byteLength) return false;
    // var dv1 = new Int8Array(buf1);
    // var dv2 = new Int8Array(buf2);
    for (var i = 0 ; i != buf1.byteLength ; i++)
    {
        if (buf1[i] !== buf2[i]) return false;
    }
    return true;
}

function argonOptions(passphrase, salt, hashLength, toughness) {
    hashLength = hashLength || 32;
    toughness = toughness || 0;
    let sq2 = Math.sqrt(2);
    let memory =  64*1024 * Math.pow(sq2, toughness);
    let iterations = 8 * Math.pow(sq2, toughness);
    if (typeof passphrase === 'string')  passphrase =  passphrase.normalize();
    if (typeof salt === 'string')  salt =  salt.normalize();
    else if (Array.isArray(salt) && salt.length == SALT_LEN)  salt =  Buffer.from(salt);

    let opts = {
        memorySize: Math.floor(memory), //kilobytes
        parallelism: 4,
        iterations: Math.floor(iterations),
        hashLength: hashLength,
        password: passphrase,
        salt: salt,
        outputType: 'binary', 
    }

    //console.log('Argon toughness: '+toughness+' iterations: '+iterations);
    return opts; 
}


module.exports = {
    SEED_LEN,
    SALT_LEN,
    VALID_ENCODINGS,
    guessEncoding,
    generateSeed,
    generateEncryptedSeed,
    encryptSeed,
    decryptSeed,
    generateKey,
    encodeByteSeed,
    decodeSeedToBytes,
}