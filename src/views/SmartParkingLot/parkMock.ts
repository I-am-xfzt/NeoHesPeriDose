import { desensitizeLicensePlate } from "@/utils/toolsValidate.ts"
export const getCommon = () => [
    { area: 'A', useRate: 71, alarmType: '违规停车' },
    { area: 'B', useRate: 23, alarmType: '烟雾报警' },
    { area: 'C', useRate: 33, alarmType: '摄像遮挡' },
    { area: 'D', useRate: 62, alarmType: '黑名单车辆' },
    { area: 'E', useRate: 41, alarmType: '违规停车' },
    { area: 'F', useRate: 86, alarmType: '违规停车' }
]
export const getCurrentCarInfo = () => {
    const data = [
        {
            plate: '鲁MT787B',
            sex: '男',
            carType: '临时车',
            parkTime: '2h'
        },
        {
            plate: '浙B66666',
            sex: '女',
            carType: '年租车',
            parkTime: '3h'
        },
        {
            plate: '豫K88888',
            sex: '女',
            carType: '月租车',
            parkTime: '4h'
        }, {
            plate: '鲁M88888',
            sex: '男',
            carType: '临时车',
            parkTime: '2h'
        },
        {
            plate: '浙A99999',
            sex: '女',
            carType: '年租车',
            parkTime: '3h'
        },
        {
            plate: '豫A33333',
            sex: '女',
            carType: '月租车',
            parkTime: '4h'
        }
    ]
    data.forEach(v => v.plate = desensitizeLicensePlate(v.plate))
    return data
}