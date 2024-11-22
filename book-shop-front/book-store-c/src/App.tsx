import Layout from "./Components/layout/Layout";
import { BookStoreThemeProvider } from "./context/themeContext";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Error from "./Components/Common/Error";
import Signup from "./pages/Signup";
import ResetPasword from "./pages/ResetPassword";
import Login from "./pages/Login";
import Books from "./pages/Books";
import BookDetail from "./pages/BookDetail";
import Cart from "./pages/Cart";
import Home from "./pages/Home";
import { QueryClientProvider } from "react-query";
import { queryClient } from "./api/queryClient";
import ToastContainer from "./Components/Common/toast/ToastContainer";

const routeList = [
  {
    path : '/',
    element : ( <Home /> ),
  },
  {
    path : '/books',
    element : ( <Books /> ),
  },
  {
    path : '/signup',
    element : ( <Signup /> ),
  },
  {
    path : '/reset',
    element : ( <ResetPasword /> ),
  },
  {
    path : '/login',
    element : (<Login />),
  },
  {
    path : '/book/:bookId',
    element : (<BookDetail />),
  },
  {
    path : '/cart',
    element : ( <Cart /> ),
  },
];

const router = createBrowserRouter(
  routeList.map((item) => {
    return {
      ...item,
      element : <Layout> {item.element} </Layout>,
      errorElement : <Error />
    };
  })
);

function App() {
  return(
    <QueryClientProvider client={queryClient}>
      <BookStoreThemeProvider>
        <RouterProvider router={router}/>
        <ToastContainer />
      </BookStoreThemeProvider>
    </QueryClientProvider>
  )
}

export default App;
