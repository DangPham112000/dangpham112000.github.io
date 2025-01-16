const iv = crypto.getRandomValues(new Uint8Array(16));
let key;

(async () => {
    key = await crypto.subtle.generateKey(
            {
                name: "AES-CBC",
                length: 128, 
            },
            true,
            ["encrypt", "decrypt"]
        );
})();

async function encryptData(plaintext) {
    const encoder = new TextEncoder();
    const data = encoder.encode(plaintext);
    console.log('data:', data);

    const ciphertext = await crypto.subtle.encrypt(
        {
            name: "AES-CBC",
            iv,
        },
        key,
        data
    );

    return new Uint8Array(ciphertext);
}

async function decryptData(ciphertext) {
    try {
        const plaintextBuffer = await crypto.subtle.decrypt(
            {
                name: "AES-CBC",
                iv,
            },
            key,
            ciphertext
        );
    
        const decoder = new TextDecoder();
        return decoder.decode(plaintextBuffer);
    } catch (error) {
        console.log(error);
    }
}

function uint8ArrayToHex(uint8Array) {
    return Array.from(uint8Array)
        .map(byte => byte.toString(16).padStart(2, '0')) // Convert to hex and pad with leading zero if necessary
        .join(''); // Combine into a single string
}

function hexToUint8Array(hexString) {
    // Ensure the input string length is even
    if (hexString.length % 2 !== 0) {
        throw new Error("Hex string must have an even length");
    }

    const length = hexString.length / 2;
    const uint8Array = new Uint8Array(length);

    for (let i = 0; i < length; i++) {
        uint8Array[i] = parseInt(hexString.substr(i * 2, 2), 16);
    }

    return uint8Array;
}

function ord(string) {
    return string.charCodeAt(0);
}

// Usage Example
(async () => {
    const plaintext = "DOGECOIN transaction: 100 DOGE to BOB@myemail.gg";

    // Encrypt
    const ciphertext = await encryptData(plaintext);
    console.log("Ciphertext:", ciphertext);
    
    ciphertext[34 - 16] = ord('B') ^ ciphertext[34 - 16] ^ ord('E');
    ciphertext[35 - 16] = ord('O') ^ ciphertext[35 - 16] ^ ord('V');
    ciphertext[36 - 16] = ord('B') ^ ciphertext[36 - 16] ^ ord('E');
    
    console.log("Ciphertext:", ciphertext);

    // let hexString = uint8ArrayToHex(ciphertext);
    // console.log(hexString); 
    // hexString = hexString.slice(0, -1) + 'd';
    // console.log(hexString); 
    // let ciphertext2 =  hexToUint8Array(hexString);
    // console.log("Ciphertext2:", ciphertext2);

    // Decrypt
    const decryptedText = await decryptData(ciphertext);
    console.log("Decrypted Text:", decryptedText);
})();

// 5f98ccae4dcc98f276b97efbb368c1623845b1d5d122694cbbdc7ca7548bc8a5
// 5f98ccae4dcc98f276b97efbb368c162256d64e7208f808b5c93b3a8cf8121c4
