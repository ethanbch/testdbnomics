# %%
import numpy as np
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from dbnomics import fetch_series

gas_price = fetch_series(
    "Eurostat",
    "ten00118",
    dimensions={
        "freq": ["A"],
        "unit": ["GJ_GCV"],
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
df_gas = gas_price[
    ["period", "value", "Geopolitical entity (reporting)", "indic_en"]
].rename(
    columns=(
        {
            "period": "Years",
            "Geopolitical entity (reporting)": "Countries",
            "value": "Euro per GJ",
            "indic_en": "Sector",
        }
    )
)
df_gas["Sector"] = df_gas["Sector"].replace(
    {
        "MSHH": "Households",
        "MSIND": "Non-Households (Industry)",
    }
)
df_gas["Years"] = pd.PeriodIndex(df_gas["Years"], freq="Y")
df_gas["Years"] = df_gas["Years"].dt.strftime("%Y")

# %%
countries = np.unique(df_gas["Countries"])
dfs = {}

for country in countries:
    dfs[f"df_gas_{country}"] = df_gas[df_gas["Countries"] == country]
    fig = go.Figure()
    fig = px.line(
        dfs[f"df_gas_{country}"],
        x="Years",
        y="Euro per GJ",
        color="Sector",
        title=f"Gas prices in {country} by sector (€/GJ)",
        color_discrete_map={
            "Households": "orange",
            "Non-Households (Industry)": "lightblue",
        },
    )
    fig.show()

# %%
