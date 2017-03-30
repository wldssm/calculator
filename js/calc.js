	var curstr = "", curstrLength = 0;	//当前要计算的公式内容
	var curChar = "";//当下输入的字符
	var curClass = "";
	
	var justCalc = true;	//是否刚计算完
	var bracketjudge = 0;		//正反括号输入个数判断
	
	var formulaInfo = {};//公式详情
	
	var calcResult = '';

$(document).ready(function() {
//鼠标点击	
	$(".num").click(function() {
		curClass = $(this).attr("class");
		curChar = $(this).text();
		
		if(curClass.indexOf("factorial") >= 0)
		{
			curChar = "!";
		}else if(curClass.indexOf("reagan") >= 0)
		{
			curChar = "√";
		}else if(curClass.indexOf("square") >= 0)
		{
			curChar = "^";
		}
		
		curstr = $(".oper_str .result").text().trim();
		curstrLength = curstr.length;
		// console.log(curChar);
		
		if(curClass.indexOf("clean") >= 0)//清除键
		{
			delAll();
		}
		else if(curClass.indexOf("del") >= 0)//删除键
		{
			backspace();
		}
		else if(curClass.indexOf("calc") >= 0)//计算键
		{
			justCalc = true;
			autoComplete();
			
			setFormulaInfo();
			
			calc(formulaInfo);
		}
		else if(curClass.indexOf("bracket") >= 0)//括号
		{
			inputBracket();
		}
		else{
			inputRule();
			
			if(curClass.indexOf("square") >= 0 && $(this).text().indexOf("2") >= 0)
			{
				curstr += "2";
			}
			$(".oper_str .result").text(curstr);
		}
		
	});

	
//键盘输入
	$(document).keypress(function(e) {//获取按下字符
		var e = e || event;
		var currKey = e.keyCode || e.which || e.charCode;

		curChar = String.fromCharCode(currKey);
		
		curstr = $(".oper_str .result").text().trim();
		curstrLength = curstr.length;
		
		var patt = /(33|37|42|43|^4[5-9]$|^5[0-7]$|71|76|77|94|103|108|109)/;
		
		if(currKey == 13 || currKey == 61)//确定键和等号键
		{
			$(".calc").click();
		}else if(currKey == 40 || currKey == 41)//括号键
		{
			inputBracket();
		}else if(patt.test(currKey))
		{
			if(currKey == 77 || currKey == 109 || currKey == 37)
			{
				curChar = "Mod";
			}else if(currKey == 71 || currKey == 103)
			{
				curChar = "√";
			}else if(currKey == 76 || currKey == 108)
			{
				curChar = "lg";
			}
			inputRule();
		}
	});
	
//获取功能键
	$(document).keydown(function(e) {
		// e.preventDefault ? e.preventDefault() : (e.returnValue = false);
		var e = e || event;
		var currKey = e.keyCode || e.which || e.charCode;
		
		curChar = String.fromCharCode(currKey);
		
		curstr = $(".oper_str .result").text().trim();
		curstrLength = curstr.length;
		
		if(currKey == 8)//退格键
		{
			backspace();
		}
		if(currKey == 27)//esc，全删
		{
			delAll();
		}
	});
});
