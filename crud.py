#from model import db, User, Movie, Rating, connect_to_db
from model import db, User, Stock, Favorites, connect_to_db


if __name__ == '__main__':
    from server import app
    connect_to_db(app)

'''def create_user(email, password):
    """Create and return a new user."""

    user = User(email=email, password=password)

    db.session.add(user)
    db.session.commit()
    return user '''

def create_user(email, f_name, l_name, password):

    user = User(email=email, f_name=f_name, l_name=l_name, password=password)

    db.session.add(user)
    db.session.commit()
    return user

#def return_all_users():
   # return User.query.all()

#def get_user_by_id(user_id):
   # return User.query.get(user_id)    

'''def create_movie(title, overview, release_date, poster_path):
    movie = Movie(title=title, overview=overview, release_date=release_date, poster_path=poster_path)
    db.session.add(movie)
    db.session.commit()
    return movie'''
def create_stock(ticker,exchange,assetType,priceCurrency,startDate,endDate):
    stock = Stock(ticker=ticker,exchange=exchange,assetType=assetType,priceCurrency=priceCurrency,
                 startDate=startDate,endDate=endDate)
    db.session.add(stock)
    db.session.commit()
    return stock

#def return_all_stocks():
   # return Stock.query.all()

#def get_stock_by_id(stock_id):
    #return stock.query.get(stock_id)

def query_fav_stocks(email):
    user_obj = get_user_by_email(email)
    fav_list = Favorites.query.filter(Favorites.user_id == user_obj.user_id).all()
    #print(user_obj)
    stocks_list = []
    for item in fav_list:
        stocks_list.append(item.stock)
    return stocks_list
    



'''def create_rating(user, movie, score):
    rating = Rating(user=user, movie=movie, score=score)
    db.session.add(rating)
    db.session.commit()
    return rating'''

def get_user_by_email(email):
    user_obj =  User.query.filter(User.email == email).one()
    return user_obj
    
def get_stock_by_id(ticker):
    stock_obj = Stock.query.filter(Stock.ticker == ticker).one()
    return stock_obj
    

def add_favorite(email,ticker):
    print(ticker)
    user = get_user_by_email(email)
    u_id = user.user_id
    stock = get_stock_by_id(ticker)
    s_id = stock.stock_id
    favorite = Favorites(user_id = u_id, stock_id = s_id)
    db.session.add(favorite)
    db.session.commit()
    print("fav added")
        

def remove_favorite(email,ticker):
    user = get_user_by_email(email)
    u_id = user.user_id
    stock = get_stock_by_id(ticker)
    s_id = stock.stock_id
    f_obj = Favorites.query.filter(Favorites.user_id == u_id, Favorites.stock_id == s_id).delete()
    db.session.commit()
    """if f_obj != None:
        db.session.delete(f_obj)
        db.session.commit()
        print("removed from favorites")
    else:
        print("no such fav to delete")"""
    




