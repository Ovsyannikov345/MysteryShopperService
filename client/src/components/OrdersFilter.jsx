import React, { useEffect, useState } from "react";
import { Grid, Typography, TextField, Rating, Button } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";

const OrderFilter = ({ queryHandler, successHandler }) => {
    const [searchQuery, setSearchQuery] = useState(
        JSON.parse(localStorage.getItem("orderSearchQuery")) ?? {
            name: "",
            place: "",
            minRating: null,
            minPrice: null,
            maxPrice: null,
            minDays: null,
            maxDays: null,
            startDate: null,
            endDate: null,
        }
    );

    useEffect(() => {
        const query = {
            ...searchQuery,
            startDate: searchQuery.startDate !== "Invalid date" ? searchQuery.startDate : null,
            endDate: searchQuery.endDate !== "Invalid date" ? searchQuery.endDate : null,
        };

        localStorage.setItem("orderSearchQuery", JSON.stringify(query));

        queryHandler(query);
    }, [searchQuery, queryHandler]);

    const resetFilter = () => {
        setSearchQuery({
            name: "",
            place: "",
            minRating: null,
            minPrice: null,
            maxPrice: null,
            minDays: null,
            maxDays: null,
            startDate: null,
            endDate: null,
        });

        successHandler("Фильтры сброшены");
    };

    return (
        <Grid
            container
            item
            flexDirection={"column"}
            alignItems={"center"}
            maxWidth={"300px"}
            ml={"10px"}
            mt={"116px"}
            pt={"5px"}
            pb={"15px"}
            borderRadius={"10px"}
            style={{ boxShadow: "0px 0px 4px 2px rgba(0, 0, 0, 0.25)" }}
        >
            <Grid container item maxWidth={"246px"} gap={"10px"}>
                <Grid container item justifyContent={"center"} mb={"5px"}>
                    <Typography variant="h2" height={"30px"} display={"flex"} alignItems={"center"}>
                        Поиск
                    </Typography>
                </Grid>
                <TextField
                    variant="outlined"
                    fullWidth
                    label="Название или организатор"
                    autoComplete="off"
                    value={searchQuery.name}
                    onChange={(e) => setSearchQuery({ ...searchQuery, name: e.target.value })}
                />
                <TextField
                    variant="outlined"
                    fullWidth
                    label="Адрес"
                    value={searchQuery.place}
                    onChange={(e) => setSearchQuery({ ...searchQuery, place: e.target.value })}
                />
                <Grid container item>
                    <Typography variant="h3" height={"20px"} display={"flex"} alignItems={"center"}>
                        Мин. рейтинг заказчика
                    </Typography>
                    <Rating
                        value={searchQuery.minRating}
                        onChange={(e, newValue) => {
                            setSearchQuery({ ...searchQuery, minRating: newValue });
                        }}
                    />
                </Grid>
                <Typography variant="h3" height={"20px"} display={"flex"} alignItems={"center"}>
                    Стоимость
                </Typography>
                <Grid container item justifyContent={"space-between"}>
                    <Grid container item xs={5}>
                        <TextField
                            variant="outlined"
                            fullWidth
                            label="От"
                            autoComplete="off"
                            value={searchQuery.minPrice ?? ""}
                            onChange={(e) =>
                                setSearchQuery({
                                    ...searchQuery,
                                    minPrice: !Number.isNaN(parseInt(e.target.value))
                                        ? parseInt(e.target.value)
                                        : null,
                                })
                            }
                        ></TextField>
                    </Grid>
                    <Grid container item xs={5}>
                        <TextField
                            variant="outlined"
                            fullWidth
                            label="До"
                            autoComplete="off"
                            value={searchQuery.maxPrice ?? ""}
                            onChange={(e) =>
                                setSearchQuery({
                                    ...searchQuery,
                                    maxPrice: !Number.isNaN(parseInt(e.target.value))
                                        ? parseInt(e.target.value)
                                        : null,
                                })
                            }
                        ></TextField>
                    </Grid>
                </Grid>
                <Typography variant="h3" height={"20px"} display={"flex"} alignItems={"center"}>
                    Дней на выполнение
                </Typography>
                <Grid container item justifyContent={"space-between"}>
                    <Grid container item xs={5}>
                        <TextField
                            variant="outlined"
                            fullWidth
                            label="От"
                            autoComplete="off"
                            value={searchQuery.minDays ?? ""}
                            onChange={(e) =>
                                setSearchQuery({
                                    ...searchQuery,
                                    minDays: !Number.isNaN(parseInt(e.target.value))
                                        ? parseInt(e.target.value)
                                        : null,
                                })
                            }
                        ></TextField>
                    </Grid>
                    <Grid container item xs={5}>
                        <TextField
                            variant="outlined"
                            fullWidth
                            label="До"
                            autoComplete="off"
                            value={searchQuery.maxDays ?? ""}
                            onChange={(e) =>
                                setSearchQuery({
                                    ...searchQuery,
                                    maxDays: !Number.isNaN(parseInt(e.target.value))
                                        ? parseInt(e.target.value)
                                        : null,
                                })
                            }
                        ></TextField>
                    </Grid>
                </Grid>
                <Typography variant="h3" height={"20px"} display={"flex"} alignItems={"center"}>
                    Дата размещения
                </Typography>
                <DatePicker
                    sx={{ width: "100%" }}
                    label="От"
                    slotProps={{ textField: { variant: "standard" } }}
                    disableFuture
                    maxDate={searchQuery.endDate != null ? moment(searchQuery.endDate) : null}
                    value={searchQuery.startDate != null ? moment(searchQuery.startDate) : null}
                    onChange={(newDate) =>
                        setSearchQuery({ ...searchQuery, startDate: moment(newDate).format("YYYY-MM-DD") })
                    }
                />
                <DatePicker
                    sx={{ width: "100%" }}
                    label="До"
                    slotProps={{ textField: { variant: "standard" } }}
                    disableFuture
                    minDate={searchQuery.startDate != null ? moment(searchQuery.startDate) : null}
                    value={searchQuery.endDate != null ? moment(searchQuery.endDate) : null}
                    onChange={(newDate) =>
                        setSearchQuery({ ...searchQuery, endDate: moment(newDate).format("YYYY-MM-DD") })
                    }
                />
                <Grid container item height={"42px"} mt={"12px"}>
                    <Button variant="outlined" fullWidth onClick={resetFilter}>
                        СБРОСИТЬ ФИЛЬТРЫ
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default OrderFilter;
