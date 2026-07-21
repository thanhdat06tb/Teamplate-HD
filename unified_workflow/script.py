import re
import os

with open(r'd:\Template_HopDong\unified_workflow\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Add tailwind scripts and fonts
head_addition = '''
  <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
  <script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "primary": "#005dac",
                        "surface": "#f9f9ff",
                        "surface-container": "#ecedf6",
                        "surface-container-low": "#f2f3fc",
                        "surface-container-lowest": "#ffffff",
                        "on-surface": "#181c21",
                        "on-surface-variant": "#414752",
                        "outline-variant": "#c1c6d4",
                        "primary-container": "#1976d2",
                        "secondary-container": "#d2e6ef",
                        "on-secondary-container": "#55676f",
                        "secondary-fixed": "#d2e6ef",
                        "on-secondary-fixed": "#0b1e24"
                    }
                }
            }
        }
  </script>
'''
content = content.replace('</head>', head_addition + '</head>')

# Modify Body tag and add layout
sidebar_layout = '''
<body class="bg-[#f9f9ff] text-[#181c21]">
    <div id="print-zone"></div>
    <div id="auth-overlay">
      <div class="login-box">
        <h2>HỆ THỐNG NỘI BỘ</h2>
        <input type="email" id="login-email" placeholder="Email nhân viên" />
        <input type="password" id="login-pass" placeholder="Mật khẩu" />
        <button id="btn-login">ĐĂNG NHẬP</button>
        <div id="login-error">Sai thông tin đăng nhập!</div>
      </div>
    </div>
    
<div class="flex min-h-screen" id="main-app">
<!-- SideNavBar -->
<aside class="fixed left-0 top-0 h-screen w-[280px] bg-[#ecedf6] flex flex-col p-4 gap-2 z-50 print:hidden">
<div class="mb-10 px-2">
<h1 class="text-2xl font-bold text-[#005dac]">ContractCore</h1>
<p class="text-sm text-[#414752] opacity-70">Hệ thống Đồng bộ</p>
</div>
<nav class="flex-1 space-y-1">
<a class="flex items-center gap-4 px-4 py-2 text-[#414752] hover:bg-[#e0e2ea] transition-all rounded-lg group" href="../index.html">
<span class="material-symbols-outlined">dashboard</span>
<span class="font-medium text-sm">Trang Chủ</span>
</a>
<a class="flex items-center gap-4 px-4 py-2 bg-[#d2e6ef] text-[#55676f] rounded-lg font-bold transition-all group" href="#">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">assignment</span>
<span class="font-medium text-sm">Hợp đồng & Báo giá</span>
</a>
</nav>
<div class="mt-auto space-y-1 pt-4 border-t border-[#c1c6d4]">
<button id="btn-logout" class="flex items-center gap-4 px-4 py-2 text-[#414752] hover:bg-[#e0e2ea] transition-all rounded-lg w-full">
<span class="material-symbols-outlined">logout</span>
<span class="font-medium text-sm">Đăng xuất</span>
</button>
</div>
</aside>

<!-- Main Content Area -->
<main class="ml-[280px] flex-1 min-h-screen flex flex-col relative print:ml-0">
<!-- TopAppBar -->
<header class="h-16 flex justify-between items-center px-8 bg-[#f9f9ff] border-b border-[#c1c6d4] shadow-sm sticky top-0 z-40 print:hidden">
<div class="flex items-center gap-4">
<span class="text-xl font-bold text-[#005dac]">Đơn Hợp đồng Đồng bộ</span>
</div>
<div class="flex items-center gap-6">
<div class="flex items-center gap-4">
<div class="h-8 w-8 rounded-full overflow-hidden bg-[#e0e2ea] ml-2">
</div>
</div>
</div>
</header>
'''
# replacing layout
content = re.sub(r'<body.*?>.*?<div id="main-app">', sidebar_layout, content, flags=re.DOTALL)

# remove old masthead
content = re.sub(r'<div class="masthead">.*?</div>', '', content, flags=re.DOTALL)

# re-close tags
content = content.replace('</body>', '</main>\n</div></body>')

# update styles to tailwind-ish
old_stepper = '''background: rgba(26, 39, 68, 0.2); backdrop-filter: blur(8px);
      border-bottom: 1px solid var(--line);
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);'''
new_stepper = '''background: #ffffff;
      border-bottom: 1px solid #c1c6d4;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);'''
content = content.replace(old_stepper, new_stepper)      

content = content.replace('background: rgba(26, 39, 68, 0.4); backdrop-filter: blur(16px);', 'background: #ffffff; border-color: #c1c6d4;')
content = content.replace('border: 1px solid rgba(255, 255, 255, 0.05);', 'border: 1px solid #c1c6d4;')
content = content.replace('box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);', 'box-shadow: 0 1px 3px rgba(0,0,0,0.1);')
content = content.replace('color: var(--brass);', 'color: #005dac;')

content = content.replace('background: rgba(0,0,0,0.2); color: white;', 'background: #ffffff; color: #181c21; border-color: #c1c6d4; border-width: 1px;')
content = content.replace('background: rgba(0,0,0,0.4);', 'background: #ffffff; border-color: #1976d2;')
content = content.replace('color: var(--slate);', 'color: #414752;')
content = content.replace('background: linear-gradient(135deg, #0B1120 0%, #111827 100%);', 'background: #f9f9ff;')

content = content.replace('color: #F8FAFC;', 'color: #181c21;') # body text color 
content = content.replace('color: #F7F5EF;', 'color: #181c21;')


with open(r'd:\Template_HopDong\unified_workflow\index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("done")
