import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './detailpage.css';
import Button from 'react-bootstrap/Button';

class DetailPage extends Component{

  constructor(props) {
    super(props);
    this.handleAdd     = this.handleAdd.bind(this)
    this.handleUpdate  = this.handleUpdate.bind(this)
    this.onChangeTotal = this.onChangeTotal.bind(this)
    this.onChangeD1    = this.onChangeD1.bind(this)
    this.onChangeD2    = this.onChangeD2.bind(this)
    this.onChangeD3    = this.onChangeD3.bind(this)
    this.addFromAPI    = this.addFromAPI.bind(this);
    this.updateFromAPI = this.updateFromAPI.bind(this);
    this.next = this.next.bind(this);
    
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

  onChangeTotal(e) {
    var itemdata = {};
    if (this.state.item.data) { itemdata = JSON.parse(this.state.item.data);  }
    itemdata.total = e.target.value;
    this.setState({item: { ...this.state.item, 'data': JSON.stringify(itemdata)}});
  }
  onChangeD1(e) {
    var itemdata = {}
    if (this.state.item.data) { itemdata = JSON.parse(this.state.item.data);  }
    itemdata.d1 = e.target.value;
    this.setState({item: { ...this.state.item, 'data': JSON.stringify(itemdata)}});
  }
  onChangeD2(e) {
    var itemdata = {}
    if (this.state.item.data) { itemdata = JSON.parse(this.state.item.data);  }
    itemdata.d2 = e.target.value;
    this.setState({item: { ...this.state.item, 'data': JSON.stringify(itemdata)}});
  }
  onChangeD3(e) {
    var itemdata = {}
    if (this.state.item.data) { itemdata = JSON.parse(this.state.item.data);  }
    itemdata.d3 = e.target.value;
    this.setState({item: { ...this.state.item, 'data': JSON.stringify(itemdata)}});
  }

  handleUpdate() {
    this.updateFromAPI();
    this.returnToListPage();
  }

  handleAdd() {
    this.addFromAPI();
    this.next();
  }

  returnToListPage() {
    var pathname = "/listpage"+ this.state.month;
    this.props.history.push({
      pathname: pathname,
      state: { 
        month: this.state.month
      }
    });
  }

  next() {
    const this_dd = this.state.item.sortkey;
    const dd = parseInt(this_dd);
    const mm = parseInt(this.state.item.key)-1;
    var this_date = new Date(2021,mm,dd);
    var next_date = new Date();
    next_date.setDate(this_date.getDate() + 1);
    var next_dd   = ('0' + (next_date.getDate().toString())).slice(-2);
    var dayOfWeek = next_date.getDay();
    var next_name = [ "日", "月", "火", "水", "木", "金", "土" ][dayOfWeek] ;
    this.setState( {item: { ...this.state.item, 'sortkey': next_dd, 'name': next_name }});
    // let d = new Date(Date.now() - (TIMEZONEOFFSET * 60 - new Date().getTimezoneOffset()) * 60000);    
    // let now = d.toISOString();
    //let mm = ('0' + (this.state.item.group)).slice(-2);
    //let dd = ('0' + (this.state.item.sortkey)).slice(-2);
  }

  render(){

    var itemdata = {total:0};
    if (this.state.item.data) {
      var itemdata_str = this.state.item.data;
      itemdata = JSON.parse(itemdata_str);
    }

    return(
      <div className="container-fluid">
      <form>
        <div className="row">
          <div className="form-group woodytext col-2">
            <label for="itemgroup">月</label>
            <input
              type='text' className="form-control" id="itemgroup" 
              onChange={e => this.setState({item: { ...this.state.item, 'key': e.target.value, 'group': e.target.value }})}
              placeholder="MM"
              value={this.state.item.group}
            />
          </div>
          <div className="form-group woodytext col-2">
            <label for="itemsortkey">日</label>
            <input
              type='text' className="form-control" id="itemsortkey" 
              onChange={e => this.setState({item: { ...this.state.item, 'sortkey': e.target.value }})}
              placeholder="DD"
              value={this.state.item.sortkey}
            />
          </div>
          <div className="form-group woodytext col-2">
            <label for="itemname">曜日</label>
            <input
              type='text' className="form-control" id="itemname" 
              onChange={e => this.setState({item: { ...this.state.item, 'name': e.target.value }})}
              placeholder="曜日"
              value={this.state.item.name}
            />
          </div>
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
        <div className="row form-group woodytext">
          <div className="col-2">人数</div>
          <div className="col-2">朝</div>
        </div>
        <div className="row form-group woodytext">
          <input
            type='text' className="col-2 form-control" id="itemdata" 
            onChange={this.onChangeTotal}
            placeholder="guests"
            value={itemdata.total}
          />
          <input
            type='text' className="col-2 form-control" id="itemdata" 
            onChange={this.onChangeD1}
            placeholder="guests"
            value={itemdata.d1}
          />
          <input
            type='text' className="col-2 form-control" id="itemdata" 
            onChange={this.onChangeD2}
            placeholder="guests"
            value={itemdata.d2}
          />
          <input
            type='text' className="col-2 form-control" id="itemdata" 
            onChange={this.onChangeD3}
            placeholder="guests"
            value={itemdata.d3}
          />
        </div>



        <div class="form-check form-check-inline">
          <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
          <label class="form-check-label" for="flexCheckDefault">A</label>
        </div>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
          <label class="form-check-label" for="flexCheckDefault">B</label>
        </div>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
          <label class="form-check-label" for="flexCheckDefault">C</label>
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
