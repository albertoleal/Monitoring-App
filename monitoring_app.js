var CookieMonitoringApp = {
	observers : [],

	createCookie:function(day, data){
		document.cookie = dojo.io.cookie.setCookie("MonitoringApp", data, day, "/");
	},

	erase: function() {
		this.createCookie(-1,"");
	},

	_isString:function(str){
		if (typeof str !== 'string') {
			throw {
				name: 'TypeError',
				message: 'Data must be a string'
			}
		}
	},

	_createDataFromCookie:function(cookieData){
		var data = "";
		var count = 0;
		for (var process in cookieData){
			data += (count > 0 ? "&" : "");
			data += process +"="+ cookieData[process];
			count++;
		}
		return data;
	},

	addStartTime:function(objIn){       
		var cookieData = dojo.io.cookie.getObjectCookie("MonitoringApp");           
		var newData = "";   

		if (cookieData) {
			newData += this._createDataFromCookie(cookieData);
			newData += "&"+ objIn.processName +"="+ objIn.startTime;               
			this.erase();
		}else if(objIn.processName && objIn.startTime){
			newData = objIn.processName+"="+objIn.startTime;
		}           

		try{               
			this._isString(newData);
			this.createCookie(7, newData);
		}catch(e){
			alert("ERROR:" + e.name +" => "+ e.message);
		}
	},

	addEndTime:function(objIn){
		var newData = "";
		var cookieData = dojo.io.cookie.getObjectCookie("MonitoringApp");
		if ((cookieData) && (cookieData[objIn.processName])) {
			this._notify(cookieData[objIn.processName], objIn.endTime, objIn.processName);
			delete cookieData[objIn.processName];
			
			newData += this._createDataFromCookie(cookieData);

			try{               
				this._isString(newData);
				this.createCookie(7, newData);               
			}catch(e){
				alert("ERROR:" + e.name +" => "+ e.message);
			}                       			
		}       
	},

	addObserver:function(obj) {
		this.observers.push(obj);
	},

	_notify:function(startTime, endTime, processName) {
		for(i=0; i<this.observers.length; i++) {   
			var TimeStamp = endTime - startTime;
			if (startTime && endTime && processName && TimeStamp>0) {
				if(this.observers[i].update) {
					this.observers[i].update(startTime, endTime, processName);
				}
			}
		}
	}

}

var observer = {   
	update: function(startTime, endTime, processName) {
		//...		
	}
}     
CookieMonitoringApp.addObserver(observer);   