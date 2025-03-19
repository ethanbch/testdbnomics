import numpy as np
from flask import Flask, jsonify, render_template
from flask_cors import CORS

from nbcontrib import df_contrib
from nbelec import df_elec
from nbgas import df_gas
from notebookir import df_ir

app = Flask(__name__, static_folder="static", template_folder="docs")
CORS(app)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")


@app.route("/api/countries")
def get_countries():
    countries = list(
        set(
            list(np.unique(df_ir["Countries"]))
            + list(np.unique(df_contrib["Countries"]))
            + list(np.unique(df_elec["Countries"]))
            + list(np.unique(df_gas["Countries"]))
        )
    )
    return jsonify(countries)


@app.route("/api/data/<country>")
def get_country_data(country):
    inflation_data = df_ir[df_ir["Countries"] == country].to_dict("records")
    contrib_data = df_contrib[df_contrib["Countries"] == country].to_dict("records")
    elec_data = df_elec[df_elec["Countries"] == country].to_dict("records")
    gas_data = df_gas[df_gas["Countries"] == country].to_dict("records")

    return jsonify(
        {
            "inflation": inflation_data,
            "contribution": contrib_data,
            "electricity": elec_data,
            "gas": gas_data,
        }
    )


@app.route("/sources")
def sources():
    return render_template("sources.html")


if __name__ == "__main__":
    app.run(debug=True)
