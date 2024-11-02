import { host } from ".";

interface ReportData {
    title: string;
    description: string;
    grade: number;
    orderId: string;
}

const createReport = async (reportData: ReportData) => {
    const response = await host.post(`/api/Report`, reportData);

    return response;
};

export { createReport };
