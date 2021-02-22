const http = require('http')
const express = require('express')
const WebSocket = require('ws')
const CWclient = require('./cryptowatch')
const fetchExchangeInfo = require('./cryptowatch/fetchExchangeInfo')
const fetchMarketsInfo = require('./cryptowatch/fetchMarketsInfo')
const cors = require('cors')


const app = express()
app.use(cors())

const port = 3000

const server = http.createServer(app)

const webSocketServer = new WebSocket.Server({
    server
})

webSocketServer.on('connection', ws => {
    
    ws.on('message', m => {
        const msg = JSON.parse(m)

        console.log(msg);

        // if (msg.event === 'add') {
        //     const marketsInfo = fetchMarketInfo()
        // }

        const cw = CWclient(msg.subscriptions)

        cw.onMarketUpdate(marketData => {
            // console.log(marketData);
            ws.send(JSON.stringify(marketData));
        });
    

        // webSocketServer.clients.forEach(client => client.send(m));
        
        cw.connect()
    });
    
});

server.listen(8999, () => console.log("Server started"))


app.get('/api/exchange', async (req, res) => {
    const exchangeInfo = await fetchExchangeInfo();
    res.json(exchangeInfo)
})

app.get('/api/markets', async (req, res) => {
    const marketsInfo = await fetchMarketsInfo();
    res.json(marketsInfo)
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

module.exports = webSocketServer