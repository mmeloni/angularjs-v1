export class User {
    id: number;
    nid: number;
    username: string;
    email: string;
    gender: string;
    firstname: string;
    lastname: string;
    dateOfBirth: string;
    biography: string;
    geoLocation: string;
    address: string;
    phone: string;
    nationality: string;
    avatar: string;
    cover: string;
    followingCount: number;
    followersCount: number;
    boardsCount: number;
    placesCount: number;
    shardsCount: number;
    toursCount: number;
    itemsCount: number;
    city: any;
    onboarding: number;
    onboardingTour: number = 0;
    isFollowed: boolean;
    isFollowing: boolean;
    isBlockedProfile: boolean;
    onboardingActionsBitMask: number;
    website: string;

    isEmpty() {
        return !this.id && !this.nid;
    }
}
