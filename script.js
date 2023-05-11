// wenn keine Wlan verbindung dann return oder maby offline mode für color..

let color = [0, 0, 0];
let sum = 0;
while (sum < 255) {
  color = [
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256)
  ];
  sum = color.reduce((acc, val) => acc + val);
}

WebFont.load({
  google: {
    families: ['Bebas Neue']
  },
  active: function() {
    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;

    // Fill canvas with random color circle
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = "rgb(" + color[0] + ", " + color[1] + ", " + color[2] + ")";
    ctx.beginPath();
    ctx.arc(canvas.width/2, canvas.height/2, canvas.width/2, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();

    // Add letter A in the middle
    ctx.fillStyle = 'black';
    ctx.font = 'bold 72px "Bebas Neue", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic'; // change textBaseline to "alphabetic"
    ctx.fillText('A', canvas.width/2, canvas.height/2 + 25);

    // Set favicon
    const dataUrl = canvas.toDataURL('image/png');
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.href = dataUrl;
    document.head.appendChild(favicon);
  }
});


const title = document.getElementById("title");
const copyright = document.getElementById("copyright");
title.style.color = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
copyright.style.color = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";

const hoverDefault = "rgb(0, 0, 0)";
const hover = "rgb(" + color[0] + ", " + color[1] + ", " + color[2] + ")";
const hoverNeighbour = "rgb(" + color[0] / 4 + ", " + color[1] / 4 + ", " + color[2] / 4 + ")";

const downloads = document.getElementById("axotris");
const footerElement = document.querySelector('footer');

downloads.style.background = "linear-gradient(to bottom, black, rgb(" + color[0] + "," + color[1] + "," + color[2] + "))";
footerElement.style.background = "linear-gradient(to bottom, rgb(" + color[0] + "," + color[1] + "," + color[2] + "), black)";


// Execute this code when the site is loaded
const loadingScreen = document.getElementById("loadingScreen");
window.onload = generate, loadingScreen.classList.add("loadingScreenHidden");

// Execute this code when the user resizes the window
window.onresize = generate;

function generate() {
  // Background Stuff

  const width = window.innerWidth;
  const height = window.innerHeight;

  // Remove existing SVG element if present
  d3.select("svg").remove();

  const svg = d3
    .select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const points = d3.range(300).map(function () {
    return [Math.random() * width, Math.random() * height];
  });

  const voronoi = d3.Delaunay.from(points).voronoi([0, 0, width, height]);

  const triangle = svg
    .selectAll("path")
    .data(voronoi.cellPolygons())
    .enter()
    .append("path")
    .attr("d", function (d) {
      return "M" + d.join("L") + "Z";
    })
    .attr("fill", "black")
    .attr("stroke", "none");

  svg.on("mousemove", function (event) { // Mach das permanent weil grad is scuffed
    // Find the index of the currently hovered shape
    const index = triangle.nodes().findIndex((node) =>
      d3.polygonContains(node.__data__, d3.pointer(event))
    );

    // Set the fill color of all shapes to the gradient except for the hovered shape
    const neighbors = Array.from(voronoi.neighbors(index) || []);
    triangle.attr("fill", function (d, i) {
      if (i === index) {
        return hover;
      } else if (index >= 0 && neighbors.includes(i)) {
        const x = event.pageX / width;
        const y = event.pageY / height;
        const gradient = svg
          .append("defs")
          .append("linearGradient")
          .attr("id", "fade-" + i)
          .attr("x1", x)
          .attr("y1", y)
          .attr("x2", 1 - x)
          .attr("y2", 1 - y);
        gradient
          .append("stop")
          .attr("offset", "0%")
          .attr("stop-color", hoverDefault)
          .attr("stop-opacity", "1");
        gradient
          .append("stop")
          .attr("offset", "100%")
          .attr("stop-color", hoverNeighbour)
          .attr("stop-opacity", "1");
        return "url(#fade-" + i + ")";
      } else {
        return hoverDefault;
      }
    });
  });
}

document.addEventListener("keydown", function(event) {
  if (event.key === "r") {
    generate();
  }
});


const cursor = document.querySelector('html');

window.addEventListener('mousemove', e => {
  const y = e.pageY;

  if (y < window.innerHeight) {
    cursor.style.cursor = 'none';
  } else {
    cursor.style.cursor = 'default';
  }
});
