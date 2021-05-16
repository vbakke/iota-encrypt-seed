# iota-paper-enctyption
This module encrypts the new binary IOTA seeds after the Chrysalis update.

The aim of this module is to allow safe storage of seeds on paper, optimized for QR code reader. The seed will be safe from prying eyes, corrupt printing process, and corrupt QR code scanners.


This shares the same purpose as https://github.com/vbakke/tryte-encrypt did for the trinary Iota seeds.

Securly print and store paper wallets, that are properly encrypted.


# Never trust an online service!
Don't trust this code, of our machine either.
* Turn off you network. 
* Reboot you machine. 
* Generate and encrypt your seed, save your encrypted seed along with some addresses. 
* Reboot you machine again.
* Now you may turn the network back on.
* You may also print the encrypted seed without worring about anything snooping your print queue, the printed paper or a corrupt QR code scanner




# The algorithm
Passwords are, not unsecure, but many passwords have little variation. So if the password hash function is fast (most hash functions are made to be as fast as possible), an attacker may bruteforce your encryption, if your password is not long / strong enough.

With a slow hash function, it takes a very long time to do the same bruteforce attack.

Hash functions such as PBKDF2, bcrypt, scrypt, argon2 are designed to be slow and costly to performe.  Make them a much better choice for avoiding bruteforce attacks.


The algorithm is tuned so best fit a QR code, by using only digits and capital letters, and fit into the smallest size version, without loosing  security.


# Creidts
Thanks to fgrieu (https://crypto.stackexchange.com/users/555/fgrieu) for valuable input, and simplifying the algorthim securely. 

