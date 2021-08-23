const axios = require('axios')
const crypto = require('crypto')
const query = require('querystring')

const base = process.env.API_URL
const apiKey = process.env.API_KEY
const secret = process.env.SECRET_KEY

/**
 * For connect with user's data
 * @param path
 * @param data
 * @param method
 * @returns {Promise<any>}
 */
async function privateCall(path, data = {}, method = 'GET') {
    let timestamp = Date.now()

    let signature = crypto.createHmac("sha256", secret)
        .update(`${query.stringify({...data, timestamp})}`)
        .digest("hex")

    let newData = {...data, timestamp, signature}

    try {
        let qs = newData ? `?${query.stringify(newData)}` : ""

        let result = await axios({
            method,
            url: `${base}${path}${qs}`,
            headers: {"X-MBX-APIKEY": apiKey}
        })
        return result.data
    } catch (e) {
        console.log(e.response); // this is the main part. Use the response property from the error object
        return e.response;
    }
}

/**
 * Generic function for use without API_KEY
 * @param path
 * @param data
 * @param method
 * @returns {Promise<any>}
 */
async function publicCall(path, data, method = 'GET') {
    try {
        let qs = data ? `?${query.stringify(data)}` : ""

        let result = await axios({
            method,
            url: `${base}${path}${qs}`
        })
        return result.data
    } catch (e) {
        console.log(e.response); // this is the main part. Use the response property from the error object
        return e.response;
    }
}

/**
 * Public Functions
 */
async function time() {
    return publicCall("time")
}

//bids = compras
//asks = vendas
async function depth(symbol = process.env.SYMBOL, limit = 5) {
    return publicCall("depth", {symbol, limit})
}

async function exchange() {
    return publicCall("exchangeInfo")
}

/**
 * Private Functions
 */

async function account() {
    return privateCall("account")
}

module.exports = {time, depth, exchange, account}