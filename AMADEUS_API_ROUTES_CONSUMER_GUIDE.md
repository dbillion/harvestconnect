# Amadeus Developer API - Routes & Client Consumers Guide

**Generated:** November 22, 2025  
**Framework:** Amadeus Python SDK v1.0+  
**Authentication:** OAuth2 (Client Credentials Grant)  
**API Version:** v1/v2/v3  
**Documentation:** https://amadeus4dev.github.io/amadeus-python  

---

## Table of Contents

1. [API Overview](#api-overview)
2. [Apify Tools for API Services](#apify-tools-for-api-services)
3. [Client Initialization](#client-initialization)
4. [Authentication Routes](#authentication-routes)
5. [Shopping API Routes](#shopping-api-routes)
6. [Booking API Routes](#booking-api-routes)
7. [Reference Data Routes](#reference-data-routes)
8. [Analytics Routes](#analytics-routes)
9. [Travel Predictions Routes](#travel-predictions-routes)
10. [Python Client Consumer Examples](#python-client-consumer-examples)
11. [Error Handling](#error-handling)
12. [Pagination & Filtering](#pagination--filtering)

---

## Apify Tools for API Services

### Overview

Apify provides powerful tools for automating API interactions, web scraping, and converting API specifications into Machine Context Protocol (MCP) servers for AI assistant integration. For the Amadeus API integration in HarvestConnect, we recommend using:

### 1. OpenAPI to MCP Converter

**Actor:** `theguide/openapi-to-mcp-converter`  
**Purpose:** Convert the Amadeus OpenAPI specification into an MCP server  
**Use Case:** Enable AI assistants to directly interact with Amadeus API endpoints  
**Pricing:** $0.5 per OpenAPI URL processed

#### Quick Start

```json
{
  "openapiSource": "https://api.amadeus.com/openapi.json",
  "serverName": "amadeus-api-mcp",
  "serverDescription": "MCP server for Amadeus travel API",
  "authentication": {
    "type": "bearer",
    "token": "YOUR_AMADEUS_TOKEN"
  },
  "maxEndpoints": 150
}
```

#### Features

- ✅ Universal OpenAPI v3.0/v3.1 support
- ✅ Smart endpoint filtering with regex patterns
- ✅ Bearer token, API key, and basic auth support
- ✅ Multiple output formats (MCP package, JSON manifest, or both)
- ✅ Production-ready error handling
- ✅ Auto-generates MCP server package (Node.js)

#### Generated Output

The actor produces:

1. **manifest.json** - Complete MCP tool definitions
2. **mcp-server.zip** - Ready-to-deploy Node.js server
3. **Dataset records** - Individual endpoint metadata

#### Integration with HarvestConnect

```bash
# 1. Download generated mcp-server.zip from Apify
# 2. Extract to your project
unzip mcp-server.zip -d ./amadeus-mcp

# 3. Install dependencies
cd amadeus-mcp
npm install

# 4. Configure Claude Desktop (cline.instructions.md or .claude-config.json)
{
  "mcpServers": {
    "amadeus-api": {
      "command": "node",
      "args": ["./amadeus-mcp/index.js"]
    }
  }
}

# 5. Now AI assistants can call Amadeus API endpoints directly!
```

#### Example: Filtering Specific Amadeus Endpoints

```json
{
  "openapiSource": "https://api.amadeus.com/openapi.json",
  "serverName": "amadeus-flight-mcp",
  "serverDescription": "MCP for flight booking endpoints only",
  "includeEndpoints": [
    "GET /shopping/flight-offers",
    "POST /shopping/flight-offers/pricing",
    "POST /booking/flight-orders",
    "GET /booking/flight-orders"
  ],
  "excludeEndpoints": ["DELETE .*", "PATCH .*"]
}
```

### 2. RAG Web Browser (apify/rag-web-browser)

**Actor:** `apify/rag-web-browser`  
**Purpose:** Scrape and extract API documentation dynamically  
**Use Case:** Keep documentation synchronized with Amadeus API updates  
**Pricing:** Platform usage only (3 URLs per run = good value)

#### Query Amadeus Documentation

```javascript
{
  "query": "flight offers search endpoint oauth2 authentication site:amadeus4dev.github.io",
  "maxResults": 5,
  "outputFormats": ["markdown"]
}
```

### 3. Flight Tracker Actor (syntellect_ai/flight-tracker-actor)

**Actor:** `syntellect_ai/flight-tracker-actor`  
**Purpose:** Real-time flight tracking with AviationStack API  
**Use Case:** Track flights booked through Amadeus API  
**Pricing:** $0.019 per Actor start + $0.009 per result

#### Track Booked Flights

```javascript
{
  "flightNumber": "SQ006",
  "date": "2024-11-25",
  "airline": "SQ",
  "apiEndpoint": "https://api.aviationstack.com/v1/flights"
}
```

### 4. API Services Architecture Pattern

#### Recommended Architecture

```
HarvestConnect/
├── backend/
│   ├── integrations/
│   │   ├── amadeus_service.py        # Core Amadeus client
│   │   ├── travel_booking_service.py # Business logic
│   │   └── apify_orchestrator.py     # Apify automation
│   ├── tasks/
│   │   ├── update_flight_data.py     # Celery task
│   │   └── sync_api_docs.py          # RAG sync task
│   └── mcp/
│       └── amadeus_mcp/              # Generated MCP server
├── .env                              # Apify API token + credentials
└── requirements.txt
```

#### Implementation Example: Apify Orchestrator

```python
# backend/integrations/apify_orchestrator.py
import asyncio
from apify_client import ApifyClient

class AmadeusAPIOrchestrator:
    """Orchestrates Apify actors for Amadeus API services"""
    
    def __init__(self, api_token: str, amadeus_token: str):
        self.client = ApifyClient(api_token)
        self.amadeus_token = amadeus_token
    
    async def convert_openapi_to_mcp(self) -> dict:
        """
        Convert Amadeus OpenAPI spec to MCP server
        Returns: MCP server package metadata
        """
        actor = self.client.actor("theguide/openapi-to-mcp-converter")
        run = await actor.call({
            "openapiSource": "https://api.amadeus.com/openapi.json",
            "serverName": "amadeus-api-mcp",
            "authentication": {
                "type": "bearer",
                "token": self.amadeus_token
            },
            "maxEndpoints": 150,
            "outputFormat": "both"
        })
        
        return {
            "status": "success",
            "defaultDatasetId": run.get("defaultDatasetId"),
            "defaultKeyValueStoreId": run.get("defaultKeyValueStoreId")
        }
    
    async def extract_flight_documentation(self, query: str) -> list:
        """
        Extract flight booking documentation dynamically
        """
        actor = self.client.actor("apify/rag-web-browser")
        run = await actor.call({
            "query": query,
            "maxResults": 5,
            "outputFormats": ["markdown"]
        })
        
        dataset_items = await self.client.dataset(
            run.get("defaultDatasetId")
        ).list_items()
        
        return dataset_items.get("items", [])
    
    async def track_flight_live(self, flight_number: str, date: str) -> dict:
        """
        Real-time flight tracking using AviationStack
        """
        actor = self.client.actor("syntellect_ai/flight-tracker-actor")
        run = await actor.call({
            "flightNumber": flight_number,
            "date": date,
            "outputFormat": "json"
        })
        
        return {
            "status": "tracking",
            "dataset_id": run.get("defaultDatasetId")
        }

# Usage in Django view
@api_view(['GET'])
def generate_amadeus_mcp(request):
    """API endpoint to generate Amadeus MCP server"""
    orchestrator = AmadeusAPIOrchestrator(
        api_token=settings.APIFY_API_TOKEN,
        amadeus_token=settings.AMADEUS_TOKEN
    )
    
    result = asyncio.run(orchestrator.convert_openapi_to_mcp())
    return Response(result)
```

### Benefits of Using Apify for HarvestConnect

| Benefit | Tool | Impact |
|---------|------|--------|
| **Dynamic API Integration** | OpenAPI to MCP | Direct AI assistant ↔ Amadeus API communication |
| **Documentation Sync** | RAG Web Browser | Auto-updates when Amadeus docs change |
| **Live Flight Tracking** | Flight Tracker | Real-time status for booked flights |
| **Scalability** | Apify Platform | Handles API rate limits & retries |
| **Cost Efficiency** | Pay-per-result | Only pay for actual API calls |
| **Workflow Automation** | Actor Orchestration | Chain multiple Apify actors together |

---



### Supported Travel Services

| Service | Endpoints | Methods |
|---------|-----------|---------|
| **Flight Search & Booking** | 8+ | GET, POST |
| **Hotel Search & Booking** | 6+ | GET, POST |
| **Ground Transportation** | 4+ | GET, POST |
| **Reference Data** | 10+ | GET |
| **Travel Analytics** | 5+ | GET |
| **Travel Predictions** | 4+ | GET |
| **Activities & Tours** | 3+ | GET, POST |

### Base URLs

```
Test Environment:  https://test.api.amadeus.com
Production Env:    https://api.amadeus.com
Version Prefix:    /v1, /v2, /v3
```

---

## Client Initialization

### 1. Basic Initialization with Credentials

```python
from amadeus import Client, ResponseError

# Initialize with explicit credentials
amadeus = Client(
    client_id='YOUR_CLIENT_ID',
    client_secret='YOUR_CLIENT_SECRET'
)
```

### 2. Initialization from Environment Variables

```python
from amadeus import Client
import os

# Expects AMADEUS_CLIENT_ID and AMADEUS_CLIENT_SECRET env vars
amadeus = Client()
```

### 3. Production Environment Setup

```python
from amadeus import Client

amadeus = Client(
    client_id='YOUR_CLIENT_ID',
    client_secret='YOUR_CLIENT_SECRET',
    hostname='production'  # Default: 'test'
)
```

### 4. With Custom Logger

```python
from amadeus import Client
import logging

# Configure logger
logger = logging.getLogger('amadeus')
logger.setLevel(logging.DEBUG)

# Initialize with logger
amadeus = Client(
    client_id='YOUR_CLIENT_ID',
    client_secret='YOUR_CLIENT_SECRET',
    logger=logger,
    log_level='debug'  # Alternative: direct log_level parameter
)
```

### 5. With Multiple Configurations

```python
from amadeus import Client

# Test client
test_client = Client(
    client_id='TEST_ID',
    client_secret='TEST_SECRET',
    hostname='test'
)

# Production client
prod_client = Client(
    client_id='PROD_ID',
    client_secret='PROD_SECRET',
    hostname='production'
)
```

---

## Authentication Routes

### OAuth2 Token Generation

**Endpoint:** `POST /v1/security/oauth2/token`

```python
from amadeus import Client

amadeus = Client(
    client_id='YOUR_CLIENT_ID',
    client_secret='YOUR_CLIENT_SECRET'
)

# Token is automatically obtained and refreshed by the client
# No manual token management needed
```

**cURL Example:**

```bash
curl -X POST https://test.api.amadeus.com/v1/security/oauth2/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET"
```

**Response:**

```json
{
  "type": "amadeusOAuth2Token",
  "username": "your_username",
  "application_name": "your_app",
  "client_id": "YOUR_CLIENT_ID",
  "token_type": "Bearer",
  "access_token": "AnT9efPbzZqFqVl2Yj...",
  "expires_in": 1799,
  "state": "approved"
}
```

---

## Shopping API Routes

### Flight Search Routes

#### 1. Flight Offers Search (GET)

**Route:** `GET /v2/shopping/flight-offers`

```python
amadeus.shopping.flight_offers_search.get(
    originLocationCode='SYD',
    destinationLocationCode='BKK',
    departureDate='2024-11-01',
    adults=1,
    children=0,
    infants=0,
    travelClass='ECONOMY',
    nonStop=False,
    max=10
)
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| originLocationCode | string | Yes | IATA code of departure airport |
| destinationLocationCode | string | Yes | IATA code of arrival airport |
| departureDate | string | Yes | Departure date (YYYY-MM-DD) |
| returnDate | string | No | Return date for round-trip |
| adults | int | Yes | Number of adult passengers |
| children | int | No | Number of children (2-11 years) |
| infants | int | No | Number of infants (0-2 years) |
| travelClass | string | No | ECONOMY, BUSINESS, FIRST, PREMIUM_ECONOMY |
| nonStop | boolean | No | Direct flights only |
| max | int | No | Max results (1-250, default: 10) |
| currencyCode | string | No | ISO 4217 currency code |
| searchCriteria | string | No | Additional search filters |

**Response Example:**

```json
{
  "data": [
    {
      "type": "flight-offer",
      "id": "1",
      "source": "GDS",
      "instantTicketingRequired": false,
      "nonHomogeneous": false,
      "oneWay": false,
      "lastTicketingDate": "2024-10-31",
      "numberOfBookableSeats": 9,
      "itineraries": [
        {
          "duration": "PT9H30M",
          "segments": [
            {
              "departure": {
                "iataCode": "SYD",
                "terminal": "1",
                "at": "2024-11-01T10:00:00"
              },
              "arrival": {
                "iataCode": "BKK",
                "terminal": "2",
                "at": "2024-11-01T18:30:00"
              },
              "carrierCode": "TG",
              "number": "476",
              "aircraft": {
                "code": "777"
              },
              "operating": {
                "carrierCode": "TG"
              },
              "duration": "PT9H30M",
              "id": "1",
              "numberOfStops": 0,
              "blacklistedInEU": false
            }
          ]
        }
      ],
      "price": {
        "currency": "USD",
        "total": "567.89",
        "base": "450.00",
        "fees": [],
        "grandTotal": "567.89"
      },
      "pricingOptions": {
        "fareType": ["PUBLISHED"],
        "includedCheckedBagsOnly": true
      },
      "validatingAirlineCodes": ["TG"],
      "travelerPricings": [
        {
          "travelerId": "1",
          "fareOption": "STANDARD",
          "travelerType": "ADULT",
          "price": {
            "currency": "USD",
            "total": "567.89",
            "base": "450.00"
          }
        }
      ]
    }
  ]
}
```

#### 2. Flight Offers Search (POST)

**Route:** `POST /v2/shopping/flight-offers`

```python
body = {
    "originDestinations": [
        {
            "id": "1",
            "originLocationCode": "SYD",
            "destinationLocationCode": "BKK",
            "departureDateTimeRange": {
                "date": "2024-11-01"
            }
        }
    ],
    "travelers": [
        {
            "id": "1",
            "travelerType": "ADULT"
        }
    ],
    "sources": ["GDS"],
    "searchCriteria": {
        "maxFlightOffers": 10,
        "flightFilters": {
            "cabinRestrictions": [
                {
                    "cabin": "ECONOMY",
                    "coverage": "MOST_SEGMENTS",
                    "originDestinationIds": ["1"]
                }
            ]
        }
    }
}

amadeus.shopping.flight_offers_search.post(body)
```

#### 3. Flight Offers Pricing

**Route:** `POST /v1/shopping/flight-offers/pricing`

```python
# Get flight offers first
flight_offers = amadeus.shopping.flight_offers_search.get(
    originLocationCode='SYD',
    destinationLocationCode='BKK',
    departureDate='2024-11-01',
    adults=1
).data

# Price the first offer
amadeus.shopping.flight_offers.pricing.post(
    flight_offers[0],
    include='credit-card-fees,other-services'
)

# Price multiple offers
amadeus.shopping.flight_offers.pricing.post(
    flight_offers[0:2],
    include='credit-card-fees'
)
```

#### 4. Flight Offers Upselling

**Route:** `POST /v1/shopping/flight-offers/upselling`

```python
body = {
    "originDestinations": [],
    "travelers": [],
    "sources": [],
    "searchCriteria": {}
}

amadeus.shopping.flight_offers.upselling.post(body)
```

#### 5. Flight Choice Prediction

**Route:** `POST /v1/shopping/flight-offers/prediction`

```python
# Get flight offers
flight_offers = amadeus.shopping.flight_offers_search.get(
    originLocationCode='MAD',
    destinationLocationCode='NYC',
    departureDate='2024-11-01',
    adults=1
).data

# Predict which flight user will choose
amadeus.shopping.flight_offers.prediction.post(flight_offers)
```

#### 6. Flight Availability Search

**Route:** `POST /v1/shopping/availability/flight-availabilities`

```python
body = {
    "originDestinations": [
        {
            "originLocationCode": "SYD",
            "destinationLocationCode": "BKK",
            "departureDateTime": {
                "date": "2024-11-01",
                "time": "10:00:00"
            }
        }
    ],
    "travelers": [
        {
            "id": "1",
            "travelerType": "ADULT"
        }
    ],
    "sources": ["GDS"],
    "searchCriteria": {
        "cabins": ["ECONOMY"]
    }
}

amadeus.shopping.availability.flight_availabilities.post(body)
```

### Flight Inspiration Routes

#### 1. Flight Destinations (Cheapest Date)

**Route:** `GET /v1/shopping/flight-destinations`

```python
amadeus.shopping.flight_destinations.get(
    origin='MAD',
    maxPrice=500,
    departureDate='2024-11-01',
    duration=7,
    nonStop=False,
    viewBy='PRICE'
)
```

#### 2. Flight Dates (Cheapest Destination)

**Route:** `GET /v1/shopping/flight-dates`

```python
amadeus.shopping.flight_dates.get(
    origin='MAD',
    destination='MUC',
    departureDate='2024-11-01',
    duration=7
)
```

### Seat Map Routes

#### 1. Get Seat Map (GET)

**Route:** `GET /v1/shopping/seatmaps`

```python
amadeus.shopping.seatmaps.get(
    **{"flight-orderId": "orderid"}
)
```

#### 2. Get Seat Map (POST)

**Route:** `POST /v1/shopping/seatmaps`

```python
body = {
    "data": {
        "flightOffers": [
            {
                "type": "flight-offer",
                "id": "1",
                "source": "GDS"
            }
        ]
    }
}

amadeus.shopping.seatmaps.post(body)
```

### Hotel Search Routes

#### 1. Hotel Offers Search

**Route:** `GET /v3/shopping/hotel-offers`

```python
amadeus.shopping.hotel_offers_search.get(
    hotelIds='RTPAR001,ADPAR001',
    adults=2,
    checkInDate='2024-11-10',
    checkOutDate='2024-11-15',
    roomQuantity=1,
    currency='EUR'
)
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| hotelIds | string | Yes | Comma-separated hotel IDs |
| adults | int | Yes | Number of adults |
| children | int | No | Number of children |
| checkInDate | string | Yes | Check-in date (YYYY-MM-DD) |
| checkOutDate | string | Yes | Check-out date (YYYY-MM-DD) |
| roomQuantity | int | No | Number of rooms |
| currency | string | No | ISO 4217 currency code |

#### 2. Hotel Offer Details

**Route:** `GET /v3/shopping/hotel-offers/{offerId}`

```python
amadeus.shopping.hotel_offer_search('OFFER_ID').get()
```

### Activity Routes

#### 1. Activities by Coordinates

**Route:** `GET /v1/shopping/activities`

```python
amadeus.shopping.activities.get(
    latitude=40.41436995,
    longitude=-3.69170868,
    radius=15
)
```

#### 2. Activities by Square Area

**Route:** `GET /v1/shopping/activities/by-square`

```python
amadeus.shopping.activities.by_square.get(
    north=41.397158,
    west=2.160873,
    south=41.394582,
    east=2.177181
)
```

#### 3. Single Activity Details

**Route:** `GET /v1/shopping/activities/{activityId}`

```python
amadeus.shopping.activity('4615').get()
```

### Transfer Routes

#### 1. Search Transfers

**Route:** `POST /v1/shopping/transfer-offers`

```python
body = {
    "startLocationCode": "CDG",
    "endLocationCode": "PARIS",
    "startDateTime": "2024-11-01T09:00:00",
    "endDateTime": "2024-11-01T18:00:00",
    "passengers": 1
}

amadeus.shopping.transfer_offers.post(body)
```

---

## Booking API Routes

### Flight Booking Routes

#### 1. Create Flight Order

**Route:** `POST /v1/booking/flight-orders`

```python
body = {
    "data": {
        "type": "flight-order",
        "flightOffers": [flight_offer],
        "travelers": [
            {
                "id": "1",
                "dateOfBirth": "1990-01-15",
                "name": {
                    "firstName": "JOHN",
                    "lastName": "SMITH"
                },
                "gender": "MALE",
                "contact": {
                    "emailAddress": "john.smith@example.com",
                    "phones": [
                        {
                            "deviceType": "MOBILE",
                            "countryCallingCode": "1",
                            "number": "5551234567"
                        }
                    ]
                },
                "documents": [
                    {
                        "documentType": "PASSPORT",
                        "birthPlace": "New York",
                        "issuanceLocation": "New York",
                        "issuanceDate": "2015-04-14",
                        "number": "00000000",
                        "expiryDate": "2025-04-14",
                        "issuanceCountry": "US",
                        "validityCountry": "US",
                        "nationality": "US",
                        "holder": True
                    }
                ]
            }
        ],
        "remarks": {
            "general": [{"subType": "GENERAL_REMARK", "text": "Special request: vegetarian meal"}]
        },
        "contacts": [
            {
                "addresseeName": {"firstName": "JOHN", "lastName": "SMITH"},
                "address": {
                    "lines": ["123 Main Street"],
                    "postalCode": "10001",
                    "cityName": "New York",
                    "countryCode": "US"
                },
                "emailAddress": "john.smith@example.com",
                "phones": [{"deviceType": "MOBILE", "countryCallingCode": "1", "number": "5551234567"}]
            }
        ]
    }
}

amadeus.booking.flight_orders.post(body)
```

#### 2. Get Flight Order

**Route:** `GET /v1/booking/flight-orders/{orderId}`

```python
amadeus.booking.flight_order('ORDER_ID').get()
```

#### 3. Delete Flight Order

**Route:** `DELETE /v1/booking/flight-orders/{orderId}`

```python
amadeus.booking.flight_order('ORDER_ID').delete()
```

### Hotel Booking Routes

#### 1. Create Hotel Order (v2)

**Route:** `POST /v2/booking/hotel-orders`

```python
body = {
    "data": {
        "type": "hotel-order",
        "guests": [
            {
                "tid": 1,
                "title": "MR",
                "firstName": "JOHN",
                "lastName": "SMITH",
                "phone": "+15551234567",
                "email": "john.smith@example.com"
            }
        ],
        "travelAgent": {
            "contact": {
                "email": "agent@example.com"
            }
        },
        "roomAssociations": [
            {
                "guestReferences": [{"guestReference": "1"}],
                "hotelOfferId": "OFFER_ID"
            }
        ],
        "payment": {
            "method": "CREDIT_CARD",
            "card": {
                "vendorCode": "VI",
                "cardNumber": "4111111111111111",
                "expiryDate": "2025-12",
                "holderName": "JOHN SMITH"
            }
        }
    }
}

amadeus.booking.hotel_orders.post(body)
```

#### 2. Create Hotel Booking (v1)

**Route:** `POST /v1/booking/hotel-bookings`

```python
body = {
    "offerId": "OFFER_ID",
    "guests": [
        {
            "id": 1,
            "firstName": "JOHN",
            "lastName": "SMITH",
            "email": "john.smith@example.com",
            "phone": "+15551234567"
        }
    ],
    "payments": [
        {
            "method": "creditCard",
            "card": {
                "number": "4111111111111111",
                "expiryMonth": 12,
                "expiryYear": 2025,
                "holderName": "JOHN SMITH"
            }
        }
    ]
}

amadeus.booking.hotel_bookings.post(body)
```

### Transfer Booking Routes

#### 1. Book Transfer

**Route:** `POST /v1/ordering/transfer-orders`

```python
body = {
    "data": {
        "type": "transfer-order",
        "startLocationCode": "CDG",
        "endLocationCode": "PARIS",
        "startDateTime": "2024-11-01T09:00:00",
        "passengers": 1,
        "startLocationName": "Charles de Gaulle Airport"
    }
}

amadeus.ordering.transfer_orders.post(body, offerId='1000000000')
```

#### 2. Cancel Transfer Order

**Route:** `POST /v1/ordering/transfer-orders/{orderId}/transfers/cancellation`

```python
body = {
    "data": {
        "type": "transfer-cancellation"
    }
}

amadeus.ordering.transfer_order('ORDER_ID').transfers.cancellation.post(
    body,
    confirmNbr=123
)
```

---

## Reference Data Routes

### Location Routes

#### 1. Search Locations (Autocomplete)

**Route:** `GET /v1/reference-data/locations`

```python
from amadeus import Location

# Search for cities and airports
amadeus.reference_data.locations.get(
    keyword='LON',
    subType=Location.ANY,
    page={'limit': 10, 'offset': 0}
)

# Search for cities only
amadeus.reference_data.locations.cities.get(
    keyword='PAR'
)

# Search for airports only
amadeus.reference_data.locations.airports.get(
    keyword='LON'
)
```

#### 2. Get Location by ID

**Route:** `GET /v1/reference-data/locations/{locationId}`

```python
amadeus.reference_data.location('ALHR').get()
```

#### 3. Find Nearest Airports

**Route:** `GET /v1/reference-data/locations/airports`

```python
amadeus.reference_data.locations.airports.get(
    longitude=0.1278,
    latitude=51.5074,
    radius=500,
    pageLimit=10
)
```

### Hotel Reference Data

#### 1. Hotels by Hotel IDs

**Route:** `GET /v1/reference-data/locations/hotels/by-hotels`

```python
amadeus.reference_data.locations.hotels.by_hotels.get(
    hotelIds='ADNYCCTB,ADPARCCT'
)
```

#### 2. Hotels by City Code

**Route:** `GET /v1/reference-data/locations/hotels/by-city`

```python
amadeus.reference_data.locations.hotels.by_city.get(
    cityCode='PAR',
    pageLimit=100
)
```

#### 3. Hotels by Geocode

**Route:** `GET /v1/reference-data/locations/hotels/by-geocode`

```python
amadeus.reference_data.locations.hotels.by_geocode.get(
    longitude=2.160873,
    latitude=41.397158,
    radius=15
)
```

#### 4. Hotel Name Autocomplete

**Route:** `GET /v1/reference-data/locations/hotel`

```python
from amadeus import Hotel

amadeus.reference_data.locations.hotel.get(
    keyword='PARI',
    subType=[Hotel.HOTEL_GDS, Hotel.HOTEL_LEISURE]
)
```

### Airline Data

#### 1. Airline Code Lookup

**Route:** `GET /v1/reference-data/airlines`

```python
amadeus.reference_data.airlines.get(
    airlineCodes='U2,BA'
)
```

### Check-in Links

**Route:** `GET /v2/reference-data/urls/checkin-links`

```python
amadeus.reference_data.urls.checkin_links.get(
    airlineCode='BA'
)
```

### Recommended Locations

**Route:** `GET /v1/reference-data/recommended-locations`

```python
amadeus.reference_data.recommended_locations.get(
    cityCodes='PAR,LON',
    travelerCountryCode='FR'
)
```

---

## Analytics Routes

### Air Traffic Analytics

#### 1. Most Booked Destinations

**Route:** `GET /v1/travel/analytics/air-traffic/booked`

```python
amadeus.travel.analytics.air_traffic.booked.get(
    originCityCode='MAD',
    period='2024-08'
)
```

#### 2. Most Traveled Destinations

**Route:** `GET /v1/travel/analytics/air-traffic/traveled`

```python
amadeus.travel.analytics.air_traffic.traveled.get(
    originCityCode='MAD',
    period='2024-01'
)
```

#### 3. Busiest Travel Period

**Route:** `GET /v1/travel/analytics/air-traffic/busiest-period`

```python
amadeus.travel.analytics.air_traffic.busiest_period.get(
    cityCode='MAD',
    period='2024',
    direction='ARRIVING'
)
```

### Itinerary Price Metrics

**Route:** `GET /v1/analytics/itinerary-price-metrics`

```python
amadeus.analytics.itinerary_price_metrics.get(
    originIataCode='MAD',
    destinationIataCode='CDG',
    departureDate='2024-11-01',
    currencyCode='EUR'
)
```

---

## Travel Predictions Routes

### Flight Delay Prediction

**Route:** `GET /v1/travel/predictions/flight-delay`

```python
amadeus.travel.predictions.flight_delay.get(
    originLocationCode='NCE',
    destinationLocationCode='IST',
    departureDate='2024-11-01',
    departureTime='18:20:00',
    arrivalDate='2024-11-01',
    arrivalTime='22:15:00',
    aircraftCode='321',
    carrierCode='TK',
    flightNumber='1816',
    duration='PT31H10M'
)
```

### Trip Purpose Prediction

**Route:** `GET /v1/travel/predictions/trip-purpose`

```python
amadeus.travel.predictions.trip_purpose.get(
    originLocationCode='ATH',
    destinationLocationCode='MAD',
    departureDate='2024-11-01',
    returnDate='2024-11-08'
)
```

### Airport On-Time Performance

**Route:** `GET /v1/airport/predictions/on-time`

```python
amadeus.airport.predictions.on_time.get(
    airportCode='JFK',
    date='2024-11-01'
)
```

### Airport Direct Destinations

**Route:** `GET /v1/airport/direct-destinations`

```python
amadeus.airport.direct_destinations.get(
    departureAirportCode='BLR'
)
```

### Airline Destinations

**Route:** `GET /v1/airline/destinations`

```python
amadeus.airline.destinations.get(
    airlineCode='BA'
)
```

### Flight Status

**Route:** `GET /v1/schedule/flights`

```python
amadeus.schedule.flights.get(
    carrierCode='AZ',
    flightNumber='319',
    scheduledDepartureDate='2024-11-01'
)
```

---

## Python Client Consumer Examples

### Complete Flight Search to Booking Flow

```python
from amadeus import Client, ResponseError, Location

class AmadeusFlightBookingService:
    def __init__(self, client_id, client_secret):
        self.amadeus = Client(
            client_id=client_id,
            client_secret=client_secret,
            hostname='test'
        )
    
    def search_flights(self, origin, destination, departure_date, adults=1):
        """Search for available flights"""
        try:
            response = self.amadeus.shopping.flight_offers_search.get(
                originLocationCode=origin,
                destinationLocationCode=destination,
                departureDate=departure_date,
                adults=adults,
                max=10
            )
            return response.data
        except ResponseError as error:
            print(f"Flight search error: {error}")
            return None
    
    def price_flight(self, flight_offer):
        """Get detailed pricing for a specific flight"""
        try:
            response = self.amadeus.shopping.flight_offers.pricing.post(
                flight_offer
            )
            return response.data
        except ResponseError as error:
            print(f"Pricing error: {error}")
            return None
    
    def create_booking(self, flight_offer, traveler_info):
        """Create a flight booking"""
        try:
            body = {
                "data": {
                    "type": "flight-order",
                    "flightOffers": [flight_offer],
                    "travelers": [traveler_info]
                }
            }
            response = self.amadeus.booking.flight_orders.post(body)
            return response.data
        except ResponseError as error:
            print(f"Booking error: {error}")
            return None
    
    def get_booking(self, order_id):
        """Retrieve booking details"""
        try:
            response = self.amadeus.booking.flight_order(order_id).get()
            return response.data
        except ResponseError as error:
            print(f"Booking retrieval error: {error}")
            return None

# Usage Example
service = AmadeusFlightBookingService('YOUR_CLIENT_ID', 'YOUR_CLIENT_SECRET')

# Search flights
flights = service.search_flights('SYD', 'BKK', '2024-11-01')
if flights:
    first_flight = flights[0]
    
    # Price the flight
    priced = service.price_flight(first_flight)
    
    # Create booking
    traveler = {
        "id": "1",
        "dateOfBirth": "1990-01-15",
        "name": {"firstName": "JOHN", "lastName": "SMITH"},
        "gender": "MALE",
        "contact": {
            "emailAddress": "john@example.com",
            "phones": [{"deviceType": "MOBILE", "countryCallingCode": "1", "number": "5551234567"}]
        }
    }
    
    booking = service.create_booking(first_flight, traveler)
    if booking:
        print(f"Booking confirmed: {booking['id']}")
```

### Hotel Search and Booking Service

```python
class AmadeusHotelBookingService:
    def __init__(self, client_id, client_secret):
        self.amadeus = Client(
            client_id=client_id,
            client_secret=client_secret,
            hostname='test'
        )
    
    def search_hotels_by_city(self, city_code):
        """Search hotels by city code"""
        try:
            response = self.amadeus.reference_data.locations.hotels.by_city.get(
                cityCode=city_code,
                pageLimit=20
            )
            return response.data
        except ResponseError as error:
            print(f"Hotel search error: {error}")
            return None
    
    def get_hotel_offers(self, hotel_ids, check_in, check_out, adults=1):
        """Get available hotel offers"""
        try:
            response = self.amadeus.shopping.hotel_offers_search.get(
                hotelIds=hotel_ids,
                adults=adults,
                checkInDate=check_in,
                checkOutDate=check_out,
                roomQuantity=1
            )
            return response.data
        except ResponseError as error:
            print(f"Hotel offers error: {error}")
            return None
    
    def book_hotel(self, offer_id, guest_info, payment_info):
        """Book a hotel room"""
        try:
            body = {
                "data": {
                    "type": "hotel-order",
                    "guests": [guest_info],
                    "roomAssociations": [
                        {
                            "guestReferences": [{"guestReference": "1"}],
                            "hotelOfferId": offer_id
                        }
                    ],
                    "payment": payment_info
                }
            }
            response = self.amadeus.booking.hotel_orders.post(body)
            return response.data
        except ResponseError as error:
            print(f"Hotel booking error: {error}")
            return None

# Usage
service = AmadeusHotelBookingService('YOUR_CLIENT_ID', 'YOUR_CLIENT_SECRET')

# Search hotels
hotels = service.search_hotels_by_city('PAR')

if hotels:
    hotel_ids = ','.join([h['id'] for h in hotels[:5]])
    
    # Get offers
    offers = service.get_hotel_offers(
        hotel_ids=hotel_ids,
        check_in='2024-11-10',
        check_out='2024-11-15',
        adults=2
    )
```

### Travel Analytics and Predictions Service

```python
class AmadeusTravelAnalyticsService:
    def __init__(self, client_id, client_secret):
        self.amadeus = Client(
            client_id=client_id,
            client_secret=client_secret,
            hostname='test'
        )
    
    def get_price_metrics(self, origin, destination, date):
        """Get itinerary price metrics"""
        try:
            response = self.amadeus.analytics.itinerary_price_metrics.get(
                originIataCode=origin,
                destinationIataCode=destination,
                departureDate=date
            )
            return response.data
        except ResponseError as error:
            print(f"Price metrics error: {error}")
            return None
    
    def predict_flight_delay(self, origin, destination, departure_date,
                            departure_time, carrier, flight_number):
        """Predict flight delay probability"""
        try:
            response = self.amadeus.travel.predictions.flight_delay.get(
                originLocationCode=origin,
                destinationLocationCode=destination,
                departureDate=departure_date,
                departureTime=departure_time,
                carrierCode=carrier,
                flightNumber=flight_number,
                aircraftCode='321',
                duration='PT9H30M'
            )
            return response.data
        except ResponseError as error:
            print(f"Delay prediction error: {error}")
            return None
    
    def get_airport_ontime_performance(self, airport_code, date):
        """Get airport on-time performance"""
        try:
            response = self.amadeus.airport.predictions.on_time.get(
                airportCode=airport_code,
                date=date
            )
            return response.data
        except ResponseError as error:
            print(f"On-time performance error: {error}")
            return None
    
    def get_most_booked_destinations(self, origin_city, period):
        """Get most booked destinations from origin"""
        try:
            response = self.amadeus.travel.analytics.air_traffic.booked.get(
                originCityCode=origin_city,
                period=period
            )
            return response.data
        except ResponseError as error:
            print(f"Booked destinations error: {error}")
            return None

# Usage
analytics = AmadeusTravelAnalyticsService('YOUR_CLIENT_ID', 'YOUR_CLIENT_SECRET')

# Get price metrics
metrics = analytics.get_price_metrics('MAD', 'CDG', '2024-11-01')

# Predict delay
delay = analytics.predict_flight_delay(
    'NCE', 'IST', '2024-11-01', '18:20:00', 'TK', '1816'
)

# Get on-time performance
performance = analytics.get_airport_ontime_performance('JFK', '2024-11-01')

# Get booked destinations
destinations = analytics.get_most_booked_destinations('MAD', '2024-08')
```

---

## Error Handling

### Common Error Codes

| Code | Status | Meaning | Example |
|------|--------|---------|---------|
| 200 | OK | Request succeeded | Flight search |
| 201 | Created | Resource created | Booking confirmation |
| 204 | No Content | Successful delete | Order cancellation |
| 400 | Bad Request | Invalid parameters | Missing required field |
| 401 | Unauthorized | Invalid credentials | Expired token |
| 403 | Forbidden | Insufficient permissions | API limit exceeded |
| 404 | Not Found | Resource not found | Invalid order ID |
| 500 | Server Error | Internal error | Temporary failure |

### Error Handling Pattern

```python
from amadeus import Client, ResponseError

amadeus = Client(
    client_id='YOUR_CLIENT_ID',
    client_secret='YOUR_CLIENT_SECRET'
)

try:
    response = amadeus.shopping.flight_offers_search.get(
        originLocationCode='SYD',
        destinationLocationCode='BKK',
        departureDate='2024-11-01',
        adults=1
    )
    
    print("Success:")
    print(f"Response body: {response.body}")
    print(f"Parsed result: {response.result}")
    print(f"Data: {response.data}")
    
except ResponseError as error:
    print(f"Error status: {error.status}")
    print(f"Error response: {error.response}")
    print(f"Full error: {error}")
```

---

## Pagination & Filtering

### Pagination Example

```python
from amadeus import Location

amadeus = Client(
    client_id='YOUR_CLIENT_ID',
    client_secret='YOUR_CLIENT_SECRET'
)

# First page
response = amadeus.reference_data.locations.get(
    keyword='LON',
    subType=Location.ANY,
    page={'limit': 10, 'offset': 0}
)

print(f"Results: {response.data}")

# Get next page
next_response = amadeus.next(response)
if next_response:
    print(f"Next page results: {next_response.data}")

# Get previous page
prev_response = amadeus.previous(response)
if prev_response:
    print(f"Previous page results: {prev_response.data}")
```

### Filtering Example

```python
# Filter by price range
amadeus.shopping.flight_offers_search.get(
    originLocationCode='SYD',
    destinationLocationCode='BKK',
    departureDate='2024-11-01',
    adults=1,
    maxPrice=1000,
    nonStop=True,
    travelClass='BUSINESS'
)

# Filter hotels by amenities
amadeus.shopping.hotel_offers_search.get(
    hotelIds='RTPAR001',
    adults=2,
    checkInDate='2024-11-10',
    checkOutDate='2024-11-15',
    roomQuantity=1,
    filters={'amenities': ['WIFI', 'PARKING']}
)
```

---

## Summary

The Amadeus Developer API provides comprehensive travel services through:

✅ **40+ API Endpoints** covering all travel needs  
✅ **Python SDK** for easy integration  
✅ **OAuth2 Authentication** for secure access  
✅ **Rich Data Models** for flights, hotels, activities, transfers  
✅ **Predictive Analytics** for delays, pricing, demand  
✅ **Full Error Handling** and pagination support  
✅ **Test & Production** environments  

**Next Steps:**
1. Register at https://developers.amadeus.com
2. Create an application and get credentials
3. Use the Python SDK to integrate travel APIs
4. Test with test environment credentials
5. Move to production when ready

**Official Resources:**
- Python SDK: https://github.com/amadeus4dev/amadeus-python
- API Documentation: https://developers.amadeus.com/
- OpenAPI Specs: https://github.com/amadeus4dev/amadeus-open-api-specification

