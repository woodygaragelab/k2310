import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './detailpage.css';
import Button from 'react-bootstrap/Button';

class DetailPage extends Component{

  constructor(props) {
    super(props);
    this.handleAdd = this.handleAdd.bind(this)
    this.handleUpdate = this.handleUpdate.bind(this)
    this.addFromAPI = this.addFromAPI.bind(this);
    this.updateFromAPI = this.updateFromAPI.bind(this);
    
    this.state = {
      month: this.props.location.state.month,
      item: this.props.location.state.item,
    };

  }

  async updateFromAPI() {
    if (!this.state.item.key || !this.state.item.name) return;
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({"function":"add",
                        "group":this.state.item.group,
                        "key":this.state.item.key,
                        "sortkey":this.state.item.sortkey,
                        "name":this.state.item.name,
                        "description":this.state.item.description,
                        "data":this.state.item.data
                      });
    var requestOptions = {method: 'POST', headers: myHeaders, body: raw, redirect: 'follow' };
    fetch("https://pn2psx9qfd.execute-api.ap-northeast-1.amazonaws.com/dev", requestOptions)
    .catch(error => console.log('error', error));

  }

  async addFromAPI() {
    if (!this.state.item.key || !this.state.item.name) return;

    // let d = new Date(Date.now() - (TIMEZONEOFFSET * 60 - new Date().getTimezoneOffset()) * 60000);    
    // let now = d.toISOString();
    //let mm = ('0' + (this.state.item.group)).slice(-2);
    //let dd = ('0' + (this.state.item.sortkey)).slice(-2);

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({"function":"add",
                        "group":this.state.item.group,
                        "key":this.state.item.group,    
                        "sortkey":this.state.item.sorkkey,
                        "name":this.state.item.name,
                        "description":this.state.item.description,
                        "data":this.state.item.data
                      });
    var requestOptions = {method: 'POST', headers: myHeaders, body: raw, redirect: 'follow' };
    fetch("https://pn2psx9qfd.execute-api.ap-northeast-1.amazonaws.com/dev", requestOptions)
    .catch(error => console.log('error', error));
  }

  handleUpdate() {
    this.updateFromAPI();
    this.returnToListPage();
  }

  handleAdd() {
    this.addFromAPI();
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
          <label for="itemgroup">月</label>
          <input
            type='text' className="form-control" id="itemgroup" 
            onChange={e => this.setState({item: { ...this.state.item, 'group': e.target.value }})}
            placeholder="MM"
            value={this.state.item.group}
          />
        </div>
        <div className="form-group woodytext">
          <label for="itemsortkey">日</label>
          <input
            type='text' className="form-control" id="itemsortkey" 
            onChange={e => this.setState({item: { ...this.state.item, 'sortkey': e.target.value }})}
            placeholder="DD"
            value={this.state.item.sortkey}
          />
        </div>
        <div className="form-group woodytext">
          <label for="itemname">曜日</label>
          <input
            type='text' className="form-control" id="itemname" 
            onChange={e => this.setState({item: { ...this.state.item, 'name': e.target.value }})}
            placeholder="曜日"
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
          <label for="itemdata">滞在者</label>
          <input
            type='text' className="form-control" id="itemdata" 
            onChange={e => this.setState({item: { ...this.state.item, 'data': e.target.value }})}
            placeholder="guests"
            value={this.state.item.data}
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
