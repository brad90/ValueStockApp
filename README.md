<h1> Under Valued Stock Application </h1>

<strong><h3> Breif </h3> </strong>

The brief of this project was off the back of a group porject we created during my time at CodeClan. We were to use an external API, iin our case a financial one that would the data, use it in someway and render it to the screen. The group project was relativly succesful but I had always had an idea for an app that went a bit further than the group task.

As someone who does invest, I know of something in the investing world called undervalued stocks. These are stocks that when you evaluate certain stock criteria such as Price to Earning(PE) or Debt to Equity ratio, you can evaluate if the stock is undervalued or not.

<h3> MVP </h3>

The MVP was to use the external API to get information and save it back to a database. I would then use that information to perform calcualtions. These calculations would take a recommended figure for a PE ratio for example and subtract that from what the API was telling me. The closer this value and the rest were closer to 0 then the more undervalued a stock was.


<h3> Challenges </h3>


The main challenge was using an API that was free and thus limited the amount of requests that could be made in a given timeframe. In my case I wanted to ensure that I covered most of the Nasdaq and NYSE stock exchanges. This was 440 companies. Initially this was to use a setTimeout() after each request. This was okay but still led to server request issues. Insteas I opted for a sleep function that paused after each request instead.

The second challenge was publishing the information. Initally it would publish after each request and patch. I created a function that waited untill all requests had been completed then published the full information in one go.


Note:

If you are to download and run this application. The seed file has 440 and will take some time to make all API requests and patch them back to the DB. In a real life and a more advanced project this would not be the case.

<img src="img1" width="350" title="hover text">
