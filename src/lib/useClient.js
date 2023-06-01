import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: '' /* Add url here */
});

const authLink = setContext((_, { headers }) => {

  return {
    headers: {
      ...headers,
      authorization: '' /* Add token here */
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

export default client;