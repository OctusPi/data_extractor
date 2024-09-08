import readXlsxFile from "read-excel-file";
import calc_medias from "./src/calc_medias";
import mods_escolas from "./src/mods_escolas";

const input = document.getElementById("doc");
const btn_csv = document.getElementById("btn_csv");

btn_csv.addEventListener("click", () => {
  const type_export = document.querySelector(
    'input[name="options-base"]:checked'
  );

  // verifica se foi selecionado um arquivo para conversao
  if (!input.files[0]) {
    alert("Nenhum arquivo selecionado...");
    return;
  }

  //convert os dados para o calculo de média
  if (type_export.value === "1") {
    readXlsxFile(input.files[0]).then((rows) => {
      calc_medias.downloadJson(calc_medias.mapper(rows));
    });
    return;
  }

  if (type_export.value === "2") {
    readXlsxFile(input.files[0]).then((rows) => {
      mods_escolas.downloadJson(mods_escolas.mapper(rows));
    });
    return;
  }

  alert("Selecione o typo de Export de Dados");
});
