import React from 'react';
import { Component } from 'react';
import './App.css';
import './listpage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { withRouter } from 'react-router-dom';

const initialItemState = [ { key:'99', sortkey:'1', group: '99', name: '土', description: '91',data:'{"total":9}'}]

class ListPage extends Component {

  constructor(props){
    super(props);
    this.fetchItemsFromAPI = this.fetchItemsFromAPI.bind(this);
    this.selectM5 = this.selectM5.bind(this);
    this.selectM6 = this.selectM6.bind(this);
    this.selectM7 = this.selectM7.bind(this);
    this.selectM8 = this.selectM8.bind(this);
    this.state = {
      items: initialItemState,
      month : "6"
    };  
    this.fetchItemsFromAPI("6");
  }

  async fetchItemsFromAPI(key) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({"function":"list","key":key,"group":key});
    var requestOptions = {method: 'POST', headers: myHeaders, body: raw, redirect: 'follow' };
    fetch("https://pn2psx9qfd.execute-api.ap-northeast-1.amazonaws.com/dev", requestOptions)
      .then(response => response.text())
      .then(response => {
        const apiData = JSON.parse(response);
        this.setState({items: apiData});   
    })
    .catch(error => console.log('error', error));
  }

  editItem(item) {
    this.props.history.push({ pathname: '/detailpage', state: { month:this.state.month, item: item }  });
  }

  selectM5() {  this.props.history.push({ pathname: '/listpage5' });  }
  selectM6() {  this.props.history.push({ pathname: '/listpage6' });  }
  selectM7() {  this.props.history.push({ pathname: '/listpage7' });  }
  selectM8() {  this.props.history.push({ pathname: '/listpage8' });  }

  render() {
    return (
      <div className="mt-5 mb-5 container-fluid bg-color-1">
        <header className="fixed-top siteHeader k2310BgM6">
            <div onClick={this.selectM5} className="col-2">5月</div>
            <div onClick={this.selectM6} className="col-2 k2310FgM6">6月</div>
            <div onClick={this.selectM7} className="col-2">7月</div>
            <div onClick={this.selectM8} className="col-2">8月</div>
        </header>

        <form>
        {
          this.state.items.map((item,index) => {
            var itemdata = {total:0};
            if (item.data) { itemdata = JSON.parse(item.data); }
            return (
              <div className="card" key={item.key + item.sortkey}>
                <div className="card-body bg-color-2" onClick={() => this.editItem(item)}>
                  <div className="row">
                    <div className="col-4">
                      <div><h4>{item.sortkey}({item.name})</h4></div>    {/* 日（曜） */}
                    </div>
                    <div className="col-4">
                      <div><h4>{item.description}</h4></div>              {/* 宿泊者 */}
                    </div>
                    <div className="col-4">                   {/* 人数（朝-昼-夕-泊) */}
                      <div><h4>{itemdata.total}({itemdata.c1}-{itemdata.c2}-{itemdata.c3}-{itemdata.c4})</h4></div>
                    </div>
                  </div>              
                </div>
              </div>              
            )
          })
        }
        </form>

        <footer className="fixed-bottom siteFooter">
          <div>Schedule</div>
          <div>ToDo</div>
          <div>Stock</div>
        </footer>

      </div>
    );
  }
}

export default withRouter(ListPage)  
      