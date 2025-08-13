import {allElFormItemsOptions, LoadComOptions} from '@/optionsClass/loadComOptions.ts'

const getElCom = new allElFormItemsOptions(),
    getElComOption = new LoadComOptions(),
    defaultColum = (): Array<elComAttrAndFunType[]> => [
        [
            getElCom.getDatePicker({
                span: 24,
                label: '筛选时间',
            }),
            getElCom.getInput({
                span: 24
            })
        ]
    ]
export default {
    form: getElComOption.getFormOptions(),
    rules: {},
    columns: defaultColum()
} as FyhComOptions