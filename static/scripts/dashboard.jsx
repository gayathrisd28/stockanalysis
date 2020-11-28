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
          <nav class="navbar navbar-expand-md navbar-dark bg-dark">
            <div class="navbar-collapse collapse w-100 order-1 order-md-0 dual-collapse2">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item active">
                        <a class="nav-link" href="#">Stock Portfolio</a>
                    </li>
                </ul>
            <ul class="nav navbar-nav">
                <li class="nav-item dropdown">
                <a class="nav-link  dropdown-toggle" href="#" data-toggle="dropdown">
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
          <h2 id='heading' class='display4'></h2>
          <p><button id='backButton' class='btn btn-default btn-sm' type="submit">back</button></p>
          <div class="btn-group" role="group" aria-label="...">
            <button type="button" id='2weeks' class="btn btn-link">2 Weeks</button>
            <button type="button" id='4weeks' class="btn btn-link">4 weeks</button>
            <button type="button" id='3months' class="btn btn-link">3 months</button>
            <button type="button" id='6months' class="btn btn-link">6 months</button>
            <button type="button" id='1year' class="btn btn-link">1 year</button>
          </div>
          <div id='defaultChart'></div>
          <h3>Recommendation Trends</h3>
          <div id='trendsChart'></div>
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
      if(event.target.textContent == "Follow"){
          event.target.textContent = "Unfollow"
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
    }
    else if(event.target.textContent == "Unfollow"){
      event.target.textContent = "Follow"
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
      <ReactBootstrap.Card>
        <ReactBootstrap.Card.Header>
        
          <b>{value.symbol}</b>  {value.name}
          
          {value.isfavorite?
          
          <button class="float-right" onClick={ (e) => handleAddAndRemove(value.symbol,e) }>Unfollow</button>:
            <button class="float-right" onClick={ (e) => handleAddAndRemove(value.symbol,e) }>Follow</button>
          }
          
        </ReactBootstrap.Card.Header>
      </ReactBootstrap.Card>
      )
    }
    return (
        <React.Fragment>
          {items}
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
            {props.showFavList == false && 
            <ReactBootstrap.Button onClick={ () => handleBack() }> Back to dashboard </ReactBootstrap.Button>}
              <div class="search-result-box card-box">
                    <div class="row">
                        <div class="col-md-8 offset-md-2">
                            <div class="pt-3 pb-4">
                                <div class="input-group">
                                    <input type="text" placeholder="Search stocks here" id="" name="" class="form-control" onChange={handleChange} />
                                    <div class="input-group-append">
                                        <button type="button" class="btn waves-effect waves-light btn-custom" onClick={handleSearch}><i class="fa fa-search mr-1"></i></button>
                                    </div>
                                </div>
                                <div class="mt-4 text-center">
                                    <h4></h4></div>
                            </div>
                        </div>
                    </div>
                    </div>
          <SearchResults userid={props.userid} results={searchStockList}></SearchResults>
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
      then((response) => setDetails(response));
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
              <tr>
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
        peer_Heading = <h3> You may also like: </h3>  
        for (const [index, value] of details['peer_list'].entries()) {
          peers.push(
            <ul class="list-group list-group-horizontal">
              <a type="button" href="#top" class="btn btn-link" onClick={ () => handlePeerDetails(value) }>{value}</a>
              
              
            </ul>
          )
        }
      }

      let favoritesList = [];
      if(showList){
        if(items.length > 0){
            favoritesList = <div><h5>Stocks in your watchlist</h5>
            <table class="table">
          <thead class="thead-dark"> 
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
                        {favoritesList}
                        {newsHeading}
                        {market_news}
                      </div>
      }
     else{
       var topContainer = document.getElementById('topContainer')
       topContainer.hidden = false;

       var heading = document.getElementById('heading')
       heading.innerHTML = details['metadata']['tiingo']['name']
      var trace1 = {
        x:  details['price_chart']['date_list'],
        y: details['price_chart']['price_list'],
        type: 'scatter'
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
        topContainer.hidden = true;
        handleDisplay()
      }

      $('#4weeks').on('click', () => {
        $.get('/api/pricechart', { timeline : '4weeks', ticker : details['ticker'] },  (res) => {
          var trace1 = {
            x:  res['price_chart']['date_list'],
            y: res['price_chart']['price_list'],
            type: 'scatter'
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
                          <h3>About</h3>
                          <table class="table">
                            <tbody>
                              <tr>
                                <th scope="row">Description</th>
                                <td>{details['metadata']['tiingo']['description']}</td>
                              </tr>
                              <tr>
                                <th scope="row">Website</th>
                                <td>{details['metadata']['finnhub']['weburl']}</td>
                              </tr>
                            </tbody>
                            </table>
                            {peer_Heading}
                            {peers}
                            {news_items}
                    </div>
      

     }
    return (
      <React.Fragment>
        {finalDiplay}
        
      </React.Fragment>
    );
  }

  ReactDOM.render(<Homepage />, document.getElementById('app'));
  