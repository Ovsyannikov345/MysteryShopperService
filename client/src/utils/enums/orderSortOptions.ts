export enum OrderSortOptions {
    DateAscending = 0,
    DateDescending = 1,
    TimeToCompleteAscending = 2,
    TimeToCompleteDescending = 3,
    PriceAscending = 4,
    PriceDescending = 5,
}

export const sortingLabels: Record<OrderSortOptions, string> = {
    [OrderSortOptions.DateAscending]: "Дата создания",
    [OrderSortOptions.DateDescending]: "Дата создания",
    [OrderSortOptions.TimeToCompleteAscending]: "Время на выполнение",
    [OrderSortOptions.TimeToCompleteDescending]: "Время на выполнение",
    [OrderSortOptions.PriceAscending]: "Цена",
    [OrderSortOptions.PriceDescending]: "Цена",
};
