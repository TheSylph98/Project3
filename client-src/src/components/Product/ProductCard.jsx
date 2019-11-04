import React, { Component } from 'react';
import {
  Card, CardText, CardBody,
  CardTitle, CardSubtitle, CardLink
} from 'reactstrap';
import { Link, Route } from 'react-router-dom';
import './ProductCard.scss';

class Product extends Component {
    constructor(props) {
      super(props)
    }
    render() {
    return (
        <Card className="container-fluid mb-3">
          <div className="imgCont">
            <img className="imgSect3" src={this.props.item.imgUrl} alt="Card image cap" />
          </div>
          <CardBody style={{height: 180}}>
            <CardTitle className="title text-center mb-3">{this.props.item.title}</CardTitle>
            <CardSubtitle className="author text-center mb-3">{this.props.item.author}</CardSubtitle>
          </CardBody>
          <CardText className="priceTag align-self-center">{this.props.item.price}</CardText>
          <div style={{ height: 10 }}></div>
          <Link to={`/books/${this.props.item.id}`} className="buyLink align-self-center w-90">
            <h6 className="w-90 align-self-center" href={`/books/${this.props.item.id}`}>
              Buy
            </h6>
          </Link>
          <div style={{ height: 10 }}></div>
        </Card>
    );
  };
}

export default Product;