const axios = require('axios').default;
const { v4: uuidv4 } = require('uuid');
require('dotenv').config({ path: './.env' });

const getAPIkey = ()=>{
    return axios({
        method: 'post',
        url: `https://sandbox.momodeveloper.mtn.com/v1_0/apiuser/${process.env.MTN_UUID}/apikey`,
        headers: {
            'Accept': 'application/json',
            'Ocp-Apim-Subscription-Key': process.env.MTN_PRIMARY_KEY
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
        url: `https://sandbox.momodeveloper.mtn.com/collection/token/`,
        headers: {
            'Accept': 'application/json',
            'Ocp-Apim-Subscription-Key': process.env.MTN_PRIMARY_KEY,
            'X-Target-Environment': "sandbox"
        },
        auth: {
            username: process.env.MTN_UUID,
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

let requestPayment = async (phone, amount, requestUUID,bearerToken)=>{
    return axios({
        method: 'post',
        url: `https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay`,
        headers: {
            'Accept': 'application/json',
            'X-Reference-Id': requestUUID,
            'Ocp-Apim-Subscription-Key': process.env.MTN_PRIMARY_KEY,
            'X-Target-Environment': "sandbox",
            'Authorization': `Bearer ${bearerToken}`
        },
        data: {
            "amount": amount,
            "currency": "EUR",
            "externalId": "123",
            "payer": {
                "partyIdType": "MSISDN",
                "partyId": phone
            },
            "payerMessage": "Payment for Dpay App",
            "payeeNote": "Payment from Dpay App"
        },
      })
      .then(function(response){
          return response.data;
      }).catch(function(error){
        throw error;
      });
}

let getPaymentStatus = async(requestUUID, bearerToken)=>{
    return axios({
        method: 'get',
        url: `https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay/${requestUUID}`,
        headers: {
            'Accept': 'application/json',
            'Ocp-Apim-Subscription-Key': process.env.MTN_PRIMARY_KEY,
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

let verifyCustomerPayment = async (phone,amount)=>{
    try{
        const bearerToken= await getBearer();
        const requestUUID = uuidv4();
        await requestPayment(phone,amount,requestUUID,bearerToken);
        const paymentDetails = await getPaymentStatus(requestUUID,bearerToken);
        return paymentDetails;
    }catch (error) {
        throw error;
    }
    
}

module.exports=verifyCustomerPayment;