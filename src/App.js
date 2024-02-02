import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import firebase, { auth, firestore } from './Config';
import React from 'react';
import { Card } from 'react-bootstrap';

class App extends React.Component {

  constructor(props) {
    super(props)
    this.ref = firebase.firestore().collection("products");
    this.unsubscribe = null;
    this.state = {
      products: []
    }
  }
  componentDidMount() {
    this.unsubscribe = this.ref.orderBy("timestamp", "desc").onSnapshot(this.onCollectionupdate);
  }
  onCollectionupdate = (querySnapshot) => {
    const products = [];
    querySnapshot.forEach((docs) => {
      const { name, description, url } = docs.data();
      products.push({
        key: docs.id,
        docs,
        name,
        description,
        url

      });
    });
    this.setState({
      products
    });
  }
  render() {
    const cardstyle = {
      width: "auto",
      height: "auto",
      backgroundColor: "#fff",
      margin: "auto",
      display: "block",
      marginTop: "60px",
      opacity: "0.5",
      paddingTop: "10px",
      paddingLeft: "20px",
      paddingRight: "20px",
      borderStyle: "outset",
      borderLeft: "50px solid pink",
      borderRadius: "20px",
      opacity: "1"
    }
    return (
      <>
        <div className="row justify-content-center g-0">
          <div className="col-lg-10">
          <div className="panel panel-heading">
                  <h3 className="panel-heading">Product Details</h3>
                </div>
            <Card style={cardstyle} className='mt-3'>
              <div className="d-flex align-item-center justify-content-center mb-2">
                <Link to="/add-product" >
                  <button className="Add-button m-2 align-item-center" variant="flat" size="small">Add Products</button>
                </Link>
              </div>
              <div className="container">
                
              </div>
              <div className="panel-body table-responsive">
                <table className="table table-stripe ">
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Description</th>
                      <th>Image</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.products.map(product =>
                      <tr>
                        <td><Link to={`/show-product/${product.key}`}>{product.name}</Link></td>
                        <td>{product.description}</td>
                        <td><img className="table-img" src={product.url} alt={product.name}></img></td>
                      </tr>
                    )}
                  </tbody>

                </table>
              </div>
            </Card>
          </div>
        </div>

      </>
    )
  }
}

export default App;
