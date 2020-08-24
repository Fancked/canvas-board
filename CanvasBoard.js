class CanvasBoard {
  constructor(el, options = {}) {
    this.canvas = document.querySelector(el);
    this.ctx = this.canvas.getContext('2d');

    // 是否需要外边框
    this.ifBorder = options.ifBorder ? options.ifBorder : true;
    // 是否填充
    this.ifFill = options.ifFill ? options.ifFill : false;
    // 绘制图形选择
    this.shape = options.shape ? options.shape : 'pen'; // 支持circle rect line pen
    // 外边框颜色
    this.strokeStyle = options.strokeStyle ? options.strokeStyle : '#000';
    //  填充色
    this.fillStyle = options.fillStyle ? options.fillStyle : '#fff';
    // 线条宽度
    this.lineWidth = options.lineWidth ? options.lineWidth : '1';

    this.canvas.width = options.width ? options.width : this.canvas.width;
    this.canvas.height = options.height ? options.height : this.canvas.height;

    // blankImgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    this.imgData = [this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)];
    let startBool = false;

    let startX = 0;
    let startY = 0;
    this.canvas.addEventListener('mousedown', e => {
      this.ctx.beginPath();
      startX = e.offsetX;
      startY = e.offsetY;
      this.ctx.moveTo(startX, startY);
      startBool = true;
    });

    this.canvas.addEventListener('mousemove', e => {
      if (startBool) {
        switch (this.shape) {
          case 'pen':
            this.ctx.lineTo(e.offsetX, e.offsetY);
            this.ctx.strokeStyle = this.strokeStyle;
            this.ctx.lineWidth = this.lineWidth;
            this.ctx.stroke();
            break;
          default:
            this.ctx.closePath();
            this.ctx.beginPath();
            this.ctx.putImageData(this.imgData[this.imgData.length - 1], 0, 0);
            switch (this.shape) {
              case 'line':
                this.ctx.moveTo(startX, startY);
                this.ctx.lineTo(e.offsetX, e.offsetY);
                break;
              case 'rect':
                this.ctx.rect(startX, startY, e.offsetX - startX, e.offsetY - startY);
                break;
              case 'circle':
                this.ctx.arc(
                  startX,
                  startY,
                  Math.sqrt(Math.pow(e.offsetX - startX, 2) + Math.pow(e.offsetY - startY, 2)),
                  0,
                  2 * Math.PI
                );
                break;
            }

            if (this.ifBorder) {
              this.ctx.strokeStyle = this.strokeStyle;
              this.ctx.lineWidth = this.lineWidth;
              this.ctx.stroke();
            }
            if (this.ifFill) {
              this.ctx.fillStyle = this.fillStyle;
              this.ctx.fill();
            }
        }
      }
    });

    this.canvas.addEventListener('mouseup', e => {
      if (startBool) {
        this.ctx.closePath();
        this.imgData.push(this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height));
        startBool = false;
      }
    });

    this.canvas.addEventListener('mouseleave', e => {
      if (this.startBool) {
        this.ctx.closePath();
        this.imgData.push(this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height));
        startBool = false;
      }
    });
  }
  // 原型方法
  setIfBorder(ifBorder) {
    this.ifBorder = ifBorder;
  }
  setIfFill(ifFill) {
    this.ifFill = ifFill;
  }
  setShape(shape) {
    this.shape = shape;
  }

  setBorderColor(color) {
    this.strokeStyle = color;
  }
  setFillColor(color) {
    this.fillStyle = color;
  }
  setLineWidth(lineWidth) {
    this.lineWidth = lineWidth;
  }
  setBoardSize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  clearBoard() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.imgData = [this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)];
  }

  back() {
    console.log(this.imgData);
    let len = this.imgData.length;
    if (len > 1) {
      this.ctx.putImageData(this.imgData[len - 2], 0, 0);
      this.imgData.pop();
    }
  }
  save() {
    let imgUrl = this.canvas.toDataURL('image/png');
    let saveA = document.createElement('a');
    saveA.href = imgUrl;
    saveA.download = 'cvs' + new Date().getTime();
    saveA.target = '_blank';
    saveA.click();
  }
}
