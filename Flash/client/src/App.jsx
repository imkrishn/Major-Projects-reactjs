import { ApolloProvider, InMemoryCache, ApolloClient, HttpLink } from '@apollo/client';
import AppRoute from './routes/AppRoute';
import { Provider } from 'react-redux';
import { store } from './redux/store';


function App() {
  const httpLink = new HttpLink({
    uri: 'http://localhost:8000/graphql', // Adjust this if your server URL changes
    credentials: 'include', // Include if your server needs credentials
  });

  const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
  });

  return (
    <Provider store={store}>
      <ApolloProvider client={client}>
        <AppRoute />
      </ApolloProvider>
    </Provider>
  );
}

export default App;
