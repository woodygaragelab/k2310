import React from 'react';
import { Component } from 'react';
import './App.css';
import './listpage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { withRouter } from 'react-router-dom';

const initialItemState = [
  { key:'9901', sortkey:'1', group: '99', name: '土', description: '作業91',data:'{"total":9}' },
  { key:'9902', sortkey:'2', group: '99', name: '日', description: '作業92',data:'{"total":8}' },
]

class ListPage extends Component {

  constructor(props){
    super(props);
    this.fetchItemsFromAPI = this.fetchItemsFromAPI.bind(this);
    this.selectM4 = this.selectM4.bind(this);
    this.selectM5 = this.selectM5.bind(this);
    this.selectM6 = this.selectM6.bind(this);
    this.state = {
      items: initialItemState,
      month : "4"
    };  
    this.fetchItemsFromAPI("4");
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
    this.props.history.push({
      pathname: '/detailpage',
      state: { month:this.state.month, item: item }
    });
  }

  selectM4() {  this.fetchItemsFromAPI("4");  }

  selectM5() {
    this.props.history.push({ pathname: '/listpage5' });
  }

  selectM6() {
    this.setState({month:"4"});
    this.fetchItemsFromAPI("4");
  }

  render() {
    return (
      <div className="mt-5 mb-5 container-fluid bg-color-1">
        {/* <h1>{this.state.month}月予定</h1> */}
        <header className="fixed-top siteHeader">
            <div onClick={this.selectM4} className="col-2 siteHeaderSelected">4月</div>
            <div onClick={this.selectM5} className="col-2">5月</div>
            <div onClick={this.selectM6} className="col-2">6月</div>
            <div className="col-2">7月</div>
            <div className="col-2">8月</div>
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
                  <div className="col-3">
                    <div><h4>{item.sortkey}({item.name})({index})</h4></div>
                  </div>
                  <div className="col-3">
                    <div><h4>{item.description}</h4></div>
                  </div>
                  <div className="col-4">
                    {/* <div>item.data={item.data}</div> */}
                    <div><h4>{itemdata.total}({itemdata.d1}-{itemdata.d2}-{itemdata.d3}-{itemdata.d4})</h4></div>
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
      