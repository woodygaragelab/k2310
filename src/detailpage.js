import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Storage } from 'aws-amplify';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';

const TIMEZONEOFFSET = -9;     // UTC-表示したいタイムゾーン(単位:hour)。JSTなら-9

class DetailPage extends Component{

  constructor(props) {
    super(props);
    this.handleChange1 = this.handleChange1.bind(this)
    this.handleChange2 = this.handleChange2.bind(this)
    this.onChangeImage = this.onChangeImage.bind(this);
    this.handleClick = this.handleClick.bind(this)
    this.createItemFromAPI = this.createItemFromAPI.bind(this);
    this.updateItemFromAPI = this.updateItemFromAPI.bind(this);
    
    this.state = {
      item: this.props.location.state.item,
    };

  }

  async createItemFromAPI() {
    if (!this.state.item.name || !this.state.item.description) return;

    let d = new Date(Date.now() - (TIMEZONEOFFSET * 60 - new Date().getTimezoneOffset()) * 60000);    
    let now = d.toISOString();

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({"function":"add",
                        "category":"food",
                        "ID":now,
                        "name":this.state.item.name,
                        "description":this.state.item.description,
                        "amazonurl":this.state.item.amazonurl,
                        "imagefile":this.state.item.imagefile,
                        "imageurl":this.state.item.imageurl
                      });
    var requestOptions = {method: 'POST', headers: myHeaders, body: raw, redirect: 'follow' };
    fetch("https://yxckp7iyk4.execute-api.ap-northeast-1.amazonaws.com/dev", requestOptions)
    // .then(response => response.text())
    .catch(error => console.log('error', error));
  }

  async updateItemFromAPI() {
    if (!this.state.item.name || !this.state.item.description) return;
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({"function":"add",
                        "category":"food",
                        "ID":this.state.item.ID,
                        "name":this.state.item.name,
                        "description":this.state.item.description,
                        "amazonurl":this.state.item.amazonurl,
                        "imagefile":this.state.item.imagefile,
                        "imageurl":this.state.item.imageurl
                      });
    var requestOptions = {method: 'POST', headers: myHeaders, body: raw, redirect: 'follow' };
    fetch("https://yxckp7iyk4.execute-api.ap-northeast-1.amazonaws.com/dev", requestOptions)
    // .then(response => response.text())
    // .then((response) => {
    //   alert(response);
    // })
    .catch(error => console.log('error', error));

  }

  handleChange1(e){
    this.setState({item: { ...this.state.item, name: e.target.value }});
  }

  handleChange2(e){
   this.setState({item: { ...this.state.item, description: e.target.value }});
  }

  handleClick() {
    // item.idがnullの時は新規作成、listpageから渡されてきたときは更新
    if (this.state.item.ID === "") {
      this.createItemFromAPI();
    }
    else {
      this.updateItemFromAPI();
    }
    this.returnToListPage();
  }

  async onChangeImage(e) {
    if (!e.target.files[0]) return
    const file = e.target.files[0];
    this.setState({item: { ...this.state.item, imagefile: file.name }});
    // imageFileをStorage(s3 service)に保存する
    await Storage.put(file.name, file,{ level: 'public' }); // publicにしないとStorage.getできない
    if (this.state.item.imagefile) {
      // imageFile名からimageUrlを取得する
      const imageurl = await Storage.get(this.state.item.imagefile);
      this.setState({item: {...this.state.item, imageurl: imageurl}});
      this.setState({imageurl: imageurl});
    }

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
        <div className="form-group">
          <label for="itemname">タイトル</label>
          <input
            type='text' className="form-control" id="itemname" 
            onChange={this.handleChange1}
            placeholder="item name"
            value={this.state.item.name}
          />
        </div>
        <div className="form-group">
          <label for="itemdesc">説明</label>
          <input
            type='text' className="form-control" id="itemdesc" 
            onChange={e => this.setState({item: { ...this.state.item, 'description': e.target.value }})}
            placeholder="description"
            value={this.state.item.description}
          />
        </div>
        <div className="form-group">
          <label for="amazonurl">amazon url</label>
          <input
            type='text' className="form-control" id="amazonurl" 
            onChange={e => this.setState({item: { ...this.state.item, 'amazonurl': e.target.value }})}
            placeholder="amazonurl"
            value={this.state.item.amazonurl}
          />
        </div>
        <div className="form-group">
          <label for="itemimage">イメージ</label>
          {/* <p>imageUrl:{this.state.item.imageurl}</p> */}
          <img src={this.state.item.imageurl} style={{width: 50,height:50}} alt=""/>
          <input
             type="file" className="form-control" id="itemimage"
             onChange={this.onChangeImage}
          />
        </div>
        <div className="form-group">
          <Button onClick={this.handleClick}>OK</Button>
        </div>
      </form>
    </div>
    )
  }
}

export default withRouter(DetailPage);
