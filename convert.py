import json
import csv
import tkinter as tk
from tkinter import filedialog

def json_to_csv(json_file, csv_file):
    with open(json_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    if isinstance(data, list) and len(data) > 0:
        keys = data[0].keys()
        with open(csv_file, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=keys)
            writer.writeheader()
            writer.writerows(data)
    else:
        print("O arquivo JSON deve conter uma lista de objetos.")

def main():
    # Configura a interface gráfica
    root = tk.Tk()
    root.withdraw()  # Oculta a janela principal

    # Seleciona o arquivo JSON
    json_file = filedialog.askopenfilename(
        title="Selecione o arquivo JSON",
        filetypes=[("JSON files", "*.json")]
    )
    if not json_file:
        print("Nenhum arquivo JSON selecionado.")
        return

    # Seleciona o local e nome do arquivo CSV
    csv_file = filedialog.asksaveasfilename(
        title="Salvar como CSV",
        defaultextension=".csv",
        filetypes=[("CSV files", "*.csv")]
    )
    if not csv_file:
        print("Nenhum local para salvar o arquivo CSV selecionado.")
        return

    # Converte o JSON para CSV
    json_to_csv(json_file, csv_file)
    print(f"Arquivo CSV salvo em: {csv_file}")

if __name__ == "__main__":
    main()
