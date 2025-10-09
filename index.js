// index.js
import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());

// String de conexão do MongoDB Atlas
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

// Conecta ao MongoDB uma vez no início
let collection;
async function conectarMongo() {
  try {
    await client.connect();
    const db = client.db("bd_iot_monitoring");
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

    await collection.insertOne(leitura); // ✅ variável correta
    res.status(200).send("✅ Dados recebidos e salvos com sucesso!");
  } catch (err) {
    console.error("Erro ao salvar no MongoDB:", err);
    res.status(500).send("❌ Erro ao salvar no banco de dados");
  }
});

// =============================
// Inicializa o servidor
// =============================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 API IoT rodando na porta ${PORT}`));
