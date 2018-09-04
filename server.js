const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);
app.locals.title = 'Bucket List';
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/api/v1/bucket_list', (request, response) => {
  database('bucket_list').select()
    .then((items) => {
      response.status(200).json(items);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.get('/api/v1/bucket_list/:id', (request, response) => {
  const { id } = request.params;

  database('bucket_list').where('id', id).select()
    .then(item => {
      if (item.length) {
        return response.status(200).json(item);
      }
      return response.status(404).json({error: '404: List item not found'});
    })
    .catch(() => (
      response.status(500).send({'Error': '500: Internal server error'})
    ));
});

app.post('/api/v1/bucket_list', (request, response) => {
  const item = request.body;

  for (let requiredParameters of [
    'title',
    'description'
  ]) {
    if (!item[requiredParameters]) {
      return response
        .status(404)
        .send({error: `Expected format: { title: <String>, description: <String> }. 
        You're missing a "${requiredParameters}" property.`});
    }
  }
  database('bucket_list').insert(item, 'id')
    .then(item => {
      return response.status(201).json({id: item[0]});
    })
    .catch(error => (
      response.status(500).json({ error })
    ));
});

app.delete('/api/v1/bucket_list/:id', (request, response) => {
  const { id } = request.params;

  database('bucket_list').where('id', id).del()
    .then(foundId => {
      if (!foundId) {
        return response.status(422).json({error: '422: No items found matching that ID.'})
      }
      return response.status(200).json(foundId);
    })
    .catch(error => (
      response.status(500).json({error: `Internal server error: ${error}`})
    ));
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.export = app;