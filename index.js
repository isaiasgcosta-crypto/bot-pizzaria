const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');

const pedidosPath = path.resolve(__dirname, 'pedidos.json');
if (!fs.existsSync(pedidosPath)) fs.writeFileSync(pedidosPath, '{}', 'utf8');

function salvarPedido(user, pedido) {
    const pedidos = JSON.parse(fs.readFileSync(pedidosPath, 'utf8'));
    pedidos[user] = pedido;
    fs.writeFileSync(pedidosPath, JSON.stringify(pedidos, null, 2));
}

// Configuração do cliente WhatsApp
const client = new Client({
    authStrategy: new LocalAuth({
        clientId: "pizzaria-bot"
    }),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox','--disable-setuid-sandbox']
    }
});

client.on('qr', qr => {
    console.log("ESCANEIE O QR:");
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => console.log('✅ BOT CONECTADO'));
client.on('disconnected', reason => console.log('❌ WhatsApp desconectado:', reason));

client.initialize();

// ===== Aqui você mantém todo o seu código de cardápio, parser, estados e eventos =====
// ... (cole todo o seu código de pizzas, bebidas, estados, parser, responder etc.)

// Exemplo de salvar pedido final:
client.on('message', async msg => {
    const user = msg.from;
    // Quando o pedido for confirmado:
    if (msg.body.toLowerCase() === 'confirmar') {
        salvarPedido(user, { pizzas: ['Calabresa'], bebidas: ['Coca-Cola 1L'] });
        msg.reply('✅ Pedido salvo com sucesso!');
    }
});

process.on('unhandledRejection', err => console.log(err));
process.on('uncaughtException', err => console.log(err));
