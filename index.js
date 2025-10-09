// index.js
import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());

// String de conexão do MongoDB Atlas (adicione no Render como variável de ambiente)
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

// =============================
// Rota principal /data
// =============================
app.post("/data", async (req, res) => {
  try {
    await client.connect();
    const db = client.db("bd_iot_monitoring");
    const collection = db.collection("readings");

    const leitura = {
      location_id: req.body.location_id,
      devices: req.body.devices,
      timestamp: new Date(),
    };

    await collection.insertOne(readings);
    res.status(200).send(" Dados recebidos e salvos com sucesso!");
  } catch (err) {
    console.error("Erro ao salvar no MongoDB:", err);
    res.status(500).send("Erro ao salvar no banco de dados");
  }
});

// =============================
// Inicializa o servidor
// =============================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 API IoT rodando na porta ${PORT}`));
