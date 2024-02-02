import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import firebase, { auth, firestore } from '../Config';
import { Card } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';


function ShowProduct() {
    const { id } = useParams();
    const [data, setData] = useState({
        name: "",
        description: "",
        url: "",
        image: null,
        product_image: null,
        loading: false
    });


    useEffect(() => {

        if (id) {
            const unsubscribe = firebase.firestore().collection("products").doc(id).onSnapshot(onCollectionUpdate);

            return () => {
                unsubscribe();
                console.log('Component will unmount');
            };
        }
    }, [id]);

    const onCollectionUpdate = (querySnapshot) => {
        if (querySnapshot.exists) {
            const productData = querySnapshot.data();
            setData({
                name: productData.name || "",
                description: productData.description || "",
                url: productData.url || "",
            });
        } else {
            setData({
                name: "",
                description: "",
                url: "",
                image: null,
                product_image: null,
                loading: false,
            });
        }
    };
    const onChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    }
    const handleChange = async (e) => {
        const file = e.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onloadend = () => {
                setData((prevData) => ({
                    ...prevData,
                    url: reader.result,
                    product_image: file,
                }));
            };

            reader.readAsDataURL(file);
        }

    };
    const handleSubmit = async (event) => {
        event.preventDefault();

        setData(prevData => ({ ...prevData, loading: true }));
        let imageUrl = '';
        if (data.product_image != null) {
            const imageRef = firebase.storage().ref().child(`images/${data.product_image}`);
            await imageRef.put(data.product_image);
            imageUrl = await imageRef.getDownloadURL();
        } else {
            imageUrl = data.url;
        }
        const docRef = firebase.firestore().collection("products").doc(id);
        console.log(data);
        await docRef.update({
            name: data.name,
            description: data.description,
            url: imageUrl,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(function () {
            setData({
                name: "",
                description: "",
                url: "",
                image: null,
                product_image: null,
                loading: false,
            });

            window.location.href = "/";
        });

    };

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
            <div className="container">
                <div className='row justify-content-center '>
                    <h2 className="py-2 text-center">Edit Product </h2>

                    <Card className=" col-lg-7 mt-3" style={cardstyle}>
                        <div className="d-flex align-item-center justify-content-center">
                            <Link to="/" >
                                <button className="Edit-button  align-item-center" variant="flat" size="small">Show Products</button>
                            </Link>
                        </div>

                        <div>
                            <div className="">
                                <label htmlFor="name">Product Name</label>
                                <input type="text" className="form-control" name="name" value={data.name} onChange={onChange} placeholder="Please Enter Name"></input>
                            </div>
                            <div className="p-1">
                                <label htmlFor="description">Product Description</label>
                                <textarea className="form-control" name="description" onChange={onChange} placeholder="Please Enter description" cols="40" rows="3" value={data.description}>{data.description}</textarea>
                            </div>
                            <div className="upload-btn-wrapper">

                                <button className="file-btn">Choose a file</button>

                                <input type='file' className="form-control" onChange={handleChange}></input>
                            </div>
                            <div className="d-flex justify-content-center">
                                <div className="ImageDiv align-item-center">
                                    <img src={data.url} className="ProductImage"></img>
                                </div>
                            </div>
                            <div className="d-flex justify-content-center p-2">
                                <button className="submit-button" onClick={handleSubmit} disabled={data.loading}> {data.loading ? 'Loading...' : 'Submit'}</button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>


        </>
    );
}

export default ShowProduct;
