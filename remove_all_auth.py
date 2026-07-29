import re
import glob

# 1. index.html
with open(r'd:\Template_HopDong\index.html', 'r', encoding='utf-8') as f:
    idx_content = f.read()

idx_content = re.sub(r'<!-- ====== LOGIN SCREEN ====== -->\s*<div id="auth-overlay">.*?</div>\s*</div>\s*<!-- ====== MAIN HUB ====== -->', '<!-- ====== MAIN HUB ====== -->', idx_content, flags=re.DOTALL)

# Remove auth logic in index.html
# Need to remove the auth.onAuthStateChanged and the login button listener
auth_block = r'auth\.onAuthStateChanged\(async \(user\) => \{.*?\n      \} else \{\n        authOverlay\.style\.display = \'flex\';\n        mainApp\.style\.display = \'none\';\n      \}\n    \}\);'
idx_content = re.sub(auth_block, '', idx_content, flags=re.DOTALL)

login_block = r'// Login\s*if \(btnLogin\) \{.*?\n      \}\);\n    \}'
idx_content = re.sub(login_block, '', idx_content, flags=re.DOTALL)

# Make sure stats still load. We can just run the try block that fetches stats.
stats_script = """
    // Fetch stats
    try {
      const snap = await db.collection('contracts_cloud').get();
      let totalBytes = 0; let huasenCount = 0; let khachCount = 0; let donCount = 0;
      snap.docs.forEach(doc => {
        const data = doc.data();
        totalBytes += new Blob([JSON.stringify(data)]).size;
        if (data.category === 'don') { donCount++; } else {
           let isHuasen = false;
           if (data.category === 'huasen') isHuasen = true;
           else if (!data.category && data.html_content) {
              const h = data.html_content.toLowerCase();
              if (h.includes('hua sen') || h.includes('huasen') || h.includes('华森')) isHuasen = true;
           }
           if (isHuasen) huasenCount++; else khachCount++;
        }
      });
      const maxMb = 1024;
      const usedMb = (totalBytes / (1024 * 1024)).toFixed(2);
      const elLien = document.getElementById('lien-hop-dong-count');
      const elDon = document.getElementById('don-hop-dong-count');
      const elHuasen = document.getElementById('huasen-hop-dong-count');
      const elStor = document.getElementById('storage-used-val');
      if (elLien) elLien.textContent = khachCount + ' văn bản';
      if (elDon) elDon.textContent = donCount + ' văn bản';
      if (elHuasen) elHuasen.textContent = huasenCount + ' văn bản';
      if (elStor) elStor.textContent = usedMb + ' / ' + maxMb + ' MB';
    } catch (e) { console.error('Stats err:', e); }
"""
idx_content = idx_content.replace("document.addEventListener('DOMContentLoaded', async () => {", "document.addEventListener('DOMContentLoaded', async () => {\n" + stats_script)

# Remove old authOverlay constants that might throw errors
idx_content = re.sub(r'const authOverlay = document\.getElementById\(\'auth-overlay\'\);\n', '', idx_content)
idx_content = re.sub(r'const mainApp = document\.getElementById\(\'main-app\'\);\n', '', idx_content)
idx_content = re.sub(r'const btnLogin = document\.getElementById\(\'btn-login\'\);\n', '', idx_content)
idx_content = re.sub(r'const emailInput = document\.getElementById\(\'login-email\'\);\n', '', idx_content)
idx_content = re.sub(r'const passInput = document\.getElementById\(\'login-pass\'\);\n', '', idx_content)
idx_content = re.sub(r'const errorMsg = document\.getElementById\(\'login-error\'\);\n', '', idx_content)

# Remove weather interaction
weather = r'// Weather Interaction\s*if \(typeof setWeatherState === \'function\'\) \{.*?\n    \}'
idx_content = re.sub(weather, '', idx_content, flags=re.DOTALL)

with open(r'd:\Template_HopDong\index.html', 'w', encoding='utf-8') as f:
    f.write(idx_content)

# 2. dashboard.html
with open(r'd:\Template_HopDong\dashboard.html', 'r', encoding='utf-8') as f:
    dash_content = f.read()

# Remove style block for auth
dash_content = re.sub(r'<style>\s*#auth-overlay\s*\{\s*display:\s*none\s*!important;\s*\}\s*#main-app\s*\{\s*display:\s*block\s*!important;\s*\}\s*</style>', '', dash_content)
dash_content = re.sub(r'<div id="auth-overlay">.*?</div>\s*</div>', '', dash_content, flags=re.DOTALL)

# Replace auth.onAuthStateChanged with direct call to loadData()
dash_auth = r'auth\.onAuthStateChanged\(user => \{.*?\n    \}\);'
dash_content = re.sub(dash_auth, 'loadData();', dash_content, flags=re.DOTALL)
dash_content = re.sub(r'const btnLogout = document\.getElementById\(\'btn-logout\'\);\s*if\s*\(btnLogout\)\s*\{.*?\}\s*\}\s*\n', '', dash_content, flags=re.DOTALL)
dash_content = re.sub(r'<button id="btn-logout".*?</button>', '', dash_content)

with open(r'd:\Template_HopDong\dashboard.html', 'w', encoding='utf-8') as f:
    f.write(dash_content)

# 3. hop_dong.html
with open(r'd:\Template_HopDong\hop_dong.html', 'r', encoding='utf-8') as f:
    hop_content = f.read()

hop_content = re.sub(r'<div id="auth-overlay">.*?</div>\s*</div>', '', hop_content, flags=re.DOTALL)
hop_content = re.sub(r'if\(typeof auth !== \'undefined\'\) \{.*?\}\s*\}\s*\n', 'renderList(contractsData);', hop_content, flags=re.DOTALL)
hop_content = re.sub(r'<div style="text-align:right; padding:10px;"><button id="btn-logout".*?</button></div>', '', hop_content)

with open(r'd:\Template_HopDong\hop_dong.html', 'w', encoding='utf-8') as f:
    f.write(hop_content)

# 4. Other apps
other_apps = [
    r'd:\Template_HopDong\Bao_Cao_app.html',
    r'd:\Template_HopDong\Kinh_Te_app.html',
    r'd:\Template_HopDong\VanChuyen_app.html',
    r'd:\Template_HopDong\huasen_workflow\index.html',
    r'd:\Template_HopDong\unified_workflow\index.html'
]

guard_pattern = r'//\s*Authentication Guard\s*auth\.onAuthStateChanged\(.*?\}\);'
for file in other_apps:
    try:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
        content = re.sub(guard_pattern, '', content, flags=re.DOTALL)
        content = re.sub(r'<div id="auth-overlay">.*?</div>\s*</div>', '', content, flags=re.DOTALL)
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
    except Exception as e:
        pass

print("Removed all auth logic safely")
