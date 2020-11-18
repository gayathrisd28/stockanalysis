from tiingo import TiingoClient
import finnhub
import requests
import os

config = {}

finnhub_key = os.environ['FINNHUB_ACCESS_KEY']
finnhub_client = finnhub.Client(api_key=finnhub_key)

# To reuse the same HTTP Session across API calls (and have better performance), include a session key.
config['session'] = True

# If you don't have your API key as an environment variable,
# pass it in via a configuration dictionary.
tiingo_key = os.environ['TIINGO_ACCESS_KEY']
config['api_key'] = tiingo_key

# Initialize
client = TiingoClient(config)

# Get Ticker
#

def get_ticker_metadata(ticker):
    details = {}
    ticker_metadata = client.get_ticker_metadata(ticker)
    details['tiingo'] = ticker_metadata
    ticker_metadata2 = finnhub_client.company_profile2(symbol=ticker)
    details['finnhub'] = ticker_metadata2
    
    return details


#print(ticker_metadata)

def ticker_price(ticker):
    price_info = client.get_ticker_price(ticker)
    return price_info

def get_price_history_chart(ticker,start_date,end_date):
    return client.get_ticker_price(ticker,frequency='daily', startDate=start_date,
                                      endDate=end_date)

def search_stocks(stock_name):
    requestResponse = requests.get(f"https://ticker-2e1ica8b9.now.sh/keyword/{stock_name}") 
    return requestResponse.json()


# Get latest prices, based on 3+ sources as JSON, sampled weekly
#ticker_price = client.get_ticker_price("GOOGL", frequency="weekly")

# Get historical GOOGL prices from August 2017 as JSON, sampled daily
'''
historical_prices = client.get_ticker_price("GOOGL",
                                            fmt='json',
                                            startDate='2017-08-01',
                                            endDate='2017-08-31',
                                            frequency='daily')'''

# Check what tickers are available, as well as metadata about each ticker
# including supported currency, exchange, and available start/end dates.
#tickers = client.list_stock_tickers()
# news
def get_ticker_news(ticker,start_date,end_date):
    return finnhub_client.company_news(ticker, start_date, end_date)

def get_recommendation_trends(ticker):
    return finnhub_client.recommendation_trends(ticker)

