const express = require('express');
const axios = require('axios');
const newsApi = express.Router();


newsApi.get('/home', async(req,res) => {
    try {
        let url = 'https://newsapi.org/v2/top-headlines?category=gaming&apiKey=2602fcf2eab74d3d9a64ef51153a0526';
        const newsGet = await axios.get(url);
        res.render('api-news', {articles:newsGet.data.articles,title:'api-news'});
    } catch (error) {
        if (error.response){
            console.error(error)
        }
    }
});

module.exports = newsApi;