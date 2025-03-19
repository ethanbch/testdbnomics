import json
import os

from nbcontrib import df_contrib
from nbelec import df_elec
from nbgas import df_gas
from notebookir import df_ir

# Créer le dossier docs pour GitHub Pages
os.makedirs("docs", exist_ok=True)

# Copier les fichiers statiques
os.system("cp -r static docs/")
os.system("cp -r templates/* docs/")

# Générer le fichier de données JSON
countries = list(
    set(
        list(df_ir["Countries"].unique())
        + list(df_contrib["Countries"].unique())
        + list(df_elec["Countries"].unique())
        + list(df_gas["Countries"].unique())
    )
)

all_data = {}
for country in countries:
    all_data[country] = {
        "inflation": df_ir[df_ir["Countries"] == country].to_dict("records"),
        "contribution": df_contrib[df_contrib["Countries"] == country].to_dict(
            "records"
        ),
        "electricity": df_elec[df_elec["Countries"] == country].to_dict("records"),
        "gas": df_gas[df_gas["Countries"] == country].to_dict("records"),
    }

# Sauvegarder les données
os.makedirs("docs/api", exist_ok=True)
with open("docs/api/data.json", "w") as f:
    json.dump(all_data, f)
