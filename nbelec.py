# %%
import numpy as np
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from dbnomics import fetch_series

elec_price = fetch_series(
    "Eurostat",
    "ten00117",
    dimensions={
        "freq": ["A"],
        "unit": ["KWH"],
        "indic_en": ["MSHH", "MSIND"],
        "geo": [
            "AT",  # Austria
            "BE",  # Belgium
            "BG",  # Bulgaria
            "HR",  # Croatia
            "CY",  # Cyprus
            "CZ",  # Czech Republic
            "DK",  # Denmark
            "EE",  # Estonia
            "FI",  # Finland
            "FR",  # France
            "DE",  # Germany
            "GR",  # Greece
            "HU",  # Hungary
            "IE",  # Ireland
            "IT",  # Italy
            "LV",  # Latvia
            "LT",  # Lithuania
            "LU",  # Luxembourg
            "MT",  # Malta
            "NL",  # Netherlands
            "PL",  # Poland
            "PT",  # Portugal
            "RO",  # Romania
            "SK",  # Slovakia
            "SI",  # Slovenia
            "ES",  # Spain
            "SE",  # Sweden
            "EU27_2020",
            "EA20",  # from 2023
        ],
    },
    max_nb_series=60,
)
df_elec = elec_price[
    ["period", "value", "Geopolitical entity (reporting)", "indic_en"]
].rename(
    columns=(
        {
            "period": "Years",
            "Geopolitical entity (reporting)": "Countries",
            "value": "Euro per kWh",
            "indic_en": "Sector",
        }
    )
)
df_elec["Sector"] = df_elec["Sector"].replace(
    {
        "MSHH": "Households",
        "MSIND": "Non-Households (Industry)",
    }
)
df_elec["Years"] = pd.PeriodIndex(df_elec["Years"], freq="Y")
df_elec["Years"] = df_elec["Years"].dt.strftime("%Y")

# %%
countries = np.unique(df_elec["Countries"])
dfs = {}

for country in countries:
    dfs[f"df_elec_{country}"] = df_elec[df_elec["Countries"] == country]
    fig = go.Figure()
    fig = px.line(
        dfs[f"df_elec_{country}"],
        x="Years",
        y="Euro per kWh",
        color="Sector",
        title=f"Electricity prices in {country} by sector (€/kWh)",
        color_discrete_map={
            "Households": "blue",
            "Non-Households (Industry)": "red",
        },
    )
    fig.show()
# %%
