
from flask import Flask, render_template, url_for, request, flash, session,redirect, jsonify
from model import connect_to_db
import apis
import crud
#import pandas as import pd
#import plotly.express as px
import json
#import plotly
#import plotly.graph_obs as go
from datetime import date, timedelta

from jinja2 import StrictUndefined

app = Flask(__name__)
app.secret_key = "dev"
app.jinja_env.undefined = StrictUndefined



@app.route('/user/register')
def get_name():
    return render_template('user-registration.html')

@app.route('/')
def show_homepage():
    print(session)     
    if session.get('name'):
        print(session['name'])
        return render_template('dashboard.html')
    else:
       return render_template('login.html')

@app.route('/api/plot')
def get_plot_json():
    ticker = request.args.get('ticker')
    ticker_price_history = apis.get_price_history_chart(ticker)
    data = [
        
    ]

@app.route('/api/whoami')
def whoami():
    if 'name' in session:
        return jsonify(session['name'])
    else:
        return redirect(url_for('/'))   

@app.route('/login',methods=["POST"])
def login():
    Email = request.values.get('email')
    password = request.values.get('password')
    user_obj = crud.get_user_by_email(Email)
    if user_obj.email == Email and user_obj.password == password:
        user_dict = {}
        user_dict['name'] = user_obj.f_name 
        user_dict['email'] = user_obj.email
        session['name'] = user_dict
        return  redirect('/')
    else:
        return render_template('login.html')


@app.route('/logout',methods=["POST"])
def logout():
    del session['name']
    session.modified = True
    return redirect(url_for('show_homepage'))


@app.route('/favorites/add',methods=["POST"])
def add_fav():
    data = request.get_json()
    print(data['email'])
    
    email = data['email']
    ticker = data['ticker']
    
    crud.add_favorite(email,ticker)
    return ('',200)

@app.route('/favorites/remove',methods=["POST"])
def rem_fav():
    data = request.get_json()
    email = data['email']
    ticker =  data['ticker']
    crud.remove_favorite(email,ticker)
    return ('',200)


def search(name, stocks):
    return [element for element in stocks if element.ticker == name]

@app.route('/api/search')
def search_stock():
    user_email = request.args.get('user_id')
    fav_stocks = crud.query_fav_stocks(user_email)
    key_word = request.values.get('keyword')
    search_results = apis.search_stocks(key_word)
    for stock in search_results:
        elemList = search(stock['symbol'], fav_stocks)
        if(not elemList):
            stock['isfavorite'] = False
        else:
            stock['isfavorite'] = True
    return jsonify(search_results)

# TODO - get a time range and and show news for that range 
@app.route('/api/details')
def get_stock_details():
    ticker = request.values.get('ticker')
    today = date.today()
    yesterday = today - timedelta(days = 1)
    two_weeks_ago = today - timedelta(days = 14) 
    to = today.strftime("%Y-%m-%d")
    frm = yesterday.strftime("%Y-%m-%d")
    weeks_ago = two_weeks_ago.strftime("%Y-%m-%d")
    details = apis.get_ticker_news(ticker,frm,to)
    details_dict = {}
    details_dict['news'] = details
    metadata = apis.get_ticker_metadata(ticker)
    print(metadata)
    details_dict['metadata'] = metadata
    price_history = apis.get_price_history_chart(ticker,weeks_ago,to)
    date_list = []
    price_list = []
    for item in price_history:
        date_list.append(item['date'])
        price_list.append(item['adjClose'])
    details_dict['price_chart'] = {'date_list' : date_list, 'price_list': price_list}
    details_dict['ticker'] = ticker
    details_dict['trends'] = recommendation_trends(ticker)

    return jsonify(details_dict)


@app.route('/api/pricechart')
def get_price_history_chart():
    timeline = request.args.get('timeline')
    ticker = request.values.get('ticker')
    today = date.today()
    start_date = None
    if timeline == '4weeks':
        start_date = today - timedelta(weeks=4)
    elif timeline == '3months':
        start_date = today - timedelta(weeks=12)
    elif timeline == '6months':
        start_date = today - timedelta(weeks=24)
    elif timeline == '1year':
        start_date = today - timedelta(weeks=48)
    to = today.strftime("%Y-%m-%d")
    frm = start_date.strftime("%Y-%m-%d")
    price_history = apis.get_price_history_chart(ticker,frm,to)
    date_list = []
    price_list = []
    for item in price_history:
        date_list.append(item['date'])
        price_list.append(item['adjClose'])
    price_dict = {}
    price_dict['price_chart'] = {'date_list': date_list, 'price_list': price_list}
    return jsonify(price_dict)


@app.route('/favourites/list')
def get_favourites():
    user_email = request.args.get('user_id')
    fav_stocks = crud.query_fav_stocks(user_email)
    fav_stock_obj = {}
    stock_list = []
    for stock in fav_stocks:
        stock_obj = {}
        stock_obj['ticker'] = stock.ticker
        price_info = apis.ticker_price(stock.ticker)
        stock_obj['closing_price'] = price_info[0]['adjClose']
        stock_obj['opening_price'] = price_info[0]['adjOpen']
        stock_obj['high'] = price_info[0]['high']
        stock_obj['low'] = price_info[0]['low']
        stock_obj['exchange'] = stock.exchange
        stock_obj['currency'] = stock.priceCurrency
        stock_obj['start_date'] = stock.startDate 
        stock_list.append(stock_obj)
    fav_stock_obj['items'] = stock_list
    return jsonify(fav_stock_obj)

@app.route('/adduser', methods=["POST"])
def show_success():
    Email = request.values.get('email')
    Fname  = request.values.get('fname')
    Lname =  request.values.get('lname')
    password = request.values.get('password')
    session['name'] = Email
    crud.create_user(Email, Fname, Lname, password)
    return render_template('login.html')

def recommendation_trends(ticker):
    trends = apis.get_recommendation_trends(ticker)
    date_list = []
    trend_dict = {}
    trend_dict['strongBuy'] = []
    trend_dict['buy'] = []
    trend_dict['sell'] = []
    trend_dict['strongSell'] = []
    trend_dict['hold'] = []
    trend_dict['period'] = []
   

     
    for item in trends:
        date_list.append(item['period'])
        trend_dict['strongBuy'].append(item['strongBuy']) 
        trend_dict['buy'].append(item['buy'])
        trend_dict['sell'].append(item['sell'])
        trend_dict['strongSell'].append(item['strongSell'])
        trend_dict['hold'].append(item['hold'])
    trend_dict['period'] = date_list
    return trend_dict




    







if __name__ == '__main__':
    connect_to_db(app)
    app.run(host='0.0.0.0', debug=True)