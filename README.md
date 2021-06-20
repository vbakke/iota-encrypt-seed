# iota-paper-encryption
This module encrypts the new binary IOTA seeds after the Chrysalis update.

The aim of this module is to allow safe storage of seeds on paper, optimized for QR code reader. The seed will be safe from prying eyes, an unsecure print process, and corrupted QR code scanners.


The [vbakke/iota-paper-encryption](https://github.com/vbakke/tryte-encrypt) has the same purpose as [vbakke/tryte-encrypt](https://github.com/vbakke/tryte-encrypt) did for the old trinary Iota seeds.

Securly print and store encrypted paper wallets.


# Never trust an online service!
Don't trust this code, on our machine either. Do the following:
* Turn off you network. 
* Reboot you machine. 
* Generate and encrypt your seed, save your encrypted seed along with the public address. 
* Reboot you machine again.
* Turn the network back on.
* You may now print the encrypted seed without worring about anything snooping your print queue, the printed paper or an untrusty QR code scanner




# The algorithm
Passwords are, not unsecure, but many passwords have too little variation. So if the password hash function is fast (most hash functions are made to be as fast as possible), an attacker may bruteforce the key to your encryption.

A *slow* hash function, it takes a very long time to do the same bruteforce attack.

Hash functions such as PBKDF2, bcrypt, scrypt, argon2 are designed to be slow and costly to performe.  Make them a much better choice for avoiding bruteforce attacks.


The algorithm is tuned so best fit a QR code, by using only digits and capital letters, and fit into the smallest size version, without loosing  security.


# Credits
Thanks to fgrieu (https://crypto.stackexchange.com/users/555/fgrieu) for valuable input, and simplifying the algorthim securely. 

