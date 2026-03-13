import "dotenv/config";
import express from "express";
import cors from "cors";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";




const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok" }));

// ---------- Firebase ----------
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID
};

const fbApp = initializeApp(firebaseConfig);
const db = getDatabase(fbApp);

// ---------- Route : vérifier par robloxUserId ----------
app.get("/check/:robloxUserId", async (req, res) => {
  const robloxUserId = req.params.robloxUserId;

  try {
    const snapshot = await get(ref(db, "users"));

    let match = null;

    snapshot.forEach((child) => {
      const data = child.val();
      if (data.robloxUserId && data.robloxUserId.toString() === robloxUserId) {
        match = data;
      }
    });

    if (match) {
      res.json({ exists: true, robloxUserId: match.robloxUserId });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    console.error("Erreur Firebase :", error);
    res.status(500).json({ error: "Erreur interne serveur" });
  }
});

// ---------- Démarrer le serveur ----------
app.listen(3000, () => {
  console.log("✅ API opérationnelle sur le port 3000");
});
