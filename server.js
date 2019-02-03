const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 5000
const reqwest = require('reqwest')
const mcache = require('memory-cache')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/api/jokes', (req, res) => {
	const key = 'jokes'
	const cached_jokes = mcache.get(key)
	if (cached_jokes){
		res.send({ results: cached_jokes })
	} else {
		reqwest({ url: 'https://icanhazdadjoke.com/search',
			headers: {
				'Accept': 'application/json',
				'Access-Control-Allow-Headers': '*'
			}    , method: 'get',
			error: (err) => { 
				console.log('err', err)
			},
			success: (resp) => {
				mcache.put(key, resp.results, 10000)
				res.send({ results: resp.results })
			}
		})
	}
});

app.listen(port, () => console.log(`Listening on port ${port}`))