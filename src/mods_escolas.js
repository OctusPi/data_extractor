import data_mun from "./data_mun"

function mapper(data) {
    let data_year = ''
    const mapper_cols = [];

    const add_cols = {
        "ESC_YYYY, N, 254":0,
        "INT_YYYY, N, 254":0,
        "REG_YYYY, N, 254":0,
        "PRO_YYYY, N, 254":0,
        "IND_YYYY, N, 254":0,
        "MIL_YYYY, N, 254":0,
        "CAM_YYYY, N, 254":0,
        "INS_YYYY, N, 254":0,
        "QUI_YYYY, N, 254":0,
        "FAM_YYYY, N, 254":0
    }

    const ref_cols = {
        "ESC_YYYY, N, 254":0,
        "INT_YYYY, N, 254":'TEMPO INTEGRAL',
        "REG_YYYY, N, 254":'REGULAR',
        "PRO_YYYY, N, 254":'PROFISSIONAL',
        "IND_YYYY, N, 254":'INDÍGENA',
        "MIL_YYYY, N, 254":'MILITAR',
        "CAM_YYYY, N, 254":'DO CAMPO',
        "INS_YYYY, N, 254":'INSTITUTO',
        "QUI_YYYY, N, 254":'QUILOMBOLA',
        "FAM_YYYY, N, 254":'FAMÍLIA AGRÍCOLA'
    }

    // unifica colunas data_mun com mod_escs
    data_mun.forEach(element => {
        const item = { ...element, ...add_cols }
        mapper_cols.push(item)
    });

    //conta mod escolas
    data.forEach((line, i) => {
        if (i > 0) {
            data_year = line[2]
            const mun = mapper_cols.find(o => o['NM_MUN,C,50'].toLowerCase() == line[4].toLowerCase())
            if (mun) {
                for (const c in ref_cols) {
                    if (line.includes(ref_cols[c])) {
                         mun['ESC_YYYY, N, 254'] += 1
                         mun[c] += 1
                    }
                }
            }
        }
    });

    return {
        mapper_cols,
        data_year
    }
}

function scapeValue(value) {
    return `"${value}"`;
} 

function convertArrayToCSV(array, year) {
    if (!array.length) return "";
  
    const data_csv = "";
  
    // Obtém os cabeçalhos das colunas
    const headers = Object.keys(array[0]);
    const scapeHedears = [];
    headers.forEach((element) => {
      scapeHedears.push(scapeValue(element).replace('YYYY', year));
    });
  
    const scapeData = [];
    array.forEach((data) => {
      const a_data = Object.values(data);
      const t_data = [];
      a_data.forEach((e) => {
        t_data.push(scapeValue(e));
      });
      scapeData.push(t_data);
    });
  
    // Converte os cabeçalhos e linhas de dados para CSV
    const csv = [
      scapeHedears.join(","), // Cabeçalhos
      ...scapeData.map((row) => row.join(",")), // Dados
    ].join("\n");
  
    return csv;
  }
  
  function downloadJson(data) {
    const data_csv = convertArrayToCSV(data.mapper_cols, data.data_year);
  
    // Cria um Blob com o conteúdo CSV
    const blob = new Blob([data_csv], { type: "text/csv;charset=utf-8;" });
  
    // Cria um link para o Blob
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "dados.csv");
  
    // Adiciona o link ao documento e clica nele para iniciar o download
    document.body.appendChild(link);
    link.click();
  
    // Remove o link do documento
    document.body.removeChild(link);
  }

export default {
    mapper,
    downloadJson
}