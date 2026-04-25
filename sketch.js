let stage = 0;
const colors = ['#ffd6ff', '#e7c6ff', '#c8b6ff', '#b8c0ff', '#bbd0ff'];
const colors2 = ['#590d22', '#800f2f', '#a4133c', '#c9184a', '#ff4d6d', '#ff758f', '#ff8fa3', '#ffb3c1', '#ffccd5'];

function setup() {
	createCanvas(windowWidth, windowHeight);
	background('#f5ebe0');
}

function draw() {
	if (stage === 0) {
		// 第一階段：滑鼠畫筆功能
		let index = floor(map(mouseX, 0, width, 0, colors.length));
		index = constrain(index, 0, colors.length - 1);
		noStroke();
		fill(colors[index]);
		ellipse(mouseX, mouseY, 50, 50);
	} else if (stage === 1) {
		// 第二階段：格狀顏色動畫
		background('#f5ebe0'); // 改回與第一階段相同的背景色，視覺更統一

		// 在背景增加淡淡的白色亮點（星星）
		push();
		noStroke();
		randomSeed(50); // 固定隨機位置，讓星星不會隨每幀移動
		for (let k = 0; k < 100; k++) {
			let x = random(width);
			let y = random(height);
			let starSize = random(1, 3);
			// 閃爍效果：利用 noise 隨時間改變透明度
			fill(255, 255, 255, noise(k, frameCount * 0.03) * 150);
			ellipse(x, y, starSize);
		}
		pop();

		colorMode(HSB); // 色相:0-360，飽和度:0-100，亮度:0-100
		for (var i = 0; i < width; i += 50) {
			var h = map(i, 0, width, 0, 360);
			for (var j = 0; j < height; j += 50) {
				// 計算原始色相值
				let rawHue = (h + j + frameCount * 5) / 2 % 360;
				// 將 0-360 映射到 60 (黃色) ~ 330 (粉紅色)，避開紅色區域
				fill(map(rawHue, 0, 360, 60, 330), mouseY / 5, mouseX / 5);
				drawHeart(i, j, 50);
			}
		}
		colorMode(RGB); // 重設回 RGB 模式以正確繪製 UI 按鈕
	} else if (stage === 2) {
		// 第三階段：色彩漸變連線效果 (使用紅粉色系)
		if (mouseIsPressed) {
			const palette = colors2.map(c => color(c));

			const x1 = 40;
			const y1 = 40;
			const x2 = mouseX;
			const y2 = mouseY;

			noStroke();
			fill(palette[0]);
			ellipse(x1, y1, 60, 60);

			fill(palette[palette.length - 1]);
			ellipse(x2, y2, 60, 60);

			const d = dist(x1, y1, x2, y2);
			for (let i = 0; i < d; i++) {
				const step = map(i, 0, d, 0, 1);
				const x = lerp(x1, x2, step);
				const y = lerp(y1, y2, step);

				// 透過多重顏色插值計算當前位置的顏色
				let index = step * (palette.length - 1);
				let iLower = floor(index);
				let iUpper = min(iLower + 1, palette.length - 1);
				const c = lerpColor(palette[iLower], palette[iUpper], index % 1);
				
				fill(c);
				ellipse(x, y, 60, 60);
			}
		}
	}

	// 在右下角繪製箭頭按鈕
	push();
	fill(0, 100);
	noStroke();
	rectMode(CENTER);
	rect(width - 50, height - 50, 40, 40, 5); // 畫一個半透明方塊當背景
	fill(255);
	// 畫一個簡單的三角形箭頭
	triangle(width - 60, height - 65, width - 60, height - 35, width - 35, height - 50);
	pop();
}

function mousePressed() {
	// 偵測滑鼠是否點擊在右下角箭頭區域
	if (mouseX > width - 70 && mouseX < width - 30 && mouseY > height - 70 && mouseY < height - 30) {
		stage = (stage + 1) % 3; // 在 0, 1, 2 之間循環切換
		background('#f5ebe0'); // 切換階段時清除畫布
	}
}

// 繪製愛心的輔助函式
function drawHeart(x, y, size) {
	let s = size / 2;
	beginShape();
	// 從底部頂點開始
	vertex(x, y + s * 0.7);
	// 繪製左半邊：透過調整控制點（第一個與第二個座標對）讓弧度更圓潤飽滿
	bezierVertex(x - s * 1.4, y - s * 0.6, x - s * 0.5, y - s * 1.3, x, y - s * 0.4);
	// 繪製右半邊：對稱調整
	bezierVertex(x + s * 0.5, y - s * 1.3, x + s * 1.4, y - s * 0.6, x, y + s * 0.7);
	endShape(CLOSE);
}