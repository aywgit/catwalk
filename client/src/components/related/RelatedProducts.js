import React, {useState, useEffect} from 'react';
import exampleData from '../../store/exampleData.js';
import axios from 'axios';
import GITHUB_API_KEY from '../../config/config.js';
import {Typography} from '@material-ui/core';
import RPPassProps from './RPPassProps.js';

const RelatedProducts = () => {
  const url = 'https://app-hrsei-api.herokuapp.com/api/fec2/hratx/products';
  const [isLoading, setIsLoading] = useState(true);
  const [RPInfo, setRPInfo] = useState([]);
  const [RPStyles, setRPStyles] = useState([]);

  const getRelatedProductIds = () => {
    axios.get(`${url}/${exampleData.id}/related`, { 'headers': { 'Authorization': `${GITHUB_API_KEY}`}})
      .then((result) => {
        let promises = [];
        for (let i = 0; i < result.data.length; i++) {
          promises.push(axios.get(`${url}/${result.data[i]}`, { 'headers': { 'Authorization': `${GITHUB_API_KEY}`}}));
        }
        return Promise.all(promises);
      })
      .then((result) => {
        result.forEach(item => setRPInfo(prev => prev.concat(item.data)));
      })
      .then((result) => {
        return axios.get(`${url}/${exampleData.id}/related`, { 'headers': { 'Authorization': `${GITHUB_API_KEY}`}});
      })
      .then((result) => {
        let promises = [];
        for (let i = 0; i < result.data.length; i++) {
          promises.push(axios.get(`${url}/${result.data[i]}/styles`, { 'headers': { 'Authorization': `${GITHUB_API_KEY}`}}));
        }
        return Promise.all(promises);
      })
      .then((result) => {
        result.forEach(item => setRPStyles(prev => prev.concat(item.data)));
      })
      .catch((err) => console.log('there has been an error with getRelatedProductIds'));
  };

  useEffect(() => {
    //need to optimize
    setTimeout(() => setIsLoading(false), 1100);
    getRelatedProductIds();
  }, []);


  return (
    <div id='relatedProducts'>
      <Typography variant='subtitle1' align='left'>Related Products</Typography>
      {isLoading ?
        <div>Loading . . . </div> :
        <RPPassProps RPInfo={RPInfo} RPStyles={RPStyles}/>
      }
    </div>
  );
};

export default RelatedProducts;

//another way of fetching all information
//gets the same result but seems to set off infinite loop of api calls
//not sure why!
//
// const fetchAll = () => {
//   return axios.get(`${url}/${exampleData.id}/related`, { 'headers': { 'Authorization': `${GITHUB_API_KEY}`}})
//     .then((results) => {
//       const RPInfo = Promise.all(results.data.map(
//         id => axios.get(`${url}/${id}`, { 'headers': { 'Authorization': `${GITHUB_API_KEY}`}})
//       ));
//       const RPStyles = Promise.all(results.data.map(
//         id => axios.get(`${url}/${id}/styles`, { 'headers': { 'Authorization': `${GITHUB_API_KEY}`}})
//       ));
//       return Promise.all([RPInfo, RPStyles]);
//     })
//     .then((res) => {
//       setRPInfo(res[0]);
//       setRPStyles(res[1]);
//     })
//     .catch((err) => console.log('error getting ids'));
// };

// // const promise = fetchAll();