export const getRandomDate = (year: number) => {
    const start = new Date(year, 0, 0); // 2024年1月1日00:00:00
    const end = new Date(year, 11, 31, 23, 59, 59, 999); // 2024年12月31日23:59:59.999

    // 生成一个随机的时间戳，范围在2024年的开始和结束之间
    const randomTimestamp = Math.floor(Math.random() * (end.getTime() - start.getTime())) + start.getTime();

    // 将随机的时间戳转换回日期对象
    const randomDate = new Date(randomTimestamp);
    randomDate.setSeconds(0);
    randomDate.setMilliseconds(0);
    // 格式化日期对象为字符串（可选，根据需要调整格式）
    const formattedDate = randomDate.toISOString().slice(0, 19).replace('T', ' ');

    return formattedDate.slice(0, -3);
}