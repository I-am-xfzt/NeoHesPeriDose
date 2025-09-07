/**
 * @class CurveDrawer
 * @description 绘制曲线
 * @example const data = [30, 80, 20, 90, 40, 70, 10, 60];
   const canvas = CurveDrawer.createCanvas(400, 200);
   CurveDrawer.drawMountainCurve(canvas, data, {
       lineColor: '#007bff',
       lineWidth: 3,
       heightScale: 1.8
   });
   document.body.appendChild(canvas);
   const newData = CurveDrawer.generateRandomData(6, 20, 80);
   CurveDrawer.drawMountainCurve(canvas, newData);
 */
export class CurveDrawer {
    /**
     * 绘制山峦曲线
     * @param {HTMLCanvasElement} canvas - canvas元素
     * @param {number[]} data - 数据数组
     * @param {Object} options - 配置选项
     */
    static drawMountainCurve = (canvas: HTMLCanvasElement, data: number[], options: {
        lineColor?: string;
        lineWidth?: number;
        heightScale?: number;
        canvasHeight?: number;
    } = {}) => {
        const {
            lineColor = 'blue',
            lineWidth = 2,
            heightScale = 2,
            canvasHeight = 200
        } = options;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Unable to get 2D context from canvas');
        }
        
        const width = canvas.width;
        const height = canvas.height || canvasHeight;

        ctx.clearRect(0, 0, width, height);
        ctx.beginPath();

        // 使用reduce绘制曲线路径
        data.reduce((prev, current, index) => {
            const x1 = (index / (data.length - 1)) * width;
            const y1 = height - current * heightScale;
            
            if (index === 0) {
                ctx.moveTo(x1, y1);
                return current;
            }

            const prevX = ((index - 1) / (data.length - 1)) * width;
            const prevY = height - prev * heightScale;
            const nextX = (index / (data.length - 1)) * width;
            
            const cx = (prevX + nextX) / 2;
            const cy = (prevY + y1) / 2;
            
            ctx.quadraticCurveTo(prevX, prevY, cx, cy);
            return current;
        }, 0);

        ctx.strokeStyle = lineColor;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
    };

    /**
     * 生成随机数据
     * @param {number} count - 数据点数量
     * @param {number} min - 最小值
     * @param {number} max - 最大值
     */
    static generateRandomData = (count: number = 8, min: number = 10, max: number = 100): number[] => 
        Array.from({ length: count }, () => 
            Math.floor(Math.random() * (max - min + 1)) + min
        );
}