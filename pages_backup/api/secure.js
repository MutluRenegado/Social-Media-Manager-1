import admin from "../../lib/firebaseAdmin";

export default async function handler(req, res) {
  try {
    const users = await admin.auth().listUsers();
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
