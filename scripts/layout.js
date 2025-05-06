function generateImage(canvas, row) {
  // 상수 정의
  const COLORS = {
    background: setBackgroundColorType(row.type),
    textWhite: getFontColor(row.type),
    backgroundRect: "white",
    textHighlight: "#C32534",
    alcBackground: "yellow",
    alcBorder: "#F2C235",
  };

  function setBackgroundColorType(type) {
    switch (type) {
      case 1:
        return "#BF1A20"; //White
        break;
      case 2:
        return "#F2801F";
        break;
      case 3:
        return "#ECBF15";
        break;

      case 4:
        return "#6BB93C";
        break;
      case 5:
        return "#0C5F2C"; // White
        break;

      case 6:
        return "#133575"; // White
        break;

      case 7:
        return "#1375AD"; // White
        break;
      case 8:
        return "#4F2684"; // White
        break;
    }
  }

  function getFontColor(type) {
    if (type === 1 || type === 5 || type === 6 || type === 7 || type === 8) {
      return "white";
    }
    if (type === 2 || type === 3 || type === 4) {
      return "black";
    }
  }
  const FONTS = {
    title: "Gmarket",
    subtitle: "Acumin",
    price: "Typo",
  };
  const DIMENSIONS = {
    canvasHeight: 380,
    alcWidth: 242 * 0.65,
    alcHeight: 42 * 0.7,
  };

  const RectSIZE = {
    width: 260,
    height: 50,
  };
  // 배경 추가
  const Background = new fabric.Rect({
    width: canvas.width,
    height: DIMENSIONS.canvasHeight,
    fill: COLORS.background,
    selectable: false,
  });
  canvas.add(Background);
  function scaleObjectToWidth(obj, targetWidth) {
    if (!obj || !targetWidth || obj.width === 0) return;
    obj.scaleX = targetWidth / obj.width;
  }
  // 텍스트 추가 함수
  function addText(content, options) {
    const text = new fabric.Text(content, {
      ...options,
      selectable: false,
    });
    if (text.text.length > 10) {
      text.set({ scaleX: 0.83 });
    }
    canvas.add(text);
    return text;
  }
  function addRectText(content, options) {
    const text = new fabric.Text(content, {
      ...options,
      selectable: false,
    });
    scaleObjectToWidth(text, 240);
    if (text.text.length < 16) {
      text.set({ scaleX: 0.9 });
    }
    canvas.add(text);
    return text;
  }
  function addEnglishText(content, options) {
    const text = new fabric.Text(content, {
      ...options,
      selectable: false,
    });
    scaleObjectToWidth(text, 650);
    if (text.text.length < 19) {
      text.set({ scaleX: 1 });
    }
    canvas.add(text);
    return text;
  }
  function addPriceText(content, options) {
    const text = new fabric.Text(content, {
      ...options,
      selectable: false,
    });

    text.set({ left: canvas.width - text.width - 50 });

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
      img.set({
        left: 50,
        top: 260,

        selectable: false,
        stroke: "black",
        strokeWidth: 0.1,
      });
      canvas.add(img);
    });
  }
  function addKRText(content, options) {
    const text = new fabric.Text(content, {
      ...options,
      selectable: false,
    });
    scaleObjectToWidth(text, 600);
    if (text.text.length < 6) {
      text.set({ scaleX: 1 });
    }
    canvas.add(text);
    return text;
  }
  // 텍스트 추가
  document.fonts.load("50px Gmarket").then(() => {
    addKRText(row.BeerName, {
      left: 40,
      top: 50,
      charSpacing: -40,
      fontFamily: FONTS.title,
      fontSize: 100,
      fill: COLORS.textWhite,
      fontWeight: "bold",
    });
  });
  document.fonts.load("50px Typo").then(() => {
    addPriceText(Number(row.price).toLocaleString() + " 원", {
      top: 394,
      fontFamily: FONTS.price,
      fontSize: 80,
      charSpacing: -40,
      fill: COLORS.textHighlight,
      fontWeight: "bold",
    });
  });

  addEnglishText(row.EnglishName, {
    left: 45,
    top: 170,
    fontFamily: FONTS.subtitle,
    fontSize: 60,
    fill: COLORS.textWhite,
    fontWeight: "bold",
  });

  if (row.Discount == 2) {
    addImage("./assets/logo/two.png", {
      left: canvas.width - 140,
      top: 40,
      scaleX: 1.2,
      scaleY: 1.2,
    });
  }
  if (row.Discount == 3) {
    addImage("./assets/logo/three.png", {
      left: canvas.width - 140,
      top: 40,
      scaleX: 1.2,
      scaleY: 1.2,
    });
  }
  if (row.Discount == 4) {
    addImage("./assets/logo/four.png", {
      left: canvas.width - 140,
      top: 40,
      scaleX: 1.2,
      scaleY: 1.2,
    });
  }
  // 이미지 추가

  addFlagImage("./assets/flag/" + getCountryCode(row.country) + ".png");

  // IBU 섹션
  const IBU_Rect = new fabric.Rect({
    left: 206,
    top: 255,
    width: RectSIZE.width,
    height: RectSIZE.height,
    opacity: 0.2,
    fill: COLORS.backgroundRect,
    selectable: false,
  });
  canvas.add(IBU_Rect);

  addText("IBU", {
    left: IBU_Rect.left + 10,
    top: IBU_Rect.top + 11,
    fontFamily: FONTS.subtitle,
    fontSize: 28,
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
  addHopImages(IBU_Rect.left + 90, IBU_Rect.top + 8, row.IBU, 34, 1.4, 0.4);

  // ALC 섹션
  const ALC_Rect = new fabric.Rect({
    left: 470,
    top: 255,
    width: RectSIZE.width,
    height: RectSIZE.height,
    opacity: 0.2,
    fill: COLORS.backgroundRect,
    selectable: false,
  });
  canvas.add(ALC_Rect);

  const ALC_BACKGROUND = new fabric.Rect({
    left: ALC_Rect.left + 85,
    top: ALC_Rect.top + 11,
    width: DIMENSIONS.alcWidth,
    height: DIMENSIONS.alcHeight,
    fill: COLORS.alcBackground,
    stroke: COLORS.alcBorder,
    selectable: false,
  });
  canvas.add(ALC_BACKGROUND);

  addText("ALC", {
    left: ALC_Rect.left + 12,
    top: ALC_Rect.top + 11,
    fontFamily: FONTS.subtitle,
    fontSize: 28,
    fill: COLORS.textWhite,
    fontWeight: "bold",
  });

  addText(row.ALC.toFixed(1) + "%", {
    left: ALC_BACKGROUND.left + 50,
    top: ALC_BACKGROUND.top + 2,
    fontFamily: FONTS.subtitle,
    fontSize: 23,
    fill: "black",
    fontWeight: "bold",
  });

  const STYLE_Rect = new fabric.Rect({
    left: 206,
    top: 310,
    width: RectSIZE.width,
    height: RectSIZE.height,
    opacity: 0.2,
    fill: COLORS.backgroundRect,
    selectable: false,
  });
  canvas.add(STYLE_Rect);
  addRectText(row.Style, {
    left: STYLE_Rect.left + 11,
    top: STYLE_Rect.top + 11,
    fontFamily: FONTS.subtitle,
    fontSize: 28,
    fill: COLORS.textWhite,
    fontWeight: "bold",
  });

  const CHARACTER_Rect = new fabric.Rect({
    left: 470,
    top: 310,
    width: RectSIZE.width,
    height: RectSIZE.height,
    opacity: 0.2,
    fill: COLORS.backgroundRect,
    selectable: false,
  });

  canvas.add(CHARACTER_Rect);

  addRectText(row.tasteNote, {
    left: CHARACTER_Rect.left + 10,
    top: CHARACTER_Rect.top + 11,
    fontFamily: FONTS.subtitle,
    fontSize: 28,
    fill: COLORS.textWhite,
    fontWeight: "bold",
  });

  const border = new fabric.Rect({
    left: 0,
    top: 0,
    width: canvas.width - 6,
    height: canvas.height - 6,
    fill: "",
    stroke: "#bbbbbb",
    strokeWidth: 6,
    selectable: false,
    evented: false,
    strokeUniform: true,
  });
  canvas.add(border);
  canvas.renderAll();
}
