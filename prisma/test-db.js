const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Intenta realizar una consulta a la base de datos en Neon
    console.log('Conectando a Neon PostgreSQL...');
    
    // Si tu modelo en schema.prisma se llama Cliente:
    const clientes = await prisma.cliente.findMany();
    
    console.log(' ¡Conexión exitosa a la base de datos!');
    console.log('Registros encontrados:', clientes);
  } catch (error) {
    console.error(' Error al conectar con la base de datos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();