const express = require('express');
const bodyParser = require('body-parser');
const supabaseClient = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const ombdKey = process.env.OMDB_KEY;

const supabase = supabaseClient.createClient(supabaseUrl, supabaseKey);

const moodMap = {
  happy: "comedy feel-good uplifting",
  sad: "drama emotional heartbreaking",
  calm: "relaxing peacful ambient",
  angry: "action intense violent thriller",
  romantic: "romance love relationship",
  cozy: "warm comforting slice-of-life",
  adrenaline: "suspense horror mystery"
};

function validateParams(req, res) {
  const { mood, mediaType, amount } = req.query;

  if (!mood || !mediaType || !amount) {
    res.status(400).json({ error: "Missing all 3!" });
    return false;
  }
  return true;
}

app.get('/history', async (req, res) => {
  console.log('Getting History!');

  const { data, error } = await supabase
    .from('history')
    .select()
    .order('id', { ascending: false });

  if (error) {
    console.log(error);
    res.status(500).send(error);
  } else {
    res.json(data);
  }
});

app.post('/history', async (req, res) => {
  console.log('Saving history entry');

  const { mood, mediaType, amount } = req.body;

  const { data, error } = await supabase
    .from('history')
    .insert([
      {
        mood,
        media_type: mediaType,
        amount
      }
    ])
    .select();

  if (error) {
    console.log(error);
    res.status(500).send(error);
  } else {
    res.json(data);
  }
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/frontpage.html')
});

app.get('/recommendations', async (req, res) => {
  console.log('generating recs...');

  const { mood, mediaType, amount } = req.query;
  const keyword = moodMap[mood] || "popular";
  const limit = parseInt(amount) || 3;

  try {
    let results = {
      movies: [],
      books: [],
      music: []
    };

    if (mediaType === 'movie' || mediaType === 'all') {
      try {
        const movieRes = await axios.get(
          `http://www.omdbapi.com/?apikey=${process.env.OMDB_KEY}&s=${keyword}`
        );

        results.movies = movieRes.data?.Search?.slice(0, limit) || [];
      } catch (err) {
        console.log("OMDb failed:", err.message);
      }
    }

    if (mediaType === 'book' || mediaType === 'all') {
      try {
        const bookRes = await axios.get(
          `https://openlibrary.org/search.json?q=${keyword}`
        );

        results.books = bookRes.data?.docs?.slice(0, limit) || [];
      } catch (err) {
        console.log("Books failed:", err.message);
      }
    }

    if (mediaType === 'music' || mediaType === 'all') {
      try {
        const musicRes = await axios.get(
          `https://musicbrainz.org/ws/2/recording/?query=${keyword}&fmt=json`,
          {
            headers: {
              'User-Agent': 'Final_Proj (jcordon2@terpmail.umd.edu)'
            }
          }
        );

        results.music = musicRes.data?.recordings?.slice(0, limit) || [];
      } catch (err) {
        console.log("Music failed:", err.message);
      }
    }

    res.json(results);

  } catch (error) {
    console.log("TOTAL ROUTE FAIL:", error);
    res.status(500).send(error);
  }
});

module.export = app;