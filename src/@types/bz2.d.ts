// src/@types/bz2.d.ts
declare module 'bz2' {
  function compress(data: string | Buffer | Uint8Array, blockSize?: number): Buffer;
  function decompress(data: Buffer | Uint8Array, blockSize?: number): Buffer;
  export { compress, decompress };
}
