FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5284

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["MysteryShopper.API/MysteryShopper.API.csproj", "MysteryShopper.API/"]
COPY ["MysteryShopper.BLL/MysteryShopper.BLL.csproj", "MysteryShopper.BLL/"]
COPY ["MysteryShopper.DAL/MysteryShopper.DAL.csproj", "MysteryShopper.DAL/"]
RUN dotnet restore "./MysteryShopper.API/MysteryShopper.API.csproj"
COPY . .
WORKDIR "/src/MysteryShopper.API"
RUN dotnet build "./MysteryShopper.API.csproj" --no-restore -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "./MysteryShopper.API.csproj" --no-restore -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "MysteryShopper.API.dll"]