import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import outfitFuncs from '../../redux-helpers/related/reduxOutfitList.js';
import funcs from '../../redux-helpers/related/reduxRelatedProducts.js';

import axios from 'axios';
import GITHUB_API_KEY from '../../config/config.js';

import { withStyles, makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import Rating from '@material-ui/lab/Rating';
import StarBorderIcon from '@material-ui/icons/StarBorder';

import exampleData from '../../store/exampleData.js';

const useStyles = makeStyles({
  root: {
    maxWidth: 200,
    minHeight: 320,
    maxHeight: 320,
    border: '.5px solid #3d3d5c',
    borderRadius: 0,
  },
  icon: {
    position: 'absolute',
    top: '0px',
    right: '8px'
  },
  media: {
    top: '1px',
    right: '11px',
    height: 190,
    width: 200,
  },
  paper: {
    position: 'absolute',
    width: 500,
    minHeight: 200,
    backgroundColor: 'white',
    border: '0.5px solid #3d3d5c',
    // boxShadow: theme.shadows[5],
    // padding: theme.spacing(2, 4, 3),
  },
  table: {
    maxWidth: 500,
  },
  content: {
    backgroundColor: '#f0f0f5',
    height: 150,
  }
});


const OutfitCard = (props) => {
  const classes = useStyles();

  const url = 'https://app-hrsei-api.herokuapp.com/api/fec2/hratx';
  const currentProductId = useSelector(state => {
    return state.currentProductId;
  });
  const currentProductStyleIndex = useSelector(state => {
    return state.currentProductStyleIndex;
  });
  const currentProductStars = useSelector(state => {
    return state.currentProductStars;
  });

  const dispatch = useDispatch();

  const handleDelete = (index) => {
    dispatch(outfitFuncs.deleteOutfit(index));
  };


  const handleAdd = (productId) => {
    const id = productId.currentProductId.toString();
    let { name, category, styleName, styleId, originalPrice, salePrice, imageURL, averageStars } = '';

    const axiosInstance = axios.create({
      'headers': {
        'Authorization': `${GITHUB_API_KEY}`
      }
    });

    axios.all([
      axiosInstance.get(`${url}/products/${id}`),
      axiosInstance.get(`${url}/products/${id}/styles`),
      axiosInstance.get(`${url}/reviews/meta?product_id=${id}`)
    ])
      .then(axios.spread((...results) => {
        const info = results[0].data;
        const styles = results[1].data;
        const metaData = results[2].data;

        name = info.name;
        category = info.category;
        styleName = styles.results[currentProductStyleIndex].name;
        styleId = styles.results[currentProductStyleIndex].style_id;
        originalPrice = styles.results[currentProductStyleIndex].original_price;
        salePrice = styles.results[currentProductStyleIndex].sale_price;

        for (let i = 0; i < styles.results[currentProductStyleIndex].photos.length; i++) {
          if (styles.results[currentProductStyleIndex].photos[i].thumbnail_url) {
            imageURL = styles.results[currentProductStyleIndex].photos[i].thumbnail_url;
          }
        }

        if (!imageURL) {
          imageURL = './no_image_available.png';
        }

        const starRating = metaData.ratings;
        const oneStar = Number(starRating[1] || 0);
        const twoStar = Number(starRating[2] || 0);
        const threeStar = Number(starRating[3] || 0);
        const fourStar = Number(starRating[4] || 0);
        const fiveStar = Number(starRating[5] || 0);
        const totalStars = (oneStar + twoStar + threeStar + fourStar + fiveStar);
        const averageStarRating = (((oneStar) + (twoStar * 2) + (threeStar * 3) + (fourStar * 4) + (fiveStar * 5)) / totalStars);

        averageStars = averageStarRating;

      }))
      .then((results) => {
        dispatch(funcs.updateCurrentProductStars(averageStars));
        dispatch(outfitFuncs.addOutfit({ id, name, category, styleName, styleId, originalPrice, salePrice, imageURL, averageStars }));
      })
      .catch((err) => console.log(err));
  };

  return (
    <Card className={classes.root} >
      {props.outfit.name !== 'Add to Outfit' ?
        // replace later with props.outfit.id
        <IconButton onClick={() => handleDelete(props.index)} className={classes.icon}>
          <HighlightOffIcon />
        </IconButton>
        : null}

      <CardMedia
        className={classes.media}
        onClick={() => handleAdd({ currentProductId })}
      >
        <img src={props.outfit.imageURL} alt={props.outfit.name} className={classes.media} />
      </CardMedia>

      <CardContent className={classes.content}>
        <Typography variant='caption' align='left'>{props.outfit.category}</Typography> <br />
        <Typography
          variant={props.outfit.name === 'Add to Outfit' ? 'h5' : 'subtitle2'}
          align={props.outfit.name === 'Add to Outfit' ? 'center' : 'left'}
        >
          {props.outfit.name}
        </Typography>
        <Typography variant='caption' align='left'>
          <span style={props.outfit.salePrice ? { 'textDecoration': 'line-through' } : null}>
            {props.outfit.originalPrice}
          </span>
          <span style={{ color: 'red' }}>
            {props.outfit.salePrice ? '$' + props.outfit.salePrice : null}
          </span>
        </Typography><br />
        {props.outfit.name !== 'Add to Outfit' ?
          <Rating size="small" name="averageStarRating" value={Number(currentProductStars.toFixed(1))} readOnly precision={0.25}
            emptyIcon={<StarBorderIcon fontSize="inherit" />} />
          : null}
      </CardContent>
    </Card >
  );
};

export default OutfitCard;