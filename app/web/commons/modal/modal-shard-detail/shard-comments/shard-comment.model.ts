import { User } from '../../../../../shared/user/user.model';

export class ShardComment {
    id: number = 0;
    user: User = new User();
    'creation_date': Date = new Date();
    text: string = '';
}
