import './style';
import 'typeface-roboto';

var ip = location.host;
var ws = new WebSocket(`ws://${ip}`);

ws.addEventListener('open', () => {
  ws.send('subscribe_binary');
});

ws.addEventListener('message', async (event: MessageEvent<Blob>) => {
  ws.close();
  
  console.log(await event.data.arrayBuffer());
});

//setTimeout(() => location.reload(), 1000);