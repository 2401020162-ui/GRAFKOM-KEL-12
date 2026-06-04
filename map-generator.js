// ======================================================
// Anggota 2    : Nabiilah Rifa Musyifa
// Bagian       : Map Generator & Data Spasial 
// Tugas        : Membuat peta dengan jalan, bangunan, taman, pohon, bunga, dan lampu jalan secara acak namun terstruktur.
// ======================================================

function createRoad(points, type = "main", name = "") {
      roads.push({ points, type, name });
    }

function makeMap() {
      roads = [];
      buildings = [];
      parks = [];
      trees = [];
      flowers = [];
      lightSpots = [];

      nodes = {
        A: { x: 1685, y: 250, name: "Cooler City Central Kencana", road: "Jl. Tanjung Uban Lama" },
        B: { x: 1535, y: 445, name: "Simpang atas", road: "Jl. Tanjung Uban Lama" },
        C: { x: 1450, y: 540, name: "Simpang utama", road: "Jl. Tanjung Uban Lama" },

        D: { x: 1545, y: 760, name: "Jalur kanan", road: "Jalan kanan" },
        E: { x: 1430, y: 990, name: "Belokan bawah kanan", road: "Jalan Hang Lekir" },
        F: { x: 620, y: 1160, name: "Momoyo Ice Cream", road: "Jl. D.I. Panjaitan" },

        G: { x: 1120, y: 520, name: "Mie Gacoan", road: "Jalur kiri" },
        H: { x: 1140, y: 800, name: "Jalur kiri bawah", road: "Jalur kiri" },
        I: { x: 1285, y: 970, name: "Simpang bawah", road: "Jalan penghubung" },

        J: { x: 1345, y: 685, name: "Jalur tengah atas", road: "Jalan Sakura" },
        K: { x: 1300, y: 835, name: "Jalur tengah bawah", road: "Jalan Teratai" }
      };

      graphEdges = [
        ["A", "B"], ["B", "C"],

        ["C", "D"], ["D", "E"], ["E", "I"], ["I", "F"],

        ["C", "G"], ["G", "H"], ["H", "I"],

        ["C", "J"], ["J", "K"], ["K", "I"]
      ];

      routes = {
        utama: ["A", "B", "C", "D", "E", "I", "F"],
        kiri: ["A", "B", "C", "G", "H", "I", "F"],
        tengah: ["A", "B", "C", "J", "K", "I", "F"]
      };

      activeRoute = routes[activeRouteKey];

      createRoad([
        { x: 1880, y: 120 }, { x: 1750, y: 200 }, { x: 1685, y: 250 },
        { x: 1590, y: 370 }, { x: 1535, y: 445 }, { x: 1450, y: 540 }
      ], "main", "Jl. Tanjung Uban Lama");

      createRoad([
        { x: 220, y: 1210 }, { x: 420, y: 1190 }, { x: 620, y: 1160 },
        { x: 920, y: 1140 }, { x: 1230, y: 1110 }, { x: 1460, y: 1070 },
        { x: 1800, y: 1160 }
      ], "main", "Jl. D.I. Panjaitan");

      createRoad([nodes.C, nodes.D, nodes.E, nodes.I, nodes.F], "main", "Jalur kanan");
      createRoad([nodes.C, nodes.G, nodes.H, nodes.I, nodes.F], "main", "Jalur lewat Gacoan");
      createRoad([nodes.C, nodes.J, nodes.K, nodes.I], "main", "Jalur tengah");

      createRoad([
        { x: 310, y: 330 }, { x: 520, y: 420 }, { x: 780, y: 560 },
        { x: 960, y: 720 }, { x: 1140, y: 800 }
      ], "secondary", "Jalan lokal");

      createRoad([
        { x: 430, y: 160 }, { x: 540, y: 380 }, { x: 680, y: 640 },
        { x: 720, y: 940 }, { x: 880, y: 1330 }
      ], "secondary", "Jalan lokal");

      createRoad([
        { x: 1900, y: 140 }, { x: 1780, y: 360 }, { x: 1740, y: 620 },
        { x: 1810, y: 900 }, { x: 1760, y: 1210 }
      ], "secondary", "Jalan lokal");

      for (let i = 0; i < 10; i++) {
        const startX = rand(240, 1850);
        const startY = rand(180, 1230);
        createRoad([
          { x: startX, y: startY },
          { x: startX + rand(-160, 160), y: startY + rand(90, 190) },
          { x: startX + rand(-240, 240), y: startY + rand(210, 350) }
        ], "secondary", "Jalan lokal");
      }

      for (let i = 0; i < 7; i++) {
        parks.push({
          x: rand(220, 1750),
          y: rand(200, 1120),
          w: rand(170, 320),
          h: rand(120, 230),
          r: rand(25, 42)
        });
      }

      const buildingColors = ["#ffe6b3", "#ffd0a7", "#dceeff", "#f6e0b8", "#d7f2ff", "#ffd9c7", "#fff2c7"];

      // Kumpulkan semua segmen jalan untuk cek tabrakan
      function getRoadSegments() {
        const segs = [];
        roads.forEach(road => {
          for (let si = 0; si < road.points.length - 1; si++) {
            segs.push({ a: road.points[si], b: road.points[si + 1], type: road.type });
          }
        });
        return segs;
      }

      function ptSegDist(px, py, ax, ay, bx2, by2) {
        const dx = bx2 - ax, dy = by2 - ay;
        const lenSq = dx * dx + dy * dy;
        if (lenSq === 0) return Math.hypot(px - ax, py - ay);
        let t = ((px - ax) * dx + (py - ay) * dy) / lenSq;
        t = Math.max(0, Math.min(1, t));
        return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
      }

      function tooCloseToRoad(bx, by, bw, bh, segs) {
        const margin = 85;
        const checks = [
          [bx, by], [bx + bw, by], [bx, by + bh], [bx + bw, by + bh],
          [bx + bw/2, by + bh/2], [bx + bw/2, by], [bx + bw/2, by + bh],
          [bx, by + bh/2], [bx + bw, by + bh/2]
        ];
        for (const seg of segs) {
          const roadHalfW = seg.type === "main" ? 52 : 34;
          const minDist = roadHalfW + margin;
          for (const [px, py] of checks) {
            if (ptSegDist(px, py, seg.a.x, seg.a.y, seg.b.x, seg.b.y) < minDist) return true;
          }
        }
        return false;
      }

      function overlapsBuilding(bx, by, bw, bh, placed) {
        const gap = 50;
        for (const p of placed) {
          if (bx < p.x + p.w + gap && bx + bw + gap > p.x &&
              by < p.y + p.h + gap && by + bh + gap > p.y) return true;
        }
        return false;
      }

      const roofColors = {
        house:  ["#c0392b","#e74c3c","#922b21","#7b241c","#b03a2e","#8b4513","#a0522d"],
        resto:  ["#e67e22","#d35400","#f39c12","#ca6f1e","#dc7633","#ba4a00","#f0a500"],
        shop:   ["#2e86c1","#1a5276","#117a65","#1e8449","#7d6608","#6e2f7c","#922b21"],
        office: ["#717d7e","#5d6d7e","#2e4057","#4a235a","#1a5276","#154360","#0e6655"],
      };

      const roadSegs = getRoadSegments();
      let bAttempts = 0, bPlaced = 0;
      while (bPlaced < 52 && bAttempts < 6000) {
        bAttempts++;
        const w = rand(70, 125);
        const h = rand(60, 110);
        const x = rand(120, MAP_W - 220);
        const y = rand(100, MAP_H - 150);

        if (tooCloseToRoad(x, y, w, h, roadSegs)) continue;
        if (overlapsBuilding(x, y, w, h, buildings)) continue;

        const btype = Math.floor(rand(0, 4)); // 0=house,1=resto,2=shop,3=office
        const roofKey = ["house","resto","shop","office"][btype];
        buildings.push({
          x, y, w, h,
          rot: 0,
          color: randomColor(buildingColors),
          roof: randomColor(roofColors[roofKey]),
          btype
        });
        bPlaced++;
      }

      for (let i = 0; i < 155; i++) {
        trees.push({
          x: rand(80, MAP_W - 80),
          y: rand(80, MAP_H - 80),
          r: rand(9, 22),
          tilt: rand(-0.35, 0.35)
        });
      }

      for (let i = 0; i < 220; i++) {
        flowers.push({
          x: rand(40, MAP_W - 40),
          y: rand(70, MAP_H - 70),
          s: rand(2, 5.2),
          c: randomColor(["#ff8fb3", "#ffd84f", "#ffb36b", "#9fd7ff", "#ffffff", "#ff6f61", "#f472b6"])
        });
      }

      for (let i = 0; i < 16; i++) {
        lightSpots.push({
          x: rand(120, MAP_W - 120),
          y: rand(120, MAP_H - 120),
          r: rand(85, 180)
        });
      }

      vehicleSegment = 0;
      vehicleT = 0;
      totalDistance = 0;

      document.getElementById("roadInfo").innerText = roads.length;
      document.getElementById("buildingInfo").innerText = buildings.length;
      document.getElementById("positionInfo").innerText = "Node A";
      document.getElementById("distanceInfo").innerText = "0 m";
    }
