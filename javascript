//BUDGET CONTROLLER(add new item to our data structure,calculate bugdet)
var budgetController=(function(){
	//expense and income function constructor so we can make as many objects of expenses as we want
	var Expense=function(id,description,value){
		this.id=id;
		this.description=description;
		this.value=value;
		this.percentage=-1;
	};
	var Income=function(id,description,value){
		this.id=id;
		this.description=description;
		this.value=value;
	};

	//function prototype of Expense object for calculate percentage of each expense
	Expense.prototype.calcPerc=function(totalIncome){
		if (totalIncome>0){
			this.percentage=Math.round((this.value/totalIncome)*100);
		}
		else{
			this.percentage=-1;
		}
	};

	//Expense object's prototype to get percenatge value
	Expense.prototype.getPer=function(){
		return this.percentage;
	};


	//calculate budget
	var calculateTotal=function(type){
		var sum=0;
		//calculate total income and expenses
		data.items[type].forEach(function(cur){
			sum+=cur.value;
		});
		data.total[type]=sum;
	};
	//for total income and expenses
	var data={
		//for each income entry and expense entery
		items:{
			exp:[],
			inc:[]
		},
		total:{
			exp:0,
			inc:0
		},
		budget:0,
		percentage:-1

	};

	return{
		addItem:function(type,des,val){
			var newItem,ID;
			//id=lastid + 1(lastid is detremined by the length of array)
			if (data.items[type].length>0)
				ID=data.items[type][data.items[type].length-1].id+1;
			else
				ID=0;
			//create new item based on inc or exp[ type]
			if (type=="inc"){
				newItem=new Income(ID,des,val);
			}else{
				newItem=new Expense(ID,des,val);
			}

			//push new item into our data structure
			data.items[type].push(newItem);
			//return the new item
			return newItem;
		},

		//delete item
		deleteItem:function(type,id){
			var ids,index;
			ids=data.items[type].map(function(current){
				return current.id;
			});
			//find index of items'id which is to be deleted
			index=ids.indexOf(id);

			//delete the item with index
			data.items[type].splice(index,1);
		},

		calculateBudget:function(){
			//total income and expenses
			calculateTotal('inc');
			calculateTotal('exp');
			//calculate total budget(income-expenses)
			data.budget=data.total.inc-data.total.exp;

			//calculate percentage
			if(data.total.inc>0){
				data.percentage=Math.round((data.total.exp/data.total.inc)*100);
			}
			else{
				data.percentage=-1;
			}
		},

		//to calculate expense percentage
		calculatePercentages:function(){
			data.items.exp.forEach(function(cur){
				cur.calcPerc(data.total.inc);
			});
		},


		//to return expenses percenatge
		getPercentages:function(){
			var allPercentages;
			allPercentages=data.items.exp.map(function(cur){
				return cur.getPer();
			});
			return allPercentages;
		},
		//fror return budget
		getBudget:function(){
			return{
				budget:data.budget,
				totalInc:data.total.inc,
				totalExp:data.total.exp,
				percentage:data.percentage
			};
		},

		testing:function(){
			console.log(data);
		}
	};


})();

//UI CONTROLLER(get input data,add new item,update ui)
var uiController=(function(){
	//object to store DOM strings so if we change class name in html file we just have to cahge it in this
	var DOMstrings={
		inputType:".add__type",
		inputDescription:".add__description",
		inputvalue:".add__value",
		inputButton:".add__btn",
		incomeContainer:".income__list",
		expensesContainer:".expenses__list",
		inputBudget:".budget__value",
		inputTotalInc:".budget__income--value",
		inputTotalExp:".budget__expenses--value",
		inputPercentage:".budget__expenses--percentage",
		container:".container",
		expensePerlabel:".item__percentage",
		dateLabel:".budget__title--month"
	};

	//formatting numbers
	var formatNumber=function(num,type){
		var int,dec,numSplit,sign;
		//add 2 decimal places
		//place comma after thousaands
		//add + for income and - for expenses
		num=Math.abs(num);
		num=num.toFixed(2);
		numSplit=num.split(".");
		int=numSplit[0];
		dec=numSplit[1];
		if(int.length>3){
			int=int.substr(0,int.length-3)+","+int.substr(int.length-3,int.length);
		}
		num=int+"."+dec;
		//add sign
		type==='exp'?sign="-":sign="+";
		return sign+" "+num;
	};

	var nodeListForEach=function(list,callback){
		for(var i=0; i<list.length;i++){
			callback(list[i],i);
		}
	};
	//function written in return because we want to use this in other module
	//GETTING INPUT DATA

	return{
		//return three values at onces so we are returning them as an object
		getInput:function(){
			return{
				type:document.querySelector(DOMstrings.inputType).value,
				description:document.querySelector(DOMstrings.inputDescription).value,
				value:parseFloat(document.querySelector(DOMstrings.inputvalue).value)
			};
		},

		//adding new item to UI
		addListitem:function(obj,value){
			var html,newHtml,element;
			//create html text with placeholder
			if (value==="inc"){
				element=DOMstrings.incomeContainer;
				html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}
			else if(value==="exp"){
				element=DOMstrings.expensesContainer;
				html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}
			//ceate html text with actual value(replace placeholder with actual data)
			newHtml=html.replace('%id%',obj.id);
			newHtml=newHtml.replace('%description%',obj.description);
			newHtml=newHtml.replace('%value%',formatNumber(obj.value,value));

			//adding newHtml into DOM
			document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
		},

		//to clear field

		clearFields:function(){
			//var fields,fieldArr;
			desc=document.querySelector(DOMstrings.inputDescription)
			desc.value="";
			document.querySelector(DOMstrings.inputvalue).value="";
			//fields=document.querySelectorAll(DOMstrings.inputDescription+','+DOMstrings.inputvalue);//return list
			//change list to array
			//fieldArr=Array.prototype.slice.call(fields);
			//set value of each field to ""
			//fieldArr.forEach(function(current,index,array){
				//current.value="";
			//});
			desc.focus();
		},

		//delete item from UI
		deleteItem:function(selectorID){
			//get item by its id
			var el=document.getElementById(selectorID);
			//removr elemrnt from its parent node
			el.parentNode.removeChild(el);
		},

		//to display budget to UI
		displayBudget:function(bud){
			var type;
			if (bud.budget>0){
				type='inc';
			}else{
				type='exp';
			}
			document.querySelector(DOMstrings.inputBudget).textContent=formatNumber(bud.budget,type);
			document.querySelector(DOMstrings.inputTotalInc).textContent=formatNumber(bud.totalInc,'inc');
			document.querySelector(DOMstrings.inputTotalExp).textContent=formatNumber(bud.totalExp,'exp');
			document.querySelector(DOMstrings.inputPercentage).textContent=bud.percentage+"%";

		},

		//to show expenses percentage in UI
		displayPercentage:function(percentages){
			var fields=document.querySelectorAll(DOMstrings.expensePerlabel);

			nodeListForEach(fields,function(current,index){
				if(percentages[index]>0){
					current.textContent=percentages[index]+"%";
				}else{
					current.textContent='---';
				}
		});
		},

		//to show the current month and year
		showMonth:function(){
			var now,month,year,months;
			months=['January','February','March','April','May','June','July','August','September','Octuber','November','December'];
			now=new Date();
			month=months[now.getMonth()];
			year=now.getFullYear();

			document.querySelector(DOMstrings.dateLabel).textContent=month+" "+year;

		},

		//to change the border color of inputs whwn change ivent triggers
		changedType:function(){
			var fields=document.querySelectorAll(
				DOMstrings.inputType+","+DOMstrings.inputvalue+","+DOMstrings.inputDescription);
			nodeListForEach(fields,function(cur){
				cur.classList.toggle('red-focus');
			});
			document.querySelector(DOMstrings.inputButton).classList.toggle('red');
		},

		getDOMstrings:function(){
			return DOMstrings;
		}

	};



})();


//CONTROLLER(EVENTS)
var controller=(function(budgetCtrl,uiCtrl){
	//function in which all event listeners are placed
	var setupEventListeners=function(){
		//get dom strings from ui controller
		var dom=uiCtrl.getDOMstrings();
		//add event listener when we click on add buttton
		document.querySelector(dom.inputButton).addEventListener("click",ctrlAddItem);

		//add event listener when a enter key is pressed
		document.addEventListener("keypress",function(e){
			if (e.keyCode===13||e.which===13){
				ctrlAddItem();
			}
		});

		//event for deletion of an item
		document.querySelector(dom.container).addEventListener("click",ctrlDeleteItem);
		//event for change event
		document.querySelector(dom.inputType).addEventListener('change',uiCtrl.changedType);
	};

	var updateBudget=function(){
		//1.CALCULATE BUDGET
		budgetCtrl.calculateBudget();

		//2.return the budget
		var budget=budgetCtrl.getBudget();
		console.log(budget);

		//3.display budget on UI
		uiCtrl.displayBudget(budget);
	};


	//function when we need to add a new item
	var ctrlAddItem=function(){
		var input,newItem;
		//1.GET INPUT DATA(from ui controler)

		input=uiCtrl.getInput();

		if(input.description!=="" && !isNaN(input.value) && input.value>0){
		//2.ADD ITEM TO BUDGET CONTROLLER

		newItem= budgetCtrl.addItem(input.type,input.description,input.value);
		//3.ADD NEW ITEM TO USER INTERFACE
		uiCtrl.addListitem(newItem,input.type);

		//4.CLEAR FIELDS
		uiCtrl.clearFields();

		//5.calculate and update budget
		updateBudget();
		}

		//6.update epenses percenatge
		updatePercentage();


	};

	//to delete an item
	var ctrlDeleteItem=function(event){
		var itemID,splitID,type,ID;
		itemID=event.target.parentNode.parentNode.parentNode.parentNode.id;
		if(itemID){
			splitID=itemID.split("-");
			type=splitID[0];
			ID=splitID[1];
		}
		//1.delete the item from data structure
		budgetCtrl.deleteItem(type,ID);

		//2.delete the item from the UI
		uiCtrl.deleteItem(itemID);
		//3.update and display updated budget
		updateBudget();
		//4.update expenses percentage
		updatePercentage();
	};

	//update expense percentages
	var updatePercentage=function(){
		var percentages;
		//1.calculate percentage in budget controller
		budgetCtrl.calculatePercentages();

		//2.read percentage from budget moduler
		percentages=budgetCtrl.getPercentages();
		console.log(percentages);
		//3.update percentages value in ui
		uiCtrl.displayPercentage(percentages);
	};
	//creating init function
	return{
		init:function(){
			console.log("application has staretd");
			uiCtrl.showMonth();
			uiCtrl.displayBudget({
				budget:0,
				totalInc:0,
				totalExp:0,
				percentage:"---"

			});
			setupEventListeners();
		}
	};

})(budgetController,uiController);

//calling init function
controller.init();
