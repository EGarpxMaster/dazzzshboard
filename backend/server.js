import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configurar Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Configurar CORS para permitir acceso desde GitHub Pages
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:4173',
  'https://egarpxmaster.github.io'
];

app.use(cors({
  origin: function (origin, callback) {
    // Permitir requests sin origin (como Postman) o de orígenes permitidos
    if (!origin || allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      callback(null, true);
    } else {
      callback(null, true); // En producción, considera ser más estricto
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'API funcionando con Supabase' });
});

// Obtener todos los datos
app.get('/api/datos', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('datos')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error al obtener datos:', error);
    res.status(500).json({ error: error.message });
  }
});

// Crear nuevo dato
app.post('/api/datos', async (req, res) => {
  try {
    const { nombre, valor } = req.body;
    
    if (!nombre || valor === undefined) {
      return res.status(400).json({ error: 'Nombre y valor son requeridos' });
    }

    const { data, error } = await supabase
      .from('datos')
      .insert([{ nombre, valor }])
      .select()
      .single();
    
    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('Error al crear dato:', error);
    res.status(500).json({ error: error.message });
  }
});

// Actualizar dato
app.put('/api/datos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, valor } = req.body;
    
    const { data, error } = await supabase
      .from('datos')
      .update({ 
        nombre, 
        valor, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    if (!data) {
      return res.status(404).json({ error: 'Dato no encontrado' });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Error al actualizar dato:', error);
    res.status(500).json({ error: error.message });
  }
});

// Eliminar dato
app.delete('/api/datos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('datos')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar dato:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
  console.log(`📊 Conectado a Supabase`);
});