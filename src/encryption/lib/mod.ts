// MIT License
//
// Copyright (c) 2021 ProjectXero
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import { Buffer } from "node:buffer";
import {
  type Cipher,
  createCipheriv,
  createDecipheriv,
  createECDH,
  createHash,
  type Decipher,
  type ECDH,
  randomBytes,
} from "node:crypto";

const hashAlgorithm = "sha256";
const blockSize = 16;
const ecdhCurve = "secp384r1";
const asn1Header = Buffer.from(
  "3076301006072a8648ce3d020106052b81040022036200",
  "hex",
);

export function asOpenSSLPublicKey(publicKey: Buffer): Buffer {
  return Buffer.concat([asn1Header, publicKey]);
}

export function asJsPublicKey(publicKey: Buffer) {
  return publicKey.subarray(asn1Header.length);
}

function hashBuffer(algorithm: string, buffer: Buffer) {
  const hash = createHash(algorithm);
  hash.update(buffer);
  return hash.digest();
}

export type EncryptionMode =
  | "cfb8"
  | "cfb";

export class Encryption {
  ecdh: ECDH;
  publicKey: Buffer;
  cipher?: Cipher;
  decipher?: Decipher;

  constructor() {
    this.ecdh = createECDH(ecdhCurve);
    this.publicKey = this.ecdh.generateKeys();
  }

  initializeCipher(mode: EncryptionMode, secretKey: Buffer, salt: Buffer) {
    const key = hashBuffer(hashAlgorithm, Buffer.concat([salt, secretKey]));
    const initializationVector = key.subarray(0, blockSize);
    // TODO: Deno does not support these algorithms; might need to fallback to
    // using OpenSSL via FFI
    const cipherAlgorithm = {
      "cfb8": "aes-256-cfb8",
      "cfb": "aes-256-cfb",
    }[mode];
    this.cipher = createCipheriv(cipherAlgorithm, key, initializationVector);
    this.decipher = createDecipheriv(
      cipherAlgorithm,
      key,
      initializationVector,
    );
    this.cipher.setAutoPadding(false);
    this.decipher.setAutoPadding(false);
  }

  encrypt(str: string) {
    if (!this.cipher) throw new Error("Encryption is not initialized");
    return this.cipher.update(str, "utf8");
  }

  decrypt(buffer: Buffer) {
    if (!this.decipher) throw new Error("Encryption is not initialized");
    return this.decipher.update(buffer).toString("utf8");
  }
}

export class ServerEncryption extends Encryption {
  salt: Buffer;

  constructor() {
    super();
    this.salt = randomBytes(blockSize);
  }

  /**
   * Completes the key exchange between two peers.
   *
   * Make sure that the client public key is in NodeJS's format. The
   * {@link asJsPublicKey} can be helpful.
   */
  completeKeyExchange(mode: EncryptionMode, clientPublicKey: Buffer): void {
    this.initializeCipher(
      mode,
      this.ecdh.computeSecret(clientPublicKey),
      this.salt,
    );
  }
}
