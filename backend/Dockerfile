FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY HomeSync.sln ./
COPY UrbanSync.Domain/HomeSync.Domain.csproj UrbanSync.Domain/
COPY UrbanSync.DataAccess/HomeSync.DataAccess.csproj UrbanSync.DataAccess/
COPY UrbanSync.Business/HomeSync.Business.csproj UrbanSync.Business/
COPY UrbanSync.Api/HomeSync.Api.csproj UrbanSync.Api/
RUN dotnet restore HomeSync.sln

COPY . .
RUN dotnet publish UrbanSync.Api/HomeSync.Api.csproj -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

RUN adduser --disabled-password --gecos "" --uid 5678 appuser && chown -R appuser /app
USER appuser

COPY --from=build /app/publish .

EXPOSE 8080
ENTRYPOINT ["dotnet", "HomeSync.Api.dll"]
