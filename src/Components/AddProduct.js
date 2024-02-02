import '../App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import firebase, { auth, firestore } from '../Config';
import React from 'react';
import { Card } from 'react-bootstrap';



class AddProduct extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            name: "",
            description: "",
            url: "",
            image: null,
            product_image: null,
            loading: false,
        }
        this.ref = firebase.firestore().collection("products");

        this.storage = firebase.storage();
    }
    onChange = (e) => {
        const state = this.state;
        state[e.target.name] = e.target.value;
        this.setState(state);
    }
    handleChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onloadend = () => {
                this.setState({
                    image: reader.result
                });
                this.setState({ product_image: file });
            };

            reader.readAsDataURL(file);
        }
    }


    handleSubmit = async (event) => {
        event.preventDefault();

        this.setState({ loading: true });
        const imageRef = this.storage.ref().child(`images/${this.state.product_image.name}`);
        await imageRef.put(this.state.product_image);
        const imageUrl = await imageRef.getDownloadURL();

        await this.ref.add({
            name: this.state.name,
            description: this.state.description,
            url: imageUrl,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        this.setState({
            name: "",
            description: "",
            url: "",
            image: null,
            product_image: null,
            loading: false,
        });

        window.location.href = "/";
    };
    render() {

        const { name, description } = this.state;
        const cardstyle = {
            width: "50rem",
            height: "auto",
            BackGroudColor: "#fff",
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
                <h2 className="py-2 text-center">Add Product </h2>

                <Card style={cardstyle} className='mt-3'>
                    <div className="d-flex align-item-center justify-content-center">
                        <Link to="/" >
                            <button className="Edit-button  align-item-center" variant="flat" size="small">Show Products</button>
                        </Link>
                    </div>

                    <div>
                        <div className="">
                            <label htmlFor="name">Product Name</label>
                            <input type="text" className="form-control" name="name" value={name} onChange={this.onChange} placeholder="Please Enter Name"></input>
                        </div>
                        <div className="p-1">
                            <label htmlFor="description">Product Description</label>
                            <textarea className="form-control" name="description" onChange={this.onChange} placeholder="Please Enter description" cols="40" rows="3" value={description}>{description}</textarea>
                        </div>
                        <div className="upload-btn-wrapper">

                            <button className="file-btn">Choose a file</button>

                            <input type='file' className="form-control" onChange={this.handleChange}></input>
                        </div>
                        <div className="d-flex justify-content-center">
                            <div className="ImageDiv align-item-center">
                                <img src={this.state.image} className="ProductImage"></img>
                            </div>
                        </div>
                        <div className="d-flex justify-content-center p-2">
                            <button className="submit-button" onClick={this.handleSubmit} disabled={this.state.loading}> {this.state.loading ? 'Loading...' : 'Submit'}</button>
                        </div>
                    </div>
                </Card>
            </>
        )
    }
}

export default AddProduct;
