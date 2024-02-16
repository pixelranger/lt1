const webSocketsServerPort = 2003;
const httpServerPort = 3003;
const dbConnection = "mongodb://localhost:27017/brand";
const tokens =  {
    "canvas.instructure.com": "7~lyB3g00cdzBkdbfjvyz1EthP4d0w6LFmuAl1cqWzQfxAP7N9RqqyS4qTTwoSGOQJ",
    "canvas.skolkovo.ru": "16266~jWjVwwiqHB1E41gl8fK7R4O96y3hRgUuFeAt7oRizCAJjT6VqJfUWMHl5QzwB8zH",
    "skolkovo.instructure.com": "16266~L0yAB4FST1SZouh1zVPXfih2RQVBAoGkwYO8ruQb2D0FfhKoIGHrLJY50BUJyM9y",
    "skolkovo.test.instructure.com": "16266~L0yAB4FST1SZouh1zVPXfih2RQVBAoGkwYO8ruQb2D0FfhKoIGHrLJY50BUJyM9y",
    "skolkovo.beta.instructure.com": "16266~L0yAB4FST1SZouh1zVPXfih2RQVBAoGkwYO8ruQb2D0FfhKoIGHrLJY50BUJyM9y",
    "key": "56fd05eabfa9920c1299a7a7ff66a82b"
}
module.exports = {
    webSocketsServerPort,
    httpServerPort,
    dbConnection,
    tokens
};