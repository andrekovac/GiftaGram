# GiftaGram

A [meteor.js](https://www.meteor.com/) App which generates gift recommendations for your friends based on their Instagram pics.

Developed during the [app@night](https://www.appatnight.de/) hackathon in Munich.

## How it works

1. First the app fetches images of the Instagram account of a user you choose.
2. Then the [IBM Alchemy Vision API](http://vision.alchemy.ai/) is used to identify objects of interest inside the fetched images with IBM's image recognition AI.
3. The identified objects are then used to generate gift recommendations which suit the instagram user (to be implemented in the future).


## How to run the app

1. Clone the repository

		$ git clone https://github.com/Andruschenko/GiftaGram.git

2. Instagram credentials
	* Generate your instagram access token, for example at [http://instagram.pixelunion.net/](http://instagram.pixelunion.net/)
	* Exchange `YOUR_INSTAGRAM_ACCESS_TOKEN ` with your access token in the following line:

			var access_token = "YOUR_INSTAGRAM_ACCESS_TOKEN";

3. IBM Alchemy credentials
	* Create your API key by following this [Getting Started Guide](http://www.alchemyapi.com/developers/getting-started-guide).
	* Add your API key to the App.

4. Start the meteor server

		$ meteor

5. Open the app by visiting `http://localhost:3000/` in your favorite browser.


## Contributors

* @favll
* Simon Zachau