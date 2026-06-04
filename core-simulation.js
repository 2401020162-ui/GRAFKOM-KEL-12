// Anggota 5: Salsadilla Frisca Anjani
// Bagian: Main Engine Loop & State Controller
// Tugas: Mengatur animasi, state tombol, zoom, scroll, route, dan requestAnimationFrame

const canvas = document.getElementById("cityCanvas");
    const ctx = canvas.getContext("2d");
    const wrap = document.getElementById("canvasWrap");

    const MAP_W = 2200;
    const MAP_H = 1500;

    let roads = [];
    let buildings = [];
    let parks = [];
    let trees = [];
    let flowers = [];
    let lightSpots = [];

    let nodes = {};
    let graphEdges = [];
    let routes = {};
    let activeRouteKey = "utama";
    let activeRoute = [];

    let zoom = 0.58;
    let offsetX = 0;
    let offsetY = 0;

    let isRunning = false;
    let lastTime = 0;
    let vehicleSegment = 0;
    let vehicleT = 0;
    let totalDistance = 0;
    let vehicleSpeed = 0.000140;
    let windTime = 0;

    let isDragging = false;
    let lastMouseX = 0;
    let lastMouseY = 0;

function resizeCanvas() {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(wrap.clientWidth * dpr);
      canvas.height = Math.floor(wrap.clientHeight * dpr);
      canvas.style.width = wrap.clientWidth + "px";
      canvas.style.height = wrap.clientHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (offsetX === 0 && offsetY === 0) {
        centerMap();
      }

      draw();
    }

function centerMap() {
      offsetX = (wrap.clientWidth - MAP_W * zoom) / 2;
      offsetY = (wrap.clientHeight - MAP_H * zoom) / 2;
    }

function rand(min, max) {
      return Math.random() * (max - min) + min;
    }

function randomColor(colors) {
      return colors[Math.floor(Math.random() * colors.length)];
    }

function distance(a, b) {
      return Math.hypot(b.x - a.x, b.y - a.y);
    }

function interpolate(a, b, t) {
      return {
        x: a.x + (b.x - a.x) * t,
        y: a.y + (b.y - a.y) * t
      };
    }

function node(id) {
      return nodes[id];
    }

function routeToPoints(route) {
      return route.map(id => node(id));
    }

function animate(time) {
      const dt = Math.min(time - lastTime, 50);
      lastTime = time;

      updateVehicle(dt);
      draw();

      requestAnimationFrame(animate);
    }

function toggleAnimation() {
      isRunning = !isRunning;

      document.getElementById("btnStart").innerText = isRunning ? "⏸ Pause Animasi" : "▶ Start Animasi";
      document.getElementById("runDot").className = isRunning ? "dot running" : "dot";
      document.getElementById("statusText").innerText = isRunning
        ? "Mobil bergerak mengikuti jalur yang dipilih."
        : "Animasi dijeda. Mobil berhenti.";
    }

function changeSpeed() {
      const select = document.getElementById("speedSelect");
      vehicleSpeed = Number(select.value);

      const text = select.options[select.selectedIndex].text.replace("Kecepatan: ", "");
      document.getElementById("speedText").innerText = text;
    }

function changeRoute() {
      activeRouteKey = document.getElementById("routeSelect").value;
      activeRoute = routes[activeRouteKey];

      vehicleSegment = 0;
      vehicleT = 0;
      totalDistance = 0;

      const routeLabel = activeRouteKey === "utama" ? "Jalur 1" : activeRouteKey === "kiri" ? "Jalur 2" : "Jalur 3";

      document.getElementById("routeInfo").innerText = routeLabel;
      document.getElementById("positionInfo").innerText = "Node A";
      document.getElementById("distanceInfo").innerText = "0 m";
      document.getElementById("statusText").innerText = routeLabel + " dipilih. Mobil akan bergerak mengikuti " + routeLabel + ".";
      draw();
    }

function randomMap() {
      makeMap();
      changeRoute();
      centerMap();
      draw();

      document.getElementById("statusText").innerText = "Map berhasil diacak. Node 3 jalur tetap berada pada rute utama.";
    }

function zoomIn() {
      zoom = Math.min(2.5, zoom + 0.15);
      draw();
    }

function zoomOut() {
      zoom = Math.max(0.35, zoom - 0.15);
      draw();
    }

function scrollMap(dx, dy) {
      offsetX += dx;
      offsetY += dy;
      draw();
    }

wrap.addEventListener("mousedown", e => {
      isDragging = true;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    });

    window.addEventListener("mouseup", () => {
      isDragging = false;
    });

    window.addEventListener("mousemove", e => {
      if (!isDragging) return;

      const dx = e.clientX - lastMouseX;
      const dy = e.clientY - lastMouseY;

      offsetX += dx;
      offsetY += dy;

      lastMouseX = e.clientX;
      lastMouseY = e.clientY;

      draw();
    });

    wrap.addEventListener("wheel", e => {
      e.preventDefault();

      const oldZoom = zoom;
      if (e.deltaY < 0) {
        zoom = Math.min(2.5, zoom + 0.1);
      } else {
        zoom = Math.max(0.35, zoom - 0.1);
      }

      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      offsetX = mouseX - ((mouseX - offsetX) / oldZoom) * zoom;
      offsetY = mouseY - ((mouseY - offsetY) / oldZoom) * zoom;

      draw();
    }, { passive: false });

    window.addEventListener("resize", resizeCanvas);

    makeMap();
    resizeCanvas();
    changeSpeed();
    changeRoute();
    requestAnimationFrame(animate);
