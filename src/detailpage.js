import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './detailpage.css';
import Button from 'react-bootstrap/Button';

class DetailPage extends Component{

  constructor(props) {
    super(props);
    this.handleCancel  = this.handleCancel.bind(this)
    this.handleAdd     = this.handleAdd.bind(this)
    this.handleUpdate  = this.handleUpdate.bind(this)
    this.onChangeTotal = this.onChangeTotal.bind(this)
    this.onChangeD1    = this.onChangeD1.bind(this)
    this.onChangeD2    = this.onChangeD2.bind(this)
    this.onChangeD3    = this.onChangeD3.bind(this)
    this.onChangeD4    = this.onChangeD4.bind(this)
    this.onChangeGuestName = this.onChangeGuestName.bind(this);
    this.onChangeGuest = this.onChangeGuest.bind(this);
    this.addGuest = this.addGuest.bind(this);
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
  onChangeD4(e) {
    var itemdata = {}
    if (this.state.item.data) { itemdata = JSON.parse(this.state.item.data);  }
    itemdata.d4 = e.target.value;
    this.setState({item: { ...this.state.item, 'data': JSON.stringify(itemdata)}});
  }
  onChangeGuestName(e) {
    var itemdata;
    if (this.state.item.data) { itemdata = JSON.parse(this.state.item.data);  }
    if ("guests" in itemdata === false) {itemdata.guests = []; }
    itemdata.guests[e.target.id]["name"] = e.target.value;
    itemdata.total       = 0;
    var description = "";
    itemdata.guests.forEach(guest => {
      if(guest.name !== "") {itemdata.total++}
      description += guest.name.slice(0,1);
    });
    this.setState({item: { ...this.state.item, 'description':description, 'data': JSON.stringify(itemdata)}});
  }
  onChangeGuest(e) {
    var itemdata;
    if (this.state.item.data) { itemdata = JSON.parse(this.state.item.data);  }
    if ("guests"       in itemdata        === false) {itemdata.guests                 = []; }
    itemdata.guests[e.target.id][e.target.value] = e.target.checked;
    var count = 0;
    itemdata.guests.forEach(guest => {
      if (guest[e.target.value] === true) { count++; }
    });
    itemdata[e.target.value] = count;
    this.setState({item: { ...this.state.item, 'data': JSON.stringify(itemdata)}});
  }

  addGuest() {
    var itemdata;
    if (this.state.item.data) { itemdata = JSON.parse(this.state.item.data);  }
    var guest = {"name":"","c1":false,"c2":false,"c3":false,"c4":false};
    itemdata.guests.push(guest);
    this.setState({item: { ...this.state.item, 'data': JSON.stringify(itemdata)}});
  }

  handleCancel() {
    this.returnToListPage();
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
  }

  render(){

    var itemdata = {total:0};
    if (this.state.item.data) { itemdata = JSON.parse(this.state.item.data);   }

    return(
      <div className="container-fluid">
      <form>
        <div className="row">
          <div className="form-group woodytext col-2">
            <label for="itemgroup">月</label>
            <input
              type='text' className="form-control" id="itemgroup" 
              value={this.state.item.group}
              onChange={e => this.setState({item: { ...this.state.item, 'key': e.target.value, 'group': e.target.value }})}
              placeholder="MM"
            />
          </div>
          <div className="form-group woodytext col-2">
            <label for="itemsortkey">日</label>
            <input
              type='text' className="form-control" id="itemsortkey" 
              value={this.state.item.sortkey}
              onChange={e => this.setState({item: { ...this.state.item, 'sortkey': e.target.value }})}
              placeholder="DD"
            />
          </div>
          <div className="form-group woodytext col-2">
            <label for="itemname">曜</label>
            <input
              type='text' className="form-control" id="itemname" 
              value={this.state.item.name}
              onChange={e => this.setState({item: { ...this.state.item, 'name': e.target.value }})}
              placeholder="曜"
            />
          </div>
          <div className="col-4">
          </div>
          <div className="col-2">
            <Button onClick={this.handleAdd}>+DAY</Button>
          </div>

        </div>
  
        <div className="form-group woodytext">
          <label for="itemdesc">メモ</label>
          <input type='text' className="form-control" id="itemdesc" 
            value={this.state.item.data}
            onChange={e => this.setState({item: { ...this.state.item, 'data': e.target.value }})}
          />
        </div>
        <div className="form-group woodytext">
          <label for="itemdata">滞在者</label>
          <input type='text' className="form-control" id="itemdata" 
            value={this.state.item.description}
            onChange={e => this.setState({item: { ...this.state.item, 'description': e.target.value }})}
          />
        </div>

        <div className="row form-group woodytext">
          <div className="col-2">人数</div>
          <div className="col-2">朝</div>
          <div className="col-2">昼</div>
          <div className="col-2">夕</div>
          <div className="col-2">泊</div>
        </div>

  {/* ========== GUEST SUMMARY =============== */}
        <div className="row form-group woodytext">
          <input type='text' className="col-2 form-control" id="itemdata" 
            value={itemdata.total} placeholder="人数"
            onChange={this.onChangeTotal}
          />
          <input type='text' className="col-2 form-control" id="itemdata" 
            value={itemdata.c1} placeholder="0"
            onChange={this.onChangeD1}
          />
          <input type='text' className="col-2 form-control" id="itemdata" 
            value={itemdata.c2} placeholder="0"
            onChange={this.onChangeD2}
          />
          <input type='text' className="col-2 form-control" id="itemdata" 
            value={itemdata.c3} placeholder="0"
            onChange={this.onChangeD3}
          />
          <input type='text' className="col-2 form-control" id="itemdata" 
            value={itemdata.c4} placeholder="0"
            onChange={this.onChangeD4}
          />
        </div>

  {/* ========== GUESTS =============== */}

    { itemdata.guests.map((guest,index) => {
      return (
        <div className="row" key={index}>
          <div className="col-2 form-group woodytext">
            <input
              type='text' className="form-control" 
              value={itemdata.guests[index].name} placeholder="名前"
              //value={guest.name} placeholder="名前"
              onChange={this.onChangeGuestName} id={index}
              //onBlur={this.onChangeGuestName} id={index}
            />
          </div>

          <div className="col-2 form-check form-check-inline">
            <input className="form-check-input" type="checkbox"
              checked={guest.c1}
              onChange={this.onChangeGuest} id={index} value="c1" 
            />
          </div>
          <div className="col-2 form-check form-check-inline">
            <input className="form-check-input" type="checkbox"
              checked={guest.c2}
              onChange={this.onChangeGuest} id={index} value="c2"
            />
          </div>
          <div className="col-2 form-check form-check-inline">
          <input className="form-check-input" type="checkbox"
              checked={guest.c3}
              onChange={this.onChangeGuest} id={index} value="c3"
            />
          </div>
          <div className="col-2 form-check form-check-inline">
          <input className="form-check-input" type="checkbox"
              checked={guest.c4}
              onChange={this.onChangeGuest} id={index} value="c4"
            />
          </div>
        </div>
      );
    })}



  {/* ====== BUTTON ============================================ */}
        <div className="row form-group woodytext">
          <div className="col-2">
          <Button onClick={this.addGuest}>+</Button>
          </div>
          <div className="col-6">
          </div>
          <div className="col-2">
          <Button onClick={this.handleCancel}>CANCEL</Button>
          </div>
          <div className="col-2">
          <Button onClick={this.handleUpdate}>OK</Button>
          </div>          
        </div>

      </form>
    </div>
    )
  }
}

export default withRouter(DetailPage);
