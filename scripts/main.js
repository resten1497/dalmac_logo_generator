document
  .getElementById("excelFile")
  .addEventListener("change", async function (e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = async function (evt) {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);

      await generateMergedA4Image(json);
    };

    reader.readAsArrayBuffer(file);
  });

// async function generateMergedA4Image(dataArray) {
//   const cellWidth = 786; // 약 794 / 3 - padding 고려
//   const cellHeight = 500;
//   const rows = 3;
//   const cols = Math.ceil(dataArray.length / rows);
//   const colsLimit = 6;
//   const itemsPerPage = rows * colsLimit;

//   const canvasWidth = 2480; // A4 width (px @ 96dpi)
//   const canvasHeight = 3508;

//   const mergedCanvas = document.createElement("canvas");
//   mergedCanvas.style.imageRendering = "crisp-edges";
//   mergedCanvas.width = canvasWidth;
//   mergedCanvas.height = canvasHeight;
//   const ctx = mergedCanvas.getContext("2d");

//   const imagePromises = dataArray.map((row) => createImageAsDataUrl(row));
//   const images = await Promise.all(imagePromises);
//   // 이미지 전체를 포함하는 블록의 너비/높이 계산
//   const totalWidth = rows * cellWidth + (rows - 1) * 10;
//   const totalHeight = cols * cellHeight + (cols - 1) * 10;

//   // 중앙 정렬을 위한 오프셋
//   const offsetX = (canvasWidth - totalWidth) / 2;
//   const offsetY = (canvasHeight - totalHeight) / 2;

//   images.forEach((dataURL, i) => {
//     const img = new Image();

//     img.src = dataURL;
//     const col = Math.floor(i / rows);
//     const row = i % rows;

//     img.onload = () => {
//       ctx.drawImage(
//         img,
//         offsetX + row * (cellWidth + 10),
//         col * (cellHeight + 10),
//         cellWidth,
//         cellHeight
//       );
//     };
//   });

//   document.getElementById("printBtn").style.display = "inline-block";
//   document.getElementById("printBtn").onclick = () => {
//     setTimeout(() => {
//       const dataUrl = mergedCanvas.toDataURL("image/png");

//       // 문서 구조 직접 구성

//       // 1. 기본 구조 생성
//       const html = document.createElement("html");
//       const head = document.createElement("head");
//       const body = document.createElement("body");

//       // 2. 스타일 추가
//       const style = document.createElement("style");
//       style.textContent = `
//       body { margin: 0; padding: 0; text-align: center; }
//       img { width: 100%; height: auto; }
//       `;
//       head.appendChild(style);

//       // 3. 이미지 요소 추가
//       const img = document.createElement("img");
//       img.src = dataUrl;

//       // 4. 전체 문서 구성
//       html.appendChild(head);
//       html.appendChild(body);
//       img.src = dataUrl;
//       body.appendChild(img);
//       html2pdf()
//         .set({ html2canvas: { scale: 10 } })
//         .from(html)
//         .save("output.pdf");
//     }, 500);
//   };
// }
async function generateMergedA4Image(dataArray) {
  const cellWidth = 786;
  const cellHeight = 500;
  const rows = 3;
  const colsLimit = 6;
  const itemsPerPage = rows * colsLimit;

  const canvasWidth = 2480;
  const canvasHeight = 3508;

  const imagePromises = dataArray.map((row) => createImageAsDataUrl(row));
  const images = await Promise.all(imagePromises);

  const pageCount = Math.ceil(images.length / itemsPerPage);

  // PDF에 넣을 HTML 래퍼 요소 생성
  const wrapper = document.createElement("div");
  wrapper.style.width = `${canvasWidth}px`;
  wrapper.style.height = "auto";
  wrapper.style.display = "flex";
  wrapper.style.flexDirection = "column";

  for (let pageIndex = 0; pageIndex < pageCount; pageIndex++) {
    const canvas = document.createElement("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.imageRendering = "crisp-edges";
    const ctx = canvas.getContext("2d");

    const start = pageIndex * itemsPerPage;
    const end = Math.min(start + itemsPerPage, images.length);
    const pageImages = images.slice(start, end);

    const pageCols = Math.ceil(pageImages.length / rows);
    const totalWidth = rows * cellWidth + (rows - 1) * 10;
    const totalHeight = pageCols * cellHeight + (pageCols - 1) * 10;
    const offsetX = (canvasWidth - totalWidth) / 2;
    const offsetY = (canvasHeight - totalHeight) / 2;

    await Promise.all(
      pageImages.map((dataURL, i) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = dataURL;
          img.onload = () => {
            const col = Math.floor(i / rows);
            const row = i % rows;
            ctx.drawImage(
              img,
              offsetX + row * cellWidth,
              offsetY + col * cellHeight,
              cellWidth,
              cellHeight
            );
            resolve();
          };
        });
      })
    );

    // canvas를 이미지로 변환하여 wrapper에 추가
    const imgEl = document.createElement("img");
    imgEl.src = canvas.toDataURL("image/png");
    imgEl.style.width = "100%";

    wrapper.appendChild(imgEl);
  }

  // 버튼 활성화 및 PDF 생성
  const printBtn = document.getElementById("printBtn");
  printBtn.style.display = "inline-block";
  printBtn.onclick = () => {
    html2pdf()
      .set({
        margin: 0,
        filename: "output.pdf",
        html2canvas: { scale: 3 },
        jsPDF: { unit: "px", format: [canvasWidth, canvasHeight] },
      })
      .from(wrapper)
      .save();
  };
}
function createImageAsDataUrl(row) {
  if (!row || Object.keys(row).length === 0) {
    console.error("row 데이터가 비어 있습니다:", row);
    return Promise.reject("Invalid row data: row is empty");
  }

  // 필수 속성 검증
  const requiredFields = [
    "type",
    "BeerName",
    "price",
    "EnglishName",
    "country",
    "IBU",
    "ALC",
    "Style",
    "tasteNote",
  ];
  for (const field of requiredFields) {
    if (
      row[field] == null || // null 또는 undefined
      (typeof row[field] === "string" && row[field].trim() === "")
    ) {
      console.error(`필수 필드가 누락되었습니다: ${field}`, row);
      return Promise.reject(`Invalid row data: Missing field ${field}`);
    }
  }

  return new Promise((resolve) => {
    // 배경 추가
    const canvas = new fabric.Canvas(null, {
      width: 786,
      height: 500,
      margin: 10,
      backgroundColor: "white",
      objectCaching: false,
    });
    generateImage(canvas, row);
    setTimeout(() => {
      const dataURL = canvas.toDataURL({
        format: "jpeg",
        quality: 1.0,
        multiplier: 4,
      });
      resolve(dataURL);
    }, 500);
  });
}
