import React from 'react';
import { Component } from 'react';
import './App.css';
import './listpage.css';
// import { API } from 'aws-amplify';
// import { deleteBook as deleteBookMutation } from './graphql/mutations';

import 'bootstrap/dist/css/bootstrap.min.css';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import { faEdit,faTrash } from "@fortawesome/free-solid-svg-icons";
//import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { faHeart, faHome, faChartLine } from "@fortawesome/free-solid-svg-icons";

const initialItemState = [
  { key:'0401', sortkey:'1', group: '4', name: '土', description: '作業41',data:'{total:1}' },
  { key:'0402', sortkey:'2', group: '4', name: '日', description: '作業42',data:'{total:2}' },
]

class ListPage extends Component {

  constructor(props){
    super(props);
    this.fetchItemsFromAPI = this.fetchItemsFromAPI.bind(this);
    this.selectM5 = this.selectM5.bind(this);
    this.state = {
      isLoggedIn: false,
      username: "",
      items: initialItemState,
      month: "4"
    };
    this.fetchItemsFromAPI();
  }

  async fetchItemsFromAPI() {
    this.setState({items: initialItemState}); 
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({"function":"list","key":"4","group":"4"});
    var requestOptions = {method: 'POST', headers: myHeaders, body: raw, redirect: 'follow' };
    fetch("https://pn2psx9qfd.execute-api.ap-northeast-1.amazonaws.com/dev", requestOptions)
    .then(response => response.text())
    .then(response => {
      const apiData = JSON.parse(response);
      this.setState({items: apiData});   
    })
    .catch(error => console.log('error', error));
  }

  // async createItem() {
  //   this.props.history.push({
  //     pathname: '/detailpage',
  //     state: {  item: {ID:""}  }
  //   });
  // }

  editItem(item) {
    this.props.history.push({
      pathname: '/detailpage',
      state: { month:this.state.month, item: item }
    });
  }

//   async deleteItem(item) {
//     if (!item.id) return;
//     const newItem = {
//       id: item.id
//     };
//     await API.graphql({ query: deleteBookMutation, variables: { input: newItem } });
//   }

  selectM5() {
    this.setState({month:"5"});
  }

  render() {

    return (
      <div style={{marginBottom: 30}}  className="container-fluid bg-color-1">
        <h1>{this.state.month}月予定</h1>

        {
          this.state.items.map(item => (
            <div className="card" key={item.key || item.name}>
              <div className="card-body bg-color-2" onClick={() => this.editItem(item)}>
                <div className="row">
                  <div className="col-3">
                    <div><h4>{item.sortkey}({item.name})</h4></div>
                  </div>
                  <div className="col-6">
                    <div><h4>{item.description}</h4></div>
                    <div>{item.data}</div>
                  </div>
                  {/* <div className="col-2">
                    <button type="button" onClick={() => this.editItem(item)} className="btn btn-primary">
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button type="button" onClick={() =>  this.deleteItem(item)} className="btn btn-primary">
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div> */}
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
      