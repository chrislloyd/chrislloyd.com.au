/**
 * CoffeeScript Compiler v0.7.2
 * http://coffeescript.org
 *
 * Copyright 2010, Jeremy Ashkenas
 * Released under the MIT License
 */
(function(){var compact,count,del,extend,flatten,helpers,include,indexOf,merge,starts;var __hasProp=Object.prototype.hasOwnProperty;if(!(typeof process!=="undefined"&&process!==null)){this.exports=this}helpers=(exports.helpers={});helpers.indexOf=(indexOf=function(array,item,from){var _a,_b,index,other;if(array.indexOf){return array.indexOf(item,from)}_a=array;for(index=0,_b=_a.length;index<_b;index++){other=_a[index];if(other===item&&(!from||(from<=index))){return index}}return -1});helpers.include=(include=function(list,value){return indexOf(list,value)>=0});helpers.starts=(starts=function(string,literal,start){return string.substring(start,(start||0)+literal.length)===literal});helpers.compact=(compact=function(array){var _a,_b,_c,_d,item;_a=[];_c=array;for(_b=0,_d=_c.length;_b<_d;_b++){item=_c[_b];item?_a.push(item):null}return _a});helpers.count=(count=function(string,letter){var num,pos;num=0;pos=indexOf(string,letter);while(pos!==-1){num+=1;pos=indexOf(string,letter,pos+1)}return num});helpers.merge=(merge=function(options,overrides){var _a,_b,fresh,key,val;fresh={};_a=options;for(key in _a){if(__hasProp.call(_a,key)){val=_a[key];(fresh[key]=val)}}if(overrides){_b=overrides;for(key in _b){if(__hasProp.call(_b,key)){val=_b[key];(fresh[key]=val)}}}return fresh});helpers.extend=(extend=function(object,properties){var _a,_b,key,val;_a=[];_b=properties;for(key in _b){if(__hasProp.call(_b,key)){val=_b[key];_a.push(object[key]=val)}}return _a});helpers.flatten=(flatten=function(array){var _a,_b,_c,item,memo;memo=[];_b=array;for(_a=0,_c=_b.length;_a<_c;_a++){item=_b[_a];item instanceof Array?(memo=memo.concat(item)):memo.push(item)}return memo});helpers.del=(del=function(obj,key){var val;val=obj[key];delete obj[key];return val})})();(function(){var BALANCED_PAIRS,EXPRESSION_CLOSE,EXPRESSION_END,EXPRESSION_START,IMPLICIT_BLOCK,IMPLICIT_CALL,IMPLICIT_END,IMPLICIT_FUNC,INVERSES,Rewriter,SINGLE_CLOSERS,SINGLE_LINERS,_a,_b,_c,_d,_e,_f,_g,_h,_i,_j,_k,_l,_m,helpers,include,pair;var __hasProp=Object.prototype.hasOwnProperty;if(typeof process!=="undefined"&&process!==null){_a=require("./helpers");helpers=_a.helpers}else{this.exports=this;helpers=this.helpers}_b=helpers;include=_b.include;exports.Rewriter=(function(){Rewriter=function(){};Rewriter.prototype.rewrite=function(tokens){this.tokens=tokens;this.adjustComments();this.removeLeadingNewlines();this.removeMidExpressionNewlines();this.closeOpenCallsAndIndexes();this.addImplicitIndentation();this.addImplicitParentheses();this.ensureBalance(BALANCED_PAIRS);this.rewriteClosingParens();return this.tokens};Rewriter.prototype.scanTokens=function(block){var i,move;i=0;while(true){if(!(this.tokens[i])){break}move=block(this.tokens[i-1],this.tokens[i],this.tokens[i+1],i);i+=move}return true};Rewriter.prototype.adjustComments=function(){return this.scanTokens((function(__this){var __func=function(prev,token,post,i){var _c,_d,after,before;if(!(token[0]==="HERECOMMENT")){return 1}_c=[this.tokens[i-2],this.tokens[i+2]];before=_c[0];after=_c[1];if(after&&after[0]==="INDENT"){this.tokens.splice(i+2,1);before&&before[0]==="OUTDENT"&&post&&(prev[0]===post[0])&&(post[0]==="TERMINATOR")?this.tokens.splice(i-2,1):this.tokens.splice(i,0,after)}else{if(prev&&!("TERMINATOR"===(_d=prev[0])||"INDENT"===_d||"OUTDENT"===_d)){if(post&&post[0]==="TERMINATOR"&&after&&after[0]==="OUTDENT"){this.tokens.splice.apply(this.tokens,[i+3,0].concat(this.tokens.splice(i,2)));this.tokens.splice(i+3,0,["TERMINATOR","\n",prev[2]])}else{this.tokens.splice(i,0,["TERMINATOR","\n",prev[2]])}return 2}}return 1};return(function(){return __func.apply(__this,arguments)})})(this))};Rewriter.prototype.removeLeadingNewlines=function(){var _c;_c=[];while(this.tokens[0]&&this.tokens[0][0]==="TERMINATOR"){_c.push(this.tokens.shift())}return _c};Rewriter.prototype.removeMidExpressionNewlines=function(){return this.scanTokens((function(__this){var __func=function(prev,token,post,i){if(!(post&&include(EXPRESSION_CLOSE,post[0])&&token[0]==="TERMINATOR")){return 1}this.tokens.splice(i,1);return 0};return(function(){return __func.apply(__this,arguments)})})(this))};Rewriter.prototype.closeOpenCallsAndIndexes=function(){var brackets,parens;parens=[0];brackets=[0];return this.scanTokens((function(__this){var __func=function(prev,token,post,i){var _c;if((_c=token[0])==="CALL_START"){parens.push(0)}else{if(_c==="INDEX_START"){brackets.push(0)}else{if(_c==="("){parens[parens.length-1]+=1}else{if(_c==="["){brackets[brackets.length-1]+=1}else{if(_c===")"){if(parens[parens.length-1]===0){parens.pop();token[0]="CALL_END"}else{parens[parens.length-1]-=1}}else{if(_c==="]"){if(brackets[brackets.length-1]===0){brackets.pop();token[0]="INDEX_END"}else{brackets[brackets.length-1]-=1}}}}}}}return 1};return(function(){return __func.apply(__this,arguments)})})(this))};Rewriter.prototype.addImplicitParentheses=function(){var closeCalls,stack;stack=[0];closeCalls=(function(__this){var __func=function(i){var _c,size,tmp;(_c=stack[stack.length-1]);for(tmp=0;tmp<_c;tmp+=1){this.tokens.splice(i,0,["CALL_END",")",this.tokens[i][2]])}size=stack[stack.length-1]+1;stack[stack.length-1]=0;return size};return(function(){return __func.apply(__this,arguments)})})(this);return this.scanTokens((function(__this){var __func=function(prev,token,post,i){var _c,_d,j,nx,open,size,tag;tag=token[0];if(tag==="OUTDENT"){stack[stack.length-2]+=stack.pop()}open=stack[stack.length-1]>0;if(prev&&prev.spaced&&include(IMPLICIT_FUNC,prev[0])&&include(IMPLICIT_CALL,tag)&&!(tag==="!"&&(("IN"===(_c=post[0])||"OF"===_c)))){this.tokens.splice(i,0,["CALL_START","(",token[2]]);stack[stack.length-1]+=1;if(include(EXPRESSION_START,tag)){stack.push(0)}return 2}if(include(EXPRESSION_START,tag)){if(tag==="INDENT"&&!token.generated&&open&&!(prev&&include(IMPLICIT_BLOCK,prev[0]))){size=closeCalls(i);stack.push(0);return size}stack.push(0);return 1}if(open&&!token.generated&&prev[0]!==","&&(!post||include(IMPLICIT_END,tag))){j=1;while((typeof(_d=(nx=this.tokens[i+j]))!=="undefined"&&_d!==null)&&include(IMPLICIT_END,nx[0])){j++}if((typeof nx!=="undefined"&&nx!==null)&&nx[0]===","){if(tag==="TERMINATOR"){this.tokens.splice(i,1)}}else{size=closeCalls(i);if(tag!=="OUTDENT"&&include(EXPRESSION_END,tag)){stack.pop()}return size}}if(tag!=="OUTDENT"&&include(EXPRESSION_END,tag)){stack[stack.length-2]+=stack.pop();return 1}return 1};return(function(){return __func.apply(__this,arguments)})})(this))};Rewriter.prototype.addImplicitIndentation=function(){return this.scanTokens((function(__this){var __func=function(prev,token,post,i){var _c,idx,indent,insertion,outdent,parens,pre,starter,tok;if(token[0]==="ELSE"&&prev[0]!=="OUTDENT"){this.tokens.splice.apply(this.tokens,[i,0].concat(this.indentation(token)));return 2}if(token[0]==="CATCH"&&this.tokens[i+2][0]==="TERMINATOR"){this.tokens.splice.apply(this.tokens,[i+2,0].concat(this.indentation(token)));return 4}if(!(include(SINGLE_LINERS,token[0])&&post[0]!=="INDENT"&&!(token[0]==="ELSE"&&post[0]==="IF"))){return 1}starter=token[0];_c=this.indentation(token);indent=_c[0];outdent=_c[1];indent.generated=(outdent.generated=true);this.tokens.splice(i+1,0,indent);idx=i+1;parens=0;while(true){idx+=1;tok=this.tokens[idx];pre=this.tokens[idx-1];if((!tok||(include(SINGLE_CLOSERS,tok[0])&&tok[1]!==";"&&parens===0)||(tok[0]===")"&&parens===0))&&!(tok[0]==="ELSE"&&!("IF"===starter||"THEN"===starter))){insertion=pre[0]===","?idx-1:idx;this.tokens.splice(insertion,0,outdent);break}if(tok[0]==="("){parens+=1}if(tok[0]===")"){parens-=1}}if(!(token[0]==="THEN")){return 1}this.tokens.splice(i,1);return 0};return(function(){return __func.apply(__this,arguments)})})(this))};Rewriter.prototype.ensureBalance=function(pairs){var _c,_d,key,levels,line,open,openLine,unclosed,value;levels={};openLine={};this.scanTokens((function(__this){var __func=function(prev,token,post,i){var _c,_d,_e,_f,close,open,pair;_d=pairs;for(_c=0,_e=_d.length;_c<_e;_c++){pair=_d[_c];_f=pair;open=_f[0];close=_f[1];levels[open]=levels[open]||0;if(token[0]===open){if(levels[open]===0){openLine[open]=token[2]}levels[open]+=1}if(token[0]===close){levels[open]-=1}if(levels[open]<0){throw new Error(("too many "+(token[1])+" on line "+(token[2]+1)))}}return 1};return(function(){return __func.apply(__this,arguments)})})(this));unclosed=(function(){_c=[];_d=levels;for(key in _d){if(__hasProp.call(_d,key)){value=_d[key];value>0?_c.push(key):null}}return _c})();if(unclosed.length){open=unclosed[0];line=openLine[open]+1;throw new Error("unclosed "+open+" on line "+line)}};Rewriter.prototype.rewriteClosingParens=function(){var _c,debt,key,stack,val;stack=[];debt={};_c=INVERSES;for(key in _c){if(__hasProp.call(_c,key)){val=_c[key];(debt[key]=0)}}return this.scanTokens((function(__this){var __func=function(prev,token,post,i){var inv,match,mtag,oppos,tag;tag=token[0];inv=INVERSES[token[0]];if(include(EXPRESSION_START,tag)){stack.push(token);return 1}else{if(include(EXPRESSION_END,tag)){if(debt[inv]>0){debt[inv]-=1;this.tokens.splice(i,1);return 0}else{match=stack.pop();mtag=match[0];oppos=INVERSES[mtag];if(tag===oppos){return 1}debt[mtag]+=1;val=[oppos,mtag==="INDENT"?match[1]:oppos];if((this.tokens[i+2]==undefined?undefined:this.tokens[i+2][0])===mtag){this.tokens.splice(i+3,0,val);stack.push(match)}else{this.tokens.splice(i,0,val)}return 1}}else{return 1}}};return(function(){return __func.apply(__this,arguments)})})(this))};Rewriter.prototype.indentation=function(token){return[["INDENT",2,token[2]],["OUTDENT",2,token[2]]]};return Rewriter})();BALANCED_PAIRS=[["(",")"],["[","]"],["{","}"],["INDENT","OUTDENT"],["PARAM_START","PARAM_END"],["CALL_START","CALL_END"],["INDEX_START","INDEX_END"]];INVERSES={};_d=BALANCED_PAIRS;for(_c=0,_e=_d.length;_c<_e;_c++){pair=_d[_c];INVERSES[pair[0]]=pair[1];INVERSES[pair[1]]=pair[0]}EXPRESSION_START=(function(){_f=[];_h=BALANCED_PAIRS;for(_g=0,_i=_h.length;_g<_i;_g++){pair=_h[_g];_f.push(pair[0])}return _f})();EXPRESSION_END=(function(){_j=[];_l=BALANCED_PAIRS;for(_k=0,_m=_l.length;_k<_m;_k++){pair=_l[_k];_j.push(pair[1])}return _j})();EXPRESSION_CLOSE=["CATCH","WHEN","ELSE","FINALLY"].concat(EXPRESSION_END);IMPLICIT_FUNC=["IDENTIFIER","SUPER",")","CALL_END","]","INDEX_END","@"];IMPLICIT_CALL=["IDENTIFIER","NUMBER","STRING","JS","REGEX","NEW","PARAM_START","TRY","DELETE","TYPEOF","SWITCH","TRUE","FALSE","YES","NO","ON","OFF","!","!!","THIS","NULL","@","->","=>","[","(","{"];IMPLICIT_BLOCK=["->","=>","{","[",","];IMPLICIT_END=["IF","UNLESS","FOR","WHILE","UNTIL","LOOP","TERMINATOR","INDENT"].concat(EXPRESSION_END);SINGLE_LINERS=["ELSE","->","=>","TRY","FINALLY","THEN"];SINGLE_CLOSERS=["TERMINATOR","CATCH","FINALLY","ELSE","OUTDENT","LEADING_WHEN"]})();(function(){var ASSIGNED,ASSIGNMENT,CALLABLE,CODE,COFFEE_ALIASES,COFFEE_KEYWORDS,COMMENT,CONVERSIONS,HALF_ASSIGNMENTS,HEREDOC,HEREDOC_INDENT,IDENTIFIER,INTERPOLATION,JS_CLEANER,JS_FORBIDDEN,JS_KEYWORDS,LAST_DENT,LAST_DENTS,LINE_BREAK,Lexer,MULTILINER,MULTI_DENT,NEXT_CHARACTER,NOT_REGEX,NO_NEWLINE,NUMBER,OPERATOR,REGEX_END,REGEX_ESCAPE,REGEX_INTERPOLATION,REGEX_START,RESERVED,Rewriter,STRING_NEWLINES,WHITESPACE,_a,_b,_c,compact,count,helpers,include,starts;var __slice=Array.prototype.slice;if(typeof process!=="undefined"&&process!==null){_a=require("./rewriter");Rewriter=_a.Rewriter;_b=require("./helpers");helpers=_b.helpers}else{this.exports=this;Rewriter=this.Rewriter;helpers=this.helpers}_c=helpers;include=_c.include;count=_c.count;starts=_c.starts;compact=_c.compact;exports.Lexer=(function(){Lexer=function(){};Lexer.prototype.tokenize=function(code,options){var o;code=code.replace(/(\r|\s+$)/g,"");o=options||{};this.code=code;this.i=0;this.line=o.line||0;this.indent=0;this.outdebt=0;this.indents=[];this.tokens=[];while(this.i<this.code.length){this.chunk=this.code.slice(this.i);this.extractNextToken()}this.closeIndentation();if(o.rewrite===false){return this.tokens}return(new Rewriter()).rewrite(this.tokens)};Lexer.prototype.extractNextToken=function(){if(this.identifierToken()){return null}if(this.commentToken()){return null}if(this.whitespaceToken()){return null}if(this.lineToken()){return null}if(this.heredocToken()){return null}if(this.stringToken()){return null}if(this.numberToken()){return null}if(this.regexToken()){return null}if(this.jsToken()){return null}return this.literalToken()};Lexer.prototype.identifierToken=function(){var close_index,forcedIdentifier,id,tag;if(!(id=this.match(IDENTIFIER,1))){return false}this.i+=id.length;forcedIdentifier=this.tagAccessor()||this.match(ASSIGNED,1);tag="IDENTIFIER";if(include(JS_KEYWORDS,id)||(!forcedIdentifier&&include(COFFEE_KEYWORDS,id))){tag=id.toUpperCase()}if(tag==="WHEN"&&include(LINE_BREAK,this.tag())){tag="LEADING_WHEN"}if(include(JS_FORBIDDEN,id)){if(forcedIdentifier){tag="STRING";id=("'"+id+"'");if(forcedIdentifier==="accessor"){close_index=true;if(this.tag()!=="@"){this.tokens.pop()}this.token("INDEX_START","[")}}else{if(include(RESERVED,id)){this.identifierError(id)}}}if(!(forcedIdentifier)){if(include(COFFEE_ALIASES,id)){tag=(id=CONVERSIONS[id])}if(this.prev()&&this.prev()[0]==="ASSIGN"&&include(HALF_ASSIGNMENTS,tag)){return this.tagHalfAssignment(tag)}}this.token(tag,id);if(close_index){this.token("]","]")}return true};Lexer.prototype.numberToken=function(){var number;if(!(number=this.match(NUMBER,1))){return false}if(this.tag()==="."&&starts(number,".")){return false}this.i+=number.length;this.token("NUMBER",number);return true};Lexer.prototype.stringToken=function(){var string;if(!(starts(this.chunk,'"')||starts(this.chunk,"'"))){return false}if(!(string=this.balancedToken(['"','"'],["${","}"])||this.balancedToken(["'","'"]))){return false}this.interpolateString(string.replace(STRING_NEWLINES," \\\n"));this.line+=count(string,"\n");this.i+=string.length;return true};Lexer.prototype.heredocToken=function(){var doc,match,quote;if(!(match=this.chunk.match(HEREDOC))){return false}quote=match[1].substr(0,1);doc=this.sanitizeHeredoc(match[2]||match[4],{quote:quote});this.interpolateString(""+quote+doc+quote);this.line+=count(match[1],"\n");this.i+=match[1].length;return true};Lexer.prototype.commentToken=function(){var comment,match;if(!(match=this.chunk.match(COMMENT))){return false}this.line+=count(match[1],"\n");this.i+=match[1].length;if(match[2]){comment=this.sanitizeHeredoc(match[2],{herecomment:true});this.token("HERECOMMENT",comment.split(MULTILINER));this.token("TERMINATOR","\n")}return true};Lexer.prototype.jsToken=function(){var script;if(!(starts(this.chunk,"`"))){return false}if(!(script=this.balancedToken(["`","`"]))){return false}this.token("JS",script.replace(JS_CLEANER,""));this.i+=script.length;return true};Lexer.prototype.regexToken=function(){var end,flags,regex,str;if(!(this.chunk.match(REGEX_START))){return false}if(include(NOT_REGEX,this.tag())){return false}if(!(regex=this.balancedToken(["/","/"]))){return false}if(!(end=this.chunk.substr(regex.length).match(REGEX_END))){return false}if(end[2]){regex+=(flags=end[2])}if(regex.match(REGEX_INTERPOLATION)){str=regex.substring(1).split("/")[0];str=str.replace(REGEX_ESCAPE,function(escaped){return"\\"+escaped});this.tokens=this.tokens.concat([["(","("],["NEW","new"],["IDENTIFIER","RegExp"],["CALL_START","("]]);this.interpolateString(('"'+str+'"'),true);this.tokens=this.tokens.concat([[",",","],["STRING",('"'+flags+'"')],[")",")"],[")",")"]])}else{this.token("REGEX",regex)}this.i+=regex.length;return true};Lexer.prototype.balancedToken=function(){var delimited;var _d=arguments.length,_e=_d>=1;delimited=__slice.call(arguments,0,_d-0);return this.balancedString(this.chunk,delimited)};Lexer.prototype.lineToken=function(){var diff,indent,nextCharacter,noNewlines,prev,size;if(!(indent=this.match(MULTI_DENT,1))){return false}this.line+=count(indent,"\n");this.i+=indent.length;prev=this.prev(2);size=indent.match(LAST_DENTS).reverse()[0].match(LAST_DENT)[1].length;nextCharacter=this.match(NEXT_CHARACTER,1);noNewlines=nextCharacter==="."||nextCharacter===","||this.unfinished();if(size===this.indent){if(noNewlines){return this.suppressNewlines()}return this.newlineToken(indent)}else{if(size>this.indent){if(noNewlines){return this.suppressNewlines()}diff=size-this.indent;this.token("INDENT",diff);this.indents.push(diff)}else{this.outdentToken(this.indent-size,noNewlines)}}this.indent=size;return true};Lexer.prototype.outdentToken=function(moveOut,noNewlines){var lastIndent;if(moveOut>-this.outdebt){while(moveOut>0&&this.indents.length){lastIndent=this.indents.pop();this.token("OUTDENT",lastIndent);moveOut-=lastIndent}}else{this.outdebt+=moveOut}if(!(noNewlines)){this.outdebt=moveOut}if(!(this.tag()==="TERMINATOR"||noNewlines)){this.token("TERMINATOR","\n")}return true};Lexer.prototype.whitespaceToken=function(){var prev,space;if(!(space=this.match(WHITESPACE,1))){return false}prev=this.prev();if(prev){prev.spaced=true}this.i+=space.length;return true};Lexer.prototype.newlineToken=function(newlines){if(!(this.tag()==="TERMINATOR")){this.token("TERMINATOR","\n")}return true};Lexer.prototype.suppressNewlines=function(){if(this.value()==="\\"){this.tokens.pop()}return true};Lexer.prototype.literalToken=function(){var match,prevSpaced,space,tag,value;match=this.chunk.match(OPERATOR);value=match&&match[1];space=match&&match[2];if(value&&value.match(CODE)){this.tagParameters()}value=value||this.chunk.substr(0,1);prevSpaced=this.prev()&&this.prev().spaced;tag=value;if(value.match(ASSIGNMENT)){tag="ASSIGN";if(include(JS_FORBIDDEN,this.value)){this.assignmentError()}}else{if(value===";"){tag="TERMINATOR"}else{if(value==="?"&&prevSpaced){tag="OP?"}else{if(include(CALLABLE,this.tag())&&!prevSpaced){if(value==="("){tag="CALL_START"}else{if(value==="["){tag="INDEX_START";if(this.tag()==="?"){this.tag(1,"INDEX_SOAK")}if(this.tag()==="::"){this.tag(1,"INDEX_PROTO")}}}}}}}this.i+=value.length;if(space&&prevSpaced&&this.prev()[0]==="ASSIGN"&&include(HALF_ASSIGNMENTS,tag)){return this.tagHalfAssignment(tag)}this.token(tag,value);return true};Lexer.prototype.tagAccessor=function(){var accessor,prev;if((!(prev=this.prev()))||(prev&&prev.spaced)){return false}accessor=(function(){if(prev[1]==="::"){return this.tag(1,"PROTOTYPE_ACCESS")}else{if(prev[1]==="."&&!(this.value(2)===".")){if(this.tag(2)==="?"){this.tag(1,"SOAK_ACCESS");return this.tokens.splice(-2,1)}else{return this.tag(1,"PROPERTY_ACCESS")}}else{return prev[0]==="@"}}}).call(this);return accessor?"accessor":false};Lexer.prototype.sanitizeHeredoc=function(doc,options){var _d,attempt,indent,match;while(match=HEREDOC_INDENT.exec(doc)){attempt=(typeof(_d=match[2])!=="undefined"&&_d!==null)?match[2]:match[3];if(!indent||attempt.length<indent.length){indent=attempt}}doc=doc.replace(new RegExp("^"+indent,"gm"),"");if(options.herecomment){return doc}return doc.replace(MULTILINER,"\\n").replace(new RegExp(options.quote,"g"),("\\"+options.quote))};Lexer.prototype.tagHalfAssignment=function(tag){var last;if(tag==="OP?"){tag="?"}last=this.tokens.pop();this.tokens.push([(""+tag+"="),(""+tag+"="),last[2]]);return true};Lexer.prototype.tagParameters=function(){var _d,i,tok;if(this.tag()!==")"){return null}i=0;while(true){i+=1;tok=this.prev(i);if(!tok){return null}if((_d=tok[0])==="IDENTIFIER"){tok[0]="PARAM"}else{if(_d===")"){tok[0]="PARAM_END"}else{if(_d==="("||_d==="CALL_START"){tok[0]="PARAM_START";return tok[0]}}}}return true};Lexer.prototype.closeIndentation=function(){return this.outdentToken(this.indent)};Lexer.prototype.identifierError=function(word){throw new Error(('SyntaxError: Reserved word "'+word+'" on line '+(this.line+1)))};Lexer.prototype.assignmentError=function(){throw new Error(('SyntaxError: Reserved word "'+(this.value())+'" on line '+(this.line+1)+" can't be assigned"))};Lexer.prototype.balancedString=function(str,delimited,options){var _d,_e,_f,_g,close,i,levels,open,pair,slash;options=options||{};slash=delimited[0][0]==="/";levels=[];i=0;while(i<str.length){if(levels.length&&starts(str,"\\",i)){i+=1}else{_e=delimited;for(_d=0,_f=_e.length;_d<_f;_d++){pair=_e[_d];_g=pair;open=_g[0];close=_g[1];if(levels.length&&starts(str,close,i)&&levels[levels.length-1]===pair){levels.pop();i+=close.length-1;if(!(levels.length)){i+=1}break}else{if(starts(str,open,i)){levels.push(pair);i+=open.length-1;break}}}}if(!levels.length||slash&&starts(str,"\n",i)){break}i+=1}if(levels.length){if(slash){return false}throw new Error(("SyntaxError: Unterminated "+(levels.pop()[0])+" starting on line "+(this.line+1)))}return !i?false:str.substring(0,i)};Lexer.prototype.interpolateString=function(str,escapeQuotes){var _d,_e,_f,_g,_h,_i,_j,escaped,expr,group,i,idx,inner,interp,interpolated,lexer,match,nested,pi,quote,tag,tok,token,tokens,value;if(str.length<3||!starts(str,'"')){return this.token("STRING",str)}else{lexer=new Lexer();tokens=[];quote=str.substring(0,1);_d=[1,1];i=_d[0];pi=_d[1];while(i<str.length-1){if(starts(str,"\\",i)){i+=1}else{if((match=str.substring(i).match(INTERPOLATION))){_e=match;group=_e[0];interp=_e[1];if(starts(interp,"@")){interp=("this."+(interp.substring(1)))}if(pi<i){tokens.push(["STRING",(""+quote+(str.substring(pi,i))+quote)])}tokens.push(["IDENTIFIER",interp]);i+=group.length-1;pi=i+1}else{if((expr=this.balancedString(str.substring(i),[["${","}"]]))){if(pi<i){tokens.push(["STRING",(""+quote+(str.substring(pi,i))+quote)])}inner=expr.substring(2,expr.length-1);if(inner.length){inner=inner.replace(new RegExp("\\\\"+quote,"g"),quote);nested=lexer.tokenize(("("+inner+")"),{line:this.line});_f=nested;for(idx=0,_g=_f.length;idx<_g;idx++){tok=_f[idx];tok[0]==="CALL_END"?(tok[0]=")"):null}nested.pop();tokens.push(["TOKENS",nested])}else{tokens.push(["STRING",(""+quote+quote)])}i+=expr.length-1;pi=i+1}}}i+=1}if(pi<i&&pi<str.length-1){tokens.push(["STRING",(""+quote+(str.substring(pi,i))+quote)])}if(!(tokens[0][0]==="STRING")){tokens.unshift(["STRING",'""'])}interpolated=tokens.length>1;if(interpolated){this.token("(","(")}_h=tokens;for(i=0,_i=_h.length;i<_i;i++){token=_h[i];_j=token;tag=_j[0];value=_j[1];if(tag==="TOKENS"){this.tokens=this.tokens.concat(value)}else{if(tag==="STRING"&&escapeQuotes){escaped=value.substring(1,value.length-1).replace(/"/g,'\\"');this.token(tag,('"'+escaped+'"'))}else{this.token(tag,value)}}if(i<tokens.length-1){this.token("+","+")}}if(interpolated){this.token(")",")")}return tokens}};Lexer.prototype.token=function(tag,value){return this.tokens.push([tag,value,this.line])};Lexer.prototype.tag=function(index,newTag){var tok;if(!(tok=this.prev(index))){return null}if(typeof newTag!=="undefined"&&newTag!==null){tok[0]=newTag;return tok[0]}return tok[0]};Lexer.prototype.value=function(index,val){var tok;if(!(tok=this.prev(index))){return null}if(typeof val!=="undefined"&&val!==null){tok[1]=val;return tok[1]}return tok[1]};Lexer.prototype.prev=function(index){return this.tokens[this.tokens.length-(index||1)]};Lexer.prototype.match=function(regex,index){var m;if(!(m=this.chunk.match(regex))){return false}return m?m[index]:false};Lexer.prototype.unfinished=function(){var prev;prev=this.prev(2);return this.value()&&this.value().match&&this.value().match(NO_NEWLINE)&&prev&&(prev[0]!==".")&&!this.value().match(CODE)};return Lexer})();JS_KEYWORDS=["if","else","true","false","new","return","try","catch","finally","throw","break","continue","for","in","while","delete","instanceof","typeof","switch","super","extends","class","this","null"];COFFEE_ALIASES=["and","or","is","isnt","not"];COFFEE_KEYWORDS=COFFEE_ALIASES.concat(["then","unless","until","loop","yes","no","on","off","of","by","where","when"]);RESERVED=["case","default","do","function","var","void","with","const","let","enum","export","import","native"];JS_FORBIDDEN=JS_KEYWORDS.concat(RESERVED);IDENTIFIER=/^([a-zA-Z\$_](\w|\$)*)/;NUMBER=/^(((\b0(x|X)[0-9a-fA-F]+)|((\b[0-9]+(\.[0-9]+)?|\.[0-9]+)(e[+\-]?[0-9]+)?)))\b/i;HEREDOC=/^("{6}|'{6}|"{3}\n?([\s\S]*?)\n?([ \t]*)"{3}|'{3}\n?([\s\S]*?)\n?([ \t]*)'{3})/;INTERPOLATION=/^\$([a-zA-Z_@]\w*(\.\w+)*)/;OPERATOR=/^(-[\-=>]?|\+[+=]?|[*&|\/%=<>:!?]+)([ \t]*)/;WHITESPACE=/^([ \t]+)/;COMMENT=/^(\s*#{3}(?!#)[ \t]*\n+([\s\S]*?)[ \t]*\n+[ \t]*#{3}|(\s*#(?!##[^#])[^\n]*)+)/;CODE=/^((-|=)>)/;MULTI_DENT=/^((\n([ \t]*))+)(\.)?/;LAST_DENTS=/\n([ \t]*)/g;LAST_DENT=/\n([ \t]*)/;ASSIGNMENT=/^[:=]$/;REGEX_START=/^\/[^\/ ]/;REGEX_INTERPOLATION=/([^\\]\$[a-zA-Z_@]|[^\\]\$\{.*[^\\]\})/;REGEX_END=/^(([imgy]{1,4})\b|\W|$)/;REGEX_ESCAPE=/\\[^\$]/g;JS_CLEANER=/(^`|`$)/g;MULTILINER=/\n/g;STRING_NEWLINES=/\n[ \t]*/g;NO_NEWLINE=/^([+\*&|\/\-%=<>:!.\\][<>=&|]*|and|or|is|isnt|not|delete|typeof|instanceof)$/;HEREDOC_INDENT=/(\n+([ \t]*)|^([ \t]+))/g;ASSIGNED=/^([a-zA-Z\$_]\w*[ \t]*?[:=][^=])/;NEXT_CHARACTER=/^\s*(\S)/;NOT_REGEX=["NUMBER","REGEX","++","--","FALSE","NULL","TRUE","]"];CALLABLE=["IDENTIFIER","SUPER",")","]","}","STRING","@","THIS","?","::"];LINE_BREAK=["INDENT","OUTDENT","TERMINATOR"];HALF_ASSIGNMENTS=["-","+","/","*","%","||","&&","?","OP?"];CONVERSIONS={and:"&&",or:"||",is:"==",isnt:"!=",not:"!"}})();var parser=(function(){var parser={trace:function trace(){},yy:{},symbols_:{error:2,Root:3,TERMINATOR:4,Body:5,Block:6,Line:7,Expression:8,Statement:9,Return:10,Throw:11,BREAK:12,CONTINUE:13,Value:14,Call:15,Code:16,Operation:17,Assign:18,If:19,Try:20,While:21,For:22,Switch:23,Extends:24,Class:25,Splat:26,Existence:27,Comment:28,INDENT:29,OUTDENT:30,Identifier:31,IDENTIFIER:32,AlphaNumeric:33,NUMBER:34,STRING:35,Literal:36,JS:37,REGEX:38,TRUE:39,FALSE:40,YES:41,NO:42,ON:43,OFF:44,Assignable:45,ASSIGN:46,AssignObj:47,RETURN:48,HERECOMMENT:49,"?":50,PARAM_START:51,ParamList:52,PARAM_END:53,FuncGlyph:54,"->":55,"=>":56,OptComma:57,",":58,Param:59,PARAM:60,".":61,SimpleAssignable:62,Accessor:63,Invocation:64,ThisProperty:65,Array:66,Object:67,Parenthetical:68,Range:69,This:70,NULL:71,PROPERTY_ACCESS:72,PROTOTYPE_ACCESS:73,"::":74,SOAK_ACCESS:75,Index:76,Slice:77,INDEX_START:78,INDEX_END:79,INDEX_SOAK:80,INDEX_PROTO:81,"{":82,AssignList:83,"}":84,CLASS:85,EXTENDS:86,ClassBody:87,ClassAssign:88,Super:89,NEW:90,Arguments:91,CALL_START:92,ArgList:93,CALL_END:94,SUPER:95,THIS:96,"@":97,"[":98,"]":99,SimpleArgs:100,TRY:101,Catch:102,FINALLY:103,CATCH:104,THROW:105,"(":106,")":107,WhileSource:108,WHILE:109,WHEN:110,UNTIL:111,Loop:112,LOOP:113,FOR:114,ForVariables:115,ForSource:116,ForValue:117,IN:118,OF:119,BY:120,SWITCH:121,Whens:122,ELSE:123,When:124,LEADING_WHEN:125,IfBlock:126,IF:127,UNLESS:128,"!":129,"!!":130,"-":131,"+":132,"~":133,"--":134,"++":135,DELETE:136,TYPEOF:137,"*":138,"/":139,"%":140,"<<":141,">>":142,">>>":143,"&":144,"|":145,"^":146,"<=":147,"<":148,">":149,">=":150,"==":151,"!=":152,"&&":153,"||":154,"OP?":155,"-=":156,"+=":157,"/=":158,"*=":159,"%=":160,"||=":161,"&&=":162,"?=":163,INSTANCEOF:164,"$accept":0,"$end":1},terminals_:{"2":"error","4":"TERMINATOR","12":"BREAK","13":"CONTINUE","29":"INDENT","30":"OUTDENT","32":"IDENTIFIER","34":"NUMBER","35":"STRING","37":"JS","38":"REGEX","39":"TRUE","40":"FALSE","41":"YES","42":"NO","43":"ON","44":"OFF","46":"ASSIGN","48":"RETURN","49":"HERECOMMENT","50":"?","51":"PARAM_START","53":"PARAM_END","55":"->","56":"=>","58":",","60":"PARAM","61":".","71":"NULL","72":"PROPERTY_ACCESS","73":"PROTOTYPE_ACCESS","74":"::","75":"SOAK_ACCESS","78":"INDEX_START","79":"INDEX_END","80":"INDEX_SOAK","81":"INDEX_PROTO","82":"{","84":"}","85":"CLASS","86":"EXTENDS","90":"NEW","92":"CALL_START","94":"CALL_END","95":"SUPER","96":"THIS","97":"@","98":"[","99":"]","101":"TRY","103":"FINALLY","104":"CATCH","105":"THROW","106":"(","107":")","109":"WHILE","110":"WHEN","111":"UNTIL","113":"LOOP","114":"FOR","118":"IN","119":"OF","120":"BY","121":"SWITCH","123":"ELSE","125":"LEADING_WHEN","127":"IF","128":"UNLESS","129":"!","130":"!!","131":"-","132":"+","133":"~","134":"--","135":"++","136":"DELETE","137":"TYPEOF","138":"*","139":"/","140":"%","141":"<<","142":">>","143":">>>","144":"&","145":"|","146":"^","147":"<=","148":"<","149":">","150":">=","151":"==","152":"!=","153":"&&","154":"||","155":"OP?","156":"-=","157":"+=","158":"/=","159":"*=","160":"%=","161":"||=","162":"&&=","163":"?=","164":"INSTANCEOF"},productions_:[0,[3,0],[3,1],[3,1],[3,2],[5,1],[5,3],[5,2],[7,1],[7,1],[9,1],[9,1],[9,1],[9,1],[8,1],[8,1],[8,1],[8,1],[8,1],[8,1],[8,1],[8,1],[8,1],[8,1],[8,1],[8,1],[8,1],[8,1],[8,1],[6,3],[6,2],[6,2],[31,1],[33,1],[33,1],[36,1],[36,1],[36,1],[36,1],[36,1],[36,1],[36,1],[36,1],[36,1],[18,3],[47,1],[47,1],[47,3],[47,3],[47,1],[10,2],[10,1],[28,1],[27,2],[16,5],[16,2],[54,1],[54,1],[57,0],[57,1],[52,0],[52,1],[52,3],[59,1],[59,4],[26,4],[62,1],[62,2],[62,2],[62,1],[45,1],[45,1],[45,1],[14,1],[14,1],[14,1],[14,1],[14,1],[14,1],[63,2],[63,2],[63,1],[63,2],[63,1],[63,1],[76,3],[76,2],[76,2],[67,4],[83,0],[83,1],[83,3],[83,4],[83,6],[25,2],[25,4],[25,5],[25,7],[88,1],[88,3],[87,0],[87,1],[87,3],[15,1],[15,1],[15,2],[15,2],[24,3],[64,2],[64,2],[91,4],[89,2],[70,1],[70,1],[65,2],[69,6],[69,7],[77,6],[77,7],[66,4],[93,0],[93,1],[93,3],[93,4],[93,6],[100,1],[100,3],[20,3],[20,4],[20,5],[102,3],[11,2],[68,3],[108,2],[108,4],[108,2],[108,4],[21,2],[21,2],[21,2],[21,1],[112,2],[112,2],[22,4],[22,4],[22,4],[117,1],[117,1],[117,1],[115,1],[115,3],[116,2],[116,2],[116,4],[116,4],[116,4],[116,6],[116,6],[23,5],[23,7],[23,4],[23,6],[122,1],[122,2],[124,3],[124,4],[126,3],[126,3],[126,5],[126,3],[19,1],[19,3],[19,3],[19,3],[19,3],[17,2],[17,2],[17,2],[17,2],[17,2],[17,2],[17,2],[17,2],[17,2],[17,2],[17,2],[17,3],[17,3],[17,3],[17,3],[17,3],[17,3],[17,3],[17,3],[17,3],[17,3],[17,3],[17,3],[17,3],[17,3],[17,3],[17,3],[17,3],[17,3],[17,3],[17,3],[17,3],[17,3],[17,3],[17,3],[17,3],[17,3],[17,3],[17,3],[17,3],[17,3],[17,3],[17,4],[17,4]],performAction:function anonymous(yytext,yyleng,yylineno,yy){var $$=arguments[5],$0=arguments[5].length;switch(arguments[4]){case 1:return this.$=new Expressions();break;case 2:return this.$=new Expressions();break;case 3:return this.$=$$[$0-1+1-1];break;case 4:return this.$=$$[$0-2+1-1];break;case 5:this.$=Expressions.wrap([$$[$0-1+1-1]]);break;case 6:this.$=$$[$0-3+1-1].push($$[$0-3+3-1]);break;case 7:this.$=$$[$0-2+1-1];break;case 8:this.$=$$[$0-1+1-1];break;case 9:this.$=$$[$0-1+1-1];break;case 10:this.$=$$[$0-1+1-1];break;case 11:this.$=$$[$0-1+1-1];break;case 12:this.$=new LiteralNode($$[$0-1+1-1]);break;case 13:this.$=new LiteralNode($$[$0-1+1-1]);break;case 14:this.$=$$[$0-1+1-1];break;case 15:this.$=$$[$0-1+1-1];break;case 16:this.$=$$[$0-1+1-1];break;case 17:this.$=$$[$0-1+1-1];break;case 18:this.$=$$[$0-1+1-1];break;case 19:this.$=$$[$0-1+1-1];break;case 20:this.$=$$[$0-1+1-1];break;case 21:this.$=$$[$0-1+1-1];break;case 22:this.$=$$[$0-1+1-1];break;case 23:this.$=$$[$0-1+1-1];break;case 24:this.$=$$[$0-1+1-1];break;case 25:this.$=$$[$0-1+1-1];break;case 26:this.$=$$[$0-1+1-1];break;case 27:this.$=$$[$0-1+1-1];break;case 28:this.$=$$[$0-1+1-1];break;case 29:this.$=$$[$0-3+2-1];break;case 30:this.$=new Expressions();break;case 31:this.$=Expressions.wrap([$$[$0-2+2-1]]);break;case 32:this.$=new LiteralNode($$[$0-1+1-1]);break;case 33:this.$=new LiteralNode($$[$0-1+1-1]);break;case 34:this.$=new LiteralNode($$[$0-1+1-1]);break;case 35:this.$=$$[$0-1+1-1];break;case 36:this.$=new LiteralNode($$[$0-1+1-1]);break;case 37:this.$=new LiteralNode($$[$0-1+1-1]);break;case 38:this.$=new LiteralNode(true);break;case 39:this.$=new LiteralNode(false);break;case 40:this.$=new LiteralNode(true);break;case 41:this.$=new LiteralNode(false);break;case 42:this.$=new LiteralNode(true);break;case 43:this.$=new LiteralNode(false);break;case 44:this.$=new AssignNode($$[$0-3+1-1],$$[$0-3+3-1]);break;case 45:this.$=new ValueNode($$[$0-1+1-1]);break;case 46:this.$=$$[$0-1+1-1];break;case 47:this.$=new AssignNode(new ValueNode($$[$0-3+1-1]),$$[$0-3+3-1],"object");break;case 48:this.$=new AssignNode(new ValueNode($$[$0-3+1-1]),$$[$0-3+3-1],"object");break;case 49:this.$=$$[$0-1+1-1];break;case 50:this.$=new ReturnNode($$[$0-2+2-1]);break;case 51:this.$=new ReturnNode(new ValueNode(new LiteralNode("null")));break;case 52:this.$=new CommentNode($$[$0-1+1-1]);break;case 53:this.$=new ExistenceNode($$[$0-2+1-1]);break;case 54:this.$=new CodeNode($$[$0-5+2-1],$$[$0-5+5-1],$$[$0-5+4-1]);break;case 55:this.$=new CodeNode([],$$[$0-2+2-1],$$[$0-2+1-1]);break;case 56:this.$="func";break;case 57:this.$="boundfunc";break;case 58:this.$=$$[$0-1+1-1];break;case 59:this.$=$$[$0-1+1-1];break;case 60:this.$=[];break;case 61:this.$=[$$[$0-1+1-1]];break;case 62:this.$=$$[$0-3+1-1].concat([$$[$0-3+3-1]]);break;case 63:this.$=new LiteralNode($$[$0-1+1-1]);break;case 64:this.$=new SplatNode($$[$0-4+1-1]);break;case 65:this.$=new SplatNode($$[$0-4+1-1]);break;case 66:this.$=new ValueNode($$[$0-1+1-1]);break;case 67:this.$=$$[$0-2+1-1].push($$[$0-2+2-1]);break;case 68:this.$=new ValueNode($$[$0-2+1-1],[$$[$0-2+2-1]]);break;case 69:this.$=$$[$0-1+1-1];break;case 70:this.$=$$[$0-1+1-1];break;case 71:this.$=new ValueNode($$[$0-1+1-1]);break;case 72:this.$=new ValueNode($$[$0-1+1-1]);break;case 73:this.$=$$[$0-1+1-1];break;case 74:this.$=new ValueNode($$[$0-1+1-1]);break;case 75:this.$=new ValueNode($$[$0-1+1-1]);break;case 76:this.$=new ValueNode($$[$0-1+1-1]);break;case 77:this.$=$$[$0-1+1-1];break;case 78:this.$=new ValueNode(new LiteralNode("null"));break;case 79:this.$=new AccessorNode($$[$0-2+2-1]);break;case 80:this.$=new AccessorNode($$[$0-2+2-1],"prototype");break;case 81:this.$=new AccessorNode(new LiteralNode("prototype"));break;case 82:this.$=new AccessorNode($$[$0-2+2-1],"soak");break;case 83:this.$=$$[$0-1+1-1];break;case 84:this.$=new SliceNode($$[$0-1+1-1]);break;case 85:this.$=new IndexNode($$[$0-3+2-1]);break;case 86:this.$=(function(){$$[$0-2+2-1].soakNode=true;return $$[$0-2+2-1]}());break;case 87:this.$=(function(){$$[$0-2+2-1].proto=true;return $$[$0-2+2-1]}());break;case 88:this.$=new ObjectNode($$[$0-4+2-1]);break;case 89:this.$=[];break;case 90:this.$=[$$[$0-1+1-1]];break;case 91:this.$=$$[$0-3+1-1].concat([$$[$0-3+3-1]]);break;case 92:this.$=$$[$0-4+1-1].concat([$$[$0-4+4-1]]);break;case 93:this.$=$$[$0-6+1-1].concat($$[$0-6+4-1]);break;case 94:this.$=new ClassNode($$[$0-2+2-1]);break;case 95:this.$=new ClassNode($$[$0-4+2-1],$$[$0-4+4-1]);break;case 96:this.$=new ClassNode($$[$0-5+2-1],null,$$[$0-5+4-1]);break;case 97:this.$=new ClassNode($$[$0-7+2-1],$$[$0-7+4-1],$$[$0-7+6-1]);break;case 98:this.$=$$[$0-1+1-1];break;case 99:this.$=new AssignNode(new ValueNode($$[$0-3+1-1]),$$[$0-3+3-1],"this");break;case 100:this.$=[];break;case 101:this.$=[$$[$0-1+1-1]];break;case 102:this.$=$$[$0-3+1-1].concat($$[$0-3+3-1]);break;case 103:this.$=$$[$0-1+1-1];break;case 104:this.$=$$[$0-1+1-1];break;case 105:this.$=$$[$0-2+2-1].newInstance();break;case 106:this.$=(new CallNode($$[$0-2+2-1],[])).newInstance();break;case 107:this.$=new ExtendsNode($$[$0-3+1-1],$$[$0-3+3-1]);break;case 108:this.$=new CallNode($$[$0-2+1-1],$$[$0-2+2-1]);break;case 109:this.$=new CallNode($$[$0-2+1-1],$$[$0-2+2-1]);break;case 110:this.$=$$[$0-4+2-1];break;case 111:this.$=new CallNode("super",$$[$0-2+2-1]);break;case 112:this.$=new ValueNode(new LiteralNode("this"));break;case 113:this.$=new ValueNode(new LiteralNode("this"));break;case 114:this.$=new ValueNode(new LiteralNode("this"),[new AccessorNode($$[$0-2+2-1])]);break;case 115:this.$=new RangeNode($$[$0-6+2-1],$$[$0-6+5-1]);break;case 116:this.$=new RangeNode($$[$0-7+2-1],$$[$0-7+6-1],true);break;case 117:this.$=new RangeNode($$[$0-6+2-1],$$[$0-6+5-1]);break;case 118:this.$=new RangeNode($$[$0-7+2-1],$$[$0-7+6-1],true);break;case 119:this.$=new ArrayNode($$[$0-4+2-1]);break;case 120:this.$=[];break;case 121:this.$=[$$[$0-1+1-1]];break;case 122:this.$=$$[$0-3+1-1].concat([$$[$0-3+3-1]]);break;case 123:this.$=$$[$0-4+1-1].concat([$$[$0-4+4-1]]);break;case 124:this.$=$$[$0-6+1-1].concat($$[$0-6+4-1]);break;case 125:this.$=$$[$0-1+1-1];break;case 126:this.$=$$[$0-3+1-1] instanceof Array?$$[$0-3+1-1].concat([$$[$0-3+3-1]]):[$$[$0-3+1-1]].concat([$$[$0-3+3-1]]);break;case 127:this.$=new TryNode($$[$0-3+2-1],$$[$0-3+3-1][0],$$[$0-3+3-1][1]);break;case 128:this.$=new TryNode($$[$0-4+2-1],null,null,$$[$0-4+4-1]);break;case 129:this.$=new TryNode($$[$0-5+2-1],$$[$0-5+3-1][0],$$[$0-5+3-1][1],$$[$0-5+5-1]);break;case 130:this.$=[$$[$0-3+2-1],$$[$0-3+3-1]];break;case 131:this.$=new ThrowNode($$[$0-2+2-1]);break;case 132:this.$=new ParentheticalNode($$[$0-3+2-1]);break;case 133:this.$=new WhileNode($$[$0-2+2-1]);break;case 134:this.$=new WhileNode($$[$0-4+2-1],{guard:$$[$0-4+4-1]});break;case 135:this.$=new WhileNode($$[$0-2+2-1],{invert:true});break;case 136:this.$=new WhileNode($$[$0-4+2-1],{invert:true,guard:$$[$0-4+4-1]});break;case 137:this.$=$$[$0-2+1-1].addBody($$[$0-2+2-1]);break;case 138:this.$=$$[$0-2+2-1].addBody(Expressions.wrap([$$[$0-2+1-1]]));break;case 139:this.$=$$[$0-2+2-1].addBody(Expressions.wrap([$$[$0-2+1-1]]));break;case 140:this.$=$$[$0-1+1-1];break;case 141:this.$=new WhileNode(new LiteralNode("true")).addBody($$[$0-2+2-1]);break;case 142:this.$=new WhileNode(new LiteralNode("true")).addBody(Expressions.wrap([$$[$0-2+2-1]]));break;case 143:this.$=new ForNode($$[$0-4+1-1],$$[$0-4+4-1],$$[$0-4+3-1][0],$$[$0-4+3-1][1]);break;case 144:this.$=new ForNode($$[$0-4+1-1],$$[$0-4+4-1],$$[$0-4+3-1][0],$$[$0-4+3-1][1]);break;case 145:this.$=new ForNode($$[$0-4+4-1],$$[$0-4+3-1],$$[$0-4+2-1][0],$$[$0-4+2-1][1]);break;case 146:this.$=$$[$0-1+1-1];break;case 147:this.$=new ValueNode($$[$0-1+1-1]);break;case 148:this.$=new ValueNode($$[$0-1+1-1]);break;case 149:this.$=[$$[$0-1+1-1]];break;case 150:this.$=[$$[$0-3+1-1],$$[$0-3+3-1]];break;case 151:this.$={source:$$[$0-2+2-1]};break;case 152:this.$={source:$$[$0-2+2-1],object:true};break;case 153:this.$={source:$$[$0-4+2-1],guard:$$[$0-4+4-1]};break;case 154:this.$={source:$$[$0-4+2-1],guard:$$[$0-4+4-1],object:true};break;case 155:this.$={source:$$[$0-4+2-1],step:$$[$0-4+4-1]};break;case 156:this.$={source:$$[$0-6+2-1],guard:$$[$0-6+4-1],step:$$[$0-6+6-1]};break;case 157:this.$={source:$$[$0-6+2-1],step:$$[$0-6+4-1],guard:$$[$0-6+6-1]};break;case 158:this.$=$$[$0-5+4-1].switchesOver($$[$0-5+2-1]);break;case 159:this.$=$$[$0-7+4-1].switchesOver($$[$0-7+2-1]).addElse($$[$0-7+6-1],true);break;case 160:this.$=$$[$0-4+3-1];break;case 161:this.$=$$[$0-6+3-1].addElse($$[$0-6+5-1],true);break;case 162:this.$=$$[$0-1+1-1];break;case 163:this.$=$$[$0-2+1-1].addElse($$[$0-2+2-1]);break;case 164:this.$=new IfNode($$[$0-3+2-1],$$[$0-3+3-1],{statement:true});break;case 165:this.$=new IfNode($$[$0-4+2-1],$$[$0-4+3-1],{statement:true});break;case 166:this.$=new IfNode($$[$0-3+2-1],$$[$0-3+3-1]);break;case 167:this.$=new IfNode($$[$0-3+2-1],$$[$0-3+3-1],{invert:true});break;case 168:this.$=$$[$0-5+1-1].addElse((new IfNode($$[$0-5+4-1],$$[$0-5+5-1])).forceStatement());break;case 169:this.$=$$[$0-3+1-1].addElse($$[$0-3+3-1]);break;case 170:this.$=$$[$0-1+1-1];break;case 171:this.$=new IfNode($$[$0-3+3-1],Expressions.wrap([$$[$0-3+1-1]]),{statement:true});break;case 172:this.$=new IfNode($$[$0-3+3-1],Expressions.wrap([$$[$0-3+1-1]]),{statement:true});break;case 173:this.$=new IfNode($$[$0-3+3-1],Expressions.wrap([$$[$0-3+1-1]]),{statement:true,invert:true});break;case 174:this.$=new IfNode($$[$0-3+3-1],Expressions.wrap([$$[$0-3+1-1]]),{statement:true,invert:true});break;case 175:this.$=new OpNode("!",$$[$0-2+2-1]);break;case 176:this.$=new OpNode("!!",$$[$0-2+2-1]);break;case 177:this.$=new OpNode("-",$$[$0-2+2-1]);break;case 178:this.$=new OpNode("+",$$[$0-2+2-1]);break;case 179:this.$=new OpNode("~",$$[$0-2+2-1]);break;case 180:this.$=new OpNode("--",$$[$0-2+2-1]);break;case 181:this.$=new OpNode("++",$$[$0-2+2-1]);break;case 182:this.$=new OpNode("delete",$$[$0-2+2-1]);break;case 183:this.$=new OpNode("typeof",$$[$0-2+2-1]);break;case 184:this.$=new OpNode("--",$$[$0-2+1-1],null,true);break;case 185:this.$=new OpNode("++",$$[$0-2+1-1],null,true);break;case 186:this.$=new OpNode("*",$$[$0-3+1-1],$$[$0-3+3-1]);break;case 187:this.$=new OpNode("/",$$[$0-3+1-1],$$[$0-3+3-1]);break;case 188:this.$=new OpNode("%",$$[$0-3+1-1],$$[$0-3+3-1]);break;case 189:this.$=new OpNode("+",$$[$0-3+1-1],$$[$0-3+3-1]);break;case 190:this.$=new OpNode("-",$$[$0-3+1-1],$$[$0-3+3-1]);break;case 191:this.$=new OpNode("<<",$$[$0-3+1-1],$$[$0-3+3-1]);break;case 192:this.$=new OpNode(">>",$$[$0-3+1-1],$$[$0-3+3-1]);break;case 193:this.$=new OpNode(">>>",$$[$0-3+1-1],$$[$0-3+3-1]);break;case 194:this.$=new OpNode("&",$$[$0-3+1-1],$$[$0-3+3-1]);break;case 195:this.$=new OpNode("|",$$[$0-3+1-1],$$[$0-3+3-1]);break;case 196:this.$=new OpNode("^",$$[$0-3+1-1],$$[$0-3+3-1]);break;case 197:this.$=new OpNode("<=",$$[$0-3+1-1],$$[$0-3+3-1]);break;case 198:this.$=new OpNode("<",$$[$0-3+1-1],$$[$0-3+3-1]);break;case 199:this.$=new OpNode(">",$$[$0-3+1-1],$$[$0-3+3-1]);break;case 200:this.$=new OpNode(">=",$$[$0-3+1-1],$$[$0-3+3-1]);break;case 201:this.$=new OpNode("==",$$[$0-3+1-1],$$[$0-3+3-1]);break;case 202:this.$=new OpNode("!=",$$[$0-3+1-1],$$[$0-3+3-1]);break;case 203:this.$=new OpNode("&&",$$[$0-3+1-1],$$[$0-3+3-1]);break;case 204:this.$=new OpNode("||",$$[$0-3+1-1],$$[$0-3+3-1]);break;case 205:this.$=new OpNode("?",$$[$0-3+1-1],$$[$0-3+3-1]);break;case 206:this.$=new OpNode("-=",$$[$0-3+1-1],$$[$0-3+3-1]);break;case 207:this.$=new OpNode("+=",$$[$0-3+1-1],$$[$0-3+3-1]);break;case 208:this.$=new OpNode("/=",$$[$0-3+1-1],$$[$0-3+3-1]);break;case 209:this.$=new OpNode("*=",$$[$0-3+1-1],$$[$0-3+3-1]);break;case 210:this.$=new OpNode("%=",$$[$0-3+1-1],$$[$0-3+3-1]);break;case 211:this.$=new OpNode("||=",$$[$0-3+1-1],$$[$0-3+3-1]);break;case 212:this.$=new OpNode("&&=",$$[$0-3+1-1],$$[$0-3+3-1]);break;case 213:this.$=new OpNode("?=",$$[$0-3+1-1],$$[$0-3+3-1]);break;case 214:this.$=new OpNode("instanceof",$$[$0-3+1-1],$$[$0-3+3-1]);break;case 215:this.$=new InNode($$[$0-3+1-1],$$[$0-3+3-1]);break;case 216:this.$=new OpNode("in",$$[$0-3+1-1],$$[$0-3+3-1]);break;case 217:this.$=new OpNode("!",new InNode($$[$0-4+1-1],$$[$0-4+4-1]));break;case 218:this.$=new OpNode("!",new ParentheticalNode(new OpNode("in",$$[$0-4+1-1],$$[$0-4+4-1])));break}},table:[{"1":[2,1],"3":1,"4":[1,2],"5":3,"6":4,"7":5,"8":7,"9":8,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"29":[1,6],"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"1":[3]},{"1":[2,2],"28":88,"49":[1,56]},{"1":[2,3],"4":[1,89]},{"4":[1,90]},{"1":[2,5],"4":[2,5],"30":[2,5]},{"5":91,"7":5,"8":7,"9":8,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"30":[1,92],"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"1":[2,8],"4":[2,8],"30":[2,8],"50":[1,132],"61":[1,131],"107":[2,8],"108":129,"109":[1,79],"111":[1,80],"114":[1,130],"118":[1,124],"119":[1,125],"127":[1,127],"128":[1,128],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[1,100],"142":[1,101],"143":[1,102],"144":[1,103],"145":[1,104],"146":[1,105],"147":[1,106],"148":[1,107],"149":[1,108],"150":[1,109],"151":[1,110],"152":[1,111],"153":[1,112],"154":[1,113],"155":[1,114],"156":[1,115],"157":[1,116],"158":[1,117],"159":[1,118],"160":[1,119],"161":[1,120],"162":[1,121],"163":[1,122],"164":[1,123]},{"1":[2,9],"4":[2,9],"30":[2,9],"107":[2,9],"108":135,"109":[1,79],"111":[1,80],"114":[1,136],"127":[1,133],"128":[1,134]},{"1":[2,14],"4":[2,14],"29":[2,14],"30":[2,14],"50":[2,14],"58":[2,14],"61":[2,14],"63":138,"72":[1,140],"73":[1,141],"74":[1,142],"75":[1,143],"76":144,"77":145,"78":[1,146],"79":[2,14],"80":[1,147],"81":[1,148],"84":[2,14],"91":137,"92":[1,139],"94":[2,14],"99":[2,14],"107":[2,14],"109":[2,14],"110":[2,14],"111":[2,14],"114":[2,14],"118":[2,14],"119":[2,14],"120":[2,14],"127":[2,14],"128":[2,14],"129":[2,14],"131":[2,14],"132":[2,14],"134":[2,14],"135":[2,14],"138":[2,14],"139":[2,14],"140":[2,14],"141":[2,14],"142":[2,14],"143":[2,14],"144":[2,14],"145":[2,14],"146":[2,14],"147":[2,14],"148":[2,14],"149":[2,14],"150":[2,14],"151":[2,14],"152":[2,14],"153":[2,14],"154":[2,14],"155":[2,14],"156":[2,14],"157":[2,14],"158":[2,14],"159":[2,14],"160":[2,14],"161":[2,14],"162":[2,14],"163":[2,14],"164":[2,14]},{"1":[2,15],"4":[2,15],"29":[2,15],"30":[2,15],"50":[2,15],"58":[2,15],"61":[2,15],"79":[2,15],"84":[2,15],"94":[2,15],"99":[2,15],"107":[2,15],"109":[2,15],"110":[2,15],"111":[2,15],"114":[2,15],"118":[2,15],"119":[2,15],"120":[2,15],"127":[2,15],"128":[2,15],"129":[2,15],"131":[2,15],"132":[2,15],"134":[2,15],"135":[2,15],"138":[2,15],"139":[2,15],"140":[2,15],"141":[2,15],"142":[2,15],"143":[2,15],"144":[2,15],"145":[2,15],"146":[2,15],"147":[2,15],"148":[2,15],"149":[2,15],"150":[2,15],"151":[2,15],"152":[2,15],"153":[2,15],"154":[2,15],"155":[2,15],"156":[2,15],"157":[2,15],"158":[2,15],"159":[2,15],"160":[2,15],"161":[2,15],"162":[2,15],"163":[2,15],"164":[2,15]},{"1":[2,16],"4":[2,16],"29":[2,16],"30":[2,16],"50":[2,16],"58":[2,16],"61":[2,16],"79":[2,16],"84":[2,16],"94":[2,16],"99":[2,16],"107":[2,16],"109":[2,16],"110":[2,16],"111":[2,16],"114":[2,16],"118":[2,16],"119":[2,16],"120":[2,16],"127":[2,16],"128":[2,16],"129":[2,16],"131":[2,16],"132":[2,16],"134":[2,16],"135":[2,16],"138":[2,16],"139":[2,16],"140":[2,16],"141":[2,16],"142":[2,16],"143":[2,16],"144":[2,16],"145":[2,16],"146":[2,16],"147":[2,16],"148":[2,16],"149":[2,16],"150":[2,16],"151":[2,16],"152":[2,16],"153":[2,16],"154":[2,16],"155":[2,16],"156":[2,16],"157":[2,16],"158":[2,16],"159":[2,16],"160":[2,16],"161":[2,16],"162":[2,16],"163":[2,16],"164":[2,16]},{"1":[2,17],"4":[2,17],"29":[2,17],"30":[2,17],"50":[2,17],"58":[2,17],"61":[2,17],"79":[2,17],"84":[2,17],"94":[2,17],"99":[2,17],"107":[2,17],"109":[2,17],"110":[2,17],"111":[2,17],"114":[2,17],"118":[2,17],"119":[2,17],"120":[2,17],"127":[2,17],"128":[2,17],"129":[2,17],"131":[2,17],"132":[2,17],"134":[2,17],"135":[2,17],"138":[2,17],"139":[2,17],"140":[2,17],"141":[2,17],"142":[2,17],"143":[2,17],"144":[2,17],"145":[2,17],"146":[2,17],"147":[2,17],"148":[2,17],"149":[2,17],"150":[2,17],"151":[2,17],"152":[2,17],"153":[2,17],"154":[2,17],"155":[2,17],"156":[2,17],"157":[2,17],"158":[2,17],"159":[2,17],"160":[2,17],"161":[2,17],"162":[2,17],"163":[2,17],"164":[2,17]},{"1":[2,18],"4":[2,18],"29":[2,18],"30":[2,18],"50":[2,18],"58":[2,18],"61":[2,18],"79":[2,18],"84":[2,18],"94":[2,18],"99":[2,18],"107":[2,18],"109":[2,18],"110":[2,18],"111":[2,18],"114":[2,18],"118":[2,18],"119":[2,18],"120":[2,18],"127":[2,18],"128":[2,18],"129":[2,18],"131":[2,18],"132":[2,18],"134":[2,18],"135":[2,18],"138":[2,18],"139":[2,18],"140":[2,18],"141":[2,18],"142":[2,18],"143":[2,18],"144":[2,18],"145":[2,18],"146":[2,18],"147":[2,18],"148":[2,18],"149":[2,18],"150":[2,18],"151":[2,18],"152":[2,18],"153":[2,18],"154":[2,18],"155":[2,18],"156":[2,18],"157":[2,18],"158":[2,18],"159":[2,18],"160":[2,18],"161":[2,18],"162":[2,18],"163":[2,18],"164":[2,18]},{"1":[2,19],"4":[2,19],"29":[2,19],"30":[2,19],"50":[2,19],"58":[2,19],"61":[2,19],"79":[2,19],"84":[2,19],"94":[2,19],"99":[2,19],"107":[2,19],"109":[2,19],"110":[2,19],"111":[2,19],"114":[2,19],"118":[2,19],"119":[2,19],"120":[2,19],"127":[2,19],"128":[2,19],"129":[2,19],"131":[2,19],"132":[2,19],"134":[2,19],"135":[2,19],"138":[2,19],"139":[2,19],"140":[2,19],"141":[2,19],"142":[2,19],"143":[2,19],"144":[2,19],"145":[2,19],"146":[2,19],"147":[2,19],"148":[2,19],"149":[2,19],"150":[2,19],"151":[2,19],"152":[2,19],"153":[2,19],"154":[2,19],"155":[2,19],"156":[2,19],"157":[2,19],"158":[2,19],"159":[2,19],"160":[2,19],"161":[2,19],"162":[2,19],"163":[2,19],"164":[2,19]},{"1":[2,20],"4":[2,20],"29":[2,20],"30":[2,20],"50":[2,20],"58":[2,20],"61":[2,20],"79":[2,20],"84":[2,20],"94":[2,20],"99":[2,20],"107":[2,20],"109":[2,20],"110":[2,20],"111":[2,20],"114":[2,20],"118":[2,20],"119":[2,20],"120":[2,20],"127":[2,20],"128":[2,20],"129":[2,20],"131":[2,20],"132":[2,20],"134":[2,20],"135":[2,20],"138":[2,20],"139":[2,20],"140":[2,20],"141":[2,20],"142":[2,20],"143":[2,20],"144":[2,20],"145":[2,20],"146":[2,20],"147":[2,20],"148":[2,20],"149":[2,20],"150":[2,20],"151":[2,20],"152":[2,20],"153":[2,20],"154":[2,20],"155":[2,20],"156":[2,20],"157":[2,20],"158":[2,20],"159":[2,20],"160":[2,20],"161":[2,20],"162":[2,20],"163":[2,20],"164":[2,20]},{"1":[2,21],"4":[2,21],"29":[2,21],"30":[2,21],"50":[2,21],"58":[2,21],"61":[2,21],"79":[2,21],"84":[2,21],"94":[2,21],"99":[2,21],"107":[2,21],"109":[2,21],"110":[2,21],"111":[2,21],"114":[2,21],"118":[2,21],"119":[2,21],"120":[2,21],"127":[2,21],"128":[2,21],"129":[2,21],"131":[2,21],"132":[2,21],"134":[2,21],"135":[2,21],"138":[2,21],"139":[2,21],"140":[2,21],"141":[2,21],"142":[2,21],"143":[2,21],"144":[2,21],"145":[2,21],"146":[2,21],"147":[2,21],"148":[2,21],"149":[2,21],"150":[2,21],"151":[2,21],"152":[2,21],"153":[2,21],"154":[2,21],"155":[2,21],"156":[2,21],"157":[2,21],"158":[2,21],"159":[2,21],"160":[2,21],"161":[2,21],"162":[2,21],"163":[2,21],"164":[2,21]},{"1":[2,22],"4":[2,22],"29":[2,22],"30":[2,22],"50":[2,22],"58":[2,22],"61":[2,22],"79":[2,22],"84":[2,22],"94":[2,22],"99":[2,22],"107":[2,22],"109":[2,22],"110":[2,22],"111":[2,22],"114":[2,22],"118":[2,22],"119":[2,22],"120":[2,22],"127":[2,22],"128":[2,22],"129":[2,22],"131":[2,22],"132":[2,22],"134":[2,22],"135":[2,22],"138":[2,22],"139":[2,22],"140":[2,22],"141":[2,22],"142":[2,22],"143":[2,22],"144":[2,22],"145":[2,22],"146":[2,22],"147":[2,22],"148":[2,22],"149":[2,22],"150":[2,22],"151":[2,22],"152":[2,22],"153":[2,22],"154":[2,22],"155":[2,22],"156":[2,22],"157":[2,22],"158":[2,22],"159":[2,22],"160":[2,22],"161":[2,22],"162":[2,22],"163":[2,22],"164":[2,22]},{"1":[2,23],"4":[2,23],"29":[2,23],"30":[2,23],"50":[2,23],"58":[2,23],"61":[2,23],"79":[2,23],"84":[2,23],"94":[2,23],"99":[2,23],"107":[2,23],"109":[2,23],"110":[2,23],"111":[2,23],"114":[2,23],"118":[2,23],"119":[2,23],"120":[2,23],"127":[2,23],"128":[2,23],"129":[2,23],"131":[2,23],"132":[2,23],"134":[2,23],"135":[2,23],"138":[2,23],"139":[2,23],"140":[2,23],"141":[2,23],"142":[2,23],"143":[2,23],"144":[2,23],"145":[2,23],"146":[2,23],"147":[2,23],"148":[2,23],"149":[2,23],"150":[2,23],"151":[2,23],"152":[2,23],"153":[2,23],"154":[2,23],"155":[2,23],"156":[2,23],"157":[2,23],"158":[2,23],"159":[2,23],"160":[2,23],"161":[2,23],"162":[2,23],"163":[2,23],"164":[2,23]},{"1":[2,24],"4":[2,24],"29":[2,24],"30":[2,24],"50":[2,24],"58":[2,24],"61":[2,24],"79":[2,24],"84":[2,24],"94":[2,24],"99":[2,24],"107":[2,24],"109":[2,24],"110":[2,24],"111":[2,24],"114":[2,24],"118":[2,24],"119":[2,24],"120":[2,24],"127":[2,24],"128":[2,24],"129":[2,24],"131":[2,24],"132":[2,24],"134":[2,24],"135":[2,24],"138":[2,24],"139":[2,24],"140":[2,24],"141":[2,24],"142":[2,24],"143":[2,24],"144":[2,24],"145":[2,24],"146":[2,24],"147":[2,24],"148":[2,24],"149":[2,24],"150":[2,24],"151":[2,24],"152":[2,24],"153":[2,24],"154":[2,24],"155":[2,24],"156":[2,24],"157":[2,24],"158":[2,24],"159":[2,24],"160":[2,24],"161":[2,24],"162":[2,24],"163":[2,24],"164":[2,24]},{"1":[2,25],"4":[2,25],"29":[2,25],"30":[2,25],"50":[2,25],"58":[2,25],"61":[2,25],"79":[2,25],"84":[2,25],"94":[2,25],"99":[2,25],"107":[2,25],"109":[2,25],"110":[2,25],"111":[2,25],"114":[2,25],"118":[2,25],"119":[2,25],"120":[2,25],"127":[2,25],"128":[2,25],"129":[2,25],"131":[2,25],"132":[2,25],"134":[2,25],"135":[2,25],"138":[2,25],"139":[2,25],"140":[2,25],"141":[2,25],"142":[2,25],"143":[2,25],"144":[2,25],"145":[2,25],"146":[2,25],"147":[2,25],"148":[2,25],"149":[2,25],"150":[2,25],"151":[2,25],"152":[2,25],"153":[2,25],"154":[2,25],"155":[2,25],"156":[2,25],"157":[2,25],"158":[2,25],"159":[2,25],"160":[2,25],"161":[2,25],"162":[2,25],"163":[2,25],"164":[2,25]},{"1":[2,26],"4":[2,26],"29":[2,26],"30":[2,26],"50":[2,26],"58":[2,26],"61":[2,26],"79":[2,26],"84":[2,26],"94":[2,26],"99":[2,26],"107":[2,26],"109":[2,26],"110":[2,26],"111":[2,26],"114":[2,26],"118":[2,26],"119":[2,26],"120":[2,26],"127":[2,26],"128":[2,26],"129":[2,26],"131":[2,26],"132":[2,26],"134":[2,26],"135":[2,26],"138":[2,26],"139":[2,26],"140":[2,26],"141":[2,26],"142":[2,26],"143":[2,26],"144":[2,26],"145":[2,26],"146":[2,26],"147":[2,26],"148":[2,26],"149":[2,26],"150":[2,26],"151":[2,26],"152":[2,26],"153":[2,26],"154":[2,26],"155":[2,26],"156":[2,26],"157":[2,26],"158":[2,26],"159":[2,26],"160":[2,26],"161":[2,26],"162":[2,26],"163":[2,26],"164":[2,26]},{"1":[2,27],"4":[2,27],"29":[2,27],"30":[2,27],"50":[2,27],"58":[2,27],"61":[2,27],"79":[2,27],"84":[2,27],"94":[2,27],"99":[2,27],"107":[2,27],"109":[2,27],"110":[2,27],"111":[2,27],"114":[2,27],"118":[2,27],"119":[2,27],"120":[2,27],"127":[2,27],"128":[2,27],"129":[2,27],"131":[2,27],"132":[2,27],"134":[2,27],"135":[2,27],"138":[2,27],"139":[2,27],"140":[2,27],"141":[2,27],"142":[2,27],"143":[2,27],"144":[2,27],"145":[2,27],"146":[2,27],"147":[2,27],"148":[2,27],"149":[2,27],"150":[2,27],"151":[2,27],"152":[2,27],"153":[2,27],"154":[2,27],"155":[2,27],"156":[2,27],"157":[2,27],"158":[2,27],"159":[2,27],"160":[2,27],"161":[2,27],"162":[2,27],"163":[2,27],"164":[2,27]},{"1":[2,28],"4":[2,28],"29":[2,28],"30":[2,28],"50":[2,28],"58":[2,28],"61":[2,28],"79":[2,28],"84":[2,28],"94":[2,28],"99":[2,28],"107":[2,28],"109":[2,28],"110":[2,28],"111":[2,28],"114":[2,28],"118":[2,28],"119":[2,28],"120":[2,28],"127":[2,28],"128":[2,28],"129":[2,28],"131":[2,28],"132":[2,28],"134":[2,28],"135":[2,28],"138":[2,28],"139":[2,28],"140":[2,28],"141":[2,28],"142":[2,28],"143":[2,28],"144":[2,28],"145":[2,28],"146":[2,28],"147":[2,28],"148":[2,28],"149":[2,28],"150":[2,28],"151":[2,28],"152":[2,28],"153":[2,28],"154":[2,28],"155":[2,28],"156":[2,28],"157":[2,28],"158":[2,28],"159":[2,28],"160":[2,28],"161":[2,28],"162":[2,28],"163":[2,28],"164":[2,28]},{"1":[2,10],"4":[2,10],"30":[2,10],"107":[2,10],"109":[2,10],"111":[2,10],"114":[2,10],"127":[2,10],"128":[2,10]},{"1":[2,11],"4":[2,11],"30":[2,11],"107":[2,11],"109":[2,11],"111":[2,11],"114":[2,11],"127":[2,11],"128":[2,11]},{"1":[2,12],"4":[2,12],"30":[2,12],"107":[2,12],"109":[2,12],"111":[2,12],"114":[2,12],"127":[2,12],"128":[2,12]},{"1":[2,13],"4":[2,13],"30":[2,13],"107":[2,13],"109":[2,13],"111":[2,13],"114":[2,13],"127":[2,13],"128":[2,13]},{"1":[2,73],"4":[2,73],"29":[2,73],"30":[2,73],"46":[1,149],"50":[2,73],"58":[2,73],"61":[2,73],"72":[2,73],"73":[2,73],"74":[2,73],"75":[2,73],"78":[2,73],"79":[2,73],"80":[2,73],"81":[2,73],"84":[2,73],"92":[2,73],"94":[2,73],"99":[2,73],"107":[2,73],"109":[2,73],"110":[2,73],"111":[2,73],"114":[2,73],"118":[2,73],"119":[2,73],"120":[2,73],"127":[2,73],"128":[2,73],"129":[2,73],"131":[2,73],"132":[2,73],"134":[2,73],"135":[2,73],"138":[2,73],"139":[2,73],"140":[2,73],"141":[2,73],"142":[2,73],"143":[2,73],"144":[2,73],"145":[2,73],"146":[2,73],"147":[2,73],"148":[2,73],"149":[2,73],"150":[2,73],"151":[2,73],"152":[2,73],"153":[2,73],"154":[2,73],"155":[2,73],"156":[2,73],"157":[2,73],"158":[2,73],"159":[2,73],"160":[2,73],"161":[2,73],"162":[2,73],"163":[2,73],"164":[2,73]},{"1":[2,74],"4":[2,74],"29":[2,74],"30":[2,74],"50":[2,74],"58":[2,74],"61":[2,74],"72":[2,74],"73":[2,74],"74":[2,74],"75":[2,74],"78":[2,74],"79":[2,74],"80":[2,74],"81":[2,74],"84":[2,74],"92":[2,74],"94":[2,74],"99":[2,74],"107":[2,74],"109":[2,74],"110":[2,74],"111":[2,74],"114":[2,74],"118":[2,74],"119":[2,74],"120":[2,74],"127":[2,74],"128":[2,74],"129":[2,74],"131":[2,74],"132":[2,74],"134":[2,74],"135":[2,74],"138":[2,74],"139":[2,74],"140":[2,74],"141":[2,74],"142":[2,74],"143":[2,74],"144":[2,74],"145":[2,74],"146":[2,74],"147":[2,74],"148":[2,74],"149":[2,74],"150":[2,74],"151":[2,74],"152":[2,74],"153":[2,74],"154":[2,74],"155":[2,74],"156":[2,74],"157":[2,74],"158":[2,74],"159":[2,74],"160":[2,74],"161":[2,74],"162":[2,74],"163":[2,74],"164":[2,74]},{"1":[2,75],"4":[2,75],"29":[2,75],"30":[2,75],"50":[2,75],"58":[2,75],"61":[2,75],"72":[2,75],"73":[2,75],"74":[2,75],"75":[2,75],"78":[2,75],"79":[2,75],"80":[2,75],"81":[2,75],"84":[2,75],"92":[2,75],"94":[2,75],"99":[2,75],"107":[2,75],"109":[2,75],"110":[2,75],"111":[2,75],"114":[2,75],"118":[2,75],"119":[2,75],"120":[2,75],"127":[2,75],"128":[2,75],"129":[2,75],"131":[2,75],"132":[2,75],"134":[2,75],"135":[2,75],"138":[2,75],"139":[2,75],"140":[2,75],"141":[2,75],"142":[2,75],"143":[2,75],"144":[2,75],"145":[2,75],"146":[2,75],"147":[2,75],"148":[2,75],"149":[2,75],"150":[2,75],"151":[2,75],"152":[2,75],"153":[2,75],"154":[2,75],"155":[2,75],"156":[2,75],"157":[2,75],"158":[2,75],"159":[2,75],"160":[2,75],"161":[2,75],"162":[2,75],"163":[2,75],"164":[2,75]},{"1":[2,76],"4":[2,76],"29":[2,76],"30":[2,76],"50":[2,76],"58":[2,76],"61":[2,76],"72":[2,76],"73":[2,76],"74":[2,76],"75":[2,76],"78":[2,76],"79":[2,76],"80":[2,76],"81":[2,76],"84":[2,76],"92":[2,76],"94":[2,76],"99":[2,76],"107":[2,76],"109":[2,76],"110":[2,76],"111":[2,76],"114":[2,76],"118":[2,76],"119":[2,76],"120":[2,76],"127":[2,76],"128":[2,76],"129":[2,76],"131":[2,76],"132":[2,76],"134":[2,76],"135":[2,76],"138":[2,76],"139":[2,76],"140":[2,76],"141":[2,76],"142":[2,76],"143":[2,76],"144":[2,76],"145":[2,76],"146":[2,76],"147":[2,76],"148":[2,76],"149":[2,76],"150":[2,76],"151":[2,76],"152":[2,76],"153":[2,76],"154":[2,76],"155":[2,76],"156":[2,76],"157":[2,76],"158":[2,76],"159":[2,76],"160":[2,76],"161":[2,76],"162":[2,76],"163":[2,76],"164":[2,76]},{"1":[2,77],"4":[2,77],"29":[2,77],"30":[2,77],"50":[2,77],"58":[2,77],"61":[2,77],"72":[2,77],"73":[2,77],"74":[2,77],"75":[2,77],"78":[2,77],"79":[2,77],"80":[2,77],"81":[2,77],"84":[2,77],"92":[2,77],"94":[2,77],"99":[2,77],"107":[2,77],"109":[2,77],"110":[2,77],"111":[2,77],"114":[2,77],"118":[2,77],"119":[2,77],"120":[2,77],"127":[2,77],"128":[2,77],"129":[2,77],"131":[2,77],"132":[2,77],"134":[2,77],"135":[2,77],"138":[2,77],"139":[2,77],"140":[2,77],"141":[2,77],"142":[2,77],"143":[2,77],"144":[2,77],"145":[2,77],"146":[2,77],"147":[2,77],"148":[2,77],"149":[2,77],"150":[2,77],"151":[2,77],"152":[2,77],"153":[2,77],"154":[2,77],"155":[2,77],"156":[2,77],"157":[2,77],"158":[2,77],"159":[2,77],"160":[2,77],"161":[2,77],"162":[2,77],"163":[2,77],"164":[2,77]},{"1":[2,78],"4":[2,78],"29":[2,78],"30":[2,78],"50":[2,78],"58":[2,78],"61":[2,78],"72":[2,78],"73":[2,78],"74":[2,78],"75":[2,78],"78":[2,78],"79":[2,78],"80":[2,78],"81":[2,78],"84":[2,78],"92":[2,78],"94":[2,78],"99":[2,78],"107":[2,78],"109":[2,78],"110":[2,78],"111":[2,78],"114":[2,78],"118":[2,78],"119":[2,78],"120":[2,78],"127":[2,78],"128":[2,78],"129":[2,78],"131":[2,78],"132":[2,78],"134":[2,78],"135":[2,78],"138":[2,78],"139":[2,78],"140":[2,78],"141":[2,78],"142":[2,78],"143":[2,78],"144":[2,78],"145":[2,78],"146":[2,78],"147":[2,78],"148":[2,78],"149":[2,78],"150":[2,78],"151":[2,78],"152":[2,78],"153":[2,78],"154":[2,78],"155":[2,78],"156":[2,78],"157":[2,78],"158":[2,78],"159":[2,78],"160":[2,78],"161":[2,78],"162":[2,78],"163":[2,78],"164":[2,78]},{"1":[2,103],"4":[2,103],"29":[2,103],"30":[2,103],"50":[2,103],"58":[2,103],"61":[2,103],"63":151,"72":[1,140],"73":[1,141],"74":[1,142],"75":[1,143],"76":144,"77":145,"78":[1,146],"79":[2,103],"80":[1,147],"81":[1,148],"84":[2,103],"91":150,"92":[1,139],"94":[2,103],"99":[2,103],"107":[2,103],"109":[2,103],"110":[2,103],"111":[2,103],"114":[2,103],"118":[2,103],"119":[2,103],"120":[2,103],"127":[2,103],"128":[2,103],"129":[2,103],"131":[2,103],"132":[2,103],"134":[2,103],"135":[2,103],"138":[2,103],"139":[2,103],"140":[2,103],"141":[2,103],"142":[2,103],"143":[2,103],"144":[2,103],"145":[2,103],"146":[2,103],"147":[2,103],"148":[2,103],"149":[2,103],"150":[2,103],"151":[2,103],"152":[2,103],"153":[2,103],"154":[2,103],"155":[2,103],"156":[2,103],"157":[2,103],"158":[2,103],"159":[2,103],"160":[2,103],"161":[2,103],"162":[2,103],"163":[2,103],"164":[2,103]},{"1":[2,104],"4":[2,104],"29":[2,104],"30":[2,104],"50":[2,104],"58":[2,104],"61":[2,104],"79":[2,104],"84":[2,104],"94":[2,104],"99":[2,104],"107":[2,104],"109":[2,104],"110":[2,104],"111":[2,104],"114":[2,104],"118":[2,104],"119":[2,104],"120":[2,104],"127":[2,104],"128":[2,104],"129":[2,104],"131":[2,104],"132":[2,104],"134":[2,104],"135":[2,104],"138":[2,104],"139":[2,104],"140":[2,104],"141":[2,104],"142":[2,104],"143":[2,104],"144":[2,104],"145":[2,104],"146":[2,104],"147":[2,104],"148":[2,104],"149":[2,104],"150":[2,104],"151":[2,104],"152":[2,104],"153":[2,104],"154":[2,104],"155":[2,104],"156":[2,104],"157":[2,104],"158":[2,104],"159":[2,104],"160":[2,104],"161":[2,104],"162":[2,104],"163":[2,104],"164":[2,104]},{"14":153,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":154,"62":155,"64":152,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"96":[1,72],"97":[1,73],"98":[1,71],"106":[1,70]},{"52":156,"53":[2,60],"58":[2,60],"59":157,"60":[1,158]},{"4":[1,160],"6":159,"29":[1,6]},{"8":161,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"8":163,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"8":164,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"8":165,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"8":166,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"8":167,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"8":168,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"8":169,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"8":170,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"1":[2,170],"4":[2,170],"29":[2,170],"30":[2,170],"50":[2,170],"58":[2,170],"61":[2,170],"79":[2,170],"84":[2,170],"94":[2,170],"99":[2,170],"107":[2,170],"109":[2,170],"110":[2,170],"111":[2,170],"114":[2,170],"118":[2,170],"119":[2,170],"120":[2,170],"123":[1,171],"127":[2,170],"128":[2,170],"129":[2,170],"131":[2,170],"132":[2,170],"134":[2,170],"135":[2,170],"138":[2,170],"139":[2,170],"140":[2,170],"141":[2,170],"142":[2,170],"143":[2,170],"144":[2,170],"145":[2,170],"146":[2,170],"147":[2,170],"148":[2,170],"149":[2,170],"150":[2,170],"151":[2,170],"152":[2,170],"153":[2,170],"154":[2,170],"155":[2,170],"156":[2,170],"157":[2,170],"158":[2,170],"159":[2,170],"160":[2,170],"161":[2,170],"162":[2,170],"163":[2,170],"164":[2,170]},{"4":[1,160],"6":172,"29":[1,6]},{"4":[1,160],"6":173,"29":[1,6]},{"1":[2,140],"4":[2,140],"29":[2,140],"30":[2,140],"50":[2,140],"58":[2,140],"61":[2,140],"79":[2,140],"84":[2,140],"94":[2,140],"99":[2,140],"107":[2,140],"109":[2,140],"110":[2,140],"111":[2,140],"114":[2,140],"118":[2,140],"119":[2,140],"120":[2,140],"127":[2,140],"128":[2,140],"129":[2,140],"131":[2,140],"132":[2,140],"134":[2,140],"135":[2,140],"138":[2,140],"139":[2,140],"140":[2,140],"141":[2,140],"142":[2,140],"143":[2,140],"144":[2,140],"145":[2,140],"146":[2,140],"147":[2,140],"148":[2,140],"149":[2,140],"150":[2,140],"151":[2,140],"152":[2,140],"153":[2,140],"154":[2,140],"155":[2,140],"156":[2,140],"157":[2,140],"158":[2,140],"159":[2,140],"160":[2,140],"161":[2,140],"162":[2,140],"163":[2,140],"164":[2,140]},{"31":176,"32":[1,87],"66":177,"67":178,"82":[1,84],"98":[1,179],"115":174,"117":175},{"8":180,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"29":[1,181],"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"1":[2,70],"4":[2,70],"29":[2,70],"30":[2,70],"46":[2,70],"50":[2,70],"58":[2,70],"61":[2,70],"72":[2,70],"73":[2,70],"74":[2,70],"75":[2,70],"78":[2,70],"79":[2,70],"80":[2,70],"81":[2,70],"84":[2,70],"86":[1,182],"92":[2,70],"94":[2,70],"99":[2,70],"107":[2,70],"109":[2,70],"110":[2,70],"111":[2,70],"114":[2,70],"118":[2,70],"119":[2,70],"120":[2,70],"127":[2,70],"128":[2,70],"129":[2,70],"131":[2,70],"132":[2,70],"134":[2,70],"135":[2,70],"138":[2,70],"139":[2,70],"140":[2,70],"141":[2,70],"142":[2,70],"143":[2,70],"144":[2,70],"145":[2,70],"146":[2,70],"147":[2,70],"148":[2,70],"149":[2,70],"150":[2,70],"151":[2,70],"152":[2,70],"153":[2,70],"154":[2,70],"155":[2,70],"156":[2,70],"157":[2,70],"158":[2,70],"159":[2,70],"160":[2,70],"161":[2,70],"162":[2,70],"163":[2,70],"164":[2,70]},{"14":184,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":154,"62":183,"64":185,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"96":[1,72],"97":[1,73],"98":[1,71],"106":[1,70]},{"1":[2,52],"4":[2,52],"29":[2,52],"30":[2,52],"50":[2,52],"58":[2,52],"61":[2,52],"79":[2,52],"84":[2,52],"94":[2,52],"99":[2,52],"103":[2,52],"104":[2,52],"107":[2,52],"109":[2,52],"110":[2,52],"111":[2,52],"114":[2,52],"118":[2,52],"119":[2,52],"120":[2,52],"123":[2,52],"125":[2,52],"127":[2,52],"128":[2,52],"129":[2,52],"131":[2,52],"132":[2,52],"134":[2,52],"135":[2,52],"138":[2,52],"139":[2,52],"140":[2,52],"141":[2,52],"142":[2,52],"143":[2,52],"144":[2,52],"145":[2,52],"146":[2,52],"147":[2,52],"148":[2,52],"149":[2,52],"150":[2,52],"151":[2,52],"152":[2,52],"153":[2,52],"154":[2,52],"155":[2,52],"156":[2,52],"157":[2,52],"158":[2,52],"159":[2,52],"160":[2,52],"161":[2,52],"162":[2,52],"163":[2,52],"164":[2,52]},{"1":[2,51],"4":[2,51],"8":186,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"30":[2,51],"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"107":[2,51],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[2,51],"128":[2,51],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"8":187,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"1":[2,71],"4":[2,71],"29":[2,71],"30":[2,71],"46":[2,71],"50":[2,71],"58":[2,71],"61":[2,71],"72":[2,71],"73":[2,71],"74":[2,71],"75":[2,71],"78":[2,71],"79":[2,71],"80":[2,71],"81":[2,71],"84":[2,71],"92":[2,71],"94":[2,71],"99":[2,71],"107":[2,71],"109":[2,71],"110":[2,71],"111":[2,71],"114":[2,71],"118":[2,71],"119":[2,71],"120":[2,71],"127":[2,71],"128":[2,71],"129":[2,71],"131":[2,71],"132":[2,71],"134":[2,71],"135":[2,71],"138":[2,71],"139":[2,71],"140":[2,71],"141":[2,71],"142":[2,71],"143":[2,71],"144":[2,71],"145":[2,71],"146":[2,71],"147":[2,71],"148":[2,71],"149":[2,71],"150":[2,71],"151":[2,71],"152":[2,71],"153":[2,71],"154":[2,71],"155":[2,71],"156":[2,71],"157":[2,71],"158":[2,71],"159":[2,71],"160":[2,71],"161":[2,71],"162":[2,71],"163":[2,71],"164":[2,71]},{"1":[2,72],"4":[2,72],"29":[2,72],"30":[2,72],"46":[2,72],"50":[2,72],"58":[2,72],"61":[2,72],"72":[2,72],"73":[2,72],"74":[2,72],"75":[2,72],"78":[2,72],"79":[2,72],"80":[2,72],"81":[2,72],"84":[2,72],"92":[2,72],"94":[2,72],"99":[2,72],"107":[2,72],"109":[2,72],"110":[2,72],"111":[2,72],"114":[2,72],"118":[2,72],"119":[2,72],"120":[2,72],"127":[2,72],"128":[2,72],"129":[2,72],"131":[2,72],"132":[2,72],"134":[2,72],"135":[2,72],"138":[2,72],"139":[2,72],"140":[2,72],"141":[2,72],"142":[2,72],"143":[2,72],"144":[2,72],"145":[2,72],"146":[2,72],"147":[2,72],"148":[2,72],"149":[2,72],"150":[2,72],"151":[2,72],"152":[2,72],"153":[2,72],"154":[2,72],"155":[2,72],"156":[2,72],"157":[2,72],"158":[2,72],"159":[2,72],"160":[2,72],"161":[2,72],"162":[2,72],"163":[2,72],"164":[2,72]},{"1":[2,35],"4":[2,35],"29":[2,35],"30":[2,35],"50":[2,35],"58":[2,35],"61":[2,35],"72":[2,35],"73":[2,35],"74":[2,35],"75":[2,35],"78":[2,35],"79":[2,35],"80":[2,35],"81":[2,35],"84":[2,35],"92":[2,35],"94":[2,35],"99":[2,35],"107":[2,35],"109":[2,35],"110":[2,35],"111":[2,35],"114":[2,35],"118":[2,35],"119":[2,35],"120":[2,35],"127":[2,35],"128":[2,35],"129":[2,35],"131":[2,35],"132":[2,35],"134":[2,35],"135":[2,35],"138":[2,35],"139":[2,35],"140":[2,35],"141":[2,35],"142":[2,35],"143":[2,35],"144":[2,35],"145":[2,35],"146":[2,35],"147":[2,35],"148":[2,35],"149":[2,35],"150":[2,35],"151":[2,35],"152":[2,35],"153":[2,35],"154":[2,35],"155":[2,35],"156":[2,35],"157":[2,35],"158":[2,35],"159":[2,35],"160":[2,35],"161":[2,35],"162":[2,35],"163":[2,35],"164":[2,35]},{"1":[2,36],"4":[2,36],"29":[2,36],"30":[2,36],"50":[2,36],"58":[2,36],"61":[2,36],"72":[2,36],"73":[2,36],"74":[2,36],"75":[2,36],"78":[2,36],"79":[2,36],"80":[2,36],"81":[2,36],"84":[2,36],"92":[2,36],"94":[2,36],"99":[2,36],"107":[2,36],"109":[2,36],"110":[2,36],"111":[2,36],"114":[2,36],"118":[2,36],"119":[2,36],"120":[2,36],"127":[2,36],"128":[2,36],"129":[2,36],"131":[2,36],"132":[2,36],"134":[2,36],"135":[2,36],"138":[2,36],"139":[2,36],"140":[2,36],"141":[2,36],"142":[2,36],"143":[2,36],"144":[2,36],"145":[2,36],"146":[2,36],"147":[2,36],"148":[2,36],"149":[2,36],"150":[2,36],"151":[2,36],"152":[2,36],"153":[2,36],"154":[2,36],"155":[2,36],"156":[2,36],"157":[2,36],"158":[2,36],"159":[2,36],"160":[2,36],"161":[2,36],"162":[2,36],"163":[2,36],"164":[2,36]},{"1":[2,37],"4":[2,37],"29":[2,37],"30":[2,37],"50":[2,37],"58":[2,37],"61":[2,37],"72":[2,37],"73":[2,37],"74":[2,37],"75":[2,37],"78":[2,37],"79":[2,37],"80":[2,37],"81":[2,37],"84":[2,37],"92":[2,37],"94":[2,37],"99":[2,37],"107":[2,37],"109":[2,37],"110":[2,37],"111":[2,37],"114":[2,37],"118":[2,37],"119":[2,37],"120":[2,37],"127":[2,37],"128":[2,37],"129":[2,37],"131":[2,37],"132":[2,37],"134":[2,37],"135":[2,37],"138":[2,37],"139":[2,37],"140":[2,37],"141":[2,37],"142":[2,37],"143":[2,37],"144":[2,37],"145":[2,37],"146":[2,37],"147":[2,37],"148":[2,37],"149":[2,37],"150":[2,37],"151":[2,37],"152":[2,37],"153":[2,37],"154":[2,37],"155":[2,37],"156":[2,37],"157":[2,37],"158":[2,37],"159":[2,37],"160":[2,37],"161":[2,37],"162":[2,37],"163":[2,37],"164":[2,37]},{"1":[2,38],"4":[2,38],"29":[2,38],"30":[2,38],"50":[2,38],"58":[2,38],"61":[2,38],"72":[2,38],"73":[2,38],"74":[2,38],"75":[2,38],"78":[2,38],"79":[2,38],"80":[2,38],"81":[2,38],"84":[2,38],"92":[2,38],"94":[2,38],"99":[2,38],"107":[2,38],"109":[2,38],"110":[2,38],"111":[2,38],"114":[2,38],"118":[2,38],"119":[2,38],"120":[2,38],"127":[2,38],"128":[2,38],"129":[2,38],"131":[2,38],"132":[2,38],"134":[2,38],"135":[2,38],"138":[2,38],"139":[2,38],"140":[2,38],"141":[2,38],"142":[2,38],"143":[2,38],"144":[2,38],"145":[2,38],"146":[2,38],"147":[2,38],"148":[2,38],"149":[2,38],"150":[2,38],"151":[2,38],"152":[2,38],"153":[2,38],"154":[2,38],"155":[2,38],"156":[2,38],"157":[2,38],"158":[2,38],"159":[2,38],"160":[2,38],"161":[2,38],"162":[2,38],"163":[2,38],"164":[2,38]},{"1":[2,39],"4":[2,39],"29":[2,39],"30":[2,39],"50":[2,39],"58":[2,39],"61":[2,39],"72":[2,39],"73":[2,39],"74":[2,39],"75":[2,39],"78":[2,39],"79":[2,39],"80":[2,39],"81":[2,39],"84":[2,39],"92":[2,39],"94":[2,39],"99":[2,39],"107":[2,39],"109":[2,39],"110":[2,39],"111":[2,39],"114":[2,39],"118":[2,39],"119":[2,39],"120":[2,39],"127":[2,39],"128":[2,39],"129":[2,39],"131":[2,39],"132":[2,39],"134":[2,39],"135":[2,39],"138":[2,39],"139":[2,39],"140":[2,39],"141":[2,39],"142":[2,39],"143":[2,39],"144":[2,39],"145":[2,39],"146":[2,39],"147":[2,39],"148":[2,39],"149":[2,39],"150":[2,39],"151":[2,39],"152":[2,39],"153":[2,39],"154":[2,39],"155":[2,39],"156":[2,39],"157":[2,39],"158":[2,39],"159":[2,39],"160":[2,39],"161":[2,39],"162":[2,39],"163":[2,39],"164":[2,39]},{"1":[2,40],"4":[2,40],"29":[2,40],"30":[2,40],"50":[2,40],"58":[2,40],"61":[2,40],"72":[2,40],"73":[2,40],"74":[2,40],"75":[2,40],"78":[2,40],"79":[2,40],"80":[2,40],"81":[2,40],"84":[2,40],"92":[2,40],"94":[2,40],"99":[2,40],"107":[2,40],"109":[2,40],"110":[2,40],"111":[2,40],"114":[2,40],"118":[2,40],"119":[2,40],"120":[2,40],"127":[2,40],"128":[2,40],"129":[2,40],"131":[2,40],"132":[2,40],"134":[2,40],"135":[2,40],"138":[2,40],"139":[2,40],"140":[2,40],"141":[2,40],"142":[2,40],"143":[2,40],"144":[2,40],"145":[2,40],"146":[2,40],"147":[2,40],"148":[2,40],"149":[2,40],"150":[2,40],"151":[2,40],"152":[2,40],"153":[2,40],"154":[2,40],"155":[2,40],"156":[2,40],"157":[2,40],"158":[2,40],"159":[2,40],"160":[2,40],"161":[2,40],"162":[2,40],"163":[2,40],"164":[2,40]},{"1":[2,41],"4":[2,41],"29":[2,41],"30":[2,41],"50":[2,41],"58":[2,41],"61":[2,41],"72":[2,41],"73":[2,41],"74":[2,41],"75":[2,41],"78":[2,41],"79":[2,41],"80":[2,41],"81":[2,41],"84":[2,41],"92":[2,41],"94":[2,41],"99":[2,41],"107":[2,41],"109":[2,41],"110":[2,41],"111":[2,41],"114":[2,41],"118":[2,41],"119":[2,41],"120":[2,41],"127":[2,41],"128":[2,41],"129":[2,41],"131":[2,41],"132":[2,41],"134":[2,41],"135":[2,41],"138":[2,41],"139":[2,41],"140":[2,41],"141":[2,41],"142":[2,41],"143":[2,41],"144":[2,41],"145":[2,41],"146":[2,41],"147":[2,41],"148":[2,41],"149":[2,41],"150":[2,41],"151":[2,41],"152":[2,41],"153":[2,41],"154":[2,41],"155":[2,41],"156":[2,41],"157":[2,41],"158":[2,41],"159":[2,41],"160":[2,41],"161":[2,41],"162":[2,41],"163":[2,41],"164":[2,41]},{"1":[2,42],"4":[2,42],"29":[2,42],"30":[2,42],"50":[2,42],"58":[2,42],"61":[2,42],"72":[2,42],"73":[2,42],"74":[2,42],"75":[2,42],"78":[2,42],"79":[2,42],"80":[2,42],"81":[2,42],"84":[2,42],"92":[2,42],"94":[2,42],"99":[2,42],"107":[2,42],"109":[2,42],"110":[2,42],"111":[2,42],"114":[2,42],"118":[2,42],"119":[2,42],"120":[2,42],"127":[2,42],"128":[2,42],"129":[2,42],"131":[2,42],"132":[2,42],"134":[2,42],"135":[2,42],"138":[2,42],"139":[2,42],"140":[2,42],"141":[2,42],"142":[2,42],"143":[2,42],"144":[2,42],"145":[2,42],"146":[2,42],"147":[2,42],"148":[2,42],"149":[2,42],"150":[2,42],"151":[2,42],"152":[2,42],"153":[2,42],"154":[2,42],"155":[2,42],"156":[2,42],"157":[2,42],"158":[2,42],"159":[2,42],"160":[2,42],"161":[2,42],"162":[2,42],"163":[2,42],"164":[2,42]},{"1":[2,43],"4":[2,43],"29":[2,43],"30":[2,43],"50":[2,43],"58":[2,43],"61":[2,43],"72":[2,43],"73":[2,43],"74":[2,43],"75":[2,43],"78":[2,43],"79":[2,43],"80":[2,43],"81":[2,43],"84":[2,43],"92":[2,43],"94":[2,43],"99":[2,43],"107":[2,43],"109":[2,43],"110":[2,43],"111":[2,43],"114":[2,43],"118":[2,43],"119":[2,43],"120":[2,43],"127":[2,43],"128":[2,43],"129":[2,43],"131":[2,43],"132":[2,43],"134":[2,43],"135":[2,43],"138":[2,43],"139":[2,43],"140":[2,43],"141":[2,43],"142":[2,43],"143":[2,43],"144":[2,43],"145":[2,43],"146":[2,43],"147":[2,43],"148":[2,43],"149":[2,43],"150":[2,43],"151":[2,43],"152":[2,43],"153":[2,43],"154":[2,43],"155":[2,43],"156":[2,43],"157":[2,43],"158":[2,43],"159":[2,43],"160":[2,43],"161":[2,43],"162":[2,43],"163":[2,43],"164":[2,43]},{"7":188,"8":7,"9":8,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"4":[2,120],"8":189,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"29":[2,120],"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"58":[2,120],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"93":190,"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"99":[2,120],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"1":[2,112],"4":[2,112],"29":[2,112],"30":[2,112],"50":[2,112],"58":[2,112],"61":[2,112],"72":[2,112],"73":[2,112],"74":[2,112],"75":[2,112],"78":[2,112],"79":[2,112],"80":[2,112],"81":[2,112],"84":[2,112],"92":[2,112],"94":[2,112],"99":[2,112],"107":[2,112],"109":[2,112],"110":[2,112],"111":[2,112],"114":[2,112],"118":[2,112],"119":[2,112],"120":[2,112],"127":[2,112],"128":[2,112],"129":[2,112],"131":[2,112],"132":[2,112],"134":[2,112],"135":[2,112],"138":[2,112],"139":[2,112],"140":[2,112],"141":[2,112],"142":[2,112],"143":[2,112],"144":[2,112],"145":[2,112],"146":[2,112],"147":[2,112],"148":[2,112],"149":[2,112],"150":[2,112],"151":[2,112],"152":[2,112],"153":[2,112],"154":[2,112],"155":[2,112],"156":[2,112],"157":[2,112],"158":[2,112],"159":[2,112],"160":[2,112],"161":[2,112],"162":[2,112],"163":[2,112],"164":[2,112]},{"1":[2,113],"4":[2,113],"29":[2,113],"30":[2,113],"31":191,"32":[1,87],"50":[2,113],"58":[2,113],"61":[2,113],"72":[2,113],"73":[2,113],"74":[2,113],"75":[2,113],"78":[2,113],"79":[2,113],"80":[2,113],"81":[2,113],"84":[2,113],"92":[2,113],"94":[2,113],"99":[2,113],"107":[2,113],"109":[2,113],"110":[2,113],"111":[2,113],"114":[2,113],"118":[2,113],"119":[2,113],"120":[2,113],"127":[2,113],"128":[2,113],"129":[2,113],"131":[2,113],"132":[2,113],"134":[2,113],"135":[2,113],"138":[2,113],"139":[2,113],"140":[2,113],"141":[2,113],"142":[2,113],"143":[2,113],"144":[2,113],"145":[2,113],"146":[2,113],"147":[2,113],"148":[2,113],"149":[2,113],"150":[2,113],"151":[2,113],"152":[2,113],"153":[2,113],"154":[2,113],"155":[2,113],"156":[2,113],"157":[2,113],"158":[2,113],"159":[2,113],"160":[2,113],"161":[2,113],"162":[2,113],"163":[2,113],"164":[2,113]},{"91":192,"92":[1,139]},{"4":[2,56],"29":[2,56]},{"4":[2,57],"29":[2,57]},{"8":193,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"8":194,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"8":195,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"8":196,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"4":[1,160],"6":197,"8":198,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"29":[1,6],"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"1":[2,66],"4":[2,66],"29":[2,66],"30":[2,66],"46":[2,66],"50":[2,66],"58":[2,66],"61":[2,66],"72":[2,66],"73":[2,66],"74":[2,66],"75":[2,66],"78":[2,66],"79":[2,66],"80":[2,66],"81":[2,66],"84":[2,66],"86":[2,66],"92":[2,66],"94":[2,66],"99":[2,66],"107":[2,66],"109":[2,66],"110":[2,66],"111":[2,66],"114":[2,66],"118":[2,66],"119":[2,66],"120":[2,66],"127":[2,66],"128":[2,66],"129":[2,66],"131":[2,66],"132":[2,66],"134":[2,66],"135":[2,66],"138":[2,66],"139":[2,66],"140":[2,66],"141":[2,66],"142":[2,66],"143":[2,66],"144":[2,66],"145":[2,66],"146":[2,66],"147":[2,66],"148":[2,66],"149":[2,66],"150":[2,66],"151":[2,66],"152":[2,66],"153":[2,66],"154":[2,66],"155":[2,66],"156":[2,66],"157":[2,66],"158":[2,66],"159":[2,66],"160":[2,66],"161":[2,66],"162":[2,66],"163":[2,66],"164":[2,66]},{"1":[2,69],"4":[2,69],"29":[2,69],"30":[2,69],"46":[2,69],"50":[2,69],"58":[2,69],"61":[2,69],"72":[2,69],"73":[2,69],"74":[2,69],"75":[2,69],"78":[2,69],"79":[2,69],"80":[2,69],"81":[2,69],"84":[2,69],"86":[2,69],"92":[2,69],"94":[2,69],"99":[2,69],"107":[2,69],"109":[2,69],"110":[2,69],"111":[2,69],"114":[2,69],"118":[2,69],"119":[2,69],"120":[2,69],"127":[2,69],"128":[2,69],"129":[2,69],"131":[2,69],"132":[2,69],"134":[2,69],"135":[2,69],"138":[2,69],"139":[2,69],"140":[2,69],"141":[2,69],"142":[2,69],"143":[2,69],"144":[2,69],"145":[2,69],"146":[2,69],"147":[2,69],"148":[2,69],"149":[2,69],"150":[2,69],"151":[2,69],"152":[2,69],"153":[2,69],"154":[2,69],"155":[2,69],"156":[2,69],"157":[2,69],"158":[2,69],"159":[2,69],"160":[2,69],"161":[2,69],"162":[2,69],"163":[2,69],"164":[2,69]},{"4":[2,89],"28":203,"29":[2,89],"31":201,"32":[1,87],"33":202,"34":[1,85],"35":[1,86],"47":200,"49":[1,56],"58":[2,89],"83":199,"84":[2,89]},{"1":[2,33],"4":[2,33],"29":[2,33],"30":[2,33],"46":[2,33],"50":[2,33],"58":[2,33],"61":[2,33],"72":[2,33],"73":[2,33],"74":[2,33],"75":[2,33],"78":[2,33],"79":[2,33],"80":[2,33],"81":[2,33],"84":[2,33],"92":[2,33],"94":[2,33],"99":[2,33],"107":[2,33],"109":[2,33],"110":[2,33],"111":[2,33],"114":[2,33],"118":[2,33],"119":[2,33],"120":[2,33],"127":[2,33],"128":[2,33],"129":[2,33],"131":[2,33],"132":[2,33],"134":[2,33],"135":[2,33],"138":[2,33],"139":[2,33],"140":[2,33],"141":[2,33],"142":[2,33],"143":[2,33],"144":[2,33],"145":[2,33],"146":[2,33],"147":[2,33],"148":[2,33],"149":[2,33],"150":[2,33],"151":[2,33],"152":[2,33],"153":[2,33],"154":[2,33],"155":[2,33],"156":[2,33],"157":[2,33],"158":[2,33],"159":[2,33],"160":[2,33],"161":[2,33],"162":[2,33],"163":[2,33],"164":[2,33]},{"1":[2,34],"4":[2,34],"29":[2,34],"30":[2,34],"46":[2,34],"50":[2,34],"58":[2,34],"61":[2,34],"72":[2,34],"73":[2,34],"74":[2,34],"75":[2,34],"78":[2,34],"79":[2,34],"80":[2,34],"81":[2,34],"84":[2,34],"92":[2,34],"94":[2,34],"99":[2,34],"107":[2,34],"109":[2,34],"110":[2,34],"111":[2,34],"114":[2,34],"118":[2,34],"119":[2,34],"120":[2,34],"127":[2,34],"128":[2,34],"129":[2,34],"131":[2,34],"132":[2,34],"134":[2,34],"135":[2,34],"138":[2,34],"139":[2,34],"140":[2,34],"141":[2,34],"142":[2,34],"143":[2,34],"144":[2,34],"145":[2,34],"146":[2,34],"147":[2,34],"148":[2,34],"149":[2,34],"150":[2,34],"151":[2,34],"152":[2,34],"153":[2,34],"154":[2,34],"155":[2,34],"156":[2,34],"157":[2,34],"158":[2,34],"159":[2,34],"160":[2,34],"161":[2,34],"162":[2,34],"163":[2,34],"164":[2,34]},{"1":[2,32],"4":[2,32],"29":[2,32],"30":[2,32],"46":[2,32],"50":[2,32],"58":[2,32],"61":[2,32],"72":[2,32],"73":[2,32],"74":[2,32],"75":[2,32],"78":[2,32],"79":[2,32],"80":[2,32],"81":[2,32],"84":[2,32],"86":[2,32],"92":[2,32],"94":[2,32],"99":[2,32],"107":[2,32],"109":[2,32],"110":[2,32],"111":[2,32],"114":[2,32],"118":[2,32],"119":[2,32],"120":[2,32],"127":[2,32],"128":[2,32],"129":[2,32],"131":[2,32],"132":[2,32],"134":[2,32],"135":[2,32],"138":[2,32],"139":[2,32],"140":[2,32],"141":[2,32],"142":[2,32],"143":[2,32],"144":[2,32],"145":[2,32],"146":[2,32],"147":[2,32],"148":[2,32],"149":[2,32],"150":[2,32],"151":[2,32],"152":[2,32],"153":[2,32],"154":[2,32],"155":[2,32],"156":[2,32],"157":[2,32],"158":[2,32],"159":[2,32],"160":[2,32],"161":[2,32],"162":[2,32],"163":[2,32],"164":[2,32]},{"1":[2,31],"4":[2,31],"29":[2,31],"30":[2,31],"50":[2,31],"58":[2,31],"61":[2,31],"79":[2,31],"84":[2,31],"94":[2,31],"99":[2,31],"103":[2,31],"104":[2,31],"107":[2,31],"109":[2,31],"110":[2,31],"111":[2,31],"114":[2,31],"118":[2,31],"119":[2,31],"120":[2,31],"123":[2,31],"125":[2,31],"127":[2,31],"128":[2,31],"129":[2,31],"131":[2,31],"132":[2,31],"134":[2,31],"135":[2,31],"138":[2,31],"139":[2,31],"140":[2,31],"141":[2,31],"142":[2,31],"143":[2,31],"144":[2,31],"145":[2,31],"146":[2,31],"147":[2,31],"148":[2,31],"149":[2,31],"150":[2,31],"151":[2,31],"152":[2,31],"153":[2,31],"154":[2,31],"155":[2,31],"156":[2,31],"157":[2,31],"158":[2,31],"159":[2,31],"160":[2,31],"161":[2,31],"162":[2,31],"163":[2,31],"164":[2,31]},{"1":[2,7],"4":[2,7],"7":204,"8":7,"9":8,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"30":[2,7],"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"1":[2,4]},{"4":[1,89],"30":[1,205]},{"1":[2,30],"4":[2,30],"29":[2,30],"30":[2,30],"50":[2,30],"58":[2,30],"61":[2,30],"79":[2,30],"84":[2,30],"94":[2,30],"99":[2,30],"103":[2,30],"104":[2,30],"107":[2,30],"109":[2,30],"110":[2,30],"111":[2,30],"114":[2,30],"118":[2,30],"119":[2,30],"120":[2,30],"123":[2,30],"125":[2,30],"127":[2,30],"128":[2,30],"129":[2,30],"131":[2,30],"132":[2,30],"134":[2,30],"135":[2,30],"138":[2,30],"139":[2,30],"140":[2,30],"141":[2,30],"142":[2,30],"143":[2,30],"144":[2,30],"145":[2,30],"146":[2,30],"147":[2,30],"148":[2,30],"149":[2,30],"150":[2,30],"151":[2,30],"152":[2,30],"153":[2,30],"154":[2,30],"155":[2,30],"156":[2,30],"157":[2,30],"158":[2,30],"159":[2,30],"160":[2,30],"161":[2,30],"162":[2,30],"163":[2,30],"164":[2,30]},{"1":[2,184],"4":[2,184],"29":[2,184],"30":[2,184],"50":[2,184],"58":[2,184],"61":[2,184],"79":[2,184],"84":[2,184],"94":[2,184],"99":[2,184],"107":[2,184],"109":[2,184],"110":[2,184],"111":[2,184],"114":[2,184],"118":[2,184],"119":[2,184],"120":[2,184],"127":[2,184],"128":[2,184],"129":[2,184],"131":[2,184],"132":[2,184],"134":[2,184],"135":[2,184],"138":[2,184],"139":[2,184],"140":[2,184],"141":[2,184],"142":[2,184],"143":[2,184],"144":[2,184],"145":[2,184],"146":[2,184],"147":[2,184],"148":[2,184],"149":[2,184],"150":[2,184],"151":[2,184],"152":[2,184],"153":[2,184],"154":[2,184],"155":[2,184],"156":[2,184],"157":[2,184],"158":[2,184],"159":[2,184],"160":[2,184],"161":[2,184],"162":[2,184],"163":[2,184],"164":[2,184]},{"1":[2,185],"4":[2,185],"29":[2,185],"30":[2,185],"50":[2,185],"58":[2,185],"61":[2,185],"79":[2,185],"84":[2,185],"94":[2,185],"99":[2,185],"107":[2,185],"109":[2,185],"110":[2,185],"111":[2,185],"114":[2,185],"118":[2,185],"119":[2,185],"120":[2,185],"127":[2,185],"128":[2,185],"129":[2,185],"131":[2,185],"132":[2,185],"134":[2,185],"135":[2,185],"138":[2,185],"139":[2,185],"140":[2,185],"141":[2,185],"142":[2,185],"143":[2,185],"144":[2,185],"145":[2,185],"146":[2,185],"147":[2,185],"148":[2,185],"149":[2,185],"150":[2,185],"151":[2,185],"152":[2,185],"153":[2,185],"154":[2,185],"155":[2,185],"156":[2,185],"157":[2,185],"158":[2,185],"159":[2,185],"160":[2,185],"161":[2,185],"162":[2,185],"163":[2,185],"164":[2,185]},{"8":206,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"8":207,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"8":208,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"8":209,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"8":210,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"8":211,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"8":212,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"8":213,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"8":214,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"8":215,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"8":216,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"8":217,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"8":218,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"8":219,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"8":220,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"8":221,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"8":222,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"8":223,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"8":224,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"8":225,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"8":226,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"8":227,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"8":228,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"8":229,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"8":230,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"8":231,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"8":232,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"8":233,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"8":234,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"8":235,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"8":236,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"118":[1,237],"119":[1,238]},{"8":239,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"8":240,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"1":[2,139],"4":[2,139],"29":[2,139],"30":[2,139],"50":[2,139],"58":[2,139],"61":[2,139],"79":[2,139],"84":[2,139],"94":[2,139],"99":[2,139],"107":[2,139],"109":[2,139],"110":[2,139],"111":[2,139],"114":[2,139],"118":[2,139],"119":[2,139],"120":[2,139],"127":[2,139],"128":[2,139],"129":[2,139],"131":[2,139],"132":[2,139],"134":[2,139],"135":[2,139],"138":[2,139],"139":[2,139],"140":[2,139],"141":[2,139],"142":[2,139],"143":[2,139],"144":[2,139],"145":[2,139],"146":[2,139],"147":[2,139],"148":[2,139],"149":[2,139],"150":[2,139],"151":[2,139],"152":[2,139],"153":[2,139],"154":[2,139],"155":[2,139],"156":[2,139],"157":[2,139],"158":[2,139],"159":[2,139],"160":[2,139],"161":[2,139],"162":[2,139],"163":[2,139],"164":[2,139]},{"31":176,"32":[1,87],"66":177,"67":178,"82":[1,84],"98":[1,179],"115":241,"117":175},{"61":[1,242]},{"1":[2,53],"4":[2,53],"29":[2,53],"30":[2,53],"50":[2,53],"58":[2,53],"61":[2,53],"79":[2,53],"84":[2,53],"94":[2,53],"99":[2,53],"107":[2,53],"109":[2,53],"110":[2,53],"111":[2,53],"114":[2,53],"118":[2,53],"119":[2,53],"120":[2,53],"127":[2,53],"128":[2,53],"129":[2,53],"131":[2,53],"132":[2,53],"134":[2,53],"135":[2,53],"138":[2,53],"139":[2,53],"140":[2,53],"141":[2,53],"142":[2,53],"143":[2,53],"144":[2,53],"145":[2,53],"146":[2,53],"147":[2,53],"148":[2,53],"149":[2,53],"150":[2,53],"151":[2,53],"152":[2,53],"153":[2,53],"154":[2,53],"155":[2,53],"156":[2,53],"157":[2,53],"158":[2,53],"159":[2,53],"160":[2,53],"161":[2,53],"162":[2,53],"163":[2,53],"164":[2,53]},{"8":243,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"8":244,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"1":[2,138],"4":[2,138],"29":[2,138],"30":[2,138],"50":[2,138],"58":[2,138],"61":[2,138],"79":[2,138],"84":[2,138],"94":[2,138],"99":[2,138],"107":[2,138],"109":[2,138],"110":[2,138],"111":[2,138],"114":[2,138],"118":[2,138],"119":[2,138],"120":[2,138],"127":[2,138],"128":[2,138],"129":[2,138],"131":[2,138],"132":[2,138],"134":[2,138],"135":[2,138],"138":[2,138],"139":[2,138],"140":[2,138],"141":[2,138],"142":[2,138],"143":[2,138],"144":[2,138],"145":[2,138],"146":[2,138],"147":[2,138],"148":[2,138],"149":[2,138],"150":[2,138],"151":[2,138],"152":[2,138],"153":[2,138],"154":[2,138],"155":[2,138],"156":[2,138],"157":[2,138],"158":[2,138],"159":[2,138],"160":[2,138],"161":[2,138],"162":[2,138],"163":[2,138],"164":[2,138]},{"31":176,"32":[1,87],"66":177,"67":178,"82":[1,84],"98":[1,179],"115":245,"117":175},{"1":[2,108],"4":[2,108],"29":[2,108],"30":[2,108],"50":[2,108],"58":[2,108],"61":[2,108],"72":[2,108],"73":[2,108],"74":[2,108],"75":[2,108],"78":[2,108],"79":[2,108],"80":[2,108],"81":[2,108],"84":[2,108],"92":[2,108],"94":[2,108],"99":[2,108],"107":[2,108],"109":[2,108],"110":[2,108],"111":[2,108],"114":[2,108],"118":[2,108],"119":[2,108],"120":[2,108],"127":[2,108],"128":[2,108],"129":[2,108],"131":[2,108],"132":[2,108],"134":[2,108],"135":[2,108],"138":[2,108],"139":[2,108],"140":[2,108],"141":[2,108],"142":[2,108],"143":[2,108],"144":[2,108],"145":[2,108],"146":[2,108],"147":[2,108],"148":[2,108],"149":[2,108],"150":[2,108],"151":[2,108],"152":[2,108],"153":[2,108],"154":[2,108],"155":[2,108],"156":[2,108],"157":[2,108],"158":[2,108],"159":[2,108],"160":[2,108],"161":[2,108],"162":[2,108],"163":[2,108],"164":[2,108]},{"1":[2,67],"4":[2,67],"29":[2,67],"30":[2,67],"46":[2,67],"50":[2,67],"58":[2,67],"61":[2,67],"72":[2,67],"73":[2,67],"74":[2,67],"75":[2,67],"78":[2,67],"79":[2,67],"80":[2,67],"81":[2,67],"84":[2,67],"86":[2,67],"92":[2,67],"94":[2,67],"99":[2,67],"107":[2,67],"109":[2,67],"110":[2,67],"111":[2,67],"114":[2,67],"118":[2,67],"119":[2,67],"120":[2,67],"127":[2,67],"128":[2,67],"129":[2,67],"131":[2,67],"132":[2,67],"134":[2,67],"135":[2,67],"138":[2,67],"139":[2,67],"140":[2,67],"141":[2,67],"142":[2,67],"143":[2,67],"144":[2,67],"145":[2,67],"146":[2,67],"147":[2,67],"148":[2,67],"149":[2,67],"150":[2,67],"151":[2,67],"152":[2,67],"153":[2,67],"154":[2,67],"155":[2,67],"156":[2,67],"157":[2,67],"158":[2,67],"159":[2,67],"160":[2,67],"161":[2,67],"162":[2,67],"163":[2,67],"164":[2,67]},{"4":[2,120],"8":247,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"29":[2,120],"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"58":[2,120],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"93":246,"94":[2,120],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"31":248,"32":[1,87]},{"31":249,"32":[1,87]},{"1":[2,81],"4":[2,81],"29":[2,81],"30":[2,81],"46":[2,81],"50":[2,81],"58":[2,81],"61":[2,81],"72":[2,81],"73":[2,81],"74":[2,81],"75":[2,81],"78":[2,81],"79":[2,81],"80":[2,81],"81":[2,81],"84":[2,81],"86":[2,81],"92":[2,81],"94":[2,81],"99":[2,81],"107":[2,81],"109":[2,81],"110":[2,81],"111":[2,81],"114":[2,81],"118":[2,81],"119":[2,81],"120":[2,81],"127":[2,81],"128":[2,81],"129":[2,81],"131":[2,81],"132":[2,81],"134":[2,81],"135":[2,81],"138":[2,81],"139":[2,81],"140":[2,81],"141":[2,81],"142":[2,81],"143":[2,81],"144":[2,81],"145":[2,81],"146":[2,81],"147":[2,81],"148":[2,81],"149":[2,81],"150":[2,81],"151":[2,81],"152":[2,81],"153":[2,81],"154":[2,81],"155":[2,81],"156":[2,81],"157":[2,81],"158":[2,81],"159":[2,81],"160":[2,81],"161":[2,81],"162":[2,81],"163":[2,81],"164":[2,81]},{"31":250,"32":[1,87]},{"1":[2,83],"4":[2,83],"29":[2,83],"30":[2,83],"46":[2,83],"50":[2,83],"58":[2,83],"61":[2,83],"72":[2,83],"73":[2,83],"74":[2,83],"75":[2,83],"78":[2,83],"79":[2,83],"80":[2,83],"81":[2,83],"84":[2,83],"86":[2,83],"92":[2,83],"94":[2,83],"99":[2,83],"107":[2,83],"109":[2,83],"110":[2,83],"111":[2,83],"114":[2,83],"118":[2,83],"119":[2,83],"120":[2,83],"127":[2,83],"128":[2,83],"129":[2,83],"131":[2,83],"132":[2,83],"134":[2,83],"135":[2,83],"138":[2,83],"139":[2,83],"140":[2,83],"141":[2,83],"142":[2,83],"143":[2,83],"144":[2,83],"145":[2,83],"146":[2,83],"147":[2,83],"148":[2,83],"149":[2,83],"150":[2,83],"151":[2,83],"152":[2,83],"153":[2,83],"154":[2,83],"155":[2,83],"156":[2,83],"157":[2,83],"158":[2,83],"159":[2,83],"160":[2,83],"161":[2,83],"162":[2,83],"163":[2,83],"164":[2,83]},{"1":[2,84],"4":[2,84],"29":[2,84],"30":[2,84],"46":[2,84],"50":[2,84],"58":[2,84],"61":[2,84],"72":[2,84],"73":[2,84],"74":[2,84],"75":[2,84],"78":[2,84],"79":[2,84],"80":[2,84],"81":[2,84],"84":[2,84],"86":[2,84],"92":[2,84],"94":[2,84],"99":[2,84],"107":[2,84],"109":[2,84],"110":[2,84],"111":[2,84],"114":[2,84],"118":[2,84],"119":[2,84],"120":[2,84],"127":[2,84],"128":[2,84],"129":[2,84],"131":[2,84],"132":[2,84],"134":[2,84],"135":[2,84],"138":[2,84],"139":[2,84],"140":[2,84],"141":[2,84],"142":[2,84],"143":[2,84],"144":[2,84],"145":[2,84],"146":[2,84],"147":[2,84],"148":[2,84],"149":[2,84],"150":[2,84],"151":[2,84],"152":[2,84],"153":[2,84],"154":[2,84],"155":[2,84],"156":[2,84],"157":[2,84],"158":[2,84],"159":[2,84],"160":[2,84],"161":[2,84],"162":[2,84],"163":[2,84],"164":[2,84]},{"8":251,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"76":252,"78":[1,253],"80":[1,147],"81":[1,148]},{"76":254,"78":[1,253],"80":[1,147],"81":[1,148]},{"8":255,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"1":[2,109],"4":[2,109],"29":[2,109],"30":[2,109],"50":[2,109],"58":[2,109],"61":[2,109],"72":[2,109],"73":[2,109],"74":[2,109],"75":[2,109],"78":[2,109],"79":[2,109],"80":[2,109],"81":[2,109],"84":[2,109],"92":[2,109],"94":[2,109],"99":[2,109],"107":[2,109],"109":[2,109],"110":[2,109],"111":[2,109],"114":[2,109],"118":[2,109],"119":[2,109],"120":[2,109],"127":[2,109],"128":[2,109],"129":[2,109],"131":[2,109],"132":[2,109],"134":[2,109],"135":[2,109],"138":[2,109],"139":[2,109],"140":[2,109],"141":[2,109],"142":[2,109],"143":[2,109],"144":[2,109],"145":[2,109],"146":[2,109],"147":[2,109],"148":[2,109],"149":[2,109],"150":[2,109],"151":[2,109],"152":[2,109],"153":[2,109],"154":[2,109],"155":[2,109],"156":[2,109],"157":[2,109],"158":[2,109],"159":[2,109],"160":[2,109],"161":[2,109],"162":[2,109],"163":[2,109],"164":[2,109]},{"1":[2,68],"4":[2,68],"29":[2,68],"30":[2,68],"46":[2,68],"50":[2,68],"58":[2,68],"61":[2,68],"72":[2,68],"73":[2,68],"74":[2,68],"75":[2,68],"78":[2,68],"79":[2,68],"80":[2,68],"81":[2,68],"84":[2,68],"86":[2,68],"92":[2,68],"94":[2,68],"99":[2,68],"107":[2,68],"109":[2,68],"110":[2,68],"111":[2,68],"114":[2,68],"118":[2,68],"119":[2,68],"120":[2,68],"127":[2,68],"128":[2,68],"129":[2,68],"131":[2,68],"132":[2,68],"134":[2,68],"135":[2,68],"138":[2,68],"139":[2,68],"140":[2,68],"141":[2,68],"142":[2,68],"143":[2,68],"144":[2,68],"145":[2,68],"146":[2,68],"147":[2,68],"148":[2,68],"149":[2,68],"150":[2,68],"151":[2,68],"152":[2,68],"153":[2,68],"154":[2,68],"155":[2,68],"156":[2,68],"157":[2,68],"158":[2,68],"159":[2,68],"160":[2,68],"161":[2,68],"162":[2,68],"163":[2,68],"164":[2,68]},{"1":[2,105],"4":[2,105],"29":[2,105],"30":[2,105],"50":[2,105],"58":[2,105],"61":[2,105],"63":151,"72":[1,140],"73":[1,141],"74":[1,142],"75":[1,143],"76":144,"77":145,"78":[1,146],"79":[2,105],"80":[1,147],"81":[1,148],"84":[2,105],"91":150,"92":[1,139],"94":[2,105],"99":[2,105],"107":[2,105],"109":[2,105],"110":[2,105],"111":[2,105],"114":[2,105],"118":[2,105],"119":[2,105],"120":[2,105],"127":[2,105],"128":[2,105],"129":[2,105],"131":[2,105],"132":[2,105],"134":[2,105],"135":[2,105],"138":[2,105],"139":[2,105],"140":[2,105],"141":[2,105],"142":[2,105],"143":[2,105],"144":[2,105],"145":[2,105],"146":[2,105],"147":[2,105],"148":[2,105],"149":[2,105],"150":[2,105],"151":[2,105],"152":[2,105],"153":[2,105],"154":[2,105],"155":[2,105],"156":[2,105],"157":[2,105],"158":[2,105],"159":[2,105],"160":[2,105],"161":[2,105],"162":[2,105],"163":[2,105],"164":[2,105]},{"1":[2,106],"4":[2,106],"29":[2,106],"30":[2,106],"50":[2,106],"58":[2,106],"61":[2,106],"63":138,"72":[1,140],"73":[1,141],"74":[1,142],"75":[1,143],"76":144,"77":145,"78":[1,146],"79":[2,106],"80":[1,147],"81":[1,148],"84":[2,106],"91":137,"92":[1,139],"94":[2,106],"99":[2,106],"107":[2,106],"109":[2,106],"110":[2,106],"111":[2,106],"114":[2,106],"118":[2,106],"119":[2,106],"120":[2,106],"127":[2,106],"128":[2,106],"129":[2,106],"131":[2,106],"132":[2,106],"134":[2,106],"135":[2,106],"138":[2,106],"139":[2,106],"140":[2,106],"141":[2,106],"142":[2,106],"143":[2,106],"144":[2,106],"145":[2,106],"146":[2,106],"147":[2,106],"148":[2,106],"149":[2,106],"150":[2,106],"151":[2,106],"152":[2,106],"153":[2,106],"154":[2,106],"155":[2,106],"156":[2,106],"157":[2,106],"158":[2,106],"159":[2,106],"160":[2,106],"161":[2,106],"162":[2,106],"163":[2,106],"164":[2,106]},{"1":[2,73],"4":[2,73],"29":[2,73],"30":[2,73],"50":[2,73],"58":[2,73],"61":[2,73],"72":[2,73],"73":[2,73],"74":[2,73],"75":[2,73],"78":[2,73],"79":[2,73],"80":[2,73],"81":[2,73],"84":[2,73],"92":[2,73],"94":[2,73],"99":[2,73],"107":[2,73],"109":[2,73],"110":[2,73],"111":[2,73],"114":[2,73],"118":[2,73],"119":[2,73],"120":[2,73],"127":[2,73],"128":[2,73],"129":[2,73],"131":[2,73],"132":[2,73],"134":[2,73],"135":[2,73],"138":[2,73],"139":[2,73],"140":[2,73],"141":[2,73],"142":[2,73],"143":[2,73],"144":[2,73],"145":[2,73],"146":[2,73],"147":[2,73],"148":[2,73],"149":[2,73],"150":[2,73],"151":[2,73],"152":[2,73],"153":[2,73],"154":[2,73],"155":[2,73],"156":[2,73],"157":[2,73],"158":[2,73],"159":[2,73],"160":[2,73],"161":[2,73],"162":[2,73],"163":[2,73],"164":[2,73]},{"1":[2,70],"4":[2,70],"29":[2,70],"30":[2,70],"50":[2,70],"58":[2,70],"61":[2,70],"72":[2,70],"73":[2,70],"74":[2,70],"75":[2,70],"78":[2,70],"79":[2,70],"80":[2,70],"81":[2,70],"84":[2,70],"92":[2,70],"94":[2,70],"99":[2,70],"107":[2,70],"109":[2,70],"110":[2,70],"111":[2,70],"114":[2,70],"118":[2,70],"119":[2,70],"120":[2,70],"127":[2,70],"128":[2,70],"129":[2,70],"131":[2,70],"132":[2,70],"134":[2,70],"135":[2,70],"138":[2,70],"139":[2,70],"140":[2,70],"141":[2,70],"142":[2,70],"143":[2,70],"144":[2,70],"145":[2,70],"146":[2,70],"147":[2,70],"148":[2,70],"149":[2,70],"150":[2,70],"151":[2,70],"152":[2,70],"153":[2,70],"154":[2,70],"155":[2,70],"156":[2,70],"157":[2,70],"158":[2,70],"159":[2,70],"160":[2,70],"161":[2,70],"162":[2,70],"163":[2,70],"164":[2,70]},{"53":[1,256],"58":[1,257]},{"53":[2,61],"58":[2,61],"61":[1,258]},{"53":[2,63],"58":[2,63],"61":[2,63]},{"1":[2,55],"4":[2,55],"29":[2,55],"30":[2,55],"50":[2,55],"58":[2,55],"61":[2,55],"79":[2,55],"84":[2,55],"94":[2,55],"99":[2,55],"107":[2,55],"109":[2,55],"110":[2,55],"111":[2,55],"114":[2,55],"118":[2,55],"119":[2,55],"120":[2,55],"127":[2,55],"128":[2,55],"129":[2,55],"131":[2,55],"132":[2,55],"134":[2,55],"135":[2,55],"138":[2,55],"139":[2,55],"140":[2,55],"141":[2,55],"142":[2,55],"143":[2,55],"144":[2,55],"145":[2,55],"146":[2,55],"147":[2,55],"148":[2,55],"149":[2,55],"150":[2,55],"151":[2,55],"152":[2,55],"153":[2,55],"154":[2,55],"155":[2,55],"156":[2,55],"157":[2,55],"158":[2,55],"159":[2,55],"160":[2,55],"161":[2,55],"162":[2,55],"163":[2,55],"164":[2,55]},{"28":88,"49":[1,56]},{"1":[2,175],"4":[2,175],"29":[2,175],"30":[2,175],"50":[1,132],"58":[2,175],"61":[2,175],"79":[2,175],"84":[2,175],"94":[2,175],"99":[2,175],"107":[2,175],"108":129,"109":[2,175],"110":[2,175],"111":[2,175],"114":[2,175],"118":[2,175],"119":[2,175],"120":[2,175],"127":[2,175],"128":[2,175],"131":[2,175],"132":[2,175],"138":[2,175],"139":[2,175],"140":[2,175],"141":[2,175],"142":[2,175],"143":[2,175],"144":[2,175],"145":[2,175],"146":[2,175],"147":[2,175],"148":[2,175],"149":[2,175],"150":[2,175],"151":[2,175],"152":[2,175],"153":[2,175],"154":[2,175],"155":[2,175],"156":[2,175],"157":[2,175],"158":[2,175],"159":[2,175],"160":[2,175],"161":[2,175],"162":[2,175],"163":[2,175],"164":[2,175]},{"108":135,"109":[1,79],"111":[1,80],"114":[1,136],"127":[1,133],"128":[1,134]},{"1":[2,176],"4":[2,176],"29":[2,176],"30":[2,176],"50":[1,132],"58":[2,176],"61":[2,176],"79":[2,176],"84":[2,176],"94":[2,176],"99":[2,176],"107":[2,176],"108":129,"109":[2,176],"110":[2,176],"111":[2,176],"114":[2,176],"118":[2,176],"119":[2,176],"120":[2,176],"127":[2,176],"128":[2,176],"131":[2,176],"132":[2,176],"138":[2,176],"139":[2,176],"140":[2,176],"141":[2,176],"142":[2,176],"143":[2,176],"144":[2,176],"145":[2,176],"146":[2,176],"147":[2,176],"148":[2,176],"149":[2,176],"150":[2,176],"151":[2,176],"152":[2,176],"153":[2,176],"154":[2,176],"155":[2,176],"156":[2,176],"157":[2,176],"158":[2,176],"159":[2,176],"160":[2,176],"161":[2,176],"162":[2,176],"163":[2,176],"164":[2,176]},{"1":[2,177],"4":[2,177],"29":[2,177],"30":[2,177],"50":[1,132],"58":[2,177],"61":[2,177],"79":[2,177],"84":[2,177],"94":[2,177],"99":[2,177],"107":[2,177],"108":129,"109":[2,177],"110":[2,177],"111":[2,177],"114":[2,177],"118":[2,177],"119":[2,177],"120":[2,177],"127":[2,177],"128":[2,177],"131":[2,177],"132":[2,177],"138":[2,177],"139":[2,177],"140":[2,177],"141":[2,177],"142":[2,177],"143":[2,177],"144":[2,177],"145":[2,177],"146":[2,177],"147":[2,177],"148":[2,177],"149":[2,177],"150":[2,177],"151":[2,177],"152":[2,177],"153":[2,177],"154":[2,177],"155":[2,177],"156":[2,177],"157":[2,177],"158":[2,177],"159":[2,177],"160":[2,177],"161":[2,177],"162":[2,177],"163":[2,177],"164":[2,177]},{"1":[2,178],"4":[2,178],"29":[2,178],"30":[2,178],"50":[1,132],"58":[2,178],"61":[2,178],"79":[2,178],"84":[2,178],"94":[2,178],"99":[2,178],"107":[2,178],"108":129,"109":[2,178],"110":[2,178],"111":[2,178],"114":[2,178],"118":[2,178],"119":[2,178],"120":[2,178],"127":[2,178],"128":[2,178],"131":[2,178],"132":[2,178],"138":[2,178],"139":[2,178],"140":[2,178],"141":[2,178],"142":[2,178],"143":[2,178],"144":[2,178],"145":[2,178],"146":[2,178],"147":[2,178],"148":[2,178],"149":[2,178],"150":[2,178],"151":[2,178],"152":[2,178],"153":[2,178],"154":[2,178],"155":[2,178],"156":[2,178],"157":[2,178],"158":[2,178],"159":[2,178],"160":[2,178],"161":[2,178],"162":[2,178],"163":[2,178],"164":[2,178]},{"1":[2,179],"4":[2,179],"29":[2,179],"30":[2,179],"50":[1,132],"58":[2,179],"61":[2,179],"79":[2,179],"84":[2,179],"94":[2,179],"99":[2,179],"107":[2,179],"108":129,"109":[2,179],"110":[2,179],"111":[2,179],"114":[2,179],"118":[2,179],"119":[2,179],"120":[2,179],"127":[2,179],"128":[2,179],"131":[2,179],"132":[2,179],"138":[2,179],"139":[2,179],"140":[2,179],"141":[2,179],"142":[2,179],"143":[2,179],"144":[2,179],"145":[2,179],"146":[2,179],"147":[2,179],"148":[2,179],"149":[2,179],"150":[2,179],"151":[2,179],"152":[2,179],"153":[2,179],"154":[2,179],"155":[2,179],"156":[2,179],"157":[2,179],"158":[2,179],"159":[2,179],"160":[2,179],"161":[2,179],"162":[2,179],"163":[2,179],"164":[2,179]},{"1":[2,180],"4":[2,180],"29":[2,180],"30":[2,180],"50":[1,132],"58":[2,180],"61":[2,180],"79":[2,180],"84":[2,180],"94":[2,180],"99":[2,180],"107":[2,180],"108":129,"109":[2,180],"110":[2,180],"111":[2,180],"114":[2,180],"118":[2,180],"119":[2,180],"120":[2,180],"127":[2,180],"128":[2,180],"131":[2,180],"132":[2,180],"138":[2,180],"139":[2,180],"140":[2,180],"141":[2,180],"142":[2,180],"143":[2,180],"144":[2,180],"145":[2,180],"146":[2,180],"147":[2,180],"148":[2,180],"149":[2,180],"150":[2,180],"151":[2,180],"152":[2,180],"153":[2,180],"154":[2,180],"155":[2,180],"156":[2,180],"157":[2,180],"158":[2,180],"159":[2,180],"160":[2,180],"161":[2,180],"162":[2,180],"163":[2,180],"164":[2,180]},{"1":[2,181],"4":[2,181],"29":[2,181],"30":[2,181],"50":[1,132],"58":[2,181],"61":[2,181],"79":[2,181],"84":[2,181],"94":[2,181],"99":[2,181],"107":[2,181],"108":129,"109":[2,181],"110":[2,181],"111":[2,181],"114":[2,181],"118":[2,181],"119":[2,181],"120":[2,181],"127":[2,181],"128":[2,181],"131":[2,181],"132":[2,181],"138":[2,181],"139":[2,181],"140":[2,181],"141":[2,181],"142":[2,181],"143":[2,181],"144":[2,181],"145":[2,181],"146":[2,181],"147":[2,181],"148":[2,181],"149":[2,181],"150":[2,181],"151":[2,181],"152":[2,181],"153":[2,181],"154":[2,181],"155":[2,181],"156":[2,181],"157":[2,181],"158":[2,181],"159":[2,181],"160":[2,181],"161":[2,181],"162":[2,181],"163":[2,181],"164":[2,181]},{"1":[2,182],"4":[2,182],"29":[2,182],"30":[2,182],"50":[1,132],"58":[2,182],"61":[2,182],"79":[2,182],"84":[2,182],"94":[2,182],"99":[2,182],"107":[2,182],"108":129,"109":[2,182],"110":[2,182],"111":[2,182],"114":[2,182],"118":[2,182],"119":[2,182],"120":[2,182],"127":[2,182],"128":[2,182],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[1,100],"142":[1,101],"143":[1,102],"144":[1,103],"145":[1,104],"146":[1,105],"147":[1,106],"148":[1,107],"149":[1,108],"150":[1,109],"151":[2,182],"152":[2,182],"153":[2,182],"154":[2,182],"155":[2,182],"156":[2,182],"157":[2,182],"158":[2,182],"159":[2,182],"160":[2,182],"161":[2,182],"162":[2,182],"163":[2,182],"164":[1,123]},{"1":[2,183],"4":[2,183],"29":[2,183],"30":[2,183],"50":[1,132],"58":[2,183],"61":[2,183],"79":[2,183],"84":[2,183],"94":[2,183],"99":[2,183],"107":[2,183],"108":129,"109":[2,183],"110":[2,183],"111":[2,183],"114":[2,183],"118":[2,183],"119":[2,183],"120":[2,183],"127":[2,183],"128":[2,183],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[1,100],"142":[1,101],"143":[1,102],"144":[1,103],"145":[1,104],"146":[1,105],"147":[1,106],"148":[1,107],"149":[1,108],"150":[1,109],"151":[2,183],"152":[2,183],"153":[2,183],"154":[2,183],"155":[2,183],"156":[2,183],"157":[2,183],"158":[2,183],"159":[2,183],"160":[2,183],"161":[2,183],"162":[2,183],"163":[2,183],"164":[1,123]},{"4":[1,160],"6":260,"29":[1,6],"127":[1,259]},{"102":261,"103":[1,262],"104":[1,263]},{"1":[2,137],"4":[2,137],"29":[2,137],"30":[2,137],"50":[2,137],"58":[2,137],"61":[2,137],"79":[2,137],"84":[2,137],"94":[2,137],"99":[2,137],"107":[2,137],"109":[2,137],"110":[2,137],"111":[2,137],"114":[2,137],"118":[2,137],"119":[2,137],"120":[2,137],"127":[2,137],"128":[2,137],"129":[2,137],"131":[2,137],"132":[2,137],"134":[2,137],"135":[2,137],"138":[2,137],"139":[2,137],"140":[2,137],"141":[2,137],"142":[2,137],"143":[2,137],"144":[2,137],"145":[2,137],"146":[2,137],"147":[2,137],"148":[2,137],"149":[2,137],"150":[2,137],"151":[2,137],"152":[2,137],"153":[2,137],"154":[2,137],"155":[2,137],"156":[2,137],"157":[2,137],"158":[2,137],"159":[2,137],"160":[2,137],"161":[2,137],"162":[2,137],"163":[2,137],"164":[2,137]},{"116":264,"118":[1,265],"119":[1,266]},{"58":[1,267],"118":[2,149],"119":[2,149]},{"58":[2,146],"118":[2,146],"119":[2,146]},{"58":[2,147],"118":[2,147],"119":[2,147]},{"58":[2,148],"118":[2,148],"119":[2,148]},{"4":[2,120],"8":247,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"29":[2,120],"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"58":[2,120],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"93":190,"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"99":[2,120],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"29":[1,268],"50":[1,132],"61":[1,131],"108":129,"109":[1,79],"111":[1,80],"114":[1,130],"118":[1,124],"119":[1,125],"127":[1,127],"128":[1,128],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[1,100],"142":[1,101],"143":[1,102],"144":[1,103],"145":[1,104],"146":[1,105],"147":[1,106],"148":[1,107],"149":[1,108],"150":[1,109],"151":[1,110],"152":[1,111],"153":[1,112],"154":[1,113],"155":[1,114],"156":[1,115],"157":[1,116],"158":[1,117],"159":[1,118],"160":[1,119],"161":[1,120],"162":[1,121],"163":[1,122],"164":[1,123]},{"122":269,"124":270,"125":[1,271]},{"14":272,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":154,"62":155,"64":185,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"96":[1,72],"97":[1,73],"98":[1,71],"106":[1,70]},{"1":[2,94],"4":[2,94],"29":[1,274],"30":[2,94],"50":[2,94],"58":[2,94],"61":[2,94],"72":[2,70],"73":[2,70],"74":[2,70],"75":[2,70],"78":[2,70],"79":[2,94],"80":[2,70],"81":[2,70],"84":[2,94],"86":[1,273],"92":[2,70],"94":[2,94],"99":[2,94],"107":[2,94],"109":[2,94],"110":[2,94],"111":[2,94],"114":[2,94],"118":[2,94],"119":[2,94],"120":[2,94],"127":[2,94],"128":[2,94],"129":[2,94],"131":[2,94],"132":[2,94],"134":[2,94],"135":[2,94],"138":[2,94],"139":[2,94],"140":[2,94],"141":[2,94],"142":[2,94],"143":[2,94],"144":[2,94],"145":[2,94],"146":[2,94],"147":[2,94],"148":[2,94],"149":[2,94],"150":[2,94],"151":[2,94],"152":[2,94],"153":[2,94],"154":[2,94],"155":[2,94],"156":[2,94],"157":[2,94],"158":[2,94],"159":[2,94],"160":[2,94],"161":[2,94],"162":[2,94],"163":[2,94],"164":[2,94]},{"63":138,"72":[1,140],"73":[1,141],"74":[1,142],"75":[1,143],"76":144,"77":145,"78":[1,146],"80":[1,147],"81":[1,148],"91":137,"92":[1,139]},{"63":151,"72":[1,140],"73":[1,141],"74":[1,142],"75":[1,143],"76":144,"77":145,"78":[1,146],"80":[1,147],"81":[1,148],"91":150,"92":[1,139]},{"1":[2,50],"4":[2,50],"30":[2,50],"50":[1,132],"61":[1,131],"107":[2,50],"108":129,"109":[1,79],"111":[1,80],"114":[1,130],"118":[1,124],"119":[1,125],"127":[2,50],"128":[2,50],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[1,100],"142":[1,101],"143":[1,102],"144":[1,103],"145":[1,104],"146":[1,105],"147":[1,106],"148":[1,107],"149":[1,108],"150":[1,109],"151":[1,110],"152":[1,111],"153":[1,112],"154":[1,113],"155":[1,114],"156":[1,115],"157":[1,116],"158":[1,117],"159":[1,118],"160":[1,119],"161":[1,120],"162":[1,121],"163":[1,122],"164":[1,123]},{"1":[2,131],"4":[2,131],"30":[2,131],"50":[1,132],"61":[1,131],"107":[2,131],"108":129,"109":[2,131],"111":[2,131],"114":[2,131],"118":[1,124],"119":[1,125],"127":[2,131],"128":[2,131],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[1,100],"142":[1,101],"143":[1,102],"144":[1,103],"145":[1,104],"146":[1,105],"147":[1,106],"148":[1,107],"149":[1,108],"150":[1,109],"151":[1,110],"152":[1,111],"153":[1,112],"154":[1,113],"155":[1,114],"156":[1,115],"157":[1,116],"158":[1,117],"159":[1,118],"160":[1,119],"161":[1,120],"162":[1,121],"163":[1,122],"164":[1,123]},{"107":[1,275]},{"4":[2,121],"29":[2,121],"50":[1,132],"58":[2,121],"61":[1,276],"99":[2,121],"108":129,"109":[1,79],"111":[1,80],"114":[1,130],"118":[1,124],"119":[1,125],"127":[1,127],"128":[1,128],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[1,100],"142":[1,101],"143":[1,102],"144":[1,103],"145":[1,104],"146":[1,105],"147":[1,106],"148":[1,107],"149":[1,108],"150":[1,109],"151":[1,110],"152":[1,111],"153":[1,112],"154":[1,113],"155":[1,114],"156":[1,115],"157":[1,116],"158":[1,117],"159":[1,118],"160":[1,119],"161":[1,120],"162":[1,121],"163":[1,122],"164":[1,123]},{"4":[2,58],"29":[2,58],"57":277,"58":[1,278],"99":[2,58]},{"1":[2,114],"4":[2,114],"29":[2,114],"30":[2,114],"46":[2,114],"50":[2,114],"58":[2,114],"61":[2,114],"72":[2,114],"73":[2,114],"74":[2,114],"75":[2,114],"78":[2,114],"79":[2,114],"80":[2,114],"81":[2,114],"84":[2,114],"86":[2,114],"92":[2,114],"94":[2,114],"99":[2,114],"107":[2,114],"109":[2,114],"110":[2,114],"111":[2,114],"114":[2,114],"118":[2,114],"119":[2,114],"120":[2,114],"127":[2,114],"128":[2,114],"129":[2,114],"131":[2,114],"132":[2,114],"134":[2,114],"135":[2,114],"138":[2,114],"139":[2,114],"140":[2,114],"141":[2,114],"142":[2,114],"143":[2,114],"144":[2,114],"145":[2,114],"146":[2,114],"147":[2,114],"148":[2,114],"149":[2,114],"150":[2,114],"151":[2,114],"152":[2,114],"153":[2,114],"154":[2,114],"155":[2,114],"156":[2,114],"157":[2,114],"158":[2,114],"159":[2,114],"160":[2,114],"161":[2,114],"162":[2,114],"163":[2,114],"164":[2,114]},{"1":[2,111],"4":[2,111],"29":[2,111],"30":[2,111],"50":[2,111],"58":[2,111],"61":[2,111],"79":[2,111],"84":[2,111],"94":[2,111],"99":[2,111],"107":[2,111],"109":[2,111],"110":[2,111],"111":[2,111],"114":[2,111],"118":[2,111],"119":[2,111],"120":[2,111],"127":[2,111],"128":[2,111],"129":[2,111],"131":[2,111],"132":[2,111],"134":[2,111],"135":[2,111],"138":[2,111],"139":[2,111],"140":[2,111],"141":[2,111],"142":[2,111],"143":[2,111],"144":[2,111],"145":[2,111],"146":[2,111],"147":[2,111],"148":[2,111],"149":[2,111],"150":[2,111],"151":[2,111],"152":[2,111],"153":[2,111],"154":[2,111],"155":[2,111],"156":[2,111],"157":[2,111],"158":[2,111],"159":[2,111],"160":[2,111],"161":[2,111],"162":[2,111],"163":[2,111],"164":[2,111]},{"4":[1,160],"6":279,"29":[1,6],"50":[1,132],"61":[1,131],"108":129,"109":[1,79],"111":[1,80],"114":[1,130],"118":[1,124],"119":[1,125],"127":[1,127],"128":[1,128],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[1,100],"142":[1,101],"143":[1,102],"144":[1,103],"145":[1,104],"146":[1,105],"147":[1,106],"148":[1,107],"149":[1,108],"150":[1,109],"151":[1,110],"152":[1,111],"153":[1,112],"154":[1,113],"155":[1,114],"156":[1,115],"157":[1,116],"158":[1,117],"159":[1,118],"160":[1,119],"161":[1,120],"162":[1,121],"163":[1,122],"164":[1,123]},{"4":[1,160],"6":280,"29":[1,6],"50":[1,132],"61":[1,131],"108":129,"109":[1,79],"111":[1,80],"114":[1,130],"118":[1,124],"119":[1,125],"127":[1,127],"128":[1,128],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[1,100],"142":[1,101],"143":[1,102],"144":[1,103],"145":[1,104],"146":[1,105],"147":[1,106],"148":[1,107],"149":[1,108],"150":[1,109],"151":[1,110],"152":[1,111],"153":[1,112],"154":[1,113],"155":[1,114],"156":[1,115],"157":[1,116],"158":[1,117],"159":[1,118],"160":[1,119],"161":[1,120],"162":[1,121],"163":[1,122],"164":[1,123]},{"1":[2,133],"4":[2,133],"29":[2,133],"30":[2,133],"50":[1,132],"58":[2,133],"61":[1,131],"79":[2,133],"84":[2,133],"94":[2,133],"99":[2,133],"107":[2,133],"108":129,"109":[1,79],"110":[1,281],"111":[1,80],"114":[1,130],"118":[1,124],"119":[1,125],"120":[2,133],"127":[2,133],"128":[2,133],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[1,100],"142":[1,101],"143":[1,102],"144":[1,103],"145":[1,104],"146":[1,105],"147":[1,106],"148":[1,107],"149":[1,108],"150":[1,109],"151":[1,110],"152":[1,111],"153":[1,112],"154":[1,113],"155":[1,114],"156":[1,115],"157":[1,116],"158":[1,117],"159":[1,118],"160":[1,119],"161":[1,120],"162":[1,121],"163":[1,122],"164":[1,123]},{"1":[2,135],"4":[2,135],"29":[2,135],"30":[2,135],"50":[1,132],"58":[2,135],"61":[1,131],"79":[2,135],"84":[2,135],"94":[2,135],"99":[2,135],"107":[2,135],"108":129,"109":[1,79],"110":[1,282],"111":[1,80],"114":[1,130],"118":[1,124],"119":[1,125],"120":[2,135],"127":[2,135],"128":[2,135],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[1,100],"142":[1,101],"143":[1,102],"144":[1,103],"145":[1,104],"146":[1,105],"147":[1,106],"148":[1,107],"149":[1,108],"150":[1,109],"151":[1,110],"152":[1,111],"153":[1,112],"154":[1,113],"155":[1,114],"156":[1,115],"157":[1,116],"158":[1,117],"159":[1,118],"160":[1,119],"161":[1,120],"162":[1,121],"163":[1,122],"164":[1,123]},{"1":[2,141],"4":[2,141],"29":[2,141],"30":[2,141],"50":[2,141],"58":[2,141],"61":[2,141],"79":[2,141],"84":[2,141],"94":[2,141],"99":[2,141],"107":[2,141],"109":[2,141],"110":[2,141],"111":[2,141],"114":[2,141],"118":[2,141],"119":[2,141],"120":[2,141],"127":[2,141],"128":[2,141],"129":[2,141],"131":[2,141],"132":[2,141],"134":[2,141],"135":[2,141],"138":[2,141],"139":[2,141],"140":[2,141],"141":[2,141],"142":[2,141],"143":[2,141],"144":[2,141],"145":[2,141],"146":[2,141],"147":[2,141],"148":[2,141],"149":[2,141],"150":[2,141],"151":[2,141],"152":[2,141],"153":[2,141],"154":[2,141],"155":[2,141],"156":[2,141],"157":[2,141],"158":[2,141],"159":[2,141],"160":[2,141],"161":[2,141],"162":[2,141],"163":[2,141],"164":[2,141]},{"1":[2,142],"4":[2,142],"29":[2,142],"30":[2,142],"50":[1,132],"58":[2,142],"61":[1,131],"79":[2,142],"84":[2,142],"94":[2,142],"99":[2,142],"107":[2,142],"108":129,"109":[1,79],"110":[2,142],"111":[1,80],"114":[1,130],"118":[1,124],"119":[1,125],"120":[2,142],"127":[2,142],"128":[2,142],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[1,100],"142":[1,101],"143":[1,102],"144":[1,103],"145":[1,104],"146":[1,105],"147":[1,106],"148":[1,107],"149":[1,108],"150":[1,109],"151":[1,110],"152":[1,111],"153":[1,112],"154":[1,113],"155":[1,114],"156":[1,115],"157":[1,116],"158":[1,117],"159":[1,118],"160":[1,119],"161":[1,120],"162":[1,121],"163":[1,122],"164":[1,123]},{"4":[2,58],"29":[2,58],"57":283,"58":[1,284],"84":[2,58]},{"4":[2,90],"29":[2,90],"30":[2,90],"58":[2,90],"84":[2,90]},{"4":[2,45],"29":[2,45],"30":[2,45],"46":[1,285],"58":[2,45],"84":[2,45]},{"4":[2,46],"29":[2,46],"30":[2,46],"46":[1,286],"58":[2,46],"84":[2,46]},{"4":[2,49],"29":[2,49],"30":[2,49],"58":[2,49],"84":[2,49]},{"1":[2,6],"4":[2,6],"30":[2,6]},{"1":[2,29],"4":[2,29],"29":[2,29],"30":[2,29],"50":[2,29],"58":[2,29],"61":[2,29],"79":[2,29],"84":[2,29],"94":[2,29],"99":[2,29],"103":[2,29],"104":[2,29],"107":[2,29],"109":[2,29],"110":[2,29],"111":[2,29],"114":[2,29],"118":[2,29],"119":[2,29],"120":[2,29],"123":[2,29],"125":[2,29],"127":[2,29],"128":[2,29],"129":[2,29],"131":[2,29],"132":[2,29],"134":[2,29],"135":[2,29],"138":[2,29],"139":[2,29],"140":[2,29],"141":[2,29],"142":[2,29],"143":[2,29],"144":[2,29],"145":[2,29],"146":[2,29],"147":[2,29],"148":[2,29],"149":[2,29],"150":[2,29],"151":[2,29],"152":[2,29],"153":[2,29],"154":[2,29],"155":[2,29],"156":[2,29],"157":[2,29],"158":[2,29],"159":[2,29],"160":[2,29],"161":[2,29],"162":[2,29],"163":[2,29],"164":[2,29]},{"1":[2,186],"4":[2,186],"29":[2,186],"30":[2,186],"50":[1,132],"58":[2,186],"61":[2,186],"79":[2,186],"84":[2,186],"94":[2,186],"99":[2,186],"107":[2,186],"108":129,"109":[2,186],"110":[2,186],"111":[2,186],"114":[2,186],"118":[2,186],"119":[2,186],"120":[2,186],"127":[2,186],"128":[2,186],"129":[1,126],"131":[2,186],"132":[2,186],"134":[1,93],"135":[1,94],"138":[2,186],"139":[2,186],"140":[2,186],"141":[2,186],"142":[2,186],"143":[2,186],"144":[2,186],"145":[2,186],"146":[2,186],"147":[2,186],"148":[2,186],"149":[2,186],"150":[2,186],"151":[2,186],"152":[2,186],"153":[2,186],"154":[2,186],"155":[2,186],"156":[2,186],"157":[2,186],"158":[2,186],"159":[2,186],"160":[2,186],"161":[2,186],"162":[2,186],"163":[2,186],"164":[2,186]},{"1":[2,187],"4":[2,187],"29":[2,187],"30":[2,187],"50":[1,132],"58":[2,187],"61":[2,187],"79":[2,187],"84":[2,187],"94":[2,187],"99":[2,187],"107":[2,187],"108":129,"109":[2,187],"110":[2,187],"111":[2,187],"114":[2,187],"118":[2,187],"119":[2,187],"120":[2,187],"127":[2,187],"128":[2,187],"129":[1,126],"131":[2,187],"132":[2,187],"134":[1,93],"135":[1,94],"138":[2,187],"139":[2,187],"140":[2,187],"141":[2,187],"142":[2,187],"143":[2,187],"144":[2,187],"145":[2,187],"146":[2,187],"147":[2,187],"148":[2,187],"149":[2,187],"150":[2,187],"151":[2,187],"152":[2,187],"153":[2,187],"154":[2,187],"155":[2,187],"156":[2,187],"157":[2,187],"158":[2,187],"159":[2,187],"160":[2,187],"161":[2,187],"162":[2,187],"163":[2,187],"164":[2,187]},{"1":[2,188],"4":[2,188],"29":[2,188],"30":[2,188],"50":[1,132],"58":[2,188],"61":[2,188],"79":[2,188],"84":[2,188],"94":[2,188],"99":[2,188],"107":[2,188],"108":129,"109":[2,188],"110":[2,188],"111":[2,188],"114":[2,188],"118":[2,188],"119":[2,188],"120":[2,188],"127":[2,188],"128":[2,188],"129":[1,126],"131":[2,188],"132":[2,188],"134":[1,93],"135":[1,94],"138":[2,188],"139":[2,188],"140":[2,188],"141":[2,188],"142":[2,188],"143":[2,188],"144":[2,188],"145":[2,188],"146":[2,188],"147":[2,188],"148":[2,188],"149":[2,188],"150":[2,188],"151":[2,188],"152":[2,188],"153":[2,188],"154":[2,188],"155":[2,188],"156":[2,188],"157":[2,188],"158":[2,188],"159":[2,188],"160":[2,188],"161":[2,188],"162":[2,188],"163":[2,188],"164":[2,188]},{"1":[2,189],"4":[2,189],"29":[2,189],"30":[2,189],"50":[1,132],"58":[2,189],"61":[2,189],"79":[2,189],"84":[2,189],"94":[2,189],"99":[2,189],"107":[2,189],"108":129,"109":[2,189],"110":[2,189],"111":[2,189],"114":[2,189],"118":[2,189],"119":[2,189],"120":[2,189],"127":[2,189],"128":[2,189],"129":[1,126],"131":[2,189],"132":[2,189],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[2,189],"142":[2,189],"143":[2,189],"144":[2,189],"145":[2,189],"146":[2,189],"147":[2,189],"148":[2,189],"149":[2,189],"150":[2,189],"151":[2,189],"152":[2,189],"153":[2,189],"154":[2,189],"155":[2,189],"156":[2,189],"157":[2,189],"158":[2,189],"159":[2,189],"160":[2,189],"161":[2,189],"162":[2,189],"163":[2,189],"164":[2,189]},{"1":[2,190],"4":[2,190],"29":[2,190],"30":[2,190],"50":[1,132],"58":[2,190],"61":[2,190],"79":[2,190],"84":[2,190],"94":[2,190],"99":[2,190],"107":[2,190],"108":129,"109":[2,190],"110":[2,190],"111":[2,190],"114":[2,190],"118":[2,190],"119":[2,190],"120":[2,190],"127":[2,190],"128":[2,190],"129":[1,126],"131":[2,190],"132":[2,190],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[2,190],"142":[2,190],"143":[2,190],"144":[2,190],"145":[2,190],"146":[2,190],"147":[2,190],"148":[2,190],"149":[2,190],"150":[2,190],"151":[2,190],"152":[2,190],"153":[2,190],"154":[2,190],"155":[2,190],"156":[2,190],"157":[2,190],"158":[2,190],"159":[2,190],"160":[2,190],"161":[2,190],"162":[2,190],"163":[2,190],"164":[2,190]},{"1":[2,191],"4":[2,191],"29":[2,191],"30":[2,191],"50":[1,132],"58":[2,191],"61":[2,191],"79":[2,191],"84":[2,191],"94":[2,191],"99":[2,191],"107":[2,191],"108":129,"109":[2,191],"110":[2,191],"111":[2,191],"114":[2,191],"118":[2,191],"119":[2,191],"120":[2,191],"127":[2,191],"128":[2,191],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[2,191],"142":[2,191],"143":[2,191],"144":[2,191],"145":[2,191],"146":[2,191],"147":[2,191],"148":[2,191],"149":[2,191],"150":[2,191],"151":[2,191],"152":[2,191],"153":[2,191],"154":[2,191],"155":[2,191],"156":[2,191],"157":[2,191],"158":[2,191],"159":[2,191],"160":[2,191],"161":[2,191],"162":[2,191],"163":[2,191],"164":[2,191]},{"1":[2,192],"4":[2,192],"29":[2,192],"30":[2,192],"50":[1,132],"58":[2,192],"61":[2,192],"79":[2,192],"84":[2,192],"94":[2,192],"99":[2,192],"107":[2,192],"108":129,"109":[2,192],"110":[2,192],"111":[2,192],"114":[2,192],"118":[2,192],"119":[2,192],"120":[2,192],"127":[2,192],"128":[2,192],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[2,192],"142":[2,192],"143":[2,192],"144":[2,192],"145":[2,192],"146":[2,192],"147":[2,192],"148":[2,192],"149":[2,192],"150":[2,192],"151":[2,192],"152":[2,192],"153":[2,192],"154":[2,192],"155":[2,192],"156":[2,192],"157":[2,192],"158":[2,192],"159":[2,192],"160":[2,192],"161":[2,192],"162":[2,192],"163":[2,192],"164":[2,192]},{"1":[2,193],"4":[2,193],"29":[2,193],"30":[2,193],"50":[1,132],"58":[2,193],"61":[2,193],"79":[2,193],"84":[2,193],"94":[2,193],"99":[2,193],"107":[2,193],"108":129,"109":[2,193],"110":[2,193],"111":[2,193],"114":[2,193],"118":[2,193],"119":[2,193],"120":[2,193],"127":[2,193],"128":[2,193],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[2,193],"142":[2,193],"143":[2,193],"144":[2,193],"145":[2,193],"146":[2,193],"147":[2,193],"148":[2,193],"149":[2,193],"150":[2,193],"151":[2,193],"152":[2,193],"153":[2,193],"154":[2,193],"155":[2,193],"156":[2,193],"157":[2,193],"158":[2,193],"159":[2,193],"160":[2,193],"161":[2,193],"162":[2,193],"163":[2,193],"164":[2,193]},{"1":[2,194],"4":[2,194],"29":[2,194],"30":[2,194],"50":[1,132],"58":[2,194],"61":[2,194],"79":[2,194],"84":[2,194],"94":[2,194],"99":[2,194],"107":[2,194],"108":129,"109":[2,194],"110":[2,194],"111":[2,194],"114":[2,194],"118":[2,194],"119":[2,194],"120":[2,194],"127":[2,194],"128":[2,194],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[1,100],"142":[1,101],"143":[1,102],"144":[2,194],"145":[2,194],"146":[2,194],"147":[2,194],"148":[2,194],"149":[2,194],"150":[2,194],"151":[2,194],"152":[2,194],"153":[2,194],"154":[2,194],"155":[2,194],"156":[2,194],"157":[2,194],"158":[2,194],"159":[2,194],"160":[2,194],"161":[2,194],"162":[2,194],"163":[2,194],"164":[2,194]},{"1":[2,195],"4":[2,195],"29":[2,195],"30":[2,195],"50":[1,132],"58":[2,195],"61":[2,195],"79":[2,195],"84":[2,195],"94":[2,195],"99":[2,195],"107":[2,195],"108":129,"109":[2,195],"110":[2,195],"111":[2,195],"114":[2,195],"118":[2,195],"119":[2,195],"120":[2,195],"127":[2,195],"128":[2,195],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[1,100],"142":[1,101],"143":[1,102],"144":[2,195],"145":[2,195],"146":[2,195],"147":[2,195],"148":[2,195],"149":[2,195],"150":[2,195],"151":[2,195],"152":[2,195],"153":[2,195],"154":[2,195],"155":[2,195],"156":[2,195],"157":[2,195],"158":[2,195],"159":[2,195],"160":[2,195],"161":[2,195],"162":[2,195],"163":[2,195],"164":[2,195]},{"1":[2,196],"4":[2,196],"29":[2,196],"30":[2,196],"50":[1,132],"58":[2,196],"61":[2,196],"79":[2,196],"84":[2,196],"94":[2,196],"99":[2,196],"107":[2,196],"108":129,"109":[2,196],"110":[2,196],"111":[2,196],"114":[2,196],"118":[2,196],"119":[2,196],"120":[2,196],"127":[2,196],"128":[2,196],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[1,100],"142":[1,101],"143":[1,102],"144":[2,196],"145":[2,196],"146":[2,196],"147":[2,196],"148":[2,196],"149":[2,196],"150":[2,196],"151":[2,196],"152":[2,196],"153":[2,196],"154":[2,196],"155":[2,196],"156":[2,196],"157":[2,196],"158":[2,196],"159":[2,196],"160":[2,196],"161":[2,196],"162":[2,196],"163":[2,196],"164":[2,196]},{"1":[2,197],"4":[2,197],"29":[2,197],"30":[2,197],"50":[1,132],"58":[2,197],"61":[2,197],"79":[2,197],"84":[2,197],"94":[2,197],"99":[2,197],"107":[2,197],"108":129,"109":[2,197],"110":[2,197],"111":[2,197],"114":[2,197],"118":[2,197],"119":[2,197],"120":[2,197],"127":[2,197],"128":[2,197],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[1,100],"142":[1,101],"143":[1,102],"144":[1,103],"145":[1,104],"146":[1,105],"147":[2,197],"148":[2,197],"149":[2,197],"150":[2,197],"151":[2,197],"152":[2,197],"153":[2,197],"154":[2,197],"155":[2,197],"156":[2,197],"157":[2,197],"158":[2,197],"159":[2,197],"160":[2,197],"161":[2,197],"162":[2,197],"163":[2,197],"164":[2,197]},{"1":[2,198],"4":[2,198],"29":[2,198],"30":[2,198],"50":[1,132],"58":[2,198],"61":[2,198],"79":[2,198],"84":[2,198],"94":[2,198],"99":[2,198],"107":[2,198],"108":129,"109":[2,198],"110":[2,198],"111":[2,198],"114":[2,198],"118":[2,198],"119":[2,198],"120":[2,198],"127":[2,198],"128":[2,198],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[1,100],"142":[1,101],"143":[1,102],"144":[1,103],"145":[1,104],"146":[1,105],"147":[2,198],"148":[2,198],"149":[2,198],"150":[2,198],"151":[2,198],"152":[2,198],"153":[2,198],"154":[2,198],"155":[2,198],"156":[2,198],"157":[2,198],"158":[2,198],"159":[2,198],"160":[2,198],"161":[2,198],"162":[2,198],"163":[2,198],"164":[2,198]},{"1":[2,199],"4":[2,199],"29":[2,199],"30":[2,199],"50":[1,132],"58":[2,199],"61":[2,199],"79":[2,199],"84":[2,199],"94":[2,199],"99":[2,199],"107":[2,199],"108":129,"109":[2,199],"110":[2,199],"111":[2,199],"114":[2,199],"118":[2,199],"119":[2,199],"120":[2,199],"127":[2,199],"128":[2,199],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[1,100],"142":[1,101],"143":[1,102],"144":[1,103],"145":[1,104],"146":[1,105],"147":[2,199],"148":[2,199],"149":[2,199],"150":[2,199],"151":[2,199],"152":[2,199],"153":[2,199],"154":[2,199],"155":[2,199],"156":[2,199],"157":[2,199],"158":[2,199],"159":[2,199],"160":[2,199],"161":[2,199],"162":[2,199],"163":[2,199],"164":[2,199]},{"1":[2,200],"4":[2,200],"29":[2,200],"30":[2,200],"50":[1,132],"58":[2,200],"61":[2,200],"79":[2,200],"84":[2,200],"94":[2,200],"99":[2,200],"107":[2,200],"108":129,"109":[2,200],"110":[2,200],"111":[2,200],"114":[2,200],"118":[2,200],"119":[2,200],"120":[2,200],"127":[2,200],"128":[2,200],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[1,100],"142":[1,101],"143":[1,102],"144":[1,103],"145":[1,104],"146":[1,105],"147":[2,200],"148":[2,200],"149":[2,200],"150":[2,200],"151":[2,200],"152":[2,200],"153":[2,200],"154":[2,200],"155":[2,200],"156":[2,200],"157":[2,200],"158":[2,200],"159":[2,200],"160":[2,200],"161":[2,200],"162":[2,200],"163":[2,200],"164":[2,200]},{"1":[2,201],"4":[2,201],"29":[2,201],"30":[2,201],"50":[1,132],"58":[2,201],"61":[2,201],"79":[2,201],"84":[2,201],"94":[2,201],"99":[2,201],"107":[2,201],"108":129,"109":[2,201],"110":[2,201],"111":[2,201],"114":[2,201],"118":[2,201],"119":[2,201],"120":[2,201],"127":[2,201],"128":[2,201],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[1,100],"142":[1,101],"143":[1,102],"144":[1,103],"145":[1,104],"146":[1,105],"147":[1,106],"148":[1,107],"149":[1,108],"150":[1,109],"151":[2,201],"152":[2,201],"153":[2,201],"154":[2,201],"155":[2,201],"156":[2,201],"157":[2,201],"158":[2,201],"159":[2,201],"160":[2,201],"161":[2,201],"162":[2,201],"163":[2,201],"164":[1,123]},{"1":[2,202],"4":[2,202],"29":[2,202],"30":[2,202],"50":[1,132],"58":[2,202],"61":[2,202],"79":[2,202],"84":[2,202],"94":[2,202],"99":[2,202],"107":[2,202],"108":129,"109":[2,202],"110":[2,202],"111":[2,202],"114":[2,202],"118":[2,202],"119":[2,202],"120":[2,202],"127":[2,202],"128":[2,202],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[1,100],"142":[1,101],"143":[1,102],"144":[1,103],"145":[1,104],"146":[1,105],"147":[1,106],"148":[1,107],"149":[1,108],"150":[1,109],"151":[2,202],"152":[2,202],"153":[2,202],"154":[2,202],"155":[2,202],"156":[2,202],"157":[2,202],"158":[2,202],"159":[2,202],"160":[2,202],"161":[2,202],"162":[2,202],"163":[2,202],"164":[1,123]},{"1":[2,203],"4":[2,203],"29":[2,203],"30":[2,203],"50":[1,132],"58":[2,203],"61":[2,203],"79":[2,203],"84":[2,203],"94":[2,203],"99":[2,203],"107":[2,203],"108":129,"109":[2,203],"110":[2,203],"111":[2,203],"114":[2,203],"118":[2,203],"119":[2,203],"120":[2,203],"127":[2,203],"128":[2,203],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[1,100],"142":[1,101],"143":[1,102],"144":[1,103],"145":[1,104],"146":[1,105],"147":[1,106],"148":[1,107],"149":[1,108],"150":[1,109],"151":[1,110],"152":[1,111],"153":[2,203],"154":[2,203],"155":[2,203],"156":[2,203],"157":[2,203],"158":[2,203],"159":[2,203],"160":[2,203],"161":[2,203],"162":[2,203],"163":[2,203],"164":[1,123]},{"1":[2,204],"4":[2,204],"29":[2,204],"30":[2,204],"50":[1,132],"58":[2,204],"61":[2,204],"79":[2,204],"84":[2,204],"94":[2,204],"99":[2,204],"107":[2,204],"108":129,"109":[2,204],"110":[2,204],"111":[2,204],"114":[2,204],"118":[2,204],"119":[2,204],"120":[2,204],"127":[2,204],"128":[2,204],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[1,100],"142":[1,101],"143":[1,102],"144":[1,103],"145":[1,104],"146":[1,105],"147":[1,106],"148":[1,107],"149":[1,108],"150":[1,109],"151":[1,110],"152":[1,111],"153":[2,204],"154":[2,204],"155":[2,204],"156":[2,204],"157":[2,204],"158":[2,204],"159":[2,204],"160":[2,204],"161":[2,204],"162":[2,204],"163":[2,204],"164":[1,123]},{"1":[2,205],"4":[2,205],"29":[2,205],"30":[2,205],"50":[1,132],"58":[2,205],"61":[2,205],"79":[2,205],"84":[2,205],"94":[2,205],"99":[2,205],"107":[2,205],"108":129,"109":[2,205],"110":[2,205],"111":[2,205],"114":[2,205],"118":[2,205],"119":[2,205],"120":[2,205],"127":[2,205],"128":[2,205],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[1,100],"142":[1,101],"143":[1,102],"144":[1,103],"145":[1,104],"146":[1,105],"147":[1,106],"148":[1,107],"149":[1,108],"150":[1,109],"151":[1,110],"152":[1,111],"153":[2,205],"154":[2,205],"155":[2,205],"156":[2,205],"157":[2,205],"158":[2,205],"159":[2,205],"160":[2,205],"161":[2,205],"162":[2,205],"163":[2,205],"164":[1,123]},{"1":[2,206],"4":[2,206],"29":[2,206],"30":[2,206],"50":[1,132],"58":[2,206],"61":[2,206],"79":[2,206],"84":[2,206],"94":[2,206],"99":[2,206],"107":[2,206],"108":129,"109":[2,206],"110":[2,206],"111":[2,206],"114":[2,206],"118":[2,206],"119":[2,206],"120":[2,206],"127":[2,206],"128":[2,206],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[1,100],"142":[1,101],"143":[1,102],"144":[1,103],"145":[1,104],"146":[1,105],"147":[1,106],"148":[1,107],"149":[1,108],"150":[1,109],"151":[1,110],"152":[1,111],"153":[1,112],"154":[1,113],"155":[1,114],"156":[1,115],"157":[1,116],"158":[1,117],"159":[1,118],"160":[1,119],"161":[1,120],"162":[1,121],"163":[1,122],"164":[1,123]},{"1":[2,207],"4":[2,207],"29":[2,207],"30":[2,207],"50":[1,132],"58":[2,207],"61":[2,207],"79":[2,207],"84":[2,207],"94":[2,207],"99":[2,207],"107":[2,207],"108":129,"109":[2,207],"110":[2,207],"111":[2,207],"114":[2,207],"118":[2,207],"119":[2,207],"120":[2,207],"127":[2,207],"128":[2,207],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[1,100],"142":[1,101],"143":[1,102],"144":[1,103],"145":[1,104],"146":[1,105],"147":[1,106],"148":[1,107],"149":[1,108],"150":[1,109],"151":[1,110],"152":[1,111],"153":[1,112],"154":[1,113],"155":[1,114],"156":[1,115],"157":[1,116],"158":[1,117],"159":[1,118],"160":[1,119],"161":[1,120],"162":[1,121],"163":[1,122],"164":[1,123]},{"1":[2,208],"4":[2,208],"29":[2,208],"30":[2,208],"50":[1,132],"58":[2,208],"61":[2,208],"79":[2,208],"84":[2,208],"94":[2,208],"99":[2,208],"107":[2,208],"108":129,"109":[2,208],"110":[2,208],"111":[2,208],"114":[2,208],"118":[2,208],"119":[2,208],"120":[2,208],"127":[2,208],"128":[2,208],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[1,100],"142":[1,101],"143":[1,102],"144":[1,103],"145":[1,104],"146":[1,105],"147":[1,106],"148":[1,107],"149":[1,108],"150":[1,109],"151":[1,110],"152":[1,111],"153":[1,112],"154":[1,113],"155":[1,114],"156":[1,115],"157":[1,116],"158":[1,117],"159":[1,118],"160":[1,119],"161":[1,120],"162":[1,121],"163":[1,122],"164":[1,123]},{"1":[2,209],"4":[2,209],"29":[2,209],"30":[2,209],"50":[1,132],"58":[2,209],"61":[2,209],"79":[2,209],"84":[2,209],"94":[2,209],"99":[2,209],"107":[2,209],"108":129,"109":[2,209],"110":[2,209],"111":[2,209],"114":[2,209],"118":[2,209],"119":[2,209],"120":[2,209],"127":[2,209],"128":[2,209],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[1,100],"142":[1,101],"143":[1,102],"144":[1,103],"145":[1,104],"146":[1,105],"147":[1,106],"148":[1,107],"149":[1,108],"150":[1,109],"151":[1,110],"152":[1,111],"153":[1,112],"154":[1,113],"155":[1,114],"156":[1,115],"157":[1,116],"158":[1,117],"159":[1,118],"160":[1,119],"161":[1,120],"162":[1,121],"163":[1,122],"164":[1,123]},{"1":[2,210],"4":[2,210],"29":[2,210],"30":[2,210],"50":[1,132],"58":[2,210],"61":[2,210],"79":[2,210],"84":[2,210],"94":[2,210],"99":[2,210],"107":[2,210],"108":129,"109":[2,210],"110":[2,210],"111":[2,210],"114":[2,210],"118":[2,210],"119":[2,210],"120":[2,210],"127":[2,210],"128":[2,210],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[1,100],"142":[1,101],"143":[1,102],"144":[1,103],"145":[1,104],"146":[1,105],"147":[1,106],"148":[1,107],"149":[1,108],"150":[1,109],"151":[1,110],"152":[1,111],"153":[1,112],"154":[1,113],"155":[1,114],"156":[1,115],"157":[1,116],"158":[1,117],"159":[1,118],"160":[1,119],"161":[1,120],"162":[1,121],"163":[1,122],"164":[1,123]},{"1":[2,211],"4":[2,211],"29":[2,211],"30":[2,211],"50":[1,132],"58":[2,211],"61":[2,211],"79":[2,211],"84":[2,211],"94":[2,211],"99":[2,211],"107":[2,211],"108":129,"109":[2,211],"110":[2,211],"111":[2,211],"114":[2,211],"118":[2,211],"119":[2,211],"120":[2,211],"127":[2,211],"128":[2,211],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[1,100],"142":[1,101],"143":[1,102],"144":[1,103],"145":[1,104],"146":[1,105],"147":[1,106],"148":[1,107],"149":[1,108],"150":[1,109],"151":[1,110],"152":[1,111],"153":[1,112],"154":[1,113],"155":[1,114],"156":[1,115],"157":[1,116],"158":[1,117],"159":[1,118],"160":[1,119],"161":[1,120],"162":[1,121],"163":[1,122],"164":[1,123]},{"1":[2,212],"4":[2,212],"29":[2,212],"30":[2,212],"50":[1,132],"58":[2,212],"61":[2,212],"79":[2,212],"84":[2,212],"94":[2,212],"99":[2,212],"107":[2,212],"108":129,"109":[2,212],"110":[2,212],"111":[2,212],"114":[2,212],"118":[2,212],"119":[2,212],"120":[2,212],"127":[2,212],"128":[2,212],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[1,100],"142":[1,101],"143":[1,102],"144":[1,103],"145":[1,104],"146":[1,105],"147":[1,106],"148":[1,107],"149":[1,108],"150":[1,109],"151":[1,110],"152":[1,111],"153":[1,112],"154":[1,113],"155":[1,114],"156":[1,115],"157":[1,116],"158":[1,117],"159":[1,118],"160":[1,119],"161":[1,120],"162":[1,121],"163":[1,122],"164":[1,123]},{"1":[2,213],"4":[2,213],"29":[2,213],"30":[2,213],"50":[1,132],"58":[2,213],"61":[2,213],"79":[2,213],"84":[2,213],"94":[2,213],"99":[2,213],"107":[2,213],"108":129,"109":[2,213],"110":[2,213],"111":[2,213],"114":[2,213],"118":[2,213],"119":[2,213],"120":[2,213],"127":[2,213],"128":[2,213],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[1,100],"142":[1,101],"143":[1,102],"144":[1,103],"145":[1,104],"146":[1,105],"147":[1,106],"148":[1,107],"149":[1,108],"150":[1,109],"151":[1,110],"152":[1,111],"153":[1,112],"154":[1,113],"155":[1,114],"156":[1,115],"157":[1,116],"158":[1,117],"159":[1,118],"160":[1,119],"161":[1,120],"162":[1,121],"163":[1,122],"164":[1,123]},{"1":[2,214],"4":[2,214],"29":[2,214],"30":[2,214],"50":[1,132],"58":[2,214],"61":[2,214],"79":[2,214],"84":[2,214],"94":[2,214],"99":[2,214],"107":[2,214],"108":129,"109":[2,214],"110":[2,214],"111":[2,214],"114":[2,214],"118":[2,214],"119":[2,214],"120":[2,214],"127":[2,214],"128":[2,214],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[1,100],"142":[1,101],"143":[1,102],"144":[1,103],"145":[1,104],"146":[1,105],"147":[1,106],"148":[1,107],"149":[1,108],"150":[1,109],"151":[2,214],"152":[2,214],"153":[2,214],"154":[2,214],"155":[2,214],"156":[2,214],"157":[2,214],"158":[2,214],"159":[2,214],"160":[2,214],"161":[2,214],"162":[2,214],"163":[2,214],"164":[1,123]},{"1":[2,215],"4":[2,215],"29":[2,215],"30":[2,215],"50":[1,132],"58":[2,215],"61":[1,131],"79":[2,215],"84":[2,215],"94":[2,215],"99":[2,215],"107":[2,215],"108":129,"109":[2,215],"110":[2,215],"111":[2,215],"114":[2,215],"118":[1,124],"119":[1,125],"120":[2,215],"127":[2,215],"128":[2,215],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[1,100],"142":[1,101],"143":[1,102],"144":[1,103],"145":[1,104],"146":[1,105],"147":[1,106],"148":[1,107],"149":[1,108],"150":[1,109],"151":[1,110],"152":[1,111],"153":[1,112],"154":[1,113],"155":[1,114],"156":[1,115],"157":[1,116],"158":[1,117],"159":[1,118],"160":[1,119],"161":[1,120],"162":[1,121],"163":[1,122],"164":[1,123]},{"1":[2,216],"4":[2,216],"29":[2,216],"30":[2,216],"50":[1,132],"58":[2,216],"61":[1,131],"79":[2,216],"84":[2,216],"94":[2,216],"99":[2,216],"107":[2,216],"108":129,"109":[2,216],"110":[2,216],"111":[2,216],"114":[2,216],"118":[1,124],"119":[1,125],"120":[2,216],"127":[2,216],"128":[2,216],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[1,100],"142":[1,101],"143":[1,102],"144":[1,103],"145":[1,104],"146":[1,105],"147":[1,106],"148":[1,107],"149":[1,108],"150":[1,109],"151":[1,110],"152":[1,111],"153":[1,112],"154":[1,113],"155":[1,114],"156":[1,115],"157":[1,116],"158":[1,117],"159":[1,118],"160":[1,119],"161":[1,120],"162":[1,121],"163":[1,122],"164":[1,123]},{"8":287,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"8":288,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"1":[2,172],"4":[2,172],"29":[2,172],"30":[2,172],"50":[1,132],"58":[2,172],"61":[1,131],"79":[2,172],"84":[2,172],"94":[2,172],"99":[2,172],"107":[2,172],"108":129,"109":[1,79],"110":[2,172],"111":[1,80],"114":[1,130],"118":[1,124],"119":[1,125],"120":[2,172],"127":[1,127],"128":[1,128],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[1,100],"142":[1,101],"143":[1,102],"144":[1,103],"145":[1,104],"146":[1,105],"147":[1,106],"148":[1,107],"149":[1,108],"150":[1,109],"151":[1,110],"152":[1,111],"153":[1,112],"154":[1,113],"155":[1,114],"156":[1,115],"157":[1,116],"158":[1,117],"159":[1,118],"160":[1,119],"161":[1,120],"162":[1,121],"163":[1,122],"164":[1,123]},{"1":[2,174],"4":[2,174],"29":[2,174],"30":[2,174],"50":[1,132],"58":[2,174],"61":[1,131],"79":[2,174],"84":[2,174],"94":[2,174],"99":[2,174],"107":[2,174],"108":129,"109":[1,79],"110":[2,174],"111":[1,80],"114":[1,130],"118":[1,124],"119":[1,125],"120":[2,174],"127":[1,127],"128":[1,128],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[1,100],"142":[1,101],"143":[1,102],"144":[1,103],"145":[1,104],"146":[1,105],"147":[1,106],"148":[1,107],"149":[1,108],"150":[1,109],"151":[1,110],"152":[1,111],"153":[1,112],"154":[1,113],"155":[1,114],"156":[1,115],"157":[1,116],"158":[1,117],"159":[1,118],"160":[1,119],"161":[1,120],"162":[1,121],"163":[1,122],"164":[1,123]},{"116":289,"118":[1,265],"119":[1,266]},{"61":[1,290]},{"1":[2,171],"4":[2,171],"29":[2,171],"30":[2,171],"50":[1,132],"58":[2,171],"61":[1,131],"79":[2,171],"84":[2,171],"94":[2,171],"99":[2,171],"107":[2,171],"108":129,"109":[1,79],"110":[2,171],"111":[1,80],"114":[1,130],"118":[1,124],"119":[1,125],"120":[2,171],"127":[1,127],"128":[1,128],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[1,100],"142":[1,101],"143":[1,102],"144":[1,103],"145":[1,104],"146":[1,105],"147":[1,106],"148":[1,107],"149":[1,108],"150":[1,109],"151":[1,110],"152":[1,111],"153":[1,112],"154":[1,113],"155":[1,114],"156":[1,115],"157":[1,116],"158":[1,117],"159":[1,118],"160":[1,119],"161":[1,120],"162":[1,121],"163":[1,122],"164":[1,123]},{"1":[2,173],"4":[2,173],"29":[2,173],"30":[2,173],"50":[1,132],"58":[2,173],"61":[1,131],"79":[2,173],"84":[2,173],"94":[2,173],"99":[2,173],"107":[2,173],"108":129,"109":[1,79],"110":[2,173],"111":[1,80],"114":[1,130],"118":[1,124],"119":[1,125],"120":[2,173],"127":[1,127],"128":[1,128],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[1,100],"142":[1,101],"143":[1,102],"144":[1,103],"145":[1,104],"146":[1,105],"147":[1,106],"148":[1,107],"149":[1,108],"150":[1,109],"151":[1,110],"152":[1,111],"153":[1,112],"154":[1,113],"155":[1,114],"156":[1,115],"157":[1,116],"158":[1,117],"159":[1,118],"160":[1,119],"161":[1,120],"162":[1,121],"163":[1,122],"164":[1,123]},{"116":291,"118":[1,265],"119":[1,266]},{"4":[2,58],"29":[2,58],"57":292,"58":[1,278],"94":[2,58]},{"4":[2,121],"29":[2,121],"30":[2,121],"50":[1,132],"58":[2,121],"61":[1,131],"94":[2,121],"99":[2,121],"108":129,"109":[1,79],"111":[1,80],"114":[1,130],"118":[1,124],"119":[1,125],"127":[1,127],"128":[1,128],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[1,100],"142":[1,101],"143":[1,102],"144":[1,103],"145":[1,104],"146":[1,105],"147":[1,106],"148":[1,107],"149":[1,108],"150":[1,109],"151":[1,110],"152":[1,111],"153":[1,112],"154":[1,113],"155":[1,114],"156":[1,115],"157":[1,116],"158":[1,117],"159":[1,118],"160":[1,119],"161":[1,120],"162":[1,121],"163":[1,122],"164":[1,123]},{"1":[2,79],"4":[2,79],"29":[2,79],"30":[2,79],"46":[2,79],"50":[2,79],"58":[2,79],"61":[2,79],"72":[2,79],"73":[2,79],"74":[2,79],"75":[2,79],"78":[2,79],"79":[2,79],"80":[2,79],"81":[2,79],"84":[2,79],"86":[2,79],"92":[2,79],"94":[2,79],"99":[2,79],"107":[2,79],"109":[2,79],"110":[2,79],"111":[2,79],"114":[2,79],"118":[2,79],"119":[2,79],"120":[2,79],"127":[2,79],"128":[2,79],"129":[2,79],"131":[2,79],"132":[2,79],"134":[2,79],"135":[2,79],"138":[2,79],"139":[2,79],"140":[2,79],"141":[2,79],"142":[2,79],"143":[2,79],"144":[2,79],"145":[2,79],"146":[2,79],"147":[2,79],"148":[2,79],"149":[2,79],"150":[2,79],"151":[2,79],"152":[2,79],"153":[2,79],"154":[2,79],"155":[2,79],"156":[2,79],"157":[2,79],"158":[2,79],"159":[2,79],"160":[2,79],"161":[2,79],"162":[2,79],"163":[2,79],"164":[2,79]},{"1":[2,80],"4":[2,80],"29":[2,80],"30":[2,80],"46":[2,80],"50":[2,80],"58":[2,80],"61":[2,80],"72":[2,80],"73":[2,80],"74":[2,80],"75":[2,80],"78":[2,80],"79":[2,80],"80":[2,80],"81":[2,80],"84":[2,80],"86":[2,80],"92":[2,80],"94":[2,80],"99":[2,80],"107":[2,80],"109":[2,80],"110":[2,80],"111":[2,80],"114":[2,80],"118":[2,80],"119":[2,80],"120":[2,80],"127":[2,80],"128":[2,80],"129":[2,80],"131":[2,80],"132":[2,80],"134":[2,80],"135":[2,80],"138":[2,80],"139":[2,80],"140":[2,80],"141":[2,80],"142":[2,80],"143":[2,80],"144":[2,80],"145":[2,80],"146":[2,80],"147":[2,80],"148":[2,80],"149":[2,80],"150":[2,80],"151":[2,80],"152":[2,80],"153":[2,80],"154":[2,80],"155":[2,80],"156":[2,80],"157":[2,80],"158":[2,80],"159":[2,80],"160":[2,80],"161":[2,80],"162":[2,80],"163":[2,80],"164":[2,80]},{"1":[2,82],"4":[2,82],"29":[2,82],"30":[2,82],"46":[2,82],"50":[2,82],"58":[2,82],"61":[2,82],"72":[2,82],"73":[2,82],"74":[2,82],"75":[2,82],"78":[2,82],"79":[2,82],"80":[2,82],"81":[2,82],"84":[2,82],"86":[2,82],"92":[2,82],"94":[2,82],"99":[2,82],"107":[2,82],"109":[2,82],"110":[2,82],"111":[2,82],"114":[2,82],"118":[2,82],"119":[2,82],"120":[2,82],"127":[2,82],"128":[2,82],"129":[2,82],"131":[2,82],"132":[2,82],"134":[2,82],"135":[2,82],"138":[2,82],"139":[2,82],"140":[2,82],"141":[2,82],"142":[2,82],"143":[2,82],"144":[2,82],"145":[2,82],"146":[2,82],"147":[2,82],"148":[2,82],"149":[2,82],"150":[2,82],"151":[2,82],"152":[2,82],"153":[2,82],"154":[2,82],"155":[2,82],"156":[2,82],"157":[2,82],"158":[2,82],"159":[2,82],"160":[2,82],"161":[2,82],"162":[2,82],"163":[2,82],"164":[2,82]},{"50":[1,132],"61":[1,294],"79":[1,293],"108":129,"109":[1,79],"111":[1,80],"114":[1,130],"118":[1,124],"119":[1,125],"127":[1,127],"128":[1,128],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[1,100],"142":[1,101],"143":[1,102],"144":[1,103],"145":[1,104],"146":[1,105],"147":[1,106],"148":[1,107],"149":[1,108],"150":[1,109],"151":[1,110],"152":[1,111],"153":[1,112],"154":[1,113],"155":[1,114],"156":[1,115],"157":[1,116],"158":[1,117],"159":[1,118],"160":[1,119],"161":[1,120],"162":[1,121],"163":[1,122],"164":[1,123]},{"1":[2,86],"4":[2,86],"29":[2,86],"30":[2,86],"46":[2,86],"50":[2,86],"58":[2,86],"61":[2,86],"72":[2,86],"73":[2,86],"74":[2,86],"75":[2,86],"78":[2,86],"79":[2,86],"80":[2,86],"81":[2,86],"84":[2,86],"86":[2,86],"92":[2,86],"94":[2,86],"99":[2,86],"107":[2,86],"109":[2,86],"110":[2,86],"111":[2,86],"114":[2,86],"118":[2,86],"119":[2,86],"120":[2,86],"127":[2,86],"128":[2,86],"129":[2,86],"131":[2,86],"132":[2,86],"134":[2,86],"135":[2,86],"138":[2,86],"139":[2,86],"140":[2,86],"141":[2,86],"142":[2,86],"143":[2,86],"144":[2,86],"145":[2,86],"146":[2,86],"147":[2,86],"148":[2,86],"149":[2,86],"150":[2,86],"151":[2,86],"152":[2,86],"153":[2,86],"154":[2,86],"155":[2,86],"156":[2,86],"157":[2,86],"158":[2,86],"159":[2,86],"160":[2,86],"161":[2,86],"162":[2,86],"163":[2,86],"164":[2,86]},{"8":295,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"1":[2,87],"4":[2,87],"29":[2,87],"30":[2,87],"46":[2,87],"50":[2,87],"58":[2,87],"61":[2,87],"72":[2,87],"73":[2,87],"74":[2,87],"75":[2,87],"78":[2,87],"79":[2,87],"80":[2,87],"81":[2,87],"84":[2,87],"86":[2,87],"92":[2,87],"94":[2,87],"99":[2,87],"107":[2,87],"109":[2,87],"110":[2,87],"111":[2,87],"114":[2,87],"118":[2,87],"119":[2,87],"120":[2,87],"127":[2,87],"128":[2,87],"129":[2,87],"131":[2,87],"132":[2,87],"134":[2,87],"135":[2,87],"138":[2,87],"139":[2,87],"140":[2,87],"141":[2,87],"142":[2,87],"143":[2,87],"144":[2,87],"145":[2,87],"146":[2,87],"147":[2,87],"148":[2,87],"149":[2,87],"150":[2,87],"151":[2,87],"152":[2,87],"153":[2,87],"154":[2,87],"155":[2,87],"156":[2,87],"157":[2,87],"158":[2,87],"159":[2,87],"160":[2,87],"161":[2,87],"162":[2,87],"163":[2,87],"164":[2,87]},{"1":[2,44],"4":[2,44],"29":[2,44],"30":[2,44],"50":[1,132],"58":[2,44],"61":[1,131],"79":[2,44],"84":[2,44],"94":[2,44],"99":[2,44],"107":[2,44],"108":129,"109":[1,79],"110":[2,44],"111":[1,80],"114":[1,130],"118":[1,124],"119":[1,125],"120":[2,44],"127":[2,44],"128":[2,44],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[1,100],"142":[1,101],"143":[1,102],"144":[1,103],"145":[1,104],"146":[1,105],"147":[1,106],"148":[1,107],"149":[1,108],"150":[1,109],"151":[1,110],"152":[1,111],"153":[1,112],"154":[1,113],"155":[1,114],"156":[1,115],"157":[1,116],"158":[1,117],"159":[1,118],"160":[1,119],"161":[1,120],"162":[1,121],"163":[1,122],"164":[1,123]},{"54":296,"55":[1,75],"56":[1,76]},{"59":297,"60":[1,158]},{"61":[1,298]},{"8":299,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"1":[2,169],"4":[2,169],"29":[2,169],"30":[2,169],"50":[2,169],"58":[2,169],"61":[2,169],"79":[2,169],"84":[2,169],"94":[2,169],"99":[2,169],"107":[2,169],"109":[2,169],"110":[2,169],"111":[2,169],"114":[2,169],"118":[2,169],"119":[2,169],"120":[2,169],"123":[2,169],"127":[2,169],"128":[2,169],"129":[2,169],"131":[2,169],"132":[2,169],"134":[2,169],"135":[2,169],"138":[2,169],"139":[2,169],"140":[2,169],"141":[2,169],"142":[2,169],"143":[2,169],"144":[2,169],"145":[2,169],"146":[2,169],"147":[2,169],"148":[2,169],"149":[2,169],"150":[2,169],"151":[2,169],"152":[2,169],"153":[2,169],"154":[2,169],"155":[2,169],"156":[2,169],"157":[2,169],"158":[2,169],"159":[2,169],"160":[2,169],"161":[2,169],"162":[2,169],"163":[2,169],"164":[2,169]},{"1":[2,127],"4":[2,127],"29":[2,127],"30":[2,127],"50":[2,127],"58":[2,127],"61":[2,127],"79":[2,127],"84":[2,127],"94":[2,127],"99":[2,127],"103":[1,300],"107":[2,127],"109":[2,127],"110":[2,127],"111":[2,127],"114":[2,127],"118":[2,127],"119":[2,127],"120":[2,127],"127":[2,127],"128":[2,127],"129":[2,127],"131":[2,127],"132":[2,127],"134":[2,127],"135":[2,127],"138":[2,127],"139":[2,127],"140":[2,127],"141":[2,127],"142":[2,127],"143":[2,127],"144":[2,127],"145":[2,127],"146":[2,127],"147":[2,127],"148":[2,127],"149":[2,127],"150":[2,127],"151":[2,127],"152":[2,127],"153":[2,127],"154":[2,127],"155":[2,127],"156":[2,127],"157":[2,127],"158":[2,127],"159":[2,127],"160":[2,127],"161":[2,127],"162":[2,127],"163":[2,127],"164":[2,127]},{"4":[1,160],"6":301,"29":[1,6]},{"31":302,"32":[1,87]},{"4":[1,160],"6":303,"29":[1,6]},{"8":304,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"8":305,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"31":176,"32":[1,87],"66":177,"67":178,"82":[1,84],"98":[1,179],"117":306},{"122":307,"124":270,"125":[1,271]},{"30":[1,308],"123":[1,309],"124":310,"125":[1,271]},{"30":[2,162],"123":[2,162],"125":[2,162]},{"8":312,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"100":311,"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"1":[2,107],"4":[2,107],"29":[2,107],"30":[2,107],"50":[2,107],"58":[2,107],"61":[2,107],"63":138,"72":[1,140],"73":[1,141],"74":[1,142],"75":[1,143],"76":144,"77":145,"78":[1,146],"79":[2,107],"80":[1,147],"81":[1,148],"84":[2,107],"91":137,"92":[1,139],"94":[2,107],"99":[2,107],"107":[2,107],"109":[2,107],"110":[2,107],"111":[2,107],"114":[2,107],"118":[2,107],"119":[2,107],"120":[2,107],"127":[2,107],"128":[2,107],"129":[2,107],"131":[2,107],"132":[2,107],"134":[2,107],"135":[2,107],"138":[2,107],"139":[2,107],"140":[2,107],"141":[2,107],"142":[2,107],"143":[2,107],"144":[2,107],"145":[2,107],"146":[2,107],"147":[2,107],"148":[2,107],"149":[2,107],"150":[2,107],"151":[2,107],"152":[2,107],"153":[2,107],"154":[2,107],"155":[2,107],"156":[2,107],"157":[2,107],"158":[2,107],"159":[2,107],"160":[2,107],"161":[2,107],"162":[2,107],"163":[2,107],"164":[2,107]},{"14":313,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":154,"62":155,"64":185,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"96":[1,72],"97":[1,73],"98":[1,71],"106":[1,70]},{"4":[2,100],"28":203,"30":[2,100],"31":201,"32":[1,87],"33":202,"34":[1,85],"35":[1,86],"47":316,"49":[1,56],"65":317,"87":314,"88":315,"97":[1,318]},{"1":[2,132],"4":[2,132],"29":[2,132],"30":[2,132],"50":[2,132],"58":[2,132],"61":[2,132],"72":[2,132],"73":[2,132],"74":[2,132],"75":[2,132],"78":[2,132],"79":[2,132],"80":[2,132],"81":[2,132],"84":[2,132],"92":[2,132],"94":[2,132],"99":[2,132],"107":[2,132],"109":[2,132],"110":[2,132],"111":[2,132],"114":[2,132],"118":[2,132],"119":[2,132],"120":[2,132],"127":[2,132],"128":[2,132],"129":[2,132],"131":[2,132],"132":[2,132],"134":[2,132],"135":[2,132],"138":[2,132],"139":[2,132],"140":[2,132],"141":[2,132],"142":[2,132],"143":[2,132],"144":[2,132],"145":[2,132],"146":[2,132],"147":[2,132],"148":[2,132],"149":[2,132],"150":[2,132],"151":[2,132],"152":[2,132],"153":[2,132],"154":[2,132],"155":[2,132],"156":[2,132],"157":[2,132],"158":[2,132],"159":[2,132],"160":[2,132],"161":[2,132],"162":[2,132],"163":[2,132],"164":[2,132]},{"61":[1,319]},{"4":[1,321],"29":[1,322],"99":[1,320]},{"4":[2,59],"8":323,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"29":[2,59],"30":[2,59],"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"94":[2,59],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"99":[2,59],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"1":[2,166],"4":[2,166],"29":[2,166],"30":[2,166],"50":[2,166],"58":[2,166],"61":[2,166],"79":[2,166],"84":[2,166],"94":[2,166],"99":[2,166],"107":[2,166],"109":[2,166],"110":[2,166],"111":[2,166],"114":[2,166],"118":[2,166],"119":[2,166],"120":[2,166],"123":[2,166],"127":[2,166],"128":[2,166],"129":[2,166],"131":[2,166],"132":[2,166],"134":[2,166],"135":[2,166],"138":[2,166],"139":[2,166],"140":[2,166],"141":[2,166],"142":[2,166],"143":[2,166],"144":[2,166],"145":[2,166],"146":[2,166],"147":[2,166],"148":[2,166],"149":[2,166],"150":[2,166],"151":[2,166],"152":[2,166],"153":[2,166],"154":[2,166],"155":[2,166],"156":[2,166],"157":[2,166],"158":[2,166],"159":[2,166],"160":[2,166],"161":[2,166],"162":[2,166],"163":[2,166],"164":[2,166]},{"1":[2,167],"4":[2,167],"29":[2,167],"30":[2,167],"50":[2,167],"58":[2,167],"61":[2,167],"79":[2,167],"84":[2,167],"94":[2,167],"99":[2,167],"107":[2,167],"109":[2,167],"110":[2,167],"111":[2,167],"114":[2,167],"118":[2,167],"119":[2,167],"120":[2,167],"123":[2,167],"127":[2,167],"128":[2,167],"129":[2,167],"131":[2,167],"132":[2,167],"134":[2,167],"135":[2,167],"138":[2,167],"139":[2,167],"140":[2,167],"141":[2,167],"142":[2,167],"143":[2,167],"144":[2,167],"145":[2,167],"146":[2,167],"147":[2,167],"148":[2,167],"149":[2,167],"150":[2,167],"151":[2,167],"152":[2,167],"153":[2,167],"154":[2,167],"155":[2,167],"156":[2,167],"157":[2,167],"158":[2,167],"159":[2,167],"160":[2,167],"161":[2,167],"162":[2,167],"163":[2,167],"164":[2,167]},{"8":324,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"8":325,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"4":[1,327],"29":[1,328],"84":[1,326]},{"4":[2,59],"28":203,"29":[2,59],"30":[2,59],"31":201,"32":[1,87],"33":202,"34":[1,85],"35":[1,86],"47":329,"49":[1,56],"84":[2,59]},{"8":330,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"8":331,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"1":[2,217],"4":[2,217],"29":[2,217],"30":[2,217],"50":[1,132],"58":[2,217],"61":[2,217],"79":[2,217],"84":[2,217],"94":[2,217],"99":[2,217],"107":[2,217],"108":129,"109":[2,217],"110":[2,217],"111":[2,217],"114":[2,217],"118":[2,217],"119":[2,217],"120":[2,217],"127":[2,217],"128":[2,217],"131":[2,217],"132":[2,217],"138":[2,217],"139":[2,217],"140":[2,217],"141":[2,217],"142":[2,217],"143":[2,217],"144":[2,217],"145":[2,217],"146":[2,217],"147":[2,217],"148":[2,217],"149":[2,217],"150":[2,217],"151":[2,217],"152":[2,217],"153":[2,217],"154":[2,217],"155":[2,217],"156":[2,217],"157":[2,217],"158":[2,217],"159":[2,217],"160":[2,217],"161":[2,217],"162":[2,217],"163":[2,217],"164":[2,217]},{"1":[2,218],"4":[2,218],"29":[2,218],"30":[2,218],"50":[1,132],"58":[2,218],"61":[2,218],"79":[2,218],"84":[2,218],"94":[2,218],"99":[2,218],"107":[2,218],"108":129,"109":[2,218],"110":[2,218],"111":[2,218],"114":[2,218],"118":[2,218],"119":[2,218],"120":[2,218],"127":[2,218],"128":[2,218],"131":[2,218],"132":[2,218],"138":[2,218],"139":[2,218],"140":[2,218],"141":[2,218],"142":[2,218],"143":[2,218],"144":[2,218],"145":[2,218],"146":[2,218],"147":[2,218],"148":[2,218],"149":[2,218],"150":[2,218],"151":[2,218],"152":[2,218],"153":[2,218],"154":[2,218],"155":[2,218],"156":[2,218],"157":[2,218],"158":[2,218],"159":[2,218],"160":[2,218],"161":[2,218],"162":[2,218],"163":[2,218],"164":[2,218]},{"1":[2,144],"4":[2,144],"29":[2,144],"30":[2,144],"50":[2,144],"58":[2,144],"61":[2,144],"79":[2,144],"84":[2,144],"94":[2,144],"99":[2,144],"107":[2,144],"109":[2,144],"110":[2,144],"111":[2,144],"114":[2,144],"118":[2,144],"119":[2,144],"120":[2,144],"127":[2,144],"128":[2,144],"129":[2,144],"131":[2,144],"132":[2,144],"134":[2,144],"135":[2,144],"138":[2,144],"139":[2,144],"140":[2,144],"141":[2,144],"142":[2,144],"143":[2,144],"144":[2,144],"145":[2,144],"146":[2,144],"147":[2,144],"148":[2,144],"149":[2,144],"150":[2,144],"151":[2,144],"152":[2,144],"153":[2,144],"154":[2,144],"155":[2,144],"156":[2,144],"157":[2,144],"158":[2,144],"159":[2,144],"160":[2,144],"161":[2,144],"162":[2,144],"163":[2,144],"164":[2,144]},{"1":[2,65],"4":[2,65],"29":[2,65],"30":[2,65],"50":[2,65],"58":[2,65],"61":[2,65],"79":[2,65],"84":[2,65],"94":[2,65],"99":[2,65],"107":[2,65],"109":[2,65],"110":[2,65],"111":[2,65],"114":[2,65],"118":[2,65],"119":[2,65],"120":[2,65],"127":[2,65],"128":[2,65],"129":[2,65],"131":[2,65],"132":[2,65],"134":[2,65],"135":[2,65],"138":[2,65],"139":[2,65],"140":[2,65],"141":[2,65],"142":[2,65],"143":[2,65],"144":[2,65],"145":[2,65],"146":[2,65],"147":[2,65],"148":[2,65],"149":[2,65],"150":[2,65],"151":[2,65],"152":[2,65],"153":[2,65],"154":[2,65],"155":[2,65],"156":[2,65],"157":[2,65],"158":[2,65],"159":[2,65],"160":[2,65],"161":[2,65],"162":[2,65],"163":[2,65],"164":[2,65]},{"1":[2,143],"4":[2,143],"29":[2,143],"30":[2,143],"50":[2,143],"58":[2,143],"61":[2,143],"79":[2,143],"84":[2,143],"94":[2,143],"99":[2,143],"107":[2,143],"109":[2,143],"110":[2,143],"111":[2,143],"114":[2,143],"118":[2,143],"119":[2,143],"120":[2,143],"127":[2,143],"128":[2,143],"129":[2,143],"131":[2,143],"132":[2,143],"134":[2,143],"135":[2,143],"138":[2,143],"139":[2,143],"140":[2,143],"141":[2,143],"142":[2,143],"143":[2,143],"144":[2,143],"145":[2,143],"146":[2,143],"147":[2,143],"148":[2,143],"149":[2,143],"150":[2,143],"151":[2,143],"152":[2,143],"153":[2,143],"154":[2,143],"155":[2,143],"156":[2,143],"157":[2,143],"158":[2,143],"159":[2,143],"160":[2,143],"161":[2,143],"162":[2,143],"163":[2,143],"164":[2,143]},{"4":[1,321],"29":[1,322],"94":[1,332]},{"1":[2,85],"4":[2,85],"29":[2,85],"30":[2,85],"46":[2,85],"50":[2,85],"58":[2,85],"61":[2,85],"72":[2,85],"73":[2,85],"74":[2,85],"75":[2,85],"78":[2,85],"79":[2,85],"80":[2,85],"81":[2,85],"84":[2,85],"86":[2,85],"92":[2,85],"94":[2,85],"99":[2,85],"107":[2,85],"109":[2,85],"110":[2,85],"111":[2,85],"114":[2,85],"118":[2,85],"119":[2,85],"120":[2,85],"127":[2,85],"128":[2,85],"129":[2,85],"131":[2,85],"132":[2,85],"134":[2,85],"135":[2,85],"138":[2,85],"139":[2,85],"140":[2,85],"141":[2,85],"142":[2,85],"143":[2,85],"144":[2,85],"145":[2,85],"146":[2,85],"147":[2,85],"148":[2,85],"149":[2,85],"150":[2,85],"151":[2,85],"152":[2,85],"153":[2,85],"154":[2,85],"155":[2,85],"156":[2,85],"157":[2,85],"158":[2,85],"159":[2,85],"160":[2,85],"161":[2,85],"162":[2,85],"163":[2,85],"164":[2,85]},{"61":[1,333]},{"50":[1,132],"61":[1,131],"79":[1,293],"108":129,"109":[1,79],"111":[1,80],"114":[1,130],"118":[1,124],"119":[1,125],"127":[1,127],"128":[1,128],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[1,100],"142":[1,101],"143":[1,102],"144":[1,103],"145":[1,104],"146":[1,105],"147":[1,106],"148":[1,107],"149":[1,108],"150":[1,109],"151":[1,110],"152":[1,111],"153":[1,112],"154":[1,113],"155":[1,114],"156":[1,115],"157":[1,116],"158":[1,117],"159":[1,118],"160":[1,119],"161":[1,120],"162":[1,121],"163":[1,122],"164":[1,123]},{"4":[1,160],"6":334,"29":[1,6]},{"53":[2,62],"58":[2,62],"61":[1,258]},{"61":[1,335]},{"4":[1,160],"6":336,"29":[1,6],"50":[1,132],"61":[1,131],"108":129,"109":[1,79],"111":[1,80],"114":[1,130],"118":[1,124],"119":[1,125],"127":[1,127],"128":[1,128],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[1,100],"142":[1,101],"143":[1,102],"144":[1,103],"145":[1,104],"146":[1,105],"147":[1,106],"148":[1,107],"149":[1,108],"150":[1,109],"151":[1,110],"152":[1,111],"153":[1,112],"154":[1,113],"155":[1,114],"156":[1,115],"157":[1,116],"158":[1,117],"159":[1,118],"160":[1,119],"161":[1,120],"162":[1,121],"163":[1,122],"164":[1,123]},{"4":[1,160],"6":337,"29":[1,6]},{"1":[2,128],"4":[2,128],"29":[2,128],"30":[2,128],"50":[2,128],"58":[2,128],"61":[2,128],"79":[2,128],"84":[2,128],"94":[2,128],"99":[2,128],"107":[2,128],"109":[2,128],"110":[2,128],"111":[2,128],"114":[2,128],"118":[2,128],"119":[2,128],"120":[2,128],"127":[2,128],"128":[2,128],"129":[2,128],"131":[2,128],"132":[2,128],"134":[2,128],"135":[2,128],"138":[2,128],"139":[2,128],"140":[2,128],"141":[2,128],"142":[2,128],"143":[2,128],"144":[2,128],"145":[2,128],"146":[2,128],"147":[2,128],"148":[2,128],"149":[2,128],"150":[2,128],"151":[2,128],"152":[2,128],"153":[2,128],"154":[2,128],"155":[2,128],"156":[2,128],"157":[2,128],"158":[2,128],"159":[2,128],"160":[2,128],"161":[2,128],"162":[2,128],"163":[2,128],"164":[2,128]},{"4":[1,160],"6":338,"29":[1,6]},{"1":[2,145],"4":[2,145],"29":[2,145],"30":[2,145],"50":[2,145],"58":[2,145],"61":[2,145],"79":[2,145],"84":[2,145],"94":[2,145],"99":[2,145],"107":[2,145],"109":[2,145],"110":[2,145],"111":[2,145],"114":[2,145],"118":[2,145],"119":[2,145],"120":[2,145],"127":[2,145],"128":[2,145],"129":[2,145],"131":[2,145],"132":[2,145],"134":[2,145],"135":[2,145],"138":[2,145],"139":[2,145],"140":[2,145],"141":[2,145],"142":[2,145],"143":[2,145],"144":[2,145],"145":[2,145],"146":[2,145],"147":[2,145],"148":[2,145],"149":[2,145],"150":[2,145],"151":[2,145],"152":[2,145],"153":[2,145],"154":[2,145],"155":[2,145],"156":[2,145],"157":[2,145],"158":[2,145],"159":[2,145],"160":[2,145],"161":[2,145],"162":[2,145],"163":[2,145],"164":[2,145]},{"1":[2,151],"4":[2,151],"29":[2,151],"30":[2,151],"50":[1,132],"58":[2,151],"61":[1,131],"79":[2,151],"84":[2,151],"94":[2,151],"99":[2,151],"107":[2,151],"108":129,"109":[2,151],"110":[1,339],"111":[2,151],"114":[2,151],"118":[1,124],"119":[1,125],"120":[1,340],"127":[2,151],"128":[2,151],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[1,100],"142":[1,101],"143":[1,102],"144":[1,103],"145":[1,104],"146":[1,105],"147":[1,106],"148":[1,107],"149":[1,108],"150":[1,109],"151":[1,110],"152":[1,111],"153":[1,112],"154":[1,113],"155":[1,114],"156":[1,115],"157":[1,116],"158":[1,117],"159":[1,118],"160":[1,119],"161":[1,120],"162":[1,121],"163":[1,122],"164":[1,123]},{"1":[2,152],"4":[2,152],"29":[2,152],"30":[2,152],"50":[1,132],"58":[2,152],"61":[1,131],"79":[2,152],"84":[2,152],"94":[2,152],"99":[2,152],"107":[2,152],"108":129,"109":[2,152],"110":[1,341],"111":[2,152],"114":[2,152],"118":[1,124],"119":[1,125],"120":[2,152],"127":[2,152],"128":[2,152],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[1,100],"142":[1,101],"143":[1,102],"144":[1,103],"145":[1,104],"146":[1,105],"147":[1,106],"148":[1,107],"149":[1,108],"150":[1,109],"151":[1,110],"152":[1,111],"153":[1,112],"154":[1,113],"155":[1,114],"156":[1,115],"157":[1,116],"158":[1,117],"159":[1,118],"160":[1,119],"161":[1,120],"162":[1,121],"163":[1,122],"164":[1,123]},{"118":[2,150],"119":[2,150]},{"30":[1,342],"123":[1,343],"124":310,"125":[1,271]},{"1":[2,160],"4":[2,160],"29":[2,160],"30":[2,160],"50":[2,160],"58":[2,160],"61":[2,160],"79":[2,160],"84":[2,160],"94":[2,160],"99":[2,160],"107":[2,160],"109":[2,160],"110":[2,160],"111":[2,160],"114":[2,160],"118":[2,160],"119":[2,160],"120":[2,160],"127":[2,160],"128":[2,160],"129":[2,160],"131":[2,160],"132":[2,160],"134":[2,160],"135":[2,160],"138":[2,160],"139":[2,160],"140":[2,160],"141":[2,160],"142":[2,160],"143":[2,160],"144":[2,160],"145":[2,160],"146":[2,160],"147":[2,160],"148":[2,160],"149":[2,160],"150":[2,160],"151":[2,160],"152":[2,160],"153":[2,160],"154":[2,160],"155":[2,160],"156":[2,160],"157":[2,160],"158":[2,160],"159":[2,160],"160":[2,160],"161":[2,160],"162":[2,160],"163":[2,160],"164":[2,160]},{"4":[1,160],"6":344,"29":[1,6]},{"30":[2,163],"123":[2,163],"125":[2,163]},{"4":[1,160],"6":345,"29":[1,6],"58":[1,346]},{"4":[2,125],"29":[2,125],"50":[1,132],"58":[2,125],"61":[1,131],"108":129,"109":[1,79],"111":[1,80],"114":[1,130],"118":[1,124],"119":[1,125],"127":[1,127],"128":[1,128],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[1,100],"142":[1,101],"143":[1,102],"144":[1,103],"145":[1,104],"146":[1,105],"147":[1,106],"148":[1,107],"149":[1,108],"150":[1,109],"151":[1,110],"152":[1,111],"153":[1,112],"154":[1,113],"155":[1,114],"156":[1,115],"157":[1,116],"158":[1,117],"159":[1,118],"160":[1,119],"161":[1,120],"162":[1,121],"163":[1,122],"164":[1,123]},{"1":[2,95],"4":[2,95],"29":[1,347],"30":[2,95],"50":[2,95],"58":[2,95],"61":[2,95],"63":138,"72":[1,140],"73":[1,141],"74":[1,142],"75":[1,143],"76":144,"77":145,"78":[1,146],"79":[2,95],"80":[1,147],"81":[1,148],"84":[2,95],"91":137,"92":[1,139],"94":[2,95],"99":[2,95],"107":[2,95],"109":[2,95],"110":[2,95],"111":[2,95],"114":[2,95],"118":[2,95],"119":[2,95],"120":[2,95],"127":[2,95],"128":[2,95],"129":[2,95],"131":[2,95],"132":[2,95],"134":[2,95],"135":[2,95],"138":[2,95],"139":[2,95],"140":[2,95],"141":[2,95],"142":[2,95],"143":[2,95],"144":[2,95],"145":[2,95],"146":[2,95],"147":[2,95],"148":[2,95],"149":[2,95],"150":[2,95],"151":[2,95],"152":[2,95],"153":[2,95],"154":[2,95],"155":[2,95],"156":[2,95],"157":[2,95],"158":[2,95],"159":[2,95],"160":[2,95],"161":[2,95],"162":[2,95],"163":[2,95],"164":[2,95]},{"4":[1,349],"30":[1,348]},{"4":[2,101],"30":[2,101]},{"4":[2,98],"30":[2,98]},{"46":[1,350]},{"31":191,"32":[1,87]},{"8":351,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"61":[1,352],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"1":[2,119],"4":[2,119],"29":[2,119],"30":[2,119],"46":[2,119],"50":[2,119],"58":[2,119],"61":[2,119],"72":[2,119],"73":[2,119],"74":[2,119],"75":[2,119],"78":[2,119],"79":[2,119],"80":[2,119],"81":[2,119],"84":[2,119],"92":[2,119],"94":[2,119],"99":[2,119],"107":[2,119],"109":[2,119],"110":[2,119],"111":[2,119],"114":[2,119],"118":[2,119],"119":[2,119],"120":[2,119],"127":[2,119],"128":[2,119],"129":[2,119],"131":[2,119],"132":[2,119],"134":[2,119],"135":[2,119],"138":[2,119],"139":[2,119],"140":[2,119],"141":[2,119],"142":[2,119],"143":[2,119],"144":[2,119],"145":[2,119],"146":[2,119],"147":[2,119],"148":[2,119],"149":[2,119],"150":[2,119],"151":[2,119],"152":[2,119],"153":[2,119],"154":[2,119],"155":[2,119],"156":[2,119],"157":[2,119],"158":[2,119],"159":[2,119],"160":[2,119],"161":[2,119],"162":[2,119],"163":[2,119],"164":[2,119]},{"8":353,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"4":[2,120],"8":247,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"29":[2,120],"30":[2,120],"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"58":[2,120],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"93":354,"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"4":[2,122],"29":[2,122],"30":[2,122],"50":[1,132],"58":[2,122],"61":[1,131],"94":[2,122],"99":[2,122],"108":129,"109":[1,79],"111":[1,80],"114":[1,130],"118":[1,124],"119":[1,125],"127":[1,127],"128":[1,128],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[1,100],"142":[1,101],"143":[1,102],"144":[1,103],"145":[1,104],"146":[1,105],"147":[1,106],"148":[1,107],"149":[1,108],"150":[1,109],"151":[1,110],"152":[1,111],"153":[1,112],"154":[1,113],"155":[1,114],"156":[1,115],"157":[1,116],"158":[1,117],"159":[1,118],"160":[1,119],"161":[1,120],"162":[1,121],"163":[1,122],"164":[1,123]},{"1":[2,134],"4":[2,134],"29":[2,134],"30":[2,134],"50":[1,132],"58":[2,134],"61":[1,131],"79":[2,134],"84":[2,134],"94":[2,134],"99":[2,134],"107":[2,134],"108":129,"109":[1,79],"110":[2,134],"111":[1,80],"114":[1,130],"118":[1,124],"119":[1,125],"120":[2,134],"127":[2,134],"128":[2,134],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[1,100],"142":[1,101],"143":[1,102],"144":[1,103],"145":[1,104],"146":[1,105],"147":[1,106],"148":[1,107],"149":[1,108],"150":[1,109],"151":[1,110],"152":[1,111],"153":[1,112],"154":[1,113],"155":[1,114],"156":[1,115],"157":[1,116],"158":[1,117],"159":[1,118],"160":[1,119],"161":[1,120],"162":[1,121],"163":[1,122],"164":[1,123]},{"1":[2,136],"4":[2,136],"29":[2,136],"30":[2,136],"50":[1,132],"58":[2,136],"61":[1,131],"79":[2,136],"84":[2,136],"94":[2,136],"99":[2,136],"107":[2,136],"108":129,"109":[1,79],"110":[2,136],"111":[1,80],"114":[1,130],"118":[1,124],"119":[1,125],"120":[2,136],"127":[2,136],"128":[2,136],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[1,100],"142":[1,101],"143":[1,102],"144":[1,103],"145":[1,104],"146":[1,105],"147":[1,106],"148":[1,107],"149":[1,108],"150":[1,109],"151":[1,110],"152":[1,111],"153":[1,112],"154":[1,113],"155":[1,114],"156":[1,115],"157":[1,116],"158":[1,117],"159":[1,118],"160":[1,119],"161":[1,120],"162":[1,121],"163":[1,122],"164":[1,123]},{"1":[2,88],"4":[2,88],"29":[2,88],"30":[2,88],"46":[2,88],"50":[2,88],"58":[2,88],"61":[2,88],"72":[2,88],"73":[2,88],"74":[2,88],"75":[2,88],"78":[2,88],"79":[2,88],"80":[2,88],"81":[2,88],"84":[2,88],"92":[2,88],"94":[2,88],"99":[2,88],"107":[2,88],"109":[2,88],"110":[2,88],"111":[2,88],"114":[2,88],"118":[2,88],"119":[2,88],"120":[2,88],"127":[2,88],"128":[2,88],"129":[2,88],"131":[2,88],"132":[2,88],"134":[2,88],"135":[2,88],"138":[2,88],"139":[2,88],"140":[2,88],"141":[2,88],"142":[2,88],"143":[2,88],"144":[2,88],"145":[2,88],"146":[2,88],"147":[2,88],"148":[2,88],"149":[2,88],"150":[2,88],"151":[2,88],"152":[2,88],"153":[2,88],"154":[2,88],"155":[2,88],"156":[2,88],"157":[2,88],"158":[2,88],"159":[2,88],"160":[2,88],"161":[2,88],"162":[2,88],"163":[2,88],"164":[2,88]},{"28":203,"31":201,"32":[1,87],"33":202,"34":[1,85],"35":[1,86],"47":355,"49":[1,56]},{"4":[2,89],"28":203,"29":[2,89],"30":[2,89],"31":201,"32":[1,87],"33":202,"34":[1,85],"35":[1,86],"47":200,"49":[1,56],"58":[2,89],"83":356},{"4":[2,91],"29":[2,91],"30":[2,91],"58":[2,91],"84":[2,91]},{"4":[2,47],"29":[2,47],"30":[2,47],"50":[1,132],"58":[2,47],"61":[1,131],"84":[2,47],"108":129,"109":[1,79],"111":[1,80],"114":[1,130],"118":[1,124],"119":[1,125],"127":[1,127],"128":[1,128],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[1,100],"142":[1,101],"143":[1,102],"144":[1,103],"145":[1,104],"146":[1,105],"147":[1,106],"148":[1,107],"149":[1,108],"150":[1,109],"151":[1,110],"152":[1,111],"153":[1,112],"154":[1,113],"155":[1,114],"156":[1,115],"157":[1,116],"158":[1,117],"159":[1,118],"160":[1,119],"161":[1,120],"162":[1,121],"163":[1,122],"164":[1,123]},{"4":[2,48],"29":[2,48],"30":[2,48],"50":[1,132],"58":[2,48],"61":[1,131],"84":[2,48],"108":129,"109":[1,79],"111":[1,80],"114":[1,130],"118":[1,124],"119":[1,125],"127":[1,127],"128":[1,128],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[1,100],"142":[1,101],"143":[1,102],"144":[1,103],"145":[1,104],"146":[1,105],"147":[1,106],"148":[1,107],"149":[1,108],"150":[1,109],"151":[1,110],"152":[1,111],"153":[1,112],"154":[1,113],"155":[1,114],"156":[1,115],"157":[1,116],"158":[1,117],"159":[1,118],"160":[1,119],"161":[1,120],"162":[1,121],"163":[1,122],"164":[1,123]},{"1":[2,110],"4":[2,110],"29":[2,110],"30":[2,110],"50":[2,110],"58":[2,110],"61":[2,110],"72":[2,110],"73":[2,110],"74":[2,110],"75":[2,110],"78":[2,110],"79":[2,110],"80":[2,110],"81":[2,110],"84":[2,110],"92":[2,110],"94":[2,110],"99":[2,110],"107":[2,110],"109":[2,110],"110":[2,110],"111":[2,110],"114":[2,110],"118":[2,110],"119":[2,110],"120":[2,110],"127":[2,110],"128":[2,110],"129":[2,110],"131":[2,110],"132":[2,110],"134":[2,110],"135":[2,110],"138":[2,110],"139":[2,110],"140":[2,110],"141":[2,110],"142":[2,110],"143":[2,110],"144":[2,110],"145":[2,110],"146":[2,110],"147":[2,110],"148":[2,110],"149":[2,110],"150":[2,110],"151":[2,110],"152":[2,110],"153":[2,110],"154":[2,110],"155":[2,110],"156":[2,110],"157":[2,110],"158":[2,110],"159":[2,110],"160":[2,110],"161":[2,110],"162":[2,110],"163":[2,110],"164":[2,110]},{"8":357,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"61":[1,358],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"1":[2,54],"4":[2,54],"29":[2,54],"30":[2,54],"50":[2,54],"58":[2,54],"61":[2,54],"79":[2,54],"84":[2,54],"94":[2,54],"99":[2,54],"107":[2,54],"109":[2,54],"110":[2,54],"111":[2,54],"114":[2,54],"118":[2,54],"119":[2,54],"120":[2,54],"127":[2,54],"128":[2,54],"129":[2,54],"131":[2,54],"132":[2,54],"134":[2,54],"135":[2,54],"138":[2,54],"139":[2,54],"140":[2,54],"141":[2,54],"142":[2,54],"143":[2,54],"144":[2,54],"145":[2,54],"146":[2,54],"147":[2,54],"148":[2,54],"149":[2,54],"150":[2,54],"151":[2,54],"152":[2,54],"153":[2,54],"154":[2,54],"155":[2,54],"156":[2,54],"157":[2,54],"158":[2,54],"159":[2,54],"160":[2,54],"161":[2,54],"162":[2,54],"163":[2,54],"164":[2,54]},{"53":[2,64],"58":[2,64],"61":[2,64]},{"1":[2,168],"4":[2,168],"29":[2,168],"30":[2,168],"50":[2,168],"58":[2,168],"61":[2,168],"79":[2,168],"84":[2,168],"94":[2,168],"99":[2,168],"107":[2,168],"109":[2,168],"110":[2,168],"111":[2,168],"114":[2,168],"118":[2,168],"119":[2,168],"120":[2,168],"123":[2,168],"127":[2,168],"128":[2,168],"129":[2,168],"131":[2,168],"132":[2,168],"134":[2,168],"135":[2,168],"138":[2,168],"139":[2,168],"140":[2,168],"141":[2,168],"142":[2,168],"143":[2,168],"144":[2,168],"145":[2,168],"146":[2,168],"147":[2,168],"148":[2,168],"149":[2,168],"150":[2,168],"151":[2,168],"152":[2,168],"153":[2,168],"154":[2,168],"155":[2,168],"156":[2,168],"157":[2,168],"158":[2,168],"159":[2,168],"160":[2,168],"161":[2,168],"162":[2,168],"163":[2,168],"164":[2,168]},{"1":[2,129],"4":[2,129],"29":[2,129],"30":[2,129],"50":[2,129],"58":[2,129],"61":[2,129],"79":[2,129],"84":[2,129],"94":[2,129],"99":[2,129],"107":[2,129],"109":[2,129],"110":[2,129],"111":[2,129],"114":[2,129],"118":[2,129],"119":[2,129],"120":[2,129],"127":[2,129],"128":[2,129],"129":[2,129],"131":[2,129],"132":[2,129],"134":[2,129],"135":[2,129],"138":[2,129],"139":[2,129],"140":[2,129],"141":[2,129],"142":[2,129],"143":[2,129],"144":[2,129],"145":[2,129],"146":[2,129],"147":[2,129],"148":[2,129],"149":[2,129],"150":[2,129],"151":[2,129],"152":[2,129],"153":[2,129],"154":[2,129],"155":[2,129],"156":[2,129],"157":[2,129],"158":[2,129],"159":[2,129],"160":[2,129],"161":[2,129],"162":[2,129],"163":[2,129],"164":[2,129]},{"1":[2,130],"4":[2,130],"29":[2,130],"30":[2,130],"50":[2,130],"58":[2,130],"61":[2,130],"79":[2,130],"84":[2,130],"94":[2,130],"99":[2,130],"103":[2,130],"107":[2,130],"109":[2,130],"110":[2,130],"111":[2,130],"114":[2,130],"118":[2,130],"119":[2,130],"120":[2,130],"127":[2,130],"128":[2,130],"129":[2,130],"131":[2,130],"132":[2,130],"134":[2,130],"135":[2,130],"138":[2,130],"139":[2,130],"140":[2,130],"141":[2,130],"142":[2,130],"143":[2,130],"144":[2,130],"145":[2,130],"146":[2,130],"147":[2,130],"148":[2,130],"149":[2,130],"150":[2,130],"151":[2,130],"152":[2,130],"153":[2,130],"154":[2,130],"155":[2,130],"156":[2,130],"157":[2,130],"158":[2,130],"159":[2,130],"160":[2,130],"161":[2,130],"162":[2,130],"163":[2,130],"164":[2,130]},{"8":359,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"8":360,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"8":361,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"1":[2,158],"4":[2,158],"29":[2,158],"30":[2,158],"50":[2,158],"58":[2,158],"61":[2,158],"79":[2,158],"84":[2,158],"94":[2,158],"99":[2,158],"107":[2,158],"109":[2,158],"110":[2,158],"111":[2,158],"114":[2,158],"118":[2,158],"119":[2,158],"120":[2,158],"127":[2,158],"128":[2,158],"129":[2,158],"131":[2,158],"132":[2,158],"134":[2,158],"135":[2,158],"138":[2,158],"139":[2,158],"140":[2,158],"141":[2,158],"142":[2,158],"143":[2,158],"144":[2,158],"145":[2,158],"146":[2,158],"147":[2,158],"148":[2,158],"149":[2,158],"150":[2,158],"151":[2,158],"152":[2,158],"153":[2,158],"154":[2,158],"155":[2,158],"156":[2,158],"157":[2,158],"158":[2,158],"159":[2,158],"160":[2,158],"161":[2,158],"162":[2,158],"163":[2,158],"164":[2,158]},{"4":[1,160],"6":362,"29":[1,6]},{"30":[1,363]},{"4":[1,364],"30":[2,164],"123":[2,164],"125":[2,164]},{"8":365,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"4":[2,100],"28":203,"30":[2,100],"31":201,"32":[1,87],"33":202,"34":[1,85],"35":[1,86],"47":316,"49":[1,56],"65":317,"87":366,"88":315,"97":[1,318]},{"1":[2,96],"4":[2,96],"29":[2,96],"30":[2,96],"50":[2,96],"58":[2,96],"61":[2,96],"79":[2,96],"84":[2,96],"94":[2,96],"99":[2,96],"107":[2,96],"109":[2,96],"110":[2,96],"111":[2,96],"114":[2,96],"118":[2,96],"119":[2,96],"120":[2,96],"127":[2,96],"128":[2,96],"129":[2,96],"131":[2,96],"132":[2,96],"134":[2,96],"135":[2,96],"138":[2,96],"139":[2,96],"140":[2,96],"141":[2,96],"142":[2,96],"143":[2,96],"144":[2,96],"145":[2,96],"146":[2,96],"147":[2,96],"148":[2,96],"149":[2,96],"150":[2,96],"151":[2,96],"152":[2,96],"153":[2,96],"154":[2,96],"155":[2,96],"156":[2,96],"157":[2,96],"158":[2,96],"159":[2,96],"160":[2,96],"161":[2,96],"162":[2,96],"163":[2,96],"164":[2,96]},{"28":203,"31":201,"32":[1,87],"33":202,"34":[1,85],"35":[1,86],"47":316,"49":[1,56],"65":317,"88":367,"97":[1,318]},{"8":368,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"50":[1,132],"61":[1,131],"99":[1,369],"108":129,"109":[1,79],"111":[1,80],"114":[1,130],"118":[1,124],"119":[1,125],"127":[1,127],"128":[1,128],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[1,100],"142":[1,101],"143":[1,102],"144":[1,103],"145":[1,104],"146":[1,105],"147":[1,106],"148":[1,107],"149":[1,108],"150":[1,109],"151":[1,110],"152":[1,111],"153":[1,112],"154":[1,113],"155":[1,114],"156":[1,115],"157":[1,116],"158":[1,117],"159":[1,118],"160":[1,119],"161":[1,120],"162":[1,121],"163":[1,122],"164":[1,123]},{"4":[2,65],"8":370,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"29":[2,65],"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"50":[2,65],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"58":[2,65],"61":[2,65],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"99":[2,65],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[2,65],"111":[2,65],"112":51,"113":[1,81],"114":[2,65],"118":[2,65],"119":[2,65],"121":[1,53],"126":48,"127":[2,65],"128":[2,65],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47],"138":[2,65],"139":[2,65],"140":[2,65],"141":[2,65],"142":[2,65],"143":[2,65],"144":[2,65],"145":[2,65],"146":[2,65],"147":[2,65],"148":[2,65],"149":[2,65],"150":[2,65],"151":[2,65],"152":[2,65],"153":[2,65],"154":[2,65],"155":[2,65],"156":[2,65],"157":[2,65],"158":[2,65],"159":[2,65],"160":[2,65],"161":[2,65],"162":[2,65],"163":[2,65],"164":[2,65]},{"4":[2,123],"29":[2,123],"30":[2,123],"50":[1,132],"58":[2,123],"61":[1,131],"94":[2,123],"99":[2,123],"108":129,"109":[1,79],"111":[1,80],"114":[1,130],"118":[1,124],"119":[1,125],"127":[1,127],"128":[1,128],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[1,100],"142":[1,101],"143":[1,102],"144":[1,103],"145":[1,104],"146":[1,105],"147":[1,106],"148":[1,107],"149":[1,108],"150":[1,109],"151":[1,110],"152":[1,111],"153":[1,112],"154":[1,113],"155":[1,114],"156":[1,115],"157":[1,116],"158":[1,117],"159":[1,118],"160":[1,119],"161":[1,120],"162":[1,121],"163":[1,122],"164":[1,123]},{"4":[2,58],"29":[2,58],"30":[2,58],"57":371,"58":[1,278]},{"4":[2,92],"29":[2,92],"30":[2,92],"58":[2,92],"84":[2,92]},{"4":[2,58],"29":[2,58],"30":[2,58],"57":372,"58":[1,284]},{"50":[1,132],"61":[1,131],"79":[1,373],"108":129,"109":[1,79],"111":[1,80],"114":[1,130],"118":[1,124],"119":[1,125],"127":[1,127],"128":[1,128],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[1,100],"142":[1,101],"143":[1,102],"144":[1,103],"145":[1,104],"146":[1,105],"147":[1,106],"148":[1,107],"149":[1,108],"150":[1,109],"151":[1,110],"152":[1,111],"153":[1,112],"154":[1,113],"155":[1,114],"156":[1,115],"157":[1,116],"158":[1,117],"159":[1,118],"160":[1,119],"161":[1,120],"162":[1,121],"163":[1,122],"164":[1,123]},{"8":374,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"50":[2,65],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"61":[2,65],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"79":[2,65],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[2,65],"111":[2,65],"112":51,"113":[1,81],"114":[2,65],"118":[2,65],"119":[2,65],"121":[1,53],"126":48,"127":[2,65],"128":[2,65],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47],"138":[2,65],"139":[2,65],"140":[2,65],"141":[2,65],"142":[2,65],"143":[2,65],"144":[2,65],"145":[2,65],"146":[2,65],"147":[2,65],"148":[2,65],"149":[2,65],"150":[2,65],"151":[2,65],"152":[2,65],"153":[2,65],"154":[2,65],"155":[2,65],"156":[2,65],"157":[2,65],"158":[2,65],"159":[2,65],"160":[2,65],"161":[2,65],"162":[2,65],"163":[2,65],"164":[2,65]},{"1":[2,153],"4":[2,153],"29":[2,153],"30":[2,153],"50":[1,132],"58":[2,153],"61":[1,131],"79":[2,153],"84":[2,153],"94":[2,153],"99":[2,153],"107":[2,153],"108":129,"109":[2,153],"110":[2,153],"111":[2,153],"114":[2,153],"118":[1,124],"119":[1,125],"120":[1,375],"127":[2,153],"128":[2,153],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[1,100],"142":[1,101],"143":[1,102],"144":[1,103],"145":[1,104],"146":[1,105],"147":[1,106],"148":[1,107],"149":[1,108],"150":[1,109],"151":[1,110],"152":[1,111],"153":[1,112],"154":[1,113],"155":[1,114],"156":[1,115],"157":[1,116],"158":[1,117],"159":[1,118],"160":[1,119],"161":[1,120],"162":[1,121],"163":[1,122],"164":[1,123]},{"1":[2,155],"4":[2,155],"29":[2,155],"30":[2,155],"50":[1,132],"58":[2,155],"61":[1,131],"79":[2,155],"84":[2,155],"94":[2,155],"99":[2,155],"107":[2,155],"108":129,"109":[2,155],"110":[1,376],"111":[2,155],"114":[2,155],"118":[1,124],"119":[1,125],"120":[2,155],"127":[2,155],"128":[2,155],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[1,100],"142":[1,101],"143":[1,102],"144":[1,103],"145":[1,104],"146":[1,105],"147":[1,106],"148":[1,107],"149":[1,108],"150":[1,109],"151":[1,110],"152":[1,111],"153":[1,112],"154":[1,113],"155":[1,114],"156":[1,115],"157":[1,116],"158":[1,117],"159":[1,118],"160":[1,119],"161":[1,120],"162":[1,121],"163":[1,122],"164":[1,123]},{"1":[2,154],"4":[2,154],"29":[2,154],"30":[2,154],"50":[1,132],"58":[2,154],"61":[1,131],"79":[2,154],"84":[2,154],"94":[2,154],"99":[2,154],"107":[2,154],"108":129,"109":[2,154],"110":[2,154],"111":[2,154],"114":[2,154],"118":[1,124],"119":[1,125],"120":[2,154],"127":[2,154],"128":[2,154],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[1,100],"142":[1,101],"143":[1,102],"144":[1,103],"145":[1,104],"146":[1,105],"147":[1,106],"148":[1,107],"149":[1,108],"150":[1,109],"151":[1,110],"152":[1,111],"153":[1,112],"154":[1,113],"155":[1,114],"156":[1,115],"157":[1,116],"158":[1,117],"159":[1,118],"160":[1,119],"161":[1,120],"162":[1,121],"163":[1,122],"164":[1,123]},{"30":[1,377]},{"1":[2,161],"4":[2,161],"29":[2,161],"30":[2,161],"50":[2,161],"58":[2,161],"61":[2,161],"79":[2,161],"84":[2,161],"94":[2,161],"99":[2,161],"107":[2,161],"109":[2,161],"110":[2,161],"111":[2,161],"114":[2,161],"118":[2,161],"119":[2,161],"120":[2,161],"127":[2,161],"128":[2,161],"129":[2,161],"131":[2,161],"132":[2,161],"134":[2,161],"135":[2,161],"138":[2,161],"139":[2,161],"140":[2,161],"141":[2,161],"142":[2,161],"143":[2,161],"144":[2,161],"145":[2,161],"146":[2,161],"147":[2,161],"148":[2,161],"149":[2,161],"150":[2,161],"151":[2,161],"152":[2,161],"153":[2,161],"154":[2,161],"155":[2,161],"156":[2,161],"157":[2,161],"158":[2,161],"159":[2,161],"160":[2,161],"161":[2,161],"162":[2,161],"163":[2,161],"164":[2,161]},{"30":[2,165],"123":[2,165],"125":[2,165]},{"4":[2,126],"29":[2,126],"50":[1,132],"58":[2,126],"61":[1,131],"108":129,"109":[1,79],"111":[1,80],"114":[1,130],"118":[1,124],"119":[1,125],"127":[1,127],"128":[1,128],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[1,100],"142":[1,101],"143":[1,102],"144":[1,103],"145":[1,104],"146":[1,105],"147":[1,106],"148":[1,107],"149":[1,108],"150":[1,109],"151":[1,110],"152":[1,111],"153":[1,112],"154":[1,113],"155":[1,114],"156":[1,115],"157":[1,116],"158":[1,117],"159":[1,118],"160":[1,119],"161":[1,120],"162":[1,121],"163":[1,122],"164":[1,123]},{"4":[1,349],"30":[1,378]},{"4":[2,102],"30":[2,102]},{"4":[2,99],"30":[2,99],"50":[1,132],"61":[1,131],"108":129,"109":[1,79],"111":[1,80],"114":[1,130],"118":[1,124],"119":[1,125],"127":[1,127],"128":[1,128],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[1,100],"142":[1,101],"143":[1,102],"144":[1,103],"145":[1,104],"146":[1,105],"147":[1,106],"148":[1,107],"149":[1,108],"150":[1,109],"151":[1,110],"152":[1,111],"153":[1,112],"154":[1,113],"155":[1,114],"156":[1,115],"157":[1,116],"158":[1,117],"159":[1,118],"160":[1,119],"161":[1,120],"162":[1,121],"163":[1,122],"164":[1,123]},{"1":[2,115],"4":[2,115],"29":[2,115],"30":[2,115],"50":[2,115],"58":[2,115],"61":[2,115],"72":[2,115],"73":[2,115],"74":[2,115],"75":[2,115],"78":[2,115],"79":[2,115],"80":[2,115],"81":[2,115],"84":[2,115],"92":[2,115],"94":[2,115],"99":[2,115],"107":[2,115],"109":[2,115],"110":[2,115],"111":[2,115],"114":[2,115],"118":[2,115],"119":[2,115],"120":[2,115],"127":[2,115],"128":[2,115],"129":[2,115],"131":[2,115],"132":[2,115],"134":[2,115],"135":[2,115],"138":[2,115],"139":[2,115],"140":[2,115],"141":[2,115],"142":[2,115],"143":[2,115],"144":[2,115],"145":[2,115],"146":[2,115],"147":[2,115],"148":[2,115],"149":[2,115],"150":[2,115],"151":[2,115],"152":[2,115],"153":[2,115],"154":[2,115],"155":[2,115],"156":[2,115],"157":[2,115],"158":[2,115],"159":[2,115],"160":[2,115],"161":[2,115],"162":[2,115],"163":[2,115],"164":[2,115]},{"50":[1,132],"61":[1,131],"99":[1,379],"108":129,"109":[1,79],"111":[1,80],"114":[1,130],"118":[1,124],"119":[1,125],"127":[1,127],"128":[1,128],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[1,100],"142":[1,101],"143":[1,102],"144":[1,103],"145":[1,104],"146":[1,105],"147":[1,106],"148":[1,107],"149":[1,108],"150":[1,109],"151":[1,110],"152":[1,111],"153":[1,112],"154":[1,113],"155":[1,114],"156":[1,115],"157":[1,116],"158":[1,117],"159":[1,118],"160":[1,119],"161":[1,120],"162":[1,121],"163":[1,122],"164":[1,123]},{"4":[1,321],"29":[1,322],"30":[1,380]},{"4":[1,327],"29":[1,328],"30":[1,381]},{"1":[2,117],"4":[2,117],"29":[2,117],"30":[2,117],"46":[2,117],"50":[2,117],"58":[2,117],"61":[2,117],"72":[2,117],"73":[2,117],"74":[2,117],"75":[2,117],"78":[2,117],"79":[2,117],"80":[2,117],"81":[2,117],"84":[2,117],"86":[2,117],"92":[2,117],"94":[2,117],"99":[2,117],"107":[2,117],"109":[2,117],"110":[2,117],"111":[2,117],"114":[2,117],"118":[2,117],"119":[2,117],"120":[2,117],"127":[2,117],"128":[2,117],"129":[2,117],"131":[2,117],"132":[2,117],"134":[2,117],"135":[2,117],"138":[2,117],"139":[2,117],"140":[2,117],"141":[2,117],"142":[2,117],"143":[2,117],"144":[2,117],"145":[2,117],"146":[2,117],"147":[2,117],"148":[2,117],"149":[2,117],"150":[2,117],"151":[2,117],"152":[2,117],"153":[2,117],"154":[2,117],"155":[2,117],"156":[2,117],"157":[2,117],"158":[2,117],"159":[2,117],"160":[2,117],"161":[2,117],"162":[2,117],"163":[2,117],"164":[2,117]},{"50":[1,132],"61":[1,131],"79":[1,382],"108":129,"109":[1,79],"111":[1,80],"114":[1,130],"118":[1,124],"119":[1,125],"127":[1,127],"128":[1,128],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[1,100],"142":[1,101],"143":[1,102],"144":[1,103],"145":[1,104],"146":[1,105],"147":[1,106],"148":[1,107],"149":[1,108],"150":[1,109],"151":[1,110],"152":[1,111],"153":[1,112],"154":[1,113],"155":[1,114],"156":[1,115],"157":[1,116],"158":[1,117],"159":[1,118],"160":[1,119],"161":[1,120],"162":[1,121],"163":[1,122],"164":[1,123]},{"8":383,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"8":384,"9":162,"10":24,"11":25,"12":[1,26],"13":[1,27],"14":9,"15":10,"16":11,"17":12,"18":13,"19":14,"20":15,"21":16,"22":17,"23":18,"24":19,"25":20,"26":21,"27":22,"28":23,"31":82,"32":[1,87],"33":61,"34":[1,85],"35":[1,86],"36":29,"37":[1,62],"38":[1,63],"39":[1,64],"40":[1,65],"41":[1,66],"42":[1,67],"43":[1,68],"44":[1,69],"45":28,"48":[1,57],"49":[1,56],"51":[1,37],"54":38,"55":[1,75],"56":[1,76],"62":54,"64":34,"65":83,"66":59,"67":60,"68":30,"69":31,"70":32,"71":[1,33],"82":[1,84],"85":[1,55],"89":35,"90":[1,36],"95":[1,74],"96":[1,72],"97":[1,73],"98":[1,71],"101":[1,49],"105":[1,58],"106":[1,70],"108":50,"109":[1,79],"111":[1,80],"112":51,"113":[1,81],"114":[1,52],"121":[1,53],"126":48,"127":[1,77],"128":[1,78],"129":[1,39],"130":[1,40],"131":[1,41],"132":[1,42],"133":[1,43],"134":[1,44],"135":[1,45],"136":[1,46],"137":[1,47]},{"1":[2,159],"4":[2,159],"29":[2,159],"30":[2,159],"50":[2,159],"58":[2,159],"61":[2,159],"79":[2,159],"84":[2,159],"94":[2,159],"99":[2,159],"107":[2,159],"109":[2,159],"110":[2,159],"111":[2,159],"114":[2,159],"118":[2,159],"119":[2,159],"120":[2,159],"127":[2,159],"128":[2,159],"129":[2,159],"131":[2,159],"132":[2,159],"134":[2,159],"135":[2,159],"138":[2,159],"139":[2,159],"140":[2,159],"141":[2,159],"142":[2,159],"143":[2,159],"144":[2,159],"145":[2,159],"146":[2,159],"147":[2,159],"148":[2,159],"149":[2,159],"150":[2,159],"151":[2,159],"152":[2,159],"153":[2,159],"154":[2,159],"155":[2,159],"156":[2,159],"157":[2,159],"158":[2,159],"159":[2,159],"160":[2,159],"161":[2,159],"162":[2,159],"163":[2,159],"164":[2,159]},{"1":[2,97],"4":[2,97],"29":[2,97],"30":[2,97],"50":[2,97],"58":[2,97],"61":[2,97],"79":[2,97],"84":[2,97],"94":[2,97],"99":[2,97],"107":[2,97],"109":[2,97],"110":[2,97],"111":[2,97],"114":[2,97],"118":[2,97],"119":[2,97],"120":[2,97],"127":[2,97],"128":[2,97],"129":[2,97],"131":[2,97],"132":[2,97],"134":[2,97],"135":[2,97],"138":[2,97],"139":[2,97],"140":[2,97],"141":[2,97],"142":[2,97],"143":[2,97],"144":[2,97],"145":[2,97],"146":[2,97],"147":[2,97],"148":[2,97],"149":[2,97],"150":[2,97],"151":[2,97],"152":[2,97],"153":[2,97],"154":[2,97],"155":[2,97],"156":[2,97],"157":[2,97],"158":[2,97],"159":[2,97],"160":[2,97],"161":[2,97],"162":[2,97],"163":[2,97],"164":[2,97]},{"1":[2,116],"4":[2,116],"29":[2,116],"30":[2,116],"50":[2,116],"58":[2,116],"61":[2,116],"72":[2,116],"73":[2,116],"74":[2,116],"75":[2,116],"78":[2,116],"79":[2,116],"80":[2,116],"81":[2,116],"84":[2,116],"92":[2,116],"94":[2,116],"99":[2,116],"107":[2,116],"109":[2,116],"110":[2,116],"111":[2,116],"114":[2,116],"118":[2,116],"119":[2,116],"120":[2,116],"127":[2,116],"128":[2,116],"129":[2,116],"131":[2,116],"132":[2,116],"134":[2,116],"135":[2,116],"138":[2,116],"139":[2,116],"140":[2,116],"141":[2,116],"142":[2,116],"143":[2,116],"144":[2,116],"145":[2,116],"146":[2,116],"147":[2,116],"148":[2,116],"149":[2,116],"150":[2,116],"151":[2,116],"152":[2,116],"153":[2,116],"154":[2,116],"155":[2,116],"156":[2,116],"157":[2,116],"158":[2,116],"159":[2,116],"160":[2,116],"161":[2,116],"162":[2,116],"163":[2,116],"164":[2,116]},{"4":[2,124],"29":[2,124],"30":[2,124],"58":[2,124],"94":[2,124],"99":[2,124]},{"4":[2,93],"29":[2,93],"30":[2,93],"58":[2,93],"84":[2,93]},{"1":[2,118],"4":[2,118],"29":[2,118],"30":[2,118],"46":[2,118],"50":[2,118],"58":[2,118],"61":[2,118],"72":[2,118],"73":[2,118],"74":[2,118],"75":[2,118],"78":[2,118],"79":[2,118],"80":[2,118],"81":[2,118],"84":[2,118],"86":[2,118],"92":[2,118],"94":[2,118],"99":[2,118],"107":[2,118],"109":[2,118],"110":[2,118],"111":[2,118],"114":[2,118],"118":[2,118],"119":[2,118],"120":[2,118],"127":[2,118],"128":[2,118],"129":[2,118],"131":[2,118],"132":[2,118],"134":[2,118],"135":[2,118],"138":[2,118],"139":[2,118],"140":[2,118],"141":[2,118],"142":[2,118],"143":[2,118],"144":[2,118],"145":[2,118],"146":[2,118],"147":[2,118],"148":[2,118],"149":[2,118],"150":[2,118],"151":[2,118],"152":[2,118],"153":[2,118],"154":[2,118],"155":[2,118],"156":[2,118],"157":[2,118],"158":[2,118],"159":[2,118],"160":[2,118],"161":[2,118],"162":[2,118],"163":[2,118],"164":[2,118]},{"1":[2,156],"4":[2,156],"29":[2,156],"30":[2,156],"50":[1,132],"58":[2,156],"61":[1,131],"79":[2,156],"84":[2,156],"94":[2,156],"99":[2,156],"107":[2,156],"108":129,"109":[2,156],"110":[2,156],"111":[2,156],"114":[2,156],"118":[1,124],"119":[1,125],"120":[2,156],"127":[2,156],"128":[2,156],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[1,100],"142":[1,101],"143":[1,102],"144":[1,103],"145":[1,104],"146":[1,105],"147":[1,106],"148":[1,107],"149":[1,108],"150":[1,109],"151":[1,110],"152":[1,111],"153":[1,112],"154":[1,113],"155":[1,114],"156":[1,115],"157":[1,116],"158":[1,117],"159":[1,118],"160":[1,119],"161":[1,120],"162":[1,121],"163":[1,122],"164":[1,123]},{"1":[2,157],"4":[2,157],"29":[2,157],"30":[2,157],"50":[1,132],"58":[2,157],"61":[1,131],"79":[2,157],"84":[2,157],"94":[2,157],"99":[2,157],"107":[2,157],"108":129,"109":[2,157],"110":[2,157],"111":[2,157],"114":[2,157],"118":[1,124],"119":[1,125],"120":[2,157],"127":[2,157],"128":[2,157],"129":[1,126],"131":[1,99],"132":[1,98],"134":[1,93],"135":[1,94],"138":[1,95],"139":[1,96],"140":[1,97],"141":[1,100],"142":[1,101],"143":[1,102],"144":[1,103],"145":[1,104],"146":[1,105],"147":[1,106],"148":[1,107],"149":[1,108],"150":[1,109],"151":[1,110],"152":[1,111],"153":[1,112],"154":[1,113],"155":[1,114],"156":[1,115],"157":[1,116],"158":[1,117],"159":[1,118],"160":[1,119],"161":[1,120],"162":[1,121],"163":[1,122],"164":[1,123]}],defaultActions:{"90":[2,4]},parseError:function parseError(str,hash){throw new Error(str)},parse:function parse(input){var self=this,stack=[0],vstack=[null],table=this.table,yytext="",yylineno=0,yyleng=0,shifts=0,reductions=0,recovering=0,TERROR=2,EOF=1;this.lexer.setInput(input);this.lexer.yy=this.yy;this.yy.lexer=this.lexer;var parseError=this.yy.parseError=typeof this.yy.parseError=="function"?this.yy.parseError:this.parseError;function popStack(n){stack.length=stack.length-2*n;vstack.length=vstack.length-n}function checkRecover(st){for(var p in table[st]){if(p==TERROR){return true}}return false}function lex(){var token;token=self.lexer.lex()||1;if(typeof token!=="number"){token=self.symbols_[token]||token}return token}var symbol,preErrorSymbol,state,action,a,r,yyval={},p,len,newState,expected,recovered=false;while(true){state=stack[stack.length-1];if(this.defaultActions[state]){action=this.defaultActions[state]}else{if(symbol==null){symbol=lex()}action=table[state]&&table[state][symbol]}if(typeof action==="undefined"||!action.length||!action[0]){if(!recovering){expected=[];for(p in table[state]){if(this.terminals_[p]&&p>2){expected.push("'"+this.terminals_[p]+"'")}}if(this.lexer.showPosition){parseError.call(this,"Parse error on line "+(yylineno+1)+":\n"+this.lexer.showPosition()+"\nExpecting "+expected.join(", "),{text:this.lexer.match,token:this.terminals_[symbol]||symbol,line:this.lexer.yylineno,expected:expected})}else{parseError.call(this,"Parse error on line "+(yylineno+1)+": Unexpected '"+(this.terminals_[symbol]||symbol)+"'",{text:this.lexer.match,token:this.terminals_[symbol]||symbol,line:this.lexer.yylineno,expected:expected})}}if(recovering==3){if(symbol==EOF){throw"Parsing halted."}yyleng=this.lexer.yyleng;yytext=this.lexer.yytext;yylineno=this.lexer.yylineno;symbol=lex()}while(1){if(checkRecover(state)){break}if(state==0){throw"Parsing halted."}popStack(1);state=stack[stack.length-1]}preErrorSymbol=symbol;symbol=TERROR;state=stack[stack.length-1];action=table[state]&&table[state][TERROR];recovering=3}if(action[0] instanceof Array&&action.length>1){throw new Error("Parse Error: multiple actions possible at state: "+state+", token: "+symbol)}a=action;switch(a[0]){case 1:shifts++;stack.push(symbol);vstack.push(this.lexer.yytext);stack.push(a[1]);symbol=null;if(!preErrorSymbol){yyleng=this.lexer.yyleng;yytext=this.lexer.yytext;yylineno=this.lexer.yylineno;if(recovering>0){recovering--}}else{symbol=preErrorSymbol;preErrorSymbol=null}break;case 2:reductions++;len=this.productions_[a[1]][1];yyval.$=vstack[vstack.length-len];r=this.performAction.call(yyval,yytext,yyleng,yylineno,this.yy,a[1],vstack);if(typeof r!=="undefined"){return r}if(len){stack=stack.slice(0,-1*len*2);vstack=vstack.slice(0,-1*len)}stack.push(this.productions_[a[1]][0]);vstack.push(yyval.$);newState=table[stack[stack.length-2]][stack[stack.length-1]];stack.push(newState);break;case 3:this.reductionCount=reductions;this.shiftCount=shifts;return true}}return true}};return parser})();if(typeof require!=="undefined"){exports.parser=parser;exports.parse=function(){return parser.parse.apply(parser,arguments)};exports.main=function commonjsMain(args){if(!args[1]){throw new Error("Usage: "+args[0]+" FILE")}if(typeof process!=="undefined"){var source=require("fs").readFileSync(require("path").join(process.cwd(),args[1]),"utf8")}else{var cwd=require("file").path(require("file").cwd());var source=cwd.join(args[1]).read({charset:"utf-8"})}return exports.parser.parse(source)};if(require.main===module){exports.main(typeof process!=="undefined"?process.argv.slice(1):require("system").args)}}(function(){var Scope;var __hasProp=Object.prototype.hasOwnProperty;if(!(typeof process!=="undefined"&&process!==null)){this.exports=this}exports.Scope=(function(){Scope=function(parent,expressions,method){var _a;_a=[parent,expressions,method];this.parent=_a[0];this.expressions=_a[1];this.method=_a[2];this.variables={};if(this.parent){this.tempVar=this.parent.tempVar}else{Scope.root=this;this.tempVar="_a"}return this};Scope.root=null;Scope.prototype.find=function(name){if(this.check(name)){return true}this.variables[name]="var";return false};Scope.prototype.any=function(fn){var _a,k,v;_a=this.variables;for(v in _a){if(__hasProp.call(_a,v)){k=_a[v];if(fn(v,k)){return true}}}return false};Scope.prototype.parameter=function(name){this.variables[name]="param";return this.variables[name]};Scope.prototype.check=function(name){if(this.variables.hasOwnProperty(name)){return true}return !!(this.parent&&this.parent.check(name))};Scope.prototype.freeVariable=function(){var ordinal;while(this.check(this.tempVar)){ordinal=1+parseInt(this.tempVar.substr(1),36);this.tempVar="_"+ordinal.toString(36).replace(/\d/g,"a")}this.variables[this.tempVar]="var";return this.tempVar};Scope.prototype.assign=function(name,value){this.variables[name]={value:value,assigned:true};return this.variables[name]};Scope.prototype.hasDeclarations=function(body){return body===this.expressions&&this.any(function(k,val){return val==="var"})};Scope.prototype.hasAssignments=function(body){return body===this.expressions&&this.any(function(k,val){return val.assigned})};Scope.prototype.declaredVariables=function(){var _a,_b,key,val;return(function(){_a=[];_b=this.variables;for(key in _b){if(__hasProp.call(_b,key)){val=_b[key];val==="var"?_a.push(key):null}}return _a}).call(this).sort()};Scope.prototype.assignedVariables=function(){var _a,_b,key,val;_a=[];_b=this.variables;for(key in _b){if(__hasProp.call(_b,key)){val=_b[key];val.assigned?_a.push(""+key+" = "+val.value):null}}return _a};Scope.prototype.compiledDeclarations=function(){return this.declaredVariables().join(", ")};Scope.prototype.compiledAssignments=function(){return this.assignedVariables().join(", ")};return Scope}).call(this)})();(function(){var AccessorNode,ArrayNode,AssignNode,BaseNode,CallNode,ClassNode,ClosureNode,CodeNode,CommentNode,DOUBLE_PARENS,ExistenceNode,Expressions,ExtendsNode,ForNode,IDENTIFIER,IS_STRING,IfNode,InNode,IndexNode,LiteralNode,NUMBER,ObjectNode,OpNode,ParentheticalNode,PushNode,RangeNode,ReturnNode,Scope,SliceNode,SplatNode,TAB,TRAILING_WHITESPACE,ThrowNode,TryNode,UTILITIES,ValueNode,WhileNode,_a,compact,del,flatten,helpers,include,indexOf,literal,merge,starts,utility;var __extends=function(child,parent){var ctor=function(){};ctor.prototype=parent.prototype;child.__superClass__=parent.prototype;child.prototype=new ctor();child.prototype.constructor=child};if(typeof process!=="undefined"&&process!==null){Scope=require("./scope").Scope;helpers=require("./helpers").helpers}else{this.exports=this;helpers=this.helpers;Scope=this.Scope}_a=helpers;compact=_a.compact;flatten=_a.flatten;merge=_a.merge;del=_a.del;include=_a.include;indexOf=_a.indexOf;starts=_a.starts;exports.BaseNode=(function(){BaseNode=function(){};BaseNode.prototype.compile=function(o){var closure,top;this.options=merge(o||{});this.tab=o.indent;if(!(this instanceof ValueNode||this instanceof CallNode)){del(this.options,"operation");if(!(this instanceof AccessorNode||this instanceof IndexNode)){del(this.options,"chainRoot")}}top=this.topSensitive()?this.options.top:del(this.options,"top");closure=this.isStatement()&&!this.isPureStatement()&&!top&&!this.options.asStatement&&!(this instanceof CommentNode)&&!this.containsPureStatement();return closure?this.compileClosure(this.options):this.compileNode(this.options)};BaseNode.prototype.compileClosure=function(o){this.tab=o.indent;o.sharedScope=o.scope;return ClosureNode.wrap(this).compile(o)};BaseNode.prototype.compileReference=function(o,options){var compiled,pair,reference;pair=(function(){if(!(this instanceof CallNode||this instanceof ValueNode&&(!(this.base instanceof LiteralNode)||this.hasProperties()))){return[this,this]}else{reference=literal(o.scope.freeVariable());compiled=new AssignNode(reference,this);return[compiled,reference]}}).call(this);if(!(options&&options.precompile)){return pair}return[pair[0].compile(o),pair[1].compile(o)]};BaseNode.prototype.idt=function(tabs){var idt,num;idt=this.tab||"";num=(tabs||0)+1;while(num-=1){idt+=TAB}return idt};BaseNode.prototype.makeReturn=function(){return new ReturnNode(this)};BaseNode.prototype.contains=function(block){var contains;contains=false;this.traverseChildren(false,function(node){if(block(node)){contains=true;return false}});return contains};BaseNode.prototype.containsType=function(type){return this instanceof type||this.contains(function(n){return n instanceof type})};BaseNode.prototype.containsPureStatement=function(){return this.isPureStatement()||this.contains(function(n){return n.isPureStatement()})};BaseNode.prototype.traverse=function(block){return this.traverseChildren(true,block)};BaseNode.prototype.toString=function(idt,override){var _b,_c,_d,_e,child,children;idt=idt||"";children=(function(){_b=[];_d=this.collectChildren();for(_c=0,_e=_d.length;_c<_e;_c++){child=_d[_c];_b.push(child.toString(idt+TAB))}return _b}).call(this).join("");return"\n"+idt+(override||this["class"])+children};BaseNode.prototype.eachChild=function(func){var _b,_c,_d,_e,_f,_g,_h,attr,child;if(!(this.children)){return null}_b=[];_d=this.children;for(_c=0,_e=_d.length;_c<_e;_c++){attr=_d[_c];if(this[attr]){_g=flatten([this[attr]]);for(_f=0,_h=_g.length;_f<_h;_f++){child=_g[_f];if(func(child)===false){return null}}}}return _b};BaseNode.prototype.collectChildren=function(){var nodes;nodes=[];this.eachChild(function(node){return nodes.push(node)});return nodes};BaseNode.prototype.traverseChildren=function(crossScope,func){return this.eachChild(function(child){func.apply(this,arguments);if(child instanceof BaseNode){return child.traverseChildren(crossScope,func)}})};BaseNode.prototype["class"]="BaseNode";BaseNode.prototype.children=[];BaseNode.prototype.unwrap=function(){return this};BaseNode.prototype.isStatement=function(){return false};BaseNode.prototype.isPureStatement=function(){return false};BaseNode.prototype.topSensitive=function(){return false};return BaseNode})();exports.Expressions=(function(){Expressions=function(nodes){this.expressions=compact(flatten(nodes||[]));return this};__extends(Expressions,BaseNode);Expressions.prototype["class"]="Expressions";Expressions.prototype.children=["expressions"];Expressions.prototype.isStatement=function(){return true};Expressions.prototype.push=function(node){this.expressions.push(node);return this};Expressions.prototype.unshift=function(node){this.expressions.unshift(node);return this};Expressions.prototype.unwrap=function(){return this.expressions.length===1?this.expressions[0]:this};Expressions.prototype.empty=function(){return this.expressions.length===0};Expressions.prototype.makeReturn=function(){var idx,last;idx=this.expressions.length-1;last=this.expressions[idx];if(last instanceof CommentNode){last=this.expressions[idx-=1]}if(!last||last instanceof ReturnNode){return this}this.expressions[idx]=last.makeReturn();return this};Expressions.prototype.compile=function(o){o=o||{};return o.scope?Expressions.__superClass__.compile.call(this,o):this.compileRoot(o)};Expressions.prototype.compileNode=function(o){var _b,_c,_d,_e,node;return(function(){_b=[];_d=this.expressions;for(_c=0,_e=_d.length;_c<_e;_c++){node=_d[_c];_b.push(this.compileExpression(node,merge(o)))}return _b}).call(this).join("\n")};Expressions.prototype.compileRoot=function(o){var code;o.indent=(this.tab=o.noWrap?"":TAB);o.scope=new Scope(null,this,null);code=this.compileWithDeclarations(o);code=code.replace(TRAILING_WHITESPACE,"");code=code.replace(DOUBLE_PARENS,"($1)");return o.noWrap?code:("(function(){\n"+code+"\n})();\n")};Expressions.prototype.compileWithDeclarations=function(o){var code;code=this.compileNode(o);if(o.scope.hasAssignments(this)){code=(""+(this.tab)+"var "+(o.scope.compiledAssignments())+";\n"+code)}if(!o.globals&&o.scope.hasDeclarations(this)){code=(""+(this.tab)+"var "+(o.scope.compiledDeclarations())+";\n"+code)}return code};Expressions.prototype.compileExpression=function(node,o){var compiledNode;this.tab=o.indent;compiledNode=node.compile(merge(o,{top:true}));return node.isStatement()?compiledNode:(""+(this.idt())+compiledNode+";")};return Expressions})();Expressions.wrap=function(nodes){if(nodes.length===1&&nodes[0] instanceof Expressions){return nodes[0]}return new Expressions(nodes)};exports.LiteralNode=(function(){LiteralNode=function(value){this.value=value;return this};__extends(LiteralNode,BaseNode);LiteralNode.prototype["class"]="LiteralNode";LiteralNode.prototype.isStatement=function(){return this.value==="break"||this.value==="continue"};LiteralNode.prototype.isPureStatement=LiteralNode.prototype.isStatement;LiteralNode.prototype.compileNode=function(o){var end,idt;idt=this.isStatement()?this.idt():"";end=this.isStatement()?";":"";return""+idt+this.value+end};LiteralNode.prototype.toString=function(idt){return' "'+this.value+'"'};return LiteralNode})();exports.ReturnNode=(function(){ReturnNode=function(expression){this.expression=expression;return this};__extends(ReturnNode,BaseNode);ReturnNode.prototype["class"]="ReturnNode";ReturnNode.prototype.isStatement=function(){return true};ReturnNode.prototype.isPureStatement=function(){return true};ReturnNode.prototype.children=["expression"];ReturnNode.prototype.makeReturn=function(){return this};ReturnNode.prototype.compile=function(o){var expr;expr=this.expression.makeReturn();if(!(expr instanceof ReturnNode)){return expr.compile(o)}return ReturnNode.__superClass__.compile.call(this,o)};ReturnNode.prototype.compileNode=function(o){if(this.expression.isStatement()){o.asStatement=true}return""+(this.tab)+"return "+(this.expression.compile(o))+";"};return ReturnNode})();exports.ValueNode=(function(){ValueNode=function(base,properties){this.base=base;this.properties=(properties||[]);return this};__extends(ValueNode,BaseNode);ValueNode.prototype.SOAK=" == undefined ? undefined : ";ValueNode.prototype["class"]="ValueNode";ValueNode.prototype.children=["base","properties"];ValueNode.prototype.push=function(prop){this.properties.push(prop);return this};ValueNode.prototype.hasProperties=function(){return !!this.properties.length};ValueNode.prototype.isArray=function(){return this.base instanceof ArrayNode&&!this.hasProperties()};ValueNode.prototype.isObject=function(){return this.base instanceof ObjectNode&&!this.hasProperties()};ValueNode.prototype.isSplice=function(){return this.hasProperties()&&this.properties[this.properties.length-1] instanceof SliceNode};ValueNode.prototype.makeReturn=function(){return this.hasProperties()?ValueNode.__superClass__.makeReturn.call(this):this.base.makeReturn()};ValueNode.prototype.unwrap=function(){return this.properties.length?this:this.base};ValueNode.prototype.isStatement=function(){return this.base.isStatement&&this.base.isStatement()&&!this.hasProperties()};ValueNode.prototype.isNumber=function(){return this.base instanceof LiteralNode&&this.base.value.match(NUMBER)};ValueNode.prototype.isStart=function(o){var node;if(this===o.chainRoot&&this.properties[0] instanceof AccessorNode){return true}node=o.chainRoot.base||o.chainRoot.variable;while(node instanceof CallNode){node=node.variable}return node===this};ValueNode.prototype.compile=function(o){return !o.top||this.properties.length?ValueNode.__superClass__.compile.call(this,o):this.base.compile(o)};ValueNode.prototype.compileNode=function(o){var _b,_c,baseline,complete,i,only,op,part,prop,props,temp;only=del(o,"onlyFirst");op=del(o,"operation");props=only?this.properties.slice(0,this.properties.length-1):this.properties;o.chainRoot=o.chainRoot||this;baseline=this.base.compile(o);if(this.hasProperties()&&(this.base instanceof ObjectNode||this.isNumber())){baseline=("("+baseline+")")}complete=(this.last=baseline);_b=props;for(i=0,_c=_b.length;i<_c;i++){prop=_b[i];this.source=baseline;if(prop.soakNode){if(this.base instanceof CallNode&&i===0){temp=o.scope.freeVariable();complete=("("+(baseline=temp)+" = ("+complete+"))")}if(i===0&&this.isStart(o)){complete=("typeof "+complete+' === "undefined" || '+baseline)}complete+=this.SOAK+(baseline+=prop.compile(o))}else{part=prop.compile(o);baseline+=part;complete+=part;this.last=part}}return op&&this.wrapped?("("+complete+")"):complete};return ValueNode})();exports.CommentNode=(function(){CommentNode=function(lines){this.lines=lines;return this};__extends(CommentNode,BaseNode);CommentNode.prototype["class"]="CommentNode";CommentNode.prototype.isStatement=function(){return true};CommentNode.prototype.makeReturn=function(){return this};CommentNode.prototype.compileNode=function(o){var sep;sep=("\n"+this.tab);return""+this.tab+"/*"+sep+(this.lines.join(sep))+"\n"+this.tab+"*/"};return CommentNode})();exports.CallNode=(function(){CallNode=function(variable,args){this.isNew=false;this.isSuper=variable==="super";this.variable=this.isSuper?null:variable;this.args=(args||[]);this.compileSplatArguments=function(o){return SplatNode.compileMixedArray.call(this,this.args,o)};return this};__extends(CallNode,BaseNode);CallNode.prototype["class"]="CallNode";CallNode.prototype.children=["variable","args"];CallNode.prototype.newInstance=function(){this.isNew=true;return this};CallNode.prototype.prefix=function(){return this.isNew?"new ":""};CallNode.prototype.superReference=function(o){var meth,methname;methname=o.scope.method.name;meth=(function(){if(o.scope.method.proto){return""+(o.scope.method.proto)+".__superClass__."+methname}else{if(methname){return""+(methname)+".__superClass__.constructor"}else{throw new Error("cannot call super on an anonymous function.")}}})();return meth};CallNode.prototype.compileNode=function(o){var _b,_c,_d,_e,_f,_g,_h,arg,args,compilation;if(!(o.chainRoot)){o.chainRoot=this}_c=this.args;for(_b=0,_d=_c.length;_b<_d;_b++){arg=_c[_b];arg instanceof SplatNode?(compilation=this.compileSplat(o)):null}if(!(compilation)){args=(function(){_e=[];_g=this.args;for(_f=0,_h=_g.length;_f<_h;_f++){arg=_g[_f];_e.push(arg.compile(o))}return _e}).call(this).join(", ");compilation=this.isSuper?this.compileSuper(args,o):(""+(this.prefix())+(this.variable.compile(o))+"("+args+")")}return o.operation&&this.wrapped?("("+compilation+")"):compilation};CallNode.prototype.compileSuper=function(args,o){return""+(this.superReference(o))+".call(this"+(args.length?", ":"")+args+")"};CallNode.prototype.compileSplat=function(o){var meth,obj,temp;meth=this.variable?this.variable.compile(o):this.superReference(o);obj=this.variable&&this.variable.source||"this";if(obj.match(/\(/)){temp=o.scope.freeVariable();obj=temp;meth=("("+temp+" = "+(this.variable.source)+")"+(this.variable.last))}return""+(this.prefix())+(meth)+".apply("+obj+", "+(this.compileSplatArguments(o))+")"};return CallNode})();exports.ExtendsNode=(function(){ExtendsNode=function(child,parent){this.child=child;this.parent=parent;return this};__extends(ExtendsNode,BaseNode);ExtendsNode.prototype["class"]="ExtendsNode";ExtendsNode.prototype.children=["child","parent"];ExtendsNode.prototype.compileNode=function(o){var ref;ref=new ValueNode(literal(utility("extends")));return(new CallNode(ref,[this.child,this.parent])).compile(o)};return ExtendsNode})();exports.AccessorNode=(function(){AccessorNode=function(name,tag){this.name=name;this.prototype=tag==="prototype"?".prototype":"";this.soakNode=tag==="soak";return this};__extends(AccessorNode,BaseNode);AccessorNode.prototype["class"]="AccessorNode";AccessorNode.prototype.children=["name"];AccessorNode.prototype.compileNode=function(o){var name,namePart;name=this.name.compile(o);o.chainRoot.wrapped=o.chainRoot.wrapped||this.soakNode;namePart=name.match(IS_STRING)?("["+name+"]"):("."+name);return this.prototype+namePart};return AccessorNode})();exports.IndexNode=(function(){IndexNode=function(index){this.index=index;return this};__extends(IndexNode,BaseNode);IndexNode.prototype["class"]="IndexNode";IndexNode.prototype.children=["index"];IndexNode.prototype.compileNode=function(o){var idx,prefix;o.chainRoot.wrapped=o.chainRoot.wrapped||this.soakNode;idx=this.index.compile(o);prefix=this.proto?".prototype":"";return""+prefix+"["+idx+"]"};return IndexNode})();exports.RangeNode=(function(){RangeNode=function(from,to,exclusive){this.from=from;this.to=to;this.exclusive=!!exclusive;return this};__extends(RangeNode,BaseNode);RangeNode.prototype["class"]="RangeNode";RangeNode.prototype.children=["from","to"];RangeNode.prototype.compileVariables=function(o){var _b,_c,parts;_b=this.from.compileReference(o);this.from=_b[0];this.fromVar=_b[1];_c=this.to.compileReference(o);this.to=_c[0];this.toVar=_c[1];parts=[];if(this.from!==this.fromVar){parts.push(this.from.compile(o))}if(this.to!==this.toVar){parts.push(this.to.compile(o))}return parts.length?(""+(parts.join("; "))+";"):""};RangeNode.prototype.compileNode=function(o){var equals,idx,op,step,vars;if(!(o.index)){return this.compileArray(o)}idx=del(o,"index");step=del(o,"step");vars=(""+idx+" = "+(this.fromVar.compile(o)));step=step?step.compile(o):"1";equals=this.exclusive?"":"=";op=starts(step,"-")?(">"+equals):("<"+equals);return""+vars+"; "+(idx)+" "+op+" "+(this.toVar.compile(o))+"; "+idx+" += "+step};RangeNode.prototype.compileArray=function(o){var body,clause,equals,from,i,idt,post,pre,result,to,vars;idt=this.idt(1);vars=this.compileVariables(merge(o,{indent:idt}));equals=this.exclusive?"":"=";from=this.fromVar.compile(o);to=this.toVar.compile(o);result=o.scope.freeVariable();i=o.scope.freeVariable();clause=(""+from+" <= "+to+" ?");pre=("\n"+(idt)+(result)+" = []; "+(vars));body=("var "+i+" = "+from+"; "+clause+" "+i+" <"+equals+" "+to+" : "+i+" >"+equals+" "+to+"; "+clause+" "+i+" += 1 : "+i+" -= 1");post=("{ "+(result)+".push("+i+") };\n"+(idt)+"return "+result+";\n"+o.indent);return"(function(){"+(pre)+"\n"+(idt)+"for ("+body+")"+post+"}).call(this)"};return RangeNode})();exports.SliceNode=(function(){SliceNode=function(range){this.range=range;return this};__extends(SliceNode,BaseNode);SliceNode.prototype["class"]="SliceNode";SliceNode.prototype.children=["range"];SliceNode.prototype.compileNode=function(o){var from,plusPart,to;from=this.range.from.compile(o);to=this.range.to.compile(o);plusPart=this.range.exclusive?"":" + 1";return".slice("+from+", "+to+plusPart+")"};return SliceNode})();exports.ObjectNode=(function(){ObjectNode=function(props){this.objects=(this.properties=props||[]);return this};__extends(ObjectNode,BaseNode);ObjectNode.prototype["class"]="ObjectNode";ObjectNode.prototype.children=["properties"];ObjectNode.prototype.compileNode=function(o){var _b,_c,_d,_e,_f,_g,_h,i,indent,inner,join,lastNoncom,nonComments,prop,props;o.indent=this.idt(1);nonComments=(function(){_b=[];_d=this.properties;for(_c=0,_e=_d.length;_c<_e;_c++){prop=_d[_c];!(prop instanceof CommentNode)?_b.push(prop):null}return _b}).call(this);lastNoncom=nonComments[nonComments.length-1];props=(function(){_f=[];_g=this.properties;for(i=0,_h=_g.length;i<_h;i++){prop=_g[i];_f.push((function(){join=",\n";if((prop===lastNoncom)||(prop instanceof CommentNode)){join="\n"}if(i===this.properties.length-1){join=""}indent=prop instanceof CommentNode?"":this.idt(1);if(!(prop instanceof AssignNode||prop instanceof CommentNode)){prop=new AssignNode(prop,prop,"object")}return indent+prop.compile(o)+join}).call(this))}return _f}).call(this);props=props.join("");inner=props?"\n"+props+"\n"+this.idt():"";return"{"+inner+"}"};return ObjectNode})();exports.ArrayNode=(function(){ArrayNode=function(objects){this.objects=objects||[];this.compileSplatLiteral=function(o){return SplatNode.compileMixedArray.call(this,this.objects,o)};return this};__extends(ArrayNode,BaseNode);ArrayNode.prototype["class"]="ArrayNode";ArrayNode.prototype.children=["objects"];ArrayNode.prototype.compileNode=function(o){var _b,_c,code,i,obj,objects;o.indent=this.idt(1);objects=[];_b=this.objects;for(i=0,_c=_b.length;i<_c;i++){obj=_b[i];code=obj.compile(o);if(obj instanceof SplatNode){return this.compileSplatLiteral(this.objects,o)}else{if(obj instanceof CommentNode){objects.push("\n"+code+"\n"+o.indent)}else{if(i===this.objects.length-1){objects.push(code)}else{objects.push(""+code+", ")}}}}objects=objects.join("");return indexOf(objects,"\n")>=0?("[\n"+(this.idt(1))+objects+"\n"+this.tab+"]"):("["+objects+"]")};return ArrayNode})();exports.ClassNode=(function(){ClassNode=function(variable,parent,props){this.variable=variable;this.parent=parent;this.properties=props||[];this.returns=false;return this};__extends(ClassNode,BaseNode);ClassNode.prototype["class"]="ClassNode";ClassNode.prototype.children=["variable","parent","properties"];ClassNode.prototype.isStatement=function(){return true};ClassNode.prototype.makeReturn=function(){this.returns=true;return this};ClassNode.prototype.compileNode=function(o){var _b,_c,_d,_e,access,applied,className,constScope,construct,constructor,extension,func,me,pname,prop,props,pvar,returns,val;extension=this.parent&&new ExtendsNode(this.variable,this.parent);props=new Expressions();o.top=true;me=null;className=this.variable.compile(o);constScope=null;if(this.parent){applied=new ValueNode(this.parent,[new AccessorNode(literal("apply"))]);constructor=new CodeNode([],new Expressions([new CallNode(applied,[literal("this"),literal("arguments")])]))}else{constructor=new CodeNode()}_c=this.properties;for(_b=0,_d=_c.length;_b<_d;_b++){prop=_c[_b];_e=[prop.variable,prop.value];pvar=_e[0];func=_e[1];if(pvar&&pvar.base.value==="constructor"&&func instanceof CodeNode){if(func.bound){throw new Error("cannot define a constructor as a bound function.")}func.name=className;func.body.push(new ReturnNode(literal("this")));this.variable=new ValueNode(this.variable);this.variable.namespaced=include(func.name,".");constructor=func;continue}if(func instanceof CodeNode&&func.bound){func.bound=false;constScope=constScope||new Scope(o.scope,constructor.body,constructor);me=me||constScope.freeVariable();pname=pvar.compile(o);if(constructor.body.empty()){constructor.body.push(new ReturnNode(literal("this")))}constructor.body.unshift(literal(("this."+(pname)+" = function(){ return "+(className)+".prototype."+(pname)+".apply("+me+", arguments); }")))}if(pvar){access=prop.context==="this"?pvar.base.properties[0]:new AccessorNode(pvar,"prototype");val=new ValueNode(this.variable,[access]);prop=new AssignNode(val,func)}props.push(prop)}if(me){constructor.body.unshift(literal(""+me+" = this"))}construct=this.idt()+(new AssignNode(this.variable,constructor)).compile(merge(o,{sharedScope:constScope}))+";\n";props=props.empty()?"":props.compile(o)+"\n";extension=extension?this.idt()+extension.compile(o)+";\n":"";returns=this.returns?new ReturnNode(this.variable).compile(o):"";return""+construct+extension+props+returns};return ClassNode})();exports.AssignNode=(function(){AssignNode=function(variable,value,context){this.variable=variable;this.value=value;this.context=context;return this};__extends(AssignNode,BaseNode);AssignNode.prototype.PROTO_ASSIGN=/^(\S+)\.prototype/;AssignNode.prototype.LEADING_DOT=/^\.(prototype\.)?/;AssignNode.prototype["class"]="AssignNode";AssignNode.prototype.children=["variable","value"];AssignNode.prototype.topSensitive=function(){return true};AssignNode.prototype.isValue=function(){return this.variable instanceof ValueNode};AssignNode.prototype.makeReturn=function(){return new Expressions([this,new ReturnNode(this.variable)])};AssignNode.prototype.isStatement=function(){return this.isValue()&&(this.variable.isArray()||this.variable.isObject())};AssignNode.prototype.compileNode=function(o){var last,match,name,proto,stmt,top,val;top=del(o,"top");if(this.isStatement()){return this.compilePatternMatch(o)}if(this.isValue()&&this.variable.isSplice()){return this.compileSplice(o)}stmt=del(o,"asStatement");name=this.variable.compile(o);last=this.isValue()?this.variable.last.replace(this.LEADING_DOT,""):name;match=name.match(this.PROTO_ASSIGN);proto=match&&match[1];if(this.value instanceof CodeNode){if(last.match(IDENTIFIER)){this.value.name=last}if(proto){this.value.proto=proto}}val=this.value.compile(o);if(this.context==="object"){return(""+name+": "+val)}if(!(this.isValue()&&(this.variable.hasProperties()||this.variable.namespaced))){o.scope.find(name)}val=(""+name+" = "+val);if(stmt){return(""+this.tab+val+";")}return top?val:("("+val+")")};AssignNode.prototype.compilePatternMatch=function(o){var _b,_c,_d,accessClass,assigns,code,i,idx,isString,obj,oindex,olength,splat,val,valVar,value;valVar=o.scope.freeVariable();value=this.value.isStatement()?ClosureNode.wrap(this.value):this.value;assigns=[(""+this.tab+valVar+" = "+(value.compile(o))+";")];o.top=true;o.asStatement=true;splat=false;_b=this.variable.base.objects;for(i=0,_c=_b.length;i<_c;i++){obj=_b[i];idx=i;if(this.variable.isObject()){if(obj instanceof AssignNode){_d=[obj.value,obj.variable.base];obj=_d[0];idx=_d[1]}else{idx=obj}}if(!(obj instanceof ValueNode||obj instanceof SplatNode)){throw new Error("pattern matching must use only identifiers on the left-hand side.")}isString=idx.value&&idx.value.match(IS_STRING);accessClass=isString||this.variable.isArray()?IndexNode:AccessorNode;if(obj instanceof SplatNode&&!splat){val=literal(obj.compileValue(o,valVar,(oindex=indexOf(this.variable.base.objects,obj)),(olength=this.variable.base.objects.length)-oindex-1));splat=true}else{if(typeof idx!=="object"){idx=literal(splat?(""+(valVar)+".length - "+(olength-idx)):idx)}val=new ValueNode(literal(valVar),[new accessClass(idx)])}assigns.push(new AssignNode(obj,val).compile(o))}code=assigns.join("\n");return code};AssignNode.prototype.compileSplice=function(o){var from,l,name,plus,range,to,val;name=this.variable.compile(merge(o,{onlyFirst:true}));l=this.variable.properties.length;range=this.variable.properties[l-1].range;plus=range.exclusive?"":" + 1";from=range.from.compile(o);to=range.to.compile(o)+" - "+from+plus;val=this.value.compile(o);return""+(name)+".splice.apply("+name+", ["+from+", "+to+"].concat("+val+"))"};return AssignNode})();exports.CodeNode=(function(){CodeNode=function(params,body,tag){this.params=params||[];this.body=body||new Expressions();this.bound=tag==="boundfunc";return this};__extends(CodeNode,BaseNode);CodeNode.prototype["class"]="CodeNode";CodeNode.prototype.children=["params","body"];CodeNode.prototype.compileNode=function(o){var _b,_c,_d,_e,_f,_g,_h,_i,_j,_k,code,func,i,inner,param,params,sharedScope,splat,top;sharedScope=del(o,"sharedScope");top=del(o,"top");o.scope=sharedScope||new Scope(o.scope,this.body,this);o.top=true;o.indent=this.idt(this.bound?2:1);del(o,"noWrap");del(o,"globals");i=0;splat=undefined;params=[];_c=this.params;for(_b=0,_d=_c.length;_b<_d;_b++){param=_c[_b];if(param instanceof SplatNode&&!(typeof splat!=="undefined"&&splat!==null)){splat=param;splat.index=i;splat.trailings=[];splat.arglength=this.params.length;this.body.unshift(splat)}else{if(typeof splat!=="undefined"&&splat!==null){splat.trailings.push(param)}else{params.push(param)}}i+=1}params=(function(){_e=[];_g=params;for(_f=0,_h=_g.length;_f<_h;_f++){param=_g[_f];_e.push(param.compile(o))}return _e})();this.body.makeReturn();_j=params;for(_i=0,_k=_j.length;_i<_k;_i++){param=_j[_i];(o.scope.parameter(param))}code=this.body.expressions.length?("\n"+(this.body.compileWithDeclarations(o))+"\n"):"";func=("function("+(params.join(", "))+") {"+code+(this.idt(this.bound?1:0))+"}");if(top&&!this.bound){func=("("+func+")")}if(!(this.bound)){return func}inner=("(function() {\n"+(this.idt(2))+"return __func.apply(__this, arguments);\n"+(this.idt(1))+"});");return"(function(__this) {\n"+(this.idt(1))+"var __func = "+func+";\n"+(this.idt(1))+"return "+inner+"\n"+this.tab+"})(this)"};CodeNode.prototype.topSensitive=function(){return true};CodeNode.prototype.traverseChildren=function(crossScope,func){if(crossScope){return CodeNode.__superClass__.traverseChildren.call(this,crossScope,func)}};CodeNode.prototype.toString=function(idt){var _b,_c,_d,_e,child,children;idt=idt||"";children=(function(){_b=[];_d=this.collectChildren();for(_c=0,_e=_d.length;_c<_e;_c++){child=_d[_c];_b.push(child.toString(idt+TAB))}return _b}).call(this).join("");return"\n"+idt+children};return CodeNode})();exports.SplatNode=(function(){SplatNode=function(name){if(!(name.compile)){name=literal(name)}this.name=name;return this};__extends(SplatNode,BaseNode);SplatNode.prototype["class"]="SplatNode";SplatNode.prototype.children=["name"];SplatNode.prototype.compileNode=function(o){var _b;return(typeof(_b=this.index)!=="undefined"&&_b!==null)?this.compileParam(o):this.name.compile(o)};SplatNode.prototype.compileParam=function(o){var _b,_c,idx,len,name,pos,trailing,variadic;name=this.name.compile(o);o.scope.find(name);len=o.scope.freeVariable();o.scope.assign(len,"arguments.length");variadic=o.scope.freeVariable();o.scope.assign(variadic,(""+len+" >= "+this.arglength));_b=this.trailings;for(idx=0,_c=_b.length;idx<_c;idx++){trailing=_b[idx];pos=this.trailings.length-idx;o.scope.assign(trailing.compile(o),("arguments["+variadic+" ? "+len+" - "+pos+" : "+(this.index+idx)+"]"))}return""+name+" = "+(utility("slice"))+".call(arguments, "+this.index+", "+len+" - "+(this.trailings.length)+")"};SplatNode.prototype.compileValue=function(o,name,index,trailings){var trail;trail=trailings?(", "+(name)+".length - "+trailings):"";return""+(utility("slice"))+".call("+name+", "+index+trail+")"};SplatNode.compileMixedArray=function(list,o){var _b,_c,_d,arg,args,code,i,prev;args=[];i=0;_c=list;for(_b=0,_d=_c.length;_b<_d;_b++){arg=_c[_b];code=arg.compile(o);if(!(arg instanceof SplatNode)){prev=args[i-1];if(i===1&&prev.substr(0,1)==="["&&prev.substr(prev.length-1,1)==="]"){args[i-1]=(""+(prev.substr(0,prev.length-1))+", "+code+"]");continue}else{if(i>1&&prev.substr(0,9)===".concat(["&&prev.substr(prev.length-2,2)==="])"){args[i-1]=(""+(prev.substr(0,prev.length-2))+", "+code+"])");continue}else{code=("["+code+"]")}}}args.push(i===0?code:(".concat("+code+")"));i+=1}return args.join("")};return SplatNode}).call(this);exports.WhileNode=(function(){WhileNode=function(condition,opts){if(opts&&opts.invert){if(condition instanceof OpNode){condition=new ParentheticalNode(condition)}condition=new OpNode("!",condition)}this.condition=condition;this.guard=opts&&opts.guard;return this};__extends(WhileNode,BaseNode);WhileNode.prototype["class"]="WhileNode";WhileNode.prototype.children=["condition","guard","body"];WhileNode.prototype.isStatement=function(){return true};WhileNode.prototype.addBody=function(body){this.body=body;return this};WhileNode.prototype.makeReturn=function(){this.returns=true;return this};WhileNode.prototype.topSensitive=function(){return true};WhileNode.prototype.compileNode=function(o){var cond,post,pre,rvar,set,top;top=del(o,"top")&&!this.returns;o.indent=this.idt(1);o.top=true;cond=this.condition.compile(o);set="";if(!(top)){rvar=o.scope.freeVariable();set=(""+this.tab+rvar+" = [];\n");if(this.body){this.body=PushNode.wrap(rvar,this.body)}}pre=(""+set+(this.tab)+"while ("+cond+")");if(this.guard){this.body=Expressions.wrap([new IfNode(this.guard,this.body)])}this.returns?(post="\n"+new ReturnNode(literal(rvar)).compile(merge(o,{indent:this.idt()}))):(post="");return""+pre+" {\n"+(this.body.compile(o))+"\n"+this.tab+"}"+post};return WhileNode})();exports.OpNode=(function(){OpNode=function(operator,first,second,flip){this.first=first;this.second=second;this.operator=this.CONVERSIONS[operator]||operator;this.flip=!!flip;return this};__extends(OpNode,BaseNode);OpNode.prototype.CONVERSIONS={"==":"===","!=":"!=="};OpNode.prototype.CHAINABLE=["<",">",">=","<=","===","!=="];OpNode.prototype.ASSIGNMENT=["||=","&&=","?="];OpNode.prototype.PREFIX_OPERATORS=["typeof","delete"];OpNode.prototype["class"]="OpNode";OpNode.prototype.children=["first","second"];OpNode.prototype.isUnary=function(){return !this.second};OpNode.prototype.isChainable=function(){return indexOf(this.CHAINABLE,this.operator)>=0};OpNode.prototype.toString=function(idt){return OpNode.__superClass__.toString.call(this,idt,this["class"]+" "+this.operator)};OpNode.prototype.compileNode=function(o){o.operation=true;if(this.isChainable()&&this.first.unwrap() instanceof OpNode&&this.first.unwrap().isChainable()){return this.compileChain(o)}if(indexOf(this.ASSIGNMENT,this.operator)>=0){return this.compileAssignment(o)}if(this.isUnary()){return this.compileUnary(o)}if(this.operator==="?"){return this.compileExistence(o)}return[this.first.compile(o),this.operator,this.second.compile(o)].join(" ")};OpNode.prototype.compileChain=function(o){var _b,_c,first,second,shared;shared=this.first.unwrap().second;if(shared.containsType(CallNode)){_b=shared.compileReference(o);this.first.second=_b[0];shared=_b[1]}_c=[this.first.compile(o),this.second.compile(o),shared.compile(o)];first=_c[0];second=_c[1];shared=_c[2];return"("+first+") && ("+shared+" "+this.operator+" "+second+")"};OpNode.prototype.compileAssignment=function(o){var _b,first,second;_b=[this.first.compile(o),this.second.compile(o)];first=_b[0];second=_b[1];if(first.match(IDENTIFIER)){o.scope.find(first)}if(this.operator==="?="){return(""+first+" = "+(ExistenceNode.compileTest(o,this.first))+" ? "+first+" : "+second)}return""+first+" = "+first+" "+(this.operator.substr(0,2))+" "+second};OpNode.prototype.compileExistence=function(o){var _b,first,second,test;_b=[this.first.compile(o),this.second.compile(o)];first=_b[0];second=_b[1];test=ExistenceNode.compileTest(o,this.first);return""+test+" ? "+first+" : "+second};OpNode.prototype.compileUnary=function(o){var parts,space;space=indexOf(this.PREFIX_OPERATORS,this.operator)>=0?" ":"";parts=[this.operator,space,this.first.compile(o)];if(this.flip){parts=parts.reverse()}return parts.join("")};return OpNode})();exports.InNode=(function(){InNode=function(object,array){this.object=object;this.array=array;return this};__extends(InNode,BaseNode);InNode.prototype["class"]="InNode";InNode.prototype.children=["object","array"];InNode.prototype.isArray=function(){return this.array instanceof ValueNode&&this.array.isArray()};InNode.prototype.compileNode=function(o){var _b;_b=this.object.compileReference(o,{precompile:true});this.obj1=_b[0];this.obj2=_b[1];return this.isArray()?this.compileOrTest(o):this.compileLoopTest(o)};InNode.prototype.compileOrTest=function(o){var _b,_c,_d,i,item,tests;tests=(function(){_b=[];_c=this.array.base.objects;for(i=0,_d=_c.length;i<_d;i++){item=_c[i];_b.push((""+(item.compile(o))+" === "+(i?this.obj2:this.obj1)))}return _b}).call(this);return"("+(tests.join(" || "))+")"};InNode.prototype.compileLoopTest=function(o){var _b,_c,i,l,prefix;_b=this.array.compileReference(o,{precompile:true});this.arr1=_b[0];this.arr2=_b[1];_c=[o.scope.freeVariable(),o.scope.freeVariable()];i=_c[0];l=_c[1];prefix=this.obj1!==this.obj2?this.obj1+"; ":"";return"!!(function(){ "+(prefix)+"for (var "+i+"=0, "+l+"="+(this.arr1)+".length; "+i+"<"+l+"; "+i+"++) if ("+(this.arr2)+"["+i+"] === "+this.obj2+") return true; }).call(this)"};return InNode})();exports.TryNode=(function(){TryNode=function(attempt,error,recovery,ensure){this.attempt=attempt;this.recovery=recovery;this.ensure=ensure;this.error=error;return this};__extends(TryNode,BaseNode);TryNode.prototype["class"]="TryNode";TryNode.prototype.children=["attempt","recovery","ensure"];TryNode.prototype.isStatement=function(){return true};TryNode.prototype.makeReturn=function(){if(this.attempt){this.attempt=this.attempt.makeReturn()}if(this.recovery){this.recovery=this.recovery.makeReturn()}return this};TryNode.prototype.compileNode=function(o){var attemptPart,catchPart,errorPart,finallyPart;o.indent=this.idt(1);o.top=true;attemptPart=this.attempt.compile(o);errorPart=this.error?(" ("+(this.error.compile(o))+") "):" ";catchPart=this.recovery?(" catch"+errorPart+"{\n"+(this.recovery.compile(o))+"\n"+this.tab+"}"):"";finallyPart=(this.ensure||"")&&" finally {\n"+this.ensure.compile(merge(o))+("\n"+this.tab+"}");return""+(this.tab)+"try {\n"+attemptPart+"\n"+this.tab+"}"+catchPart+finallyPart};return TryNode})();exports.ThrowNode=(function(){ThrowNode=function(expression){this.expression=expression;return this};__extends(ThrowNode,BaseNode);ThrowNode.prototype["class"]="ThrowNode";ThrowNode.prototype.children=["expression"];ThrowNode.prototype.isStatement=function(){return true};ThrowNode.prototype.makeReturn=function(){return this};ThrowNode.prototype.compileNode=function(o){return""+(this.tab)+"throw "+(this.expression.compile(o))+";"};return ThrowNode})();exports.ExistenceNode=(function(){ExistenceNode=function(expression){this.expression=expression;return this};__extends(ExistenceNode,BaseNode);ExistenceNode.prototype["class"]="ExistenceNode";ExistenceNode.prototype.children=["expression"];ExistenceNode.prototype.compileNode=function(o){return ExistenceNode.compileTest(o,this.expression)};ExistenceNode.compileTest=function(o,variable){var _b,first,second;_b=variable.compileReference(o);first=_b[0];second=_b[1];return"(typeof "+(first.compile(o))+' !== "undefined" && '+(second.compile(o))+" !== null)"};return ExistenceNode}).call(this);exports.ParentheticalNode=(function(){ParentheticalNode=function(expression){this.expression=expression;return this};__extends(ParentheticalNode,BaseNode);ParentheticalNode.prototype["class"]="ParentheticalNode";ParentheticalNode.prototype.children=["expression"];ParentheticalNode.prototype.isStatement=function(){return this.expression.isStatement()};ParentheticalNode.prototype.makeReturn=function(){return this.expression.makeReturn()};ParentheticalNode.prototype.topSensitive=function(){return true};ParentheticalNode.prototype.compileNode=function(o){var code,l,top;top=del(o,"top");code=this.expression.compile(o);if(this.isStatement()){return(top?(""+this.tab+code+";"):code)}l=code.length;if(code.substr(l-1,1)===";"){code=code.substr(o,l-1)}return this.expression instanceof AssignNode?code:("("+code+")")};return ParentheticalNode})();exports.ForNode=(function(){ForNode=function(body,source,name,index){var _b;this.body=body;this.name=name;this.index=index||null;this.source=source.source;this.guard=source.guard;this.step=source.step;this.object=!!source.object;if(this.object){_b=[this.index,this.name];this.name=_b[0];this.index=_b[1]}this.pattern=this.name instanceof ValueNode;if(this.index instanceof ValueNode){throw new Error("index cannot be a pattern matching expression")}this.returns=false;return this};__extends(ForNode,BaseNode);ForNode.prototype["class"]="ForNode";ForNode.prototype.children=["body","source","guard"];ForNode.prototype.isStatement=function(){return true};ForNode.prototype.topSensitive=function(){return true};ForNode.prototype.makeReturn=function(){this.returns=true;return this};ForNode.prototype.compileReturnValue=function(val,o){if(this.returns){return"\n"+new ReturnNode(literal(val)).compile(o)}if(val){return"\n"+val}return""};ForNode.prototype.compileNode=function(o){var body,close,codeInBody,forPart,index,ivar,lvar,name,namePart,range,returnResult,rvar,scope,source,sourcePart,stepPart,svar,topLevel,varPart,vars;topLevel=del(o,"top")&&!this.returns;range=this.source instanceof ValueNode&&this.source.base instanceof RangeNode&&!this.source.properties.length;source=range?this.source.base:this.source;codeInBody=this.body.contains(function(n){return n instanceof CodeNode});scope=o.scope;name=this.name&&this.name.compile(o);index=this.index&&this.index.compile(o);if(name&&!this.pattern&&!codeInBody){scope.find(name)}if(index){scope.find(index)}if(!(topLevel)){rvar=scope.freeVariable()}ivar=(function(){if(range){return name}else{if(codeInBody){return scope.freeVariable()}else{return index||scope.freeVariable()}}})();varPart="";body=Expressions.wrap([this.body]);if(range){sourcePart=source.compileVariables(o);if(sourcePart){sourcePart+=("\n"+o.indent)}forPart=source.compile(merge(o,{index:ivar,step:this.step}))}else{svar=scope.freeVariable();sourcePart=(""+svar+" = "+(this.source.compile(o))+";");if(this.pattern){namePart=new AssignNode(this.name,literal(""+svar+"["+ivar+"]")).compile(merge(o,{indent:this.idt(1),top:true}))+"\n"}else{if(name){namePart=(""+name+" = "+svar+"["+ivar+"]")}}if(!(this.object)){lvar=scope.freeVariable();stepPart=this.step?(""+ivar+" += "+(this.step.compile(o))):(""+ivar+"++");forPart=(""+ivar+" = 0, "+lvar+" = "+(svar)+".length; "+ivar+" < "+lvar+"; "+stepPart)}}sourcePart=(rvar?(""+rvar+" = []; "):"")+sourcePart;sourcePart=sourcePart?(""+this.tab+sourcePart+"\n"+this.tab):this.tab;returnResult=this.compileReturnValue(rvar,o);if(!(topLevel)){body=PushNode.wrap(rvar,body)}this.guard?(body=Expressions.wrap([new IfNode(this.guard,body)])):null;if(codeInBody){if(namePart){body.unshift(literal("var "+namePart))}if(index){body.unshift(literal("var "+index+" = "+ivar))}body=ClosureNode.wrap(body,true)}else{varPart=(namePart||"")&&(this.pattern?namePart:(""+(this.idt(1))+namePart+";\n"))}this.object?(forPart=(""+ivar+" in "+svar+") { if ("+(utility("hasProp"))+".call("+svar+", "+ivar+")")):null;body=body.compile(merge(o,{indent:this.idt(1),top:true}));vars=range?name:(""+name+", "+ivar);close=this.object?"}}":"}";return""+(sourcePart)+"for ("+forPart+") {\n"+varPart+body+"\n"+this.tab+close+returnResult};return ForNode})();exports.IfNode=(function(){IfNode=function(condition,body,tags){this.condition=condition;this.body=body;this.elseBody=null;this.tags=tags||{};if(this.tags.invert){this.condition=new OpNode("!",new ParentheticalNode(this.condition))}this.isChain=false;return this};__extends(IfNode,BaseNode);IfNode.prototype["class"]="IfNode";IfNode.prototype.children=["condition","switchSubject","body","elseBody","assigner"];IfNode.prototype.bodyNode=function(){return this.body==undefined?undefined:this.body.unwrap()};IfNode.prototype.elseBodyNode=function(){return this.elseBody==undefined?undefined:this.elseBody.unwrap()};IfNode.prototype.forceStatement=function(){this.tags.statement=true;return this};IfNode.prototype.switchesOver=function(expression){this.switchSubject=expression;return this};IfNode.prototype.rewriteSwitch=function(o){var _b,_c,_d,cond,i,variable;this.assigner=this.switchSubject;if(!((this.switchSubject.unwrap() instanceof LiteralNode))){variable=literal(o.scope.freeVariable());this.assigner=new AssignNode(variable,this.switchSubject);this.switchSubject=variable}this.condition=(function(){_b=[];_c=flatten([this.condition]);for(i=0,_d=_c.length;i<_d;i++){cond=_c[i];_b.push((function(){if(cond instanceof OpNode){cond=new ParentheticalNode(cond)}return new OpNode("==",(i===0?this.assigner:this.switchSubject),cond)}).call(this))}return _b}).call(this);if(this.isChain){this.elseBodyNode().switchesOver(this.switchSubject)}this.switchSubject=undefined;return this};IfNode.prototype.addElse=function(elseBody,statement){if(this.isChain){this.elseBodyNode().addElse(elseBody,statement)}else{this.isChain=elseBody instanceof IfNode;this.elseBody=this.ensureExpressions(elseBody)}return this};IfNode.prototype.isStatement=function(){return this.statement=this.statement||!!(this.tags.statement||this.bodyNode().isStatement()||(this.elseBody&&this.elseBodyNode().isStatement()))};IfNode.prototype.compileCondition=function(o){var _b,_c,_d,_e,cond;return(function(){_b=[];_d=flatten([this.condition]);for(_c=0,_e=_d.length;_c<_e;_c++){cond=_d[_c];_b.push(cond.compile(o))}return _b}).call(this).join(" || ")};IfNode.prototype.compileNode=function(o){return this.isStatement()?this.compileStatement(o):this.compileTernary(o)};IfNode.prototype.makeReturn=function(){if(this.isStatement()){this.body=this.body&&this.ensureExpressions(this.body.makeReturn());this.elseBody=this.elseBody&&this.ensureExpressions(this.elseBody.makeReturn());return this}else{return new ReturnNode(this)}};IfNode.prototype.ensureExpressions=function(node){return node instanceof Expressions?node:new Expressions([node])};IfNode.prototype.compileStatement=function(o){var body,child,comDent,condO,elsePart,ifDent,ifPart;if(this.switchSubject){this.rewriteSwitch(o)}child=del(o,"chainChild");condO=merge(o);o.indent=this.idt(1);o.top=true;ifDent=child?"":this.idt();comDent=child?this.idt():"";body=this.body.compile(o);ifPart=(""+(ifDent)+"if ("+(this.compileCondition(condO))+") {\n"+body+"\n"+this.tab+"}");if(!(this.elseBody)){return ifPart}elsePart=this.isChain?" else "+this.elseBodyNode().compile(merge(o,{indent:this.idt(),chainChild:true})):(" else {\n"+(this.elseBody.compile(o))+"\n"+this.tab+"}");return""+ifPart+elsePart};IfNode.prototype.compileTernary=function(o){var elsePart,ifPart;ifPart=this.condition.compile(o)+" ? "+this.bodyNode().compile(o);elsePart=this.elseBody?this.elseBodyNode().compile(o):"null";return""+ifPart+" : "+elsePart};return IfNode})();PushNode=(exports.PushNode={wrap:function(array,expressions){var expr;expr=expressions.unwrap();if(expr.isPureStatement()||expr.containsPureStatement()){return expressions}return Expressions.wrap([new CallNode(new ValueNode(literal(array),[new AccessorNode(literal("push"))]),[expr])])}});ClosureNode=(exports.ClosureNode={wrap:function(expressions,statement){var args,call,func,mentionsArgs,mentionsThis,meth;if(expressions.containsPureStatement()){return expressions}func=new ParentheticalNode(new CodeNode([],Expressions.wrap([expressions])));args=[];mentionsArgs=expressions.contains(function(n){return n instanceof LiteralNode&&(n.value==="arguments")});mentionsThis=expressions.contains(function(n){return(n instanceof LiteralNode&&(n.value==="this"))||(n instanceof CodeNode&&n.bound)});if(mentionsArgs||mentionsThis){meth=literal(mentionsArgs?"apply":"call");args=[literal("this")];if(mentionsArgs){args.push(literal("arguments"))}func=new ValueNode(func,[new AccessorNode(meth)])}call=new CallNode(func,args);return statement?Expressions.wrap([call]):call}});UTILITIES={__extends:"function(child, parent) {\n    var ctor = function(){ };\n    ctor.prototype = parent.prototype;\n    child.__superClass__ = parent.prototype;\n    child.prototype = new ctor();\n    child.prototype.constructor = child;\n  }",__hasProp:"Object.prototype.hasOwnProperty",__slice:"Array.prototype.slice"};TAB="  ";TRAILING_WHITESPACE=/[ \t]+$/gm;DOUBLE_PARENS=/\(\(([^\(\)\n]*)\)\)/g;IDENTIFIER=/^[a-zA-Z\$_](\w|\$)*$/;NUMBER=/^(((\b0(x|X)[0-9a-fA-F]+)|((\b[0-9]+(\.[0-9]+)?|\.[0-9]+)(e[+\-]?[0-9]+)?)))\b$/i;IS_STRING=/^['"]/;literal=function(name){return new LiteralNode(name)};utility=function(name){var ref;ref=("__"+name);Scope.root.assign(ref,UTILITIES[ref]);return ref}})();(function(){var Lexer,compile,helpers,lexer,parser,path,processScripts;if(typeof process!=="undefined"&&process!==null){path=require("path");Lexer=require("./lexer").Lexer;parser=require("./parser").parser;helpers=require("./helpers").helpers;helpers.extend(global,require("./nodes"));require.registerExtension?require.registerExtension(".coffee",function(content){return compile(content)}):null}else{this.exports=(this.CoffeeScript={});Lexer=this.Lexer;parser=this.parser;helpers=this.helpers}exports.VERSION="0.7.2";lexer=new Lexer();exports.compile=(compile=function(code,options){options=options||{};try{return(parser.parse(lexer.tokenize(code))).compile(options)}catch(err){if(options.source){err.message=("In "+options.source+", "+err.message)}throw err}});exports.tokens=function(code){return lexer.tokenize(code)};exports.nodes=function(code){return parser.parse(lexer.tokenize(code))};exports.run=(function(code,options){var __dirname,__filename;module.filename=(__filename=options.source);__dirname=path.dirname(__filename);return eval(exports.compile(code,options))});parser.lexer={lex:function(){var token;token=this.tokens[this.pos]||[""];this.pos+=1;this.yylineno=token[2];this.yytext=token[1];return token[0]},setInput:function(tokens){this.tokens=tokens;this.pos=0;return this.pos},upcomingInput:function(){return""}};if((typeof document!=="undefined"&&document!==null)&&document.getElementsByTagName){processScripts=function(){var _a,_b,_c,_d,tag;_a=[];_c=document.getElementsByTagName("script");for(_b=0,_d=_c.length;_b<_d;_b++){tag=_c[_b];tag.type==="text/coffeescript"?_a.push(eval(exports.compile(tag.innerHTML))):null}return _a};if(window.addEventListener){window.addEventListener("load",processScripts,false)}else{if(window.attachEvent){window.attachEvent("onload",processScripts)}}}})();
/*!
 * Raphael 1.4.7 - JavaScript Vector Library
 *
 * Copyright (c) 2010 Dmitry Baranovskiy (http://raphaeljs.com)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 */
 
Raphael = (function () {
    function R() {
        if (R.is(arguments[0], array)) {
            var a = arguments[0],
                cnv = create[apply](R, a.splice(0, 3 + R.is(a[0], nu))),
                res = cnv.set();
            for (var i = 0, ii = a[length]; i < ii; i++) {
                var j = a[i] || {};
                elements.test(j.type) && res[push](cnv[j.type]().attr(j));
            }
            return res;
        }
        return create[apply](R, arguments);
    }
    R.version = "1.4.7";
    var separator = /[, ]+/,
        elements = /^(circle|rect|path|ellipse|text|image)$/,
        proto = "prototype",
        has = "hasOwnProperty",
        doc = document,
        win = window,
        oldRaphael = {
            was: Object[proto][has].call(win, "Raphael"),
            is: win.Raphael
        },
        Paper = function () {},
        appendChild = "appendChild",
        apply = "apply",
        concat = "concat",
        supportsTouch = "createTouch" in doc,
        E = "",
        S = " ",
        Str = String,
        split = "split",
        events = "click dblclick mousedown mousemove mouseout mouseover mouseup touchstart touchmove touchend orientationchange touchcancel gesturestart gesturechange gestureend"[split](S),
        touchMap = {
            mousedown: "touchstart",
            mousemove: "touchmove",
            mouseup: "touchend"
        },
        join = "join",
        length = "length",
        lowerCase = String[proto].toLowerCase,
        math = Math,
        mmax = math.max,
        mmin = math.min,
        nu = "number",
        string = "string",
        array = "array",
        toString = "toString",
        fillString = "fill",
        objectToString = Object[proto][toString],
        paper = {},
        pow = math.pow,
        push = "push",
        rg = /^(?=[\da-f]$)/,
        ISURL = /^url\(['"]?([^\)]+?)['"]?\)$/i,
        colourRegExp = /^\s*((#[a-f\d]{6})|(#[a-f\d]{3})|rgba?\(\s*([\d\.]+\s*,\s*[\d\.]+\s*,\s*[\d\.]+(?:\s*,\s*[\d\.]+)?)\s*\)|rgba?\(\s*([\d\.]+%\s*,\s*[\d\.]+%\s*,\s*[\d\.]+%(?:\s*,\s*[\d\.]+%)?)\s*\)|hsb\(\s*([\d\.]+(?:deg|\xb0)?\s*,\s*[\d\.]+\s*,\s*[\d\.]+)\s*\)|hsb\(\s*([\d\.]+(?:deg|\xb0|%)\s*,\s*[\d\.]+%\s*,\s*[\d\.]+%)\s*\)|hsl\(\s*([\d\.]+(?:deg|\xb0)?\s*,\s*[\d\.]+\s*,\s*[\d\.]+)\s*\)|hsl\(\s*([\d\.]+(?:deg|\xb0|%)\s*,\s*[\d\.]+%\s*,\s*[\d\.]+%)\s*\))\s*$/i,
        round = math.round,
        setAttribute = "setAttribute",
        toFloat = parseFloat,
        toInt = parseInt,
        ms = " progid:DXImageTransform.Microsoft",
        upperCase = String[proto].toUpperCase,
        availableAttrs = {blur: 0, "clip-rect": "0 0 1e9 1e9", cursor: "default", cx: 0, cy: 0, fill: "#fff", "fill-opacity": 1, font: '10px "Arial"', "font-family": '"Arial"', "font-size": "10", "font-style": "normal", "font-weight": 400, gradient: 0, height: 0, href: "http://raphaeljs.com/", opacity: 1, path: "M0,0", r: 0, rotation: 0, rx: 0, ry: 0, scale: "1 1", src: "", stroke: "#000", "stroke-dasharray": "", "stroke-linecap": "butt", "stroke-linejoin": "butt", "stroke-miterlimit": 0, "stroke-opacity": 1, "stroke-width": 1, target: "_blank", "text-anchor": "middle", title: "Raphael", translation: "0 0", width: 0, x: 0, y: 0},
        availableAnimAttrs = {along: "along", blur: nu, "clip-rect": "csv", cx: nu, cy: nu, fill: "colour", "fill-opacity": nu, "font-size": nu, height: nu, opacity: nu, path: "path", r: nu, rotation: "csv", rx: nu, ry: nu, scale: "csv", stroke: "colour", "stroke-opacity": nu, "stroke-width": nu, translation: "csv", width: nu, x: nu, y: nu},
        rp = "replace";
    R.type = (win.SVGAngle || doc.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1") ? "SVG" : "VML");
    if (R.type == "VML") {
        var d = doc.createElement("div"),
            b;
        d.innerHTML = '<v:shape adj="1"/>';
        b = d.firstChild;
        b.style.behavior = "url(#default#VML)";
        if (!(b && typeof b.adj == "object")) {
            return R.type = null;
        }
        d = null;
    }
    R.svg = !(R.vml = R.type == "VML");
    Paper[proto] = R[proto];
    R._id = 0;
    R._oid = 0;
    R.fn = {};
    R.is = function (o, type) {
        type = lowerCase.call(type);
        return  (type == "object" && o === Object(o)) ||
                (type == "undefined" && typeof o == type) ||
                (type == "null" && o == null) ||
                (type == "array" && Array.isArray && Array.isArray(o)) ||
                lowerCase.call(objectToString.call(o).slice(8, -1)) == type;
    };

    R.setWindow = function (newwin) {
        win = newwin;
        doc = win.document;
    };
    // colour utilities
    var toHex = function (color) {
        if (R.vml) {
            // http://dean.edwards.name/weblog/2009/10/convert-any-colour-value-to-hex-in-msie/
            var trim = /^\s+|\s+$/g;
            toHex = cacher(function (color) {
                var bod;
                color = Str(color)[rp](trim, E);
                try {
                    var docum = new win.ActiveXObject("htmlfile");
                    docum.write("<body>");
                    docum.close();
                    bod = docum.body;
                } catch(e) {
                    bod = win.createPopup().document.body;
                }
                var range = bod.createTextRange();
                try {
                    bod.style.color = color;
                    var value = range.queryCommandValue("ForeColor");
                    value = ((value & 255) << 16) | (value & 65280) | ((value & 16711680) >>> 16);
                    return "#" + ("000000" + value[toString](16)).slice(-6);
                } catch(e) {
                    return "none";
                }
            });
        } else {
            var i = doc.createElement("i");
            i.title = "Rapha\xebl Colour Picker";
            i.style.display = "none";
            doc.body[appendChild](i);
            toHex = cacher(function (color) {
                i.style.color = color;
                return doc.defaultView.getComputedStyle(i, E).getPropertyValue("color");
            });
        }
        return toHex(color);
    },
    hsbtoString = function () {
        return "hsb(" + [this.h, this.s, this.b] + ")";
    },
    hsltoString = function () {
        return "hsl(" + [this.h, this.s, this.l] + ")";
    },
    rgbtoString = function () {
        return this.hex;
    };
    R.hsb2rgb = function (h, s, b) {
        if (R.is(h, "object") && "h" in h && "s" in h && "b" in h) {
            b = h.b;
            s = h.s;
            h = h.h;
        }
        return R.hsl2rgb(h, s, b / 2);
    };
    R.hsl2rgb = function (h, s, l) {
        if (R.is(h, "object") && "h" in h && "s" in h && "l" in h) {
            l = h.l;
            s = h.s;
            h = h.h;
        }
        var rgb = {},
            channels = ["r", "g", "b"],
            t2, t1, t3, r, g, b;
        if (!s) {
            rgb = {
                r: l,
                g: l,
                b: l
            };
        } else {
            if (l < .5) {
                t2 = l * (1 + s);
            } else {
                t2 = l + s - l * s;
            }
            t1 = 2 * l - t2;
            for (var i = 0, ii = channels.length; i < ii; i++) {
                t3 = h + 1 / 3 * -(i - 1);
                t3 < 0 && t3++;
                t3 > 1 && t3--;
                if (t3 * 6 < 1) {
                    rgb[channels[i]] = t1 + (t2 - t1) * 6 * t3;
                } else if (t3 * 2 < 1) {
                    rgb[channels[i]] = t2;
                } else if (t3 * 3 < 2) {
                    rgb[channels[i]] = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
                } else {
                    rgb[channels[i]] = t1;
                }
            }
        }
        rgb.r *= 255;
        rgb.g *= 255;
        rgb.b *= 255;
        r = (~~rgb.r)[toString](16);
        g = (~~rgb.g)[toString](16);
        b = (~~rgb.b)[toString](16);
        r = r[rp](rg, "0");
        g = g[rp](rg, "0");
        b = b[rp](rg, "0");
        rgb.hex = "#" + r + g + b;
        rgb.toString = rgbtoString;
        return rgb;
    };
    R.rgb2hsb = function (red, green, blue) {
        if (green == null && R.is(red, "object") && "r" in red && "g" in red && "b" in red) {
            blue = red.b;
            green = red.g;
            red = red.r;
        }
        if (green == null && R.is(red, string)) {
            var clr = R.getRGB(red);
            red = clr.r;
            green = clr.g;
            blue = clr.b;
        }
        if (red > 1 || green > 1 || blue > 1) {
            red /= 255;
            green /= 255;
            blue /= 255;
        }
        var max = mmax(red, green, blue),
            min = mmin(red, green, blue),
            hue,
            saturation,
            brightness = max;
        if (min == max) {
            return {h: 0, s: 0, b: max, toString: hsbtoString};
        } else {
            var delta = (max - min);
            saturation = delta / max;
            if (red == max) {
                hue = (green - blue) / delta;
            } else if (green == max) {
                hue = 2 + ((blue - red) / delta);
            } else {
                hue = 4 + ((red - green) / delta);
            }
            hue /= 6;
            hue < 0 && hue++;
            hue > 1 && hue--;
        }
        return {h: hue, s: saturation, b: brightness, toString: hsbtoString};
    };
    R.rgb2hsl = function (red, green, blue) {
        if (green == null && R.is(red, "object") && "r" in red && "g" in red && "b" in red) {
            blue = red.b;
            green = red.g;
            red = red.r;
        }
        if (green == null && R.is(red, string)) {
            var clr = R.getRGB(red);
            red = clr.r;
            green = clr.g;
            blue = clr.b;
        }
        if (red > 1 || green > 1 || blue > 1) {
            red /= 255;
            green /= 255;
            blue /= 255;
        }
        var max = mmax(red, green, blue),
            min = mmin(red, green, blue),
            h,
            s,
            l = (max + min) / 2,
            hsl;
        if (min == max) {
            hsl =  {h: 0, s: 0, l: l};
        } else {
            var delta = max - min;
            s = l < .5 ? delta / (max + min) : delta / (2 - max - min);
            if (red == max) {
                h = (green - blue) / delta;
            } else if (green == max) {
                h = 2 + (blue - red) / delta;
            } else {
                h = 4 + (red - green) / delta;
            }
            h /= 6;
            h < 0 && h++;
            h > 1 && h--;
            hsl = {h: h, s: s, l: l};
        }
        hsl.toString = hsltoString;
        return hsl;
    };
    var p2s = /,?([achlmqrstvxz]),?/gi,
        commaSpaces = /\s*,\s*/,
        hsrg = {hs: 1, rg: 1};
    R._path2string = function () {
        return this.join(",")[rp](p2s, "$1");
    };
    function cacher(f, scope, postprocessor) {
        function newf() {
            var arg = Array[proto].slice.call(arguments, 0),
                args = arg[join]("\u25ba"),
                cache = newf.cache = newf.cache || {},
                count = newf.count = newf.count || [];
            if (cache[has](args)) {
                return postprocessor ? postprocessor(cache[args]) : cache[args];
            }
            count[length] >= 1e3 && delete cache[count.shift()];
            count[push](args);
            cache[args] = f[apply](scope, arg);
            return postprocessor ? postprocessor(cache[args]) : cache[args];
        }
        return newf;
    }
 
    R.getRGB = cacher(function (colour) {
        if (!colour || !!((colour = Str(colour)).indexOf("-") + 1)) {
            return {r: -1, g: -1, b: -1, hex: "none", error: 1};
        }
        if (colour == "none") {
            return {r: -1, g: -1, b: -1, hex: "none"};
        }
        !(hsrg[has](colour.substring(0, 2)) || colour.charAt() == "#") && (colour = toHex(colour));
        var res,
            red,
            green,
            blue,
            opacity,
            t,
            rgb = colour.match(colourRegExp);
        if (rgb) {
            if (rgb[2]) {
                blue = toInt(rgb[2].substring(5), 16);
                green = toInt(rgb[2].substring(3, 5), 16);
                red = toInt(rgb[2].substring(1, 3), 16);
            }
            if (rgb[3]) {
                blue = toInt((t = rgb[3].charAt(3)) + t, 16);
                green = toInt((t = rgb[3].charAt(2)) + t, 16);
                red = toInt((t = rgb[3].charAt(1)) + t, 16);
            }
            if (rgb[4]) {
                rgb = rgb[4][split](commaSpaces);
                red = toFloat(rgb[0]);
                green = toFloat(rgb[1]);
                blue = toFloat(rgb[2]);
                opacity = toFloat(rgb[3]);
            }
            if (rgb[5]) {
                rgb = rgb[5][split](commaSpaces);
                red = toFloat(rgb[0]) * 2.55;
                green = toFloat(rgb[1]) * 2.55;
                blue = toFloat(rgb[2]) * 2.55;
                opacity = toFloat(rgb[3]);
            }
            if (rgb[6]) {
                rgb = rgb[6][split](commaSpaces);
                red = toFloat(rgb[0]);
                green = toFloat(rgb[1]);
                blue = toFloat(rgb[2]);
                (rgb[0].slice(-3) == "deg" || rgb[0].slice(-1) == "\xb0") && (red /= 360);
                return R.hsb2rgb(red, green, blue);
            }
            if (rgb[7]) {
                rgb = rgb[7][split](commaSpaces);
                red = toFloat(rgb[0]) * 2.55;
                green = toFloat(rgb[1]) * 2.55;
                blue = toFloat(rgb[2]) * 2.55;
                (rgb[0].slice(-3) == "deg" || rgb[0].slice(-1) == "\xb0") && (red /= 360 * 2.55);
                return R.hsb2rgb(red, green, blue);
            }
            if (rgb[8]) {
                rgb = rgb[8][split](commaSpaces);
                red = toFloat(rgb[0]);
                green = toFloat(rgb[1]);
                blue = toFloat(rgb[2]);
                (rgb[0].slice(-3) == "deg" || rgb[0].slice(-1) == "\xb0") && (red /= 360);
                return R.hsl2rgb(red, green, blue);
            }
            if (rgb[9]) {
                rgb = rgb[9][split](commaSpaces);
                red = toFloat(rgb[0]) * 2.55;
                green = toFloat(rgb[1]) * 2.55;
                blue = toFloat(rgb[2]) * 2.55;
                (rgb[0].slice(-3) == "deg" || rgb[0].slice(-1) == "\xb0") && (red /= 360 * 2.55);
                return R.hsl2rgb(red, green, blue);
            }
            rgb = {r: red, g: green, b: blue};
            var r = (~~red)[toString](16),
                g = (~~green)[toString](16),
                b = (~~blue)[toString](16);
            r = r[rp](rg, "0");
            g = g[rp](rg, "0");
            b = b[rp](rg, "0");
            rgb.hex = "#" + r + g + b;
            isFinite(toFloat(opacity)) && (rgb.o = opacity);
            return rgb;
        }
        return {r: -1, g: -1, b: -1, hex: "none", error: 1};
    }, R);
    R.getColor = function (value) {
        var start = this.getColor.start = this.getColor.start || {h: 0, s: 1, b: value || .75},
            rgb = this.hsb2rgb(start.h, start.s, start.b);
        start.h += .075;
        if (start.h > 1) {
            start.h = 0;
            start.s -= .2;
            start.s <= 0 && (this.getColor.start = {h: 0, s: 1, b: start.b});
        }
        return rgb.hex;
    };
    R.getColor.reset = function () {
        delete this.start;
    };
    // path utilities
    var pathCommand = /([achlmqstvz])[\s,]*((-?\d*\.?\d*(?:e[-+]?\d+)?\s*,?\s*)+)/ig,
        pathValues = /(-?\d*\.?\d*(?:e[-+]?\d+)?)\s*,?\s*/ig;
    R.parsePathString = cacher(function (pathString) {
        if (!pathString) {
            return null;
        }
        var paramCounts = {a: 7, c: 6, h: 1, l: 2, m: 2, q: 4, s: 4, t: 2, v: 1, z: 0},
            data = [];
        if (R.is(pathString, array) && R.is(pathString[0], array)) { // rough assumption
            data = pathClone(pathString);
        }
        if (!data[length]) {
            Str(pathString)[rp](pathCommand, function (a, b, c) {
                var params = [],
                    name = lowerCase.call(b);
                c[rp](pathValues, function (a, b) {
                    b && params[push](+b);
                });
                if (name == "m" && params[length] > 2) {
                    data[push]([b][concat](params.splice(0, 2)));
                    name = "l";
                    b = b == "m" ? "l" : "L";
                }
                while (params[length] >= paramCounts[name]) {
                    data[push]([b][concat](params.splice(0, paramCounts[name])));
                    if (!paramCounts[name]) {
                        break;
                    }
                }
            });
        }
        data[toString] = R._path2string;
        return data;
    });
    R.findDotsAtSegment = function (p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t) {
        var t1 = 1 - t,
            x = pow(t1, 3) * p1x + pow(t1, 2) * 3 * t * c1x + t1 * 3 * t * t * c2x + pow(t, 3) * p2x,
            y = pow(t1, 3) * p1y + pow(t1, 2) * 3 * t * c1y + t1 * 3 * t * t * c2y + pow(t, 3) * p2y,
            mx = p1x + 2 * t * (c1x - p1x) + t * t * (c2x - 2 * c1x + p1x),
            my = p1y + 2 * t * (c1y - p1y) + t * t * (c2y - 2 * c1y + p1y),
            nx = c1x + 2 * t * (c2x - c1x) + t * t * (p2x - 2 * c2x + c1x),
            ny = c1y + 2 * t * (c2y - c1y) + t * t * (p2y - 2 * c2y + c1y),
            ax = (1 - t) * p1x + t * c1x,
            ay = (1 - t) * p1y + t * c1y,
            cx = (1 - t) * c2x + t * p2x,
            cy = (1 - t) * c2y + t * p2y,
            alpha = (90 - math.atan((mx - nx) / (my - ny)) * 180 / math.PI);
        (mx > nx || my < ny) && (alpha += 180);
        return {x: x, y: y, m: {x: mx, y: my}, n: {x: nx, y: ny}, start: {x: ax, y: ay}, end: {x: cx, y: cy}, alpha: alpha};
    };
    var pathDimensions = cacher(function (path) {
        if (!path) {
            return {x: 0, y: 0, width: 0, height: 0};
        }
        path = path2curve(path);
        var x = 0, 
            y = 0,
            X = [],
            Y = [],
            p;
        for (var i = 0, ii = path[length]; i < ii; i++) {
            p = path[i];
            if (p[0] == "M") {
                x = p[1];
                y = p[2];
                X[push](x);
                Y[push](y);
            } else {
                var dim = curveDim(x, y, p[1], p[2], p[3], p[4], p[5], p[6]);
                X = X[concat](dim.min.x, dim.max.x);
                Y = Y[concat](dim.min.y, dim.max.y);
                x = p[5];
                y = p[6];
            }
        }
        var xmin = mmin[apply](0, X),
            ymin = mmin[apply](0, Y);
        return {
            x: xmin,
            y: ymin,
            width: mmax[apply](0, X) - xmin,
            height: mmax[apply](0, Y) - ymin
        };
    }),
        pathClone = function (pathArray) {
            var res = [];
            if (!R.is(pathArray, array) || !R.is(pathArray && pathArray[0], array)) { // rough assumption
                pathArray = R.parsePathString(pathArray);
            }
            for (var i = 0, ii = pathArray[length]; i < ii; i++) {
                res[i] = [];
                for (var j = 0, jj = pathArray[i][length]; j < jj; j++) {
                    res[i][j] = pathArray[i][j];
                }
            }
            res[toString] = R._path2string;
            return res;
        },
        pathToRelative = cacher(function (pathArray) {
            if (!R.is(pathArray, array) || !R.is(pathArray && pathArray[0], array)) { // rough assumption
                pathArray = R.parsePathString(pathArray);
            }
            var res = [],
                x = 0,
                y = 0,
                mx = 0,
                my = 0,
                start = 0;
            if (pathArray[0][0] == "M") {
                x = pathArray[0][1];
                y = pathArray[0][2];
                mx = x;
                my = y;
                start++;
                res[push](["M", x, y]);
            }
            for (var i = start, ii = pathArray[length]; i < ii; i++) {
                var r = res[i] = [],
                    pa = pathArray[i];
                if (pa[0] != lowerCase.call(pa[0])) {
                    r[0] = lowerCase.call(pa[0]);
                    switch (r[0]) {
                        case "a":
                            r[1] = pa[1];
                            r[2] = pa[2];
                            r[3] = pa[3];
                            r[4] = pa[4];
                            r[5] = pa[5];
                            r[6] = +(pa[6] - x).toFixed(3);
                            r[7] = +(pa[7] - y).toFixed(3);
                            break;
                        case "v":
                            r[1] = +(pa[1] - y).toFixed(3);
                            break;
                        case "m":
                            mx = pa[1];
                            my = pa[2];
                        default:
                            for (var j = 1, jj = pa[length]; j < jj; j++) {
                                r[j] = +(pa[j] - ((j % 2) ? x : y)).toFixed(3);
                            }
                    }
                } else {
                    r = res[i] = [];
                    if (pa[0] == "m") {
                        mx = pa[1] + x;
                        my = pa[2] + y;
                    }
                    for (var k = 0, kk = pa[length]; k < kk; k++) {
                        res[i][k] = pa[k];
                    }
                }
                var len = res[i][length];
                switch (res[i][0]) {
                    case "z":
                        x = mx;
                        y = my;
                        break;
                    case "h":
                        x += +res[i][len - 1];
                        break;
                    case "v":
                        y += +res[i][len - 1];
                        break;
                    default:
                        x += +res[i][len - 2];
                        y += +res[i][len - 1];
                }
            }
            res[toString] = R._path2string;
            return res;
        }, 0, pathClone),
        pathToAbsolute = cacher(function (pathArray) {
            if (!R.is(pathArray, array) || !R.is(pathArray && pathArray[0], array)) { // rough assumption
                pathArray = R.parsePathString(pathArray);
            }
            var res = [],
                x = 0,
                y = 0,
                mx = 0,
                my = 0,
                start = 0;
            if (pathArray[0][0] == "M") {
                x = +pathArray[0][1];
                y = +pathArray[0][2];
                mx = x;
                my = y;
                start++;
                res[0] = ["M", x, y];
            }
            for (var i = start, ii = pathArray[length]; i < ii; i++) {
                var r = res[i] = [],
                    pa = pathArray[i];
                if (pa[0] != upperCase.call(pa[0])) {
                    r[0] = upperCase.call(pa[0]);
                    switch (r[0]) {
                        case "A":
                            r[1] = pa[1];
                            r[2] = pa[2];
                            r[3] = pa[3];
                            r[4] = pa[4];
                            r[5] = pa[5];
                            r[6] = +(pa[6] + x);
                            r[7] = +(pa[7] + y);
                            break;
                        case "V":
                            r[1] = +pa[1] + y;
                            break;
                        case "H":
                            r[1] = +pa[1] + x;
                            break;
                        case "M":
                            mx = +pa[1] + x;
                            my = +pa[2] + y;
                        default:
                            for (var j = 1, jj = pa[length]; j < jj; j++) {
                                r[j] = +pa[j] + ((j % 2) ? x : y);
                            }
                    }
                } else {
                    for (var k = 0, kk = pa[length]; k < kk; k++) {
                        res[i][k] = pa[k];
                    }
                }
                switch (r[0]) {
                    case "Z":
                        x = mx;
                        y = my;
                        break;
                    case "H":
                        x = r[1];
                        break;
                    case "V":
                        y = r[1];
                        break;
                    case "M":
                        mx = res[i][res[i][length] - 2];
                        my = res[i][res[i][length] - 1];
                    default:
                        x = res[i][res[i][length] - 2];
                        y = res[i][res[i][length] - 1];
                }
            }
            res[toString] = R._path2string;
            return res;
        }, null, pathClone),
        l2c = function (x1, y1, x2, y2) {
            return [x1, y1, x2, y2, x2, y2];
        },
        q2c = function (x1, y1, ax, ay, x2, y2) {
            var _13 = 1 / 3,
                _23 = 2 / 3;
            return [
                    _13 * x1 + _23 * ax,
                    _13 * y1 + _23 * ay,
                    _13 * x2 + _23 * ax,
                    _13 * y2 + _23 * ay,
                    x2,
                    y2
                ];
        },
        a2c = function (x1, y1, rx, ry, angle, large_arc_flag, sweep_flag, x2, y2, recursive) {
            // for more information of where this math came from visit:
            // http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
            var PI = math.PI,
                _120 = PI * 120 / 180,
                rad = PI / 180 * (+angle || 0),
                res = [],
                xy,
                rotate = cacher(function (x, y, rad) {
                    var X = x * math.cos(rad) - y * math.sin(rad),
                        Y = x * math.sin(rad) + y * math.cos(rad);
                    return {x: X, y: Y};
                });
            if (!recursive) {
                xy = rotate(x1, y1, -rad);
                x1 = xy.x;
                y1 = xy.y;
                xy = rotate(x2, y2, -rad);
                x2 = xy.x;
                y2 = xy.y;
                var cos = math.cos(PI / 180 * angle),
                    sin = math.sin(PI / 180 * angle),
                    x = (x1 - x2) / 2,
                    y = (y1 - y2) / 2;
                var h = (x * x) / (rx * rx) + (y * y) / (ry * ry);
                if (h > 1) {
                    h = math.sqrt(h);
                    rx = h * rx;
                    ry = h * ry;
                }
                var rx2 = rx * rx,
                    ry2 = ry * ry,
                    k = (large_arc_flag == sweep_flag ? -1 : 1) *
                        math.sqrt(math.abs((rx2 * ry2 - rx2 * y * y - ry2 * x * x) / (rx2 * y * y + ry2 * x * x))),
                    cx = k * rx * y / ry + (x1 + x2) / 2,
                    cy = k * -ry * x / rx + (y1 + y2) / 2,
                    f1 = math.asin(((y1 - cy) / ry).toFixed(7)),
                    f2 = math.asin(((y2 - cy) / ry).toFixed(7));

                f1 = x1 < cx ? PI - f1 : f1;
                f2 = x2 < cx ? PI - f2 : f2;
                f1 < 0 && (f1 = PI * 2 + f1);
                f2 < 0 && (f2 = PI * 2 + f2);
                if (sweep_flag && f1 > f2) {
                    f1 = f1 - PI * 2;
                }
                if (!sweep_flag && f2 > f1) {
                    f2 = f2 - PI * 2;
                }
            } else {
                f1 = recursive[0];
                f2 = recursive[1];
                cx = recursive[2];
                cy = recursive[3];
            }
            var df = f2 - f1;
            if (math.abs(df) > _120) {
                var f2old = f2,
                    x2old = x2,
                    y2old = y2;
                f2 = f1 + _120 * (sweep_flag && f2 > f1 ? 1 : -1);
                x2 = cx + rx * math.cos(f2);
                y2 = cy + ry * math.sin(f2);
                res = a2c(x2, y2, rx, ry, angle, 0, sweep_flag, x2old, y2old, [f2, f2old, cx, cy]);
            }
            df = f2 - f1;
            var c1 = math.cos(f1),
                s1 = math.sin(f1),
                c2 = math.cos(f2),
                s2 = math.sin(f2),
                t = math.tan(df / 4),
                hx = 4 / 3 * rx * t,
                hy = 4 / 3 * ry * t,
                m1 = [x1, y1],
                m2 = [x1 + hx * s1, y1 - hy * c1],
                m3 = [x2 + hx * s2, y2 - hy * c2],
                m4 = [x2, y2];
            m2[0] = 2 * m1[0] - m2[0];
            m2[1] = 2 * m1[1] - m2[1];
            if (recursive) {
                return [m2, m3, m4][concat](res);
            } else {
                res = [m2, m3, m4][concat](res)[join]()[split](",");
                var newres = [];
                for (var i = 0, ii = res[length]; i < ii; i++) {
                    newres[i] = i % 2 ? rotate(res[i - 1], res[i], rad).y : rotate(res[i], res[i + 1], rad).x;
                }
                return newres;
            }
        },
        findDotAtSegment = function (p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t) {
            var t1 = 1 - t;
            return {
                x: pow(t1, 3) * p1x + pow(t1, 2) * 3 * t * c1x + t1 * 3 * t * t * c2x + pow(t, 3) * p2x,
                y: pow(t1, 3) * p1y + pow(t1, 2) * 3 * t * c1y + t1 * 3 * t * t * c2y + pow(t, 3) * p2y
            };
        },
        curveDim = cacher(function (p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y) {
            var a = (c2x - 2 * c1x + p1x) - (p2x - 2 * c2x + c1x),
                b = 2 * (c1x - p1x) - 2 * (c2x - c1x),
                c = p1x - c1x,
                t1 = (-b + math.sqrt(b * b - 4 * a * c)) / 2 / a,
                t2 = (-b - math.sqrt(b * b - 4 * a * c)) / 2 / a,
                y = [p1y, p2y],
                x = [p1x, p2x],
                dot;
            math.abs(t1) > 1e12 && (t1 = .5);
            math.abs(t2) > 1e12 && (t2 = .5);
            if (t1 > 0 && t1 < 1) {
                dot = findDotAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t1);
                x[push](dot.x);
                y[push](dot.y);
            }
            if (t2 > 0 && t2 < 1) {
                dot = findDotAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t2);
                x[push](dot.x);
                y[push](dot.y);
            }
            a = (c2y - 2 * c1y + p1y) - (p2y - 2 * c2y + c1y);
            b = 2 * (c1y - p1y) - 2 * (c2y - c1y);
            c = p1y - c1y;
            t1 = (-b + math.sqrt(b * b - 4 * a * c)) / 2 / a;
            t2 = (-b - math.sqrt(b * b - 4 * a * c)) / 2 / a;
            math.abs(t1) > 1e12 && (t1 = .5);
            math.abs(t2) > 1e12 && (t2 = .5);
            if (t1 > 0 && t1 < 1) {
                dot = findDotAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t1);
                x[push](dot.x);
                y[push](dot.y);
            }
            if (t2 > 0 && t2 < 1) {
                dot = findDotAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t2);
                x[push](dot.x);
                y[push](dot.y);
            }
            return {
                min: {x: mmin[apply](0, x), y: mmin[apply](0, y)},
                max: {x: mmax[apply](0, x), y: mmax[apply](0, y)}
            };
        }),
        path2curve = cacher(function (path, path2) {
            var p = pathToAbsolute(path),
                p2 = path2 && pathToAbsolute(path2),
                attrs = {x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null},
                attrs2 = {x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null},
                processPath = function (path, d) {
                    var nx, ny;
                    if (!path) {
                        return ["C", d.x, d.y, d.x, d.y, d.x, d.y];
                    }
                    !(path[0] in {T:1, Q:1}) && (d.qx = d.qy = null);
                    switch (path[0]) {
                        case "M":
                            d.X = path[1];
                            d.Y = path[2];
                            break;
                        case "A":
                            path = ["C"][concat](a2c[apply](0, [d.x, d.y][concat](path.slice(1))));
                            break;
                        case "S":
                            nx = d.x + (d.x - (d.bx || d.x));
                            ny = d.y + (d.y - (d.by || d.y));
                            path = ["C", nx, ny][concat](path.slice(1));
                            break;
                        case "T":
                            d.qx = d.x + (d.x - (d.qx || d.x));
                            d.qy = d.y + (d.y - (d.qy || d.y));
                            path = ["C"][concat](q2c(d.x, d.y, d.qx, d.qy, path[1], path[2]));
                            break;
                        case "Q":
                            d.qx = path[1];
                            d.qy = path[2];
                            path = ["C"][concat](q2c(d.x, d.y, path[1], path[2], path[3], path[4]));
                            break;
                        case "L":
                            path = ["C"][concat](l2c(d.x, d.y, path[1], path[2]));
                            break;
                        case "H":
                            path = ["C"][concat](l2c(d.x, d.y, path[1], d.y));
                            break;
                        case "V":
                            path = ["C"][concat](l2c(d.x, d.y, d.x, path[1]));
                            break;
                        case "Z":
                            path = ["C"][concat](l2c(d.x, d.y, d.X, d.Y));
                            break;
                    }
                    return path;
                },
                fixArc = function (pp, i) {
                    if (pp[i][length] > 7) {
                        pp[i].shift();
                        var pi = pp[i];
                        while (pi[length]) {
                            pp.splice(i++, 0, ["C"][concat](pi.splice(0, 6)));
                        }
                        pp.splice(i, 1);
                        ii = mmax(p[length], p2 && p2[length] || 0);
                    }
                },
                fixM = function (path1, path2, a1, a2, i) {
                    if (path1 && path2 && path1[i][0] == "M" && path2[i][0] != "M") {
                        path2.splice(i, 0, ["M", a2.x, a2.y]);
                        a1.bx = 0;
                        a1.by = 0;
                        a1.x = path1[i][1];
                        a1.y = path1[i][2];
                        ii = mmax(p[length], p2 && p2[length] || 0);
                    }
                };
            for (var i = 0, ii = mmax(p[length], p2 && p2[length] || 0); i < ii; i++) {
                p[i] = processPath(p[i], attrs);
                fixArc(p, i);
                p2 && (p2[i] = processPath(p2[i], attrs2));
                p2 && fixArc(p2, i);
                fixM(p, p2, attrs, attrs2, i);
                fixM(p2, p, attrs2, attrs, i);
                var seg = p[i],
                    seg2 = p2 && p2[i],
                    seglen = seg[length],
                    seg2len = p2 && seg2[length];
                attrs.x = seg[seglen - 2];
                attrs.y = seg[seglen - 1];
                attrs.bx = toFloat(seg[seglen - 4]) || attrs.x;
                attrs.by = toFloat(seg[seglen - 3]) || attrs.y;
                attrs2.bx = p2 && (toFloat(seg2[seg2len - 4]) || attrs2.x);
                attrs2.by = p2 && (toFloat(seg2[seg2len - 3]) || attrs2.y);
                attrs2.x = p2 && seg2[seg2len - 2];
                attrs2.y = p2 && seg2[seg2len - 1];
            }
            return p2 ? [p, p2] : p;
        }, null, pathClone),
        parseDots = cacher(function (gradient) {
            var dots = [];
            for (var i = 0, ii = gradient[length]; i < ii; i++) {
                var dot = {},
                    par = gradient[i].match(/^([^:]*):?([\d\.]*)/);
                dot.color = R.getRGB(par[1]);
                if (dot.color.error) {
                    return null;
                }
                dot.color = dot.color.hex;
                par[2] && (dot.offset = par[2] + "%");
                dots[push](dot);
            }
            for (i = 1, ii = dots[length] - 1; i < ii; i++) {
                if (!dots[i].offset) {
                    var start = toFloat(dots[i - 1].offset || 0),
                        end = 0;
                    for (var j = i + 1; j < ii; j++) {
                        if (dots[j].offset) {
                            end = dots[j].offset;
                            break;
                        }
                    }
                    if (!end) {
                        end = 100;
                        j = ii;
                    }
                    end = toFloat(end);
                    var d = (end - start) / (j - i + 1);
                    for (; i < j; i++) {
                        start += d;
                        dots[i].offset = start + "%";
                    }
                }
            }
            return dots;
        }),
        getContainer = function (x, y, w, h) {
            var container;
            if (R.is(x, string) || R.is(x, "object")) {
                container = R.is(x, string) ? doc.getElementById(x) : x;
                if (container.tagName) {
                    if (y == null) {
                        return {
                            container: container,
                            width: container.style.pixelWidth || container.offsetWidth,
                            height: container.style.pixelHeight || container.offsetHeight
                        };
                    } else {
                        return {container: container, width: y, height: w};
                    }
                }
            } else {
                return {container: 1, x: x, y: y, width: w, height: h};
            }
        },
        plugins = function (con, add) {
            var that = this;
            for (var prop in add) {
                if (add[has](prop) && !(prop in con)) {
                    switch (typeof add[prop]) {
                        case "function":
                            (function (f) {
                                con[prop] = con === that ? f : function () { return f[apply](that, arguments); };
                            })(add[prop]);
                        break;
                        case "object":
                            con[prop] = con[prop] || {};
                            plugins.call(this, con[prop], add[prop]);
                        break;
                        default:
                            con[prop] = add[prop];
                        break;
                    }
                }
            }
        },
        tear = function (el, paper) {
            el == paper.top && (paper.top = el.prev);
            el == paper.bottom && (paper.bottom = el.next);
            el.next && (el.next.prev = el.prev);
            el.prev && (el.prev.next = el.next);
        },
        tofront = function (el, paper) {
            if (paper.top === el) {
                return;
            }
            tear(el, paper);
            el.next = null;
            el.prev = paper.top;
            paper.top.next = el;
            paper.top = el;
        },
        toback = function (el, paper) {
            if (paper.bottom === el) {
                return;
            }
            tear(el, paper);
            el.next = paper.bottom;
            el.prev = null;
            paper.bottom.prev = el;
            paper.bottom = el;
        },
        insertafter = function (el, el2, paper) {
            tear(el, paper);
            el2 == paper.top && (paper.top = el);
            el2.next && (el2.next.prev = el);
            el.next = el2.next;
            el.prev = el2;
            el2.next = el;
        },
        insertbefore = function (el, el2, paper) {
            tear(el, paper);
            el2 == paper.bottom && (paper.bottom = el);
            el2.prev && (el2.prev.next = el);
            el.prev = el2.prev;
            el2.prev = el;
            el.next = el2;
        },
        removed = function (methodname) {
            return function () {
                throw new Error("Rapha\xebl: you are calling to method \u201c" + methodname + "\u201d of removed object");
            };
        },
        radial_gradient = /^r(?:\(([^,]+?)\s*,\s*([^\)]+?)\))?/;
    R.pathToRelative = pathToRelative;
    // SVG
    if (R.svg) {
        Paper[proto].svgns = "http://www.w3.org/2000/svg";
        Paper[proto].xlink = "http://www.w3.org/1999/xlink";
        round = function (num) {
            return +num + (~~num === num) * .5;
        };
        var $ = function (el, attr) {
            if (attr) {
                for (var key in attr) {
                    if (attr[has](key)) {
                        el[setAttribute](key, Str(attr[key]));
                    }
                }
            } else {
                el = doc.createElementNS(Paper[proto].svgns, el);
                el.style.webkitTapHighlightColor = "rgba(0,0,0,0)";
                return el;
            }
        };
        R[toString] = function () {
            return  "Your browser supports SVG.\nYou are running Rapha\xebl " + this.version;
        };
        var thePath = function (pathString, SVG) {
            var el = $("path");
            SVG.canvas && SVG.canvas[appendChild](el);
            var p = new Element(el, SVG);
            p.type = "path";
            setFillAndStroke(p, {fill: "none", stroke: "#000", path: pathString});
            return p;
        };
        var addGradientFill = function (o, gradient, SVG) {
            var type = "linear",
                fx = .5, fy = .5,
                s = o.style;
            gradient = Str(gradient)[rp](radial_gradient, function (all, _fx, _fy) {
                type = "radial";
                if (_fx && _fy) {
                    fx = toFloat(_fx);
                    fy = toFloat(_fy);
                    var dir = ((fy > .5) * 2 - 1);
                    pow(fx - .5, 2) + pow(fy - .5, 2) > .25 &&
                        (fy = math.sqrt(.25 - pow(fx - .5, 2)) * dir + .5) &&
                        fy != .5 &&
                        (fy = fy.toFixed(5) - 1e-5 * dir);
                }
                return E;
            });
            gradient = gradient[split](/\s*\-\s*/);
            if (type == "linear") {
                var angle = gradient.shift();
                angle = -toFloat(angle);
                if (isNaN(angle)) {
                    return null;
                }
                var vector = [0, 0, math.cos(angle * math.PI / 180), math.sin(angle * math.PI / 180)],
                    max = 1 / (mmax(math.abs(vector[2]), math.abs(vector[3])) || 1);
                vector[2] *= max;
                vector[3] *= max;
                if (vector[2] < 0) {
                    vector[0] = -vector[2];
                    vector[2] = 0;
                }
                if (vector[3] < 0) {
                    vector[1] = -vector[3];
                    vector[3] = 0;
                }
            }
            var dots = parseDots(gradient);
            if (!dots) {
                return null;
            }
            var id = o.getAttribute(fillString);
            id = id.match(/^url\(#(.*)\)$/);
            id && SVG.defs.removeChild(doc.getElementById(id[1]));
            
            var el = $(type + "Gradient");
            el.id = "r" + (R._id++)[toString](36);
            $(el, type == "radial" ? {fx: fx, fy: fy} : {x1: vector[0], y1: vector[1], x2: vector[2], y2: vector[3]});
            SVG.defs[appendChild](el);
            for (var i = 0, ii = dots[length]; i < ii; i++) {
                var stop = $("stop");
                $(stop, {
                    offset: dots[i].offset ? dots[i].offset : !i ? "0%" : "100%",
                    "stop-color": dots[i].color || "#fff"
                });
                el[appendChild](stop);
            }
            $(o, {
                fill: "url(#" + el.id + ")",
                opacity: 1,
                "fill-opacity": 1
            });
            s.fill = E;
            s.opacity = 1;
            s.fillOpacity = 1;
            return 1;
        };
        var updatePosition = function (o) {
            var bbox = o.getBBox();
            $(o.pattern, {patternTransform: R.format("translate({0},{1})", bbox.x, bbox.y)});
        };
        var setFillAndStroke = function (o, params) {
            var dasharray = {
                    "": [0],
                    "none": [0],
                    "-": [3, 1],
                    ".": [1, 1],
                    "-.": [3, 1, 1, 1],
                    "-..": [3, 1, 1, 1, 1, 1],
                    ". ": [1, 3],
                    "- ": [4, 3],
                    "--": [8, 3],
                    "- .": [4, 3, 1, 3],
                    "--.": [8, 3, 1, 3],
                    "--..": [8, 3, 1, 3, 1, 3]
                },
                node = o.node,
                attrs = o.attrs,
                rot = o.rotate(),
                addDashes = function (o, value) {
                    value = dasharray[lowerCase.call(value)];
                    if (value) {
                        var width = o.attrs["stroke-width"] || "1",
                            butt = {round: width, square: width, butt: 0}[o.attrs["stroke-linecap"] || params["stroke-linecap"]] || 0,
                            dashes = [];
                        var i = value[length];
                        while (i--) {
                            dashes[i] = value[i] * width + ((i % 2) ? 1 : -1) * butt;
                        }
                        $(node, {"stroke-dasharray": dashes[join](",")});
                    }
                };
            params[has]("rotation") && (rot = params.rotation);
            var rotxy = Str(rot)[split](separator);
            if (!(rotxy.length - 1)) {
                rotxy = null;
            } else {
                rotxy[1] = +rotxy[1];
                rotxy[2] = +rotxy[2];
            }
            toFloat(rot) && o.rotate(0, true);
            for (var att in params) {
                if (params[has](att)) {
                    if (!availableAttrs[has](att)) {
                        continue;
                    }
                    var value = params[att];
                    attrs[att] = value;
                    switch (att) {
                        case "blur":
                            o.blur(value);
                            break;
                        case "rotation":
                            o.rotate(value, true);
                            break;
                        case "href":
                        case "title":
                        case "target":
                            var pn = node.parentNode;
                            if (lowerCase.call(pn.tagName) != "a") {
                                var hl = $("a");
                                pn.insertBefore(hl, node);
                                hl[appendChild](node);
                                pn = hl;
                            }
                            pn.setAttributeNS(o.paper.xlink, att, value);
                            break;
                        case "cursor":
                            node.style.cursor = value;
                            break;
                        case "clip-rect":
                            var rect = Str(value)[split](separator);
                            if (rect[length] == 4) {
                                o.clip && o.clip.parentNode.parentNode.removeChild(o.clip.parentNode);
                                var el = $("clipPath"),
                                    rc = $("rect");
                                el.id = "r" + (R._id++)[toString](36);
                                $(rc, {
                                    x: rect[0],
                                    y: rect[1],
                                    width: rect[2],
                                    height: rect[3]
                                });
                                el[appendChild](rc);
                                o.paper.defs[appendChild](el);
                                $(node, {"clip-path": "url(#" + el.id + ")"});
                                o.clip = rc;
                            }
                            if (!value) {
                                var clip = doc.getElementById(node.getAttribute("clip-path")[rp](/(^url\(#|\)$)/g, E));
                                clip && clip.parentNode.removeChild(clip);
                                $(node, {"clip-path": E});
                                delete o.clip;
                            }
                        break;
                        case "path":
                            if (o.type == "path") {
                                $(node, {d: value ? attrs.path = pathToAbsolute(value) : "M0,0"});
                            }
                            break;
                        case "width":
                            node[setAttribute](att, value);
                            if (attrs.fx) {
                                att = "x";
                                value = attrs.x;
                            } else {
                                break;
                            }
                        case "x":
                            if (attrs.fx) {
                                value = -attrs.x - (attrs.width || 0);
                            }
                        case "rx":
                            if (att == "rx" && o.type == "rect") {
                                break;
                            }
                        case "cx":
                            rotxy && (att == "x" || att == "cx") && (rotxy[1] += value - attrs[att]);
                            node[setAttribute](att, value);
                            o.pattern && updatePosition(o);
                            break;
                        case "height":
                            node[setAttribute](att, value);
                            if (attrs.fy) {
                                att = "y";
                                value = attrs.y;
                            } else {
                                break;
                            }
                        case "y":
                            if (attrs.fy) {
                                value = -attrs.y - (attrs.height || 0);
                            }
                        case "ry":
                            if (att == "ry" && o.type == "rect") {
                                break;
                            }
                        case "cy":
                            rotxy && (att == "y" || att == "cy") && (rotxy[2] += value - attrs[att]);
                            node[setAttribute](att, value);
                            o.pattern && updatePosition(o);
                            break;
                        case "r":
                            if (o.type == "rect") {
                                $(node, {rx: value, ry: value});
                            } else {
                                node[setAttribute](att, value);
                            }
                            break;
                        case "src":
                            if (o.type == "image") {
                                node.setAttributeNS(o.paper.xlink, "href", value);
                            }
                            break;
                        case "stroke-width":
                            node.style.strokeWidth = value;
                            // Need following line for Firefox
                            node[setAttribute](att, value);
                            if (attrs["stroke-dasharray"]) {
                                addDashes(o, attrs["stroke-dasharray"]);
                            }
                            break;
                        case "stroke-dasharray":
                            addDashes(o, value);
                            break;
                        case "translation":
                            var xy = Str(value)[split](separator);
                            xy[0] = +xy[0] || 0;
                            xy[1] = +xy[1] || 0;
                            if (rotxy) {
                                rotxy[1] += xy[0];
                                rotxy[2] += xy[1];
                            }
                            translate.call(o, xy[0], xy[1]);
                            break;
                        case "scale":
                            xy = Str(value)[split](separator);
                            o.scale(+xy[0] || 1, +xy[1] || +xy[0] || 1, isNaN(toFloat(xy[2])) ? null : +xy[2], isNaN(toFloat(xy[3])) ? null : +xy[3]);
                            break;
                        case fillString:
                            var isURL = Str(value).match(ISURL);
                            if (isURL) {
                                el = $("pattern");
                                var ig = $("image");
                                el.id = "r" + (R._id++)[toString](36);
                                $(el, {x: 0, y: 0, patternUnits: "userSpaceOnUse", height: 1, width: 1});
                                $(ig, {x: 0, y: 0});
                                ig.setAttributeNS(o.paper.xlink, "href", isURL[1]);
                                el[appendChild](ig);
 
                                var img = doc.createElement("img");
                                img.style.cssText = "position:absolute;left:-9999em;top-9999em";
                                img.onload = function () {
                                    $(el, {width: this.offsetWidth, height: this.offsetHeight});
                                    $(ig, {width: this.offsetWidth, height: this.offsetHeight});
                                    doc.body.removeChild(this);
                                    o.paper.safari();
                                };
                                doc.body[appendChild](img);
                                img.src = isURL[1];
                                o.paper.defs[appendChild](el);
                                node.style.fill = "url(#" + el.id + ")";
                                $(node, {fill: "url(#" + el.id + ")"});
                                o.pattern = el;
                                o.pattern && updatePosition(o);
                                break;
                            }
                            var clr = R.getRGB(value);
                            if (!clr.error) {
                                delete params.gradient;
                                delete attrs.gradient;
                                !R.is(attrs.opacity, "undefined") &&
                                    R.is(params.opacity, "undefined") &&
                                    $(node, {opacity: attrs.opacity});
                                !R.is(attrs["fill-opacity"], "undefined") &&
                                    R.is(params["fill-opacity"], "undefined") &&
                                    $(node, {"fill-opacity": attrs["fill-opacity"]});
                            } else if ((({circle: 1, ellipse: 1})[has](o.type) || Str(value).charAt() != "r") && addGradientFill(node, value, o.paper)) {
                                attrs.gradient = value;
                                attrs.fill = "none";
                                break;
                            }
                            clr[has]("o") && $(node, {"fill-opacity": clr.o / 100});
                        case "stroke":
                            clr = R.getRGB(value);
                            node[setAttribute](att, clr.hex);
                            att == "stroke" && clr[has]("o") && $(node, {"stroke-opacity": clr.o / 100});
                            break;
                        case "gradient":
                            (({circle: 1, ellipse: 1})[has](o.type) || Str(value).charAt() != "r") && addGradientFill(node, value, o.paper);
                            break;
                        case "opacity":
                        case "fill-opacity":
                            if (attrs.gradient) {
                                var gradient = doc.getElementById(node.getAttribute(fillString)[rp](/^url\(#|\)$/g, E));
                                if (gradient) {
                                    var stops = gradient.getElementsByTagName("stop");
                                    stops[stops[length] - 1][setAttribute]("stop-opacity", value);
                                }
                                break;
                            }
                        default:
                            att == "font-size" && (value = toInt(value, 10) + "px");
                            var cssrule = att[rp](/(\-.)/g, function (w) {
                                return upperCase.call(w.substring(1));
                            });
                            node.style[cssrule] = value;
                            // Need following line for Firefox
                            node[setAttribute](att, value);
                            break;
                    }
                }
            }
            
            tuneText(o, params);
            if (rotxy) {
                o.rotate(rotxy.join(S));
            } else {
                toFloat(rot) && o.rotate(rot, true);
            }
        };
        var leading = 1.2,
        tuneText = function (el, params) {
            if (el.type != "text" || !(params[has]("text") || params[has]("font") || params[has]("font-size") || params[has]("x") || params[has]("y"))) {
                return;
            }
            var a = el.attrs,
                node = el.node,
                fontSize = node.firstChild ? toInt(doc.defaultView.getComputedStyle(node.firstChild, E).getPropertyValue("font-size"), 10) : 10;
 
            if (params[has]("text")) {
                a.text = params.text;
                while (node.firstChild) {
                    node.removeChild(node.firstChild);
                }
                var texts = Str(params.text)[split]("\n");
                for (var i = 0, ii = texts[length]; i < ii; i++) if (texts[i]) {
                    var tspan = $("tspan");
                    i && $(tspan, {dy: fontSize * leading, x: a.x});
                    tspan[appendChild](doc.createTextNode(texts[i]));
                    node[appendChild](tspan);
                }
            } else {
                texts = node.getElementsByTagName("tspan");
                for (i = 0, ii = texts[length]; i < ii; i++) {
                    i && $(texts[i], {dy: fontSize * leading, x: a.x});
                }
            }
            $(node, {y: a.y});
            var bb = el.getBBox(),
                dif = a.y - (bb.y + bb.height / 2);
            dif && isFinite(dif) && $(node, {y: a.y + dif});
        },
        Element = function (node, svg) {
            var X = 0,
                Y = 0;
            this[0] = node;
            this.id = R._oid++;
            this.node = node;
            node.raphael = this;
            this.paper = svg;
            this.attrs = this.attrs || {};
            this.transformations = []; // rotate, translate, scale
            this._ = {
                tx: 0,
                ty: 0,
                rt: {deg: 0, cx: 0, cy: 0},
                sx: 1,
                sy: 1
            };
            !svg.bottom && (svg.bottom = this);
            this.prev = svg.top;
            svg.top && (svg.top.next = this);
            svg.top = this;
            this.next = null;
        };
        Element[proto].rotate = function (deg, cx, cy) {
            if (this.removed) {
                return this;
            }
            if (deg == null) {
                if (this._.rt.cx) {
                    return [this._.rt.deg, this._.rt.cx, this._.rt.cy][join](S);
                }
                return this._.rt.deg;
            }
            var bbox = this.getBBox();
            deg = Str(deg)[split](separator);
            if (deg[length] - 1) {
                cx = toFloat(deg[1]);
                cy = toFloat(deg[2]);
            }
            deg = toFloat(deg[0]);
            if (cx != null) {
                this._.rt.deg = deg;
            } else {
                this._.rt.deg += deg;
            }
            (cy == null) && (cx = null);
            this._.rt.cx = cx;
            this._.rt.cy = cy;
            cx = cx == null ? bbox.x + bbox.width / 2 : cx;
            cy = cy == null ? bbox.y + bbox.height / 2 : cy;
            if (this._.rt.deg) {
                this.transformations[0] = R.format("rotate({0} {1} {2})", this._.rt.deg, cx, cy);
                this.clip && $(this.clip, {transform: R.format("rotate({0} {1} {2})", -this._.rt.deg, cx, cy)});
            } else {
                this.transformations[0] = E;
                this.clip && $(this.clip, {transform: E});
            }
            $(this.node, {transform: this.transformations[join](S)});
            return this;
        };
        Element[proto].hide = function () {
            !this.removed && (this.node.style.display = "none");
            return this;
        };
        Element[proto].show = function () {
            !this.removed && (this.node.style.display = "");
            return this;
        };
        Element[proto].remove = function () {
            if (this.removed) {
                return;
            }
            tear(this, this.paper);
            this.node.parentNode.removeChild(this.node);
            for (var i in this) {
                delete this[i];
            }
            this.removed = true;
        };
        Element[proto].getBBox = function () {
            if (this.removed) {
                return this;
            }
            if (this.type == "path") {
                return pathDimensions(this.attrs.path);
            }
            if (this.node.style.display == "none") {
                this.show();
                var hide = true;
            }
            var bbox = {};
            try {
                bbox = this.node.getBBox();
            } catch(e) {
                // Firefox 3.0.x plays badly here
            } finally {
                bbox = bbox || {};
            }
            if (this.type == "text") {
                bbox = {x: bbox.x, y: Infinity, width: 0, height: 0};
                for (var i = 0, ii = this.node.getNumberOfChars(); i < ii; i++) {
                    var bb = this.node.getExtentOfChar(i);
                    (bb.y < bbox.y) && (bbox.y = bb.y);
                    (bb.y + bb.height - bbox.y > bbox.height) && (bbox.height = bb.y + bb.height - bbox.y);
                    (bb.x + bb.width - bbox.x > bbox.width) && (bbox.width = bb.x + bb.width - bbox.x);
                }
            }
            hide && this.hide();
            return bbox;
        };
        Element[proto].attr = function (name, value) {
            if (this.removed) {
                return this;
            }
            if (name == null) {
                var res = {};
                for (var i in this.attrs) if (this.attrs[has](i)) {
                    res[i] = this.attrs[i];
                }
                this._.rt.deg && (res.rotation = this.rotate());
                (this._.sx != 1 || this._.sy != 1) && (res.scale = this.scale());
                res.gradient && res.fill == "none" && (res.fill = res.gradient) && delete res.gradient;
                return res;
            }
            if (value == null && R.is(name, string)) {
                if (name == "translation") {
                    return translate.call(this);
                }
                if (name == "rotation") {
                    return this.rotate();
                }
                if (name == "scale") {
                    return this.scale();
                }
                if (name == fillString && this.attrs.fill == "none" && this.attrs.gradient) {
                    return this.attrs.gradient;
                }
                return this.attrs[name];
            }
            if (value == null && R.is(name, array)) {
                var values = {};
                for (var j = 0, jj = name.length; j < jj; j++) {
                    values[name[j]] = this.attr(name[j]);
                }
                return values;
            }
            if (value != null) {
                var params = {};
                params[name] = value;
                setFillAndStroke(this, params);
            } else if (name != null && R.is(name, "object")) {
                setFillAndStroke(this, name);
            }
            return this;
        };
        Element[proto].toFront = function () {
            if (this.removed) {
                return this;
            }
            this.node.parentNode[appendChild](this.node);
            var svg = this.paper;
            svg.top != this && tofront(this, svg);
            return this;
        };
        Element[proto].toBack = function () {
            if (this.removed) {
                return this;
            }
            if (this.node.parentNode.firstChild != this.node) {
                this.node.parentNode.insertBefore(this.node, this.node.parentNode.firstChild);
                toback(this, this.paper);
                var svg = this.paper;
            }
            return this;
        };
        Element[proto].insertAfter = function (element) {
            if (this.removed) {
                return this;
            }
            var node = element.node || element[element.length].node;
            if (node.nextSibling) {
                node.parentNode.insertBefore(this.node, node.nextSibling);
            } else {
                node.parentNode[appendChild](this.node);
            }
            insertafter(this, element, this.paper);
            return this;
        };
        Element[proto].insertBefore = function (element) {
            if (this.removed) {
                return this;
            }
            var node = element.node || element[0].node;
            node.parentNode.insertBefore(this.node, node);
            insertbefore(this, element, this.paper);
            return this;
        };
        Element[proto].blur = function (size) {
            // Experimental. No Safari support. Use it on your own risk.
            var t = this;
            if (+size !== 0) {
                var fltr = $("filter"),
                    blur = $("feGaussianBlur");
                t.attrs.blur = size;
                fltr.id = "r" + (R._id++)[toString](36);
                $(blur, {stdDeviation: +size || 1.5});
                fltr.appendChild(blur);
                t.paper.defs.appendChild(fltr);
                t._blur = fltr;
                $(t.node, {filter: "url(#" + fltr.id + ")"});
            } else {
                if (t._blur) {
                    t._blur.parentNode.removeChild(t._blur);
                    delete t._blur;
                    delete t.attrs.blur;
                }
                t.node.removeAttribute("filter");
            }
        };
        var theCircle = function (svg, x, y, r) {
            var el = $("circle");
            svg.canvas && svg.canvas[appendChild](el);
            var res = new Element(el, svg);
            res.attrs = {cx: x, cy: y, r: r, fill: "none", stroke: "#000"};
            res.type = "circle";
            $(el, res.attrs);
            return res;
        };
        var theRect = function (svg, x, y, w, h, r) {
            var el = $("rect");
            svg.canvas && svg.canvas[appendChild](el);
            var res = new Element(el, svg);
            res.attrs = {x: x, y: y, width: w, height: h, r: r || 0, rx: r || 0, ry: r || 0, fill: "none", stroke: "#000"};
            res.type = "rect";
            $(el, res.attrs);
            return res;
        };
        var theEllipse = function (svg, x, y, rx, ry) {
            var el = $("ellipse");
            svg.canvas && svg.canvas[appendChild](el);
            var res = new Element(el, svg);
            res.attrs = {cx: x, cy: y, rx: rx, ry: ry, fill: "none", stroke: "#000"};
            res.type = "ellipse";
            $(el, res.attrs);
            return res;
        };
        var theImage = function (svg, src, x, y, w, h) {
            var el = $("image");
            $(el, {x: x, y: y, width: w, height: h, preserveAspectRatio: "none"});
            el.setAttributeNS(svg.xlink, "href", src);
            svg.canvas && svg.canvas[appendChild](el);
            var res = new Element(el, svg);
            res.attrs = {x: x, y: y, width: w, height: h, src: src};
            res.type = "image";
            return res;
        };
        var theText = function (svg, x, y, text) {
            var el = $("text");
            $(el, {x: x, y: y, "text-anchor": "middle"});
            svg.canvas && svg.canvas[appendChild](el);
            var res = new Element(el, svg);
            res.attrs = {x: x, y: y, "text-anchor": "middle", text: text, font: availableAttrs.font, stroke: "none", fill: "#000"};
            res.type = "text";
            setFillAndStroke(res, res.attrs);
            return res;
        };
        var setSize = function (width, height) {
            this.width = width || this.width;
            this.height = height || this.height;
            this.canvas[setAttribute]("width", this.width);
            this.canvas[setAttribute]("height", this.height);
            return this;
        };
        var create = function () {
            var con = getContainer[apply](0, arguments),
                container = con && con.container,
                x = con.x,
                y = con.y,
                width = con.width,
                height = con.height;
            if (!container) {
                throw new Error("SVG container not found.");
            }
            var cnvs = $("svg");
            x = x || 0;
            y = y || 0;
            width = width || 512;
            height = height || 342;
            $(cnvs, {
                xmlns: "http://www.w3.org/2000/svg",
                version: 1.1,
                width: width,
                height: height
            });
            if (container == 1) {
                cnvs.style.cssText = "position:absolute;left:" + x + "px;top:" + y + "px";
                doc.body[appendChild](cnvs);
            } else {
                if (container.firstChild) {
                    container.insertBefore(cnvs, container.firstChild);
                } else {
                    container[appendChild](cnvs);
                }
            }
            container = new Paper;
            container.width = width;
            container.height = height;
            container.canvas = cnvs;
            plugins.call(container, container, R.fn);
            container.clear();
            return container;
        };
        Paper[proto].clear = function () {
            var c = this.canvas;
            while (c.firstChild) {
                c.removeChild(c.firstChild);
            }
            this.bottom = this.top = null;
            (this.desc = $("desc"))[appendChild](doc.createTextNode("Created with Rapha\xebl"));
            c[appendChild](this.desc);
            c[appendChild](this.defs = $("defs"));
        };
        Paper[proto].remove = function () {
            this.canvas.parentNode && this.canvas.parentNode.removeChild(this.canvas);
            for (var i in this) {
                this[i] = removed(i);
            }
        };
    }

    // VML
    if (R.vml) {
        var map = {M: "m", L: "l", C: "c", Z: "x", m: "t", l: "r", c: "v", z: "x"},
            bites = /([clmz]),?([^clmz]*)/gi,
            val = /-?[^,\s-]+/g,
            coordsize = 1e3 + S + 1e3,
            zoom = 10,
            pathlike = {path: 1, rect: 1},
            path2vml = function (path) {
                var total =  /[ahqstv]/ig,
                    command = pathToAbsolute;
                Str(path).match(total) && (command = path2curve);
                total = /[clmz]/g;
                if (command == pathToAbsolute && !Str(path).match(total)) {
                    var res = Str(path)[rp](bites, function (all, command, args) {
                        var vals = [],
                            isMove = lowerCase.call(command) == "m",
                            res = map[command];
                        args[rp](val, function (value) {
                            if (isMove && vals[length] == 2) {
                                res += vals + map[command == "m" ? "l" : "L"];
                                vals = [];
                            }
                            vals[push](round(value * zoom));
                        });
                        return res + vals;
                    });
                    return res;
                }
                var pa = command(path), p, r;
                res = [];
                for (var i = 0, ii = pa[length]; i < ii; i++) {
                    p = pa[i];
                    r = lowerCase.call(pa[i][0]);
                    r == "z" && (r = "x");
                    for (var j = 1, jj = p[length]; j < jj; j++) {
                        r += round(p[j] * zoom) + (j != jj - 1 ? "," : E);
                    }
                    res[push](r);
                }
                return res[join](S);
            };
        
        R[toString] = function () {
            return  "Your browser doesn\u2019t support SVG. Falling down to VML.\nYou are running Rapha\xebl " + this.version;
        };
        thePath = function (pathString, vml) {
            var g = createNode("group");
            g.style.cssText = "position:absolute;left:0;top:0;width:" + vml.width + "px;height:" + vml.height + "px";
            g.coordsize = vml.coordsize;
            g.coordorigin = vml.coordorigin;
            var el = createNode("shape"), ol = el.style;
            ol.width = vml.width + "px";
            ol.height = vml.height + "px";
            el.coordsize = coordsize;
            el.coordorigin = vml.coordorigin;
            g[appendChild](el);
            var p = new Element(el, g, vml),
                attr = {fill: "none", stroke: "#000"};
            pathString && (attr.path = pathString);
            p.isAbsolute = true;
            p.type = "path";
            p.path = [];
            p.Path = E;
            setFillAndStroke(p, attr);
            vml.canvas[appendChild](g);
            return p;
        };
        setFillAndStroke = function (o, params) {
            o.attrs = o.attrs || {};
            var node = o.node,
                a = o.attrs,
                s = node.style,
                xy,
                newpath = (params.x != a.x || params.y != a.y || params.width != a.width || params.height != a.height || params.r != a.r) && o.type == "rect",
                res = o;

            for (var par in params) if (params[has](par)) {
                a[par] = params[par];
            }
            if (newpath) {
                a.path = rectPath(a.x, a.y, a.width, a.height, a.r);
                o.X = a.x;
                o.Y = a.y;
                o.W = a.width;
                o.H = a.height;
            }
            params.href && (node.href = params.href);
            params.title && (node.title = params.title);
            params.target && (node.target = params.target);
            params.cursor && (s.cursor = params.cursor);
            "blur" in params && o.blur(params.blur);
            if (params.path && o.type == "path" || newpath) {
                    node.path = path2vml(a.path);
            }
            if (params.rotation != null) {
                o.rotate(params.rotation, true);
            }
            if (params.translation) {
                xy = Str(params.translation)[split](separator);
                translate.call(o, xy[0], xy[1]);
                if (o._.rt.cx != null) {
                    o._.rt.cx +=+ xy[0];
                    o._.rt.cy +=+ xy[1];
                    o.setBox(o.attrs, xy[0], xy[1]);
                }
            }
            if (params.scale) {
                xy = Str(params.scale)[split](separator);
                o.scale(+xy[0] || 1, +xy[1] || +xy[0] || 1, +xy[2] || null, +xy[3] || null);
            }
            if ("clip-rect" in params) {
                var rect = Str(params["clip-rect"])[split](separator);
                if (rect[length] == 4) {
                    rect[2] = +rect[2] + (+rect[0]);
                    rect[3] = +rect[3] + (+rect[1]);
                    var div = node.clipRect || doc.createElement("div"),
                        dstyle = div.style,
                        group = node.parentNode;
                    dstyle.clip = R.format("rect({1}px {2}px {3}px {0}px)", rect);
                    if (!node.clipRect) {
                        dstyle.position = "absolute";
                        dstyle.top = 0;
                        dstyle.left = 0;
                        dstyle.width = o.paper.width + "px";
                        dstyle.height = o.paper.height + "px";
                        group.parentNode.insertBefore(div, group);
                        div[appendChild](group);
                        node.clipRect = div;
                    }
                }
                if (!params["clip-rect"]) {
                    node.clipRect && (node.clipRect.style.clip = E);
                }
            }
            if (o.type == "image" && params.src) {
                node.src = params.src;
            }
            if (o.type == "image" && params.opacity) {
                node.filterOpacity = ms + ".Alpha(opacity=" + (params.opacity * 100) + ")";
                s.filter = (node.filterMatrix || E) + (node.filterOpacity || E);
            }
            params.font && (s.font = params.font);
            params["font-family"] && (s.fontFamily = '"' + params["font-family"][split](",")[0][rp](/^['"]+|['"]+$/g, E) + '"');
            params["font-size"] && (s.fontSize = params["font-size"]);
            params["font-weight"] && (s.fontWeight = params["font-weight"]);
            params["font-style"] && (s.fontStyle = params["font-style"]);
            if (params.opacity != null || 
                params["stroke-width"] != null ||
                params.fill != null ||
                params.stroke != null ||
                params["stroke-width"] != null ||
                params["stroke-opacity"] != null ||
                params["fill-opacity"] != null ||
                params["stroke-dasharray"] != null ||
                params["stroke-miterlimit"] != null ||
                params["stroke-linejoin"] != null ||
                params["stroke-linecap"] != null) {
                node = o.shape || node;
                var fill = (node.getElementsByTagName(fillString) && node.getElementsByTagName(fillString)[0]),
                    newfill = false;
                !fill && (newfill = fill = createNode(fillString));
                if ("fill-opacity" in params || "opacity" in params) {
                    var opacity = ((+a["fill-opacity"] + 1 || 2) - 1) * ((+a.opacity + 1 || 2) - 1) * ((+R.getRGB(params.fill).o + 1 || 2) - 1);
                    opacity < 0 && (opacity = 0);
                    opacity > 1 && (opacity = 1);
                    fill.opacity = opacity;
                }
                params.fill && (fill.on = true);
                if (fill.on == null || params.fill == "none") {
                    fill.on = false;
                }
                if (fill.on && params.fill) {
                    var isURL = params.fill.match(ISURL);
                    if (isURL) {
                        fill.src = isURL[1];
                        fill.type = "tile";
                    } else {
                        fill.color = R.getRGB(params.fill).hex;
                        fill.src = E;
                        fill.type = "solid";
                        if (R.getRGB(params.fill).error && (res.type in {circle: 1, ellipse: 1} || Str(params.fill).charAt() != "r") && addGradientFill(res, params.fill)) {
                            a.fill = "none";
                            a.gradient = params.fill;
                        }
                    }
                }
                newfill && node[appendChild](fill);
                var stroke = (node.getElementsByTagName("stroke") && node.getElementsByTagName("stroke")[0]),
                newstroke = false;
                !stroke && (newstroke = stroke = createNode("stroke"));
                if ((params.stroke && params.stroke != "none") ||
                    params["stroke-width"] ||
                    params["stroke-opacity"] != null ||
                    params["stroke-dasharray"] ||
                    params["stroke-miterlimit"] ||
                    params["stroke-linejoin"] ||
                    params["stroke-linecap"]) {
                    stroke.on = true;
                }
                (params.stroke == "none" || stroke.on == null || params.stroke == 0 || params["stroke-width"] == 0) && (stroke.on = false);
                var strokeColor = R.getRGB(params.stroke);
                stroke.on && params.stroke && (stroke.color = strokeColor.hex);
                opacity = ((+a["stroke-opacity"] + 1 || 2) - 1) * ((+a.opacity + 1 || 2) - 1) * ((+strokeColor.o + 1 || 2) - 1);
                var width = (toFloat(params["stroke-width"]) || 1) * .75;
                opacity < 0 && (opacity = 0);
                opacity > 1 && (opacity = 1);
                params["stroke-width"] == null && (width = a["stroke-width"]);
                params["stroke-width"] && (stroke.weight = width);
                width && width < 1 && (opacity *= width) && (stroke.weight = 1);
                stroke.opacity = opacity;
                
                params["stroke-linejoin"] && (stroke.joinstyle = params["stroke-linejoin"] || "miter");
                stroke.miterlimit = params["stroke-miterlimit"] || 8;
                params["stroke-linecap"] && (stroke.endcap = params["stroke-linecap"] == "butt" ? "flat" : params["stroke-linecap"] == "square" ? "square" : "round");
                if (params["stroke-dasharray"]) {
                    var dasharray = {
                        "-": "shortdash",
                        ".": "shortdot",
                        "-.": "shortdashdot",
                        "-..": "shortdashdotdot",
                        ". ": "dot",
                        "- ": "dash",
                        "--": "longdash",
                        "- .": "dashdot",
                        "--.": "longdashdot",
                        "--..": "longdashdotdot"
                    };
                    stroke.dashstyle = dasharray[has](params["stroke-dasharray"]) ? dasharray[params["stroke-dasharray"]] : E;
                }
                newstroke && node[appendChild](stroke);
            }
            if (res.type == "text") {
                s = res.paper.span.style;
                a.font && (s.font = a.font);
                a["font-family"] && (s.fontFamily = a["font-family"]);
                a["font-size"] && (s.fontSize = a["font-size"]);
                a["font-weight"] && (s.fontWeight = a["font-weight"]);
                a["font-style"] && (s.fontStyle = a["font-style"]);
                res.node.string && (res.paper.span.innerHTML = Str(res.node.string)[rp](/</g, "&#60;")[rp](/&/g, "&#38;")[rp](/\n/g, "<br>"));
                res.W = a.w = res.paper.span.offsetWidth;
                res.H = a.h = res.paper.span.offsetHeight;
                res.X = a.x;
                res.Y = a.y + round(res.H / 2);
 
                // text-anchor emulationm
                switch (a["text-anchor"]) {
                    case "start":
                        res.node.style["v-text-align"] = "left";
                        res.bbx = round(res.W / 2);
                    break;
                    case "end":
                        res.node.style["v-text-align"] = "right";
                        res.bbx = -round(res.W / 2);
                    break;
                    default:
                        res.node.style["v-text-align"] = "center";
                    break;
                }
            }
        };
        addGradientFill = function (o, gradient) {
            o.attrs = o.attrs || {};
            var attrs = o.attrs,
                fill,
                type = "linear",
                fxfy = ".5 .5";
            o.attrs.gradient = gradient;
            gradient = Str(gradient)[rp](radial_gradient, function (all, fx, fy) {
                type = "radial";
                if (fx && fy) {
                    fx = toFloat(fx);
                    fy = toFloat(fy);
                    pow(fx - .5, 2) + pow(fy - .5, 2) > .25 && (fy = math.sqrt(.25 - pow(fx - .5, 2)) * ((fy > .5) * 2 - 1) + .5);
                    fxfy = fx + S + fy;
                }
                return E;
            });
            gradient = gradient[split](/\s*\-\s*/);
            if (type == "linear") {
                var angle = gradient.shift();
                angle = -toFloat(angle);
                if (isNaN(angle)) {
                    return null;
                }
            }
            var dots = parseDots(gradient);
            if (!dots) {
                return null;
            }
            o = o.shape || o.node;
            fill = o.getElementsByTagName(fillString)[0] || createNode(fillString);
            !fill.parentNode && o.appendChild(fill);
            if (dots[length]) {
                fill.on = true;
                fill.method = "none";
                fill.color = dots[0].color;
                fill.color2 = dots[dots[length] - 1].color;
                var clrs = [];
                for (var i = 0, ii = dots[length]; i < ii; i++) {
                    dots[i].offset && clrs[push](dots[i].offset + S + dots[i].color);
                }
                fill.colors && (fill.colors.value = clrs[length] ? clrs[join]() : "0% " + fill.color);
                if (type == "radial") {
                    fill.type = "gradientradial";
                    fill.focus = "100%";
                    fill.focussize = fxfy;
                    fill.focusposition = fxfy;
                } else {
                    fill.type = "gradient";
                    fill.angle = (270 - angle) % 360;
                }
            }
            return 1;
        };
        Element = function (node, group, vml) {
            var Rotation = 0,
                RotX = 0,
                RotY = 0,
                Scale = 1;
            this[0] = node;
            this.id = R._oid++;
            this.node = node;
            node.raphael = this;
            this.X = 0;
            this.Y = 0;
            this.attrs = {};
            this.Group = group;
            this.paper = vml;
            this._ = {
                tx: 0,
                ty: 0,
                rt: {deg:0},
                sx: 1,
                sy: 1
            };
            !vml.bottom && (vml.bottom = this);
            this.prev = vml.top;
            vml.top && (vml.top.next = this);
            vml.top = this;
            this.next = null;
        };
        Element[proto].rotate = function (deg, cx, cy) {
            if (this.removed) {
                return this;
            }
            if (deg == null) {
                if (this._.rt.cx) {
                    return [this._.rt.deg, this._.rt.cx, this._.rt.cy][join](S);
                }
                return this._.rt.deg;
            }
            deg = Str(deg)[split](separator);
            if (deg[length] - 1) {
                cx = toFloat(deg[1]);
                cy = toFloat(deg[2]);
            }
            deg = toFloat(deg[0]);
            if (cx != null) {
                this._.rt.deg = deg;
            } else {
                this._.rt.deg += deg;
            }
            cy == null && (cx = null);
            this._.rt.cx = cx;
            this._.rt.cy = cy;
            this.setBox(this.attrs, cx, cy);
            this.Group.style.rotation = this._.rt.deg;
            // gradient fix for rotation. TODO
            // var fill = (this.shape || this.node).getElementsByTagName(fillString);
            // fill = fill[0] || {};
            // var b = ((360 - this._.rt.deg) - 270) % 360;
            // !R.is(fill.angle, "undefined") && (fill.angle = b);
            return this;
        };
        Element[proto].setBox = function (params, cx, cy) {
            if (this.removed) {
                return this;
            }
            var gs = this.Group.style,
                os = (this.shape && this.shape.style) || this.node.style;
            params = params || {};
            for (var i in params) if (params[has](i)) {
                this.attrs[i] = params[i];
            }
            cx = cx || this._.rt.cx;
            cy = cy || this._.rt.cy;
            var attr = this.attrs,
                x,
                y,
                w,
                h;
            switch (this.type) {
                case "circle":
                    x = attr.cx - attr.r;
                    y = attr.cy - attr.r;
                    w = h = attr.r * 2;
                    break;
                case "ellipse":
                    x = attr.cx - attr.rx;
                    y = attr.cy - attr.ry;
                    w = attr.rx * 2;
                    h = attr.ry * 2;
                    break;
                case "image":
                    x = +attr.x;
                    y = +attr.y;
                    w = attr.width || 0;
                    h = attr.height || 0;
                    break;
                case "text":
                    this.textpath.v = ["m", round(attr.x), ", ", round(attr.y - 2), "l", round(attr.x) + 1, ", ", round(attr.y - 2)][join](E);
                    x = attr.x - round(this.W / 2);
                    y = attr.y - this.H / 2;
                    w = this.W;
                    h = this.H;
                    break;
                case "rect":
                case "path":
                    if (!this.attrs.path) {
                        x = 0;
                        y = 0;
                        w = this.paper.width;
                        h = this.paper.height;
                    } else {
                        var dim = pathDimensions(this.attrs.path);
                        x = dim.x;
                        y = dim.y;
                        w = dim.width;
                        h = dim.height;
                    }
                    break;
                default:
                    x = 0;
                    y = 0;
                    w = this.paper.width;
                    h = this.paper.height;
                    break;
            }
            cx = (cx == null) ? x + w / 2 : cx;
            cy = (cy == null) ? y + h / 2 : cy;
            var left = cx - this.paper.width / 2,
                top = cy - this.paper.height / 2, t;
            gs.left != (t = left + "px") && (gs.left = t);
            gs.top != (t = top + "px") && (gs.top = t);
            this.X = pathlike[has](this.type) ? -left : x;
            this.Y = pathlike[has](this.type) ? -top : y;
            this.W = w;
            this.H = h;
            if (pathlike[has](this.type)) {
                os.left != (t = -left * zoom + "px") && (os.left = t);
                os.top != (t = -top * zoom + "px") && (os.top = t);
            } else if (this.type == "text") {
                os.left != (t = -left + "px") && (os.left = t);
                os.top != (t = -top + "px") && (os.top = t);
            } else {
                gs.width != (t = this.paper.width + "px") && (gs.width = t);
                gs.height != (t = this.paper.height + "px") && (gs.height = t);
                os.left != (t = x - left + "px") && (os.left = t);
                os.top != (t = y - top + "px") && (os.top = t);
                os.width != (t = w + "px") && (os.width = t);
                os.height != (t = h + "px") && (os.height = t);
            }
        };
        Element[proto].hide = function () {
            !this.removed && (this.Group.style.display = "none");
            return this;
        };
        Element[proto].show = function () {
            !this.removed && (this.Group.style.display = "block");
            return this;
        };
        Element[proto].getBBox = function () {
            if (this.removed) {
                return this;
            }
            if (pathlike[has](this.type)) {
                return pathDimensions(this.attrs.path);
            }
            return {
                x: this.X + (this.bbx || 0),
                y: this.Y,
                width: this.W,
                height: this.H
            };
        };
        Element[proto].remove = function () {
            if (this.removed) {
                return;
            }
            tear(this, this.paper);
            this.node.parentNode.removeChild(this.node);
            this.Group.parentNode.removeChild(this.Group);
            this.shape && this.shape.parentNode.removeChild(this.shape);
            for (var i in this) {
                delete this[i];
            }
            this.removed = true;
        };
        Element[proto].attr = function (name, value) {
            if (this.removed) {
                return this;
            }
            if (name == null) {
                var res = {};
                for (var i in this.attrs) if (this.attrs[has](i)) {
                    res[i] = this.attrs[i];
                }
                this._.rt.deg && (res.rotation = this.rotate());
                (this._.sx != 1 || this._.sy != 1) && (res.scale = this.scale());
                res.gradient && res.fill == "none" && (res.fill = res.gradient) && delete res.gradient;
                return res;
            }
            if (value == null && R.is(name, string)) {
                if (name == "translation") {
                    return translate.call(this);
                }
                if (name == "rotation") {
                    return this.rotate();
                }
                if (name == "scale") {
                    return this.scale();
                }
                if (name == fillString && this.attrs.fill == "none" && this.attrs.gradient) {
                    return this.attrs.gradient;
                }
                return this.attrs[name];
            }
            if (this.attrs && value == null && R.is(name, array)) {
                var ii, values = {};
                for (i = 0, ii = name[length]; i < ii; i++) {
                    values[name[i]] = this.attr(name[i]);
                }
                return values;
            }
            var params;
            if (value != null) {
                params = {};
                params[name] = value;
            }
            value == null && R.is(name, "object") && (params = name);
            if (params) {
                if (params.text && this.type == "text") {
                    this.node.string = params.text;
                }
                setFillAndStroke(this, params);
                if (params.gradient && (({circle: 1, ellipse: 1})[has](this.type) || Str(params.gradient).charAt() != "r")) {
                    addGradientFill(this, params.gradient);
                }
                (!pathlike[has](this.type) || this._.rt.deg) && this.setBox(this.attrs);
            }
            return this;
        };
        Element[proto].toFront = function () {
            !this.removed && this.Group.parentNode[appendChild](this.Group);
            this.paper.top != this && tofront(this, this.paper);
            return this;
        };
        Element[proto].toBack = function () {
            if (this.removed) {
                return this;
            }
            if (this.Group.parentNode.firstChild != this.Group) {
                this.Group.parentNode.insertBefore(this.Group, this.Group.parentNode.firstChild);
                toback(this, this.paper);
            }
            return this;
        };
        Element[proto].insertAfter = function (element) {
            if (this.removed) {
                return this;
            }
            if (element.constructor == Set) {
                element = element[element.length];
            }
            if (element.Group.nextSibling) {
                element.Group.parentNode.insertBefore(this.Group, element.Group.nextSibling);
            } else {
                element.Group.parentNode[appendChild](this.Group);
            }
            insertafter(this, element, this.paper);
            return this;
        };
        Element[proto].insertBefore = function (element) {
            if (this.removed) {
                return this;
            }
            if (element.constructor == Set) {
                element = element[0];
            }
            element.Group.parentNode.insertBefore(this.Group, element.Group);
            insertbefore(this, element, this.paper);
            return this;
        };
        var blurregexp = / progid:\S+Blur\([^\)]+\)/g;
        Element[proto].blur = function (size) {
            var s = this.node.runtimeStyle,
                f = s.filter;
            f = f.replace(blurregexp, E);
            if (+size !== 0) {
                this.attrs.blur = size;
                s.filter = f + S + ms + ".Blur(pixelradius=" + (+size || 1.5) + ")";
                s.margin = R.format("-{0}px 0 0 -{0}px", round(+size || 1.5));
            } else {
                s.filter = f;
                s.margin = 0;
                delete this.attrs.blur;
            }
        };
 
        theCircle = function (vml, x, y, r) {
            var g = createNode("group"),
                o = createNode("oval"),
                ol = o.style;
            g.style.cssText = "position:absolute;left:0;top:0;width:" + vml.width + "px;height:" + vml.height + "px";
            g.coordsize = coordsize;
            g.coordorigin = vml.coordorigin;
            g[appendChild](o);
            var res = new Element(o, g, vml);
            res.type = "circle";
            setFillAndStroke(res, {stroke: "#000", fill: "none"});
            res.attrs.cx = x;
            res.attrs.cy = y;
            res.attrs.r = r;
            res.setBox({x: x - r, y: y - r, width: r * 2, height: r * 2});
            vml.canvas[appendChild](g);
            return res;
        };
        function rectPath(x, y, w, h, r) {
            if (r) {
                return R.format("M{0},{1}l{2},0a{3},{3},0,0,1,{3},{3}l0,{5}a{3},{3},0,0,1,{4},{3}l{6},0a{3},{3},0,0,1,{4},{4}l0,{7}a{3},{3},0,0,1,{3},{4}z", x + r, y, w - r * 2, r, -r, h - r * 2, r * 2 - w, r * 2 - h);
            } else {
                return R.format("M{0},{1}l{2},0,0,{3},{4},0z", x, y, w, h, -w);
            }
        }
        theRect = function (vml, x, y, w, h, r) {
            var path = rectPath(x, y, w, h, r),
                res = vml.path(path),
                a = res.attrs;
            res.X = a.x = x;
            res.Y = a.y = y;
            res.W = a.width = w;
            res.H = a.height = h;
            a.r = r;
            a.path = path;
            res.type = "rect";
            return res;
        };
        theEllipse = function (vml, x, y, rx, ry) {
            var g = createNode("group"),
                o = createNode("oval"),
                ol = o.style;
            g.style.cssText = "position:absolute;left:0;top:0;width:" + vml.width + "px;height:" + vml.height + "px";
            g.coordsize = coordsize;
            g.coordorigin = vml.coordorigin;
            g[appendChild](o);
            var res = new Element(o, g, vml);
            res.type = "ellipse";
            setFillAndStroke(res, {stroke: "#000"});
            res.attrs.cx = x;
            res.attrs.cy = y;
            res.attrs.rx = rx;
            res.attrs.ry = ry;
            res.setBox({x: x - rx, y: y - ry, width: rx * 2, height: ry * 2});
            vml.canvas[appendChild](g);
            return res;
        };
        theImage = function (vml, src, x, y, w, h) {
            var g = createNode("group"),
                o = createNode("image"),
                ol = o.style;
            g.style.cssText = "position:absolute;left:0;top:0;width:" + vml.width + "px;height:" + vml.height + "px";
            g.coordsize = coordsize;
            g.coordorigin = vml.coordorigin;
            o.src = src;
            g[appendChild](o);
            var res = new Element(o, g, vml);
            res.type = "image";
            res.attrs.src = src;
            res.attrs.x = x;
            res.attrs.y = y;
            res.attrs.w = w;
            res.attrs.h = h;
            res.setBox({x: x, y: y, width: w, height: h});
            vml.canvas[appendChild](g);
            return res;
        };
        theText = function (vml, x, y, text) {
            var g = createNode("group"),
                el = createNode("shape"),
                ol = el.style,
                path = createNode("path"),
                ps = path.style,
                o = createNode("textpath");
            g.style.cssText = "position:absolute;left:0;top:0;width:" + vml.width + "px;height:" + vml.height + "px";
            g.coordsize = coordsize;
            g.coordorigin = vml.coordorigin;
            path.v = R.format("m{0},{1}l{2},{1}", round(x * 10), round(y * 10), round(x * 10) + 1);
            path.textpathok = true;
            ol.width = vml.width;
            ol.height = vml.height;
            o.string = Str(text);
            o.on = true;
            el[appendChild](o);
            el[appendChild](path);
            g[appendChild](el);
            var res = new Element(o, g, vml);
            res.shape = el;
            res.textpath = path;
            res.type = "text";
            res.attrs.text = text;
            res.attrs.x = x;
            res.attrs.y = y;
            res.attrs.w = 1;
            res.attrs.h = 1;
            setFillAndStroke(res, {font: availableAttrs.font, stroke: "none", fill: "#000"});
            res.setBox();
            vml.canvas[appendChild](g);
            return res;
        };
        setSize = function (width, height) {
            var cs = this.canvas.style;
            width == +width && (width += "px");
            height == +height && (height += "px");
            cs.width = width;
            cs.height = height;
            cs.clip = "rect(0 " + width + " " + height + " 0)";
            return this;
        };
        var createNode;
        doc.createStyleSheet().addRule(".rvml", "behavior:url(#default#VML)");
        try {
            !doc.namespaces.rvml && doc.namespaces.add("rvml", "urn:schemas-microsoft-com:vml");
            createNode = function (tagName) {
                return doc.createElement('<rvml:' + tagName + ' class="rvml">');
            };
        } catch (e) {
            createNode = function (tagName) {
                return doc.createElement('<' + tagName + ' xmlns="urn:schemas-microsoft.com:vml" class="rvml">');
            };
        }
        create = function () {
            var con = getContainer[apply](0, arguments),
                container = con.container,
                height = con.height,
                s,
                width = con.width,
                x = con.x,
                y = con.y;
            if (!container) {
                throw new Error("VML container not found.");
            }
            var res = new Paper,
                c = res.canvas = doc.createElement("div"),
                cs = c.style;
            x = x || 0;
            y = y || 0;
            width = width || 512;
            height = height || 342;
            width == +width && (width += "px");
            height == +height && (height += "px");
            res.width = 1e3;
            res.height = 1e3;
            res.coordsize = zoom * 1e3 + S + zoom * 1e3;
            res.coordorigin = "0 0";
            res.span = doc.createElement("span");
            res.span.style.cssText = "position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;display:inline;";
            c[appendChild](res.span);
            cs.cssText = R.format("width:{0};height:{1};display:inline-block;position:relative;clip:rect(0 {0} {1} 0);overflow:hidden", width, height);
            if (container == 1) {
                doc.body[appendChild](c);
                cs.left = x + "px";
                cs.top = y + "px";
                cs.position = "absolute";
            } else {
                if (container.firstChild) {
                    container.insertBefore(c, container.firstChild);
                } else {
                    container[appendChild](c);
                }
            }
            plugins.call(res, res, R.fn);
            return res;
        };
        Paper[proto].clear = function () {
            this.canvas.innerHTML = E;
            this.span = doc.createElement("span");
            this.span.style.cssText = "position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;display:inline;";
            this.canvas[appendChild](this.span);
            this.bottom = this.top = null;
        };
        Paper[proto].remove = function () {
            this.canvas.parentNode.removeChild(this.canvas);
            for (var i in this) {
                this[i] = removed(i);
            }
            return true;
        };
    }
 
    // rest
    // WebKit rendering bug workaround method
    if ((navigator.vendor == "Apple Computer, Inc.") && (navigator.userAgent.match(/Version\/(.*?)\s/)[1] < 4 || win.navigator.platform.slice(0, 2) == "iP")) {
        Paper[proto].safari = function () {
            var rect = this.rect(-99, -99, this.width + 99, this.height + 99).attr({stroke: "none"});
            win.setTimeout(function () {rect.remove();});
        };
    } else {
        Paper[proto].safari = function () {};
    }
 
    // Events
    var preventDefault = function () {
        this.returnValue = false;
    },
    preventTouch = function () {
        return this.originalEvent.preventDefault();
    },
    stopPropagation = function () {
        this.cancelBubble = true;
    },
    stopTouch = function () {
        return this.originalEvent.stopPropagation();
    },
    addEvent = (function () {
        if (doc.addEventListener) {
            return function (obj, type, fn, element) {
                var realName = supportsTouch && touchMap[type] ? touchMap[type] : type;
                var f = function (e) {
                    if (supportsTouch && touchMap[has](type)) {
                        for (var i = 0, ii = e.targetTouches && e.targetTouches.length; i < ii; i++) {
                            if (e.targetTouches[i].target == obj) {
                                var olde = e;
                                e = e.targetTouches[i];
                                e.originalEvent = olde;
                                e.preventDefault = preventTouch;
                                e.stopPropagation = stopTouch;
                                break;
                            }
                        }
                    }
                    return fn.call(element, e);
                };
                obj.addEventListener(realName, f, false);
                return function () {
                    obj.removeEventListener(realName, f, false);
                    return true;
                };
            };
        } else if (doc.attachEvent) {
            return function (obj, type, fn, element) {
                var f = function (e) {
                    e = e || win.event;
                    e.preventDefault = e.preventDefault || preventDefault;
                    e.stopPropagation = e.stopPropagation || stopPropagation;
                    return fn.call(element, e);
                };
                obj.attachEvent("on" + type, f);
                var detacher = function () {
                    obj.detachEvent("on" + type, f);
                    return true;
                };
                return detacher;
            };
        }
    })(),
    drag = [],
    dragMove = function (e) {
        var x = e.clientX,
            y = e.clientY,
            dragi,
            j = drag.length;
        while (j--) {
            dragi = drag[j];
            if (supportsTouch) {
                var i = e.touches.length,
                    touch;
                while (i--) {
                    touch = e.touches[i];
                    if (touch.identifier == dragi.el._drag.id) {
                        x = touch.clientX;
                        y = touch.clientY;
                        (e.originalEvent ? e.originalEvent : e).preventDefault();
                        break;
                    }
                }
            } else {
                e.preventDefault();
            }
            dragi.move && dragi.move.call(dragi.el, x - dragi.el._drag.x, y - dragi.el._drag.y, x, y);
        }
    },
    dragUp = function () {
        R.unmousemove(dragMove).unmouseup(dragUp);
        var i = drag.length,
            dragi;
        while (i--) {
            dragi = drag[i];
            dragi.el._drag = {};
            dragi.end && dragi.end.call(dragi.el);
        }
        drag = [];
    };
    for (var i = events[length]; i--;) {
        (function (eventName) {
            R[eventName] = Element[proto][eventName] = function (fn) {
                if (R.is(fn, "function")) {
                    this.events = this.events || [];
                    this.events.push({name: eventName, f: fn, unbind: addEvent(this.shape || this.node || doc, eventName, fn, this)});
                }
                return this;
            };
            R["un" + eventName] = Element[proto]["un" + eventName] = function (fn) {
                var events = this.events,
                    l = events[length];
                while (l--) if (events[l].name == eventName && events[l].f == fn) {
                    events[l].unbind();
                    events.splice(l, 1);
                    !events.length && delete this.events;
                    return this;
                }
                return this;
            };
        })(events[i]);
    }
    Element[proto].hover = function (f_in, f_out) {
        return this.mouseover(f_in).mouseout(f_out);
    };
    Element[proto].unhover = function (f_in, f_out) {
        return this.unmouseover(f_in).unmouseout(f_out);
    };
    Element[proto].drag = function (onmove, onstart, onend) {
        this._drag = {};
        this.mousedown(function (e) {
            (e.originalEvent || e).preventDefault();
            this._drag.x = e.clientX;
            this._drag.y = e.clientY;
            this._drag.id = e.identifier;
            onstart && onstart.call(this, e.clientX, e.clientY);
            !drag.length && R.mousemove(dragMove).mouseup(dragUp);
            drag.push({el: this, move: onmove, end: onend});
        });
        return this;
    };
    Element[proto].undrag = function (onmove, onstart, onend) {
        var i = drag.length;
        while (i--) {
            drag[i].el == this && (drag[i].move == onmove && drag[i].end == onend) && drag.splice(i, 1);
            !drag.length && R.unmousemove(dragMove).unmouseup(dragUp);
        }
    };
    Paper[proto].circle = function (x, y, r) {
        return theCircle(this, x || 0, y || 0, r || 0);
    };
    Paper[proto].rect = function (x, y, w, h, r) {
        return theRect(this, x || 0, y || 0, w || 0, h || 0, r || 0);
    };
    Paper[proto].ellipse = function (x, y, rx, ry) {
        return theEllipse(this, x || 0, y || 0, rx || 0, ry || 0);
    };
    Paper[proto].path = function (pathString) {
        pathString && !R.is(pathString, string) && !R.is(pathString[0], array) && (pathString += E);
        return thePath(R.format[apply](R, arguments), this);
    };
    Paper[proto].image = function (src, x, y, w, h) {
        return theImage(this, src || "about:blank", x || 0, y || 0, w || 0, h || 0);
    };
    Paper[proto].text = function (x, y, text) {
        return theText(this, x || 0, y || 0, text || E);
    };
    Paper[proto].set = function (itemsArray) {
        arguments[length] > 1 && (itemsArray = Array[proto].splice.call(arguments, 0, arguments[length]));
        return new Set(itemsArray);
    };
    Paper[proto].setSize = setSize;
    Paper[proto].top = Paper[proto].bottom = null;
    Paper[proto].raphael = R;
    function x_y() {
        return this.x + S + this.y;
    }
    Element[proto].resetScale = function () {
        if (this.removed) {
            return this;
        }
        this._.sx = 1;
        this._.sy = 1;
        this.attrs.scale = "1 1";
    };
    Element[proto].scale = function (x, y, cx, cy) {
        if (this.removed) {
            return this;
        }
        if (x == null && y == null) {
            return {
                x: this._.sx,
                y: this._.sy,
                toString: x_y
            };
        }
        y = y || x;
        !+y && (y = x);
        var dx,
            dy,
            dcx,
            dcy,
            a = this.attrs;
        if (x != 0) {
            var bb = this.getBBox(),
                rcx = bb.x + bb.width / 2,
                rcy = bb.y + bb.height / 2,
                kx = x / this._.sx,
                ky = y / this._.sy;
            cx = (+cx || cx == 0) ? cx : rcx;
            cy = (+cy || cy == 0) ? cy : rcy;
            var dirx = ~~(x / math.abs(x)),
                diry = ~~(y / math.abs(y)),
                s = this.node.style,
                ncx = cx + (rcx - cx) * kx,
                ncy = cy + (rcy - cy) * ky;
            switch (this.type) {
                case "rect":
                case "image":
                    var neww = a.width * dirx * kx,
                        newh = a.height * diry * ky;
                    this.attr({
                        height: newh,
                        r: a.r * mmin(dirx * kx, diry * ky),
                        width: neww,
                        x: ncx - neww / 2,
                        y: ncy - newh / 2
                    });
                    break;
                case "circle":
                case "ellipse":
                    this.attr({
                        rx: a.rx * dirx * kx,
                        ry: a.ry * diry * ky,
                        r: a.r * mmin(dirx * kx, diry * ky),
                        cx: ncx,
                        cy: ncy
                    });
                    break;
                case "text":
                    this.attr({
                        x: ncx,
                        y: ncy
                    });
                    break;
                case "path":
                    var path = pathToRelative(a.path),
                        skip = true;
                    for (var i = 0, ii = path[length]; i < ii; i++) {
                        var p = path[i],
                            P0 = upperCase.call(p[0]);
                        if (P0 == "M" && skip) {
                            continue;
                        } else {
                            skip = false;
                        }
                        if (P0 == "A") {
                            p[path[i][length] - 2] *= kx;
                            p[path[i][length] - 1] *= ky;
                            p[1] *= dirx * kx;
                            p[2] *= diry * ky;
                            p[5] = +!(dirx + diry ? !+p[5] : +p[5]);
                        } else if (P0 == "H") {
                            for (var j = 1, jj = p[length]; j < jj; j++) {
                                p[j] *= kx;
                            }
                        } else if (P0 == "V") {
                            for (j = 1, jj = p[length]; j < jj; j++) {
                                p[j] *= ky;
                            }
                         } else {
                            for (j = 1, jj = p[length]; j < jj; j++) {
                                p[j] *= (j % 2) ? kx : ky;
                            }
                        }
                    }
                    var dim2 = pathDimensions(path);
                    dx = ncx - dim2.x - dim2.width / 2;
                    dy = ncy - dim2.y - dim2.height / 2;
                    path[0][1] += dx;
                    path[0][2] += dy;
                    this.attr({path: path});
                break;
            }
            if (this.type in {text: 1, image:1} && (dirx != 1 || diry != 1)) {
                if (this.transformations) {
                    this.transformations[2] = "scale("[concat](dirx, ",", diry, ")");
                    this.node[setAttribute]("transform", this.transformations[join](S));
                    dx = (dirx == -1) ? -a.x - (neww || 0) : a.x;
                    dy = (diry == -1) ? -a.y - (newh || 0) : a.y;
                    this.attr({x: dx, y: dy});
                    a.fx = dirx - 1;
                    a.fy = diry - 1;
                } else {
                    this.node.filterMatrix = ms + ".Matrix(M11="[concat](dirx,
                        ", M12=0, M21=0, M22=", diry,
                        ", Dx=0, Dy=0, sizingmethod='auto expand', filtertype='bilinear')");
                    s.filter = (this.node.filterMatrix || E) + (this.node.filterOpacity || E);
                }
            } else {
                if (this.transformations) {
                    this.transformations[2] = E;
                    this.node[setAttribute]("transform", this.transformations[join](S));
                    a.fx = 0;
                    a.fy = 0;
                } else {
                    this.node.filterMatrix = E;
                    s.filter = (this.node.filterMatrix || E) + (this.node.filterOpacity || E);
                }
            }
            a.scale = [x, y, cx, cy][join](S);
            this._.sx = x;
            this._.sy = y;
        }
        return this;
    };
    Element[proto].clone = function () {
        if (this.removed) {
            return null;
        }
        var attr = this.attr();
        delete attr.scale;
        delete attr.translation;
        return this.paper[this.type]().attr(attr);
    };
    var getPointAtSegmentLength = cacher(function (p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, length) {
        var len = 0,
            old;
        for (var i = 0; i < 1.01; i+=.01) {
            var dot = findDotAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, i);
            i && (len += pow(pow(old.x - dot.x, 2) + pow(old.y - dot.y, 2), .5));
            if (len >= length) {
                return dot;
            }
            old = dot;
        }
    }),
    getLengthFactory = function (istotal, subpath) {
        return function (path, length, onlystart) {
            path = path2curve(path);
            var x, y, p, l, sp = "", subpaths = {}, point,
                len = 0;
            for (var i = 0, ii = path.length; i < ii; i++) {
                p = path[i];
                if (p[0] == "M") {
                    x = +p[1];
                    y = +p[2];
                } else {
                    l = segmentLength(x, y, p[1], p[2], p[3], p[4], p[5], p[6]);
                    if (len + l > length) {
                        if (subpath && !subpaths.start) {
                            point = getPointAtSegmentLength(x, y, p[1], p[2], p[3], p[4], p[5], p[6], length - len);
                            sp += ["C", point.start.x, point.start.y, point.m.x, point.m.y, point.x, point.y];
                            if (onlystart) {return sp;}
                            subpaths.start = sp;
                            sp = ["M", point.x, point.y + "C", point.n.x, point.n.y, point.end.x, point.end.y, p[5], p[6]][join]();
                            len += l;
                            x = +p[5];
                            y = +p[6];
                            continue;
                        }
                        if (!istotal && !subpath) {
                            point = getPointAtSegmentLength(x, y, p[1], p[2], p[3], p[4], p[5], p[6], length - len);
                            return {x: point.x, y: point.y, alpha: point.alpha};
                        }
                    }
                    len += l;
                    x = +p[5];
                    y = +p[6];
                }
                sp += p;
            }
            subpaths.end = sp;
            point = istotal ? len : subpath ? subpaths : R.findDotsAtSegment(x, y, p[1], p[2], p[3], p[4], p[5], p[6], 1);
            point.alpha && (point = {x: point.x, y: point.y, alpha: point.alpha});
            return point;
        };
    },
    segmentLength = cacher(function (p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y) {
        var old = {x: 0, y: 0},
            len = 0;
        for (var i = 0; i < 1.01; i+=.01) {
            var dot = findDotAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, i);
            i && (len += pow(pow(old.x - dot.x, 2) + pow(old.y - dot.y, 2), .5));
            old = dot;
        }
        return len;
    });
    var getTotalLength = getLengthFactory(1),
        getPointAtLength = getLengthFactory(),
        getSubpathsAtLength = getLengthFactory(0, 1);
    Element[proto].getTotalLength = function () {
        if (this.type != "path") {return;}
        if (this.node.getTotalLength) {
            return this.node.getTotalLength();
        }
        return getTotalLength(this.attrs.path);
    };
    Element[proto].getPointAtLength = function (length) {
        if (this.type != "path") {return;}
        if (this.node.getPointAtLength) {
            return this.node.getPointAtLength(length);
        }
        return getPointAtLength(this.attrs.path, length);
    };
    Element[proto].getSubpath = function (from, to) {
        if (this.type != "path") {return;}
        if (math.abs(this.getTotalLength() - to) < 1e-6) {
            return getSubpathsAtLength(this.attrs.path, from).end;
        }
        var a = getSubpathsAtLength(this.attrs.path, to, 1);
        return from ? getSubpathsAtLength(a, from).end : a;
    };

    // animation easing formulas
    R.easing_formulas = {
        linear: function (n) {
            return n;
        },
        "<": function (n) {
            return pow(n, 3);
        },
        ">": function (n) {
            return pow(n - 1, 3) + 1;
        },
        "<>": function (n) {
            n = n * 2;
            if (n < 1) {
                return pow(n, 3) / 2;
            }
            n -= 2;
            return (pow(n, 3) + 2) / 2;
        },
        backIn: function (n) {
            var s = 1.70158;
            return n * n * ((s + 1) * n - s);
        },
        backOut: function (n) {
            n = n - 1;
            var s = 1.70158;
            return n * n * ((s + 1) * n + s) + 1;
        },
        elastic: function (n) {
            if (n == 0 || n == 1) {
                return n;
            }
            var p = .3,
                s = p / 4;
            return pow(2, -10 * n) * math.sin((n - s) * (2 * math.PI) / p) + 1;
        },
        bounce: function (n) {
            var s = 7.5625,
                p = 2.75,
                l;
            if (n < (1 / p)) {
                l = s * n * n;
            } else {
                if (n < (2 / p)) {
                    n -= (1.5 / p);
                    l = s * n * n + .75;
                } else {
                    if (n < (2.5 / p)) {
                        n -= (2.25 / p);
                        l = s * n * n + .9375;
                    } else {
                        n -= (2.625 / p);
                        l = s * n * n + .984375;
                    }
                }
            }
            return l;
        }
    };

    var animationElements = {length : 0},
        animation = function () {
            var Now = +new Date;
            for (var l in animationElements) if (l != "length" && animationElements[has](l)) {
                var e = animationElements[l];
                if (e.stop || e.el.removed) {
                    delete animationElements[l];
                    animationElements[length]--;
                    continue;
                }
                var time = Now - e.start,
                    ms = e.ms,
                    easing = e.easing,
                    from = e.from,
                    diff = e.diff,
                    to = e.to,
                    t = e.t,
                    prev = e.prev || 0,
                    that = e.el,
                    callback = e.callback,
                    set = {},
                    now;
                if (time < ms) {
                    var pos = R.easing_formulas[easing] ? R.easing_formulas[easing](time / ms) : time / ms;
                    for (var attr in from) if (from[has](attr)) {
                        switch (availableAnimAttrs[attr]) {
                            case "along":
                                now = pos * ms * diff[attr];
                                to.back && (now = to.len - now);
                                var point = getPointAtLength(to[attr], now);
                                that.translate(diff.sx - diff.x || 0, diff.sy - diff.y || 0);
                                diff.x = point.x;
                                diff.y = point.y;
                                that.translate(point.x - diff.sx, point.y - diff.sy);
                                to.rot && that.rotate(diff.r + point.alpha, point.x, point.y);
                                break;
                            case nu:
                                now = +from[attr] + pos * ms * diff[attr];
                                break;
                            case "colour":
                                now = "rgb(" + [
                                    upto255(round(from[attr].r + pos * ms * diff[attr].r)),
                                    upto255(round(from[attr].g + pos * ms * diff[attr].g)),
                                    upto255(round(from[attr].b + pos * ms * diff[attr].b))
                                ][join](",") + ")";
                                break;
                            case "path":
                                now = [];
                                for (var i = 0, ii = from[attr][length]; i < ii; i++) {
                                    now[i] = [from[attr][i][0]];
                                    for (var j = 1, jj = from[attr][i][length]; j < jj; j++) {
                                        now[i][j] = +from[attr][i][j] + pos * ms * diff[attr][i][j];
                                    }
                                    now[i] = now[i][join](S);
                                }
                                now = now[join](S);
                                break;
                            case "csv":
                                switch (attr) {
                                    case "translation":
                                        var x = diff[attr][0] * (time - prev),
                                            y = diff[attr][1] * (time - prev);
                                        t.x += x;
                                        t.y += y;
                                        now = x + S + y;
                                    break;
                                    case "rotation":
                                        now = +from[attr][0] + pos * ms * diff[attr][0];
                                        from[attr][1] && (now += "," + from[attr][1] + "," + from[attr][2]);
                                    break;
                                    case "scale":
                                        now = [+from[attr][0] + pos * ms * diff[attr][0], +from[attr][1] + pos * ms * diff[attr][1], (2 in to[attr] ? to[attr][2] : E), (3 in to[attr] ? to[attr][3] : E)][join](S);
                                    break;
                                    case "clip-rect":
                                        now = [];
                                        i = 4;
                                        while (i--) {
                                            now[i] = +from[attr][i] + pos * ms * diff[attr][i];
                                        }
                                    break;
                                }
                                break;
                        }
                        set[attr] = now;
                    }
                    that.attr(set);
                    that._run && that._run.call(that);
                } else {
                    if (to.along) {
                        point = getPointAtLength(to.along, to.len * !to.back);
                        that.translate(diff.sx - (diff.x || 0) + point.x - diff.sx, diff.sy - (diff.y || 0) + point.y - diff.sy);
                        to.rot && that.rotate(diff.r + point.alpha, point.x, point.y);
                    }
                    (t.x || t.y) && that.translate(-t.x, -t.y);
                    to.scale && (to.scale += E);
                    that.attr(to);
                    delete animationElements[l];
                    animationElements[length]--;
                    that.in_animation = null;
                    R.is(callback, "function") && callback.call(that);
                }
                e.prev = time;
            }
            R.svg && that && that.paper && that.paper.safari();
            animationElements[length] && win.setTimeout(animation);
        },
        upto255 = function (color) {
            return mmax(mmin(color, 255), 0);
        },
        translate = function (x, y) {
            if (x == null) {
                return {x: this._.tx, y: this._.ty, toString: x_y};
            }
            this._.tx += +x;
            this._.ty += +y;
            switch (this.type) {
                case "circle":
                case "ellipse":
                    this.attr({cx: +x + this.attrs.cx, cy: +y + this.attrs.cy});
                    break;
                case "rect":
                case "image":
                case "text":
                    this.attr({x: +x + this.attrs.x, y: +y + this.attrs.y});
                    break;
                case "path":
                    var path = pathToRelative(this.attrs.path);
                    path[0][1] += +x;
                    path[0][2] += +y;
                    this.attr({path: path});
                break;
            }
            return this;
        };
    Element[proto].animateWith = function (element, params, ms, easing, callback) {
        animationElements[element.id] && (params.start = animationElements[element.id].start);
        return this.animate(params, ms, easing, callback);
    };
    Element[proto].animateAlong = along();
    Element[proto].animateAlongBack = along(1);
    function along(isBack) {
        return function (path, ms, rotate, callback) {
            var params = {back: isBack};
            R.is(rotate, "function") ? (callback = rotate) : (params.rot = rotate);
            path && path.constructor == Element && (path = path.attrs.path);
            path && (params.along = path);
            return this.animate(params, ms, callback);
        };
    }
    Element[proto].onAnimation = function (f) {
        this._run = f || 0;
        return this;
    };
    Element[proto].animate = function (params, ms, easing, callback) {
        if (R.is(easing, "function") || !easing) {
            callback = easing || null;
        }
        var from = {},
            to = {},
            diff = {};
        for (var attr in params) if (params[has](attr)) {
            if (availableAnimAttrs[has](attr)) {
                from[attr] = this.attr(attr);
                (from[attr] == null) && (from[attr] = availableAttrs[attr]);
                to[attr] = params[attr];
                switch (availableAnimAttrs[attr]) {
                    case "along":
                        var len = getTotalLength(params[attr]);
                        var point = getPointAtLength(params[attr], len * !!params.back);
                        var bb = this.getBBox();
                        diff[attr] = len / ms;
                        diff.tx = bb.x;
                        diff.ty = bb.y;
                        diff.sx = point.x;
                        diff.sy = point.y;
                        to.rot = params.rot;
                        to.back = params.back;
                        to.len = len;
                        params.rot && (diff.r = toFloat(this.rotate()) || 0);
                        break;
                    case nu:
                        diff[attr] = (to[attr] - from[attr]) / ms;
                        break;
                    case "colour":
                        from[attr] = R.getRGB(from[attr]);
                        var toColour = R.getRGB(to[attr]);
                        diff[attr] = {
                            r: (toColour.r - from[attr].r) / ms,
                            g: (toColour.g - from[attr].g) / ms,
                            b: (toColour.b - from[attr].b) / ms
                        };
                        break;
                    case "path":
                        var pathes = path2curve(from[attr], to[attr]);
                        from[attr] = pathes[0];
                        var toPath = pathes[1];
                        diff[attr] = [];
                        for (var i = 0, ii = from[attr][length]; i < ii; i++) {
                            diff[attr][i] = [0];
                            for (var j = 1, jj = from[attr][i][length]; j < jj; j++) {
                                diff[attr][i][j] = (toPath[i][j] - from[attr][i][j]) / ms;
                            }
                        }
                        break;
                    case "csv":
                        var values = Str(params[attr])[split](separator),
                            from2 = Str(from[attr])[split](separator);
                        switch (attr) {
                            case "translation":
                                from[attr] = [0, 0];
                                diff[attr] = [values[0] / ms, values[1] / ms];
                            break;
                            case "rotation":
                                from[attr] = (from2[1] == values[1] && from2[2] == values[2]) ? from2 : [0, values[1], values[2]];
                                diff[attr] = [(values[0] - from[attr][0]) / ms, 0, 0];
                            break;
                            case "scale":
                                params[attr] = values;
                                from[attr] = Str(from[attr])[split](separator);
                                diff[attr] = [(values[0] - from[attr][0]) / ms, (values[1] - from[attr][1]) / ms, 0, 0];
                            break;
                            case "clip-rect":
                                from[attr] = Str(from[attr])[split](separator);
                                diff[attr] = [];
                                i = 4;
                                while (i--) {
                                    diff[attr][i] = (values[i] - from[attr][i]) / ms;
                                }
                            break;
                        }
                        to[attr] = values;
                }
            }
        }
        this.stop();
        this.in_animation = 1;
        animationElements[this.id] = {
            start: params.start || +new Date,
            ms: ms,
            easing: easing,
            from: from,
            diff: diff,
            to: to,
            el: this,
            callback: callback,
            t: {x: 0, y: 0}
        };
        ++animationElements[length] == 1 && animation();
        return this;
    };
    Element[proto].stop = function () {
        animationElements[this.id] && animationElements[length]--;
        delete animationElements[this.id];
        return this;
    };
    Element[proto].translate = function (x, y) {
        return this.attr({translation: x + " " + y});
    };
    Element[proto][toString] = function () {
        return "Rapha\xebl\u2019s object";
    };
    R.ae = animationElements;
 
    // Set
    var Set = function (items) {
        this.items = [];
        this[length] = 0;
        this.type = "set";
        if (items) {
            for (var i = 0, ii = items[length]; i < ii; i++) {
                if (items[i] && (items[i].constructor == Element || items[i].constructor == Set)) {
                    this[this.items[length]] = this.items[this.items[length]] = items[i];
                    this[length]++;
                }
            }
        }
    };
    Set[proto][push] = function () {
        var item,
            len;
        for (var i = 0, ii = arguments[length]; i < ii; i++) {
            item = arguments[i];
            if (item && (item.constructor == Element || item.constructor == Set)) {
                len = this.items[length];
                this[len] = this.items[len] = item;
                this[length]++;
            }
        }
        return this;
    };
    Set[proto].pop = function () {
        delete this[this[length]--];
        return this.items.pop();
    };
    for (var method in Element[proto]) if (Element[proto][has](method)) {
        Set[proto][method] = (function (methodname) {
            return function () {
                for (var i = 0, ii = this.items[length]; i < ii; i++) {
                    this.items[i][methodname][apply](this.items[i], arguments);
                }
                return this;
            };
        })(method);
    }
    Set[proto].attr = function (name, value) {
        if (name && R.is(name, array) && R.is(name[0], "object")) {
            for (var j = 0, jj = name[length]; j < jj; j++) {
                this.items[j].attr(name[j]);
            }
        } else {
            for (var i = 0, ii = this.items[length]; i < ii; i++) {
                this.items[i].attr(name, value);
            }
        }
        return this;
    };
    Set[proto].animate = function (params, ms, easing, callback) {
        (R.is(easing, "function") || !easing) && (callback = easing || null);
        var len = this.items[length],
            i = len,
            item,
            set = this,
            collector;
        callback && (collector = function () {
            !--len && callback.call(set);
        });
        easing = R.is(easing, string) ? easing : collector;
        item = this.items[--i].animate(params, ms, easing, collector);
        while (i--) {
            this.items[i].animateWith(item, params, ms, easing, collector);
        }
        return this;
    };
    Set[proto].insertAfter = function (el) {
        var i = this.items[length];
        while (i--) {
            this.items[i].insertAfter(el);
        }
        return this;
    };
    Set[proto].getBBox = function () {
        var x = [],
            y = [],
            w = [],
            h = [];
        for (var i = this.items[length]; i--;) {
            var box = this.items[i].getBBox();
            x[push](box.x);
            y[push](box.y);
            w[push](box.x + box.width);
            h[push](box.y + box.height);
        }
        x = mmin[apply](0, x);
        y = mmin[apply](0, y);
        return {
            x: x,
            y: y,
            width: mmax[apply](0, w) - x,
            height: mmax[apply](0, h) - y
        };
    };
    Set[proto].clone = function (s) {
        s = new Set;
        for (var i = 0, ii = this.items[length]; i < ii; i++) {
            s[push](this.items[i].clone());
        }
        return s;
    };

    R.registerFont = function (font) {
        if (!font.face) {
            return font;
        }
        this.fonts = this.fonts || {};
        var fontcopy = {
                w: font.w,
                face: {},
                glyphs: {}
            },
            family = font.face["font-family"];
        for (var prop in font.face) if (font.face[has](prop)) {
            fontcopy.face[prop] = font.face[prop];
        }
        if (this.fonts[family]) {
            this.fonts[family][push](fontcopy);
        } else {
            this.fonts[family] = [fontcopy];
        }
        if (!font.svg) {
            fontcopy.face["units-per-em"] = toInt(font.face["units-per-em"], 10);
            for (var glyph in font.glyphs) if (font.glyphs[has](glyph)) {
                var path = font.glyphs[glyph];
                fontcopy.glyphs[glyph] = {
                    w: path.w,
                    k: {},
                    d: path.d && "M" + path.d[rp](/[mlcxtrv]/g, function (command) {
                            return {l: "L", c: "C", x: "z", t: "m", r: "l", v: "c"}[command] || "M";
                        }) + "z"
                };
                if (path.k) {
                    for (var k in path.k) if (path[has](k)) {
                        fontcopy.glyphs[glyph].k[k] = path.k[k];
                    }
                }
            }
        }
        return font;
    };
    Paper[proto].getFont = function (family, weight, style, stretch) {
        stretch = stretch || "normal";
        style = style || "normal";
        weight = +weight || {normal: 400, bold: 700, lighter: 300, bolder: 800}[weight] || 400;
        if (!R.fonts) {
            return;
        }
        var font = R.fonts[family];
        if (!font) {
            var name = new RegExp("(^|\\s)" + family[rp](/[^\w\d\s+!~.:_-]/g, E) + "(\\s|$)", "i");
            for (var fontName in R.fonts) if (R.fonts[has](fontName)) {
                if (name.test(fontName)) {
                    font = R.fonts[fontName];
                    break;
                }
            }
        }
        var thefont;
        if (font) {
            for (var i = 0, ii = font[length]; i < ii; i++) {
                thefont = font[i];
                if (thefont.face["font-weight"] == weight && (thefont.face["font-style"] == style || !thefont.face["font-style"]) && thefont.face["font-stretch"] == stretch) {
                    break;
                }
            }
        }
        return thefont;
    };
    Paper[proto].print = function (x, y, string, font, size, origin) {
        origin = origin || "middle"; // baseline|middle
        var out = this.set(),
            letters = Str(string)[split](E),
            shift = 0,
            path = E,
            scale;
        R.is(font, string) && (font = this.getFont(font));
        if (font) {
            scale = (size || 16) / font.face["units-per-em"];
            var bb = font.face.bbox.split(separator),
                top = +bb[0],
                height = +bb[1] + (origin == "baseline" ? bb[3] - bb[1] + (+font.face.descent) : (bb[3] - bb[1]) / 2);
            for (var i = 0, ii = letters[length]; i < ii; i++) {
                var prev = i && font.glyphs[letters[i - 1]] || {},
                    curr = font.glyphs[letters[i]];
                shift += i ? (prev.w || font.w) + (prev.k && prev.k[letters[i]] || 0) : 0;
                curr && curr.d && out[push](this.path(curr.d).attr({fill: "#000", stroke: "none", translation: [shift, 0]}));
            }
            out.scale(scale, scale, top, height).translate(x - top, y - height);
        }
        return out;
    };

    var formatrg = /\{(\d+)\}/g;
    R.format = function (token, params) {
        var args = R.is(params, array) ? [0][concat](params) : arguments;
        token && R.is(token, string) && args[length] - 1 && (token = token[rp](formatrg, function (str, i) {
            return args[++i] == null ? E : args[i];
        }));
        return token || E;
    };
    R.ninja = function () {
        oldRaphael.was ? (Raphael = oldRaphael.is) : delete Raphael;
        return R;
    };
    R.el = Element[proto];
    return R;
})();
/* Unobtrustive Code Highlighter By Dan Webb 11/2005
   Version: 0.4
	
	Usage:
		Add a script tag for this script and any stylesets you need to use
		to the page in question, add correct class names to CODE elements, 
		define CSS styles for elements. That's it! 
	
	Known to work on:
		IE 5.5+ PC
		Firefox/Mozilla PC/Mac
		Opera 7.23 + PC
		Safari 2
		
	Known to degrade gracefully on:
		IE5.0 PC
	
	Note: IE5.0 fails due to the use of lookahead in some stylesets.  To avoid script errors
	in older browsers use expressions that use lookahead in string format when defining stylesets.
	
	This script is inspired by star-light by entirely cunning Dean Edwards
	http://dean.edwards.name/star-light/.  
*/

// replace callback support for safari.
if ("a".replace(/a/, function() {return "b"}) != "b") (function(){
  var default_replace = String.prototype.replace;
  String.prototype.replace = function(search,replace){
	// replace is not function
	if(typeof replace != "function"){
		return default_replace.apply(this,arguments)
	}
	var str = "" + this;
	var callback = replace;
	// search string is not RegExp
	if(!(search instanceof RegExp)){
		var idx = str.indexOf(search);
		return (
			idx == -1 ? str :
			default_replace.apply(str,[search,callback(search, idx, str)])
		)
	}
	var reg = search;
	var result = [];
	var lastidx = reg.lastIndex;
	var re;
	while((re = reg.exec(str)) != null){
		var idx  = re.index;
		var args = re.concat(idx, str);
		result.push(
			str.slice(lastidx,idx),
			callback.apply(null,args).toString()
		);
		if(!reg.global){
			lastidx += RegExp.lastMatch.length;
			break
		}else{
			lastidx = reg.lastIndex;
		}
	}
	result.push(str.slice(lastidx));
	return result.join("")
  }
})();

var CodeHighlighter = { styleSets : new Array };

CodeHighlighter.addStyle = function(name, rules) {
	// using push test to disallow older browsers from adding styleSets
	if ([].push) this.styleSets.push({
		name : name, 
		rules : rules,
		ignoreCase : arguments[2] || false
	})
	
	function setEvent() {
		// set highlighter to run on load (use LowPro if present)
		if (typeof Event != 'undefined' && typeof Event.onReady == 'function') 
		  return Event.onReady(CodeHighlighter.init.bind(CodeHighlighter));
		
		var old = window.onload;
		
		if (typeof window.onload != 'function') {
			window.onload = function() { CodeHighlighter.init() };
		} else {
			window.onload = function() {
				old();
				CodeHighlighter.init();
			}
		}
	}
	
	// only set the event when the first style is added
	if (this.styleSets.length==1) setEvent();
}

CodeHighlighter.init = function() {
	if (!document.getElementsByTagName) return; 
	if ("a".replace(/a/, function() {return "b"}) != "b") return; // throw out Safari versions that don't support replace function
	// throw out older browsers
	
	var codeEls = document.getElementsByTagName("CODE");
	// collect array of all pre elements
	codeEls.filter = function(f) {
		var a =  new Array;
		for (var i = 0; i < this.length; i++) if (f(this[i])) a[a.length] = this[i];
		return a;
	} 
	
	var rules = new Array;
	rules.toString = function() {
		// joins regexes into one big parallel regex
		var exps = new Array;
		for (var i = 0; i < this.length; i++) exps.push(this[i].exp);
		return exps.join("|");
	}
	
	function addRule(className, rule) {
		// add a replace rule
		var exp = (typeof rule.exp != "string")?String(rule.exp).substr(1, String(rule.exp).length-2):rule.exp;
		// converts regex rules to strings and chops of the slashes
		rules.push({
			className : className,
			exp : "(" + exp + ")",
			length : (exp.match(/(^|[^\\])\([^?]/g) || "").length + 1, // number of subexps in rule
			replacement : rule.replacement || null 
		});
	}
	
	function parse(text, ignoreCase) {
		// main text parsing and replacement
		return text.replace(new RegExp(rules, (ignoreCase)?"gi":"g"), function() {
			var i = 0, j = 1, rule;
			while (rule = rules[i++]) {
				if (arguments[j]) {
					// if no custom replacement defined do the simple replacement
					if (!rule.replacement) return "<span class=\"" + rule.className + "\">" + arguments[0] + "</span>";
					else {
						// replace $0 with the className then do normal replaces
						var str = rule.replacement.replace("$0", rule.className);
						for (var k = 1; k <= rule.length - 1; k++) str = str.replace("$" + k, arguments[j + k]);
						return str;
					}
				} else j+= rule.length;
			}
		});
	}
	
	function highlightCode(styleSet) {
		// clear rules array
		var parsed, clsRx = new RegExp("(\\s|^)" + styleSet.name + "(\\s|$)");
		rules.length = 0;
		
		// get stylable elements by filtering out all code elements without the correct className	
		var stylableEls = codeEls.filter(function(item) { return clsRx.test(item.className) });
		
		// add style rules to parser
		for (var className in styleSet.rules) addRule(className, styleSet.rules[className]);
		
			
		// replace for all elements
		for (var i = 0; i < stylableEls.length; i++) {
			// EVIL hack to fix IE whitespace badness if it's inside a <pre>
			if (/MSIE/.test(navigator.appVersion) && stylableEls[i].parentNode.nodeName == 'PRE') {
				stylableEls[i] = stylableEls[i].parentNode;
				
				parsed = stylableEls[i].innerHTML.replace(/(<code[^>]*>)([^<]*)<\/code>/i, function() {
					return arguments[1] + parse(arguments[2], styleSet.ignoreCase) + "</code>"
				});
				parsed = parsed.replace(/\n( *)/g, function() { 
					var spaces = "";
					for (var i = 0; i < arguments[1].length; i++) spaces+= "&nbsp;";
					return "\n" + spaces;  
				});
				parsed = parsed.replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");
				parsed = parsed.replace(/\n(<\/\w+>)?/g, "<br />$1").replace(/<br \/>[\n\r\s]*<br \/>/g, "<p><br></p>");
				
			} else parsed = parse(stylableEls[i].innerHTML, styleSet.ignoreCase);
			
			stylableEls[i].innerHTML = parsed;
		}
	}
	
	// run highlighter on all stylesets
	for (var i=0; i < this.styleSets.length; i++) {
		highlightCode(this.styleSets[i]);  
	}
}
CodeHighlighter.addStyle("ruby",{
	comment : {
		exp  : /#[^\n]+/
	},
	brackets : {
		exp  : /\(|\)/
	},
	string : {
		exp  : /'[^'\\]*(\\.[^'\\]*)*'|"[^"\\]*(\\.[^"\\]*)*"/
	},
	keywords : {
		exp  : /\b(do|end|self|class|def|if|module|yield|then|else|for|until|unless|while|elsif|case|when|break|retry|redo|rescue|require|raise)\b/
	},
	/* Added by Shelly Fisher (shelly@agileevolved.com) */
	symbol : {
	  exp : /([^:])(:[A-Za-z0-9_!?]+)/
	}
});
CodeHighlighter.addStyle("javascript",{
	comment : {
		exp  : /(\/\/[^\n]*(\n|$))|(\/\*[^*]*\*+([^\/][^*]*\*+)*\/)/
	},
	brackets : {
		exp  : /\(|\)/
	},
	string : {
		exp  : /'[^'\\]*(\\.[^'\\]*)*'|"[^"\\]*(\\.[^"\\]*)*"/
	},
	keywords : {
		exp  : /\b(arguments|break|case|continue|default|delete|do|else|false|for|function|if|in|instanceof|new|null|return|switch|this|true|typeof|var|void|while|with)\b/
	},
	global : {
		exp  : /\b(toString|valueOf|window|element|prototype|constructor|document|escape|unescape|parseInt|parseFloat|setTimeout|clearTimeout|setInterval|clearInterval|NaN|isNaN|Infinity)\b/
	}
});
/*
    http://www.JSON.org/json2.js
    2010-03-20

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, strict: false */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (!this.JSON) {
    this.JSON = {};
}

(function () {

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
                   this.getUTCFullYear()   + '-' +
                 f(this.getUTCMonth() + 1) + '-' +
                 f(this.getUTCDate())      + 'T' +
                 f(this.getUTCHours())     + ':' +
                 f(this.getUTCMinutes())   + ':' +
                 f(this.getUTCSeconds())   + 'Z' : null;
        };

        String.prototype.toJSON =
        Number.prototype.toJSON =
        Boolean.prototype.toJSON = function (key) {
            return this.valueOf();
        };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ?
            '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c :
                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' :
            '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0 ? '[]' :
                    gap ? '[\n' + gap +
                            partial.join(',\n' + gap) + '\n' +
                                mind + ']' :
                          '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    k = rep[i];
                    if (typeof k === 'string') {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0 ? '{}' :
                gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                        mind + '}' : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                     typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/.
test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());
