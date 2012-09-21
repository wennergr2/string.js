;
(function() {
  "use strict";
  var __sp__ = String.prototype;

  function S(s) {
    if (s === null || typeof s != 'string')
      throw new Error("Must pass in a string.");
    else
      this.s = s;

    if (this.__defineGetter__) {
      this.__defineGetter__('length', function() {
        return this.s.length;
      })
    } else {
      this.length = s.length;
    }
  }

  S.prototype = {
    //# modified slightly from https://github.com/epeli/underscore.string
    camelize: function() {
      var s = this.trim().s.replace(/(\-|_|\s)+(.)?/g, function(mathc, sep, c) {
        return (c ? c.toUpperCase() : '');
      });
      return new S(s);
    },
    
    capitalize: function() {
      return new S(this.s.substr(0, 1).toUpperCase() + this.s.substring(1).toLowerCase());
    },

    //#thanks Google
    collapseWhitespace: function() {
      var s = this.s.replace(/[\s\xa0]+/g, ' ').replace(/^\s+|\s+$/g, '');
      return new S(s);
    },

    contains: function(ss) {
      return this.s.indexOf(ss) >= 0;
    },

    //#modified from https://github.com/epeli/underscore.string
    dasherize: function() {
      var s = this.trim().s.replace(/[_\s]+/g, '-').replace(/([A-Z])/g, '-$1').replace(/-+/g, '-').toLowerCase();
      return new S(s);
    },

    decodeHtmlEntities: function(quote_style) {
      var symbol = "", entity = "", hash_map = {};
      var tmp_str = this.s;
      if (false === (hash_map = get_html_translation_table("HTML_ENTITIES", quote_style))) {
        return false;
      }
      delete hash_map["&"];
      hash_map["&"] = "&amp;";
      for (symbol in hash_map) {
        entity = hash_map[symbol];
        tmp_str = tmp_str.split(entity).join(symbol);
      }
      tmp_str = tmp_str.split("&#039;").join("'");
      return new S(tmp_str);
    },

    endsWith: function(suffix) {
      var l  = this.s.length - suffix.length;
      return l >= 0 && this.s.indexOf(suffix, l) === l;
    },

    isAlpha: function() {
      return !/[^a-zA-Z]/.test(this.s);
    },

    isAlphaNumeric: function() {
      return !/[^a-zA-Z0-9]/.test(this.s);
    },

    isEmpty: function() {
      return /^[\s\xa0]*$/.test(this.s);
    },

    isLower: function() {
      return !/[^a-z]/.test(this.s);
    },

    isNumeric: function() {
      return !/[^0-9]/.test(this.s);
    },

    isUpper: function() {
      return !/[^A-Z]/.test(this.s);
    },

    left: function(N) {
      if (N >= 0) {
        var s = this.s.substr(0, N);
        return new S(s);
      } else {
        return this.right(-N);
      }
    },

    ltrim: function() {
      var s = this.s.replace(/(^\s*)/g, '');
      return new S(s);
    },

    replaceAll: function(ss, r) {
      var s = this.s.replace(new RegExp(ss, 'g'), r);
      return new S(s);
    },

    right: function(N) {
      if (N >= 0) {
        var s = this.s.substr(this.s.length - N, N);
        return new S(s);
      } else {
        return this.left(-N);
      }
    },

    rtrim: function() {
      var s = this.s.replace(/\s+$/, '');
      return new S(s);
    },

    startsWith: function(prefix) {
      return this.s.lastIndexOf(prefix, 0) === 0;
    },

    times: function(n) {
      return new S(new Array(n + 1).join(this.s));
    },

    trim: function() {
      var s;
      if (typeof String.prototype.trim === 'undefined') {
        s = this.s.replace(/(^\s*|\s*$)/g, '');
      } else {
        s = this.s.trim();
      }
      return new S(s);
    },

    toString: function() {
      return this.s;
    },

    //#modified from https://github.com/epeli/underscore.string
    underscore: function() {
      var s = this.trim().s.replace(/([a-z\d])([A-Z]+)/g, '$1_$2').replace(/[-\s]+/g, '_').toLowerCase();
      if ((new S(this.s.charAt(0))).isUpper()) {
        s = '_' + s;
      }
      return new S(s);
    }

  }


/*************************************
/* Native JavaScript String Properties
/*************************************/

  /*var nativeNames = getNativeStringPropertyNames();
  for (var i = 0; i < nativeNames.length; ++i) {
    var name = nativeNames[i]
    if (__sp__.hasOwnProperty(name)) {
      (function(name) {
        var stringProp = __sp__[name];
        if (typeof stringProp == 'function') {
          //console.log(stringProp)
          if (!S.prototype[name]) {
            S.prototype[name] = function() {
              //console.log(name)
              return new S(stringProp.apply(this, arguments));
            }
          }
        }
      })(name);
    }
  }*/

  var nativeProperties = getNativeStringProperties();
  for (var name in nativeProperties) {
    (function(name) {
      var stringProp = __sp__[name];
      if (typeof stringProp == 'function') {
        //console.log(stringProp)
        if (!S.prototype[name]) {
          if (nativeProperties[name] === 'string') {
            S.prototype[name] = function() {
              //console.log(name)
              return new S(stringProp.apply(this, arguments));
            }
          } else {
            S.prototype[name] = stringProp;
          }
        }
      }
    })(name);
  }


/*************************************
/* Function Aliases
/*************************************/

  S.prototype.repeat = S.prototype.times;
  S.prototype.include = S.prototype.contains;



/*************************************
/* Private Functions
/*************************************/

  function getNativeStringProperties() {
    var names = getNativeStringPropertyNames();
    var retObj = {};

    for (var i = 0; i < names.length; ++i) {
      var name = names[i];
      var func = __sp__[name];
      try {
        var type = typeof func.apply('teststring', []); 
        retObj[name] = type;
      } catch (e) {}
    }
    return retObj;
  }

  function getNativeStringPropertyNames() {
    var results = []; 
    if (Object.getOwnPropertyNames) {
      results = Object.getOwnPropertyNames(__sp__);
      results.splice(results.indexOf('valueOf'), 1);
      results.splice(results.indexOf('toString'), 1);
      return results;
    } else { //meant for legacy cruft, this could probably be made more efficient
      var stringNames = {};
      var objectNames = [];
      for (var name in String.prototype)
        stringNames[name] = name;
      
      for (var name in Object.prototype)
        delete stringNames[name];

      //stringNames['toString'] = 'toString'; //this was deleted with the rest of the object names
      for (var name in stringNames) {
        results.push(name);
      }
      return results;
    }
  }

  function wrap(str) {
    return new S(str);
  };

  var methodsAdded = [];
  function clobberPrototype() {
    var newS = S.prototype;
    for (var name in S.prototype) {
      var func = S.prototype[name];
      if (!String.prototype.hasOwnProperty(name)) {
        methodsAdded.push(name);
        String.prototype[name] = function() {
          String.prototype.s = this;
          return func.apply(this, arguments);
        }
      } 
    }
  }

  function restorePrototype() {
    for (var i = 0; i < methodsAdded.length; ++i)
      delete String.prototype[methodsAdded[i]];
    methodsAdded.length = 0;
  }


/*************************************
/* Exports
/*************************************/

  if (module && module.exports) {
    module.exports = wrap;
    module.exports.clobberPrototype = clobberPrototype;
    module.exports.restorePrototype =  restorePrototype;
  } else {
    window.S = wrap;
    window.S.clobberPrototype = clobberPrototype;
    window.S.restorePrototype = restorePrototype;
  }


/*************************************
/* 3rd Party Private Functions
/*************************************/


  //from PHP.js  
  function get_html_translation_table (table, quote_style) {
      var entities = {},
          hash_map = {},
          decimal;
      var constMappingTable = {},
          constMappingQuoteStyle = {};
      var useTable = {},
          useQuoteStyle = {};

      // Translate arguments
      constMappingTable[0] = 'HTML_SPECIALCHARS';
      constMappingTable[1] = 'HTML_ENTITIES';
      constMappingQuoteStyle[0] = 'ENT_NOQUOTES';
      constMappingQuoteStyle[2] = 'ENT_COMPAT';
      constMappingQuoteStyle[3] = 'ENT_QUOTES';

      useTable = !isNaN(table) ? constMappingTable[table] : table ? table.toUpperCase() : 'HTML_SPECIALCHARS';
      useQuoteStyle = !isNaN(quote_style) ? constMappingQuoteStyle[quote_style] : quote_style ? quote_style.toUpperCase() : 'ENT_COMPAT';

      if (useTable !== 'HTML_SPECIALCHARS' && useTable !== 'HTML_ENTITIES') {
          throw new Error("Table: " + useTable + ' not supported');
          // return false;
      }

      entities['38'] = '&amp;';
      if (useTable === 'HTML_ENTITIES') {
          entities['160'] = '&nbsp;';
          entities['161'] = '&iexcl;';
          entities['162'] = '&cent;';
          entities['163'] = '&pound;';
          entities['164'] = '&curren;';
          entities['165'] = '&yen;';
          entities['166'] = '&brvbar;';
          entities['167'] = '&sect;';
          entities['168'] = '&uml;';
          entities['169'] = '&copy;';
          entities['170'] = '&ordf;';
          entities['171'] = '&laquo;';
          entities['172'] = '&not;';
          entities['173'] = '&shy;';
          entities['174'] = '&reg;';
          entities['175'] = '&macr;';
          entities['176'] = '&deg;';
          entities['177'] = '&plusmn;';
          entities['178'] = '&sup2;';
          entities['179'] = '&sup3;';
          entities['180'] = '&acute;';
          entities['181'] = '&micro;';
          entities['182'] = '&para;';
          entities['183'] = '&middot;';
          entities['184'] = '&cedil;';
          entities['185'] = '&sup1;';
          entities['186'] = '&ordm;';
          entities['187'] = '&raquo;';
          entities['188'] = '&frac14;';
          entities['189'] = '&frac12;';
          entities['190'] = '&frac34;';
          entities['191'] = '&iquest;';
          entities['192'] = '&Agrave;';
          entities['193'] = '&Aacute;';
          entities['194'] = '&Acirc;';
          entities['195'] = '&Atilde;';
          entities['196'] = '&Auml;';
          entities['197'] = '&Aring;';
          entities['198'] = '&AElig;';
          entities['199'] = '&Ccedil;';
          entities['200'] = '&Egrave;';
          entities['201'] = '&Eacute;';
          entities['202'] = '&Ecirc;';
          entities['203'] = '&Euml;';
          entities['204'] = '&Igrave;';
          entities['205'] = '&Iacute;';
          entities['206'] = '&Icirc;';
          entities['207'] = '&Iuml;';
          entities['208'] = '&ETH;';
          entities['209'] = '&Ntilde;';
          entities['210'] = '&Ograve;';
          entities['211'] = '&Oacute;';
          entities['212'] = '&Ocirc;';
          entities['213'] = '&Otilde;';
          entities['214'] = '&Ouml;';
          entities['215'] = '&times;';
          entities['216'] = '&Oslash;';
          entities['217'] = '&Ugrave;';
          entities['218'] = '&Uacute;';
          entities['219'] = '&Ucirc;';
          entities['220'] = '&Uuml;';
          entities['221'] = '&Yacute;';
          entities['222'] = '&THORN;';
          entities['223'] = '&szlig;';
          entities['224'] = '&agrave;';
          entities['225'] = '&aacute;';
          entities['226'] = '&acirc;';
          entities['227'] = '&atilde;';
          entities['228'] = '&auml;';
          entities['229'] = '&aring;';
          entities['230'] = '&aelig;';
          entities['231'] = '&ccedil;';
          entities['232'] = '&egrave;';
          entities['233'] = '&eacute;';
          entities['234'] = '&ecirc;';
          entities['235'] = '&euml;';
          entities['236'] = '&igrave;';
          entities['237'] = '&iacute;';
          entities['238'] = '&icirc;';
          entities['239'] = '&iuml;';
          entities['240'] = '&eth;';
          entities['241'] = '&ntilde;';
          entities['242'] = '&ograve;';
          entities['243'] = '&oacute;';
          entities['244'] = '&ocirc;';
          entities['245'] = '&otilde;';
          entities['246'] = '&ouml;';
          entities['247'] = '&divide;';
          entities['248'] = '&oslash;';
          entities['249'] = '&ugrave;';
          entities['250'] = '&uacute;';
          entities['251'] = '&ucirc;';
          entities['252'] = '&uuml;';
          entities['253'] = '&yacute;';
          entities['254'] = '&thorn;';
          entities['255'] = '&yuml;';
      }

      if (useQuoteStyle !== 'ENT_NOQUOTES') {
          entities['34'] = '&quot;';
      }
      if (useQuoteStyle === 'ENT_QUOTES') {
          entities['39'] = '&#39;';
      }
      entities['60'] = '&lt;';
      entities['62'] = '&gt;';


      // ascii decimals to real symbols
      for (decimal in entities) {
          if (entities.hasOwnProperty(decimal)) {
              hash_map[String.fromCharCode(decimal)] = entities[decimal];
          }
      }

      return hash_map;

  };


}).call(this);