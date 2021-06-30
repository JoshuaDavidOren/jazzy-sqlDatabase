const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('server/public'));

app.listen(PORT, () => {
    console.log('listening on port', PORT)
});
// setting up shortcut to use pg node library
const pg = require('pg');
const Pool = pg.Pool;
//configuring/connecting database.
const config = {
    database: 'jazzy_sql',
    host: 'localhost',
    port: 5432,
    max: 9001,
    idleTimeoutMillis: 30000,
};
// created a pool to manage connections
const pool = new Pool(config);

pool.on('connect', (client) => {
    console.log('postgresql is working');
});

pool.on('error', (err, client) => {
    console.log('unexpected error, are you there client?', err);
});

// TODO - Replace static content with a database tables
// const artistList = [{
//         name: 'Ella Fitzgerald',
//         birthdate: '04-25-1917'
//     },
//     {
//         name: 'Dave Brubeck',
//         birthdate: '12-06-1920'
//     },
//     {
//         name: 'Miles Davis',
//         birthdate: '05-26-1926'
//     },
//     {
//         name: 'Esperanza Spalding',
//         birthdate: '10-18-1984'
//     },
// ]
// const songList = [{
//         title: 'Take Five',
//         length: '5:24',
//         released: '1959-09-29'
//     },
//     {
//         title: 'So What',
//         length: '9:22',
//         released: '1959-08-17'
//     },
//     {
//         title: 'Black Gold',
//         length: '5:17',
//         released: '2012-02-01'
//     }
// ];

app.get('/artist', (req, res) => {
    console.log(`In /songs GET`);
    let qText = 'SELECT * FROM "artist" ORDER BY "birthdate" DESC;'

    pool.query(qText)
        .then(result => {
            res.send(result.rows);
        })
        .catch(error => {
            console.log('error trying to get artist list', error)
            res.sendStatus(500);
        });

});

app.post('/artist', (req, res) => {
    const newArtist = req.body;

    const qText = `INSERT INTO "artist" (name, birthdate)
    VALUES ($1, $2);
    `;

    pool.query(qText, [newArtist.name, newArtist.birthdate])
        .then(dbResponse => {
            res.sendStatus(201);
        })
        .catch(error => {
            console.log('is that even a real artist?', error);
            res.sendStatus(500);
        });
    // artistList.push(req.body);
    // res.sendStatus(201);
});

app.get('/song', (req, res) => {
    const qText = `SELECT * FROM "song" ORDER BY "title" ASC`

    pool.query(qText)
        .then(result => {
            res.send(result.rows);
        })
        .catch(error => {
            console.log('cant find your song bud', error);
            res.sendStatus(500);
        });
    // console.log(`In /songs GET`);
    // res.send(songList);
});

app.post('/song', (req, res) => {
    const newSong = req.body
    const qText = `INSERT INTO "song" (title, length, released)
    VALUES ($1, $2, $3)
    `;
    pool.query(qText, [newSong.title, newSong.length, newSong.released])
        .then(dbResponse => {
            res.sendStatus(201)
        })
        .catch(error => {
            console.log('now I know thats not a song', error);
            res.sendStatus(500);
        })
        // songList.push(req.body);
        // res.sendStatus(201);
});