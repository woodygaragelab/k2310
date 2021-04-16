import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './detailpage.css';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash} from "@fortawesome/free-solid-svg-icons";
//import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";

class DetailPage extends Component{

  constructor(props) {
    super(props);
    this.handleCancel  = this.handleCancel.bind(this)
    this.handleAdd     = this.handleAdd.bind(this)
    this.handleUpdate  = this.handleUpdate.bind(this)
    this.handleNext    = this.handleNext.bind(this)
    this.onChangeTotal = this.onChangeTotal.bind(this)
    this.onChangeD1    = this.onChangeD1.bind(this)
    this.onChangeD2    = this.onChangeD2.bind(this)
    this.onChangeD3    = this.onChangeD3.bind(this)
    this.onChangeD4    = this.onChangeD4.bind(this)
    this.onChangeGuestName = this.onChangeGuestName.bind(this);
    this.onChangeGuest = this.onChangeGuest.bind(this);
    this.onChangeMemo  = this.onChangeMemo.bind(this);
    this.addGuest = this.addGuest.bind(this);
    this.deleteGuest = this.deleteGuest.bind(this);
    this.addFromAPI    = this.addFromAPI.bind(this);
    this.updateFromAPI = this.updateFromAPI.bind(this);
    this.next = this.next.bind(this);
    this.getNext = this.getNext.bind(this);
    
    this.state = {
      month: this.props.location.state.month,
      item: this.props.location.state.item,
      devmode: false,                              // デバッグモード
    };

  }

  async updateFromAPI() {
    if (!this.state.item.key || !this.state.item.name) return;
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    // group:月 key:月 sortkey:日
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

  async getFromAPI() {
    if (!this.state.item.key || !this.state.item.sortkey) return;

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({"function":"get",
                        "key":this.state.item.key,
                        "sortkey":this.state.item.sortkey,
                      });
    var requestOptions = {method: 'POST', headers: myHeaders, body: raw, redirect: 'follow' };
    fetch("https://pn2psx9qfd.execute-api.ap-northeast-1.amazonaws.com/dev", requestOptions)
      .then(response => response.text())
      .then(response => {
        const apiData = JSON.parse(response);
        this.setState({item: apiData.items[0]});   
    })
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

  onChangeMemo(e) {
    var itemdata;
    if (this.state.item.data) { itemdata = JSON.parse(this.state.item.data);  }
    itemdata["memo"] = e.target.value;
    this.setState({item: { ...this.state.item, 'data': JSON.stringify(itemdata)}});
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

  deleteGuest(index) {
    var itemdata;
    if (this.state.item.data) { itemdata = JSON.parse(this.state.item.data);  }
    if ("guests"       in itemdata        === false) {itemdata.guests                 = []; }
    itemdata.guests.splice(index, 1);        // guestから該当行を削除
    
    itemdata.total       = 0;
    var description = "";
    itemdata.guests.forEach(guest => {
      if(guest.name !== "") {itemdata.total++}  // total人数を更新
      description += guest.name.slice(0,1);     // description （滞在者）を更新
    });
    this.setState({item: { ...this.state.item, 'description':description, 'data': JSON.stringify(itemdata)}});
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

  handleNext() {
    this.getNext();
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
    var next_date = new Date(2021,mm,dd);
    next_date.setDate(this_date.getDate() + 1);
    var next_dd   = ('0' + (next_date.getDate().toString())).slice(-2);
    var dayOfWeek = next_date.getDay();
    var next_name = [ "日", "月", "火", "水", "木", "金", "土" ][dayOfWeek] ;
    this.setState( {item: { ...this.state.item, 'sortkey': next_dd, 'name': next_name }});
    // let d = new Date(Date.now() - (TIMEZONEOFFSET * 60 - new Date().getTimezoneOffset()) * 60000);    
    // let now = d.toISOString();
  }

  getNext() {
    const this_dd = this.state.item.sortkey;
    const dd = parseInt(this_dd);
    const mm = parseInt(this.state.item.key)-1;
    var this_date = new Date(2021,mm,dd);
    var next_date = new Date(2021,mm,dd);
    next_date.setDate(this_date.getDate() + 1);
    var next_dd   = ('0' + (next_date.getDate().toString())).slice(-2);
    this.setState( {item: { ...this.state.item, 'sortkey': next_dd }});
    this.getFromAPI();
  }

  render(){

    var itemdata = {total:0};
    if (this.state.item.data) { itemdata = JSON.parse(this.state.item.data);   }

    return(
      <div className="container-fluid">
      <form>
        <div className="form-group k2Text col-3">
          <label for="itemkey">月 日（曜）</label>
          <input
              type='text' className="form-control" id="itemkey" 
              value={this.state.item.group +"/"+ this.state.item.sortkey +"("+ this.state.item.name+")"}
              readOnly
          />
        </div>

        <div className="form-group k2Text col-xs-8 col-sm-6 col-md-3">
          <label for="itemtotal">人数    （朝-昼-夕-泊）</label>
          <input readOnly type='text' className="form-control" id="itemtotal" 
              value={itemdata.total+"   ("+itemdata.c1+"-"+itemdata.c2+"-"+itemdata.c3+"-"+itemdata.c4+"）"}
          /> 
        </div>


  {/* ========== GUEST LIST =============== */}
      <div className="d-flex">
        <div className="col-2 ml-1">
        滞在者
        </div>
        <div className="col-6">
          (朝　　昼　　夕　　泊)
        </div>
      </div>
  
    { itemdata.guests.map((guest,index) => {
      return (
        <div className="row" key={index}>

          {/* 名前　*/}
          <div className="col-3 form-group k2Text">
            <input type='text' className="form-control" 
              value={itemdata.guests[index].name} placeholder="名前"
              onChange={this.onChangeGuestName} id={index}
            />
          </div>

          {/* 朝昼夕泊 */}
          <div className="col-1 mx-1 form-check form-check-inline">
            <input className="form-check-input" type="checkbox"
              checked={guest.c1}
              onChange={this.onChangeGuest} id={index} value="c1" 
            />
          </div>
          <div className="col-1 mx-1 form-check form-check-inline">
            <input className="form-check-input" type="checkbox"
              checked={guest.c2}
              onChange={this.onChangeGuest} id={index} value="c2"
            />
          </div>
          <div className="col-1 mx-1 form-check form-check-inline">
            <input className="form-check-input" type="checkbox"
              checked={guest.c3}
              onChange={this.onChangeGuest} id={index} value="c3"
            />
          </div>
          <div className="col-1 ml-1 form-check form-check-inline">
            <input className="form-check-input" type="checkbox"
              checked={guest.c4}
              onChange={this.onChangeGuest} id={index} value="c4"
            />
          </div>

          {/* 削除ボタン */}
          <div className="col-1">
            <button type="button" onClick={() => this.deleteGuest(index)} id={index} className="btn btn-outline-primary">
              <FontAwesomeIcon icon={faTrash} />
            </button> 
          </div>

          <div className="col-4">
          </div>

        </div>
      );
    })}



  {/* ====== + BUTTON ============================================ */}
        <div className="row form-group k2Text">
          <div className="col-2">
          <Button onClick={this.addGuest}>+</Button>
          </div>
          <div className="col-10">
          </div>
        </div>

  {/* ====== メモ欄 ============================================ */}
        <div className="mt-5 form-group k2Text">
          {/* <label for="itemdesc">メモ</label> */}
          <input type='text' className="form-control" id="itemdesc" 
              value={itemdata.memo} placeholder="memo"
              onChange={this.onChangeMemo}
          />
        </div>




  {/* ====== OK BUTTON ============================================ */}
        <div className="mb-4 row k2Text">
          <div className="col-xs-4">
          </div>
          <div className="col-xs-2 mx-2">
          <Button onClick={this.handleCancel}>CANCEL</Button>
          </div>
          <div className="col-xs-2 mx-2">
          <Button onClick={this.handleUpdate}>OK</Button>
          </div>          
        </div>




  {/* ====== item.data (for debug)=============================>>> */}

        <div className="mt-5" style={{ display: this.state.devmode ? '' : 'none' }}>
          <h4>======== for dev =======</h4>
          <div className="form-group k2Text col-3">
            <label for="itemgroup">group:月</label>
            <input type='text' className="form-control" id="itemgroup" 
              value={this.state.item.group} placeholder="MM"
              onChange={e => this.setState({item: { ...this.state.item, 'key': e.target.value, 'group': e.target.value }})}
            />
          </div>
          <div className="form-group k2Text col-3">
            <label for="itemsortkey">sortkey:日</label>
            <input type='text' className="form-control" id="itemsortkey" 
              value={this.state.item.sortkey} placeholder="DD"
              onChange={e => this.setState({item: { ...this.state.item, 'sortkey': e.target.value }})}
            />
          </div>
          <div className="form-group k2Text col-3">
            <label for="itemname">name:曜</label>
            <input type='text' className="form-control" id="itemname" 
              value={this.state.item.name} placeholder="曜"
              onChange={e => this.setState({item: { ...this.state.item, 'name': e.target.value }})}
            />
          </div>
          
          <div className="col-2">
            <Button onClick={this.handleAdd}>ADD NEXT</Button>
            {/* <Button onClick={this.handleNext}>next</Button> */}
          </div>

          <div className="form-group k2Text col-6">
            <label for="itemdesc">descriptoin:滞在者イニシャル</label>
            <input readonly type='text' className="form-control" id="itemdesc" 
              value={this.state.item.description}
            />
          </div>
          <div className="form-group k2Text col-12 mb-5">
            <label for="itemdata">data</label>
            <input readonly type='text' className="form-control" id="itemdata" 
              value={this.state.item.data}
            />
          </div>

        </div>
  {/* <<<=================================== item.data (for debug) */}



      </form>
    </div>
    )
  }
}

export default withRouter(DetailPage);
