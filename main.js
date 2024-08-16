import readXlsxFile from "read-excel-file";
import data_inep from './data_inep'

const input = document.getElementById("doc");
const btn_csv = document.getElementById("btn_csv");

function mapper(data) {

  // define nome da coluna de acordo com o padrão qgis
  const cols = {
    "ID_INEP_CO,N,19,0": "INEP ESCOLA",
    "SCHOOL_COU,N,19,0": "?",
    "CENSUS_YEA,N,19,0": "ANO CENSO",
    "CREDE,C,254": "CREDE/SEFOR",
    "COUNTY,C,254": "MUNICÍPIO",
    "ADM_DEP,C,254": "DEPENDÊNCIA ADMINISTRATIVA",
    "SCHOOL_NAM,C,254": "ESCOLA",
    "ADRESS,C,254": "?",
    "LAT,N,11,3": "?",
    "LONG,N,11,3": "?",
    "SCHOOL_CAT,C,254": "CATEGORIA DA ESC0LA",
    "LOCATION,C,254": "LOCALIZAÇÃO",
    "PPDT_YYYY,C,24": "POSSUÍA TURMAS PPDT* NESSE ANO"
  };

  //disciplinas possíveis
  const subjects = {
    "ESP":"Espanhol",
    "ING":"Inglês",
    "SOC":"Sociologia",
    "QUI":"Química",
    "FIS":"Física",
    "FIL":"Filosofia",
    "EDF":"Educação Física",
    "ART":"Artes",
    "BIO":"Biologia",
    "RED":"Redação",
    "POR":"Português",
    "GEO":"Geografia",
    "HIS":"História",
    "MAT":"Matemática"
  };

  // verifica se arquivo foi lido com sucesso...
  // if (!Array.isArray(data) || !data.length > 0) {
  //   alert('Arquivo inválido ou sem dados para extrair, verique a existencias de valores fora da tabela de dados...')
  //   return;
  // }

  //cria as colunas do csv
  const csv_cols = Object.keys(cols);
  Object.keys(subjects).forEach((sub) => {
    for (let index = 1; index <= 3; index++) {
      csv_cols.push(`${sub}_YYYY_${index},N,13,2`);
    }
  });

  //parser arry to objects
  const lines = [];
  data.forEach((row, index) => {
    if (index > 1) {
      let a = {};
      row.forEach((r, i) => {
        a[data[0][i]] = r
      })

      lines.push(a)
    }
  });
  
  //adiciona inep como chave primaria
  const csv_lines = [];
  lines.forEach(line => {
    let l = {}

    csv_cols.forEach(c => {
      l[c] = line[cols[c]]
    })

    csv_lines.push(l)
  });

  //reduz linhas para o total de escolas existentes na planilha
  const csv_lines_reduce = {};
  csv_lines.forEach(line => {
    csv_lines_reduce[line['ID_INEP_CO,N,19,0']] = line
  });

  //calcula total de escolas
  const total_schools = Object.keys(csv_lines_reduce).length

  //atribui nota/endereco/longitude/latitude
  const map_serie = {
    '1': '1ª Serie',
    '2': '2ª Serie',
    '3': '3ª Serie'
  }

  for (let i in csv_lines_reduce) {

    const data = csv_lines_reduce[i]

    for (let d in data) {
      const sub_disp = d.substring(0, 3);
      
      if (Object.keys(subjects).find(o => o === sub_disp)) {
        
        let sub_year = d.split('_');
        sub_year = sub_year[2].substring(0, 1)
        
        const ob = lines.find(obj => obj["INEP ESCOLA"] == i && obj["DISCIPLINA"] == subjects[sub_disp]);

        if (ob) {          
          data[d] =  typeof(ob[map_serie[sub_year]]) != "number" ? '' : parseFloat(ob[map_serie[sub_year]]).toFixed(2)
        } else {
          data[d] = ''
        }
      }

      if (d === 'SCHOOL_COU,N,19,0') {
        data[d] = total_schools
      }

      if (d === 'ADRESS,C,254') {
        data[d] = data_inep.adrs[i]
      }

      if (d === 'LAT,N,11,3') {
        data[d] = data_inep.lat[i]
      }

      if (d === 'LONG,N,11,3') {
        data[d] = data_inep.lon[i]
      }
    }
  }

  const csv_final = [];
  for (let i in csv_lines_reduce) {
    const school = csv_lines_reduce[i]
    let s = {}
    for (let j in school) {
      s[j.replace('YYYY', school['CENSUS_YEA,N,19,0'])] = school[j]
    }

    csv_final.push(s)
  }
  
  return csv_final
}

function scapeValue(value) {
  return `"${value}"`
}

function convertArrayToCSV(array) {
  if (!array.length) return '';

  const data_csv = "";

  // Obtém os cabeçalhos das colunas
  const headers = Object.keys(array[0]);
  const scapeHedears = []
  headers.forEach(element => {
    scapeHedears.push(scapeValue(element))
  });

  const scapeData = [];
  array.forEach(data => {
    const a_data = Object.values(data)
    const t_data = []
    a_data.forEach(e => {
      t_data.push(scapeValue(e))
    });
    scapeData.push(t_data)
  });

  // Converte os cabeçalhos e linhas de dados para CSV
  const csv = [
    scapeHedears.join(','), // Cabeçalhos
      ...scapeData.map(row => row.join(',')) // Dados
  ].join('\n');

  return csv;
}

function downloadJson(data) {


  const data_csv = convertArrayToCSV(data);

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

btn_csv.addEventListener("click", () => {
  readXlsxFile(input.files[0]).then((rows) => {
    downloadJson(mapper(rows))
  });
});
