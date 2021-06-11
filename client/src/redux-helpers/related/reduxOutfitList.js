const outfitFuncs = {
  addOutfit: ({ id, name, category, styleName, styleId, originalPrice, salePrice, imageURL, averageStars }) => ({
    type: 'ADD_OUTFIT',
    payload: { id, name, category, styleName, styleId, originalPrice, salePrice, imageURL, averageStars }
  }),

  deleteOutfit: (index) => ({
    type: 'DELETE_OUTFIT',
    payload: index
  }),

  outfitListReducer: (previousState = [], action) => {
    switch (action.type) {
      case 'ADD_OUTFIT':
        return [...previousState,
        {
          id: action.payload.id, name: action.payload.name, category: action.payload.category,
          styleName: action.payload.styleName, styleId: action.payload.styleId,
          originalPrice: action.payload.originalPrice, salePrice: action.payload.salePrice,
          imageURL: action.payload.imageURL, averageStars: action.payload.averageStars
        }];
      case 'DELETE_OUTFIT':
        return [...previousState.outfitList.slice(0, action.payload), ...previousState.outfitList.slice(action.payload + 1)];
      default:
        return previousState;
    }
  },
};

export default outfitFuncs;
