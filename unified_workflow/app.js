// State Management
const State = {
  currentStep: 1,
  contractType: 'gk',
  client: { ten: '', mst: '', diachi: '', daidien: '', stk: '', chucvu: '', sdt: '', email: '' },
  company: { ten: 'CÔNG TY TNHH QUỐC TẾ THƯƠNG MẠI HUA SEN VIỆT NAM', mst: '3703486766', diachi: 'Số 2/1 Tổ 24, Khu Phố 1B, đường tỉnh 743, Phường An Phú, Thành phố Hồ Chí Minh, Việt Nam', stk: 'VNĐ: 3703486766 | USD: 0584723984634 - VN Hua Sen CO.,LTD', daidien: 'LIN. ZHIHUA', chucvu: '', sdt: '0921115868', email: 'huasen2026@gmail.com' },
  contract: { sohd: '01/2024/HDGK', ngay: '', tenct: '', diadiemct: '', tamung: '50', songaytt: '15', thoiGianGiao: '10', ptThanhKhoan: 'Chuyển khoản (VNĐ)' },
  products: [],
  tableMode: 'simple',
  vatRate: 0.08
};

// Elements
const els = {
  steps: document.querySelectorAll('.step'),
  contents: document.querySelectorAll('.step-content'),
  btnPrev: document.getElementById('btn-prev'),
  btnNext: document.getElementById('btn-next'),
  fileDrop: document.getElementById('file-drop'),
  fileInput: document.getElementById('excel-file'),
  productTbody: document.getElementById('product-table-body'),
  appProductTable: document.getElementById('app-product-table'),
  vatSelect: document.getElementById('vat-rate'),
  vatSelectKt: document.getElementById('vat-rate-kt'),
  
  radioGk: document.getElementById('radio-gk'),
  radioKt: document.getElementById('radio-kt'),
  wrapperGk: document.getElementById('wrapper-gk'),
  wrapperKt: document.getElementById('wrapper-kt'),
  wrapperBbnt: document.getElementById('wrapper-bbnt'),
  wrapperBbgh: document.getElementById('wrapper-bbgh'),
  bbghProductTable: document.getElementById('bbgh-product-table'),

  // Inputs
  kh_ten: document.getElementById('kh_ten'),
  kh_mst: document.getElementById('kh_mst'),
  kh_diachi: document.getElementById('kh_diachi'),
  kh_daidien: document.getElementById('kh_daidien'),
  kh_stk: document.getElementById('kh_stk'),
  kh_chucvu: document.getElementById('kh_chucvu'),
  kh_sdt: document.getElementById('kh_sdt'),
  kh_email: document.getElementById('kh_email'),
  kh_ngay: document.getElementById('kh_ngay'),
  dn_ten: document.getElementById('dn_ten'),
  dn_mst: document.getElementById('dn_mst'),
  dn_diachi: document.getElementById('dn_diachi'),
  dn_stk: document.getElementById('dn_stk'),
  dn_daidien: document.getElementById('dn_daidien'),
  dn_chucvu: document.getElementById('dn_chucvu'),
  dn_sdt: document.getElementById('dn_sdt'),
  dn_email: document.getElementById('dn_email'),
  so_hd: document.getElementById('so_hd'),
  ngay_ky: document.getElementById('ngay_ky'),
  ten_ct: document.getElementById('ten_ct'),
  diadiem_ct: document.getElementById('diadiem_ct'),
  tam_ung: document.getElementById('tam_ung'),
  so_ngay_tt: document.getElementById('so_ngay_tt'),
  thoi_gian_giao: document.getElementById('thoi_gian_giao'),
  pt_thanh_toan: document.getElementById('pt_thanh_toan'),
  so_hd_kt: document.getElementById('so_hd_kt'),
  ngay_ky_kt: document.getElementById('ngay_ky_kt'),
  tam_ung_kt: document.getElementById('tam_ung_kt'),
  so_pl: document.getElementById('so_pl'),
  ngay_pl: document.getElementById('ngay_pl'),
};

function fmtVND(n) {
  if (!isFinite(n)) return '0';
  return Math.round(n).toLocaleString('vi-VN');
}

// Navigation Logic
function updateNav() {
  els.steps.forEach((st, i) => {
    st.classList.toggle('active', i + 1 === State.currentStep);
  });
  els.contents.forEach((ct, i) => {
    ct.classList.toggle('active', i + 1 === State.currentStep);
  });
  
  els.btnPrev.style.display = State.currentStep === 1 ? 'none' : 'block';
  if (State.currentStep === 5) {
    els.btnNext.style.display = 'none';
    prepareFinalPreviews();
  } else {
    els.btnNext.style.display = 'block';
    els.btnNext.textContent = `Tiếp Theo Bước ${State.currentStep + 1} →`;
  }
  
  if (State.currentStep === 2) {
    if (State.contractType === 'gk') {
        els.wrapperGk.style.display = 'block';
        els.wrapperKt.style.display = 'none';
    } else {
        els.wrapperGk.style.display = 'none';
        els.wrapperKt.style.display = 'block';
    }
  }
  
  if (State.currentStep === 4) {
    if (State.contractType === 'gk') {
        els.wrapperBbnt.style.display = 'block';
        if(els.wrapperBbgh) els.wrapperBbgh.style.display = 'none';
    } else {
        els.wrapperBbnt.style.display = 'none';
        if(els.wrapperBbgh) els.wrapperBbgh.style.display = 'block';
    }
  }
  
  bindDataToPreviews();
}

els.btnNext.addEventListener('click', () => {
  if (State.currentStep < 5) {
    saveFormState();
    State.currentStep++;
    updateNav();
  }
});

els.btnPrev.addEventListener('click', () => {
  if (State.currentStep > 1) {
    saveFormState();
    State.currentStep--;
    updateNav();
  }
});


if(els.radioGk) {
  els.radioGk.addEventListener('change', () => {
    if(els.radioGk.checked) State.contractType = 'gk';
    updateNav();
  });
}
if(els.radioKt) {
  els.radioKt.addEventListener('change', () => {
    if(els.radioKt.checked) State.contractType = 'kt';
    updateNav();
  });
}

// Update State from Inputs
function saveFormState() {
  State.client.ten = els.kh_ten.value || '...';
  State.client.mst = els.kh_mst.value || '...';
  State.client.diachi = els.kh_diachi.value || '...';
  State.client.daidien = els.kh_daidien.value || '...';
  State.client.stk = els.kh_stk.value || '';
  State.client.chucvu = els.kh_chucvu.value || '';
  State.client.sdt = els.kh_sdt.value || '';
  State.client.email = els.kh_email.value || '';
  State.client.ngay = els.kh_ngay.value || '';
  
  State.company.ten = els.dn_ten.value || '...';
  State.company.mst = els.dn_mst.value || '...';
  State.company.diachi = els.dn_diachi.value || '...';
  State.company.stk = els.dn_stk.value || '...';
  State.company.daidien = els.dn_daidien.value || '...';
  State.company.chucvu = els.dn_chucvu.value || '...';
  State.company.sdt = els.dn_sdt.value || '...';
  State.company.email = els.dn_email.value || '...';
  
  // Remove cross-syncs
  if (State.contractType === 'kt') {
    State.contract.sohd = els.so_hd_kt ? (els.so_hd_kt.value || '...') : '...';
    State.contract.ngay = els.ngay_ky_kt ? (els.ngay_ky_kt.value || '...') : '...';
    State.contract.tamung = els.tam_ung_kt ? (els.tam_ung_kt.value || '50') : '50';
  } else {
    State.contract.sohd = els.so_hd.value || '...';
    State.contract.ngay = els.ngay_ky.value || '...';
    State.contract.tamung = els.tam_ung.value || '50';
  }
  
  State.contract.tenct = els.ten_ct.value || '...';
  State.contract.diadiemct = els.diadiem_ct.value || '...';
  State.contract.songaytt = els.so_ngay_tt.value || '15';
  State.contract.thoiGianGiao = els.thoi_gian_giao ? els.thoi_gian_giao.value || '...' : '...';
  State.contract.ptThanhToan = els.pt_thanh_toan ? els.pt_thanh_toan.value || '...' : '...';
  
  State.contract.sopl = els.so_pl ? els.so_pl.value || '...' : '...';
  State.contract.ngaypl = els.ngay_pl ? els.ngay_pl.value || '...' : '...';
  
  if (State.contractType === 'kt') {
      if(els.vatSelectKt) State.vatRate = parseFloat(els.vatSelectKt.value);
      if(els.vatSelect && els.vatSelectKt) els.vatSelect.value = els.vatSelectKt.value;
  } else {
      if(els.vatSelect) State.vatRate = parseFloat(els.vatSelect.value);
      if(els.vatSelectKt && els.vatSelect) els.vatSelectKt.value = els.vatSelect.value;
  }
}

// Global Re-bind
function bindDataToPreviews() {
  // Bind Text
  document.querySelectorAll('.bind-kh-ten').forEach(e => e.textContent = State.client.ten);
  document.querySelectorAll('.bind-kh-mst').forEach(e => e.textContent = State.client.mst);
  document.querySelectorAll('.bind-kh-diachi').forEach(e => e.textContent = State.client.diachi);
  document.querySelectorAll('.bind-kh-daidien').forEach(e => e.textContent = State.client.daidien);
  document.querySelectorAll('.bind-kh-stk').forEach(e => e.textContent = State.client.stk);
  document.querySelectorAll('.bind-kh-chucvu').forEach(e => e.textContent = State.client.chucvu);
  document.querySelectorAll('.bind-kh-sdt').forEach(e => e.textContent = State.client.sdt);
  document.querySelectorAll('.bind-kh-email').forEach(e => e.textContent = State.client.email);
  
  let ngayStr = '....... 年 ....... 月 ....... 日';
  if (State.client.ngay) {
    const parts = State.client.ngay.split('-');
    if (parts.length === 3) {
      ngayStr = `${parts[0]} 年 ${parts[1]} 月 ${parts[2]} 日`;
    }
  }
  document.querySelectorAll('.bind-kh-ngay').forEach(e => e.textContent = ngayStr);
  
  document.querySelectorAll('.bind-dn-ten').forEach(e => e.textContent = State.company.ten);
  document.querySelectorAll('.bind-dn-mst').forEach(e => e.textContent = State.company.mst);
  document.querySelectorAll('.bind-dn-diachi').forEach(e => e.textContent = State.company.diachi);
  document.querySelectorAll('.bind-dn-daidien').forEach(e => e.textContent = State.company.daidien);
  document.querySelectorAll('.bind-dn-stk').forEach(e => e.textContent = State.company.stk);
  document.querySelectorAll('.bind-dn-chucvu').forEach(e => e.textContent = State.company.chucvu);
  document.querySelectorAll('.bind-dn-sdt').forEach(e => e.textContent = State.company.sdt);
  document.querySelectorAll('.bind-dn-email').forEach(e => e.textContent = State.company.email);
  
  document.querySelectorAll('.bind-sohd').forEach(e => e.textContent = State.contract.sohd);
  document.querySelectorAll('.bind-ten-ct').forEach(e => e.textContent = State.contract.tenct);
  document.querySelectorAll('.bind-diadiem-ct').forEach(e => e.textContent = State.contract.diadiemct);
  document.querySelectorAll('.bind-tam-ung').forEach(e => e.textContent = State.contract.tamung);
  document.querySelectorAll('.bind-so-ngay-tt').forEach(e => e.textContent = State.contract.songaytt);
  document.querySelectorAll('.bind-thoi-gian-giao').forEach(e => e.textContent = State.contract.thoiGianGiao);
  document.querySelectorAll('.bind-pt-thanh-toan').forEach(e => e.textContent = State.contract.ptThanhToan);
  
  // Date parsing
  const dateStr = State.contract.ngay;
  if(dateStr) {
      const parts = dateStr.split('-');
      if(parts.length === 3) {
          document.querySelectorAll('.bind-ngay').forEach(e => e.textContent = parts[2]);
          document.querySelectorAll('.bind-thang').forEach(e => e.textContent = parts[1]);
          document.querySelectorAll('.bind-nam').forEach(e => e.textContent = parts[0]);
          document.querySelectorAll('.bind-ngay-ky').forEach(e => e.textContent = `${parts[2]}/${parts[1]}/${parts[0]}`);
      }
  } else {
      document.querySelectorAll('.bind-ngay').forEach(e => e.textContent = '...');
      document.querySelectorAll('.bind-thang').forEach(e => e.textContent = '...');
      document.querySelectorAll('.bind-nam').forEach(e => e.textContent = '...');
      document.querySelectorAll('.bind-ngay-ky').forEach(e => e.textContent = '...');
  }

  // Appendix Parsing
  document.querySelectorAll('.bind-sopl').forEach(e => e.textContent = State.contract.sopl);
  const datePl = State.contract.ngaypl;
  if(datePl) {
      const parts = datePl.split('-');
      if(parts.length === 3) {
          document.querySelectorAll('.bind-pl-ngay').forEach(e => e.textContent = parts[2]);
          document.querySelectorAll('.bind-pl-thang').forEach(e => e.textContent = parts[1]);
          document.querySelectorAll('.bind-pl-nam').forEach(e => e.textContent = parts[0]);
      }
  } else {
      document.querySelectorAll('.bind-pl-ngay').forEach(e => e.textContent = '...');
      document.querySelectorAll('.bind-pl-thang').forEach(e => e.textContent = '...');
      document.querySelectorAll('.bind-pl-nam').forEach(e => e.textContent = '...');
  }
  
  // Render Product Tables for Step 1 and Step 3
  renderProducts();
}

// Check if string is Roman Numeral
function isRoman(str) {
  const s = String(str || '').trim().toUpperCase();
  if(!s) return false;
  return /^(M{0,3})(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/.test(s);
}

window.updateRow = function(index, field, value) {
  if (!State.products[index]) return;
  if (['sl', 'gia', 'giaVatTu', 'giaNhanCong'].includes(field)) {
    State.products[index][field] = parseFloat(value) || 0;
  } else {
    State.products[index][field] = value;
  }
  renderProducts();
};

// Product Rendering
function renderProducts() {
  let h1 = '', h3 = '', hBg = '', hKt = '', hBb = '';
  let sum = 0;
  
  if (State.products.length === 0) {
    h1 = `<tr><td colspan="6" style="text-align:center; color:#888;">Chưa có dữ liệu</td></tr>`;
    h3 = `<tr><td colspan="5" style="text-align:center;">Vui lòng nhập dữ liệu ở Bước 1</td></tr>`;
    hBg = `<tr><td colspan="6" style="text-align:center; border:1px solid #000; padding:5px;">Vui lòng nhập dữ liệu</td></tr>`;
        hKt = `<tr><td colspan="10" style="text-align:center; border:1px solid #000; padding:5px;">Vui lòng nhập dữ liệu</td></tr>`;
    hBb = `<tr><td colspan="6" style="text-align:center; border:1px solid #000; padding:5px;">Vui lòng nhập dữ liệu</td></tr>`;
  } else {
    // Pass 1: Compute category totals
    let categoryTotals = [];
    let currentCategoryIndex = -1;
    State.products.forEach((p, i) => {
      const gVatTu = p.giaVatTu || 0;
      const gNhanCong = p.giaNhanCong || 0;
      const gSimple = p.gia || 0;
      const tGia = State.tableMode === 'complex' ? (gVatTu + gNhanCong) : gSimple;
      const tt = (p.sl || 0) * tGia;
      
      if (isRoman(p.stt)) {
        currentCategoryIndex = i;
        categoryTotals[i] = 0;
      } else {
        if (currentCategoryIndex !== -1) {
          categoryTotals[currentCategoryIndex] += tt;
        }
      }
    });

    // Pass 2: Render
    State.products.forEach((p, i) => {
      const isCat = isRoman(p.stt);
      const gVatTu = p.giaVatTu || 0;
      const gNhanCong = p.giaNhanCong || 0;
      const gSimple = p.gia || 0;
      const tGia = State.tableMode === 'complex' ? (gVatTu + gNhanCong) : gSimple;
      
      const rawTt = (p.sl || 0) * tGia;
      const displayTt = isCat ? (categoryTotals[i] || 0) : rawTt;
      
      const dispSl = isCat ? '' : (Math.round((p.sl || 0) * 1000) / 1000);
      
      if (!isCat) sum += rawTt;
      
      const styleBold = isCat ? 'font-weight:bold;' : '';
      const bText = isCat ? 'font-weight:bold;' : 'font-weight:inherit;';
      
      // Step 1 Editor rows
      h1 += `<tr style="${styleBold}">
        <td><input type="text" value="${p.stt || ''}" onchange="updateRow(${i}, 'stt', this.value)" style="width:40px; ${bText} background:transparent; border:none;"></td>
        <td><input type="text" value="${p.ten || ''}" onchange="updateRow(${i}, 'ten', this.value)" style="width:100%; min-width:200px; ${bText} background:transparent;"></td>
        <td><input type="text" value="${p.dvt || ''}" onchange="updateRow(${i}, 'dvt', this.value)" style="width:50px; ${bText} background:transparent;"></td>
        <td><input type="number" value="${p.sl || 0}" onchange="updateRow(${i}, 'sl', this.value)" style="width:50px; ${bText} background:transparent;"></td>
        <td class="col-simple"><input type="number" value="${gSimple}" onchange="updateRow(${i}, 'gia', this.value)" style="width:80px; ${bText} background:transparent;"></td>
        <td class="col-complex"><input type="number" value="${gVatTu}" onchange="updateRow(${i}, 'giaVatTu', this.value)" style="width:70px; ${bText} background:transparent;"></td>
        <td class="col-complex"><input type="number" value="${gNhanCong}" onchange="updateRow(${i}, 'giaNhanCong', this.value)" style="width:70px; ${bText} background:transparent;"></td>
        <td class="col-complex" style="${bText}">${p.sl ? fmtVND((p.sl||0)*gVatTu) : ''}</td>
        <td class="col-complex" style="${bText}">${p.sl ? fmtVND((p.sl||0)*gNhanCong) : ''}</td>
        <td class="col-simple" style="${bText}">${displayTt ? fmtVND(displayTt) : ''}</td>
        <td class="col-complex" style="font-weight:bold;">${displayTt ? fmtVND(displayTt) : ''}</td>
        <td class="col-complex"><input type="text" value="${p.ghiChu || ''}" onchange="updateRow(${i}, 'ghiChu', this.value)" style="width:100px; ${bText} background:transparent;"></td>
      </tr>`;
      
      // Step 3 Static rows (Appendix)
      h3 += `<tr style="${styleBold}">
        <td style="border:1px solid #000; padding:8px; text-align:center;">${p.stt || (isCat ? '' : i + 1)}</td>
        <td style="border:1px solid #000; padding:8px;">${p.ten || ''}</td>
        <td style="border:1px solid #000; padding:8px; text-align:center;">${p.dvt || ''}</td>
        <td style="border:1px solid #000; padding:8px; text-align:right;">${dispSl}</td>
        <td class="col-simple" style="border:1px solid #000; padding:8px; text-align:right;">${(gSimple || isCat) ? fmtVND(gSimple) : ''}</td>
        <td class="col-complex" style="border:1px solid #000; padding:8px; text-align:right;">${(gVatTu || isCat) && !isCat ? fmtVND(gVatTu) : ''}</td>
        <td class="col-complex" style="border:1px solid #000; padding:8px; text-align:right;">${(gNhanCong || isCat) && !isCat ? fmtVND(gNhanCong) : ''}</td>
        <td class="col-complex" style="border:1px solid #000; padding:8px; text-align:right;">${!isCat && p.sl ? fmtVND((p.sl||0)*gVatTu) : ''}</td>
        <td class="col-complex" style="border:1px solid #000; padding:8px; text-align:right;">${!isCat && p.sl ? fmtVND((p.sl||0)*gNhanCong) : ''}</td>
        <td class="col-simple" style="border:1px solid #000; padding:8px; text-align:right;">${displayTt ? fmtVND(displayTt) : ''}</td>
        <td class="col-complex" style="border:1px solid #000; padding:8px; text-align:right;">${displayTt ? fmtVND(displayTt) : ''}</td>
        <td class="col-complex" style="border:1px solid #000; padding:8px;">${p.ghiChu || ''}</td>
      </tr>`;
        
      
      // BB Giao Hang Rows
      hBb += `<tr style="${styleBold}">
        <td style="border:1px solid #000; padding:8px; text-align:center;">${p.stt || (isCat ? '' : i + 1)}</td>
        <td style="border:1px solid #000; padding:8px;">${p.ten || ''}</td>
        <td style="border:1px solid #000; padding:8px; text-align:center;"></td>
        <td style="border:1px solid #000; padding:8px; text-align:center;">${dispSl}</td>
        <td style="border:1px solid #000; padding:8px; text-align:center;">${p.dvt || ''}</td>
        <td style="border:1px solid #000; padding:8px;">${p.ghiChu || ''}</td>
      </tr>`;
      // Step 2 Bao Gia Rows
      hBg += `<tr style="${styleBold}">
        <td style="border:1px solid #000; padding:8px; text-align:center;">${p.stt || ''}</td>
        <td style="border:1px solid #000; padding:8px;">${p.ten || ''}</td>
        <td style="border:1px solid #000; padding:8px; text-align:center;">${dispSl}</td>
        <td style="border:1px solid #000; padding:8px; text-align:center;">${p.dvt || ''}</td>
        <td style="border:1px solid #000; padding:8px; text-align:center;"></td>
        <td style="border:1px solid #000; padding:8px; text-align:right;">${(tGia || isCat) && !isCat ? fmtVND(tGia) : ''}</td>
        <td style="border:1px solid #000; padding:8px; text-align:right;">${displayTt ? fmtVND(displayTt) : ''}</td>
        <td style="border:1px solid #000; padding:8px;">${p.ghiChu || ''}</td>
      </tr>`;
      
      // Step 2 Kinh Te Rows
      hKt += `<tr style="${styleBold} page-break-inside:avoid; break-inside:avoid;">
        <td style="border:1px solid #000; padding:6px; text-align:center;">${p.stt || (isCat ? '' : i + 1)}</td>
        <td style="border:1px solid #000; padding:6px;">${p.ten || ''}</td>
        <td style="border:1px solid #000; padding:6px; text-align:center;">${p.dvt || ''}</td>
        <td style="border:1px solid #000; padding:6px; text-align:center;">${dispSl}</td>
        <td class="col-simple" style="border:1px solid #000; padding:6px; text-align:right;">${(gSimple || isCat) ? fmtVND(gSimple) : ''}</td>
        <td class="col-complex" style="border:1px solid #000; padding:6px; text-align:right;">${(gVatTu || isCat) && !isCat ? fmtVND(gVatTu) : ''}</td>
        <td class="col-complex" style="border:1px solid #000; padding:6px; text-align:right;">${(gNhanCong || isCat) && !isCat ? fmtVND(gNhanCong) : ''}</td>
        <td class="col-complex" style="border:1px solid #000; padding:6px; text-align:right;">${!isCat && p.sl ? fmtVND((p.sl||0)*gVatTu) : ''}</td>
        <td class="col-complex" style="border:1px solid #000; padding:6px; text-align:right;">${!isCat && p.sl ? fmtVND((p.sl||0)*gNhanCong) : ''}</td>
        <td class="col-simple" style="border:1px solid #000; padding:6px; text-align:right;">${displayTt ? fmtVND(displayTt) : ''}</td>
        <td class="col-complex" style="border:1px solid #000; padding:6px; font-weight:bold; text-align:right;">${displayTt ? fmtVND(displayTt) : ''}</td>
        <td class="col-complex" style="border:1px solid #000; padding:6px;">${p.ghiChu || ''}</td>
      </tr>`;
    });
  }
  
  els.productTbody.innerHTML = h1;
  els.appProductTable.innerHTML = h3;
  document.getElementById('bg-product-table').innerHTML = hBg;
  if(document.getElementById('bind-products-kt')) document.getElementById('bind-products-kt').innerHTML = hKt;
  if(document.getElementById('bbgh-product-table')) document.getElementById('bbgh-product-table').innerHTML = hBb;
  
  // Set table modes
  const tblMode = State.tableMode === 'complex' ? 'complex-mode' : 'simple-mode';
  const noMode = State.tableMode === 'complex' ? 'simple-mode' : 'complex-mode';
  [
    document.querySelector('#product-table-body')?.closest('table'),
    document.querySelector('#bg-product-table')?.closest('table'),
    document.querySelector('#app-product-table')?.closest('table'),
    document.querySelector('#bind-products-kt')?.closest('table')
  ].forEach(tb => {
    if(tb) {
      tb.classList.add(tblMode);
      tb.classList.remove(noMode);
    }
  });
  
  // Update totals
  const vat = sum * State.vatRate;
  const total = sum + vat;
  const setText = (id, txt) => { const e = document.getElementById(id); if (e) e.textContent = txt; };

  setText('app-subtotal', fmtVND(sum) + ' VNĐ');
  setText('app-vat', fmtVND(vat) + ' VNĐ');
  setText('app-total', fmtVND(total) + ' VNĐ');
  setText('app-vat-rate', (State.vatRate * 100));
  setText('bbnt-total', fmtVND(total));
  
  // Bg logic with VAT
  const bgSubtotal = Math.round(sum);
  const bgVatAmount = Math.round(vat);
  const bgTotal = Math.round(total);
  
  setText('bg-subtotal', fmtVND(bgSubtotal));
  setText('bg-subtotal-complex', fmtVND(bgSubtotal));
  setText('bg-vat-amount', fmtVND(bgVatAmount));
  setText('bg-vat-amount-complex', fmtVND(bgVatAmount));
  setText('bg-total-rounded', fmtVND(bgTotal));
  setText('bg-total-rounded-complex', fmtVND(bgTotal));
  setText('bg-total-words', docTien(bgTotal));

  document.querySelectorAll('.bind-vat-rate').forEach(e => e.textContent = (State.vatRate * 100));
  
  // Update KT contract totals
  const tamUngPerc = parseFloat(State.contract.tamung) || 0;
  const tamUngVal = Math.round(bgTotal * tamUngPerc / 100);
  const conLaiVal = bgTotal - tamUngVal;
  
  document.querySelectorAll('.bind-tong-truoc-vat').forEach(e => e.textContent = fmtVND(bgSubtotal));
  document.querySelectorAll('.bind-tien-vat').forEach(e => e.textContent = fmtVND(bgVatAmount));
  document.querySelectorAll('.bind-tong-sau-vat').forEach(e => e.textContent = fmtVND(bgTotal));
  document.querySelectorAll('.bind-tong-bang-chu').forEach(e => e.textContent = docTien(bgTotal));
  

  document.querySelectorAll('.bind-tien-tam-ung').forEach(e => e.textContent = fmtVND(tamUngVal));
  document.querySelectorAll('.bind-chu-tam-ung').forEach(e => e.textContent = docTien(tamUngVal).replace(' đồng', ''));
  document.querySelectorAll('.bind-tien-con-lai').forEach(e => e.textContent = fmtVND(conLaiVal));
  document.querySelectorAll('.bind-chu-con-lai').forEach(e => e.textContent = docTien(conLaiVal).replace(' đồng', ''));
  
  // Update live Appendix based on contractType
  const liveAppTable = document.getElementById('app-product-table');
  const liveAppTotals = document.getElementById('app-subtotal');
  
  if (State.contractType === 'kt') {
      const liveAppTableParent = liveAppTable ? liveAppTable.closest('table') : null;
      const ktTableTbody = document.getElementById('bind-products-kt');
      const ktTable = ktTableTbody ? ktTableTbody.closest('table') : null;
      
      if (liveAppTableParent && ktTable) {
         // Create a placeholder if not exists
         const ktClone = ktTable.cloneNode(true);
         ktClone.id = 'temp-kt-table-app';
         // Replace entire table layout to match KT
         if(document.getElementById('temp-kt-table-app')) {
            document.getElementById('temp-kt-table-app').replaceWith(ktClone);
         } else {
            liveAppTableParent.style.display = 'none'; // hide original
            liveAppTableParent.parentNode.insertBefore(ktClone, liveAppTableParent.nextSibling);
         }
      }
      
      if (liveAppTotals) {
         const pTotals = liveAppTotals.closest('div');
         if(pTotals) pTotals.style.display = 'none';
      }
  } else {
      if (liveAppTable) {
         const t = liveAppTable.closest('table');
         if(t) t.style.display = '';
      }
      if(document.getElementById('temp-kt-table-app')) {
         document.getElementById('temp-kt-table-app').style.display = 'none';
      }
      if (liveAppTotals) {
         const pTotals = liveAppTotals.closest('div');
         if(pTotals) pTotals.style.display = '';
      }
  }
}

// Convert Number to Words (Vietnamese)
const mangso = ['không','một','hai','ba','bốn','năm','sáu','bảy','tám','chín'];
function dochangchuc(so, daydu){
    var chuoi = "";
    var chuc = Math.floor(so/10);
    var donvi = so%10;
    if (chuc>1) {
        chuoi = " " + mangso[chuc] + " mươi";
        if (donvi==1) { chuoi += " mốt"; }
    } else if (chuc==1) {
        chuoi = " mười";
        if (donvi==1) { chuoi += " một"; }
    } else if (daydu && donvi>0) {
        chuoi = " lẻ";
    }
    if (donvi==5 && chuc>=1) { chuoi += " lăm"; }
    else if (donvi>1||(donvi==1&&chuc==0)) { chuoi += " " + mangso[donvi]; }
    return chuoi;
}
function docblock(so, daydu){
    var chuoi = "";
    var tram = Math.floor(so/100);
    so = so%100;
    if (daydu || tram>0) {
        chuoi = " " + mangso[tram] + " trăm";
        chuoi += dochangchuc(so,true);
    } else {
        chuoi = dochangchuc(so,false);
    }
    return chuoi;
}
function dochangtrieu(so, daydu){
    var chuoi = "";
    var trieu = Math.floor(so/1000000);
    so = so%1000000;
    if (trieu>0) {
        chuoi = docblock(trieu,daydu) + " triệu";
        daydu = true;
    }
    var ngan = Math.floor(so/1000);
    so = so%1000;
    if (ngan>0) {
        chuoi += docblock(ngan,daydu) + " nghìn";
        daydu = true;
    }
    if (so>0) {
        chuoi += docblock(so,daydu);
    }
    return chuoi;
}
function docTien(so){
    if (so==0) return mangso[0] + " đồng";
    var chuoi = "", hauto = "";
    do {
        var ty = so%1000000000;
        so = Math.floor(so/1000000000);
        if (so>0) { chuoi = dochangtrieu(ty,true) + hauto + chuoi; }
        else { chuoi = dochangtrieu(ty,false) + hauto + chuoi; }
        hauto = " tỷ";
    } while (so>0);
    chuoi = chuoi.trim();
    if (chuoi.length>0) {
        chuoi = chuoi.charAt(0).toUpperCase() + chuoi.slice(1);
    }
    return chuoi + " chẵn.";
}

// Global window function for inline handlers
window.updateRow = function(idx, field, value) {
  if(field === 'sl' || field === 'gia') value = parseFloat(value) || 0;
  State.products[idx][field] = value;
  bindDataToPreviews();
}

els.vatSelect.addEventListener('change', () => {
    saveFormState();
    bindDataToPreviews();
});
if(els.vatSelectKt) {
    els.vatSelectKt.addEventListener('change', () => {
        saveFormState();
        bindDataToPreviews();
    });
}

// Setup realtime updates for all inputs
document.querySelectorAll('input').forEach(input => {
    // skip the excel file input
    if(input.id === 'excel-file') return;
    input.addEventListener('input', () => {
        saveFormState();
        bindDataToPreviews();
    });
});

// Excel Parsing Logic
els.fileDrop.addEventListener('click', () => els.fileInput.click());
els.fileInput.addEventListener('change', handleExcelUpload);

function handleExcelUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, {type: 'array'});
    
    // Assume first sheet
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const json = XLSX.utils.sheet_to_json(worksheet, {header: 1});
    
    parseExcelToState(json);
  };
  reader.readAsArrayBuffer(file);
}

function parseExcelToState(rows) {
  State.products = [];
  State.tableMode = 'simple'; // Default
  
  // Detect Complex mode by checking first 10 rows for "VẬT TƯ"
  for (let i = 0; i < Math.min(rows.length, 10); i++) {
    const rowStr = (rows[i] || []).join(' ').toUpperCase();
    if (rowStr.includes('VẬT TƯ') || rowStr.includes('NHÂN CÔNG')) {
      State.tableMode = 'complex';
      break;
    }
  }
  
  rows.forEach((row, i) => {
    // Skip empty or header rows roughly
    if (!row[1] || typeof row[1] !== 'string') return;
    if (row[1].toLowerCase().includes('tên')) return; 
    
    // Check if STT is valid or it's a Roman numeral cat
    const sttStr = String(row[0] || '').trim();
    if (!sttStr) return; // Must have STT or Cat identifier to avoid picking up arbitrary rows
    
    // In Complex mode: Array usually length is longer
    // Image 2 format: 0:STT, 1:Tên, 2:ĐVT, 3:SL, 4:GiaVT, 5:GiaNC, 9:Ghi Chu
    const isCat = isRoman(sttStr);
    const sl = parseFloat(row[3]);
    
    let gia = 0, giaVatTu = 0, giaNhanCong = 0, ghiChu = '';
    
    if (State.tableMode === 'complex') {
        giaVatTu = parseFloat(row[4]);
        giaNhanCong = parseFloat(row[5]);
        ghiChu = String(row[9] || '');
        if (isNaN(giaVatTu)) giaVatTu = 0;
        if (isNaN(giaNhanCong)) giaNhanCong = 0;
    } else {
        gia = parseFloat(row[4]);
        ghiChu = String(row[6] || '');
        if (isNaN(gia)) gia = 0;
    }
    
    if (!isNaN(sl) || isCat) {
      State.products.push({
        stt: sttStr,
        ten: row[1],
        dvt: row[2] || '',
        sl: isNaN(sl) ? 0 : sl,
        gia: gia,
        giaVatTu: giaVatTu,
        giaNhanCong: giaNhanCong,
        ghiChu: ghiChu
      });
    }
  });
  
  alert('Đã load xong ' + State.products.length + ' sản phẩm từ Excel ở chế độ: ' + State.tableMode);
  bindDataToPreviews();
}

// Step 6: Previews
function prepareFinalPreviews() {
  document.getElementById('mini-preview-1').innerHTML = document.getElementById('preview-baogia').innerHTML;
  
  if (State.contractType === 'gk') {
      document.getElementById('mini-preview-2').innerHTML = document.getElementById('preview-contract-gk').innerHTML;
      document.getElementById('chk-contract-gk').checked = true;
      document.getElementById('chk-contract-kt').checked = false;
      document.getElementById('mini-preview-kt').innerHTML = "<i>KHÔNG ÁP DỤNG HĐ KINH TẾ</i>";
      
      document.getElementById('mini-preview-4').innerHTML = document.getElementById('preview-bbnt').innerHTML;
      document.getElementById('chk-bbnt').checked = true;
      if (document.getElementById('chk-bbgh')) document.getElementById('chk-bbgh').checked = false;
  } else {
      document.getElementById('mini-preview-kt').innerHTML = document.getElementById('preview-contract-kt').innerHTML;
      document.getElementById('chk-contract-kt').checked = true;
      document.getElementById('chk-contract-gk').checked = false;
      document.getElementById('mini-preview-2').innerHTML = "<i>KHÔNG ÁP DỤNG HĐ GIAO KHOÁN</i>";
      
      if(document.getElementById('preview-bbgh')) {
          document.getElementById('mini-preview-4').innerHTML = document.getElementById('preview-bbgh').innerHTML;
          // rename the label 
          document.getElementById('chk-bbnt').nextSibling.textContent = ' BIÊN BẢN GIAO HÀNG';
      }
      document.getElementById('chk-bbnt').checked = true;
      if(document.getElementById('chk-bbgh')) document.getElementById('chk-bbgh').checked = true;
  }
  
  const appPreview = document.getElementById('preview-appendix').cloneNode(true);
  
  if (State.contractType === 'kt') {
      const appTable = appPreview.querySelector('table:nth-of-type(1)');
      const ktTableTbody = document.getElementById('bind-products-kt');
      const ktTable = ktTableTbody ? ktTableTbody.closest('table').cloneNode(true) : null;
      if (appTable && ktTable) {
        appTable.parentNode.replaceChild(ktTable, appTable);
      }
      const appTotals = appPreview.querySelector('#app-subtotal').parentNode;
      if (appTotals) {
        appTotals.style.display = 'none';
      }
  }
  document.getElementById('mini-preview-3').innerHTML = appPreview.innerHTML;
}

// File Export
document.getElementById('btn-export-pdf').addEventListener('click', () => {
  const chk1 = document.getElementById('chk-quote').checked;
  const chk2_gk = document.getElementById('chk-contract-gk') ? document.getElementById('chk-contract-gk').checked : false;
  const chk2_kt = document.getElementById('chk-contract-kt') ? document.getElementById('chk-contract-kt').checked : false;
  const chk3 = document.getElementById('chk-appendix').checked;
  const chk4 = document.getElementById('chk-bbnt').checked;
  
  const docs = [];

  if (chk1) docs.push(document.getElementById('preview-baogia').outerHTML);
  if (chk2_gk) docs.push(document.getElementById('preview-contract-gk').outerHTML);
  if (chk2_kt) docs.push(document.getElementById('preview-contract-kt').outerHTML);
  
  if (chk3) {
      if (State.contractType === 'kt') {
          const appPreview = document.getElementById('preview-appendix').cloneNode(true);
          const appTable = appPreview.querySelector('table:nth-of-type(1)');
          const ktTableTbody = document.getElementById('bind-products-kt');
      const ktTable = ktTableTbody ? ktTableTbody.closest('table').cloneNode(true) : null;
          if (appTable && ktTable) appTable.parentNode.replaceChild(ktTable, appTable);
          const appTotals = appPreview.querySelector('#app-subtotal').parentNode;
          if (appTotals) appTotals.style.display = 'none';
          docs.push(appPreview.outerHTML);
      } else {
          docs.push(document.getElementById('preview-appendix').outerHTML);
      }
  }
  
  if (chk4) {
      if (State.contractType === 'gk') docs.push(document.getElementById('preview-bbnt').outerHTML);
      else docs.push(document.getElementById('preview-bbgh').outerHTML);
  }
  
  if (docs.length === 0) {
    alert("Vui lòng chọn ít nhất 1 văn bản để lưu PDF.");
    return;
  }
  if (docs.length === 0) {
    alert("Vui lòng chọn ít nhất 1 văn bản để lưu PDF.");
    return;
  }
  
  const btn = document.getElementById('btn-export-pdf');
  btn.disabled = true;
  btn.innerText = 'Đang chuẩn bị trang in...';

  const printZone = document.getElementById('print-zone');
  if (!printZone) {
    alert("Không tìm thấy vùng in. Vui lòng F5 lại trang.");
    btn.disabled = false;
    btn.innerText = '⎙ LƯU DƯỚI DẠNG PDF (HOẶC IN)';
    return;
  }
  
  printZone.innerHTML = docs.map(html => `<div class="page-break">${html}</div>`).join('');
  
  // Timeout for DOM to render the printZone hidden elements properly
  setTimeout(() => {
    window.print();
    btn.disabled = false;
    btn.innerText = '⎙ LƯU DƯỚI DẠNG PDF (HOẶC IN)';
    printZone.innerHTML = '';
  }, 500);
});

document.getElementById('btn-export-all').addEventListener('click', () => {
  const zip = new JSZip();
  const folder = zip.folder("HopDong_XuatKhang");
  
  const chk1 = document.getElementById('chk-quote').checked;
  const chk2_gk = document.getElementById('chk-contract-gk') ? document.getElementById('chk-contract-gk').checked : false;
  const chk2_kt = document.getElementById('chk-contract-kt') ? document.getElementById('chk-contract-kt').checked : false;
  const chk3 = document.getElementById('chk-appendix').checked;
  const chk4 = document.getElementById('chk-bbnt').checked;
  
  if (chk1) folder.file("01_BaoGia.doc", generateWordBlob(document.getElementById('preview-baogia').outerHTML));
  if (chk2_gk) folder.file("02_HopDongGiaoKhoan.doc", generateWordBlob(document.getElementById('preview-contract-gk').outerHTML));
  if (chk2_kt) folder.file("02_HopDongKinhTe.doc", generateWordBlob(document.getElementById('preview-contract-kt').outerHTML));
  
  if (chk3) {
      if (State.contractType === 'kt') {
          const appPreview = document.getElementById('preview-appendix').cloneNode(true);
          const appTable = appPreview.querySelector('table:nth-of-type(1)');
          const ktTableTbody = document.getElementById('bind-products-kt');
      const ktTable = ktTableTbody ? ktTableTbody.closest('table').cloneNode(true) : null;
          if (appTable && ktTable) appTable.parentNode.replaceChild(ktTable, appTable);
          const appTotals = appPreview.querySelector('#app-subtotal').parentNode;
          if (appTotals) appTotals.style.display = 'none';
          folder.file("03_PhuLuc.doc", generateWordBlob(appPreview.outerHTML));
      } else {
          folder.file("03_PhuLuc.doc", generateWordBlob(document.getElementById('preview-appendix').outerHTML));
      }
  }
  
  if (chk4) {
      if (State.contractType === 'gk') {
          folder.file("04_BBNT.doc", generateWordBlob(document.getElementById('preview-bbnt').outerHTML));
      } else {
          folder.file("04_BBGH.doc", generateWordBlob(document.getElementById('preview-bbgh').outerHTML));
      }
  }

  
  zip.generateAsync({type:"blob"}).then(function(content) {
      saveAs(content, "TaiLieu.zip");
  });
});

document.getElementById('btn-fill-dummy').addEventListener('click', (e) => {
  e.stopPropagation();
  document.getElementById('kh_ten').value = "Công ty TNHH MTV Demo Tech";
  document.getElementById('kh_mst').value = "0101234567";
  document.getElementById('kh_diachi').value = "Số 15, KCN ABC, Phường 1, TP HCM";
  document.getElementById('kh_stk').value = "123456789 tại VietinBank";
  document.getElementById('kh_daidien').value = "Phạm Văn Mẫu";
  document.getElementById('kh_chucvu').value = "Tổng Giám Đốc";
  document.getElementById('kh_sdt').value = "0987654321";
  document.getElementById('kh_email').value = "contact@demotech.com";
  
  document.getElementById('ten_ct').value = "Hệ thống làm mát nhà máy Demo Tech";
  document.getElementById('diadiem_ct').value = "KCN ABC, TP HCM";
  
  State.tableMode = 'complex';
  State.products = [
    { stt: "I", ten: "Xây mới nhà vệ sinh nữ", dvt: "", sl: 0, giaVatTu: 0, giaNhanCong: 0 },
    { stt: "1", ten: "Xây tường bao dày 110m (xây 3 mặt)", dvt: "m2", sl: 19.8, giaVatTu: 245000, giaNhanCong: 185000, ghiChu: "" },
    { stt: "2", ten: "Trát 2 mặt tường bao", dvt: "m2", sl: 39.6, giaVatTu: 95000, giaNhanCong: 75000, ghiChu: "" },
    { stt: "3", ten: "Sơn tường ngoài", dvt: "m2", sl: 19.8, giaVatTu: 65000, giaNhanCong: 35000, ghiChu: "" },
    { stt: "4", ten: "Nhân công lắp đặt cửa nhôm kính", dvt: "Bộ", sl: 1, giaVatTu: 0, giaNhanCong: 650000, ghiChu: "Lắp đặt lại" }
  ];
  
  alert("Đã điền dữ liệu mẫu thành công!");
  handleInputBind();
});

function exportHTMLToWord(htmlContent, filename){
  const preHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export Word</title></head><body>";
  const postHtml = "</body></html>";
  const html = preHtml + htmlContent + postHtml;

  const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
  const url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);
  
  const downloadLink = document.createElement("a");
  document.body.appendChild(downloadLink);
  
  if (navigator.msSaveOrOpenBlob) {
    navigator.msSaveOrOpenBlob(blob, filename + '.doc');
  } else {
    downloadLink.href = url;
    downloadLink.download = filename + '.doc';
    downloadLink.click();
  }
  document.body.removeChild(downloadLink);
}

// Initial binding
bindDataToPreviews();


