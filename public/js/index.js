const url = '/api/v1/bucket_list';

let item;


const submitItem = async (event) => {
  event.preventDefault();
  const title = $('#title').val();
  const description = $('#description').val();
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({title, description})
  }
  const response = await fetch(url, options);
  const result = await response.json();
  const id = result.id;
  item = new Item(title, description, id);
}

class Item {
  constructor(title, description, id) {
    this.title = title;
    this.description = description;
    this.id = id;
  }
}

$('#bucket-list-form').on('submit', submitItem)