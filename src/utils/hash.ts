import crypto from 'crypto';
const algorithm = "aes-256-ctr";
const secretKey = process.env.SECRET_KEY!;
const iv = crypto.randomBytes(16);
export const encryptKey = (key: string) => {
    // end to end encryption using aes-256-cbc
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    const encrypted = Buffer.concat([cipher.update(key), cipher.final()]);
    return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export const decryptKey = (key: string) => {
    // end to end encryption using aes-256-cbc
    const textParts = key.split(":");
    const iv = Buffer.from(textParts.shift()!, "hex");
    const encryptedText = Buffer.from(textParts.join(":"), "hex");
    const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
    const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
    return decrypted.toString();
}