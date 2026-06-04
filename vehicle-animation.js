// ======================================================
// Anggota 4: Vehicle Animation / Animasi Kendaraan
// File kontribusi untuk GitHub
// ======================================================

function getVehiclePosition() {
      const route = routeToPoints(activeRoute);
      const a = route[vehicleSegment];
      const b = route[(vehicleSegment + 1) % route.length];
      const p = interpolate(a, b, vehicleT);
      const angle = Math.atan2(b.y - a.y, b.x - a.x);

      return { ...p, angle };
    }

function drawCar() {
      const p = getVehiclePosition();

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);

      // Top-down motor: sumbu x = arah maju, y = kiri/kanan

      // Bayangan
      ctx.fillStyle = "rgba(40,28,10,0.22)";
      ctx.beginPath();
      ctx.ellipse(3, 3, 22, 9, 0, 0, Math.PI * 2);
      ctx.fill();

      // Roda belakang
      ctx.fillStyle = "#1a1a2e";
      ctx.beginPath();
      ctx.ellipse(-18, 0, 9, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#444";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Roda depan
      ctx.fillStyle = "#1a1a2e";
      ctx.beginPath();
      ctx.ellipse(18, 0, 9, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#444";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Bodi motor (body utama)
      const bodyGrad = ctx.createLinearGradient(-14, -5, 14, 5);
      bodyGrad.addColorStop(0, "#e53935");
      bodyGrad.addColorStop(0.5, "#ff5252");
      bodyGrad.addColorStop(1, "#b71c1c");
      ctx.fillStyle = bodyGrad;
      roundedRect(-14, -5, 28, 10, 5);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.4)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Tangki bensin (tengah bodi, sedikit lebih lebar)
      const tankGrad = ctx.createLinearGradient(-8, -6, 8, 6);
      tankGrad.addColorStop(0, "#ff5252");
      tankGrad.addColorStop(1, "#c62828");
      ctx.fillStyle = tankGrad;
      roundedRect(-9, -6, 18, 12, 4);
      ctx.fill();

      // Setang (handlebar) di depan
      ctx.strokeStyle = "#555";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(10, -9);
      ctx.lineTo(10, 9);
      ctx.stroke();

      // Kursi / sadel
      ctx.fillStyle = "#212121";
      roundedRect(-8, -4, 14, 8, 3);
      ctx.fill();

      // Lampu depan
      ctx.fillStyle = "#fff9c4";
      ctx.beginPath();
      ctx.ellipse(22, 0, 4, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#f9a825";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Lampu belakang (merah)
      ctx.fillStyle = "#e53935";
      ctx.beginPath();
      ctx.ellipse(-22, 0, 3, 2.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Highlight bodi
      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.beginPath();
      ctx.ellipse(2, -3, 7, 2.5, -0.2, 0, Math.PI * 2);
      ctx.fill();

      // Pengendara (helm bulat dari atas)
      ctx.fillStyle = "#37474f";
      ctx.beginPath();
      ctx.arc(3, 0, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 1;
      ctx.stroke();
      // Kaca helm
      ctx.fillStyle = "rgba(180,230,255,0.7)";
      ctx.beginPath();
      ctx.ellipse(5, 0, 3, 2.5, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

function updateVehicle(dt) {
      if (!isRunning) return;

      windTime += dt;
      vehicleT += vehicleSpeed * dt;

      if (vehicleT >= 1) {
        const route = routeToPoints(activeRoute);
        const a = route[vehicleSegment];
        const b = route[(vehicleSegment + 1) % route.length];

        totalDistance += distance(a, b);

        vehicleT = 0;
        vehicleSegment++;

        if (vehicleSegment >= route.length - 1) {
          vehicleSegment = 0;
          totalDistance = 0;
        }

        const nodeId = activeRoute[vehicleSegment];
        document.getElementById("positionInfo").innerText = "Node " + nodeId;
        document.getElementById("distanceInfo").innerText = Math.round(totalDistance) + " m";
      }
    }

function randomVehiclePosition() {
      const route = activeRoute;
      vehicleSegment = Math.floor(rand(0, route.length - 1));
      vehicleT = Math.random();
      totalDistance = 0;

      document.getElementById("positionInfo").innerText = "Node " + route[vehicleSegment];
      document.getElementById("distanceInfo").innerText = "0 m";
      document.getElementById("statusText").innerText = "Posisi mobil berhasil diacak pada jalur aktif.";
      draw();
    }
