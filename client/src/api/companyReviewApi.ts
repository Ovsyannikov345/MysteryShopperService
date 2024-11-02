import { host } from ".";

interface CompanyReviewData {
    text: string;
    grade: number;
    orderId: string;
}

const createCompanyReview = async (companyId: string, reviewData: CompanyReviewData) => {
    const response = await host.post(`/api/Review/company/${companyId}`, reviewData);

    return response;
};

export { createCompanyReview };
