FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /src

COPY ["HomeSync.Api/HomeSync.Api.csproj", "HomeSync.Api/"]
COPY ["HomeSync.Business/HomeSync.Business.csproj", "HomeSync.Business/"]
COPY ["HomeSync.DataAccess/HomeSync.DataAccess.csproj", "HomeSync.DataAccess/"]
COPY ["HomeSync.Domain/HomeSync.Domain.csproj", "HomeSync.Domain/"]

RUN dotnet restore "HomeSync.Api/HomeSync.Api.csproj"

COPY . .

RUN dotnet publish "HomeSync.Api/HomeSync.Api.csproj" \
    --configuration Release \
    --output /app/publish \
    --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime

WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:8080

EXPOSE 8080

ENTRYPOINT ["dotnet", "HomeSync.Api.dll"]