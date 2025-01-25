import OsmQueryParamNames from "./utils/osmQueryPramNames";
import AxiosFactory from "./utils/axiosFactory";
import { useCallback } from "react";
import { ApiResponse } from "./utils/responses";

interface Location {
    lat: number;
    lng: number;
}

interface PlaceResponse {
    place_id: number;
    licence: string;
    osm_type: string;
    osm_id: number;
    lat: string;
    lon: string;
    class: string;
    type: string;
    place_rank: number;
    importance: number;
    addresstype: string;
    name: string;
    display_name: string;
    address: {
        house_number: string;
        road: string;
        village: string;
        municipality: string;
        county: string;
        state: string;
        postcode: string;
        country: string;
        country_code: string;
    };
}

const useOSMApi = () => {
    const getAddressFromCoordinates = useCallback(async (location: Location): Promise<ApiResponse<PlaceResponse>> => {
        const client = await AxiosFactory.createAxiosInstance(process.env.REACT_APP_OSM_API_URL!, false);

        try {
            const response = await client.get(
                "/reverse?" +
                    [
                        `${OsmQueryParamNames.LATITUDE}=${location.lat}`,
                        `${OsmQueryParamNames.LONGITUDE}=${location.lng}`,
                        `${OsmQueryParamNames.RESPONSE_FORMAT}=json`,
                        `${OsmQueryParamNames.RESPONSE_LANGUAGE}=en-us`,
                    ].join("&")
            );

            return response.data;
        } catch (error: any) {
            if (error.response) {
                const { status, data } = error.response;
                return { error: true, statusCode: status, message: data.message ?? "Unknown error" };
            } else {
                return { error: true, message: "An unexpected error occurred." };
            }
        }
    }, []);

    // TODO add interface for route response
    const getRouteLength = useCallback(async (startLocation: Location, endLocation: Location): Promise<ApiResponse<any>> => {
        const client = await AxiosFactory.createAxiosInstance(process.env.REACT_APP_ROUTE_CALC_API_URL!, false);

        try {
            const response = await client.get(
                `/route/v1/driving/?${startLocation.lng},${startLocation.lat};${endLocation.lng},${endLocation.lat}`
            );

            return response.data;
        } catch (error: any) {
            if (error.response) {
                const { status, data } = error.response;
                return { error: true, statusCode: status, message: data.message ?? "Unknown error" };
            } else {
                return { error: true, message: "An unexpected error occurred." };
            }
        }
    }, []);

    return { getAddressFromCoordinates, getRouteLength };
};

export default useOSMApi;
