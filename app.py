# app.py
from flask import Flask, request, jsonify, render_template
import joblib
import numpy as np

app = Flask(__name__)

# === Carregar modelo com scaler embutido ===
modelo = joblib.load("LinearRegression.joblib")

# === Rota principal (HTML) ===
@app.route("/")
def home():
    return render_template("index.html")

# === Rota de predição ===
@app.route("/prever", methods=["POST"])
def prever():
    try:
        dados = request.get_json()

        # Extrair features na MESMA ordem usada no treino!
        entrada = np.array([[
            dados.get("squareFootage", 0),
            dados.get("bedrooms", 0),
            dados.get("bathrooms", 0),
            dados.get("yearBuilt", 0),
            dados.get("lotSize", 0),
            dados.get("garageSize", 0),
            dados.get("neighborhoodQuality", 0)
        ]])

        # Predição direta (o pipeline aplica o scaler automaticamente)
        preco_previsto = modelo.predict(entrada)[0]

        return jsonify({"price": round(float(preco_previsto), 2)})

    except Exception as e:
        return jsonify({"error": str(e)}), 400


if __name__ == "__main__":
    app.run(debug=True)
