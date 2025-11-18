// index.js
import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());

// =============================
// Configuração do MongoDB Atlas
// =============================
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
let collection;

async function conectarMongo() {
  try {
    await client.connect();
    const db = client.db("bd_iot_monitoring2");
    collection = db.collection("readings");
    console.log("✅ Conectado ao MongoDB Atlas");
  } catch (err) {
    console.error("❌ Erro ao conectar ao MongoDB:", err);
  }
}
conectarMongo();

// =============================
// Rota principal /data
// =============================
app.post("/data", async (req, res) => {
  try {
    const leitura = {
      location_id: req.body.location_id,
      devices: req.body.devices,
      timestamp: new Date(),
    };

    await collection.insertOne(leitura);
    console.log("📥 Nova leitura recebida:", leitura);
    res.status(200).send("✅ Dados recebidos e salvos com sucesso!");
  } catch (err) {
    console.error("❌ Erro ao salvar no MongoDB:", err);
    res.status(500).send("❌ Erro ao salvar no banco de dados");
  }
});

// =============================
// Inicializa o servidor (Render)
// =============================
const PORT = process.env.PORT || 3000;

// ⚠️ Importante: "0.0.0.0" permite conexões externas (necessário no Render)
app.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 API IoT rodando na porta ${PORT}`)
);
