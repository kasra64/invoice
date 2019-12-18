'use strict';

const token = require('../schemas/status');
const request = require('request');
const CoinGecko = require('coingecko-api');

const fs = require('fs');

const Config = {
    apiURL: 'https://api.forgingblock.io/invoice/status'
};

module.exports = async function (fastify, opts) {

    const requestFromMother = (invoiceId, handler) => {
        return request(`${Config.apiURL}?invoiceId=${invoiceId}&paymentMethodId=BTC&_=1575903768088`, handler);
    };

    fastify.post(`/invoice`, { schema: token.token }, async (req, reply) => {
        const { invoiceId } = req.body;
        return new Promise(resolve => {
            requestFromMother(invoiceId, (error, response, body) => {
                if (error) {
                    console.log(error);
                } else {
                    resolve(body);
                }
            });
        }).then(value => {
            const allowed = [ 'btcAddress', 'status', 'orderAmount', 'orderAmountFiat' ];
            value = JSON.parse(value);
            const filtered = Object.keys(value)
              .filter(key => allowed.includes(key))
              .reduce((obj, key) => {
                obj[key] = value[key];
                return obj;
              }, {});
            reply.send(JSON.stringify(filtered));
        });
        
    });


    fastify.post(`/eth/invoice`, { schema: token.token }, async (req, reply) => {
        const { invoiceId } = req.body;
        const CoinGeckoClient = new CoinGecko();
        let data = await CoinGeckoClient.simple.price({
            ids: ['bitcoin', 'ethereum'],
            vs_currencies: ['usd'],
        });
        return new Promise(resolve => {
            requestFromMother(invoiceId, (error, response, body) => {
                if (error) {
                    console.log(error);
                } else {

                    resolve(body);
                }
            });
        }).then(value => {
            const allowed = [ 'btcAddress', 'status', 'orderAmount' ];
            value = JSON.parse(value);
            var filtered = Object.keys(value)
              .filter(key => allowed.includes(key))
              .reduce((obj, key) => {
                obj[key] = value[key];
                return obj;
              }, {});
            filtered.orderAmountFiat = ( filtered.orderAmount * data.data.bitcoin.usd );
            filtered.orderAmount = filtered.orderAmountFiat / data.data.ethereum.usd;
            filtered.orderAmountFiat = "$" + (filtered.orderAmountFiat.toFixed(2)) + " (USD)";
            filtered.orderAmount = filtered.orderAmount.toFixed(8);
            reply.send(JSON.stringify(filtered));
        });
        
    });



};


module.exports.autoPrefix = '/status';