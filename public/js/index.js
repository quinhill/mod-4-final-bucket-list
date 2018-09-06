const urlAll = '/api/v1/bucket_list';

const urlId = (id) => (`/api/v1/bucket_list/${id}`);

let item;

const fetchAll = async () => {
  const response = await fetch(urlAll);
  const allCards = await response.json();
  allCards.forEach(item => {
    appendItem(item);
  })
}

fetchAll();

const checkInputs = (event) => {
  event.preventDefault();
  const title = $('#title').val();
  const description = $('#description').val();
  if (title === '' || description === '') {
    alert('Please make sure you have filled in the title and description')
  } else {
    submitItem($('#title').val(), $('#description').val());
  }
}

const submitItem = async (title, description) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({title, description})
  }
  const response = await fetch(urlAll, options);
  const result = await response.json();
  const id = result.id;
  item = new Item(title, description, id);
  appendItem(item);
  clearInputs()
}

const clearInputs = () => {
  $('#title').val('');
  $('#description').val('');
}

class Item {
  constructor(title, description, id) {
    this.title = title;
    this.description = description;
    this.id = id;
  }
}

const appendItem = (item) => {
  $('#list-container').append(`
  <div class="item-card" id="${item.id}">
    <div class="card-top">
      <h3>${item.title}</h3>
      <button class="delete-button" id="${item.id}">
        delete
      </button>
    </div>
    <p>${item.description}</p>
  </div>
  `)
}

const deleteItem = (event) => {
  const { id } = event.target;
  deleteCard(id);
}

const deleteCard = async (id) => {
  const response = await fetch(
    urlId(id), 
    {method: "DELETE"}
  );
  const result = await response.json();
  $('#list-container').empty();
  fetchAll();
}

$('#bucket-list-form').on('submit', checkInputs)
$('#list-container').on('click', '.item-card', deleteItem);