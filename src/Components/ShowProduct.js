import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import firebase from '../Config';
import { Card } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';


function ShowProduct() {
    const { id } = useParams();
    const [data, setData] = useState([]);

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
            const data = querySnapshot.data();
            setData([data]);
        } else {
            setData([]);
        }
    };
    const deleteProduct = async (event) => {
        const docRef = firebase.firestore().collection("products").doc(id);


        try {
            console.log('Document deleted successfully');
            const images = data[0].url;
            const pathArray = images.split("%2F");
            const imagePath = pathArray[1].split("?")[0];


            const storageRef = firebase.storage().ref().child("images/" + imagePath);
            await storageRef.delete();
            await docRef.delete();

            window.location.href = "/";

        } catch (error) {
            console.error('Error deleting document:', error);
        }



    };

    const cardstyle = {
        width: "50rem",
        height: "auto",
        BackGroudColor: "#fff",
        margin: "auto",
        display: "block",
        marginTop: "60px",
        opacity: "0.5",
        paddingLeft: "20px",
        paddingRight: "20px",
        borderStyle: "outset",
        borderLeft: "50px solid pink",
        borderRadius: "20px",
        opacity: "1"
    }
    return (
        <>
            {data.map((item, index) => (
                <div className="container">
                    <div className='row justify-content-center'>
                        <h2 className="py-2 text-center">Product Details</h2>

                        <Card className=" col-lg-7 align-items-center mt-3" style={cardstyle}>
                            <div className="d-flex align-item-center justify-content-center py-4">
                                <Link to="/" >
                                    <button className="Edit-button edit-btn  align-item-center" variant="flat" size="small">Show Products</button>
                                </Link>
                            </div>
                            <div className='row justify-content-center'>
                                <div className='product-details-imgdiv h-auto'>
                                    <img src={item.url} className='p-2'></img>
                                </div>
                                <div>
                                    <h2 className="py-2 text-center">{item.name}</h2>
                                    <p className="py-2 text-center border">{item.description}</p>
                                </div>
                                <div className=" text-center p-2">
                                    <Link to={`/edit-product/${id}`}>
                                        <button className="submit-button " >Edit Product</button>
                                    </Link>
                                    <button className="submit-button" onClick={deleteProduct}>Delete Product</button>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

            ))}

        </>
    );
}

export default ShowProduct;
