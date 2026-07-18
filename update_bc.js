const fs = require('fs');
let b = fs.readFileSync('d:/Template_HopDong/Bao_Cao_app.html', 'utf8');

// 1. Fix duplicate IDs
b = b.replace(/id="ben_a_dai_dien" placeholder="Nguyễn Thị A"/g, 'id="ben_a_dai_dien_b" placeholder="Nguyễn Thị A"');
b = b.replace(/id="ben_a_chuc_vu" placeholder="Kế toán trưởng"/g, 'id="ben_a_chuc_vu_b" placeholder="Kế toán trưởng"');

// 2. Fix JS variables
let jsVarsOriginal = "const benADaiDien = document.getElementById('ben_a_dai_dien').value.trim() || '';\r\n      const benAChucVu = document.getElementById('ben_a_chuc_vu').value.trim() || '';";
let jsVarsOriginal2 = "const benADaiDien = document.getElementById('ben_a_dai_dien').value.trim() || '';\n      const benAChucVu = document.getElementById('ben_a_chuc_vu').value.trim() || '';";

let jsVarsNew = `const benADaiDien = document.getElementById('ben_a_dai_dien').value.trim() || '';
      const benAChucVu = document.getElementById('ben_a_chuc_vu').value.trim() || '';
      const benADaiDienB = document.getElementById('ben_a_dai_dien_b')?.value.trim() || '';
      const benAChucVuB = document.getElementById('ben_a_chuc_vu_b')?.value.trim() || '';`;
      
b = b.replace(jsVarsOriginal, jsVarsNew);
b = b.replace(jsVarsOriginal2, jsVarsNew);

// 3. Fix HTML template string
let htmlOriginal = `<tr><td style="vertical-align:top;"><b>Đại diện:</b></td><td><b>\${benADaiDien}</b> - Chức vụ: \${benAChucVu}</td></tr>\r\n  </table>`;
let htmlOriginal2 = `<tr><td style="vertical-align:top;"><b>Đại diện:</b></td><td><b>\${benADaiDien}</b> - Chức vụ: \${benAChucVu}</td></tr>\n  </table>`;

let htmlNew = `<tr><td style="vertical-align:top;"><b>Đại diện:</b></td><td><b>\${benADaiDien}</b> - Chức vụ: \${benAChucVu}</td></tr>\n    \${benADaiDienB ? \\\`<tr><td style="vertical-align:top;"><b>Đại diện (Bà/Ông):</b></td><td><b>\${benADaiDienB}</b> - Chức vụ: \${benAChucVuB}</td></tr>\\\` : ''}\n  </table>`;

b = b.replace(htmlOriginal, htmlNew);
b = b.replace(htmlOriginal2, htmlNew);

fs.writeFileSync('d:/Template_HopDong/Bao_Cao_app.html', b, 'utf8');
console.log("Updated!");
