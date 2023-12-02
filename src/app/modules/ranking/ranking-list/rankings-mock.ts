import { Placement, Ranking } from '@vyf/vote-circle-service';

export const rankingsMock = () => {
    const usersIDs = [
        'd7ca7bb9-42aa-4a64-9a72-0f6ce1ae4bfc',
        '52ec2684-0e2a-4188-8b1a-606b20321c8f',
        '444ae957-bd7a-4e90-b50f-b43ed2c74e7c',
        'b70867b5-8b4b-4e37-9074-eeb2c22a40e1',
        'd4e7c3d9-8910-4ed8-a060-31f773acf1c0',
        '68a1a453-2f58-4ce1-8908-49a30fe6c211',
        '293a69b4-ffc7-481a-91cb-012765a4fd16',
        '4f87e05a-3e43-4817-b7f6-64e08496da78',
        'b7330b24-bfa0-467e-8d01-b23136e512cb',
        '58c9727c-cc07-4c9a-98ff-91d471377352'
    ];

    const placements = [Placement.Neutral, Placement.Ascending, Placement.Descending];

    return usersIDs.map((userId, index) => {
        const ranking: Ranking = {
            createdAt: new Date(),
            id: index + 1,
            identityId: userId,
            number: index + 1,
            placement: placements[Math.floor(Math.random() * placements.length)],
            updatedAt: new Date(),
            votes: (index + 1) * 2
        };
        return ranking;
    });
};

