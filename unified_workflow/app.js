// State Management
const State = {
  currentStep: 1,
  contractType: 'gk',
  client: { ten: '', mst: '', diachi: '', daidien: '', stk: '', chucvu: '', sdt: '', email: '', soBaogia: '' },
  company: { ten: '', tenCn: '', mst: '', diachi: '', diachiCn: '', stk: '', daidien: '', chucvu: '', sdt: '', email: '', logoData: '', stampData: '' },
  contract: { sohd: '01/2024/HDGK', ngay: '', tenct: '', diadiemct: '', tamung: '50', songaytt: '15', thoiGianGiao: '10', ptThanhKhoan: 'Chuyển khoản (VNĐ)' },
  products: [{ stt: '1', ten: '', dvt: '', sl: 1, gia: 0, giaVatTu: 0, giaNhanCong: 0, ghiChu: '' }],
  tableMode: 'simple',
  vatRate: 0.08
};

// --- Duplicate Document Number Validation Module ---
const existingDocNumbers = new Set();
async function fetchExistingDocNumbers() {
  if (typeof firebase === 'undefined' || !firebase.firestore) return;
  try {
    const snapshot = await firebase.firestore().collection('contracts_cloud').get();
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.ma_so) {
        data.ma_so.split('|').map(s => s.trim()).filter(s => s).forEach(s => existingDocNumbers.add(s));
      }
      if (data.document_numbers && Array.isArray(data.document_numbers)) {
        data.document_numbers.forEach(s => existingDocNumbers.add(s.trim()));
      }
    });
    console.log("Loaded existing doc numbers:", existingDocNumbers.size);
    ['so_baogia', 'so_hd', 'so_hd_kt', 'so_hd_nt', 'so_pl', 'so_bbgh'].forEach(id => {
      const input = document.getElementById(id);
      if (input) validateInputUnique(input);
    });
  } catch (err) {
    console.error("Error fetching doc numbers:", err);
  }
}

function validateInputUnique(el) {
  if (!el) return;
  const val = el.value.trim();
  
  let parent = el.parentElement;
  let errEl = parent.querySelector('.cloud-dup-error');
  if (!errEl) {
    errEl = document.createElement('div');
    errEl.className = 'cloud-dup-error';
    errEl.style.color = '#ef4444';
    errEl.style.fontSize = '12px';
    errEl.style.fontWeight = '600';
    errEl.style.marginTop = '4px';
    parent.appendChild(errEl);
  }

  if (!val || val === '...' || /^(\.)+$/.test(val)) {
    el.style.border = '';
    el.style.boxShadow = '';
    el.title = '';
    errEl.textContent = '';
    errEl.style.display = 'none';
    return;
  }

  if (existingDocNumbers.has(val)) {
    el.style.border = '2px solid #ef4444'; // Red border
    el.style.boxShadow = '0 0 8px rgba(239, 68, 68, 0.2)';
    el.title = 'Số văn bản này đã tồn tại trên Đám Mây!';
    errEl.textContent = '❌ Số văn bản này đã tồn tại trên Cloud!';
    errEl.style.display = 'block';
  } else {
    el.style.border = '';
    el.style.boxShadow = '';
    el.title = '';
    errEl.textContent = '';
    errEl.style.display = 'none';
  }
}

// --- Toast System ---
window.showToast = function (message, type = 'info', duration = 4000) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let icon = 'ℹ️';
  if (type === 'success') icon = '✅';
  if (type === 'error') icon = '❌';
  if (type === 'warning') icon = '⚠️';

  toast.innerHTML = `<div class="toast-icon">${icon}</div><div>${message.replace(/\\n/g, '<br>')}</div>`;
  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400); // Wait for transition
  }, duration);
}
// --------------------

// ---------------------------------------------------

// Elements
const els = {
  steps: document.querySelectorAll('.step'),
  contents: document.querySelectorAll('.step-content'),
  btnPrev: document.getElementById('btn-prev'),
  soBbgh: document.getElementById('so_bbgh'),
  btnNext: document.getElementById('btn-next'),
  fileDrop: document.getElementById('file-drop'),
  fileInput: document.getElementById('excel-file'),
  productTbody: document.getElementById('product-table-body'),
  appProductTable: document.getElementById('app-product-table'),
  vatSelect: document.getElementById('vat-rate'),
  vatSelectKt: document.getElementById('vat-rate-kt'),

  radioBranchDv: document.getElementById('radio-branch-dv'),
  radioBranchKt: document.getElementById('radio-branch-kt'),
  wrapperGk: document.getElementById('wrapper-gk'),
  wrapperKt: document.getElementById('wrapper-kt'),
  wrapperNt: document.getElementById('wrapper-nt'),
  wrapperBbnt: document.getElementById('wrapper-bbnt'),
  wrapperBbgh: document.getElementById('wrapper-bbgh'),
  bbghProductTable: document.getElementById('bbgh-product-table'),
  
  dnLogoFile: document.getElementById('dn_logo_file'),
  dnStampFile: document.getElementById('dn_stamp_file'),

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
  so_baogia: document.getElementById('so_baogia'),
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
  so_hd_nt: document.getElementById('so_hd_nt'),
  ngay_ky_nt: document.getElementById('ngay_ky_nt'),
  ngay_het_han_nt: document.getElementById('ngay_het_han_nt'),
};

function fmtVND(n) {
  if (!isFinite(n)) return '0';
  return Math.round(n).toLocaleString('vi-VN');
}

// Navigation Logic
function updateNav() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
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
    els.wrapperGk.style.display = 'none';
    els.wrapperKt.style.display = 'none';
    els.wrapperNt.style.display = 'none';
    if (State.contractType === 'gk') els.wrapperGk.style.display = 'block';
    else if (State.contractType === 'kt') els.wrapperKt.style.display = 'block';
    else if (State.contractType === 'nt') els.wrapperNt.style.display = 'block';
  }

  if (State.currentStep === 4) {
    if (State.contractType === 'gk') {
      els.wrapperBbnt.style.display = 'block';
      if (els.wrapperBbgh) els.wrapperBbgh.style.display = 'none';
      if (document.getElementById('col-so-bbgh')) document.getElementById('col-so-bbgh').style.display = 'none';
    } else {
      els.wrapperBbnt.style.display = 'none';
      if (els.wrapperBbgh) els.wrapperBbgh.style.display = 'block';
      if (document.getElementById('col-so-bbgh')) document.getElementById('col-so-bbgh').style.display = 'block';
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

els.steps.forEach((st, i) => {
  st.addEventListener('click', () => {
    saveFormState();
    State.currentStep = i + 1;
    updateNav();
  });
});

window.setContractType = function(type) {
  State.contractType = type;
  
  // Update sidebar UI
  const menuKt = document.getElementById('menu-mua-ban');
  const menuGk = document.getElementById('menu-dich-vu');
  
  if (type === 'kt') {
    if(menuKt) {
      menuKt.classList.add('bg-[#d2e6ef]', 'text-[#55676f]', 'font-bold');
      menuKt.classList.remove('text-[#414752]', 'hover:bg-[#e0e2ea]');
    }
    if(menuGk) {
      menuGk.classList.remove('bg-[#d2e6ef]', 'text-[#55676f]', 'font-bold');
      menuGk.classList.add('text-[#414752]', 'hover:bg-[#e0e2ea]');
    }
    const st2 = document.getElementById('st-2-text');
    if(st2) st2.textContent = 'Kinh Tế';
    const st4 = document.getElementById('st-4-text');
    if(st4) st4.textContent = 'Giao Hàng';
  } else {
    if(menuGk) {
      menuGk.classList.add('bg-[#d2e6ef]', 'text-[#55676f]', 'font-bold');
      menuGk.classList.remove('text-[#414752]', 'hover:bg-[#e0e2ea]');
    }
    if(menuKt) {
      menuKt.classList.remove('bg-[#d2e6ef]', 'text-[#55676f]', 'font-bold');
      menuKt.classList.add('text-[#414752]', 'hover:bg-[#e0e2ea]');
    }
    const st2 = document.getElementById('st-2-text');
    if(st2) st2.textContent = 'Giao Khoán';
    const st4 = document.getElementById('st-4-text');
    if(st4) st4.textContent = 'Nghiệm Thu';
  }
  
  updateNav();
};

if (els.radioBranchDv) {
  els.radioBranchDv.addEventListener('change', () => {
    if (els.radioBranchDv.checked) window.setContractType('gk');
  });
}
if (els.radioBranchKt) {
  els.radioBranchKt.addEventListener('change', () => {
    if (els.radioBranchKt.checked) window.setContractType('kt');
  });
}

// Initialize with default
window.addEventListener('DOMContentLoaded', () => {
  window.setContractType('gk');
});

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
  State.client.soBaogia = els.so_baogia ? els.so_baogia.value || '...' : '...';

  State.company.ten = els.dn_ten.value || '...';
  State.company.tenCn = document.getElementById('dn_ten_cn') ? (document.getElementById('dn_ten_cn').value || '') : '';
  State.company.mst = els.dn_mst.value || '...';
  State.company.diachi = els.dn_diachi.value || '...';
  State.company.diachiCn = document.getElementById('dn_diachi_cn') ? (document.getElementById('dn_diachi_cn').value || '') : '';
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
  } else if (State.contractType === 'nt') {
    State.contract.sohd = els.so_hd_nt ? (els.so_hd_nt.value || '...') : '...';
    State.contract.ngay = els.ngay_ky_nt ? (els.ngay_ky_nt.value || '...') : '...';
    State.contract.hethan = els.ngay_het_han_nt ? (els.ngay_het_han_nt.value || '...') : '...';
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
  State.contract.soBbgh = els.soBbgh ? els.soBbgh.value || '.....................................' : '.....................................';

  if (State.contractType === 'kt') {
    if (els.vatSelectKt) State.vatRate = parseFloat(els.vatSelectKt.value);
    if (els.vatSelect && els.vatSelectKt) els.vatSelect.value = els.vatSelectKt.value;
  } else {
    if (els.vatSelect) State.vatRate = parseFloat(els.vatSelect.value);
    if (els.vatSelectKt && els.vatSelect) els.vatSelectKt.value = els.vatSelect.value;
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
  document.querySelectorAll('.bind-so-baogia').forEach(e => e.textContent = State.client.soBaogia);

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

  // Bind Chinese info and custom attachments
  document.querySelectorAll('.bind-dn-ten-cn').forEach(e => {
    e.textContent = State.company.tenCn || '';
  });
  document.querySelectorAll('.bind-dn-ten-cn-wrapper').forEach(e => {
    e.style.display = State.company.tenCn ? 'inline' : 'none';
  });

  document.querySelectorAll('.bind-dn-diachi-cn').forEach(e => {
    e.textContent = State.company.diachiCn || '';
  });
  document.querySelectorAll('.bind-dn-diachi-cn-wrapper').forEach(e => {
    e.style.display = State.company.diachiCn ? 'block' : 'none';
  });

  document.querySelectorAll('.bind-logo-img').forEach(e => {
    if (State.company.logoData) {
      e.src = State.company.logoData;
      e.style.display = 'block';
    } else {
      e.src = '';
      e.style.display = 'none';
    }
  });
  document.querySelectorAll('.bind-logo-cell').forEach(e => {
    e.style.display = State.company.logoData ? 'table-cell' : 'none';
  });

  document.querySelectorAll('.bind-stamp-img').forEach(e => {
    if (State.company.stampData) {
      e.src = State.company.stampData;
      e.style.display = 'block';
    } else {
      e.src = '';
      e.style.display = 'none';
    }
  });

  document.querySelectorAll('.bind-sohd').forEach(e => e.textContent = State.contract.sohd);
  document.querySelectorAll('.bind-ten-ct').forEach(e => e.textContent = State.contract.tenct);
  document.querySelectorAll('.bind-diadiem-ct').forEach(e => e.textContent = State.contract.diadiemct);
  document.querySelectorAll('.bind-tam-ung').forEach(e => e.textContent = State.contract.tamung);
  document.querySelectorAll('.bind-so-ngay-tt').forEach(e => e.textContent = State.contract.songaytt);
  document.querySelectorAll('.bind-thoi-gian-giao').forEach(e => e.textContent = State.contract.thoiGianGiao);
  document.querySelectorAll('.bind-pt-thanh-toan').forEach(e => e.textContent = State.contract.ptThanhToan);

  // Date parsing
  const dateStr = State.contract.ngay;
  if (dateStr) {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
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

  const hethanStr = State.contract.hethan;
  if(hethanStr) {
    const parts = hethanStr.split('-');
    if (parts.length === 3) {
      document.querySelectorAll('.bind-het-han').forEach(e => e.textContent = `${parts[2]}/${parts[1]}/${parts[0]}`);
      document.querySelectorAll('.bind-ngay-hethan').forEach(e => e.textContent = parts[2]);
      document.querySelectorAll('.bind-thang-hethan').forEach(e => e.textContent = parts[1]);
      document.querySelectorAll('.bind-nam-hethan').forEach(e => e.textContent = parts[0]);
    }
  } else {
    document.querySelectorAll('.bind-het-han').forEach(e => e.textContent = '...');
    document.querySelectorAll('.bind-ngay-hethan').forEach(e => e.textContent = '...');
    document.querySelectorAll('.bind-thang-hethan').forEach(e => e.textContent = '...');
    document.querySelectorAll('.bind-nam-hethan').forEach(e => e.textContent = '...');
  }

  // Appendix Parsing
  document.querySelectorAll('.bind-sopl').forEach(e => e.textContent = State.contract.sopl);
  document.querySelectorAll('.bind-sobbgh').forEach(e => e.textContent = State.contract.soBbgh || '.....................................');
  const datePl = State.contract.ngaypl;
  if (datePl) {
    const parts = datePl.split('-');
    if (parts.length === 3) {
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
  if (!s) return false;
  return /^(M{0,3})(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/.test(s);
}


window.updateSoBbgh = function (val) {
  State.contract.soBbgh = (val || '').trim();
  document.querySelectorAll('.bind-sobbgh').forEach(e => e.textContent = State.contract.soBbgh || '.....................................');
};

window.updateRow = function (index, field, value) {
  if (!State.products[index]) return;
  if (['sl', 'gia', 'giaVatTu', 'giaNhanCong'].includes(field)) {
    State.products[index][field] = parseFloat(value) || 0;
  } else {
    State.products[index][field] = value;
  }
  renderProducts();
};

window.addProductRow = function () {
  State.products.push({
    stt: '',
    ten: '',
    dvt: '',
    sl: 1,
    gia: 0,
    giaVatTu: 0,
    giaNhanCong: 0,
    ghichu: ''
  });
  renderProducts();
};

window.removeProductRow = function (index) {
  State.products.splice(index, 1);
  renderProducts();
};

window.updateDvt = function (index, value) {
  if (value === '_other_') {
    let custom = prompt("Nhập Đơn vị tính mới:");
    if (custom) {
      State.products[index].dvt = custom;
    }
  } else {
    State.products[index].dvt = value;
  }
  renderProducts();
};


window.checkTab = function (e, index) {
  if (e.key === 'Enter') {
    if (index === State.products.length - 1) {
      e.preventDefault();
      window.addProductRow();
      // focus the next row's ten input after rendering
      setTimeout(() => {
        let inputs = document.querySelectorAll('#bg-product-table tr:last-child input');
        if (inputs.length > 1) inputs[1].focus();
      }, 50);
    }
  }
};

window.uploadProductImage = function (index, input) {
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 200; // Giảm kích thước tối đa xuống 200 thay vì 300
        let width = img.width;
        let height = img.height;
        if (width > height && width > MAX_SIZE) {
          height *= MAX_SIZE / width;
          width = MAX_SIZE;
        } else if (height > MAX_SIZE) {
          width *= MAX_SIZE / height;
          height = MAX_SIZE;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Nén ảnh chất lượng 50% thay vì 80% để giảm dung lượng file base64
        State.products[index].imgData = canvas.toDataURL('image/jpeg', 0.5);
        renderProducts();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

// Product Rendering
function renderProducts() {
  if (State.products.length === 0) {
    State.products = [{ stt: '1', ten: '', dvt: '', sl: 1, gia: 0, giaVatTu: 0, giaNhanCong: 0, ghiChu: '' }];
  }
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


      const defaultDvts = ["", "Sét", "Cái", "Chiếc", "Bộ", "m2", "m", "Kg", "Lít", "Gói", "Hộp", "Cuộn"];
      let dvtOptions = "";
      let foundDvt = false;
      for (let d of defaultDvts) {
        let sel = (p.dvt === d) ? "selected" : "";
        if (p.dvt === d) foundDvt = true;
        dvtOptions += `<option value="${d}" ${sel}>${d || '--'}</option>`;
      }
      if (!foundDvt && p.dvt) {
        dvtOptions += `<option value="${p.dvt}" selected>${p.dvt}</option>`;
      }
      dvtOptions += `<option value="_other_">Tự nhập...</option>`;

      const dvtSelect = `<select onchange="updateDvt(${i}, this.value)" style="width:70px; background:transparent; border:1px solid #ccc; border-radius:4px; padding:2px; font-size:13px;">${dvtOptions}</select>`;

      // Step 1 Editor rows
      h1 += `<tr style="${styleBold}">
        <td><input type="text" value="${p.stt || ''}" onchange="updateRow(${i}, 'stt', this.value)" style="width:40px; ${bText} background:transparent; border:none;"></td>
        <td><input type="text" value="${p.ten || ''}" onchange="updateRow(${i}, 'ten', this.value)" style="width:100%; min-width:200px; ${bText} background:transparent;"></td>
        <td>${dvtSelect}</td>
        <td><input type="number" value="${p.sl || 0}" onchange="updateRow(${i}, 'sl', this.value)" style="width:50px; ${bText} background:transparent;"></td>
        <td class="col-simple"><input type="number" value="${gSimple}" onchange="updateRow(${i}, 'gia', this.value)" style="width:80px; ${bText} background:transparent;"></td>
        <td class="col-complex"><input type="number" value="${gVatTu}" onchange="updateRow(${i}, 'giaVatTu', this.value)" style="width:70px; ${bText} background:transparent;"></td>
        <td class="col-complex"><input type="number" value="${gNhanCong}" onchange="updateRow(${i}, 'giaNhanCong', this.value)" style="width:70px; ${bText} background:transparent;"></td>
        <td class="col-complex" style="${bText}">${p.sl ? fmtVND((p.sl || 0) * gVatTu) : ''}</td>
        <td class="col-complex" style="${bText}">${p.sl ? fmtVND((p.sl || 0) * gNhanCong) : ''}</td>
        <td class="col-simple" style="${bText}">${displayTt ? fmtVND(displayTt) : ''}</td>
        <td class="col-complex" style="font-weight:bold;">${displayTt ? fmtVND(displayTt) : ''}</td>
        <td class="col-complex"><input type="text" value="${p.ghiChu || ''}" onchange="updateRow(${i}, 'ghiChu', this.value)" onkeydown="checkTab(event, ${i})" style="width:100px; ${bText} background:transparent;"></td>
      </tr>`;

      // Step 3 Static rows (Appendix) & BBGH
      let staticImgHtml = p.imgData ? `<img src="${p.imgData}" style="max-width:50px; max-height:50px;">` : '';
      let staticRow = `<tr style="${styleBold}">
        <td style="border:1px solid #000; padding:8px; text-align:center;">${p.stt || (isCat ? '' : i + 1)}</td>
        <td style="border:1px solid #000; padding:8px;">${p.ten || ''}</td>
        <td style="border:1px solid #000; padding:8px; text-align:center;">${dispSl}</td>
        <td style="border:1px solid #000; padding:8px; text-align:center;">${p.dvt || ''}</td>
        <td style="border:1px solid #000; padding:4px; text-align:center; vertical-align:middle;">${staticImgHtml}</td>
        <td style="border:1px solid #000; padding:8px; text-align:right;">${(tGia || isCat) ? fmtVND(tGia) : ''}</td>
        <td style="border:1px solid #000; padding:8px; text-align:right; font-weight:bold;">${displayTt ? fmtVND(displayTt) : ''}</td>
        <td style="border:1px solid #000; padding:8px;">${p.ghiChu || ''}</td>
      </tr>`;

      h3 += staticRow;
      hBb += staticRow;

      // Step 2 Bao Gia Rows (WYSIWYG)
      let imgHtml = p.imgData ? `<img src="${p.imgData}" style="max-width:50px; max-height:50px; cursor:pointer;" onclick="document.getElementById('img-upload-${i}').click()">` : `<span onclick="document.getElementById('img-upload-${i}').click()" style="color:#aaa; cursor:pointer; font-size:12px;">+ Ảnh</span>`;
      let uploadInput = `<input type="file" id="img-upload-${i}" style="display:none" accept="image/*" onchange="uploadProductImage(${i}, this)">`;
      let bGText = isCat ? 'font-weight:bold;' : 'font-weight:inherit;';

      hBg += `<tr style="${styleBold}">
        <td style="border:1px solid #000; padding:0; text-align:center;"><input type="text" value="${p.stt || ''}" onchange="updateRow(${i}, 'stt', this.value)" style="width:100%; text-align:center; box-sizing:border-box; ${bGText} background:transparent; border:none; padding:8px; outline:none; font-family:inherit; font-size:inherit;"></td>
        <td style="border:1px solid #000; padding:0;"><div contenteditable="true" onblur="updateRow(${i}, 'ten', this.innerText)" style="min-height:30px; box-sizing:border-box; ${bGText} background:transparent; border:none; padding:8px 8px; outline:none; font-family:inherit; font-size:inherit; white-space:normal; overflow-wrap:break-word; word-break:break-word;">${p.ten || ''}</div></td>
        <td style="border:1px solid #000; padding:0; text-align:center;"><input type="number" value="${p.sl || 0}" onchange="updateRow(${i}, 'sl', this.value)" style="width:100%; text-align:center; box-sizing:border-box; ${bGText} background:transparent; border:none; padding:8px; outline:none; font-family:inherit; font-size:inherit;"></td>
        <td style="border:1px solid #000; padding:0; text-align:center;">
           <select onchange="updateDvt(${i}, this.value)" class="dvt-select-wysiwyg" style="width:100%; box-sizing:border-box; background:transparent; border:none; padding:8px; font-size:inherit; font-family:inherit; text-align:center; outline:none; -webkit-appearance:none; appearance:none; cursor:pointer;">${dvtOptions}</select>
        </td>
        <td style="border:1px solid #000; padding:4px; text-align:center; vertical-align:middle;">
          ${imgHtml}${uploadInput}
        </td>
        <td style="border:1px solid #000; padding:0; text-align:right;"><input type="number" value="${(State.tableMode === 'complex' && !isCat && !p.gia) ? (gVatTu + gNhanCong) : gSimple}" onchange="updateRow(${i}, 'gia', this.value); if(State.tableMode === 'complex') { State.products[${i}].giaVatTu = 0; State.products[${i}].giaNhanCong = 0; State.tableMode = 'simple'; renderProducts(); }" style="width:100%; text-align:right; box-sizing:border-box; ${bGText} background:transparent; border:none; padding:8px; outline:none; font-family:inherit; font-size:inherit;"></td>
        <td style="border:1px solid #000; padding:8px; text-align:right; font-weight:bold;">${displayTt ? fmtVND(displayTt) : ''}</td>
        <td style="border:1px solid #000; padding:0;">
           <div style="display:flex; width:100%; min-height: 30px;">
             <div contenteditable="true" onblur="updateRow(${i}, 'ghiChu', this.innerText)" onkeydown="checkTab(event, ${i})" style="width:100%; box-sizing:border-box; ${bGText} background:transparent; border:none; padding:8px; outline:none; font-family:inherit; font-size:inherit; white-space:normal; overflow-wrap:break-word; word-break:break-word;">${p.ghiChu || ''}</div>
             <button class="no-print" onclick="window.removeProductRow(${i})" style="color:red; background:none; border:none; cursor:pointer; padding:8px;" title="Xoá dòng">✖</button>
           </div>
        </td>
      </tr>`;

      // Step 2 Kinh Te Rows
      hKt += staticRow;
    });
  }

  els.productTbody.innerHTML = h1;
  els.appProductTable.innerHTML = h3;
  document.getElementById('bg-product-table').innerHTML = hBg;
  if (document.getElementById('bind-products-kt')) document.getElementById('bind-products-kt').innerHTML = hKt;
  if (document.getElementById('bbgh-product-table')) document.getElementById('bbgh-product-table').innerHTML = hBb;

  // Set table modes
  const tblMode = State.tableMode === 'complex' ? 'complex-mode' : 'simple-mode';
  const noMode = State.tableMode === 'complex' ? 'simple-mode' : 'complex-mode';
  [
    document.querySelector('#product-table-body')?.closest('table'),
    document.querySelector('#bg-product-table')?.closest('table'),
    document.querySelector('#app-product-table')?.closest('table'),
    document.querySelector('#bind-products-kt')?.closest('table')
  ].forEach(tb => {
    if (tb) {
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
  setText('kt-subtotal', fmtVND(bgSubtotal));
  setText('kt-vat-amount', fmtVND(bgVatAmount));
  setText('kt-total-rounded', fmtVND(bgTotal));

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

}

// Convert Number to Words (Vietnamese)
const mangso = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
function dochangchuc(so, daydu) {
  var chuoi = "";
  var chuc = Math.floor(so / 10);
  var donvi = so % 10;
  if (chuc > 1) {
    chuoi = " " + mangso[chuc] + " mươi";
    if (donvi == 1) { chuoi += " mốt"; }
  } else if (chuc == 1) {
    chuoi = " mười";
    if (donvi == 1) { chuoi += " một"; }
  } else if (daydu && donvi > 0) {
    chuoi = " lẻ";
  }
  if (donvi == 5 && chuc >= 1) { chuoi += " lăm"; }
  else if (donvi > 1 || (donvi == 1 && chuc == 0)) { chuoi += " " + mangso[donvi]; }
  return chuoi;
}
function docblock(so, daydu) {
  var chuoi = "";
  var tram = Math.floor(so / 100);
  so = so % 100;
  if (daydu || tram > 0) {
    chuoi = " " + mangso[tram] + " trăm";
    chuoi += dochangchuc(so, true);
  } else {
    chuoi = dochangchuc(so, false);
  }
  return chuoi;
}
function dochangtrieu(so, daydu) {
  var chuoi = "";
  var trieu = Math.floor(so / 1000000);
  so = so % 1000000;
  if (trieu > 0) {
    chuoi = docblock(trieu, daydu) + " triệu";
    daydu = true;
  }
  var ngan = Math.floor(so / 1000);
  so = so % 1000;
  if (ngan > 0) {
    chuoi += docblock(ngan, daydu) + " nghìn";
    daydu = true;
  }
  if (so > 0) {
    chuoi += docblock(so, daydu);
  }
  return chuoi;
}
function docTien(so) {
  if (so == 0) return mangso[0] + " đồng";
  var chuoi = "", hauto = "";
  do {
    var ty = so % 1000000000;
    so = Math.floor(so / 1000000000);
    if (so > 0) { chuoi = dochangtrieu(ty, true) + hauto + chuoi; }
    else { chuoi = dochangtrieu(ty, false) + hauto + chuoi; }
    hauto = " tỷ";
  } while (so > 0);
  chuoi = chuoi.trim();
  if (chuoi.length > 0) {
    chuoi = chuoi.charAt(0).toUpperCase() + chuoi.slice(1);
  }
  return chuoi + " chẵn.";
}

// Global window function for inline handlers

window.updateSoBbgh = function (val) {
  State.contract.soBbgh = (val || '').trim();
  document.querySelectorAll('.bind-sobbgh').forEach(e => e.textContent = State.contract.soBbgh || '.....................................');
};

window.updateRow = function (idx, field, value) {
  if (field === 'sl' || field === 'gia') value = parseFloat(value) || 0;
  State.products[idx][field] = value;
  bindDataToPreviews();
}

els.vatSelect.addEventListener('change', () => {
  saveFormState();
  bindDataToPreviews();
});
if (els.vatSelectKt) {
  els.vatSelectKt.addEventListener('change', () => {
    saveFormState();
    bindDataToPreviews();
  });
}

// Setup realtime updates for all inputs
document.querySelectorAll('input').forEach(input => {
  // skip the excel file input
  if (input.id === 'excel-file') return;
  input.addEventListener('input', () => {
    saveFormState();
    bindDataToPreviews();
    // Validate uniqueness on input
    if (['so_baogia', 'so_hd', 'so_hd_kt', 'so_hd_nt', 'so_pl', 'so_bbgh'].includes(input.id)) {
      validateInputUnique(input);
    }
  });
});

// Excel Parsing Logic
els.fileDrop.addEventListener('click', () => els.fileInput.click());
els.fileInput.addEventListener('change', handleExcelUpload);

function handleExcelUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });

    // Assume first sheet
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

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

  showToast('Đã load xong ' + State.products.length + ' sản phẩm từ Excel ở chế độ: ' + State.tableMode, 'success');
  bindDataToPreviews();
}


function cleanHtml(htmlStr) {
  const tmp = document.createElement('div');
  tmp.innerHTML = htmlStr;
  tmp.querySelectorAll('button.no-print').forEach(el => el.remove());
  tmp.querySelectorAll('input').forEach(el => {
    const span = document.createElement('span');
    span.innerText = el.value || el.getAttribute('value') || '';
    el.parentNode.replaceChild(span, el);
  });
  tmp.querySelectorAll('select').forEach(el => {
    const span = document.createElement('span');
    span.innerText = el.options[el.selectedIndex] ? el.options[el.selectedIndex].innerText : '';
    el.parentNode.replaceChild(span, el);
  });
  tmp.querySelectorAll('[contenteditable]').forEach(el => {
    const span = document.createElement('span');
    span.innerHTML = el.innerHTML;
    el.parentNode.replaceChild(span, el);
  });
  return tmp.innerHTML;
}

// Step 6: Previews
function prepareFinalPreviews() {
  document.getElementById('mini-preview-1').innerHTML = cleanHtml(document.getElementById('preview-baogia').innerHTML);

  const boxGk = document.getElementById('box-contract-gk');
  const boxKt = document.getElementById('box-contract-kt');
  const boxNt = document.getElementById('box-contract-nt');
  const labelBbnt = document.getElementById('label-bbnt');

  if (State.contractType === 'gk') {
    // Show Giao Khoán preview, Hide Kinh Tế / Nguyên Tắc
    if (boxGk) boxGk.style.display = 'block';
    if (boxKt) boxKt.style.display = 'none';
    if (boxNt) boxNt.style.display = 'none';

    document.getElementById('mini-preview-2').innerHTML = cleanHtml(document.getElementById('preview-contract-gk').innerHTML);
    document.getElementById('chk-contract-gk').checked = true;
    document.getElementById('chk-contract-kt').checked = false;
    document.getElementById('chk-contract-nt').checked = false;

    // Show BBNT
    document.getElementById('mini-preview-4').innerHTML = cleanHtml(document.getElementById('preview-bbnt').innerHTML);
    document.getElementById('chk-bbnt').checked = true;
    if (labelBbnt) labelBbnt.textContent = 'BIÊN BẢN NGHIỆM THU HOÀN THÀNH';

  } else {
    // Show Kinh Tế preview, Hide Giao Khoán / Nguyên Tắc
    if (boxGk) boxGk.style.display = 'none';
    if (boxKt) boxKt.style.display = 'block';
    if (boxNt) boxNt.style.display = 'none';

    document.getElementById('mini-preview-kt').innerHTML = cleanHtml(document.getElementById('preview-contract-kt').innerHTML);
    document.getElementById('chk-contract-gk').checked = false;
    document.getElementById('chk-contract-kt').checked = true;
    document.getElementById('chk-contract-nt').checked = false;

    // Show BBGH
    if (document.getElementById('preview-bbgh')) {
      document.getElementById('mini-preview-4').innerHTML = cleanHtml(document.getElementById('preview-bbgh').innerHTML);
    }
    document.getElementById('chk-bbnt').checked = true;
    if (labelBbnt) labelBbnt.textContent = 'BIÊN BẢN GIAO HÀNG';
  }

  // Appendix Preview
  const appPreview = document.getElementById('preview-appendix').cloneNode(true);
  if (State.contractType === 'kt') {
    const appTable = appPreview.querySelector('table:nth-of-type(1)');
    const ktTableTbody = document.getElementById('bind-products-kt');
    const ktTable = ktTableTbody ? ktTableTbody.closest('table').cloneNode(true) : null;
    if (appTable && ktTable) {
      appTable.parentNode.replaceChild(ktTable, appTable);
    }
    const appSub = appPreview.querySelector('#app-subtotal');
    if (appSub && appSub.parentNode) appSub.parentNode.style.display = 'none';
  }
  document.getElementById('mini-preview-3').innerHTML = cleanHtml(appPreview.innerHTML);
}

// File Export
document.getElementById('btn-export-pdf').addEventListener('click', () => {
  const chk1 = document.getElementById('chk-quote').checked;
  const chk2_gk = document.getElementById('chk-contract-gk') ? document.getElementById('chk-contract-gk').checked : false;
  const chk2_kt = document.getElementById('chk-contract-kt') ? document.getElementById('chk-contract-kt').checked : false;
  const chk2_nt = document.getElementById('chk-contract-nt') ? document.getElementById('chk-contract-nt').checked : false;
  const chk3 = document.getElementById('chk-appendix').checked;
  const chk4 = document.getElementById('chk-bbnt').checked;

  const docs = [];

  if (chk1) docs.push(cleanHtml(document.getElementById('preview-baogia').outerHTML));
  if (chk2_gk) docs.push(cleanHtml(document.getElementById('preview-contract-gk').outerHTML));
  if (chk2_kt) docs.push(cleanHtml(document.getElementById('preview-contract-kt').outerHTML));
  if (chk2_nt) docs.push(cleanHtml(document.getElementById('preview-contract-nt').outerHTML));

  if (chk3) {
    if (State.contractType === 'kt') {
      const appPreview = document.getElementById('preview-appendix').cloneNode(true);
      const appTable = appPreview.querySelector('table:nth-of-type(1)');
      const ktTableTbody = document.getElementById('bind-products-kt');
      const ktTable = ktTableTbody ? ktTableTbody.closest('table').cloneNode(true) : null;
      if (appTable && ktTable) appTable.parentNode.replaceChild(ktTable, appTable);
      const appSub = appPreview.querySelector('#app-subtotal');
      if (appSub && appSub.parentNode) appSub.parentNode.style.display = 'none'; docs.push(cleanHtml(appPreview.outerHTML));
    } else {
      docs.push(cleanHtml(document.getElementById('preview-appendix').outerHTML));
    }
  }

  if (chk4) {
    if (State.contractType === 'gk') docs.push(cleanHtml(document.getElementById('preview-bbnt').outerHTML));
    else docs.push(cleanHtml(document.getElementById('preview-bbgh').outerHTML));
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
  const chk2_nt = document.getElementById('chk-contract-nt') ? document.getElementById('chk-contract-nt').checked : false;
  const chk3 = document.getElementById('chk-appendix').checked;
  const chk4 = document.getElementById('chk-bbnt').checked;

  if (chk1) folder.file("01_BaoGia.doc", generateWordBlob(cleanHtml(document.getElementById('preview-baogia').outerHTML)));
  if (chk2_gk) folder.file("02_HopDongGiaoKhoan.doc", generateWordBlob(cleanHtml(document.getElementById('preview-contract-gk').outerHTML)));
  if (chk2_kt) folder.file("02_HopDongKinhTe.doc", generateWordBlob(cleanHtml(document.getElementById('preview-contract-kt').outerHTML)));
  if (chk2_nt) folder.file("02_HopDongNguyenTac.doc", generateWordBlob(cleanHtml(document.getElementById('preview-contract-nt').outerHTML)));

  if (chk3) {
    if (State.contractType === 'kt') {
      const appPreview = document.getElementById('preview-appendix').cloneNode(true);
      const appTable = appPreview.querySelector('table:nth-of-type(1)');
      const ktTableTbody = document.getElementById('bind-products-kt');
      const ktTable = ktTableTbody ? ktTableTbody.closest('table').cloneNode(true) : null;
      if (appTable && ktTable) appTable.parentNode.replaceChild(ktTable, appTable);
      const appSub = appPreview.querySelector('#app-subtotal');
      if (appSub && appSub.parentNode) appSub.parentNode.style.display = 'none'; folder.file("03_PhuLuc.doc", generateWordBlob(cleanHtml(appPreview.outerHTML)));
    } else {
      folder.file("03_PhuLuc.doc", generateWordBlob(cleanHtml(document.getElementById('preview-appendix').outerHTML)));
    }
  }

  if (chk4) {
    if (State.contractType === 'gk') {
      folder.file("04_BBNT.doc", generateWordBlob(cleanHtml(document.getElementById('preview-bbnt').outerHTML)));
    } else {
      folder.file("04_BBGH.doc", generateWordBlob(cleanHtml(document.getElementById('preview-bbgh').outerHTML)));
    }
  }


  zip.generateAsync({ type: "blob" }).then(function (content) {
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
  document.getElementById('kh_ngay').value = "2026-07-22";
  if (document.getElementById('so_baogia')) document.getElementById('so_baogia').value = "BG-2026-99";

  document.getElementById('dn_ten').value = "CÔNG TY TNHH KỸ THUẬT CÔNG NGHỆ THÀNH ĐẠT VN";
  if (document.getElementById('dn_ten_cn')) document.getElementById('dn_ten_cn').value = "成达科技工程有限公司";
  document.getElementById('dn_mst').value = "0316789012";
  document.getElementById('dn_diachi').value = "Số 10, Đường 3/2, Quận 10, TP HCM";
  if (document.getElementById('dn_diachi_cn')) document.getElementById('dn_diachi_cn').value = "胡志明市第十郡3/2路10号";
  document.getElementById('dn_stk').value = "VNĐ: 999988886666 tại MB Bank";
  document.getElementById('dn_daidien').value = "Nguyễn Thành Đạt";
  document.getElementById('dn_chucvu').value = "Giám Đốc";
  document.getElementById('dn_sdt').value = "0909123456";
  document.getElementById('dn_email').value = "thanhdat.tech@company.com";

  if (document.getElementById('so_hd')) document.getElementById('so_hd').value = "02/2026/HDGK";
  if (document.getElementById('ngay_ky')) document.getElementById('ngay_ky').value = "2026-07-22";
  document.getElementById('ten_ct').value = "Hệ thống làm mát nhà máy Demo Tech";
  document.getElementById('diadiem_ct').value = "KCN ABC, TP HCM";
  document.getElementById('tam_ung').value = "40";
  document.getElementById('so_ngay_tt').value = "10";
  if (document.getElementById('thoi_gian_giao')) document.getElementById('thoi_gian_giao').value = "30";
  if (document.getElementById('pt_thanh_toan')) document.getElementById('pt_thanh_toan').value = "Chuyển khoản (VNĐ)";

  if (document.getElementById('so_hd_kt')) document.getElementById('so_hd_kt').value = "02/2026/HDKT";
  if (document.getElementById('ngay_ky_kt')) document.getElementById('ngay_ky_kt').value = "2026-07-22";
  
  if (document.getElementById('so_pl')) document.getElementById('so_pl').value = "01/PLHD";
  if (document.getElementById('ngay_pl')) document.getElementById('ngay_pl').value = "2026-07-25";
  if (document.getElementById('so_bbgh')) document.getElementById('so_bbgh').value = "BBGH-002";

  State.tableMode = 'simple';
  State.products = [
    { stt: "I", ten: "Xây mới nhà vệ sinh nữ", dvt: "", sl: 0, gia: 0, giaVatTu: 0, giaNhanCong: 0 },
    { stt: "1", ten: "Xây tường bao dày 110m (xây 3 mặt)", dvt: "m2", sl: 19.8, gia: 430000, giaVatTu: 245000, giaNhanCong: 185000, ghiChu: "" },
    { stt: "2", ten: "Trát 2 mặt tường bao", dvt: "m2", sl: 39.6, gia: 170000, giaVatTu: 95000, giaNhanCong: 75000, ghiChu: "" },
    { stt: "3", ten: "Sơn tường ngoài", dvt: "m2", sl: 19.8, gia: 100000, giaVatTu: 65000, giaNhanCong: 35000, ghiChu: "" },
    { stt: "4", ten: "Nhân công lắp đặt cửa nhôm kính", dvt: "Bộ", sl: 1, gia: 650000, giaVatTu: 0, giaNhanCong: 650000, ghiChu: "Lắp đặt lại" }
  ];

  saveFormState();
  bindDataToPreviews();
  showToast("Đã điền dữ liệu mẫu thành công!", "success");
});

function exportHTMLToWord(htmlContent, filename) {
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

// File Upload Action Listeners
if (els.dnLogoFile) {
  els.dnLogoFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        State.company.logoData = evt.target.result;
        bindDataToPreviews();
      };
      reader.readAsDataURL(file);
    } else {
      State.company.logoData = '';
      bindDataToPreviews();
    }
  });
}

if (els.dnStampFile) {
  els.dnStampFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        State.company.stampData = evt.target.result;
        bindDataToPreviews();
      };
      reader.readAsDataURL(file);
    } else {
      State.company.stampData = '';
      bindDataToPreviews();
    }
  });
}

// Initial binding
bindDataToPreviews();

document.getElementById('btn-save-cloud').addEventListener('click', () => {
  const chk1 = document.getElementById('chk-quote').checked;
  const chk2_gk = document.getElementById('chk-contract-gk') ? document.getElementById('chk-contract-gk').checked : false;
  const chk2_kt = document.getElementById('chk-contract-kt') ? document.getElementById('chk-contract-kt').checked : false;
  const chk2_nt = document.getElementById('chk-contract-nt') ? document.getElementById('chk-contract-nt').checked : false;
  const chk3 = document.getElementById('chk-appendix').checked;
  const chk4 = document.getElementById('chk-bbnt').checked;

  const docs = [];

  if (chk1) docs.push(cleanHtml(document.getElementById('preview-baogia').outerHTML));
  if (chk2_gk) docs.push(cleanHtml(document.getElementById('preview-contract-gk').outerHTML));
  if (chk2_kt) docs.push(cleanHtml(document.getElementById('preview-contract-kt').outerHTML));
  if (chk2_nt) docs.push(cleanHtml(document.getElementById('preview-contract-nt').outerHTML));

  if (chk3) {
    if (State.contractType === 'kt') {
      const appPreview = document.getElementById('preview-appendix').cloneNode(true);
      const appTable = appPreview.querySelector('table:nth-of-type(1)');
      const ktTableTbody = document.getElementById('bind-products-kt');
      const ktTable = ktTableTbody ? ktTableTbody.closest('table').cloneNode(true) : null;
      if (appTable && ktTable) appTable.parentNode.replaceChild(ktTable, appTable);
      const appSub = appPreview.querySelector('#app-subtotal');
      if (appSub && appSub.parentNode) appSub.parentNode.style.display = 'none';
      docs.push(cleanHtml(appPreview.outerHTML));
    } else {
      docs.push(cleanHtml(document.getElementById('preview-appendix').outerHTML));
    }
  }

  if (chk4) {
    if (State.contractType === 'gk') docs.push(cleanHtml(document.getElementById('preview-bbnt').outerHTML));
    else docs.push(cleanHtml(document.getElementById('preview-bbgh').outerHTML));
  }

  if (docs.length === 0) {
    showToast("Vui lòng chọn ít nhất 1 văn bản để lưu.", "warning");
    return;
  }

  const btn = document.getElementById('btn-save-cloud');
  const originalText = btn.innerText;
  btn.disabled = true;
  btn.innerText = 'Đang lưu lên đám mây...';

  const htmlContent = docs.map(html => `<div class="page-break">${html}</div>`).join('');

  if (htmlContent.length > 900000) {
    showToast("Lỗi: Dữ liệu văn bản quá lớn (vượt quá 1MB giới hạn của Cloud). Vui lòng giảm bớt hình ảnh, hoặc không xuất cùng lúc 4 văn bản chứa ảnh.", "error", 6000);
    btn.disabled = false;
    btn.innerText = originalText;
    return;
  }

  const totalAmountStr = document.getElementById('bg-total-rounded') ? document.getElementById('bg-total-rounded').innerText : "0";

  // Document Number Validation logic
  const currNumbers = [
    State.client.soBaogia,
    State.contract.sohd,
    State.contract.sopl,
    State.contract.soBbgh
  ].map(s => s ? s.trim() : '').filter(s => s && s !== '...' && !/^(\.)+$/.test(s));

  const duplicates = currNumbers.filter(n => existingDocNumbers.has(n));
  if (duplicates.length > 0) {
    showToast(`KHÔNG THỂ LƯU!<br>Các số văn bản sau đã TỒN TẠI trên hệ thống:<br>• ${duplicates.join('<br>• ')}<br><br>Vui lòng kiểm tra, thay đổi số hiệu trước khi tiến hành lưu để tránh trùng lặp.`, "error", 7000);
    btn.disabled = false;
    btn.innerText = originalText;
    return;
  }

  try {
    const docData = {
      category: 'khach',
      ma_so: (State.client.soBaogia ? State.client.soBaogia + ' | ' : '') + (State.contract.sohd || ""),
      document_numbers: currNumbers,
      ten_cong_ty: State.client.ten || "",
      tong_tien: totalAmountStr,
      ngay_ky: State.contract.ngay || "",
      html_content: htmlContent,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Quá thời gian kết nối (30s). Xin kiểm tra mạng hoặc Firebase Database có hoạt động không.")), 30000);
    });

    Promise.race([
      firebase.firestore().collection('contracts_cloud').add(docData),
      timeoutPromise
    ])
      .then(() => {
        showToast("Lưu tài liệu thành công lên hệ thống Cloud!", "success");
        // Thêm vào cache các số hệ thống để chặn lưu trùng trong cùng một section
        currNumbers.forEach(n => existingDocNumbers.add(n));
      })
      .catch((error) => {
        console.error(error);
        showToast("Lỗi khi lưu: " + error.message, "error");
      })
      .finally(() => {
        btn.disabled = false;
        btn.innerText = originalText;
      });
  } catch (err) {
    console.error(err);
    showToast("Lỗi xử lý cục bộ: " + err.message, "error");
    btn.disabled = false;
    btn.innerText = originalText;
  }
});


// ==========================================
// FIREBASE AUTHENTICATION LOGIC
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  const authOverlay = document.getElementById('auth-overlay');
  const mainApp = document.getElementById('main-app');
  const btnLogin = document.getElementById('btn-login');
  const btnLogout = document.getElementById('btn-logout');
  const emailInput = document.getElementById('login-email');
  const passInput = document.getElementById('login-pass');
  const errorMsg = document.getElementById('login-error');

  if (auth) {
    // Listen to Auth State
    auth.onAuthStateChanged((user) => {
      if (user) {
        // Logged in
        authOverlay.style.display = 'none';
        mainApp.style.display = 'block';
        fetchExistingDocNumbers(); // Fetch numbers cache 
      } else {
        // Logged out
        authOverlay.style.display = 'flex';
        mainApp.style.display = 'none';
      }
    });

    // Login Action
    if (btnLogin) {
      btnLogin.addEventListener('click', () => {
        const email = emailInput.value.trim();
        const pass = passInput.value;
        errorMsg.style.display = 'none';
        btnLogin.innerText = 'Đang xử lý...';

        auth.signInWithEmailAndPassword(email, pass)
          .then((userCredential) => {
            btnLogin.innerText = 'ĐĂNG NHẬP';
          })
          .catch((error) => {
            btnLogin.innerText = 'ĐĂNG NHẬP';
            errorMsg.innerText = error.message;
            errorMsg.style.display = 'block';
            console.error(error);
          });
      });
    }

    // Logout Action
    if (btnLogout) {
      btnLogout.addEventListener('click', () => {
        auth.signOut().then(() => {
          // Sign-out successful.
          emailInput.value = '';
          passInput.value = '';
        }).catch((error) => {
          console.error(error);
        });
      });
    }
  }
});

