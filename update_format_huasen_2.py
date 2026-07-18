import re
import os

html_path = r'd:\Template_HopDong\unified_workflow\index.html'

with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

new_header = """        <table style="width:100%; border:none; margin-bottom: 15px;">
          <tr>
            <td style="width:20%; border:none; vertical-align:top; text-align:left; padding-top: 5px;">
              <!-- LOGO -->
              <div style="width:100px; height:100px; border:1px solid #ccc; display:flex; align-items:center; justify-content:center; border-radius:50%; font-weight:bold; color:#ccc;">LOGO</div>
            </td>
            <td style="width:80%; text-align:center; border:none; vertical-align:top;">
              <h2 style="margin:0; font-size: 19px; font-weight: bold; font-family: 'Times New Roman', serif;">CÔNG TY TNHH QUỐC TẾ THƯƠNG MẠI HUA SEN VIỆT NAM</h2>
              <h3 style="margin:0; font-size: 17px; font-weight: bold; font-family: 'Times New Roman', serif;">越南华森国际商贸有限公司</h3>
              <div style="border-bottom: 2px solid #228B22; margin: 10px 0;"></div>
              <p style="margin:4px 0; font-size: 15px; font-family: 'Times New Roman', serif;"><strong>Địa chỉ:</strong> <span class="bind-dn-diachi">...</span></p>
              <p style="margin:4px 0; font-size: 15px; font-family: 'Times New Roman', serif;">地址: 越南，胡志明市，安富坊，胡志明市安富坊省道743号1B街区24组2/1号</p>
              <p style="margin:4px 0; font-size: 15px; font-family: 'Times New Roman', serif;"><strong>Mã số thuế/税号:</strong> <span class="bind-dn-mst">...</span> &nbsp;&nbsp;&nbsp; <strong>Tel/电话:</strong> <span class="bind-dn-sdt">...</span> &nbsp;&nbsp;&nbsp; <strong>Email/邮件:</strong> <span class="bind-dn-email">...</span></p>
              <div style="text-align: left; margin-top: 10px; margin-left: 30px;">
                  <p style="margin:4px 0; font-size: 15px; font-family: 'Times New Roman', serif;">Tên tài khoản: VN Hua Sen CO.,LTD</p>
                  <p style="margin:4px 0; font-size: 15px; font-family: 'Times New Roman', serif;">Số tài khoản VNĐ (Bank account)越南银行账号: 3703486766</p>
                  <p style="margin:4px 0; font-size: 15px; font-family: 'Times New Roman', serif;">Số tài khoản USD (Bank account)美金账号: 0584723984634</p>
              </div>
            </td>
          </tr>
        </table>"""

# Find the table block in index.html and replace it
start_idx = html.find('<table style="width:100%; border:none; margin-bottom: 15px;">')
if start_idx != -1:
    end_idx = html.find('</table>', start_idx) + len('</table>')
    html = html[:start_idx] + new_header + html[end_idx:]
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html)
    print("Updated index.html header layout")
else:
    print("Could not find table block")
