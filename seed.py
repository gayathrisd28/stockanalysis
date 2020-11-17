import os
import json
from random import choice, randint
from datetime import datetime

import crud
import model
import server

#os.system('dropdb ratings')
os.system('dropdb stocks')
#os.system('createdb ratings')
os.system('createdb stocks')
model.connect_to_db(server.app)
model.db.create_all()

    #with open('data/movies.json') as f:
    #movie_data = json.loads(f.read())
with open('supported_tickers.json') as f:
    stock_data = json.loads(f.read())



"""movies_in_db = []
for movie in movie_data:
    overview = movie['overview']
    title = movie['title']
    poster_path = movie['poster_path']
    date = movie['release_date']
    format = "%Y-%m-%d"
    release_date = datetime.strptime(date, format)
    movie = crud.create_movie(title, overview, release_date, poster_path)
    movies_in_db.append(movie)
    print(movies_in_db)"""
stocks_in_db = []
for stock in stock_data:
    ticker = stock['ticker']
    exchange = stock['exchange']
    assetType = stock['assetType']
    priceCurrency = stock['priceCurrency']
    s_date = stock['startDate']
    if (assetType != 'Stock' or (exchange != 'NYSE' and exchange != 'NASDAQ')):
        continue
    format = "%Y-%m-%d"
    startDate = None
    endDate = None
    if (len(s_date) > 0):
        startDate = datetime.strptime(s_date, format)
    e_date = stock['endDate']
    if (len(e_date) > 0):
        endDate = datetime.strptime(e_date, format)
    
    stock = crud.create_stock(ticker,exchange,assetType,priceCurrency,startDate,endDate)
    stocks_in_db.append(stock)
#print(stocks_in_db)

'''for n in range(10):
    email = f'user{n}@test.com'  # Voila! A unique email!
    password = 'test'
    user = crud.create_user(email, password)

    # TODO: create a user here

    # TODO: create 10 ratings for the user
    random_movie = choice(movies_in_db)
    random_score = randint(0,5)
    crud.create_rating(user, random_movie, random_score)'''
