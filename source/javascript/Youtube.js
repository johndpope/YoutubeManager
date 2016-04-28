var scopes = 'https://www.googleapis.com/auth/youtube.readonly';
var apiKey = require('config').apiKey;
var oAuthID = require('config').oAuthID;



var apiOnLoad = function(){
	gapi.client.setApiKey(apiKey);
	gapi.client.load('youtube', 'v3').then(function() {
		console.log('Youtube api loaded'); 
		checkAuth();
		require("Youtube").init();
	});
};

var mock = function(){
	gapi.client.setApiKey(apiKey);
	gapi.client.load('youtube', 'v3').then(function(){
		require("Youtube").mock();
	});
}

function checkAuth() {
  gapi.auth.authorize({client_id: oAuthID, scope: scopes, immediate: true}, handleAuthResult);
}

function handleAuthResult( authResult , callBack ) {
	if (authResult && !authResult.error) {
		require("Youtube").loadRecommendations().then(function(){
			require("Youtube").authorized = true;
			if(callBack){
				callBack();
			}
		});
	} else {
		require("Youtube").authorized = false;
	}
}

define("Youtube",
        ['https://apis.google.com/js/client.js?onload=apiOnLoad', 'jquery' , 'structure/Channel' , 'structure/Video'],function(t , $ , Channel , Video) {
			var Youtube = {
				subscriptions: {}, //channels by Id
				subscriptionsVideos: [], //videos by uploadDate
				recommendations: [], //recommendations for the logged User
				topList: function(regionCode , videoCategory){
					var request = gapi.client.youtube.videos.list({
						part: 'snippet',
						maxResults: 50,
						chart: 'mostPopular',
						regionCode: regionCode,
						videoCategoryId: videoCategory
					})
					var promise = new Promise(function( resolve , reject ){
						var videos = [];
						request.then(function(response){
							var k;
							for(k in response.result.items){
								var video = new Video()
								video = new Video( response.result.items[k].id , response.result.items[k].snippet.title , response.result.items[k].snippet.description , new Date(response.result.items[k].snippet.publishedAt) , response.result.items[k].snippet.thumbnails.default.url , response.result.items[k].snippet.channelTitle , response.result.items[k].snippet.channelId);
								videos.push(video);
							}
							resolve(videos);
						})
					});
					return promise;
					
				},
				categories: function(regionCode){
					var request = gapi.client.youtube.videoCategories.list({
						part: 'snippet',
						regionCode: regionCode
					});
					var promise = new Promise(function(resolve, reject){
						var categories = [{id: 0 , text: 'General' }];
						request.then(function(response){
							var k;
							for(k in response.result.items){
								if(response.result.items[k].snippet.assignable){
									var category = {
										id: response.result.items[k].id,
										text: response.result.items[k].snippet.title
									}
									categories.push(category);
								}
							}
							resolve(categories);
						});
					});
					return promise;
				},
				search: function search(text) {
					var q = text
					var request = gapi.client.youtube.search.list({
						q: q,
						part: 'snippet, id',
						maxResults: 50,
						type: 'video'
					});
					var promise = new Promise(function( resolve , reject){
						request.then(function(response){
							var videos = response.result.items;
							var newVideos = [];
							var video;
							for(var v in videos){
								if(videos[v].id.kind == 'youtube#video'){
									video = new Video( videos[v].id.videoId , videos[v].snippet.title , videos[v].snippet.description , new Date(videos[v].snippet.publishedAt) , videos[v].snippet.thumbnails.default.url , videos[v].snippet.channelTitle , videos[v].snippet.channelId);
									newVideos.push(video);
								}
							}
							resolve(newVideos);
						},function(response){
							console.log("Erro na pesquisa");
							console.log(response);
							resolve([]);
						});
					})
					return promise;
				},
				createPlaylist: function(title, description){
					var request = gapi.client.youtube.playlists.insert({
						part: 'snippet,status',
						resource: {
							snippet: {
								title: title,
								description: description
							},
							status: {
								privacyStatus: 'private'
							}
						}
					});
					return request;
				},
				/*
					Returns a Promise -> then a Object 
						channels : Object with attributes the channels Ids
						nextPageToken : Token for the next page of subscriptions
						erro: response em caso de erro
				*/
				subscriptionsList: function(channelId, pageToken){
					var request = gapi.client.youtube.subscriptions.list({
						part: 'snippet',
						channelId: channelId,
						maxResults: 50,
						pageToken: pageToken
					});
					var promise = new Promise(function(resolve, reject){
						var channels = {};
						request.then(function(response){
							var k;
							for(k in response.result.items){
								var channel = new Channel ( response.result.items[k].snippet.resourceId.channelId , response.result.items[k].snippet.title , response.result.items[k].snippet.thumbnails.default.url , response.result.items[k].snippet.resourceId.channelId.slice(2) , [] );
								channel.uploadId = "UU".concat(channel.uploadId);
								channels[channel.id] = channel;
							}

							resolve({channels : channels , nextPageToken : response.result.nextPageToken });
						},function(response){
							console.log("erro ao carregar os canais");
							console.log(response);
							resolve({channels : channels , erro : response });
						})
					})
					return promise;
				},
				/*
					Returns a Promise -> then a Object
						videos : Array of videos max 50 of the given playlist
						nextPageToken : Token for the next videos
						total : total of videos in the playlist
						erro: response em caso de erro
				*/
				playlistItems: function(playlistId, pageToken){
					var request = gapi.client.youtube.playlistItems.list({
						part: 'snippet',
						playlistId: playlistId,
						maxResults: 50,
						pageToken: pageToken
					});
					var promise = new Promise(function(resolve, reject){
						var videos = [];
						request.then(function(response){
							var y;
							for(y in response.result.items){
								var video =  new Video( response.result.items[y].snippet.resourceId.videoId , response.result.items[y].snippet.title , response.result.items[y].snippet.description , new Date(response.result.items[y].snippet.publishedAt ) , response.result.items[y].snippet.thumbnails.default.url , response.result.items[y].snippet.channelTitle , response.result.items[y].snippet.channelId );
								videos.push(video)
							}
							resolve( { videos : videos , nextPageToken : response.result.nextPageToken , total : response.result.pageInfo.totalResults } );
						},function(response){
							console.log("Erro na chamada de carregar videos da playlist fornecida");
							console.log(response);
							resolve( {videos : videos , erro: response});
						})
					})
					return promise;
				},
				loadFullPlaylist: function(playlistId){
					var self = this;
					var initialLoad = this.playlistItems(playlistId);
					var videos = [];
					var repeat = function(response){
						var promise = new Promise(function(resolve, reject){
							videos = videos.concat(response.videos);
							if(response.nextPageToken){
								self.playlistItems(playlistId, response.nextPageToken).then(function(response){
									repeat(response).then(function(){
										resolve();
									});;
								});
							}else{
								resolve()
							}
						});
						return promise;
					}
					Youtube.Playlist = new Promise(function(resolve, reject){
						initialLoad.then(function(response){
							repeat(response).then(function(){
								resolve(videos);
							});
						});
					});
					return initialLoad;
				},
				loadRecommendations: function(pageToken){
					var request = gapi.client.youtube.activities.list({
						part: 'snippet , contentDetails',
            			home: true,
						maxResults: 50,
						pageToken : pageToken
					});
					var videos = [];
					var promise = new Promise(function( resolve , reject){
						request.then(function(response){
							var k;
							for(k in response.result.items){
								if(response.result.items[k].snippet.type == "recommendation"){
									var video = new Video( response.result.items[k].contentDetails.recommendation.resourceId.videoId , response.result.items[k].snippet.title , response.result.items[k].snippet.description , new Date(response.result.items[k].snippet.publishedAt ) , response.result.items[k].snippet.thumbnails.default.url , response.result.items[k].snippet.channelTitle , response.result.items[k].snippet.channelId );
									videos.push(video);
									if(response.result.items[k].contentDetails.recommendation.reason != "videoWatched"){
										console.log(response);
									}
								}
								if(response.result.items[k].snippet.type == "upload"){
									var video = new Video( response.result.items[k].contentDetails.upload.videoId , response.result.items[k].snippet.title , response.result.items[k].snippet.description , new Date(response.result.items[k].snippet.publishedAt ) , response.result.items[k].snippet.thumbnails.default.url , response.result.items[k].snippet.channelTitle , response.result.items[k].snippet.channelId );
									videos.push(video);
								}
							}
							if(response.result.nextPageToken && videos.length <= 32){
								Youtube.loadRecommendations(response.result.nextPageToken).then(function(results){
									videos = videos.concat(results);
									resolve(videos)
								});
							}else{
								resolve(videos);
							}
						},function(response){
							console.log("Erro nas recomendações");
							console.log(response);
							resolve(videos);
						})
					});
					promise.then(function(videos){
						Youtube.recommendations = videos;
					});
					return promise;
				},
				authorize : function(callBack){
					var handle = function( authResult ){
						handleAuthResult( authResult , callBack );
					};
					gapi.auth.authorize({client_id: oAuthID, scope: scopes, immediate: false}, handle );
				},
				loadExtra: function(){
					var request = $.get("http://localhost:8082/youtubeExtra");
					var promise = new Promise(function(resolve, reject){
						request.done(function(data){
							var k;
							var requests = [];
							for(k in data.subscriptions){
								var series = data.subscriptions[k].series;
								var playlistId = k.slice(2);
								playlistId = "UU".concat(playlistId);
								var uploadRequest = Youtube.playlistItems(playlistId);
								uploadRequest.then(function(response){
									var y;
									var videos = response.videos.slice(0, 16); //take only 15 videos
									for(y in videos){
										if(series.some(function(title){ return videos[y].title.indexOf(title) != -1 }) ){
											Youtube.subscriptionsVideos.push(videos[y]);
										}
									}
								});
								requests.push(uploadRequest);
							}
							Promise.all(requests).then(function(){
								console.log("Séries carregadas");
								//console.log(Youtube.subscriptionsVideos);
								resolve();
							})
						})
						request.fail(function(response){
							console.log("Não foi possível carregar Séries");
							console.log(response);
							resolve();
						})
					});
					return promise;
				},
				init: function(){
					var subscriptionsListLoaded = new Promise(function(resolve, reject){
						var extra = Youtube.loadExtra();
						var channels = [extra];
						var addSubscriptions = function(pageToken){
							var request = Youtube.subscriptionsList('UC8Msirgsqr-iDIzcqLQHgmw', pageToken);
							request.then(function(response){
								var k;
								for(k in response.channels){
									var channelAdded = addChannel(response.channels[k] , 0);
									channels.push(channelAdded);
								}
								if(response.nextPageToken){
									addSubscriptions(response.nextPageToken);
								}else{
									Promise.all(channels).then(function(){
									console.log('todos canais carregados');
										resolve();
									}).catch(function(){
										console.log('Erro ao carregar algum canal após 3 tentativas');
										reject();
									})
								}
							});
						};
						var addChannel = function(channel , trys){
							Youtube.subscriptions[channel.id] = channel;
							var videoRequest = Youtube.playlistItems(channel.uploadId);
							videoRequest.then((function(response){
								var y;
								var videos = response.videos.slice(0, 16) //take only 15 videos
								for(y in videos){
									Youtube.subscriptions[videos[y].authorId].videos.push(videos[y]);
								}
							}),
								(function(response){
									console.log('Erro ao carregar videos');
									console.log(response);
									if(trys < 3){
										trys = trys + 1;
										addChannel(channel, trys);
									}
								})
							);
							return videoRequest;
						};
						addSubscriptions();
					});
					subscriptionsListLoaded.then(function(result){
						var z;
						var videos = Youtube.subscriptionsVideos;
						for(z in Youtube.subscriptions){
							var check1MonthOld = function(value){
								return new Date() - value.uploadDate <= 2592000000;
							}
							videos = videos.concat(Youtube.subscriptions[z].videos.filter(check1MonthOld));
						}
						videos = videos.sort(function(a,b){
							return (a.uploadDate - b.uploadDate)*(-1);
						});
						Youtube.subscriptionsVideos = videos;
						finishLoading();
					});
					subscriptionsListLoaded.catch(function(reason){
						console.log(reason);
						errorLoading();
					});
				}
			};
			var finishLoading;
			var errorLoading;
			Youtube.loading = new Promise(function(resolve, reject){
					finishLoading = resolve;
					errorLoading = reject;
				})

			Youtube.mock = function(){
				Youtube.subscriptionsVideos = JSON.parse('[{"id":"EoVEQireZJM","title":"Aprendendo a andar de patins #SouLuna | Gabbie Fadel","description":"","uploadDate":"2016-03-14T18:00:00.000Z","thumnail":"https://i.ytimg.com/vi/EoVEQireZJM/default.jpg","author":"Gabbie Fadel","authorId":"UCS9K27KW782vvAwTHJpVePQ"},{"id":"TLFfYHUb9Ps","title":"Dangerous Woman - Ariana Grande (Rock Cover Music Video by TeraBrite)","description":"","uploadDate":"2016-03-14T17:15:35.000Z","thumnail":"https://i.ytimg.com/vi/TLFfYHUb9Ps/default.jpg","author":"TeraBrite","authorId":"UCvq0BbsWrF0OP4q_q2X1M3w"},{"id":"12mq4jNDKZQ","title":"Calculated Dong","description":"","uploadDate":"2016-03-14T16:32:41.000Z","thumnail":"https://i.ytimg.com/vi/12mq4jNDKZQ/default.jpg","author":"AdmiralBulldog","authorId":"UCk8ZIMJxSO9-pUg7xyrnaFQ"},{"id":"7XsD4Aqpt4k","title":"Entrevista com elenco de Convergente em L.A.","description":"","uploadDate":"2016-03-14T16:28:39.000Z","thumnail":"https://i.ytimg.com/vi/7XsD4Aqpt4k/default.jpg","author":"MariMoon","authorId":"UC5AoWngtF3WrL3dDCy6JCAA"},{"id":"18_6kLLKoEc","title":"Why You Should Write Down Your Goals","description":"","uploadDate":"2016-03-14T16:00:00.000Z","thumnail":"https://i.ytimg.com/vi/18_6kLLKoEc/default.jpg","author":"Tom Scott","authorId":"UCBa659QWEk1AI4Tg--mrJ2A"},{"id":"ySwHlZEyr_I","title":"Pangu Jailbreak Tool 1.3 for iOS 9.1 - What this means for you","description":"","uploadDate":"2016-03-14T15:47:36.000Z","thumnail":"https://i.ytimg.com/vi/ySwHlZEyr_I/default.jpg","author":"myjailbreakmovies","authorId":"UCF9-JngqznvAsiF2yZbeY8g"},{"id":"SrZbXf0QMFI","title":"Master Chief Doesnt Want to Die","description":"","uploadDate":"2016-03-14T14:00:30.000Z","thumnail":"https://i.ytimg.com/vi/SrZbXf0QMFI/default.jpg","author":"CorridorDigital","authorId":"UCsn6cjffsvyOZCZxvGoJxGg"},{"id":"Jly_j79roXY","title":"FACEBULLYING #100 - Emily, a esposa de Maurício Meirelles (São José do Rio Preto - SP)","description":"","uploadDate":"2016-03-14T14:00:15.000Z","thumnail":"https://i.ytimg.com/vi/Jly_j79roXY/default.jpg","author":"Maurício Meirelles","authorId":"UCxcDCeShqZWIUQuEo2iJSVA"},{"id":"LG9NqQd1bNA","title":"ARTISTA PELADONA NO MUSEU","description":"","uploadDate":"2016-03-14T14:00:01.000Z","thumnail":"https://i.ytimg.com/vi/LG9NqQd1bNA/default.jpg","author":"Coronhada","authorId":"UCZ1B11wWqFUVV6udanmqFJA"},{"id":"7fqEroviosk","title":"O BRASIL PAROU! 2 MILHÕES! OBRIGADO!","description":"","uploadDate":"2016-03-14T14:00:00.000Z","thumnail":"https://i.ytimg.com/vi/7fqEroviosk/default.jpg","author":"Rafinha Bastos","authorId":"UCWFsE0cjOc_iyHCYA_pVQ8w"},{"id":"D0v2pMxwq4w","title":"Dojô Responde - Corta pra mim","description":"","uploadDate":"2016-03-14T13:58:22.000Z","thumnail":"https://i.ytimg.com/vi/D0v2pMxwq4w/default.jpg","author":"leninjablog","authorId":"UCH7wS695SVoVt_YlEzPswNA"},{"id":"5mfm8PvKGE8","title":"Dont Starve Together - Guia de Sobrevivência | Nerdplayer 216","description":"","uploadDate":"2016-03-14T13:54:35.000Z","thumnail":"https://i.ytimg.com/vi/5mfm8PvKGE8/default.jpg","author":"Jovem Nerd","authorId":"UCmEClzCBDx-vrt0GuSKBd9g"},{"id":"GYf9m1Ck8u0","title":"Stream your home media files away from home","description":"","uploadDate":"2016-03-14T06:57:22.000Z","thumnail":"https://i.ytimg.com/vi/GYf9m1Ck8u0/default.jpg","author":"LinusTechTips","authorId":"UCXuqSBlHAE6Xw-yeJA0Tunw"},{"id":"zsjZ2r9Ygzw","title":"Last Week Tonight with John Oliver: Encryption (HBO)","description":"","uploadDate":"2016-03-14T06:30:00.000Z","thumnail":"https://i.ytimg.com/vi/zsjZ2r9Ygzw/default.jpg","author":"LastWeekTonight","authorId":"UC3XTzVzaHQEd30rQbuvCtTQ"},{"id":"CyeqUKMeKwA","title":"Live Gaming PC Build! My Wifes New Mini-ITX Computer","description":"","uploadDate":"2016-03-14T03:38:50.000Z","thumnail":"https://i.ytimg.com/vi/CyeqUKMeKwA/default.jpg","author":"Pauls Hardware","authorId":"UCvWWf-LYjaujE50iYai8WgQ"},{"id":"CU3E8PtlTgc","title":"DogBurguer, da esperança!","description":"","uploadDate":"2016-03-14T03:11:53.000Z","thumnail":"https://i.ytimg.com/vi/CU3E8PtlTgc/default.jpg","author":"Rolê Gourmet","authorId":"UCQMDYlEFnk8jwwCADkHHsnQ"},{"id":"gvYvNf1crOQ","title":"Gaming Headsets vs. Headphones As Fast As Possible","description":"","uploadDate":"2016-03-14T01:39:43.000Z","thumnail":"https://i.ytimg.com/vi/gvYvNf1crOQ/default.jpg","author":"Techquickie","authorId":"UC0vBXGSyV14uvJ4hECDOl0Q"},{"id":"EpWmBtAkzrY","title":"3 GIRLS + EMPTY WATERPARK = MORE FUN!","description":"","uploadDate":"2016-03-14T00:52:27.000Z","thumnail":"https://i.ytimg.com/vi/EpWmBtAkzrY/default.jpg","author":"Elly Awesome","authorId":"UC7yWkMOhJ08QFaHMPGTEuxg"},{"id":"2Jiis2oi9oM","title":"Loopcast 112: Android N, Evento da Apple, Criador do E-mail, notícias e mais!","description":"","uploadDate":"2016-03-13T22:45:14.000Z","thumnail":"https://i.ytimg.com/vi/2Jiis2oi9oM/default.jpg","author":"Loop Infinito","authorId":"UCCbD39MVnMsTLGxsHLnOKlg"},{"id":"A4aoOAlP8W4","title":"ALL 130 LEAGUE OF LEGENDS LAUGH IMPRESSIONS","description":"","uploadDate":"2016-03-13T20:00:22.000Z","thumnail":"https://i.ytimg.com/vi/A4aoOAlP8W4/default.jpg","author":"Brizzy Voices","authorId":"UC7lObFRyZgoZcMYHHqxi9lg"},{"id":"QpPnDhMEV-o","title":"YOUTUBERS REACT TO DAMN DANIEL COMPILATION","description":"","uploadDate":"2016-03-13T19:00:00.000Z","thumnail":"https://i.ytimg.com/vi/QpPnDhMEV-o/default.jpg","author":"Fine Brothers Entertainment","authorId":"UC0v-tlzsn0QZwJnkiaUSJVQ"},{"id":"GWwkAFMCR6o","title":"O VERDADEIRO UNBOXING DE CARTEIRA","description":"","uploadDate":"2016-03-13T18:44:38.000Z","thumnail":"https://i.ytimg.com/vi/GWwkAFMCR6o/default.jpg","author":"Castroverso","authorId":"UCymJbnFhls1k11rSB_IvDlg"},{"id":"BIdZWgXzF8c","title":"Dota 2 Rampage Vol. 16","description":"","uploadDate":"2016-03-13T18:02:01.000Z","thumnail":"https://i.ytimg.com/vi/BIdZWgXzF8c/default.jpg","author":"DotaCinema","authorId":"UCNRQ-DWUXf4UVN9L31Y9f3Q"},{"id":"Nkab8BP-hMA","title":"Kitties & Titties - Its Bloopers!","description":"","uploadDate":"2016-03-13T17:00:19.000Z","thumnail":"https://i.ytimg.com/vi/Nkab8BP-hMA/default.jpg","author":"SourceFedNERD","authorId":"UCuCLhzmx0AGnsViXF0Q44tg"},{"id":"ySH_xzKPEzI","title":"QUARTETO FANTÁSTICO (2015) | RAP ZUEIRA","description":"","uploadDate":"2016-03-13T14:02:35.000Z","thumnail":"https://i.ytimg.com/vi/ySH_xzKPEzI/default.jpg","author":"Bruno JVP","authorId":"UCmOaumDII9h3ifUN0pWKLIw"},{"id":"Ew0KWMTfR5I","title":"The Division: uma Nova York do barulho! | ROBOVISION 2000","description":"","uploadDate":"2016-03-13T13:57:41.000Z","thumnail":"https://i.ytimg.com/vi/Ew0KWMTfR5I/default.jpg","author":"Matando Robôs Gigantes","authorId":"UCO_Jxh3pRfrPROu-W83-iqQ"},{"id":"d3hlIbzY3L8","title":"CANTANDO EM COREANO - CATIA FONSECA","description":"","uploadDate":"2016-03-12T22:00:11.000Z","thumnail":"https://i.ytimg.com/vi/d3hlIbzY3L8/default.jpg","author":"Pyong Lee","authorId":"UCy-pRSIMMBsp-AZlV4go3vw"},{"id":"AOAu-YuO8ME","title":"GeForce GTX 1080, Rocket League Hoops, GM buys Cruise","description":"","uploadDate":"2016-03-12T03:14:54.000Z","thumnail":"https://i.ytimg.com/vi/AOAu-YuO8ME/default.jpg","author":"NCIX Tech Tips","authorId":"UCjTCFFq605uuq4YN4VmhkBA"},{"id":"l3OJ3d2EH70","title":"A mente FÁLICA! - BattleField 3","description":"","uploadDate":"2016-03-11T22:37:33.000Z","thumnail":"https://i.ytimg.com/vi/l3OJ3d2EH70/default.jpg","author":"LeNinja Mode","authorId":"UCKYuu2uw6LlliJGSWvvdxAw"},{"id":"nTLA-vsRuCY","title":"MOSS Robot: TrooperTransporter (TT1)","description":"","uploadDate":"2016-03-11T21:52:44.000Z","thumnail":"https://i.ytimg.com/vi/nTLA-vsRuCY/default.jpg","author":"modrobotics","authorId":"UCkW-SE8fy14-LeDoqVZfUOw"},{"id":"TWcfViPdOXY","title":"CANTADAS RUINS 24","description":"","uploadDate":"2016-03-11T20:00:03.000Z","thumnail":"https://i.ytimg.com/vi/TWcfViPdOXY/default.jpg","author":"Castro Brothers","authorId":"UC-PjJT0RVURj_L6D8D3WIww"},{"id":"fRrOVRa1Ot4","title":"$45 GPU vs. Intel HD Graphics - Potato PC Part 2!","description":"","uploadDate":"2016-03-11T18:38:03.000Z","thumnail":"https://i.ytimg.com/vi/fRrOVRa1Ot4/default.jpg","author":"Awesomesauce Network","authorId":"UCftcLVz-jtPXoH3cWUUDwYw"},{"id":"Ij-ALjslHi8","title":"VIMOS O TRAILER - Capitão América: Guerra Civil","description":"","uploadDate":"2016-03-11T17:57:44.000Z","thumnail":"https://i.ytimg.com/vi/Ij-ALjslHi8/default.jpg","author":"Alta Cúpula","authorId":"UC0R084VqRog-WXHzLfVydTg"},{"id":"ur0fATmsVoc","title":"The Limb of the Sun","description":"","uploadDate":"2016-03-11T16:39:23.000Z","thumnail":"https://i.ytimg.com/vi/ur0fATmsVoc/default.jpg","author":"minutephysics","authorId":"UCUHW94eEFW7hkUMVaZz4eDg"},{"id":"OJcStZyrheQ","title":"Mascara - Megan Nicole (Official Lyric Video)","description":"","uploadDate":"2016-03-11T15:12:10.000Z","thumnail":"https://i.ytimg.com/vi/OJcStZyrheQ/default.jpg","author":"megannicolesite","authorId":"UChWmYNTHQpLmJdkScwNrgcA"},{"id":"zTup_LQlsl8","title":"Golf Basketball is AWESOME! | How Ridiculous","description":"","uploadDate":"2016-03-11T08:38:09.000Z","thumnail":"https://i.ytimg.com/vi/zTup_LQlsl8/default.jpg","author":"How Ridiculous","authorId":"UC5f5IV0Bf79YLp_p9nfInRA"},{"id":"qN-zVFJPDVQ","title":"PC NO PC #4 | EXPLOSÕES DE HOLLYWOOD E CARRETA FURACÃO","description":"","uploadDate":"2016-03-11T00:00:00.000Z","thumnail":"https://i.ytimg.com/vi/qN-zVFJPDVQ/default.jpg","author":"maspoxavida","authorId":"UCOtNSG9FI__vHIv3-PCtlUw"},{"id":"TA3IJxKDSx0","title":"¡RITUAL SATÁNICO!","description":"","uploadDate":"2016-03-10T22:02:06.000Z","thumnail":"https://i.ytimg.com/vi/TA3IJxKDSx0/default.jpg","author":"Cauê Moura","authorId":"UCm2CE2YfpmobBmF8ARLPzAw"},{"id":"Z52tUxBTS70","title":"TONTOYS - EP 1 / ENROLADOS E TRETADOS","description":"","uploadDate":"2016-03-10T21:25:47.000Z","thumnail":"https://i.ytimg.com/vi/Z52tUxBTS70/default.jpg","author":"Fábio Rabin","authorId":"UCOZGtLl5E-aUWknhhFVRu2w"},{"id":"ckPo4uYAxmE","title":"DATING RED FLAGS - Lunch Break!","description":"","uploadDate":"2016-03-10T21:09:23.000Z","thumnail":"https://i.ytimg.com/vi/ckPo4uYAxmE/default.jpg","author":"More Wong Fu","authorId":"UCFIPBP94wEfZemSaonc9-0g"},{"id":"WY79Ewy9oNA","title":"MEU DEUS O TRAILER DE CIVIL WAR","description":"","uploadDate":"2016-03-10T19:07:05.000Z","thumnail":"https://i.ytimg.com/vi/WY79Ewy9oNA/default.jpg","author":"izzynobre","authorId":"UCT4jm6o-mUMuo1bKHcHSIfA"},{"id":"6jCk8P_DyFU","title":"DO TEENS KNOW 90s MUSIC? #2 (REACT: Do They Know It?)","description":"","uploadDate":"2016-03-10T18:42:16.000Z","thumnail":"https://i.ytimg.com/vi/6jCk8P_DyFU/default.jpg","author":"REACT","authorId":"UCHEf6T_gVq4tlW5i91ESiWg"},{"id":"VQWCJVSlFT8","title":"Trying to Fit in at College","description":"","uploadDate":"2016-03-10T18:34:05.000Z","thumnail":"https://i.ytimg.com/vi/VQWCJVSlFT8/default.jpg","author":"LAHWF","authorId":"UCQlVOYJyQp64rA12ac0mv6g"},{"id":"7R8qOwcH-CU","title":"PlayerBarbie - UNTIL DAWN - A JÉSSICA SUMIU DE NOVOOOO NÃAAAO!!! - #04","description":"","uploadDate":"2016-03-10T17:00:00.000Z","thumnail":"https://i.ytimg.com/vi/7R8qOwcH-CU/default.jpg","author":"PlayerBarbie","authorId":"UC0a_xEuhsPVAZc9WP6gIbZw"},{"id":"r9r_VwoZvho","title":"Pandemias | Nerdologia 124","description":"","uploadDate":"2016-03-10T14:00:02.000Z","thumnail":"https://i.ytimg.com/vi/r9r_VwoZvho/default.jpg","author":"Nerdologia","authorId":"UClu474HMt895mVxZdlIHXEA"},{"id":"I3D0yizn9Rw","title":"CHOCANDO FERRAMENTAS COM PIPOCA NA REDE","description":"","uploadDate":"2016-03-10T13:00:00.000Z","thumnail":"https://i.ytimg.com/vi/I3D0yizn9Rw/default.jpg","author":"GusHorn Produções","authorId":"UCBGamHI_Q9Vy5sumfr6ADeA"},{"id":"6p2X6gTDjnI","title":"COMO FAZER BISCOITO DE POLVILHO TIPO GLOBO | Ana Maria Brogui #325","description":"","uploadDate":"2016-03-10T12:30:01.000Z","thumnail":"https://i.ytimg.com/vi/6p2X6gTDjnI/default.jpg","author":"Ana Maria Brogui","authorId":"UCh8qpZhEwzejZ55cajXimqQ"},{"id":"V4qxfFPgqdc","title":"Mixed Reality Continuum - Computerphile","description":"","uploadDate":"2016-03-10T12:12:18.000Z","thumnail":"https://i.ytimg.com/vi/V4qxfFPgqdc/default.jpg","author":"Computerphile","authorId":"UC9-y-6csu5WGm29I7JiwpnA"},{"id":"aOhbsEElVXI","title":"IMPROVÁVEL - CENAS IMPROVÁVEIS #92","description":"","uploadDate":"2016-03-10T11:00:00.000Z","thumnail":"https://i.ytimg.com/vi/aOhbsEElVXI/default.jpg","author":"Barbixas","authorId":"UCZbgt7KIEF_755Xm14JpkCQ"},{"id":"v-c5OvcnjcY","title":"Alarm System Prank!!!","description":"","uploadDate":"2016-03-10T02:40:33.000Z","thumnail":"https://i.ytimg.com/vi/v-c5OvcnjcY/default.jpg","author":"ChannelSuperFun","authorId":"UCBZiUUYeLfS5rIj4TQvgSvA"},{"id":"X_XwKlolsG8","title":"Tirar Férias (Ou As 7 Faces do Doutor Taviao)","description":"","uploadDate":"2016-03-10T01:46:00.000Z","thumnail":"https://i.ytimg.com/vi/X_XwKlolsG8/default.jpg","author":"Coisas Que Nunca Vivi (ou evitava viver)","authorId":"UCFxbXNA45JdTWQy_y68z1pw"},{"id":"cSCnPUqxIf8","title":"Why Arent All Cocktails Served in the Same Glass? | Idea Channel | PBS Digital Studios","description":"","uploadDate":"2016-03-09T22:31:14.000Z","thumnail":"https://i.ytimg.com/vi/cSCnPUqxIf8/default.jpg","author":"PBS Idea Channel","authorId":"UC3LqW4ijMoENQ2Wv17ZrFJA"},{"id":"YjaTLFai5tw","title":"THE WAITING ROOM - EPISODE 9","description":"","uploadDate":"2016-03-09T21:54:06.000Z","thumnail":"https://i.ytimg.com/vi/YjaTLFai5tw/default.jpg","author":"batinthesun","authorId":"UCZQPsy92dpejcCJfZDbp__Q"},{"id":"bY6Rs2404Y0","title":"Actor Flies Off the Handle - Behind the Scenes","description":"","uploadDate":"2016-03-09T16:00:01.000Z","thumnail":"https://i.ytimg.com/vi/bY6Rs2404Y0/default.jpg","author":"RocketJump","authorId":"UCDsO-0Yo5zpJk575nKXgMVA"},{"id":"liVTg5025AU","title":"Rabiscando a Vida 9#: MENINOS MALVADOS","description":"","uploadDate":"2016-03-09T15:18:36.000Z","thumnail":"https://i.ytimg.com/vi/liVTg5025AU/default.jpg","author":"Vagazoide","authorId":"UCdfMDp15LibSHgVSFeVnhPQ"},{"id":"cs5HbQVSi-w","title":"NFCM #87 - JOÃO (MMMV)","description":"","uploadDate":"2016-03-09T15:08:34.000Z","thumnail":"https://i.ytimg.com/vi/cs5HbQVSi-w/default.jpg","author":"Jacaré Banguela","authorId":"UCs5JNr8iY_xT3UH0hKcSXog"},{"id":"CcLzo3zoWO0","title":"VLOG - Putting the Sim Rig PC back together","description":"","uploadDate":"2016-03-09T02:14:06.000Z","thumnail":"https://i.ytimg.com/vi/CcLzo3zoWO0/default.jpg","author":"JayzTwoCents","authorId":"UCkWQ0gDrqOCarmUKmppD7GQ"},{"id":"AzTvZwKfSbs","title":"One Punch Man Saves London Super Comic Con 2016 | ワンパンマン","description":"","uploadDate":"2016-03-08T22:23:53.000Z","thumnail":"https://i.ytimg.com/vi/AzTvZwKfSbs/default.jpg","author":"D Piddy","authorId":"UCmJyp7qrztjH8GVCJxoM8xQ"},{"id":"FeAe9h1Wm_g","title":"5inco Minutos - MULHERZINHA?? EU???","description":"","uploadDate":"2016-03-08T15:49:55.000Z","thumnail":"https://i.ytimg.com/vi/FeAe9h1Wm_g/default.jpg","author":"5incominutos","authorId":"UC3RpTX6fEMJ6KBNTTgXJB9w"},{"id":"ceAFBvryDvg","title":"Is it time to throw away your Hard Drive?","description":"","uploadDate":"2016-03-08T15:13:56.000Z","thumnail":"https://i.ytimg.com/vi/ceAFBvryDvg/default.jpg","author":"HardwareCanucks","authorId":"UCTzLRZUgelatKZ4nyIKcAbg"},{"id":"KLaBXMvDVU8","title":"Flying Underwater! - Subwing in 4K","description":"","uploadDate":"2016-03-08T13:00:01.000Z","thumnail":"https://i.ytimg.com/vi/KLaBXMvDVU8/default.jpg","author":"devinsupertramp","authorId":"UCwgURKfUA7e0Z7_qE3TvBFQ"},{"id":"yfeJQUtH9e0","title":"Marvel Civil War Fight @ Big Apple Con","description":"","uploadDate":"2016-03-07T17:00:02.000Z","thumnail":"https://i.ytimg.com/vi/yfeJQUtH9e0/default.jpg","author":"The Super Zeros","authorId":"UCE3cM6f-H0mZlnvQafTqCyQ"},{"id":"GFbQZU1iPSU","title":"Bernie VS Hillary- Battle of the Bands","description":"","uploadDate":"2016-03-07T14:20:21.000Z","thumnail":"https://i.ytimg.com/vi/GFbQZU1iPSU/default.jpg","author":"schmoyoho","authorId":"UCNYrK4tc5i1-eL8TXesH2pg"},{"id":"nQHBAdShgYI","title":"The Trouble with Transporters","description":"","uploadDate":"2016-03-07T12:47:30.000Z","thumnail":"https://i.ytimg.com/vi/nQHBAdShgYI/default.jpg","author":"CGP Grey","authorId":"UC2C_jShtL725hvbm1arSV9w"},{"id":"9KdU8S2t0F8","title":"Diogo Portugal - Agora é Cana!","description":"","uploadDate":"2016-03-05T18:55:02.000Z","thumnail":"https://i.ytimg.com/vi/9KdU8S2t0F8/default.jpg","author":"Diogo Portugal","authorId":"UCdoXcL2QB124DhaXBZgDFvw"},{"id":"zR7STPbXSuk","title":"HOW TO: Ascend The Throne! Feast of Fiction S4 Ep6","description":"","uploadDate":"2016-03-04T17:31:39.000Z","thumnail":"https://i.ytimg.com/vi/zR7STPbXSuk/default.jpg","author":"Feast Of Fiction","authorId":"UCmuK_ntZEGCXOmnfZW_LWnw"},{"id":"s_2mbMMUnWo","title":"Apocalyptica - House of Chains (Kevin Churko Mix) ft. Franky Perez","description":"","uploadDate":"2016-03-03T23:00:07.000Z","thumnail":"https://i.ytimg.com/vi/s_2mbMMUnWo/default.jpg","author":"ApocalypticaVEVO","authorId":"UCnNV1uxIRvXmZxcxUNo3S6g"},{"id":"PI8vQyQWFEY","title":"RISO NERVOSO em Rio Preto/SP","description":"","uploadDate":"2016-03-03T22:49:23.000Z","thumnail":"https://i.ytimg.com/vi/PI8vQyQWFEY/default.jpg","author":"As Olívias","authorId":"UCNdVIxBV6eDz8Cm7pIhvLTw"},{"id":"KQ49NL95ZYE","title":"CBLÔCO - Primeira Etapa (S5 D1)","description":"","uploadDate":"2016-03-02T18:32:48.000Z","thumnail":"https://i.ytimg.com/vi/KQ49NL95ZYE/default.jpg","author":"LoLNinja","authorId":"UC6HgtPsHwpCdqcJih3amKMA"},{"id":"WYsP1PhoAZc","title":"Shuffling Card Trick - Numberphile","description":"","uploadDate":"2016-03-02T16:07:00.000Z","thumnail":"https://i.ytimg.com/vi/WYsP1PhoAZc/default.jpg","author":"Numberphile","authorId":"UCoxcjq-8xIDTYp3uz647V5A"},{"id":"hUEFQ2HMmMM","title":"FUNNY NEWS BLOOPERS FEBRUARY 2016 w/ Sexy Yanet Garcia","description":"","uploadDate":"2016-03-01T01:33:12.000Z","thumnail":"https://i.ytimg.com/vi/hUEFQ2HMmMM/default.jpg","author":"NewsBeFunny","authorId":"UCbKW7smxCcAvvatHJFLlIhw"},{"id":"UxI62zlvT3U","title":"Eric Speed Extrait Spectacle 2015","description":"","uploadDate":"2016-02-26T14:45:26.000Z","thumnail":"https://i.ytimg.com/vi/UxI62zlvT3U/default.jpg","author":"Eric Speed","authorId":"UCzT8DCQ_D854Y_VMvei6QEA"},{"id":"K4vyRvMASPU","title":"What Exactly is the Present?","description":"","uploadDate":"2016-02-23T16:00:01.000Z","thumnail":"https://i.ytimg.com/vi/K4vyRvMASPU/default.jpg","author":"Veritasium","authorId":"UCHnyfMqiRRG1u-2MsSQLbXA"},{"id":"Y1GiAjJN1zI","title":"Summertime Sadness - Lana Del Rey","description":"","uploadDate":"2016-02-21T22:31:32.000Z","thumnail":"https://i.ytimg.com/vi/Y1GiAjJN1zI/default.jpg","author":"Isis Vasconcellos","authorId":"UCBAKDzHHsomwyaliySEF_RA"},{"id":"R6iFyWKmUO0","title":"Phone Prank Challenge 2!","description":"","uploadDate":"2016-02-21T19:02:20.000Z","thumnail":"https://i.ytimg.com/vi/R6iFyWKmUO0/default.jpg","author":"Thomas Sanders","authorId":"UC80Z-cIOdR6upfnrPJ8Q00A"},{"id":"Db5cgAX7tzc","title":"Stuart Edge LIVE ft. Maddie Wilson and Beyond Measure","description":"","uploadDate":"2016-02-19T05:48:09.000Z","thumnail":"https://i.ytimg.com/vi/Db5cgAX7tzc/default.jpg","author":"Stuart Edge","authorId":"UCCvCHN9DaKn8ON5VxDZmyhQ"}]');
				// https://www.youtube.com/watch?v=P9IJtwyM8NA&list=PL8mG-RkN2uTw7PhlnAr4pZZz2QubIbujH //WanShow
				// /list=[^&]+/
				Youtube.loadFullPlaylist('PL8mG-RkN2uTw7PhlnAr4pZZz2QubIbujH').then(function(result){
					//console.log(result.videos);
					Youtube.Playlist.then(function(allVideos){
						//console.log(allVideos);
					})
				});
				
				finishLoading();
			}
			return Youtube;
       }
    );
