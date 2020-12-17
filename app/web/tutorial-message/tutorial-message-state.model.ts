type StateLabel = 'in' | 'out';

export class TutorialMessageState {
    state?: StateLabel = 'out';
    callback?: Function;
}
