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
        <h1 class="headings">    Welcome {props.userid.name} </h1>
        <ReactBootstrap.Button variant="secondary" size="sm" onClick={handleLogout}>
          Logout
          </ReactBootstrap.Button>

        </React.Fragment>

  }
  

  function Homepage() {
    const [userid, setUserid] =  React.useState({});
    React.useEffect(() => {
        fetch('/api/whoami').
        then((response) => response.json()).
        then((response) => setUserid(response));
    }, [])
    return (
        <React.Fragment>
        <Greeting userid={userid}></Greeting>
        <SearchStocks userid={userid}></SearchStocks>
        <div id='topContainer' hidden='true'>
        <p><button id='backButton' class='btn btn-default btn-sm' type="submit">back</button></p>
        <div class="btn-group" role="group" aria-label="...">
          <button type="button" id='2weeks' class="btn btn-link">2 Weeks</button>
          <button type="button" id='4weeks' class="btn btn-link">4 weeks</button>
          <button type="button" id='3months' class="btn btn-link">3 months</button>
          <button type="button" id='6months' class="btn btn-link">6 months</button>
          <button type="button" id='1year' class="btn btn-link">1 year</button>
        </div>
        <div id='defaultChart'></div>
        </div>
        
        <FavListStocks userid={userid}></FavListStocks>
       
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
    const [stockList, setStockList] =  React.useState([]);

    function handleChange(event){
        setKeyword(event.target.value)
    }

      function handleSearch(){
        const path='/api/search?keyword='.concat(keyword).concat('&user_id=').concat(props.userid.email)
        fetch(path).
        then((response) => response.json()).
        then((response) => setStockList(response));
      }
    return (
        <React.Fragment>
             <ReactBootstrap.InputGroup className="mb-3">
              <ReactBootstrap.FormControl onChange={handleChange}
                placeholder="Search stocks here"
                aria-label="Search stocks here"
                aria-describedby="basic-addon2"
              />
              <ReactBootstrap.InputGroup.Append>
                <ReactBootstrap.Button variant="outline-primary" onClick={handleSearch}>Search</ReactBootstrap.Button>
              </ReactBootstrap.InputGroup.Append>
            </ReactBootstrap.InputGroup>

              
              <SearchResults userid={props.userid} results={stockList}></SearchResults>

        </React.Fragment>
    );
  }
  
  function FavListStocks(props) { 
    if (typeof props.userid.email === "undefined"){
      return (<React.Fragment></React.Fragment>)
    }
    const [stockList, setStockList] =  React.useState([]);
    const [details, setDetails] =  React.useState({}); 
    let showList = true;
    function handleDisplay(){
      showList = true;
      setDetails({});
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
            then((response) => setStockList(response.items));
        }, [])
        const items = []
        for (const [index, value] of stockList.entries()) {
          items.push(
            <tr>
            <td>{index+1}</td>
            <td><button type="button" class="btn btn-link" onClick={ () => handleGetData(value.ticker) }>{value.ticker}</button></td>
            <td>{value.exchange}</td>
            <td>{value.currency}</td>
            <td>{value.high}</td>
            <td>{value.low}</td>
            <td>{value.opening_price}</td>
            <td>{value.closing_price}</td>
          </tr>
          )
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
      if(showList){
        if(stockList.length > 0){
            finalDiplay = <div><h5>Stocks in your watchlist</h5>
            <ReactBootstrap.Table striped bordered hover size="sm">
          <thead> 
            <tr>
              <th>#</th>
              <th>Ticker</th>
              <th>Exchange</th>
              <th>Currency</th>
              <th>High</th>
              <th>Low</th>
              <th>Opening price</th>
              <th>Closing price</th>
            </tr>
          </thead>
          <tbody>
            {items}
          </tbody>
        </ReactBootstrap.Table></div>}
      }
     else{
       var topContainer = document.getElementById('topContainer')
       topContainer.hidden = false;
      var trace1 = {
        x:  details['price_chart']['date_list'],
        y: details['price_chart']['price_list'],
        type: 'scatter'
      };
      
     
      
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
                      <button type="button" class="btn btn-link" onClick={ () => handleDisplay() }>Back</button>
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
  