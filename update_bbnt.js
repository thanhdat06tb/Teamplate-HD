const fs = require('fs');

const bbntPath = 'd:/Template_HopDong/BBNT_app.html';
let b = fs.readFileSync(bbntPath, 'utf8');

// 1. Add fields for "Yêu cầu sửa chữa" and "Các ý kiến khác"
const yKienHtml = `

        <div style="margin-top:20px; padding:15px; background:rgba(0, 0, 0, 0.03); border-radius:8px; border:1px solid rgba(0, 0, 0, 0.1);">
          <div style="font-weight:600; margin-bottom:10px; font-size:14px; color:var(--ink);">Ý kiến Kết luận</div>
          <div class="row">
            <div>
              <label>Yêu cầu sửa chữa, hoàn thiện bổ sung:</label>
              <select id="sua_chua_co_khong" style="width:100px; padding:8px; border-radius:6px; border:1px solid #ccc;" onchange="document.getElementById('sua_chua_text').style.display=this.value==='Có'?'block':'none'">
                <option value="Không">Không</option>
                <option value="Có">Có</option>
              </select>
              <input type="text" id="sua_chua_text" placeholder="Nhập nội dung yêu cầu sửa chữa..." style="display:none; margin-top:8px;">
            </div>
          </div>
          <div class="row">
            <div>
              <label>Các ý kiến khác:</label>
              <select id="y_kien_co_khong" style="width:100px; padding:8px; border-radius:6px; border:1px solid #ccc;" onchange="document.getElementById('y_kien_text').style.display=this.value==='Có'?'block':'none'">
                <option value="Không">Không</option>
                <option value="Có">Có</option>
              </select>
              <input type="text" id="y_kien_text" placeholder="Nhập nội dung ý kiến khác..." style="display:none; margin-top:8px;">
            </div>
          </div>
        </div>
`;

// Insert the opinions block right before </div card> for specific BBNT info
if (!b.includes('id="sua_chua_co_khong"')) {
    b = b.replace('</div>\n      </div>\n    </div>\n\n    <!-- TÓM TẮT & HÀNH ĐỘNG -->', yKienHtml + '\n      </div>\n    </div>\n\n    <!-- TÓM TẮT & HÀNH ĐỘNG -->');
}


// 2. Add properties to getDocData
b = b.replace('nt_ngaykt_m: escapeXml(kt.m),', `nt_ngaykt_m: escapeXml(kt.m),
        sua_chua: (document.getElementById('sua_chua_co_khong')?.value === 'Có') ? ('Có: ' + gVal('sua_chua_text')) : 'Không',
        y_kien: (document.getElementById('y_kien_co_khong')?.value === 'Có') ? ('Có: ' + gVal('y_kien_text')) : 'Không',
        `);

// 3. Fix localStorage initialization for representation B and A 2nd row
b = b.replace("document.getElementById('ben_a_chuc_vu').value = data.ben_a_chuc_vu || '';", 
    "document.getElementById('ben_a_chuc_vu').value = data.ben_a_chuc_vu || '';\n" +
    "          window.bbnt_data = data;\n"
);

// 4. Update buildPreviewHtml for 2nd Representative and opinions
const jsCodeOriginalPreview = `        <div style="display:flex; justify-content:space-between; margin-bottom:10px; padding-left: 20px;">
          <div>2. Ông/Bà: .................................</div>
          <div style="width: 250px;">Chức vụ : .................</div>
        </div>`;

const jsCodeNewPreview = `        \${window.bbnt_data && window.bbnt_data.ben_b_dai_dien_b ? 
          \`<div style="display:flex; justify-content:space-between; margin-bottom:10px; padding-left: 20px;">
            <div>2. Ông/Bà: \${escapeXml(window.bbnt_data.ben_b_dai_dien_b)}</div>
            <div style="width: 250px;">Chức vụ : \${escapeXml(window.bbnt_data.ben_b_chuc_vu_b)}</div>
          </div>\` : ''}`;

b = b.replace(jsCodeOriginalPreview, jsCodeNewPreview);

const jsCodeOriginalPreviewA = `        <div style="display:flex; justify-content:space-between; margin-bottom:10px; padding-left: 20px;">
          <div>2. Ông/Bà: .................................</div>
          <div style="width: 250px;">Chức vụ : Giám sát CL</div>
        </div>`;

const jsCodeNewPreviewA = `        \${window.bbnt_data && window.bbnt_data.ben_a_dai_dien_b ? 
          \`<div style="display:flex; justify-content:space-between; margin-bottom:10px; padding-left: 20px;">
            <div>2. Ông/Bà: \${escapeXml(window.bbnt_data.ben_a_dai_dien_b)}</div>
            <div style="width: 250px;">Chức vụ : \${escapeXml(window.bbnt_data.ben_a_chuc_vu_b)}</div>
          </div>\` : ''}`;

b = b.replace(jsCodeOriginalPreviewA, jsCodeNewPreviewA);

const oldConclusion = `<div style="padding-left: 20px; margin-bottom:5px;">- Yêu cầu sửa chữa, hoàn thiện bổ sung và các ý kiến khác nếu có: ..... (Có/ không)</div>
        <div style="padding-left: 20px; margin-bottom:5px;">- Các ý kiến khác: ......(Có/ không)</div>`;

const newConclusion = `<div style="padding-left: 20px; margin-bottom:5px;">- Yêu cầu sửa chữa, hoàn thiện bổ sung và các ý kiến khác nếu có: \${document.getElementById('sua_chua_co_khong')?.value === 'Có' ? ('Có: ' + val('sua_chua_text')) : 'Không'}</div>
        <div style="padding-left: 20px; margin-bottom:5px;">- Các ý kiến khác: \${document.getElementById('y_kien_co_khong')?.value === 'Có' ? ('Có: ' + val('y_kien_text')) : 'Không'}</div>`;

b = b.replace(oldConclusion, newConclusion);

// 5. Update generateDocx xml regex replacements for 2nd rep and opinions (optional because word template still has ....., we'll try to find and replace them)
b = b.replace("let xml = await zip.file('word/document.xml').async('string');", `let xml = await zip.file('word/document.xml').async('string');
        const b2_rep = window.bbnt_data?.ben_b_dai_dien_b ? \`2. Ông: \${window.bbnt_data.ben_b_dai_dien_b}\` : '';
        const b2_cv = window.bbnt_data?.ben_b_dai_dien_b ? \`Chức vụ: \${window.bbnt_data.ben_b_chuc_vu_b}\` : '';
        const a2_rep = window.bbnt_data?.ben_a_dai_dien_b ? \`2. Ông: \${window.bbnt_data.ben_a_dai_dien_b}\` : '';
        const a2_cv = window.bbnt_data?.ben_a_dai_dien_b ? \`Chức vụ: \${window.bbnt_data.ben_a_chuc_vu_b}\` : '';
        
        xml = xml.replace(/2\\s*\\.\\s*Ông\\s*\\.\\.+/g, b2_rep !== '' ? b2_rep : '');
        // Note: XML replacements for text inside word are extremely brittle due to w:t splitting. The best bet is {placeholder}.`);

fs.writeFileSync(bbntPath, b, 'utf8');
console.log('Done replacing BBNT logic');
