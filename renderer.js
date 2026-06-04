// ======================================================
// Anggota 3: Christine Simbolon
// Bagian: Renderer Engine / Penggambar Objek Grafis
// Tugas: Pewarnaan Gradien (Linear & Radial Gradient Painting), Penggambaran Primitif Grafis, dan Kurva Kuadratik (Bézier).

// ======================================================

function drawBackground() {
      const grad = ctx.createLinearGradient(0, 0, MAP_W, MAP_H);
      grad.addColorStop(0, "#7fc96a");
      grad.addColorStop(0.28, "#6db75b");
      grad.addColorStop(0.58, "#9fd66f");
      grad.addColorStop(0.82, "#f1d166");
      grad.addColorStop(1, "#6fbf7d");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, MAP_W, MAP_H);

      // Patch rumput / tanah berwarna lebih kaya
      for (let i = 0; i < 22; i++) {
        ctx.fillStyle = i % 3 === 0
          ? "rgba(255, 220, 120, .18)"
          : i % 3 === 1
          ? "rgba(63, 147, 70, .18)"
          : "rgba(146, 214, 94, .18)";
        ctx.beginPath();
        ctx.ellipse((i * 187) % MAP_W, 120 + ((i * 143) % 1220), 240, 95, i * 0.22, 0, Math.PI * 2);
        ctx.fill();
      }

      // Sinar cahaya hangat
      ctx.save();
      ctx.globalAlpha = 0.10;
      ctx.translate(260, 70);
      ctx.rotate(-0.38);
      for (let i = 0; i < 8; i++) {
        ctx.fillStyle = "#fff5b0";
        ctx.fillRect(i * 120, -80, 44, MAP_H + 250);
      }
      ctx.restore();

      // Glow lembut seperti cahaya yang masuk dari pepohonan
      lightSpots.forEach(g => {
        const rg = ctx.createRadialGradient(g.x, g.y, 0, g.x, g.y, g.r);
        rg.addColorStop(0, "rgba(255, 247, 184, .20)");
        rg.addColorStop(0.45, "rgba(255, 236, 145, .10)");
        rg.addColorStop(1, "rgba(255, 236, 145, 0)");
        ctx.fillStyle = rg;
        ctx.beginPath();
        ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Kabut/awan lembut
      ctx.fillStyle = "rgba(255,255,255,.17)";
      for (let i = -100; i < MAP_W; i += 390) {
        ctx.beginPath();
        ctx.ellipse(i + 150, 115, 128, 36, -0.08, 0, Math.PI * 2);
        ctx.ellipse(i + 240, 148, 112, 34, 0.09, 0, Math.PI * 2);
        ctx.ellipse(i + 90, 158, 88, 28, 0.11, 0, Math.PI * 2);
        ctx.fill();
      }

      // Bunga kecil warna-warni
      flowers.forEach(f => {
        ctx.fillStyle = f.c;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.s, 0, Math.PI * 2);
        ctx.fill();

        if (f.s > 3.2) {
          ctx.fillStyle = "rgba(255,255,255,.45)";
          ctx.beginPath();
          ctx.arc(f.x - 0.9, f.y - 0.9, f.s * 0.35, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    }

function roundedRect(x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    }

function drawCurvedPath(points, style) {
      if (points.length < 2) return;

      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);

      for (let i = 1; i < points.length - 1; i++) {
        const midX = (points[i].x + points[i + 1].x) / 2;
        const midY = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, midX, midY);
      }

      const last = points[points.length - 1];
      const prev = points[points.length - 2];
      ctx.quadraticCurveTo(prev.x, prev.y, last.x, last.y);

      ctx.strokeStyle = style.color;
      ctx.lineWidth = style.width;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
    }

function drawPolyline(points, style) {
      if (points.length < 2) return;

      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);

      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }

      ctx.strokeStyle = style.color;
      ctx.lineWidth = style.width;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
    }

function drawRoads() {
      roads.forEach(road => {
        const width = road.type === "main" ? 58 : 36;

        drawCurvedPath(road.points, {
          color: "#6d746f",
          width: width + 10
        });

        drawCurvedPath(road.points, {
          color: road.type === "main" ? "#59666d" : "#758188",
          width
        });

        drawCurvedPath(road.points, {
          color: "rgba(255,255,255,.74)",
          width: 4
        });
      });

      roads.forEach(road => {
        for (let i = 0; i < road.points.length - 1; i++) {
          drawCrosswalk(road.points[i].x, road.points[i].y);
        }
      });

      drawRoadName("Jl. Tanjung Uban Lama", 1570, 235, -0.55);
      drawRoadName("Jl. D.I. Panjaitan", 780, 1200, -0.08);
      drawRoadName("Mie Gacoan", 1035, 470, -0.05);
      drawRoadName("Jalur Tengah", 1330, 720, -1.25);
    }

function drawRoadName(text, x, y, angle) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      ctx.fillStyle = "rgba(255,250,240,.92)";
      roundedRect(-120, -16, 240, 32, 13);
      ctx.fill();
      ctx.strokeStyle = "rgba(80, 58, 35,.14)";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "#24313a";
      ctx.font = "bold 18px Segoe UI";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, 0, 1);

      ctx.restore();
    }

function drawCrosswalk(x, y) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.sin((x + y) * 0.01) * 0.5);

      ctx.fillStyle = "rgba(255,255,255,.78)";
      for (let i = -3; i <= 3; i++) {
        ctx.fillRect(i * 8, -22, 4, 44);
      }

      ctx.restore();
    }

function drawParks() {
      parks.forEach(p => {
        const parkGrad = ctx.createRadialGradient(
          p.x + p.w * .35, p.y + p.h * .25, 5,
          p.x + p.w * .5, p.y + p.h * .5, Math.max(p.w, p.h)
        );
        parkGrad.addColorStop(0, "#b7ee78");
        parkGrad.addColorStop(0.55, "#79cf57");
        parkGrad.addColorStop(1, "#4fa94f");

        ctx.fillStyle = parkGrad;
        roundedRect(p.x, p.y, p.w, p.h, p.r);
        ctx.fill();

        ctx.strokeStyle = "rgba(49, 132, 64, .58)";
        ctx.lineWidth = 5;
        ctx.stroke();

        // Highlight hangat
        ctx.fillStyle = "rgba(255, 247, 184, .12)";
        roundedRect(p.x + 18, p.y + 16, p.w - 36, p.h - 32, 22);
        ctx.fill();

        // Titik bunga di taman
        for (let i = 0; i < 12; i++) {
          ctx.fillStyle = ["#ff7aa8", "#ffd84f", "#ff9f68", "#ffffff"][i % 4];
          ctx.beginPath();
          ctx.arc(
            p.x + 20 + ((i * 43) % Math.max(40, p.w - 40)),
            p.y + 20 + ((i * 29) % Math.max(40, p.h - 40)),
            3 + (i % 2),
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
      });
    }

function drawBuildings() {
      const sorted = [...buildings].sort((a, b) => (a.y + a.h) - (b.y + b.h));

      sorted.forEach(b => {
        ctx.save();
        ctx.translate(b.x + b.w / 2, b.y + b.h / 2);
        ctx.rotate(b.rot);

        const hw = b.w / 2;
        const hh = b.h / 2;

        // Bayangan bangunan
        ctx.fillStyle = "rgba(30,20,10,0.20)";
        roundedRect(-hw + 8, -hh + 10, b.w, b.h, 8);
        ctx.fill();

        if (b.btype === 0) {
          // ===== RUMAH — atap pelana top-down (ridge horizontal) =====
          // Lantai/fondasi
          ctx.fillStyle = "#d4c5a9";
          roundedRect(-hw, -hh, b.w, b.h, 6);
          ctx.fill();
          ctx.strokeStyle = "#b8a882";
          ctx.lineWidth = 2;
          ctx.stroke();

          // Panel atap KIRI (lebih terang, cahaya dari kiri-atas)
          const gL = ctx.createLinearGradient(-hw, 0, 0, 0);
          gL.addColorStop(0, shadeColor(b.roof, 30));
          gL.addColorStop(1, b.roof);
          ctx.fillStyle = gL;
          ctx.beginPath();
          ctx.moveTo(-hw, -hh);
          ctx.lineTo(-hw, hh);
          ctx.lineTo(0, hh * 0.82);
          ctx.lineTo(0, -hh * 0.82);
          ctx.closePath();
          ctx.fill();

          // Panel atap KANAN (lebih gelap)
          const gR = ctx.createLinearGradient(0, 0, hw, 0);
          gR.addColorStop(0, b.roof);
          gR.addColorStop(1, shadeColor(b.roof, -35));
          ctx.fillStyle = gR;
          ctx.beginPath();
          ctx.moveTo(hw, -hh);
          ctx.lineTo(hw, hh);
          ctx.lineTo(0, hh * 0.82);
          ctx.lineTo(0, -hh * 0.82);
          ctx.closePath();
          ctx.fill();

          // Garis bubungan (ridge) tengah
          ctx.strokeStyle = shadeColor(b.roof, -50);
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(0, -hh * 0.82);
          ctx.lineTo(0, hh * 0.82);
          ctx.stroke();

          // Outline atap
          ctx.strokeStyle = shadeColor(b.roof, -25);
          ctx.lineWidth = 1.8;
          roundedRect(-hw, -hh, b.w, b.h, 6);
          ctx.stroke();

          // Highlight kecil
          ctx.fillStyle = "rgba(255,255,255,0.16)";
          ctx.beginPath();
          ctx.moveTo(-hw, -hh);
          ctx.lineTo(-hw * 0.4, -hh);
          ctx.lineTo(0, -hh * 0.82);
          ctx.lineTo(-hw, -hh * 0.2);
          ctx.closePath();
          ctx.fill();

          // Cerobong asap kecil
          if (b.w > 75) {
            ctx.fillStyle = shadeColor(b.roof, -55);
            roundedRect(hw * 0.25 - 5, -hh * 0.5 - 5, 11, 11, 2);
            ctx.fill();
            ctx.fillStyle = "rgba(210,210,210,0.55)";
            roundedRect(hw * 0.25 - 4, -hh * 0.5 - 6, 9, 5, 2);
            ctx.fill();
          }

        } else if (b.btype === 1) {
          // ===== RESTO — atap datar + detail AC & skylight =====
          const gFlat = ctx.createLinearGradient(-hw, -hh, hw, hh);
          gFlat.addColorStop(0, shadeColor(b.roof, 22));
          gFlat.addColorStop(1, b.roof);
          ctx.fillStyle = gFlat;
          roundedRect(-hw, -hh, b.w, b.h, 5);
          ctx.fill();
          ctx.strokeStyle = shadeColor(b.roof, -22);
          ctx.lineWidth = 2.5;
          ctx.stroke();

          // Parapet (border tebal atap)
          ctx.strokeStyle = shadeColor(b.roof, -38);
          ctx.lineWidth = 6;
          roundedRect(-hw + 5, -hh + 5, b.w - 10, b.h - 10, 4);
          ctx.stroke();

          // Unit AC
          ctx.fillStyle = "#c5dde8";
          roundedRect(-hw + 10, -hh + 10, 24, 15, 3);
          ctx.fill();
          ctx.strokeStyle = "#88afc0";
          ctx.lineWidth = 1.5;
          ctx.stroke();
          for (let ki = 0; ki < 4; ki++) {
            ctx.beginPath();
            ctx.moveTo(-hw + 14 + ki * 5, -hh + 11);
            ctx.lineTo(-hw + 14 + ki * 5, -hh + 24);
            ctx.strokeStyle = "#88afc0";
            ctx.lineWidth = 1;
            ctx.stroke();
          }

          // Skylight biru
          ctx.fillStyle = "rgba(160,220,255,0.55)";
          roundedRect(hw * 0.05, -hh + 13, b.w * 0.32, b.h * 0.28, 4);
          ctx.fill();
          ctx.strokeStyle = "#7ab8d4";
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Label RESTO
          ctx.fillStyle = "rgba(255,255,255,0.60)";
          ctx.font = `bold ${Math.min(b.w, b.h) * 0.17}px Arial`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("RESTO", 0, hh * 0.38);

          // Highlight pojok
          ctx.fillStyle = "rgba(255,255,255,0.13)";
          roundedRect(-hw + 7, -hh + 7, b.w * 0.38, b.h * 0.28, 3);
          ctx.fill();

        } else if (b.btype === 2) {
          // ===== TOKO — atap awning bergaris warna-warni =====
          ctx.fillStyle = b.roof;
          roundedRect(-hw, -hh, b.w, b.h, 5);
          ctx.fill();
          ctx.strokeStyle = shadeColor(b.roof, -22);
          ctx.lineWidth = 2;
          ctx.stroke();

          // Awning garis-garis horizontal di bagian atas
          const stripeH = b.h * 0.36;
          const stripeCount = 6;
          const sw = b.w / stripeCount;
          const altCol = shadeColor(b.roof, 50);
          for (let s = 0; s < stripeCount; s++) {
            ctx.fillStyle = s % 2 === 0 ? b.roof : altCol;
            ctx.fillRect(-hw + s * sw, -hh, sw, stripeH);
          }
          ctx.strokeStyle = shadeColor(b.roof, -30);
          ctx.lineWidth = 2;
          ctx.strokeRect(-hw, -hh, b.w, stripeH);

          // Bagian dalam toko (belakang awning)
          const gBack = ctx.createLinearGradient(0, -hh + stripeH, 0, hh);
          gBack.addColorStop(0, shadeColor(b.roof, 15));
          gBack.addColorStop(1, shadeColor(b.roof, -10));
          ctx.fillStyle = gBack;
          ctx.fillRect(-hw, -hh + stripeH, b.w, b.h - stripeH);

          // Highlight
          ctx.fillStyle = "rgba(255,255,255,0.18)";
          roundedRect(-hw + 6, -hh + stripeH + 4, b.w * 0.4, b.h * 0.22, 3);
          ctx.fill();

          // Label TOKO
          ctx.fillStyle = "rgba(255,255,255,0.65)";
          ctx.font = `bold ${Math.min(b.w, b.h) * 0.16}px Arial`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("TOKO", 0, hh * 0.42);

        } else {
          // ===== KANTOR — atap beton + panel surya =====
          const gOff = ctx.createLinearGradient(-hw, -hh, hw, hh);
          gOff.addColorStop(0, "#b0bec5");
          gOff.addColorStop(1, "#78909c");
          ctx.fillStyle = gOff;
          roundedRect(-hw, -hh, b.w, b.h, 4);
          ctx.fill();
          ctx.strokeStyle = "#546e7a";
          ctx.lineWidth = 2.5;
          ctx.stroke();

          // Grid panel surya
          const pW = (b.w - 20) / 3;
          const pH = (b.h - 20) / 2;
          for (let px2 = 0; px2 < 3; px2++) {
            for (let py2 = 0; py2 < 2; py2++) {
              const pg = ctx.createLinearGradient(
                -hw + 10 + px2 * pW, -hh + 10 + py2 * pH,
                -hw + 10 + (px2 + 1) * pW, -hh + 10 + (py2 + 1) * pH
              );
              pg.addColorStop(0, "#1a237e");
              pg.addColorStop(0.5, "#283593");
              pg.addColorStop(1, "#3949ab");
              ctx.fillStyle = pg;
              roundedRect(-hw + 10 + px2 * pW + 1, -hh + 10 + py2 * pH + 1, pW - 3, pH - 3, 2);
              ctx.fill();
              ctx.strokeStyle = "rgba(255,255,255,0.15)";
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }

          // Tangki air kecil
          ctx.fillStyle = "#90a4ae";
          roundedRect(hw - 17, -hh + 4, 13, 17, 3);
          ctx.fill();
          ctx.strokeStyle = "#546e7a";
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Highlight
          ctx.fillStyle = "rgba(255,255,255,0.11)";
          roundedRect(-hw + 5, -hh + 5, b.w * 0.34, b.h * 0.24, 3);
          ctx.fill();
        }

        ctx.restore();
      });
    }

function shadeColor(hex, pct) {
      hex = hex.replace('#','');
      if (hex.length === 3) hex = hex.split('').map(c=>c+c).join('');
      let r = parseInt(hex.substring(0,2),16);
      let g = parseInt(hex.substring(2,4),16);
      let b2 = parseInt(hex.substring(4,6),16);
      r = Math.min(255, Math.max(0, r + pct * 2.2 | 0));
      g = Math.min(255, Math.max(0, g + pct * 2.2 | 0));
      b2 = Math.min(255, Math.max(0, b2 + pct * 2.2 | 0));
      return `rgb(${r},${g},${b2})`;
    }

function drawTrees() {
      trees.forEach(t => {
        ctx.save();
        ctx.translate(t.x, t.y);
        ctx.rotate(t.tilt);

        ctx.fillStyle = "#7f532a";
        roundedRect(-3, t.r - 2, 6, 18, 3);
        ctx.fill();

        const leaf = ctx.createRadialGradient(-5, -6, 4, 0, 0, t.r * 1.35);
        leaf.addColorStop(0, "#a8ef69");
        leaf.addColorStop(0.55, "#53b646");
        leaf.addColorStop(1, "#2e7d32");

        ctx.fillStyle = leaf;
        ctx.beginPath();
        ctx.arc(0, 0, t.r, 0, Math.PI * 2);
        ctx.fill();

        // Gumpalan daun tambahan
        ctx.fillStyle = "rgba(72, 173, 67, .9)";
        ctx.beginPath();
        ctx.arc(-t.r * .45, t.r * .05, t.r * .55, 0, Math.PI * 2);
        ctx.arc(t.r * .35, t.r * -.12, t.r * .48, 0, Math.PI * 2);
        ctx.fill();

        // Highlight cahaya
        ctx.fillStyle = "rgba(255,255,255,.24)";
        ctx.beginPath();
        ctx.arc(-t.r * .25, -t.r * .30, t.r * .35, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });
    }

// Tipe bangunan per node: 0=rumah, 1=resto, 2=toko, 3=kantor
    const nodeBuildingType = {
      A: 3, B: 0, C: 1, D: 0, E: 2, F: 1, G: 1, H: 0, I: 3, J: 2, K: 0
    };
    const nodeBuildingRoof = {
      A: "#546e7a", B: "#c0392b", C: "#e67e22", D: "#922b21",
      E: "#2e86c1", F: "#d35400", G: "#ca6f1e", H: "#b03a2e",
      I: "#37474f", J: "#117a65", K: "#7b241c"
    };
    const nodeBuildingColor = {
      A: "#dceeff", B: "#ffe6b3", C: "#ffd0a7", D: "#fff2c7",
      E: "#d7f2ff", F: "#ffd9c7", G: "#f6e0b8", H: "#ffe6b3",
      I: "#dceeff", J: "#d7f2ff", K: "#ffd0a7"
    };

function drawRouteGraph() {
      graphEdges.forEach(edge => {
        const p1 = node(edge[0]);
        const p2 = node(edge[1]);

        drawPolyline([p1, p2], {
          color: "rgba(75,24,255,.25)",
          width: 20
        });

        drawPolyline([p1, p2], {
          color: "#4b18ff",
          width: 9
        });
      });

      drawPolyline(routeToPoints(activeRoute), {
        color: "rgba(255,255,255,.88)",
        width: 4
      });

      drawRouteNodes();
      drawPlaceLabels();
    }

function drawNodeBuilding(cx, cy, btype, roofColor, bodyColor, id) {
      const bw = 80, bh = 64;
      const hw = bw / 2, hh = bh / 2;
      // Geser bangunan ke kiri-atas supaya tidak di atas jalan/node
      const ox = cx - 90, oy = cy - 80;

      ctx.save();
      ctx.translate(ox, oy);

      // Bayangan
      ctx.fillStyle = "rgba(30,20,10,0.18)";
      roundedRect(-hw + 6, -hh + 8, bw, bh, 7);
      ctx.fill();

      if (btype === 0) {
        // RUMAH — atap pelana
        ctx.fillStyle = "#d4c5a9";
        roundedRect(-hw, -hh, bw, bh, 6);
        ctx.fill();
        ctx.strokeStyle = "#b8a882";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Panel kiri (terang)
        const gL = ctx.createLinearGradient(-hw, 0, 0, 0);
        gL.addColorStop(0, shadeColor(roofColor, 30));
        gL.addColorStop(1, roofColor);
        ctx.fillStyle = gL;
        ctx.beginPath();
        ctx.moveTo(-hw, -hh); ctx.lineTo(-hw, hh);
        ctx.lineTo(0, hh * 0.82); ctx.lineTo(0, -hh * 0.82);
        ctx.closePath(); ctx.fill();

        // Panel kanan (gelap)
        const gR = ctx.createLinearGradient(0, 0, hw, 0);
        gR.addColorStop(0, roofColor);
        gR.addColorStop(1, shadeColor(roofColor, -35));
        ctx.fillStyle = gR;
        ctx.beginPath();
        ctx.moveTo(hw, -hh); ctx.lineTo(hw, hh);
        ctx.lineTo(0, hh * 0.82); ctx.lineTo(0, -hh * 0.82);
        ctx.closePath(); ctx.fill();

        // Garis bubungan
        ctx.strokeStyle = shadeColor(roofColor, -50);
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(0, -hh * 0.82); ctx.lineTo(0, hh * 0.82);
        ctx.stroke();

        ctx.strokeStyle = shadeColor(roofColor, -25);
        ctx.lineWidth = 1.8;
        roundedRect(-hw, -hh, bw, bh, 6);
        ctx.stroke();

        // Highlight
        ctx.fillStyle = "rgba(255,255,255,0.16)";
        ctx.beginPath();
        ctx.moveTo(-hw, -hh); ctx.lineTo(-hw * 0.4, -hh);
        ctx.lineTo(0, -hh * 0.82); ctx.lineTo(-hw, -hh * 0.2);
        ctx.closePath(); ctx.fill();

        // Cerobong
        ctx.fillStyle = shadeColor(roofColor, -55);
        roundedRect(hw * 0.2 - 4, -hh * 0.55 - 4, 9, 9, 2);
        ctx.fill();

      } else if (btype === 1) {
        // RESTO — datar + AC + skylight
        const gFlat = ctx.createLinearGradient(-hw, -hh, hw, hh);
        gFlat.addColorStop(0, shadeColor(roofColor, 22));
        gFlat.addColorStop(1, roofColor);
        ctx.fillStyle = gFlat;
        roundedRect(-hw, -hh, bw, bh, 5); ctx.fill();
        ctx.strokeStyle = shadeColor(roofColor, -22); ctx.lineWidth = 2.5; ctx.stroke();

        ctx.strokeStyle = shadeColor(roofColor, -38); ctx.lineWidth = 5;
        roundedRect(-hw + 4, -hh + 4, bw - 8, bh - 8, 4); ctx.stroke();

        ctx.fillStyle = "#c5dde8";
        roundedRect(-hw + 8, -hh + 8, 20, 12, 3); ctx.fill();

        ctx.fillStyle = "rgba(160,220,255,0.55)";
        roundedRect(hw * 0.05, -hh + 10, bw * 0.32, bh * 0.28, 4); ctx.fill();

        ctx.fillStyle = "rgba(255,255,255,0.58)";
        ctx.font = "bold 11px Arial";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText("RESTO", 0, hh * 0.38);

        ctx.fillStyle = "rgba(255,255,255,0.12)";
        roundedRect(-hw + 6, -hh + 6, bw * 0.38, bh * 0.28, 3); ctx.fill();

      } else if (btype === 2) {
        // TOKO — awning bergaris
        ctx.fillStyle = roofColor;
        roundedRect(-hw, -hh, bw, bh, 5); ctx.fill();
        ctx.strokeStyle = shadeColor(roofColor, -22); ctx.lineWidth = 2; ctx.stroke();

        const stripeH = bh * 0.36, sw = bw / 6;
        const altCol = shadeColor(roofColor, 50);
        for (let s = 0; s < 6; s++) {
          ctx.fillStyle = s % 2 === 0 ? roofColor : altCol;
          ctx.fillRect(-hw + s * sw, -hh, sw, stripeH);
        }
        ctx.strokeStyle = shadeColor(roofColor, -30); ctx.lineWidth = 2;
        ctx.strokeRect(-hw, -hh, bw, stripeH);

        const gBack = ctx.createLinearGradient(0, -hh + stripeH, 0, hh);
        gBack.addColorStop(0, shadeColor(roofColor, 15));
        gBack.addColorStop(1, shadeColor(roofColor, -10));
        ctx.fillStyle = gBack;
        ctx.fillRect(-hw, -hh + stripeH, bw, bh - stripeH);

        ctx.fillStyle = "rgba(255,255,255,0.62)";
        ctx.font = "bold 11px Arial";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText("TOKO", 0, hh * 0.42);

      } else {
        // KANTOR — panel surya
        const gOff = ctx.createLinearGradient(-hw, -hh, hw, hh);
        gOff.addColorStop(0, "#b0bec5"); gOff.addColorStop(1, "#78909c");
        ctx.fillStyle = gOff;
        roundedRect(-hw, -hh, bw, bh, 4); ctx.fill();
        ctx.strokeStyle = "#546e7a"; ctx.lineWidth = 2.5; ctx.stroke();

        const pW = (bw - 16) / 3, pH = (bh - 16) / 2;
        for (let px2 = 0; px2 < 3; px2++) {
          for (let py2 = 0; py2 < 2; py2++) {
            const pg = ctx.createLinearGradient(-hw + 8 + px2 * pW, -hh + 8 + py2 * pH, -hw + 8 + (px2+1)*pW, -hh + 8 + (py2+1)*pH);
            pg.addColorStop(0, "#1a237e"); pg.addColorStop(0.5, "#283593"); pg.addColorStop(1, "#3949ab");
            ctx.fillStyle = pg;
            roundedRect(-hw + 8 + px2 * pW + 1, -hh + 8 + py2 * pH + 1, pW - 3, pH - 3, 2);
            ctx.fill();
            ctx.strokeStyle = "rgba(255,255,255,0.15)"; ctx.lineWidth = 1; ctx.stroke();
          }
        }
        ctx.fillStyle = "#90a4ae";
        roundedRect(hw - 14, -hh + 3, 10, 13, 2); ctx.fill();
      }

      ctx.restore();

      // Garis penghubung bangunan ke node (tiang kecil)
      ctx.save();
      ctx.strokeStyle = "rgba(60,40,20,0.35)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(ox + hw, oy + hh);
      ctx.lineTo(cx, cy - 18);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // Titik node (lingkaran + label huruf)
      ctx.fillStyle = "rgba(0,0,0,.22)";
      ctx.beginPath();
      ctx.arc(cx + 3, cy + 4, 20, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#111111";
      ctx.beginPath();
      ctx.arc(cx, cy, 18, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "#ffe600";
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 16px Segoe UI";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(id, cx, cy + 1);
    }

function drawRouteNodes() {
      Object.keys(nodes).forEach(id => {
        const p = nodes[id];
        drawNodeBuilding(
          p.x, p.y,
          nodeBuildingType[id],
          nodeBuildingRoof[id],
          nodeBuildingColor[id],
          id
        );
      });
    }

function drawPlaceLabels() {
      drawPlaceBox(nodes.A.x + 25, nodes.A.y - 62, "Cooler City Central Kencana");
      drawPlaceBox(nodes.F.x + 25, nodes.F.y + 32, "Momoyo / Jl. D.I. Panjaitan");
    }

function drawPlaceBox(x, y, text) {
      ctx.save();
      ctx.fillStyle = "rgba(255,250,240,.95)";
      roundedRect(x, y, 270, 34, 12);
      ctx.fill();
      ctx.strokeStyle = "rgba(80,58,35,.15)";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = "#24313a";
      ctx.font = "bold 16px Segoe UI";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(text, x + 12, y + 17);
      ctx.restore();
    }

function drawFloatingParticles() {
      ctx.save();
      ctx.globalAlpha = 0.55;
      for (let i = 0; i < 30; i++) {
        const x = ((i * 173 + windTime * 0.015) % MAP_W);
        const y = 160 + ((i * 97 + Math.sin(windTime * 0.001 + i) * 30) % 1100);
        ctx.fillStyle = i % 3 === 0 ? "#fff4b8" : (i % 3 === 1 ? "#ffffff" : "#ffd36b");
        ctx.beginPath();
        ctx.arc(x, y, 3 + (i % 3), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

function draw() {
      ctx.clearRect(0, 0, wrap.clientWidth, wrap.clientHeight);

      ctx.save();
      ctx.translate(offsetX, offsetY);
      ctx.scale(zoom, zoom);

      drawBackground();
      drawParks();
      drawRoads();
      drawBuildings();
      drawTrees();
      drawRouteGraph();
      drawFloatingParticles();
      drawCar();

      ctx.restore();

      document.getElementById("zoomText").innerText = Math.round(zoom * 100) + "%";
    }
