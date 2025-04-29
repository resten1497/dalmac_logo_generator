// 상수 정의
const COLORS = {
  background: "#BF1A20",
  textWhite: "white",
  textHighlight: "#C32534",
  alcBackground: "yellow",
  alcBorder: "#F2C235",
};
const FONTS = {
  title: "Gmarket",
  subtitle: "Acumin",
};
const DIMENSIONS = {
  canvasHeight: 350,
  alcWidth: 242 * 0.6,
  alcHeight: 42 * 0.7,
};

// 캔버스 초기화
const canvas = new fabric.Canvas("myCanvas", {
  backgroundColor: "white",
  selection: false,
});

let items = {
  type: 1,
  title: "조조조조조조조조조조조",
  sub_title: "CCCCCCCCCCCCCCCCCCCCCCCCCCC",
  ibu: 3,
  country: "Belgium",
  discount: 3,
  alc: "4.0%",
  style: "Pastry Imperial Stout",
  character: "블랙베리 / Blackberry",
  price: "7,500 원",
};

// 배경 추가
const Background = new fabric.Rect({
  width: canvas.width,
  height: DIMENSIONS.canvasHeight,
  fill: COLORS.background,
  selectable: false,
});
canvas.add(Background);

// 텍스트 추가 함수
function addText(content, options) {
  const text = new fabric.Text(content, {
    ...options,
    selectable: false,
  });
  if (text.text.length > 20) {
    text.set({ scaleX: 0.8 });
  }
  canvas.add(text);
  return text;
}

// 텍스트 추가 함수
function addKRText(content, options) {
  const text = new fabric.Text(content, {
    ...options,
    selectable: false,
  });
  if (text.text.length > 7) {
    text.set({ scaleX: 0.75 });
  }
  if (text.text.length > 9) {
    text.set({ scaleX: 0.6 });
  }
  canvas.add(text);
  return text;
}
// 이미지 추가 함수
function addImage(url, options) {
  fabric.Image.fromURL(url, function (img) {
    img.set({ ...options, selectable: false });
    canvas.add(img);
  });
}
function addFlagImage(url, options) {
  fabric.Image.fromURL(url, function (img) {
    console.log(img.height);
    img.set({
      left: 30,
      top: 235,
      scaleX: 1.7,
      scaleY: 1.7,
      selectable: false,
      stroke: "black",
      strokeWidth: 0.1,
    });
    canvas.add(img);
  });
}
// 텍스트 추가
document.fonts.load("50px Gmarket").then(() => {
  addKRText(items.title, {
    left: 40,
    top: 40,
    charSpacing: -40,
    fontFamily: FONTS.title,
    fontSize: 80,
    fill: COLORS.textWhite,
    fontWeight: "bold",
  });

  addText(items.price, {
    left: 420,
    top: 365,
    fontFamily: FONTS.title,
    fontSize: 60,
    fill: COLORS.textHighlight,
    fontWeight: "bold",
  });
});

addText(items.sub_title, {
  left: 45,
  top: 125,
  fontFamily: FONTS.subtitle,
  fontSize: 50,
  fill: COLORS.textWhite,
  fontWeight: "bold",
});

// 이미지 추가
addImage("./assets/logo/three.png", { left: canvas.width - 150, top: 30 });
addFlagImage("./assets/flag/be.png");

function changeTop(img) {
  console.log(img);
}

// IBU 섹션
const IBU_Rect = new fabric.Rect({
  left: 176,
  top: 236,
  width: 242,
  height: 42,
  opacity: 0.2,
  fill: COLORS.textWhite,
  selectable: false,
});
canvas.add(IBU_Rect);

addText("IBU", {
  left: IBU_Rect.left + 15,
  top: IBU_Rect.top + 8,
  fontFamily: FONTS.subtitle,
  fontSize: 25,
  fill: COLORS.textWhite,
  fontWeight: "bold",
});

// 홉 이미지 반복 추가
function addHopImages(baseLeft, top, count, spacing, scale, opacity = 1) {
  for (let i = 0; i < 5; i++) {
    addImage("./assets/logo/hop.png", {
      left: baseLeft + i * spacing,
      top: top,
      scaleX: scale,
      scaleY: scale,
      opacity: i < count ? 1 : opacity,
    });
  }
}
addHopImages(IBU_Rect.left + 80, IBU_Rect.top + 5, items.ibu, 30, 1.3, 0.4);

// ALC 섹션
const ALC_Rect = new fabric.Rect({
  left: 424,
  top: 236,
  width: 242,
  height: 42,
  opacity: 0.2,
  fill: COLORS.textWhite,
  selectable: false,
});
canvas.add(ALC_Rect);

const ALC_BACKGROUND = new fabric.Rect({
  left: ALC_Rect.left + 85,
  top: ALC_Rect.top + 6,
  width: DIMENSIONS.alcWidth,
  height: DIMENSIONS.alcHeight,
  fill: COLORS.alcBackground,
  stroke: COLORS.alcBorder,
  selectable: false,
});
canvas.add(ALC_BACKGROUND);

addText("ALC", {
  left: ALC_Rect.left + 15,
  top: ALC_Rect.top + 8,
  fontFamily: FONTS.subtitle,
  fontSize: 25,
  fill: COLORS.textWhite,
  fontWeight: "bold",
});

addText(items.alc, {
  left: ALC_BACKGROUND.left + 45.3,
  top: ALC_BACKGROUND.top + 2,
  fontFamily: FONTS.subtitle,
  fontSize: 23,
  fill: "black",
  fontWeight: "bold",
});

const STYLE_Rect = new fabric.Rect({
  left: 176,
  top: 281,
  width: 242,
  height: 42,
  opacity: 0.2,
  fill: COLORS.textWhite,
  selectable: false,
});

const STYLE = new fabric.Text(items.style, {
  left: STYLE_Rect.left + 15,
  top: STYLE_Rect.top + 8,
  fontFamily: FONTS.subtitle,
  fontSize: 23,
  fill: COLORS.textWhite,
  fontWeight: "bold",
});
canvas.add(STYLE_Rect, STYLE);

const CHARACTER_Rect = new fabric.Rect({
  left: 424,
  top: 281,
  width: 242,
  height: 42,
  opacity: 0.2,
  fill: COLORS.textWhite,
  selectable: false,
});

const CHARACTER = new fabric.Text(items.character, {
  left: CHARACTER_Rect.left + 15,
  top: CHARACTER_Rect.top + 8,
  fontFamily: FONTS.subtitle,
  fontSize: 23,
  fill: COLORS.textWhite,
  fontWeight: "bold",
});
canvas.add(CHARACTER_Rect, CHARACTER);

// 다운로드 함수
function downloadImage() {
  const base64 = canvas.toDataURL({ format: "jpeg", quality: 1.0 });
  const exifObj = {
    "0th": {
      282: [300, 1],
      283: [300, 1],
      296: 2,
    },
  };
  const exifBytes = piexif.dump(exifObj);
  const newData = piexif.insert(exifBytes, base64);

  const link = document.createElement("a");
  link.download = "output.jpeg";
  link.href = newData;
  link.click();
}
