export const voteCircleBaseApiUrlFactory = (production = false): string => {
    if (production) {
        return 'https://vote-circle.api.voteyourface.de';
    }

    return 'https://vote-circle.dev.api.voteyourface.de';
};

export const userBaseApiUrlFactory = (production = false): string => {
    if (production) {
        return 'https://user.api.voteyourface.de';
    }

    return 'https://user.dev.api.voteyourface.de';
};

export const ablyTokenEndpointUrlFactory = (production = false): string => {
    if (production) {
        return 'https://vote-circle.api.voteyourface.de/v1/api/vote-circle/token/ably';
    }

    return 'https://vote-circle.dev.api.voteyourface.de/v1/api/vote-circle/token/ably';
};

