/** Tiny ZIP writer (stored, no compression) for the site export. */
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(data: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < data.length; i++) c = CRC_TABLE[(c ^ data[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

interface Entry {
  name: Uint8Array;
  size: number;
  crc: number;
}

/** Header fields shared by the local and the central directory record, written at `at`. */
function writeShared(v: DataView, at: number, e: Entry, time: number, date: number): void {
  v.setUint16(at, 0x0800, true);
  v.setUint16(at + 2, 0, true);
  v.setUint16(at + 4, time, true);
  v.setUint16(at + 6, date, true);
  v.setUint32(at + 8, e.crc, true);
  v.setUint32(at + 12, e.size, true);
  v.setUint32(at + 16, e.size, true);
  v.setUint16(at + 20, e.name.length, true);
}

export function makeZip(files: { name: string; content: string }[]): Blob {
  const enc = new TextEncoder();
  const now = new Date();
  const time = (now.getHours() << 11) | (now.getMinutes() << 5) | Math.floor(now.getSeconds() / 2);
  const date = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();
  const chunks: Uint8Array[] = [];
  const central: Uint8Array[] = [];
  let offset = 0;
  for (const f of files) {
    const data = enc.encode(f.content);
    const e: Entry = { name: enc.encode(f.name), size: data.length, crc: crc32(data) };
    const local = new Uint8Array(30 + e.name.length);
    const lv = new DataView(local.buffer);
    lv.setUint32(0, 0x04034b50, true);
    lv.setUint16(4, 20, true);
    writeShared(lv, 6, e, time, date);
    local.set(e.name, 30);
    chunks.push(local, data);

    const cen = new Uint8Array(46 + e.name.length);
    const cv = new DataView(cen.buffer);
    cv.setUint32(0, 0x02014b50, true);
    cv.setUint16(4, 20, true);
    cv.setUint16(6, 20, true);
    writeShared(cv, 8, e, time, date);
    cv.setUint32(42, offset, true);
    cen.set(e.name, 46);
    central.push(cen);
    offset += local.length + data.length;
  }
  const end = new Uint8Array(22);
  const ev = new DataView(end.buffer);
  ev.setUint32(0, 0x06054b50, true);
  ev.setUint16(8, files.length, true);
  ev.setUint16(10, files.length, true);
  ev.setUint32(12, central.reduce((s, c) => s + c.length, 0), true);
  ev.setUint32(16, offset, true);
  return new Blob([...chunks, ...central, end] as BlobPart[], { type: "application/zip" });
}
