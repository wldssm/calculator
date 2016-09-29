
$(document).ready(function() {
	//--电脑点击--//
	var curstr="";

	var newinput=0;		//
	var calcjudge=true;		//是否计算判断
	var bracketjudge=0;		//正反括号括号输入判断
	
	var specialresult="";		//特殊结果
	
	$(".num").click(function() {
		curstr=$(".oper_str .result").text().trim();
		
		if($(this).attr("class").indexOf("clean")>=0)//清除输入框
		{
			bracketjudge=delAll();
		}
		else if($(this).attr("class").indexOf("calc")>=0)//计算键
		{
			calcjudge=true;
			curstr=$(".oper_str .result").text().trim();
			for(var i=0;i<curstr.length;i++)
			{
				if(isNaN(curstr[i])&&curstr[i]!=".")
				{
					calcjudge=false;
					break;
				}
			}
			if(calcjudge==true)
			{
				return;
			}
			else
			{
				calc(curstr);
			}
			newinput=0;
		}
		else if($(this).attr("class").indexOf("del")>=0)//删除键
		{
			
			if($(".oper_str .calculus").text()=="")
			{
				bracketjudge=backspace(backspace);
			}
			else
			{
				if(newinput==0)
				{
					bracketjudge=delAll();
				}
				else
				{
					bracketjudge=backspace(bracketjudge);
				}
				newinput++;
			}
		}
		else if(!isNaN($(this).text())||$(this).text()==".")//数字键和小数点
		{
			if($(".oper_str .calculus").text()=="")
			{
				if($(this).text()!=".")
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
					if($(this).text()==".")
					{
						curstr="0";
					}
					else
					{
						curstr="";
					}
				}
			}

			if(curstr[curstr.length-1]==")")//跟在括号后面需有运算符
			{
				return;
			}
			else
			{
				curstr=curstr+$(this).text();
				$(".oper_str .result").text(curstr);
				newinput++;
			}
		}
		else if($(this).attr("class").indexOf("square")>=0)//平方
		{			
			if($(this).children("sup").text()=="y")
			{
				curstr=curstr+"^";
			}
			else
			{
				curstr=curstr+"^"+$(this).children("sup").text();
			}
			$(".oper_str .result").text(curstr);
		}
		else if($(this).attr("class").indexOf("reagan")>=0)//根号
		{
			if($(this).children("sup").length>0)
			{
				curstr=curstr+"√";
			}
			else
			{
				curstr=curstr.substring(0,curstr.length-1)+2+"√"+curstr[curstr.length-1];
			}
			$(".oper_str .result").text(curstr);
		}
		else if($(this).attr("class").indexOf("mod")>=0)//mod
		{
			inputMod(curstr);
			newinput++;
		}
		else if($(this).attr("class").indexOf("lg")>=0)//lg
		{
			inputLg(curstr,newinput);
			newinput++;
		}
		else if($(this).attr("class").indexOf("bracket")>=0)//括号
		{
			if($(this).text()=="(")
			{
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

				if(curstr[curstr.length-1]=="."||!isNaN(curstr[curstr.length-1])||curstr[curstr.length-1]==")")
				{
					return;
				}
				curstr=curstr+$(this).text();
				$(".oper_str .result").text(curstr);
				newinput++;
				bracketjudge++;
			}
			if($(this).text()==")")
			{
				if(bracketjudge>0)
				{
					if(isNaN(curstr[curstr.length-1])&&curstr[curstr.length-1]!=".")
					{
						curstr=curstr+curstr[curstr.length-4]+$(this).text();
					}
					else
					{
						curstr=curstr+$(this).text();
					}
					
					$(".oper_str .result").text(curstr);
					newinput++;
					
					bracketjudge--;
				}
			}
		}
		else//加减乘除
		{
			if(isNaN(curstr[curstr.length-1])&&curstr[curstr.length-1]!="."&&curstr[curstr.length-1]!="("&&curstr[curstr.length-1]!=")")
			{
				if(curstr[curstr.length-1]=="d")
				{
					curstr=curstr.substring(0,curstr.length-3);
				}
				else if(curstr[curstr.length-1]=="g")
				{
					curstr=curstr.substring(0,curstr.length-3);
				}
				else
				{
					curstr=curstr.substring(0,curstr.length-1);
				}
			}
			
			curstr=curstr+$(this).text(); 
			
			$(".oper_str .result").text(curstr);
			newinput++;
		}
	});

	
	//初始化
	var str="";		//字符串--所有的输入
	var result="";		//运算结果
	
	var number=new Array();	//数组--输入的运算数字
	var operator=new Array();	//数组--输入的运算符号
	var num_brackets=0;	//小数组--输入的括号里的运算数字
	var str_brackets=new Array();	//字符串--输入的括号里的运算符号
	var operatorstr="";		//字符串--输入的运算符号
	
	//var numindex=-1;	//当前执行的运算的数字下标
	//var curroperator="";	//当前执行的运算符
	var curroperator_brackets="";	//当前执行的括号运算符
	var operalength=0;	//输入的运算符个数
	
	var pos__brackets_instr=new Array(); 	//多层括号在字符串位置
	var pos__brackets_innum=new Array(); 	//多层括号分割数据中位置
	
	var subinnerstr="";		//多层括号的内层
	
	var pos_minus=new Array();	//负号-的位置
	
	$(".oper_str").focus(function() {
		if($(".oper_str").val().trim()=="")
		{
			$(".oper_str").val("");
		}
	});
	
//点击计算
	function calc(expression) {
		str=expression;
		
		//计算时自动添加缺少字符
		if(str.indexOf("/0")>=0||str.indexOf("Mod0")>=0)
		{
			specialresult="除数不能为0！";
		}
		
		if(curstr[curstr.length-1]=="+"||curstr[curstr.length-1]=="-"||curstr[curstr.length-1]=="*"||curstr[curstr.length-1]=="g")
		{
			str=str+"0";
		}
		if(curstr[curstr.length-1]=="/")
		{
			str=str+"1";
		}
		if(curstr[curstr.length-1]=="^"||curstr[curstr.length-1]=="d")
		{
			number=str.split('Mod');
			number=number.join().split(/['+','\-','*','\/','%','^','√']/);
			//去掉数组中空的元素
			del_empty_inArray(number);
			str=str+number[number.length-1];
		}
		
		if(bracketjudge>0)
		{
			for(var i=0;i<bracketjudge;i++)
			{
				str=str+")";
			}
		}

		$(".result").text(str);
		if(str.indexOf("=")>=0)
		{
			str=str.replace("=","");
			$(".calculus").text(str)
		}
		
		if(str.indexOf("Mod")>=0)
		{
			str=str.replace("Mod","%");
		}
		
		number=str.split(/['(',')']/);

		//去掉数组中空的元素
		del_empty_inArray(number);

		if(number.length==1)	//无括号
		{
			number=number.join("").split(/['+','\-','*','\/','%','^','√','lg']/);
			
			//去掉数组中空的元素
			del_empty_inArray(number);

			result=no_brackets(number,str);
		}
		else	//有括号
		{
			function pos__brackets(str) {
			
				operalength=str.length;
				pos__brackets_instr=[];
				for(var i=0;i<operalength;i++)
				{
					if(isNaN(str[i]))
					{
						if(str[i]=="("||str[i]==")")
						{
							
							pos__brackets_instr.push(str[i]);
							
							pos__brackets_instr.push(i);
						}
					}
				}
				
				return pos__brackets_instr;
			}
			pos__brackets(str);

			for(var i=0;i<pos__brackets_instr.length;i=i+2)
			{
				if(pos__brackets_instr[i]=="("&&pos__brackets_instr[i+2]==")")
				{
					str_brackets=str.substring(pos__brackets_instr[i+1]+1,pos__brackets_instr[i+3]);
					
					num_brackets=str_brackets.split(/['+','\-','*','\/','%','^','√','lg']/);
					
					//去掉数组中空的元素
					del_empty_del_empty_inArrayinArray(num_brackets);
			
//console.log(num_brackets);
//console.log(str_brackets);
					/*if(str_brackets[0]=="-")
					{
						number[0]="-"+number[0];
					}
					else
					{
						result=no_brackets(num_brackets,str_brackets);
					}*/
					result=no_brackets(num_brackets,str_brackets);
					str_brackets="("+str_brackets+")";
					str=str.replace(str_brackets,result);
					
					pos__brackets_instr=pos__brackets(str);

					i=-2;
				}
				
				if(str.indexOf("(")<0&&str.indexOf(")"<0))
				{		
					number=str.split('lg');
					number=number.join().split(/['+','\-','*','\/','%','^','√']/);
					
					//去掉数组中空的元素
					del_empty_inArray(number);
		//console.log(number);console.log(str);		
					result=no_brackets(number,str);
				}
					
			}
		}
		

		if((typeof result)==number)
		{
			return;
		}
		else
		{
			$(".calculus").text($(".result").text());
			$(".calculus").append("=");
			//if(result=="-Infinity"||result=="Infinity"||result=="NaN")
			result=result+"";

			for(var i=0;i<result.length;i++)
			{
				if(isNaN(result[i])&&result[i]!="."&&result[i]!="-")
				{
					result="无效输入！";
					break;
				}
			}
			
			$(".result").text(result);

			if(specialresult!="")
			{
				$(".result").text(specialresult);
			}
			specialresult="";
		}


	};
		

		//正常加减乘除
		function no_brackets(number,str) {
			if(str.indexOf("(")>=0||str.indexOf(")">=0))
			{
				str=str.replace("(","");
				str=str.replace(")","");
			}
			//number=number.join("").split(/['+','\-','*','\/']/);
//console.log(number);console.log(str);
			//console.log(number);
			pos_minus=[];
			for(var i=0;i<str.length;i++)
			{
				if(str[i]=="-")
				{
					pos_minus.push(i);
				}
			}
			for(var i=0;i<pos_minus.length;i++)
			{
				if(pos_minus[i]=="0"&&pos_minus[i]!=(pos_minus[i+1]-1))
				{
					number.splice(0,0,"0");
					str="0"+str;
				}
				else if(pos_minus[i]=="0"&&pos_minus[i]==(pos_minus[i+1]-1))
				{
					number[0]="-"+number[0];
					number.splice(0,0,"0");
					str="0"+str;
				}
				else if(pos_minus[i]==(pos_minus[i+1]-1))
				{
					number[i+1]="-"+number[i+1];
				}
			}
		
//console.log(pos_minus);
//console.log(number);console.log(str);	
			for(var i=0;i<number.length;i++)
			{
				str=str.replace(number[i],"");
				
			}
			operator=str.split("");
	//console.log(str);		
			for(var i=0;i<operator.length;i++)
			{
				if(operator[i]=="l")
				{
					operator.splice(i,2,"lg")
				}
				
			}
			operalength=operator.length;

			for(var i=0;i<operalength;i++)
			{
				operatorstr=operator.join("");
				if(opera_muti_divi_priority(operator)==true)
				{
					
					if(operatorstr.indexOf("*")>=0&&operatorstr.indexOf("/")>=0)
					{
						if(operatorstr.indexOf("*")<operatorstr.indexOf("/"))
						{
							result=multiply("*",operator,number);

						}
						else
						{
							result=multiply("/",operator,number);
						}
					}
					else if(operatorstr.indexOf("*")>=0)
					{
						result=multiply("*",operator,number);

					}else if(operatorstr.indexOf("/")>=0)
					{
						result=multiply("/",operator,number);
					}
					else if(operatorstr.indexOf("%")>=0)
					{
						result=multiply("%",operator,number);
					}
					else if(operatorstr.indexOf("^")>=0)
					{
						result=multiply("^",operator,number);
					}
					else if(operatorstr.indexOf("√")>=0)
					{
						result=multiply("√",operator,number);
					}
					else if(operatorstr.indexOf("lg")>=0)
					{
						result=multiply("lg",operator,number);
					}
				}
				else
				{
					if(operatorstr.indexOf("+")>=0&&operatorstr.indexOf("-")>=0)
					{
						if(operatorstr.indexOf("+")<operatorstr.indexOf("-"))
						{
							result=multiply("+",operator,number);

						}
						else
						{
							result=multiply("-",operator,number);
						}
					}
					else if(operatorstr.indexOf("+")>=0)
					{
						result=multiply("+",operator,number);
					}
					else if(operatorstr.indexOf("-")>=0)
					{
						result=multiply("-",operator,number);
					}

				}
			}
		/*	if(result=="")
			{
				result=number;
			}*/
//console.log(result);
			return result;
		}

		//有乘除运算符优先进行
		function opera_muti_divi_priority(operator) {
			
			operatorstr=operator.join("");
			if(operatorstr.indexOf("*")>=0||operatorstr.indexOf("/")>=0||operatorstr.indexOf("%")>=0||operatorstr.indexOf("^")>=0||operatorstr.indexOf("√")>=0||operatorstr.indexOf("lg")>=0)
			{
				return true;
			}
			else
			{
				return false;
			}
			
		}
	
//键盘输入
	$(document).keypress(function(e) {//获取按下字符
		var e=e||event;
		var currKey=e.keyCode||e.which||e.charCode;

		curstr=$(".oper_str .result").text().trim();
		if(currKey==13||currKey==61)//确定键和等号键
		{
			$(".calc").click();
			
			newinput=0;
		}

		if((currKey==42||currKey==43)||currKey==45||currKey==47||currKey==37||currKey==94)//加减乘除等运算符键
		{
			if(isNaN(curstr[curstr.length-1])&&curstr[curstr.length-1]!="."&&curstr[curstr.length-1]!="("&&curstr[curstr.length-1]!=")")
			{
				if(curstr[curstr.length-1]=="d")
				{
					curstr=curstr.substring(0,curstr.length-3);
				}
				else if(curstr[curstr.length-1]=="g")
				{
					curstr=curstr.substring(0,curstr.length-3);
				}
				else
				{
					curstr=curstr.substring(0,curstr.length-1);
				}
			}
			
			curstr=curstr+String.fromCharCode(currKey); 
			
			$(".oper_str .result").text(curstr);
			newinput++;
		}
		
		if(currKey==40)//"("符号键
		{
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

			if(curstr[curstr.length-1]=="."||!isNaN(curstr[curstr.length-1])||curstr[curstr.length-1]==")")
			{
				return;
			}
			curstr=curstr+String.fromCharCode(currKey);
			$(".oper_str .result").text(curstr);
			newinput++;
			bracketjudge++;

		}
		
		if(currKey==41)//")"符号键
		{
			//console.log(curstr.match(/\(/g).length);
			if(bracketjudge>0)
			{
				if(isNaN(curstr[curstr.length-1])&&curstr[curstr.length-1]!=".")
				{
					curstr=curstr+curstr[curstr.length-4]+String.fromCharCode(currKey);
				}
				else
				{
					curstr=curstr+String.fromCharCode(currKey);
				}
				
				$(".oper_str .result").text(curstr);
				newinput++;
				
				bracketjudge--;
			}
				
			
		}
		
		if((currKey>=48&&currKey<=57)||currKey==46)//数字键和小数点键
		{
			num_point(curstr,currKey,newinput);
			newinput++;
		}
		
		if(currKey==76||currKey==108)//输入lg的首字母
		{
			$(".lg").click();
			newinput++;
		}
		
		if(currKey==77||currKey==109)//输入mod的首字母
		{
			$(".mod").click();
			newinput++;
		}
	});
	
	
	$(document).keydown(function(e) {//获取功能键
		var e=e||event;
		var currKey=e.keyCode||e.which||e.charCode;
		
		if(currKey==8)//退格键
		{
			$(".del").click();
		}
		if(currKey==27)//esc，全删
		{
			$(".clean").click();
		}
	});
});

/*
keypress
	enter=13
	(=40
	)=41
	*=42
	+=43
	
	-=45
1	.=46
	/=47
1	0~9=48~57
	
1	==61
	L=76
	M=77
	l=108
	m=109
	
	^=94
	%=37

keydown	
1	esc=27
1	backspace=8
*/
