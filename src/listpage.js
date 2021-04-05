import React from 'react';
import { Component } from 'react';
import './App.css';
import './listpage.css';
//import { Storage } from 'aws-amplify';
import { API } from 'aws-amplify';
import { listBooks } from './graphql/queries';
import { deleteBook as deleteBookMutation } from './graphql/mutations';

//import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
//import { Auth } from 'aws-amplify';
import 'bootstrap/dist/css/bootstrap.min.css';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit,faTrash } from "@fortawesome/free-solid-svg-icons";
//import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
//import { faAmazon } from "@fortawesome/free-brands-svg-icons";
import { faHeart, faHome, faChartLine } from "@fortawesome/free-solid-svg-icons";

const initialItemState = [
  { id:'4/1', name: '土', description: '作業' },
  { id:'4/2', name: '日', description: '立ち合い' }
]

class ListPage extends Component {

  constructor(props){
    super(props);
    //this.fetchItemsFromAPI = this.fetchItemsFromAPI.bind(this);
    //this.createItem = this.createItem.bind(this);
    //this.editItem = this.editItem.bind(this);
    this.selectM5 = this.selectM5.bind(this);
    this.state = {
      isLoggedIn: false,
      username: "",
      items: initialItemState,
      month: "4"
    };
    this.fetchItems();
  }

  async fetchItems() {
    const apiData = await API.graphql({ query: listBooks });
    //const booksFromAPI = apiData.data.listBooks.items;
    //setItems(apiData.data.listBooks.items);
    this.setState({items: apiData.data.listBooks.items}); 

  }

  async createItem() {
    this.props.history.push({
      pathname: '/detailpage',
      state: {  item: {ID:""}  }
    });
  }

  editItem(item) {
    this.props.history.push({
      pathname: '/detailpage',
      state: { item: item }
    });
  }

  async deleteItem(item) {
    if (!item.id) return;
    const newItem = {
      id: item.id
    };
    await API.graphql({ query: deleteBookMutation, variables: { input: newItem } });
  }

  selectM5() {
    this.setState({month:"5"});
  }

  //隠しボタンで起動するlogin
  // login() {
  //   this.setState({isLoggedIn: !this.state.isLoggedIn});
  // }

  render() {

    return (
      <div style={{marginBottom: 30}}  className="container-fluid bg-color-1">
        <h1>{this.state.month}月予定</h1>

        {
          this.state.items.map(item => (
            <div className="card" key={item.id || item.name}>
              <div className="card-body bg-color-2">
                <div className="row">
                  <div className="col-2">
                    <div><h4>{item.id}</h4></div>
                  </div>
                  <div className="col-6">
                    <div><h4>{item.name}</h4></div>
                    <div>{item.description}</div>
                  </div>
                  <div className="col-2">
                    <button type="button" onClick={() => this.editItem(item)} className="btn btn-primary">
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button type="button" onClick={() =>  this.deleteItem(item)} className="btn btn-primary">
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>              
              </div>
              
            </div>              
          ))
        }

        {/* <div style={{marginTop: 100}}  className="container-fluid">
        <div className="row">
          <div className="col-10"/>
          <div className="col-2">
            {this.state.isLoggedIn &&
              <button type="button" onClick={this.createItem} className="btn btn-primary">
                <FontAwesomeIcon icon={faPlusCircle} />
              </button>
            }
            <button type="button" onClick={this.login} className="btn btn-secondary"/>
          </div>
        </div>              
        </div>  */}

        <footer className="siteFooter">
          <FontAwesomeIcon icon={faHome} onClick={this.selectM5}/>
          <FontAwesomeIcon icon={faChartLine} />
          <FontAwesomeIcon icon={faHeart} />
        </footer>

      </div>
    );
  }
}

export default withRouter(ListPage)  
      