const api = require('./api')
const symbol = process.env.SYMBOL
setInterval(async () => {
    let buy = 0, sell = 0;
    // let exchange = await api.exchange()
    // console.log(exchange)

    let account = await api.account()
    let coins = account.balances.filter(b => symbol.indexOf(b.asset) !== -1)
    console.log(coins)

    let result = await api.depth()

    if (result.bids && result.bids.length) {
        buy = parseInt(result.bids[0][0])
        console.log(`COMPRA = ${buy}`)
    }

    if (result.asks && result.asks.length) {
        sell = parseInt(result.asks[0][0])
        console.log(`VENDA = ${sell}`)
    }

}, process.env.CRAWLER_INTERVAL)