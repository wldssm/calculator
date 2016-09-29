
//去掉数组中空的元素
	function del_empty_inArray(array) {
		for(var i=0;i<array.length;i++)
		{
			if(array[i]=="")
			{
				array.splice(i,1);
				i=-1;
			}
			
		}
	}

//各运算符的运算
	function multiply(cur_operator,operator,number) {
	//operator：所有运算符，cur_operator：当前的运算符，number：参与运算的数据数组

		var numindex=-1;
		
		operatorstr=operator.join("");
		numindex=operatorstr.indexOf(cur_operator);

		//console.log(number);
		operator.splice(numindex,1);	//当前执行的运算的数字下标开始删除

		switch(cur_operator)
		{
			//乘法运算
			case "*":
				result=(+number[numindex])*(+number[numindex+1]);
				break;
			//除法运算
			case "/":
				result=(+number[numindex])/(+number[numindex+1]);
				break;
			//加法运算
			case "+":
				result=(+number[numindex])+(+number[numindex+1]);
				break;
			//减法运算
			case "-":
				result=(+number[numindex])-(+number[numindex+1]);
				break;
			//求余运算
			case "%":
				result=(+number[numindex])%(+number[numindex+1]);
				break;
			//求方运算
			case "^":
				result=Math.pow((+number[numindex]),(+number[numindex+1]));
				break;
			//求根运算
			case "√":
				result=Math.pow((+number[numindex+1]),1/(+number[numindex]));
				break;
			//求log运算
			case "lg":
				result=Math.log(+number[numindex])/Math.log(10);
				break;
		}
		
		if(cur_operator=="lg")
		{
			number.splice(numindex,1,result);
		}
		else
		{
			number.splice(numindex,2,result);
		}
//console.log(result);
		return result;
	}
	
//删除单个
	function backspace(bracketjudge) {
		curstr=$(".oper_str .result").text().trim();
		if(curstr[curstr.length-1]=="d")
		{
			$(".oper_str .result").text(curstr.substring(0,curstr.length-3));
		}
		else if(curstr[curstr.length-1]=="g")
		{
			$(".oper_str .result").text(curstr.substring(0,curstr.length-2));
		}
		else
		{
			if(curstr[curstr.length-1]=="(")
			{
				bracketjudge--;
			}
			if(curstr[curstr.length-1]==")")
			{
				bracketjudge++;
			}
			$(".oper_str .result").text(curstr.substring(0,curstr.length-1));
		}
		
		if($(".result").text().trim().length==0)
		{
			delAll();
		}
		
		return bracketjudge;
	}

//全删
	function delAll() {
		$(".oper_str .result").text("0");
		$(".oper_str .calculus").text("");
		bracketjudge=0;
		return bracketjudge;
	}

//输入数字和小数点
	function num_point(curstr,currKey,newinput) {
		if($(".oper_str .calculus").text()=="")
		{
			if(currKey!=46)
			{
				if(curstr=="0")
				{
					curstr="";
				}
			}
		}
		else
		{
			if(newinput==0)
			{
				curstr="";
			}
		}
		
		if(curstr[curstr.length-1]==")")//跟在括号后面需有运算符
		{
			return;
		}
		else
		{
			curstr=curstr+String.fromCharCode(currKey);
			$(".oper_str .result").text(curstr);
		}
	}
			
//输入mod
	function inputMod(curstr) {
		if(isNaN(curstr[curstr.length-1])&&curstr[curstr.length-1]!="."&&curstr[curstr.length-1]!="("&&curstr[curstr.length-1]!=")")
		{
			curstr=curstr.substring(0,curstr.length-1);
		}
		curstr=curstr+"Mod";
		$(".oper_str .result").text(curstr);
	}
			
//输入lg
	function inputLg(curstr,newinput) {
		if($(".oper_str .calculus").text()=="")
		{
			if(curstr.length==1&&curstr=="0")
			{
				curstr="";
			}
		}
		else
		{
			if(newinput==0)
			{
				curstr="";
			}
		}

		if(curstr==""||curstr[curstr.length-1]=="+"||curstr[curstr.length-1]=="-"||curstr[curstr.length-1]=="*"||curstr[curstr.length-1]=="/"||curstr[curstr.length-1]=="(")
		{
			curstr=curstr+"lg";
		}
		$(".oper_str .result").text(curstr);
	}		
				

			
			
			
			
			
			
			
			
			
			
			
			