/* eslint-disable camelcase */
import React from 'react';
import Rating from './Rating.js';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

const styles = makeStyles({
  root: {

  },
  category: {
    fontSize: '1.3em',
    fontWeight: '100',
    lineHeight: '1.6',
    paddingLeft: '.2em'
  },
  name: {
    fontWeight: '600',
    fontSize: '2.2em',
    lineHeight: '1.0'
  },
  sale: {
    textDecoration: props => props.sale ? 'line-through' : null
  }
});

const Price = ({prices, className}) => {
  return (
    <div id='price' style={ {margin: '10px 0px'} }>
      <Typography display='inline' className={className}>
        ${prices.original}
      </Typography>
       &nbsp;
      {prices.sale && <Typography display='inline' style={{ color: 'red' }}>${prices.sale}</Typography>}
    </div>
  );

};

const ProductInfo = () => {
  const category = useSelector(state => state.productData.category);
  const name = useSelector(state => state.productData.name);
  const {original, sale} = useSelector(state => {
    let {original_price, sale_price} = state.styleData.styles[state.styleIndex];
    return {original: original_price, sale: sale_price};
  });
  const classes = styles({sale: sale});

  return (
    <div id='ProductInfo' className={classes.root}>
      <Rating />
      <Typography className={classes.category}>{category}</Typography>
      <Typography className={classes.name}>{name}</Typography>
      <Price prices={{original, sale}} className={classes.sale}/>
      {/*  <h4 id='slogan'>{currentProduct.slogan}</h4>
      <p id='description'>{currentProduct.description}</p> */}
    </div>
  );
};

export default ProductInfo;