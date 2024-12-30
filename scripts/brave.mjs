import ky from 'ky';

const searchBrave = async (query) => {
  const response = await ky.get('https://api.search.brave.com/res/v1/web/search', {
    searchParams: {
      q: query
    },
    headers: {
      'Accept': 'application/json',
      'Accept-Encoding': 'gzip', 
      'X-Subscription-Token': process.env.BRAVE_API_KEY
    }
  }).json();

  return response;
};

export { searchBrave };