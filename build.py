import json
import os
import shutil

from nbcontrib import df_contrib
from nbelec import df_elec
from nbgas import df_gas
from notebookir import df_ir

# Créer le dossier docs pour GitHub Pages
os.makedirs("docs", exist_ok=True)

# Copier les fichiers statiques
os.makedirs("docs/static", exist_ok=True)
shutil.copytree("static", "docs/static", dirs_exist_ok=True)

# Copier les fichiers HTML en les renommant correctement
shutil.copy("templates/index.html", "docs/index.html")
shutil.copy("templates/dashboard.html", "docs/dashboard.html")
shutil.copy("templates/sources.html", "docs/sources.html")

# Modifier les liens dans les fichiers HTML pour qu'ils fonctionnent avec GitHub Pages
files_to_update = ["docs/index.html", "docs/dashboard.html", "docs/sources.html"]
for file in files_to_update:
    with open(file, "r") as f:
        content = f.read()

    # Remplacer les liens Flask par des liens statiques
    content = content.replace("{{ url_for('static', filename='", "static/")
    content = content.replace("') }}", "")

    with open(file, "w") as f:
        f.write(content)

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
