import React from 'react';
import axios from 'axios';
import Book from './Book.js';
import Carousel from 'react-bootstrap/Carousel';
import AddBookButton from './AddBookButton.js';
import BookFormModal from './BookFormModal.js';
import { withAuth0 } from '@auth0/auth0-react';


class BestBooks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      books: [],
      showBookModal: false,
      isAdding: true,
      currentBook: null,
    }
  }

  componentDidMount() {
    this.getBooks();
  }
  setCurrentBook = (currentBook) => this.setState({ currentBook: currentBook });

  openModal = (buttonId) => {
    buttonId === 'add' && this.setState({ isAdding: true });
    buttonId === 'edit' && this.setState({ isAdding: false });

    this.setState({ showBookModal: true });
  }

  closeModal = () => {
    this.setState({ showBookModal: false });
  }

  async getBooks() {
    if (this.props.auth0.isAuthenticated) {
      const tokenResponse = await this.props.auth0.getIdTokenClaims();
      const jwt = tokenResponse.__raw; //jwt = json web token

      const axiosRequestConfig = {
        method: 'get',
        baseURL: process.env.REACT_APP_BACKEND,
        url: `/books`,
        headers: { "Authorization": `Bearer ${jwt}` }
      }
      const returnedBooks = await axios(axiosRequestConfig);
      this.setState({ books: returnedBooks.data });
    }
  }

  postBook = async (newBook) => {
    if (this.props.auth0.isAuthenticated) {
      const tokenResponse = await this.props.auth0.getIdTokenClaims();
      const jwt = tokenResponse.__raw;

      const axiosRequestConfig = {
        method: 'post',
        baseURL: process.env.REACT_APP_BACKEND,
        url: `/books`,
        data: newBook,
        headers: { "Authorization": `Bearer ${jwt}` }
      }

      try {
        const bookResponse = await axios(axiosRequestConfig);
        this.setState({ books: [...this.state.books, bookResponse.data] });
      } catch (e) {
        console.error(e);
      }
    }
  }

  handleBookFormSubmit = (e) => { // handles submissions for both adding and editing
    e.preventDefault();
    const bookObj = {
      title: e.target.title.value || this.state.currentBook.title,
      description: e.target.description.value || this.state.currentBook.description,
      status: e.target.status.value || this.state.currentBook.status,
      email: this.props.email,
    };

    this.closeModal();

    if (e.target.id === 'addBookForm') this.postBook(bookObj);
    if (e.target.id === 'updateBookForm') this.updateBook(this.state.currentBook._id, bookObj);
  }

  updateBook = async (id, bookObj) => {
    if (this.props.auth0.isAuthenticated) {
      const tokenResponse = await this.props.auth0.getIdTokenClaims();
      const jwt = tokenResponse.__raw;

      const axiosRequestConfig = {
        method: 'put',
        baseURL: process.env.REACT_APP_BACKEND,
        url: `/books/${id}`,
        data: bookObj,
        headers: { "Authorization": `Bearer ${jwt}` },
      }

      try {
        const bookResponse = await axios(axiosRequestConfig);
        const updatedBookArr = this.state.books.map((book) => {
          return (book._id === id) ? bookResponse.data : book;
        });
        this.setState({ books: updatedBookArr });
      } catch (e) {
        console.error(e)
      }
    }
  }

  deleteBook = async (id) => {
    if (this.props.auth0.isAuthenticated) {
      const tokenResponse = await this.props.auth0.getIdTokenClaims();
      const jwt = tokenResponse.__raw;


      const axiosRequestConfig = {
        method: 'delete',
        baseURL: process.env.REACT_APP_BACKEND,
        url: `/books/${id}`,
        headers: { "Authorization": `Bearer ${jwt}` }
        // params: { "ID": id } why doesn't this work?
      }

      try {
      await axios(axiosRequestConfig);
      const updatedBookArr = this.state.books.filter(book => book._id !== id);
        this.setState({ books: updatedBookArr });
    } catch (e) {
      console.error(e);
    }
  }
  }

  render() {
    return (
      <>
        <h2>My Essential Lifelong Learning &amp; Formation Shelf</h2>
        {this.state.books.length > 0 ? (
          <Carousel interval={null}>
            {this.state.books.map(bookObj => <Carousel.Item key={bookObj._id}><Book setCurrentBook={this.setCurrentBook} book={bookObj} deleteBook={this.deleteBook} openModal={this.openModal} /></Carousel.Item>)}
          </Carousel>
        ) : (
          <h3>No Books Found :</h3>
        )}
        <BookFormModal isAdding={this.state.isAdding} handleBookFormSubmit={this.handleBookFormSubmit} closeModal={this.closeModal} showBookModal={this.state.showBookModal} currentBook={this.state.currentBook} />
        <AddBookButton openModal={this.openModal} />
      </>
    )
  }
}

export default withAuth0(BestBooks);
