# %%
import numpy as np
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from dbnomics import fetch_series

inflation_rate = fetch_series(
    "Eurostat",
    "tec00118",
    dimensions={
        "freq": ["A"],
        "unit": ["RCH_A_AVG"],
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
)
df_ir = inflation_rate[["period", "value", "Geopolitical entity (reporting)"]].rename(
    columns=(
        {
            "period": "Years",
            "Geopolitical entity (reporting)": "Countries",
            "value": "Inflation rate (HICP)",
        }
    )
)

df_ir["Years"] = pd.PeriodIndex(df_ir["Years"], freq="Y")
df_ir["Years"] = df_ir["Years"].dt.strftime("%Y")


# %%
top_economies = [
    "European Union - 27 countries (from 2020)",
    "Germany",
    "France",
    "Italy",
    "Spain",
    "Netherlands",
    "Poland",
    "Sweden",
]
df_ir_filtre = df_ir[df_ir["Countries"].isin(top_economies)]

figir = px.line(
    df_ir_filtre,
    x="Years",
    y="Inflation rate (HICP)",
    color="Countries",
    title="Inflation Rate of Major Economies in the EU",
    labels={
        "Years": "Year",
        "Inflation rate (HICP)": "Inflation Rate (%)",
        "Countries": "Country/Region",
    },
)


figir.show()

# %%
