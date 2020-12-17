import { ShardType } from '../types';

export const getShardTypeLabel = (type: ShardType): string => {
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
            typeLabel = 'stage';
            break;
    }

    return typeLabel;
};

export default getShardTypeLabel;
