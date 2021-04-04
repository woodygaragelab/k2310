import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { API } from 'aws-amplify';
import 'bootstrap/dist/css/bootstrap.min.css';
import './detailpage.css';
import Button from 'react-bootstrap/Button';
import { createBook as createBookMutation } from './graphql/mutations';
import { updateBook as updateBookMutation } from './graphql/mutations';
import { deleteBook as deleteBookMutation } from './graphql/mutations';

class DetailPage extends Component{

  constructor(props) {
    super(props);
    this.handleChange0 = this.handleChange0.bind(this)
    this.handleChange1 = this.handleChange1.bind(this)
    this.handleChange2 = this.handleChange2.bind(this)
    this.handleAdd = this.handleAdd.bind(this)
    this.handleUpdate = this.handleUpdate.bind(this)
    this.createBook = this.createBook.bind(this);
    this.updateBook = this.updateBook.bind(this);
    
    this.state = {
      item: this.props.location.state.item,
    };

  }

  async createBook() {
    if (!this.state.item.name || !this.state.item.description) return;
    const newItem = {
        id: this.state.item.id,
        name: this.state.item.name,
        description: this.state.item.description,
        guests: this.state.item.guests
    };
    await API.graphql({ query: createBookMutation, variables: { input: newItem } });
  }

  async updateBook() {
    if (!this.state.item.id || !this.state.item.name) return;
    const newItem = {
      id: this.state.item.id,
      name: this.state.item.name,
      description: this.state.item.description,
      guests: this.state.item.guests
    };
    await API.graphql({ query: updateBookMutation, variables: { input: newItem } });
  }

  handleChange0(e){
    this.setState({item: { ...this.state.item, id: e.target.value }});
  }

  handleChange1(e){
    this.setState({item: { ...this.state.item, name: e.target.value }});
  }

  handleChange2(e){
   this.setState({item: { ...this.state.item, description: e.target.value }});
  }

  handleUpdate() {
    this.updateBook();
    this.returnToListPage();
  }

  handleAdd() {
    this.createBook();
  }

  returnToListPage() {
    this.props.history.push({
      pathname: '/',
      state: { 
        name: this.state.name,
        description: this.state.description
      }
    });
  }

  render(){
    return(
      <div className="container-fluid">
      <form>
        <div className="form-group woodytext">
          <label for="itemid">日付</label>
          <input
            type='text' className="form-control" id="itemid" 
            onChange={this.handleChange0}
            placeholder="MM/DD"
            value={this.state.item.id}
          />
        </div>
        <div className="form-group woodytext">
          <label for="itemname">曜日</label>
          <input
            type='text' className="form-control" id="itemname" 
            onChange={this.handleChange1}
            placeholder="item name"
            value={this.state.item.name}
          />
        </div>
        <div className="form-group woodytext">
          <label for="itemdesc">メモ</label>
          <input
            type='text' className="form-control" id="itemdesc" 
            onChange={e => this.setState({item: { ...this.state.item, 'description': e.target.value }})}
            placeholder="description"
            value={this.state.item.description}
          />
        </div>
        <div className="form-group woodytext">
          <label for="amazonurl">滞在者</label>
          <input
            type='text' className="form-control" id="guests" 
            onChange={e => this.setState({item: { ...this.state.item, 'guests': e.target.value }})}
            placeholder="guests"
            value={this.state.item.guests}
          />
        </div>
        <div className="form-group woodytext">
          <Button onClick={this.handleUpdate}>UPDATE</Button>
          <Button onClick={this.handleAdd}>ADD</Button>
        </div>
      </form>
    </div>
    )
  }
}

export default withRouter(DetailPage);
