// 🔄 senninmessage 側の server.js に追記（管理サーバーと連携） const io = require('socket.io')(server); const { io: adminIO } = require('socket.io-client');

const adminSocket = adminIO('https://your-admin-server.onrender.com'); // Render URLに置き換え

adminSocket.on('connect', () => { console.log('[ADMIN] 管理サーバーと接続しました'); });

adminSocket.on('adminMessage', ({ command, room, target }) => { if (command === 'ban' && room && target) { const targetId = Object.keys(rooms[room] || {}).find( id => rooms[room][id] === target ); if (targetId) { const sock = io.sockets.sockets.get(targetId); if (sock) { sock.emit('message', { user: 'system', text: '管理者により接続が切断されました', image: null }); sock.disconnect(true); delete rooms[room][targetId]; console.log([BAN] ${target} を切断); } } } });

// 元々の chatMessage イベント内に以下を追加して管理へ転送： adminSocket.emit('chatMessage', { sender: username, message: text, room: room });

