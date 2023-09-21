const queryBuilder = (req) => {
  let quere = {};
  let querySort;
  //handle query
  if (req?.query?.cat) {
    quere.cat = req.query.cat;
  }
  if (req?.query?.brand) {
    quere.brand = req.query.brand;
  }

  //handle sorting cases
  switch (req?.query?.sort) {
    case "newest": {
      querySort = { createdAt: -1 };
      break;
    }
    case "oldest": {
      querySort = { createdAt: 1 };
      break;
    }
    case "priceDesc": {
      querySort = { "price.amount": -1 };
      break;
    }
    case "priceAsc": {
      querySort = { "price.amount": 1 };
      break;
    }
    default: {
      querySort = { createdAt: 1 };
    }
  }
  return {
    query: quere,
    sort: querySort,
  };
};

module.exports = queryBuilder;
