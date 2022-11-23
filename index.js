///////////////////////Server///////////////////////////
const fs = require('fs');
const http = require('http');
const path = require('path/posix');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate');
const slugify = require('slugify');

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8')
const dataObj = JSON.parse(data); //To convert the data in string to object
const slugs = dataObj.map(el => slugify(el.productName, {
    lower: true
}))
console.log(slugs);

const server = http.createServer((req, res) => {
    // console.log(req.url);
    // console.log(url.parse(req.url , true));
    // const pathName = req.url;
    const {
        query,
        pathname
    } = url.parse(req.url, true); //video parsing variables from url


    // OVERVIEW PAGE
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, {
            'Content-type': 'text/html'
        });

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml)
        res.end(output)
    }

    // PRODUCT PAGE
    else if (pathname === '/product') {
        res.writeHead(200, {
            'Content-type': 'text/html'
        });
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output)
    }

    // API PAGE
    else if (pathname === '/api') {
        res.writeHead(200, {
            'Content-type': 'application/json'
        });
        res.end(data)
    }

    // NOT FOUND PAGE
    else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own0-header': 'hello-world'
        });
        res.end('<h1>Page not found</h1>')
        // This writeHead can also send Headers and to send Headers we need to specify the object here and then we put the Headers that we want to send. What is a Header then? A HTTP Header is basically a piece of information about a response that we are sending back.
    }

    // res.end("Hello from the server !")
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requests on port 8000');
});
///////////////////////Routing//////////////////////////////
// Routing can be complicated in a real big world application so we use a tool for that which is Express.