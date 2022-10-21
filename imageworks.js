const { convert } = require("convert-svg-to-jpeg");
const fs = require("fs");

const renderSVG = async (bunkers, preview = false) => {
  const drawField = () => {
    // return `<rect width="600" height="750" y="-375" fill="#228b22" />`;
    return `<g>
        <rect width="600" height="750" y="-375" fill="#228b22" />
        <rect x="0" y="-375" width="600" height="750" filter="url(#noise)" />
        <defs>
          <filter id="noise" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence baseFrequency="0.5 0.05" result="NOISE" />
            <feDiffuseLighting in="noise" lighting-color="green" surface-scale="1.5" >
                <feDistantLight azimuth="180" elevation="65" />
            </feDiffuseLighting>
          </filter>
        </defs>
      </g>`;
    // //
  };
  const buildGrid = () => {
    let output = [];
    for (let i = 0; i <= 600; i = i + 50) {
      // vertical
      output = [...output, drawLine(i, -375, i, 375, "black")];
    }
    for (let i = -375; i <= 375; i = i + 50) {
      //horizontal
      output = [...output, drawLine(0, i, 600, i, "black")];
    }
    //center
    output = [...output, drawLine(0, 0, 600, 0, "white")];
    return output.join("");
  };

  const drawLine = (x1, y1, x2, y2, color) => {
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-opacity="0.75"/>`;
  };

  const drawBanners = () => {
    return `<g>
        <rect x="285" y="365" width="30" height="20" stroke="black" fill="blue" stroke-width="2"/>
        <rect x="285" y="-385" width="30" height="20" stroke="black" fill="blue" stroke-width="2"/>
      </g>`;
  };

  const drawBunker = (item) => {
    const { type, mirror, dimentions } = item;
    let points = item.points;
    let center = item.center;
    if (mirror) {
      points = points.map((p) => {
        return { x: p.x, y: p.y * -1 };
      });
      center = { x: center.x, y: center.y * -1 };
    }

    switch (type) {
      case "giantbrick":
        return `<g>
            <polygon
              points="${points[0].x},${points[0].y} ${points[1].x},${
          points[1].y
        } ${points[2].x},${points[2].y} ${points[3].x},${points[3].y}"
              fill="yellow" stroke="black" stroke-width="2" />
            <text
              x="${center.x - dimentions.length / 5}"
              y="${center.y + dimentions.width / 5}"
            >
              GB
            </text>
          </g>`;
      case "temple":
        return `<g>
            <polygon
              points="${points[0].x},${points[0].y} ${points[1].x},${
          points[1].y
        } ${points[2].x},${points[2].y} ${points[3].x},${points[3].y}"
              fill="yellow" stroke="black" stroke-width="2" />
            <text x="${center.x - dimentions.length / 5}" y="${
          center.y + dimentions.width / 5
        }" >
              T</text>
          </g>`;
      case "maya":
        return `<g>
            <polygon
              points="${points[0].x},${points[0].y} ${points[1].x},${
          points[1].y
        } ${points[2].x},${points[2].y} ${points[3].x},${points[3].y}"
              fill="yellow" stroke="black" stroke-width="2" />
            <text
              x="${center.x - dimentions.length / 5}"
              y="${center.y + dimentions.width / 5}"
            >
              M
            </text>
          </g>`;
      case "snake":
        return `<g>
            <polygon
              points="${points[0].x},${points[0].y} ${points[1].x},${points[1].y} ${points[2].x},${points[2].y} ${points[3].x},${points[3].y}"
              fill="yellow" stroke="black" stroke-width="2" />
          </g>`;
      case "can":
        return `<g>
            <circle cx="${center.x}" cy="${center.y}" r="${dimentions.radius}"
              stroke="black" fill="yellow" stroke-width="2" />
            <text
              x="${center.x - dimentions.length / 5}"
              y="${center.y + dimentions.width / 5}"
            >C</text>
          </g>`;
      case "tree":
        return `<g>
            <circle cx="${center.x}" cy="${center.y}" r="${dimentions.radius}"
              stroke="black" fill="yellow" stroke-width="2" />
            <text
              x="${center.x - dimentions.length / 5}"
              y="${center.y + dimentions.width / 5}"
            >T</text>
          </g>`;
      case "dorito":
        return `<g>
            <polygon
              points="${points[0].x},${points[0].y} ${points[1].x},${
          points[1].y
        } ${points[2].x},${points[2].y}"
              fill="yellow" stroke="black" stroke-width="2" />
            <polygon
              points="${points[0].x},${points[0].y} ${points[1].x},${
          points[1].y
        } ${points[2].x},${points[2].y}"
              fill="black" transform="translate(${center.x * 0.8} ${
          center.y * 0.8
        }) scale(0.2)" />
          </g>`;
      case "smalldorito":
        return `<g>
            <polygon
              points="${points[0].x},${points[0].y} ${points[1].x},${
          points[1].y
        } ${points[2].x},${points[2].y}"
              fill="yellow" stroke="black" stroke-width="2" />
            <polygon
              points="${points[0].x},${points[0].y} ${points[1].x},${
          points[1].y
        } ${points[2].x},${points[2].y}"
              fill="black" transform="translate(${center.x * 0.8} ${
          center.y * 0.8
        }) scale(0.2)" />
          </g>`;

      default:
        return;
      // break;
    }
  };

  const collectBunkers = () => {
    const arr = bunkers.map((b) => drawBunker(b));
    return arr.join("");
  };

  return `<svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -375 600 750"
      width="${preview ? 200 : 600}"
      height="${preview ? 250 : 750}"
      version="1.1"
    >
      ${drawField()}
      ${buildGrid()}
      ${drawBanners()}
      <g>${collectBunkers()}</g>
    </svg>`;
};

const renderJPG = async (image) => {
  const imageJPG = await convert(image);
  return imageJPG;
};

const makePreview = async (bunkers) => {
  const svgPic = await renderSVG(bunkers, true);
  const jpgPic = await renderJPG(svgPic);
  return jpgPic;
};

const savePreview = async (bunkers, fieldId) => {
  const svgPic = await renderSVG(bunkers, true);
  const jpgPic = await renderJPG(svgPic);
  fs.writeFile(`./images/preview${fieldId}.jpg`, jpgPic, {}, (error) => {
    if (error) console.log(error);
    else {
      console.log("File written successfully");
    }
  });
};

const getPreview = (id) => {
  try {
    const data = fs.readFileSync(`./images/preview${id}.jpg`);
    return "data:image/jpg;base64," + data.toString("base64");
  } catch (err) {
    console.error(err);
    return;
  }
};

const getImage = (id) => {
  try {
    const data = fs.readFileSync(`./images/${id}.jpg`);
    // return "data:image/jpg;base64," + data.toString("base64");
    return data;
  } catch (err) {
    console.error(err);
    return;
  }
};

module.exports = {
  renderSVG,
  renderJPG,
  savePreview,
  getPreview,
  makePreview,
  getImage,
};
