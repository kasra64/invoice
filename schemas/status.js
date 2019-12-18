'use strict';

const token = {
    response: {
        200: {
            type: 'object',
            properties: {
                token: {type: 'string'}
            }
        }
    },
    body: {
        type: 'object',
        properties: {
            invoiceId: {type: 'string', minLength: 1}
        },
        required: ['invoiceId']
    }
};

module.exports = {token};