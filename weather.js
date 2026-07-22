/**
 * Hệ Thống Thời Tiết 4 Mùa & Ngôi Nhà Cấp 4 Nông Thôn 1945
 * Xuân (Sáng) -> Thu (Hoàng hôn, đèn mờ) -> Mưa bão (Đèn sáng rực)
 */

const canvas = document.createElement('canvas');
canvas.id = "weather-canvas";
Object.assign(canvas.style, {
  position: "absolute", top: "0", left: "0",
  width: "100%", height: "100%",
  zIndex: "-1", pointerEvents: "none"
});

document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("auth-overlay");
  if (!overlay) return;
  overlay.appendChild(canvas);
  overlay.style.background = "transparent";

  const emailInput = document.getElementById("login-email");
  const passInput = document.getElementById("login-pass");

  if (emailInput) {
    emailInput.addEventListener("focus", () => setWeatherState(1)); // Autumn & Window Light
    emailInput.addEventListener("blur", () => {
      if (document.activeElement !== passInput) setWeatherState(0); // Spring
    });
  }
  if (passInput) {
    passInput.addEventListener("focus", () => setWeatherState(2)); // Storm & Full Light
    passInput.addEventListener("blur", () => setWeatherState(0));
  }
});

const ctx = canvas.getContext('2d');
let w, h;
let weatherLevel = 0; // 0=Spring, 1=Autumn, 2=Storm
let frameCount = 0;

// -------- SCENE DATA --------
const sky = { r: 135, g: 206, b: 235, r2: 240, g2: 250, b2: 255 };
const targetSpring = { r: 135, g: 206, b: 235, r2: 240, g2: 250, b2: 255 };
const targetAutumn = { r: 240, g: 140, b: 70,  r2: 255, g2: 200, b2: 120 };
const targetStorm  = { r: 30,  g: 40,  b: 55,  r2: 50,  g2: 60,  b2: 75 };

const clouds = [];
const birds = [];
const raindrops = [];
const branches = [];
const leaves = [];
let lightningFlash = 0;
let lightningBolts = [];
let lightningTimer = 0;
let houseLightOpacity = 0;

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  initTree();
}
window.addEventListener('resize', resize);

function lerp(a, b, t) { return a + (b - a) * t; }

function initScene() {
  for (let i = 0; i < 15; i++) clouds.push({ x: Math.random() * 2000 - 200, y: Math.random() * 300 + 50, size: Math.random() * 80 + 40, speed: Math.random() * 0.3 + 0.1 });
  for (let i = 0; i < 6; i++) birds.push({ x: Math.random() * w, y: Math.random() * 200 + 100, size: Math.random() * 3 + 3, speed: Math.random() * 1 + 0.5, flap: Math.random() * Math.PI * 2, flapSpeed: Math.random() * 0.05 + 0.05 });
  for (let i = 0; i < 400; i++) raindrops.push({ x: Math.random() * 3000 - 500, y: Math.random() * 1200 - 200, len: Math.random() * 20 + 10, speed: Math.random() * 20 + 15, windX: Math.random() * 10 + 5, z: Math.random() * 2 + 1 });
}

function initTree() {
  branches.length = 0;
  leaves.length = 0;
  const treeRootX = w < 800 ? w * 0.2 : w * 0.15;
  const treeRootY = h + 20;

  function build(x, y, len, angle, depth) {
    const endX = x + Math.cos(angle) * len;
    const endY = y + Math.sin(angle) * len;
    branches.push({x1: x, y1: y, x2: endX, y2: endY, width: (depth + 1.5) * 2});
    
    if (depth > 0) {
      build(endX, endY, len * (0.75 + Math.random()*0.1), angle - 0.25 - Math.random()*0.2, depth - 1);
      build(endX, endY, len * (0.75 + Math.random()*0.1), angle + 0.25 + Math.random()*0.2, depth - 1);
      if (depth > 3 && Math.random() < 0.45) build(endX, endY, len * 0.65, angle + (Math.random()-0.5)*0.5, depth - 1);
    } else {
      for (let i = 0; i < 5; i++) leaves.push({ x: endX + (Math.random()-0.5)*40, y: endY + (Math.random()-0.5)*40, baseX: endX, baseY: endY, attached: true, scale: 0, r: 34, g: 139, b: 34, rot: Math.random()*Math.PI*2, rotS: (Math.random()-0.5)*0.2, vx: 0, vy: 0 });
    }
  }
  build(treeRootX, treeRootY, Math.min(140, h * 0.2), -Math.PI / 2, 7); 
}
initScene();
resize();


// ======== ENVIRONMENT DRAWING ========

function drawSun() {
  const sunX = w > 800 ? w - 250 : w - 100;
  drawSun.op = lerp(drawSun.op || 1, weatherLevel === 2 ? 0 : 1, 0.02);
  if (drawSun.op < 0.01) return;

  const sunColor = weatherLevel === 1 ? "#FF5533" : "#FFD700";
  const glowColor = weatherLevel === 1 ? "rgba(255, 100, 0, 0.55)" : "rgba(255, 220, 60, 0.5)";

  ctx.globalAlpha = drawSun.op;
  const glow = ctx.createRadialGradient(sunX, 150, 20, sunX, 150, 160);
  glow.addColorStop(0, glowColor); glow.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(sunX, 150, 160, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = sunColor; ctx.beginPath(); ctx.arc(sunX, 150, 50, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = 1;
}

function drawClouds() {
  const cTarget = weatherLevel===2 ? {r:30,g:35,b:45} : (weatherLevel===1 ? {r:255,g:210,b:170} : {r:255,g:255,b:255});
  if(!clouds.color) clouds.color = {r:255,g:255,b:255};
  
  clouds.color.r = lerp(clouds.color.r, cTarget.r, 0.02);
  clouds.color.g = lerp(clouds.color.g, cTarget.g, 0.02);
  clouds.color.b = lerp(clouds.color.b, cTarget.b, 0.02);

  ctx.fillStyle = `rgb(${clouds.color.r},${clouds.color.g},${clouds.color.b})`;
  ctx.globalAlpha = weatherLevel === 2 ? 0.9 : 0.8;
  
  clouds.forEach(c => {
    c.x -= c.speed * (weatherLevel === 2 ? 5 : 1.5); // Fast clouds
    if (c.x < -c.size * 3) { c.x = w + c.size * 2; c.y = Math.random() * 300 + 50; }
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.size * 0.6, 0, Math.PI * 2);
    ctx.arc(c.x + c.size * 0.4, c.y - c.size * 0.3, c.size * 0.5, 0, Math.PI * 2);
    ctx.arc(c.x + c.size * 0.9, c.y - c.size * 0.1, c.size * 0.55, 0, Math.PI * 2);
    ctx.arc(c.x + c.size * 1.3, c.y + c.size * 0.05, c.size * 0.45, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
}

function drawBirds() {
  birds.op = lerp(birds.op || 1, weatherLevel < 2 ? 1 : 0, 0.05);
  if (birds.op < 0.01) return;

  ctx.globalAlpha = birds.op;
  ctx.strokeStyle = "#2b2b2b"; ctx.lineWidth = 1.5; ctx.lineCap = "round";

  birds.forEach(b => {
    b.x -= b.speed; b.flap += b.flapSpeed; b.y += Math.sin(frameCount * 0.02 + b.flap) * 0.3;
    if (b.x < -20) { b.x = w + 50 + Math.random() * 200; b.y = Math.random() * 200 + 50; }
    let wingY = Math.sin(b.flap) * b.size;
    ctx.beginPath(); ctx.moveTo(b.x + b.size, b.y - wingY); ctx.lineTo(b.x, b.y); ctx.lineTo(b.x - b.size, b.y - wingY); ctx.stroke();
  });
  ctx.globalAlpha = 1;
}

function drawTreeAndLeaves() {
  ctx.strokeStyle = weatherLevel === 2 ? "#1a1c1d" : "#3e2723"; ctx.lineCap = "round";
  branches.forEach(b => {
    ctx.lineWidth = b.width; ctx.beginPath(); ctx.moveTo(b.x1, b.y1); ctx.lineTo(b.x2, b.y2); ctx.stroke();
  });

  const isAutumn = weatherLevel === 1; const isStorm = weatherLevel === 2; const isSpring = weatherLevel === 0;

  leaves.forEach(l => {
    const tR = isAutumn ? 228 : (isStorm ? 110 : 34);
    const tG = isAutumn ? 155 : (isStorm ? 120 : 139);
    const tB = isAutumn ? 42  : (isStorm ? 30  : 34);
    l.r = lerp(l.r, tR, 0.015); l.g = lerp(l.g, tG, 0.015); l.b = lerp(l.b, tB, 0.015);

    if (isSpring) {
      if (!l.attached) { l.attached = true; l.x = l.baseX + (Math.random()-0.5)*35; l.y = l.baseY + (Math.random()-0.5)*35; l.scale = 0; l.vx = 0; l.vy = 0; }
      l.scale = lerp(l.scale, 1, 0.02);
    } else if (isAutumn && l.attached) {
      if (Math.random() < 0.0015) l.attached = false;
    } else if (isStorm && l.attached) {
      if (Math.random() < 0.025) l.attached = false;
    }

    if (!l.attached) {
      l.vx = lerp(l.vx, isStorm ? 14 + Math.random()*5 : 2.5 + Math.random()*2, 0.05);
      l.vy += 0.055; l.x += l.vx; l.y += l.vy + Math.sin(frameCount * 0.05 + l.rot) * 2; l.rot += l.rotS;
    } else {
      const ww = isStorm ? 4 : 1;
      l.x = l.baseX + Math.sin(frameCount * 0.1 + l.baseY) * ww; l.y = l.baseY + Math.cos(frameCount * 0.12 + l.baseX) * ww;
    }

    if (l.scale > 0.01 && l.y < h + 20) {
      ctx.save(); ctx.translate(l.x, l.y); ctx.rotate(l.rot); ctx.scale(l.scale, l.scale);
      ctx.fillStyle = `rgb(${l.r},${l.g},${l.b})`; ctx.beginPath();
      ctx.moveTo(0, -6); ctx.quadraticCurveTo(5, -2, 1, 4); ctx.quadraticCurveTo(0, 2, -1, 4); ctx.quadraticCurveTo(-5, -2, 0, -6); ctx.fill();
      ctx.restore();
    }
  });
}

function drawTerrain() {
  if(!drawTerrain.c) drawTerrain.c = {r:45,g:160,b:50};
  const tr = weatherLevel === 1 ? 160 : (weatherLevel === 2 ? 30 : 45);
  const tg = weatherLevel === 1 ? 130 : (weatherLevel === 2 ? 40 : 160);
  const tb = weatherLevel === 1 ? 55  : (weatherLevel === 2 ? 30 : 50);

  drawTerrain.c.r = lerp(drawTerrain.c.r, tr, 0.02);
  drawTerrain.c.g = lerp(drawTerrain.c.g, tg, 0.02);
  drawTerrain.c.b = lerp(drawTerrain.c.b, tb, 0.02);

  ctx.fillStyle = `rgb(${drawTerrain.c.r},${drawTerrain.c.g},${drawTerrain.c.b})`;
  ctx.beginPath();
  ctx.moveTo(0, h); ctx.lineTo(0, h - 70);
  ctx.quadraticCurveTo(w * 0.25, h - 120, w * 0.6, h - 60);
  ctx.quadraticCurveTo(w * 0.8, h - 30, w, h - 80);
  ctx.lineTo(w, h); ctx.fill();
}

function drawCountrysideHouse() {
    const isStorm = weatherLevel === 2;
    const isAutumn = weatherLevel === 1;

    // Target light opacity: 0 in spring, 0.5 in autumn, 1.0 in storm
    const targetLightOp = weatherLevel === 0 ? 0 : (weatherLevel === 1 ? 0.6 : 1.0);
    houseLightOpacity = lerp(houseLightOpacity, targetLightOp, 0.03);

    // Place house stably on the right side of the screen
    // Lùi vào trong màn hình để không bị cắt nửa (w * 0.65)
    const bx = w > 800 ? w * 0.65 : w * 0.5; 
    
    // Khớp tuyệt đối với đường cong của bãi cỏ (xấp xỉ h - 45 tại tọa độ w * 0.65)
    const by = h - 45; 
    
    // Adjust colors based on weather state
    const wallColor = isStorm ? "#3b3633" : (isAutumn ? "#8c725d" : "#c4a387"); // Tường nhà đất
    const roofColor = isStorm ? "#4a1c1c" : (isAutumn ? "#8B2B2B" : "#B22222"); // Mái ngói đỏ
    const shadowColor = isStorm ? "#24201e" : (isAutumn ? "#5a4534" : "#8c7a65");
    const doorColor = isStorm ? "#211a14" : "#4a3322";

    ctx.save();
    ctx.translate(bx, by);
    
    // Bậc thềm hiên nhà (Grounded base)
    ctx.fillStyle = shadowColor;
    ctx.fillRect(-110, 0, 220, 10);
    ctx.fillRect(-120, 10, 240, 10); // Bậc thang chạm sát mặt cỏ

    // Vẽ tường chính (front-view)
    ctx.fillStyle = wallColor;
    ctx.fillRect(-100, -90, 200, 90);
    
    // Đổ bóng dưới mái
    ctx.fillStyle = shadowColor;
    ctx.fillRect(-100, -90, 200, 15);

    // Vẽ Mái Ngói (Mái chữ A trùm ra ngoài)
    ctx.fillStyle = roofColor;
    ctx.beginPath();
    ctx.moveTo(-120, -90); // Đuôi mái vươn ra khỏi tường trái
    ctx.lineTo(0, -170);   // Nóc nhà ở giữa
    ctx.lineTo(120, -90);  // Đuôi mái vươn ra khỏi tường phải
    ctx.closePath();
    ctx.fill();

    // Viền mái nhà gỗ
    ctx.strokeStyle = shadowColor;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-120, -90); ctx.lineTo(0, -170); ctx.lineTo(120, -90);
    ctx.stroke();

    // Cửa chính giữa hiên
    ctx.fillStyle = doorColor;
    ctx.fillRect(-25, -70, 50, 70); // Cửa vòm hoặc gỗ chữ nhật
    ctx.strokeStyle = shadowColor;
    ctx.lineWidth = 4;
    ctx.strokeRect(-25, -70, 50, 70);
    // Dọc cửa (2 cánh)
    ctx.beginPath(); ctx.moveTo(0, -70); ctx.lineTo(0, 0); ctx.stroke();

    // Hai cửa sổ đối xứng hai bên
    ctx.fillStyle = isStorm ? "#14171a" : "#222a33";
    ctx.fillRect(-85, -55, 40, 35); // Cửa sổ trái
    ctx.fillRect(45, -55, 40, 35);  // Cửa sổ phải
    
    if (houseLightOpacity > 0.01) {
        // Ánh đèn hắt ra từ 2 cửa sổ
        ctx.fillStyle = `rgba(255, 210, 50, ${houseLightOpacity})`; 
        ctx.fillRect(-85, -55, 40, 35);
        ctx.fillRect(45, -55, 40, 35);

        // Vệt ánh sáng tỏa xuống bãi cỏ
        ctx.globalAlpha = houseLightOpacity * 0.35;
        const glowGrd = ctx.createLinearGradient(0, -15, 0, 70);
        glowGrd.addColorStop(0, "rgba(255, 200, 0, 1)");
        glowGrd.addColorStop(1, "rgba(255, 200, 0, 0)");
        ctx.fillStyle = glowGrd;
        
        // Vệt sáng chéo chữ A
        ctx.beginPath();
        ctx.moveTo(-85, -20); ctx.lineTo(-120, 70); ctx.lineTo(120, 70); ctx.lineTo(85, -20);
        ctx.fill();
        ctx.globalAlpha = 1;
    }

    // Khung cửa sổ song dọc và ngang
    ctx.strokeStyle = shadowColor;
    ctx.lineWidth = 3;
    ctx.strokeRect(-85, -55, 40, 35);
    ctx.strokeRect(45, -55, 40, 35);
    
    // Crossbars cửa sổ trái
    ctx.beginPath(); ctx.moveTo(-65, -55); ctx.lineTo(-65, -20); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-85, -37.5); ctx.lineTo(-45, -37.5); ctx.stroke();
    // Crossbars cửa sổ phải
    ctx.beginPath(); ctx.moveTo(65, -55); ctx.lineTo(65, -20); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(45, -37.5); ctx.lineTo(85, -37.5); ctx.stroke();

    ctx.restore();
}

function drawRainAndLightning() {
  drawRainAndLightning.op = lerp(drawRainAndLightning.op || 0, weatherLevel === 2 ? 1 : 0, 0.03);

  if (drawRainAndLightning.op > 0.01) {
    ctx.lineCap = "round"; ctx.globalAlpha = drawRainAndLightning.op;
    raindrops.forEach(r => {
      r.x -= r.windX * r.z; r.y += r.speed * r.z;
      if (r.y > h) { r.y = -100; r.x = Math.random() * (w + 600); }
      ctx.strokeStyle = `rgba(180, 200, 220, ${0.4 / r.z})`; ctx.lineWidth = r.z * 1.5;
      ctx.beginPath(); ctx.moveTo(r.x, r.y); ctx.lineTo(r.x - r.windX * r.z, r.y + r.len * r.z); ctx.stroke();
    });
    ctx.globalAlpha = 1;
  }

  if (weatherLevel === 2) {
    lightningTimer++;
    if (lightningTimer > 70 + Math.random() * 100) {
      lightningTimer = 0; lightningFlash = 1.0;
      const p1x = Math.random() * w; const p2x = p1x + (Math.random() - 0.5) * 400;
      const bolts = [];
      function recurse(sx, sy, ex, ey, depth) {
        if (depth <= 0) { bolts.push({x1:sx, y1:sy, x2:ex, y2:ey}); return; }
        const mx = (sx+ex)/2 + (Math.random()-0.5)*100, my = (sy+ey)/2 + (Math.random()-0.5)*80;
        recurse(sx, sy, mx, my, depth-1); recurse(mx, my, ex, ey, depth-1);
        if(depth > 1 && Math.random() < 0.3) recurse(mx, my, mx+(Math.random()-0.5)*150, my+Math.random()*120, depth-2);
      }
      recurse(p1x, 0, p2x, h, 4); lightningBolts = bolts;
    }
  }

  if (lightningFlash > 0) {
    ctx.fillStyle = `rgba(180, 220, 255, ${lightningFlash * 0.25})`; ctx.fillRect(0, 0, w, h);
    lightningBolts.forEach(seg => {
      ctx.globalAlpha = lightningFlash;
      ctx.strokeStyle = "rgba(100,200,255,0.4)"; ctx.lineWidth = 18;
      ctx.beginPath(); ctx.moveTo(seg.x1, seg.y1); ctx.lineTo(seg.x2, seg.y2); ctx.stroke();
      ctx.strokeStyle = "#fff"; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(seg.x1, seg.y1); ctx.lineTo(seg.x2, seg.y2); ctx.stroke();
    });
    ctx.globalAlpha = 1;
    lightningFlash -= 0.05; if (lightningFlash < 0) { lightningFlash = 0; lightningBolts = []; }
  }
}

// ======== MAIN ========
function draw() {
  frameCount++; ctx.clearRect(0, 0, w, h);

  const tSky = weatherLevel === 0 ? targetSpring : (weatherLevel === 1 ? targetAutumn : targetStorm);
  const spd = (weatherLevel === 2) ? 0.04 : 0.015;

  sky.r = lerp(sky.r, tSky.r, spd); sky.g = lerp(sky.g, tSky.g, spd); sky.b = lerp(sky.b, tSky.b, spd);
  sky.r2= lerp(sky.r2,tSky.r2,spd); sky.g2= lerp(sky.g2,tSky.g2,spd); sky.b2= lerp(sky.b2,tSky.b2,spd);

  const lF = lightningFlash > 0 ? lightningFlash * 150 : 0;
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, `rgb(${Math.min(255,sky.r+lF)},${Math.min(255,sky.g+lF)},${Math.min(255,sky.b+lF)})`);
  grad.addColorStop(1, `rgb(${Math.min(255,sky.r2+lF)},${Math.min(255,sky.g2+lF)},${Math.min(255,sky.b2+lF)})`);
  ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);

  drawSun();
  drawClouds();
  drawBirds();
  drawTreeAndLeaves();
  
  drawCountrysideHouse();

  drawTerrain(); 
  drawRainAndLightning(); // Rain overlaps house
  
  requestAnimationFrame(draw);
}

draw();
window.setWeatherState = function (lvl) { weatherLevel = lvl; };
