    class CanvasBoard {
      constructor(el, options = {}) {
        const canvas = document.querySelector(el);
        const ctx = canvas.getContext('2d');

        // 是否需要外边框
        this.ifBorder = true;
        // 是否填充
        this.ifFill = false;
        // 绘制图形选择
        this.shape = 'circle';// 支持circle rect line pen       
        // 外边框颜色
        this.strokeStyle = '#ff0000';
        //  填充色
        this.fillStyle = '#00ffff';
        // 线条宽度
        this.lineWidth = '1';

        canvas.width = options.width ? options.width : canvas.width;
        canvas.height = options.height ? options.height : canvas.height;

        const blankImgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        let startBool = false;
        let imgData = [blankImgData];
        let startX = 0;
        let startY = 0;
        canvas.addEventListener('mousedown', (e) => {
          ctx.beginPath();
          startX = e.offsetX;
          startY = e.offsetY;
          ctx.moveTo(startX, startY);
          startBool = true;
        })

        canvas.addEventListener('mousemove', (e) => {
          if (startBool) {
            switch (this.shape) {
              case 'pen':
                ctx.lineTo(e.offsetX, e.offsetY);
                ctx.strokeStyle = this.strokeStyle;
                ctx.lineWidth = this.lineWidth;
                ctx.stroke();
                break;
              default:
                ctx.closePath();
                ctx.beginPath();

                ctx.putImageData(imgData[imgData.length - 1], 0, 0);
                switch (this.shape) {
                  case 'line':
                    ctx.moveTo(startX, startY);
                    ctx.lineTo(e.offsetX, e.offsetY);
                    break;
                  case 'rect':
                    ctx.rect(startX, startY, e.offsetX - startX, e.offsetY - startY);
                    break;
                  case 'circle':
                    ctx.arc(startX, startY, Math.sqrt(Math.pow(e.offsetX - startX, 2) + Math.pow(e.offsetY - startY, 2)), 0, 2 * Math.PI)
                    break;
                }
                if (this.ifBorder) {
                  ctx.strokeStyle = this.strokeStyle;
                  ctx.lineWidth = this.lineWidth;
                  ctx.stroke();
                }
                if (this.ifFill) {
                  ctx.fillStyle = this.fillStyle;
                  ctx.fill()
                }
            }


          }
        })

        canvas.addEventListener('mouseup', (e) => {
          console.log('1')
          ctx.closePath();
          imgData.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
          startBool = false;
        })

        canvas.addEventListener('mouseleave', (e) => {
          ctx.closePath();
          imgData.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
          startBool = false;
        })
      };
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
        canvas.width = width;
        canvas.height = height;
      }

      clearBoard() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        imgData = [blankImgData];
      }

      back() {
        if (imgData.length > 1)
          ctx.putImageData(imgData.pop(), 0, 0)
      }
    }