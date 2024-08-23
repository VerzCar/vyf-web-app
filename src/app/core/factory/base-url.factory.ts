export const voteCircleBaseApiUrlFactory = (production = false): string => {
    if (production) {
        return '';
    }

    return 'https://vyf-vote-circle-309d72dfd728.herokuapp.com';
};

export const userBaseApiUrlFactory = (production = false): string => {
    if (production) {
        return '';
    }

    return 'https://vyf-user-service-4fe07f1427d1.herokuapp.com';
};

export const ablyTokenEndpointUrlFactory = (production = false): string => {
    if (production) {
        return '';
    }

    return 'https://vyf-vote-circle-309d72dfd728.herokuapp.com/v1/api/vote-circle/token/ably';
};

