import { ShardType } from '../types';

export const getShardIconName = (type: ShardType) => {
    let typeLabel = '';

    // assign the label according to type
    switch (type) {
        case ShardType.attraction:
            typeLabel = 'attraction';
            break;
        case ShardType.tour:
            typeLabel = 'tour';
            break;
        case ShardType.hotel:
            typeLabel = 'hotel';
            break;
        case ShardType.stage:
        default:
            typeLabel = 'place';
            break;
    }

    return typeLabel;
};

export default getShardIconName;
