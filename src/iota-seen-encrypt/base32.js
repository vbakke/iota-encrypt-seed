const base32js = require('base32.js');

const encoder = new base32js.Encoder({ type: "crockford" });
const decoder = new base32js.Decoder({ type: "crockford" });

function encode(input) {
    return encoder.write(input).finalize();
}

function decode(input) {
    return decoder.write(input).finalize();
}

module.exports = {
    encode,
    decode,
}