import React from 'react';
import { Component } from 'react';
import './App.css';
import './listpage.css';
//import { Storage } from 'aws-amplify';
import { API } from 'aws-amplify';
import { listBooks } from './graphql/queries';

//import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
//import { Auth } from 'aws-amplify';
import 'bootstrap/dist/css/bootstrap.min.css';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit,faTrash } from "@fortawesome/free-solid-svg-icons";
//import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
//import { faAmazon } from "@fortawesome/free-brands-svg-icons";

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
    //this.login = this.login.bind(this);
    this.state = {
      isLoggedIn: false,
      username: "",
      items: initialItemState
    };
    this.fetchItems();
  }

  async fetchItems() {
    const apiData = await API.graphql({ query: listBooks });
    //const booksFromAPI = apiData.data.listBooks.items;
    //setItems(apiData.data.listBooks.items);
    this.setState({items: apiData.data.listBooks.items}); 

  }

  // async fetchItemsFromAPI() {
  //   this.state = {items:initialItemState}
  //   var myHeaders = new Headers();
  //   myHeaders.append("Content-Type", "application/json");
  //   var raw = JSON.stringify({"function":"list","category":"food"});
  //   var requestOptions = {method: 'POST', headers: myHeaders, body: raw, redirect: 'follow' };
  //   fetch("https://yxckp7iyk4.execute-api.ap-northeast-1.amazonaws.com/dev", requestOptions)
  //   .then(response => response.text())
  //   .then(async(response) => {
  //     const apiData = JSON.parse(response);
  //     //await Promise.all(apiData.map(async item => {
  //     apiData.map(async item => {
  //       if (item.imagefile) {
  //         // imageFile名からimageUrlを取得する
  //         let dataExpireSeconds = (3 * 60);
  //         const imageurl = await Storage.get(item.imagefile, { expires: dataExpireSeconds });
  //         //const bucket   = "https://ikkohchoice232927-staging.s3-ap-northeast-1.amazonaws.com/public/";
  //         //const imageurl = bucket + item.imagefile;
  //         item.imageurl = imageurl;
  //         this.setState({items: apiData});   //imageurlを取得ごとに非同期でセットする。apiDataのmap中の処理でもOK？
  //         return item;    
  //       }
  //       return item;    
  //     })
  //   })
  //   .catch(error => console.log('error', error));
  //   //alert(response);
  // }


  async createItem() {
    this.props.history.push({
      pathname: '/detailpage',
      state: {  item: {ID:""}  }
    });
  }

  // async deleteItemFromAPI({ ID }) {
  //   const newItemsArray = this.state.items.filter(item => item.ID !== ID);
  //   this.setState({items: newItemsArray});
    
  //   var myHeaders = new Headers();
  //   myHeaders.append("Content-Type", "application/json");
  //   var raw = JSON.stringify({"function":"delete", "ID":ID });
  //   var requestOptions = {method: 'POST', headers: myHeaders, body: raw, redirect: 'follow' };
  //   fetch("https://yxckp7iyk4.execute-api.ap-northeast-1.amazonaws.com/dev", requestOptions)
  //   .catch(error => console.log('error', error));
  // }

  editItem(item) {
    this.props.history.push({
      pathname: '/detailpage',
      state: { item: item }
    });
  }

  // orderItem(item) {
  //   this.props.history.push({
  //     pathname: '/detailpage',
  //     state: { item: item }
  //   });
  // }

  //隠しボタンで起動するlogin
  // login() {
  //   this.setState({isLoggedIn: !this.state.isLoggedIn});
  // }

  render() {

    return (
      <div style={{marginBottom: 30}}  className="container-fluid bg-color-1">
        <h1>K2310{this.state.username}</h1>

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
                  {/* <div className="col-2">
                    <a className="btn btn-primary" href={item.amazonurl} role="button">
                        <FontAwesomeIcon icon={faAmazon} />
                    </a>
                  </div> */}
                  {/* {this.state.isLoggedIn && */}
                    <div className="col-2">
                      <button type="button" onClick={() => this.editItem(item)} className="btn btn-primary">
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button type="button" onClick={() =>  this.deleteItemFromAPI(item)} className="btn btn-primary">
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  {/* }  */}
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

      </div>
    );
  }
}

export default withRouter(ListPage)  
      