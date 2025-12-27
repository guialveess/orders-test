import mongoose from "mongoose";

export const connectDatabase = async (): Promise<void> => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error("MONGO_URI não está definido nas variáveis ​​de ambiente.");
    }
    await mongoose.connect(uri);
    console.log("MongoDB conectado");
  } catch (error) {
    console.error("Erro ao conectar no MongoDB", error);
    process.exit(1);
  }
};
