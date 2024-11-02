import { host } from ".";

interface UserReviewData {
    text: string;
    grade: number;
    orderId: string;
}

const createUserReview = async (userId: string, reviewData: UserReviewData) => {
    const response = await host.post(`/api/Review/user/${userId}`, reviewData);

    return response;
};

export { createUserReview };
