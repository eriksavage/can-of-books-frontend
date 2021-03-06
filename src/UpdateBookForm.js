import { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

class UpdateBookForm extends Component {

  handleSubmitClick = (e) => {
    this.props.handleBookFormSubmit(e);
  }

  render() {
    return (
      <Form id='updateBookForm' onSubmit={this.handleSubmitClick}>
        <h3>Edit this book:</h3>
        <Form.Group className="mb-3" controlId="title">
          <Form.Label>Book Title</Form.Label>
          <Form.Control type="text" placeholder={this.props.currentBook.title} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control type="text" placeholder={this.props.currentBook.description} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="status">
          <Form.Label>Status</Form.Label>
          <Form.Control type="text" placeholder={this.props.currentBook.status} />
        </Form.Group>
        <Button variant="success" type="submit">
          Submit
        </Button>
      </Form>
    )
  }
}

export default UpdateBookForm;