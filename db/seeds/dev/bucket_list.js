
exports.seed = (knex, Promise) => {
  return knex('bucket_list').del()
    .then(() => {

      return knex('bucket_list').insert([
        {title: 'Skydiving', description: 'Jump out of a plane'},
        {title: 'Marathon', description: 'Run 42km'},
        {title: 'Scrooge McDuck', description: 'Swim in a pile of money'}
      ])
    })
    .then(() => console.log('seeding complete'))
    .catch(error => console.log(`Error seeding data: ${error}`));
};
