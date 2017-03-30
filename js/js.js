
//输入规则，不包括括号
	function inputRule() {
		var cInfo = getCharInfo(curstr);
		var lastCharType = cInfo.type,
			finalLength = cInfo.length;//输入的公式最后一个字符的类型
			
		var curCharType = getCharInfo(curChar).type;
			
		if(justCalc)
		{
			if(curCharType == "numOnRight" || curCharType == "num")
			{
				curstr = curChar;
			}else{
				curstr = curstr + curChar;
			}
			justCalc = false;
			
		}else
		{
			if(lastCharType == "num" || lastCharType == "point")
			{
				if(lastCharType == "point" && curCharType != "num")
				{
					curstr = curstr.substring(0, curstrLength - 1);
				}else if(lastCharType == "num" && finalLength == 1 && curstr[curstrLength - 1] == "0")
				{
					curstr = curstr.substring(0, curstrLength - 1);
				}
				curstr = curstr + curChar;
			}else if(lastCharType == "operatorOnCenter"){
				if(curCharType == "point")
				{
					curstr = curstr + "0" + curChar;
				}else if(curCharType == "num" || curCharType == "numOnRight")
				{
					curstr = curstr + curChar;
				}else{
					curstr = curstr.substring(0, curstrLength - finalLength) + curChar;
				}
			}else if(lastCharType == "numOnLeft")
			{
				if(curCharType != "num" && curCharType != "point")
				{
					if(curstr[curstrLength - 1] != ")")
					{
						curstr = curstr.substring(0, curstrLength - finalLength) + curChar;
					}else if(curCharType == "operatorOnCenter"){
						curstr = curstr + curChar;
					}
				}
			}else if(lastCharType == "numOnRight"){
				if(curCharType == "point")
				{
					curstr = curstr + "0" + curChar;
				}
				else if(curCharType == "numOnLeft" || curCharType == "operatorOnCenter")
				{
					var tempStr = curstr.substring(0, curstrLength - finalLength);
					var prevCharType = getCharInfo(tempStr).type;
					
					if(prevCharType == "num")
					{
						curstr = curstr.substring(0, curstrLength - finalLength) + curChar;
					}
				}else if(curCharType == "num")
				{
					curstr = curstr + curChar;
				}
			}
		}
		
		
		$(".oper_str .result").text(curstr);
	}
	
//输入括号
	function inputBracket() {
		var lastCharType = getCharInfo(curstr).type,
			finalLength = getCharInfo(curstr).length;

		if(curChar == "(")
		{
			if(justCalc)
			{
				curstr = curChar;
				bracketjudge++;
				justCalc = false;
			}else if(lastCharType == "operatorOnCenter" || lastCharType == "numOnRight")
			{
				curstr = curstr + curChar;
				bracketjudge++;
			}
		}else if(curChar == ")" && bracketjudge > 0)
		{
			bracketjudge--;
			
			if(lastCharType == "num")
			{
				curstr = curstr + curChar;
			}else if(curstr[curstrLength - 1] != "!"){
				curstr = curstr + "0" + curChar;
			}
		}
		$(".oper_str .result").text(curstr);
	}
	

//判断指定字符的类型和长度
	function getCharInfo(str)
	{
		var lastChar = str[str.length - 1];
		var lastLength = 0, type = "num";
	
		if(!isNaN(lastChar))
		{
			var n = 1;
			for(var i=(str.length-2); i>=0; i--)
			{
				if(isNaN(str[i]) && str[i] != ".")
				{
					break;
				}else
				{
					n++;
				}
			}
			lastLength = n, type = "num";	//数字
		}
		else if(lastChar == ".")
		{
			lastLength = 1, type = "point"; 	//小数点
		}
		else if(lastChar == ")" || lastChar == "!")
		{
			lastLength = 1, type = "numOnLeft";	//数字在符号左边，）、！
		}
		else if(lastChar == "(" || lastChar == "√" || lastChar == "g")
		{
			lastLength = (lastChar == "g") ? 2 : 1;
			type = "numOnRight";		//数字在符号右边，（、√、lg
		}
		else
		{
			lastLength = (lastChar == "d") ? 3 : 1;
			type = "operatorOnCenter";	//符号在数字中间，+，-，*，/，%，^
		}
			
		return {"length":lastLength, "type":type};
	}

	
//删除单个
	function backspace() {
		if(justCalc || curstrLength == 1) {
			delAll();
		}else{
			if(curstr[curstrLength - 1] == "d")	//mod
			{
				curstr = curstr.substring(0, curstrLength - 3);	//substring（start，end）指定位置
			}
			else if(curstr[curstr.length - 1] == "g") //lg
			{
				curstr = curstr.substring(0, curstrLength - 2);
			}
			else{
				if(curstr[curstr.length-1]=="(")
				{
					bracketjudge--;
				}else if(curstr[curstr.length-1]==")")
				{
					bracketjudge++;
				}
				curstr = curstr.substring(0, curstrLength - 1);
			}
			
			if(curstr.length == 0) {
				delAll();
			}else{
				$(".oper_str .result").text(curstr);
			}
		}
	}

	
//全删
	function delAll() {
		$(".oper_str .result").text("0");
		$(".oper_str .calculus").text("");
		justCalc = true;
		bracketjudge = 0;
	}

		
//开始计算
	function calc(curFormulaInfo) {
		// console.log("start-----"+JSON.stringify(curFormulaInfo));
		
		if(curFormulaInfo.bracketsInfo.hasBracket)//有括号
		{
			// console.log("有括号");
			// debugger;

			var tempFormulaInfo = setFormulaInfo(curFormulaInfo.cutFormulaField.slice(curFormulaInfo.startCalcPosi[0], curFormulaInfo.startCalcPosi[1]+1),true);
			
			var tempResult = simpleCalc(tempFormulaInfo).cutFormulaField[0];
			
			curFormulaInfo.cutFormulaField[curFormulaInfo.startCalcPosi[0]-1] = tempResult;
			curFormulaInfo.cutFormulaField.splice(curFormulaInfo.startCalcPosi[0], curFormulaInfo.startCalcPosi[2]+1);
			
		}else{//无括号
			// console.log("无括号");
			simpleCalc(curFormulaInfo);
		}

		if(curFormulaInfo.cutFormulaField.length == 1)
		{
			calcResult = curFormulaInfo.cutFormulaField[0];
			console.log(calcResult);
			$(".oper_str .result").text(calcResult)
		}else{
			curFormulaInfo = setFormulaInfo(curFormulaInfo.cutFormulaField,true);
			calc(curFormulaInfo);
		}
	}
		
		
//简单加减乘除等计算，没有括号优先级
	function simpleCalc(curFormulaInfo) {
		console.log("all-----"+JSON.stringify(curFormulaInfo));
		if(curFormulaInfo.specialInfo.hasSpecial)
		{
			//debugger;
			var operatorstr = "", cutDigit = 0;//cutDigit 计算完后特殊符号消减的位数
			for(var i=0; i<curFormulaInfo.specialInfo.specialPosi.length; i++)
			{
				curFormulaInfo.specialInfo.specialPosi[i] -= cutDigit;
				csp = curFormulaInfo.specialInfo.specialPosi[i]; //cur_operator_posi
				cur_operator = curFormulaInfo.cutFormulaField[csp]; //当前的特殊运算符
				
				
				var calcFirst = curFormulaInfo.cutFormulaField.contains("!")>=0 || curFormulaInfo.cutFormulaField.contains("√")>=0 || curFormulaInfo.cutFormulaField.contains("lg")>=0;
				if(calcFirst)
				{
					switch(cur_operator)
					{
						case "lg":
							curFormulaInfo.cutFormulaField[csp] = Math.log(curFormulaInfo.cutFormulaField[csp+1]) / Math.log(10);
							curFormulaInfo.cutFormulaField.splice(csp+1, 1);
							cutDigit += 1;
							break;
						
						case "√":
							curFormulaInfo.cutFormulaField[csp] = Math.pow(curFormulaInfo.cutFormulaField[csp+1], 1/2);
							curFormulaInfo.cutFormulaField.splice(csp+1, 1);
							cutDigit += 1;
							break;	
						
						case "!":
							curFormulaInfo.cutFormulaField[csp-1] = fact(curFormulaInfo.cutFormulaField[csp-1]);
							
							curFormulaInfo.cutFormulaField.splice(csp, 1);
							cutDigit += 1;
							break;
					}
				}else{
					switch(cur_operator)
					{
						case "^":
							curFormulaInfo.cutFormulaField[csp-1] = Math.pow(curFormulaInfo.cutFormulaField[csp-1], curFormulaInfo.cutFormulaField[csp+1]);
							curFormulaInfo.cutFormulaField.splice(csp, 2);
							cutDigit += 2;
							break;
							
						default:
							//  *、/、%
							curFormulaInfo.cutFormulaField[csp-1] = eval(curFormulaInfo.cutFormulaField[csp-1] + curFormulaInfo.cutFormulaField[csp] + curFormulaInfo.cutFormulaField[csp+1]);
							curFormulaInfo.cutFormulaField.splice(csp, 2);
							cutDigit += 2;
							break;
					}
				}
			}
		}else{
			curFormulaInfo = setFormulaInfo(curFormulaInfo.cutFormulaField,true);
			curFormulaInfo = noPriorityCalc(curFormulaInfo);
		}
		
		
		
		if(curFormulaInfo.cutFormulaField.length == 1)
		{
			return curFormulaInfo;
		}else{
			curFormulaInfo = setFormulaInfo(curFormulaInfo.cutFormulaField,true);
			return simpleCalc(curFormulaInfo);
		}

	}

//顺序计算，简单加减，没有优先级
	function noPriorityCalc(curFormulaInfo) {
		for(var i=0; i<curFormulaInfo.cutFormulaField.length; i++)
		{
			if(curFormulaInfo.cutFormulaField.length > 1)
			{
				curFormulaInfo.cutFormulaField[i] = eval(curFormulaInfo.cutFormulaField[i] + curFormulaInfo.cutFormulaField[i+1] + curFormulaInfo.cutFormulaField[i+2]);
				curFormulaInfo.cutFormulaField.splice(i+1, 2);
				i -= 1;
			}
		}
		
		return curFormulaInfo;
	}
	
		
//点击计算自动补充缺少的括号，或补充0
	function autoComplete() {
		var rb = curstr.match(/[(]/g) ? curstr.match(/[(]/g).length : 0,
		lb = curstr.match(/[)]/g) ? curstr.match(/[)]/g).length : 0;
		bracketjudge = rb - lb;

		var curtype = getCharInfo(curstr).type,
			finalLength = getCharInfo(curstr).length;

		if(curtype == "point")
		{
			curstr += "0";
		}else if(curtype == "operatorOnCenter"){
			if(curstr[curstr.length - 1] == "+" || curstr[curstr.length - 1] == "-")
			{
				curstr += "0";
			}else if(curstr[curstr.length - 1] == "^"){
				curtype = getCharInfo(curstr.substring(0, curstrLength - 1)).type,
				finalLength = getCharInfo(curstr.substring(0, curstrLength - 1)).length;
				if(curtype == "num")
				{
					curstr += curstr.substring(curstrLength - 1 - finalLength, curstrLength - 1);
				}else{
					curstr += "2";
				}
			}else{
				curstr += "1";
			}
			
		}else if(curtype == "numOnRight" && curstr[curstr.length - 1] != "(")
		{
			curstr += "1";
		}
		

		if(bracketjudge > 0)
		{
			for(var i=0; i<bracketjudge; i++)
			{
				curstr += ")";
			}
		}
		bracketjudge = 0;
		$(".oper_str .calculus").text(curstr + "=");
	}
	
	
//获取公式信息
	function setFormulaInfo(srcFormula, isArray) {
		var srcFormula = arguments[0] ? arguments[0] : curstr;
		var isArray = arguments[1] ? arguments[1] : false;  //是字符串公式，还是数组公式
		formulaInfo = {"bracketsInfo" : {"hasBracket" : false, "leftb" : [], "rightb" : []},//括号数
					"specialInfo" : {"hasSpecial" : false, "specialPosi" : []},//除加减之外的特殊运算数
					"cutFormulaField" : [],//将计算公式分割成数字和运算符的数组
					"startCalcPosi" : [] //先计算哪部分，下标0和1为计算部分前后位置，2为计算部分的长度
					};
	
		if(!isArray)
		{
			formulaInfo.cutFormulaField = srcFormula.split("");
		}else{
			formulaInfo.cutFormulaField = srcFormula;
		}
	
		for(var i=0; i<formulaInfo.cutFormulaField.length; i++)
		{
			if(formulaInfo.cutFormulaField[i] != "+" && formulaInfo.cutFormulaField[i] != "-" && isNaN(formulaInfo.cutFormulaField[i]) && formulaInfo.cutFormulaField[i] != "(" && formulaInfo.cutFormulaField[i] != ")" && formulaInfo.cutFormulaField[i] != ".")
			{
				if(!formulaInfo.specialInfo.hasSpecial)
				{
					formulaInfo.specialInfo.hasSpecial = true;
				}
				
				formulaInfo.specialInfo.specialPosi.push(i);
			}
		
			if(!isArray && !isNaN(formulaInfo.cutFormulaField[i]) && (!isNaN(formulaInfo.cutFormulaField[i+1]) || formulaInfo.cutFormulaField[i+1] == "."))//多位数
			{
				formulaInfo.cutFormulaField[i] += formulaInfo.cutFormulaField[i+1];
				formulaInfo.cutFormulaField.splice(i+1, 1);
				i -= 1;
			}else if(isArray && !isNaN(formulaInfo.cutFormulaField[i]) && !isNaN(formulaInfo.cutFormulaField[i+1]))//4lg2
			{
				formulaInfo.cutFormulaField.splice(i+1, 0, "*");
			}else if(formulaInfo.cutFormulaField[i] == "M"){//mod
				formulaInfo.cutFormulaField[i] = "%";
				formulaInfo.cutFormulaField.splice(i+1, 2);
			}else if(formulaInfo.cutFormulaField[i] == "l") {//lg
				formulaInfo.cutFormulaField[i] += formulaInfo.cutFormulaField[i+1];
				formulaInfo.cutFormulaField.splice(i+1, 1);
			}else if(formulaInfo.cutFormulaField[i] == "(")
			{
				if(!formulaInfo.bracketsInfo.hasBracket)
				{
					formulaInfo.bracketsInfo.hasBracket = true;
				}
				formulaInfo.bracketsInfo.leftb.push(i);
			}
			else if(formulaInfo.cutFormulaField[i] == ")")
			{
				formulaInfo.bracketsInfo.rightb.push(i);
			}
			
			
		}
		
		getCalcPosi();
		// console.log(JSON.stringify(formulaInfo));
		return formulaInfo;
		
		// console.log(formulaInfo);
	}
	
	
//确定先计算哪部分
	function getCalcPosi()
	{
		if(formulaInfo.bracketsInfo.hasBracket)//有括号
		{
			for(var i=(formulaInfo.bracketsInfo.leftb.length-1); i>=0; i--)
			{
				if(formulaInfo.bracketsInfo.leftb[i] < formulaInfo.bracketsInfo.rightb[0])
				{
					formulaInfo.startCalcPosi = [formulaInfo.bracketsInfo.leftb[i]+1, formulaInfo.bracketsInfo.rightb[0]-1, formulaInfo.bracketsInfo.rightb[0] - formulaInfo.bracketsInfo.leftb[i]-1];
					break;
				}
			}
		}else{//无括号
			formulaInfo.startCalcPosi = [0, formulaInfo.cutFormulaField.length-1, formulaInfo.cutFormulaField.length];
		}
	}
	

//复制对象,数组，避免赋值成引用类型
	function cloneObj(fromObj, toObj) {
		for(var n in fromObj)
		{
			if(fromObj[n] instanceof Array)
			{
				toObj[n] = [];
				toObj[n] = cloneObj(fromObj[n], toObj[n]);
			}else if(fromObj[n] instanceof Object)
			{
				toObj[n] = {};
				toObj[n] = cloneObj(fromObj[n], toObj[n]);
			}else{
				toObj[n] = fromObj[n];
			}
		}
		return toObj;
	}

	
//阶乘运算
	function fact(num) {
		if(num <= 1)
			return 1;
		else{
			return num * fact(num-1);
		}
	}
	
//判断元素是否在数组内
	Array.prototype.contains = function (obj) {
		var i = this.length;  
		while (i--) {  
			if (this[i] === obj) {console.log(i)  ;
				return i;  
			}  
		}  
		return -1;  
	}

