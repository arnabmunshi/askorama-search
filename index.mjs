import { create, search, insert, insertMultiple, remove } from "@orama/orama";

const searcheFunction = async () => {
  const db = await create({
    schema: {
      name: "string",
      description: "string",
      price: "number",
      meta: {
        rating: "number",
      },
    },
  });

  await insert(db, {
    name: "Wireless Headphones",
    description:
      "Experience immersive sound quality with these noise-cancelling wireless headphones.",
    price: 99.99,
    meta: {
      rating: 4.5,
    },
  });

  const searchResult = await search(db, {
    term: "Wireless",
  });

  console.log(searchResult.hits.map((hit) => hit.document));
};
// searcheFunction();

const removeFunction = async () => {
  const movieDB = await create({
    schema: {
      title: "string",
      director: "string",
      plot: "string",
      year: "number",
      isFavorite: "boolean",
    },
  });

  const thePrestigeId = await insert(movieDB, {
    title: "The prestige",
    director: "Christopher Nolan",
    plot: "Two friends and fellow magicians become bitter enemies after a sudden tragedy. As they devote themselves to this rivalry, they make sacrifices that bring them fame but with terrible consequences.",
    year: 2006,
    isFavorite: true,
  });

  const bigFishId = await insert(movieDB, {
    title: "Big Fish",
    director: "Tim Burton",
    plot: "Will Bloom returns home to care for his dying father, who had a penchant for telling unbelievable stories. After he passes away, Will tries to find out if his tales were really true.",
    year: 2004,
    isFavorite: true,
  });

  const harryPotterId = await insert(movieDB, {
    title: "Harry Potter and the Philosopher's Stone",
    director: "Chris Columbus",
    plot: "Harry Potter, an eleven-year-old orphan, discovers that he is a wizard and is invited to study at Hogwarts. Even as he escapes a dreary life and enters a world of magic, he finds trouble awaiting him.",
    year: 2001,
    isFavorite: false,
  });

  console.log(await remove(movieDB, harryPotterId));

  const searchResult = await search(movieDB, {
    term: "Big",
  });

  console.log(searchResult.hits.map((hit) => hit.document));
};
// removeFunction();

const multipleInsert = async () => {
  const docs = [
    {
      title: "The prestige",
      director: "Christopher Nolan",
      plot: "Two friends and fellow magicians become bitter enemies after a sudden tragedy. As they devote themselves to this rivalry, they make sacrifices that bring them fame but with terrible consequences.",
      year: 2006,
      isFavorite: true,
    },
    {
      title: "Big Fish",
      director: "Tim Burton",
      plot: "Will Bloom returns home to care for his dying father, who had a penchant for telling unbelievable stories. After he passes away, Will tries to find out if his tales were really true.",
      year: 2004,
      isFavorite: true,
    },
    {
      title: "Harry Potter and the Philosopher's Stone",
      director: "Chris Columbus",
      plot: "Harry Potter, an eleven-year-old orphan, discovers that he is a wizard and is invited to study at Hogwarts. Even as he escapes a dreary life and enters a world of magic, he finds trouble awaiting him.",
      year: 2001,
      isFavorite: false,
    },
  ];
  const movieDB = await create({
    schema: {
      title: "string",
      director: "string",
      plot: "string",
      year: "number",
      isFavorite: "boolean",
    },
  });

  const result = await insertMultiple(movieDB, docs);
  console.log(result);
};
// multipleInsert();

const searchWithLimitAndOffset = async (limit = 2, page = 1) => {
  let offset = 0;
  if (page > 1) {
    offset = (page - 1) * limit;
  }
  const result = await fetch("https://jsonplaceholder.typicode.com/photos");
  const photos = await result.json();

  const photosFilter = photos.map((item) => {
    const obj = {
      albumId: item.albumId,
      photoId: item.id,
      title: item.title,
      url: item.url,
      thumbnailUrl: item.thumbnailUrl,
    };
    return obj;
  });

  const photoDB = await create({
    schema: {
      albumId: "number",
      photoId: "number",
      title: "string",
      url: "string",
      thumbnailUrl: "string",
    },
  });
  await insertMultiple(photoDB, photosFilter);

  const searchResult = await search(photoDB, {
    term: "accusamus",
    limit,
    offset,
    sortBy: {
      property: "albumId",
    },
  });

  console.log(searchResult.hits.map((hit) => hit.document));
};
// searchWithLimitAndOffset(6, 0);
