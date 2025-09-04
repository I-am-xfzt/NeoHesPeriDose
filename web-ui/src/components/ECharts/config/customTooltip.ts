export const getStr = (val: EmptyObjectType, name: string) => (`
          <div class="year-item">
            <span class="year-name">${name?? val.seriesName}</span>
            <span class="year-value">${val.data >= 10000 ? (val.data / 10000).toFixed(2) + 'w' : val.data}</span>
          </div>
`)