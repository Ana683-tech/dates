const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');

dotenv.config({ path: path.join(__dirname, 'prisma', '.env') });

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/api/clientes', async (req, res) => {
  try {
    const clientes = await prisma.cliente.findMany({
      orderBy: { id: 'desc' }
    });
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: 'No se pudieron consultar los clientes.' });
  }
});

app.get('/api/clientes/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: 'Identificador no válido.' });
  }

  try {
    const cliente = await prisma.cliente.findUnique({ where: { id } });

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado.' });
    }

    res.json(cliente);
  } catch (error) {
    res.status(500).json({ error: 'No se pudo consultar el cliente.' });
  }
});

app.post('/api/clientes', async (req, res) => {
  const { nombre, telefono } = req.body;

  if (!nombre || !nombre.trim()) {
    return res.status(400).json({ error: 'El nombre es obligatorio.' });
  }

  try {
    const cliente = await prisma.cliente.create({
      data: {
        nombre: nombre.trim(),
        telefono: telefono?.trim() || null
      }
    });
    res.status(201).json(cliente);
  } catch (error) {
    res.status(500).json({ error: 'No se pudo crear el cliente.' });
  }
});

app.put('/api/clientes/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { nombre, telefono } = req.body;

  if (!Number.isInteger(id) || !nombre || !nombre.trim()) {
    return res.status(400).json({ error: 'Datos de cliente no válidos.' });
  }

  try {
    const cliente = await prisma.cliente.update({
      where: { id },
      data: {
        nombre: nombre.trim(),
        telefono: telefono?.trim() || null
      }
    });
    res.json(cliente);
  } catch (error) {
    res.status(404).json({ error: 'Cliente no encontrado.' });
  }
});

app.delete('/api/clientes/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: 'Identificador no válido.' });
  }

  try {
    await prisma.cliente.delete({ where: { id } });
    res.status(204).end();
  } catch (error) {
    res.status(404).json({ error: 'Cliente no encontrado.' });
  }
});

app.get('/api/servicios', async (req, res) => {
  try {
    const servicios = await prisma.servicio.findMany({ orderBy: { id: 'desc' } });
    res.json(servicios);
  } catch (error) {
    res.status(500).json({ error: 'No se pudieron consultar los servicios.' });
  }
});

app.get('/api/servicios/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: 'Identificador no válido.' });
  }

  try {
    const servicio = await prisma.servicio.findUnique({ where: { id } });

    if (!servicio) {
      return res.status(404).json({ error: 'Servicio no encontrado.' });
    }

    res.json(servicio);
  } catch (error) {
    res.status(500).json({ error: 'No se pudo consultar el servicio.' });
  }
});

app.post('/api/servicios', async (req, res) => {
  const { nombre, precio } = req.body;
  const precioNumero = Number(precio);

  if (!nombre || !nombre.trim() || !Number.isFinite(precioNumero) || precioNumero < 0) {
    return res.status(400).json({ error: 'El nombre y un precio válido son obligatorios.' });
  }

  try {
    const servicio = await prisma.servicio.create({
      data: { nombre: nombre.trim(), precio: precioNumero }
    });
    res.status(201).json(servicio);
  } catch (error) {
    res.status(500).json({ error: 'No se pudo crear el servicio.' });
  }
});

app.put('/api/servicios/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { nombre, precio } = req.body;
  const precioNumero = Number(precio);

  if (!Number.isInteger(id) || !nombre || !nombre.trim() || !Number.isFinite(precioNumero) || precioNumero < 0) {
    return res.status(400).json({ error: 'Datos de servicio no válidos.' });
  }

  try {
    const servicio = await prisma.servicio.update({
      where: { id },
      data: { nombre: nombre.trim(), precio: precioNumero }
    });
    res.json(servicio);
  } catch (error) {
    res.status(404).json({ error: 'Servicio no encontrado.' });
  }
});

app.delete('/api/servicios/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: 'Identificador no válido.' });
  }

  try {
    await prisma.servicio.delete({ where: { id } });
    res.status(204).end();
  } catch (error) {
    res.status(404).json({ error: 'Servicio no encontrado.' });
  }
});

app.get('/api/reservas', async (req, res) => {
  try {
    const reservas = await prisma.reserva.findMany({ orderBy: { id: 'desc' } });
    res.json(reservas);
  } catch (error) {
    res.status(500).json({ error: 'No se pudieron consultar las reservas.' });
  }
});

app.get('/api/reservas/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: 'Identificador no válido.' });
  }

  try {
    const reserva = await prisma.reserva.findUnique({ where: { id } });

    if (!reserva) {
      return res.status(404).json({ error: 'Reserva no encontrada.' });
    }

    res.json(reserva);
  } catch (error) {
    res.status(500).json({ error: 'No se pudo consultar la reserva.' });
  }
});

app.post('/api/reservas', async (req, res) => {
  const clienteId = Number(req.body.clienteId);
  const servicioId = Number(req.body.servicioId);
  const estado = req.body.estado?.trim() || 'pendiente';

  if (!Number.isInteger(clienteId) || !Number.isInteger(servicioId) || !estado) {
    return res.status(400).json({ error: 'Cliente, servicio y estado son obligatorios.' });
  }

  try {
    const reserva = await prisma.reserva.create({ data: { clienteId, servicioId, estado } });
    res.status(201).json(reserva);
  } catch (error) {
    res.status(500).json({ error: 'No se pudo crear la reserva.' });
  }
});

app.put('/api/reservas/:id', async (req, res) => {
  const id = Number(req.params.id);
  const clienteId = Number(req.body.clienteId);
  const servicioId = Number(req.body.servicioId);
  const estado = req.body.estado?.trim() || 'pendiente';

  if (!Number.isInteger(id) || !Number.isInteger(clienteId) || !Number.isInteger(servicioId) || !estado) {
    return res.status(400).json({ error: 'Datos de reserva no válidos.' });
  }

  try {
    const reserva = await prisma.reserva.update({
      where: { id },
      data: { clienteId, servicioId, estado }
    });
    res.json(reserva);
  } catch (error) {
    res.status(404).json({ error: 'Reserva no encontrada.' });
  }
});

app.delete('/api/reservas/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: 'Identificador no válido.' });
  }

  try {
    await prisma.reserva.delete({ where: { id } });
    res.status(204).end();
  } catch (error) {
    res.status(404).json({ error: 'Reserva no encontrada.' });
  }
});

const server = app.listen(port, () => {
  console.log(`Aplicación disponible en http://localhost:${port}`);
});

async function shutdown() {
  await prisma.$disconnect();
  server.close();
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
