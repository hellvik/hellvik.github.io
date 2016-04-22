/**
*	
*/

	function r2jInfo(kmlEvent,map,prop)
	{
//console.debug('[C] r2jInfo');
		var name=kmlEvent.featureData.name;
		var s=null;
		var i;
		var j;
		var key;
		var lang = (document.documentElement.lang == null || document.documentElement.lang.length == 0)?('en'):(document.documentElement.lang);
		if(name == null){s='NO NAME';}
		else
		{
			var t=kmlEvent.featureData.description;
			if(t != null)
			{
				var q=new r2jRegex('(<div[\\s]+)lang\\="([\\w]+)"(.*?>)');
				if(q.split(t))
				{
					for(i=0;i < q.rA.length;i++)
					{
						if(q.rA[i].length() == 0){}
						else
						if(q.rA[i].get(2).length == 2 && q.rA[i].get(2) != lang)
						{
							s=q.rA[i].get(1) + 'style="display : none;"' + q.rA[i].get(3);
							q.rA[i].set(s);
						}
					}
					t=q.join().trim();
				}
				q=new r2jRegex('\\?\\[([\\w]+)\\]'); // ?[key]
				var h=
				{
					id: kmlEvent.featureData.id, // KmlMouseEvent.KmlFeatureData.id
					name: kmlEvent.featureData.name, // KmlMouseEvent.KmlFeatureData.name
					latitude: kmlEvent.latLng.lat(), // KmlMouseEvent.LatLng.lat()
					longitude: kmlEvent.latLng.lng(), // KmlMouseEvent.LatLng.lng()
					lat: r2jCut(kmlEvent.latLng.lat()), // KmlMouseEvent.LatLng.lat() -- 2 decimals
					lng: r2jCut(kmlEvent.latLng.lng()), // KmlMouseEvent.LatLng.lng() -- 2 decimals
					lang: lang, // document.documentElement.lang
					title: document.title, // document.title
					substitution: false
				};
				if(arguments.length >= 3 && prop != null)
				{
					var sA = Object.keys(prop);
					for(i = 0; i < sA.length ;i++)
					{
						key= sA[i];
						if(key == 'substitution') h.substitution=true;
						else
						if( key.match('^[\\w]+$') && h[ key ] == null && prop[ key ] != null)
						{
							h[ key ] = prop[ key ];
						}
					}
				}
				if( h['header'] != null){ t = h['header'] + t;  }
				if( h['footer'] != null){ t += h['footer'];  }
				j = (h.substitution)?(1):(0);
				while(q.split(t))
				{
					for(i = 0;i < q.rA.length; i++)
					{
						if(q.rA[i].length() == 0){}
						else
						{
							key = q.rA[i].get(1);
							if(key == 'substitution'){ j = 1; q.rA[i].set('',0);}
							else
							if(h[ key ] != null) q.rA[i].set( h[ key ]  ,0);
						}
					}
					t=q.join().trim();
					if(j==0) break;
					j--;
				}
			}
			s=t;
			if(s.match(/^[\s]*$/))
			{
				s='<b>' + name + '</b>';
			}
		}
		if(s != null)
		{
//console.debug('infowindow=' + s);
			var infowindow = new google.maps.InfoWindow({position: kmlEvent.latLng ,content: s});
			infowindow.open(map);
		}
	}
	/*------------*/
	function r2jRegex(regex)
	{
//console.debug("[C] r2jRegex");
		this.pattern= new RegExp((regex instanceof String)?(regex):(regex.toString()),'g');
		this.rA=new Array();
	}
	r2jRegex.prototype.split=function(source)
	{
//console.debug("[F] r2jRegex.prototype.split");
		this.rA=new Array();
		var j=0;
		var i=0;
		var vA;
		while((vA=this.pattern.exec(source))!=null)
		{
			this.rA[i]=new r2jValue(
									source.substr(j,this.pattern.lastIndex - vA[0].length - j),
									vA);
			i++;
			j=this.pattern.lastIndex;
		}
		if(j<source.length)
		{
			this.rA[i]=new r2jValue(
									source.substring(j),
									null);
		}
		return (j==0)?(false):(true);
	}
	r2jRegex.prototype.join=function()
	{
//console.debug("[F] r2jRegex.prototype.join");
		var s='';
		var i;
		for(i=0;i < this.rA.length; i++)
		{
			if(this.rA[i].prefix == null){}
			else s+=this.rA[i].prefix;
			if(this.rA[i].valueA == null){}
			else
			if(this.rA[i].valueA.length==0){}
			else
			if(this.rA[i].valueA[0]==null){}
			else s+=this.rA[i].valueA[0];
		}	
		return s;
	}
	r2jRegex.prototype.toString=function(separator)
	{
//console.debug('[F] r2jRegex.prototype.toString');
		var sep=(arguments.length == 0)?("\n"):(separator);
		if(this.rA == null) return 'rA NULL';
		var i;
		var s='pattern=' + this.pattern.source + sep + 'rA=[]' + sep;
		for(i = 0;i < this.rA.length;i++)
		{
			s+= '_[' + i + ']';
			if(this.rA[i] == null) s+= ' NULL';
			else s += '=' + this.rA[i].toString();
			s+= ((i + 1 < this.rA.length)?(sep):(''));
		}
		return s;
	}
	/*------------*/
	function r2jValue(prefix,valueA)
	{
//console.debug("[C] r2jValue");
		this.prefix=(prefix == null)?(''):(prefix);
		this.valueA=(valueA == null)?(['']):(valueA);
	}
	r2jValue.prototype.length=function()
	{
//console.debug("[F] r2jValue.prototype.length");
		return (this.valueA == null)?(0):(this.valueA.length);
	}
	r2jValue.prototype.get=function(index)
	{
//console.debug("[F] r2jValue.prototype.get");
		var i=(arguments.length==0)?(0):(index);
//console.debug('i=' + i + ' this.valueA.length=' + this.valueA.length);
		if(i < this.valueA.length) return (this.valueA[i]== null)?(''):(this.valueA[i]);
		return ''; 
	}
	r2jValue.prototype.set=function(value,index)
	{
//console.debug("[F] r2jValue.prototype.set");
		if(this.valueA==null || this.valueA.length==0) return false;
		if(arguments.length==0)
		{
			this.valueA[0]='';
			return true;
		}
		else
		if(arguments.length==1)
		{
			this.valueA[0]=(value == null)?(''):(value);
			return true;
		}
		else
		if(index < this.valueA.length)
		{
			this.valueA[index]=(value == null)?(''):(value);
			return true;
		}
		return false; 
	}
	r2jValue.prototype.toString=function(separator)
	{
//console.debug('[F] r2jValue.prototype.toString');
		var sep=(arguments.length == 0)?('| '):(separator);
//console.debug('sep=' + sep +'<');
		var s=
		'prefix' + ((this.prefix == null)?(' NULL'):('=' + this.prefix)) +sep +
		'valueA' + ((this.valueA == null)?(' NULL'):('=[' + this.valueA.join(',')) + ']');
		return s;
	}
	function r2jCut(v)
	{
		var p=new RegExp('^([\\d]*\\.[\\d]{2}).*?$');
		var vA=p.exec(v);
		if(vA == null) return v;
		return vA[1];
	}
