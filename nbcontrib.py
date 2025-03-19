# %%
import numpy as np
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from dbnomics import fetch_series

contrib = fetch_series(
    "Eurostat",
    "prc_hicp_inw",
    dimensions={
        "freq": ["A"],
        "coicop": ["CP0451", "CP0452", "CP0453", "CP0454", "CP0455"],
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
    max_nb_series=1000,
)

df_contrib = contrib[
    ["period", "value", "Geopolitical entity (reporting)", "coicop"]
].rename(
    columns=(
        {
            "period": "Years",
            "Geopolitical entity (reporting)": "Countries",
            "value": "Total Contribution of energy to inflation rate",
            "coicop": "Energy",
        }
    )
)

df_contrib["Energy"] = df_contrib["Energy"].replace(
    {
        "CP0451": "Electricity",
        "CP0452": "Gas",
        "CP0453": "Liquid fuels",
        "CP0454": "Solid fuels",
        "CP0455": "Heat",
    }
)
df_contrib["Years"] = pd.PeriodIndex(df_contrib["Years"], freq="Y")
df_contrib["Years"] = df_contrib["Years"].dt.strftime("%Y")

df_contrib

# %%
countries = np.unique(df_contrib["Countries"])
dfs = {}

for country in countries:
    dfs[f"df_contrib_{country}"] = df_contrib[df_contrib["Countries"] == country]
    fig = go.Figure()
    fig = px.bar(
        dfs[f"df_contrib_{country}"],
        x="Years",
        y="Total Contribution of energy to inflation rate",
        color="Energy",
        title=f"Energy Contribution to Inflation - {country}",
        barmode="relative",
    )
    fig.show()

# %%
