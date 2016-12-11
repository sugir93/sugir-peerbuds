var peerbudsHack = angular.module('peerbudsHack', ['angular-loading-bar', 'ngSanitize']);
/*beging servicesl*/
peerbudsHack.service('getDataFromXMLFIle', ['$http', function(_htp){
    this.getFrom = function(_url, _callBack){
         _htp({
            method  : 'GET',
            url     : _url,
            timeout : 10000,
            params  : {},  // Query Parameters (GET)
            transformResponse : function(data) {
                var x2js = new X2JS(),
                    aftCnv = x2js.xml_str2json(data);
                return aftCnv;
            }
        }).success(function(data, status, headers, config) {
            _callBack(data);
        }).error(function(data, status, headers, config) {
            alert('error while fetching the Badges.xml file');
        });
    };
}])
.service('paginationServices', ['$filter', '$timeout', function(_filter){
	this.init = function(_scope, data){
		_scope.currentPage = 0;
		_scope.pageSize = 10;
		_scope.q = '';
		_scope.getData = function () {
			return _filter('filter')(data, _scope.q)
		};
		_scope.getNumber = function(num) {
				return new Array(num);   
		};
		_scope.changePage = function(page){
			_scope.currentPage = page;
		};
		_scope.numberOfPages=function(){
				return Math.ceil(_scope.getData().length/_scope.pageSize);                
		}
	};
}])
.filter('paginationFilters_startFrom', [function() {
    return function(input, start){
			start = +start; //parse to int
			if(input && input.length)
				return input.slice(start);
		}
}]);
/*end servicesl*/

/*begin app ctrl*/
peerbudsHack.controller('appCtrl', ['$scope', function(_sop) {
    _sop.currentPage = 'home';
    _sop.changePage = function(_pageRef){
        _sop.currentPage = _pageRef;
    };/*end of the change page function*/
}]);
/*end app ctrl*/

/*begin task1 ctrl*/
peerbudsHack.controller('task1Ctrl', ['$scope', 'getDataFromXMLFIle', 'paginationServices', '$rootScope', function(_sop, _dataProvice, _paginate, _root) {
    _paginate.init(_sop, []);
    _sop.Math = window.Math;
    _dataProvice.getFrom('ref/dumplist/Users.xml', function(data){
        _sop.users = data.users.row;
        _dataProvice.getFrom('ref/dumplist/Posts.xml', function(data){
             /*console.log(data.posts.row);*/
            _sop.posts = data.posts.row;
            _paginate.init(_sop, _sop.posts);
            _root.postTypeCount = {};
            _root.postTypeCount.total = _sop.posts.length;
            angular.forEach(_sop.posts, function(_obj){
                if(!_root.postTypeCount[_obj._PostTypeId]){
                    _root.postTypeCount[_obj._PostTypeId] = 1;
                }else{
                    _root.postTypeCount[_obj._PostTypeId] = _root.postTypeCount[_obj._PostTypeId] + 1;
                }
            });
            console.log(_root.postTypeCount);
        });
    });
    _sop.getUserName = function(_curPost){
        angular.forEach(_sop.users, function(_obj, _key){
            if(_obj._Id == _curPost._OwnerUserId){
                _curPost._DisplayName = _obj._DisplayName;
                _curPost._ProfileImageUrl = _obj._ProfileImageUrl;
                return;
            }
        });
    };
    _sop.getTags = function(_curPost){
        _curPost.tags = [];
        if(!_curPost._Tags) return;
        _curPost._Tags.trim();
        _curPost.tags = _curPost._Tags.replace(new RegExp('<', 'g'), '');
        _curPost.tags = _curPost.tags.split('>')
        
    };
    
    _sop.votePost = function(_obj, _upFlag){
        var _myVotes = localStorage.getItem('myVotes');
        if(_myVotes)
            _myVotes = JSON.parse(_myVotes);
        else
            _myVotes = {};
        if(!angular.isUndefined(_myVotes[_obj._Id])){
            if(_myVotes[_obj._Id] == true && _upFlag == true){
                alert('you have already up-voted this post.');
                return;
            }
            if(_myVotes[_obj._Id] == false && _upFlag == false){
                alert('you have already down-voted this post.');
                return;
            }
        }
        if(_upFlag){
            _obj._Score = parseInt(_obj._Score)+1;
            _myVotes[_obj._Id] = true;
        }else{
            _obj._Score = parseInt(_obj._Score)-1;
            _myVotes[_obj._Id] = false;
        }
        localStorage.setItem('myVotes', JSON.stringify(_myVotes));
    }
    /*return;
    _dataProvice.getFrom('ref/dumplist/Posts.xml', function(data){
        console.log(data.posts.row);
        _sop.posts = data.posts.row;
        _paginate.init(_sop, _sop.posts);
        _dataProvice.getFrom('ref/dumplist/Badges.xml', function(data){
            console.log(data);
        });
        _dataProvice.getFrom('ref/dumplist/Comments.xml', function(data){
            console.log(data);
        });
        _dataProvice.getFrom('ref/dumplist/PostHistory.xml', function(data){
            console.log(data);
        });
        _dataProvice.getFrom('ref/dumplist/PostLinks.xml', function(data){
            console.log(data);
        });
        _dataProvice.getFrom('ref/dumplist/Tags.xml', function(data){
            console.log(data);
        });
        _dataProvice.getFrom('ref/dumplist/Users.xml', function(data){
            
        });
        _dataProvice.getFrom('ref/dumplist/Votes.xml', function(data){
            console.log(data);
        });
    });*/
    /*_dataProvice.getFrom('ref/dumplist/Tags.xml', function(data){
            console.log(data);
        });*/
}]);
/*end task1 ctrl*/
/*begin task2 ctrl*/
peerbudsHack.controller('task2Ctrl', ['$scope', '$rootScope', function(_sop, _root) {
    console.log('this is the task2Ctrl loaded.');
    console.log(_root.postTypeCount);
    _sop.settings = _root.postTypeCount;
    setTimeout(function(){
        var paragraphs = document.getElementsByTagName("p");
        for (var i = 0; i < paragraphs.length; i++) {
          var paragraph = paragraphs.item(i);
            if(i == 0){
                paragraph.style.setProperty("color", "white", null);
                  paragraph.style.setProperty("background", "#ef5350", null);
                  paragraph.style.setProperty("height", "70px", null);
                    paragraph.style.setProperty("width", "40px", null);
            }
            if(i == 1){
                paragraph.style.setProperty("color", "white", null);
                  paragraph.style.setProperty("background", "#f44336", null);
                  paragraph.style.setProperty("height", "100px", null);
                    paragraph.style.setProperty("width", "40px", null);
            }
            if(i == 2 || i == 3){
                paragraph.style.setProperty("color", "white", null);
                  paragraph.style.setProperty("background", "#ef9a9a", null);
                  paragraph.style.setProperty("height", "25px", null);
                  paragraph.style.setProperty("width", "40px", null);
            }
          
        }
    }, 1000);
    
}]);
/*end task2 ctrl*/
/*begin task3 ctrl*/
peerbudsHack.controller('task3Ctrl', ['$scope', function(_sop) {
    console.log('this is the task3Ctrl loaded.');
}]);
/*end task3 ctrl*/