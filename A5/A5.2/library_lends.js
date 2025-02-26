const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors()); // Use CORS middleware
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('../../A6/A6.2/swagger_output.json');
app.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(swaggerFile));
const port = 3000;

let books = [
    {
        isbn: '978-3-86680-192-9',
        title: 'Harry Potter and the Philosopher\'s Stone',
        year: 1997,
        author: 'J.K. Rowling'
    },
    {
        isbn: '978-3-86680-193-6',
        title: 'Harry Potter and the Chamber of Secrets',
        year: 1998,
        author: 'J.K. Rowling'
    },
    {
        isbn: '978-3-86680-194-3',
        title: 'Harry Potter and the Prisoner of Azkaban',
        year: 1999,
        author: 'J.K. Rowling'
    },
    {
        isbn: '978-3-86680-195-0',
        title: 'Harry Potter and the Goblet of Fire',
        year: 2000,
        author: 'J.K. Rowling'
    },
    {
        isbn: '978-3-86680-196-7',
        title: 'Harry Potter and the Order of the Phoenix',
        year: 2003,
        author: 'J.K. Rowling'
    },
    {
        isbn: '978-3-86680-197-4',
        title: 'Harry Potter and the Half-Blood Prince',
        year: 2005,
        author: 'J.K. Rowling'
    },
    {
        isbn: '978-3-86680-198-1',
        title: 'Harry Potter and the Deathly Hallows',
        year: 2007,
        author: 'J.K. Rowling'
    },
    {
        isbn: '978-1-58617-048-0',
        title: 'The Hobbit',
        year: 1937,
        author: 'J.R.R. Tolkien'
    },
    {
        isbn: '978-3-86680-199-1',
        title: '1984',
        year: 1949,
        author: 'George Orwell'
    }
];

const lends = []

app.get('/books', (req, res) => {
    res.send(books)
})

app.get('/lends', (req, res) => {
    res.send(lends)
})

app.get('/lends/:id', (req, res) => {
    const lend = lends.find(lend => lend.id === parseInt(req.params.id));
    if (!lend) return res.status(404).send('Ausleihe nicht gefunden.');
    res.send(lend);
});

app.post('/lends', (req, res) => {
    const { customer_id, isbn } = req.body;
    const book = books.find(book => book.isbn === isbn);
    if (!book) return res.status(404).send('Book not found.');

    const openLends = lends.filter(lend => lend.customer_id === customer_id && !lend.returned_at);
    if (openLends.length >= 3) return res.status(422).send('Customer already has three open lends.');

    const existingLend = lends.find(lend => lend.isbn === isbn && lend.returned_at === undefined);
    if (existingLend) return res.status(422).send('Book is already lent out.');

    const lend = { id: lends.length + 1, customer_id, isbn, borrowed_at: new Date() };
    lends.push(lend);
    res.send(lend);
});


app.delete('/lends/:id', (req, res) => {
    const lend = lends.find(lend => lend.id === parseInt(req.params.id));
    if (!lend) return res.status(404).send('Lend not found.');
    if (lend.returned_at) return res.status(422).send('Book has already been returned.');

    lend.returned_at = new Date();
    res.send(lend);
});

app.listen(port, () => {
    console.log(`Server läuft auf Port ${port}`);
});