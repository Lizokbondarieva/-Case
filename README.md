# Currency Rate Notification Service

This service provides an API to get the current USD to UAH exchange rate and allows users to subscribe to daily email notifications with the exchange rate.

## API Endpoints

### GET /usd-to-uah
Returns the current USD to UAH exchange rate.

### POST /subscribe
Subscribes an email to daily exchange rate notifications.

#### Request Body
```json
{
  "email": "user@gmail.com"
}
