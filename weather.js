/**
 * Hệ Thống Thời Tiết 4D - AntiGravity AI
 * Kịch bản Điện Ảnh: Bầu trời -> Video Background
 */

// 1. TẠO LỚP VIDEO NỀN
const video = document.createElement('video');
video.id = "weather-video";
video.src = "assets/city_rain.mp4"; // Nguồn cấp từ người dùng
video.autoplay = true;
video.loop = true;
video.muted = true;
video.style.position = "absolute";
video.style.top = "0";
video.style.left = "0";
video.style.width = "100%";
video.style.height = "100%";
video.style.objectFit = "cover";
video.style.zIndex = "-2"; 
video.style.opacity = "0"; // Ẩn lúc ban đầu
video.style.transition = "opacity 2s ease-in-out"; // Fade hiệu ứng mượt mà
video.style.pointerEvents = "none";

// 2. TẠO LỚP CANVAS BẦU TRỜI
const canvas = document.createElement('canvas');
canvas.id = "weather-canvas";
canvas.style.position = "absolute";
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.width = "100%";
canvas.style.height = "100%";
canvas.style.zIndex = "-1"; 
canvas.style.opacity = "1";
canvas.style.transition = "opacity 1.5s ease-in-out"; // Chuyển cảnh mờ Canvas
canvas.style.pointerEvents = "none";

document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.getElementById("auth-overlay");
    if (overlay) {
        overlay.appendChild(video);
        overlay.appendChild(canvas);
        overlay.style.background = "transparent"; 
    }
});

const ctx = canvas.getContext('2d');
let w, h;
let weatherLevel = 0; // 0 = Sunny, 1 = Storm, 2 = Video Rain
let lightningFlash = 0;
let stormCloudX = -1000; 

function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();


// -------- SKY DATA --------
let skyColor = { r: 135, g: 206, b: 235, r2: 240, g2: 250, b2: 255 };
const targetSunny = { r: 135, g: 206, b: 235, r2: 240, g2: 250, b2: 255 }; 
const targetStorm = { r: 25, g: 30, b: 45, r2: 50, g2: 60, b2: 70 }; 

const rainDrops = [];
const clouds = [];
const birds = [];
const leaves = [];
function initSky() {
    // Không cần quá nhiều hạt mưa vì Video đã đảm nhiệm, chỉ để lại một ít mờ mờ
    for (let i = 0; i < 150; i++) {
        rainDrops.push({
            x: Math.random() * w * 1.5 - w * 0.25,
            y: Math.random() * h, 
            l: Math.random() * 20 + 20,
            xs: Math.random() * 3 + 1,
            ys: Math.random() * 20 + 15,
            o: 0 
        });
    }
    for (let i = 0; i < 60; i++) {
        leaves.push({
            x: Math.random() * w * 1.5 - w * 0.2, // Spread out widely
            y: Math.random() * (h - 100), // Sky and lower parts
            size: Math.random() * 8 + 4,
            speedX: Math.random() * 10 + 15, // Fast sweeping wind
            speedY: Math.random() * 4 - 2,
            rot: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() * 0.4 - 0.2),
            color: Math.random() > 0.6 ? '#65a30d' : (Math.random() > 0.5 ? '#a16207' : '#4d7c0f'), // greens and browns
            o: 0 // opacity
        });
    }
    for(let i=0; i<6; i++) {
        clouds.push({
            x: Math.random() * w, 
            y: Math.random() * (h/2) + 250,
            size: Math.random() * 80 + 60, 
            baseSpeed: Math.random() * 0.2 + 0.1,
            dir: (i % 2 === 0) ? -1 : 1
        });
    }
    for(let i=0; i<8; i++){
        birds.push({
            x: Math.random() * w,
            y: Math.random() * (h/3) + 100,
            size: Math.random() * 4 + 4,
            speed: Math.random() * 1 + 0.5,
            flap: Math.random() * Math.PI * 2,
            flapspeed: Math.random() * 0.05 + 0.05
        });
    }
}

initSky();

function lerp(start, end, amt) { return (1 - amt) * start + amt * end; }
let frameCount = 0;

// -------- DRAW FUNCTIONS --------
function drawSun(sunX, sunY, radius, panicked) {
    let glowGradient = ctx.createRadialGradient(sunX, sunY, radius * 0.5, sunX, sunY, radius * 2);
    glowGradient.addColorStop(0, "rgba(255, 215, 0, 0.4)");
    glowGradient.addColorStop(1, "rgba(255, 215, 0, 0)");
    ctx.fillStyle = glowGradient;
    ctx.beginPath(); ctx.arc(sunX, sunY, radius * 2, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = "#FFD700";
    ctx.beginPath(); ctx.arc(sunX, sunY, radius, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#B8860B"; ctx.fillStyle = "#B8860B";
    ctx.lineWidth = 3; ctx.lineCap = "round";

    if (!panicked) {
        ctx.beginPath(); ctx.arc(sunX - radius*0.3, sunY - radius*0.1, 4, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(sunX + radius*0.3, sunY - radius*0.1, 4, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(sunX, sunY + radius*0.1, radius*0.4, 0, Math.PI); ctx.stroke();
    } else {
        ctx.fillStyle = "#FFF";
        ctx.beginPath(); ctx.arc(sunX - radius*0.35, sunY - radius*0.15, 9, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(sunX + radius*0.35, sunY - radius*0.15, 9, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = "#000";
        ctx.beginPath(); ctx.arc(sunX - radius*0.35, sunY - radius*0.15, 4, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(sunX + radius*0.35, sunY - radius*0.15, 4, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(sunX, sunY + radius*0.35, radius*0.2, radius*0.25, 0, 0, Math.PI*2); ctx.stroke();
        let waveTime = frameCount * 0.4;
        let leftWave = Math.sin(waveTime) * 15;
        let rightWave = Math.cos(waveTime) * 15;
        ctx.beginPath(); ctx.moveTo(sunX - radius + 5, sunY + 10); ctx.quadraticCurveTo(sunX - radius - 20, sunY + 10, sunX - radius - 30, sunY - 10 + leftWave); ctx.stroke();
        ctx.beginPath(); ctx.arc(sunX - radius - 30, sunY - 10 + leftWave, 6, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.moveTo(sunX + radius - 5, sunY + 10); ctx.quadraticCurveTo(sunX + radius + 20, sunY + 10, sunX + radius + 30, sunY - 10 + rightWave); ctx.stroke();
        ctx.beginPath(); ctx.arc(sunX + radius + 30, sunY - 10 + rightWave, 6, 0, Math.PI * 2); ctx.fill();
    }
}

function drawStormCloud(x, y, scale, alpha) {
    ctx.fillStyle = `rgba(60, 65, 75, ${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, 60*scale, 0, Math.PI * 2);
    ctx.arc(x + 40*scale, y - 40*scale, 50*scale, 0, Math.PI * 2);
    ctx.arc(x + 100*scale, y - 20*scale, 70*scale, 0, Math.PI * 2);
    ctx.arc(x + 150*scale, y + 10*scale, 60*scale, 0, Math.PI * 2);
    ctx.fill();
}


// -------- MAIN LOOP --------
function draw() {
    frameCount++;
    ctx.clearRect(0, 0, w, h);
    const lerpSpeed = 0.04;
    
    let sunX = w > 800 ? w - 250 : w - 100;
    
    // 0. State Machine Cập nhật CSS Fade
    let isStormy = weatherLevel > 0;
    
    if (weatherLevel === 2) {
        // Hiện video, làm chìm Canvas
        video.style.opacity = "1";
        canvas.style.opacity = "0"; 
    } else {
        // Chỉ mây bão, mây vẫn rõ
        video.style.opacity = "0";
        canvas.style.opacity = "1";
    }

    // Nhưng dù mờ, canvas vẫn phải render vòng lặp trạng thái bão để khi Reset nó còn đúng vị trí
    if (isStormy) {
        stormCloudX = lerp(stormCloudX, sunX - 80, 0.025); 
    } else {
        stormCloudX = lerp(stormCloudX, -1000, 0.02); 
    }

    // 1. Sky Transition 
    const targetDark = isStormy ? targetStorm : targetSunny;
    skyColor.r = lerp(skyColor.r, targetDark.r, lerpSpeed);
    skyColor.g = lerp(skyColor.g, targetDark.g, lerpSpeed);
    skyColor.b = lerp(skyColor.b, targetDark.b, lerpSpeed);
    skyColor.r2 = lerp(skyColor.r2, targetDark.r2, lerpSpeed);
    skyColor.g2 = lerp(skyColor.g2, targetDark.g2, lerpSpeed);
    skyColor.b2 = lerp(skyColor.b2, targetDark.b2, lerpSpeed);

    let lFl = lightningFlash > 0 ? lightningFlash * 150 : 0;
    let grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, `rgb(${skyColor.r + lFl}, ${skyColor.g + lFl}, ${skyColor.b + lFl})`);
    grad.addColorStop(1, `rgb(${skyColor.r2 + lFl}, ${skyColor.g2 + lFl}, ${skyColor.b2 + lFl})`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // DRAW SKY ELEMENTS
    let sunY = 150; 
    
    drawSun(sunX, sunY, 50, isStormy);

    const wcA = isStormy ? 0.0 : 0.9;
    clouds.forEach(c => {
        c.x += (isStormy ? c.baseSpeed * 25 : c.baseSpeed) * (isStormy ? c.dir : -1); 
        if (!isStormy && c.x < -c.size * 2) c.x = w + c.size; 
        if(!c.o) c.o = 1; c.o = lerp(c.o, wcA, lerpSpeed);
        if (c.o > 0.01) {
            ctx.fillStyle = `rgba(255, 255, 255, ${c.o})`;
            ctx.beginPath(); ctx.arc(c.x, c.y, c.size, 0, Math.PI * 2);
            ctx.arc(c.x + c.size * 0.5, c.y - c.size * 0.3, c.size * 0.7, 0, Math.PI * 2);
            ctx.arc(c.x + c.size * 1.2, c.y, c.size * 0.8, 0, Math.PI * 2); ctx.fill();
        }
    });

    ctx.strokeStyle = "#111827"; ctx.lineWidth = 1.5; ctx.lineCap = "round"; ctx.lineJoin = "round";
    birds.forEach(b => {
        if(!b.o) b.o = 1; b.o = lerp(b.o, wcA, lerpSpeed * 2);
        if(b.o > 0.01) {
            b.x -= isStormy ? b.speed * 10 : b.speed;
            if(!isStormy && b.x < -20) { b.x = w + 20; b.y = Math.random() * (h/3) + 100; }
            b.flap += isStormy ? b.flapspeed * 4 : b.flapspeed; 
            let wY = Math.sin(b.flap) * b.size; 
            ctx.globalAlpha = b.o * 0.6; ctx.beginPath();
            ctx.moveTo(b.x + b.size, b.y - wY); ctx.lineTo(b.x, b.y); ctx.lineTo(b.x - b.size, b.y - wY); ctx.stroke();
        }
    });
    ctx.globalAlpha = 1.0;

    // FLYING LEAVES
    const leafOp = isStormy ? 1 : 0;
    leaves.forEach(l => {
        l.o = lerp(l.o, leafOp, lerpSpeed);
        if (l.o > 0.01) {
            ctx.globalAlpha = l.o;
            ctx.fillStyle = l.color;
            ctx.save();
            ctx.translate(l.x, l.y);
            ctx.rotate(l.rot);
            ctx.beginPath(); ctx.ellipse(0, 0, l.size, l.size/2, 0, 0, Math.PI * 2); ctx.fill();
            ctx.restore();

            l.x -= l.speedX;
            l.y += l.speedY + Math.sin(frameCount * 0.1) * 2; 
            l.rot += l.rotSpeed;

            if (l.x < -20) {
                l.x = w + Math.random() * 500;
                l.y = Math.random() * (h - 100);
            }
        }
    });
    ctx.globalAlpha = 1.0;

    let dCA = (stormCloudX + 800) / (sunX + 600); if (dCA < 0) dCA = 0; if (dCA > 1) dCA = 1;
    for (let c = 0; c < 5; c++) {
         drawStormCloud(stormCloudX - (c*180), sunY - 80 + (c*15), 1.6, dCA);
         drawStormCloud(stormCloudX + 220 - (c*220), sunY - 10, 1.4, dCA * 0.9);
    }
    drawStormCloud(stormCloudX, sunY - 50, 2.3, dCA);

    // DRAW RAIN CỦA CANVAS (Phủ lên mọi thứ)
    const rainOp = (weatherLevel === 2) ? 1 : 0;
    ctx.strokeStyle = "rgba(180,200,225,0.6)"; ctx.lineWidth = 1.2; ctx.lineCap = "round";
    rainDrops.forEach(r => {
        if(!r.ia) r.ia = 0; r.ia = lerp(r.ia, rainOp, lerpSpeed * 1.5);
        if (r.ia > 0.01) {
            ctx.globalAlpha = r.ia;
            ctx.beginPath(); ctx.moveTo(r.x, r.y); ctx.lineTo(r.x - r.xs * 1.5, r.y + r.ys); ctx.stroke();
            r.x -= r.xs; r.y += r.ys;
            if (r.y > h || r.x < -r.l) { r.y = -r.l; r.x = Math.random() * w * 1.5 - w * 0.25; }
        }
    });
    ctx.globalAlpha = 1.0;

    // Lightning
    if (isStormy && stormCloudX > sunX - 300) { 
        if (Math.random() < 0.01 && lightningFlash === 0) lightningFlash = 1.0;
        if (lightningFlash > 0) { lightningFlash -= 0.06; if (lightningFlash < 0) lightningFlash = 0; }
    } else lightningFlash = 0;

    requestAnimationFrame(draw);
}

draw();

window.setWeatherState = function(lvl) {
    if (lvl === 2) video.play().catch(e=>console.log(e));
    weatherLevel = lvl;
}
