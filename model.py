from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
db = SQLAlchemy()


# Replace this with your code!
class User(db.Model):
    """A user."""

    __tablename__ = 'users'

    user_id = db.Column(db.Integer,
                        autoincrement=True,
                        primary_key=True)
    email = db.Column(db.String(50), unique=True,
                        nullable=False)
    f_name = db.Column(db.String(50), nullable=False)
    l_name = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(30),nullable=False)

    # ratings = a list of Rating objects

    def __repr__(self):
        return f'<User user_id={self.user_id} email={self.email}>'

"""class Movie(db.Model):
    

    __tablename__ = 'movies'

    movie_id = db.Column(db.Integer,
                        autoincrement=True,
                        primary_key=True)    
    title = db.Column(db.String)
    overview = db.Column(db.Text)
    release_date = db.Column(db.DateTime)
    poster_path = db.Column(db.String)

    # ratings = a list of Rating objects

    def __repr__(self):
        return f'<Movie movie_id{self.movie_id} title={self.title}>' """
    
class Stock(db.Model):
    __tablename__ = 'stocks'

    stock_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    ticker = db.Column(db.Text)
    exchange = db.Column(db.String)
    assetType = db.Column(db.String)
    priceCurrency = db.Column(db.String)
    startDate = db.Column(db.DateTime, nullable=True)
    endDate = db.Column(db.DateTime, nullable=True)

    def __repr__(self):
        return f'<Stock stock_id{self.stock_id} ticker={self.ticker} exchange={self.exchange}>'
    


'''class Rating(db.Model):
    """A rating."""

    __tablename__ = 'ratings'

    rating_id = db.Column(db.Integer,
                        autoincrement=True,
                        primary_key=True) 
    score = db.Column(db.Integer)
    movie_id = db.Column(db.Integer,
                        db.ForeignKey('movies.movie_id'))
    user_id = db.Column(db.Integer,
                        db.ForeignKey('users.user_id'))
    movie = db.relationship('Movie', backref='ratings')
    user = db.relationship('User', backref='ratings')
    def __repr__(self):
        return f'<Rating rating_id{self.rating_id} title={self.score}>' '''

class Favorites(db.Model):

    __tablename__ = 'favorites'

    favorite_id = db.Column(db.Integer,
                        autoincrement=True,
                        primary_key=True)
    stock_id = db.Column(db.Integer,
                        db.ForeignKey('stocks.stock_id'))
    user_id = db.Column(db.Integer,
                        db.ForeignKey('users.user_id'))

    stock = db.relationship('Stock', backref='favorites')
    user = db.relationship('User', backref='favorites')
    def __repr__(self):
        return f'<Favorite favorite_id{self.favorite_id} ticker={self.user_id}>'

def connect_to_db(flask_app, db_uri='postgresql:///stockanalysis', echo=True):
    flask_app.config['SQLALCHEMY_DATABASE_URI'] = db_uri
    flask_app.config['SQLALCHEMY_ECHO'] = echo
    flask_app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.app = flask_app
    db.init_app(flask_app)

    print('Connected to the db!')


if __name__ == '__main__':
    from server import app
    # Call connect_to_db(app, echo=False) if your program output gets
    # too annoying; this will tell SQLAlchemy not to print out every
    # query it executes.

    connect_to_db(app)