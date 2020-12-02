  function Greeting(props) {
    function handleLogout(){
          fetch('/logout', {
          method: 'POST',
          headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        
      })
      .then((response) => window.location.href = response.url);
    }
    
  
        return <React.Fragment>
          <nav class="blue-color navbar navbar-expand-md navbar-dark fixed-top">
            <div class="navbar-collapse collapse w-100 order-1 order-md-0 dual-collapse2">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item active">
                        <h5><a class="nav-link white-color gfont" href="#">Stock Tracker</a></h5>
                    </li>
                </ul>
            <ul class="nav navbar-nav">
                <li class="nav-item dropdown">
                <a class="nav-link  dropdown-toggle white-color" href="#" data-toggle="dropdown">
                  <i class="fa fa-fw fa-user"></i> {props.userid.name}
                </a>
                  <ul class="dropdown-menu fullcontainer">
                    <li class='fullcontainer'>            
                      <a href='#' class='fullcontainer dropdown-item' variant="secondary" size="sm" onClick={handleLogout}>
                        <i class="fas fa-sign-out-alt"></i>
                          Logout
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
        </nav>
        </React.Fragment>

  }
  

  function Homepage() {
    const [userid, setUserid] =  React.useState({});
    
    const [showFavList, setShowFavList] = React.useState(true);
    React.useEffect(() => {
        fetch('/api/whoami').
        then((response) => response.json()).
        then((response) => setUserid(response));
    }, [])
    return (
        <React.Fragment>

       
        <Greeting userid={userid}></Greeting>
        <SearchStocks userid={userid} showFavList={showFavList} setShowFavList={setShowFavList}></SearchStocks>
        <div id='topContainer' hidden='true'>
        <button id='backButton' class='btn btn-outline-success btn-sm' type="submit">go back</button>
          <span class='label'><h3 id='heading' class='display4'></h3></span>
          <table><thead><tr><th><h2 id='priceval' class='display4'></h2></th><th></th><th><h4 id='priceChange'></h4></th></tr></thead></table>
          
          
          <div class='container'>
            <div class='row'>
              <div class='col'>
              <h3>Price History</h3>
                <div class="btn-group btn-group-toggle" data-toggle='buttons'>
                  <label id='2weeks' class="btn btn-outline-success margin-right active">
                    <input type="radio" name="options" autocomplete="off" checked /> 2 weeks
                  </label>
                  <label id="4weeks" class="btn btn-outline-success margin-right">
                  <input type="radio" name="options"/> 4 weeks
                  </label>
                  <label id="3months" class="btn btn-outline-success margin-right">
                    <input type="radio" name="options" />3 months
                  </label>
                  <label id="6months" class="btn btn-outline-success margin-right">
                    <input type="radio" name="options" />6 months
                  </label>
                  <label id="1year" class="btn btn-outline-success">
                    <input type="radio" name="options" />1 year
                  </label>
                </div> 
                <div class='border border-primary'>
                  <div id='defaultChart'></div>
                </div>
              </div>
            </div>
            <div class='row row-buffer'>
              <div class='col'>
                <h3>Recommendation Trends</h3>
                <div class='border border-info'>
                  <div id='trendsChart'></div>
                </div>
              </div>
            </div>
          </div>
        </div>  
        {showFavList &&
        <FavListStocks userid={userid}></FavListStocks>}
       
        </React.Fragment>
    );
  }
  function SearchResults(props){
    const elements = props.results
    const email = props.userid.email

    const items = []
    function handleAddAndRemove(symbol,event){
      if(event.target.id == "Follow"){
            event.target.id = "Unfollow"
            event.target.className = 'fas fa-heart fa-lg'
            fetch('/favorites/add', {
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: email,
            ticker: symbol
          })
        });
      } else if(event.target.id == "Unfollow"){
      event.target.id = "Follow"
      event.target.className = 'far fa-heart fa-lg'
      fetch('/favorites/remove', {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        ticker: symbol
      })
    });

    }
  }
    
  
    for (const [index, value] of elements.entries()) {
      items.push(

      
          <tr>
            <td class='bg-white'>
              <b>{value.symbol}</b>  {value.name}
              
              {value.isfavorite?
              <button type="button" class="btn btn-link right-align" onClick={ (e) => handleAddAndRemove(value.symbol,e) }><span style={{color: "red"}}><i id='Unfollow' class="fas fa-heart fa-lg"></i></span></button>:
              <button type="button"  class="btn btn-link right-align" onClick={ (e) => handleAddAndRemove(value.symbol,e) }><span style={{color: "red"}}><i id='Follow' class="far fa-heart fa-lg"></i></span></button>
              }
            </td>
          </tr>
          
       
      )
    }
    return (
        <React.Fragment>
          <div class='container remove-padding'>
            <div class='row'>
              <div class='col'>
                <table class='table'>
                  <tbody>
                {items}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </React.Fragment>
    )
  }

  function SearchStocks(props){
    const [keyword, setKeyword] =  React.useState('');
    const [searchStockList, setSearchStockList] =  React.useState([]);

    function handleChange(event){
        setKeyword(event.target.value)
    }

    function setResults(res){
      setSearchStockList(res)
      props.setShowFavList(false)
    }

    function handleBack(){
      props.setShowFavList(true)
      window.location.reload()
    }

    function handleSearch(){
      const path='/api/search?keyword='.concat(keyword).concat('&user_id=').concat(props.userid.email)
      fetch(path).
      then((response) => response.json()).
      then((response) => setResults(response));
    }
    return (
        <React.Fragment>
            <div id='searchBox'>
              {props.showFavList == false && 
              <ReactBootstrap.Button onClick={ () => handleBack() }> back </ReactBootstrap.Button>}
              <div class='container med-width'>
                <div class='row'>
                  <div class='col'>
                    <div class="input-group">
                      <input type="text" placeholder="Search stocks here" id="" name="" class="form-control" onChange={handleChange} />
                      <div class="input-group-append">
                        <button type="button" class="btn btn-primary" onClick={handleSearch}><i class="fa fa-search mr-1"></i></button>
                      </div>
                    </div>
                    <SearchResults userid={props.userid} results={searchStockList}></SearchResults>
                  </div>
                </div>
              </div>
            </div>
        </React.Fragment>
    );
  }
  
  function FavListStocks(props) { 
    if (typeof props.userid.email === "undefined"){
      return (<React.Fragment></React.Fragment>)
    }
    const [stockList, setStockList] =  React.useState({});
    const [details, setDetails] =  React.useState({}); 
    let showList = true;
    function handleDisplay(){
      showList = true;
      setDetails({});
    }

    function setData(res){
      setDetails(res)
    }
    function remove_from_list(ticker){
        let newList = {...stockList};
        for (const [index, value] of newList['items'].entries()) {
          if(value.ticker == ticker){
            newList['items'].splice(index,index+1)
            break
          }
        }
        setStockList(newList)
      }
      function handleUnfollow(ticker){
            remove_from_list(ticker)
            fetch('/favorites/remove', {
              method: 'POST',
              headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: props.userid.email,
              ticker: ticker
            })
          })
      }
    function handleGetData(ticker){
      const path='/api/details?ticker='.concat(ticker)
      fetch(path).
      then((response) => response.json()).
      then((response) => setData(response));
    }
    
    const path='/favourites/list?user_id='.concat(props.userid.email)
        React.useEffect(() => {
            fetch(path).
            then((response) => response.json()).
            then((response) => setStockList(response));
        },[])
        const items = []
        if(typeof stockList['items'] != "undefined"){
          for (const [index, value] of stockList['items'].entries()) {
            items.push(
              <tr id='showhide'>
              <th scope='row'>{index+1}</th>
              <td><button type="button" class="btn btn-link" onClick={ () => handleGetData(value.ticker) }>{value.ticker}</button></td>
              <td>{value.exchange}</td>
              <td>{value.currency}</td>
              <td>{value.high}</td>
              <td>{value.low}</td>
              <td>{value.opening_price}</td>
              <td>{value.closing_price}</td>
              <td><button type="button" class="action btn btn-link" onClick={ () => handleUnfollow(value.ticker) }><span style={{color: "red"}}><i class="far fa-times-circle fa-lg"></i></span></button></td>
            </tr>
            )
          }
        }
        const news_items = []
        
        if(typeof details['news'] != "undefined"){
          
          for (const [index, value] of details["news"].entries()) {
            news_items.push(
              
              <div class="card flex-row flex-wrap">
                
                <div class="card-header border-0">
                    <img src={value.image} alt=""></img>
                </div>
                <div class="card-block px-2">
                <span class="label label-default">{value.source}</span>
                    <a href={value.url} target="_blank"><p class="card-text">{value.headline}</p></a>
                </div>
                <div class="w-100"></div>
              </div>
            )
          }
          showList = false;
        }else{
          showList = true;
        } 
      let finalDiplay;
      const market_news = []
      const peers = []

      let newsHeading;
      let peer_Heading;
      if(typeof stockList['market_news'] != "undefined"){
        newsHeading = <h3> Latest Market News </h3>  
        for (const [index, value] of stockList['market_news'].entries()) {
          market_news.push(
            
            <div class="card flex-row flex-wrap">
              
              <div class="card-header border-0">
                  <img src={value.image} alt=""></img>
              </div>
              <div class="card-block px-2">
              <span class="label label-default">{value.source}</span>
                  <a href={value.url} target="_blank"><p class="card-text">{value.headline}</p></a>
              </div>
              <div class="w-100"></div>
            </div>
          )
        }
      }
      function handlePeerDetails(value){
        handleGetData(value)
      }
      if(typeof details['peer_list'] != "undefined"){
        peer_Heading = <h3> You may also like </h3>  
        for (const [index, value] of details['peer_list'].entries()) {
          peers.push( 
              <div class="card card-custom bg-bisque">
                <div class="card-body text-center">
                <a type="button" href="#top" class="btn btn-link" onClick={ () => handlePeerDetails(value) }><h4><span class="label label-success">{value}</span></h4></a>
                </div>
              </div>
          )
        }
      }

      let favoritesList = [];
      if(showList){
        if(items.length > 0){
            favoritesList = 
            
                  <div><h3>Your watchlist</h3>
                  <table class="table">
                <thead class="red-color"> 
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Ticker</th>
                    <th scope="col">Exchange</th>
                    <th scope="col">Currency</th>
                    <th scope="col">High</th>
                    <th scope="col">Low</th>
                    <th scope="col">Opening price</th>
                    <th scope="col">Closing price</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  {items}
                </tbody>
              </table>
              </div>
        }
        finalDiplay = <div>
                        <div class='container high-width remove-padding'>
                          <div>
                            <div class='col'>
                              {favoritesList}
                            </div>
                          </div>
                          <div>
                            <div class='col'>
                              {newsHeading}
                              {market_news}
                            </div>
                          </div>
                        </div>
                      </div>

      }
     else{
       var topContainer = document.getElementById('topContainer')
       var searchBox = document.getElementById('searchBox')
       var priceval = document.getElementById('priceval')
       var priceChange = document.getElementById('priceChange')
       searchBox.hidden = true;
       topContainer.hidden = false;
       var headingValue = details['metadata']['tiingo']['name'] + ' (' + details['metadata']['tiingo']['ticker'] +')'

       var heading = document.getElementById('heading')
       heading.innerHTML = headingValue
       priceval.innerText = details['cur_price']
       priceChange.innerText  = ' '+details['price_change'] + '  (' + details['percent_change'] +'%)'
       if(details['price_change'] > 0){
        priceChange.style = 'color:lawngreen'
      }else{
       priceChange.style = 'color:red'
      }

      var trace1 = {
        x:  details['price_chart']['date_list'],
        y: details['price_chart']['price_list'],
        type: 'scatter',
        mode: 'lines+markers',
        line: {
          color: 'green'
        },
      };
      
      var strongBuy = {
        x: details['trends']['period'],
        y: details['trends']['strongBuy'],
        name: 'strongBuy',
        type: 'bar'
      };
      
      var buy = {
        x: details['trends']['period'],
        y: details['trends']['buy'],
        name: 'buy',
        type: 'bar'
      };

      var sell = {
        x: details['trends']['period'],
        y: details['trends']['sell'],
        name: 'sell',
        type: 'bar'
      };

      var strongSell = {
        x: details['trends']['period'],
        y: details['trends']['strongSell'],
        name: 'strongSell',
        type: 'bar'
      };

      var hold = {
        x: details['trends']['period'],
        y: details['trends']['hold'],
        name: 'hold',
        type: 'bar'
      };
      
      var data = [strongBuy,buy,sell,strongSell,hold];
      
      var layout = {barmode: 'stack'};
      
      Plotly.newPlot('trendsChart', data, layout);
      
      var data = [trace1];
      Plotly.newPlot('defaultChart', data)
     
      
      
      var backBtn = document.getElementById('backButton')  
      backBtn.onclick = function(){
        var topContainer = document.getElementById('topContainer')
        var searchBox = document.getElementById('searchBox')
        searchBox.hidden = false;
        topContainer.hidden = true;
        handleDisplay()
      }

      $('#4weeks').on('click', () => {
        $.get('/api/pricechart', { timeline : '4weeks', ticker : details['ticker'] },  (res) => {
          var trace1 = {
            x:  res['price_chart']['date_list'],
            y: res['price_chart']['price_list'],
            type: 'scatter',
            mode: 'lines+markers',
            line: {
              color: 'green'
            },
          };
          var data = [trace1];
          Plotly.newPlot('defaultChart', data) 
        });
      });

      $('#3months').on('click', () => {
        $.get('/api/pricechart', { timeline : '3months', ticker : details['ticker'] },  (res) => {
          var trace1 = {
            x:  res['price_chart']['date_list'],
            y: res['price_chart']['price_list'],
            mode: 'lines+markers',
            line: {
              color: 'green'
            },
            type: 'scatter'
          };
          var data = [trace1];
          Plotly.newPlot('defaultChart', data) 
        });
      });

      $('#6months').on('click', () => {
        $.get('/api/pricechart', { timeline : '6months', ticker : details['ticker'] },  (res) => {
          var trace1 = {
            x:  res['price_chart']['date_list'],
            y: res['price_chart']['price_list'],
            mode: 'lines+markers',
            line: {
              color: 'green'
            },
            type: 'scatter'
          };
          var data = [trace1];
          Plotly.newPlot('defaultChart', data) 
        });
      });

      $('#1year').on('click', () => {
        $.get('/api/pricechart', { timeline : '1year', ticker : details['ticker'] },  (res) => {
          var trace1 = {
            x:  res['price_chart']['date_list'],
            y: res['price_chart']['price_list'],
            mode: 'lines+markers',
            line: {
              color: 'green'
            },
            type: 'scatter'
          };
          var data = [trace1];
          Plotly.newPlot('defaultChart', data) 
        });
      });

      $('#2weeks').on('click', () => {
        
          var data = [trace1];
          Plotly.newPlot('defaultChart', data) 
        });
      

      
     
      finalDiplay = <div>
                      <div class="container">
                        <div class="row">
                          <div class="col">
                            <h3>Stats</h3>
                            <table id='tableid' class="table">
                              <tbody>
                                <tr id='test'>
                                  <th scope="row">Market Cap</th>
                                  <td>{details['metadata']['finnhub']['marketCapitalization']}</td>
                                </tr>
                                <tr>
                                  <th scope="row">IPO</th>
                                  <td>{details['metadata']['finnhub']['ipo']}</td>
                                </tr>
                                <tr>
                                  <th scope="row">Industry</th>
                                  <td>{details['metadata']['finnhub']['finnhubIndustry']}</td>
                                </tr>
                                <tr>
                                  <th scope="row">Exchange</th>
                                  <td>{details['metadata']['finnhub']['exchange']}</td>
                                </tr>
                                <tr>
                                  <th scope="row">Share Outstanding</th>
                                  <td>{details['metadata']['finnhub']['shareOutstanding']}</td>
                                </tr>
                                <tr>
                                  <th scope="row">Country</th>
                                  <td>{details['metadata']['finnhub']['country']}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div class="col">
                            <h3>About</h3>
                            <table class="table">
                              <tbody>
                                <tr>
                                  <th scope="row">Description</th>
                                  <td>{details['metadata']['tiingo']['description']}</td>
                                </tr>
                                <tr>
                                  <th scope="row">Website</th>
                                  <td><a href={details['metadata']['finnhub']['weburl']} target="_blank">{details['metadata']['finnhub']['weburl']}</a></td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      <div class='row'>
                        <div class='col'>
                          {peer_Heading}
                        </div>
                      </div>
                      <div class='high-width'>
                        <div class="row justify-content-center">
                          {peers}
                        </div>
                      </div>
                      <div class='row add-margin'>
                        <div class='col'>
                          <h3> In the news</h3>
                          {news_items}
                        </div>
                      </div>
                      </div>
                    </div>
     }
    return (
      <React.Fragment>
        {finalDiplay}
        
      </React.Fragment>
    );
  }

  ReactDOM.render(<Homepage />, document.getElementById('app'));
  