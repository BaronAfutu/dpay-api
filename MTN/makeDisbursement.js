const axios = require('axios').default;
const { v4: uuidv4 } = require('uuid');
require('dotenv').config({ path: './.env' });

const getAPIkey = ()=>{
    return axios({
        method: 'post',
        url: `https://sandbox.momodeveloper.mtn.com/v1_0/apiuser/${process.env.MTN_DISBURSE_UUID}/apikey`,
        headers: {
            'Accept': 'application/json',
            'Ocp-Apim-Subscription-Key': process.env.MTN_DISBURSE_PKEY
        },
        data: {},
      })
      .then(function(response){
          return response.data.apiKey;
      }).catch(function(error){
        throw error;
      });
}

let getBearer = async ()=>{
    const apiKey= await getAPIkey();
    return axios({
        method: 'post',
        url: `https://sandbox.momodeveloper.mtn.com/disbursement/token/`,
        headers: {
            'Accept': 'application/json',
            'Ocp-Apim-Subscription-Key': process.env.MTN_DISBURSE_PKEY,
            'X-Target-Environment': "sandbox"
        },
        auth: {
            username: process.env.MTN_DISBURSE_UUID,
            password: apiKey
          },
        data: {},
      })
      .then(function(response){
          return response.data.access_token;
      }).catch(function(error){
        throw error;
      });
}


let makeTransfer = async (phone, amount,receipient, requestUUID,bearerToken)=>{
    return axios({
        method: 'post',
        url: `https://sandbox.momodeveloper.mtn.com/disbursement/v1_0/transfer`,
        headers: {
            'Accept': 'application/json',
            'X-Reference-Id': requestUUID,
            'Ocp-Apim-Subscription-Key': process.env.MTN_DISBURSE_PKEY,
            'X-Target-Environment': "sandbox",
            'Authorization': `Bearer ${bearerToken}`
        },
        data: {
            "amount": amount,
            "currency": "EUR",
            "externalId": "123",
            "payee": {
                "partyIdType": "MSISDN",
                "partyId": phone
            },
            "payerMessage": `Payment for ${receipient}`,
            "payeeNote": "Payment from Dpay App"
        },
      })
      .then(function(response){
          return response.data;
      }).catch(function(error){
        throw error;
      });
}

let getTransferStatus = async(requestUUID, bearerToken)=>{
    return axios({
        method: 'get',
        url: `https://sandbox.momodeveloper.mtn.com/disbursement/v1_0/transfer/${requestUUID}`,
        headers: {
            'Accept': 'application/json',
            'Ocp-Apim-Subscription-Key': process.env.MTN_DISBURSE_PKEY,
            'X-Target-Environment': "sandbox",
            'Authorization': `Bearer ${bearerToken}`
        },
        data: {},
      })
      .then(function(response){
          return response.data;
      }).catch(function(error){
        throw error;
      });
}

/**
 * Performs multiple transfers and returns details
 * @param {Array} phones List of receipient phone numbers
 * @param {Array} amounts List of amounts to be paid to receipients
 * @param {Array} receipients List of receipient names
 * @returns {Array} paymentDetails
 */
let verifyTransfers = async (phones,amounts,receipients)=>{
    try{
        let paymentDetails = []
        let requestUUID = "";
        const bearerToken= await getBearer();

        for(let i=0,n=phones.length;i<n;i++){
            requestUUID = uuidv4();
            await makeTransfer(phones[i],amounts[i],receipients[i],requestUUID,bearerToken);
            paymentDetails.push(await getTransferStatus(requestUUID,bearerToken));
        }
        
        return paymentDetails;
    }catch (error) {
        throw error;
    }
    
}

module.exports=verifyTransfers;