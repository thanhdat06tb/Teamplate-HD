import re
import os

html_path = r'd:\Template_HopDong\unified_workflow\index.html'
js_path = r'd:\Template_HopDong\unified_workflow\app.js'

with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Update inputs
html = html.replace('value="Công ty TNHH Dịch vụ & Kỹ thuật ND-QMIT"', 'value="CÔNG TY TNHH QUỐC TẾ THƯƠNG MẠI HUA SEN VIỆT NAM"')
html = html.replace('value="3502500000"', 'value="3703486766"')
html = html.replace('value="Số 10, KCN Đông Xuyên, TP. Vũng Tàu"', 'value="Số 2/1 Tổ 24, Khu Phố 1B, đường tỉnh 743, Phường An Phú, Thành phố Hồ Chí Minh, Việt Nam"')
html = html.replace('value="0071001234567 tại Vietcombank Vũng Tàu"', 'value="VNĐ: 3703486766 | USD: 0584723984634 - VN Hua Sen CO.,LTD"')
html = html.replace('value="Nguyễn Văn Hùng"', 'value="LIN. ZHIHUA"')
html = html.replace('value="Giám đốc"', 'value=""')
html = html.replace('value="0988123456"', 'value="0921115868"')
html = html.replace('value="contact@nd-qmit.com"', 'value="huasen2026@gmail.com"')

# Replace preview-baogia
new_baogia = """      <div class="doc-preview" id="preview-baogia" style="margin-top: 40px;">
        <table style="width:100%; border:none; margin-bottom: 20px;">
          <tr>
            <td style="width:20%; border:none; vertical-align:top; text-align:center;">
              <div style="border:2px solid #1a365d; display:inline-block; border-radius:50%; width:80px; height:80px; line-height:80px; font-weight:bold; font-size:24px; color:#1a365d; position:relative; overflow:hidden;">
                <div style="position:absolute; width:100%; height:100%; top:0; left:0; background:linear-gradient(135deg, rgba(255,200,0,0.2) 0%, rgba(255,255,255,0) 50%, rgba(26,54,93,0.1) 100%);"></div>
                HS
              </div>
            </td>
            <td style="width:80%; text-align:center; border:none; vertical-align:top;">
              <h2 style="margin:0; font-size: 18px; font-weight: bold; text-transform: uppercase;"><span class="bind-dn-ten">...</span></h2>
              <h3 style="margin:0; font-size: 16px; font-weight: bold;">越南华森国际商贸有限公司</h3>
              <div style="border-bottom: 1px solid #228B22; margin: 10px 0;"></div>
              <p style="margin:5px 0; font-size: 14px;"><strong>Địa chỉ:</strong> <span class="bind-dn-diachi">...</span></p>
              <p style="margin:5px 0; font-size: 14px;">地址: 越南，胡志明市，安富坊，胡志明市安富坊省道743号1B街区24组2/1号</p>
              <p style="margin:5px 0; font-size: 14px;"><strong>Mã số thuế/税号:</strong> <span class="bind-dn-mst">...</span> &nbsp;&nbsp;&nbsp; <strong>Tel/电话:</strong> <span class="bind-dn-sdt">...</span> &nbsp;&nbsp;&nbsp; <strong>Email/邮件:</strong> <span class="bind-dn-email">...</span></p>
              <p style="margin:5px 0; font-size: 14px; text-align: left;">Tên tài khoản: VN Hua Sen CO.,LTD</p>
              <p style="margin:5px 0; font-size: 14px; text-align: left;">Số tài khoản VNĐ (Bank account)越南银行账号: 3703486766</p>
              <p style="margin:5px 0; font-size: 14px; text-align: left;">Số tài khoản USD (Bank account)美金账号: 0584723984634</p>
            </td>
          </tr>
        </table>
        
        <div class="doc-title" style="margin-top:20px; font-size:24px; text-transform: uppercase;">BẢNG BÁO GIÁ报价单</div>
        
        <table style="width:100%; border:none; margin-top:20px; text-align:left; font-size:15px; margin-bottom: 20px;">
            <tr>
                <td style="border:none; width: 50%; padding-bottom:8px;"><strong>Kính gửi/客户:</strong> <span class="bind-kh-ten">...</span></td>
                <td style="border:none; padding-bottom:8px;"></td>
            </tr>
            <tr>
                <td style="border:none; padding-bottom:8px;"><strong>Mã số thuế/税号:</strong> <span class="bind-kh-mst">...</span></td>
                <td style="border:none; padding-bottom:8px;"><strong>Ngày/日期:</strong> ........ 年 ........ 月 ........ 日</td>
            </tr>
            <tr>
                <td style="border:none; padding-bottom:8px;" colspan="2"><strong>Địa chỉ/地址:</strong> <span class="bind-kh-diachi">...</span></td>
            </tr>
            <tr>
                <td style="border:none; padding-bottom:8px;"><strong>Người liên lạc/联系人:</strong> <span class="bind-kh-daidien">...</span></td>
                <td style="border:none; padding-bottom:8px;"><strong>Số điện thoại/电话:</strong> <span class="bind-kh-sdt">...</span></td>
            </tr>
        </table>
        
        <table style="width:100%; border:1px solid #000; border-collapse:collapse; margin-top:15px; font-size:14px;">
           <thead>
             <tr>
               <th style="border:1px solid #000; color:#000; background:rgba(0,0,0,0.05); text-align:center; padding:8px;">STT</th>
               <th style="border:1px solid #000; color:#000; background:rgba(0,0,0,0.05); text-align:center; padding:8px;">Tên sản phẩm<br>品名 & 规格</th>
               <th style="border:1px solid #000; color:#000; background:rgba(0,0,0,0.05); text-align:center; padding:8px;">Số lượng<br>数量</th>
               <th style="border:1px solid #000; color:#000; background:rgba(0,0,0,0.05); text-align:center; padding:8px;">Đơn vị<br>单位</th>
               <th style="border:1px solid #000; color:#000; background:rgba(0,0,0,0.05); text-align:center; padding:8px;">Hình ảnh<br>产品照片</th>
               <th style="border:1px solid #000; color:#000; background:rgba(0,0,0,0.05); text-align:center; padding:8px;">Đơn giá (VNĐ)<br>单价(VNĐ)</th>
               <th style="border:1px solid #000; color:#000; background:rgba(0,0,0,0.05); text-align:center; padding:8px;">Thành Tiền (VNĐ)<br>金额(VNĐ)</th>
               <th style="border:1px solid #000; color:#000; background:rgba(0,0,0,0.05); text-align:center; padding:8px;">Ghi chú<br>备注</th>
             </tr>
           </thead>
           <tbody id="bg-product-table"></tbody>
           <tbody>
             <tr>
               <td colspan="6" style="border:1px solid #000; text-align:center; font-weight:bold; padding:8px;">Tổng tiền chưa bao gồm thuế 总金额不含税</td>
               <td style="border:1px solid #000; text-align:right; font-weight:bold; padding:8px;" id="bg-subtotal">0</td>
               <td style="border:1px solid #000;"></td>
             </tr>
             <tr>
               <td colspan="6" style="border:1px solid #000; text-align:center; font-weight:bold; padding:8px;">Tiền thuế <span class="bind-vat-rate">8</span>% 税<span class="bind-vat-rate">8</span>%</td>
               <td style="border:1px solid #000; text-align:right; font-weight:bold; padding:8px;" id="bg-vat-amount">0</td>
               <td style="border:1px solid #000;"></td>
             </tr>
             <tr>
               <td colspan="6" style="border:1px solid #000; text-align:center; font-weight:bold; padding:8px;">Tổng thanh toán 总金额</td>
               <td style="border:1px solid #000; text-align:right; font-weight:bold; padding:8px; background:rgba(156,122,60,0.1);" id="bg-total-rounded">0</td>
               <td style="border:1px solid #000;"></td>
             </tr>
           </tbody>
        </table>
        
        <div style="margin-top:30px; text-align:left;">
           <p style="margin-top:10px; font-weight:bold; font-size:14px;">GHI CHÚ: Báo giá trên chưa bao gồm phí lắp đặt và đã bao gồm phí vận chuyển.</p>
           <p style="font-size:14px; font-weight:bold; font-family:'SimSun', 'Microsoft YaHei', sans-serif;">注意：以上报价不含安装费和运费。</p>
        </div>
        
        <table style="width:100%; border:none; margin-top:40px; text-align:center;">
          <tr>
            <td style="width:50%; border:none;"></td>
            <td style="width:50%; border:none;">
              <p style="margin-bottom: 10px; font-weight:bold; font-size:15px;">CÔNG TY TNHH QUỐC TẾ THƯƠNG MẠI HUA SEN VIỆT NAM</p>
              <p style="margin-bottom: 20px; font-weight:bold; font-size:14px;">越南华森国际商贸有限公司</p>
            </td>
          </tr>
          <tr>
            <td style="height: 100px; border:none;"></td>
            <td style="height: 100px; border:none; position:relative;">
                <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); border: 3px solid #cc0000; color:#cc0000; border-radius:50%; width:120px; height:120px; display:flex; align-items:center; justify-content:center; text-align:center; font-size:10px; font-weight:bold; opacity:0.7; transform:translate(-50%, -50%) rotate(-15deg);">CÔNG TY<br>TNHH<br>QUỐC TẾ THƯƠNG MẠI<br>HUA SEN<br>VIỆT NAM</div>
                <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); font-family:'Brush Script MT', cursive; font-size:36px; color:#0000cc; font-weight:bold;">林 志 华</div>
            </td>
          </tr>
          <tr>
            <td style="font-weight:bold; text-transform:uppercase; border:none;"></td>
            <td style="font-weight:bold; text-transform:uppercase; border:none; color:#cc0000;">
               LIN. ZHIHUA
            </td>
          </tr>
        </table>
      </div>"""

start_idx = html.find('      <div class="doc-preview" id="preview-baogia"')
end_idx = html.find('    <!-- STEP 2: CONTRACT -->', start_idx)
if start_idx != -1 and end_idx != -1:
    html = html[:start_idx] + new_baogia + "\n\n" + html[end_idx:]
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html)
    print("Updated index.html")
else:
    print("Could not find preview-baogia block")

# App.js updates
with open(js_path, 'r', encoding='utf-8') as f:
    js = f.read()
    
# default state
js = js.replace("company: { ten: 'Công ty TNHH Dịch vụ & Kỹ thuật ND-QMIT', mst: '3502500000', diachi: 'Số 10, KCN Đông Xuyên, TP. Vũng Tàu', stk: '0071001234567 tại Vietcombank Vũng Tàu', daidien: 'Nguyễn Văn Hùng', chucvu: 'Giám đốc', sdt: '0988123456', email: 'contact@nd-qmit.com' }", 
                "company: { ten: 'CÔNG TY TNHH QUỐC TẾ THƯƠNG MẠI HUA SEN VIỆT NAM', mst: '3703486766', diachi: 'Số 2/1 Tổ 24, Khu Phố 1B, đường tỉnh 743, Phường An Phú, Thành phố Hồ Chí Minh, Việt Nam', stk: 'VNĐ: 3703486766 | USD: 0584723984634 - VN Hua Sen CO.,LTD', daidien: 'LIN. ZHIHUA', chucvu: '', sdt: '0921115868', email: 'huasen2026@gmail.com' }")

# hBg template
old_hBg = """      // Step 2 Bao Gia Rows
      hBg += `<tr style="${styleBold}">
        <td style="border:1px solid #000; padding:5px; text-align:center;">${p.stt || ''}</td>
        <td style="border:1px solid #000; padding:5px;">${p.ten || ''}</td>
        <td style="border:1px solid #000; padding:5px; text-align:center;">${p.dvt || ''}</td>
        <td style="border:1px solid #000; padding:5px; text-align:center;">${dispSl}</td>
        <td class="col-simple" style="border:1px solid #000; padding:5px; text-align:right;">${(gSimple || isCat) ? fmtVND(gSimple) : ''}</td>
        <td class="col-complex" style="border:1px solid #000; padding:5px; text-align:right;">${(gVatTu || isCat) && !isCat ? fmtVND(gVatTu) : ''}</td>
        <td class="col-complex" style="border:1px solid #000; padding:5px; text-align:right;">${(gNhanCong || isCat) && !isCat ? fmtVND(gNhanCong) : ''}</td>
        <td class="col-complex" style="border:1px solid #000; padding:5px; text-align:right;">${!isCat && p.sl ? fmtVND((p.sl||0)*gVatTu) : ''}</td>
        <td class="col-complex" style="border:1px solid #000; padding:5px; text-align:right;">${!isCat && p.sl ? fmtVND((p.sl||0)*gNhanCong) : ''}</td>
        <td class="col-simple" style="border:1px solid #000; padding:5px; text-align:right;">${displayTt ? fmtVND(displayTt) : ''}</td>
        <td class="col-complex" style="border:1px solid #000; padding:5px; text-align:right;">${displayTt ? fmtVND(displayTt) : ''}</td>
        <td class="col-complex" style="border:1px solid #000; padding:5px;">${p.ghiChu || ''}</td>
      </tr>`;"""

new_hBg = """      // Step 2 Bao Gia Rows
      hBg += `<tr style="${styleBold}">
        <td style="border:1px solid #000; padding:8px; text-align:center;">${p.stt || ''}</td>
        <td style="border:1px solid #000; padding:8px;">${p.ten || ''}</td>
        <td style="border:1px solid #000; padding:8px; text-align:center;">${dispSl}</td>
        <td style="border:1px solid #000; padding:8px; text-align:center;">${p.dvt || ''}</td>
        <td style="border:1px solid #000; padding:8px; text-align:center;"></td>
        <td style="border:1px solid #000; padding:8px; text-align:right;">${(tGia || isCat) && !isCat ? fmtVND(tGia) : ''}</td>
        <td style="border:1px solid #000; padding:8px; text-align:right;">${displayTt ? fmtVND(displayTt) : ''}</td>
        <td style="border:1px solid #000; padding:8px;">${p.ghiChu || ''}</td>
      </tr>`;"""

if old_hBg in js:
    js = js.replace(old_hBg, new_hBg)
    with open(js_path, 'w', encoding='utf-8') as f:
        f.write(js)
    print("Updated app.js")
else:
    print("Could not find hBg template in app.js. Trying line by line match.")
