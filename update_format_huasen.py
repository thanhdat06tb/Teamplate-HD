import re
import os

html_path = r'd:\Template_HopDong\unified_workflow\index.html'

with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

new_baogia = """      <div class="doc-preview" id="preview-baogia" style="margin-top: 40px; font-family: 'Times New Roman', serif;">
        <table style="width:100%; border:none; margin-bottom: 15px;">
          <tr>
            <td style="width:20%; border:none; vertical-align:middle; text-align:center;">
              <!-- LOGO -->
              <div style="width:100px; height:100px; border:1px solid #ccc; display:flex; align-items:center; justify-content:center; border-radius:50%; margin:0 auto; font-weight:bold; color:#ccc;">LOGO</div>
            </td>
            <td style="width:80%; text-align:center; border:none; vertical-align:top;">
              <h2 style="margin:0; font-size: 19px; font-weight: bold; font-family: 'Times New Roman', serif;">CÔNG TY TNHH QUỐC TẾ THƯƠNG MẠI HUA SEN VIỆT NAM</h2>
              <h3 style="margin:0; font-size: 17px; font-weight: bold; font-family: 'Times New Roman', serif;">越南华森国际商贸有限公司</h3>
              <div style="border-bottom: 2px solid #228B22; margin: 10px 0;"></div>
              <p style="margin:4px 0; font-size: 15px; font-family: 'Times New Roman', serif;"><strong>Địa chỉ:</strong> <span class="bind-dn-diachi">...</span></p>
              <p style="margin:4px 0; font-size: 15px; font-family: 'Times New Roman', serif;">地址: 越南，胡志明市，安富坊，胡志明市安富坊省道743号1B街区24组2/1号</p>
              <p style="margin:4px 0; font-size: 15px; font-family: 'Times New Roman', serif;"><strong>Mã số thuế/税号:</strong> <span class="bind-dn-mst">...</span> &nbsp;&nbsp;&nbsp; <strong>Tel/电话:</strong> <span class="bind-dn-sdt">...</span> &nbsp;&nbsp;&nbsp; <strong>Email/邮件:</strong> <span class="bind-dn-email">...</span></p>
              <p style="margin:4px 0; font-size: 15px; text-align: left; font-family: 'Times New Roman', serif;">Tên tài khoản: VN Hua Sen CO.,LTD</p>
              <p style="margin:4px 0; font-size: 15px; text-align: left; font-family: 'Times New Roman', serif;">Số tài khoản VNĐ (Bank account)越南银行账号: 3703486766</p>
              <p style="margin:4px 0; font-size: 15px; text-align: left; font-family: 'Times New Roman', serif;">Số tài khoản USD (Bank account)美金账号: 0584723984634</p>
            </td>
          </tr>
        </table>
        
        <div class="doc-title" style="margin-top:20px; margin-bottom: 30px; font-size:26px; font-family: 'Times New Roman', serif; text-align: center;"><strong>BẢNG BÁO GIÁ报价单</strong></div>
        
        <div style="font-size:16px; font-family: 'Times New Roman', serif; margin-bottom:20px;">
            <div style="display:flex; margin-bottom:12px; align-items:flex-end;">
                <div style="font-weight:bold; white-space:nowrap; margin-right:5px;">Kính gửi/客户:</div>
                <div style="flex:1; border-bottom:1px dotted #000; padding:0 5px;" class="bind-kh-ten">...</div>
            </div>
            
            <div style="display:flex; margin-bottom:12px; align-items:flex-end; gap: 20px;">
                <div style="display:flex; flex:1; align-items:flex-end;">
                    <div style="font-weight:bold; white-space:nowrap; margin-right:5px;">Mã số thuế/税号:</div>
                    <div style="flex:1; border-bottom:1px dotted #000; padding:0 5px;" class="bind-kh-mst">...</div>
                </div>
                <div style="display:flex; flex:1; align-items:flex-end;">
                    <div style="font-weight:bold; white-space:nowrap; margin-right:5px;">Ngày/日期:</div>
                    <div style="flex:1; border-bottom:1px dotted #000; padding:0 5px; text-align:center;">
                         ....... 年 ....... 月 ....... 日
                    </div>
                </div>
            </div>

            <div style="display:flex; margin-bottom:12px; align-items:flex-end;">
                <div style="font-weight:bold; white-space:nowrap; margin-right:5px;">Địa chỉ/地址:</div>
                <div style="flex:1; border-bottom:1px dotted #000; padding:0 5px;" class="bind-kh-diachi">...</div>
            </div>
            
            <div style="display:flex; margin-bottom:12px; align-items:flex-end; gap:20px;">
                <div style="display:flex; flex:1; align-items:flex-end;">
                    <div style="font-weight:bold; white-space:nowrap; margin-right:5px;">Người liên lạc/联系人:</div>
                    <div style="flex:1; border-bottom:1px dotted #000; padding:0 5px;" class="bind-kh-daidien">...</div>
                </div>
                <div style="display:flex; flex:1; align-items:flex-end;">
                    <div style="font-weight:bold; white-space:nowrap; margin-right:5px;">Số điện thoại/电话:</div>
                    <div style="flex:1; border-bottom:1px dotted #000; padding:0 5px;" class="bind-kh-sdt">...</div>
                </div>
            </div>
        </div>
        
        <table style="width:100%; border:1px solid #000; border-collapse:collapse; margin-top:15px; font-size:15px; font-family: 'Times New Roman', serif;">
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
        
        <div style="margin-top:30px; text-align:left; font-family: 'Times New Roman', serif;">
           <p style="margin-top:10px; font-weight:bold; font-size:15px; font-style:italic;">GHI CHÚ: Báo giá trên chưa bao gồm phí lắp đặt và đã bao gồm phí vận chuyển.</p>
           <p style="font-size:15px; font-weight:bold; font-family:'SimSun', 'Times New Roman', serif; font-style:italic;">注意：以上报价不含安装费和运费。</p>
        </div>
        
        <table style="width:100%; border:none; margin-top:50px; text-align:center; font-family: 'Times New Roman', serif;">
          <tr>
            <td style="width:50%; border:none;"></td>
            <td style="width:50%; border:none;">
              <p style="margin-bottom: 10px; font-weight:bold; font-size:16px;">CÔNG TY TNHH QUỐC TẾ THƯƠNG MẠI HUA SEN VIỆT NAM</p>
              <p style="margin-bottom: 20px; font-weight:bold; font-size:15px; font-family: 'SimSun', 'Times New Roman', serif;">越南华森国际商贸有限公司</p>
            </td>
          </tr>
          <tr>
            <td style="height: 100px; border:none;"></td>
            <td style="height: 100px; border:none; position:relative;">
                <!-- Để trống cho đóng dấu thủ công -->
            </td>
          </tr>
          <tr>
            <td style="font-weight:bold; text-transform:uppercase; border:none;"></td>
            <td style="font-weight:bold; text-transform:uppercase; border:none; color:#000;">
               
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
    print("Updated index.html formatting (Times New Roman, dotted layout, no manual stamp)")
else:
    print("Could not find preview-baogia block")
